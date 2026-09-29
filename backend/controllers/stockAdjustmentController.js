const db = require("../config/database");

// =========================
// Get All Adjustments
// =========================
exports.getAllAdjustments = (req, res) => {

    const sql = `
        SELECT *
        FROM StockAdjustments
        ORDER BY AdjustmentID DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json({
            success: true,
            count: rows.length,
            data: rows
        });

    });

};

// =========================
// Get Adjustment By ID
// =========================
exports.getAdjustmentById = (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT
            sad.DetailID,
            sad.AdjustmentID,
            sad.ItemID,
            i.ItemCode,
            i.ItemName,
            sad.SystemQty,
            sad.PhysicalQty,
            sad.DifferenceQty
        FROM StockAdjustmentDetails sad
        JOIN Items i
            ON sad.ItemID = i.ItemID
        WHERE sad.AdjustmentID = ?
    `;

    db.all(sql, [id], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json({
            success: true,
            data: rows
        });

    });

};

// =========================
// Create Adjustment
// =========================
exports.createAdjustment = (req, res) => {

    const {
        AdjustmentNo,
        AdjustmentDate,
        Remarks,
        items
    } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Items are required"
        });
    }

    const sql = `
        INSERT INTO StockAdjustments
        (
            AdjustmentNo,
            AdjustmentDate,
            Remarks
        )
        VALUES (?,?,?)
    `;

    db.run(
        sql,
        [
            AdjustmentNo,
            AdjustmentDate,
            Remarks
        ],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            const adjustmentId = this.lastID;

            items.forEach(item => {

                const diff =
                    item.PhysicalQty -
                    item.SystemQty;

                // Insert Detail
                db.run(
                    `
                    INSERT INTO StockAdjustmentDetails
                    (
                        AdjustmentID,
                        ItemID,
                        SystemQty,
                        PhysicalQty,
                        DifferenceQty
                    )
                    VALUES (?,?,?,?,?)
                    `,
                    [
                        adjustmentId,
                        item.ItemID,
                        item.SystemQty,
                        item.PhysicalQty,
                        diff
                    ]
                );

                // Update Item Stock
                db.run(
                    `
                    UPDATE Items
                    SET CurrentStock = ?
                    WHERE ItemID = ?
                    `,
                    [
                        item.PhysicalQty,
                        item.ItemID
                    ]
                );

                // Insert Ledger Entry
                db.run(
                    `
                    INSERT INTO StockLedger
                    (
                        ItemID,
                        TransactionType,
                        ReferenceNo,
                        QtyIn,
                        QtyOut,
                        BalanceQty,
                        Remarks,
                        TransactionDate
                    )
                    VALUES (?,?,?,?,?,?,?,?)
                    `,
                    [
                        item.ItemID,
                        "ADJUSTMENT",
                        AdjustmentNo,

                        diff > 0 ? diff : 0,
                        diff < 0 ? Math.abs(diff) : 0,

                        item.PhysicalQty,
                        Remarks,
                        AdjustmentDate
                    ]
                );

            });

            res.status(201).json({
                success: true,
                message: "Stock adjusted successfully",
                AdjustmentID: adjustmentId
            });

        }
    );

};

// =========================
// Delete Adjustment
// =========================
exports.deleteAdjustment = (req, res) => {

    const id = req.params.id;

    db.run(
        `
        DELETE FROM StockAdjustments
        WHERE AdjustmentID = ?
        `,
        [id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Adjustment not found"
                });
            }

            res.json({
                success: true,
                message: "Adjustment deleted successfully"
            });

        }
    );

};