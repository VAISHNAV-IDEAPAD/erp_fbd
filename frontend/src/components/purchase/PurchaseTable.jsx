import { Badge, Card, Table } from "react-bootstrap";

export default function PurchaseTable({ orders = [] }) {

    return (

        <Card className="shadow-sm">

            <Card.Header>

                <strong>Recent Purchase Orders</strong>

            </Card.Header>

            <Card.Body className="p-0">

                <Table hover responsive className="mb-0">

                    <thead className="table-dark">

                        <tr>

                            <th>PO No</th>
                            <th>Supplier</th>
                            <th>Buyer</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {orders.length === 0 ? (

                            <tr>

                                <td colSpan="6" className="text-center py-4">

                                    No Purchase Orders

                                </td>

                            </tr>

                        ) : (

                            orders.map(po => (

                                <tr key={po.POID}>

                                    <td>{po.PONumber}</td>

                                    <td>{po.SupplierName}</td>

                                    <td>{po.BuyerName}</td>

                                    <td>{po.OrderDate}</td>

                                    <td>

                                        ₹ {Number(po.TotalAmount).toLocaleString()}

                                    </td>

                                    <td>

                                        <Badge bg={
                                            po.Status === "Approved"
                                                ? "success"
                                                : po.Status === "Pending"
                                                    ? "warning"
                                                    : po.Status === "Cancelled"
                                                        ? "danger"
                                                        : "secondary"
                                        }>

                                            {po.Status}

                                        </Badge>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </Table>

            </Card.Body>

        </Card>

    );

}