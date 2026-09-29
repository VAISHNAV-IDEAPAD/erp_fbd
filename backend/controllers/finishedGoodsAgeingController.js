const db = require("../config/database");

// ============================================
// Finished Goods Ageing Report
// ============================================

exports.getFinishedGoodsAgeing = (req, res) => {

    const sql = `
    SELECT

        PR.ReceiptID,
        PR.ReceiptNo,
        PR.ReceiptDate,

        S.StyleCode,
        S.StyleName,

        I.ItemCode,
        I.ItemName,

        PRD.ProducedQty AS ReceivedQty,
        PRD.RejectedQty,
        PRD.Rate,
        PRD.Amount,

        CAST(
            julianday('now') - julianday(PR.ReceiptDate)
        AS INTEGER) AS AgeDays,

        CASE
            WHEN (
                julianday('now') - julianday(PR.ReceiptDate)
            ) <= 30 THEN 'Fresh Stock'

            WHEN (
                julianday('now') - julianday(PR.ReceiptDate)
            ) <= 60 THEN 'Slow Moving'

            WHEN (
                julianday('now') - julianday(PR.ReceiptDate)
            ) <= 90 THEN 'Ageing Stock'

            ELSE 'Dead Stock'

        END AS AgeBucket

    FROM ProductionReceipts PR

    LEFT JOIN ProductionReceiptDetails PRD
        ON PR.ReceiptID = PRD.ReceiptID

    LEFT JOIN Items I
        ON PRD.ItemID = I.ItemID

    LEFT JOIN ProductionOrders PO
        ON PR.ProductionID = PO.ProductionID

    LEFT JOIN BOMs B
        ON PO.BOMID = B.BOMID

    LEFT JOIN Styles S
        ON B.StyleID = S.StyleID

    ORDER BY PR.ReceiptDate DESC;
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