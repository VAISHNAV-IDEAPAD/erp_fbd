const db = require("../config/database");

exports.getAllIssues = (req, res) => {
    db.all("SELECT * FROM MaterialIssues",
        [],
        (err, rows) => {
            if (err)
                return res.status(500).json(err);

            res.json(rows);
        });
};

exports.getIssueById = (req, res) => {

    db.get(
        "SELECT * FROM MaterialIssues WHERE IssueID=?",
        [req.params.id],
        (err, row) => {
            if (err)
                return res.status(500).json(err);

            res.json(row);
        }
    );
};

exports.createIssue = (req, res) => {

    const {
        IssueNo,
        ProductionID,
        IssueDate,
        Remarks,
        items
    } = req.body;

    db.run(
        `INSERT INTO MaterialIssues
        (IssueNo,ProductionID,IssueDate,Remarks)
        VALUES (?,?,?,?)`,
        [IssueNo,
         ProductionID,
         IssueDate,
         Remarks],

        function (err) {

            if (err)
                return res.status(500).json(err);

            const issueId = this.lastID;

            items.forEach(item => {

                db.run(
                    `INSERT INTO MaterialIssueDetails
                    (IssueID,ItemID,
                    RequiredQty,
                    IssuedQty,
                    Rate,
                    Amount)
                    VALUES (?,?,?,?,?,?)`,
                    [
                        issueId,
                        item.ItemID,
                        item.RequiredQty,
                        item.IssuedQty,
                        item.Rate,
                        item.IssuedQty *
                        item.Rate
                    ]
                );

                // Reduce Stock

                db.run(
                    `UPDATE Items
                    SET CurrentStock =
                    CurrentStock - ?
                    WHERE ItemID=?`,
                    [
                        item.IssuedQty,
                        item.ItemID
                    ]
                );
            });

            res.json({
                message:
                "Material Issued Successfully"
            });
        }
    );
};