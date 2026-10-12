const db = require("../config/database");

// ======================================================
// INITIAL SAMPLE SEED DATA MATCHING SCREENSHOT
// ======================================================
const SEED_FLOOR_RETURNS = [
    {
        FRMNo: "FR/AAPL9B/2627/153",
        ReturnDate: "12-10-2026",
        UpdatedBy: "",
        UpdatedOn: "",
        SupplierName: "",
        Stores: "SEMI FINISH STORE 18",
        Currency: "INR",
        ExchangeRate: 1.0,
        Remark: "",
        InternalMemo: "",
        TotalQty: 93.0,
        RowCount: 1,
        details: [
            { ItemCode: "SFS-101", ItemName: "Semi Finish Upper Panels", Quantity: 93.0, UOM: "PCS", Remarks: "Excess from batch 18" }
        ]
    },
    {
        FRMNo: "FR/AAPL9B/2627/152",
        ReturnDate: "12-10-2026",
        UpdatedBy: "",
        UpdatedOn: "",
        SupplierName: "",
        Stores: "SEMI FINISH STORE 9B",
        Currency: "INR",
        ExchangeRate: 1.0,
        Remark: "",
        InternalMemo: "",
        TotalQty: 160.0,
        RowCount: 1,
        details: [
            { ItemCode: "SFS-102", ItemName: "Cut Lining Pieces", Quantity: 160.0, UOM: "PCS", Remarks: "Floor Return Line 2" }
        ]
    },
    {
        FRMNo: "FR/AAPL9B/2627/151",
        ReturnDate: "12-10-2026",
        UpdatedBy: "Nikhil Singh",
        UpdatedOn: "Oct 12 2026 11:21AM",
        SupplierName: "",
        Stores: "SEMI FINISH STORE 9B",
        Currency: "INR",
        ExchangeRate: 1.0,
        Remark: "",
        InternalMemo: "",
        TotalQty: 639.0,
        RowCount: 2,
        details: [
            { ItemCode: "SFS-105", ItemName: "Reinforcement Strips 25mm", Quantity: 400.0, UOM: "MTR", Remarks: "Batch return" },
            { ItemCode: "SFS-106", ItemName: "Padded Tongue Inserts", Quantity: 239.0, UOM: "PCS", Remarks: "Surplus" }
        ]
    },
    {
        FRMNo: "FR/AAPL9B/2627/150",
        ReturnDate: "10-10-2026",
        UpdatedBy: "",
        UpdatedOn: "",
        SupplierName: "",
        Stores: "RAW MATERIAL STORE 9B",
        Currency: "INR",
        ExchangeRate: 1.0,
        Remark: "MT-21983",
        InternalMemo: "",
        TotalQty: 31.5,
        RowCount: 1,
        details: [
            { ItemCode: "LTH-1093", ItemName: "COW CULATTAS SINGLE LEATHER", Quantity: 31.5, UOM: "SQFT", Remarks: "MT-21983 return" }
        ]
    },
    {
        FRMNo: "FR/AAPL9B/2627/149",
        ReturnDate: "10-10-2026",
        UpdatedBy: "",
        UpdatedOn: "",
        SupplierName: "",
        Stores: "RAW MATERIAL STORE 9B",
        Currency: "INR",
        ExchangeRate: 1.0,
        Remark: "MT-21983",
        InternalMemo: "",
        TotalQty: 93.5,
        RowCount: 1,
        details: [
            { ItemCode: "LTH-1112", ItemName: "COW ECO VEG SIDE CRUST LEATHER", Quantity: 93.5, UOM: "SQFT", Remarks: "MT-21983 return" }
        ]
    },
    {
        FRMNo: "FR/AAPL9B/2627/148",
        ReturnDate: "10-10-2026",
        UpdatedBy: "",
        UpdatedOn: "",
        SupplierName: "",
        Stores: "RAW MATERIAL STORE 9B",
        Currency: "INR",
        ExchangeRate: 1.0,
        Remark: "MT-21983",
        InternalMemo: "",
        TotalQty: 596.5,
        RowCount: 1,
        details: [
            { ItemCode: "RNF-1085", ItemName: "HIGH DENSITY TOPLINER 0.4MM", Quantity: 596.5, UOM: "MTR", Remarks: "MT-21983 return" }
        ]
    },
    {
        FRMNo: "FR/AAPL9B/2627/147",
        ReturnDate: "10-10-2026",
        UpdatedBy: "",
        UpdatedOn: "",
        SupplierName: "",
        Stores: "RAW MATERIAL STORE 9B",
        Currency: "INR",
        ExchangeRate: 1.0,
        Remark: "",
        InternalMemo: "",
        TotalQty: 63.7,
        RowCount: 1,
        details: [
            { ItemCode: "LTH-1263", ItemName: "COW PLOSE SUEDE LEATHER", Quantity: 63.7, UOM: "SQFT", Remarks: "Floor leftover" }
        ]
    },
    {
        FRMNo: "FR/AAPL9B/2627/146",
        ReturnDate: "10-10-2026",
        UpdatedBy: "",
        UpdatedOn: "",
        SupplierName: "",
        Stores: "RAW MATERIAL STORE 9B",
        Currency: "INR",
        ExchangeRate: 1.0,
        Remark: "",
        InternalMemo: "",
        TotalQty: 33.6,
        RowCount: 1,
        details: [
            { ItemCode: "NONWO5064", ItemName: "TALIN 0.3MM WHITE", Quantity: 33.6, UOM: "MTR", Remarks: "Cutting floor return" }
        ]
    },
    {
        FRMNo: "FR/AAPL9B/2627/145",
        ReturnDate: "10-10-2026",
        UpdatedBy: "",
        UpdatedOn: "",
        SupplierName: "",
        Stores: "RAW MATERIAL STORE 9B",
        Currency: "INR",
        ExchangeRate: 1.0,
        Remark: "",
        InternalMemo: "",
        TotalQty: 480.0,
        RowCount: 1,
        details: [
            { ItemCode: "HDW-2236", ItemName: "JAM RIVET SINGLE HEAD 7MM", Quantity: 480.0, UOM: "SET", Remarks: "Assembly line excess" }
        ]
    },
    {
        FRMNo: "FR/AAPL9B/2627/144",
        ReturnDate: "08-10-2026",
        UpdatedBy: "Nikhil Singh",
        UpdatedOn: "Oct 08 2026 03:15PM",
        SupplierName: "",
        Stores: "RAW MATERIAL STORE 9B",
        Currency: "INR",
        ExchangeRate: 1.0,
        Remark: "MT-21980",
        InternalMemo: "",
        TotalQty: 125.0,
        RowCount: 1,
        details: [
            { ItemCode: "PKG-2200", ItemName: "CARD PAPER 350G 31X43 INCH", Quantity: 125.0, UOM: "SHEET", Remarks: "Packing return" }
        ]
    },
    {
        FRMNo: "FR/AAPL9B/2627/143",
        ReturnDate: "06-10-2026",
        UpdatedBy: "",
        UpdatedOn: "",
        SupplierName: "",
        Stores: "SEMI FINISH STORE 18",
        Currency: "INR",
        ExchangeRate: 1.0,
        Remark: "",
        InternalMemo: "",
        TotalQty: 210.0,
        RowCount: 1,
        details: [
            { ItemCode: "SFS-108", ItemName: "Stitched Gusset Pieces", Quantity: 210.0, UOM: "PCS", Remarks: "Return from stitching unit" }
        ]
    }
];

