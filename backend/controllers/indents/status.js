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
        AND Status='Draft'
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
                    message: "Only Draft Indents can be submitted."
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

    db.run(
        `
        UPDATE Indents
        SET Status='Approved'
        WHERE IndentID=?
        AND Status='Submitted'
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
                    message: "Only Submitted Indents can be approved."
                });

            }

            res.json({

                success: true,

                message: "Indent Approved Successfully"

            });

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