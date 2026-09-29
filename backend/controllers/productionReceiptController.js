const db = require("../config/database");

// =====================================
// GET ALL RECEIPTS
// =====================================
exports.getAllReceipts = (req, res) => {

    db.all(
        `
        SELECT *
        FROM ProductionReceipts
        ORDER BY ReceiptID DESC
        `,
        [],
        (err, rows) => {

            if (err)
                return res.status(500).json(err);

            res.json(rows);
        }
    );
};

// =====================================
// GET RECEIPT BY ID
// =====================================
exports.getReceiptById = (req, res) => {

    db.get(
        `
        SELECT *
        FROM ProductionReceipts
        WHERE ReceiptID = ?
        `,
        [req.params.id],
        (err, row) => {

            if (err)
                return res.status(500).json(err);

            res.json(row);
        }
    );
};

// =====================================
// CREATE RECEIPT
// =====================================
exports.createReceipt = (req, res) => {

    console.log("POST HIT");
    console.log(req.body);

    const {
        ReceiptNo,
        ProductionID,
        ReceiptDate,
        ProducedQty,
        RejectedQty = 0,
        Remarks,
        ItemID
    } = req.body;

    console.log("ItemID =", ItemID);
    console.log("ProductionID =", ProductionID);

    db.run(
        `
        INSERT INTO ProductionReceipts
        (
            ReceiptNo,
            ProductionID,
            ReceiptDate,
            ProducedQty,
            RejectedQty,
            Status,
            Remarks
        )
        VALUES (?,?,?,?,?,'Completed',?)
        `,
        [
            ReceiptNo,
            ProductionID,
            ReceiptDate,
            ProducedQty,
            RejectedQty,
            Remarks
        ],
        function (err) {

            if (err)
                return res.status(500).json(err);

            const receiptID = this.lastID;

            // ==========================
            // Finished Goods Stock
            // ==========================
            db.run(
                `
                INSERT INTO FinishedGoodsStock
                (
                    ItemID,
                    ProductionID,
                    Qty,
                    ReceiptDate
                )
                VALUES (?,?,?,?)
                `,
                [
                    ItemID,
                    ProductionID,
                    ProducedQty,
                    ReceiptDate
                ],
                function (err) {

                    if (err)
                        console.log("FG ERROR:", err);
                    else
                        console.log("FG INSERTED");
                }
            );

            // ==========================
            // Update Item Stock
            // ==========================
            db.run(
                `
                UPDATE Items
                SET CurrentStock =
                    CurrentStock + ?
                WHERE ItemID = ?
                `,
                [
                    ProducedQty,
                    ItemID
                ],
                function (err) {

                    if (err)
                        console.log("ITEM ERROR:", err);
                    else
                        console.log(
                            "Items Updated:",
                            this.changes
                        );
                }
            );

            // ==========================
            // Stock Ledger Entry
            // ==========================
            db.run(
                `
                INSERT INTO StockLedger
                (
                    ItemID,
                    TransactionType,
                    ReferenceNo,
                    QtyIn,
                    QtyOut,
                    BalanceQty,
                    Remarks,
                    TransactionDate
                )
                VALUES (?,?,?,?,?,?,?,?)
                `,
                [
                    ItemID,
                    "Production Receipt",
                    ReceiptNo,
                    ProducedQty,
                    0,
                    ProducedQty,
                    Remarks,
                    ReceiptDate
                ],
                function (err) {

                    if (err)
                        console.log("LEDGER ERROR:", err);
                    else
                        console.log("LEDGER INSERTED");
                }
            );

            // ==========================
            // Update Production Order
            // ==========================
            db.run(
                `
                UPDATE ProductionOrders
                SET ProducedQty =
                    ProducedQty + ?,
                    Status = 'Completed'
                WHERE ProductionID = ?
                `,
                [
                    ProducedQty,
                    ProductionID
                ],
                function (err) {

                    if (err)
                        console.log("PO ERROR:", err);
                    else
                        console.log(
                            "Rows Updated:",
                            this.changes
                        );
                }
            );

            res.json({
                success: true,
                message:
                    "Production Receipt Created Successfully",
                ReceiptID: receiptID
            });
        }
    );
};