const db = require("../config/database");

// ======================================
// Get All Payments
// ======================================
exports.getAllPayments = (req, res) => {

    const sql = `
    SELECT
        cp.*,
        c.CustomerName,
        si.InvoiceNo
    FROM CustomerPayments cp
    LEFT JOIN Customers c
        ON cp.CustomerID = c.CustomerID
    LEFT JOIN SalesInvoices si
        ON cp.InvoiceID = si.InvoiceID
    ORDER BY cp.PaymentID DESC
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


// ======================================
// Create Payment
// ======================================
exports.createPayment = (req, res) => {

    const {
        PaymentNo,
        CustomerID,
        InvoiceID,
        PaymentDate,
        PaymentMode,
        Amount,
        Remarks
    } = req.body;

    db.run(
        `
        INSERT INTO CustomerPayments
        (
            PaymentNo,
            CustomerID,
            InvoiceID,
            PaymentDate,
            PaymentMode,
            Amount,
            Remarks
        )
        VALUES (?,?,?,?,?,?,?)
        `,
        [
            PaymentNo,
            CustomerID,
            InvoiceID,
            PaymentDate,
            PaymentMode,
            Amount,
            Remarks
        ],
        function (err) {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message:
                    "Payment Added Successfully",
                PaymentID: this.lastID
            });

        }
    );

};