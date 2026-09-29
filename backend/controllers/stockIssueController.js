const db = require("../config/database");


// =============================
// GET ALL STOCK ISSUES
// =============================
exports.getAllIssues = (req, res) => {

    const sql = `
        SELECT *
        FROM StockIssues
        ORDER BY IssueID DESC
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


// =============================
// GET ISSUE BY ID
// =============================
exports.getIssueById = (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT *
        FROM StockIssues
        WHERE IssueID = ?
    `;

    db.get(sql, [id], (err, row) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            data: row
        });

    });

};


// =============================
// GET ISSUE DETAILS
// =============================
exports.getIssueDetails = (req, res) => {

    const sql = `
        SELECT
            d.DetailID,
            d.IssueID,
            d.ItemID,
            i.ItemName,
            d.Qty,
            d.Rate,
            d.Amount
        FROM StockIssueDetails d
        LEFT JOIN Items i
            ON d.ItemID = i.ItemID
        ORDER BY d.DetailID DESC
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


// =============================
// CREATE STOCK ISSUE
// =============================
exports.createIssue = (req, res) => {

    const {
        IssueNo,
        IssueDate,
        Department,
        Remarks,
        Items
    } = req.body;

    db.run(
        `
        INSERT INTO StockIssues
        (
            IssueNo,
            IssueDate,
            Department,
            Remarks
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            IssueNo,
            IssueDate,
            Department,
            Remarks
        ],

        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            const issueID = this.lastID;

            Items.forEach(item => {

                const amount =
                    item.Qty * item.Rate;

                // Insert Details
                db.run(
                    `
                    INSERT INTO
                    StockIssueDetails
                    (
                        IssueID,
                        ItemID,
                        Qty,
                        Rate,
                        Amount
                    )
                    VALUES (?, ?, ?, ?, ?)
                    `,
                    [
                        issueID,
                        item.ItemID,
                        item.Qty,
                        item.Rate,
                        amount
                    ]
                );

                // Reduce Stock
                db.run(
                    `
                    UPDATE Items
                    SET CurrentStock =
                        CurrentStock - ?
                    WHERE ItemID = ?
                    `,
                    [
                        item.Qty,
                        item.ItemID
                    ]
                );

            });

            res.json({
                success: true,
                message: "Stock Issued Successfully"
            });

        }
    );

};