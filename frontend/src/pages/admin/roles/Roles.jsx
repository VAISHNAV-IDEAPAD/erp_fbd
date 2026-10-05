import React, { useState } from "react";
import { Container, Card, Table, Badge, Button } from "react-bootstrap";
import { FaKey } from "react-icons/fa";

export default function Roles() {
    const roles = [
        { id: 1, Code: "ADMIN", Name: "System Administrator", Description: "Full unrestricted access to masters, config, users and workflows", Users: 1 },
        { id: 2, Code: "MM_MGR", Name: "Material Management Lead", Description: "Approve indents, manage store transfers, gate entries and inspections", Users: 3 },
        { id: 3, Code: "PROD_HEAD", Name: "Production Floor Head", Description: "Manage production orders, work centers, WIP and BOM allocations", Users: 2 },
        { id: 4, Code: "SALES_EXEC", Name: "Sales & Dispatch Executive", Description: "Process sales orders, delivery challans, customer invoices", Users: 4 },
        { id: 5, Code: "STORE_OP", Name: "Store / Warehouse Clerk", Description: "Record gate entries, physical bin transfers, GRN verification", Users: 5 }
    ];

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-dark text-white py-3">
                    <div className="d-flex align-items-center">
                        <FaKey className="me-2 fs-5 text-warning" />
                        <div>
                            <h5 className="mb-0 fw-bold">Roles & Permission Matrix</h5>
                            <small className="text-secondary">Security groups, module authorizations & access policies</small>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Role Code</th>
                                    <th>Role Title</th>
                                    <th>Scope & Privileges</th>
                                    <th>Assigned Users</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map(r => (
                                    <tr key={r.id}>
                                        <td className="fw-semibold text-primary"><code>{r.Code}</code></td>
                                        <td className="fw-bold">{r.Name}</td>
                                        <td className="text-muted small">{r.Description}</td>
                                        <td><Badge bg="info">{r.Users} active accounts</Badge></td>
                                        <td><Badge bg="success">Enabled</Badge></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
