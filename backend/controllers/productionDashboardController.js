const db = require("../config/database");

// ============================================
// Production Dashboard
// ============================================

exports.getProductionDashboard = (req, res) => {

    const sql = `
    SELECT

        -- Total Production Orders
        (
            SELECT COUNT(*)
            FROM ProductionOrders
        ) AS TotalProductionOrders,

        -- Total Material Issues
        (
            SELECT COUNT(*)
            FROM MaterialIssues
        ) AS TotalMaterialIssues,

        -- Total Material Issued Qty
        (
            SELECT IFNULL(SUM(IssuedQty),0)
            FROM MaterialIssueDetails
        ) AS MaterialIssuedQty,

        -- Total Production Receipts
        (
            SELECT COUNT(*)
            FROM ProductionReceipts
        ) AS TotalProductionReceipts,

        -- Total Produced Qty
        (
            SELECT IFNULL(SUM(ProducedQty),0)
            FROM ProductionReceipts
        ) AS ProducedQty,

        -- Total Rejected Qty
        (
            SELECT IFNULL(SUM(RejectedQty),0)
            FROM ProductionReceipts
        ) AS RejectedQty,

        -- Total Production Cost
        (
            SELECT IFNULL(SUM(TotalCost),0)
            FROM ProductionCosting
        ) AS TotalProductionCost,

        -- Work In Progress Qty
        (
            (SELECT IFNULL(SUM(OrderQty),0)
             FROM ProductionOrders)

            -

            (SELECT IFNULL(SUM(ProducedQty),0)
             FROM ProductionReceipts)

        ) AS WIPQty,

        -- Production Efficiency %
        ROUND(

            CASE

                WHEN
                (
                    SELECT IFNULL(SUM(OrderQty),0)
                    FROM ProductionOrders
                ) = 0

                THEN 0

                ELSE

                (
                    (
                        SELECT IFNULL(SUM(ProducedQty),0)
                        FROM ProductionReceipts
                    ) * 100.0

                    /

                    (
                        SELECT IFNULL(SUM(OrderQty),0)
                        FROM ProductionOrders
                    )

                )

            END

        ,2) AS ProductionEfficiency;
    `;

    db.get(sql, [], (err, row) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            data: row
        });

    });

};