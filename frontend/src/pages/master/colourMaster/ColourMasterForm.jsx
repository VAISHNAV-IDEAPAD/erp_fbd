import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    FaArrowLeft,
    FaSave,
    FaPalette,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export default function ColourMasterForm() {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        ColourCode: "",
        ColourName: "",
        Description: "",
    });

    // ---------------------------------------
    // LOAD COLOUR FOR EDIT
    // ---------------------------------------
    useEffect(() => {

        if (isEdit) {
            loadColour();
        }

    }, [id]);

    const loadColour = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_URL}/colours/${id}`
            );

            const colour =
                response.data?.data ||
                response.data;

            if (colour) {

                setForm({
                    ColourCode:
                        colour.ColourCode ||
                        colour.ColorCode ||
                        colour.colourCode ||
                        colour.colorCode ||
                        "",

                    ColourName:
                        colour.ColourName ||
                        colour.ColorName ||
                        colour.colourName ||
                        colour.colorName ||
                        "",

                    Description:
                        colour.Description ||
                        colour.description ||
                        "",
                });

            }

        } catch (error) {

            console.error(
                "Error loading colour:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to load colour."
            );

        } finally {

            setLoading(false);

        }

    };

    // ---------------------------------------
    // FORM CHANGE
    // ---------------------------------------
    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

    };

    // ---------------------------------------
    // SAVE COLOUR
    // ---------------------------------------
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.ColourCode.trim()) {

            alert("Please enter Colour Code.");

            return;
        }

        if (!form.ColourName.trim()) {

            alert("Please enter Colour Name.");

            return;
        }

        try {

            setLoading(true);

            const payload = {
                ColourCode:
                    form.ColourCode.trim(),

                ColourName:
                    form.ColourName.trim(),

                Description:
                    form.Description.trim(),
            };

            if (isEdit) {

                await axios.put(
                    `${API_URL}/colours/${id}`,
                    payload
                );

                alert(
                    "Colour updated successfully."
                );

            } else {

                await axios.post(
                    `${API_URL}/colours`,
                    payload
                );

                alert(
                    "Colour created successfully."
                );

            }

            navigate("/master/colours");

        } catch (error) {

            console.error(
                "Colour save error:",
                error
            );

            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to save colour."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="container-fluid py-3">

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="d-flex justify-content-between align-items-center mb-3">

                <div>

                    <h4 className="fw-bold mb-1">

                        <FaPalette className="me-2" />

                        {isEdit
                            ? "Edit Colour"
                            : "New Colour"}

                    </h4>

                    <small className="text-muted">
                        Colour Master
                    </small>

                </div>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                        navigate("/master/colours")
                    }
                >

                    <FaArrowLeft className="me-2" />

                    Back

                </button>

            </div>


            {/* =====================================
                FORM
            ===================================== */}

            <form onSubmit={handleSubmit}>

                <div className="card shadow-sm">

                    <div className="card-header bg-white fw-bold">
                        Colour Information
                    </div>

                    <div className="card-body">

                        <div className="row g-3">

                            {/* COLOUR CODE */}

                            <div className="col-md-4">

                                <label className="form-label">

                                    Colour Code{" "}

                                    <span className="text-danger">
                                        *
                                    </span>

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="ColourCode"
                                    value={form.ColourCode}
                                    onChange={handleChange}
                                    placeholder="e.g. CLR-001"
                                    required
                                />

                            </div>


                            {/* COLOUR NAME */}

                            <div className="col-md-8">

                                <label className="form-label">

                                    Colour Name{" "}

                                    <span className="text-danger">
                                        *
                                    </span>

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="ColourName"
                                    value={form.ColourName}
                                    onChange={handleChange}
                                    placeholder="e.g. Black"
                                    required
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="col-md-12">

                                <label className="form-label">
                                    Description
                                </label>

                                <textarea
                                    className="form-control"
                                    name="Description"
                                    value={form.Description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Enter colour description"
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    BUTTONS
                ===================================== */}

                <div className="d-flex justify-content-end gap-2 mt-3">

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                            navigate("/master/colours")
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >

                        <FaSave className="me-2" />

                        {loading
                            ? "Saving..."
                            : isEdit
                                ? "Update Colour"
                                : "Save Colour"}

                    </button>

                </div>

            </form>

        </div>
    );
}