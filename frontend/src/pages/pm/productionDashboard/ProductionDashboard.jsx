import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Table, Badge, Button } from "react-bootstrap";
import { FaIndustry, FaCogs, FaCheckCircle, FaExclamationTriangle, FaSyncAlt } from "react-icons/fa";
import axios from "axios";

export default function ProductionDashboard() {
    const [metrics, setMetrics] = useState({
        totalOrders: 18,
        activeLines: 6,
        dailyTarget: 2500,
        dailyActual: 2340,
        efficiency: 93.6,
        defectRate: 1.4
    });
    const [loading, setLoading] = useState(false);

    const fetchMetrics = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/dashboard/production");
            if (res.data?.data) {
                setMetrics(prev => ({ ...prev, ...res.data.data }));
            }
        } catch (e) {
            console.warn("Using sample production dashboard metrics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-0">Production Floor Dashboard</h4>
                    <p className="text-muted mb-0">Real-time shop floor performance & line output</p>
                </div>
                <Button variant="outline-primary" size="sm" onClick={fetchMetrics}>
                    <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                </Button>
            </div>

            <Row className="g-3 mb-4">
                <Col md={3}>
                    <Card className="shadow-sm border-0 border-start border-primary border-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="text-muted small mb-1 fw-bold">ACTIVE ORDERS</p>
                                    <h3 className="fw-bold mb-0">{metrics.totalOrders}</h3>
                                </div>
                                <FaIndustry size={36} className="text-primary opacity-50" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="shadow-sm border-0 border-start border-success border-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="text-muted small mb-1 fw-bold">TODAY'S OUTPUT</p>
                                    <h3 className="fw-bold mb-0 text-success">{metrics.dailyActual} <small className="fs-6 text-muted">/ {metrics.dailyTarget}</small></h3>
                                </div>
                                <FaCheckCircle size={36} className="text-success opacity-50" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="shadow-sm border-0 border-start border-warning border-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="text-muted small mb-1 fw-bold">LINE EFFICIENCY</p>
                                    <h3 className="fw-bold mb-0 text-warning">{metrics.efficiency}%</h3>
                                </div>
                                <FaCogs size={36} className="text-warning opacity-50" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="shadow-sm border-0 border-start border-danger border-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="text-muted small mb-1 fw-bold">DEFECT RATE</p>
                                    <h3 className="fw-bold mb-0 text-danger">{metrics.defectRate}%</h3>
                                </div>
                                <FaExclamationTriangle size={36} className="text-danger opacity-50" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                    <h6 className="mb-0 fw-bold">Active Assembly Lines Status</h6>
                </Card.Header>
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Line #</th>
                                    <th>Supervisor</th>
                                    <th>Style Running</th>
                                    <th>Target Output</th>
                                    <th>Achieved</th>
                                    <th>Line Efficiency</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="fw-bold">Line 1</td>
                                    <td>Ramesh Kumar</td>
                                    <td>Classic Oxford Shirt</td>
                                    <td>500 pcs</td>
                                    <td className="fw-bold text-success">480 pcs</td>
                                    <td><Badge bg="success">96%</Badge></td>
                                    <td><Badge bg="success">Running</Badge></td>
                                </tr>
                                <tr>
                                    <td className="fw-bold">Line 2</td>
                                    <td>Sunil Verma</td>
                                    <td>Straight Chino Pants</td>
                                    <td>400 pcs</td>
                                    <td className="fw-bold text-success">385 pcs</td>
                                    <td><Badge bg="success">96%</Badge></td>
                                    <td><Badge bg="success">Running</Badge></td>
                                </tr>
                                <tr>
                                    <td className="fw-bold">Line 3</td>
                                    <td>Amit Sharma</td>
                                    <td>Denim Jacket V2</td>
                                    <td>250 pcs</td>
                                    <td className="fw-bold text-warning">210 pcs</td>
                                    <td><Badge bg="warning" text="dark">84%</Badge></td>
                                    <td><Badge bg="primary">Bottle-neck</Badge></td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
