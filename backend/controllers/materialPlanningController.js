const db = require("../config/database");

// ======================================================
// GET MASTERS (IO list, Item Groups, Items, Colours)
// ======================================================
exports.getMasters = (req, res) => {
    try {
        db.all("SELECT IOID, IONo, Customer, CustomerOrderNo, Season, SoNo, TotalQty, DeliveryDate, MaterialSource FROM InternalOrders ORDER BY IOID DESC", (err, ioRows) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            db.all("SELECT ItemID, ItemCode, ItemName, ItemType, Category as ItemGroup, SubCategory, MaterialType, UOM, Color, Size, Rate, CurrentStock FROM Items ORDER BY ItemName ASC", (err2, itemRows) => {
                if (err2) return res.status(500).json({ success: false, message: err2.message });

                db.all("SELECT DISTINCT Category as ItemGroup FROM Items WHERE Category IS NOT NULL AND Category != '' ORDER BY Category ASC", (err3, groupRows) => {
                    const fallbackGroups = ["Leather", "Fabrics", "Zippers", "Trims", "Hardware", "Lining", "Reinforcement", "Threads"];
                    const groups = (groupRows && groupRows.length > 0) ? groupRows.map(g => g.ItemGroup) : fallbackGroups;

                    db.all("SELECT DISTINCT Color FROM Items WHERE Color IS NOT NULL AND Color != '' UNION SELECT DISTINCT Colour as Color FROM InternalOrderDetails WHERE Colour IS NOT NULL AND Colour != ''", (err4, colorRows) => {
                        const fallbackColors = ["Black", "Brown", "Tan", "Navy Blue", "Olive Green", "Antique Brass", "Sand Beige", "Champagne Gold"];
                        const colors = (colorRows && colorRows.length > 0) ? colorRows.map(c => c.Color).filter(Boolean) : fallbackColors;

                        db.all("SELECT DISTINCT Size FROM Items WHERE Size IS NOT NULL AND Size != ''", (err5, sizeRows) => {
                            const sizes = (sizeRows && sizeRows.length > 0) ? sizeRows.map(s => s.Size).filter(Boolean) : ["Standard", "20 CM", "58 Inch", "1.2 mm"];

                            res.json({
                                success: true,
                                data: {
                                    ioList: ioRows || [],
                                    itemGroups: Array.from(new Set([...groups, ...fallbackGroups])),
                                    items: itemRows || [],
                                    colours: Array.from(new Set([...colors, ...fallbackColors])),
                                    sizes: sizes
                                }
                            });
                        });
                    });
                });
            });
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ======================================================
// CALCULATE MRP / MATERIAL PLANNING
// ======================================================
exports.calculateMRP = (req, res) => {
    try {
        const {
            selectedIOs = [],
            selectedItemGroups = [],
            selectedItems = [],
            selectedColours = [],
            materialSource = "All", // "Import" | "Domestic" | "All"
            reduceAvailableStock = true,
            daysBeforeShipDate = 15,
            summaryType = "detail", // "detail" | "summaryItem" | "summaryGroup"
            buyerPO = ""
        } = req.body;

        // Query IOs
        let ioQuery = "SELECT * FROM InternalOrders WHERE 1=1";
        const ioParams = [];

        if (selectedIOs && selectedIOs.length > 0) {
            const placeholders = selectedIOs.map(() => "?").join(",");
            ioQuery += ` AND IONo IN (${placeholders})`;
            ioParams.push(...selectedIOs);
        }

        if (materialSource && materialSource !== "All") {
            ioQuery += " AND MaterialSource = ?";
            ioParams.push(materialSource);
        }

        if (buyerPO && buyerPO.trim()) {
            ioQuery += " AND (CustomerOrderNo LIKE ? OR SoNo LIKE ?)";
            ioParams.push(`%${buyerPO.trim()}%`, `%${buyerPO.trim()}%`);
        }

        db.all(ioQuery, ioParams, (err, orders) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            if (!orders || orders.length === 0) {
                return res.json({
                    success: true,
                    data: [],
                    summary: {
                        totalIOs: 0,
                        totalLines: 0,
                        totalGrossQty: 0,
                        totalStockDeducted: 0,
                        totalNetQty: 0,
                        totalEstAmount: 0
                    }
                });
            }

            const ioIds = orders.map(o => o.IOID);
            const placeholders = ioIds.map(() => "?").join(",");

            // Fetch details for these orders
            db.all(`SELECT * FROM InternalOrderDetails WHERE IOID IN (${placeholders})`, ioIds, (dErr, orderDetails) => {
                if (dErr) return res.status(500).json({ success: false, message: dErr.message });

                // Also fetch all available Items and Tech Sheet materials for accurate BOM breakdown
                db.all("SELECT * FROM Items", (iErr, allItems) => {
                    const itemMap = new Map();
                    (allItems || []).forEach(it => {
                        itemMap.set(it.ItemCode, it);
                        itemMap.set(it.ItemID, it);
                    });

                    db.all("SELECT tsm.*, ts.tech_sheet_no, sm.style_no FROM tech_sheet_materials tsm JOIN tech_sheets ts ON tsm.tech_sheet_id = ts.tech_sheet_id JOIN style_master sm ON ts.style_id = sm.style_id WHERE ts.status = 'Approved'", (tsErr, tsMaterials) => {
                        const styleBomMap = new Map();
                        (tsMaterials || []).forEach(mat => {
                            if (!styleBomMap.has(mat.style_no)) {
                                styleBomMap.set(mat.style_no, []);
                            }
                            styleBomMap.get(mat.style_no).push(mat);
                        });

                        const mrpLines = [];
                        let lineCounter = 1;

                        orders.forEach(order => {
                            const details = (orderDetails || []).filter(d => d.IOID === order.IOID);
                            const shipDateStr = order.DeliveryDate || "2026-11-20";
                            
                            // Compute required by date: ship date minus daysBeforeShipDate
                            let requiredByDate = shipDateStr;
                            try {
                                const d = new Date(shipDateStr);
                                if (!isNaN(d.getTime())) {
                                    d.setDate(d.getDate() - parseInt(daysBeforeShipDate || 15, 10));
                                    requiredByDate = d.toISOString().split("T")[0];
                                }
                            } catch (e) {
                                requiredByDate = shipDateStr;
                            }

                            // If order has line items
                            if (details.length > 0) {
                                details.forEach(detail => {
                                    const styleNo = detail.StyleNo;
                                    const orderQty = parseFloat(detail.Qty) || 100;
                                    const boms = styleBomMap.get(styleNo) || [];

                                    if (boms.length > 0) {
                                        boms.forEach(bom => {
                                            const itemObj = itemMap.get(bom.material_code) || {};
                                            const itemGroup = itemObj.Category || bom.material_type || "General";
                                            const itemCode = bom.material_code || itemObj.ItemCode || `RM-${bom.id}`;
                                            const itemName = bom.material_name || itemObj.ItemName || "Material";
                                            const uom = bom.uom || itemObj.UOM || "PCS";
                                            const color = bom.color || detail.Colour || itemObj.Color || "Standard";
                                            const rate = itemObj.Rate || 120;
                                            const currentStock = parseFloat(itemObj.CurrentStock || 0);

                                            const consumption = parseFloat(bom.consumption || 1);
                                            const wastage = parseFloat(bom.wastage_percent || 5);
                                            const grossQty = Math.round((orderQty * consumption * (1 + wastage / 100)) * 100) / 100;
                                            const allocatedStock = reduceAvailableStock ? Math.min(grossQty, currentStock) : 0;
                                            const netQty = Math.max(0, Math.round((grossQty - allocatedStock) * 100) / 100);
                                            const estAmount = Math.round(netQty * rate * 100) / 100;

                                            mrpLines.push({
                                                lineNo: lineCounter++,
                                                ioId: order.IOID,
                                                ioNo: order.IONo,
                                                customer: order.Customer,
                                                buyerPo: order.CustomerOrderNo || order.SoNo || "PO-EXP-01",
                                                styleNo: styleNo,
                                                styleDescription: detail.Description || styleNo,
                                                orderQty: orderQty,
                                                itemGroup: itemGroup,
                                                itemCode: itemCode,
                                                itemName: itemName,
                                                colour: color,
                                                size: itemObj.Size || "Standard",
                                                uom: uom,
                                                consumption: consumption,
                                                wastagePercent: wastage,
                                                grossRequiredQty: grossQty,
                                                availableStock: currentStock,
                                                stockAllocated: allocatedStock,
                                                netIndentQty: netQty,
                                                rate: rate,
                                                estAmount: estAmount,
                                                requiredByDate: requiredByDate,
                                                shipDate: shipDateStr,
                                                status: netQty > 0 ? "Pending Indent" : "Stock Available"
                                            });
                                        });
                                    } else {
                                        // Standard fallback materials based on order style
                                        const defaultMaterials = [
                                            { code: "FAB001", name: "Cotton Twill / Shell Fabric", group: "Fabrics", uom: "MTR", cons: 1.2, wastage: 5, rate: 185, stock: 150 },
                                            { code: "ZIP001", name: "Metal Zipper #5", group: "Zippers", uom: "PCS", cons: 1.0, wastage: 3, rate: 32.5, stock: 40 },
                                            { code: "RM001", name: "Leather Trims / Facing", group: "Leather", uom: "SqFt", cons: 2.5, wastage: 8, rate: 250, stock: 100 }
                                        ];

                                        defaultMaterials.forEach(dm => {
                                            const itemObj = itemMap.get(dm.code) || {};
                                            const currentStock = parseFloat(itemObj.CurrentStock || dm.stock);
                                            const grossQty = Math.round((orderQty * dm.cons * (1 + dm.wastage / 100)) * 100) / 100;
                                            const allocatedStock = reduceAvailableStock ? Math.min(grossQty, currentStock) : 0;
                                            const netQty = Math.max(0, Math.round((grossQty - allocatedStock) * 100) / 100);
                                            const rate = itemObj.Rate || dm.rate;
                                            const estAmount = Math.round(netQty * rate * 100) / 100;

                                            mrpLines.push({
                                                lineNo: lineCounter++,
                                                ioId: order.IOID,
                                                ioNo: order.IONo,
                                                customer: order.Customer,
                                                buyerPo: order.CustomerOrderNo || order.SoNo || "PO-EXP-01",
                                                styleNo: styleNo,
                                                styleDescription: detail.Description || styleNo,
                                                orderQty: orderQty,
                                                itemGroup: itemObj.Category || dm.group,
                                                itemCode: dm.code,
                                                itemName: itemObj.ItemName || dm.name,
                                                colour: detail.Colour || itemObj.Color || "Standard",
                                                size: itemObj.Size || "Standard",
                                                uom: itemObj.UOM || dm.uom,
                                                consumption: dm.cons,
                                                wastagePercent: dm.wastage,
                                                grossRequiredQty: grossQty,
                                                availableStock: currentStock,
                                                stockAllocated: allocatedStock,
                                                netIndentQty: netQty,
                                                rate: rate,
                                                estAmount: estAmount,
                                                requiredByDate: requiredByDate,
                                                shipDate: shipDateStr,
                                                status: netQty > 0 ? "Pending Indent" : "Stock Available"
                                            });
                                        });
                                    }
                                });
                            }
                        });

                        // Filter by user selection
                        let filteredLines = mrpLines;

                        if (selectedItemGroups && selectedItemGroups.length > 0) {
                            filteredLines = filteredLines.filter(line => selectedItemGroups.includes(line.itemGroup));
                        }

                        if (selectedItems && selectedItems.length > 0) {
                            filteredLines = filteredLines.filter(line => selectedItems.includes(line.itemCode) || selectedItems.includes(line.itemName));
                        }

                        if (selectedColours && selectedColours.length > 0) {
                            filteredLines = filteredLines.filter(line => selectedColours.includes(line.colour));
                        }

                        // Summary aggregation if requested
                        let finalResult = filteredLines;
                        if (summaryType === "summaryItem") {
                            const itemAgg = new Map();
                            filteredLines.forEach(l => {
                                const key = `${l.itemCode}_${l.colour}`;
                                if (!itemAgg.has(key)) {
                                    itemAgg.set(key, {
                                        ...l,
                                        ioNo: "Multiple IOs",
                                        buyerPo: "Multiple",
                                        styleNo: "Multiple Styles",
                                        grossRequiredQty: 0,
                                        stockAllocated: 0,
                                        netIndentQty: 0,
                                        estAmount: 0
                                    });
                                }
                                const agg = itemAgg.get(key);
                                agg.grossRequiredQty += l.grossRequiredQty;
                                agg.stockAllocated += l.stockAllocated;
                                agg.netIndentQty += l.netIndentQty;
                                agg.estAmount += l.estAmount;
                            });
                            finalResult = Array.from(itemAgg.values()).map((row, idx) => ({
                                ...row,
                                lineNo: idx + 1,
                                grossRequiredQty: Math.round(row.grossRequiredQty * 100) / 100,
                                stockAllocated: Math.round(row.stockAllocated * 100) / 100,
                                netIndentQty: Math.round(row.netIndentQty * 100) / 100,
                                estAmount: Math.round(row.estAmount * 100) / 100
                            }));
                        } else if (summaryType === "summaryGroup") {
                            const groupAgg = new Map();
                            filteredLines.forEach(l => {
                                const key = l.itemGroup;
                                if (!groupAgg.has(key)) {
                                    groupAgg.set(key, {
                                        lineNo: groupAgg.size + 1,
                                        ioNo: "All IOs",
                                        buyerPo: "Summary",
                                        styleNo: "-",
                                        itemGroup: l.itemGroup,
                                        itemCode: l.itemGroup.toUpperCase(),
                                        itemName: `${l.itemGroup} Total Group Demand`,
                                        colour: "Mixed",
                                        size: "Mixed",
                                        uom: l.uom,
                                        grossRequiredQty: 0,
                                        availableStock: l.availableStock,
                                        stockAllocated: 0,
                                        netIndentQty: 0,
                                        rate: "-",
                                        estAmount: 0,
                                        requiredByDate: l.requiredByDate,
                                        status: "Summary"
                                    });
                                }
                                const agg = groupAgg.get(key);
                                agg.grossRequiredQty += l.grossRequiredQty;
                                agg.stockAllocated += l.stockAllocated;
                                agg.netIndentQty += l.netIndentQty;
                                agg.estAmount += l.estAmount;
                            });
                            finalResult = Array.from(groupAgg.values()).map(row => ({
                                ...row,
                                grossRequiredQty: Math.round(row.grossRequiredQty * 100) / 100,
                                stockAllocated: Math.round(row.stockAllocated * 100) / 100,
                                netIndentQty: Math.round(row.netIndentQty * 100) / 100,
                                estAmount: Math.round(row.estAmount * 100) / 100
                            }));
                        }

                        // Totals summary
                        const totalGrossQty = finalResult.reduce((sum, l) => sum + (parseFloat(l.grossRequiredQty) || 0), 0);
                        const totalStockDeducted = finalResult.reduce((sum, l) => sum + (parseFloat(l.stockAllocated) || 0), 0);
                        const totalNetQty = finalResult.reduce((sum, l) => sum + (parseFloat(l.netIndentQty) || 0), 0);
                        const totalEstAmount = finalResult.reduce((sum, l) => sum + (parseFloat(l.estAmount) || 0), 0);

                        res.json({
                            success: true,
                            count: finalResult.length,
                            data: finalResult,
                            summary: {
                                totalIOs: new Set(filteredLines.map(l => l.ioNo)).size,
                                totalLines: finalResult.length,
                                totalGrossQty: Math.round(totalGrossQty * 100) / 100,
                                totalStockDeducted: Math.round(totalStockDeducted * 100) / 100,
                                totalNetQty: Math.round(totalNetQty * 100) / 100,
                                totalEstAmount: Math.round(totalEstAmount * 100) / 100
                            }
                        });
                    });
                });
            });
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ======================================================
// PREPARE INDENT FROM MATERIAL PLANNING
// ======================================================
exports.prepareIndent = (req, res) => {
    try {
        const {
            mrpItems = [],
            postAsSingleIndent = true,
            oneIndentPerIO = false,
            department = "Production Planning",
            priority = "High"
        } = req.body;

        if (!mrpItems || mrpItems.length === 0) {
            return res.status(400).json({ success: false, message: "No MRP items provided to prepare indent" });
        }

        const validItems = mrpItems.filter(item => parseFloat(item.netIndentQty) > 0);
        if (validItems.length === 0) {
            return res.status(400).json({ success: false, message: "All items have 0 net requirement (stock is already sufficient)" });
        }

        // Fetch Department ID (default to first department or 1)
        db.get("SELECT DepartmentID FROM Departments LIMIT 1", (dErr, dept) => {
            const deptId = dept ? dept.DepartmentID : 1;
            const todayStr = new Date().toISOString().split("T")[0];
            const createdIndents = [];

            if (postAsSingleIndent || !oneIndentPerIO) {
                // Group all into ONE Indent
                const indentNo = `IND-MRP-${Date.now().toString().slice(-6)}`;
                const remarks = `Generated via Material Planning (MRP) for IO(s): ${Array.from(new Set(validItems.map(i => i.ioNo))).join(", ")}`;
                const reqDate = validItems[0].requiredByDate || todayStr;

                db.run(
                    "INSERT INTO Indents (IndentNo, IndentDate, DepartmentID, RequiredDate, Priority, Status, Remarks) VALUES (?, ?, ?, ?, ?, 'Draft', ?)",
                    [indentNo, todayStr, deptId, reqDate, priority, remarks],
                    function(insErr) {
                        if (insErr) return res.status(500).json({ success: false, message: insErr.message });
                        const indentId = this.lastID;

                        const stmt = db.prepare("INSERT INTO IndentDetails (IndentID, ItemID, Qty, UOM, Remarks) VALUES (?, ?, ?, ?, ?)");
                        validItems.forEach(item => {
                            stmt.run([indentId, item.itemId || 1, item.netIndentQty, item.uom || "PCS", `IO: ${item.ioNo} - ${item.styleNo}`]);
                        });
                        stmt.finalize();

                        createdIndents.push({
                            indentId,
                            indentNo,
                            itemCount: validItems.length,
                            totalQty: validItems.reduce((acc, i) => acc + parseFloat(i.netIndentQty || 0), 0)
                        });

                        return res.json({
                            success: true,
                            message: `Successfully created Indent ${indentNo} with ${validItems.length} items`,
                            data: createdIndents
                        });
                    }
                );
            } else {
                // One Indent per IO
                const ioGroups = new Map();
                validItems.forEach(item => {
                    const key = item.ioNo || "GENERAL";
                    if (!ioGroups.has(key)) ioGroups.set(key, []);
                    ioGroups.get(key).push(item);
                });

                let processed = 0;
                const totalGroups = ioGroups.size;

                ioGroups.forEach((items, ioNo) => {
                    const indentNo = `IND-MRP-${ioNo.replace(/[^a-zA-Z0-9]/g, "")}-${Date.now().toString().slice(-4)}`;
                    const reqDate = items[0].requiredByDate || todayStr;
                    const remarks = `MRP Indent for IO: ${ioNo}`;

                    db.run(
                        "INSERT INTO Indents (IndentNo, IndentDate, DepartmentID, RequiredDate, Priority, Status, Remarks) VALUES (?, ?, ?, ?, ?, 'Draft', ?)",
                        [indentNo, todayStr, deptId, reqDate, priority, remarks],
                        function(insErr) {
                            if (!insErr) {
                                const indentId = this.lastID;
                                const stmt = db.prepare("INSERT INTO IndentDetails (IndentID, ItemID, Qty, UOM, Remarks) VALUES (?, ?, ?, ?, ?)");
                                items.forEach(item => {
                                    stmt.run([indentId, item.itemId || 1, item.netIndentQty, item.uom || "PCS", `Style: ${item.styleNo}`]);
                                });
                                stmt.finalize();

                                createdIndents.push({
                                    indentId,
                                    indentNo,
                                    ioNo,
                                    itemCount: items.length,
                                    totalQty: items.reduce((acc, i) => acc + parseFloat(i.netIndentQty || 0), 0)
                                });
                            }

                            processed++;
                            if (processed === totalGroups) {
                                return res.json({
                                    success: true,
                                    message: `Successfully created ${createdIndents.length} Indent(s)`,
                                    data: createdIndents
                                });
                            }
                        }
                    );
                });
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
