const db = require("../config/database");

// ===========================================
// Pending Dispatch Report
// ===========================================
exports.getPendingDispatch = (req, res) => {

    const sql = `
    SELECT
        so.SONo,
        so.SODate,
        c.CustomerName,

        sod.*,

        IFNULL(sod.DispatchedQty,0)
            AS DispatchedQty,

        (
            sod.Qty -
            IFNULL(sod.DispatchedQty,0)
        ) AS PendingQty

    FROM SalesOrderDetails sod

    LEFT JOIN SalesOrders so
        ON sod.SOID = so.SOID

    LEFT JOIN Customers c
        ON so.CustomerID = c.CustomerID

    WHERE
        (
            sod.Qty -
            IFNULL(sod.DispatchedQty,0)
        ) > 0

    ORDER BY so.SOID DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: err.message
            });
        }

        res.json(rows);
    });

};