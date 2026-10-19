const db = require("../config/database");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS RejectionReturns (
            RejectionReturnID INTEGER PRIMARY KEY AUTOINCREMENT,
            ReturnNo TEXT,
            RejectionNo TEXT,
            ReturnDate TEXT,
            SupplierName TEXT,
            Currency TEXT DEFAULT 'INR',
            ExchangeRate REAL DEFAULT 1.0,
            Remark TEXT,
            InternalMemo TEXT,
            EnteredBy TEXT DEFAULT 'Admin',
            EnteredOn TEXT,
            UpdatedBy TEXT DEFAULT 'Admin',
            UpdatedOn TEXT,
            TotalQty REAL DEFAULT 0,
            NoOfRows INTEGER DEFAULT 0,
            SubTotal REAL DEFAULT 0,
            TotalAmount REAL DEFAULT 0,
            GRNNos TEXT,
            Groups TEXT,
            ItemsFilter TEXT,
            ItemsJSON TEXT,
            OtherChargesJSON TEXT,
            Status TEXT DEFAULT 'Active',
            CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});
