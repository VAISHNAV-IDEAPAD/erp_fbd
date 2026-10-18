const db = require("../config/database");

// ============================================
// WIP REPORT
// ============================================
exports.getWIPReport = (req, res) => {

    const sql = `
        SELECT
            po.ProductionOrderID AS ProductionID,
            po.ProductionNo,

            s.StyleCode,
            s.StyleName,

            po.PlannedQty AS OrderQty,
            po.ProducedQty,

            (COALESCE(po.PlannedQty, 0) -
             IFNULL(po.ProducedQty,0))
                AS WIPQty,

            po.StartDate,
            po.EndDate,
            po.Status

        FROM ProductionOrders po

        LEFT JOIN Styles s
            ON po.StyleID = s.StyleID

        ORDER BY po.ProductionNo
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            console.log(err);

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