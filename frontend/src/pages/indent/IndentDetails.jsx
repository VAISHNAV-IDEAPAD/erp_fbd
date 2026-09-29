import {
    Row,
    Col,
    Form,
    Button,
    InputGroup
} from "react-bootstrap";

import { FaSearch } from "react-icons/fa";

export default function IndentDetails({

    header,

    handleHeaderChange,

    setShowDepartmentLookup,

    setShowEmployeeLookup

}) {

    return (

        <>

            <Row className="mt-3">

                {/* Department */}

                <Col md={6}>

                    <Form.Group>

                        <Form.Label>

                            Department <span className="text-danger">*</span>

                        </Form.Label>

                        <InputGroup>

                            <Form.Control

                                value={header.Department || ""}

                                placeholder="Select Department"

                                readOnly

                            />

                            <Button

                                variant="outline-primary"

                                onClick={() =>

                                    setShowDepartmentLookup(true)

                                }

                            >

                                <FaSearch />

                            </Button>

                        </InputGroup>

                    </Form.Group>

                </Col>

                {/* Requested By */}

                <Col md={6}>

                    <Form.Group>

                        <Form.Label>

                            Requested By <span className="text-danger">*</span>

                        </Form.Label>

                        <InputGroup>
    <Form.Control
        value={header.RequestedBy || ""}
        placeholder="Select Employee"
        readOnly
    />

    <Button
        variant="outline-primary"
        onClick={() => setShowEmployeeLookup(true)}
    >
        <FaSearch />
    </Button>
</InputGroup>
                    </Form.Group>

                </Col>

            </Row>

            <Row className="mt-3">

                <Col md={12}>

                    <Form.Group>

                        <Form.Label>

                            Remarks

                        </Form.Label>

                        <Form.Control

                            as="textarea"

                            rows={3}

                            name="Remarks"

                            value={header.Remarks || ""}

                            onChange={handleHeaderChange}

                            placeholder="Enter remarks..."

                        />

                    </Form.Group>

                </Col>

            </Row>

        </>

    );

}