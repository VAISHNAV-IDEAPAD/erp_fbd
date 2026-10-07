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

    PurchaseType TEXT,

    ReleaseOption TEXT,

    SupplierID INTEGER,

    DeliveryDate TEXT,

    QuoteNo TEXT,

    QuoteDate TEXT,

    FreightCharges REAL DEFAULT 0,

    OtherCharges TEXT,

    TotalAmount REAL DEFAULT 0,

    SubTotal REAL DEFAULT 0,

    GSTAmount REAL DEFAULT 0,

    CGSTAmount REAL DEFAULT 0,

    SGSTAmount REAL DEFAULT 0,

    IGSTAmount REAL DEFAULT 0,

    NetAmount REAL DEFAULT 0,

    Status TEXT DEFAULT 'Open',

    Remarks TEXT,

    PaymentTerms TEXT,

    DeliveryTerms TEXT,

    ShipToAddress TEXT,

    InternalMemo TEXT,

    TermsConditions TEXT,

    Attachments TEXT,

    EnteredBy TEXT,

    CustomerOrderNo TEXT,

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

// Safe migrations for PurchaseOrders
[
    "ALTER TABLE PurchaseOrders ADD COLUMN PurchaseType TEXT",
    "ALTER TABLE PurchaseOrders ADD COLUMN ReleaseOption TEXT",
    "ALTER TABLE PurchaseOrders ADD COLUMN QuoteNo TEXT",
    "ALTER TABLE PurchaseOrders ADD COLUMN QuoteDate TEXT",
    "ALTER TABLE PurchaseOrders ADD COLUMN FreightCharges REAL DEFAULT 0",
    "ALTER TABLE PurchaseOrders ADD COLUMN OtherCharges TEXT",
    "ALTER TABLE PurchaseOrders ADD COLUMN SubTotal REAL DEFAULT 0",
    "ALTER TABLE PurchaseOrders ADD COLUMN CGSTAmount REAL DEFAULT 0",
    "ALTER TABLE PurchaseOrders ADD COLUMN SGSTAmount REAL DEFAULT 0",
    "ALTER TABLE PurchaseOrders ADD COLUMN IGSTAmount REAL DEFAULT 0",
    "ALTER TABLE PurchaseOrders ADD COLUMN PaymentTerms TEXT",
    "ALTER TABLE PurchaseOrders ADD COLUMN DeliveryTerms TEXT",
    "ALTER TABLE PurchaseOrders ADD COLUMN ShipToAddress TEXT",
    "ALTER TABLE PurchaseOrders ADD COLUMN InternalMemo TEXT",
    "ALTER TABLE PurchaseOrders ADD COLUMN TermsConditions TEXT",
    "ALTER TABLE PurchaseOrders ADD COLUMN Attachments TEXT",
    "ALTER TABLE PurchaseOrders ADD COLUMN EnteredBy TEXT",
    "ALTER TABLE PurchaseOrders ADD COLUMN CustomerOrderNo TEXT"
].forEach(sql => {
    db.run(sql, () => {});
});

