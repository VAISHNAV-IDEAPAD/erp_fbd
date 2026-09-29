export default function useIndentValidation() {

    function validate(header, rows) {

        if (!header.DepartmentID && !header.Department) {

            return {

                valid: false,

                message: "Please select a department."

            };

        }

        if (!header.EmployeeID && !header.RequestedBy) {

            return {

                valid: false,

                message: "Please select an employee."

            };

        }

        if (rows.length === 0) {

            return {

                valid: false,

                message: "Please add at least one item."

            };

        }

        for (let i = 0; i < rows.length; i++) {

            const row = rows[i];

            if (!row.itemId && !row.itemCode) {

                return {

                    valid: false,

                    message: `Please select an item in Row ${i + 1}.`

                };

            }

            if (!Number(row.quantity) || Number(row.quantity) <= 0) {

                return {

                    valid: false,

                    message: `Invalid quantity in Row ${i + 1}.`

                };

            }

        }

        return {

            valid: true,

            message: ""

        };

    }

    return {

        validate

    };

}