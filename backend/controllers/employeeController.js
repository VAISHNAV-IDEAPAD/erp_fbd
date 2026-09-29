const db = require("../config/database");

// ======================================================
// GET ALL EMPLOYEES
// ======================================================

exports.getAll = (req, res) => {

    const sql = `
        SELECT
            E.EmployeeID,
            E.EmployeeCode,
            E.EmployeeName,
            E.DepartmentID,
            D.DepartmentName,
            E.Designation,
            E.Phone,
            E.Email,
            E.Status,
            E.CreatedAt
        FROM Employees E
        LEFT JOIN Departments D
            ON D.DepartmentID = E.DepartmentID
        ORDER BY E.EmployeeName
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
            count: rows.length,
            data: rows
        });

    });

};

// ======================================================
// GET EMPLOYEE BY ID
// ======================================================

exports.getById = (req, res) => {

    db.get(
        `
        SELECT
            E.*,
            D.DepartmentName
        FROM Employees E
        LEFT JOIN Departments D
            ON D.DepartmentID = E.DepartmentID
        WHERE EmployeeID = ?
        `,
        [req.params.id],
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
                    message: "Employee not found"
                });
            }

            res.json({
                success: true,
                data: row
            });

        }
    );

};

// ======================================================
// CREATE EMPLOYEE
// ======================================================

exports.create = (req, res) => {

    const {
        EmployeeCode,
        EmployeeName,
        DepartmentID,
        Designation,
        Phone,
        Email,
        Status
    } = req.body;

    if (!EmployeeCode)
        return res.status(400).json({
            success: false,
            message: "Employee Code is required."
        });

    if (!EmployeeName)
        return res.status(400).json({
            success: false,
            message: "Employee Name is required."
        });

    if (!DepartmentID)
        return res.status(400).json({
            success: false,
            message: "Department is required."
        });

    db.run(
        `
        INSERT INTO Employees
        (
            EmployeeCode,
            EmployeeName,
            DepartmentID,
            Designation,
            Phone,
            Email,
            Status
        )
        VALUES
        (?,?,?,?,?,?,?)
        `,
        [
            EmployeeCode,
            EmployeeName,
            DepartmentID,
            Designation || "",
            Phone || "",
            Email || "",
            Status || "Active"
        ],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Employee Created Successfully",
                EmployeeID: this.lastID
            });

        }
    );

};

// ======================================================
// UPDATE EMPLOYEE
// ======================================================

exports.update = (req, res) => {

    const {
        EmployeeCode,
        EmployeeName,
        DepartmentID,
        Designation,
        Phone,
        Email,
        Status
    } = req.body;

    db.run(
        `
        UPDATE Employees
        SET
            EmployeeCode=?,
            EmployeeName=?,
            DepartmentID=?,
            Designation=?,
            Phone=?,
            Email=?,
            Status=?
        WHERE EmployeeID=?
        `,
        [
            EmployeeCode,
            EmployeeName,
            DepartmentID,
            Designation,
            Phone,
            Email,
            Status,
            req.params.id
        ],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Employee not found."
                });
            }

            res.json({
                success: true,
                message: "Employee Updated Successfully"
            });

        }
    );

};

// ======================================================
// DELETE EMPLOYEE
// ======================================================

exports.delete = (req, res) => {

    db.run(
        `
        DELETE FROM Employees
        WHERE EmployeeID=?
        `,
        [req.params.id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Employee not found."
                });
            }

            res.json({
                success: true,
                message: "Employee Deleted Successfully"
            });

        }
    );

};