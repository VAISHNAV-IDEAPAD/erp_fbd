const db = require("../config/database");


// ======================================
// GET ALL SALES ORDERS
// ======================================
exports.getAllSalesOrders = (req, res) => {

    const sql = `
    SELECT
        so.*,
        c.CustomerName
    FROM SalesOrders so
    LEFT JOIN Customers c
        ON so.CustomerID = c.CustomerID
    ORDER BY so.SOID DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
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


// ======================================
// GET SALES ORDER BY ID
// ======================================
exports.getSalesOrderById = (req, res) => {

    const { id } = req.params;

    db.get(
        `
        SELECT *
        FROM SalesOrders
        WHERE SOID = ?
        `,
        [id],
        (err, row) => {

            if (err)
                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            res.json({
                success: true,
                data: row
            });
        }
    );
};


// ======================================
// CREATE SALES ORDER
// ======================================
exports.createSalesOrder = (req, res) => {

    const {
        SONo,
        SODate,
        CustomerID,
        DeliveryDate,
        Remarks,
        Details
    } = req.body;

    db.run(
        `
        INSERT INTO SalesOrders
        (
            SONo,
            SODate,
            CustomerID,
            DeliveryDate,
            Remarks
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            SONo,
            SODate,
            CustomerID,
            DeliveryDate,
            Remarks
        ],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            const soId = this.lastID;

            if (!Details || Details.length === 0) {

                return res.json({
                    success: true,
                    SOID: soId
                });
            }

            const stmt = db.prepare(`
                INSERT INTO SalesOrderDetails
                (
                    SOID,
                    StyleID,
                    Qty,
                    Rate,
                    Amount,
                    PendingQty
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            Details.forEach(item => {

                const amount =
                    item.Qty * item.Rate;

                stmt.run(
                    [
                        soId,
                        item.StyleID,
                        item.Qty,
                        item.Rate,
                        amount,
                        item.Qty
                    ]
                );

            });

            stmt.finalize();

            res.status(201).json({
                success: true,
                message:
                    "Sales Order Created",
                SOID: soId
            });

        }
    );
};