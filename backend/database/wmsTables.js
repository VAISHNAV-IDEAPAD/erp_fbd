const db = require("../config/database");

// ======================================================
// WMS BINS TABLE
// ======================================================
db.run(`
CREATE TABLE IF NOT EXISTS WMSBins (
    BinID INTEGER PRIMARY KEY AUTOINCREMENT,
    BinCode TEXT UNIQUE NOT NULL,
    WarehouseName TEXT NOT NULL DEFAULT 'RAW MATERIAL STORE 9B',
    Zone TEXT NOT NULL,
    Rack TEXT NOT NULL,
    Shelf TEXT NOT NULL,
    BinType TEXT DEFAULT 'Roll Bin',
    MaxCapacity REAL DEFAULT 500,
    CurrentQty REAL DEFAULT 0,
    UOM TEXT DEFAULT 'MTR',
    Status TEXT DEFAULT 'Available',
    Barcode TEXT,
    Remarks TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
`, err => {
    if (err) {
        console.log("❌ WMSBins :", err.message);
    } else {
        console.log("✓ WMSBins Ready");
        seedInitialBins();
    }
});

// ======================================================
// WMS ROLL & SERIAL NUMBERS TABLE
// ======================================================
db.run(`
CREATE TABLE IF NOT EXISTS WMSRollSerials (
    RollID INTEGER PRIMARY KEY AUTOINCREMENT,
    RollSerialNo TEXT UNIQUE NOT NULL,
    ItemCode TEXT NOT NULL,
    ItemName TEXT NOT NULL,
    LotNo TEXT,
    Shade TEXT,
    LengthQty REAL DEFAULT 0,
    UOM TEXT DEFAULT 'MTR',
    BinCode TEXT,
    Barcode TEXT,
    Status TEXT DEFAULT 'In Stock',
    RefDocNo TEXT,
    GeneratedDate TEXT,
    CreatedBy TEXT DEFAULT 'Admin',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
`, err => {
    if (err) console.log("❌ WMSRollSerials :", err.message);
    else {
        console.log("✓ WMSRollSerials Ready");
        seedInitialRollSerials();
    }
});

// ======================================================
// WMS BIN ALLOCATIONS TABLE
// ======================================================
db.run(`
CREATE TABLE IF NOT EXISTS WMSAllocations (
    AllocationID INTEGER PRIMARY KEY AUTOINCREMENT,
    AllocationNo TEXT UNIQUE NOT NULL,
    AllocationDate TEXT NOT NULL,
    WarehouseName TEXT NOT NULL,
    RefType TEXT DEFAULT 'Item Receipt (GRN)',
    RefDocNo TEXT,
    TotalQty REAL DEFAULT 0,
    TotalItems INTEGER DEFAULT 0,
    AllocatedBy TEXT DEFAULT 'Store Incharge',
    Status TEXT DEFAULT 'Completed',
    Remarks TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
`, err => {
    if (err) console.log("❌ WMSAllocations :", err.message);
    else console.log("✓ WMSAllocations Ready");
});

db.run(`
CREATE TABLE IF NOT EXISTS WMSAllocationItems (
    AllocationItemID INTEGER PRIMARY KEY AUTOINCREMENT,
    AllocationNo TEXT NOT NULL,
    ItemCode TEXT,
    ItemName TEXT,
    RollSerialNo TEXT,
    BinCode TEXT,
    AllocatedQty REAL DEFAULT 0,
    UOM TEXT,
    LotNo TEXT,
    Remarks TEXT
)
`, err => {
    if (err) console.log("❌ WMSAllocationItems :", err.message);
    else {
        console.log("✓ WMSAllocationItems Ready");
        seedInitialAllocations();
    }
});

// ======================================================
// WMS ISSUE FROM BIN TABLE
// ======================================================
db.run(`
CREATE TABLE IF NOT EXISTS WMSBinIssues (
    IssueID INTEGER PRIMARY KEY AUTOINCREMENT,
    IssueNo TEXT UNIQUE NOT NULL,
    IssueDate TEXT NOT NULL,
    WarehouseName TEXT NOT NULL,
    IssueReason TEXT DEFAULT 'Cutting Slip',
    RefDocNo TEXT,
    IssuedToDepartment TEXT DEFAULT 'Cutting Department',
    TotalQty REAL DEFAULT 0,
    TotalRows INTEGER DEFAULT 0,
    IssuedBy TEXT DEFAULT 'Tilak',
    Status TEXT DEFAULT 'Completed',
    Remarks TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
`, err => {
    if (err) console.log("❌ WMSBinIssues :", err.message);
    else console.log("✓ WMSBinIssues Ready");
});

db.run(`
CREATE TABLE IF NOT EXISTS WMSBinIssueItems (
    IssueItemID INTEGER PRIMARY KEY AUTOINCREMENT,
    IssueNo TEXT NOT NULL,
    ItemCode TEXT,
    ItemName TEXT,
    BinCode TEXT,
    RollSerialNo TEXT,
    PickQty REAL DEFAULT 0,
    UOM TEXT,
    Remarks TEXT
)
`, err => {
    if (err) console.log("❌ WMSBinIssueItems :", err.message);
    else {
        console.log("✓ WMSBinIssueItems Ready");
        seedInitialIssues();
    }
});

