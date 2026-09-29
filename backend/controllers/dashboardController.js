const db = require("../config/database");

// =====================================================
// ERP DASHBOARD
// =====================================================

exports.getDashboard = (req, res) => {

    const sql = `
    SELECT

    -- MASTER
    (SELECT COUNT(*) FROM Items) AS TotalItems,
    (SELECT COUNT(*) FROM Suppliers) AS TotalSuppliers,
    (SELECT COUNT(*) FROM Customers) AS TotalCustomers,

    -- PURCHASE
    (SELECT COUNT(*) FROM PurchaseOrders) AS TotalPurchaseOrders,

    -- SALES
    (SELECT COUNT(*) FROM SalesOrders) AS TotalSalesOrders,

    -- PRODUCTION
    (SELECT COUNT(*) FROM ProductionOrders) AS TotalProductionOrders,

    -- INVENTORY
    (SELECT IFNULL(SUM(CurrentStock),0) FROM Items) AS CurrentStockQty,
    (SELECT IFNULL(SUM(CurrentStock * Rate),0) FROM Items) AS InventoryValue,

    -- SALES VALUE
    (SELECT IFNULL(SUM(NetAmount),0) FROM SalesInvoices) AS SalesValue,

    -- PURCHASE VALUE
    (SELECT IFNULL(SUM(Amount),0) FROM PurchaseOrderDetails) AS PurchaseValue,

    -- CUSTOMER OUTSTANDING
    (
        (SELECT IFNULL(SUM(NetAmount),0) FROM SalesInvoices)
        -
        (SELECT IFNULL(SUM(Amount),0) FROM CustomerPayments)
    ) AS CustomerOutstanding,

    -- LOW STOCK
    (
        SELECT COUNT(*)
        FROM Items
        WHERE CurrentStock<=ReorderLevel
    ) AS LowStockItems,

    -- OUT OF STOCK
    (
        SELECT COUNT(*)
        FROM Items
        WHERE CurrentStock=0
    ) AS OutOfStockItems,

    -- PENDING PURCHASE
    (
        SELECT COUNT(*)
        FROM PurchaseOrders
        WHERE Status<>'Completed'
    ) AS PendingPurchaseOrders,

    -- PENDING SALES
    (
        SELECT COUNT(*)
        FROM SalesOrders
        WHERE Status<>'Completed'
    ) AS PendingSalesOrders;
    `;

    db.get(sql, [], (err, row) => {

        if (err) {

            console.error(err);

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