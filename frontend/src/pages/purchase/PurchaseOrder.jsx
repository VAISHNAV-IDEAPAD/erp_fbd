import { useState, useEffect } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import PurchaseToolbar from "../../components/purchase/PurchaseToolbar";
import SupplierLookup from "../../components/purchase/SupplierLookup";
import ItemGrid from "../../components/purchase/ItemGrid";
import usePurchaseMasters from "../../hooks/usePurchaseMasters";
import { savePurchaseOrder } from "../../services/purchaseService";

export default function PurchaseOrder() {

    // =========================
    // States
    // =========================

    const [supplier, setSupplier] = useState(null);
    const [buyer, setBuyer] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const [remarks, setRemarks] = useState("");
    const [items, setItems] = useState([]);

    // =========================
    // Handle Save
    // =========================

    const handleSave = async () => {

        const payload = {

            supplierId: supplier?.SupplierID,
            buyer,
            orderDate,
            remarks,
            items

        };

        try {

            await savePurchaseOrder(payload);

            alert("Purchase Order Saved Successfully");

        } catch (err) {

            console.error(err);

            alert("Failed to Save Purchase Order");

        }

    };

    return (

        <Container fluid>

            <PurchaseToolbar />

            <Card className="shadow-sm mt-3">

                <Card.Header>

                    <h5 className="mb-0">
                        Purchase Order
                    </h5>

                </Card.Header>

                <Card.Body>

                    <Row>

                        <Col md={3}>

                            <Form.Group className="mb-3">

                                <Form.Label>PO Number</Form.Label>

                                <Form.Control
                                    value="AUTO"
                                    readOnly
                                />

                            </Form.Group>

                        </Col>

                        <Col md={3}>

                            <Form.Group className="mb-3">

                                <Form.Label>PO Date</Form.Label>

                                <Form.Control
                                    type="date"
                                />

                            </Form.Group>

                        </Col>

                        <Col md={3}>

                            <Form.Group className="mb-3">

                                <Form.Label>Buyer</Form.Label>

                                <Form.Control
                                    placeholder="Buyer"
                                />

                            </Form.Group>

                        </Col>

                        <Col md={3}>

                            <Form.Group className="mb-3">

                                <Form.Label>Status</Form.Label>

                                <Form.Select>

                                    <option>Open</option>
                                    <option>Approved</option>

                                </Form.Select>

                            </Form.Group>

                        </Col>

                    </Row>

                    <SupplierLookup
    suppliers={suppliers}
/>

<hr />

<ItemGrid
    itemsMaster={items}
/>
                    <Row className="mt-4">

                        <Col md={8}></Col>

                        <Col md={4}>

                            <table className="table table-bordered">

                                <tbody>

                                    <tr>
                                        <th>Sub Total</th>
                                        <td className="text-end">0.00</td>
                                    </tr>

                                    <tr>
                                        <th>GST</th>
                                        <td className="text-end">0.00</td>
                                    </tr>

                                    <tr>
                                        <th>Freight</th>
                                        <td className="text-end">0.00</td>
                                    </tr>

                                    <tr className="table-primary">

                                        <th>Grand Total</th>

                                        <th className="text-end">
                                            0.00
                                        </th>

                                    </tr>

                                </tbody>

                            </table>

                        </Col>

                    </Row>

                    <div className="text-end">

                        <Button
    variant="success"
    onClick={handleSave}
>
    Save
</Button>

                        <Button variant="warning" className="me-2">

                            Update

                        </Button>

                        <Button variant="secondary">

                            Print

                        </Button>

                    </div>

                </Card.Body>

            </Card>

        </Container>

    );

}