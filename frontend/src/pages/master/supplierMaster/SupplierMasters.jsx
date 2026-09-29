import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FaPlus,
    FaSearch,
    FaEye,
    FaEdit,
    FaSyncAlt,
    FaTruck,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export default function SupplierMasters() {

    const navigate = useNavigate();

    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // ---------------------------------------
    // LOAD SUPPLIERS
    // ---------------------------------------
    const loadSuppliers = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_URL}/suppliers`
            );

            const data =
                response.data?.data ||
                response.data ||
                [];

            setSuppliers(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Error loading suppliers:",
                error
            );

            setSuppliers([]);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadSuppliers();
    }, []);

    // ---------------------------------------
    // SEARCH
    // ---------------------------------------
    const filteredSuppliers = suppliers.filter(
        (supplier) => {

            const text =
                search.toLowerCase();

            return (
                String(
                    supplier.SupplierCode ||
                    supplier.supplierCode ||
                    ""
                )
                    .toLowerCase()
                    .includes(text)

                ||

                String(
                    supplier.SupplierName ||
                    supplier.supplierName ||
                    ""
                )
                    .toLowerCase()
                    .includes(text)

                ||

                String(
                    supplier.ContactPerson ||
                    supplier.contactPerson ||
                    ""
                )
                    .toLowerCase()
                    .includes(text)

                ||

                String(
                    supplier.Phone ||
                    supplier.phone ||
                    ""
                )
                    .toLowerCase()
                    .includes(text)

                ||

                String(
                    supplier.City ||
                    supplier.city ||
                    ""
                )
                    .toLowerCase()
                    .includes(text)
            );

        }
    );

    // ---------------------------------------
    // NEW SUPPLIER
    // ---------------------------------------
    const handleNewSupplier = () => {
        navigate("/master/suppliers/new");
    };

    // ---------------------------------------
    // VIEW SUPPLIER
    // ---------------------------------------
    const handleView = (id) => {
        navigate(`/master/suppliers/view/${id}`);
    };

    // ---------------------------------------
    // EDIT SUPPLIER
    // ---------------------------------------
    const handleEdit = (id) => {
        navigate(`/master/suppliers/edit/${id}`);
    };

    return (

        <div className="container-fluid py-3">

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="d-flex justify-content-between align-items-center mb-3">

                <div>

                    <h4 className="fw-bold mb-1">

                        <FaTruck className="me-2" />

                        Supplier Master

                    </h4>

                    <small className="text-muted">
                        Supplier / Vendor Master
                    </small>

                </div>

                <div className="d-flex gap-2">

                    <button
                        className="btn btn-outline-secondary"
                        onClick={loadSuppliers}
                        disabled={loading}
                    >

                        <FaSyncAlt />

                        <span className="ms-2">
                            Refresh
                        </span>

                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={handleNewSupplier}
                    >

                        <FaPlus className="me-2" />

                        New Supplier

                    </button>

                </div>

            </div>


            {/* =====================================
                SEARCH
            ===================================== */}

            <div className="card shadow-sm mb-3">

                <div className="card-body">

                    <div className="input-group">

                        <span className="input-group-text">
                            <FaSearch />
                        </span>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search Supplier Code, Name, Contact, Phone or City..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                        {search && (

                            <button
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setSearch("")
                                }
                            >
                                Clear
                            </button>

                        )}

                    </div>

                </div>

            </div>


            {/* =====================================
                SUPPLIER TABLE
            ===================================== */}

            <div className="card shadow-sm">

                <div className="card-header bg-white d-flex justify-content-between align-items-center">

                    <strong>
                        Supplier Register
                    </strong>

                    <span className="badge bg-secondary">
                        {filteredSuppliers.length} Records
                    </span>

                </div>

                <div className="table-responsive">

                    <table className="table table-hover table-bordered align-middle mb-0">

                        <thead className="table-light">

                            <tr>

                                <th>#</th>

                                <th>Supplier Code</th>

                                <th>Supplier Name</th>

                                <th>Contact Person</th>

                                <th>Phone</th>

                                <th>City</th>

                                <th>State</th>

                                <th style={{ width: "120px" }}>
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center py-4"
                                    >
                                        Loading suppliers...
                                    </td>

                                </tr>

                            ) : filteredSuppliers.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center py-5"
                                    >

                                        <div className="text-muted mb-2">
                                            No suppliers found
                                        </div>

                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={
                                                handleNewSupplier
                                            }
                                        >

                                            <FaPlus className="me-1" />

                                            Create First Supplier

                                        </button>

                                    </td>

                                </tr>

                            ) : (

                                filteredSuppliers.map(
                                    (supplier, index) => {

                                        const id =
                                            supplier.SupplierID ||
                                            supplier.supplierId ||
                                            supplier.id;

                                        return (

                                            <tr
                                                key={
                                                    id ||
                                                    index
                                                }
                                            >

                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            supplier.SupplierCode ||
                                                            supplier.supplierCode ||
                                                            "-"
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        supplier.SupplierName ||
                                                        supplier.supplierName ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        supplier.ContactPerson ||
                                                        supplier.contactPerson ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        supplier.Phone ||
                                                        supplier.phone ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        supplier.City ||
                                                        supplier.city ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        supplier.State ||
                                                        supplier.state ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>

                                                    <div className="d-flex gap-1">

                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            title="View"
                                                            onClick={() =>
                                                                handleView(
                                                                    id
                                                                )
                                                            }
                                                        >

                                                            <FaEye />

                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-secondary"
                                                            title="Edit"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    id
                                                                )
                                                            }
                                                        >

                                                            <FaEdit />

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}