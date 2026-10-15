import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaPlus, FaSyncAlt, FaFileAlt, FaExchangeAlt } from "react-icons/fa";
import axios from "axios";
import ItemRequisitions from "../mm/itemRequisition/ItemRequisitions";

export default function PurchaseRequisition() {
    const [activeTab, setActiveTab] = useState("item-requisition"); // default to new TPCS interface
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
        if (activeTab === "pr-legacy") {
            fetchPRs();
        }
    }, [activeTab]);

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
        <div>
            {/* MODULE SUB-HEADER TABS */}
            <div style={{
                background: "#f1f5f9",
                borderBottom: "1px solid #cbd5e1",
                padding: "8px 20px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }}>
                <button
                    type="button"
                    style={{
                        padding: "6px 14px",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        background: activeTab === "item-requisition" ? "#2172ba" : "#ffffff",
                        color: activeTab === "item-requisition" ? "#ffffff" : "#475569",
                        boxShadow: activeTab === "item-requisition" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                    }}
                    onClick={() => setActiveTab("item-requisition")}
                >
                    Item Requisiton Note (TPCS Fashion)
                </button>
                <button
                    type="button"
                    style={{
                        padding: "6px 14px",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        background: activeTab === "pr-legacy" ? "#2172ba" : "#ffffff",
                        color: activeTab === "pr-legacy" ? "#ffffff" : "#475569",
                        boxShadow: activeTab === "pr-legacy" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                    }}
                    onClick={() => setActiveTab("pr-legacy")}
                >
                    Purchase Requisition (PR)
                </button>
            </div>

            {/* TAB 1: NEW TPCS FASHION ITEM REQUISITION NOTE */}
            {activeTab === "item-requisition" && (
                <ItemRequisitions />
            )}

            {/* TAB 2: LEGACY PR VIEW */}
            {activeTab === "pr-legacy" && (
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
                                </div>
                            ) : requisitions.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <p className="mb-0">No purchase requisitions found.</p>
                                </div>
                            ) : (
                                <Table hover responsive className="mb-0 align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Req #</th>
                                            <th>Department</th>
                                            <th>Date Required</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requisitions.map((req) => (
                                            <tr key={req.RequisitionID || req.id}>
                                                <td className="fw-bold text-primary">#{req.RequisitionID || req.id}</td>
                                                <td>{req.DepartmentName || req.department || "General"}</td>
                                                <td>{req.RequiredDate ? new Date(req.RequiredDate).toLocaleDateString() : "-"}</td>
                                                <td>
                                                    <Badge bg={req.Priority === "High" ? "danger" : req.Priority === "Urgent" ? "warning" : "secondary"}>
                                                        {req.Priority || "Normal"}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Badge bg={req.Status === "Approved" ? "success" : req.Status === "Rejected" ? "danger" : "info"}>
                                                        {req.Status || "Pending"}
                                                    </Badge>
                                                </td>
                                                <td>{req.Remarks || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>

                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Purchase Requisition</Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={handleCreate}>
                            <Modal.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label>Department ID</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.DepartmentID}
                                        onChange={(e) => setFormData({ ...formData, DepartmentID: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Required Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.RequiredDate}
                                        onChange={(e) => setFormData({ ...formData, RequiredDate: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Priority</Form.Label>
                                    <Form.Select
                                        value={formData.Priority}
                                        onChange={(e) => setFormData({ ...formData, Priority: e.target.value })}
                                    >
                                        <option value="Normal">Normal</option>
                                        <option value="High">High</option>
                                        <option value="Urgent">Urgent</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Remarks</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formData.Remarks}
                                        onChange={(e) => setFormData({ ...formData, Remarks: e.target.value })}
                                    />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit">
                                    Save Requisition
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                </Container>
            )}
        </div>
    );
}
