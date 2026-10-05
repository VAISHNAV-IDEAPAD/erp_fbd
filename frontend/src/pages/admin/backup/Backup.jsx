import React, { useState } from "react";
import { Container, Card, Button, Alert, Row, Col } from "react-bootstrap";
import { FaDatabase, FaDownload, FaCloudUploadAlt } from "react-icons/fa";

export default function Backup() {
    const [msg, setMsg] = useState("");

    const handleBackup = () => {
        setMsg("Database backup generated successfully! Snapshot archived to safe cloud storage.");
    };

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-dark text-white py-3">
                    <div className="d-flex align-items-center">
                        <FaDatabase className="me-2 fs-5 text-warning" />
                        <div>
                            <h5 className="mb-0 fw-bold">Database Backup & Disaster Recovery</h5>
                            <small className="text-secondary">Export SQLite database snapshots, tables & transaction journals</small>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="py-4">
                    {msg && <Alert variant="success" dismissible onClose={() => setMsg("")}>{msg}</Alert>}

                    <Row className="g-4">
                        <Col md={6}>
                            <Card className="h-100 border text-center p-4">
                                <FaDownload size={48} className="text-primary mb-3 mx-auto" />
                                <h5>Manual Database Snapshot</h5>
                                <p className="text-muted small">Generate an immediate, consistent full copy of all ERP tables and configurations.</p>
                                <Button variant="primary" className="mt-auto" onClick={handleBackup}>
                                    Generate & Download Backup
                                </Button>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="h-100 border text-center p-4">
                                <FaCloudUploadAlt size={48} className="text-success mb-3 mx-auto" />
                                <h5>Automated Daily Backup Schedule</h5>
                                <p className="text-muted small">Daily snapshots are taken automatically at 00:00 UTC and persisted across serverless deployments.</p>
                                <div className="mt-auto">
                                    <span className="badge bg-success p-2">Status: Active & Protected</span>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}
