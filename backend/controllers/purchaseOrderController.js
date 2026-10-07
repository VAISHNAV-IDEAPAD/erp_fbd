const db = require("../config/database");

// ======================================================
// Helper: Generate next sequential PO Number
// ======================================================
const generateNextPONumber = () => {
    return new Promise((resolve, reject) => {
        const year = new Date().getFullYear();
        const sql = `
            SELECT MAX(POID) AS maxId,
                   MAX(CAST(SUBSTR(COALESCE(PONo, ''), 9) AS INTEGER)) as maxSeq
            FROM PurchaseOrders
            WHERE PONo LIKE 'PO-${year}-%'
        `;
        db.get(sql, [], (err, row) => {
            if (err) return reject(err);
            const currentSeq = (row && (row.maxSeq || row.maxId)) ? Number(row.maxSeq || row.maxId) : 0;
            const nextSeq = currentSeq + 1;
            const poNo = `PO-${year}-${String(nextSeq).padStart(4, "0")}`;
            resolve(poNo);
        });
    });
};

// ======================================================
// Get Next PO Number (Preview)
// ======================================================
exports.getNextPONumber = async (req, res) => {
    try {
        const nextPONo = await generateNextPONumber();
        res.json({ success: true, nextPONo });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ======================================================
// Get Pending Indent Items (Linked with Indent)
// Used by "Display" and "Display & Edit Row"
// ======================================================
exports.getPendingIndentItems = (req, res) => {
    const {
        indentNos,
        itemGroup,
        item,
        colour,
        supplier,
        supplierId,
        department,
        indentType,
        materialSource,
        itemType
    } = req.query;

    let sql = `
        SELECT
            i.IndentID,
            i.IndentNo,
            i.IndentDate,
            COALESCE(i.RequiredDate, '') AS MatReqDate,
            COALESCE(i.RequiredDate, '') AS ExFTYDate,
            COALESCE(d.DepartmentName, 'Main Unit') AS ProfitCenter,
            id.DetailID AS IndentDetailID,
            id.ItemID,
            COALESCE(itm.ItemCode, '') AS ItemCode,
            COALESCE(itm.ItemName, 'Raw Material') AS ItemName,
            COALESCE(itm.Category, itm.ItemType, 'FABRIC') AS [Group],
            COALESCE(itm.Color, '') AS Color,
            COALESCE(itm.Size, 'Standard') AS SizeRange,
            COALESCE(itm.Rate, 0) AS Rate,
            COALESCE(itm.Rate, 0) AS CostPrice,
            id.Qty AS IndentQty,
            COALESCE(id.OrderedQty, 0) AS OrderedQty,
            MAX(0, id.Qty - COALESCE(id.OrderedQty, 0)) AS BalIndentQty,
            COALESCE(s.SupplierID, itm.SupplierID, 1) AS SupplierID,
            COALESCE(s.SupplierName, 'Standard Supplier') AS SupplierName,
            itm.MaterialType,
            itm.ItemType,
            i.Remarks AS IndentRemarks
        FROM IndentDetails id
        JOIN Indents i ON i.IndentID = id.IndentID
        LEFT JOIN Items itm ON itm.ItemID = id.ItemID
        LEFT JOIN Departments d ON d.DepartmentID = i.DepartmentID
        LEFT JOIN Suppliers s ON s.SupplierID = itm.SupplierID
        WHERE (id.Qty - COALESCE(id.OrderedQty, 0)) > 0
    `;

    const params = [];

    // Filter by Indent Nos
    if (indentNos) {
        const nos = String(indentNos).split(",").map(s => s.trim()).filter(Boolean);
        if (nos.length > 0) {
            const placeholders = nos.map(() => "?").join(",");
            sql += ` AND i.IndentNo IN (${placeholders})`;
            params.push(...nos);
        }
    }

    // Filter by Item Group
    if (itemGroup) {
        const groups = String(itemGroup).split(",").map(s => s.trim()).filter(Boolean);
        if (groups.length > 0) {
            const placeholders = groups.map(() => "?").join(",");
            sql += ` AND (itm.Category IN (${placeholders}) OR itm.ItemType IN (${placeholders}))`;
            params.push(...groups, ...groups);
        }
    }

    // Filter by Item Name / Code
    if (item) {
        const items = String(item).split(",").map(s => s.trim()).filter(Boolean);
        if (items.length > 0) {
            const placeholders = items.map(() => "?").join(",");
            sql += ` AND (itm.ItemName IN (${placeholders}) OR itm.ItemCode IN (${placeholders}))`;
            params.push(...items, ...items);
        }
    }

    // Filter by Colour
    if (colour) {
        const colours = String(colour).split(",").map(s => s.trim()).filter(Boolean);
        if (colours.length > 0) {
            const placeholders = colours.map(() => "?").join(",");
            sql += ` AND itm.Color IN (${placeholders})`;
            params.push(...colours);
        }
    }

    // Filter by Supplier
    if (supplierId) {
        sql += ` AND (s.SupplierID = ? OR itm.SupplierID = ?)`;
        params.push(supplierId, supplierId);
    } else if (supplier) {
        sql += ` AND (s.SupplierName LIKE ? OR s.SupplierCode LIKE ?)`;
        params.push(`%${supplier}%`, `%${supplier}%`);
    }

    // Filter by Department / Profit Center
    if (department) {
        sql += ` AND (d.DepartmentName LIKE ? OR d.DepartmentCode LIKE ?)`;
        params.push(`%${department}%`, `%${department}%`);
    }

    // Filter by Item Classification: Leather vs Non-Leather
    if (itemType === "Leather") {
        sql += ` AND (LOWER(itm.Category) LIKE '%leather%' OR LOWER(itm.ItemType) LIKE '%leather%' OR LOWER(itm.ItemName) LIKE '%leather%')`;
    } else if (itemType === "Non-Leather") {
        sql += ` AND NOT (LOWER(itm.Category) LIKE '%leather%' OR LOWER(itm.ItemType) LIKE '%leather%' OR LOWER(itm.ItemName) LIKE '%leather%')`;
    }

    // Filter by Material Source
    if (materialSource && materialSource !== "All") {
        if (materialSource === "Domestic") {
            sql += ` AND (itm.MaterialType IS NULL OR itm.MaterialType = 'Domestic' OR itm.MaterialType != 'Import')`;
        } else if (materialSource === "Import") {
            sql += ` AND itm.MaterialType = 'Import'`;
        }
    }

    sql += ` ORDER BY i.IndentID DESC, id.DetailID ASC`;

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error("❌ getPendingIndentItems error:", err);
            return res.status(500).json({ success: false, error: err.message });
        }

        res.json({
            success: true,
            count: rows ? rows.length : 0,
            data: rows || []
        });
    });
};

