import { useCallback, useEffect, useMemo, useState } from "react";

import {
    Badge,
    Button,
    Card,
    Col,
    Container,
    Form,
    Modal,
    Row,
    Spinner,
    Table,
    InputGroup
} from "react-bootstrap";

import {
    FaCheck,
    FaEye,
    FaPlus,
    FaSave,
    FaSearch,
    FaTimes,
    FaTrash
} from "react-icons/fa";

import ItemLookup from "../../components/indent/ItemLookup";
import DepartmentLookup from "../../components/indent/DepartmentLookup";
import EmployeeLookup from "../../components/indent/EmployeeLookup";
import {
    createIndent,
    getIndent,
    getIndents,
    updateIndent,
    updateIndentStatus
} from "../../services/purchaseService";

const today = () => new Date().toISOString().slice(0, 10);

const blankItem = () => ({

    ItemID: "",

    ItemCode: "",

    ItemName: "",

    UOM: "",

    Qty: 1,

    Remarks: ""

});

const blankForm = () => ({

    IndentDate: today(),

    DepartmentID: "",

    Department: "",

    EmployeeID: "",

    RequestedBy: "",

    RequiredDate: "",

    Remarks: "",

    items: [blankItem()]

});

const badge = (status) => ({

    Draft: "secondary",

    Submitted: "primary",

    Approved: "success",

    Cancelled: "danger"

}[status] || "secondary");

