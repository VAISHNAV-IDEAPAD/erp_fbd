import { Row, Col, Card } from "react-bootstrap";
import {
    FaShoppingCart,
    FaFileInvoiceDollar,
    FaTruckLoading,
    FaClipboardList,
    FaUsers,
    FaBoxes
} from "react-icons/fa";

export default function PurchaseSummary({ summary = {} }) {

    const cards = [
        {
            title: "Today's Purchase",
            value: summary.todayPurchase || 0,
            color: "primary",
            icon: <FaShoppingCart size={28} />
        },
        {
            title: "Monthly Purchase",
            value: summary.monthPurchase || 0,
            color: "success",
            icon: <FaFileInvoiceDollar size={28} />
        },
        {
            title: "Pending PO",
            value: summary.pendingPO || 0,
            color: "warning",
            icon: <FaClipboardList size={28} />
        },
        {
            title: "Today's GRN",
            value: summary.todayGRN || 0,
            color: "info",
            icon: <FaTruckLoading size={28} />
        },
        {
            title: "Suppliers",
            value: summary.totalSuppliers || 0,
            color: "secondary",
            icon: <FaUsers size={28} />
        },
        {
            title: "Items",
            value: summary.totalItems || 0,
            color: "dark",
            icon: <FaBoxes size={28} />
        }
    ];

    return (

        <Row className="g-3 mb-4">

            {cards.map((card, index) => (

                <Col lg={2} md={4} sm={6} key={index}>

                    <Card className={`border-start border-5 border-${card.color} shadow-sm h-100`}>

                        <Card.Body>

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <small className="text-muted">
                                        {card.title}
                                    </small>

                                    <h4 className="fw-bold mt-2">
                                        {card.value}
                                    </h4>

                                </div>

                                <div className={`text-${card.color}`}>
                                    {card.icon}
                                </div>

                            </div>

                        </Card.Body>

                    </Card>

                </Col>

            ))}

        </Row>

    );
}