const db = require("../config/database");

// ============================================
// Material Consumption Report
// ============================================
exports.getMaterialConsumption = (req, res) => {

    const sql = `
        SELECT
            mi.IssueNo,
            mi.IssueDate,

            po.ProductionNo,

            s.StyleCode,
            s.StyleName,

            rm.ItemCode AS RawMaterialCode,
            rm.ItemName AS RawMaterial,

            mid.RequiredQty,
            mid.IssuedQty,
            mid.Rate,
            mid.Amount

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

        ORDER BY
            mi.IssueDate DESC,
            mi.IssueNo DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            console.log("Material Consumption Error:", err);

            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });

    });

};