const db = require("../config/database");

// Get All Styles
exports.getAllStyles = (req, res) => {

    const sql = `
    SELECT
        s.*,
        b.BuyerName
    FROM Styles s
    LEFT JOIN Buyers b
    ON s.BuyerID = b.BuyerID
    `;

    db.all(sql, [], (err, rows) => {
        if (err)
            return res.status(500).json(err);

        res.json(rows);
    });
};

// Get Style By ID
exports.getStyleById = (req, res) => {

    db.get(
        `SELECT *
         FROM Styles
         WHERE StyleID = ?`,
        [req.params.id],

        (err, row) => {

            if (err)
                return res.status(500).json(err);

            res.json(row);
        }
    );
};

// Create Style
exports.createStyle = (req, res) => {

    const {
        StyleCode,
        StyleName,
        ProductType,
        BuyerID,
        Season,
        Color,
        SizeRange,
        Remarks
    } = req.body;

    db.run(
        `INSERT INTO Styles
        (
            StyleCode,
            StyleName,
            ProductType,
            BuyerID,
            Season,
            Color,
            SizeRange,
            Remarks
        )
        VALUES (?,?,?,?,?,?,?,?)`,
        [
            StyleCode,
            StyleName,
            ProductType,
            BuyerID,
            Season,
            Color,
            SizeRange,
            Remarks
        ],

        function (err) {

            if (err)
                return res.status(500).json(err);

            res.json({
                message:
                "Style Created Successfully",
                StyleID: this.lastID
            });
        }
    );
};

// Update Style
exports.updateStyle = (req, res) => {

    const {
        StyleCode,
        StyleName,
        ProductType,
        BuyerID,
        Season,
        Color,
        SizeRange,
        Remarks
    } = req.body;

    db.run(
        `UPDATE Styles
        SET
            StyleCode=?,
            StyleName=?,
            ProductType=?,
            BuyerID=?,
            Season=?,
            Color=?,
            SizeRange=?,
            Remarks=?
        WHERE StyleID=?`,
        [
            StyleCode,
            StyleName,
            ProductType,
            BuyerID,
            Season,
            Color,
            SizeRange,
            Remarks,
            req.params.id
        ],

        function (err) {

            if (err)
                return res.status(500).json(err);

            res.json({
                message:
                "Style Updated Successfully"
            });
        }
    );
};

// Delete Style
exports.deleteStyle = (req, res) => {

    db.run(
        `DELETE FROM Styles
         WHERE StyleID=?`,
        [req.params.id],

        function (err) {

            if (err)
                return res.status(500).json(err);

            res.json({
                message:
                "Style Deleted Successfully"
            });
        }
    );
};