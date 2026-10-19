const db = require("../config/database");

function ensureTable() {
    db.get("SELECT COUNT(*) AS cnt FROM GateEntries", [], (err) => {
        if (err) {
            if (db.pool) {
                const pgSql = `
                    CREATE TABLE IF NOT EXISTS GateEntries (
                        GateEntryID SERIAL PRIMARY KEY,
                        GateEntryPrefix TEXT DEFAULT 'GE/9B/2627/',
                        GateEntryNo TEXT,
                        GateEntryDate TEXT,
                        GateEntryInTime TEXT,
                        SupplierDCDate TEXT,
                        SupplierDCNo TEXT,
                        InvoiceDate TEXT,
                        InvoiceNo TEXT,
                        SupplierName TEXT,
                        Weight DOUBLE PRECISION DEFAULT 0,
                        Boxes INTEGER DEFAULT 0,
                        ReceivedBy TEXT,
                        TransportDetails TEXT,
                        TransporterDocRefNo TEXT,
                        ItemDetails TEXT,
                        Remarks TEXT,
                        POReference TEXT,
                        QtyUnitDetails TEXT,
                        Amount DOUBLE PRECISION DEFAULT 0,
                        GRNNo TEXT,
                        GRNDate TEXT,
                        EnteredBy TEXT DEFAULT 'Admin',
                        Status TEXT DEFAULT 'Pending',
                        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                `;
                db.pool.query(pgSql).catch(() => {});
                return;
            }
            const sqliteSql = `
                CREATE TABLE IF NOT EXISTS GateEntries (
                    GateEntryID INTEGER PRIMARY KEY AUTOINCREMENT,
                    GateEntryPrefix TEXT DEFAULT 'GE/9B/2627/',
                    GateEntryNo TEXT,
                    GateEntryDate TEXT,
                    GateEntryInTime TEXT,
                    SupplierDCDate TEXT,
                    SupplierDCNo TEXT,
                    InvoiceDate TEXT,
                    InvoiceNo TEXT,
                    SupplierName TEXT,
                    Weight REAL DEFAULT 0,
                    Boxes INTEGER DEFAULT 0,
                    ReceivedBy TEXT,
                    TransportDetails TEXT,
                    TransporterDocRefNo TEXT,
                    ItemDetails TEXT,
                    Remarks TEXT,
                    POReference TEXT,
                    QtyUnitDetails TEXT,
                    Amount REAL DEFAULT 0,
                    GRNNo TEXT,
                    GRNDate TEXT,
                    EnteredBy TEXT DEFAULT 'Admin',
                    Status TEXT DEFAULT 'Pending',
                    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `;
            db.run(sqliteSql, []);
        }
    });
}

setTimeout(ensureTable, 500);

exports.getAll = (req, res) => {
    const { gateEntryNo, status, search } = req.query;
    const conditions = [];
    const params = [];

    if (gateEntryNo && String(gateEntryNo).trim()) {
        const g = `%${String(gateEntryNo).trim()}%`;
        conditions.push("(LOWER(GateEntryNo) LIKE LOWER(?) OR LOWER(GateEntryPrefix) LIKE LOWER(?))");
        params.push(g, g);
    }

    if (status && status !== "All") {
        conditions.push("LOWER(Status) = LOWER(?)");
        params.push(String(status).trim());
    }

    if (search && String(search).trim()) {
        const q = `%${String(search).trim()}%`;
        conditions.push(
            "(LOWER(GateEntryNo) LIKE LOWER(?) OR LOWER(SupplierName) LIKE LOWER(?) OR LOWER(InvoiceNo) LIKE LOWER(?) OR LOWER(SupplierDCNo) LIKE LOWER(?))"
        );
        params.push(q, q, q, q);
    }

    const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `SELECT * FROM GateEntries ${whereSql} ORDER BY GateEntryID DESC`;

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error fetching Gate Entries",
                error: err.message
            });
        }
        res.json({
            success: true,
            data: rows || []
        });
    });
};

exports.getById = (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM GateEntries WHERE GateEntryID = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error fetching Gate Entry",
                error: err.message
            });
        }
        if (!row) {
            return res.status(404).json({
                success: false,
                message: "Gate Entry not found"
            });
        }
        res.json({
            success: true,
            data: row
        });
    });
};

