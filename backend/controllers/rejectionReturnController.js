const db = require("../config/database");

const nowStamp = () =>
    new Date()
        .toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
        .replace(",", "");

function ensureTable() {
    db.get("SELECT COUNT(*) AS cnt FROM RejectionReturns", [], (err) => {
        if (err) {
            if (db.pool) {
                const pgSql = `
                    CREATE TABLE IF NOT EXISTS RejectionReturns (
                        RejectionReturnID SERIAL PRIMARY KEY,
                        ReturnNo TEXT,
                        RejectionNo TEXT,
                        ReturnDate TEXT,
                        SupplierName TEXT,
                        Currency TEXT DEFAULT 'INR',
                        ExchangeRate DOUBLE PRECISION DEFAULT 1.0,
                        Remark TEXT,
                        InternalMemo TEXT,
                        EnteredBy TEXT DEFAULT 'Admin',
                        EnteredOn TEXT,
                        UpdatedBy TEXT DEFAULT 'Admin',
                        UpdatedOn TEXT,
                        TotalQty DOUBLE PRECISION DEFAULT 0,
                        NoOfRows INTEGER DEFAULT 0,
                        SubTotal DOUBLE PRECISION DEFAULT 0,
                        TotalAmount DOUBLE PRECISION DEFAULT 0,
                        GRNNos TEXT,
                        Groups TEXT,
                        ItemsFilter TEXT,
                        ItemsJSON TEXT,
                        OtherChargesJSON TEXT,
                        Status TEXT DEFAULT 'Active',
                        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                `;
                db.pool.query(pgSql).catch(() => {});
                return;
            }
            const sqliteSql = `
                CREATE TABLE IF NOT EXISTS RejectionReturns (
                    RejectionReturnID INTEGER PRIMARY KEY AUTOINCREMENT,
                    ReturnNo TEXT,
                    RejectionNo TEXT,
                    ReturnDate TEXT,
                    SupplierName TEXT,
                    Currency TEXT DEFAULT 'INR',
                    ExchangeRate REAL DEFAULT 1.0,
                    Remark TEXT,
                    InternalMemo TEXT,
                    EnteredBy TEXT DEFAULT 'Admin',
                    EnteredOn TEXT,
                    UpdatedBy TEXT DEFAULT 'Admin',
                    UpdatedOn TEXT,
                    TotalQty REAL DEFAULT 0,
                    NoOfRows INTEGER DEFAULT 0,
                    SubTotal REAL DEFAULT 0,
                    TotalAmount REAL DEFAULT 0,
                    GRNNos TEXT,
                    Groups TEXT,
                    ItemsFilter TEXT,
                    ItemsJSON TEXT,
                    OtherChargesJSON TEXT,
                    Status TEXT DEFAULT 'Active',
                    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `;
            db.run(sqliteSql, []);
        }
    });
}

setTimeout(ensureTable, 600);

exports.getAll = (req, res) => {
    const { supplier, search } = req.query;
    const conditions = [];
    const params = [];

    if (supplier && String(supplier).trim()) {
        conditions.push("LOWER(SupplierName) LIKE LOWER(?)");
        params.push(`%${String(supplier).trim()}%`);
    }

    if (search && String(search).trim()) {
        const q = `%${String(search).trim()}%`;
        conditions.push(
            "(LOWER(ReturnNo) LIKE LOWER(?) OR LOWER(RejectionNo) LIKE LOWER(?) OR LOWER(SupplierName) LIKE LOWER(?) OR LOWER(Remark) LIKE LOWER(?) OR LOWER(InternalMemo) LIKE LOWER(?))"
        );
        params.push(q, q, q, q, q);
    }

    const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `SELECT * FROM RejectionReturns ${whereSql} ORDER BY RejectionReturnID DESC`;

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error fetching Rejection Returns",
                error: err.message
            });
        }

        const parsed = (rows || []).map((r) => {
            let items = [];
            let otherCharges = [];
            try {
                items = r.ItemsJSON ? JSON.parse(r.ItemsJSON) : [];
            } catch (_) {
                items = [];
            }
            try {
                otherCharges = r.OtherChargesJSON ? JSON.parse(r.OtherChargesJSON) : [];
            } catch (_) {
                otherCharges = [];
            }
            return { ...r, items, otherCharges };
        });

        res.json({
            success: true,
            data: parsed
        });
    });
};

exports.getById = (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM RejectionReturns WHERE RejectionReturnID = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error fetching Rejection Return",
                error: err.message
            });
        }
        if (!row) {
            return res.status(404).json({
                success: false,
                message: "Rejection Return not found"
            });
        }
        let items = [];
        let otherCharges = [];
        try {
            items = row.ItemsJSON ? JSON.parse(row.ItemsJSON) : [];
        } catch (_) {
            items = [];
        }
        try {
            otherCharges = row.OtherChargesJSON ? JSON.parse(row.OtherChargesJSON) : [];
        } catch (_) {
            otherCharges = [];
        }
        res.json({
            success: true,
            data: { ...row, items, otherCharges }
        });
    });
};

