import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    FaArrowLeft,
    FaEdit,
    FaPrint,
    FaBoxOpen,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export default function ItemMasterView() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    // ---------------------------------------
    // LOAD ITEM
    // ---------------------------------------
    useEffect(() => {
        loadItem();
    }, [id]);

    const loadItem = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_URL}/items/${id}`
            );

            const data =
                response.data?.data ||
                response.data;

            setItem(data);

        } catch (error) {

            console.error(
                "Error loading item:",
                error
            );

            setItem(null);

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
                    Loading item...
                </div>

            </div>
        );
    }

    // ---------------------------------------
    // NOT FOUND
    // ---------------------------------------
    if (!item) {

        return (
            <div className="container-fluid py-5 text-center">

                <h5>
                    Item not found
                </h5>

                <button
                    className="btn btn-primary mt-3"
                    onClick={() =>
                        navigate("/master/items")
                    }
                >
                    <FaArrowLeft className="me-2" />
                    Back to Item Master
                </button>

            </div>
        );
    }

    // ---------------------------------------
    // ITEM VALUES
    // ---------------------------------------
    const itemCode =
        item.ItemCode ||
        item.itemCode ||
        "-";

    const itemName =
        item.ItemName ||
        item.itemName ||
        "-";

    const category =
        item.Category ||
        item.category ||
        "-";

    const uom =
        item.UOM ||
        item.uom ||
        "-";

    const rate =
        item.Rate ??
        item.rate ??
        0;

    const openingStock =
        item.OpeningStock ??
        item.openingStock ??
        0;

    const currentStock =
        item.CurrentStock ??
        item.currentStock ??
        0;

    const createdAt =
        item.CreatedAt ||
        item.createdAt ||
        "-";

    return (

        <div className="container-fluid py-3">

            {/* =====================================
                ACTION HEADER
            ===================================== */}

            <div className="d-flex justify-content-between align-items-center mb-3 no-print">

                <div>

                    <h4 className="fw-bold mb-1">

                        <FaBoxOpen className="me-2" />

                        Item Details

                    </h4>

                    <small className="text-muted">
                        Item Master
                    </small>

                </div>

                <div className="d-flex gap-2">

                    <button
                        className="btn btn-outline-secondary"
                        onClick={() =>
                            navigate("/master/items")
                        }
                    >

                        <FaArrowLeft className="me-2" />

                        Back

                    </button>

                    <button
                        className="btn btn-outline-primary"
                        onClick={() =>
                            navigate(
                                `/master/items/edit/${id}`
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
                ITEM DOCUMENT
            ===================================== */}

            <div className="card shadow-sm item-document">

                <div className="card-body">

                    {/* HEADER */}

                    <div className="row align-items-center border-bottom pb-3 mb-4">

                        <div className="col-md-8">

                            <h3 className="fw-bold mb-1">
                                ITEM MASTER
                            </h3>

                            <div className="text-muted">
                                Item / Material Information
                            </div>

                        </div>

                        <div className="col-md-4 text-md-end">

                            <div>
                                <strong>
                                    Item Code:
                                </strong>{" "}
                                {itemCode}
                            </div>

                            <div>
                                <strong>
                                    Item ID:
                                </strong>{" "}
                                {item.ItemID || id}
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
                                    Item Information
                                </h6>

                                <div className="row mb-2">

                                    <div className="col-5 text-muted">
                                        Item Code
                                    </div>

                                    <div className="col-7 fw-semibold">
                                        {itemCode}
                                    </div>

                                </div>

                                <div className="row mb-2">

                                    <div className="col-5 text-muted">
                                        Item Name
                                    </div>

                                    <div className="col-7 fw-semibold">
                                        {itemName}
                                    </div>

                                </div>

                                <div className="row mb-2">

                                    <div className="col-5 text-muted">
                                        Category
                                    </div>

                                    <div className="col-7">
                                        {category}
                                    </div>

                                </div>

                                <div className="row">

                                    <div className="col-5 text-muted">
                                        UOM
                                    </div>

                                    <div className="col-7">
                                        {uom}
                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =====================================
                            STOCK INFORMATION
                        ===================================== */}

                        <div className="col-md-6">

                            <div className="info-box">

                                <h6 className="fw-bold border-bottom pb-2 mb-3">
                                    Stock Information
                                </h6>

                                <div className="row mb-2">

                                    <div className="col-6 text-muted">
                                        Opening Stock
                                    </div>

                                    <div className="col-6 fw-semibold">
                                        {openingStock}
                                    </div>

                                </div>

                                <div className="row mb-2">

                                    <div className="col-6 text-muted">
                                        Current Stock
                                    </div>

                                    <div className="col-6">

                                        <span className="badge bg-primary fs-6">
                                            {currentStock}
                                        </span>

                                    </div>

                                </div>

                                <div className="row">

                                    <div className="col-6 text-muted">
                                        Rate
                                    </div>

                                    <div className="col-6 fw-semibold">
                                        ₹ {Number(rate).toFixed(2)}
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =====================================
                        ITEM SUMMARY
                    ===================================== */}

                    <div className="card border mb-4">

                        <div className="card-header bg-light fw-bold">
                            Item Summary
                        </div>

                        <div className="card-body">

                            <div className="row text-center">

                                <div className="col-md-4">

                                    <div className="summary-box">

                                        <div className="text-muted">
                                            Item Code
                                        </div>

                                        <h5 className="fw-bold mb-0">
                                            {itemCode}
                                        </h5>

                                    </div>

                                </div>

                                <div className="col-md-4">

                                    <div className="summary-box">

                                        <div className="text-muted">
                                            UOM
                                        </div>

                                        <h5 className="fw-bold mb-0">
                                            {uom}
                                        </h5>

                                    </div>

                                </div>

                                <div className="col-md-4">

                                    <div className="summary-box">

                                        <div className="text-muted">
                                            Current Stock
                                        </div>

                                        <h5 className="fw-bold mb-0">
                                            {currentStock}
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

                    .item-document {
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