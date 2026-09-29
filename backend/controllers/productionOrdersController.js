const db = require("../config/database");

// ================= GET ALL =================

exports.getAll = (req, res) => {

    db.all(
        `
        SELECT *
        FROM ProductionOrders
        ORDER BY ProductionID DESC
        `,
        [],
        (err, rows) => {

            if (err)
                return res.status(500).json({
                    error: err.message
                });

            res.json(rows);
        }
    );
};

// ================= GET BY ID =================

exports.getById = (req, res) => {

    const id = req.params.id;

    db.get(
        `
        SELECT *
        FROM ProductionOrders
        WHERE ProductionID = ?
        `,
        [id],
        (err, row) => {

            if (err)
                return res.status(500).json({
                    error: err.message
                });

            if (!row)
                return res.status(404).json({
                    message:
                    "Production Order Not Found"
                });

            res.json(row);
        }
    );
};

// ================= CREATE =================

exports.create = (req, res) => {

    const {
        ProductionNo,
        StyleID,
        BOMID,
        OrderQty,
        StartDate,
        EndDate,
        Remarks,
        materials
    } = req.body;

    db.run(
        `
        INSERT INTO ProductionOrders
        (
            ProductionNo,
            StyleID,
            BOMID,
            OrderQty,
            StartDate,
            EndDate,
            Remarks
        )
        VALUES (?,?,?,?,?,?,?)
        `,
        [
            ProductionNo,
            StyleID,
            BOMID,
            OrderQty,
            StartDate,
            EndDate,
            Remarks
        ],
        function (err) {

            if (err)
                return res.status(500).json({
                    error: err.message
                });

            const productionID =
                this.lastID;

            if (
                materials &&
                materials.length > 0
            ) {

                materials.forEach(item => {

                    db.run(
                        `
                        INSERT INTO ProductionMaterials
                        (
                            ProductionID,
                            ItemID,
                            RequiredQty
                        )
                        VALUES (?,?,?)
                        `,
                        [
                            productionID,
                            item.ItemID,
                            item.RequiredQty
                        ]
                    );
                });
            }

            res.json({
                success: true,
                message:
                    "Production Order Created Successfully",
                ProductionID:
                    productionID
            });
        }
    );
};

// ================= UPDATE STATUS =================

exports.updateStatus = (req, res) => {

    const id = req.params.id;
    const { Status } = req.body;

    db.run(
        `
        UPDATE ProductionOrders
        SET Status = ?
        WHERE ProductionID = ?
        `,
        [
            Status,
            id
        ],
        function (err) {

            if (err)
                return res.status(500).json({
                    error: err.message
                });

            res.json({
                success: true,
                message:
                    "Production Status Updated"
            });
        }
    );
};