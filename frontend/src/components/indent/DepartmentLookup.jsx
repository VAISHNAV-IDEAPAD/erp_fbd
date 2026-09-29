import { useEffect, useMemo, useState } from "react";
import {
    Modal,
    Table,
    Form,
    Button,
    InputGroup,
    Spinner
} from "react-bootstrap";
import { FaSearch, FaCheck } from "react-icons/fa";
import axios from "axios";

const API = `${process.env.REACT_APP_API_URL || "/api"}/departments`;

export default function DepartmentLookup({

    show,
    onHide,
    onSelect

}) {

    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        if (show) {
            loadDepartments();
        }

    }, [show]);

    async function loadDepartments() {

        try {

            setLoading(true);

            const res = await axios.get(API);

            // ✅ Your API returns:
            // { success:true, count:12, data:[...] }

            setDepartments(
                Array.isArray(res.data.data)
                    ? res.data.data
                    : []
            );

        } catch (err) {

            console.error("Department Load Error:", err);

            setDepartments([]);

        } finally {

            setLoading(false);

        }

    }

    const filteredDepartments = useMemo(() => {

        const text = search.toLowerCase();

        return departments.filter(dep =>

            dep.DepartmentCode?.toLowerCase().includes(text) ||

            dep.DepartmentName?.toLowerCase().includes(text)

        );

    }, [departments, search]);

    function choose(dep) {

        onSelect(dep);

        onHide();

    }

    return (

        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            backdrop="static"
        >

            <Modal.Header closeButton>

                <Modal.Title>

                    Department Lookup

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <InputGroup className="mb-3">

                    <InputGroup.Text>

                        <FaSearch />

                    </InputGroup.Text>

                    <Form.Control
                        placeholder="Search Department"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </InputGroup>

                {loading ? (

                    <div className="text-center p-5">

                        <Spinner animation="border" />

                    </div>

                ) : (

                    <Table
                        bordered
                        hover
                        striped
                        responsive
                    >

                        <thead className="table-primary">

                            <tr>

                                <th width="150">Code</th>

                                <th>Department Name</th>

                                <th width="90">Select</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredDepartments.length > 0 ? (

                                filteredDepartments.map(dep => (

                                    <tr
                                        key={dep.DepartmentID}
                                        style={{ cursor: "pointer" }}
                                        onDoubleClick={() => choose(dep)}
                                    >

                                        <td>{dep.DepartmentCode}</td>

                                        <td>{dep.DepartmentName}</td>

                                        <td className="text-center">

                                            <Button
                                                size="sm"
                                                variant="success"
                                                onClick={() => choose(dep)}
                                            >

                                                <FaCheck />

                                            </Button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan={3}
                                        className="text-center text-muted py-4"
                                    >

                                        No Departments Found

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </Table>

                )}

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={onHide}
                >

                    Close

                </Button>

            </Modal.Footer>

        </Modal>

    );

}