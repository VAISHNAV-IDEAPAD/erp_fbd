import { useEffect, useState } from "react";
import { Container, Card, Row, Col, Table, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { FaPrint } from "react-icons/fa";
import useIndent from "../../hooks/useIndent";

export default function IndentPrint() {

    const { id } = useParams();
    const { loadIndent } = useIndent();

    const [indent, setIndent] = useState(null);

    useEffect(() => {

        async function fetchIndent() {

            const data = await loadIndent(id);

            setIndent(data);

        }

        fetchIndent();

    }, [id]);

    const handlePrint = () => {

        window.print();

    };

    if (!indent)
        return null;

    return (

        <Container className="mt-3">

            <style>
                {`
                @media print {

                    .no-print{
                        display:none !important;
                    }

                    body{
                        background:white;
                    }

                    .card{
                        border:none !important;
                    }

                }
                `}
            </style>

            <Card>

                <Card.Body>

                    <div className="text-center mb-4">

                        <h3>YOUR COMPANY NAME</h3>

                        <h5>Purchase Indent</h5>

                    </div>

                    <Row className="mb-3">

                        <Col md={3}>
                            <strong>Indent No</strong>
                            <div>{indent.IndentNo}</div>
                        </Col>

                        <Col md={3}>
                            <strong>Date</strong>
                            <div>{indent.IndentDate}</div>
                        </Col>

                        <Col md={3}>
                            <strong>Department</strong>
                            <div>{indent.Department}</div>
                        </Col>

                        <Col md={3}>
                            <strong>Requested By</strong>
                            <div>{indent.RequestedBy}</div>
                        </Col>

                    </Row>

                    <Row className="mb-4">

                        <Col md={3}>
                            <strong>Priority</strong>
                            <div>{indent.Priority}</div>
                        </Col>

                        <Col md={9}>
                            <strong>Remarks</strong>
                            <div>{indent.Remarks}</div>
                        </Col>

                    </Row>

                    <Table bordered>

                        <thead>

                            <tr>

                                <th>#</th>

                                <th>Item Code</th>

                                <th>Item Name</th>

                                <th>UOM</th>

                                <th>Qty</th>

                                <th>Need Date</th>

                            </tr>

                        </thead>

                        <tbody>

                            {(indent.Items || []).map((item, index) => (

                                <tr key={index}>

                                    <td>{index + 1}</td>

                                    <td>{item.ItemCode}</td>

                                    <td>{item.ItemName}</td>

                                    <td>{item.UOM}</td>

                                    <td>{item.Quantity}</td>

                                    <td>{item.NeedDate}</td>

                                </tr>

                            ))}

                        </tbody>

                    </Table>

                    <Row className="mt-5 text-center">

                        <Col>
                            ____________________
                            <br />
                            Prepared By
                        </Col>

                        <Col>
                            ____________________
                            <br />
                            Checked By
                        </Col>

                        <Col>
                            ____________________
                            <br />
                            Approved By
                        </Col>

                    </Row>

                    <div className="text-center mt-4 no-print">

                        <Button
                            variant="primary"
                            onClick={handlePrint}
                        >

                            <FaPrint className="me-2"/>

                            Print

                        </Button>

                    </div>

                </Card.Body>

            </Card>

        </Container>

    );

}
