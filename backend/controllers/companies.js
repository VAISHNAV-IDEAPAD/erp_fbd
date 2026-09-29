const db = require("../config/database");

// ======================================================
// CREATE COMPANIES TABLE
// ======================================================

db.run(`
    CREATE TABLE IF NOT EXISTS Companies (
        CompanyID INTEGER PRIMARY KEY AUTOINCREMENT,
        CompanyCode TEXT UNIQUE NOT NULL,
        CompanyName TEXT NOT NULL,
        Address TEXT,
        City TEXT,
        State TEXT,
        Pincode TEXT,
        GSTNo TEXT,
        Phone TEXT,
        Email TEXT,
        Status TEXT DEFAULT 'Active',
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// ======================================================
// GET ALL COMPANIES
// ======================================================

const getAllCompanies = (req, res) => {

    const sql = `
        SELECT
            CompanyID,
            CompanyCode,
            CompanyName,
            Address,
            City,
            State,
            Pincode,
            GSTNo,
            Phone,
            Email,
            Status,
            CreatedAt
        FROM Companies
        ORDER BY CompanyID DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            console.error("Get Companies Error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to load companies.",
                error: err.message
            });
        }

        res.json({
            success: true,
            data: rows
        });
    });
};


// ======================================================
// GET COMPANY BY ID
// ======================================================

const getCompanyById = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            CompanyID,
            CompanyCode,
            CompanyName,
            Address,
            City,
            State,
            Pincode,
            GSTNo,
            Phone,
            Email,
            Status,
            CreatedAt
        FROM Companies
        WHERE CompanyID = ?
    `;

    db.get(sql, [id], (err, row) => {

        if (err) {
            console.error("Get Company Error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to load company.",
                error: err.message
            });
        }

        if (!row) {
            return res.status(404).json({
                success: false,
                message: "Company not found."
            });
        }

        res.json({
            success: true,
            data: row
        });
    });
};


// ======================================================
// CREATE COMPANY
// ======================================================

const createCompany = (req, res) => {

    const {
        companyCode,
        companyName,
        address,
        city,
        state,
        pincode,
        gstNo,
        phone,
        email,
        status
    } = req.body;


    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!companyCode || !companyName) {

        return res.status(400).json({
            success: false,
            message: "Company Code and Company Name are required."
        });
    }


    // ------------------------------------------
    // INSERT
    // ------------------------------------------

    const sql = `
        INSERT INTO Companies (
            CompanyCode,
            CompanyName,
            Address,
            City,
            State,
            Pincode,
            GSTNo,
            Phone,
            Email,
            Status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        companyCode.trim(),
        companyName.trim(),
        address || "",
        city || "",
        state || "",
        pincode || "",
        gstNo || "",
        phone || "",
        email || "",
        status || "Active"
    ];


    db.run(sql, values, function (err) {

        if (err) {

            console.error("Create Company Error:", err);

            // Duplicate Company Code
            if (
                err.message &&
                err.message.toLowerCase().includes("unique")
            ) {

                return res.status(409).json({
                    success: false,
                    message: "Company Code already exists."
                });
            }

            return res.status(500).json({
                success: false,
                message: "Failed to save company.",
                error: err.message
            });
        }


        res.status(201).json({

            success: true,

            message: "Company saved successfully.",

            data: {
                CompanyID: this.lastID,
                CompanyCode: companyCode,
                CompanyName: companyName,
                Address: address || "",
                City: city || "",
                State: state || "",
                Pincode: pincode || "",
                GSTNo: gstNo || "",
                Phone: phone || "",
                Email: email || "",
                Status: status || "Active"
            }

        });

    });
};


// ======================================================
// UPDATE COMPANY
// ======================================================

const updateCompany = (req, res) => {

    const { id } = req.params;

    const {
        companyCode,
        companyName,
        address,
        city,
        state,
        pincode,
        gstNo,
        phone,
        email,
        status
    } = req.body;


    if (!companyCode || !companyName) {

        return res.status(400).json({
            success: false,
            message: "Company Code and Company Name are required."
        });
    }


    const sql = `
        UPDATE Companies
        SET
            CompanyCode = ?,
            CompanyName = ?,
            Address = ?,
            City = ?,
            State = ?,
            Pincode = ?,
            GSTNo = ?,
            Phone = ?,
            Email = ?,
            Status = ?
        WHERE CompanyID = ?
    `;


    const values = [
        companyCode.trim(),
        companyName.trim(),
        address || "",
        city || "",
        state || "",
        pincode || "",
        gstNo || "",
        phone || "",
        email || "",
        status || "Active",
        id
    ];


    db.run(sql, values, function (err) {

        if (err) {

            console.error("Update Company Error:", err);

            if (
                err.message &&
                err.message.toLowerCase().includes("unique")
            ) {

                return res.status(409).json({
                    success: false,
                    message: "Company Code already exists."
                });
            }

            return res.status(500).json({
                success: false,
                message: "Failed to update company.",
                error: err.message
            });
        }


        if (this.changes === 0) {

            return res.status(404).json({
                success: false,
                message: "Company not found."
            });
        }


        res.json({
            success: true,
            message: "Company updated successfully."
        });

    });
};


// ======================================================
// DELETE COMPANY
// ======================================================

const deleteCompany = (req, res) => {

    const { id } = req.params;


    const sql = `
        DELETE FROM Companies
        WHERE CompanyID = ?
    `;


    db.run(sql, [id], function (err) {

        if (err) {

            console.error("Delete Company Error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete company.",
                error: err.message
            });
        }


        if (this.changes === 0) {

            return res.status(404).json({
                success: false,
                message: "Company not found."
            });
        }


        res.json({
            success: true,
            message: "Company deleted successfully."
        });

    });
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany
};