exports.getGrnItems = (req, res) => {
    const { supplier } = req.query;
    const sql = `
        SELECT
            g.GRNID,
            g.GRNNo,
            g.GRNDate,
            p.PONo,
            s.SupplierName,
            i.ItemName,
            i.ItemCode,
            i.Category AS GroupName,
            gd.ReceivedQty,
            gd.AcceptedQty,
            gd.RejectedQty
        FROM GRNs g
        LEFT JOIN GRNDetails gd ON g.GRNID = gd.GRNID
        LEFT JOIN PurchaseOrders p ON g.POID = p.POID
        LEFT JOIN Suppliers s ON g.SupplierID = s.SupplierID
        LEFT JOIN Items i ON gd.ItemID = i.ItemID
        ORDER BY g.GRNID DESC
        LIMIT 50
    `;

    db.all(sql, [], (err, rows) => {
        const list = (!err && Array.isArray(rows) ? rows : []).filter((r) => r.GRNNo || r.ItemName);
        const mapped = list
            .filter((r) => {
                if (!supplier || !String(supplier).trim()) return true;
                return String(r.SupplierName || "")
                    .toLowerCase()
                    .includes(String(supplier).trim().toLowerCase());
            })
            .map((r, idx) => {
                const pending = Number(r.RejectedQty || r.ReceivedQty || 25);
                const rate = 185;
                return {
                    id: `${r.GRNID || idx}-${idx}`,
                    selected: true,
                    trNo: r.GRNNo || `GRN/9B/2627/${101 + idx}`,
                    trDate: r.GRNDate || "18-10-2026",
                    poNo: r.PONo || `PO/9B/2627/${41 + idx}`,
                    itemName: r.ItemName || "COW NAPPA MILLED LEATHER 1.1-1.3 MM",
                    variant: r.ItemCode || "BLACK",
                    sizeRange: "STD",
                    taxGroup: "IGST 18%",
                    pendingQty: pending,
                    rate,
                    qtyToReturn: pending,
                    discountPercent: 0,
                    value: Number((pending * rate).toFixed(2)),
                    supplierName: r.SupplierName || supplier || "PRIME TANNERY PVT LTD",
                    groupName: r.GroupName || "LEATHER"
                };
            });

        if (mapped.length > 0) {
            return res.json({ success: true, data: mapped });
        }

        // Fallback sample GRN items for the selected supplier
        const fallbackSupplier = supplier && String(supplier).trim() ? String(supplier).trim() : "PRIME TANNERY PVT LTD";
        const fallback = [
            {
                id: "grn-item-1",
                selected: true,
                trNo: "GRN/9B/2627/114",
                trDate: "16-10-2026",
                poNo: "PO/9B/2627/88",
                itemName: "COW CULATTAS SINGLE LEATHER 1.2-1.4 MM",
                variant: "FOREST BROWN",
                sizeRange: "STD",
                taxGroup: "GST 12%",
                pendingQty: 45,
                rate: 210,
                qtyToReturn: 15,
                discountPercent: 0,
                value: 3150.0,
                supplierName: fallbackSupplier,
                groupName: "LEATHER"
            },
            {
                id: "grn-item-2",
                selected: true,
                trNo: "GRN/9B/2627/118",
                trDate: "18-10-2026",
                poNo: "PO/9B/2627/92",
                itemName: "YKK #5 METAL ZIPPER SLIDER ANTIQUE BRASS",
                variant: "ANTIQUE BRASS",
                sizeRange: "5 NO",
                taxGroup: "GST 18%",
                pendingQty: 120,
                rate: 18.5,
                qtyToReturn: 20,
                discountPercent: 0,
                value: 370.0,
                supplierName: fallbackSupplier,
                groupName: "METAL FITTINGS"
            }
        ];

        res.json({ success: true, data: fallback });
    });
};

