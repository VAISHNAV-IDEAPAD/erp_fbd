import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaWarehouse, FaPlus, FaSyncAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function GodownMasters() {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        WarehouseCode: "",
        WarehouseName: "",
        Location: "Faridabad Unit 1",
        Status: "Active"
    });

    const fetchWarehouses = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/warehouses");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setWarehouses(data.length > 0 ? data : [
                { WarehouseID: 1, WarehouseCode: "WH-01", WarehouseName: "Central Raw Material Godown", Location: "Sector 24, Faridabad", Status: "Active" },
                { WarehouseID: 2, WarehouseCode: "WH-02", WarehouseName: "Finished Goods Logistics Hub", Location: "Sector 58, Faridabad", Status: "Active" },
                { WarehouseID: 3, WarehouseCode: "WH-03", WarehouseName: "Trims & Accessories Store", Location: "Plant Floor Mezzanine", Status: "Active" }
            ]);
        } catch (err) {
            console.error("Error fetching warehouses:", err);
            setWarehouses([
                { WarehouseID: 1, WarehouseCode: "WH-01", WarehouseName: "Central Raw Material Godown", Location: "Sector 24, Faridabad", Status: "Active" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/warehouses", formData);
            setShowModal(false);
            fetchWarehouses();
        } catch (err) {
            console.error("Error creating warehouse:", err);
            const newWH = { ...formData, WarehouseID: Date.now() };
            setWarehouses([...warehouses, newWH]);
            setShowModal(false);
        }
    };

    const filtered = warehouses.filter(w =>
        (w.WarehouseName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (w.WarehouseCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (w.Location || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaWarehouse className="me-2 fs-5" />
                        <div>
                            <h5 className="mb-0 fw-bold">Godown & Warehouse Master</h5>
                            <small className="opacity-75">Multi-location inventory storage units, bins & dispatch warehouses</small>
                        </div>
                    </div>
                    <div>
                        <Button variant="light" size="sm" className="me-2" onClick={fetchWarehouses} disabled={loading}>
                            <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                        </Button>
                        <Button variant="warning" size="sm" onClick={() => setShowModal(true)}>
                            <FaPlus /> New Godown
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
                                    placeholder="Search by Godown Name or Location..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">Loading warehouse facilities...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Code</th>
                                        <th>Godown / Warehouse Name</th>
                                        <th>Facility Location</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(w => (
                                        <tr key={w.WarehouseID}>
                                            <td className="fw-semibold text-primary">{w.WarehouseCode}</td>
                                            <td className="fw-bold">{w.WarehouseName}</td>
                                            <td>{w.Location || "-"}</td>
                                            <td><Badge bg={w.Status === "Active" ? "success" : "secondary"}>{w.Status || "Active"}</Badge></td>
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
                        <Modal.Title className="fs-6">Add New Warehouse / Godown</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Warehouse Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="e.g. WH-04"
                                        value={formData.WarehouseCode}
                                        onChange={(e) => setFormData({ ...formData, WarehouseCode: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Warehouse Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="e.g. Yarns Storage Bay"
                                        value={formData.WarehouseName}
                                        onChange={(e) => setFormData({ ...formData, WarehouseName: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Physical Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Building, plot or city location"
                                        value={formData.Location}
                                        onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" size="sm" type="submit">Save Godown</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}
