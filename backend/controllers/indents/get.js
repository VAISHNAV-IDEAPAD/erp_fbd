const db = require("../../config/database");

// ======================================================
// GET ALL INDENTS
// ======================================================

exports.getAll = (req, res) => {

    const sql = `
    SELECT

        I.IndentID,
        I.IndentNo,
        I.IndentDate,
        I.RequiredDate,
        I.Priority,
        I.Status,
        I.Remarks,
        I.CreatedAt,

        D.DepartmentName,
        E.EmployeeName,

        (
            SELECT COUNT(*)
            FROM IndentDetails ID
            WHERE ID.IndentID = I.IndentID
        ) AS TotalItems

    FROM Indents I

    LEFT JOIN Departments D
        ON D.DepartmentID = I.DepartmentID

    LEFT JOIN Employees E
        ON E.EmployeeID = I.EmployeeID

    ORDER BY I.IndentID DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {

            console.error(err);

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
// GET INDENT BY ID
// ======================================================

exports.getById = (req, res) => {

    const { id } = req.params;

    const headerSql = `
    SELECT

        I.*,

        D.DepartmentName,

        E.EmployeeName

    FROM Indents I

    LEFT JOIN Departments D
        ON D.DepartmentID = I.DepartmentID

    LEFT JOIN Employees E
        ON E.EmployeeID = I.EmployeeID

    WHERE I.IndentID = ?
    `;

    db.get(headerSql, [id], (err, header) => {

        if (err) {

            return res.status(500).json({

                success: false,
                message: err.message

            });

        }

        if (!header) {

            return res.status(404).json({

                success: false,
                message: "Indent not found"

            });

        }

        const detailSql = `
        SELECT

            D.DetailID,
            D.ItemID,
            D.Qty,
            D.UOM,
            D.Remarks,

            I.ItemCode,
            I.ItemName,
            I.Category,
            I.CurrentStock,
            I.Rate

        FROM IndentDetails D

        INNER JOIN Items I
            ON I.ItemID = D.ItemID

        WHERE D.IndentID = ?

        ORDER BY D.DetailID
        `;

        db.all(detailSql, [id], (err2, details) => {

            if (err2) {

                return res.status(500).json({

                    success: false,
                    message: err2.message

                });

            }

            res.json({

                success: true,

                data: {

                    header,

                    details

                }

            });

        });

    });

};