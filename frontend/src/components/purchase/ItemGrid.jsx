import { useState, useMemo } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { FaPlus, FaTrash, FaSearch } from "react-icons/fa";
import ItemLookup from "./ItemLookup";

const emptyRow = () => ({
    itemCode: "",
    itemName: "",
    color: "",
    size: "",
    uom: "",
    qty: 1,
    rate: 0,
    discount: 0,
    gst: 18,
    amount: 0
});

export default function ItemGrid({ itemsMaster }) {

    const [items, setItems] = useState([emptyRow()]);

    const [showLookup, setShowLookup] = useState(false);

    const [selectedRow, setSelectedRow] = useState(null);

    const addRow = () => {

        setItems([...items, emptyRow()]);

    };

    const deleteRow = (index) => {

        if (items.length === 1) {

            setItems([emptyRow()]);
            return;

        }

        setItems(items.filter((_, i) => i !== index));

    };

    const updateItem = (index, field, value) => {

        const updated = [...items];

        updated[index][field] = value;

        const qty = Number(updated[index].qty || 0);
        const rate = Number(updated[index].rate || 0);
        const discount = Number(updated[index].discount || 0);

        updated[index].amount = qty * rate - discount;

        setItems(updated);

    };

    const subtotal = useMemo(() => {

        return items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    }, [items]);

    const gstAmount = useMemo(() => {

        return items.reduce((sum, item) => {

            return sum + ((Number(item.amount || 0) * Number(item.gst || 0)) / 100);

        }, 0);

    }, [items]);

    const grandTotal = subtotal + gstAmount;

    return (

        <>

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h5 className="mb-0">

                    Purchase Items

                </h5>

                <Button onClick={addRow}>

                    <FaPlus className="me-2" />

                    Add Item

                </Button>

            </div>

            <Table bordered hover responsive>

                <thead className="table-dark">

                    <tr>

                        <th width="140">Item</th>

                        <th>Item Name</th>

                        <th>Color</th>

                        <th>Size</th>

                        <th>UOM</th>

                        <th width="90">Qty</th>

                        <th width="100">Rate</th>

                        <th width="90">Disc.</th>

                        <th width="80">GST%</th>

                        <th width="120">Amount</th>

                        <th width="60"></th>

                    </tr>

                </thead>

                <tbody>

                    {

                        items.map((row, index) => (

                            <tr key={index}>

                                <td>

                                    <div className="d-flex">

                                        <Form.Control

                                            value={row.itemCode}

                                            readOnly

                                        />

                                        <Button

                                            variant="outline-primary"

                                            className="ms-1"

                                            onClick={() => {

                                                setSelectedRow(index);

                                                setShowLookup(true);

                                            }}

                                        >

                                            <FaSearch />

                                        </Button>

                                    </div>

                                </td>

                                <td>

                                    <Form.Control

                                        value={row.itemName}

                                        readOnly

                                    />

                                </td>

                                <td>

                                    <Form.Control

                                        value={row.color}

                                        onChange={(e) =>
                                            updateItem(index, "color", e.target.value)
                                        }

                                    />

                                </td>

                                <td>

                                    <Form.Control

                                        value={row.size}

                                        onChange={(e) =>
                                            updateItem(index, "size", e.target.value)
                                        }

                                    />

                                </td>

                                <td>

                                    <Form.Control

                                        value={row.uom}

                                        readOnly

                                    />

                                </td>

                                <td>

                                    <Form.Control

                                        type="number"

                                        value={row.qty}

                                        onChange={(e) =>
                                            updateItem(index, "qty", e.target.value)
                                        }

                                    />

                                </td>

                                <td>

                                    <Form.Control

                                        type="number"

                                        value={row.rate}

                                        onChange={(e) =>
                                            updateItem(index, "rate", e.target.value)
                                        }

                                    />

                                </td>

                                <td>

                                    <Form.Control

                                        type="number"

                                        value={row.discount}

                                        onChange={(e) =>
                                            updateItem(index, "discount", e.target.value)
                                        }

                                    />

                                </td>

                                <td>

                                    <Form.Control

                                        type="number"

                                        value={row.gst}

                                        onChange={(e) =>
                                            updateItem(index, "gst", e.target.value)
                                        }

                                    />

                                </td>

                                <td className="text-end fw-bold">

                                    {row.amount.toFixed(2)}

                                </td>

                                <td>

                                    <Button

                                        variant="danger"

                                        size="sm"

                                        onClick={() => deleteRow(index)}

                                    >

                                        <FaTrash />

                                    </Button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </Table>

            <div className="row justify-content-end">

                <div className="col-md-4">

                    <Table bordered>

                        <tbody>

                            <tr>

                                <th>Subtotal</th>

                                <td className="text-end">

                                    {subtotal.toFixed(2)}

                                </td>

                            </tr>

                            <tr>

                                <th>GST</th>

                                <td className="text-end">

                                    {gstAmount.toFixed(2)}

                                </td>

                            </tr>

                            <tr className="table-primary">

                                <th>Grand Total</th>

                                <th className="text-end">

                                    {grandTotal.toFixed(2)}

                                </th>

                            </tr>

                        </tbody>

                    </Table>

                </div>

            </div>

            <ItemLookup

                show={showLookup}

                onHide={() => setShowLookup(false)}

          onSelect={(item) => {

    const updated = [...items];

    updated[selectedRow] = {

        ...updated[selectedRow],

        itemCode: item.ItemCode,
        itemName: item.ItemName,
        uom: item.UOM,
        rate: Number(item.Rate),
        gst: item.GST ?? 18

    };

    updated[selectedRow].amount =
        updated[selectedRow].qty *
        updated[selectedRow].rate;

    setItems(updated);

}}

            />

        </>

    );

}