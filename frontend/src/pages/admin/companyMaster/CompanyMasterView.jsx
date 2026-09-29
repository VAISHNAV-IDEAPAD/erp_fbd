import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function CompanyMasterView() {

    const { id } = useParams();

    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadCompany = async () => {

            try {

                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL || "/api"}/companies/${id}`
                );

                setCompany(
                    response.data.data ||
                    response.data
                );

            } catch (error) {

                console.error(
                    "Error loading company:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        loadCompany();

    }, [id]);

    if (loading) {

        return (
            <div className="container-fluid p-4">
                <div className="text-center p-5">
                    Loading...
                </div>
            </div>
        );

    }

    if (!company) {

        return (
            <div className="container-fluid p-4">

                <div className="alert alert-warning">
                    Company not found.
                </div>

                <Link
                    to="/admin/company-master"
                    className="btn btn-primary"
                >
                    Back to Company Master
                </Link>

            </div>
        );

    }

    return (

        <div className="container-fluid p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h3 className="fw-bold mb-1">
                        Company Details
                    </h3>

                    <small className="text-muted">
                        View company information
                    </small>

                </div>

                <Link
                    to="/admin/company-master"
                    className="btn btn-outline-secondary"
                >
                    Back
                </Link>

            </div>

            <div className="card shadow-sm">

                <div className="card-header bg-primary text-white">

                    <h5 className="mb-0">
                        {company.CompanyName ||
                            company.companyName ||
                            "Company"}
                    </h5>

                </div>

                <div className="card-body">

                    <div className="row g-3">

                        <div className="col-md-4">
                            <strong>Company Code</strong>
                            <div>
                                {company.CompanyCode ||
                                    company.companyCode ||
                                    "-"}
                            </div>
                        </div>

                        <div className="col-md-8">
                            <strong>Company Name</strong>
                            <div>
                                {company.CompanyName ||
                                    company.companyName ||
                                    "-"}
                            </div>
                        </div>

                        <div className="col-md-12">
                            <strong>Address</strong>
                            <div>
                                {company.Address ||
                                    company.address ||
                                    "-"}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <strong>City</strong>
                            <div>
                                {company.City ||
                                    company.city ||
                                    "-"}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <strong>State</strong>
                            <div>
                                {company.State ||
                                    company.state ||
                                    "-"}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <strong>Pincode</strong>
                            <div>
                                {company.Pincode ||
                                    company.pincode ||
                                    "-"}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <strong>GST No.</strong>
                            <div>
                                {company.GSTNo ||
                                    company.gstNo ||
                                    "-"}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <strong>Phone</strong>
                            <div>
                                {company.Phone ||
                                    company.phone ||
                                    "-"}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <strong>Email</strong>
                            <div>
                                {company.Email ||
                                    company.email ||
                                    "-"}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <strong>Status</strong>
                            <div>
                                <span className="badge bg-success">
                                    {company.Status ||
                                        company.status ||
                                        "Active"}
                                </span>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}