// ======================================================
// PURCHASE ORDER DETAILS
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS PurchaseOrderDetails (

    PODetailID INTEGER PRIMARY KEY AUTOINCREMENT,

    POID INTEGER,

    IndentID INTEGER,

    IndentDetailID INTEGER,

    IndentNo TEXT,

    ProfitCenter TEXT,

    ItemID INTEGER,

    Color TEXT,

    SizeRange TEXT,

    CostPrice REAL DEFAULT 0,

    BalIndentQty REAL DEFAULT 0,

    Quantity REAL,

    Rate REAL,

    Amount REAL,

    ExFTYDate TEXT,

    MatReqDate TEXT,

    ReceivedQty REAL DEFAULT 0,

    PendingQty REAL DEFAULT 0,

    SupplierID INTEGER,

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

// Safe migrations for PurchaseOrderDetails
[
    "ALTER TABLE PurchaseOrderDetails ADD COLUMN IndentID INTEGER",
    "ALTER TABLE PurchaseOrderDetails ADD COLUMN IndentDetailID INTEGER",
    "ALTER TABLE PurchaseOrderDetails ADD COLUMN IndentNo TEXT",
    "ALTER TABLE PurchaseOrderDetails ADD COLUMN ProfitCenter TEXT",
    "ALTER TABLE PurchaseOrderDetails ADD COLUMN Color TEXT",
    "ALTER TABLE PurchaseOrderDetails ADD COLUMN SizeRange TEXT",
    "ALTER TABLE PurchaseOrderDetails ADD COLUMN CostPrice REAL DEFAULT 0",
    "ALTER TABLE PurchaseOrderDetails ADD COLUMN BalIndentQty REAL DEFAULT 0",
    "ALTER TABLE PurchaseOrderDetails ADD COLUMN ExFTYDate TEXT",
    "ALTER TABLE PurchaseOrderDetails ADD COLUMN MatReqDate TEXT",
    "ALTER TABLE PurchaseOrderDetails ADD COLUMN SupplierID INTEGER"
].forEach(sql => {
    db.run(sql, () => {});
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

// ======================================================
// EXTEND PURCHASE ORDERS SCHEMA & SEED DATA
// ======================================================

const extraColumns = [
    "DeliverTo TEXT DEFAULT 'Plot No. 9B'",
    "Currency TEXT DEFAULT 'INR'",
    "PurchaseType TEXT DEFAULT 'Regular PO'",
    "ExchangeRate REAL DEFAULT 1",
    "BillTo TEXT DEFAULT 'ALPINE APPARELS PVT. LTD.'",
    "EnteredBy TEXT DEFAULT 'Admin'",
    "EnteredOn TEXT",
    "UpdatedBy TEXT",
    "UpdatedOn TEXT",
    "ApproveTag TEXT DEFAULT 'PENDING'",
    "MaterialSource TEXT DEFAULT 'Domestic'"
];

extraColumns.forEach(colDef => {
    db.run(`ALTER TABLE PurchaseOrders ADD COLUMN ${colDef}`, () => {
        // Ignore column already exists errors
    });
});

// Seed sample suppliers and purchase orders matching reference ERP interface
setTimeout(() => {
    // 1. Ensure required suppliers exist
    const suppliers = [
        ["SUP-001", "TEMPESTI SPA", "Foreign", "Import"],
        ["SUP-002", "GUAN HONG HARDWARE PRODUCTS CO. LIMITED", "Foreign", "Import"],
        ["SUP-003", "ZIBO BANGHSI INDUSTRY & COMMERCE CO.LTD.", "Foreign", "Import"],
        ["SUP-004", "AMERICAN & EFIRD HK LTD", "Foreign", "Import"],
        ["SUP-005", "ALPINE APPARELS PVT. LTD.", "Domestic", "Domestic"]
    ];

    suppliers.forEach(([code, name, state, type]) => {
        db.run(
            `INSERT OR IGNORE INTO Suppliers (SupplierCode, SupplierName, State, Address) VALUES (?, ?, ?, ?)`,
            [code, name, state, type]
        );
    });

    // 2. Ensure sample items exist
    const sampleItems = [
        ["FAB-001", "Cotton Twill Fabric 220 GSM", "Fabric", "Mtrs", 250, 15, 30],
        ["ZIP-001", "YKK Metallic Zipper #5", "Accessories", "Pcs", 45, 10, 25],
        ["HDW-001", "Alloy Buckle Matte Finish", "Hardware", "Pcs", 80, 50, 100],
        ["THD-001", "Industrial Spun Polyester Thread", "Trims", "Cones", 120, 8, 20],
        ["BTN-001", "Resin Shirt Buttons 18L", "Accessories", "Gross", 35, 5, 15]
    ];

    sampleItems.forEach(([code, name, cat, uom, rate, minStock, reorder]) => {
        db.run(
            `INSERT OR IGNORE INTO Items (ItemCode, ItemName, Category, UOM, Rate, CurrentStock, MinStock, ReorderLevel) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [code, name, cat, uom, rate, minStock, minStock, reorder]
        );
    });

    // 3. Check if screenshot sample purchase orders exist, insert if not present
    db.get("SELECT COUNT(*) AS count FROM PurchaseOrders", (err, row) => {
        if (!err && row && row.count === 0) {
            const seedPOs = [
                {
                    PONo: "PO/AAPL9B/26-27/962",
                    PODate: "06-10-2026",
                    ApproveTag: "PENDING",
                    SupplierCode: "SUP-001",
                    DeliverTo: "Plot No. 9B",
                    Currency: "EURO",
                    PurchaseType: "Regular PO",
                    ExchangeRate: 96,
                    BillTo: "ALPINE APPARELS PVT. LTD.",
                    EnteredBy: "FahadHasan",
                    EnteredOn: "Oct 6 2026 5:44PM",
                    UpdatedBy: null,
                    UpdatedOn: null,
                    MaterialSource: "Import",
                    Status: "Open",
                    TotalAmount: 4512,
                    items: [
                        { ItemID: 1, Quantity: 27, Rate: 96, Amount: 2592 },
                        { ItemID: 2, Quantity: 20, Rate: 96, Amount: 1920 }
                    ]
                },
                {
                    PONo: "PO/AAPL9B/26-27/961",
                    PODate: "06-10-2026",
                    ApproveTag: "PENDING",
                    SupplierCode: "SUP-002",
                    DeliverTo: "Plot No. 9B",
                    Currency: "USD",
                    PurchaseType: "Regular PO",
                    ExchangeRate: 96,
                    BillTo: "ALPINE APPARELS PVT. LTD.",
                    EnteredBy: "FahadHasan",
                    EnteredOn: "Oct 6 2026 5:29PM",
                    UpdatedBy: "FahadHasan",
                    UpdatedOn: "Oct 6 2026 5:31PM",
                    MaterialSource: "Import",
                    Status: "Open",
                    TotalAmount: 84960,
                    items: [
                        { ItemID: 3, Quantity: 500, Rate: 96, Amount: 48000 },
                        { ItemID: 2, Quantity: 200, Rate: 96, Amount: 19200 },
                        { ItemID: 4, Quantity: 185, Rate: 96, Amount: 17760 }
                    ]
                },
                {
                    PONo: "PO/AAPL9B/26-27/960",
                    PODate: "06-10-2026",
                    ApproveTag: "PENDING",
                    SupplierCode: "SUP-003",
                    DeliverTo: "Plot No. 9B",
                    Currency: "USD",
                    PurchaseType: "Regular PO",
                    ExchangeRate: 96,
                    BillTo: "ALPINE APPARELS PVT. LTD.",
                    EnteredBy: "FahadHasan",
                    EnteredOn: "Oct 6 2026 5:28PM",
                    UpdatedBy: null,
                    UpdatedOn: null,
                    MaterialSource: "Import",
                    Status: "Open",
                    TotalAmount: 15648,
                    items: [
                        { ItemID: 1, Quantity: 100, Rate: 96, Amount: 9600 },
                        { ItemID: 5, Quantity: 63, Rate: 96, Amount: 6048 }
                    ]
                },
                {
                    PONo: "PO/AAPL9B/26-27/959",
                    PODate: "06-10-2026",
                    ApproveTag: "APPROVED",
                    SupplierCode: "SUP-004",
                    DeliverTo: "Plot No. 9B",
                    Currency: "USD",
                    PurchaseType: "Regular PO",
                    ExchangeRate: 96,
                    BillTo: "ALPINE APPARELS PVT. LTD.",
                    EnteredBy: "FahadHasan",
                    EnteredOn: "Oct 6 2026 4:07PM",
                    UpdatedBy: null,
                    UpdatedOn: null,
                    MaterialSource: "Import",
                    Status: "Approved",
                    TotalAmount: 8256,
                    items: [
                        { ItemID: 4, Quantity: 86, Rate: 96, Amount: 8256 }
                    ]
                },
                {
                    PONo: "PO/AAPL9B/26-27/958",
                    PODate: "06-10-2026",
                    ApproveTag: "APPROVED",
                    SupplierCode: "SUP-003",
                    DeliverTo: "Plot No. 9B",
                    Currency: "USD",
                    PurchaseType: "Regular PO",
                    ExchangeRate: 96,
                    BillTo: "ALPINE APPARELS PVT. LTD.",
                    EnteredBy: "FahadHasan",
                    EnteredOn: "Oct 6 2026 3:50PM",
                    UpdatedBy: "FahadHasan",
                    UpdatedOn: "Oct 6 2026 3:51PM",
                    MaterialSource: "Import",
                    Status: "Approved",
                    TotalAmount: 43305,
                    items: [
                        { ItemID: 1, Quantity: 251.0968, Rate: 96, Amount: 24105.29 },
                        { ItemID: 2, Quantity: 200, Rate: 96, Amount: 19200 }
                    ]
                }
            ];

            seedPOs.forEach(po => {
                db.get("SELECT SupplierID FROM Suppliers WHERE SupplierCode = ?", [po.SupplierCode], (sErr, sRow) => {
                    const supId = sRow ? sRow.SupplierID : null;
                    db.run(
                        `INSERT INTO PurchaseOrders (
                            PONo, PODate, SupplierID, DeliverTo, Currency, PurchaseType, ExchangeRate, 
                            BillTo, EnteredBy, EnteredOn, UpdatedBy, UpdatedOn, ApproveTag, MaterialSource, Status, TotalAmount, NetAmount
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            po.PONo, po.PODate, supId, po.DeliverTo, po.Currency, po.PurchaseType, po.ExchangeRate,
                            po.BillTo, po.EnteredBy, po.EnteredOn, po.UpdatedBy, po.UpdatedOn, po.ApproveTag, po.MaterialSource, po.Status, po.TotalAmount, po.TotalAmount
                        ],
                        function (insErr) {
                            if (!insErr && this.lastID) {
                                const newPoId = this.lastID;
                                po.items.forEach(item => {
                                    db.run(
                                        `INSERT INTO PurchaseOrderDetails (POID, ItemID, Quantity, Rate, Amount, ReceivedQty, PendingQty)
                                         VALUES (?, ?, ?, ?, ?, 0, ?)`,
                                        [newPoId, item.ItemID, item.Quantity, item.Rate, item.Amount, item.Quantity]
                                    );
                                });
                            }
                        }
                    );
                });
            });
        }
    });
}, 1000);

console.log("✅ Purchase Tables Loaded");