// ======================================================
// WMS STOCK IMPORTS TABLE
// ======================================================
db.run(`
CREATE TABLE IF NOT EXISTS WMSImports (
    ImportID INTEGER PRIMARY KEY AUTOINCREMENT,
    ImportDate TEXT NOT NULL,
    WarehouseName TEXT NOT NULL,
    ImportType TEXT DEFAULT 'Bin Opening Balance',
    FileName TEXT,
    TotalRows INTEGER DEFAULT 0,
    ValidRows INTEGER DEFAULT 0,
    Status TEXT DEFAULT 'Completed',
    ImportedBy TEXT DEFAULT 'Admin',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
`, err => {
    if (err) console.log("❌ WMSImports :", err.message);
    else console.log("✓ WMSImports Ready");
});

// ======================================================
// SEED INITIAL DATA FOR V-CONNECT INC. (PLOT NO. 9B)
// ======================================================

function seedInitialBins() {
    db.get("SELECT COUNT(*) AS count FROM WMSBins", [], (err, row) => {
        if (!err && row && (row.count === 0 || row.count === "0")) {
            const initialBins = [
                ["BIN-A-01-01", "RAW MATERIAL STORE 9B", "Zone A - Leather", "Rack A1", "Level 1", "Pallet Bin", 500, 250, "SQFT", "Partially Filled", "BAR-BIN-A0101", "Upper leather storage"],
                ["BIN-A-01-02", "RAW MATERIAL STORE 9B", "Zone A - Leather", "Rack A1", "Level 2", "Pallet Bin", 500, 0, "SQFT", "Available", "BAR-BIN-A0102", "Upper leather top level"],
                ["BIN-A-02-01", "RAW MATERIAL STORE 9B", "Zone A - Leather", "Rack A2", "Level 1", "Pallet Bin", 600, 280, "SQFT", "Partially Filled", "BAR-BIN-A0201", "Crust & lining leather"],
                ["BIN-B-01-01", "RAW MATERIAL STORE 9B", "Zone B - Fabric & Lining", "Rack B1", "Level 1", "Roll Bin", 1200, 850, "MTR", "Partially Filled", "BAR-BIN-B0101", "Cotton twill rolls"],
                ["BIN-B-01-02", "RAW MATERIAL STORE 9B", "Zone B - Fabric & Lining", "Rack B1", "Level 2", "Roll Bin", 1000, 600, "MTR", "Partially Filled", "BAR-BIN-B0102", "Interlining & fused fabrics"],
                ["BIN-B-02-01", "RAW MATERIAL STORE 9B", "Zone B - Fabric & Lining", "Rack B2", "Level 1", "Roll Bin", 1500, 0, "MTR", "Available", "BAR-BIN-B0201", "Empty fabric rack"],
                ["BIN-C-01-01", "ACCESSORIES GODOWN 18", "Zone C - Hardware", "Rack C1", "Level 1", "Shelf Bin", 10000, 5000, "SET", "Partially Filled", "BAR-BIN-C0101", "Rivets, eyelets & studs"],
                ["BIN-C-01-02", "ACCESSORIES GODOWN 18", "Zone C - Hardware", "Rack C1", "Level 2", "Shelf Bin", 3000, 1500, "PCS", "Partially Filled", "BAR-BIN-C0102", "YKK metallic zippers"],
                ["BIN-D-01-01", "RAW MATERIAL STORE 9B", "Zone D - Thread & Trims", "Rack D1", "Level 1", "Shelf Bin", 500, 120, "CONE", "Partially Filled", "BAR-BIN-D0101", "Bonded nylon threads"]
            ];

            const stmt = "INSERT INTO WMSBins (BinCode, WarehouseName, Zone, Rack, Shelf, BinType, MaxCapacity, CurrentQty, UOM, Status, Barcode, Remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            initialBins.forEach(b => {
                db.run(stmt, b, () => {});
            });
            console.log("✓ Seeded WMSBins for Plot No. 9B");
        }
    });
}

