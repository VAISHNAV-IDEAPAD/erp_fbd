const db = require("../config/database");

// ============================================
// Finance Dashboard
// ============================================

exports.getFinanceDashboard = (req, res) => {

    const sql = `
    SELECT

        -- Total Sales Value
        (
            SELECT IFNULL(SUM(NetAmount),0)
            FROM SalesInvoices
        ) AS TotalSales,

        -- Total Purchase Value
        (
            SELECT IFNULL(SUM(Amount),0)
            FROM PurchaseOrderDetails
        ) AS TotalPurchase,

        -- Customer Payments Received
        (
            SELECT IFNULL(SUM(Amount),0)
            FROM CustomerPayments
        ) AS CustomerReceipts,

        -- Supplier Payments
        0 AS SupplierPayments,

        -- Customer Outstanding
        (
            (SELECT IFNULL(SUM(NetAmount),0)
             FROM SalesInvoices)

            -

            (SELECT IFNULL(SUM(Amount),0)
             FROM CustomerPayments)
        ) AS CustomerOutstanding,

        -- Supplier Outstanding
        (
            SELECT IFNULL(SUM(Amount),0)
            FROM PurchaseOrderDetails
        ) AS SupplierOutstanding,

        -- Gross Profit
        (
            (SELECT IFNULL(SUM(NetAmount),0)
             FROM SalesInvoices)

            -

            (SELECT IFNULL(SUM(Amount),0)
             FROM PurchaseOrderDetails)
        ) AS GrossProfit,

        -- Collection Percentage
        ROUND(

            CASE

                WHEN
                (
                    SELECT IFNULL(SUM(NetAmount),0)
                    FROM SalesInvoices
                ) = 0

                THEN 0

                ELSE

                (
                    (
                        SELECT IFNULL(SUM(Amount),0)
                        FROM CustomerPayments
                    ) * 100.0

                    /

                    (
                        SELECT IFNULL(SUM(NetAmount),0)
                        FROM SalesInvoices
                    )

                )

            END

        ,2) AS CollectionPercentage,

        -- Payment Percentage
        0 AS PaymentPercentage;
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