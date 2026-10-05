import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaPlus, FaSyncAlt, FaSearch, FaBoxes } from "react-icons/fa";
import axios from "axios";

export default function MMModuleView({
    title,
    moduleName,
    apiEndpoint,
    columns = [
        { key: "DocNo", label: "Doc #" },
        { key: "DocDate", label: "Date" },
        { key: "Department", label: "Department" },
        { key: "ItemName", label: "Item / Material" },
        { key: "Quantity", label: "Quantity" },
        { key: "Status", label: "Status" }
    ],
    initialSampleData = []
}) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({
        DocNo: "",
        Department: "Manufacturing",
        ItemName: "Fabric / Material",
        Quantity: "100",
        Remarks: "",
        Status: "Pending"
    });

    const loadData = async () => {
        setLoading(true);
        try {
            if (apiEndpoint) {
                const res = await axios.get(apiEndpoint);
                const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                if (data.length > 0) {
                    setRecords(data);
                    setLoading(false);
                    return;
                }
            }
        } catch (e) {
            console.warn(`API ${apiEndpoint} not responding, using local persistence`);
        }

        // Check local storage for persistent user inputs
        const saved = localStorage.getItem(`erp_mm_${moduleName}`);
        if (saved) {
            try {
                setRecords(JSON.parse(saved));
                setLoading(false);
                return;
            } catch (err) {}
        }

        // Fallback default sample data
        setRecords(initialSampleData);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [moduleName]);

    const handleCreate = (e) => {
        e.preventDefault();
        const docNumber = newItem.DocNo || `${moduleName.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`;
        const record = {
            ...newItem,
            id: Date.now(),
            DocNo: docNumber,
            DocDate: new Date().toISOString().split("T")[0]
        };

        const updated = [record, ...records];
        setRecords(updated);
        localStorage.setItem(`erp_mm_${moduleName}`, JSON.stringify(updated));
        setShowModal(false);
        setNewItem({
            DocNo: "",
            Department: "Manufacturing",
            ItemName: "Fabric / Material",
            Quantity: "100",
            Remarks: "",
            Status: "Pending"
        });
    };

    const filtered = records.filter(r =>
        Object.values(r).some(val =>
            String(val || "").toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaBoxes className="me-2 fs-5" />
                        <div>
                            <h5 className="mb-0 fw-bold">{title}</h5>
                            <small className="opacity-75">Material Management Workflow &middot; {moduleName}</small>
                        </div>
                    </div>
                    <div>
                        <Button variant="light" size="sm" className="me-2" onClick={loadData} disabled={loading}>
                            <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                        </Button>
                        <Button variant="warning" size="sm" onClick={() => setShowModal(true)}>
                            <FaPlus /> New Entry
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={4}>
                            <div className="input-group">
                                <span className="input-group-text bg-white"><FaSearch className="text-muted" /></span>
                                <Form.Control
                                    type="text"
                                    placeholder={`Search ${title}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">Loading {title} records...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FaBoxes size={48} className="mb-3 text-secondary opacity-50" />
                            <h5>No Records Found</h5>
                            <p>Click "New Entry" to add the first {title} document.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        {columns.map(col => (
                                            <th key={col.key}>{col.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((item, idx) => (
                                        <tr key={item.id || idx}>
                                            {columns.map(col => {
                                                const val = item[col.key];
                                                if (col.key === "Status") {
                                                    return (
                                                        <td key={col.key}>
                                                            <Badge bg={
                                                                val === "Approved" || val === "Completed" ? "success" :
                                                                val === "Rejected" ? "danger" :
                                                                val === "In Progress" ? "info" : "warning"
                                                            } text={val === "Pending" ? "dark" : ""}>
                                                                {val || "Pending"}
                                                            </Badge>
                                                        </td>
                                                    );
                                                }
                                                return <td key={col.key}>{val !== undefined && val !== null ? String(val) : "-"}</td>;
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* CREATE MODAL */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Form onSubmit={handleCreate}>
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title className="fs-6">New {title} Entry</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Document / Reference Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Leave blank for Auto-generated"
                                        value={newItem.DocNo}
                                        onChange={(e) => setNewItem({ ...newItem, DocNo: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Item / Material</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="e.g. Cotton 40s Fabric, Sewing Thread, Zipper"
                                        value={newItem.ItemName}
                                        onChange={(e) => setNewItem({ ...newItem, ItemName: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Quantity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        required
                                        value={newItem.Quantity}
                                        onChange={(e) => setNewItem({ ...newItem, Quantity: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Department</Form.Label>
                                    <Form.Select
                                        value={newItem.Department}
                                        onChange={(e) => setNewItem({ ...newItem, Department: e.target.value })}
                                    >
                                        <option value="Manufacturing">Manufacturing</option>
                                        <option value="Cutting">Cutting</option>
                                        <option value="Sewing">Sewing</option>
                                        <option value="Finishing">Finishing</option>
                                        <option value="Store">Store / Warehouse</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Remarks</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Notes, instructions or inspection details..."
                                        value={newItem.Remarks}
                                        onChange={(e) => setNewItem({ ...newItem, Remarks: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="sm" type="submit">
                            Save Record
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}
