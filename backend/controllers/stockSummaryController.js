const db = require("../config/database");

exports.getStockSummary = (req, res) => {
    let sql = `
        SELECT
            ItemID,
            ItemCode,
            ItemName,
            Category,
            UOM,
            Rate,
            CurrentStock,
            CurrentStock AS TotalStock,
            COALESCE(MinStock, 20) AS MinStock,
            COALESCE(ReorderLevel, 30) AS ReorderLevel,
            (CurrentStock * Rate) AS StockValue,
            CASE
                WHEN CurrentStock <= COALESCE(NULLIF(MinStock, 0), NULLIF(ReorderLevel, 0), 20) THEN 'Low Stock'
                ELSE 'Sufficient'
            END AS Status
        FROM Items
    `;

    const params = [];

    if (req.query.lowStock === "true" || req.query.lowStock === "1") {
        sql += ` WHERE CurrentStock <= COALESCE(NULLIF(MinStock, 0), NULLIF(ReorderLevel, 0), 20)`;
    }

    sql += ` ORDER BY CurrentStock ASC, ItemName ASC`;

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json(rows);
    });
};