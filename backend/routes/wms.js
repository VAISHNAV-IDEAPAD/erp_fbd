const express = require("express");
const router = express.Router();
const db = require("../config/database");

// ======================================================
// 1. BINS MANAGEMENT (BIN MASTER)
// ======================================================

// GET all bins
router.get("/bins", (req, res) => {
    const { warehouse, zone } = req.query;
    let sql = "SELECT * FROM WMSBins WHERE 1=1";
    const params = [];

    if (warehouse) {
        sql += " AND WarehouseName = ?";
        params.push(warehouse);
    }
    if (zone) {
        sql += " AND Zone = ?";
        params.push(zone);
    }
    sql += " ORDER BY Zone ASC, Rack ASC, Shelf ASC, BinCode ASC";

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, data: rows || [] });
    });
});

// POST new bin
router.post("/bins", (req, res) => {
    const {
        BinCode,
        WarehouseName = "RAW MATERIAL STORE 9B",
        Zone,
        Rack,
        Shelf,
        BinType = "Roll Bin",
        MaxCapacity = 500,
        CurrentQty = 0,
        UOM = "MTR",
        Status = "Available",
        Barcode,
        Remarks
    } = req.body;

    if (!BinCode || !Zone) {
        return res.status(400).json({ success: false, message: "BinCode and Zone are required" });
    }

    const autoBarcode = Barcode || `BAR-${BinCode.replace(/[^A-Za-z0-9]/g, "")}`;

    const sql = `
        INSERT INTO WMSBins (BinCode, WarehouseName, Zone, Rack, Shelf, BinType, MaxCapacity, CurrentQty, UOM, Status, Barcode, Remarks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [BinCode, WarehouseName, Zone, Rack || "Rack 01", Shelf || "Level 1", BinType, MaxCapacity, CurrentQty, UOM, Status, autoBarcode, Remarks || ""],
        function (err) {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }
            res.json({
                success: true,
                message: "Bin created successfully",
                data: { BinID: this.lastID, BinCode, autoBarcode }
            });
        }
    );
});

// PUT update bin
router.put("/bins/:id", (req, res) => {
    const { id } = req.params;
    const {
        BinCode,
        WarehouseName,
        Zone,
        Rack,
        Shelf,
        BinType,
        MaxCapacity,
        CurrentQty,
        UOM,
        Status,
        Remarks
    } = req.body;

    const sql = `
        UPDATE WMSBins
        SET BinCode = COALESCE(?, BinCode),
            WarehouseName = COALESCE(?, WarehouseName),
            Zone = COALESCE(?, Zone),
            Rack = COALESCE(?, Rack),
            Shelf = COALESCE(?, Shelf),
            BinType = COALESCE(?, BinType),
            MaxCapacity = COALESCE(?, MaxCapacity),
            CurrentQty = COALESCE(?, CurrentQty),
            UOM = COALESCE(?, UOM),
            Status = COALESCE(?, Status),
            Remarks = COALESCE(?, Remarks)
        WHERE BinID = ?
    `;

    db.run(
        sql,
        [BinCode, WarehouseName, Zone, Rack, Shelf, BinType, MaxCapacity, CurrentQty, UOM, Status, Remarks, id],
        function (err) {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }
            res.json({ success: true, message: "Bin updated successfully" });
        }
    );
});

// DELETE bin
router.delete("/bins/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM WMSBins WHERE BinID = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, message: "Bin deleted successfully" });
    });
});

// ======================================================
// 2. ROLL / SERIAL NUMBER GENERATION
// ======================================================

// GET rolls/serials
router.get("/roll-serials", (req, res) => {
    const { itemCode, binCode, status } = req.query;
    let sql = "SELECT * FROM WMSRollSerials WHERE 1=1";
    const params = [];

    if (itemCode) {
        sql += " AND ItemCode = ?";
        params.push(itemCode);
    }
    if (binCode) {
        sql += " AND BinCode = ?";
        params.push(binCode);
    }
    if (status) {
        sql += " AND Status = ?";
        params.push(status);
    }
    sql += " ORDER BY RollID DESC";

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: rows || [] });
    });
});

// POST batch generate roll/serial numbers
router.post("/roll-serials/generate", (req, res) => {
    const {
        ItemCode,
        ItemName,
        LotNo = "",
        Shade = "",
        StandardLength = 50,
        QuantityCount = 1,
        UOM = "MTR",
        Prefix = "RL-2627-",
        StartIndex = 100,
        RefDocNo = "",
        CreatedBy = "Store Incharge",
        CustomRolls = []
    } = req.body;

    if (!ItemCode || !ItemName) {
        return res.status(400).json({ success: false, message: "ItemCode and ItemName are required" });
    }

    const rollsToInsert = [];
    const dateStr = new Date().toISOString().split("T")[0];

    if (Array.isArray(CustomRolls) && CustomRolls.length > 0) {
        CustomRolls.forEach((r, idx) => {
            const rollNo = r.RollSerialNo || `${Prefix}${String(Number(StartIndex) + idx).padStart(4, "0")}`;
            rollsToInsert.push({
                rollNo,
                itemCode: ItemCode,
                itemName: ItemName,
                lotNo: r.LotNo || LotNo,
                shade: r.Shade || Shade,
                lengthQty: parseFloat(r.LengthQty || StandardLength) || 50,
                uom: r.UOM || UOM,
                binCode: r.BinCode || "",
                barcode: `BAR-${rollNo.replace(/[^A-Za-z0-9]/g, "")}`,
                status: "In Stock",
                refDocNo: RefDocNo,
                generatedDate: dateStr,
                createdBy: CreatedBy
            });
        });
    } else {
        const count = Math.min(Math.max(parseInt(QuantityCount, 10) || 1, 1), 200);
        for (let i = 0; i < count; i++) {
            const rollNo = `${Prefix}${String(Number(StartIndex) + i).padStart(4, "0")}`;
            rollsToInsert.push({
                rollNo,
                itemCode: ItemCode,
                itemName: ItemName,
                lotNo: LotNo,
                shade: Shade,
                lengthQty: parseFloat(StandardLength) || 50,
                uom: UOM,
                binCode: "",
                barcode: `BAR-${rollNo.replace(/[^A-Za-z0-9]/g, "")}`,
                status: "In Stock",
                refDocNo: RefDocNo,
                generatedDate: dateStr,
                createdBy: CreatedBy
            });
        }
    }

    const insertSql = `
        INSERT INTO WMSRollSerials (RollSerialNo, ItemCode, ItemName, LotNo, Shade, LengthQty, UOM, BinCode, Barcode, Status, RefDocNo, GeneratedDate, CreatedBy)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    rollsToInsert.forEach(item => {
        db.run(insertSql, [
            item.rollNo, item.itemCode, item.itemName, item.lotNo, item.shade,
            item.lengthQty, item.uom, item.binCode, item.barcode, item.status,
            item.refDocNo, item.generatedDate, item.createdBy
        ], () => {});
    });

    res.json({
        success: true,
        message: `Successfully generated ${rollsToInsert.length} rolls/serial numbers`,
        data: rollsToInsert
    });
});

