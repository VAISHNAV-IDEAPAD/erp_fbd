import React, { useState } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { FaRunning, FaPlus, FaSearch } from "react-icons/fa";

export default function OperationMaster() {
    const [operations, setOperations] = useState([
        { id: 1, OpCode: "OP-01", OpName: "Collar Making", Department: "Sewing", SAM: 2.5, RatePerDozen: 45, Status: "Active" },
        { id: 2, OpCode: "OP-02", OpName: "Cuff Attach", Department: "Sewing", SAM: 1.8, RatePerDozen: 32, Status: "Active" },
        { id: 3, OpCode: "OP-03", OpName: "Front Placket Stitch", Department: "Sewing", SAM: 3.2, RatePerDozen: 58, Status: "Active" },
        { id: 4, OpCode: "OP-04", OpName: "Button Hole & Stitch", Department: "Finishing", SAM: 1.2, RatePerDozen: 22, Status: "Active" },
        { id: 5, OpCode: "OP-05", OpName: "Final Steam Pressing", Department: "Packing", SAM: 1.5, RatePerDozen: 28, Status: "Active" }
    ]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({ OpCode: "", OpName: "", Department: "Sewing", SAM: 1.5, RatePerDozen: 30 });

    const handleCreate = (e) => {
        e.preventDefault();
        setOperations([...operations, { ...newItem, id: Date.now(), Status: "Active" }]);
        setShowModal(false);
        setNewItem({ OpCode: "", OpName: "", Department: "Sewing", SAM: 1.5, RatePerDozen: 30 });
    };

    const filtered = operations.filter(o =>
        o.OpCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.OpName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaRunning className="me-2 fs-5 text-warning" />
                        <div>
                            <h5 className="mb-0 fw-bold">Operation Master (SAM Routing)</h5>
                            <small className="text-secondary">Standard Allowed Minute (SAM) & piece rate master for sewing line balancing</small>
                        </div>
                    </div>
                    <Button variant="warning" size="sm" onClick={() => setShowModal(true)}>
                        <FaPlus /> New Operation
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={4}>
                            <div className="input-group">
                                <span className="input-group-text bg-white"><FaSearch className="text-muted" /></span>
                                <Form.Control
                                    type="text"
                                    placeholder="Search operations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Operation Code</th>
                                    <th>Operation Description</th>
                                    <th>Section / Dept</th>
                                    <th>SAM (Minutes)</th>
                                    <th>Piece Rate (₹/Dozen)</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(op => (
                                    <tr key={op.id}>
                                        <td className="fw-semibold text-primary">{op.OpCode}</td>
                                        <td className="fw-bold">{op.OpName}</td>
                                        <td><Badge bg="secondary">{op.Department}</Badge></td>
                                        <td><Badge bg="info">{op.SAM} min</Badge></td>
                                        <td className="fw-semibold">₹{op.RatePerDozen}</td>
                                        <td><Badge bg="success">{op.Status}</Badge></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Form onSubmit={handleCreate}>
                    <Modal.Header closeButton className="bg-dark text-white">
                        <Modal.Title className="fs-6">Add Sewing Operation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Op Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="e.g. OP-06"
                                        value={newItem.OpCode}
                                        onChange={(e) => setNewItem({ ...newItem, OpCode: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Department</Form.Label>
                                    <Form.Select
                                        value={newItem.Department}
                                        onChange={(e) => setNewItem({ ...newItem, Department: e.target.value })}
                                    >
                                        <option value="Cutting">Cutting</option>
                                        <option value="Sewing">Sewing</option>
                                        <option value="Finishing">Finishing</option>
                                        <option value="Packing">Packing</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Operation Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="e.g. Sleeve Hemming"
                                        value={newItem.OpName}
                                        onChange={(e) => setNewItem({ ...newItem, OpName: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">SAM (Mins)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.1"
                                        required
                                        value={newItem.SAM}
                                        onChange={(e) => setNewItem({ ...newItem, SAM: Number(e.target.value) })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Rate per Dozen (₹)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        required
                                        value={newItem.RatePerDozen}
                                        onChange={(e) => setNewItem({ ...newItem, RatePerDozen: Number(e.target.value) })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="warning" size="sm" type="submit">Save Operation</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}
