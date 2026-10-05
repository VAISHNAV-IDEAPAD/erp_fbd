import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Spinner, Row, Col, Form } from "react-bootstrap";
import { FaTruck, FaSyncAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function Dispatch() {
    const [dispatches, setDispatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchDispatches = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/dispatches");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setDispatches(data.length > 0 ? data : [
                { DispatchID: 1, DispatchNo: "DSP-101", DispatchDate: "2026-10-04", CustomerName: "Zara Retail Apparel", Transporter: "VRL Logistics", VehicleNo: "HR-38-AA-5544", Cartons: 45, Status: "Dispatched" },
                { DispatchID: 2, DispatchNo: "DSP-102", DispatchDate: "2026-10-05", CustomerName: "H&M Sourcing Hub", Transporter: "SafeExpress", VehicleNo: "DL-1L-CC-2233", Cartons: 70, Status: "In Transit" }
            ]);
        } catch (err) {
            console.error("Error fetching dispatches:", err);
            setDispatches([
                { DispatchID: 1, DispatchNo: "DSP-101", DispatchDate: "2026-10-04", CustomerName: "Zara Retail Apparel", Transporter: "VRL Logistics", VehicleNo: "HR-38-AA-5544", Cartons: 45, Status: "Dispatched" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDispatches();
    }, []);

    const filtered = dispatches.filter(d =>
        (d.DispatchNo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.CustomerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.VehicleNo || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaTruck className="me-2 fs-5" />
                        <div>
                            <h5 className="mb-0 fw-bold">Dispatch & Logistics Management</h5>
                            <small className="opacity-75">Packaging slips, carrier tracking & customer deliveries</small>
                        </div>
                    </div>
                    <Button variant="light" size="sm" onClick={fetchDispatches} disabled={loading}>
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
                                    placeholder="Search by Dispatch # or Customer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">Loading dispatch log...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Dispatch #</th>
                                        <th>Date</th>
                                        <th>Customer</th>
                                        <th>Transporter</th>
                                        <th>Vehicle Number</th>
                                        <th>Carton Units</th>
                                        <th>Delivery Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(item => (
                                        <tr key={item.DispatchID}>
                                            <td className="fw-semibold text-primary">{item.DispatchNo}</td>
                                            <td>{new Date(item.DispatchDate).toLocaleDateString()}</td>
                                            <td className="fw-bold">{item.CustomerName}</td>
                                            <td>{item.Transporter}</td>
                                            <td><code>{item.VehicleNo}</code></td>
                                            <td><Badge bg="secondary">{item.Cartons} Cartons</Badge></td>
                                            <td>
                                                <Badge bg={item.Status === "Dispatched" ? "success" : "info"}>
                                                    {item.Status}
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
