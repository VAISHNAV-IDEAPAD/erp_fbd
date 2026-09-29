const db = require("../../config/database");

const {
    validateIndent
} = require("./helpers");

// ======================================================
// UPDATE INDENT
// ======================================================

exports.update = (req, res) => {

    const { id } = req.params;

    const body = req.body;

    const validation = validateIndent(body);

    if (validation) {

        return res.status(400).json({
            success: false,
            message: validation
        });

    }

    db.get(
        `
        SELECT *
        FROM Indents
        WHERE IndentID = ?
        `,
        [id],
        (err, indent) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            if (!indent) {

                return res.status(404).json({
                    success: false,
                    message: "Indent not found."
                });

            }

            if (indent.Status !== "Draft") {

                return res.status(400).json({
                    success: false,
                    message: "Only Draft indents can be edited."
                });

            }

            db.serialize(() => {

                db.run("BEGIN TRANSACTION");

                db.run(
                    `
                    UPDATE Indents
                    SET
                        DepartmentID = ?,
                        EmployeeID = ?,
                        WarehouseID = ?,
                        RequiredDate = ?,
                        Priority = ?,
                        Remarks = ?
                    WHERE IndentID = ?
                    `,
                    [
                        body.DepartmentID,
                        body.EmployeeID,
                        body.WarehouseID || null,
                        body.RequiredDate,
                        body.Priority || "Normal",
                        body.Remarks || "",
                        id
                    ],
                    function (updateErr) {

                        if (updateErr) {

                            db.run("ROLLBACK");

                            return res.status(500).json({
                                success: false,
                                message: updateErr.message
                            });

                        }

                        db.run(
                            "DELETE FROM IndentDetails WHERE IndentID = ?",
                            [id],
                            function (deleteErr) {

                                if (deleteErr) {

                                    db.run("ROLLBACK");

                                    return res.status(500).json({
                                        success: false,
                                        message: deleteErr.message
                                    });

                                }

                                const stmt = db.prepare(`
                                    INSERT INTO IndentDetails
                                    (
                                        IndentID,
                                        ItemID,
                                        Qty,
                                        UOM,
                                        Remarks
                                    )
                                    VALUES (?,?,?,?,?)
                                `);

                                for (const item of body.items) {

                                    stmt.run(
                                        id,
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

                                        return res.json({

                                            success: true,

                                            message: "Indent Updated Successfully"

                                        });

                                    });

                                });

                            }
                        );

                    }
                );

            });

        }
    );

};