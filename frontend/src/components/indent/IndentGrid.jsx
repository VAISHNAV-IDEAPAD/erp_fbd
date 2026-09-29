import { Table, Form, Button } from "react-bootstrap";
import { FaPlus, FaTrash, FaSearch } from "react-icons/fa";

export default function IndentGrid({

    rows,

    updateRow,

    addRow,

    deleteRow,

    openItemLookup

}) {

    return (

        <div className="table-responsive">

            <Table
                bordered
                hover
                striped
                className="align-middle"
            >

                <thead className="table-primary">

                    <tr>

                        <th
                            style={{ width: "60px" }}
                            className="text-center"
                        >
                            #
                        </th>

                        <th
                            style={{ width: "140px" }}
                        >
                            Item Code
                        </th>

                        <th>

                            Item Name

                        </th>

                        <th
                            style={{ width: "150px" }}
                        >

                            Specification

                        </th>

                        <th
                            style={{ width: "90px" }}
                        >

                            UOM

                        </th>

                        <th
                            style={{ width: "120px" }}
                        >

                            Quantity

                        </th>

                        <th>

                            Remarks

                        </th>

                        <th
                            style={{ width: "130px" }}
                            className="text-center"
                        >

                            Action

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {rows.map((row, index) => (

                        <tr key={index}>

                            <td className="text-center">

                                {index + 1}

                            </td>

                            <td>

                                <Form.Control

                                    value={row.itemCode}

                                    readOnly

                                />

                            </td>

                            <td>

                                <div className="d-flex">

                                    <Form.Control

                                        value={row.itemName}

                                        readOnly

                                    />

                                    <Button

                                        variant="secondary"

                                        className="ms-1"

                                        onClick={() =>
                                            openItemLookup(index)
                                        }

                                    >

                                        <FaSearch />

                                    </Button>

                                </div>

                            </td>

                            <td>

                                <Form.Control

                                    value={row.specification}

                                    readOnly

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

                                    min={1}

                                    value={row.quantity}

                                    onChange={(e) =>
                                        updateRow(
                                            index,
                                            "quantity",
                                            e.target.value
                                        )
                                    }

                                />

                            </td>

                            <td>

                                <Form.Control

                                    value={row.remarks}

                                    onChange={(e) =>
                                        updateRow(
                                            index,
                                            "remarks",
                                            e.target.value
                                        )
                                    }

                                />

                            </td>

                            <td className="text-center">

                                <Button

                                    variant="success"

                                    size="sm"

                                    className="me-2"

                                    onClick={addRow}

                                >

                                    <FaPlus />

                                </Button>

                                <Button

                                    variant="danger"

                                    size="sm"

                                    onClick={() =>
                                        deleteRow(index)
                                    }

                                >

                                    <FaTrash />

                                </Button>

                            </td>

                        </tr>

                    ))}

                </tbody>
                                <tfoot>

                    <tr>

                        <th
                            colSpan={5}
                            className="text-end"
                        >
                            Total Quantity
                        </th>

                        <th>

                            {rows.reduce(
                                (total, row) =>
                                    total + Number(row.quantity || 0),
                                0
                            )}

                        </th>

                        <th colSpan={2}></th>

                    </tr>

                </tfoot>

            </Table>

            {rows.length === 0 && (

                <div className="text-center p-3">

                    No items added.

                </div>

            )}

        </div>

    );

}