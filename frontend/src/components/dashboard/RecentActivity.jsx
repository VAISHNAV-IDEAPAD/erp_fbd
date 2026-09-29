import { Card, ListGroup } from "react-bootstrap";

export default function RecentActivity() {

    return (

        <Card className="shadow-sm border-0 h-100">

            <Card.Header>
                <strong>Recent Activity</strong>
            </Card.Header>

            <Card.Body className="p-0">

                <ListGroup variant="flush">

                    <ListGroup.Item>
                        ERP Dashboard Ready
                    </ListGroup.Item>

                    <ListGroup.Item>
                        Purchase Module Connected
                    </ListGroup.Item>

                    <ListGroup.Item>
                        Inventory Module Connected
                    </ListGroup.Item>

                    <ListGroup.Item>
                        Production Module Connected
                    </ListGroup.Item>

                    <ListGroup.Item>
                        Sales Module Connected
                    </ListGroup.Item>

                </ListGroup>

            </Card.Body>

        </Card>

    );

}