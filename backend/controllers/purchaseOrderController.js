const db = require("../config/database");

// ===============================
// Get All Purchase Orders
// ===============================
exports.getAllPurchaseOrders = (req, res) => {

    const sql = `
        SELECT
            po.POID,
            po.PONumber,
            po.PODate,
            po.ExpectedDate,
            po.Status,
            po.Remarks,
            s.SupplierName
        FROM PurchaseOrders po
        JOIN Suppliers s
            ON po.SupplierID = s.SupplierID
        ORDER BY po.POID DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
};


// ===============================
// Get Purchase Order By ID
// ===============================
exports.getPurchaseOrderById = (req, res) => {

    const sql = `
        SELECT *
        FROM PurchaseOrders
        WHERE POID = ?
    `;

    db.get(sql, [req.params.id], (err, row) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (!row) {
            return res.status(404).json({
                message: "Purchase Order not found"
            });
        }

        res.json(row);
    });
};


// ===============================
// Get Purchase Order Details
// ===============================
exports.getPurchaseOrderDetails = (req, res) => {

    const sql = `
        SELECT
            pod.PODetailID,
            pod.POID,
            pod.ItemID,
            i.ItemCode,
            i.ItemName,
            i.UOM,
            pod.Qty,
            COALESCE(pod.ReceivedQty, 0) AS ReceivedQty,
            COALESCE(pod.PendingQty, pod.Qty) AS PendingQty,
            pod.Rate
        FROM PurchaseOrderDetails pod
        LEFT JOIN Items i
            ON i.ItemID = pod.ItemID
        WHERE pod.POID = ?
        ORDER BY pod.PODetailID
    `;

    db.all(sql, [req.params.id], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            data: rows
        });
    });
};


// ===============================
// Add Purchase Order
// ===============================
exports.addPurchaseOrder = (req, res) => {

    const {
        PONumber,
        SupplierID,
        PODate,
        ExpectedDate,
        Status,
        Remarks
    } = req.body;

    const sql = `
        INSERT INTO PurchaseOrders
        (
            PONumber,
            SupplierID,
            PODate,
            ExpectedDate,
            Status,
            Remarks
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            PONumber,
            SupplierID,
            PODate,
            ExpectedDate,
            Status,
            Remarks
        ],
        function (err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Purchase Order Added Successfully",
                POID: this.lastID
            });
        }
    );
};


// ===============================
// Update Purchase Order
// ===============================
exports.updatePurchaseOrder = (req, res) => {

    const {
        PONumber,
        SupplierID,
        PODate,
        ExpectedDate,
        Status,
        Remarks
    } = req.body;

    const sql = `
        UPDATE PurchaseOrders
        SET
            PONumber = ?,
            SupplierID = ?,
            PODate = ?,
            ExpectedDate = ?,
            Status = ?,
            Remarks = ?
        WHERE POID = ?
    `;

    db.run(
        sql,
        [
            PONumber,
            SupplierID,
            PODate,
            ExpectedDate,
            Status,
            Remarks,
            req.params.id
        ],
        function (err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Purchase Order Updated Successfully"
            });
        }
    );
};


// ===============================
// Delete Purchase Order
// ===============================
exports.deletePurchaseOrder = (req, res) => {

    const sql = `
        DELETE FROM PurchaseOrders
        WHERE POID = ?
    `;

    db.run(sql, [req.params.id], function (err) {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            message: "Purchase Order Deleted Successfully"
        });
    });
};