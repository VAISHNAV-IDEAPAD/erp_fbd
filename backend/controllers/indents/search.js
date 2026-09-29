const db = require("../../config/database");

// ======================================================
// SEARCH INDENTS
// GET /api/indents/search
// ======================================================

exports.search = (req, res) => {

    const {

        indentNo = "",
        departmentID,
        employeeID,
        status,
        fromDate,
        toDate,
        page = 1,
        limit = 20

    } = req.query;

    let sql = `
        SELECT

            I.IndentID,
            I.IndentNo,
            I.IndentDate,
            I.RequiredDate,
            I.Priority,
            I.Status,

            D.DepartmentName,

            E.EmployeeName,

            COUNT(ID.DetailID) AS TotalItems

        FROM Indents I

        LEFT JOIN Departments D
            ON D.DepartmentID = I.DepartmentID

        LEFT JOIN Employees E
            ON E.EmployeeID = I.EmployeeID

        LEFT JOIN IndentDetails ID
            ON ID.IndentID = I.IndentID

        WHERE 1=1
    `;

    const params = [];

    if (indentNo) {

        sql += ` AND I.IndentNo LIKE ?`;
        params.push(`%${indentNo}%`);

    }

    if (departmentID) {

        sql += ` AND I.DepartmentID = ?`;
        params.push(departmentID);

    }

    if (employeeID) {

        sql += ` AND I.EmployeeID = ?`;
        params.push(employeeID);

    }

    if (status) {

        sql += ` AND I.Status = ?`;
        params.push(status);

    }

    if (fromDate) {

        sql += ` AND I.IndentDate >= ?`;
        params.push(fromDate);

    }

    if (toDate) {

        sql += ` AND I.IndentDate <= ?`;
        params.push(toDate);

    }

    sql += `
        GROUP BY I.IndentID
        ORDER BY I.IndentID DESC
        LIMIT ?
        OFFSET ?
    `;

    params.push(Number(limit));
    params.push((page - 1) * Number(limit));

    db.all(sql, params, (err, rows) => {

        if (err) {

            return res.status(500).json({

                success: false,
                message: err.message

            });

        }

        res.json({

            success: true,

            page: Number(page),

            limit: Number(limit),

            data: rows

        });

    });

};