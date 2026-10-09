const db = require("../config/database");

// =====================================================
// GET ALL COLOURS
// =====================================================

exports.getAllColours = (req, res) => {

    const sql = `
        SELECT
            ColourID,
            ColourCode,
            ColourName,
            Description,
            Status,
            CreatedAt
        FROM Colours
        ORDER BY ColourName ASC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            data: rows
        });

    });

};


// =====================================================
// GET COLOUR BY ID
// =====================================================

exports.getColourById = (req, res) => {

    const sql = `
        SELECT
            ColourID,
            ColourCode,
            ColourName,
            Description,
            Status,
            CreatedAt
        FROM Colours
        WHERE ColourID = ?
    `;

    db.get(sql, [req.params.id], (err, row) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (!row) {
            return res.status(404).json({
                success: false,
                message: "Colour not found"
            });
        }

        res.json({
            success: true,
            data: row
        });

    });

};


// =====================================================
// CREATE COLOUR
// =====================================================

exports.createColour = (req, res) => {

    const {
        ColourCode,
        ColourName,
        Description,
        Status
    } = req.body;

    if (!ColourCode || !ColourName) {

        return res.status(400).json({
            success: false,
            message: "Colour Code and Colour Name are required"
        });

    }

    const sql = `
        INSERT INTO Colours
        (
            ColourCode,
            ColourName,
            Description,
            Status
        )
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            ColourCode.trim(),
            ColourName.trim(),
            Description
                ? Description.trim()
                : null,
            Status || "Active"
        ],
        function (err) {

            if (err) {

                if (
                    err.message &&
                    err.message.includes("UNIQUE")
                ) {

                    return res.status(400).json({
                        success: false,
                        message: "Colour Code already exists"
                    });

                }

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.status(201).json({
                success: true,
                message: "Colour created successfully",
                ColourID: this.lastID
            });

        }
    );

};


// =====================================================
// UPDATE COLOUR
// =====================================================

exports.updateColour = (req, res) => {

    const {
        ColourCode,
        ColourName,
        Description,
        Status
    } = req.body;

    if (!ColourCode || !ColourName) {

        return res.status(400).json({
            success: false,
            message: "Colour Code and Colour Name are required"
        });

    }

    const sql = `
        UPDATE Colours
        SET
            ColourCode = ?,
            ColourName = ?,
            Description = ?,
            Status = ?
        WHERE ColourID = ?
    `;

    db.run(
        sql,
        [
            ColourCode.trim(),
            ColourName.trim(),
            Description
                ? Description.trim()
                : null,
            Status || "Active",
            req.params.id
        ],
        function (err) {

            if (err) {

                if (
                    err.message &&
                    err.message.includes("UNIQUE")
                ) {

                    return res.status(400).json({
                        success: false,
                        message: "Colour Code already exists"
                    });

                }

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            if (this.changes === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Colour not found"
                });

            }

            res.json({
                success: true,
                message: "Colour updated successfully"
            });

        }
    );

};


// =====================================================
// DELETE COLOUR
// =====================================================

exports.deleteColour = (req, res) => {

    const sql = `
        DELETE FROM Colours
        WHERE ColourID = ?
    `;

    db.run(
        sql,
        [req.params.id],
        function (err) {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            if (this.changes === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Colour not found"
                });

            }

            res.json({
                success: true,
                message: "Colour deleted successfully"
            });

        }
    );

};