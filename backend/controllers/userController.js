const db = require("../config/database");

// ======================================
// GET ALL USERS
// ======================================
exports.getAllUsers = (req, res) => {
    const sql = `
        SELECT u.UserID, u.Username, u.FullName, u.Email, u.Mobile, u.IsAdmin, u.Status, u.LastLogin, u.CreatedAt,
               e.EmployeeName, e.Designation
        FROM Users u
        LEFT JOIN Employees e ON u.EmployeeID = e.EmployeeID
        ORDER BY u.UserID DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            count: rows ? rows.length : 0,
            data: rows || []
        });
    });
};

// ======================================
// GET USER BY ID
// ======================================
exports.getUserById = (req, res) => {
    const { id } = req.params;

    db.get(
        `SELECT UserID, Username, FullName, EmployeeID, Email, Mobile, IsAdmin, Status, LastLogin, CreatedAt FROM Users WHERE UserID = ?`,
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.json({
                success: true,
                data: row
            });
        }
    );
};

// ======================================
// CREATE USER
// ======================================
exports.createUser = (req, res) => {
    const { Username, Password, FullName, EmployeeID, Email, Mobile, IsAdmin, Status } = req.body;

    if (!Username || !FullName) {
        return res.status(400).json({
            success: false,
            message: "Username and FullName are required"
        });
    }

    const sql = `
        INSERT INTO Users (Username, PasswordHash, FullName, EmployeeID, Email, Mobile, IsAdmin, Status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [Username, Password || "default123", FullName, EmployeeID || null, Email, Mobile, IsAdmin || 0, Status || "Active"],
        function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "User created successfully",
                UserID: this.lastID
            });
        }
    );
};

// ======================================
// UPDATE USER
// ======================================
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { FullName, Email, Mobile, IsAdmin, Status } = req.body;

    const sql = `
        UPDATE Users
        SET FullName = COALESCE(?, FullName),
            Email = COALESCE(?, Email),
            Mobile = COALESCE(?, Mobile),
            IsAdmin = COALESCE(?, IsAdmin),
            Status = COALESCE(?, Status)
        WHERE UserID = ?
    `;

    db.run(sql, [FullName, Email, Mobile, IsAdmin, Status, id], function (err) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            message: "User updated successfully"
        });
    });
};

// ======================================
// DELETE USER
// ======================================
exports.deleteUser = (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM Users WHERE UserID = ?`, [id], function (err) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            message: "User deleted successfully"
        });
    });
};

// ======================================
// GET ROLES
// ======================================
exports.getRoles = (req, res) => {
    db.all(`SELECT * FROM Roles ORDER BY RoleName`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            data: rows || []
        });
    });
};

// ======================================
// GET AUDIT LOGS
// ======================================
exports.getAuditLogs = (req, res) => {
    db.all(`SELECT * FROM AuditLogs ORDER BY LogID DESC LIMIT 100`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            data: rows || []
        });
    });
};
