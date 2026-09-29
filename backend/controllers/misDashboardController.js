const db = require("../config/database");

// ============================================
// MIS Dashboard
// ============================================

exports.getMISDashboard = (req, res) => {

    const sql = `
    SELECT

        -- Masters
        (SELECT COUNT(*) FROM Customers) AS TotalCustomers,
        (SELECT COUNT(*) FROM Suppliers) AS TotalSuppliers,
        (SELECT COUNT(*) FROM Items) AS TotalItems,

        -- Purchase
        (SELECT COUNT(*) FROM PurchaseOrders) AS TotalPurchaseOrders,
        (SELECT IFNULL(SUM(Amount),0) FROM PurchaseOrderDetails) AS PurchaseValue,

        -- Sales
        (SELECT COUNT(*) FROM SalesOrders) AS TotalSalesOrders,
        (SELECT IFNULL(SUM(NetAmount),0) FROM SalesInvoices) AS SalesValue,

        -- Production
        (SELECT COUNT(*) FROM ProductionOrders) AS TotalProductionOrders,
        (SELECT IFNULL(SUM(TotalCost),0) FROM ProductionCosting) AS ProductionCost,

        -- Inventory
        (SELECT IFNULL(SUM(CurrentStock * Rate),0) FROM Items) AS InventoryValue,

        -- Customer Outstanding
        (
            (SELECT IFNULL(SUM(NetAmount),0) FROM SalesInvoices)
            -
            (SELECT IFNULL(SUM(Amount),0) FROM CustomerPayments)
        ) AS CustomerOutstanding,

        -- Low Stock
        (
            SELECT COUNT(*)
            FROM Items
            WHERE CurrentStock <= ReorderLevel
        ) AS LowStockItems,

        -- Out Of Stock
        (
            SELECT COUNT(*)
            FROM Items
            WHERE CurrentStock = 0
        ) AS OutOfStockItems,

        -- Pending Purchase Orders
        (
            SELECT COUNT(*)
            FROM PurchaseOrders
            WHERE Status <> 'Completed'
        ) AS PendingPurchaseOrders,

        -- Pending Sales Orders
        (
            SELECT COUNT(*)
            FROM SalesOrders
            WHERE Status <> 'Completed'
        ) AS PendingSalesOrders,

        -- Pending Dispatch Qty
        (
            SELECT IFNULL(SUM(PendingQty),0)
            FROM SalesOrderDetails
        ) AS PendingDispatchQty,

        -- WIP Qty
        (
            (SELECT IFNULL(SUM(OrderQty),0)
             FROM ProductionOrders)

            -

            (SELECT IFNULL(SUM(ProducedQty),0)
             FROM ProductionReceipts)
        ) AS WIPQty;
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