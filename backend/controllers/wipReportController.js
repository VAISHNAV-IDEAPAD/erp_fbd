const db = require("../config/database");

// ============================================
// WIP REPORT
// ============================================
exports.getWIPReport = (req, res) => {

    const sql = `
        SELECT
            po.ProductionID,
            po.ProductionNo,

            s.StyleCode,
            s.StyleName,

            po.OrderQty,
            po.ProducedQty,

            (po.OrderQty -
             IFNULL(po.ProducedQty,0))
                AS WIPQty,

            po.StartDate,
            po.EndDate,
            po.Status

        FROM ProductionOrders po

        LEFT JOIN BOMs b
            ON po.BOMID = b.BOMID

        LEFT JOIN Styles s
            ON b.StyleID = s.StyleID

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