const db = require("../config/database");

exports.getStockSummary = (req, res) => {

    const sql = `
    SELECT
        ItemID,
        ItemCode,
        ItemName,
        Category,
        UOM,
        Rate,
        CurrentStock,
        (CurrentStock * Rate) AS StockValue
    FROM Items
    ORDER BY ItemName
    `;

    db.all(sql, [], (err, rows) => {

        if (err)
            return res.status(500).json({
                message: err.message
            });

        res.json(rows);
    });
};