import React from "react";
import { Container, Card, Row, Col, Badge, Button } from "react-bootstrap";
import { FaUserCircle, FaEnvelope, FaBuilding, FaShieldAlt } from "react-icons/fa";

export default function Profile() {
    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white py-3">
                    <h5 className="mb-0 fw-bold">User Account Profile</h5>
                </Card.Header>
                <Card.Body className="p-4">
                    <Row className="align-items-center">
                        <Col md={3} className="text-center">
                            <FaUserCircle size={96} className="text-primary mb-3" />
                            <h5 className="fw-bold mb-0">Vaishnav V</h5>
                            <p className="text-muted small">@admin</p>
                            <Badge bg="success" className="px-3 py-2">System Administrator</Badge>
                        </Col>
                        <Col md={9}>
                            <h6 className="fw-bold text-muted mb-3">ACCOUNT INFORMATION</h6>
                            <Row className="g-3">
                                <Col md={6}>
                                    <div className="p-3 bg-light rounded">
                                        <div className="d-flex align-items-center mb-1">
                                            <FaEnvelope className="me-2 text-primary" />
                                            <small className="text-muted fw-bold">EMAIL ADDRESS</small>
                                        </div>
                                        <p className="mb-0 fw-semibold">vaishnavideapad@hotmail.com</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="p-3 bg-light rounded">
                                        <div className="d-flex align-items-center mb-1">
                                            <FaBuilding className="me-2 text-primary" />
                                            <small className="text-muted fw-bold">ORGANIZATION</small>
                                        </div>
                                        <p className="mb-0 fw-semibold">ERP Fashion (Company Code: 9b)</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="p-3 bg-light rounded">
                                        <div className="d-flex align-items-center mb-1">
                                            <FaShieldAlt className="me-2 text-primary" />
                                            <small className="text-muted fw-bold">SECURITY CLEARANCE</small>
                                        </div>
                                        <p className="mb-0 fw-semibold">Level 1 - Root Access</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="p-3 bg-light rounded">
                                        <div className="d-flex align-items-center mb-1">
                                            <FaUserCircle className="me-2 text-primary" />
                                            <small className="text-muted fw-bold">SYSTEM ROLE</small>
                                        </div>
                                        <p className="mb-0 fw-semibold">Primary Superuser</p>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}
