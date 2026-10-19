const db = require("../config/database");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS GateEntries (
            GateEntryID INTEGER PRIMARY KEY AUTOINCREMENT,
            GateEntryPrefix TEXT DEFAULT 'GE/9B/2627/',
            GateEntryNo TEXT,
            GateEntryDate TEXT,
            GateEntryInTime TEXT,
            SupplierDCDate TEXT,
            SupplierDCNo TEXT,
            InvoiceDate TEXT,
            InvoiceNo TEXT,
            SupplierName TEXT,
            Weight REAL DEFAULT 0,
            Boxes INTEGER DEFAULT 0,
            ReceivedBy TEXT,
            TransportDetails TEXT,
            TransporterDocRefNo TEXT,
            ItemDetails TEXT,
            Remarks TEXT,
            POReference TEXT,
            QtyUnitDetails TEXT,
            Amount REAL DEFAULT 0,
            GRNNo TEXT,
            GRNDate TEXT,
            EnteredBy TEXT DEFAULT 'Admin',
            Status TEXT DEFAULT 'Pending',
            CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});
