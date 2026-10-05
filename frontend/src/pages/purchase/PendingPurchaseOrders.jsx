import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Spinner, Form, Row, Col } from "react-bootstrap";
import { FaClock, FaSyncAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function PendingPurchaseOrders() {
    const [pendingPOs, setPendingPOs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPendingPOs = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/pendingpo");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setPendingPOs(data);
        } catch (err) {
            console.error("Error fetching pending POs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingPOs();
    }, []);

    const filtered = pendingPOs.filter((po) =>
        (po.PONumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (po.ItemName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (po.ItemCode || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-warning text-dark d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaClock className="me-2 fs-5" />
                        <h5 className="mb-0 fw-bold">Pending Purchase Orders</h5>
                    </div>
                    <Button variant="dark" size="sm" onClick={fetchPendingPOs} disabled={loading}>
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
                                    placeholder="Search by PO Number or Item..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="warning" />
                            <p className="mt-2 text-muted">Loading pending orders...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FaClock size={48} className="mb-3 text-secondary opacity-50" />
                            <h5>No Pending Purchase Orders</h5>
                            <p>All items have been fulfilled or no open orders exist.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>PO Number</th>
                                        <th>Item Code</th>
                                        <th>Item Name</th>
                                        <th>Ordered Qty</th>
                                        <th>Received Qty</th>
                                        <th>Pending Qty</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="fw-semibold text-primary">{item.PONumber || `PO-${item.POID}`}</td>
                                            <td><code>{item.ItemCode}</code></td>
                                            <td>{item.ItemName}</td>
                                            <td className="fw-bold">{item.OrderedQty}</td>
                                            <td className="text-success">{item.ReceivedQty}</td>
                                            <td className="text-danger fw-bold">{item.PendingQty}</td>
                                            <td>
                                                <Badge bg="warning" text="dark">Pending Receipt</Badge>
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
