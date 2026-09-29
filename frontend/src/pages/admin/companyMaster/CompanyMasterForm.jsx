import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CompanyMasterForm() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        companyCode: "",
        companyName: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        gstNo: "",
        phone: "",
        email: "",
        status: "Active"
    });

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.companyCode || !form.companyName) {
            alert("Company Code and Company Name are required.");
            return;
        }

        try {

            await axios.post(
                `${process.env.REACT_APP_API_URL || "/api"}/companies`,
                form
            );

            alert("Company saved successfully.");

            navigate("/admin/company-master");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to save company."
            );

        }

    };

    const handleReset = () => {

        setForm({
            companyCode: "",
            companyName: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            gstNo: "",
            phone: "",
            email: "",
            status: "Active"
        });

    };

    return (

        <div className="container-fluid p-4">

            <div className="mb-4">

                <h3 className="fw-bold mb-1">
                    Add Company
                </h3>

                <small className="text-muted">
                    Create a new company
                </small>

            </div>

            <div className="card shadow-sm">

                <div className="card-header bg-primary text-white">

                    <h5 className="mb-0">
                        Company Details
                    </h5>

                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="row g-3">

                            <div className="col-md-3">

                                <label className="form-label">
                                    Company Code *
                                </label>

                                <input
                                    type="text"
                                    name="companyCode"
                                    className="form-control"
                                    value={form.companyCode}
                                    onChange={handleChange}
                                    placeholder="9B"
                                    required
                                />

                            </div>

                            <div className="col-md-5">

                                <label className="form-label">
                                    Company Name *
                                </label>

                                <input
                                    type="text"
                                    name="companyName"
                                    className="form-control"
                                    value={form.companyName}
                                    onChange={handleChange}
                                    placeholder="Company 9B"
                                    required
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    GST No.
                                </label>

                                <input
                                    type="text"
                                    name="gstNo"
                                    className="form-control"
                                    value={form.gstNo}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-12">

                                <label className="form-label">
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    className="form-control"
                                    rows="2"
                                    value={form.address}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    className="form-control"
                                    value={form.city}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    State
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    className="form-control"
                                    value={form.state}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    Pincode
                                </label>

                                <input
                                    type="text"
                                    name="pincode"
                                    className="form-control"
                                    value={form.pincode}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    className="form-control"
                                    value={form.phone}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-5">

                                <label className="form-label">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={form.email}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-3">

                                <label className="form-label">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    className="form-select"
                                    value={form.status}
                                    onChange={handleChange}
                                >
                                    <option value="Active">
                                        Active
                                    </option>

                                    <option value="Inactive">
                                        Inactive
                                    </option>
                                </select>

                            </div>

                        </div>

                        <div className="mt-4">

                            <button
                                type="submit"
                                className="btn btn-primary me-2"
                            >
                                Save Company
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary me-2"
                                onClick={handleReset}
                            >
                                Reset
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-dark"
                                onClick={() =>
                                    navigate("/admin/company-master")
                                }
                            >
                                Back
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}