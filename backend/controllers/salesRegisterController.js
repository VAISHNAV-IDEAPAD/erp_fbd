const db = require("../config/database");

exports.getSalesRegister = (req, res) => {

    const sql = `
    SELECT
        si.InvoiceID,
        si.InvoiceNo,
        si.InvoiceDate,
        c.CustomerName,

        IFNULL(si.TotalAmount,0) AS InvoiceAmount,

        IFNULL(
            (
                SELECT SUM(cp.Amount)
                FROM CustomerPayments cp
                WHERE cp.InvoiceID = si.InvoiceID
            ),
            0
        ) AS PaidAmount,

        IFNULL(si.TotalAmount,0)
        -
        IFNULL(
            (
                SELECT SUM(cp.Amount)
                FROM CustomerPayments cp
                WHERE cp.InvoiceID = si.InvoiceID
            ),
            0
        ) AS BalanceAmount,

        si.Status

    FROM SalesInvoices si
    LEFT JOIN Customers c
        ON si.CustomerID = c.CustomerID

    ORDER BY si.InvoiceDate DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err)
            return res.status(500).json({
                message: err.message
            });

        res.json(rows);
    });

};