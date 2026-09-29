import { useState } from "react";
import {
    Container,
    Card,
    Table,
    Button,
    Spinner,
    Alert,
    Badge,
} from "react-bootstrap";
import {
    FaEdit,
    FaTrash,
    FaEye,
    FaPrint,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import useIndent from "../../hooks/useIndent";
import IndentToolbar from "../../components/indent/IndentToolbar";

export default function IndentList() {

    const navigate = useNavigate();

    const {
        indents,
        loading,
        error,
        removeIndent,
        loadIndents,
    } = useIndent();

    const [search, setSearch] = useState("");

    const filtered = indents.filter((row) =>
        JSON.stringify(row)
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this Indent?"))
            return;

        await removeIndent(id);

    };

    return (

        <Container fluid className="mt-3">

            <Card>

                <Card.Header>

                    <h4 className="mb-0">
                        Purchase Indent
                    </h4>

                </Card.Header>

                <Card.Body>

                    <IndentToolbar
                        search={search}
                        setSearch={setSearch}
                        onNew={() => navigate("/indent/new")}
                        onRefresh={loadIndents}
                    />

                    {loading &&

                        <div className="text-center">

                            <Spinner animation="border" />

                        </div>

                    }

                    {error &&

                        <Alert variant="danger">

                            {error}

                        </Alert>

                    }

                    <Table
                        striped
                        bordered
                        hover
                        responsive
                    >

                        <thead>

                            <tr>

                                <th>#</th>

                                <th>Indent No</th>

                                <th>Date</th>

                                <th>Department</th>

                                <th>Requested By</th>

                                <th>Status</th>

                                <th width="220">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filtered.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="text-center"
                                    >
                                        No Records Found
                                    </td>

                                </tr>

                            ) : (

                                filtered.map((row, index) => (

                                    <tr key={row.IndentID}>

                                        <td>{index + 1}</td>

                                        <td>{row.IndentNo}</td>

                                        <td>{row.IndentDate}</td>

                                        <td>{row.Department}</td>

                                        <td>{row.RequestedBy}</td>

                                        <td>

                                            <Badge bg="success">

                                                {row.Status}

                                            </Badge>

                                        </td>

                                        <td>

                                            <Button
                                                size="sm"
                                                variant="info"
                                                className="me-2"
                                                onClick={() =>
                                                    navigate(`/indent/view/${row.IndentID}`)
                                                }
                                            >
                                                <FaEye />
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="warning"
                                                className="me-2"
                                                onClick={() =>
                                                    navigate(`/indent/edit/${row.IndentID}`)
                                                }
                                            >
                                                <FaEdit />
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="danger"
                                                className="me-2"
                                                onClick={() =>
                                                    handleDelete(row.IndentID)
                                                }
                                            >
                                                <FaTrash />
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="secondary"
                                            >
                                                <FaPrint />
                                            </Button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </Table>

                </Card.Body>

            </Card>

        </Container>

    );

}