// ======================================================
// 3. BIN ALLOCATIONS
// ======================================================

// GET allocations
router.get("/allocations", (req, res) => {
    db.all("SELECT * FROM WMSAllocations ORDER BY AllocationID DESC", [], (err, allocations) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        db.all("SELECT * FROM WMSAllocationItems", [], (err2, items) => {
            const itemsByAlloc = {};
            (items || []).forEach(it => {
                if (!itemsByAlloc[it.AllocationNo]) itemsByAlloc[it.AllocationNo] = [];
                itemsByAlloc[it.AllocationNo].push(it);
            });

            const merged = (allocations || []).map(a => ({
                ...a,
                items: itemsByAlloc[a.AllocationNo] || []
            }));

            res.json({ success: true, data: merged });
        });
    });
});

// POST new allocation
router.post("/allocations", (req, res) => {
    const {
        AllocationNo,
        AllocationDate = new Date().toISOString().split("T")[0],
        WarehouseName = "RAW MATERIAL STORE 9B",
        RefType = "Item Receipt (GRN)",
        RefDocNo = "",
        AllocatedBy = "Store Incharge",
        Remarks = "",
        items = []
    } = req.body;

    const allocNo = AllocationNo || `BA/9B/2627/${String(Date.now()).slice(-4)}`;
    const totalQty = items.reduce((sum, i) => sum + (parseFloat(i.AllocatedQty) || 0), 0);

    const allocSql = `
        INSERT INTO WMSAllocations (AllocationNo, AllocationDate, WarehouseName, RefType, RefDocNo, TotalQty, TotalItems, AllocatedBy, Status, Remarks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Completed', ?)
    `;

    db.run(allocSql, [allocNo, AllocationDate, WarehouseName, RefType, RefDocNo, totalQty, items.length, AllocatedBy, Remarks], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });

        const itemSql = `
            INSERT INTO WMSAllocationItems (AllocationNo, ItemCode, ItemName, RollSerialNo, BinCode, AllocatedQty, UOM, LotNo, Remarks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        items.forEach(it => {
            const qty = parseFloat(it.AllocatedQty) || 0;
            db.run(itemSql, [allocNo, it.ItemCode, it.ItemName, it.RollSerialNo || "", it.BinCode, qty, it.UOM, it.LotNo || "", it.Remarks || ""], () => {});

            // Update bin occupancy
            if (it.BinCode) {
                db.run(`
                    UPDATE WMSBins
                    SET CurrentQty = CurrentQty + ?,
                        Status = CASE WHEN CurrentQty + ? >= MaxCapacity THEN 'Full' ELSE 'Partially Filled' END
                    WHERE BinCode = ?
                `, [qty, qty, it.BinCode], () => {});
            }

            // Update roll location
            if (it.RollSerialNo) {
                db.run(`
                    UPDATE WMSRollSerials
                    SET BinCode = ?, Status = 'Allocated'
                    WHERE RollSerialNo = ?
                `, [it.BinCode, it.RollSerialNo], () => {});
            }
        });

        res.json({
            success: true,
            message: `Bin Allocation ${allocNo} saved successfully`,
            data: { AllocationNo: allocNo, TotalQty: totalQty }
        });
    });
});

// ======================================================
// 4. ISSUE FROM BIN
// ======================================================

// GET issues
router.get("/issues", (req, res) => {
    db.all("SELECT * FROM WMSBinIssues ORDER BY IssueID DESC", [], (err, issues) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        db.all("SELECT * FROM WMSBinIssueItems", [], (err2, items) => {
            const itemsByIssue = {};
            (items || []).forEach(it => {
                if (!itemsByIssue[it.IssueNo]) itemsByIssue[it.IssueNo] = [];
                itemsByIssue[it.IssueNo].push(it);
            });

            const merged = (issues || []).map(iss => ({
                ...iss,
                items: itemsByIssue[iss.IssueNo] || []
            }));

            res.json({ success: true, data: merged });
        });
    });
});

// POST new bin issue
router.post("/issues", (req, res) => {
    const {
        IssueNo,
        IssueDate = new Date().toISOString().split("T")[0],
        WarehouseName = "RAW MATERIAL STORE 9B",
        IssueReason = "Cutting Slip",
        RefDocNo = "",
        IssuedToDepartment = "Cutting Floor Line 1",
        IssuedBy = "Store Incharge",
        Remarks = "",
        items = []
    } = req.body;

    const issNo = IssueNo || `BI/9B/2627/${String(Date.now()).slice(-4)}`;
    const totalQty = items.reduce((sum, i) => sum + (parseFloat(i.PickQty) || 0), 0);

    const issueSql = `
        INSERT INTO WMSBinIssues (IssueNo, IssueDate, WarehouseName, IssueReason, RefDocNo, IssuedToDepartment, TotalQty, TotalRows, IssuedBy, Status, Remarks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Completed', ?)
    `;

    db.run(issueSql, [issNo, IssueDate, WarehouseName, IssueReason, RefDocNo, IssuedToDepartment, totalQty, items.length, IssuedBy, Remarks], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });

        const itemSql = `
            INSERT INTO WMSBinIssueItems (IssueNo, ItemCode, ItemName, BinCode, RollSerialNo, PickQty, UOM, Remarks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        items.forEach(it => {
            const qty = parseFloat(it.PickQty) || 0;
            db.run(itemSql, [issNo, it.ItemCode, it.ItemName, it.BinCode, it.RollSerialNo || "", qty, it.UOM, it.Remarks || ""], () => {});

            // Deduct bin occupancy
            if (it.BinCode) {
                db.run(`
                    UPDATE WMSBins
                    SET CurrentQty = MAX(0, CurrentQty - ?),
                        Status = CASE WHEN CurrentQty - ? <= 0 THEN 'Available' ELSE 'Partially Filled' END
                    WHERE BinCode = ?
                `, [qty, qty, it.BinCode], () => {});
            }

            // Update roll status to Issued
            if (it.RollSerialNo) {
                db.run(`
                    UPDATE WMSRollSerials
                    SET Status = 'Issued'
                    WHERE RollSerialNo = ?
                `, [it.RollSerialNo], () => {});
            }
        });

        res.json({
            success: true,
            message: `Issue from Bin ${issNo} completed successfully`,
            data: { IssueNo: issNo, TotalQty: totalQty }
        });
    });
});

