import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Spinner, Form, Row, Col } from "react-bootstrap";
import { FaBook, FaSyncAlt, FaSearch, FaFileInvoiceDollar } from "react-icons/fa";
import axios from "axios";

export default function PurchaseRegister() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchRegister = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/purchaseregister");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setRecords(data);
        } catch (err) {
            console.error("Error fetching purchase register:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegister();
    }, []);

    const filtered = records.filter((r) =>
        (r.PONumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.SupplierName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalAmount = filtered.reduce((sum, r) => sum + (Number(r.TotalAmount) || 0), 0);

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaBook className="me-2 fs-5 text-warning" />
                        <h5 className="mb-0 fw-bold">Purchase Register</h5>
                    </div>
                    <Button variant="outline-light" size="sm" onClick={fetchRegister} disabled={loading}>
                        <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3 align-items-center">
                        <Col md={4}>
                            <div className="input-group">
                                <span className="input-group-text bg-white"><FaSearch className="text-muted" /></span>
                                <Form.Control
                                    type="text"
                                    placeholder="Search by PO Number or Supplier..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                        <Col md={8} className="text-end">
                            <span className="badge bg-light text-dark p-2 fs-6 border">
                                Total Invoiced Value: <strong className="text-success">₹{totalAmount.toLocaleString()}</strong>
                            </span>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">Loading purchase records...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FaFileInvoiceDollar size={48} className="mb-3 text-secondary opacity-50" />
                            <h5>No Purchase Register Entries</h5>
                            <p>Purchase orders will appear here once created.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>PO Number</th>
                                        <th>PO Date</th>
                                        <th>Supplier Name</th>
                                        <th>Expected Date</th>
                                        <th>Total Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((item) => (
                                        <tr key={item.POID}>
                                            <td className="fw-semibold text-primary">{item.PONumber || `PO-${item.POID}`}</td>
                                            <td>{item.PODate ? new Date(item.PODate).toLocaleDateString() : "-"}</td>
                                            <td className="fw-semibold">{item.SupplierName || `Supplier #${item.SupplierID}`}</td>
                                            <td>{item.ExpectedDeliveryDate ? new Date(item.ExpectedDeliveryDate).toLocaleDateString() : "-"}</td>
                                            <td className="fw-bold">₹{Number(item.TotalAmount || 0).toLocaleString()}</td>
                                            <td>
                                                <Badge bg={item.Status === "Completed" ? "success" : item.Status === "Approved" ? "primary" : "secondary"}>
                                                    {item.Status || "Active"}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}
