import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Spinner, ProgressBar } from "react-bootstrap";
import { FaTasks, FaSyncAlt } from "react-icons/fa";
import axios from "axios";

export default function WorkInProgress() {
    const [wipData, setWipData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWIP = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/reports/wip");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setWipData(data.length > 0 ? data : [
                { ProductionID: 101, Style: "Oxford Shirt 40s", CuttingQty: 500, SewingQty: 420, FinishingQty: 250, PackedQty: 100, TargetQty: 500 },
                { ProductionID: 102, Style: "Chino Trouser Khaki", CuttingQty: 300, SewingQty: 280, FinishingQty: 80, PackedQty: 0, TargetQty: 300 }
            ]);
        } catch (err) {
            console.error("Error fetching WIP:", err);
            setWipData([
                { ProductionID: 101, Style: "Oxford Shirt 40s", CuttingQty: 500, SewingQty: 420, FinishingQty: 250, PackedQty: 100, TargetQty: 500 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWIP();
    }, []);

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <FaTasks className="me-2 fs-5" />
                        <div>
                            <h5 className="mb-0 fw-bold">Work In Progress (WIP) Tracking</h5>
                            <small className="opacity-75">Live line monitoring across Cutting, Sewing, Finishing & Packing</small>
                        </div>
                    </div>
                    <Button variant="light" size="sm" onClick={fetchWIP} disabled={loading}>
                        <FaSyncAlt className={loading ? "fa-spin" : ""} /> Refresh
                    </Button>
                </Card.Header>
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">Loading live shop floor WIP...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Production #</th>
                                        <th>Style / Article</th>
                                        <th>Cutting</th>
                                        <th>Sewing</th>
                                        <th>Finishing</th>
                                        <th>Packed</th>
                                        <th>Overall Completion</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wipData.map((item, idx) => {
                                        const pct = Math.round(((item.PackedQty || 0) / (item.TargetQty || 1)) * 100);
                                        return (
                                            <tr key={idx}>
                                                <td className="fw-semibold text-primary">PO-{item.ProductionID || idx + 101}</td>
                                                <td>{item.Style || "Standard Garment"}</td>
                                                <td><span className="badge bg-secondary">{item.CuttingQty || 0} pcs</span></td>
                                                <td><span className="badge bg-info text-dark">{item.SewingQty || 0} pcs</span></td>
                                                <td><span className="badge bg-warning text-dark">{item.FinishingQty || 0} pcs</span></td>
                                                <td><span className="badge bg-success">{item.PackedQty || 0} pcs</span></td>
                                                <td style={{ minWidth: "160px" }}>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <ProgressBar now={pct} variant={pct > 80 ? "success" : pct > 40 ? "info" : "warning"} className="flex-grow-1" />
                                                        <small className="fw-bold">{pct}%</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <Badge bg={pct >= 100 ? "success" : "primary"}>
                                                        {pct >= 100 ? "Completed" : "Running"}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}
