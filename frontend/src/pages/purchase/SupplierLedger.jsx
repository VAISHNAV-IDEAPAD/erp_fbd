import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Spinner, Form, Row, Col } from "react-bootstrap";
import { FaBookOpen, FaSyncAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function SupplierLedger() {
    const [ledger, setLedger] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchLedger = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/supplierledger/supplier-ledger");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setLedger(data);
        } catch (err) {
            console.error("Error fetching supplier ledger:", err);
            // Fallback to purchase register if needed
            try {
                const fallback = await axios.get("/api/purchaseregister");
                setLedger(Array.isArray(fallback.data) ? fallback.data : (fallback.data?.data || []));
            } catch (e) {
                console.error("Fallback error:", e);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLedger();
    }, []);

    const filtered = ledger.filter((entry) =>
        (entry.SupplierName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.PONo || entry.PONumber || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaBookOpen className="me-2 fs-5" />
                        <h5 className="mb-0 fw-bold">Supplier Ledger</h5>
                    </div>
                    <Button variant="light" size="sm" onClick={fetchLedger} disabled={loading}>
                        <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={4}>
                            <div className="input-group">
                                <span className="input-group-text bg-white"><FaSearch className="text-muted" /></span>
                                <Form.Control
                                    type="text"
                                    placeholder="Search by Supplier or Reference..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">Loading supplier transactions...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FaBookOpen size={48} className="mb-3 text-secondary opacity-50" />
                            <h5>No Ledger Transactions Found</h5>
                            <p>Transactions will appear here as purchase orders and invoices are generated.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Ref / PO #</th>
                                        <th>Date</th>
                                        <th>Supplier Name</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="fw-semibold text-primary">{item.PONo || item.PONumber || `REF-${item.POID || idx}`}</td>
                                            <td>{item.PODate ? new Date(item.PODate).toLocaleDateString() : "-"}</td>
                                            <td className="fw-semibold">{item.SupplierName || `Supplier #${item.SupplierID}`}</td>
                                            <td>
                                                <Badge bg="secondary">{item.EntryType || "Purchase"}</Badge>
                                            </td>
                                            <td className="fw-bold">₹{Number(item.TotalAmount || 0).toLocaleString()}</td>
                                            <td>
                                                <Badge bg={item.Status === "Completed" ? "success" : "info"}>
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
