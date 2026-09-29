const db = require("../config/database");

db.serialize(() => {

    // ======================================================
    // APPROVAL LEVELS
    // ======================================================

    db.run(`
    CREATE TABLE IF NOT EXISTS ApprovalLevels (

        ApprovalLevelID INTEGER PRIMARY KEY AUTOINCREMENT,

        ModuleName TEXT NOT NULL,
        LevelNo INTEGER NOT NULL,
        LevelName TEXT NOT NULL,
        RoleName TEXT NOT NULL,

        IsFinal INTEGER DEFAULT 0,
        Status TEXT DEFAULT 'Active',

        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

        UNIQUE(ModuleName, LevelNo)

    )
    `, function (err) {
        if (err) {
            console.error("❌ ApprovalLevels :", err.message);
        } else {
            console.log("✓ ApprovalLevels Ready");
        }
    });

    // ======================================================
    // APPROVAL HISTORY
    // ======================================================

    db.run(`
    CREATE TABLE IF NOT EXISTS ApprovalHistory (

        HistoryID INTEGER PRIMARY KEY AUTOINCREMENT,

        ModuleName TEXT NOT NULL,

        DocumentID INTEGER NOT NULL,

        DocumentNo TEXT,

        LevelNo INTEGER,

        Action TEXT,

        ActionBy TEXT,

        ActionDate DATETIME DEFAULT CURRENT_TIMESTAMP,

        Remarks TEXT

    )
    `, function (err) {
        if (err) {
            console.error("❌ ApprovalHistory :", err.message);
        } else {
            console.log("✓ ApprovalHistory Ready");
        }
    });

    // ======================================================
    // AUDIT LOGS
    // ======================================================

    db.run(`
    CREATE TABLE IF NOT EXISTS AuditLogs (

        AuditID INTEGER PRIMARY KEY AUTOINCREMENT,

        ModuleName TEXT NOT NULL,

        DocumentID INTEGER,

        DocumentNo TEXT,

        Action TEXT NOT NULL,

        FieldName TEXT,

        OldValue TEXT,

        NewValue TEXT,

        ActionBy TEXT,

        IPAddress TEXT,

        Device TEXT,

        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP

    )
    `, function (err) {
        if (err) {
            console.error("❌ AuditLogs :", err.message);
        } else {
            console.log("✓ AuditLogs Ready");
        }
    });

    // ======================================================
    // DEFAULT APPROVAL LEVELS
    // ======================================================

    db.run(`
    INSERT OR IGNORE INTO ApprovalLevels
    (ModuleName, LevelNo, LevelName, RoleName, IsFinal)
    VALUES
    ('INDENT',1,'Department Approval','Department Head',0),
    ('INDENT',2,'Purchase Approval','Purchase Manager',1),
    ('PR',1,'Purchase Approval','Purchase Manager',1),
    ('PO',1,'Purchase Approval','Purchase Manager',0),
    ('PO',2,'Management Approval','General Manager',1),
    ('SO',1,'Sales Approval','Sales Manager',1),
    ('PRODUCTION',1,'Production Approval','Production Manager',1)
    `, function (err) {
        if (err) {
            console.error("❌ Approval Levels Seed :", err.message);
        } else {
            console.log("✓ Default Approval Levels Added");
        }
    });

    console.log("✅ Approval Tables Loaded");

});