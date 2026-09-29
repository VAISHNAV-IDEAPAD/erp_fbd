import { Table, Button, Form } from "react-bootstrap";
import {
    FaSearch,
    FaPlus,
    FaTrash
} from "react-icons/fa";

export default function IndentGrid({

    rows,
    updateRow,
    addRow,
    deleteRow,
    openItemLookup

}) {

    return (

        <>

            <div className="d-flex justify-content-end mb-2">

                <Button
                    variant="primary"
                    onClick={addRow}
                >
                    <FaPlus className="me-2" />
                    Add Item
                </Button>

            </div>

            <Table
                bordered
                hover
                responsive
                className="align-middle"
            >

                <thead className="table-primary">

                    <tr>

                        <th width="60">
                            #
                        </th>

                        <th width="130">
                            Item Code
                        </th>

                        <th>
                            Item Name
                        </th>

                        <th width="180">
                            Specification
                        </th>

                        <th width="80">
                            UOM
                        </th>

                        <th width="100">
                            Qty
                        </th>

                        <th width="220">
                            Remarks
                        </th>

                        <th width="90">
                            Action
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {rows.length === 0 ? (

                        <tr>

                            <td
                                colSpan={8}
                                className="text-center py-4 text-muted"
                            >

                                No Items Added

                            </td>

                        </tr>

                    ) : (

                        rows.map((row, index) => (

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
                                            className="ms-2"
                                            onClick={() => openItemLookup(index)}
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
                                        min="1"
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
                                        variant="danger"
                                        size="sm"
                                        onClick={() => deleteRow(index)}
                                    >

                                        <FaTrash />

                                    </Button>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </Table>

        </>

    );

}