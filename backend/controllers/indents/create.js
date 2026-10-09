const db = require("../../config/database");

const {
    generateIndentNo,
    validateIndent
} = require("./helpers");

// ======================================================
// CREATE INDENT
// ======================================================

exports.create = (req, res) => {

    console.log("Indent Request:", req.body);

    const body = req.body;

    // ----------------------------
    // Find Department
    // ----------------------------

    db.get(
        "SELECT DepartmentID FROM Departments WHERE DepartmentName = ?",
        [body.Department],
        (err, dep) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (!dep) {
                return res.status(400).json({
                    success: false,
                    message: "Department not found"
                });
            }

            body.DepartmentID = dep.DepartmentID;

            // ----------------------------
            // If EmployeeID already received
            // ----------------------------

            if (body.EmployeeID) {

                return createIndent(body, res);

            }

            // ----------------------------
            // Search employee by
            // EmployeeName OR EmployeeCode
            // ----------------------------

            const employeeValue =
                body.RequestedBy ||
                body.EmployeeCode ||
                "";

            db.get(
                `
                SELECT EmployeeID
                FROM Employees
                WHERE EmployeeName = ?
                   OR EmployeeCode = ?
                `,
                [employeeValue, employeeValue],
                (err2, emp) => {

                    if (err2) {
                        return res.status(500).json({
                            success: false,
                            message: err2.message
                        });
                    }

                    if (!emp) {
                        return res.status(400).json({
                            success: false,
                            message: "Employee not found"
                        });
                    }

                    body.EmployeeID = emp.EmployeeID;

                    createIndent(body, res);

                }
            );

        }
    );

};

// ======================================================
// INSERT INDENT
// ======================================================

function createIndent(body, res) {

    const validation = validateIndent(body);

    if (validation) {
        return res.status(400).json({
            success: false,
            message: validation
        });
    }

    generateIndentNo((numberErr, indentNo) => {

        if (numberErr) {
            return res.status(500).json({
                success: false,
                message: numberErr.message
            });
        }

        db.serialize(() => {

            db.run("BEGIN TRANSACTION");

            const headerSql = `
                INSERT INTO Indents
                (
                    IndentNo,
                    IndentDate,
                    DepartmentID,
                    EmployeeID,
                    WarehouseID,
                    RequiredDate,
                    Priority,
                    Status,
                    Remarks,
                    IndentMethod,
                    IndentType,
                    OtherReference,
                    VersionNo,
                    EnteredBy,
                    SupplierName
                )
                VALUES
                (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            `;

            db.run(
                headerSql,
                [
                    body.IndentNo || indentNo,
                    body.IndentDate || new Date().toISOString().substring(0, 10),
                    body.DepartmentID,
                    body.EmployeeID,
                    body.WarehouseID || null,
                    body.RequiredDate,
                    body.Priority || "Normal",
                    body.Status || "Open",
                    body.Remarks || "",
                    body.IndentMethod || "Manual",
                    body.IndentType || "For Stock",
                    body.OtherReference || "",
                    body.VersionNo || 0,
                    body.EnteredBy || "Admin",
                    body.SupplierName || ""
                ],
                function (err) {

                    if (err) {

                        db.run("ROLLBACK");

                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });

                    }

                    const indentID = this.lastID;

                    const stmt = db.prepare(`
                        INSERT INTO IndentDetails
                        (
                            IndentID,
                            ItemID,
                            Qty,
                            UOM,
                            Remarks
                        )
                        VALUES
                        (?,?,?,?,?)
                    `);

                    for (const item of body.items) {

                        stmt.run(
                            indentID,
                            item.ItemID,
                            Number(item.Qty),
                            item.UOM,
                            item.Remarks || ""
                        );

                    }

                    stmt.finalize((detailErr) => {

                        if (detailErr) {

                            db.run("ROLLBACK");

                            return res.status(500).json({
                                success: false,
                                message: detailErr.message
                            });

                        }

                        db.run("COMMIT", (commitErr) => {

                            if (commitErr) {

                                return res.status(500).json({
                                    success: false,
                                    message: commitErr.message
                                });

                            }

                            res.status(201).json({

                                success: true,
                                message: "Indent Created Successfully",
                                IndentID: indentID,
                                IndentNo: indentNo

                            });

                        });

                    });

                }
            );

        });

    });

}