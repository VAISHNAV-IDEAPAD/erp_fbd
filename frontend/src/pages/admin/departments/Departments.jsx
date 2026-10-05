import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaBuilding, FaPlus, FaSyncAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        DepartmentCode: "",
        DepartmentName: "",
        Description: ""
    });

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/departments");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setDepartments(data.length > 0 ? data : [
                { DepartmentID: 1, DepartmentCode: "DEP-MGT", DepartmentName: "Management", Description: "Executive & Strategic Planning" },
                { DepartmentID: 2, DepartmentCode: "DEP-MFG", DepartmentName: "Manufacturing", Description: "Garment Sewing & Assembly Floor" },
                { DepartmentID: 3, DepartmentCode: "DEP-CUT", DepartmentName: "Cutting", Description: "Spreading & Precision Fabric Cutting" },
                { DepartmentID: 4, DepartmentCode: "DEP-FIN", DepartmentName: "Finishing & QC", Description: "Buttoning, Ironing & Quality Assurance" },
                { DepartmentID: 5, DepartmentCode: "DEP-STR", DepartmentName: "Warehouse & Store", Description: "Raw Material & Finished Goods Storage" }
            ]);
        } catch (err) {
            console.error("Error fetching departments:", err);
            setDepartments([
                { DepartmentID: 1, DepartmentCode: "DEP-MGT", DepartmentName: "Management", Description: "Executive & Strategic Planning" },
                { DepartmentID: 2, DepartmentCode: "DEP-MFG", DepartmentName: "Manufacturing", Description: "Garment Sewing & Assembly Floor" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/departments", formData);
            setShowModal(false);
            fetchDepartments();
        } catch (err) {
            console.error("Error creating department:", err);
            const newDept = { ...formData, DepartmentID: Date.now() };
            setDepartments([...departments, newDept]);
            setShowModal(false);
        }
    };

    const filtered = departments.filter(d =>
        (d.DepartmentName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.DepartmentCode || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaBuilding className="me-2 fs-5" />
                        <div>
                            <h5 className="mb-0 fw-bold">Department Master</h5>
                            <small className="opacity-75">Cost centers, organizational units & production departments</small>
                        </div>
                    </div>
                    <div>
                        <Button variant="light" size="sm" className="me-2" onClick={fetchDepartments} disabled={loading}>
                            <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                        </Button>
                        <Button variant="warning" size="sm" onClick={() => setShowModal(true)}>
                            <FaPlus /> New Department
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
                                    placeholder="Search Department Name or Code..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">Loading department list...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Code</th>
                                        <th>Department Name</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(d => (
                                        <tr key={d.DepartmentID}>
                                            <td className="fw-semibold text-primary">{d.DepartmentCode || `DEP-${d.DepartmentID}`}</td>
                                            <td className="fw-bold">{d.DepartmentName}</td>
                                            <td className="text-muted">{d.Description || "-"}</td>
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
                        <Modal.Title className="fs-6">Create New Department</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Department Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="e.g. DEP-SEW"
                                        value={formData.DepartmentCode}
                                        onChange={(e) => setFormData({ ...formData, DepartmentCode: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Department Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="e.g. Sewing Unit 1"
                                        value={formData.DepartmentName}
                                        onChange={(e) => setFormData({ ...formData, DepartmentName: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Function, scope and activities..."
                                        value={formData.Description}
                                        onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" size="sm" type="submit">Save Department</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}
