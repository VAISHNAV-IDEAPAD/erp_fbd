const db = require("../config/database");

db.serialize(() => {

    // ======================================================
    // SALES ORDERS
    // ======================================================

    db.run(`
    CREATE TABLE IF NOT EXISTS SalesOrders (

        SOID INTEGER PRIMARY KEY AUTOINCREMENT,

        SONo TEXT UNIQUE,

        SODate TEXT,

        CustomerID INTEGER,

        DeliveryDate TEXT,

        TotalAmount REAL DEFAULT 0,

        GSTAmount REAL DEFAULT 0,

        NetAmount REAL DEFAULT 0,

        Status TEXT DEFAULT 'Open',

        Remarks TEXT,

        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (CustomerID)
            REFERENCES Customers(CustomerID)

    )
    `, function (err) {
        if (err) {
            console.error("❌ SalesOrders :", err.message);
        } else {
            console.log("✓ SalesOrders Ready");
        }
    });

    // ======================================================
    // SALES ORDER DETAILS
    // ======================================================

    db.run(`
    CREATE TABLE IF NOT EXISTS SalesOrderDetails (

        SODetailID INTEGER PRIMARY KEY AUTOINCREMENT,

        SOID INTEGER,

        StyleID INTEGER,

        Qty REAL,

        Rate REAL,

        Amount REAL,

        DispatchedQty REAL DEFAULT 0,

        PendingQty REAL DEFAULT 0,

        FOREIGN KEY (SOID)
            REFERENCES SalesOrders(SOID)
            ON DELETE CASCADE,

        FOREIGN KEY (StyleID)
            REFERENCES Styles(StyleID)

    )
    `, function (err) {
        if (err) {
            console.error("❌ SalesOrderDetails :", err.message);
        } else {
            console.log("✓ SalesOrderDetails Ready");
        }
    });

    // ======================================================
    // DISPATCHES
    // ======================================================

    db.run(`
    CREATE TABLE IF NOT EXISTS Dispatches (

        DispatchID INTEGER PRIMARY KEY AUTOINCREMENT,

        DispatchNo TEXT UNIQUE,

        SOID INTEGER,

        CustomerID INTEGER,

        DispatchDate TEXT,

        Remarks TEXT,

        Status TEXT DEFAULT 'Open',

        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (SOID)
            REFERENCES SalesOrders(SOID),

        FOREIGN KEY (CustomerID)
            REFERENCES Customers(CustomerID)

    )
    `, function (err) {
        if (err) {
            console.error("❌ Dispatches :", err.message);
        } else {
            console.log("✓ Dispatches Ready");
        }
    });

    // ======================================================
    // DISPATCH DETAILS
    // ======================================================

    db.run(`
    CREATE TABLE IF NOT EXISTS DispatchDetails (

        DispatchDetailID INTEGER PRIMARY KEY AUTOINCREMENT,

        DispatchID INTEGER,

        StyleID INTEGER,

        Qty REAL,

        Rate REAL,

        Amount REAL,

        FOREIGN KEY (DispatchID)
            REFERENCES Dispatches(DispatchID)
            ON DELETE CASCADE,

        FOREIGN KEY (StyleID)
            REFERENCES Styles(StyleID)

    )
    `, function (err) {
        if (err) {
            console.error("❌ DispatchDetails :", err.message);
        } else {
            console.log("✓ DispatchDetails Ready");
        }
    });

    // ======================================================
    // SALES INVOICES
    // ======================================================

    db.run(`
    CREATE TABLE IF NOT EXISTS SalesInvoices (

        InvoiceID INTEGER PRIMARY KEY AUTOINCREMENT,

        InvoiceNo TEXT UNIQUE,

        DispatchID INTEGER,

        SOID INTEGER,

        CustomerID INTEGER,

        InvoiceDate TEXT,

        TotalAmount REAL DEFAULT 0,

        GSTAmount REAL DEFAULT 0,

        NetAmount REAL DEFAULT 0,

        Status TEXT DEFAULT 'Pending',

        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (DispatchID)
            REFERENCES Dispatches(DispatchID),

        FOREIGN KEY (SOID)
            REFERENCES SalesOrders(SOID),

        FOREIGN KEY (CustomerID)
            REFERENCES Customers(CustomerID)

    )
    `, function (err) {
        if (err) {
            console.error("❌ SalesInvoices :", err.message);
        } else {
            console.log("✓ SalesInvoices Ready");
        }
    });

    // ======================================================
    // SALES INVOICE DETAILS
    // ======================================================

    db.run(`
    CREATE TABLE IF NOT EXISTS SalesInvoiceDetails (

        InvoiceDetailID INTEGER PRIMARY KEY AUTOINCREMENT,

        InvoiceID INTEGER,

        StyleID INTEGER,

        Qty REAL,

        Rate REAL,

        Amount REAL,

        FOREIGN KEY (InvoiceID)
            REFERENCES SalesInvoices(InvoiceID)
            ON DELETE CASCADE,

        FOREIGN KEY (StyleID)
            REFERENCES Styles(StyleID)

    )
    `, function (err) {
        if (err) {
            console.error("❌ SalesInvoiceDetails :", err.message);
        } else {
            console.log("✓ SalesInvoiceDetails Ready");
        }
    });

    // ======================================================
    // CUSTOMER PAYMENTS
    // ======================================================

    db.run(`
    CREATE TABLE IF NOT EXISTS CustomerPayments (

        PaymentID INTEGER PRIMARY KEY AUTOINCREMENT,

        PaymentNo TEXT UNIQUE,

        CustomerID INTEGER,

        InvoiceID INTEGER,

        PaymentDate TEXT,

        PaymentMode TEXT,

        ReferenceNo TEXT,

        Amount REAL,

        Remarks TEXT,

        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (CustomerID)
            REFERENCES Customers(CustomerID),

        FOREIGN KEY (InvoiceID)
            REFERENCES SalesInvoices(InvoiceID)

    )
    `, function (err) {
        if (err) {
            console.error("❌ CustomerPayments :", err.message);
        } else {
            console.log("✓ CustomerPayments Ready");
        }
    });

    console.log("✅ Sales Tables Loaded");

});