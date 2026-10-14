const db = require("../config/database");

// ======================================================
// SUBCONTRACT MATERIAL CONVERSION GRN TABLES
// Matches TPCS Fashion ERP: tr_tag=JSTCGRN (Conversion GRN)
// ======================================================

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS SubcontractConversionGRN (
        GRNID INTEGER PRIMARY KEY AUTOINCREMENT,
        JSTCNo TEXT UNIQUE,
        Subcontractor TEXT NOT NULL,
        SubcontractOrderNo TEXT DEFAULT '',
        ConversionDate TEXT NOT NULL,
        Store TEXT NOT NULL,
        Currency TEXT DEFAULT 'INR',
        ExchangeRate REAL DEFAULT 1.0,
        TotalQty REAL DEFAULT 0,
        RowCount INTEGER DEFAULT 1,
        Status TEXT DEFAULT 'Approved',
        Remarks TEXT DEFAULT '',
        CreatedBy TEXT DEFAULT 'Admin',
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `, err => {
        if (err) console.log("❌ SubcontractConversionGRN table error:", err.message);
        else console.log("✓ SubcontractConversionGRN table ready");
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS SubcontractConversionGRNDetails (
        DetailID INTEGER PRIMARY KEY AUTOINCREMENT,
        GRNID INTEGER,
        FromItemCode TEXT,
        FromItemName TEXT,
        FromColor TEXT,
        FromUOM TEXT,
        FromQty REAL DEFAULT 0,
        ToItemCode TEXT,
        ToItemName TEXT,
        ToColor TEXT,
        ToUOM TEXT,
        ToQty REAL DEFAULT 0,
        ProcessName TEXT,
        Remarks TEXT,
        FOREIGN KEY(GRNID) REFERENCES SubcontractConversionGRN(GRNID) ON DELETE CASCADE
    )
    `, err => {
        if (err) console.log("❌ SubcontractConversionGRNDetails table error:", err.message);
        else console.log("✓ SubcontractConversionGRNDetails table ready");
    });
});

console.log("✅ Conversion GRN Tables Initialized");
