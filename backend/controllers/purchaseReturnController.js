const db = require("../config/database");

const RETURN_PREFIX = "PRT/AAPL/9B/26-27/";

const nowStamp = () =>
    new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    }).replace(",", "").replace(" at", "");

// ======================================================
// GET /api/purchase-returns
// ======================================================
exports.getAll = (req, res) => {
    const { supplier, status, search } = req.query;

    let sql = "SELECT * FROM PurchaseReturns WHERE 1=1";
    const params = [];

    if (supplier && supplier.trim()) {
        sql += " AND SupplierName LIKE ?";
        params.push(`%${supplier.trim()}%`);
    }

    if (status && status !== "All") {
        sql += " AND Status = ?";
        params.push(status);
    }

    if (search && search.trim()) {
        sql += " AND (ReturnNo LIKE ? OR InvoiceNo LIKE ? OR Remarks LIKE ?)";
        const term = `%${search.trim()}%`;
        params.push(term, term, term);
    }

    sql += " ORDER BY ReturnID DESC";

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, count: rows.length, data: rows });
    });
};

// ======================================================
// GET /api/purchase-returns/next-number
// ======================================================
exports.getNextNumber = (req, res) => {
    db.all("SELECT ReturnNo FROM PurchaseReturns", [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        let max = 0;
        rows.forEach(r => {
            const m = String(r.ReturnNo || "").match(/(\d+)$/);
            if (m) max = Math.max(max, parseInt(m[1], 10));
        });

        res.json({ success: true, nextNumber: max + 1, fullReturnNo: `${RETURN_PREFIX}${max + 1}` });
    });
};

// ======================================================
// GET /api/purchase-returns/:id
// ======================================================
exports.getById = (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM PurchaseReturns WHERE ReturnID = ?", [id], (err, header) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!header) return res.status(404).json({ success: false, message: "Purchase return not found" });

        db.all(
            "SELECT * FROM PurchaseReturnDetails WHERE ReturnID = ? ORDER BY DetailID",
            [id],
            (err2, details) => {
                if (err2) return res.status(500).json({ success: false, message: err2.message });
                res.json({ success: true, data: { ...header, details: details || [] } });
            }
        );
    });
};

// ======================================================
// POST /api/purchase-returns
// ======================================================
exports.create = (req, res) => {
    const body = req.body || {};
    const details = Array.isArray(body.details)
        ? body.details.filter(d => d && (d.ItemName || d.ItemCode) && Number(d.Quantity) > 0)
        : [];

    if (!body.SupplierName || !String(body.SupplierName).trim()) {
        return res.status(400).json({ success: false, message: "Supplier is required." });
    }

    if (details.length === 0) {
        return res.status(400).json({ success: false, message: "Add at least one item with a quantity." });
    }

    const totalQty = details.reduce((sum, d) => sum + Number(d.Quantity || 0), 0);
    const stamp = nowStamp();
    const user = body.EnteredBy || "Admin";

    db.all("SELECT ReturnNo FROM PurchaseReturns", [], (numErr, rows) => {
        if (numErr) return res.status(500).json({ success: false, message: numErr.message });

        let max = 0;
        rows.forEach(r => {
            const m = String(r.ReturnNo || "").match(/(\d+)$/);
            if (m) max = Math.max(max, parseInt(m[1], 10));
        });

        const returnNo = (body.ReturnNo && String(body.ReturnNo).trim()) || `${RETURN_PREFIX}${max + 1}`;

        db.run(
            `
            INSERT INTO PurchaseReturns
            (ReturnNo, ReturnDate, SupplierID, SupplierName, InvoiceNo, Remarks, Status,
             EnteredBy, EnteredOn, UpdatedBy, UpdatedOn, TotalQty, RowCount)
            VALUES (?, ?, ?, ?, ?, ?, 'Completed', ?, ?, ?, ?, ?, ?)
            `,
            [
                returnNo,
                body.ReturnDate || new Date().toISOString().substring(0, 10),
                body.SupplierID || null,
                String(body.SupplierName).trim(),
                body.InvoiceNo || "",
                body.Remarks || "",
                user,
                stamp,
                user,
                stamp,
                totalQty,
                details.length
            ],
            function (err) {
                if (err) {
                    const duplicate = /UNIQUE/i.test(err.message);
                    return res.status(duplicate ? 409 : 500).json({
                        success: false,
                        message: duplicate ? `Return No ${returnNo} already exists.` : err.message
                    });
                }

                const newId = this.lastID;
                const stmt = db.prepare(`
                    INSERT INTO PurchaseReturnDetails
                    (ReturnID, ItemID, ItemCode, ItemName, Quantity, UOM, Rate, Reason)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `);

                details.forEach(d => {
                    stmt.run(
                        newId,
                        d.ItemID || null,
                        d.ItemCode || "",
                        d.ItemName || "",
                        Number(d.Quantity || 0),
                        d.UOM || "",
                        Number(d.Rate || 0),
                        d.Reason || ""
                    );
                });

                stmt.finalize(() => {
                    res.status(201).json({
                        success: true,
                        message: `Purchase return ${returnNo} saved`,
                        data: { ReturnID: newId, ReturnNo: returnNo, TotalQty: totalQty, RowCount: details.length }
                    });
                });
            }
        );
    });
};

// ======================================================
// PATCH /api/purchase-returns/:id/cancel
// ======================================================
exports.cancel = (req, res) => {
    db.run(
        `UPDATE PurchaseReturns
         SET Status = 'Cancelled', UpdatedBy = ?, UpdatedOn = ?
         WHERE ReturnID = ? AND Status <> 'Cancelled'`,
        [req.body?.user || "Admin", nowStamp(), req.params.id],
        function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            if (this.changes === 0) {
                return res.status(400).json({ success: false, message: "Purchase return not found or already cancelled." });
            }
            res.json({ success: true, message: "Purchase return cancelled" });
        }
    );
};
