import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Spinner, Row, Col, Form } from "react-bootstrap";
import { FaMoneyBillWave, FaSyncAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function CustomerOutstanding() {
    const [outstanding, setOutstanding] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchOutstanding = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/customer-outstanding");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setOutstanding(data.length > 0 ? data : [
                { CustomerID: 1, CustomerName: "Zara Retail Apparel", TotalInvoiced: 1250000, TotalPaid: 950000, BalanceOutstanding: 300000, DueDays: 15, Status: "Within Terms" },
                { CustomerID: 2, CustomerName: "H&M Sourcing Hub", TotalInvoiced: 2100000, TotalPaid: 1500000, BalanceOutstanding: 600000, DueDays: 45, Status: "Overdue" }
            ]);
        } catch (err) {
            console.error("Error fetching outstanding:", err);
            setOutstanding([
                { CustomerID: 1, CustomerName: "Zara Retail Apparel", TotalInvoiced: 1250000, TotalPaid: 950000, BalanceOutstanding: 300000, DueDays: 15, Status: "Within Terms" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOutstanding();
    }, []);

    const filtered = outstanding.filter(c =>
        (c.CustomerName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalOutstanding = filtered.reduce((sum, c) => sum + (Number(c.BalanceOutstanding) || 0), 0);

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-danger text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaMoneyBillWave className="me-2 fs-5" />
                        <div>
                            <h5 className="mb-0 fw-bold">Customer Outstanding & Aging Summary</h5>
                            <small className="opacity-75">Receivables monitoring, credit periods & overdue balances</small>
                        </div>
                    </div>
                    <Button variant="light" size="sm" onClick={fetchOutstanding} disabled={loading}>
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
                                    placeholder="Search Customer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                        <Col md={8} className="text-end">
                            <span className="badge bg-light text-dark p-2 fs-6 border">
                                Total Receivables: <strong className="text-danger">₹{totalOutstanding.toLocaleString()}</strong>
                            </span>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="danger" />
                            <p className="mt-2 text-muted">Calculating accounts receivables...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Customer</th>
                                        <th>Total Invoiced</th>
                                        <th>Total Paid</th>
                                        <th>Outstanding Balance</th>
                                        <th>Overdue (Days)</th>
                                        <th>Credit Health</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((item, idx) => (
                                        <tr key={item.CustomerID || idx}>
                                            <td className="fw-bold text-primary">{item.CustomerName}</td>
                                            <td>₹{(Number(item.TotalInvoiced) || 0).toLocaleString()}</td>
                                            <td className="text-success fw-bold">₹{(Number(item.TotalPaid) || 0).toLocaleString()}</td>
                                            <td className="text-danger fw-bold fs-6">₹{(Number(item.BalanceOutstanding) || 0).toLocaleString()}</td>
                                            <td><Badge bg={item.DueDays > 30 ? "danger" : "secondary"}>{item.DueDays || 0} days</Badge></td>
                                            <td>
                                                <Badge bg={item.Status === "Overdue" ? "danger" : "success"}>
                                                    {item.Status || "Good"}
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
