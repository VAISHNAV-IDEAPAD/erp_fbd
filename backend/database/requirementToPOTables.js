const db = require("../config/database");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS RequirementToPO (
            RequirementID INTEGER PRIMARY KEY AUTOINCREMENT,
            ItemGroup TEXT,
            Customer TEXT,
            BuyerPO TEXT,
            Product TEXT,
            ProdColor TEXT,
            RequiredDate TEXT,
            RequiredDateISO TEXT,
            IODate TEXT,
            IODateISO TEXT,
            IONo TEXT,
            Item TEXT,
            UOM TEXT,
            Color TEXT,
            SizeRange TEXT,
            Size TEXT,
            RequiredQty REAL DEFAULT 0,
            IndentQty REAL DEFAULT 0,
            BalanceToIndent REAL DEFAULT 0,
            ExcessIndent REAL DEFAULT 0,
            POQty REAL DEFAULT 0,
            POValue REAL DEFAULT 0,
            BalanceToPO REAL DEFAULT 0,
            ExcessPO REAL DEFAULT 0,
            GRNQty REAL DEFAULT 0,
            GRNValue REAL DEFAULT 0,
            BalanceToGRN REAL DEFAULT 0,
            ExcessGRN REAL DEFAULT 0,
            ISSQty REAL DEFAULT 0,
            ISSValue REAL DEFAULT 0,
            BalanceToISS REAL DEFAULT 0,
            ExcessISS REAL DEFAULT 0,
            ExcessISSValue REAL DEFAULT 0,
            ItemCategory TEXT
        )
    `);

    db.run("CREATE INDEX IF NOT EXISTS idx_reqtopo_iodate ON RequirementToPO(IODateISO)");
    db.run("CREATE INDEX IF NOT EXISTS idx_reqtopo_group ON RequirementToPO(ItemGroup)");
    db.run("CREATE INDEX IF NOT EXISTS idx_reqtopo_customer ON RequirementToPO(Customer)");
    db.run("CREATE INDEX IF NOT EXISTS idx_reqtopo_category ON RequirementToPO(ItemCategory)");
    db.run("CREATE INDEX IF NOT EXISTS idx_reqtopo_iono ON RequirementToPO(IONo)");
});
