const db = require("../../config/database");

// ======================================================
// GET ALL INDENTS
// ======================================================

exports.getAll = (req, res) => {
    const { status, supplier, enteredBy, search, page = 1, limit = 20 } = req.query;

    let sql = `
    SELECT
        I.IndentID,
        I.IndentNo,
        I.IndentDate,
        I.RequiredDate,
        I.Priority,
        I.Status,
        I.Remarks,
        COALESCE(I.IndentMethod, 'Manual') AS IndentMethod,
        COALESCE(I.IndentType, 'For Stock') AS IndentType,
        I.OtherReference,
        COALESCE(I.VersionNo, 0) AS VersionNo,
        COALESCE(I.EnteredBy, E.EmployeeName, 'Admin') AS EnteredBy,
        I.SupplierName,
        I.CreatedAt,
        COALESCE(D.DepartmentName, 'Store') AS DepartmentName,
        E.EmployeeName,
        (
            SELECT COUNT(*)
            FROM IndentDetails ID
            WHERE ID.IndentID = I.IndentID
        ) AS TotalItems,
        (
            SELECT COALESCE(SUM(ID.Qty), 0)
            FROM IndentDetails ID
            WHERE ID.IndentID = I.IndentID
        ) AS TotalQty
    FROM Indents I
    LEFT JOIN Departments D ON D.DepartmentID = I.DepartmentID
    LEFT JOIN Employees E ON E.EmployeeID = I.EmployeeID
    WHERE 1=1
    `;

    const params = [];

    if (status && status !== 'All') {
        sql += ` AND I.Status = ?`;
        params.push(status);
    }

    if (supplier && supplier.trim()) {
        sql += ` AND I.SupplierName LIKE ?`;
        params.push(`%${supplier.trim()}%`);
    }

    if (enteredBy && enteredBy.trim()) {
        sql += ` AND (I.EnteredBy LIKE ? OR E.EmployeeName LIKE ?)`;
        params.push(`%${enteredBy.trim()}%`, `%${enteredBy.trim()}%`);
    }

    if (search && search.trim()) {
        sql += ` AND (I.IndentNo LIKE ? OR I.Remarks LIKE ? OR I.OtherReference LIKE ?)`;
        params.push(`%${search.trim()}%`, `%${search.trim()}%`, `%${search.trim()}%`);
    }

    sql += ` ORDER BY I.IndentID DESC`;

    db.all(sql, params, (err, rows) => {
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