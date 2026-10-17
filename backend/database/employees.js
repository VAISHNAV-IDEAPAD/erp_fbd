const db = require("../config/database");

// ======================================================
// EMPLOYEES TABLE
// ======================================================

db.run(`
CREATE TABLE IF NOT EXISTS Employees (
    EmployeeID INTEGER PRIMARY KEY AUTOINCREMENT,
    EmployeeCode TEXT UNIQUE NOT NULL,
    EmployeeName TEXT NOT NULL,
    DepartmentID INTEGER,
    Designation TEXT,
    Phone TEXT,
    Email TEXT,
    Status TEXT DEFAULT 'Active',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (DepartmentID)
        REFERENCES Departments(DepartmentID)
);
`, (err) => {

    if (err) {
        console.error("❌ Employees table error:", err.message);
    } else {
        console.log("✅ Employees table ready");
        db.run(`
            INSERT OR IGNORE INTO Employees
            (EmployeeCode, EmployeeName, DepartmentID)
            VALUES
            ('EMP000', 'Admin', 1),
            ('EMP001', 'Vaishnav', 1)
        `);
    }

});

module.exports = db;