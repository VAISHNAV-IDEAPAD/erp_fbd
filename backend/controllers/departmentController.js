const db = require("../config/database");

// =====================================
// GET ALL DEPARTMENTS
// =====================================

exports.getAll = (req, res) => {

    db.all(

        `
        SELECT *
        FROM Departments
        ORDER BY DepartmentName
        `,

        [],

        (err, rows) => {

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

        }

    );

};

// =====================================
// GET DEPARTMENT BY ID
// =====================================

exports.getById = (req, res) => {

    db.get(

        `
        SELECT *
        FROM Departments
        WHERE DepartmentID = ?
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
                    message: "Department not found"
                });

            }

            res.json({

                success: true,

                data: row

            });

        }

    );

};