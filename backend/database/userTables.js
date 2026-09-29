const db = require("../config/database");

db.serialize(() => {

    // ======================================================
    // USERS
    // ======================================================

    db.run(`
    CREATE TABLE IF NOT EXISTS Users (

        UserID INTEGER PRIMARY KEY AUTOINCREMENT,

        Username TEXT UNIQUE NOT NULL,

        PasswordHash TEXT NOT NULL,

        FullName TEXT NOT NULL,

        EmployeeID INTEGER,

        Email TEXT,

        Mobile TEXT,

        IsAdmin INTEGER DEFAULT 0,

        Status TEXT DEFAULT 'Active',

        LastLogin DATETIME,

        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (EmployeeID)
            REFERENCES Employees(EmployeeID)

    )
    `, function (err) {
        if (err) {
            console.error("❌ Users :", err.message);
        } else {
            console.log("✓ Users Ready");
        }
    });

    // ======================================================
    // ROLES
    // ======================================================

    db.run(`
    CREATE TABLE IF NOT EXISTS Roles (

        RoleID INTEGER PRIMARY KEY AUTOINCREMENT,

        RoleCode TEXT UNIQUE,

        RoleName TEXT NOT NULL,

        Description TEXT,

        Status TEXT DEFAULT 'Active',

        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP

    )
    `, function (err) {
        if (err) {
            console.error("❌ Roles :", err.message);
        } else {
            console.log("✓ Roles Ready");
        }
    });

    // ======================================================
    // USER ROLES
    // ======================================================

    db.run(`
    CREATE TABLE IF NOT EXISTS UserRoles (

        UserRoleID INTEGER PRIMARY KEY AUTOINCREMENT,

        UserID INTEGER NOT NULL,

        RoleID INTEGER NOT NULL,

        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (UserID)
            REFERENCES Users(UserID)
            ON DELETE CASCADE,

        FOREIGN KEY (RoleID)
            REFERENCES Roles(RoleID)

    )
    `, function (err) {
        if (err) {
            console.error("❌ UserRoles :", err.message);
        } else {
            console.log("✓ UserRoles Ready");
        }
    });

    // ======================================================
    // PERMISSIONS
    // ======================================================

    db.run(`
    CREATE TABLE IF NOT EXISTS Permissions (

        PermissionID INTEGER PRIMARY KEY AUTOINCREMENT,

        ModuleName TEXT NOT NULL,

        PermissionCode TEXT NOT NULL,

        PermissionName TEXT NOT NULL,

        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP

    )
    `, function (err) {
        if (err) {
            console.error("❌ Permissions :", err.message);
        } else {
            console.log("✓ Permissions Ready");
        }
    });

    // ======================================================
    // ROLE PERMISSIONS
    // ======================================================

    db.run(`
    CREATE TABLE IF NOT EXISTS RolePermissions (

        RolePermissionID INTEGER PRIMARY KEY AUTOINCREMENT,

        RoleID INTEGER,

        PermissionID INTEGER,

        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (RoleID)
            REFERENCES Roles(RoleID)
            ON DELETE CASCADE,

        FOREIGN KEY (PermissionID)
            REFERENCES Permissions(PermissionID)

    )
    `, function (err) {
        if (err) {
            console.error("❌ RolePermissions :", err.message);
        } else {
            console.log("✓ RolePermissions Ready");
        }
    });

    // ======================================================
    // DEFAULT ROLES
    // ======================================================

    db.run(`
    INSERT OR IGNORE INTO Roles
    (RoleCode, RoleName, Description)
    VALUES
    ('ADMIN','Administrator','System Administrator'),
    ('PURCHASE','Purchase Manager','Purchase Department'),
    ('STORE','Store Manager','Stores Department'),
    ('PRODUCTION','Production Manager','Production Department'),
    ('SALES','Sales Manager','Sales Department'),
    ('ACCOUNTS','Accounts Manager','Accounts Department'),
    ('HR','HR Manager','Human Resources')
    `, function (err) {
        if (err) {
            console.error("❌ Default Roles :", err.message);
        } else {
            console.log("✓ Default Roles Added");
        }
    });

    // ======================================================
    // DEFAULT ADMIN USER
    // ======================================================
    // Replace the password hash below with a bcrypt hash.

    db.run(`
    INSERT OR IGNORE INTO Users
    (Username, PasswordHash, FullName, IsAdmin)
    VALUES
    ('admin','$2b$10$REPLACE_WITH_BCRYPT_HASH','System Administrator',1)
    `, function (err) {
        if (err) {
            console.error("❌ Default Admin :", err.message);
        } else {
            console.log("✓ Default Admin Added");
        }
    });

    console.log("✅ User Tables Loaded");

});