import { Badge } from "react-bootstrap";

export default function StatusBadge({ status }) {

    let bg = "secondary";

    switch (status) {

        case "Draft":
            bg = "secondary";
            break;

        case "Submitted":
            bg = "primary";
            break;

        case "Approved":
            bg = "success";
            break;

        case "Cancelled":
            bg = "danger";
            break;

        default:
            bg = "secondary";

    }

    return <Badge bg={bg}>{status}</Badge>;

}