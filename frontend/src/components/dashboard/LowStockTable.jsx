import { useEffect, useState } from "react";
import { Card, Table, Badge, Spinner, Alert } from "react-bootstrap";
import { getLowStock } from "../../services/dashboardService";

export default function LowStockTable() {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadLowStock = async () => {

        try {

            setLoading(true);

            const res = await getLowStock();

            const raw = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            const low = raw.filter(item => {
                const threshold = Number(item.ReorderLevel) > 0
                    ? Number(item.ReorderLevel)
                    : (Number(item.MinStock) > 0 ? Number(item.MinStock) : 20);
                return Number(item.CurrentStock ?? 0) <= threshold;
            });

            setItems(low.length > 0 ? low : raw.slice(0, 5));

            setError("");

        } catch (err) {

            console.error(err);

            setError("Unable to load low stock items.");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadLowStock();

        const timer = setInterval(loadLowStock, 60000);

        return () => clearInterval(timer);

    }, []);

    return (

        <Card className="shadow-sm border-0 h-100">

            <Card.Header className="d-flex justify-content-between align-items-center">

                <strong>Low Stock Items</strong>

                <Badge bg="danger">
                    {items.length}
                </Badge>

            </Card.Header>

            <Card.Body>

                {loading && (

                    <div className="text-center py-4">

                        <Spinner animation="border" />

                    </div>

                )}

                {!loading && error && (

                    <Alert variant="danger">

                        {error}

                    </Alert>

                )}

                {!loading && !error && (

                    <Table hover responsive>

                        <thead>

                            <tr>

                                <th>Code</th>
                                <th>Item Name</th>
                                <th>Stock</th>

                            </tr>

                        </thead>

                        <tbody>

                            {items.length === 0 ? (

                                <tr>

                                    <td colSpan="3" className="text-center">

                                        No Low Stock Items

                                    </td>

                                </tr>

                            ) : (

                                items.map((item) => (

                                    <tr key={item.ItemID}>

                                        <td>{item.ItemCode}</td>

                                        <td>{item.ItemName}</td>

                                        <td>

                                            <Badge
                                                bg={
                                                    item.CurrentStock <= 5
                                                        ? "danger"
                                                        : item.CurrentStock <= 20
                                                        ? "warning"
                                                        : "success"
                                                }
                                            >

                                                {item.CurrentStock}

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