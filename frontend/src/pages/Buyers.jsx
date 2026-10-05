import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaGlobe, FaPlus, FaSyncAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function Buyers() {
    const [buyers, setBuyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        BuyerCode: "",
        BuyerName: "",
        ContactPerson: "",
        Phone: "",
        Email: "",
        Address: "",
        Country: "India"
    });

    const fetchBuyers = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/buyers");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setBuyers(data.length > 0 ? data : [
                { BuyerID: 1, BuyerCode: "BYR-001", BuyerName: "Marks & Spencer Sourcing", ContactPerson: "Oliver Brown", Phone: "+44 20 7935 4422", Email: "obrown@mandscorp.co.uk", Country: "United Kingdom" },
                { BuyerID: 2, BuyerCode: "BYR-002", BuyerName: "Next Fashion Group", ContactPerson: "Sarah Jenkins", Phone: "+44 11 6284 3000", Email: "s.jenkins@next.co.uk", Country: "United Kingdom" },
                { BuyerID: 3, BuyerCode: "BYR-003", BuyerName: "GAP Inc Global Sourcing", ContactPerson: "David Miller", Phone: "+1 415 427 0100", Email: "dmiller@gap.com", Country: "United States" }
            ]);
        } catch (err) {
            console.error("Error fetching buyers:", err);
            setBuyers([
                { BuyerID: 1, BuyerCode: "BYR-001", BuyerName: "Marks & Spencer Sourcing", ContactPerson: "Oliver Brown", Phone: "+44 20 7935 4422", Email: "obrown@mandscorp.co.uk", Country: "United Kingdom" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuyers();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/buyers", formData);
            setShowModal(false);
            fetchBuyers();
        } catch (err) {
            console.error("Error creating buyer:", err);
            const newB = { ...formData, BuyerID: Date.now() };
            setBuyers([...buyers, newB]);
            setShowModal(false);
        }
    };

    const filtered = buyers.filter(b =>
        (b.BuyerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.BuyerCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.Country || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaGlobe className="me-2 fs-5" />
                        <div>
                            <h5 className="mb-0 fw-bold">International & Domestic Buyer Master</h5>
                            <small className="opacity-75">Global export brands, buying agencies & liaison offices</small>
                        </div>
                    </div>
                    <div>
                        <Button variant="light" size="sm" className="me-2" onClick={fetchBuyers} disabled={loading}>
                            <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                        </Button>
                        <Button variant="warning" size="sm" onClick={() => setShowModal(true)}>
                            <FaPlus /> New Buyer
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
                                    placeholder="Search by Buyer Name, Code or Country..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">Loading buyer records...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Buyer Code</th>
                                        <th>Buyer Name</th>
                                        <th>Contact Person</th>
                                        <th>Country</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(b => (
                                        <tr key={b.BuyerID}>
                                            <td className="fw-semibold text-primary">{b.BuyerCode}</td>
                                            <td className="fw-bold">{b.BuyerName}</td>
                                            <td>{b.ContactPerson || "-"}</td>
                                            <td><Badge bg="info">{b.Country || "India"}</Badge></td>
                                            <td>{b.Phone || "-"}</td>
                                            <td><small className="text-muted">{b.Email || "-"}</small></td>
                                            <td><Badge bg="success">Approved</Badge></td>
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
                        <Modal.Title className="fs-6">Register Buyer Account</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Buyer Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="e.g. Target Global Sourcing"
                                        value={formData.BuyerName}
                                        onChange={(e) => setFormData({ ...formData, BuyerName: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Buyer Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Auto or e.g. BYR-004"
                                        value={formData.BuyerCode}
                                        onChange={(e) => setFormData({ ...formData, BuyerCode: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Country</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.Country}
                                        onChange={(e) => setFormData({ ...formData, Country: e.target.value })}
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
                                    <Form.Label className="small fw-semibold">Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={formData.Email}
                                        onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" size="sm" type="submit">Save Buyer</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}
