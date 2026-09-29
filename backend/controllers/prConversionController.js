const db = require("../config/database");


// Pending PR Items

exports.getPendingPRItems = (req, res) => {

    const prId = req.params.prId;

    db.all(`
        SELECT
            d.PRDetailID,
            d.ItemID,
            i.ItemCode,
            i.ItemName,
            d.Qty RequestedQty,
            d.OrderedQty,
            (d.Qty-d.OrderedQty) PendingQty
        FROM PurchaseRequisitionDetails d
        JOIN Items i
            ON i.ItemID=d.ItemID
        WHERE d.PRID=?
        AND (d.Qty-d.OrderedQty)>0
    `,
    [prId],
    (err, rows)=>{

        if(err)
            return res.status(500).json(err);

        res.json(rows);
    });
};
exports.convertPRToPO = (req,res)=>{

    const {
        PRID,
        SupplierID,
        PODate,
        items
    } = req.body;

    const PONo =
        "PO" + Date.now();

    db.run(`
        INSERT INTO PurchaseOrders
        (
            PONo,
            PODate,
            SupplierID,
            PRID,
            Status
        )
        VALUES (?,?,?,?,?)
    `,
    [
        PONo,
        PODate,
        SupplierID,
        PRID,
        "Open"
    ],
    function(err){

        if(err)
            return res.status(500).json(err);

        const POID = this.lastID;

        items.forEach(item=>{

            const amount =
                item.Qty * item.Rate;

            db.run(`
                INSERT INTO PurchaseOrderDetails
                (
                    POID,
                    ItemID,
                    Qty,
                    Rate,
                    Amount
                )
                VALUES(?,?,?,?,?)
            `,
            [
                POID,
                item.ItemID,
                item.Qty,
                item.Rate,
                amount
            ]);

            db.run(`
                UPDATE PurchaseRequisitionDetails
                SET OrderedQty =
                    OrderedQty + ?
                WHERE PRDetailID=?
            `,
            [
                item.Qty,
                item.PRDetailID
            ]);
        });

        db.run(`
            UPDATE PurchaseRequisitions
            SET Status='Converted'
            WHERE PRID=?
            AND NOT EXISTS
            (
                SELECT 1
                FROM PurchaseRequisitionDetails
                WHERE PRID=?
                AND Qty > OrderedQty
            )
        `,
        [PRID,PRID]);

        res.json({
            message:
                "PR Converted Successfully",
            POID
        });

    });

};