const db = require("../config/database");


// ======================================
// GET ALL GRNs
// ======================================
exports.getAllGRNs = (req, res) => {

    const sql = `
        SELECT
            g.GRNID,
            g.GRNNo,
            g.GRNDate,
            g.POID,
            p.PONo
        FROM GRNs g
        LEFT JOIN PurchaseOrders p
            ON p.POID = g.POID
        ORDER BY g.GRNID DESC
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
            data: rows
        });

    });
};



// ======================================
// CREATE GRN
// ======================================
exports.createGRN = (req, res) => {

    const {
        GRNNo,
        POID,
        GRNDate,
        Remarks,
        Details
    } = req.body;

    if (!POID || !Details) {
        return res.status(400).json({
            success: false,
            message: "POID and Details are required"
        });
    }

    db.run(
        `
        INSERT INTO GRNs
        (
            GRNNo,
            POID,
            GRNDate,
            Remarks
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            GRNNo,
            POID,
            GRNDate,
            Remarks
        ],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            const GRNID = this.lastID;

            Details.forEach(item => {

                const amount =
                    item.ReceivedQty *
                    item.Rate;

                // Insert GRN Detail
                db.run(
                    `
                    INSERT INTO GRNDetails
                    (
                        GRNID,
                        PODetailID,
                        ItemID,
                        ReceivedQty,
                        Rate,
                        Amount
                    )
                    VALUES
                    (?, ?, ?, ?, ?, ?)
                    `,
                    [
                        GRNID,
                        item.PODetailID,
                        item.ItemID,
                        item.ReceivedQty,
                        item.Rate,
                        amount
                    ]
                );

                // Update PO
                db.run(
                    `
                    UPDATE PurchaseOrderDetails
                    SET
                        ReceivedQty =
                            COALESCE(ReceivedQty,0)
                            + ?,

                        PendingQty =
                            Qty -
                            (
                                COALESCE(ReceivedQty,0)
                                + ?
                            )
                    WHERE PODetailID = ?
                    `,
                    [
                        item.ReceivedQty,
                        item.ReceivedQty,
                        item.PODetailID
                    ]
                );

                // Update Stock
                db.run(
                    `
                    UPDATE Items
                    SET CurrentStock =
                        COALESCE(CurrentStock,0)
                        + ?
                    WHERE ItemID = ?
                    `,
                    [
                        item.ReceivedQty,
                        item.ItemID
                    ]
                );

                // Stock Ledger
                db.run(
                    `
                    INSERT INTO StockLedger
                    (
                        ItemID,
                        TransactionType,
                        ReferenceNo,
                        QtyIn,
                        Remarks
                    )
                    VALUES
                    (?, ?, ?, ?, ?)
                    `,
                    [
                        item.ItemID,
                        "GRN",
                        GRNNo,
                        item.ReceivedQty,
                        "GRN Receipt"
                    ]
                );

            });

            res.status(201).json({
                success: true,
                message:
                    "GRN Created Successfully",
                GRNID
            });

        }
    );
};