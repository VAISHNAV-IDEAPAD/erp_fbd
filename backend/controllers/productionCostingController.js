const db = require("../config/database");


// ======================================
// GET ALL COSTING
// ======================================
exports.getAllCosting = (req, res) => {

    const sql = `
    SELECT
        pc.*,
        p.ProductionNo,
        s.StyleName
    FROM ProductionCosting pc
    LEFT JOIN ProductionOrders p
        ON pc.ProductionID = p.ProductionID
    LEFT JOIN Styles s
        ON p.StyleID = s.StyleID
    ORDER BY pc.CostingID DESC
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
// GET COSTING BY PRODUCTION ID
// ======================================
exports.getCostingByProduction = (req, res) => {

    const { id } = req.params;

    const sql = `
    SELECT
        pc.*,
        p.ProductionNo,
        s.StyleName
    FROM ProductionCosting pc
    LEFT JOIN ProductionOrders p
        ON pc.ProductionID = p.ProductionID
    LEFT JOIN Styles s
        ON p.StyleID = s.StyleID
    WHERE pc.ProductionID = ?
    `;

    db.get(sql, [id], (err, row) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (!row) {
            return res.status(404).json({
                success: false,
                message: "Costing not found"
            });
        }

        res.json({
            success: true,
            data: row
        });
    });
};


// ======================================
// CREATE COSTING
// ======================================
exports.createCosting = (req, res) => {

    const {
        ProductionID,
        MaterialCost,
        LabourCost,
        OverheadCost
    } = req.body;

    db.get(
        `
        SELECT *
        FROM ProductionOrders
        WHERE ProductionID = ?
        `,
        [ProductionID],
        (err, production) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (!production) {
                return res.status(404).json({
                    success: false,
                    message: "Production Order not found"
                });
            }

            const producedQty =
                Number(production.ProducedQty || 0);

            const totalCost =
                Number(MaterialCost || 0) +
                Number(LabourCost || 0) +
                Number(OverheadCost || 0);

            const costPerUnit =
                producedQty > 0
                    ? totalCost / producedQty
                    : 0;

            const sql = `
            INSERT INTO ProductionCosting
            (
                ProductionID,
                MaterialCost,
                LabourCost,
                OverheadCost,
                TotalCost,
                CostPerUnit
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.run(
                sql,
                [
                    ProductionID,
                    MaterialCost,
                    LabourCost,
                    OverheadCost,
                    totalCost,
                    costPerUnit
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
                        message:
                            "Production Costing Created Successfully",
                        CostingID: this.lastID
                    });
                }
            );
        }
    );
};