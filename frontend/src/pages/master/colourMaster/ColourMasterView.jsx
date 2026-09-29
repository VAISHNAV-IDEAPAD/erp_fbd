import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    FaArrowLeft,
    FaEdit,
    FaPrint,
    FaPalette,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export default function ColourMasterView() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [colour, setColour] = useState(null);
    const [loading, setLoading] = useState(true);

    // ---------------------------------------
    // LOAD COLOUR
    // ---------------------------------------
    useEffect(() => {
        loadColour();
    }, [id]);

    const loadColour = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_URL}/colours/${id}`
            );

            const data =
                response.data?.data ||
                response.data;

            setColour(data);

        } catch (error) {

            console.error(
                "Error loading colour:",
                error
            );

            setColour(null);

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
                    Loading colour...
                </div>

            </div>
        );
    }

    // ---------------------------------------
    // NOT FOUND
    // ---------------------------------------
    if (!colour) {

        return (
            <div className="container-fluid py-5 text-center">

                <h5>
                    Colour not found
                </h5>

                <button
                    className="btn btn-primary mt-3"
                    onClick={() =>
                        navigate("/master/colours")
                    }
                >

                    <FaArrowLeft className="me-2" />

                    Back to Colour Master

                </button>

            </div>
        );
    }

    // ---------------------------------------
    // VALUES
    // ---------------------------------------
    const colourCode =
        colour.ColourCode ||
        colour.ColorCode ||
        colour.colourCode ||
        colour.colorCode ||
        "-";

    const colourName =
        colour.ColourName ||
        colour.ColorName ||
        colour.colourName ||
        colour.colorName ||
        "-";

    const description =
        colour.Description ||
        colour.description ||
        "-";

    const createdAt =
        colour.CreatedAt ||
        colour.createdAt ||
        "-";

    return (

        <div className="container-fluid py-3">

            {/* =====================================
                ACTION HEADER
            ===================================== */}

            <div className="d-flex justify-content-between align-items-center mb-3 no-print">

                <div>

                    <h4 className="fw-bold mb-1">

                        <FaPalette className="me-2" />

                        Colour Details

                    </h4>

                    <small className="text-muted">
                        Colour Master
                    </small>

                </div>

                <div className="d-flex gap-2">

                    <button
                        className="btn btn-outline-secondary"
                        onClick={() =>
                            navigate("/master/colours")
                        }
                    >

                        <FaArrowLeft className="me-2" />

                        Back

                    </button>

                    <button
                        className="btn btn-outline-primary"
                        onClick={() =>
                            navigate(
                                `/master/colours/edit/${id}`
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
                COLOUR DOCUMENT
            ===================================== */}

            <div className="card shadow-sm colour-document">

                <div className="card-body">

                    {/* HEADER */}

                    <div className="row align-items-center border-bottom pb-3 mb-4">

                        <div className="col-md-8">

                            <h3 className="fw-bold mb-1">
                                COLOUR MASTER
                            </h3>

                            <div className="text-muted">
                                Colour Information
                            </div>

                        </div>

                        <div className="col-md-4 text-md-end">

                            <div>
                                <strong>
                                    Colour Code:
                                </strong>{" "}
                                {colourCode}
                            </div>

                            <div>
                                <strong>
                                    Colour ID:
                                </strong>{" "}
                                {colour.ColourID ||
                                    colour.ColorID ||
                                    id}
                            </div>

                        </div>

                    </div>


                    {/* =====================================
                        COLOUR INFORMATION
                    ===================================== */}

                    <div className="row g-4">

                        <div className="col-md-8">

                            <div className="info-box">

                                <h6 className="fw-bold border-bottom pb-2 mb-3">
                                    Colour Information
                                </h6>

                                <div className="row mb-3">

                                    <div className="col-md-4 text-muted">
                                        Colour Code
                                    </div>

                                    <div className="col-md-8 fw-semibold">
                                        {colourCode}
                                    </div>

                                </div>

                                <div className="row mb-3">

                                    <div className="col-md-4 text-muted">
                                        Colour Name
                                    </div>

                                    <div className="col-md-8 fw-semibold">
                                        {colourName}
                                    </div>

                                </div>

                                <div className="row">

                                    <div className="col-md-4 text-muted">
                                        Description
                                    </div>

                                    <div className="col-md-8">
                                        {description}
                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =====================================
                            COLOUR PREVIEW
                        ===================================== */}

                        <div className="col-md-4">

                            <div className="preview-box">

                                <div className="text-muted mb-2">
                                    Colour
                                </div>

                                <div className="colour-preview">
                                    {colourName}
                                </div>

                                <div className="mt-3">

                                    <span className="badge bg-secondary">
                                        {colourCode}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =====================================
                        CREATED DATE
                    ===================================== */}

                    <div className="text-muted small mt-4">

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

                .preview-box {
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    padding: 18px;
                    text-align: center;
                    height: 100%;
                }

                .colour-preview {
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    padding: 30px 10px;
                    font-size: 22px;
                    font-weight: 600;
                    background: #f8f9fa;
                }

                @media print {

                    body {
                        background: white !important;
                    }

                    .no-print {
                        display: none !important;
                    }

                    .colour-document {
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