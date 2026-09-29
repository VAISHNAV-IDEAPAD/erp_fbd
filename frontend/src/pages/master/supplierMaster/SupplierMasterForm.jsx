import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    FaArrowLeft,
    FaSave,
    FaTruck,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export default function SupplierMasterForm() {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        SupplierCode: "",
        SupplierName: "",
        ContactPerson: "",
        Phone: "",
        Email: "",
        GSTNo: "",
        Address: "",
        City: "",
        State: "",
        Pincode: "",
    });

    // ---------------------------------------
    // LOAD SUPPLIER FOR EDIT
    // ---------------------------------------

    useEffect(() => {

        if (isEdit) {
            loadSupplier();
        }

    }, [id]);

    const loadSupplier = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_URL}/suppliers/${id}`
            );

            const supplier =
                response.data?.data ||
                response.data;

            if (supplier) {

                setForm({
                    SupplierCode:
                        supplier.SupplierCode ||
                        supplier.supplierCode ||
                        "",

                    SupplierName:
                        supplier.SupplierName ||
                        supplier.supplierName ||
                        "",

                    ContactPerson:
                        supplier.ContactPerson ||
                        supplier.contactPerson ||
                        "",

                    Phone:
                        supplier.Phone ||
                        supplier.phone ||
                        "",

                    Email:
                        supplier.Email ||
                        supplier.email ||
                        "",

                    GSTNo:
                        supplier.GSTNo ||
                        supplier.gstNo ||
                        "",

                    Address:
                        supplier.Address ||
                        supplier.address ||
                        "",

                    City:
                        supplier.City ||
                        supplier.city ||
                        "",

                    State:
                        supplier.State ||
                        supplier.state ||
                        "",

                    Pincode:
                        supplier.Pincode ||
                        supplier.pincode ||
                        "",
                });

            }

        } catch (error) {

            console.error(
                "Error loading supplier:",
                error
            );

            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to load supplier."
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
    // SAVE SUPPLIER
    // ---------------------------------------

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.SupplierCode.trim()) {

            alert("Please enter Supplier Code.");

            return;
        }

        if (!form.SupplierName.trim()) {

            alert("Please enter Supplier Name.");

            return;
        }

        try {

            setLoading(true);

            const payload = {
                SupplierCode:
                    form.SupplierCode.trim(),

                SupplierName:
                    form.SupplierName.trim(),

                ContactPerson:
                    form.ContactPerson.trim(),

                Phone:
                    form.Phone.trim(),

                Email:
                    form.Email.trim(),

                GSTNo:
                    form.GSTNo.trim(),

                Address:
                    form.Address.trim(),

                City:
                    form.City.trim(),

                State:
                    form.State.trim(),

                Pincode:
                    form.Pincode.trim(),
            };

            if (isEdit) {

                await axios.put(
                    `${API_URL}/suppliers/${id}`,
                    payload
                );

                alert(
                    "Supplier updated successfully."
                );

            } else {

                await axios.post(
                    `${API_URL}/suppliers`,
                    payload
                );

                alert(
                    "Supplier created successfully."
                );

            }

            navigate("/master/suppliers");

        } catch (error) {

            console.error(
                "Supplier save error:",
                error
            );

            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to save supplier."
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

                        <FaTruck className="me-2" />

                        {isEdit
                            ? "Edit Supplier"
                            : "New Supplier"}

                    </h4>

                    <small className="text-muted">
                        Supplier Master
                    </small>

                </div>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                        navigate("/master/suppliers")
                    }
                >

                    <FaArrowLeft className="me-2" />

                    Back

                </button>

            </div>


            {/* =====================================
                SUPPLIER FORM
            ===================================== */}

            <form onSubmit={handleSubmit}>

                <div className="card shadow-sm">

                    <div className="card-header bg-white fw-bold">
                        Supplier Information
                    </div>

                    <div className="card-body">

                        <div className="row g-3">

                            {/* SUPPLIER CODE */}

                            <div className="col-md-4">

                                <label className="form-label">

                                    Supplier Code{" "}

                                    <span className="text-danger">
                                        *
                                    </span>

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="SupplierCode"
                                    value={form.SupplierCode}
                                    onChange={handleChange}
                                    placeholder="Enter supplier code"
                                    required
                                />

                            </div>


                            {/* SUPPLIER NAME */}

                            <div className="col-md-8">

                                <label className="form-label">

                                    Supplier Name{" "}

                                    <span className="text-danger">
                                        *
                                    </span>

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="SupplierName"
                                    value={form.SupplierName}
                                    onChange={handleChange}
                                    placeholder="Enter supplier name"
                                    required
                                />

                            </div>


                            {/* CONTACT PERSON */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    Contact Person
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="ContactPerson"
                                    value={form.ContactPerson}
                                    onChange={handleChange}
                                    placeholder="Contact person"
                                />

                            </div>


                            {/* PHONE */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    Phone
                                </label>

                                <input
                                    type="tel"
                                    className="form-control"
                                    name="Phone"
                                    value={form.Phone}
                                    onChange={handleChange}
                                    placeholder="Phone number"
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    className="form-control"
                                    name="Email"
                                    value={form.Email}
                                    onChange={handleChange}
                                    placeholder="Email address"
                                />

                            </div>


                            {/* GST NUMBER */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    GST No
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="GSTNo"
                                    value={form.GSTNo}
                                    onChange={handleChange}
                                    placeholder="GST number"
                                />

                            </div>


                            {/* CITY */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    City
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="City"
                                    value={form.City}
                                    onChange={handleChange}
                                    placeholder="City"
                                />

                            </div>


                            {/* STATE */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    State
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="State"
                                    value={form.State}
                                    onChange={handleChange}
                                    placeholder="State"
                                />

                            </div>


                            {/* PINCODE */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    Pincode
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="Pincode"
                                    value={form.Pincode}
                                    onChange={handleChange}
                                    placeholder="Pincode"
                                />

                            </div>


                            {/* ADDRESS */}

                            <div className="col-md-8">

                                <label className="form-label">
                                    Address
                                </label>

                                <textarea
                                    className="form-control"
                                    name="Address"
                                    value={form.Address}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Complete supplier address"
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
                            navigate("/master/suppliers")
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
                                ? "Update Supplier"
                                : "Save Supplier"}

                    </button>

                </div>

            </form>

        </div>
    );
}