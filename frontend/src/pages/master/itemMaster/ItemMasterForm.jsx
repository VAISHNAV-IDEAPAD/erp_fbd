import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    FaArrowLeft,
    FaSave,
    FaBoxOpen,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export default function ItemMasterForm() {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        ItemCode: "",
        ItemName: "",
        Category: "",
        UOM: "",
        Rate: "",
        OpeningStock: 0,
        CurrentStock: 0,
    });

    // ---------------------------------------
    // LOAD ITEM FOR EDIT
    // ---------------------------------------

    useEffect(() => {

        if (isEdit) {
            loadItem();
        }

    }, [id]);

    const loadItem = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_URL}/items/${id}`
            );

            const item =
                response.data?.data ||
                response.data;

            if (item) {

                setForm({
                    ItemCode:
                        item.ItemCode ||
                        item.itemCode ||
                        "",

                    ItemName:
                        item.ItemName ||
                        item.itemName ||
                        "",

                    Category:
                        item.Category ||
                        item.category ||
                        "",

                    UOM:
                        item.UOM ||
                        item.uom ||
                        "",

                    Rate:
                        item.Rate ??
                        item.rate ??
                        "",

                    OpeningStock:
                        item.OpeningStock ??
                        item.openingStock ??
                        0,

                    CurrentStock:
                        item.CurrentStock ??
                        item.currentStock ??
                        0,
                });

            }

        } catch (error) {

            console.error(
                "Error loading item:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to load item."
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
    // SAVE ITEM
    // ---------------------------------------

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.ItemCode.trim()) {
            alert("Please enter Item Code.");
            return;
        }

        if (!form.ItemName.trim()) {
            alert("Please enter Item Name.");
            return;
        }

        if (!form.UOM.trim()) {
            alert("Please enter UOM.");
            return;
        }

        try {

            setLoading(true);

            const payload = {
                ItemCode: form.ItemCode.trim(),
                ItemName: form.ItemName.trim(),
                Category: form.Category.trim(),
                UOM: form.UOM.trim(),
                Rate:
                    form.Rate === ""
                        ? 0
                        : Number(form.Rate),

                OpeningStock:
                    form.OpeningStock === ""
                        ? 0
                        : Number(form.OpeningStock),

                CurrentStock:
                    form.CurrentStock === ""
                        ? 0
                        : Number(form.CurrentStock),
            };

            if (isEdit) {

                await axios.put(
                    `${API_URL}/items/${id}`,
                    payload
                );

                alert(
                    "Item updated successfully."
                );

            } else {

                await axios.post(
                    `${API_URL}/items`,
                    payload
                );

                alert(
                    "Item created successfully."
                );

            }

            navigate("/master/items");

        } catch (error) {

            console.error(
                "Item save error:",
                error
            );

            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to save item."
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

                        <FaBoxOpen className="me-2" />

                        {isEdit
                            ? "Edit Item"
                            : "New Item"}

                    </h4>

                    <small className="text-muted">
                        Item Master
                    </small>

                </div>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                        navigate("/master/items")
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
                        Item Information
                    </div>

                    <div className="card-body">

                        <div className="row g-3">

                            {/* ITEM CODE */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    Item Code{" "}
                                    <span className="text-danger">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="ItemCode"
                                    value={form.ItemCode}
                                    onChange={handleChange}
                                    placeholder="Enter item code"
                                    required
                                />

                            </div>


                            {/* ITEM NAME */}

                            <div className="col-md-8">

                                <label className="form-label">
                                    Item Name{" "}
                                    <span className="text-danger">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="ItemName"
                                    value={form.ItemName}
                                    onChange={handleChange}
                                    placeholder="Enter item name"
                                    required
                                />

                            </div>


                            {/* CATEGORY */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    Category
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="Category"
                                    value={form.Category}
                                    onChange={handleChange}
                                    placeholder="Enter category"
                                />

                            </div>


                            {/* UOM */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    UOM{" "}
                                    <span className="text-danger">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="UOM"
                                    value={form.UOM}
                                    onChange={handleChange}
                                    placeholder="PCS / KG / MTR"
                                    required
                                />

                            </div>


                            {/* RATE */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    Rate
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="form-control"
                                    name="Rate"
                                    value={form.Rate}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                />

                            </div>


                            {/* OPENING STOCK */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    Opening Stock
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    className="form-control"
                                    name="OpeningStock"
                                    value={form.OpeningStock}
                                    onChange={handleChange}
                                />

                            </div>


                            {/* CURRENT STOCK */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    Current Stock
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    className="form-control"
                                    name="CurrentStock"
                                    value={form.CurrentStock}
                                    onChange={handleChange}
                                    disabled={!isEdit}
                                />

                                {!isEdit && (
                                    <small className="text-muted">
                                        Current stock will start from
                                        opening stock.
                                    </small>
                                )}

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
                            navigate("/master/items")
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
                                ? "Update Item"
                                : "Save Item"}

                    </button>

                </div>

            </form>

        </div>
    );
}