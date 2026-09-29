import { useEffect, useMemo, useState } from "react";
import {
    Modal,
    Table,
    Form,
    Button,
    InputGroup,
    Spinner
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { getSuppliers } from "../../services/purchaseService";

export default function SupplierLookup({
    show,
    onHide,
    onSelect
}) {

    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (show) {
            loadSuppliers();
        }

    }, [show]);

    const loadSuppliers = async () => {

        try {

            setLoading(true);

            const res = await getSuppliers();

            setSuppliers(res.data || []);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    const filtered = useMemo(() => {

        return suppliers.filter(s => {

            const keyword = search.toLowerCase();

            return (

                s.SupplierCode?.toLowerCase().includes(keyword) ||

                s.SupplierName?.toLowerCase().includes(keyword) ||

                s.City?.toLowerCase().includes(keyword)

            );

        });

    }, [suppliers, search]);

    return (

        <Modal
            show={show}
            onHide={onHide}
            size="xl"
            centered
        >

            <Modal.Header closeButton>

                <Modal.Title>

                    Supplier Lookup

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <InputGroup className="mb-3">

                    <InputGroup.Text>

                        <FaSearch />

                    </InputGroup.Text>

                    <Form.Control
                        placeholder="Search Supplier..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </InputGroup>

                {loading ? (

                    <div className="text-center py-5">

                        <Spinner animation="border" />

                    </div>

                ) : (

                    <Table bordered hover responsive>

                        <thead className="table-dark">

                            <tr>

                                <th>Code</th>
                                <th>Name</th>
                                <th>City</th>
                                <th>Phone</th>
                                <th>GST No</th>
                                <th></th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                filtered.length === 0 ?

                                    (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                className="text-center"
                                            >

                                                No Suppliers Found

                                            </td>

                                        </tr>

                                    )

                                    :

                                    filtered.map(supplier => (

                                        <tr
                                            key={supplier.SupplierID}
                                            onDoubleClick={() => {

                                                onSelect(supplier);

                                                onHide();

                                            }}
                                            style={{
                                                cursor: "pointer"
                                            }}
                                        >

                                            <td>{supplier.SupplierCode}</td>

                                            <td>{supplier.SupplierName}</td>

                                            <td>{supplier.City}</td>

                                            <td>{supplier.Phone}</td>

                                            <td>{supplier.GSTNo}</td>

                                            <td>

                                                <Button
                                                    size="sm"
                                                    onClick={() => {

                                                        onSelect(supplier);

                                                        onHide();

                                                    }}
                                                >

                                                    Select

                                                </Button>

                                            </td>

                                        </tr>

                                    ))

                            }

                        </tbody>

                    </Table>

                )}

            </Modal.Body>

        </Modal>

    );

}