// ======================================================
// Get All Purchase Orders
// ======================================================
exports.getAllPurchaseOrders = (req, res) => {
    const sql = `
        SELECT
            po.POID,
            COALESCE(po.PONo, 'PO-' || po.POID) AS PONo,
            po.PODate,
            po.PurchaseType,
            po.ReleaseOption,
            po.SupplierID,
            po.DeliveryDate,
            po.QuoteNo,
            po.QuoteDate,
            po.FreightCharges,
            po.OtherCharges,
            po.SubTotal,
            po.TotalAmount,
            po.GSTAmount,
            po.CGSTAmount,
            po.SGSTAmount,
            po.IGSTAmount,
            po.NetAmount,
            po.Status,
            po.Remarks,
            po.PaymentTerms,
            po.DeliveryTerms,
            po.ShipToAddress,
            po.InternalMemo,
            po.TermsConditions,
            po.EnteredBy,
            po.CustomerOrderNo,
            po.CreatedAt,
            s.SupplierName,
            s.SupplierCode,
            (SELECT COUNT(*) FROM PurchaseOrderDetails pod WHERE pod.POID = po.POID) AS TotalItems,
            (SELECT GROUP_CONCAT(DISTINCT pod.IndentNo) FROM PurchaseOrderDetails pod WHERE pod.POID = po.POID) AS LinkedIndents
        FROM PurchaseOrders po
        LEFT JOIN Suppliers s ON po.SupplierID = s.SupplierID
        ORDER BY po.POID DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("❌ getAllPurchaseOrders error:", err);
            return res.status(500).json({ success: false, error: err.message });
        }

        res.json({
            success: true,
            count: rows ? rows.length : 0,
            data: rows || []
        });
    });
};

// ======================================================
// Get Purchase Order By ID
// ======================================================
exports.getPurchaseOrderById = (req, res) => {
    const poId = req.params.id;

    const headerSql = `
        SELECT
            po.POID,
            COALESCE(po.PONo, 'PO-' || po.POID) AS PONo,
            po.PODate,
            po.PurchaseType,
            po.ReleaseOption,
            po.SupplierID,
            po.DeliveryDate,
            po.QuoteNo,
            po.QuoteDate,
            po.FreightCharges,
            po.OtherCharges,
            po.SubTotal,
            po.TotalAmount,
            po.GSTAmount,
            po.CGSTAmount,
            po.SGSTAmount,
            po.IGSTAmount,
            po.NetAmount,
            po.Status,
            po.Remarks,
            po.PaymentTerms,
            po.DeliveryTerms,
            po.ShipToAddress,
            po.InternalMemo,
            po.TermsConditions,
            po.Attachments,
            po.EnteredBy,
            po.CustomerOrderNo,
            po.CreatedAt,
            s.SupplierName,
            s.SupplierCode,
            s.GSTNo AS SupplierGST,
            s.Phone AS SupplierPhone,
            s.Email AS SupplierEmail,
            s.Address AS SupplierAddress
        FROM PurchaseOrders po
        LEFT JOIN Suppliers s ON po.SupplierID = s.SupplierID
        WHERE po.POID = ?
    `;

    db.get(headerSql, [poId], (err, header) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        if (!header) {
            return res.status(404).json({ success: false, message: "Purchase Order not found" });
        }

        const itemsSql = `
            SELECT
                pod.PODetailID,
                pod.POID,
                pod.IndentID,
                pod.IndentDetailID,
                pod.IndentNo,
                pod.ProfitCenter,
                pod.ItemID,
                pod.Color,
                pod.SizeRange,
                pod.CostPrice,
                pod.BalIndentQty,
                pod.Quantity,
                pod.Quantity AS OrderQty,
                pod.Rate,
                pod.Amount,
                pod.ExFTYDate,
                pod.MatReqDate,
                COALESCE(pod.ReceivedQty, 0) AS ReceivedQty,
                COALESCE(pod.PendingQty, pod.Quantity) AS PendingQty,
                i.ItemCode,
                i.ItemName,
                COALESCE(i.Category, i.ItemType) AS [Group],
                i.UOM,
                s.SupplierName
            FROM PurchaseOrderDetails pod
            LEFT JOIN Items i ON i.ItemID = pod.ItemID
            LEFT JOIN Suppliers s ON s.SupplierID = pod.SupplierID
            WHERE pod.POID = ?
            ORDER BY pod.PODetailID ASC
        `;

        db.all(itemsSql, [poId], (err2, items) => {
            if (err2) {
                return res.status(500).json({ success: false, error: err2.message });
            }

            let parsedCharges = [];
            if (header.OtherCharges) {
                try {
                    parsedCharges = typeof header.OtherCharges === "string"
                        ? JSON.parse(header.OtherCharges)
                        : header.OtherCharges;
                } catch (e) {
                    parsedCharges = [];
                }
            }

            res.json({
                success: true,
                data: {
                    ...header,
                    OtherCharges: parsedCharges,
                    items: items || []
                }
            });
        });
    });
};

// ======================================================
// Get Purchase Order Details (for table view/reports)
// ======================================================
exports.getPurchaseOrderDetails = (req, res) => {
    const poId = req.params.id;
    const sql = `
        SELECT
            pod.*,
            i.ItemCode,
            i.ItemName,
            i.UOM
        FROM PurchaseOrderDetails pod
        LEFT JOIN Items i ON i.ItemID = pod.ItemID
        WHERE pod.POID = ?
        ORDER BY pod.PODetailID ASC
    `;

    db.all(sql, [poId], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, data: rows });
    });
};

// ======================================================
// Add / Save Purchase Order
// Links line items to Indents & updates Indent balances
// ======================================================
exports.addPurchaseOrder = async (req, res) => {
    const {
        purchaseType,
        releaseOption,
        supplierId,
        quoteNo,
        quoteDate,
        freightCharges = 0,
        otherCharges = [],
        subTotal = 0,
        totalAmount = 0,
        gstAmount = 0,
        cgstAmount = 0,
        sgstAmount = 0,
        igstAmount = 0,
        netAmount = 0,
        remarks,
        paymentTerms,
        deliveryTerms,
        shipToAddress,
        internalMemo,
        termsConditions,
        attachments = [],
        enteredBy,
        customerOrderNo,
        items = []
    } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Cannot create Purchase Order without items."
        });
    }

    try {
        const todayStr = new Date().toISOString().slice(0, 10);
        const otherChargesJson = JSON.stringify(otherCharges || []);
        const attachmentsJson = JSON.stringify(attachments || []);

        const createSinglePO = (targetSupplierId, poItems, poSubTotal, poGst, poNet, poCharges) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const poNumber = await generateNextPONumber();

                    const insertSql = `
                        INSERT INTO PurchaseOrders (
                            PONo,
                            PODate,
                            PurchaseType,
                            ReleaseOption,
                            SupplierID,
                            QuoteNo,
                            QuoteDate,
                            FreightCharges,
                            OtherCharges,
                            SubTotal,
                            TotalAmount,
                            GSTAmount,
                            CGSTAmount,
                            SGSTAmount,
                            IGSTAmount,
                            NetAmount,
                            Status,
                            Remarks,
                            PaymentTerms,
                            DeliveryTerms,
                            ShipToAddress,
                            InternalMemo,
                            TermsConditions,
                            Attachments,
                            EnteredBy,
                            CustomerOrderNo
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;

                    const params = [
                        poNumber,
                        todayStr,
                        purchaseType || "Domestic",
                        releaseOption || "1. One PO per supplier",
                        targetSupplierId || null,
                        quoteNo || "",
                        quoteDate || "",
                        Number(freightCharges) || 0,
                        otherChargesJson,
                        Number(poSubTotal) || 0,
                        Number(poSubTotal) || 0,
                        Number(poGst) || 0,
                        Number(cgstAmount) || 0,
                        Number(sgstAmount) || 0,
                        Number(igstAmount) || 0,
                        Number(poNet) || 0,
                        "Open",
                        remarks || "",
                        paymentTerms || "",
                        deliveryTerms || "",
                        shipToAddress || "",
                        internalMemo || "",
                        termsConditions || "",
                        attachmentsJson,
                        enteredBy || "",
                        customerOrderNo || ""
                    ];

                    db.run(insertSql, params, function (poErr) {
                        if (poErr) return reject(poErr);

                        const poId = this.lastID;
                        const detailInsertSql = `
                            INSERT INTO PurchaseOrderDetails (
                                POID,
                                IndentID,
                                IndentDetailID,
                                IndentNo,
                                ProfitCenter,
                                ItemID,
                                Color,
                                SizeRange,
                                CostPrice,
                                BalIndentQty,
                                Quantity,
                                Rate,
                                Amount,
                                ExFTYDate,
                                MatReqDate,
                                SupplierID
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `;

                        let completedCount = 0;
                        if (poItems.length === 0) {
                            return resolve({ poId, poNumber });
                        }

                        poItems.forEach(item => {
                            const orderQty = Number(item.orderQty || item.Quantity || 0);
                            const rate = Number(item.rate || item.Rate || 0);
                            const itemAmt = Number(item.amount || (orderQty * rate));

                            const detailParams = [
                                poId,
                                item.indentId || item.IndentID || null,
                                item.indentDetailId || item.IndentDetailID || null,
                                item.indentNo || item.IndentNo || "",
                                item.profitCenter || item.ProfitCenter || "",
                                item.itemId || item.ItemID,
                                item.color || item.Color || "",
                                item.sizeRange || item.SizeRange || "",
                                Number(item.costPrice || item.CostPrice || 0),
                                Number(item.balIndentQty || item.BalIndentQty || 0),
                                orderQty,
                                rate,
                                itemAmt,
                                item.exFTYDate || item.ExFTYDate || "",
                                item.matReqDate || item.MatReqDate || "",
                                item.supplierId || item.SupplierID || targetSupplierId || null
                            ];

                            db.run(detailInsertSql, detailParams, function (detailErr) {
                                if (detailErr) {
                                    console.error("❌ Detail insert error:", detailErr);
                                }

                                const indentDetailId = item.indentDetailId || item.IndentDetailID;
                                if (indentDetailId && orderQty > 0) {
                                    db.run(
                                        `UPDATE IndentDetails
                                         SET OrderedQty = COALESCE(OrderedQty, 0) + ?
                                         WHERE DetailID = ?`,
                                        [orderQty, indentDetailId],
                                        () => {
                                            const indentId = item.indentId || item.IndentID;
                                            if (indentId) {
                                                db.get(
                                                    `SELECT SUM(Qty) as totalQty, SUM(COALESCE(OrderedQty, 0)) as totalOrdered
                                                     FROM IndentDetails
                                                     WHERE IndentID = ?`,
                                                    [indentId],
                                                    (e, statusRow) => {
                                                        if (statusRow) {
                                                            const isFull = statusRow.totalOrdered >= statusRow.totalQty;
                                                            const newStatus = isFull ? "Converted to PO" : "Partially Ordered";
                                                            db.run(
                                                                `UPDATE Indents SET Status = ? WHERE IndentID = ?`,
                                                                [newStatus, indentId]
                                                            );
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    );
                                }

                                completedCount++;
                                if (completedCount === poItems.length) {
                                    resolve({ poId, poNumber });
                                }
                            });
                        });
                    });
                } catch (e) {
                    reject(e);
                }
            });
        };

        if (releaseOption === "1. One PO per supplier" || !releaseOption) {
            const supplierGroups = {};
            items.forEach(it => {
                const sId = it.supplierId || it.SupplierID || supplierId || 1;
                if (!supplierGroups[sId]) supplierGroups[sId] = [];
                supplierGroups[sId].push(it);
            });

            const supplierKeys = Object.keys(supplierGroups);
            const createdPOs = [];

            for (const sId of supplierKeys) {
                const groupItems = supplierGroups[sId];
                let groupSubTotal = 0;
                groupItems.forEach(it => {
                    const q = Number(it.orderQty || it.Quantity || 0);
                    const r = Number(it.rate || it.Rate || 0);
                    groupSubTotal += q * r;
                });
                const groupGst = groupSubTotal * 0.18;
                const groupNet = groupSubTotal + groupGst + Number(freightCharges || 0);

                const result = await createSinglePO(
                    sId,
                    groupItems,
                    groupSubTotal,
                    groupGst,
                    groupNet,
                    otherCharges
                );
                createdPOs.push(result);
            }

            res.json({
                success: true,
                message: `Created ${createdPOs.length} Purchase Order(s) successfully`,
                poNumbers: createdPOs.map(p => p.poNumber),
                poIds: createdPOs.map(p => p.poId),
                firstPoId: createdPOs[0]?.poId,
                firstPoNo: createdPOs[0]?.poNumber
            });
        } else {
            const result = await createSinglePO(
                supplierId || (items[0] && (items[0].supplierId || items[0].SupplierID)) || 1,
                items,
                subTotal,
                gstAmount,
                netAmount,
                otherCharges
            );

            res.json({
                success: true,
                message: `Created Purchase Order ${result.poNumber} successfully`,
                poNumbers: [result.poNumber],
                poIds: [result.poId],
                firstPoId: result.poId,
                firstPoNo: result.poNumber
            });
        }
    } catch (err) {
        console.error("❌ addPurchaseOrder error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// ======================================================
// Update Purchase Order
// ======================================================
exports.updatePurchaseOrder = (req, res) => {
    const poId = req.params.id;
    const {
        remarks,
        paymentTerms,
        deliveryTerms,
        shipToAddress,
        internalMemo,
        status,
        freightCharges,
        quoteNo,
        quoteDate
    } = req.body;

    const sql = `
        UPDATE PurchaseOrders
        SET
            Remarks = COALESCE(?, Remarks),
            PaymentTerms = COALESCE(?, PaymentTerms),
            DeliveryTerms = COALESCE(?, DeliveryTerms),
            ShipToAddress = COALESCE(?, ShipToAddress),
            InternalMemo = COALESCE(?, InternalMemo),
            Status = COALESCE(?, Status),
            FreightCharges = COALESCE(?, FreightCharges),
            QuoteNo = COALESCE(?, QuoteNo),
            QuoteDate = COALESCE(?, QuoteDate)
        WHERE POID = ?
    `;

    db.run(
        sql,
        [
            remarks,
            paymentTerms,
            deliveryTerms,
            shipToAddress,
            internalMemo,
            status,
            freightCharges,
            quoteNo,
            quoteDate,
            poId
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ success: false, error: err.message });
            }
            res.json({
                success: true,
                message: "Purchase Order updated successfully"
            });
        }
    );
};

// ======================================================
// Delete Purchase Order
// ======================================================
exports.deletePurchaseOrder = (req, res) => {
    const poId = req.params.id;

    db.all(
        `SELECT IndentDetailID, Quantity FROM PurchaseOrderDetails WHERE POID = ?`,
        [poId],
        (err, details) => {
            if (!err && details && details.length > 0) {
                details.forEach(d => {
                    if (d.IndentDetailID && d.Quantity) {
                        db.run(
                            `UPDATE IndentDetails
                             SET OrderedQty = MAX(0, COALESCE(OrderedQty, 0) - ?)
                             WHERE DetailID = ?`,
                            [d.Quantity, d.IndentDetailID]
                        );
                    }
                });
            }

            db.run(`DELETE FROM PurchaseOrders WHERE POID = ?`, [poId], function (delErr) {
                if (delErr) {
                    return res.status(500).json({ success: false, error: delErr.message });
                }
                res.json({
                    success: true,
                    message: "Purchase Order deleted successfully"
                });
            });
        }
    );
};

// ======================================================
// Update Status
// ======================================================
exports.updateStatus = (req, res) => {
    const poId = req.params.id;
    const { status, remarks } = req.body;
    db.run(
        `UPDATE PurchaseOrders SET Status = COALESCE(?, Status), ApproveTag = COALESCE(?, ApproveTag), Remarks = COALESCE(?, Remarks) WHERE POID = ?`,
        [status, status, remarks, poId],
        function (err) {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, message: `Status updated to ${status}` });
        }
    );
};

// ======================================================
// Bulk Action
// ======================================================
exports.bulkAction = (req, res) => {
    const { action, poIds } = req.body;
    if (!Array.isArray(poIds) || poIds.length === 0) {
        return res.status(400).json({ success: false, message: "No PO IDs provided" });
    }
    const placeholders = poIds.map(() => "?").join(",");
    if (action === "Approve") {
        db.run(`UPDATE PurchaseOrders SET Status = 'Approved', ApproveTag = 'APPROVED' WHERE POID IN (${placeholders})`, poIds, function (err) {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, message: `Approved ${this.changes} Purchase Orders` });
        });
    } else if (action === "Cancel") {
        db.run(`UPDATE PurchaseOrders SET Status = 'Cancelled', ApproveTag = 'CANCELLED' WHERE POID IN (${placeholders})`, poIds, function (err) {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, message: `Cancelled ${this.changes} Purchase Orders` });
        });
    } else {
        res.json({ success: true, message: `Action ${action} processed` });
    }
};