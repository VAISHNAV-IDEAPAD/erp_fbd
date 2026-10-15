const db = require("../config/database");

// ======================================================
// ITEM REQUISITIONS & ITEM REQUISITION DETAILS TABLES
// Matches TPCS Fashion ERP - Item Requisition Note
// ======================================================

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS ItemRequisitions (
        RequisitionID INTEGER PRIMARY KEY AUTOINCREMENT,
        ReqNo TEXT UNIQUE,
        IssueNo TEXT DEFAULT '',
        ReqDate TEXT,
        Associate TEXT DEFAULT '',
        Warehouse TEXT DEFAULT '',
        Remark TEXT DEFAULT '',
        InternalMemo TEXT DEFAULT '',
        Department TEXT DEFAULT '',
        Transporter TEXT DEFAULT '',
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
        if (err) console.log("❌ ItemRequisitions :", err.message);
        else console.log("✓ ItemRequisitions Table Ready");
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS ItemRequisitionDetails (
        DetailID INTEGER PRIMARY KEY AUTOINCREMENT,
        RequisitionID INTEGER,
        ItemCode TEXT,
        ItemName TEXT,
        Color TEXT,
        Quantity REAL DEFAULT 0,
        UOM TEXT,
        RequiredDate TEXT,
        Remarks TEXT,
        FOREIGN KEY(RequisitionID) REFERENCES ItemRequisitions(RequisitionID) ON DELETE CASCADE
    )
    `, err => {
        if (err) console.log("❌ ItemRequisitionDetails :", err.message);
        else console.log("✓ ItemRequisitionDetails Table Ready");
    });
});

console.log("✅ Item Requisition Tables Initialized");

module.exports = {};