exports.create = (req, res) => {
    const b = req.body || {};

    db.get("SELECT COUNT(*) AS cnt FROM GateEntries", [], (cntErr, cntRow) => {
        const nextNum = (!cntErr && cntRow ? Number(cntRow.cnt || 0) : 0) + 1;
        const prefix =
            b.GateEntryPrefix && b.GateEntryPrefix !== "Prefix"
                ? b.GateEntryPrefix
                : "GE/9B/2627/";
        const entryNo =
            b.GateEntryNo && String(b.GateEntryNo).trim()
                ? String(b.GateEntryNo).trim()
                : String(nextNum);

        const record = {
            GateEntryPrefix: prefix,
            GateEntryNo: entryNo,
            GateEntryDate:
                b.GateEntryDate ||
                new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
            GateEntryInTime: b.GateEntryInTime || "22:18",
            SupplierDCDate: b.SupplierDCDate || "",
            SupplierDCNo: b.SupplierDCNo || "",
            InvoiceDate: b.InvoiceDate || "",
            InvoiceNo: b.InvoiceNo || "",
            SupplierName: b.SupplierName || "",
            Weight: Number(b.Weight || 0),
            Boxes: Number(b.Boxes || 0),
            ReceivedBy: b.ReceivedBy || "",
            TransportDetails: b.TransportDetails || "",
            TransporterDocRefNo: b.TransporterDocRefNo || "",
            ItemDetails: b.ItemDetails || "",
            Remarks: b.Remarks || "",
            POReference: b.POReference || "",
            QtyUnitDetails: b.QtyUnitDetails || "",
            Amount: Number(b.Amount || 0),
            GRNNo: b.GRNNo || "",
            GRNDate: b.GRNDate || "",
            EnteredBy: b.EnteredBy || "Admin",
            Status: b.Status || "Pending"
        };

        const cols = Object.keys(record);
        const placeholders = cols.map(() => "?").join(", ");
        const vals = cols.map((k) => record[k]);

        db.run(
            `INSERT INTO GateEntries (${cols.join(", ")}) VALUES (${placeholders})`,
            vals,
            function (err) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Error saving Gate Entry",
                        error: err.message
                    });
                }
                res.status(201).json({
                    success: true,
                    message: "Gate Entry saved successfully",
                    data: {
                        GateEntryID: this.lastID,
                        ...record
                    }
                });
            }
        );
    });
};

exports.update = (req, res) => {
    const { id } = req.params;
    const b = req.body || {};

    const sql = `
        UPDATE GateEntries SET
            GateEntryPrefix = ?,
            GateEntryNo = ?,
            GateEntryDate = ?,
            GateEntryInTime = ?,
            SupplierDCDate = ?,
            SupplierDCNo = ?,
            InvoiceDate = ?,
            InvoiceNo = ?,
            SupplierName = ?,
            Weight = ?,
            Boxes = ?,
            ReceivedBy = ?,
            TransportDetails = ?,
            TransporterDocRefNo = ?,
            ItemDetails = ?,
            Remarks = ?,
            POReference = ?,
            QtyUnitDetails = ?,
            Amount = ?,
            GRNNo = ?,
            GRNDate = ?,
            EnteredBy = ?,
            Status = ?
        WHERE GateEntryID = ?
    `;

    const params = [
        b.GateEntryPrefix || "GE/9B/2627/",
        b.GateEntryNo || "",
        b.GateEntryDate || "",
        b.GateEntryInTime || "22:18",
        b.SupplierDCDate || "",
        b.SupplierDCNo || "",
        b.InvoiceDate || "",
        b.InvoiceNo || "",
        b.SupplierName || "",
        Number(b.Weight || 0),
        Number(b.Boxes || 0),
        b.ReceivedBy || "",
        b.TransportDetails || "",
        b.TransporterDocRefNo || "",
        b.ItemDetails || "",
        b.Remarks || "",
        b.POReference || "",
        b.QtyUnitDetails || "",
        Number(b.Amount || 0),
        b.GRNNo || "",
        b.GRNDate || "",
        b.EnteredBy || "Admin",
        b.Status || "Pending",
        id
    ];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error updating Gate Entry",
                error: err.message
            });
        }
        res.json({
            success: true,
            message: "Gate Entry updated successfully"
        });
    });
};

exports.remove = (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM GateEntries WHERE GateEntryID = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error deleting Gate Entry",
                error: err.message
            });
        }
        res.json({
            success: true,
            message: "Gate Entry deleted successfully"
        });
    });
};
