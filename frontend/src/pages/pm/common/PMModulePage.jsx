import React from "react";
import { FaSyncAlt, FaBars, FaCog, FaFilter, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../../styles/conversionGRN.css";
import SubcontractOrder from "../subcontract/SubcontractOrder";
import SubcontractGRN from "../subcontract/SubcontractGRN";
import SubcontractConversionDC from "../subcontract/SubcontractConversionDC";

export default function PMModulePage({ title, category, sampleRows = [] }) {
    const navigate = useNavigate();

    if (title && title.toLowerCase().includes("subcontract order")) {
        return <SubcontractOrder />;
    }
    if (title && (title.toLowerCase().includes("subcontract grn") || title.toLowerCase() === "subcontract grn")) {
        return <SubcontractGRN />;
    }
    if (title && title.toLowerCase().includes("conversion dc")) {
        return <SubcontractConversionDC />;
    }

    const defaultRows = sampleRows.length > 0 ? sampleRows : [
        { id: 1, docNo: `${title.substring(0, 3).toUpperCase()}/9B/2627/001`, date: "12-10-2026", status: "Active", qty: "120 PCS", remarks: "Standard production batch" },
        { id: 2, docNo: `${title.substring(0, 3).toUpperCase()}/9B/2627/002`, date: "10-10-2026", status: "Completed", qty: "350 PCS", remarks: "Verified by QC line 2" },
        { id: 3, docNo: `${title.substring(0, 3).toUpperCase()}/9B/2627/003`, date: "08-10-2026", status: "Pending", qty: "85 PCS", remarks: "Scheduled for next shift" }
    ];

    const handleNewClick = () => {
        if (title.toLowerCase().includes("subcontract order")) {
            navigate("/pm/subcontract-order-dc/new");
        } else if (title.toLowerCase().includes("subcontract grn")) {
            navigate("/pm/subcontract-grn/new");
        } else if (title.toLowerCase().includes("conversion dc")) {
            navigate("/pm/subcontract-material-conversion-dc/new");
        }
    };

    return (
        <div className="cgrn-page">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div>
                    <span style={{ fontSize: "11.5px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        PM &bull; {category || "Production Management"}
                    </span>
                    <h1 className="cgrn-page-title" style={{ margin: "2px 0 0 0" }}>{title}</h1>
                </div>

                <div className="cgrn-right-actions">
                    <button type="button" className="cgrn-btn-new" onClick={handleNewClick}>
                        <FaPlus style={{ fontSize: "11px" }} />
                        <span>New {title}</span>
                    </button>
                </div>
            </div>

            {/* Top Toolbar */}
            <div className="cgrn-toolbar">
                <div className="cgrn-toolbar-left">
                    <button type="button" className="cgrn-icon-btn" title="Reload">
                        <FaSyncAlt />
                    </button>
                    <button type="button" className="cgrn-icon-btn" title="Toggle Density">
                        <FaBars />
                    </button>
                    <button type="button" className="cgrn-icon-btn" title="Settings">
                        <FaCog />
                    </button>
                    <button type="button" className="cgrn-filter-btn">
                        <FaFilter style={{ fontSize: "11px" }} />
                        <span>Filter</span>
                    </button>
                </div>
                <div>
                    <span className="cgrn-page-badge">1</span>
                </div>
            </div>

            {/* Table */}
            <div className="cgrn-table-container">
                <table className="cgrn-table">
                    <thead>
                        <tr>
                            <th style={{ width: "80px", textAlign: "center" }}>Action</th>
                            <th>Document No</th>
                            <th>Date</th>
                            <th>Category / Unit</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {defaultRows.map(row => (
                            <tr key={row.id}>
                                <td style={{ textAlign: "center" }}>
                                    <button type="button" className="cgrn-action-btn">
                                        Action
                                    </button>
                                </td>
                                <td style={{ fontWeight: 600, color: "#1a5695" }}>{row.docNo}</td>
                                <td>{row.date}</td>
                                <td>Plot No. 9B</td>
                                <td style={{ fontWeight: 600 }}>{row.qty}</td>
                                <td>
                                    <span className={`cgrn-status-badge ${row.status === "Completed" ? "cgrn-status-completed" : "cgrn-status-approved"}`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td style={{ color: "#64748b" }}>{row.remarks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
