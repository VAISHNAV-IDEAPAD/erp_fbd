const db = require("../config/database");

// ==========================================
// Get All Invoices
// ==========================================
exports.getAllInvoices = (req, res) => {

    const sql = `
    SELECT
        si.*,
        c.CustomerName
    FROM SalesInvoices si
    LEFT JOIN Customers c
        ON si.CustomerID = c.CustomerID
    ORDER BY si.InvoiceID DESC
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


// ==========================================
// Create Invoice
// ==========================================
exports.createInvoice = (req, res) => {

    const {
        InvoiceNo,
        DispatchID,
        SOID,
        CustomerID,
        InvoiceDate,
        GSTAmount,
        items
    } = req.body;

    let total = 0;

    items.forEach(item => {
        total += item.Qty * item.Rate;
    });

    const net = total + GSTAmount;

    db.run(
        `
        INSERT INTO SalesInvoices
        (
            InvoiceNo,
            DispatchID,
            SOID,
            CustomerID,
            InvoiceDate,
            TotalAmount,
            GSTAmount,
            NetAmount
        )
        VALUES (?,?,?,?,?,?,?,?)
        `,
        [
            InvoiceNo,
            DispatchID,
            SOID,
            CustomerID,
            InvoiceDate,
            total,
            GSTAmount,
            net
        ],
        function (err) {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: err.message
                });
            }

            const invoiceId = this.lastID;

            items.forEach(item => {

                db.run(
                    `
                    INSERT INTO SalesInvoiceDetails
                    (
                        InvoiceID,
                        ItemID,
                        Qty,
                        Rate,
                        Amount
                    )
                    VALUES (?,?,?,?,?)
                    `,
                    [
                        invoiceId,
                        item.ItemID,
                        item.Qty,
                        item.Rate,
                        item.Qty * item.Rate
                    ]
                );

            });

            res.json({
                message:
                    "Invoice Created Successfully",
                InvoiceID: invoiceId
            });

        }
    );

};