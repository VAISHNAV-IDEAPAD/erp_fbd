const db = require("../config/database");


// ======================================
// GET ALL LEDGER
// ======================================
exports.getAllLedger = (req, res) => {

    const sql = `
    SELECT
        s.*,
        i.ItemCode,
        i.ItemName
    FROM StockLedger s
    LEFT JOIN Items i
        ON s.ItemID = i.ItemID
    ORDER BY s.TransactionDate DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    });
};


// ======================================
// GET ITEM LEDGER
// ======================================
exports.getItemLedger = (req, res) => {

    const { itemId } = req.params;

    const sql = `
    SELECT
        s.*,
        i.ItemCode,
        i.ItemName
    FROM StockLedger s
    LEFT JOIN Items i
        ON s.ItemID = i.ItemID
    WHERE s.ItemID = ?
    ORDER BY s.TransactionDate DESC
    `;

    db.all(sql, [itemId], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    });
};