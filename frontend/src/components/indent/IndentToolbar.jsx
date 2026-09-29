import { Button, Form, InputGroup } from "react-bootstrap";
import {
    FaPlus,
    FaSearch,
    FaSync,
} from "react-icons/fa";

export default function IndentToolbar({
    search,
    setSearch,
    onNew,
    onRefresh,
}) {

    return (

        <div className="d-flex justify-content-between align-items-center mb-3">

            <InputGroup style={{ maxWidth: "400px" }}>

                <Form.Control
                    type="text"
                    placeholder="Search Indent..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <Button variant="outline-secondary">
                    <FaSearch />
                </Button>

            </InputGroup>

            <div>

                <Button
                    variant="success"
                    className="me-2"
                    onClick={onNew}
                >
                    <FaPlus className="me-2" />
                    New
                </Button>

                <Button
                    variant="primary"
                    onClick={onRefresh}
                >
                    <FaSync className="me-2" />
                    Refresh
                </Button>

            </div>

        </div>

    );

}