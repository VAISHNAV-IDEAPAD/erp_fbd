const db = require("../config/database");

// ======================================
// GET PURCHASE OVERVIEW / METRICS
// ======================================
exports.getOverview = (req, res) => {
    const summary = {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalSpend: 0
    };

    db.get(
        `SELECT COUNT(*) as total, 
                SUM(CASE WHEN Status = 'Pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END) as completed,
                SUM(TotalAmount) as spend
         FROM PurchaseOrders`,
        [],
        (err, row) => {
            if (row) {
                summary.totalOrders = row.total || 0;
                summary.pendingOrders = row.pending || 0;
                summary.completedOrders = row.completed || 0;
                summary.totalSpend = row.spend || 0;
            }

            res.json({
                success: true,
                data: summary
            });
        }
    );
};

// ======================================
// GET SUPPLIER LEDGER
// ======================================
exports.getSupplierLedger = (req, res) => {
    const sql = `
        SELECT po.POID, po.PONo, po.PODate, po.SupplierID, s.SupplierName,
               po.TotalAmount, po.Status, 'Invoice/PO' as EntryType
        FROM PurchaseOrders po
        LEFT JOIN Suppliers s ON po.SupplierID = s.SupplierID
        ORDER BY po.POID DESC
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
            data: rows || []
        });
    });
};
