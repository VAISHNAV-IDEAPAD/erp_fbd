import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaIndustry, FaPlus, FaSyncAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function ProductionOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        StyleID: 1,
        OrderQuantity: 500,
        StartDate: new Date().toISOString().split("T")[0],
        EndDate: "",
        Priority: "Normal",
        Status: "Pending"
    });

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/production-orders");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setOrders(data);
        } catch (err) {
            console.error("Error fetching production orders:", err);
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
            await axios.post("/api/production-orders", formData);
            setShowModal(false);
            fetchOrders();
        } catch (err) {
            console.error("Error creating production order:", err);
            alert("Failed to create Production Order");
        }
    };

    const filtered = orders.filter((o) =>
        String(o.ProductionID || "").includes(searchTerm) ||
        String(o.StyleID || "").includes(searchTerm) ||
        (o.Priority || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaIndustry className="me-2 fs-5 text-warning" />
                        <div>
                            <h5 className="mb-0 fw-bold">Production Orders</h5>
                            <small className="text-secondary">Track manufacturing work orders & line scheduling</small>
                        </div>
                    </div>
                    <div>
                        <Button variant="outline-light" size="sm" className="me-2" onClick={fetchOrders} disabled={loading}>
                            <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                        </Button>
                        <Button variant="warning" size="sm" onClick={() => setShowModal(true)}>
                            <FaPlus /> New Order
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
                                    placeholder="Search by Order ID or Style..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="warning" />
                            <p className="mt-2 text-muted">Loading production orders...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FaIndustry size={48} className="mb-3 text-secondary opacity-50" />
                            <h5>No Production Orders Found</h5>
                            <p>Click "New Order" to launch a production run.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Production #</th>
                                        <th>Style ID</th>
                                        <th>Target Qty</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((item) => (
                                        <tr key={item.ProductionID}>
                                            <td className="fw-semibold text-primary">PO-{item.ProductionID}</td>
                                            <td>Style #{item.StyleID || "1"}</td>
                                            <td className="fw-bold">{item.OrderQuantity || item.Quantity || 0} pcs</td>
                                            <td>{item.StartDate ? new Date(item.StartDate).toLocaleDateString() : "-"}</td>
                                            <td>{item.EndDate ? new Date(item.EndDate).toLocaleDateString() : "-"}</td>
                                            <td>
                                                <Badge bg={item.Priority === "High" ? "danger" : "secondary"}>
                                                    {item.Priority || "Normal"}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg={item.Status === "Completed" ? "success" : item.Status === "In Progress" ? "primary" : "warning"} text={item.Status === "Pending" ? "dark" : ""}>
                                                    {item.Status || "Pending"}
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
                    <Modal.Header closeButton className="bg-dark text-white">
                        <Modal.Title className="fs-6">Create Production Order</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Target Quantity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        required
                                        value={formData.OrderQuantity}
                                        onChange={(e) => setFormData({ ...formData, OrderQuantity: Number(e.target.value) })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Priority</Form.Label>
                                    <Form.Select
                                        value={formData.Priority}
                                        onChange={(e) => setFormData({ ...formData, Priority: e.target.value })}
                                    >
                                        <option value="Normal">Normal</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        required
                                        value={formData.StartDate}
                                        onChange={(e) => setFormData({ ...formData, StartDate: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Estimated End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.EndDate}
                                        onChange={(e) => setFormData({ ...formData, EndDate: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="warning" size="sm" type="submit">Create Order</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}
