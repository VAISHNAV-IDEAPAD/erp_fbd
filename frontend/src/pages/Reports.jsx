import React from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBook, FaBoxes, FaIndustry, FaChartLine, FaMoneyBillWave, FaClock } from "react-icons/fa";

export default function Reports() {
    const reportCategories = [
        {
            title: "Inventory Reports",
            icon: <FaBoxes size={32} className="text-primary mb-2" />,
            links: [
                { name: "Stock Ledger", path: "/stock-ledger" },
                { name: "Stock Summary", path: "/stock-summary" },
                { name: "Finished Goods Stock", path: "/finished-goods-stock" }
            ]
        },
        {
            title: "Purchase Reports",
            icon: <FaClock size={32} className="text-warning mb-2" />,
            links: [
                { name: "Pending Purchase Orders", path: "/pending-po" },
                { name: "Purchase Order Register", path: "/purchase-register" },
                { name: "Supplier Ledger", path: "/supplier-ledger" }
            ]
        },
        {
            title: "Production Reports",
            icon: <FaIndustry size={32} className="text-info mb-2" />,
            links: [
                { name: "Production Output Summary", path: "/production-report" },
                { name: "Work In Progress (WIP)", path: "/wip-report" },
                { name: "Unit Costing Variance", path: "/production-costing" }
            ]
        },
        {
            title: "Sales & Dispatch Reports",
            icon: <FaChartLine size={32} className="text-success mb-2" />,
            links: [
                { name: "Monthly Sales Register", path: "/sales-report" },
                { name: "Dispatch Tracking Log", path: "/dispatch" },
                { name: "Customer Outstanding Aging", path: "/customer-outstanding" }
            ]
        }
    ];

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h4 className="fw-bold mb-0">Management Information System (MIS) Reports</h4>
                <p className="text-muted mb-0">Auditing, financial ledgers & analytical summaries</p>
            </div>

            <Row className="g-4">
                {reportCategories.map((cat, idx) => (
                    <Col md={6} key={idx}>
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="me-3">{cat.icon}</div>
                                    <h5 className="fw-bold mb-0">{cat.title}</h5>
                                </div>
                                <div className="d-flex flex-column gap-2">
                                    {cat.links.map((lnk, lIdx) => (
                                        <Link key={lIdx} to={lnk.path} className="btn btn-outline-secondary text-start d-flex justify-content-between align-items-center py-2 px-3">
                                            <span>{lnk.name}</span>
                                            <span className="text-primary">&rarr;</span>
                                        </Link>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
