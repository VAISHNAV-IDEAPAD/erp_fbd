import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaUserTie, FaPlus, FaSyncAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        EmployeeCode: "",
        EmployeeName: "",
        DepartmentID: 1,
        Designation: "Production Supervisor",
        Phone: "",
        Email: "",
        Status: "Active"
    });

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/employees");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setEmployees(data.length > 0 ? data : [
                { EmployeeID: 1, EmployeeCode: "EMP-001", EmployeeName: "Vaishnav V", DepartmentName: "Management", Designation: "Plant Director", Phone: "+91 70342 53183", Email: "vaishnavideapad@hotmail.com", Status: "Active" },
                { EmployeeID: 2, EmployeeCode: "EMP-002", EmployeeName: "Sanjay Rawat", DepartmentName: "Manufacturing", Designation: "Floor Head", Phone: "+91 98112 00011", Email: "sanjay@erp.com", Status: "Active" }
            ]);
        } catch (err) {
            console.error("Error fetching employees:", err);
            setEmployees([
                { EmployeeID: 1, EmployeeCode: "EMP-001", EmployeeName: "Vaishnav V", DepartmentName: "Management", Designation: "Plant Director", Phone: "+91 70342 53183", Email: "vaishnavideapad@hotmail.com", Status: "Active" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/employees", formData);
            setShowModal(false);
            fetchEmployees();
        } catch (err) {
            console.error("Error creating employee:", err);
            const newEmp = { ...formData, EmployeeID: Date.now(), DepartmentName: "Operations" };
            setEmployees([newEmp, ...employees]);
            setShowModal(false);
        }
    };

    const filtered = employees.filter(e =>
        (e.EmployeeName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.EmployeeCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.Designation || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaUserTie className="me-2 fs-5" />
                        <div>
                            <h5 className="mb-0 fw-bold">Employee Master Directory</h5>
                            <small className="opacity-75">Staff directory, department allocations & designations</small>
                        </div>
                    </div>
                    <div>
                        <Button variant="light" size="sm" className="me-2" onClick={fetchEmployees} disabled={loading}>
                            <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                        </Button>
                        <Button variant="warning" size="sm" onClick={() => setShowModal(true)}>
                            <FaPlus /> New Employee
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
                                    placeholder="Search by Employee Name or Code..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">Loading employee roster...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Code</th>
                                        <th>Employee Name</th>
                                        <th>Department</th>
                                        <th>Designation</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(emp => (
                                        <tr key={emp.EmployeeID}>
                                            <td className="fw-semibold text-primary">{emp.EmployeeCode}</td>
                                            <td className="fw-bold">{emp.EmployeeName}</td>
                                            <td><Badge bg="info">{emp.DepartmentName || `Dept #${emp.DepartmentID}`}</Badge></td>
                                            <td>{emp.Designation || "-"}</td>
                                            <td>{emp.Phone || "-"}</td>
                                            <td><small className="text-muted">{emp.Email || "-"}</small></td>
                                            <td><Badge bg={emp.Status === "Active" ? "success" : "secondary"}>{emp.Status || "Active"}</Badge></td>
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
                        <Modal.Title className="fs-6">Add New Staff Member</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Employee Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        value={formData.EmployeeName}
                                        onChange={(e) => setFormData({ ...formData, EmployeeName: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Employee Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Auto or e.g. EMP-003"
                                        value={formData.EmployeeCode}
                                        onChange={(e) => setFormData({ ...formData, EmployeeCode: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Department ID</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.DepartmentID}
                                        onChange={(e) => setFormData({ ...formData, DepartmentID: Number(e.target.value) })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Designation</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.Designation}
                                        onChange={(e) => setFormData({ ...formData, Designation: e.target.value })}
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
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" size="sm" type="submit">Save Employee</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}
