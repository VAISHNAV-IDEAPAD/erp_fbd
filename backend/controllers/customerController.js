const db = require("../config/database");


// ======================================
// GET ALL CUSTOMERS
// ======================================
exports.getAllCustomers = (req, res) => {

    const sql = `
    SELECT *
    FROM Customers
    ORDER BY CustomerID DESC
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
            count: rows.length,
            data: rows
        });
    });
};


// ======================================
// GET CUSTOMER BY ID
// ======================================
exports.getCustomerById = (req, res) => {

    const { id } = req.params;

    db.get(
        `
        SELECT *
        FROM Customers
        WHERE CustomerID = ?
        `,
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
                    message: "Customer not found"
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
// CREATE CUSTOMER
// ======================================
exports.createCustomer = (req, res) => {

    const {
        CustomerCode,
        CustomerName,
        ContactPerson,
        Phone,
        Email,
        GSTNo,
        Address,
        City,
        State,
        Country,
        CreditDays,
        CreditLimit,
        Status
    } = req.body;

    const sql = `
    INSERT INTO Customers
    (
        CustomerCode,
        CustomerName,
        ContactPerson,
        Phone,
        Email,
        GSTNo,
        Address,
        City,
        State,
        Country,
        CreditDays,
        CreditLimit,
        Status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            CustomerCode,
            CustomerName,
            ContactPerson,
            Phone,
            Email,
            GSTNo,
            Address,
            City,
            State,
            Country,
            CreditDays || 0,
            CreditLimit || 0,
            Status || "Active"
        ],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Customer Created Successfully",
                CustomerID: this.lastID
            });
        }
    );
};


// ======================================
// UPDATE CUSTOMER
// ======================================
exports.updateCustomer = (req, res) => {

    const { id } = req.params;

    const {
        CustomerCode,
        CustomerName,
        ContactPerson,
        Phone,
        Email,
        GSTNo,
        Address,
        City,
        State,
        Country,
        CreditDays,
        CreditLimit,
        Status
    } = req.body;

    const sql = `
    UPDATE Customers
    SET
        CustomerCode = ?,
        CustomerName = ?,
        ContactPerson = ?,
        Phone = ?,
        Email = ?,
        GSTNo = ?,
        Address = ?,
        City = ?,
        State = ?,
        Country = ?,
        CreditDays = ?,
        CreditLimit = ?,
        Status = ?
    WHERE CustomerID = ?
    `;

    db.run(
        sql,
        [
            CustomerCode,
            CustomerName,
            ContactPerson,
            Phone,
            Email,
            GSTNo,
            Address,
            City,
            State,
            Country,
            CreditDays,
            CreditLimit,
            Status,
            id
        ],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Customer Updated Successfully"
            });
        }
    );
};


// ======================================
// DELETE CUSTOMER
// ======================================
exports.deleteCustomer = (req, res) => {

    const { id } = req.params;

    db.run(
        `
        DELETE FROM Customers
        WHERE CustomerID = ?
        `,
        [id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Customer Deleted Successfully"
            });
        }
    );
};