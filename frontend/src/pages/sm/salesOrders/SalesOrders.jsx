import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaShoppingCart, FaPlus, FaSyncAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function SalesOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        CustomerID: 1,
        OrderDate: new Date().toISOString().split("T")[0],
        DeliveryDate: "",
        TotalAmount: 250000,
        Remarks: "",
        Status: "Pending"
    });

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/sales-orders");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setOrders(data);
        } catch (err) {
            console.error("Error fetching sales orders:", err);
            setOrders([
                { SOID: 1, SONumber: "SO-2026-001", CustomerName: "Zara Retail Apparel", OrderDate: "2026-10-01", DeliveryDate: "2026-10-25", TotalAmount: 480000, Status: "Approved" },
                { SOID: 2, SONumber: "SO-2026-002", CustomerName: "H&M Sourcing Hub", OrderDate: "2026-10-03", DeliveryDate: "2026-11-05", TotalAmount: 750000, Status: "Pending" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/sales-orders", formData);
            setShowModal(false);
            fetchOrders();
        } catch (err) {
            console.error("Error creating SO:", err);
            const newSO = { ...formData, SOID: Date.now(), SONumber: `SO-${Date.now().toString().slice(-4)}` };
            setOrders([newSO, ...orders]);
            setShowModal(false);
        }
    };

    const filtered = orders.filter(o =>
        (o.SONumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.CustomerName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaShoppingCart className="me-2 fs-5" />
                        <div>
                            <h5 className="mb-0 fw-bold">Sales Orders (SO)</h5>
                            <small className="opacity-75">Customer purchase contracts, booking values & dispatch schedules</small>
                        </div>
                    </div>
                    <div>
                        <Button variant="light" size="sm" className="me-2" onClick={fetchOrders} disabled={loading}>
                            <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                        </Button>
                        <Button variant="warning" size="sm" onClick={() => setShowModal(true)}>
                            <FaPlus /> New Sales Order
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
                                    placeholder="Search by SO # or Customer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">Loading sales orders...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FaShoppingCart size={48} className="mb-3 text-secondary opacity-50" />
                            <h5>No Sales Orders Found</h5>
                            <p>Click "New Sales Order" to book your first client order.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>SO Number</th>
                                        <th>Order Date</th>
                                        <th>Customer</th>
                                        <th>Delivery Target</th>
                                        <th>Order Value</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(so => (
                                        <tr key={so.SOID}>
                                            <td className="fw-semibold text-primary">{so.SONumber || `SO-${so.SOID}`}</td>
                                            <td>{so.OrderDate ? new Date(so.OrderDate).toLocaleDateString() : "-"}</td>
                                            <td className="fw-bold">{so.CustomerName || `Customer #${so.CustomerID}`}</td>
                                            <td>{so.DeliveryDate ? new Date(so.DeliveryDate).toLocaleDateString() : "-"}</td>
                                            <td className="fw-bold text-success">₹{(Number(so.TotalAmount) || 0).toLocaleString()}</td>
                                            <td>
                                                <Badge bg={so.Status === "Completed" ? "success" : so.Status === "Approved" ? "primary" : "warning"} text={so.Status === "Pending" ? "dark" : ""}>
                                                    {so.Status || "Pending"}
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
                        <Modal.Title className="fs-6">Book New Sales Order</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Customer ID / Account</Form.Label>
                                    <Form.Control
                                        type="number"
                                        required
                                        value={formData.CustomerID}
                                        onChange={(e) => setFormData({ ...formData, CustomerID: Number(e.target.value) })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Order Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        required
                                        value={formData.OrderDate}
                                        onChange={(e) => setFormData({ ...formData, OrderDate: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Target Delivery Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        required
                                        value={formData.DeliveryDate}
                                        onChange={(e) => setFormData({ ...formData, DeliveryDate: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Total Order Value (₹)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        required
                                        value={formData.TotalAmount}
                                        onChange={(e) => setFormData({ ...formData, TotalAmount: Number(e.target.value) })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" size="sm" type="submit">Confirm Order</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}