// Seed function
function seedInitialDataIfEmpty() {
    db.get("SELECT COUNT(*) as count FROM FloorReturns", [], (err, row) => {
        if (!err && row && row.count === 0) {
            console.log("🌱 Seeding FloorReturns with screenshot records...");
            db.serialize(() => {
                db.run("BEGIN TRANSACTION");
                const insertFR = db.prepare(`
                    INSERT INTO FloorReturns (
                        FRMNo, ReturnDate, UpdatedBy, UpdatedOn, SupplierName, Stores,
                        Currency, ExchangeRate, Remark, InternalMemo, TotalQty, RowCount, Status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                const insertDetail = db.prepare(`
                    INSERT INTO FloorReturnDetails (
                        ReturnID, ItemCode, ItemName, Quantity, UOM, Remarks
                    ) VALUES (?, ?, ?, ?, ?, ?)
                `);

                SEED_FLOOR_RETURNS.forEach(item => {
                    insertFR.run(
                        item.FRMNo,
                        item.ReturnDate,
                        item.UpdatedBy,
                        item.UpdatedOn,
                        item.SupplierName,
                        item.Stores,
                        item.Currency,
                        item.ExchangeRate,
                        item.Remark,
                        item.InternalMemo,
                        item.TotalQty,
                        item.RowCount,
                        "Completed",
                        function (e) {
                            if (!e && this.lastID && item.details) {
                                item.details.forEach(d => {
                                    insertDetail.run(this.lastID, d.ItemCode, d.ItemName, d.Quantity, d.UOM, d.Remarks);
                                });
                            }
                        }
                    );
                });

                db.run("COMMIT", () => {
                    insertFR.finalize();
                    insertDetail.finalize();
                    console.log("✓ FloorReturns seeded successfully");
                });
            });
        }
    });
}

// Ensure seed data is ready after table creation
setTimeout(seedInitialDataIfEmpty, 500);

// ======================================================
// CONTROLLER HANDLERS
// ======================================================

// GET /api/floor-returns
exports.getAllFloorReturns = (req, res) => {
    const { store, search, fromDate, toDate } = req.query;
    let sql = "SELECT * FROM FloorReturns WHERE 1=1";
    const params = [];

    if (store && store !== "All") {
        sql += " AND Stores = ?";
        params.push(store);
    }

    if (search) {
        sql += " AND (FRMNo LIKE ? OR SupplierName LIKE ? OR Remark LIKE ? OR InternalMemo LIKE ?)";
        const term = `%${search}%`;
        params.push(term, term, term, term);
    }

    sql += " ORDER BY ReturnID DESC";

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message, data: SEED_FLOOR_RETURNS });
        }
        res.json({
            success: true,
            count: rows.length,
            data: rows.length > 0 ? rows : SEED_FLOOR_RETURNS
        });
    });
};

// GET /api/floor-returns/:id
exports.getFloorReturnById = (req, res) => {
    const id = req.params.id;

    db.get("SELECT * FROM FloorReturns WHERE ReturnID = ? OR FRMNo = ?", [id, id], (err, record) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (!record) return res.status(404).json({ success: false, message: "Floor return not found" });

        db.all("SELECT * FROM FloorReturnDetails WHERE ReturnID = ?", [record.ReturnID], (err2, details) => {
            if (err2) return res.status(500).json({ success: false, error: err2.message });
            res.json({
                success: true,
                data: {
                    ...record,
                    details: details || []
                }
            });
        });
    });
};

// POST /api/floor-returns
exports.createFloorReturn = (req, res) => {
    const {
        FRMNo,
        ReturnDate,
        UpdatedBy,
        SupplierID,
        SupplierName,
        Stores,
        Currency = "INR",
        ExchangeRate = 1.0,
        Remark,
        InternalMemo,
        details = []
    } = req.body;

    const finalFRMNo = FRMNo || `FR/AAPL9B/2627/${Math.floor(Date.now() % 1000 + 150)}`;
    const finalDate = ReturnDate || new Date().toISOString().split("T")[0];
    const totalQty = details.reduce((sum, d) => sum + Number(d.Quantity || 0), 0);
    const rowCount = Math.max(details.length, 1);
    const updatedOn = new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

    const sql = `
        INSERT INTO FloorReturns (
            FRMNo, ReturnDate, UpdatedBy, UpdatedOn, SupplierID, SupplierName,
            Stores, Currency, ExchangeRate, Remark, InternalMemo, TotalQty, RowCount, Status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Completed')
    `;

    db.run(
        sql,
        [
            finalFRMNo,
            finalDate,
            UpdatedBy || "Nikhil Singh",
            updatedOn,
            SupplierID || null,
            SupplierName || "",
            Stores || "RAW MATERIAL STORE 9B",
            Currency,
            Number(ExchangeRate) || 1.0,
            Remark || "",
            InternalMemo || "",
            totalQty,
            rowCount
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ success: false, error: err.message });
            }

            const newId = this.lastID;

            if (details.length > 0) {
                const insertDetail = db.prepare(`
                    INSERT INTO FloorReturnDetails (
                        ReturnID, ItemCode, ItemName, Color, Quantity, UOM, Remarks
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                `);

                details.forEach(d => {
                    insertDetail.run(
                        newId,
                        d.ItemCode || "",
                        d.ItemName || "",
                        d.Color || "",
                        Number(d.Quantity || 0),
                        d.UOM || "PCS",
                        d.Remarks || ""
                    );
                });

                insertDetail.finalize();
            }

            res.status(201).json({
                success: true,
                message: "Floor return created successfully",
                data: {
                    ReturnID: newId,
                    FRMNo: finalFRMNo,
                    ReturnDate: finalDate,
                    Stores,
                    TotalQty: totalQty,
                    RowCount: rowCount
                }
            });
        }
    );
};

// PUT /api/floor-returns/:id
exports.updateFloorReturn = (req, res) => {
    const id = req.params.id;
    const {
        Stores,
        Remark,
        InternalMemo,
        UpdatedBy
    } = req.body;

    const updatedOn = new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

    const sql = `
        UPDATE FloorReturns
        SET Stores = COALESCE(?, Stores),
            Remark = COALESCE(?, Remark),
            InternalMemo = COALESCE(?, InternalMemo),
            UpdatedBy = COALESCE(?, UpdatedBy),
            UpdatedOn = ?
        WHERE ReturnID = ?
    `;

    db.run(sql, [Stores, Remark, InternalMemo, UpdatedBy, updatedOn, id], function (err) {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, message: "Floor return updated successfully" });
    });
};

// DELETE /api/floor-returns/:id
exports.deleteFloorReturn = (req, res) => {
    const id = req.params.id;

    db.run("DELETE FROM FloorReturns WHERE ReturnID = ?", [id], function (err) {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, message: "Floor return deleted successfully" });
    });
};
