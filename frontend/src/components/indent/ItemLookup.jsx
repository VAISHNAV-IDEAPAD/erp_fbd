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

const API = `${process.env.REACT_APP_API_URL || "/api"}/items`;

export default function ItemLookup({

    show,

    onHide,

    onSelect

}) {

    const [loading, setLoading] = useState(false);

    const [items, setItems] = useState([]);

    const [search, setSearch] = useState("");

    useEffect(() => {

        if (show) {

            loadItems();

        }

    }, [show]);

    async function loadItems() {

        try {

            setLoading(true);

            const res = await axios.get(API);

setItems(res.data.data || []);
        }

        catch (err) {

            onsole.error("Item Lookup Error:", err);

    setItems([]);

        }

        finally {

            setLoading(false);

        }

    }

    const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];

    const text = search.toLowerCase();

    return items.filter(item =>
        item.ItemCode?.toLowerCase().includes(text) ||
        item.ItemName?.toLowerCase().includes(text) ||
        item.Category?.toLowerCase().includes(text)
    );
}, [items, search]);

    function choose(item) {

        onSelect(item);

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

                    Item Lookup

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <InputGroup className="mb-3">

                    <InputGroup.Text>

                        <FaSearch />

                    </InputGroup.Text>

                    <Form.Control

                        placeholder="Search Item Code / Name"

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

                        hover

                        striped

                        bordered

                    >

                        <thead className="table-primary">

                            <tr>

                                <th>Code</th>

                                <th>Name</th>

                                <th>Category</th>

                                <th>UOM</th>

                                <th width="80">

                                    Select

                                </th>

                            </tr>

                        </thead>

                        <tbody>
                                                        {filteredItems.length > 0 ? (

                                filteredItems.map((item) => (

                                    <tr
                                        key={item.ItemID}
                                        style={{ cursor: "pointer" }}
                                        onDoubleClick={() => choose(item)}
                                    >

                                        <td>

                                            {item.ItemCode}

                                        </td>

                                        <td>

                                            {item.ItemName}

                                        </td>

                                        <td>

                                            {item.Category}

                                        </td>

                                        <td>

                                            {item.UOM}

                                        </td>

                                        <td className="text-center">

                                            <Button
                                                size="sm"
                                                variant="success"
                                                onClick={() => choose(item)}
                                            >

                                                <FaCheck />

                                            </Button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan={5}
                                        className="text-center text-muted py-4"
                                    >

                                        No items found.

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