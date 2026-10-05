import React, { useState } from "react";
import { Container, Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { FaCogs } from "react-icons/fa";

export default function Settings() {
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState({
        companyName: "ERP Fashion & Apparel Ltd.",
        currency: "INR (₹)",
        financialYear: "2026-2027",
        gstEnabled: true,
        defaultTaxRate: 12,
        emailNotifications: true
    });

    const handleSave = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white py-3">
                    <div className="d-flex align-items-center">
                        <FaCogs className="me-2 fs-5" />
                        <div>
                            <h5 className="mb-0 fw-bold">System Configuration & Parameters</h5>
                            <small className="opacity-75">Global enterprise settings, tax definitions & operational currency</small>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="p-4">
                    {saved && <Alert variant="success">System preferences saved successfully!</Alert>}
                    <Form onSubmit={handleSave}>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Enterprise Entity Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={settings.companyName}
                                        onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Reporting Currency</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={settings.currency}
                                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Active Financial Year</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={settings.financialYear}
                                        onChange={(e) => setSettings({ ...settings, financialYear: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Standard Garment GST Rate (%)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={settings.defaultTaxRate}
                                        onChange={(e) => setSettings({ ...settings, defaultTaxRate: Number(e.target.value) })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Check
                                    type="checkbox"
                                    label="Enable Automated Email Alerts for Low Stock & Pending Approvals"
                                    checked={settings.emailNotifications}
                                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                                />
                            </Col>
                        </Row>
                        <div className="mt-4">
                            <Button variant="primary" type="submit">
                                Save System Settings
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
