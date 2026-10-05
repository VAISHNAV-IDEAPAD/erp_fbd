import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaDolly, FaPlus, FaSyncAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function MaterialIssue() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        ProductionID: 1,
        ItemID: 1,
        Quantity: 50,
        Remarks: ""
    });

    const fetchIssues = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/material-issues");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setIssues(data);
        } catch (err) {
            console.error("Error fetching material issues:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/material-issues", formData);
            setShowModal(false);
            fetchIssues();
        } catch (err) {
            console.error("Error issuing material:", err);
            alert("Failed to issue material");
        }
    };

    const filtered = issues.filter((i) =>
        String(i.IssueID || "").includes(searchTerm) ||
        String(i.ProductionID || "").includes(searchTerm) ||
        (i.ItemName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaDolly className="me-2 fs-5" />
                        <div>
                            <h5 className="mb-0 fw-bold">Material Issue to Production</h5>
                            <small className="opacity-75">Track raw materials issued to cutting & assembly lines</small>
                        </div>
                    </div>
                    <div>
                        <Button variant="light" size="sm" className="me-2" onClick={fetchIssues} disabled={loading}>
                            <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                        </Button>
                        <Button variant="warning" size="sm" onClick={() => setShowModal(true)}>
                            <FaPlus /> Issue Material
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
                                    placeholder="Search by Issue # or Material..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="success" />
                            <p className="mt-2 text-muted">Loading material issues...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FaDolly size={48} className="mb-3 text-secondary opacity-50" />
                            <h5>No Material Issues Recorded</h5>
                            <p>Click "Issue Material" to dispatch supplies to the factory floor.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Issue #</th>
                                        <th>Date</th>
                                        <th>Production Order</th>
                                        <th>Item Name</th>
                                        <th>Quantity Issued</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((item) => (
                                        <tr key={item.IssueID || item.id}>
                                            <td className="fw-semibold text-primary">ISS-{item.IssueID || 1}</td>
                                            <td>{item.IssueDate ? new Date(item.IssueDate).toLocaleDateString() : new Date().toLocaleDateString()}</td>
                                            <td>Order #{item.ProductionID || 1}</td>
                                            <td className="fw-semibold">{item.ItemName || "Cotton Fabric 40s"}</td>
                                            <td className="fw-bold text-success">{item.Quantity || 50} units</td>
                                            <td className="text-muted small">{item.Remarks || "Standard batch release"}</td>
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
                    <Modal.Header closeButton className="bg-success text-white">
                        <Modal.Title className="fs-6">Issue Material to Line</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Production Order #</Form.Label>
                                    <Form.Control
                                        type="number"
                                        required
                                        value={formData.ProductionID}
                                        onChange={(e) => setFormData({ ...formData, ProductionID: Number(e.target.value) })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Quantity to Issue</Form.Label>
                                    <Form.Control
                                        type="number"
                                        required
                                        value={formData.Quantity}
                                        onChange={(e) => setFormData({ ...formData, Quantity: Number(e.target.value) })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Remarks</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Batch number, line destination..."
                                        value={formData.Remarks}
                                        onChange={(e) => setFormData({ ...formData, Remarks: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="success" size="sm" type="submit">Confirm Issue</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}
