import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaPlus, FaSyncAlt, FaFileAlt } from "react-icons/fa";
import axios from "axios";

export default function PurchaseRequisition() {
    const [requisitions, setRequisitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        DepartmentID: 1,
        RequiredDate: "",
        Priority: "Normal",
        Remarks: ""
    });

    const fetchPRs = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/purchaserequisition");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setRequisitions(data);
        } catch (err) {
            console.error("Error fetching PRs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPRs();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/purchaserequisition", formData);
            setShowModal(false);
            setFormData({ DepartmentID: 1, RequiredDate: "", Priority: "Normal", Remarks: "" });
            fetchPRs();
        } catch (err) {
            console.error("Error creating PR:", err);
            alert("Failed to create Purchase Requisition");
        }
    };

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaFileAlt className="me-2 fs-5" />
                        <h5 className="mb-0 fw-bold">Purchase Requisitions (PR)</h5>
                    </div>
                    <div>
                        <Button variant="light" size="sm" className="me-2" onClick={fetchPRs} disabled={loading}>
                            <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                        </Button>
                        <Button variant="warning" size="sm" onClick={() => setShowModal(true)}>
                            <FaPlus /> New Requisition
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">Loading purchase requisitions...</p>
                        </div>
                    ) : requisitions.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FaFileAlt size={48} className="mb-3 text-secondary opacity-50" />
                            <h5>No Purchase Requisitions Found</h5>
                            <p>Click "New Requisition" to create one.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>PR #</th>
                                        <th>Date</th>
                                        <th>Department</th>
                                        <th>Required Date</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requisitions.map((pr) => (
                                        <tr key={pr.PRID || pr.id}>
                                            <td className="fw-semibold text-primary">{pr.PRNo || `PR-${pr.PRID}`}</td>
                                            <td>{pr.PRDate ? new Date(pr.PRDate).toLocaleDateString() : "-"}</td>
                                            <td>Dept {pr.DepartmentID || 1}</td>
                                            <td>{pr.RequiredDate ? new Date(pr.RequiredDate).toLocaleDateString() : "-"}</td>
                                            <td>
                                                <Badge bg={pr.Priority === "High" ? "danger" : pr.Priority === "Medium" ? "warning" : "secondary"}>
                                                    {pr.Priority || "Normal"}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg={pr.Status === "Approved" ? "success" : pr.Status === "Pending" ? "info" : "light"} text={pr.Status === "Pending" ? "dark" : ""}>
                                                    {pr.Status || "Pending"}
                                                </Badge>
                                            </td>
                                            <td className="text-muted small">{pr.Remarks || "-"}</td>
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
                        <Modal.Title className="fs-6">Create Purchase Requisition</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Required Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        required
                                        value={formData.RequiredDate}
                                        onChange={(e) => setFormData({ ...formData, RequiredDate: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
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
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Remarks</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Add any specific requirements or notes..."
                                        value={formData.Remarks}
                                        onChange={(e) => setFormData({ ...formData, Remarks: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="sm" type="submit">
                            Save Requisition
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}
