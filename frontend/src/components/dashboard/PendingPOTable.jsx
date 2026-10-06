import { useEffect, useState } from "react";
import { Card, Table, Badge, Spinner, Alert } from "react-bootstrap";
import { getPendingPO } from "../../services/dashboardService";

export default function PendingPOTable() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadPendingPO = async () => {

        try {

            setLoading(true);

            const res = await getPendingPO();

            console.log("Pending PO Response:", res.data);

            let data = [];

            if (Array.isArray(res.data)) {
                data = res.data;
            } else if (Array.isArray(res.data.data)) {
                data = res.data.data;
            }

            setOrders(data);
            setError("");

        } catch (err) {

            console.error(err);
            setError("Unable to load Pending Purchase Orders.");
            setOrders([]);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadPendingPO();

        const timer = setInterval(loadPendingPO, 60000);

        return () => clearInterval(timer);

    }, []);

    return (

        <Card className="shadow-sm border-0 h-100">

            <Card.Header className="d-flex justify-content-between align-items-center">

                <strong>Pending Purchase Orders</strong>

                <Badge bg="warning">
                    {orders.length}
                </Badge>

            </Card.Header>

            <Card.Body>

                {loading ? (

                    <div className="text-center py-4">
                        <Spinner animation="border" />
                    </div>

                ) : error ? (

                    <Alert variant="danger">
                        {error}
                    </Alert>

                ) : (

                    <Table hover responsive>

                        <thead>
                            <tr>
                                <th>PO No</th>
                                <th>Supplier</th>
                                <th className="text-end">Pending Qty</th>
                            </tr>
                        </thead>

                        <tbody>

                            {orders.length === 0 ? (

                                <tr>
                                    <td colSpan="3" className="text-center text-muted">
                                        No Pending Purchase Orders
                                    </td>
                                </tr>

                            ) : (

                                orders.map((po, index) => (

                                    <tr key={po.POID || index}>

                                        <td>{po.PONumber || po.PONo || `PO-${po.POID || index}`}</td>

                                        <td>{po.SupplierName || "Unknown"}</td>

                                        <td className="text-end">
                                            <Badge bg="warning">
                                                {po.PendingQty ?? po.Quantity ?? 0}
                                            </Badge>
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </Table>

                )}

            </Card.Body>

        </Card>

    );

}