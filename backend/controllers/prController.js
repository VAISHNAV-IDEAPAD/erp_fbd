const db = require("../config/database");

// =====================================
// GET ALL PURCHASE REQUISITIONS
// =====================================
exports.getAllPR = (req, res) => {

    db.all(
        `
        SELECT *
        FROM PurchaseRequisitions
        ORDER BY PRID DESC
        `,
        [],
        (err, rows) => {

            if (err) {
                console.log(err.message);

                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );
};


// =====================================
// GET PURCHASE REQUISITION BY ID
// =====================================
exports.getPRById = (req, res) => {

    db.get(
        `
        SELECT *
        FROM PurchaseRequisitions
        WHERE PRID = ?
        `,
        [req.params.id],
        (err, row) => {

            if (err) {
                console.log(err.message);

                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    message: "PR Not Found"
                });
            }

            res.json(row);
        }
    );
};


// =====================================
// GET PENDING PR
// =====================================
exports.getPendingPR = (req, res) => {

    db.get(
        `
        SELECT *
        FROM PurchaseRequisitions
        WHERE PRID = ?
        AND Status = 'Open'
        `,
        [req.params.id],
        (err, row) => {

            if (err) {
                console.log(err.message);

                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    message: "Pending PR Not Found"
                });
            }

            res.json(row);
        }
    );
};


// =====================================
// CREATE PURCHASE REQUISITION
// =====================================
exports.createPR = (req, res) => {

    const {
        PRNumber,
        RequiredDate,
        Department,
        Remarks,
        items
    } = req.body;

    db.run(
        `
        INSERT INTO PurchaseRequisitions
        (
            PRNumber,
            PRDate,
            RequiredDate,
            Department,
            Status,
            Remarks
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            PRNumber,
            new Date().toISOString().split("T")[0],
            RequiredDate,
            Department,
            "Open",
            Remarks
        ],
        function (err) {

            if (err) {

                console.log(err.message);

                return res.status(500).json({
                    error: err.message
                });
            }

            const prId = this.lastID;

            if (items && items.length > 0) {

                items.forEach(item => {

                    db.run(
                        `
                        INSERT INTO PurchaseRequisitionDetails
                        (
                            PRID,
                            ItemID,
                            RequiredQty
                        )
                        VALUES (?, ?, ?)
                        `,
                        [
                            prId,
                            item.ItemID,
                            item.RequiredQty
                        ]
                    );
                });
            }

            res.json({
                success: true,
                message:
                    "Purchase Requisition Created Successfully",
                PRID: prId
            });
        }
    );
};


// =====================================
// CONVERT PR TO PURCHASE ORDER
// =====================================
exports.convertToPO = (req, res) => {

    const prId = req.params.id;

    db.all(
        `
        SELECT *
        FROM PurchaseRequisitionDetails
        WHERE PRID = ?
        `,
        [prId],
        (err, rows) => {

            if (err) {

                console.log(err.message);

                return res.status(500).json({
                    error: err.message
                });
            }

            if (rows.length === 0) {

                return res.status(404).json({
                    message: "PR Details Not Found"
                });
            }

            const poNumber =
                "PO" + Date.now();

            db.run(
                `
                INSERT INTO PurchaseOrders
                (
                    PONumber,
                    SupplierID,
                    PODate,
                    Status,
                    Remarks
                )
                VALUES (?, ?, ?, ?, ?)
                `,
                [
                    poNumber,
                    1,
                    new Date().toISOString().split("T")[0],
                    "Open",
                    "Generated From PR"
                ],
                function (err) {

                    if (err) {

                        console.log(err.message);

                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    const poId = this.lastID;

                    rows.forEach(item => {

                        db.run(
                            `
                            INSERT INTO PurchaseOrderDetails
                            (
                                POID,
                                ItemID,
                                Qty
                            )
                            VALUES (?, ?, ?)
                            `,
                            [
                                poId,
                                item.ItemID,
                                item.RequiredQty
                            ]
                        );
                    });

                    // Update PR Status
                    db.run(
                        `
                        UPDATE PurchaseRequisitions
                        SET Status = 'Converted'
                        WHERE PRID = ?
                        `,
                        [prId]
                    );

                    res.json({
                        success: true,
                        message:
                            "PO Generated Successfully",
                        POID: poId,
                        PONumber: poNumber
                    });
                }
            );
        }
    );
};