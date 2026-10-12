const db = require("../config/database");

// ======================================================
// FLOOR RETURNS & DETAILS TABLES
// ======================================================

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS FloorReturns (
        ReturnID INTEGER PRIMARY KEY AUTOINCREMENT,
        FRMNo TEXT UNIQUE,
        ReturnDate TEXT,
        UpdatedBy TEXT,
        UpdatedOn TEXT,
        SupplierID INTEGER,
        SupplierName TEXT,
        Stores TEXT,
        Currency TEXT DEFAULT 'INR',
        ExchangeRate REAL DEFAULT 1.0,
        Remark TEXT,
        InternalMemo TEXT,
        TotalQty REAL DEFAULT 0,
        RowCount INTEGER DEFAULT 1,
        Status TEXT DEFAULT 'Completed',
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `, err => {
        if (err) console.log("❌ FloorReturns :", err.message);
        else console.log("✓ FloorReturns Ready");
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS FloorReturnDetails (
        DetailID INTEGER PRIMARY KEY AUTOINCREMENT,
        ReturnID INTEGER,
        ItemID INTEGER,
        ItemCode TEXT,
        ItemName TEXT,
        Color TEXT,
        Quantity REAL DEFAULT 0,
        UOM TEXT,
        Remarks TEXT,
        FOREIGN KEY(ReturnID) REFERENCES FloorReturns(ReturnID) ON DELETE CASCADE
    )
    `, err => {
        if (err) console.log("❌ FloorReturnDetails :", err.message);
        else console.log("✓ FloorReturnDetails Ready");
    });
});

console.log("✅ Floor Return Tables Initialized");
