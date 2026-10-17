const db = require("../config/database");

// ======================================================
// PURCHASE RETURNS & DETAILS TABLES
// ======================================================

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS PurchaseReturns (
        ReturnID INTEGER PRIMARY KEY AUTOINCREMENT,
        ReturnNo TEXT UNIQUE,
        ReturnDate TEXT,
        SupplierID INTEGER,
        SupplierName TEXT,
        InvoiceNo TEXT,
        Remarks TEXT,
        Status TEXT DEFAULT 'Completed',
        EnteredBy TEXT,
        EnteredOn TEXT,
        UpdatedBy TEXT,
        UpdatedOn TEXT,
        TotalQty REAL DEFAULT 0,
        RowCount INTEGER DEFAULT 0,
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `, err => {
        if (err) console.log("PurchaseReturns table error:", err.message);
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS PurchaseReturnDetails (
        DetailID INTEGER PRIMARY KEY AUTOINCREMENT,
        ReturnID INTEGER,
        ItemID INTEGER,
        ItemCode TEXT,
        ItemName TEXT,
        Quantity REAL DEFAULT 0,
        UOM TEXT,
        Rate REAL DEFAULT 0,
        Reason TEXT,
        FOREIGN KEY(ReturnID) REFERENCES PurchaseReturns(ReturnID) ON DELETE CASCADE
    )
    `, err => {
        if (err) console.log("PurchaseReturnDetails table error:", err.message);
    });
});
