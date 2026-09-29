const db = require("../config/database");

// ======================================================
// STOCK LEDGER
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS StockLedger (

    LedgerID INTEGER PRIMARY KEY AUTOINCREMENT,

    TransactionDate TEXT,

    ItemID INTEGER,

    TransactionType TEXT,

    ReferenceNo TEXT,

    QtyIn REAL DEFAULT 0,

    QtyOut REAL DEFAULT 0,

    BalanceQty REAL DEFAULT 0,

    WarehouseID INTEGER,

    Remarks TEXT,

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(ItemID)
        REFERENCES Items(ItemID)

)
`, err => {

    if (err)
        console.log("❌ StockLedger :", err.message);
    else
        console.log("✓ StockLedger Ready");

});

// ======================================================
// STOCK ISSUES
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS StockIssues (

    IssueID INTEGER PRIMARY KEY AUTOINCREMENT,

    IssueNo TEXT UNIQUE,

    IssueDate TEXT,

    DepartmentID INTEGER,

    EmployeeID INTEGER,

    Remarks TEXT,

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP

)
`, err => {

    if (err)
        console.log("❌ StockIssues :", err.message);
    else
        console.log("✓ StockIssues Ready");

});

// ======================================================
// STOCK ISSUE DETAILS
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS StockIssueDetails (

    IssueDetailID INTEGER PRIMARY KEY AUTOINCREMENT,

    IssueID INTEGER,

    ItemID INTEGER,

    Quantity REAL,

    Rate REAL,

    Amount REAL,

    FOREIGN KEY(IssueID)
        REFERENCES StockIssues(IssueID)
        ON DELETE CASCADE,

    FOREIGN KEY(ItemID)
        REFERENCES Items(ItemID)

)
`, err => {

    if (err)
        console.log("❌ StockIssueDetails :", err.message);
    else
        console.log("✓ StockIssueDetails Ready");

});

// ======================================================
// STOCK ADJUSTMENTS
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS StockAdjustments (

    AdjustmentID INTEGER PRIMARY KEY AUTOINCREMENT,

    AdjustmentNo TEXT UNIQUE,

    AdjustmentDate TEXT,

    AdjustmentType TEXT,

    Remarks TEXT,

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP

)
`, err => {

    if (err)
        console.log("❌ StockAdjustments :", err.message);
    else
        console.log("✓ StockAdjustments Ready");

});

// ======================================================
// STOCK ADJUSTMENT DETAILS
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS StockAdjustmentDetails (

    AdjustmentDetailID INTEGER PRIMARY KEY AUTOINCREMENT,

    AdjustmentID INTEGER,

    ItemID INTEGER,

    Quantity REAL,

    Rate REAL,

    Amount REAL,

    FOREIGN KEY(AdjustmentID)
        REFERENCES StockAdjustments(AdjustmentID)
        ON DELETE CASCADE,

    FOREIGN KEY(ItemID)
        REFERENCES Items(ItemID)

)
`, err => {

    if (err)
        console.log("❌ StockAdjustmentDetails :", err.message);
    else
        console.log("✓ StockAdjustmentDetails Ready");

});

// ======================================================
// FINISHED GOODS STOCK
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS FinishedGoodsStock (

    FGStockID INTEGER PRIMARY KEY AUTOINCREMENT,

    StyleID INTEGER,

    Color TEXT,

    Size TEXT,

    Quantity REAL DEFAULT 0,

    WarehouseID INTEGER,

    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(StyleID)
        REFERENCES Styles(StyleID)

)
`, err => {

    if (err)
        console.log("❌ FinishedGoodsStock :", err.message);
    else
        console.log("✓ FinishedGoodsStock Ready");

});

console.log("✅ Inventory Tables Loaded");