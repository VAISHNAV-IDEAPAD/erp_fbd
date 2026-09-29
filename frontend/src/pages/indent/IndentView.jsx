import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Table, Button, Spinner, Alert } from "react-bootstrap";
import { getIndentById } from "../../services/indentService";

export default function IndentView() {
    const { id } = useParams();

    const [indent, setIndent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadIndent();
    }, []);

    const loadIndent = async () => {
        try {
            const res = await getIndentById(id);
            setIndent(res.data.data);
        } catch (err) {
            console.error(err);
            setError("Unable to load indent.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner animation="border" className="m-4" />;

    if (error) return <Alert variant="danger">{error}</Alert>;

    if (!indent) return <Alert variant="warning">Indent not found.</Alert>;

    return (
        <Card className="m-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h4>Indent Details</h4>

                <Link to="/indents">
                    <Button variant="secondary">
                        Back
                    </Button>
                </Link>
            </Card.Header>

            <Card.Body>

                <p><strong>Indent No:</strong> {indent.IndentNo}</p>
                <p><strong>Date:</strong> {indent.IndentDate}</p>
                <p><strong>Department:</strong> {indent.Department}</p>
                <p><strong>Requested By:</strong> {indent.RequestedBy}</p>
                <p><strong>Status:</strong> {indent.Status}</p>
                <p><strong>Priority:</strong> {indent.Priority}</p>
                <p><strong>Remarks:</strong> {indent.Remarks}</p>

                <h5 className="mt-4">Items</h5>

                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Category</th>
                            <th>UOM</th>
                            <th>Qty</th>
                        </tr>
                    </thead>

                    <tbody>
                        {(indent.Items || []).map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.ItemCode}</td>
                                <td>{item.ItemName}</td>
                                <td>{item.Category}</td>
                                <td>{item.UOM}</td>
                                <td>{item.Quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

            </Card.Body>
        </Card>
    );
}