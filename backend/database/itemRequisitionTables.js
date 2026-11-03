const db = require("../config/database");

// ======================================================
// ITEM REQUISITIONS & ITEM REQUISITION DETAILS TABLES
// Matches TPCS Fashion / Jenixcloud ERP - Item Requisition Note
// ======================================================

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS ItemRequisitions (
        RequisitionID INTEGER PRIMARY KEY AUTOINCREMENT,
        ReqNo TEXT UNIQUE,
        ReqType TEXT DEFAULT 'Production',
        Shift TEXT DEFAULT 'Shift I',
        IssueNo TEXT DEFAULT '',
        ReqDate TEXT,
        Associate TEXT DEFAULT '',
        Supplier TEXT DEFAULT '',
        Warehouse TEXT DEFAULT '',
        StoreName TEXT DEFAULT 'RAW MATERIAL STORE 9B',
        ReceivedBy TEXT DEFAULT '',
        ApprovedBy TEXT DEFAULT '',
        IssuedBy TEXT DEFAULT '',
        Department TEXT DEFAULT '',
        Currency TEXT DEFAULT 'INR',
        ExchangeRate REAL DEFAULT 1.00,
        Remark TEXT DEFAULT '',
        InternalMemo TEXT DEFAULT '',
        Transporter TEXT DEFAULT 'In-House Transfer',
        ReqBy TEXT DEFAULT '',
        EntryOn TEXT DEFAULT '',
        Status TEXT DEFAULT 'Pending',
        EntryBy TEXT DEFAULT 'Admin',
        UpdatedBy TEXT DEFAULT '',
        TotalQty REAL DEFAULT 0,
        RowCount INTEGER DEFAULT 1,
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `, err => {
        if (err) console.log("ItemRequisitions table error:", err.message);
        else console.log("ItemRequisitions Table Ready");
    });

    // Safely add any new columns to existing ItemRequisitions table
    const reqCols = [
        "ALTER TABLE ItemRequisitions ADD COLUMN ReqType TEXT DEFAULT 'Production'",
        "ALTER TABLE ItemRequisitions ADD COLUMN Shift TEXT DEFAULT 'Shift I'",
        "ALTER TABLE ItemRequisitions ADD COLUMN Supplier TEXT DEFAULT ''",
        "ALTER TABLE ItemRequisitions ADD COLUMN StoreName TEXT DEFAULT 'RAW MATERIAL STORE 9B'",
        "ALTER TABLE ItemRequisitions ADD COLUMN ReceivedBy TEXT DEFAULT ''",
        "ALTER TABLE ItemRequisitions ADD COLUMN ApprovedBy TEXT DEFAULT ''",
        "ALTER TABLE ItemRequisitions ADD COLUMN IssuedBy TEXT DEFAULT ''",
        "ALTER TABLE ItemRequisitions ADD COLUMN Currency TEXT DEFAULT 'INR'",
        "ALTER TABLE ItemRequisitions ADD COLUMN ExchangeRate REAL DEFAULT 1.00"
    ];
    reqCols.forEach(sql => {
        db.run(sql, () => {});
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS ItemRequisitionDetails (
        DetailID INTEGER PRIMARY KEY AUTOINCREMENT,
        RequisitionID INTEGER,
        IoNo TEXT DEFAULT '',
        ItemCode TEXT DEFAULT '',
        ItemName TEXT DEFAULT '',
        Variant TEXT DEFAULT '',
        SizeRange TEXT DEFAULT '',
        Color TEXT DEFAULT '',
        Quantity REAL DEFAULT 0,
        UOM TEXT DEFAULT 'PCS',
        RequiredDate TEXT DEFAULT '',
        Rate REAL DEFAULT 0,
        Amount REAL DEFAULT 0,
        Remarks TEXT DEFAULT '',
        FOREIGN KEY(RequisitionID) REFERENCES ItemRequisitions(RequisitionID) ON DELETE CASCADE
    )
    `, err => {
        if (err) console.log("ItemRequisitionDetails table error:", err.message);
        else console.log("ItemRequisitionDetails Table Ready");
    });

    // Safely add any new columns to existing ItemRequisitionDetails table
    const detailCols = [
        "ALTER TABLE ItemRequisitionDetails ADD COLUMN IoNo TEXT DEFAULT ''",
        "ALTER TABLE ItemRequisitionDetails ADD COLUMN Variant TEXT DEFAULT ''",
        "ALTER TABLE ItemRequisitionDetails ADD COLUMN SizeRange TEXT DEFAULT ''",
        "ALTER TABLE ItemRequisitionDetails ADD COLUMN Rate REAL DEFAULT 0",
        "ALTER TABLE ItemRequisitionDetails ADD COLUMN Amount REAL DEFAULT 0"
    ];
    detailCols.forEach(sql => {
        db.run(sql, () => {});
    });
});

console.log("Item Requisition Tables Initialized");

module.exports = {};
