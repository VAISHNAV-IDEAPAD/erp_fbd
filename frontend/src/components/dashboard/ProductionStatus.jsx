import { Card, ProgressBar } from "react-bootstrap";

export default function ProductionStatus() {

    return (

        <Card className="shadow-sm border-0">

            <Card.Header>

                <strong>Production Status</strong>

            </Card.Header>

            <Card.Body>

                <h6>Cutting (75%)</h6>
                <ProgressBar now={75} className="mb-3" />

                <h6>Stitching (60%)</h6>
                <ProgressBar
                    now={60}
                    variant="success"
                    className="mb-3"
                />

                <h6>Finishing (45%)</h6>
                <ProgressBar
                    now={45}
                    variant="warning"
                    className="mb-3"
                />

                <h6>Packing (30%)</h6>
                <ProgressBar
                    now={30}
                    variant="danger"
                />

            </Card.Body>

        </Card>

    );

}