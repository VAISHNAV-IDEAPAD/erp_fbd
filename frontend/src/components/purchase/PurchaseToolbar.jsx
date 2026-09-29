import { Button, ButtonGroup } from "react-bootstrap";
import {
    FaPlus,
    FaSave,
    FaPrint,
    FaFileExcel,
    FaSyncAlt
} from "react-icons/fa";

export default function PurchaseToolbar() {

    return (

        <div className="d-flex justify-content-between align-items-center">

            <h4 className="mb-0">

                Purchase Order

            </h4>

            <ButtonGroup>

                <Button variant="primary">
                    <FaPlus className="me-2" />
                    New
                </Button>

                <Button variant="success">
                    <FaSave className="me-2" />
                    Save
                </Button>

                <Button variant="info">
                    <FaFileExcel className="me-2" />
                    Export
                </Button>

                <Button variant="secondary">
                    <FaPrint className="me-2" />
                    Print
                </Button>

                <Button variant="dark">
                    <FaSyncAlt className="me-2" />
                    Refresh
                </Button>

            </ButtonGroup>

        </div>

    );

}