const db = require("../config/database");

// ======================================================
// ITEM ISSUES & ITEM ISSUE DETAILS TABLES
// ======================================================

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS ItemIssues (
        IssueID INTEGER PRIMARY KEY AUTOINCREMENT,
        IssueNo TEXT UNIQUE,
        IssueDate TEXT,
        UpdatedBy TEXT,
        UpdatedOn TEXT,
        JWNo TEXT,
        JCNo TEXT,
        SupplierID INTEGER,
        SupplierName TEXT,
        IssuedBy TEXT,
        Stores TEXT,
        Remark TEXT,
        InternalMemo TEXT,
        Currency TEXT DEFAULT 'INR',
        ExchangeRate REAL DEFAULT 1.0,
        ExpiryDate TEXT,
        TotalQty REAL DEFAULT 0,
        RowCount INTEGER DEFAULT 1,
        Status TEXT DEFAULT 'Completed',
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `, err => {
        if (err) console.log("❌ ItemIssues :", err.message);
        else console.log("✓ ItemIssues Table Ready");
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS ItemIssueDetails (
        DetailID INTEGER PRIMARY KEY AUTOINCREMENT,
        IssueID INTEGER,
        ItemID INTEGER,
        ItemCode TEXT,
        ItemName TEXT,
        Color TEXT,
        Quantity REAL DEFAULT 0,
        UOM TEXT,
        Rate REAL DEFAULT 0,
        Amount REAL DEFAULT 0,
        Remarks TEXT,
        FOREIGN KEY(IssueID) REFERENCES ItemIssues(IssueID) ON DELETE CASCADE
    )
    `, err => {
        if (err) console.log("❌ ItemIssueDetails :", err.message);
        else console.log("✓ ItemIssueDetails Table Ready");
    });
});

console.log("✅ Item Issue Tables Initialized");

module.exports = {};
