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

const API = `${process.env.REACT_APP_API_URL || "/api"}/employees`;

export default function EmployeeLookup({

    show,

    onHide,

    onSelect

}) {

    const [loading, setLoading] = useState(false);

    const [employees, setEmployees] = useState([]);

    const [search, setSearch] = useState("");

    useEffect(() => {

        if (show) {

            loadEmployees();

        }

    }, [show]);

    async function loadEmployees() {

        try {

            setLoading(true);

            const res = await axios.get(API);

            setEmployees(res.data.data || []);

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    }

    const filteredEmployees = useMemo(() => {

        const text = search.toLowerCase();

        return employees.filter(emp =>

            emp.EmployeeCode?.toLowerCase().includes(text) ||

            emp.EmployeeName?.toLowerCase().includes(text) ||

            emp.Department?.toLowerCase().includes(text)

        );

    }, [employees, search]);

    function choose(emp) {

        onSelect(emp);

    }

    return (

        <Modal

            show={show}

            onHide={onHide}

            size="xl"

            backdrop="static"

        >

            <Modal.Header closeButton>

                <Modal.Title>

                    Employee Lookup

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <InputGroup className="mb-3">

                    <InputGroup.Text>

                        <FaSearch />

                    </InputGroup.Text>

                    <Form.Control

                        placeholder="Search Employee"

                        value={search}

                        onChange={(e) =>
                            setSearch(e.target.value)
                        }

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
                    >

                        <thead className="table-primary">

                            <tr>

                                <th width="140">

                                    Employee Code

                                </th>

                                <th>

                                    Employee Name

                                </th>

                                <th width="220">

                                    Department

                                </th>

                                <th width="90">

                                    Select

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredEmployees.length > 0 ? (

                                filteredEmployees.map(emp => (

                                    <tr

                                        key={emp.EmployeeID}

                                        style={{
                                            cursor: "pointer"
                                        }}

                                        onDoubleClick={() =>
                                            choose(emp)
                                        }

                                    >

                                        <td>

                                            {emp.EmployeeCode}

                                        </td>

                                        <td>

                                            {emp.EmployeeName}

                                        </td>

                                        <td>

                                            {emp.Department}

                                        </td>

                                        <td className="text-center">

                                            <Button

                                                size="sm"

                                                variant="success"

                                                onClick={() =>
                                                    choose(emp)
                                                }

                                            >

                                                <FaCheck />

                                            </Button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan={4}
                                        className="text-center text-muted py-4"
                                    >

                                        No Employees Found

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