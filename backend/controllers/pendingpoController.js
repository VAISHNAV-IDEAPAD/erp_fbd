const db = require("../config/database");

exports.getPendingPO = (req, res) => {

    const sql = `
        SELECT
            p.POID,
            p.PONumber,
            i.ItemID,
            i.ItemCode,
            i.ItemName,
            pod.Quantity AS OrderedQty,
            COALESCE(pod.ReceivedQty,0) AS ReceivedQty,
            (
                pod.Quantity -
                COALESCE(pod.ReceivedQty,0)
            ) AS PendingQty
        FROM PurchaseOrderDetails pod
        INNER JOIN PurchaseOrders p
            ON p.POID = pod.POID
        INNER JOIN Items i
            ON i.ItemID = pod.ItemID
        WHERE
            (
                pod.Quantity -
                COALESCE(pod.ReceivedQty,0)
            ) > 0
        ORDER BY p.POID DESC
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