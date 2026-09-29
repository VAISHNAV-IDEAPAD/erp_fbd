import { Card, Button } from "react-bootstrap";

export default function QuickActions() {

    return (

        <Card className="shadow-sm border-0">

            <Card.Header>

                <strong>Quick Actions</strong>

            </Card.Header>

            <Card.Body className="d-grid gap-2">

                <Button variant="primary">
                    New Purchase Order
                </Button>

                <Button variant="success">
                    New GRN
                </Button>

                <Button variant="warning">
                    Production Order
                </Button>

                <Button variant="danger">
                    Sales Invoice
                </Button>

            </Card.Body>

        </Card>

    );

}