// ======================================================
// 5. WMS STOCK IMPORT
// ======================================================

router.post("/import", (req, res) => {
    const {
        WarehouseName = "RAW MATERIAL STORE 9B",
        ImportType = "Bin Opening Balance",
        FileName = "StockImport.csv",
        ImportedBy = "Store Incharge",
        records = []
    } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
        return res.status(400).json({ success: false, message: "No stock records supplied to import" });
    }

    const dateStr = new Date().toISOString().split("T")[0];
    let validCount = 0;

    records.forEach(r => {
        const binCode = (r.BinCode || "").trim();
        const itemCode = (r.ItemCode || "").trim();
        const itemName = (r.ItemName || "").trim();
        const qty = parseFloat(r.Qty || r.CurrentQty || 0);
        const rollNo = (r.RollSerialNo || r.RollNo || "").trim();

        if (binCode && itemCode) {
            validCount++;
            // Upsert or update bin
            db.run(`
                INSERT INTO WMSBins (BinCode, WarehouseName, Zone, Rack, Shelf, BinType, MaxCapacity, CurrentQty, UOM, Status)
                VALUES (?, ?, 'Zone B - Imported', 'Rack 01', 'Level 1', 'Roll Bin', 1000, ?, ?, 'Partially Filled')
                ON CONFLICT(BinCode) DO UPDATE SET CurrentQty = CurrentQty + ?
            `, [binCode, WarehouseName, qty, r.UOM || "MTR", qty], () => {});

            if (rollNo) {
                db.run(`
                    INSERT INTO WMSRollSerials (RollSerialNo, ItemCode, ItemName, LotNo, LengthQty, UOM, BinCode, Status, GeneratedDate)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'Allocated', ?)
                    ON CONFLICT(RollSerialNo) DO UPDATE SET BinCode = ?, LengthQty = ?
                `, [rollNo, itemCode, itemName || itemCode, r.LotNo || "IMPORT", qty, r.UOM || "MTR", binCode, dateStr, binCode, qty], () => {});
            }
        }
    });

    db.run(
        "INSERT INTO WMSImports (ImportDate, WarehouseName, ImportType, FileName, TotalRows, ValidRows, Status, ImportedBy) VALUES (?, ?, ?, ?, ?, ?, 'Success', ?)",
        [dateStr, WarehouseName, ImportType, FileName, records.length, validCount, ImportedBy],
        () => {}
    );

    res.json({
        success: true,
        message: `Successfully imported ${validCount} of ${records.length} items into WMS Stock`,
        data: { totalRows: records.length, validRows: validCount }
    });
});

