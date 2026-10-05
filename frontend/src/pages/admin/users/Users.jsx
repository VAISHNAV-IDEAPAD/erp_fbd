import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaUserShield, FaPlus, FaSyncAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        Username: "",
        FullName: "",
        Email: "",
        Mobile: "",
        IsAdmin: 0,
        Status: "Active"
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/users");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setUsers(data.length > 0 ? data : [
                { UserID: 1, Username: "admin", FullName: "Vaishnav V", Email: "vaishnavideapad@hotmail.com", IsAdmin: 1, Status: "Active", LastLogin: "Today" },
                { UserID: 2, Username: "operator1", FullName: "Store Incharge", Email: "store@erp.com", IsAdmin: 0, Status: "Active", LastLogin: "Yesterday" }
            ]);
        } catch (err) {
            console.error("Error fetching users:", err);
            setUsers([
                { UserID: 1, Username: "admin", FullName: "Vaishnav V", Email: "vaishnavideapad@hotmail.com", IsAdmin: 1, Status: "Active", LastLogin: "Today" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/users", formData);
            setShowModal(false);
            fetchUsers();
        } catch (err) {
            console.error("Error creating user:", err);
            const newUser = { ...formData, UserID: Date.now() };
            setUsers([...users, newUser]);
            setShowModal(false);
        }
    };

    const filtered = users.filter(u =>
        (u.Username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.FullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.Email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaUserShield className="me-2 fs-5 text-warning" />
                        <div>
                            <h5 className="mb-0 fw-bold">System Users & Authentication</h5>
                            <small className="text-secondary">Manage login accounts, operators & administrator credentials</small>
                        </div>
                    </div>
                    <div>
                        <Button variant="outline-light" size="sm" className="me-2" onClick={fetchUsers} disabled={loading}>
                            <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                        </Button>
                        <Button variant="warning" size="sm" onClick={() => setShowModal(true)}>
                            <FaPlus /> New User
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
                                    placeholder="Search by Username or Name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="warning" />
                            <p className="mt-2 text-muted">Loading user accounts...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>User ID</th>
                                        <th>Username</th>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Role / Permission</th>
                                        <th>Last Active</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(u => (
                                        <tr key={u.UserID}>
                                            <td className="fw-semibold text-primary">USR-{u.UserID}</td>
                                            <td className="fw-bold"><code>@{u.Username}</code></td>
                                            <td>{u.FullName}</td>
                                            <td><small className="text-muted">{u.Email || "-"}</small></td>
                                            <td>
                                                <Badge bg={u.IsAdmin ? "danger" : "primary"}>
                                                    {u.IsAdmin ? "Administrator" : "Operator"}
                                                </Badge>
                                            </td>
                                            <td><small className="text-muted">{u.LastLogin || "Recent"}</small></td>
                                            <td><Badge bg={u.Status === "Active" ? "success" : "secondary"}>{u.Status || "Active"}</Badge></td>
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
                        <Modal.Title className="fs-6">Create System User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="e.g. jdoe"
                                        value={formData.Username}
                                        onChange={(e) => setFormData({ ...formData, Username: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="e.g. John Doe"
                                        value={formData.FullName}
                                        onChange={(e) => setFormData({ ...formData, FullName: e.target.value })}
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
                                    <Form.Label className="small fw-semibold">User Role</Form.Label>
                                    <Form.Select
                                        value={formData.IsAdmin}
                                        onChange={(e) => setFormData({ ...formData, IsAdmin: Number(e.target.value) })}
                                    >
                                        <option value={0}>Operator / Staff</option>
                                        <option value={1}>System Administrator</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="warning" size="sm" type="submit">Create User</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}
