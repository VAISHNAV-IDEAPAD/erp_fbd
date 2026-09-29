const db = require("../config/database");

// =====================================================
// SUPPLIERS
// =====================================================

db.run(`
    CREATE TABLE IF NOT EXISTS Suppliers(
        SupplierID INTEGER PRIMARY KEY AUTOINCREMENT,
        SupplierCode TEXT UNIQUE,
        SupplierName TEXT NOT NULL,
        ContactPerson TEXT,
        Phone TEXT,
        Email TEXT,
        GSTNo TEXT,
        Address TEXT,
        City TEXT,
        State TEXT,
        Pincode TEXT,
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, err => {

    if (err)
        console.log("❌ Suppliers :", err.message);
    else
        console.log("✓ Suppliers Ready");

});


// =====================================================
// BUYERS
// =====================================================

db.run(`
    CREATE TABLE IF NOT EXISTS Buyers(
        BuyerID INTEGER PRIMARY KEY AUTOINCREMENT,
        BuyerCode TEXT UNIQUE,
        BuyerName TEXT NOT NULL,
        ContactPerson TEXT,
        Phone TEXT,
        Email TEXT,
        Address TEXT,
        Country TEXT,
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, err => {

    if (err)
        console.log("❌ Buyers :", err.message);
    else
        console.log("✓ Buyers Ready");

});


// =====================================================
// DEPARTMENTS
// =====================================================

db.run(`
    CREATE TABLE IF NOT EXISTS Departments(
        DepartmentID INTEGER PRIMARY KEY AUTOINCREMENT,
        DepartmentCode TEXT UNIQUE NOT NULL,
        DepartmentName TEXT NOT NULL,
        Status TEXT DEFAULT 'Active',
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, err => {

    if (err) {

        console.error(
            "❌ Departments table error:",
            err.message
        );

    } else {

        console.log(
            "✓ Departments table ready"
        );

        db.run(`
            INSERT OR IGNORE INTO Departments
            (DepartmentCode, DepartmentName)
            VALUES
            ('STORE','Store'),
            ('PROD','Production'),
            ('CUT','Cutting'),
            ('PREP','Preparation'),
            ('ASM','Assembly'),
            ('PACK','Packaging'),
            ('QC','Quality Control'),
            ('FG','Finished Goods'),
            ('PUR','Purchase'),
            ('MERCH','Merchandising'),
            ('ADMIN','Administration'),
            ('HR','Human Resources')
        `);

    }

});


// =====================================================
// CUSTOMERS
// =====================================================

db.run(`
    CREATE TABLE IF NOT EXISTS Customers(
        CustomerID INTEGER PRIMARY KEY AUTOINCREMENT,
        CustomerCode TEXT UNIQUE,
        CustomerName TEXT NOT NULL,
        ContactPerson TEXT,
        Phone TEXT,
        Email TEXT,
        GSTNo TEXT,
        Address TEXT,
        Country TEXT,
        Status TEXT DEFAULT 'Active',
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, err => {

    if (err)
        console.log("❌ Customers :", err.message);
    else
        console.log("✓ Customers Ready");

});


// =====================================================
// STYLES
// =====================================================

db.run(`
    CREATE TABLE IF NOT EXISTS Styles(
        StyleID INTEGER PRIMARY KEY AUTOINCREMENT,
        StyleCode TEXT UNIQUE,
        StyleName TEXT NOT NULL,
        BuyerID INTEGER,
        Season TEXT,
        Category TEXT,
        Status TEXT DEFAULT 'Active',
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(BuyerID)
            REFERENCES Buyers(BuyerID)
    )
`, err => {

    if (err)
        console.log("❌ Styles :", err.message);
    else
        console.log("✓ Styles Ready");

});


// =====================================================
// WAREHOUSES / GODOWNS
// =====================================================

db.run(`
    CREATE TABLE IF NOT EXISTS Warehouses(
        WarehouseID INTEGER PRIMARY KEY AUTOINCREMENT,
        WarehouseCode TEXT UNIQUE,
        WarehouseName TEXT NOT NULL,
        Location TEXT,
        Status TEXT DEFAULT 'Active',
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, err => {

    if (err) {

        console.log(
            "❌ Warehouses :",
            err.message
        );

    } else {

        console.log("✓ Warehouses Ready");


        // =================================================
        // COMPANY 9B DEFAULT WAREHOUSES
        // =================================================

        const warehouses = [

            [
                "RMS-9B",
                "Raw Material Store 9B",
                "Company 9B"
            ],

            [
                "STORE-9B",
                "Store 9B",
                "Company 9B"
            ],

            [
                "SFS-9B",
                "Semi Finish Store 9B",
                "Company 9B"
            ],

            [
                "SOS-9B",
                "Subcontract Order Store 9B",
                "Company 9B"
            ]

        ];


        warehouses.forEach(warehouse => {

            db.run(`
                INSERT OR IGNORE INTO Warehouses
                (
                    WarehouseCode,
                    WarehouseName,
                    Location,
                    Status
                )
                VALUES (?, ?, ?, 'Active')
            `, warehouse, insertErr => {

                if (insertErr) {

                    console.log(
                        "❌ Warehouse insert:",
                        insertErr.message
                    );

                }

            });

        });

    }

});


// =====================================================
// COLOURS MASTER
// =====================================================

db.run(`
    CREATE TABLE IF NOT EXISTS Colours(
        ColourID INTEGER PRIMARY KEY AUTOINCREMENT,
        ColourCode TEXT UNIQUE NOT NULL,
        ColourName TEXT NOT NULL,
        Description TEXT,
        Status TEXT DEFAULT 'Active',
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, err => {

    if (err)
        console.log("❌ Colours :", err.message);
    else
        console.log("✓ Colours Ready");

});


// =====================================================
// ITEMS
// =====================================================

db.run(`
    CREATE TABLE IF NOT EXISTS Items(
        ItemID INTEGER PRIMARY KEY AUTOINCREMENT,

        ItemCode TEXT UNIQUE NOT NULL,

        ItemName TEXT NOT NULL,

        ItemType TEXT,

        Category TEXT,

        SubCategory TEXT,

        MaterialType TEXT,

        UOM TEXT,

        Color TEXT,

        Size TEXT,

        Thickness TEXT,

        GSM REAL,

        SupplierID INTEGER,

        Rate REAL DEFAULT 0,

        OpeningStock REAL DEFAULT 0,

        CurrentStock REAL DEFAULT 0,

        MinStock REAL DEFAULT 0,

        MaxStock REAL DEFAULT 0,

        ReorderLevel REAL DEFAULT 0,

        HSNCode TEXT,

        GSTPercent REAL DEFAULT 0,

        Remarks TEXT,

        Status TEXT DEFAULT 'Active',

        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(SupplierID)
            REFERENCES Suppliers(SupplierID)
    )
`, err => {

    if (err)
        console.log("❌ Items :", err.message);
    else
        console.log("✓ Items Ready");

});