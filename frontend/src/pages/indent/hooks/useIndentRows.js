import { useMemo, useState } from "react";

const emptyRow = () => ({

    itemId: "",

    itemCode: "",

    itemName: "",

    specification: "",

    uom: "",

    quantity: 1,

    remarks: ""

});

export default function useIndentRows() {

    const [rows, setRows] = useState([

        emptyRow()

    ]);

    const [selectedRow, setSelectedRow] = useState(null);

    function addRow() {

        setRows(prev => ([

            ...prev,

            emptyRow()

        ]));

    }

    function updateRow(index, field, value) {

        setRows(prev =>

            prev.map((row, i) =>

                i === index

                    ? {

                        ...row,

                        [field]: value

                    }

                    : row

            )

        );

    }

    function deleteRow(index) {

        setRows(prev => {

            if (prev.length === 1)

                return [emptyRow()];

            return prev.filter((_, i) => i !== index);

        });

    }

    function openItemLookup(index) {

        setSelectedRow(index);

    }

    function selectItem(item) {

        if (selectedRow === null)

            return;

        setRows(prev =>

            prev.map((row, i) =>

                i === selectedRow

                    ? {

                        ...row,

                        itemId: item.ItemID,

                        itemCode: item.ItemCode,

                        itemName: item.ItemName,

                        specification: item.Specification || "",

                        uom: item.UOM || ""

                    }

                    : row

            )

        );

        setSelectedRow(null);

    }

    function resetRows() {

        setRows([

            emptyRow()

        ]);

    }

    const totalQty = useMemo(() => {

        return rows.reduce(

            (sum, row) =>

                sum + Number(row.quantity || 0),

            0

        );

    }, [rows]);

    return {

        rows,

        setRows,

        selectedRow,

        setSelectedRow,

        addRow,

        updateRow,

        deleteRow,

        openItemLookup,

        selectItem,

        totalQty,

        resetRows

    };

}