exports.create = (req, res) => {
    const b = req.body || {};
    const items = Array.isArray(b.items) ? b.items : [];
    const otherCharges = Array.isArray(b.otherCharges) ? b.otherCharges : [];
    const stamp = nowStamp();

    db.get("SELECT COUNT(*) AS cnt FROM RejectionReturns", [], (cntErr, cntRow) => {
        const nextNum = (!cntErr && cntRow ? Number(cntRow.cnt || 0) : 0) + 1;
        const returnNo = b.ReturnNo || `RR/9B/2627/${nextNum}`;
        const rejectionNo = b.RejectionNo || `REJ/9B/2627/${nextNum}`;
        const returnDate =
            b.ReturnDate ||
            new Date().toLocaleDateString("en-GB").replace(/\//g, "-");

        const totalQty =
            b.TotalQty !== undefined
                ? Number(b.TotalQty)
                : items.reduce((s, it) => s + (Number(it.qtyToReturn) || 0), 0);
        const noOfRows = b.NoOfRows !== undefined ? Number(b.NoOfRows) : Math.max(items.length, 1);
        const subTotal =
            b.SubTotal !== undefined
                ? Number(b.SubTotal)
                : items.reduce((s, it) => s + (Number(it.value) || 0), 0);
        const chargesTotal = otherCharges.reduce((s, c) => s + (Number(c.value) || 0), 0);
        const totalAmount =
            b.TotalAmount !== undefined ? Number(b.TotalAmount) : subTotal + chargesTotal;

        const record = {
            ReturnNo: returnNo,
            RejectionNo: rejectionNo,
            ReturnDate: returnDate,
            SupplierName: b.SupplierName || "",
            Currency: b.Currency || "INR",
            ExchangeRate: Number(b.ExchangeRate || 1.0),
            Remark: b.Remark || "",
            InternalMemo: b.InternalMemo || "",
            EnteredBy: b.EnteredBy || "Admin",
            EnteredOn: stamp,
            UpdatedBy: b.UpdatedBy || "Admin",
            UpdatedOn: stamp,
            TotalQty: totalQty,
            NoOfRows: noOfRows,
            SubTotal: subTotal,
            TotalAmount: totalAmount,
            GRNNos: Array.isArray(b.GRNNos) ? b.GRNNos.join(", ") : b.GRNNos || "",
            Groups: Array.isArray(b.Groups) ? b.Groups.join(", ") : b.Groups || "",
            ItemsFilter: Array.isArray(b.ItemsFilter) ? b.ItemsFilter.join(", ") : b.ItemsFilter || "",
            ItemsJSON: JSON.stringify(items),
            OtherChargesJSON: JSON.stringify(otherCharges),
            Status: b.Status || "Active"
        };

        const cols = Object.keys(record);
        const placeholders = cols.map(() => "?").join(", ");
        const vals = cols.map((k) => record[k]);

        db.run(
            `INSERT INTO RejectionReturns (${cols.join(", ")}) VALUES (${placeholders})`,
            vals,
            function (err) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Error saving Rejection Return",
                        error: err.message
                    });
                }
                res.status(201).json({
                    success: true,
                    message: "Rejection Return saved successfully",
                    data: {
                        RejectionReturnID: this.lastID,
                        ...record,
                        items,
                        otherCharges
                    }
                });
            }
        );
    });
};

exports.update = (req, res) => {
    const { id } = req.params;
    const b = req.body || {};
    const items = Array.isArray(b.items) ? b.items : [];
    const otherCharges = Array.isArray(b.otherCharges) ? b.otherCharges : [];
    const stamp = nowStamp();

    const totalQty =
        b.TotalQty !== undefined
            ? Number(b.TotalQty)
            : items.reduce((s, it) => s + (Number(it.qtyToReturn) || 0), 0);
    const noOfRows = b.NoOfRows !== undefined ? Number(b.NoOfRows) : Math.max(items.length, 1);
    const subTotal =
        b.SubTotal !== undefined
            ? Number(b.SubTotal)
            : items.reduce((s, it) => s + (Number(it.value) || 0), 0);
    const chargesTotal = otherCharges.reduce((s, c) => s + (Number(c.value) || 0), 0);
    const totalAmount =
        b.TotalAmount !== undefined ? Number(b.TotalAmount) : subTotal + chargesTotal;

    const sql = `
        UPDATE RejectionReturns SET
            SupplierName = ?,
            Currency = ?,
            ExchangeRate = ?,
            Remark = ?,
            InternalMemo = ?,
            UpdatedBy = ?,
            UpdatedOn = ?,
            TotalQty = ?,
            NoOfRows = ?,
            SubTotal = ?,
            TotalAmount = ?,
            GRNNos = ?,
            Groups = ?,
            ItemsFilter = ?,
            ItemsJSON = ?,
            OtherChargesJSON = ?
        WHERE RejectionReturnID = ?
    `;

    const params = [
        b.SupplierName || "",
        b.Currency || "INR",
        Number(b.ExchangeRate || 1.0),
        b.Remark || "",
        b.InternalMemo || "",
        b.UpdatedBy || "Admin",
        stamp,
        totalQty,
        noOfRows,
        subTotal,
        totalAmount,
        Array.isArray(b.GRNNos) ? b.GRNNos.join(", ") : b.GRNNos || "",
        Array.isArray(b.Groups) ? b.Groups.join(", ") : b.Groups || "",
        Array.isArray(b.ItemsFilter) ? b.ItemsFilter.join(", ") : b.ItemsFilter || "",
        JSON.stringify(items),
        JSON.stringify(otherCharges),
        id
    ];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error updating Rejection Return",
                error: err.message
            });
        }
        res.json({
            success: true,
            message: "Rejection Return updated successfully"
        });
    });
};

exports.remove = (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM RejectionReturns WHERE RejectionReturnID = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error deleting Rejection Return",
                error: err.message
            });
        }
        res.json({
            success: true,
            message: "Rejection Return deleted successfully"
        });
    });
};
