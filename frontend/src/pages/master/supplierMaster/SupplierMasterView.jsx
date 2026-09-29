import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    FaArrowLeft,
    FaEdit,
    FaPrint,
    FaTruck,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export default function SupplierMasterView() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);

    // ---------------------------------------
    // LOAD SUPPLIER
    // ---------------------------------------
    useEffect(() => {
        loadSupplier();
    }, [id]);

    const loadSupplier = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_URL}/suppliers/${id}`
            );

            const data =
                response.data?.data ||
                response.data;

            setSupplier(data);

        } catch (error) {

            console.error(
                "Error loading supplier:",
                error
            );

            setSupplier(null);

        } finally {

            setLoading(false);

        }
    };

    // ---------------------------------------
    // PRINT
    // ---------------------------------------
    const handlePrint = () => {
        window.print();
    };

    // ---------------------------------------
    // LOADING
    // ---------------------------------------
    if (loading) {

        return (
            <div className="container-fluid py-5 text-center">

                <div className="spinner-border text-primary" />

                <div className="mt-2 text-muted">
                    Loading supplier...
                </div>

            </div>
        );
    }

    // ---------------------------------------
    // NOT FOUND
    // ---------------------------------------
    if (!supplier) {

        return (
            <div className="container-fluid py-5 text-center">

                <h5>
                    Supplier not found
                </h5>

                <button
                    className="btn btn-primary mt-3"
                    onClick={() =>
                        navigate("/master/suppliers")
                    }
                >

                    <FaArrowLeft className="me-2" />

                    Back to Supplier Master

                </button>

            </div>
        );
    }

    // ---------------------------------------
    // VALUES
    // ---------------------------------------
    const supplierCode =
        supplier.SupplierCode ||
        supplier.supplierCode ||
        "-";

    const supplierName =
        supplier.SupplierName ||
        supplier.supplierName ||
        "-";

    const contactPerson =
        supplier.ContactPerson ||
        supplier.contactPerson ||
        "-";

    const phone =
        supplier.Phone ||
        supplier.phone ||
        "-";

    const email =
        supplier.Email ||
        supplier.email ||
        "-";

    const gstNo =
        supplier.GSTNo ||
        supplier.gstNo ||
        "-";

    const address =
        supplier.Address ||
        supplier.address ||
        "-";

    const city =
        supplier.City ||
        supplier.city ||
        "-";

    const state =
        supplier.State ||
        supplier.state ||
        "-";

    const pincode =
        supplier.Pincode ||
        supplier.pincode ||
        "-";

    const createdAt =
        supplier.CreatedAt ||
        supplier.createdAt ||
        "-";

    return (

        <div className="container-fluid py-3">

            {/* =====================================
                ACTION HEADER
            ===================================== */}

            <div className="d-flex justify-content-between align-items-center mb-3 no-print">

                <div>

                    <h4 className="fw-bold mb-1">

                        <FaTruck className="me-2" />

                        Supplier Details

                    </h4>

                    <small className="text-muted">
                        Supplier Master
                    </small>

                </div>

                <div className="d-flex gap-2">

                    <button
                        className="btn btn-outline-secondary"
                        onClick={() =>
                            navigate("/master/suppliers")
                        }
                    >

                        <FaArrowLeft className="me-2" />

                        Back

                    </button>

                    <button
                        className="btn btn-outline-primary"
                        onClick={() =>
                            navigate(
                                `/master/suppliers/edit/${id}`
                            )
                        }
                    >

                        <FaEdit className="me-2" />

                        Edit

                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={handlePrint}
                    >

                        <FaPrint className="me-2" />

                        Print

                    </button>

                </div>

            </div>


            {/* =====================================
                SUPPLIER DOCUMENT
            ===================================== */}

            <div className="card shadow-sm supplier-document">

                <div className="card-body">

                    {/* =====================================
                        HEADER
                    ===================================== */}

                    <div className="row align-items-center border-bottom pb-3 mb-4">

                        <div className="col-md-8">

                            <h3 className="fw-bold mb-1">
                                SUPPLIER MASTER
                            </h3>

                            <div className="text-muted">
                                Supplier / Vendor Information
                            </div>

                        </div>

                        <div className="col-md-4 text-md-end">

                            <div>
                                <strong>
                                    Supplier Code:
                                </strong>{" "}
                                {supplierCode}
                            </div>

                            <div>
                                <strong>
                                    Supplier ID:
                                </strong>{" "}
                                {supplier.SupplierID || id}
                            </div>

                        </div>

                    </div>


                    {/* =====================================
                        BASIC INFORMATION
                    ===================================== */}

                    <div className="row g-4 mb-4">

                        <div className="col-md-6">

                            <div className="info-box">

                                <h6 className="fw-bold border-bottom pb-2 mb-3">
                                    Supplier Information
                                </h6>

                                <div className="row mb-3">

                                    <div className="col-5 text-muted">
                                        Supplier Code
                                    </div>

                                    <div className="col-7 fw-semibold">
                                        {supplierCode}
                                    </div>

                                </div>

                                <div className="row mb-3">

                                    <div className="col-5 text-muted">
                                        Supplier Name
                                    </div>

                                    <div className="col-7 fw-semibold">
                                        {supplierName}
                                    </div>

                                </div>

                                <div className="row">

                                    <div className="col-5 text-muted">
                                        Contact Person
                                    </div>

                                    <div className="col-7">
                                        {contactPerson}
                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =====================================
                            CONTACT INFORMATION
                        ===================================== */}

                        <div className="col-md-6">

                            <div className="info-box">

                                <h6 className="fw-bold border-bottom pb-2 mb-3">
                                    Contact Information
                                </h6>

                                <div className="row mb-3">

                                    <div className="col-5 text-muted">
                                        Phone
                                    </div>

                                    <div className="col-7 fw-semibold">
                                        {phone}
                                    </div>

                                </div>

                                <div className="row mb-3">

                                    <div className="col-5 text-muted">
                                        Email
                                    </div>

                                    <div className="col-7">
                                        {email}
                                    </div>

                                </div>

                                <div className="row">

                                    <div className="col-5 text-muted">
                                        GST No
                                    </div>

                                    <div className="col-7 fw-semibold">
                                        {gstNo}
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =====================================
                        ADDRESS
                    ===================================== */}

                    <div className="info-box mb-4">

                        <h6 className="fw-bold border-bottom pb-2 mb-3">
                            Address Information
                        </h6>

                        <div className="row">

                            <div className="col-md-3 text-muted">
                                Address
                            </div>

                            <div className="col-md-9">
                                {address}
                            </div>

                        </div>

                        <div className="row mt-3">

                            <div className="col-md-3 text-muted">
                                City
                            </div>

                            <div className="col-md-3 fw-semibold">
                                {city}
                            </div>

                            <div className="col-md-3 text-muted">
                                State
                            </div>

                            <div className="col-md-3 fw-semibold">
                                {state}
                            </div>

                        </div>

                        <div className="row mt-3">

                            <div className="col-md-3 text-muted">
                                Pincode
                            </div>

                            <div className="col-md-3 fw-semibold">
                                {pincode}
                            </div>

                        </div>

                    </div>


                    {/* =====================================
                        SUPPLIER SUMMARY
                    ===================================== */}

                    <div className="card border mb-4">

                        <div className="card-header bg-light fw-bold">
                            Supplier Summary
                        </div>

                        <div className="card-body">

                            <div className="row text-center">

                                <div className="col-md-4">

                                    <div className="summary-box">

                                        <div className="text-muted">
                                            Supplier Code
                                        </div>

                                        <h5 className="fw-bold mb-0">
                                            {supplierCode}
                                        </h5>

                                    </div>

                                </div>

                                <div className="col-md-4">

                                    <div className="summary-box">

                                        <div className="text-muted">
                                            Contact Person
                                        </div>

                                        <h5 className="fw-bold mb-0">
                                            {contactPerson}
                                        </h5>

                                    </div>

                                </div>

                                <div className="col-md-4">

                                    <div className="summary-box">

                                        <div className="text-muted">
                                            City
                                        </div>

                                        <h5 className="fw-bold mb-0">
                                            {city}
                                        </h5>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =====================================
                        CREATED DATE
                    ===================================== */}

                    <div className="text-muted small">
                        Created: {createdAt}
                    </div>

                </div>

            </div>


            {/* =====================================
                PRINT CSS
            ===================================== */}

            <style>{`

                .info-box {
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    padding: 18px;
                    height: 100%;
                }

                .summary-box {
                    padding: 10px;
                }

                @media print {

                    body {
                        background: white !important;
                    }

                    .no-print {
                        display: none !important;
                    }

                    .supplier-document {
                        border: none !important;
                        box-shadow: none !important;
                    }

                    .container-fluid {
                        padding: 0 !important;
                    }

                    @page {
                        size: A4;
                        margin: 12mm;
                    }

                }

            `}</style>

        </div>
    );
}