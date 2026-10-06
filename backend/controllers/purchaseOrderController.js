const db = require("../config/database");

// ===============================
// Get All Purchase Orders
// ===============================
exports.getAllPurchaseOrders = (req, res) => {
    const { supplier, materialSource, status } = req.query;

    let sql = `
        SELECT
            po.POID,
            po.PONo,
            po.PONo AS PONumber,
            po.PODate,
            COALESCE(po.ApproveTag, po.Status, 'PENDING') AS ApproveTag,
            po.Status,
            COALESCE(s.SupplierName, 'Unknown') AS SupplierName,
            COALESCE(po.DeliverTo, 'Plot No. 9B') AS DeliverTo,
            COALESCE(po.Currency, 'INR') AS Currency,
            COALESCE(po.Currency, 'INR') AS Curency,
            COALESCE(po.PurchaseType, 'Regular PO') AS PurchaseType,
            COALESCE(po.ExchangeRate, 1) AS ExchangeRate,
            COALESCE(po.ExchangeRate, 1) AS ExRate,
            COALESCE(po.BillTo, 'ALPINE APPARELS PVT. LTD.') AS BillTo,
            COALESCE(po.EnteredBy, 'Admin') AS EnteredBy,
            COALESCE(po.EnteredOn, strftime('%d-%m-%Y %H:%M', po.CreatedAt)) AS EnteredOn,
            COALESCE(po.UpdatedBy, po.EnteredBy, 'Admin') AS UpdatedBy,
            COALESCE(po.UpdatedOn, po.EnteredOn, strftime('%d-%m-%Y %H:%M', po.CreatedAt)) AS UpdatedOn,
            COALESCE(SUM(pod.Quantity), 0) AS Quantity,
            COALESCE(COUNT(pod.PODetailID), 0) AS NoOfRows,
            COALESCE(po.TotalAmount, 0) AS TotalAmount,
            COALESCE(po.MaterialSource, 'Domestic') AS MaterialSource,
            po.Remarks
        FROM PurchaseOrders po
        LEFT JOIN Suppliers s ON po.SupplierID = s.SupplierID
        LEFT JOIN PurchaseOrderDetails pod ON po.POID = pod.POID
        WHERE 1=1
    `;

    const params = [];

    if (supplier && supplier.trim() !== "") {
        sql += ` AND (s.SupplierName LIKE ? OR po.PONo LIKE ?)`;
        params.push(`%${supplier.trim()}%`, `%${supplier.trim()}%`);
    }

    if (materialSource && materialSource !== "All" && materialSource.trim() !== "") {
        sql += ` AND LOWER(COALESCE(po.MaterialSource, 'Domestic')) = LOWER(?)`;
        params.push(materialSource.trim());
    }

    if (status && status !== "All" && status.trim() !== "") {
        sql += ` AND (UPPER(COALESCE(po.ApproveTag, '')) = UPPER(?) OR UPPER(COALESCE(po.Status, '')) = UPPER(?))`;
        params.push(status.trim(), status.trim());
    }

    sql += `
        GROUP BY po.POID
        ORDER BY po.POID DESC
    `;

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error("Error in getAllPurchaseOrders:", err.message);
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    });
};

