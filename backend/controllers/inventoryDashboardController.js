const db = require("../config/database");

// ============================================
// Inventory Dashboard
// ============================================

exports.getInventoryDashboard = (req, res) => {

    const sql = `
    SELECT

        -- Total Items
        (
            SELECT COUNT(*)
            FROM Items
        ) AS TotalItems,

        -- Current Stock Quantity
        (
            SELECT IFNULL(SUM(CurrentStock),0)
            FROM Items
        ) AS CurrentStockQty,

        -- Inventory Value
        (
            SELECT IFNULL(SUM(CurrentStock * Rate),0)
            FROM Items
        ) AS InventoryValue,

        -- Low Stock Items
        (
            SELECT COUNT(*)
            FROM Items
            WHERE CurrentStock <= ReorderLevel
        ) AS LowStockItems,

        -- Out of Stock Items
        (
            SELECT COUNT(*)
            FROM Items
            WHERE CurrentStock = 0
        ) AS OutOfStockItems,

        -- Total Stock In
        (
            SELECT IFNULL(SUM(QtyIn),0)
            FROM StockLedger
        ) AS TotalStockIn,

        -- Total Stock Out
        (
            SELECT IFNULL(SUM(QtyOut),0)
            FROM StockLedger
        ) AS TotalStockOut,

        -- Total Stock Adjustments
        (
            SELECT COUNT(*)
            FROM StockAdjustments
        ) AS TotalStockAdjustments,

        -- Average Item Rate
        (
            SELECT ROUND(IFNULL(AVG(Rate),0),2)
            FROM Items
        ) AS AverageItemRate,

        -- Active Items
        (
            SELECT COUNT(*)
            FROM Items
            WHERE Status='Active'
        ) AS ActiveItems;
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