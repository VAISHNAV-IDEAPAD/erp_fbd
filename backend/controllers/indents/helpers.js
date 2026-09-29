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

                const last = parseInt(
                    row.IndentNo.replace("IND", "")
                );

                next = last + 1;

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

    if (!body.RequiredDate)
        return "Required Date is required.";

    if (!Array.isArray(body.items))
        return "Items are required.";

    if (body.items.length === 0)
        return "Please add at least one item.";

    for (const item of body.items) {

        if (!item.ItemID)
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