import { useState } from "react";

const blankItem = () => ({

    ItemID: "",

    ItemCode: "",

    ItemName: "",

    UOM: "",

    Qty: 1,

    Remarks: ""

});

export default function useIndentItems(setForm) {

    const [selectedRow, setSelectedRow] = useState(null);

    function changeItem(index, field, value) {

        setForm(current => {

            const items = [...current.items];

            items[index] = {

                ...items[index],

                [field]: value

            };

            return {

                ...current,

                items

            };

        });

    }

    function addItem() {

        setForm(current => ({

            ...current,

            items: [

                ...current.items,

                blankItem()

            ]

        }));

    }

    function removeItem(index) {

        setForm(current => ({

            ...current,

            items:

                current.items.length === 1

                    ? [blankItem()]

                    : current.items.filter((_, i) => i !== index)

        }));

    }

    function selectItem(item) {

        if (selectedRow === null)

            return;

        setForm(current => {

            const items = [...current.items];

            items[selectedRow] = {

                ...items[selectedRow],

                ItemID: item.ItemID,

                ItemCode: item.ItemCode,

                ItemName: item.ItemName,

                UOM: item.UOM || ""

            };

            return {

                ...current,

                items

            };

        });

    }

    function clearItems() {

        setForm(current => ({

            ...current,

            items: [

                blankItem()

            ]

        }));

    }

    return {

        selectedRow,

        setSelectedRow,

        changeItem,

        addItem,

        removeItem,

        selectItem,

        clearItems

    };

}