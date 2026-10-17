const db = require("../config/database");

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
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({
            success: true,
            count: rows.length,
            data: rows
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
