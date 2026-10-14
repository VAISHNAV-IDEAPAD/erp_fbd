const db = require("../config/database");

// ======================================================
// STOCK CONVERSIONS & DETAILS TABLES
// ======================================================

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS StockConversions (
        ConversionID INTEGER PRIMARY KEY AUTOINCREMENT,
        ConversionNo TEXT UNIQUE,
        ConversionDate TEXT,
        FromStore TEXT,
        ToStore TEXT,
        Currency TEXT DEFAULT 'INR',
        ExchangeRate REAL DEFAULT 1.0,
        Message TEXT DEFAULT '',
        InternalMemo TEXT DEFAULT '',
        IssuedBy TEXT DEFAULT '',
        ReceivedBy TEXT DEFAULT '',
        SupplierID INTEGER,
        SupplierName TEXT DEFAULT '',
        TotalQty REAL DEFAULT 0,
        DisplayQty TEXT,
        RowCount INTEGER DEFAULT 1,
        Status TEXT DEFAULT 'Completed',
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `, err => {
        if (err) console.log("❌ StockConversions :", err.message);
        else console.log("✓ StockConversions Ready");
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS StockConversionDetails (
        DetailID INTEGER PRIMARY KEY AUTOINCREMENT,
        ConversionID INTEGER,
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
        Remarks TEXT,
        FOREIGN KEY(ConversionID) REFERENCES StockConversions(ConversionID) ON DELETE CASCADE
    )
    `, err => {
        if (err) console.log("❌ StockConversionDetails :", err.message);
        else console.log("✓ StockConversionDetails Ready");
    });
});

console.log("✅ Stock Conversion Tables Initialized");
