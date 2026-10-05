import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table, Badge } from "react-bootstrap";
import { FaShoppingCart, FaRupeeSign, FaUsers, FaTruck, FaSyncAlt } from "react-icons/fa";
import axios from "axios";

export default function SalesDashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 8270000,
        monthlyOrders: 45,
        activeClients: 14,
        pendingDispatch: 6
    });
    const [loading, setLoading] = useState(false);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/dashboard/sales");
            if (res.data?.data) {
                setStats(prev => ({ ...prev, ...res.data.data }));
            }
        } catch (e) {
            console.warn("Using sample sales dashboard stats");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-0">Sales & Marketing (SM) Dashboard</h4>
                    <p className="text-muted mb-0">Revenue KPIs, order velocity & dispatch fulfillment</p>
                </div>
                <Button variant="outline-primary" size="sm" onClick={fetchStats}>
                    <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                </Button>
            </div>

            <Row className="g-3 mb-4">
                <Col md={3}>
                    <Card className="shadow-sm border-0 border-start border-success border-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="text-muted small mb-1 fw-bold">TOTAL REVENUE (FY)</p>
                                    <h3 className="fw-bold mb-0 text-success">₹{(stats.totalRevenue || 0).toLocaleString()}</h3>
                                </div>
                                <FaRupeeSign size={36} className="text-success opacity-50" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="shadow-sm border-0 border-start border-primary border-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="text-muted small mb-1 fw-bold">BOOKED ORDERS</p>
                                    <h3 className="fw-bold mb-0">{stats.monthlyOrders}</h3>
                                </div>
                                <FaShoppingCart size={36} className="text-primary opacity-50" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="shadow-sm border-0 border-start border-info border-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="text-muted small mb-1 fw-bold">ACTIVE BUYERS</p>
                                    <h3 className="fw-bold mb-0 text-info">{stats.activeClients}</h3>
                                </div>
                                <FaUsers size={36} className="text-info opacity-50" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="shadow-sm border-0 border-start border-warning border-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="text-muted small mb-1 fw-bold">PENDING SHIPMENTS</p>
                                    <h3 className="fw-bold mb-0 text-warning">{stats.pendingDispatch}</h3>
                                </div>
                                <FaTruck size={36} className="text-warning opacity-50" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                    <h6 className="mb-0 fw-bold">Recent High-Value Client Bookings</h6>
                </Card.Header>
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Client / Buyer</th>
                                    <th>Season / Collection</th>
                                    <th>Booked Units</th>
                                    <th>Order Value</th>
                                    <th>Target Delivery</th>
                                    <th>Fulfillment Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="fw-bold">Zara Retail Apparel</td>
                                    <td>Summer Essentials 2026</td>
                                    <td>5,000 pcs</td>
                                    <td className="fw-bold text-success">₹1,450,000</td>
                                    <td>25 Oct 2026</td>
                                    <td><Badge bg="success">In Production</Badge></td>
                                </tr>
                                <tr>
                                    <td className="fw-bold">H&M Sourcing Hub</td>
                                    <td>Autumn Menswear 2026</td>
                                    <td>8,500 pcs</td>
                                    <td className="fw-bold text-success">₹2,820,000</td>
                                    <td>05 Nov 2026</td>
                                    <td><Badge bg="primary">BOM Finalized</Badge></td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