// ===============================
// Get Purchase Order By ID
// ===============================
exports.getPurchaseOrderById = (req, res) => {
    const sql = `
        SELECT
            po.*,
            po.PONo AS PONumber,
            COALESCE(po.ApproveTag, po.Status, 'PENDING') AS ApproveTag,
            COALESCE(s.SupplierName, 'Unknown') AS SupplierName,
            COALESCE(po.DeliverTo, 'Plot No. 9B') AS DeliverTo,
            COALESCE(po.Currency, 'INR') AS Currency,
            COALESCE(po.Currency, 'INR') AS Curency,
            COALESCE(po.PurchaseType, 'Regular PO') AS PurchaseType,
            COALESCE(po.ExchangeRate, 1) AS ExchangeRate,
            COALESCE(po.ExchangeRate, 1) AS ExRate,
            COALESCE(po.BillTo, 'ALPINE APPARELS PVT. LTD.') AS BillTo
        FROM PurchaseOrders po
        LEFT JOIN Suppliers s ON po.SupplierID = s.SupplierID
        WHERE po.POID = ?
    `;

    db.get(sql, [req.params.id], (err, po) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }

        if (!po) {
            return res.status(404).json({ success: false, message: "Purchase Order not found" });
        }

        // Fetch details
        const detailsSql = `
            SELECT
                pod.PODetailID,
                pod.POID,
                pod.ItemID,
                i.ItemCode,
                i.ItemName,
                i.UOM,
                pod.Quantity,
                pod.Quantity AS Qty,
                COALESCE(pod.ReceivedQty, 0) AS ReceivedQty,
                COALESCE(pod.PendingQty, (pod.Quantity - COALESCE(pod.ReceivedQty, 0))) AS PendingQty,
                pod.Rate,
                pod.Amount
            FROM PurchaseOrderDetails pod
            LEFT JOIN Items i ON i.ItemID = pod.ItemID
            WHERE pod.POID = ?
            ORDER BY pod.PODetailID ASC
        `;

        db.all(detailsSql, [req.params.id], (dErr, items) => {
            if (dErr) {
                return res.status(500).json({ success: false, error: dErr.message });
            }

            po.items = items || [];
            res.json({ success: true, data: po });
        });
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
            pod.Quantity,
            pod.Quantity AS Qty,
            COALESCE(pod.ReceivedQty, 0) AS ReceivedQty,
            COALESCE(pod.PendingQty, (pod.Quantity - COALESCE(pod.ReceivedQty, 0))) AS PendingQty,
            pod.Rate,
            pod.Amount
        FROM PurchaseOrderDetails pod
        LEFT JOIN Items i ON i.ItemID = pod.ItemID
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
        PONo,
        PONumber,
        PODate,
        SupplierID,
        SupplierName,
        DeliverTo = "Plot No. 9B",
        Currency = "INR",
        PurchaseType = "Regular PO",
        ExchangeRate = 1,
        BillTo = "ALPINE APPARELS PVT. LTD.",
        EnteredBy = "Admin",
        MaterialSource = "Domestic",
        ApproveTag = "PENDING",
        Status = "Open",
        Remarks = "",
        items = []
    } = req.body;

    const generateAndInsert = (finalPONo, supId) => {
        const now = new Date();
        const dateStr = PODate || now.toISOString().split("T")[0];
        const formattedEnteredOn = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
            " " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

        let totalAmount = 0;
        if (Array.isArray(items)) {
            items.forEach(it => {
                totalAmount += (Number(it.Quantity) || 0) * (Number(it.Rate) || 0);
            });
        }

        const sql = `
            INSERT INTO PurchaseOrders (
                PONo,
                PODate,
                SupplierID,
                DeliverTo,
                Currency,
                PurchaseType,
                ExchangeRate,
                BillTo,
                EnteredBy,
                EnteredOn,
                ApproveTag,
                MaterialSource,
                Status,
                Remarks,
                TotalAmount,
                NetAmount
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(
            sql,
            [
                finalPONo,
                dateStr,
                supId,
                DeliverTo,
                Currency,
                PurchaseType,
                Number(ExchangeRate) || 1,
                BillTo,
                EnteredBy,
                formattedEnteredOn,
                ApproveTag,
                MaterialSource,
                Status,
                Remarks,
                totalAmount,
                totalAmount
            ],
            function (err) {
                if (err) {
                    console.error("Error creating PO:", err.message);
                    return res.status(500).json({ success: false, error: err.message });
                }

                const newPOID = this.lastID;

                if (Array.isArray(items) && items.length > 0) {
                    const stmt = db.prepare(`
                        INSERT INTO PurchaseOrderDetails (
                            POID,
                            ItemID,
                            Quantity,
                            Rate,
                            Amount,
                            ReceivedQty,
                            PendingQty
                        )
                        VALUES (?, ?, ?, ?, ?, 0, ?)
                    `);

                    items.forEach(item => {
                        const qty = Number(item.Quantity) || 0;
                        const rate = Number(item.Rate) || 0;
                        const amt = Number(item.Amount) || (qty * rate);
                        stmt.run([newPOID, item.ItemID || null, qty, rate, amt, qty]);
                    });

                    stmt.finalize();
                }

                res.status(201).json({
                    success: true,
                    message: "Purchase Order created successfully",
                    POID: newPOID,
                    PONo: finalPONo
                });
            }
        );
    };

    let targetSupplierID = SupplierID;
    const poNumberCandidate = PONo || PONumber;

    const proceedWithSupplier = (supId) => {
        if (poNumberCandidate) {
            generateAndInsert(poNumberCandidate, supId);
        } else {
            db.get("SELECT COUNT(*) AS count FROM PurchaseOrders", (cErr, cRow) => {
                const seq = (cRow ? cRow.count : 0) + 960;
                const generatedPO = `PO/AAPL9B/26-27/${seq}`;
                generateAndInsert(generatedPO, supId);
            });
        }
    };

    if (!targetSupplierID && SupplierName) {
        db.get("SELECT SupplierID FROM Suppliers WHERE SupplierName LIKE ?", [`%${SupplierName.trim()}%`], (err, row) => {
            if (row) {
                proceedWithSupplier(row.SupplierID);
            } else {
                db.run(
                    "INSERT INTO Suppliers (SupplierCode, SupplierName, State) VALUES (?, ?, ?)",
                    [`SUP-${Date.now().toString().slice(-4)}`, SupplierName.trim(), MaterialSource === "Import" ? "Foreign" : "Domestic"],
                    function (insErr) {
                        proceedWithSupplier(insErr ? null : this.lastID);
                    }
                );
            }
        });
    } else {
        proceedWithSupplier(targetSupplierID);
    }
};

// ===============================
// Update Purchase Order
// ===============================
exports.updatePurchaseOrder = (req, res) => {
    const {
        PONo,
        PODate,
        SupplierID,
        DeliverTo,
        Currency,
        PurchaseType,
        ExchangeRate,
        BillTo,
        UpdatedBy = "Admin",
        ApproveTag,
        MaterialSource,
        Status,
        Remarks
    } = req.body;

    const now = new Date();
    const formattedUpdatedOn = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
        " " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

    const sql = `
        UPDATE PurchaseOrders
        SET
            PONo = COALESCE(?, PONo),
            PODate = COALESCE(?, PODate),
            SupplierID = COALESCE(?, SupplierID),
            DeliverTo = COALESCE(?, DeliverTo),
            Currency = COALESCE(?, Currency),
            PurchaseType = COALESCE(?, PurchaseType),
            ExchangeRate = COALESCE(?, ExchangeRate),
            BillTo = COALESCE(?, BillTo),
            UpdatedBy = ?,
            UpdatedOn = ?,
            ApproveTag = COALESCE(?, ApproveTag),
            MaterialSource = COALESCE(?, MaterialSource),
            Status = COALESCE(?, Status),
            Remarks = COALESCE(?, Remarks)
        WHERE POID = ?
    `;

    db.run(
        sql,
        [
            PONo,
            PODate,
            SupplierID,
            DeliverTo,
            Currency,
            PurchaseType,
            ExchangeRate,
            BillTo,
            UpdatedBy,
            formattedUpdatedOn,
            ApproveTag,
            MaterialSource,
            Status,
            Remarks,
            req.params.id
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ success: false, error: err.message });
            }

            res.json({
                success: true,
                message: "Purchase Order Updated Successfully"
            });
        }
    );
};

// ===============================
// Update PO Status / Approval
// ===============================
exports.updateStatus = (req, res) => {
    const { status, approveTag, updatedBy = "Admin" } = req.body;
    const now = new Date();
    const formattedUpdatedOn = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
        " " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

    const newTag = approveTag || (status === "Approved" ? "APPROVED" : status === "Cancelled" ? "CANCELLED" : "PENDING");
    const newStatus = status || (newTag === "APPROVED" ? "Approved" : "Open");

    const sql = `
        UPDATE PurchaseOrders
        SET
            ApproveTag = ?,
            Status = ?,
            UpdatedBy = ?,
            UpdatedOn = ?
        WHERE POID = ?
    `;

    db.run(sql, [newTag, newStatus, updatedBy, formattedUpdatedOn, req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }

        res.json({
            success: true,
            message: `Purchase Order status updated to ${newTag}`
        });
    });
};

// ===============================
// Bulk Action (Approve / Delete)
// ===============================
exports.bulkAction = (req, res) => {
    const { action, poIds = [] } = req.body;

    if (!Array.isArray(poIds) || poIds.length === 0) {
        return res.status(400).json({ success: false, message: "No purchase orders selected" });
    }

    const placeholders = poIds.map(() => "?").join(",");

    if (action === "approve") {
        const now = new Date();
        const formattedUpdatedOn = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
            " " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

        const sql = `
            UPDATE PurchaseOrders
            SET ApproveTag = 'APPROVED', Status = 'Approved', UpdatedBy = 'Admin', UpdatedOn = ?
            WHERE POID IN (${placeholders})
        `;

        db.run(sql, [formattedUpdatedOn, ...poIds], function (err) {
            if (err) {
                return res.status(500).json({ success: false, error: err.message });
            }
            res.json({ success: true, message: `Approved ${this.changes} purchase orders` });
        });
    } else if (action === "delete") {
        const sql = `DELETE FROM PurchaseOrders WHERE POID IN (${placeholders})`;
        db.run(sql, poIds, function (err) {
            if (err) {
                return res.status(500).json({ success: false, error: err.message });
            }
            res.json({ success: true, message: `Deleted ${this.changes} purchase orders` });
        });
    } else {
        res.status(400).json({ success: false, message: "Unsupported bulk action" });
    }
};

// ===============================
// Delete Purchase Order
// ===============================
exports.deletePurchaseOrder = (req, res) => {
    const sql = `DELETE FROM PurchaseOrders WHERE POID = ?`;

    db.run(sql, [req.params.id], function (err) {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json({
            success: true,
            message: "Purchase Order Deleted Successfully"
        });
    });
};