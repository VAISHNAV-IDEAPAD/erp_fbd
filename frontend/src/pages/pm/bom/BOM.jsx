import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaCogs, FaPlus, FaSyncAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function BOM() {
    const [boms, setBoms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        BOMNo: "",
        StyleID: 1,
        Description: "",
        Status: "Active"
    });

    const fetchBOMs = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/boms");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setBoms(data);
        } catch (err) {
            console.error("Error fetching BOMs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBOMs();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/boms", formData);
            setShowModal(false);
            fetchBOMs();
        } catch (err) {
            console.error("Error creating BOM:", err);
            alert("Failed to create BOM");
        }
    };

    const filtered = boms.filter((b) =>
        (b.BOMNo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.StyleName || b.Description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaCogs className="me-2 fs-5" />
                        <div>
                            <h5 className="mb-0 fw-bold">Bill of Materials (BOM)</h5>
                            <small className="opacity-75">Material consumption blueprints & garment recipes</small>
                        </div>
                    </div>
                    <div>
                        <Button variant="light" size="sm" className="me-2" onClick={fetchBOMs} disabled={loading}>
                            <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                        </Button>
                        <Button variant="warning" size="sm" onClick={() => setShowModal(true)}>
                            <FaPlus /> New BOM
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
                                    placeholder="Search by BOM # or Style..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">Loading BOM records...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FaCogs size={48} className="mb-3 text-secondary opacity-50" />
                            <h5>No Bill of Materials Found</h5>
                            <p>Click "New BOM" to define a recipe.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>BOM #</th>
                                        <th>Style Reference</th>
                                        <th>Description</th>
                                        <th>Components</th>
                                        <th>Total Cost</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((item) => (
                                        <tr key={item.BOMID || item.id}>
                                            <td className="fw-semibold text-primary">{item.BOMNo || `BOM-${item.BOMID}`}</td>
                                            <td>{item.StyleName || `Style #${item.StyleID}`}</td>
                                            <td>{item.Description || "Garment Assembly"}</td>
                                            <td><Badge bg="info">{item.ItemCount || 4} items</Badge></td>
                                            <td className="fw-bold">₹{item.EstimatedCost || "320.00"}</td>
                                            <td>
                                                <Badge bg={item.Status === "Active" ? "success" : "secondary"}>
                                                    {item.Status || "Active"}
                                                </Badge>
                                            </td>
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
                        <Modal.Title className="fs-6">Create Bill of Materials</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">BOM Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. BOM-SHIRT-01"
                                        value={formData.BOMNo}
                                        onChange={(e) => setFormData({ ...formData, BOMNo: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Garment style specifications..."
                                        value={formData.Description}
                                        onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" size="sm" type="submit">Save BOM</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}
