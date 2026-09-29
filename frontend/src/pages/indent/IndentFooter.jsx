import { Row, Col, Button } from "react-bootstrap";
import {
    FaSave,
    FaUndo,
    FaPrint
} from "react-icons/fa";

export default function IndentFooter({

    rows,
    totalQty,
    saving,
    indentId,
    saveIndent,
    resetForm,
    printIndent,
    onCancel

}) {

    return (

        <>

            <Row className="mt-3">

                <Col>

                    <strong>
                        Total Items : {rows.length}
                    </strong>

                </Col>

                <Col className="text-end">

                    <strong>
                        Total Qty : {totalQty}
                    </strong>

                </Col>

            </Row>

            <hr />

            <div className="d-flex justify-content-end gap-2">

                <Button
                    variant="primary"
                    onClick={saveIndent}
                    disabled={saving}
                >

                    <FaSave className="me-2" />

                    {saving
                        ? "Saving..."
                        : indentId
                        ? "Update"
                        : "Save"}

                </Button>

                <Button
                    variant="warning"
                    onClick={resetForm}
                >

                    <FaUndo className="me-2" />
                    Reset

                </Button>

                <Button
                    variant="success"
                    onClick={printIndent}
                >

                    <FaPrint className="me-2" />
                    Print

                </Button>

                {onCancel && (

                    <Button
                        variant="danger"
                        onClick={onCancel}
                    >
                        Close
                    </Button>

                )}

            </div>

        </>

    );

}