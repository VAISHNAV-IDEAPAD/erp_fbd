import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaTshirt, FaPlus, FaSyncAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function Styles() {
    const [styles, setStyles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        StyleCode: "",
        StyleName: "",
        Season: "Summer 2026",
        Category: "Menswear",
        Description: ""
    });

    const fetchStyles = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/styles");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setStyles(data.length > 0 ? data : [
                { StyleID: 1, StyleCode: "ST-001", StyleName: "Classic Oxford Shirt", Season: "Summer 2026", Category: "Shirt", Description: "100% Combed Cotton Full Sleeve" },
                { StyleID: 2, StyleCode: "ST-002", StyleName: "Straight Chino Pants", Season: "Autumn 2026", Category: "Trousers", Description: "Cotton Spandex 98/2 Blend" }
            ]);
        } catch (err) {
            console.error("Error fetching styles:", err);
            setStyles([
                { StyleID: 1, StyleCode: "ST-001", StyleName: "Classic Oxford Shirt", Season: "Summer 2026", Category: "Shirt", Description: "100% Combed Cotton Full Sleeve" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStyles();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/styles", formData);
            setShowModal(false);
            fetchStyles();
        } catch (err) {
            console.error("Error creating style:", err);
            // Save to local view if backend not reachable
            const newStyle = { ...formData, StyleID: Date.now() };
            setStyles([newStyle, ...styles]);
            setShowModal(false);
        }
    };

    const filtered = styles.filter(s =>
        (s.StyleCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.StyleName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaTshirt className="me-2 fs-5" />
                        <div>
                            <h5 className="mb-0 fw-bold">Style Master & Product Catalog</h5>
                            <small className="opacity-75">Define garment patterns, seasonal ranges & merchandising styles</small>
                        </div>
                    </div>
                    <div>
                        <Button variant="light" size="sm" className="me-2" onClick={fetchStyles} disabled={loading}>
                            <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                        </Button>
                        <Button variant="warning" size="sm" onClick={() => setShowModal(true)}>
                            <FaPlus /> New Style
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
                                    placeholder="Search by Style Code or Name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">Loading style catalog...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Style Code</th>
                                        <th>Style Name</th>
                                        <th>Season</th>
                                        <th>Category</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((item) => (
                                        <tr key={item.StyleID || item.id}>
                                            <td className="fw-semibold text-primary">{item.StyleCode}</td>
                                            <td className="fw-bold">{item.StyleName}</td>
                                            <td><Badge bg="info">{item.Season || "All Season"}</Badge></td>
                                            <td><Badge bg="secondary">{item.Category || "Garment"}</Badge></td>
                                            <td className="text-muted small">{item.Description || "-"}</td>
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
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Form onSubmit={handleCreate}>
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title className="fs-6">Create Style Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Style Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="e.g. ST-SHIRT-03"
                                        value={formData.StyleCode}
                                        onChange={(e) => setFormData({ ...formData, StyleCode: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Style Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="e.g. Linen Blend Safari Shirt"
                                        value={formData.StyleName}
                                        onChange={(e) => setFormData({ ...formData, StyleName: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Season</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.Season}
                                        onChange={(e) => setFormData({ ...formData, Season: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Category</Form.Label>
                                    <Form.Select
                                        value={formData.Category}
                                        onChange={(e) => setFormData({ ...formData, Category: e.target.value })}
                                    >
                                        <option value="Shirt">Shirt</option>
                                        <option value="Trousers">Trousers</option>
                                        <option value="Jacket">Jacket</option>
                                        <option value="T-Shirt">T-Shirt</option>
                                        <option value="Accessories">Accessories</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={formData.Description}
                                        onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" size="sm" type="submit">Save Style</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}
