const db = require("../config/database");

// ======================================
// GET ALL BUYERS
// ======================================
exports.getAllBuyers = (req, res) => {
    const sql = `
        SELECT *
        FROM Buyers
        ORDER BY BuyerID DESC
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
            count: rows ? rows.length : 0,
            data: rows || []
        });
    });
};

// ======================================
// GET BUYER BY ID
// ======================================
exports.getBuyerById = (req, res) => {
    const { id } = req.params;

    db.get(
        `SELECT * FROM Buyers WHERE BuyerID = ?`,
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
                    message: "Buyer not found"
                });
            }

            res.json({
                success: true,
                data: row
            });
        }
    );
};

// ======================================
// CREATE BUYER
// ======================================
exports.createBuyer = (req, res) => {
    const {
        BuyerCode,
        BuyerName,
        ContactPerson,
        Phone,
        Email,
        Address,
        Country
    } = req.body;

    if (!BuyerName) {
        return res.status(400).json({
            success: false,
            message: "BuyerName is required"
        });
    }

    const code = BuyerCode || `BYR-${Date.now().toString().slice(-4)}`;

    const sql = `
        INSERT INTO Buyers (
            BuyerCode,
            BuyerName,
            ContactPerson,
            Phone,
            Email,
            Address,
            Country
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [code, BuyerName, ContactPerson, Phone, Email, Address, Country || "India"],
        function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Buyer created successfully",
                BuyerID: this.lastID
            });
        }
    );
};

// ======================================
// UPDATE BUYER
// ======================================
exports.updateBuyer = (req, res) => {
    const { id } = req.params;
    const {
        BuyerCode,
        BuyerName,
        ContactPerson,
        Phone,
        Email,
        Address,
        Country
    } = req.body;

    const sql = `
        UPDATE Buyers
        SET BuyerCode = COALESCE(?, BuyerCode),
            BuyerName = COALESCE(?, BuyerName),
            ContactPerson = COALESCE(?, ContactPerson),
            Phone = COALESCE(?, Phone),
            Email = COALESCE(?, Email),
            Address = COALESCE(?, Address),
            Country = COALESCE(?, Country)
        WHERE BuyerID = ?
    `;

    db.run(
        sql,
        [BuyerCode, BuyerName, ContactPerson, Phone, Email, Address, Country, id],
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
                    message: "Buyer not found"
                });
            }

            res.json({
                success: true,
                message: "Buyer updated successfully"
            });
        }
    );
};

// ======================================
// DELETE BUYER
// ======================================
exports.deleteBuyer = (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM Buyers WHERE BuyerID = ?`, [id], function (err) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Buyer not found"
            });
        }

        res.json({
            success: true,
            message: "Buyer deleted successfully"
        });
    });
};
