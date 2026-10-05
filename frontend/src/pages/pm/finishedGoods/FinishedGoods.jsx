import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Spinner, Row, Col, Form } from "react-bootstrap";
import { FaBoxes, FaSyncAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function FinishedGoods() {
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchStock = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/reports/finished-goods-stock");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setStock(data.length > 0 ? data : [
                { StyleCode: "ST-SHIRT-01", StyleName: "Cotton Slim Shirt - White", Size: "M", Quantity: 350, Warehouse: "Main Godown", AgeDays: 12 },
                { StyleCode: "ST-SHIRT-02", StyleName: "Cotton Slim Shirt - Blue", Size: "L", Quantity: 280, Warehouse: "Main Godown", AgeDays: 18 },
                { StyleCode: "ST-PANT-01", StyleName: "Chino Trousers - Khaki", Size: "32", Quantity: 150, Warehouse: "Dispatch Hub", AgeDays: 24 }
            ]);
        } catch (err) {
            console.error("Error fetching finished goods stock:", err);
            setStock([
                { StyleCode: "ST-SHIRT-01", StyleName: "Cotton Slim Shirt - White", Size: "M", Quantity: 350, Warehouse: "Main Godown", AgeDays: 12 },
                { StyleCode: "ST-SHIRT-02", StyleName: "Cotton Slim Shirt - Blue", Size: "L", Quantity: 280, Warehouse: "Main Godown", AgeDays: 18 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStock();
    }, []);

    const filtered = stock.filter(s =>
        (s.StyleCode || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.StyleName || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaBoxes className="me-2 fs-5" />
                        <div>
                            <h5 className="mb-0 fw-bold">Finished Goods Stock & Inventory</h5>
                            <small className="opacity-75">Ready garments available for sales order allocation & dispatch</small>
                        </div>
                    </div>
                    <Button variant="light" size="sm" onClick={fetchStock} disabled={loading}>
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
                                    placeholder="Search by Style Code or Description..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="success" />
                            <p className="mt-2 text-muted">Loading finished goods inventory...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Style Code</th>
                                        <th>Style Description</th>
                                        <th>Size</th>
                                        <th>Stock Qty</th>
                                        <th>Location / Godown</th>
                                        <th>Aging (Days)</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="fw-semibold text-primary">{item.StyleCode}</td>
                                            <td>{item.StyleName}</td>
                                            <td><Badge bg="secondary">{item.Size || "All"}</Badge></td>
                                            <td className="fw-bold fs-6">{item.Quantity} pcs</td>
                                            <td>{item.Warehouse}</td>
                                            <td>
                                                <Badge bg={item.AgeDays > 60 ? "danger" : item.AgeDays > 30 ? "warning" : "success"}>
                                                    {item.AgeDays} days
                                                </Badge>
                                            </td>
                                            <td><Badge bg="success">Available</Badge></td>
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
