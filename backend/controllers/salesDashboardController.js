const db = require("../config/database");

// ============================================
// Sales Dashboard
// ============================================

exports.getSalesDashboard = (req, res) => {

    const sql = `
    SELECT

        -- Total Customers
        (SELECT COUNT(*) FROM Customers) AS TotalCustomers,

        -- Total Sales Orders
        (SELECT COUNT(*) FROM SalesOrders) AS TotalSalesOrders,

        -- Pending Dispatch Qty
        (
            SELECT IFNULL(SUM(PendingQty),0)
            FROM SalesOrderDetails
        ) AS PendingDispatchQty,

        -- Total Dispatches
        (
            SELECT COUNT(*)
            FROM Dispatches
        ) AS TotalDispatches,

        -- Total Dispatched Qty
        (
            SELECT IFNULL(SUM(Qty),0)
            FROM DispatchDetails
        ) AS TotalDispatchedQty,

        -- Total Sales Invoices
        (
            SELECT COUNT(*)
            FROM SalesInvoices
        ) AS TotalInvoices,

        -- Total Sales Value
        (
            SELECT IFNULL(SUM(NetAmount),0)
            FROM SalesInvoices
        ) AS SalesValue,

        -- Total Customer Payments
        (
            SELECT IFNULL(SUM(Amount),0)
            FROM CustomerPayments
        ) AS ReceivedPayments,

        -- Outstanding Amount
        (
            (SELECT IFNULL(SUM(NetAmount),0) FROM SalesInvoices)
            -
            (SELECT IFNULL(SUM(Amount),0) FROM CustomerPayments)
        ) AS OutstandingAmount;
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