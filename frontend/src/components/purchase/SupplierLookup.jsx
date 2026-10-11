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
    onSelect,
    suppliers: initialSuppliers
}) {
    const [suppliers, setSuppliers] = useState(initialSuppliers || []);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialSuppliers && initialSuppliers.length > 0) {
            setSuppliers(initialSuppliers);
        } else if (show) {
            loadSuppliers();
        }
    }, [show, initialSuppliers]);

    const loadSuppliers = async () => {
        try {
            setLoading(true);
            const res = await getSuppliers();
            const data =
                res.data?.value ||
                res.data?.data ||
                res.data ||
                [];
            setSuppliers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return suppliers;
        return suppliers.filter(s => {
            return (
                String(s.SupplierCode || s.supplierCode || "").toLowerCase().includes(keyword) ||
                String(s.SupplierName || s.supplierName || "").toLowerCase().includes(keyword) ||
                String(s.City || s.city || "").toLowerCase().includes(keyword)
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
                <div className="d-flex align-items-center gap-2">
                    <Modal.Title className="fs-5 mb-0">
                        Supplier Lookup
                    </Modal.Title>
                    <a
                        href="/master/suppliers"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm py-0 px-2 ms-2"
                        style={{ fontSize: "12px", height: "24px", lineHeight: "22px" }}
                        title="Open Supplier Master in new tab"
                    >
                        Supplier Master ↗
                    </a>
                </div>
            </Modal.Header>

            <Modal.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Text>
                        <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                        placeholder="Search Supplier by name, code, or city..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                    />
                </InputGroup>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-2 text-muted small">
                            <span>Found <strong>{filtered.length}</strong> suppliers in Supplier Master</span>
                            {filtered.length > 100 && (
                                <span className="badge bg-light text-secondary border">
                                    Showing top 100 (type to filter)
                                </span>
                            )}
                        </div>

                        <div style={{ maxHeight: "55vh", overflowY: "auto" }}>
                            <Table bordered hover responsive size="sm" className="align-middle mb-0">
                                <thead className="table-dark sticky-top" style={{ zIndex: 1 }}>
                                    <tr>
                                        <th style={{ width: "120px" }}>Code</th>
                                        <th>Supplier Name</th>
                                        <th>City</th>
                                        <th>Phone</th>
                                        <th>GST No</th>
                                        <th style={{ width: "80px", textAlign: "center" }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-muted">
                                                No Suppliers Found
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.slice(0, 100).map((supplier, idx) => (
                                            <tr
                                                key={supplier.SupplierID || supplier.supplierId || idx}
                                                onDoubleClick={() => {
                                                    onSelect(supplier);
                                                    onHide();
                                                }}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <td className="fw-semibold text-primary">
                                                    {supplier.SupplierCode || supplier.supplierCode || "-"}
                                                </td>
                                                <td className="fw-medium">
                                                    {supplier.SupplierName || supplier.supplierName}
                                                </td>
                                                <td>{supplier.City || supplier.city || "-"}</td>
                                                <td>{supplier.Phone || supplier.phone || "-"}</td>
                                                <td>{supplier.GSTNo || supplier.gstNo || "-"}</td>
                                                <td className="text-center">
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        className="py-0 px-2"
                                                        style={{ fontSize: "12px" }}
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
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
}