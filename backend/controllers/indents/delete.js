const db = require("../../config/database");

// ======================================================
// DELETE INDENT
// ======================================================

exports.delete = (req, res) => {

    const { id } = req.params;

    db.get(
        "SELECT Status FROM Indents WHERE IndentID = ?",
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
                    message: "Indent not found."
                });

            }

            if (row.Status !== "Draft") {

                return res.status(400).json({
                    success: false,
                    message: "Only Draft Indents can be deleted."
                });

            }

            db.serialize(() => {

                db.run("BEGIN TRANSACTION");

                db.run(
                    "DELETE FROM IndentDetails WHERE IndentID = ?",
                    [id],
                    function (detailErr) {

                        if (detailErr) {

                            db.run("ROLLBACK");

                            return res.status(500).json({
                                success: false,
                                message: detailErr.message
                            });

                        }

                        db.run(
                            "DELETE FROM Indents WHERE IndentID = ?",
                            [id],
                            function (headerErr) {

                                if (headerErr) {

                                    db.run("ROLLBACK");

                                    return res.status(500).json({
                                        success: false,
                                        message: headerErr.message
                                    });

                                }

                                db.run("COMMIT", (commitErr) => {

                                    if (commitErr) {

                                        return res.status(500).json({
                                            success: false,
                                            message: commitErr.message
                                        });

                                    }

                                    res.json({

                                        success: true,

                                        message: "Indent Deleted Successfully"

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