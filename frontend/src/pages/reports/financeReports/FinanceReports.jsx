import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Spinner, Row, Col } from "react-bootstrap";
import { FaMoneyCheckAlt, FaSyncAlt } from "react-icons/fa";
import axios from "axios";

export default function FinanceReports() {
    const [finance, setFinance] = useState({
        totalReceivables: 900000,
        totalPayables: 450000,
        monthlyCashflow: 1850000,
        grossMargin: 34.2
    });
    const [loading, setLoading] = useState(false);

    const fetchFinance = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/dashboard/finance");
            if (res.data?.data) {
                setFinance(prev => ({ ...prev, ...res.data.data }));
            }
        } catch (e) {
            console.warn("Using sample finance metrics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinance();
    }, []);

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaMoneyCheckAlt className="me-2 fs-5 text-warning" />
                        <div>
                            <h5 className="mb-0 fw-bold">Financial Accounting & MIS Summary</h5>
                            <small className="text-secondary">Cashflow, payables reconciliation & ledger summaries</small>
                        </div>
                    </div>
                    <Button variant="outline-light" size="sm" onClick={fetchFinance} disabled={loading}>
                        <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Row className="g-3 mb-4">
                        <Col md={3}>
                            <Card className="border text-center p-3">
                                <small className="text-muted fw-bold">RECEIVABLES</small>
                                <h4 className="fw-bold text-success mb-0">₹{(finance.totalReceivables || 0).toLocaleString()}</h4>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="border text-center p-3">
                                <small className="text-muted fw-bold">PAYABLES</small>
                                <h4 className="fw-bold text-danger mb-0">₹{(finance.totalPayables || 0).toLocaleString()}</h4>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="border text-center p-3">
                                <small className="text-muted fw-bold">NET CASHFLOW</small>
                                <h4 className="fw-bold text-primary mb-0">₹{(finance.monthlyCashflow || 0).toLocaleString()}</h4>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="border text-center p-3">
                                <small className="text-muted fw-bold">GROSS MARGIN</small>
                                <h4 className="fw-bold text-warning mb-0">{finance.grossMargin}%</h4>
                            </Card>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}
