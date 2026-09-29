const db = require("../config/database");

// ============================================
// Get All Dispatches
// ============================================
exports.getAllDispatch = (req, res) => {

    const sql = `
        SELECT
            d.*,
            c.CustomerName
        FROM Dispatches d
        LEFT JOIN Customers c
            ON d.CustomerID = c.CustomerID
        ORDER BY d.DispatchID DESC
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


// ============================================
// Get Dispatch By ID
// ============================================
exports.getDispatchById = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM DispatchDetails
        WHERE DispatchID = ?
    `;

    db.all(sql, [id], (err, rows) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: err.message
            });
        }

        res.json(rows);
    });
};


// ============================================
// Create Dispatch
// ============================================
exports.createDispatch = (req, res) => {

    const {
        DispatchNo,
        SOID,
        CustomerID,
        DispatchDate,
        Remarks,
        items
    } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({
            message: "Items are required"
        });
    }

    db.run(
        `
        INSERT INTO Dispatches
        (
            DispatchNo,
            SOID,
            CustomerID,
            DispatchDate,
            Remarks
        )
        VALUES (?,?,?,?,?)
        `,
        [
            DispatchNo,
            SOID,
            CustomerID,
            DispatchDate,
            Remarks
        ],
        function (err) {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: err.message
                });
            }

            const dispatchId = this.lastID;

            items.forEach((item) => {

                // ===================================
                // Insert Dispatch Details
                // ===================================
                db.run(
                    `
                    INSERT INTO DispatchDetails
                    (
                        DispatchID,
                        ItemID,
                        Qty,
                        Rate,
                        Amount
                    )
                    VALUES (?,?,?,?,?)
                    `,
                    [
                        dispatchId,
                        item.ItemID,
                        item.Qty,
                        item.Rate,
                        item.Qty * item.Rate
                    ],
                    (err) => {
                        if (err) console.log(err);
                    }
                );

                // ===================================
                // Reduce Finished Goods Stock
                // ===================================
                db.run(
                    `
                    UPDATE Items
                    SET CurrentStock =
                        CurrentStock - ?
                    WHERE ItemID = ?
                    `,
                    [
                        item.Qty,
                        item.ItemID
                    ],
                    (err) => {
                        if (err) console.log(err);
                    }
                );

                // ===================================
                // Update Sales Order Pending Qty
                // ===================================
                db.run(
                    `
                    UPDATE SalesOrderDetails
                    SET
                        DispatchedQty =
                            IFNULL(DispatchedQty,0) + ?,

                        PendingQty =
                            IFNULL(PendingQty,0) - ?
                    WHERE SOID = ?
                    AND ItemID = ?
                    `,
                    [
                        item.Qty,
                        item.Qty,
                        SOID,
                        item.ItemID
                    ],
                    (err) => {
                        if (err) console.log(err);
                    }
                );

                // ===================================
                // Stock Ledger Entry
                // ===================================
                db.run(
                    `
                    INSERT INTO StockLedger
                    (
                        ItemID,
                        TransactionType,
                        ReferenceNo,
                        QtyOut
                    )
                    VALUES (?,?,?,?)
                    `,
                    [
                        item.ItemID,
                        "DISPATCH",
                        DispatchNo,
                        item.Qty
                    ],
                    (err) => {
                        if (err) {
                            console.log("Stock Ledger Error:");
                            console.log(err);
                        }
                    }
                );

            });

            res.json({
                message: "Dispatch Created Successfully",
                DispatchID: dispatchId
            });

        }
    );
};