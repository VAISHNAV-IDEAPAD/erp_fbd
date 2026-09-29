const db = require("../config/database");

// ============================================
// Production Variance Report
// ============================================
exports.getProductionVariance = (req, res) => {

    const sql = `
        SELECT
            po.ProductionNo,
            s.StyleCode,
            s.StyleName,

            rm.ItemCode,
            rm.ItemName,

            mid.RequiredQty,
            mid.IssuedQty,

            (mid.IssuedQty - mid.RequiredQty)
                AS VarianceQty,

            mid.Rate,

            ((mid.IssuedQty - mid.RequiredQty)
                * mid.Rate)
                AS VarianceAmount

        FROM MaterialIssues mi

        LEFT JOIN MaterialIssueDetails mid
            ON mi.IssueID = mid.IssueID

        LEFT JOIN ProductionOrders po
            ON mi.ProductionID = po.ProductionID

        LEFT JOIN BOMs b
            ON po.BOMID = b.BOMID

        LEFT JOIN Styles s
            ON b.StyleID = s.StyleID

        LEFT JOIN Items rm
            ON mid.ItemID = rm.ItemID

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