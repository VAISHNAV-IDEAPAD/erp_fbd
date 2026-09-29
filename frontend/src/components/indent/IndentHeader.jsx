import { Row, Col, Badge } from "react-bootstrap";
import { FaClipboardList } from "react-icons/fa";

export default function IndentHeader({
    title = "Material Indent",
    status = "Open"
}) {

    const getVariant = () => {

        switch (status?.toLowerCase()) {

            case "approved":
                return "success";

            case "closed":
                return "secondary";

            case "cancelled":
                return "danger";

            case "pending":
                return "warning";

            default:
                return "primary";
        }

    };

    return (

        <div className="bg-primary text-white p-3 rounded-top">

            <Row className="align-items-center">

                <Col md={8}>

                    <h4 className="mb-0">

                        <FaClipboardList className="me-2" />

                        {title}

                    </h4>

                </Col>

                <Col
                    md={4}
                    className="text-md-end mt-2 mt-md-0"
                >

                    <Badge
                        bg={getVariant()}
                        className="fs-6 px-3 py-2"
                    >
                        {status}
                    </Badge>

                </Col>

            </Row>

        </div>

    );

}