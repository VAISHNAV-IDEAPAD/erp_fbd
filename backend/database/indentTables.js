const db = require("../config/database");

db.serialize(() => {

    // ======================================================
    // INDENTS
    // ======================================================

    db.run(`
    CREATE TABLE IF NOT EXISTS Indents (

        IndentID INTEGER PRIMARY KEY AUTOINCREMENT,

        IndentNo TEXT UNIQUE NOT NULL,

        IndentDate TEXT NOT NULL,

        DepartmentID INTEGER,

        EmployeeID INTEGER,

        WarehouseID INTEGER,

        RequiredDate TEXT,

        Priority TEXT DEFAULT 'Normal',

        Status TEXT DEFAULT 'Draft',

        Remarks TEXT,

        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (DepartmentID)
            REFERENCES Departments(DepartmentID),

        FOREIGN KEY (EmployeeID)
            REFERENCES Employees(EmployeeID),

        FOREIGN KEY (WarehouseID)
            REFERENCES Warehouses(WarehouseID)

    )
    `, function (err) {

        if (err) {
            console.error("❌ Indents :", err.message);
        } else {
            console.log("✓ Indents Ready");
        }

    });

    // ======================================================
    // INDENT DETAILS
    // ======================================================

    db.run(`
    CREATE TABLE IF NOT EXISTS IndentDetails (

        DetailID INTEGER PRIMARY KEY AUTOINCREMENT,

        IndentID INTEGER NOT NULL,

        ItemID INTEGER NOT NULL,

        Qty REAL NOT NULL,

        UOM TEXT,

        Remarks TEXT,

        FOREIGN KEY (IndentID)
            REFERENCES Indents(IndentID)
            ON DELETE CASCADE,

        FOREIGN KEY (ItemID)
            REFERENCES Items(ItemID)

    )
    `, function (err) {

        if (err) {
            console.error("❌ IndentDetails :", err.message);
        } else {
            console.log("✓ IndentDetails Ready");
        }

    });

    // ======================================================
    // INDEXES
    // ======================================================

    const indexes = [
        "CREATE INDEX IF NOT EXISTS IDX_INDENT_NO ON Indents(IndentNo)",
        "CREATE INDEX IF NOT EXISTS IDX_INDENT_DATE ON Indents(IndentDate)",
        "CREATE INDEX IF NOT EXISTS IDX_INDENT_STATUS ON Indents(Status)",
        "CREATE INDEX IF NOT EXISTS IDX_INDENT_DEPARTMENT ON Indents(DepartmentID)",
        "CREATE INDEX IF NOT EXISTS IDX_INDENTDETAIL_INDENT ON IndentDetails(IndentID)",
        "CREATE INDEX IF NOT EXISTS IDX_INDENTDETAIL_ITEM ON IndentDetails(ItemID)"
    ];

    indexes.forEach(sql => {
        db.run(sql, function (err) {
            if (err) {
                console.error("❌ Index Error:", err.message);
                console.error(sql);
            }
        });
    });

    console.log("✅ Indent Tables Loaded");

});