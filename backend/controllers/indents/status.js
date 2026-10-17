const db = require("../../config/database");

// ======================================================
// SUBMIT INDENT
// ======================================================

exports.submit = (req, res) => {

    db.run(
        `
        UPDATE Indents
        SET Status='Submitted'
        WHERE IndentID=?
        AND Status IN ('Draft', 'Open')
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
                return res.status(400).json({
                    success: false,
                    message: "Only Draft or Open Indents can be submitted."
                });
            }

            res.json({
                success: true,
                message: "Indent Submitted Successfully"
            });

        }

    );

};

// ======================================================
// APPROVE INDENT
// ======================================================

exports.approve = (req, res) => {

    const id = req.params.id;
    const user = req.body?.user || req.body?.ApprovedBy || "Admin";
    const remarks = req.body?.remarks || req.body?.Remarks || "Approved via Indent Action Menu";

    db.get(
        "SELECT * FROM Indents WHERE IndentID = ?",
        [id],
        (findErr, indent) => {

            if (findErr) {
                return res.status(500).json({
                    success: false,
                    message: findErr.message
                });
            }

            if (!indent) {
                return res.status(404).json({
                    success: false,
                    message: "Indent not found."
                });
            }

            if (indent.Status === "Approved") {
                return res.status(400).json({
                    success: false,
                    message: "Indent is already approved."
                });
            }

            db.run(
                `
                UPDATE Indents
                SET Status='Approved'
                WHERE IndentID=?
                `,
                [id],
                function (err) {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    // Record approval in ApprovalHistory
                    db.run(
                        `
                        INSERT INTO ApprovalHistory (ModuleName, DocumentID, DocumentNo, Action, ActionBy, Remarks)
                        VALUES ('INDENT', ?, ?, 'Approved', ?, ?)
                        `,
                        [id, indent.IndentNo, user, remarks],
                        () => {}
                    );

                    res.json({
                        success: true,
                        message: `Indent ${indent.IndentNo || id} Approved Successfully`
                    });

                }
            );

        }
    );

};

// ======================================================
// REJECT INDENT
// ======================================================

exports.reject = (req, res) => {

    const id = req.params.id;
    const user = req.body?.user || "Admin";
    const remarks = req.body?.remarks || "Rejected via Indent Action Menu";

    db.get(
        "SELECT * FROM Indents WHERE IndentID = ?",
        [id],
        (findErr, indent) => {

            if (findErr) {
                return res.status(500).json({
                    success: false,
                    message: findErr.message
                });
            }

            if (!indent) {
                return res.status(404).json({
                    success: false,
                    message: "Indent not found."
                });
            }

            db.run(
                `
                UPDATE Indents
                SET Status='Rejected'
                WHERE IndentID=?
                `,
                [id],
                function (err) {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    db.run(
                        `
                        INSERT INTO ApprovalHistory (ModuleName, DocumentID, DocumentNo, Action, ActionBy, Remarks)
                        VALUES ('INDENT', ?, ?, 'Rejected', ?, ?)
                        `,
                        [id, indent.IndentNo, user, remarks],
                        () => {}
                    );

                    res.json({
                        success: true,
                        message: `Indent ${indent.IndentNo || id} Rejected Successfully`
                    });

                }
            );

        }
    );

};

// ======================================================
// CANCEL INDENT
// ======================================================

exports.cancel = (req, res) => {

    db.run(
        `
        UPDATE Indents
        SET Status='Cancelled'
        WHERE IndentID=?
        AND Status<>'Cancelled'
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
                return res.status(400).json({
                    success: false,
                    message: "Indent already cancelled."
                });
            }

            res.json({
                success: true,
                message: "Indent Cancelled Successfully"
            });

        }

    );

};