// ======================================================
// 6. BARCODE / QR SCANNER QUICK LOOKUP
// ======================================================

router.get("/lookup/:query", (req, res) => {
    const rawQuery = (req.params.query || "").trim();
    if (!rawQuery) {
        return res.status(400).json({ success: false, message: "Query string is required" });
    }

    // Try finding bin
    db.get("SELECT * FROM WMSBins WHERE BinCode LIKE ? OR Barcode LIKE ?", [`%${rawQuery}%`, `%${rawQuery}%`], (err, bin) => {
        if (!err && bin) {
            return res.json({
                success: true,
                type: "bin",
                data: bin
            });
        }

        // Try finding roll/serial
        db.get("SELECT * FROM WMSRollSerials WHERE RollSerialNo LIKE ? OR Barcode LIKE ?", [`%${rawQuery}%`, `%${rawQuery}%`], (err2, roll) => {
            if (!err2 && roll) {
                return res.json({
                    success: true,
                    type: "roll",
                    data: roll
                });
            }

            // Try finding allocation
            db.get("SELECT * FROM WMSAllocations WHERE AllocationNo LIKE ?", [`%${rawQuery}%`], (err3, alloc) => {
                if (!err3 && alloc) {
                    return res.json({
                        success: true,
                        type: "allocation",
                        data: alloc
                    });
                }

                // Try finding item
                db.get("SELECT * FROM Items WHERE ItemCode LIKE ? OR ItemName LIKE ?", [`%${rawQuery}%`, `%${rawQuery}%`], (err4, item) => {
                    if (!err4 && item) {
                        return res.json({
                            success: true,
                            type: "item",
                            data: item
                        });
                    }

                    res.status(404).json({
                        success: false,
                        message: `No WMS records found matching '${rawQuery}'`
                    });
                });
            });
        });
    });
});

module.exports = router;
