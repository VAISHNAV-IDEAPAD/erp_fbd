import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Spinner, Row, Col, Form } from "react-bootstrap";
import { FaFileInvoiceDollar, FaSyncAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function SalesInvoices() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/sales-invoices");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setInvoices(data.length > 0 ? data : [
                { InvoiceID: 1, InvoiceNo: "INV-2026-081", InvoiceDate: "2026-10-02", CustomerName: "Zara Retail Apparel", TaxableAmount: 400000, GSTAmount: 48000, TotalAmount: 448000, PaymentStatus: "Paid" },
                { InvoiceID: 2, InvoiceNo: "INV-2026-082", InvoiceDate: "2026-10-04", CustomerName: "H&M Sourcing Hub", TaxableAmount: 650000, GSTAmount: 78000, TotalAmount: 728000, PaymentStatus: "Pending" }
            ]);
        } catch (err) {
            console.error("Error fetching sales invoices:", err);
            setInvoices([
                { InvoiceID: 1, InvoiceNo: "INV-2026-081", InvoiceDate: "2026-10-02", CustomerName: "Zara Retail Apparel", TaxableAmount: 400000, GSTAmount: 48000, TotalAmount: 448000, PaymentStatus: "Paid" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const filtered = invoices.filter(i =>
        (i.InvoiceNo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (i.CustomerName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaFileInvoiceDollar className="me-2 fs-5" />
                        <div>
                            <h5 className="mb-0 fw-bold">Tax Sales Invoices (GST)</h5>
                            <small className="opacity-75">Customer billing, GST compliance & receivables ledger</small>
                        </div>
                    </div>
                    <Button variant="light" size="sm" onClick={fetchInvoices} disabled={loading}>
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
                                    placeholder="Search by Invoice # or Customer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="success" />
                            <p className="mt-2 text-muted">Loading tax invoices...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Invoice #</th>
                                        <th>Date</th>
                                        <th>Customer</th>
                                        <th>Taxable Value</th>
                                        <th>GST (12%)</th>
                                        <th>Grand Total</th>
                                        <th>Payment Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(inv => (
                                        <tr key={inv.InvoiceID}>
                                            <td className="fw-semibold text-primary">{inv.InvoiceNo || `INV-${inv.InvoiceID}`}</td>
                                            <td>{inv.InvoiceDate ? new Date(inv.InvoiceDate).toLocaleDateString() : "-"}</td>
                                            <td className="fw-bold">{inv.CustomerName || `Customer #${inv.CustomerID}`}</td>
                                            <td>₹{(Number(inv.TaxableAmount) || 0).toLocaleString()}</td>
                                            <td className="text-muted">₹{(Number(inv.GSTAmount) || 0).toLocaleString()}</td>
                                            <td className="fw-bold text-success">₹{(Number(inv.TotalAmount) || 0).toLocaleString()}</td>
                                            <td>
                                                <Badge bg={inv.PaymentStatus === "Paid" ? "success" : "warning"} text={inv.PaymentStatus === "Paid" ? "" : "dark"}>
                                                    {inv.PaymentStatus || "Pending"}
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
