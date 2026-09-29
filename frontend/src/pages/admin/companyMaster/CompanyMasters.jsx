import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function CompanyMasters() {

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadCompanies = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${process.env.REACT_APP_API_URL || "/api"}/companies`
            );

            setCompanies(
                response.data.data ||
                response.data ||
                []
            );

        } catch (error) {
            console.error("Error loading companies:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCompanies();
    }, []);

    return (
        <div className="container-fluid p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h3 className="fw-bold mb-1">
                        Company Master
                    </h3>

                    <small className="text-muted">
                        Manage company information
                    </small>
                </div>

                <Link
                    to="/admin/company-master/new"
                    className="btn btn-primary"
                >
                    + Add Company
                </Link>

            </div>

            <div className="card shadow-sm">

                <div className="card-header">
                    <h5 className="mb-0">
                        Company Register
                    </h5>
                </div>

                <div className="card-body p-0">

                    {loading ? (

                        <div className="text-center p-4">
                            Loading...
                        </div>

                    ) : companies.length === 0 ? (

                        <div className="text-center text-muted p-4">
                            No companies found.
                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-bordered table-hover mb-0">

                                <thead className="table-light">

                                    <tr>
                                        <th>#</th>
                                        <th>Company Code</th>
                                        <th>Company Name</th>
                                        <th>City</th>
                                        <th>State</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {companies.map((company, index) => (

                                        <tr key={
                                            company.CompanyID ||
                                            company.id ||
                                            index
                                        }>

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>
                                                {company.CompanyCode ||
                                                    company.companyCode ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {company.CompanyName ||
                                                    company.companyName ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {company.City ||
                                                    company.city ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {company.State ||
                                                    company.state ||
                                                    "-"}
                                            </td>

                                            <td>
                                                <span className="badge bg-success">
                                                    {company.Status ||
                                                        company.status ||
                                                        "Active"}
                                                </span>
                                            </td>

                                            <td>

                                                <Link
                                                    to={`/admin/company-master/view/${
                                                        company.CompanyID ||
                                                        company.id
                                                    }`}
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                >
                                                    View
                                                </Link>

                                                <Link
                                                    to={`/admin/company-master/edit/${
                                                        company.CompanyID ||
                                                        company.id
                                                    }`}
                                                    className="btn btn-sm btn-outline-secondary"
                                                >
                                                    Edit
                                                </Link>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}