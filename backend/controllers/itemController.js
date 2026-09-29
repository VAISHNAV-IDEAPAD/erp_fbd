console.log("✅ NEW itemController Loaded");
const db = require("../config/database");

    // Get All Items
   exports.getAllItems = (req, res) => {

    const sql = `
        SELECT *
        FROM Items
        ORDER BY ItemID DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err)
            return res.status(500).json({
                success: false,
                error: err.message
            });

        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    });
};
    // Get Item By ID
    exports.getItemById = (req, res) => {
        const { id } = req.params;

        db.get(
            "SELECT * FROM Items WHERE ItemID = ?",
            [id],
            (err, row) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        error: err.message
                    });
                }

                if (!row) {
                    return res.status(404).json({
                        success: false,
                        message: "Item not found"
                    });
                }

                res.json({
                    success: true,
                    data: row
                });
            }
        );
    };

    // Create Item
    exports.createItem = (req, res) => {

    const {
        ItemCode,
        ItemName,
        ItemType,
        Category,
        SubCategory,
        MaterialType,
        UOM,
        Color,
        Size,
        Thickness,
        GSM,
        SupplierID,
        Rate,
        OpeningStock,
        MinStock,
        MaxStock,
        ReorderLevel,
        HSNCode,
        GSTPercent,
        Remarks,
        Status
    } = req.body;
        const sql = `
INSERT INTO Items
(
    ItemCode,
    ItemName,
    ItemType,
    Category,
    SubCategory,
    MaterialType,
    UOM,
    Color,
    Size,
    Thickness,
    GSM,
    SupplierID,
    Rate,
    OpeningStock,
    CurrentStock,
    MinStock,
    MaxStock,
    ReorderLevel,
    HSNCode,
    GSTPercent,
    Remarks,
    Status
)
VALUES
(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`;
        db.run(
            sql,
            [
    ItemCode,
    ItemName,
    ItemType,
    Category,
    SubCategory,
    MaterialType,
    UOM,
    Color,
    Size,
    Thickness,
    GSM,
    SupplierID,
    Rate,
    OpeningStock,
    OpeningStock,
    MinStock,
    MaxStock,
    ReorderLevel,
    HSNCode,
    GSTPercent,
    Remarks,
    Status || 'Active'
],
            function (err) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        error: err.message
                    });
                }

                res.status(201).json({
                    success: true,
                    message: "Item Added Successfully",
                    itemId: this.lastID
                });
            }
        );
    };

    // Update Item
    // Update Item
    exports.updateItem = (req, res) => {
        const { id } = req.params;

        const {
            item_name,
            item_code,
            category,
            unit,
            purchase_price,
            stock
        } = req.body;

        const sql = `
            UPDATE Items
            SET
                ItemCode = ?,
                ItemName = ?,
                Category = ?,
                UOM = ?,
                Rate = ?,
                OpeningStock = ?,
                CurrentStock = ?
            WHERE ItemID = ?
        `;

        db.run(
            sql,
            [
                item_code,
                item_name,
                category,
                unit,
                purchase_price,
                stock,
                stock,
                id
            ],
            function (err) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        error: err.message
                    });
                }

                if (this.changes === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Item not found"
                    });
                }

                res.json({
                    success: true,
                    message: "Item Updated Successfully"
                });
            }
        );
    };
    // Delete Item
    exports.deleteItem = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM Items WHERE ItemID = ?";

    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        res.json({
            success: true,
            message: "Item Deleted Successfully"
        });
    });
};