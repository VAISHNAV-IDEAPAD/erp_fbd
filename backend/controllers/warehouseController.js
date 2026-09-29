const db = require("../config/database");

// =====================================================
// GET ALL WAREHOUSES
// =====================================================

exports.getAllWarehouses = (req, res) => {

    const sql = `
        SELECT
            WarehouseID,
            WarehouseCode,
            WarehouseName,
            Location,
            Status,
            CreatedAt
        FROM Warehouses
        ORDER BY WarehouseID DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            console.error("Get Warehouses Error:", err.message);

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
// GET ACTIVE WAREHOUSES
// USED FOR ITEM ISSUE LOOKUP
// =====================================================

exports.getActiveWarehouses = (req, res) => {

    const sql = `
        SELECT
            WarehouseID,
            WarehouseCode,
            WarehouseName,
            Location,
            Status
        FROM Warehouses
        WHERE Status = 'Active'
        ORDER BY WarehouseName
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            console.error(
                "Get Active Warehouses Error:",
                err.message
            );

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
// GET WAREHOUSE BY ID
// =====================================================

exports.getWarehouseById = (req, res) => {

    const { id } = req.params;

    db.get(
        `
        SELECT
            WarehouseID,
            WarehouseCode,
            WarehouseName,
            Location,
            Status,
            CreatedAt
        FROM Warehouses
        WHERE WarehouseID = ?
        `,
        [id],
        (err, row) => {

            if (err) {

                console.error(
                    "Get Warehouse Error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            if (!row) {

                return res.status(404).json({
                    success: false,
                    message: "Warehouse not found"
                });

            }

            res.json({
                success: true,
                data: row
            });

        }
    );

};


// =====================================================
// CREATE WAREHOUSE
// =====================================================

exports.createWarehouse = (req, res) => {

    const {
        WarehouseCode,
        WarehouseName,
        Location,
        Status
    } = req.body;

    if (!WarehouseCode || !WarehouseName) {

        return res.status(400).json({
            success: false,
            message: "Warehouse Code and Warehouse Name are required"
        });

    }

    const sql = `
        INSERT INTO Warehouses
        (
            WarehouseCode,
            WarehouseName,
            Location,
            Status
        )
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            WarehouseCode,
            WarehouseName,
            Location || null,
            Status || "Active"
        ],
        function (err) {

            if (err) {

                console.error(
                    "Create Warehouse Error:",
                    err.message
                );

                return res.status(400).json({
                    success: false,
                    message: err.message
                });

            }

            res.status(201).json({
                success: true,
                message: "Warehouse created successfully",
                data: {
                    WarehouseID: this.lastID,
                    WarehouseCode,
                    WarehouseName,
                    Location: Location || null,
                    Status: Status || "Active"
                }
            });

        }
    );

};


// =====================================================
// UPDATE WAREHOUSE
// =====================================================

exports.updateWarehouse = (req, res) => {

    const { id } = req.params;

    const {
        WarehouseCode,
        WarehouseName,
        Location,
        Status
    } = req.body;

    if (!WarehouseCode || !WarehouseName) {

        return res.status(400).json({
            success: false,
            message: "Warehouse Code and Warehouse Name are required"
        });

    }

    const sql = `
        UPDATE Warehouses
        SET
            WarehouseCode = ?,
            WarehouseName = ?,
            Location = ?,
            Status = ?
        WHERE WarehouseID = ?
    `;

    db.run(
        sql,
        [
            WarehouseCode,
            WarehouseName,
            Location || null,
            Status || "Active",
            id
        ],
        function (err) {

            if (err) {

                console.error(
                    "Update Warehouse Error:",
                    err.message
                );

                return res.status(400).json({
                    success: false,
                    message: err.message
                });

            }

            if (this.changes === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Warehouse not found"
                });

            }

            res.json({
                success: true,
                message: "Warehouse updated successfully"
            });

        }
    );

};


// =====================================================
// DELETE WAREHOUSE
// =====================================================

exports.deleteWarehouse = (req, res) => {

    const { id } = req.params;

    db.run(
        `
        DELETE FROM Warehouses
        WHERE WarehouseID = ?
        `,
        [id],
        function (err) {

            if (err) {

                console.error(
                    "Delete Warehouse Error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            if (this.changes === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Warehouse not found"
                });

            }

            res.json({
                success: true,
                message: "Warehouse deleted successfully"
            });

        }
    );

};