function seedInitialRollSerials() {
    db.get("SELECT COUNT(*) AS count FROM WMSRollSerials", [], (err, row) => {
        if (!err && row && (row.count === 0 || row.count === "0")) {
            const rolls = [
                ["RL-2627-1001", "LTH-1093", "COW CULATTAS SINGLE LEATHER", "LOT-9B-2026-A", "BLACK", 150, "SQFT", "BIN-A-01-01", "BAR-RL-1001", "Allocated", "GRN-2026-081", "2026-10-22", "Tilak"],
                ["RL-2627-1002", "LTH-1093", "COW CULATTAS SINGLE LEATHER", "LOT-9B-2026-A", "BLACK", 100, "SQFT", "BIN-A-01-01", "BAR-RL-1002", "Allocated", "GRN-2026-081", "2026-10-22", "Tilak"],
                ["RL-2627-1003", "LTH-1112", "COW ECO VEG SIDE CRUST LEATHER", "LOT-9B-2026-B", "TAN", 280, "SQFT", "BIN-A-02-01", "BAR-RL-1003", "Allocated", "GRN-2026-083", "2026-10-23", "Tilak"],
                ["RL-2627-2001", "FAB-3011", "COTTON TWILL LINING 120 GSM", "LOT-FAB-441", "WHITE", 450, "MTR", "BIN-B-01-01", "BAR-RL-2001", "Allocated", "GRN-2026-085", "2026-10-24", "Suresh"],
                ["RL-2627-2002", "FAB-3011", "COTTON TWILL LINING 120 GSM", "LOT-FAB-441", "WHITE", 400, "MTR", "BIN-B-01-01", "BAR-RL-2002", "Allocated", "GRN-2026-085", "2026-10-24", "Suresh"],
                ["RL-2627-2003", "RNF-1085", "HIGH DENSITY TOPLINER 0.4MM", "LOT-RNF-09", "BLACK", 600, "MTR", "BIN-B-01-02", "BAR-RL-2003", "Allocated", "GRN-2026-086", "2026-10-24", "Suresh"]
            ];

            const stmt = "INSERT INTO WMSRollSerials (RollSerialNo, ItemCode, ItemName, LotNo, Shade, LengthQty, UOM, BinCode, Barcode, Status, RefDocNo, GeneratedDate, CreatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            rolls.forEach(r => {
                db.run(stmt, r, () => {});
            });
            console.log("✓ Seeded WMSRollSerials");
        }
    });
}

function seedInitialAllocations() {
    db.get("SELECT COUNT(*) AS count FROM WMSAllocations", [], (err, row) => {
        if (!err && row && (row.count === 0 || row.count === "0")) {
            db.run(
                "INSERT INTO WMSAllocations (AllocationNo, AllocationDate, WarehouseName, RefType, RefDocNo, TotalQty, TotalItems, AllocatedBy, Status, Remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                ["BA/9B/2627/001", "2026-10-22", "RAW MATERIAL STORE 9B", "Item Receipt (GRN)", "GRN-2026-081", 250, 2, "Tilak", "Completed", "Allocated cow leather rolls to Zone A rack 1"],
                () => {}
            );
            db.run(
                "INSERT INTO WMSAllocationItems (AllocationNo, ItemCode, ItemName, RollSerialNo, BinCode, AllocatedQty, UOM, LotNo, Remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                ["BA/9B/2627/001", "LTH-1093", "COW CULATTAS SINGLE LEATHER", "RL-2627-1001", "BIN-A-01-01", 150, "SQFT", "LOT-9B-2026-A", "First cut batch"],
                () => {}
            );
            db.run(
                "INSERT INTO WMSAllocationItems (AllocationNo, ItemCode, ItemName, RollSerialNo, BinCode, AllocatedQty, UOM, LotNo, Remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                ["BA/9B/2627/001", "LTH-1093", "COW CULATTAS SINGLE LEATHER", "RL-2627-1002", "BIN-A-01-01", 100, "SQFT", "LOT-9B-2026-A", "Second roll batch"],
                () => {}
            );

            db.run(
                "INSERT INTO WMSAllocations (AllocationNo, AllocationDate, WarehouseName, RefType, RefDocNo, TotalQty, TotalItems, AllocatedBy, Status, Remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                ["BA/9B/2627/002", "2026-10-24", "RAW MATERIAL STORE 9B", "Item Receipt (GRN)", "GRN-2026-085", 850, 2, "Suresh", "Completed", "Cotton twill rolls put-away to Bin B-01-01"],
                () => {}
            );
        }
    });
}

function seedInitialIssues() {
    db.get("SELECT COUNT(*) AS count FROM WMSBinIssues", [], (err, row) => {
        if (!err && row && (row.count === 0 || row.count === "0")) {
            db.run(
                "INSERT INTO WMSBinIssues (IssueNo, IssueDate, WarehouseName, IssueReason, RefDocNo, IssuedToDepartment, TotalQty, TotalRows, IssuedBy, Status, Remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                ["BI/9B/2627/001", "2026-10-24", "RAW MATERIAL STORE 9B", "Cutting Slip", "CS/2627/098", "Cutting Floor Line 1", 50, 1, "Tilak", "Completed", "Picked for batch sample cut"],
                () => {}
            );
            db.run(
                "INSERT INTO WMSBinIssueItems (IssueNo, ItemCode, ItemName, BinCode, RollSerialNo, PickQty, UOM, Remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                ["BI/9B/2627/001", "FAB-3011", "COTTON TWILL LINING 120 GSM", "BIN-B-01-01", "RL-2627-2001", 50, "MTR", "Sample cutting"],
                () => {}
            );
        }
    });
}
