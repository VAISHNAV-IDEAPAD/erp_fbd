const db = require("../../config/database");

// ======================================================
// GENERATE INDENT NUMBER
// ======================================================

function generateIndentNo(callback) {

    db.get(
        `
        SELECT IndentNo
        FROM Indents
        ORDER BY IndentID DESC
        LIMIT 1
        `,
        [],
        (err, row) => {

            if (err) return callback(err);

            let next = 1;

            if (row && row.IndentNo) {

                const match = String(row.IndentNo).match(/(\d+)$/);
                if (match) {
                    next = parseInt(match[1], 10) + 1;
                }

            }

            callback(
                null,
                "IND" + String(next).padStart(6, "0")
            );

        }
    );

}

// ======================================================
// VALIDATE INDENT
// ======================================================

function validateIndent(body) {

    if (!body.DepartmentID)
        return "Department is required.";

    if (!body.EmployeeID)
        return "Employee is required.";

    if (!body.RequiredDate && !body.IndentDate)
        return "Required Date is required.";

    const items = body.items || body.Items;

    if (!Array.isArray(items))
        return "Items are required.";

    if (items.length === 0)
        return "Please add at least one item.";

    for (const item of items) {

        if (!item.ItemID && !item.ItemCode && !item.ItemName)
            return "Invalid Item.";

        if (Number(item.Qty) <= 0)
            return "Quantity must be greater than zero.";

    }

    return null;

}

module.exports = {

    generateIndentNo,
    validateIndent

};