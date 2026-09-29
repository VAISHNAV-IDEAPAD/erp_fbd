const db = require("../config/database");


// ================= GET ALL BOM =================
exports.getAllBOMs = (req, res) => {

    const sql = `
        SELECT
            b.BOMID,
            b.BOMNo,
            i.ItemCode AS StyleCode,
            i.ItemName AS StyleName,
            b.VersionNo,
            b.CreatedDate,
            b.Remarks
        FROM BOMs b
        LEFT JOIN Items i
            ON b.StyleID = i.ItemID
        ORDER BY b.BOMID DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json({
            success: true,
            count: rows.length,
            data: rows
        });

    });

};


// ================= GET SINGLE BOM =================
exports.getBOMById = (req, res) => {

    const { id } = req.params;

    db.get(
        `SELECT * FROM BOMs WHERE BOMID = ?`,
        [id],
        (err, bom) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            if (!bom) {
                return res.status(404).json({
                    success: false,
                    message: "BOM not found"
                });
            }

            const detailSql = `
                SELECT
                    d.*,
                    i.ItemCode,
                    i.ItemName
                FROM BOMDetails d
                LEFT JOIN Items i
                    ON d.ItemID = i.ItemID
                WHERE d.BOMID = ?
            `;

            db.all(detailSql, [id], (err, details) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        error: err.message
                    });
                }

                bom.items = details;

                res.json({
                    success: true,
                    data: bom
                });

            });

        }
    );

};


// ================= CREATE BOM =================
exports.createBOM = (req, res) => {

    const {
        BOMNo,
        StyleID,
        VersionNo,
        CreatedDate,
        Remarks,
        items
    } = req.body;

    const sql = `
        INSERT INTO BOMs
        (
            BOMNo,
            StyleID,
            VersionNo,
            CreatedDate,
            Remarks
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            BOMNo,
            StyleID,
            VersionNo,
            CreatedDate,
            Remarks
        ],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            const BOMID = this.lastID;

            if (!items || items.length === 0) {
                return res.json({
                    success: true,
                    message: "BOM Created Successfully",
                    BOMID
                });
            }

            const detailSql = `
                INSERT INTO BOMDetails
                (
                    BOMID,
                    ItemID,
                    ItemType,
                    Color,
                    Size,
                    Consumption,
                    WastagePercent,
                    TotalConsumption,
                    Rate,
                    Amount
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            items.forEach(item => {

                const totalConsumption =
                    item.Consumption +
                    (
                        item.Consumption *
                        item.WastagePercent
                    ) / 100;

                const amount =
                    totalConsumption * item.Rate;

                db.run(detailSql, [
                    BOMID,
                    item.ItemID,
                    item.ItemType,
                    item.Color,
                    item.Size,
                    item.Consumption,
                    item.WastagePercent,
                    totalConsumption,
                    item.Rate,
                    amount
                ]);

            });

            res.json({
                success: true,
                message: "BOM Created Successfully",
                BOMID
            });

        }
    );

};


// ================= UPDATE BOM =================
exports.updateBOM = (req, res) => {

    const { id } = req.params;

    const {
        BOMNo,
        StyleID,
        VersionNo,
        CreatedDate,
        Remarks,
        items
    } = req.body;

    const sql = `
        UPDATE BOMs
        SET
            BOMNo = ?,
            StyleID = ?,
            VersionNo = ?,
            CreatedDate = ?,
            Remarks = ?
        WHERE BOMID = ?
    `;

    db.run(
        sql,
        [
            BOMNo,
            StyleID,
            VersionNo,
            CreatedDate,
            Remarks,
            id
        ],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            db.run(
                `DELETE FROM BOMDetails WHERE BOMID = ?`,
                [id],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            error: err.message
                        });
                    }

                    if (!items || items.length === 0) {
                        return res.json({
                            success: true,
                            message: "BOM Updated Successfully"
                        });
                    }

                    const detailSql = `
                        INSERT INTO BOMDetails
                        (
                            BOMID,
                            ItemID,
                            ItemType,
                            Color,
                            Size,
                            Consumption,
                            WastagePercent,
                            TotalConsumption,
                            Rate,
                            Amount
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;

                    items.forEach(item => {

                        const totalConsumption =
                            item.Consumption +
                            (
                                item.Consumption *
                                item.WastagePercent
                            ) / 100;

                        const amount =
                            totalConsumption * item.Rate;

                        db.run(detailSql, [
                            id,
                            item.ItemID,
                            item.ItemType,
                            item.Color,
                            item.Size,
                            item.Consumption,
                            item.WastagePercent,
                            totalConsumption,
                            item.Rate,
                            amount
                        ]);

                    });

                    res.json({
                        success: true,
                        message: "BOM Updated Successfully"
                    });

                }
            );

        }
    );

};


// ================= DELETE BOM =================
exports.deleteBOM = (req, res) => {

    const { id } = req.params;

    db.run(
        `DELETE FROM BOMDetails WHERE BOMID = ?`,
        [id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            db.run(
                `DELETE FROM BOMs WHERE BOMID = ?`,
                [id],
                function (err) {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            error: err.message
                        });
                    }

                    res.json({
                        success: true,
                        message: "BOM Deleted Successfully"
                    });

                }
            );

        }
    );

};


// ================= BOM COSTING =================
exports.getBOMCosting = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            d.*,
            i.ItemCode,
            i.ItemName
        FROM BOMDetails d
        LEFT JOIN Items i
            ON d.ItemID = i.ItemID
        WHERE d.BOMID = ?
    `;

    db.all(sql, [id], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        let materialCost = 0;

        rows.forEach(item => {
            materialCost += item.Amount;
        });

        res.json({
            success: true,
            materialCost,
            items: rows
        });

    });

};
// ================= BOM EXPLOSION =================
exports.explodeBOM = (req, res) => {

    const { id, qty } = req.params;

    const sql = `
        SELECT
            d.DetailID,
            d.ItemID,
            d.ItemType,
            d.TotalConsumption,
            i.ItemCode,
            i.ItemName,
            i.UOM,
            i.CurrentStock
        FROM BOMDetails d
        LEFT JOIN Items i
            ON d.ItemID = i.ItemID
        WHERE d.BOMID = ?
    `;

    db.all(sql, [id], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No BOM Details Found"
            });
        }

        const materials = rows.map(item => {

            const requiredQty =
                item.TotalConsumption * Number(qty);

            const stock =
                item.CurrentStock || 0;

            const shortage =
                requiredQty > stock
                    ? requiredQty - stock
                    : 0;

            return {
                ItemID: item.ItemID,
                ItemCode: item.ItemCode,
                ItemName: item.ItemName,
                ItemType: item.ItemType,
                UOM: item.UOM,
                ConsumptionPerPiece:
                    item.TotalConsumption,
                ProductionQty:
                    Number(qty),
                RequiredQty:
                    Number(requiredQty.toFixed(3)),
                AvailableStock:
                    stock,
                ShortageQty:
                    Number(shortage.toFixed(3))
            };
        });

        res.json({
            success: true,
            BOMID: Number(id),
            ProductionQty: Number(qty),
            materials
        });

    });

};