import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

export default function QuickActions() {
    const navigate = useNavigate();

    return (
        <Card className="shadow-sm border-0">
            <Card.Header>
                <strong>Quick Actions</strong>
            </Card.Header>

            <Card.Body className="d-grid gap-2">
                <Button
                    variant="primary"
                    onClick={() => navigate("/purchase-orders")}
                    style={{ cursor: "pointer" }}
                >
                    New Purchase Order
                </Button>

                <Button
                    variant="success"
                    onClick={() => navigate("/item-receipt/new")}
                    style={{ cursor: "pointer" }}
                >
                    New GRN
                </Button>

                <Button
                    variant="warning"
                    onClick={() => navigate("/production-orders")}
                    style={{ cursor: "pointer" }}
                >
                    Production Order
                </Button>

                <Button
                    variant="danger"
                    onClick={() => navigate("/sales-invoices")}
                    style={{ cursor: "pointer" }}
                >
                    Sales Invoice
                </Button>
            </Card.Body>
        </Card>
    );
}