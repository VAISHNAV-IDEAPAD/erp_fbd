const db = require("../config/database");

// ======================================================
// BOM MASTER
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS BOMs (

    BOMID INTEGER PRIMARY KEY AUTOINCREMENT,

    BOMNo TEXT UNIQUE,

    StyleID INTEGER,

    VersionNo TEXT,

    EffectiveDate TEXT,

    Status TEXT DEFAULT 'Active',

    Remarks TEXT,

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(StyleID)
        REFERENCES Styles(StyleID)

)
`, err => {

    if (err)
        console.log("❌ BOMs :", err.message);
    else
        console.log("✓ BOMs Ready");

});

// ======================================================
// BOM DETAILS
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS BOMDetails (

    BOMDetailID INTEGER PRIMARY KEY AUTOINCREMENT,

    BOMID INTEGER,

    ItemID INTEGER,

    RequiredQty REAL,

    WastagePercent REAL DEFAULT 0,

    Remarks TEXT,

    FOREIGN KEY(BOMID)
        REFERENCES BOMs(BOMID)
        ON DELETE CASCADE,

    FOREIGN KEY(ItemID)
        REFERENCES Items(ItemID)

)
`, err => {

    if (err)
        console.log("❌ BOMDetails :", err.message);
    else
        console.log("✓ BOMDetails Ready");

});

// ======================================================
// PRODUCTION ORDERS
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS ProductionOrders (

    ProductionOrderID INTEGER PRIMARY KEY AUTOINCREMENT,

    ProductionNo TEXT UNIQUE,

    StyleID INTEGER,

    OrderDate TEXT,

    PlannedQty REAL,

    ProducedQty REAL DEFAULT 0,

    StartDate TEXT,

    EndDate TEXT,

    Status TEXT DEFAULT 'Open',

    Remarks TEXT,

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(StyleID)
        REFERENCES Styles(StyleID)

)
`, err => {

    if (err)
        console.log("❌ ProductionOrders :", err.message);
    else
        console.log("✓ ProductionOrders Ready");

});

// ======================================================
// PRODUCTION MATERIALS
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS ProductionMaterials (

    MaterialID INTEGER PRIMARY KEY AUTOINCREMENT,

    ProductionOrderID INTEGER,

    ItemID INTEGER,

    RequiredQty REAL,

    IssuedQty REAL DEFAULT 0,

    ConsumedQty REAL DEFAULT 0,

    BalanceQty REAL DEFAULT 0,

    FOREIGN KEY(ProductionOrderID)
        REFERENCES ProductionOrders(ProductionOrderID)
        ON DELETE CASCADE,

    FOREIGN KEY(ItemID)
        REFERENCES Items(ItemID)

)
`, err => {

    if (err)
        console.log("❌ ProductionMaterials :", err.message);
    else
        console.log("✓ ProductionMaterials Ready");

});

// ======================================================
// MATERIAL ISSUES
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS MaterialIssues (

    MaterialIssueID INTEGER PRIMARY KEY AUTOINCREMENT,

    IssueNo TEXT UNIQUE,

    ProductionOrderID INTEGER,

    IssueDate TEXT,

    IssuedBy INTEGER,

    Remarks TEXT,

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(ProductionOrderID)
        REFERENCES ProductionOrders(ProductionOrderID)

)
`, err => {

    if (err)
        console.log("❌ MaterialIssues :", err.message);
    else
        console.log("✓ MaterialIssues Ready");

});

// ======================================================
// MATERIAL ISSUE DETAILS
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS MaterialIssueDetails (

    MaterialIssueDetailID INTEGER PRIMARY KEY AUTOINCREMENT,

    MaterialIssueID INTEGER,

    ItemID INTEGER,

    Quantity REAL,

    FOREIGN KEY(MaterialIssueID)
        REFERENCES MaterialIssues(MaterialIssueID)
        ON DELETE CASCADE,

    FOREIGN KEY(ItemID)
        REFERENCES Items(ItemID)

)
`, err => {

    if (err)
        console.log("❌ MaterialIssueDetails :", err.message);
    else
        console.log("✓ MaterialIssueDetails Ready");

});

// ======================================================
// PRODUCTION RECEIPTS
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS ProductionReceipts (

    ProductionReceiptID INTEGER PRIMARY KEY AUTOINCREMENT,

    ReceiptNo TEXT UNIQUE,

    ProductionOrderID INTEGER,

    ReceiptDate TEXT,

    ProducedQty REAL,

    WarehouseID INTEGER,

    Remarks TEXT,

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(ProductionOrderID)
        REFERENCES ProductionOrders(ProductionOrderID)

)
`, err => {

    if (err)
        console.log("❌ ProductionReceipts :", err.message);
    else
        console.log("✓ ProductionReceipts Ready");

});

// ======================================================
// PRODUCTION RECEIPT DETAILS
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS ProductionReceiptDetails (

    ProductionReceiptDetailID INTEGER PRIMARY KEY AUTOINCREMENT,

    ProductionReceiptID INTEGER,

    ItemID INTEGER,

    Quantity REAL,

    FOREIGN KEY(ProductionReceiptID)
        REFERENCES ProductionReceipts(ProductionReceiptID)
        ON DELETE CASCADE,

    FOREIGN KEY(ItemID)
        REFERENCES Items(ItemID)

)
`, err => {

    if (err)
        console.log("❌ ProductionReceiptDetails :", err.message);
    else
        console.log("✓ ProductionReceiptDetails Ready");

});

// ======================================================
// PRODUCTION OPERATIONS
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS ProductionOperations (

    OperationID INTEGER PRIMARY KEY AUTOINCREMENT,

    ProductionOrderID INTEGER,

    OperationName TEXT,

    EmployeeID INTEGER,

    StartTime TEXT,

    EndTime TEXT,

    Status TEXT,

    FOREIGN KEY(ProductionOrderID)
        REFERENCES ProductionOrders(ProductionOrderID)

)
`, err => {

    if (err)
        console.log("❌ ProductionOperations :", err.message);
    else
        console.log("✓ ProductionOperations Ready");

});

// ======================================================
// PRODUCTION COSTING
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS ProductionCosting (

    CostID INTEGER PRIMARY KEY AUTOINCREMENT,

    ProductionOrderID INTEGER,

    MaterialCost REAL DEFAULT 0,

    LabourCost REAL DEFAULT 0,

    OverheadCost REAL DEFAULT 0,

    TotalCost REAL DEFAULT 0,

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(ProductionOrderID)
        REFERENCES ProductionOrders(ProductionOrderID)

)
`, err => {

    if (err)
        console.log("❌ ProductionCosting :", err.message);
    else
        console.log("✓ ProductionCosting Ready");

});

console.log("✅ Production Tables Loaded");