export default function Indents() {

    const [indents, setIndents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [showLookup, setShowLookup] = useState(false);

    const [showDepartmentLookup, setShowDepartmentLookup] = useState(false);

    const [showEmployeeLookup, setShowEmployeeLookup] = useState(false);

    const [selectedRow, setSelectedRow] = useState(null);

    const [editingId, setEditingId] = useState(null);

    const [detail, setDetail] = useState(null);

    const [search, setSearch] = useState("");

    const [notice, setNotice] = useState("");

    const [form, setForm] = useState(blankForm());

    const load = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getIndents();

            setIndents(

                Array.isArray(response.data.data)

                    ? response.data.data

                    : []

            );

        }

        catch (err) {

            console.error(err);

            setNotice("Unable to load indents.");

            setIndents([]);

        }

        finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        load();

    }, [load]);

    const filtered = useMemo(() => {

        return indents.filter(indent => {

            const text = `
                ${indent.IndentNo || ""}
                ${indent.Department || ""}
                ${indent.RequestedBy || ""}
                ${indent.Status || ""}
            `.toLowerCase();

            return text.includes(search.toLowerCase());

        });

    }, [indents, search]);

    const change = (field, value) => {

        setForm(current => ({

            ...current,

            [field]: value

        }));

    };

    const changeItem = (index, field, value) => {

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

    };
        const addItem = () => {

        setForm(current => ({

            ...current,

            items: [

                ...current.items,

                blankItem()

            ]

        }));

    };

    const removeItem = (index) => {

        setForm(current => ({

            ...current,

            items:

                current.items.length === 1

                    ? [blankItem()]

                    : current.items.filter((_, i) => i !== index)

        }));

    };

    const openNew = () => {

        setEditingId(null);

        setForm(blankForm());

        setShowForm(true);

    };

    const selectItem = (item) => {

        changeItem(selectedRow, "ItemID", item.ItemID);

        changeItem(selectedRow, "ItemCode", item.ItemCode);

        changeItem(selectedRow, "ItemName", item.ItemName);

        changeItem(selectedRow, "UOM", item.UOM || "");

        setShowLookup(false);

    };

    const openView = async (id, edit = false) => {

        try {

            const response = await getIndent(id);

            const record = response.data;

            if (edit) {

                setEditingId(id);

                setForm({

                    ...record,

                    items: record.items.map(item => ({

                        ...item,

                        Qty: item.Qty,

                        UOM: item.UOM || item.ItemUOM || ""

                    }))

                });

                setShowForm(true);

            }

            else {

                setDetail(record);

            }

        }

        catch (err) {

            console.error(err);

            setNotice("Unable to open indent.");

        }

    };

    const submit = async (event) => {

        event.preventDefault();

        setSaving(true);

        setNotice("");

        try {

            if (editingId) {

                await updateIndent(editingId, form);

                setNotice("Indent updated successfully.");

            }

            else {

                await createIndent(form);

                setNotice("Indent saved successfully.");

            }

            setShowForm(false);

            await load();

        }

        catch (err) {

            console.error(err);

            setNotice(

                err.response?.data?.message ||

                "Unable to save indent."

            );

        }

        finally {

            setSaving(false);

        }

    };

    const changeStatus = async (id, status) => {

        try {

            await updateIndentStatus(id, status);

            await load();

            if (detail?.IndentID === id) {

                setDetail({

                    ...detail,

                    Status: status

                });

            }

            setNotice(

                `Indent ${status.toLowerCase()}.`

            );

        }

        catch (err) {

            console.error(err);

            setNotice("Unable to update status.");

        }

    };

    return (

        <Container fluid className="py-4 px-lg-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="mb-1">

                        Material Indents

                    </h2>

                    <div className="text-muted">

                        Request materials from departments and monitor approvals.

                    </div>

                </div>

                <Button onClick={openNew}>

                    <FaPlus className="me-2" />

                    New Indent

                </Button>

            </div>

            {notice && (

                <div className="alert alert-info alert-dismissible">

                    {notice}

                    <button

                        className="btn-close"

                        onClick={() =>

                            setNotice("")

                        }

                    />

                </div>

            )}

            <Card className="shadow-sm border-0">

                <Card.Body>

                    <Row className="mb-3">

                        <Col md={5}>

                            <InputGroup>

                                <InputGroup.Text>

                                    <FaSearch />

                                </InputGroup.Text>

                                <Form.Control

                                    placeholder="Search Indents"

                                    value={search}

                                    onChange={(e) =>

                                        setSearch(e.target.value)

                                    }

                                />

                            </InputGroup>

                        </Col>

                        <Col className="text-end text-muted">

                            {filtered.length}

                            {" "}Indent

                            {filtered.length !== 1 && "s"}

                        </Col>

                    </Row>
                                        <Table
                        bordered
                        hover
                        responsive
                    >

                        <thead className="table-primary">

                            <tr>

                                <th>Indent No</th>

                                <th>Date</th>

                                <th>Department</th>

                                <th>Requested By</th>

                                <th>Required Date</th>

                                <th className="text-center">

                                    Items

                                </th>

                                <th>Status</th>

                                <th className="text-end">

                                    Actions

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan={8}
                                        className="text-center py-5"
                                    >

                                        <Spinner
                                            animation="border"
                                            size="sm"
                                            className="me-2"
                                        />

                                        Loading...

                                    </td>

                                </tr>

                            ) : filtered.length ? (

                                filtered.map(indent => (

                                    <tr key={indent.IndentID}>

                                        <td>

                                            <strong>

                                                {indent.IndentNo}

                                            </strong>

                                        </td>

                                        <td>

                                            {indent.IndentDate}

                                        </td>

                                        <td>

                                            {indent.Department}

                                        </td>

                                        <td>

                                            {indent.RequestedBy}

                                        </td>

                                        <td>

                                            {indent.RequiredDate}

                                        </td>

                                        <td className="text-center">

                                            {indent.ItemCount}

                                        </td>

                                        <td>

                                            <Badge bg={badge(indent.Status)}>

                                                {indent.Status}

                                            </Badge>

                                        </td>

                                        <td className="text-end">

                                            <Button

                                                size="sm"

                                                variant="outline-secondary"

                                                onClick={() =>

                                                    openView(indent.IndentID)

                                                }

                                            >

                                                <FaEye />

                                            </Button>

                                            {indent.Status === "Draft" && (

                                                <Button

                                                    size="sm"

                                                    variant="outline-primary"

                                                    className="ms-2"

                                                    onClick={() =>

                                                        openView(

                                                            indent.IndentID,

                                                            true

                                                        )

                                                    }

                                                >

                                                    Edit

                                                </Button>

                                            )}

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td

                                        colSpan={8}

                                        className="text-center py-5 text-muted"

                                    >

                                        No indents found.

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </Table>

                </Card.Body>

            </Card>

            <Modal

                show={showForm}

                onHide={() =>

                    !saving && setShowForm(false)

                }

                size="xl"

                backdrop="static"

            >

                <Form onSubmit={submit}>

                    <Modal.Header closeButton>

                        <Modal.Title>

                            {editingId

                                ? "Edit Indent"

                                : "New Material Indent"}

                        </Modal.Title>

                    </Modal.Header>

                    <Modal.Body>

                        <Row>

                            <Col md={3}>

                                <Form.Group className="mb-3">

                                    <Form.Label>

                                        Indent No.

                                    </Form.Label>

                                    <Form.Control

                                        value={
                                            editingId
                                                ? form.IndentNo
                                                : "Generated on Save"
                                        }

                                        readOnly

                                    />

                                </Form.Group>

                            </Col>

                            <Col md={3}>

                                <Form.Group className="mb-3">

                                    <Form.Label>

                                        Indent Date

                                    </Form.Label>

                                    <Form.Control

                                        required

                                        type="date"

                                        value={form.IndentDate}

                                        onChange={(e) =>

                                            change(

                                                "IndentDate",

                                                e.target.value

                                            )

                                        }

                                    />

                                </Form.Group>

                            </Col>

                            <Col md={3}>

                                <Form.Group className="mb-3">

                                    <Form.Label>

                                        Department

                                    </Form.Label>

                                    <InputGroup>

                                        <Form.Control

                                            required

                                            readOnly

                                            value={form.Department}

                                            placeholder="Select Department"

                                        />

                                        <Button

                                            type="button"

                                            variant="outline-primary"

                                            onClick={() =>

                                                setShowDepartmentLookup(true)

                                            }

                                        >

                                            <FaSearch />

                                        </Button>

                                    </InputGroup>

                                </Form.Group>

                            </Col>

                            <Col md={3}></Col>
                                                        <Col md={3}>

                                <Form.Group className="mb-3">

                                    <Form.Label>

                                        Requested By

                                    </Form.Label>

                                    <InputGroup>

                                        <Form.Control

                                            required

                                            readOnly

                                            value={form.RequestedBy}

                                            placeholder="Select Employee"

                                        />

                                        <Button

                                            type="button"

                                            variant="outline-primary"

                                            onClick={() =>

                                                setShowEmployeeLookup(true)

                                            }

                                        >

                                            <FaSearch />

                                        </Button>

                                    </InputGroup>

                                </Form.Group>

                            </Col>

                        </Row>

                        <Row>

                            <Col md={3}>

                                <Form.Group className="mb-3">

                                    <Form.Label>

                                        Required Date

                                    </Form.Label>

                                    <Form.Control

                                        required

                                        type="date"

                                        min={form.IndentDate}

                                        value={form.RequiredDate}

                                        onChange={(e) =>

                                            change(

                                                "RequiredDate",

                                                e.target.value

                                            )

                                        }

                                    />

                                </Form.Group>

                            </Col>

                            <Col md={9}>

                                <Form.Group className="mb-3">

                                    <Form.Label>

                                        Remarks

                                    </Form.Label>

                                    <Form.Control

                                        value={form.Remarks}

                                        onChange={(e) =>

                                            change(

                                                "Remarks",

                                                e.target.value

                                            )

                                        }

                                    />

                                </Form.Group>

                            </Col>

                        </Row>

                        <div className="d-flex justify-content-between align-items-center border-top pt-3 mb-2">

                            <h5 className="mb-0">

                                Requested Items

                            </h5>

                            <Button

                                type="button"

                                size="sm"

                                onClick={addItem}

                            >

                                <FaPlus className="me-1" />

                                Add Item

                            </Button>

                        </div>

                        <Table bordered responsive>

                            <thead>

                                <tr>

                                    <th>Item</th>

                                    <th>Item Name</th>

                                    <th width="90">

                                        UOM

                                    </th>

                                    <th width="120">

                                        Qty

                                    </th>

                                    <th>

                                        Remarks

                                    </th>

                                    <th width="60"></th>

                                </tr>

                            </thead>

                            <tbody>

                                {form.items.map((item, index) => (

                                    <tr key={index}>

                                        <td>

                                            <InputGroup>

                                                <Form.Control

                                                    readOnly

                                                    value={item.ItemCode}

                                                />

                                                <Button

                                                    type="button"

                                                    variant="outline-primary"

                                                    onClick={() => {

                                                        setSelectedRow(index);

                                                        setShowLookup(true);

                                                    }}

                                                >

                                                    <FaSearch />

                                                </Button>

                                            </InputGroup>

                                        </td>

                                        <td>

                                            {item.ItemName || "-"}

                                        </td>

                                        <td>

                                            {item.UOM || "-"}

                                        </td>

                                        <td>

                                            <Form.Control

                                                required

                                                type="number"

                                                min="1"

                                                value={item.Qty}

                                                onChange={(e) =>

                                                    changeItem(

                                                        index,

                                                        "Qty",

                                                        e.target.value

                                                    )

                                                }

                                            />

                                        </td>

                                        <td>

                                            <Form.Control

                                                value={item.Remarks}

                                                onChange={(e) =>

                                                    changeItem(

                                                        index,

                                                        "Remarks",

                                                        e.target.value

                                                    )

                                                }

                                            />

                                        </td>

                                        <td>

                                            <Button

                                                variant="outline-danger"

                                                size="sm"

                                                onClick={() =>

                                                    removeItem(index)

                                                }

                                            >

                                                <FaTrash />

                                            </Button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </Table>

                    </Modal.Body>

                    <Modal.Footer>

                        <Button

                            variant="secondary"

                            onClick={() =>

                                setShowForm(false)

                            }

                            disabled={saving}

                        >

                            Cancel

                        </Button>

                        <Button

                            type="submit"

                            disabled={saving}

                        >

                            {saving ? (

                                "Saving..."

                            ) : (

                                <>

                                    <FaSave className="me-2" />

                                    Save Draft

                                </>

                            )}

                        </Button>

                    </Modal.Footer>

                </Form>

            </Modal>
                        <ItemLookup
                show={showLookup}
                onHide={() => setShowLookup(false)}
                onSelect={selectItem}
            />

            <DepartmentLookup
                show={showDepartmentLookup}
                onHide={() =>
                    setShowDepartmentLookup(false)
                }
                onSelect={(department) => {

                    change(
                        "DepartmentID",
                        department.DepartmentID
                    );

                    change(
                        "Department",
                        department.DepartmentName
                    );

                    setShowDepartmentLookup(false);

                }}
            />

            <EmployeeLookup
                show={showEmployeeLookup}
                onHide={() =>
                    setShowEmployeeLookup(false)
                }
                onSelect={(employee) => {

                    change(
                        "EmployeeID",
                        employee.EmployeeID
                    );

                    change(
                        "RequestedBy",
                        employee.EmployeeName
                    );

                    setShowEmployeeLookup(false);

                }}
            />

            <Modal
                show={Boolean(detail)}
                onHide={() => setDetail(null)}
                size="lg"
            >

                <Modal.Header closeButton>

                    <Modal.Title>

                        Indent {detail?.IndentNo}

                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    {detail && (

                        <>

                            <Row>

                                <Col md={6}>

                                    <strong>

                                        Department :

                                    </strong>{" "}

                                    {detail.Department}

                                </Col>

                                <Col md={6}>

                                    <strong>

                                        Requested By :

                                    </strong>{" "}

                                    {detail.RequestedBy}

                                </Col>

                                <Col md={6}>

                                    <strong>

                                        Required Date :

                                    </strong>{" "}

                                    {detail.RequiredDate}

                                </Col>

                                <Col md={6}>

                                    <strong>

                                        Status :

                                    </strong>{" "}

                                    <Badge
                                        bg={badge(detail.Status)}
                                    >

                                        {detail.Status}

                                    </Badge>

                                </Col>

                            </Row>

                            <hr />

                            <Table
                                bordered
                                responsive
                            >

                                <thead>

                                    <tr>

                                        <th>

                                            Item Code

                                        </th>

                                        <th>

                                            Item Name

                                        </th>

                                        <th>

                                            UOM

                                        </th>

                                        <th>

                                            Qty

                                        </th>

                                        <th>

                                            Remarks

                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {detail.items?.map(item => (

                                        <tr
                                            key={item.DetailID}
                                        >

                                            <td>

                                                {item.ItemCode}

                                            </td>

                                            <td>

                                                {item.ItemName}

                                            </td>

                                            <td>

                                                {item.UOM}

                                            </td>

                                            <td>

                                                {item.Qty}

                                            </td>

                                            <td>

                                                {item.Remarks || "-"}

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </Table>

                        </>

                    )}

                </Modal.Body>

                <Modal.Footer>

                    {detail?.Status === "Draft" && (

                        <Button
                            variant="primary"
                            onClick={() =>
                                changeStatus(
                                    detail.IndentID,
                                    "Submitted"
                                )
                            }
                        >

                            <FaCheck className="me-2" />

                            Submit

                        </Button>

                    )}

                    {detail?.Status === "Submitted" && (

                        <>

                            <Button
                                variant="success"
                                onClick={() =>
                                    changeStatus(
                                        detail.IndentID,
                                        "Approved"
                                    )
                                }
                            >

                                <FaCheck className="me-2" />

                                Approve

                            </Button>

                            <Button
                                variant="danger"
                                onClick={() =>
                                    changeStatus(
                                        detail.IndentID,
                                        "Cancelled"
                                    )
                                }
                            >

                                <FaTimes className="me-2" />

                                Cancel

                            </Button>

                        </>

                    )}

                    <Button
                        variant="secondary"
                        onClick={() =>
                            setDetail(null)
                        }
                    >

                        Close

                    </Button>

                </Modal.Footer>

            </Modal>

        </Container>

    );

}
