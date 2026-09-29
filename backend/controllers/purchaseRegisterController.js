const db = require("../config/database");

// ======================================
// Purchase Register
// ======================================
exports.getPurchaseRegister = (req, res) => {

    const sql = `
    SELECT
        po.*,
        s.SupplierName

    FROM PurchaseOrders po
    LEFT JOIN Suppliers s
        ON po.SupplierID = s.SupplierID

    ORDER BY po.POID DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.json(rows);

    });

};