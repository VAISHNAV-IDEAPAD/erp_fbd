const db = require("../config/database");

// Get All Suppliers
exports.getAllSuppliers = (req, res) => {
    db.all("SELECT * FROM Suppliers", [], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });

        res.json(rows);
    });
};

// Get Supplier By ID
exports.getSupplierById = (req, res) => {
    db.get(
        "SELECT * FROM Suppliers WHERE SupplierID=?",
        [req.params.id],
        (err, row) => {

            if (err)
                return res.status(500).json({ error: err.message });

            if (!row)
                return res.status(404).json({
                    message: "Supplier not found"
                });

            res.json(row);
        }
    );
};

// Add Supplier
exports.addSupplier = (req, res) => {

    const {
        SupplierCode,
        SupplierName,
        ContactPerson,
        Phone,
        Email,
        GSTNo,
        Address,
        City,
        State,
        Pincode
    } = req.body;

    const sql = `
    INSERT INTO Suppliers
    (
        SupplierCode,
        SupplierName,
        ContactPerson,
        Phone,
        Email,
        GSTNo,
        Address,
        City,
        State,
        Pincode
    )
    VALUES(?,?,?,?,?,?,?,?,?,?)
    `;

    db.run(
        sql,
        [
            SupplierCode,
            SupplierName,
            ContactPerson,
            Phone,
            Email,
            GSTNo,
            Address,
            City,
            State,
            Pincode
        ],
        function(err){

            if(err)
                return res.status(500).json({ error: err.message });

            res.status(201).json({
                message:"Supplier added successfully",
                SupplierID:this.lastID
            });

        }
    );
};

// Update Supplier
exports.updateSupplier = (req, res) => {
    res.json({
        message: "Update Supplier - Coming Soon"
    });
};

// Delete Supplier
exports.deleteSupplier = (req, res) => {
    res.json({
        message: "Delete Supplier - Coming Soon"
    });
};