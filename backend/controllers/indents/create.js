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

    // Standardize items array (support items or Items)
    if (!body.items && body.Items) {
        body.items = body.Items;
    }
    if (!Array.isArray(body.items)) {
        body.items = [];
    }

    // Default RequiredDate if missing
    if (!body.RequiredDate) {
        body.RequiredDate = body.IndentDate || new Date().toISOString().substring(0, 10);
    }

    // ----------------------------
    // Resolve Department
    // ----------------------------
    const resolveDepartment = (done) => {
        if (body.DepartmentID) {
            return done(null, body.DepartmentID);
        }

        const deptName = (body.Department || body.DepartmentName || "").trim();
        if (!deptName) {
            return db.get("SELECT DepartmentID FROM Departments ORDER BY DepartmentID ASC LIMIT 1", [], (err, dep) => {
                done(null, dep ? dep.DepartmentID : 1);
            });
        }

        // Try exact match by name or code
        db.get(
            "SELECT DepartmentID FROM Departments WHERE DepartmentName = ? OR DepartmentCode = ?",
            [deptName, deptName],
            (err, dep) => {
                if (err) return done(err);
                if (dep) return done(null, dep.DepartmentID);

                // Try partial / case-insensitive match across all departments
                db.all("SELECT DepartmentID, DepartmentName FROM Departments", [], (errAll, depts) => {
                    if (!errAll && depts && depts.length > 0) {
                        const lower = deptName.toLowerCase();
                        const match = depts.find(d => 
                            lower.includes(d.DepartmentName.toLowerCase()) || 
                            d.DepartmentName.toLowerCase().includes(lower)
                        );
                        if (match) return done(null, match.DepartmentID);
                        // Fallback to first department
                        return done(null, depts[0].DepartmentID);
                    }
                    done(null, 1);
                });
            }
        );
    };

    // ----------------------------
    // Resolve Employee
    // ----------------------------
    const resolveEmployee = (done) => {
        if (body.EmployeeID) {
            return done(null, body.EmployeeID);
        }

        const empVal = (body.RequestedBy || body.EmployeeCode || body.EnteredBy || "").trim();
        if (!empVal) {
            return db.get("SELECT EmployeeID FROM Employees ORDER BY EmployeeID ASC LIMIT 1", [], (err, emp) => {
                done(null, emp ? emp.EmployeeID : 1);
            });
        }

        db.get(
            `
            SELECT EmployeeID
            FROM Employees
            WHERE EmployeeName = ?
               OR EmployeeCode = ?
            `,
            [empVal, empVal],
            (err, emp) => {
                if (err) return done(err);
                if (emp) return done(null, emp.EmployeeID);

                // Fallback to first employee or create Admin
                db.get("SELECT EmployeeID FROM Employees ORDER BY EmployeeID ASC LIMIT 1", [], (errFirst, firstEmp) => {
                    if (firstEmp) return done(null, firstEmp.EmployeeID);
                    
                    db.run(
                        "INSERT OR IGNORE INTO Employees (EmployeeCode, EmployeeName, DepartmentID) VALUES ('EMP000', 'Admin', 1)",
                        function () {
                            done(null, this.lastID || 1);
                        }
                    );
                });
            }
        );
    };

    resolveDepartment((errDept, deptId) => {
        if (errDept) {
            return res.status(500).json({ success: false, message: errDept.message });
        }
        body.DepartmentID = deptId;

        resolveEmployee((errEmp, empId) => {
            if (errEmp) {
                return res.status(500).json({ success: false, message: errEmp.message });
            }
            body.EmployeeID = empId;

            createIndent(body, res);
        });
    });

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

        const finalIndentNo = body.IndentNo || indentNo;

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
                    finalIndentNo,
                    body.IndentDate || new Date().toISOString().substring(0, 10),
                    body.DepartmentID,
                    body.EmployeeID,
                    body.WarehouseID || null,
                    body.RequiredDate || body.IndentDate || new Date().toISOString().substring(0, 10),
                    body.Priority || "Normal",
                    body.Status || "Open",
                    body.Remarks || "",
                    body.IndentMethod || "Manual",
                    body.IndentType || "For Stock",
                    body.OtherReference || "",
                    body.VersionNo || 0,
                    body.EnteredBy || body.RequestedBy || "Admin",
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

                    const items = body.items || body.Items || [];
                    for (const item of items) {

                        stmt.run(
                            indentID,
                            item.ItemID || 1,
                            Number(item.Qty) || 1,
                            item.UOM || "PCS",
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
                                IndentNo: finalIndentNo

                            });

                        });

                    });

                }
            );

        });

    });

}