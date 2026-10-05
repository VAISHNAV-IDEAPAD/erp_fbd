import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaCheckCircle, FaPlus, FaSyncAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function ProductionReceipt() {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        ProductionID: 1,
        ReceivedQuantity: 100,
        AcceptedQuantity: 98,
        RejectedQuantity: 2,
        Remarks: ""
    });

    const fetchReceipts = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/production-receipts");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setReceipts(data);
        } catch (err) {
            console.error("Error fetching production receipts:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReceipts();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/production-receipts", formData);
            setShowModal(false);
            fetchReceipts();
        } catch (err) {
            console.error("Error creating receipt:", err);
            alert("Failed to log production receipt");
        }
    };

    const filtered = receipts.filter((r) =>
        String(r.ReceiptID || "").includes(searchTerm) ||
        String(r.ProductionID || "").includes(searchTerm)
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-info text-dark d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaCheckCircle className="me-2 fs-5" />
                        <div>
                            <h5 className="mb-0 fw-bold">Production Receipts (Finished Output)</h5>
                            <small className="opacity-75">Log completed garments & QA handover to warehouse</small>
                        </div>
                    </div>
                    <div>
                        <Button variant="outline-dark" size="sm" className="me-2" onClick={fetchReceipts} disabled={loading}>
                            <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                        </Button>
                        <Button variant="dark" size="sm" onClick={() => setShowModal(true)}>
                            <FaPlus /> New Receipt
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
                                    placeholder="Search by Receipt or Production ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="info" />
                            <p className="mt-2 text-muted">Loading production receipts...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FaCheckCircle size={48} className="mb-3 text-secondary opacity-50" />
                            <h5>No Production Receipts Logged</h5>
                            <p>Completed batches from the shop floor will appear here.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Receipt #</th>
                                        <th>Receipt Date</th>
                                        <th>Order Ref</th>
                                        <th>Total Qty</th>
                                        <th>Accepted Qty</th>
                                        <th>Rejected Qty</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((item) => (
                                        <tr key={item.ReceiptID || item.id}>
                                            <td className="fw-semibold text-primary">PRC-{item.ReceiptID || 1}</td>
                                            <td>{item.ReceiptDate ? new Date(item.ReceiptDate).toLocaleDateString() : new Date().toLocaleDateString()}</td>
                                            <td>PO #{item.ProductionID || 1}</td>
                                            <td className="fw-bold">{item.ReceivedQuantity || 100}</td>
                                            <td className="text-success fw-bold">{item.AcceptedQuantity || 98}</td>
                                            <td className="text-danger">{item.RejectedQuantity || 2}</td>
                                            <td>
                                                <Badge bg="success">In Stock</Badge>
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
                    <Modal.Header closeButton className="bg-info text-dark">
                        <Modal.Title className="fs-6">Record Production Output</Modal.Title>
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
                                    <Form.Label className="small fw-semibold">Total Received</Form.Label>
                                    <Form.Control
                                        type="number"
                                        required
                                        value={formData.ReceivedQuantity}
                                        onChange={(e) => setFormData({ ...formData, ReceivedQuantity: Number(e.target.value) })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Accepted Qty</Form.Label>
                                    <Form.Control
                                        type="number"
                                        required
                                        value={formData.AcceptedQuantity}
                                        onChange={(e) => setFormData({ ...formData, AcceptedQuantity: Number(e.target.value) })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Rejected Qty</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.RejectedQuantity}
                                        onChange={(e) => setFormData({ ...formData, RejectedQuantity: Number(e.target.value) })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="info" size="sm" type="submit">Save Receipt</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}
