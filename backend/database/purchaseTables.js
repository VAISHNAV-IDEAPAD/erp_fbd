const db = require("../config/database");

// ======================================================
// PURCHASE REQUISITIONS
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS PurchaseRequisitions (

    PRID INTEGER PRIMARY KEY AUTOINCREMENT,

    PRNo TEXT UNIQUE,

    PRDate TEXT,

    DepartmentID INTEGER,

    RequestedBy INTEGER,

    RequiredDate TEXT,

    Priority TEXT DEFAULT 'Normal',

    Remarks TEXT,

    Status TEXT DEFAULT 'Pending',

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP

)
`, err => {

    if (err)
        console.log("❌ PurchaseRequisitions :", err.message);
    else
        console.log("✓ PurchaseRequisitions Ready");

});

// ======================================================
// PURCHASE REQUISITION DETAILS
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS PurchaseRequisitionDetails (

    PRDetailID INTEGER PRIMARY KEY AUTOINCREMENT,

    PRID INTEGER,

    ItemID INTEGER,

    Quantity REAL,

    UOM TEXT,

    Remarks TEXT,

    FOREIGN KEY(PRID)
        REFERENCES PurchaseRequisitions(PRID)
        ON DELETE CASCADE,

    FOREIGN KEY(ItemID)
        REFERENCES Items(ItemID)

)
`, err => {

    if (err)
        console.log("❌ PurchaseRequisitionDetails :", err.message);
    else
        console.log("✓ PurchaseRequisitionDetails Ready");

});

// ======================================================
// PURCHASE ORDERS
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS PurchaseOrders (

    POID INTEGER PRIMARY KEY AUTOINCREMENT,

    PONo TEXT UNIQUE,

    PODate TEXT,

    SupplierID INTEGER,

    DeliveryDate TEXT,

    TotalAmount REAL DEFAULT 0,

    GSTAmount REAL DEFAULT 0,

    NetAmount REAL DEFAULT 0,

    Status TEXT DEFAULT 'Open',

    Remarks TEXT,

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(SupplierID)
        REFERENCES Suppliers(SupplierID)

)
`, err => {

    if (err)
        console.log("❌ PurchaseOrders :", err.message);
    else
        console.log("✓ PurchaseOrders Ready");

});

// ======================================================
// PURCHASE ORDER DETAILS
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS PurchaseOrderDetails (

    PODetailID INTEGER PRIMARY KEY AUTOINCREMENT,

    POID INTEGER,

    ItemID INTEGER,

    Quantity REAL,

    Rate REAL,

    Amount REAL,

    ReceivedQty REAL DEFAULT 0,

    PendingQty REAL DEFAULT 0,

    FOREIGN KEY(POID)
        REFERENCES PurchaseOrders(POID)
        ON DELETE CASCADE,

    FOREIGN KEY(ItemID)
        REFERENCES Items(ItemID)

)
`, err => {

    if (err)
        console.log("❌ PurchaseOrderDetails :", err.message);
    else
        console.log("✓ PurchaseOrderDetails Ready");

});

// ======================================================
// GOODS RECEIPT NOTES
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS GRNs (

    GRNID INTEGER PRIMARY KEY AUTOINCREMENT,

    GRNNo TEXT UNIQUE,

    GRNDate TEXT,

    POID INTEGER,

    SupplierID INTEGER,

    InvoiceNo TEXT,

    InvoiceDate TEXT,

    Remarks TEXT,

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(POID)
        REFERENCES PurchaseOrders(POID),

    FOREIGN KEY(SupplierID)
        REFERENCES Suppliers(SupplierID)

)
`, err => {

    if (err)
        console.log("❌ GRNs :", err.message);
    else
        console.log("✓ GRNs Ready");

});

// ======================================================
// GRN DETAILS
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS GRNDetails (

    GRNDetailID INTEGER PRIMARY KEY AUTOINCREMENT,

    GRNID INTEGER,

    ItemID INTEGER,

    ReceivedQty REAL,

    AcceptedQty REAL,

    RejectedQty REAL,

    Rate REAL,

    FOREIGN KEY(GRNID)
        REFERENCES GRNs(GRNID)
        ON DELETE CASCADE,

    FOREIGN KEY(ItemID)
        REFERENCES Items(ItemID)

)
`, err => {

    if (err)
        console.log("❌ GRNDetails :", err.message);
    else
        console.log("✓ GRNDetails Ready");

});

console.log("✅ Purchase Tables Loaded");