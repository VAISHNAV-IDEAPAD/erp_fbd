import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaUsers, FaPlus, FaSyncAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        CustomerCode: "",
        CustomerName: "",
        ContactPerson: "",
        Phone: "",
        Email: "",
        Address: "",
        GSTNo: "",
        CreditLimit: 100000,
        PaymentTerms: "Net 30 Days"
    });

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/customers");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setCustomers(data);
        } catch (err) {
            console.error("Error fetching customers:", err);
            // Default sample
            setCustomers([
                { CustomerID: 1, CustomerCode: "CUST-001", CustomerName: "Zara Retail Apparel", ContactPerson: "Rajesh Mehra", Phone: "+91 98112 34567", Email: "orders@zaraindia.com", City: "New Delhi", CreditLimit: 500000 },
                { CustomerID: 2, CustomerCode: "CUST-002", CustomerName: "H&M Sourcing Hub", ContactPerson: "Sneha Kapoor", Phone: "+91 98220 98765", Email: "procure@hm.com", City: "Mumbai", CreditLimit: 800000 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/customers", formData);
            setShowModal(false);
            fetchCustomers();
        } catch (err) {
            console.error("Error creating customer:", err);
            const newCust = { ...formData, CustomerID: Date.now() };
            setCustomers([newCust, ...customers]);
            setShowModal(false);
        }
    };

    const filtered = customers.filter(c =>
        (c.CustomerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.CustomerCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.ContactPerson || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaUsers className="me-2 fs-5" />
                        <div>
                            <h5 className="mb-0 fw-bold">Customer Master Directory</h5>
                            <small className="opacity-75">Retail clients, global buyers & domestic apparel distributor accounts</small>
                        </div>
                    </div>
                    <div>
                        <Button variant="light" size="sm" className="me-2" onClick={fetchCustomers} disabled={loading}>
                            <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                        </Button>
                        <Button variant="warning" size="sm" onClick={() => setShowModal(true)}>
                            <FaPlus /> New Customer
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
                                    placeholder="Search by Customer Name or Code..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">Loading customer accounts...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FaUsers size={48} className="mb-3 text-secondary opacity-50" />
                            <h5>No Customers Found</h5>
                            <p>Click "New Customer" to register your first buyer or client.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Code</th>
                                        <th>Customer Name</th>
                                        <th>Contact Person</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Credit Limit</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(c => (
                                        <tr key={c.CustomerID || c.id}>
                                            <td className="fw-semibold text-primary">{c.CustomerCode || `CUST-${c.CustomerID}`}</td>
                                            <td className="fw-bold">{c.CustomerName}</td>
                                            <td>{c.ContactPerson || "-"}</td>
                                            <td>{c.Phone || "-"}</td>
                                            <td><small className="text-muted">{c.Email || "-"}</small></td>
                                            <td className="fw-bold text-success">₹{(Number(c.CreditLimit) || 0).toLocaleString()}</td>
                                            <td><Badge bg="success">Active</Badge></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* CREATE MODAL */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Form onSubmit={handleCreate}>
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title className="fs-6">Register New Customer Account</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Customer Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="e.g. Reliance Trends Retail"
                                        value={formData.CustomerName}
                                        onChange={(e) => setFormData({ ...formData, CustomerName: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Customer Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Auto or e.g. CUST-003"
                                        value={formData.CustomerCode}
                                        onChange={(e) => setFormData({ ...formData, CustomerCode: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Contact Person</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.ContactPerson}
                                        onChange={(e) => setFormData({ ...formData, ContactPerson: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.Phone}
                                        onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={formData.Email}
                                        onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Credit Limit (₹)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.CreditLimit}
                                        onChange={(e) => setFormData({ ...formData, CreditLimit: Number(e.target.value) })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Billing Address</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={formData.Address}
                                        onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" size="sm" type="submit">Save Customer</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}
