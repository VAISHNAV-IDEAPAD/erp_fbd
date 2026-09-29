import { useEffect, useMemo, useState } from "react";
import {
    Modal,
    Table,
    Form,
    Button,
    InputGroup,
    Spinner,
    Alert
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

import { getItems } from "../../services/itemService";

export default function ItemLookup({
    show,
    onHide,
    onSelect
}) {

    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        if (show) {

            loadItems();

        }

    }, [show]);

    async function loadItems() {

        try {

            setLoading(true);
            setError("");

            const res = await getItems();

            let data = [];

            if (Array.isArray(res.data)) {

                data = res.data;

            } else if (Array.isArray(res.data.data)) {

                data = res.data.data;

            }

            setItems(data);

        }

        catch (err) {

            console.error(err);

            setError("Unable to load items.");

        }

        finally {

            setLoading(false);

        }

    }

    const filteredItems = useMemo(() => {

        const keyword = search.toLowerCase();

        return items.filter(item =>

            item.ItemCode?.toLowerCase().includes(keyword) ||

            item.ItemName?.toLowerCase().includes(keyword) ||

            item.Category?.toLowerCase().includes(keyword)

        );

    }, [items, search]);

    function select(item) {

        onSelect(item);

        setSearch("");

        onHide();

    }

    return (

        <Modal
            show={show}
            onHide={onHide}
            size="xl"
            backdrop="static"
            centered
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

                        autoFocus

                        placeholder="Search Item Code / Item Name / Category"

                        value={search}

                        onChange={(e) =>
                            setSearch(e.target.value)
                        }

                    />

                </InputGroup>

                {error &&

                    <Alert variant="danger">

                        {error}

                    </Alert>

                }

                {

                    loading ?

                    (

                        <div className="text-center py-5">

                            <Spinner animation="border" />

                        </div>

                    )

                    :

                    (

                        <Table
                            bordered
                            hover
                            responsive
                            size="sm"
                            className="align-middle"
                        >

                            <thead className="table-primary">

                                <tr>

                                    <th style={{width:"120px"}}>

                                        Item Code

                                    </th>

                                    <th>

                                        Item Name

                                    </th>

                                    <th>

                                        Category

                                    </th>

                                    <th style={{width:"80px"}}>

                                        UOM

                                    </th>

                                    <th style={{width:"100px"}}>

                                        Rate

                                    </th>

                                    <th style={{width:"100px"}}>

                                        Stock

                                    </th>

                                    <th style={{width:"90px"}}>

                                        Action

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    filteredItems.length === 0 ?

                                    (

                                        <tr>

                                            <td
                                                colSpan={7}
                                                className="text-center"
                                            >

                                                No Items Found

                                            </td>

                                        </tr>

                                    )

                                    :

                                    (

                                        filteredItems.map(item => (

                                            <tr

                                                key={item.ItemID}

                                                style={{

                                                    cursor:"pointer"

                                                }}

                                                onDoubleClick={() =>
                                                    select(item)
                                                }

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

                                                <td>

                                                    {Number(item.Rate).toFixed(2)}

                                                </td>

                                                <td>

                                                    {item.CurrentStock}

                                                </td>

                                                <td>

                                                    <Button

                                                        size="sm"

                                                        variant="success"

                                                        onClick={() =>
                                                            select(item)
                                                        }

                                                    >

                                                        Select

                                                    </Button>

                                                </td>

                                            </tr>

                                        ))

                                    )

                                }

                            </tbody>

                        </Table>

                    )

                }

            </Modal.Body>

        </Modal>

    );

}