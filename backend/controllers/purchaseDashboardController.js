const db = require("../config/database");

// ============================================
// Purchase Dashboard
// ============================================

exports.getPurchaseDashboard = (req, res) => {

    const sql = `
    SELECT

        -- Total Suppliers
        (SELECT COUNT(*) FROM Suppliers) AS TotalSuppliers,

        -- Total Purchase Orders
        (SELECT COUNT(*) FROM PurchaseOrders) AS TotalPurchaseOrders,

        -- Pending Purchase Orders
        (
            SELECT COUNT(*)
            FROM PurchaseOrders
            WHERE Status <> 'Completed'
        ) AS PendingPurchaseOrders,

        -- Total GRNs
        (
            SELECT COUNT(*)
            FROM GRNs
        ) AS TotalGRNs,

        -- Total Purchase Value
        (
            SELECT IFNULL(SUM(Amount),0)
            FROM PurchaseOrderDetails
        ) AS PurchaseValue,

        -- Total Received Value
        (
            SELECT IFNULL(SUM(Amount),0)
            FROM GRNDetails
        ) AS ReceivedValue,

        -- Total Ordered Quantity
        (
            SELECT IFNULL(SUM(Quantity),0)
            FROM PurchaseOrderDetails
        ) AS OrderedQty,

        -- Total Received Quantity
        (
            SELECT IFNULL(SUM(ReceivedQty),0)
            FROM GRNDetails
        ) AS ReceivedQty,

        -- Pending Quantity
        (
            SELECT
                IFNULL(SUM(Quantity),0) -
                IFNULL(SUM(ReceivedQty),0)
            FROM PurchaseOrderDetails
        ) AS PendingQty;
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