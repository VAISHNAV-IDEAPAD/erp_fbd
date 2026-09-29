const db = require("../config/database");

exports.getCustomerOutstanding = (req, res) => {

    const sql = `
    SELECT
        si.InvoiceID,
        si.InvoiceNo,
        si.InvoiceDate,

        c.CustomerName,

        si.NetAmount
            AS InvoiceAmount,

        IFNULL(
            SUM(cp.Amount),
            0
        ) AS PaidAmount,

        (
            si.NetAmount -
            IFNULL(
                SUM(cp.Amount),
                0
            )
        ) AS OutstandingAmount

    FROM SalesInvoices si

    LEFT JOIN Customers c
        ON si.CustomerID =
           c.CustomerID

    LEFT JOIN CustomerPayments cp
        ON si.InvoiceID =
           cp.InvoiceID

    GROUP BY
        si.InvoiceID

    ORDER BY
        si.InvoiceID DESC
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