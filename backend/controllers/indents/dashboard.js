const db = require("../../config/database");

exports.dashboardSummary = (req, res) => {

    const sql = `
    SELECT
        (SELECT COUNT(*) FROM Indents) AS TotalIndents,
        (SELECT COUNT(*) FROM Indents WHERE Status='Draft') AS Draft,
        (SELECT COUNT(*) FROM Indents WHERE Status='Submitted') AS Submitted,
        (SELECT COUNT(*) FROM Indents WHERE Status='Approved') AS Approved,
        (SELECT COUNT(*) FROM Indents WHERE Status='Cancelled') AS Cancelled,
        (SELECT IFNULL(SUM(Qty),0) FROM IndentDetails) AS TotalQuantity
    `;

    db.get(sql, [], (err, row) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            data: row
        });

    });

};