import React, { useState } from "react";
import { FaSyncAlt, FaBars, FaCog, FaFilter, FaPlus, FaSearch } from "react-icons/fa";
import "../../styles/conversionGRN.css";

const DEBIT_NOTE_ROWS = [
    { id: 1, docNo: "DNA/9B/2627/001", date: "15-10-2026", party: "Fabrics Direct Ltd", refDoc: "PINV-8821", amount: "₹ 45,200.00", status: "Approved", remarks: "Shortage in fabric delivery" },
    { id: 2, docNo: "DNA/9B/2627/002", date: "18-10-2026", party: "Apex Trim & Accessories", refDoc: "PINV-8890", amount: "₹ 12,850.00", status: "Pending", remarks: "Rate difference on zippers" },
    { id: 3, docNo: "DNA/9B/2627/003", date: "21-10-2026", party: "V-Tex Dyeing Mills", refDoc: "PINV-8942", amount: "₹ 34,100.00", status: "Approved", remarks: "Quality rejection batch #4" },
    { id: 4, docNo: "DNA/9B/2627/004", date: "22-10-2026", party: "Global Threads Corp", refDoc: "PINV-9011", amount: "₹ 8,400.00", status: "Draft", remarks: "Damaged spool count adjustment" }
];

const PROFORMA_INVOICE_ROWS = [
    { id: 1, docNo: "PI/9B/2627/001", date: "10-10-2026", party: "Zara Retail Apparel (Spain)", refDoc: "PO-ZRA-2026-90", amount: "$ 48,500.00", status: "Confirmed", remarks: "SS27 Men's Casual Shirts (5,000 pcs)" },
    { id: 2, docNo: "PI/9B/2627/002", date: "14-10-2026", party: "H&M Sourcing Hub (Sweden)", refDoc: "PO-HM-8841-A", amount: "$ 82,300.00", status: "Confirmed", remarks: "Ladies Denim Collection (8,500 pcs)" },
    { id: 3, docNo: "PI/9B/2627/003", date: "19-10-2026", party: "Marks & Spencer PLC (UK)", refDoc: "PO-MS-7712", amount: "£ 35,400.00", status: "Pending Approval", remarks: "Kids Cotton Polos (4,200 pcs)" },
    { id: 4, docNo: "PI/9B/2627/004", date: "22-10-2026", party: "Next Retail Ltd (UK)", refDoc: "PO-NXT-4091", amount: "£ 21,900.00", status: "Draft", remarks: "Winter Knitwear Sample Order" }
];

export default function FMModulePage({ title, moduleCategory }) {
    const isDebitNote = (title || "").toLowerCase().includes("debit");
    const [rows, setRows] = useState(isDebitNote ? DEBIT_NOTE_ROWS : PROFORMA_INVOICE_ROWS);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filteredRows = rows.filter(row => {
        const matchesSearch = !searchTerm ||
            row.docNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.refDoc.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || row.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="cgrn-page">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div>
                    <span style={{ fontSize: "11.5px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        FM &bull; {moduleCategory || (isDebitNote ? "FINANCE" : "EXPORTS")}
                    </span>
                    <h1 className="cgrn-page-title" style={{ margin: "2px 0 0 0" }}>{title}</h1>
                </div>

                <div className="cgrn-right-actions">
                    <button type="button" className="cgrn-btn-new">
                        <FaPlus style={{ fontSize: "11px" }} />
                        <span>New {title}</span>
                    </button>
                </div>
            </div>

            {/* Top Toolbar */}
            <div className="cgrn-toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="cgrn-toolbar-left" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button type="button" className="cgrn-icon-btn" title="Reload" onClick={() => setRows(isDebitNote ? DEBIT_NOTE_ROWS : PROFORMA_INVOICE_ROWS)}>
                        <FaSyncAlt />
                    </button>
                    <button type="button" className="cgrn-icon-btn" title="Density">
                        <FaBars />
                    </button>
                    <button type="button" className="cgrn-icon-btn" title="Settings">
                        <FaCog />
                    </button>

                    <div style={{ display: "flex", alignItems: "center", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "4px", padding: "3px 8px", marginLeft: "6px" }}>
                        <FaSearch style={{ color: "#94a3b8", fontSize: "12px", marginRight: "6px" }} />
                        <input
                            type="text"
                            placeholder="Search document, party..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: "none", outline: "none", fontSize: "12px", width: "180px" }}
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ fontSize: "12px", padding: "4px 8px", border: "1px solid #cbd5e1", borderRadius: "4px", background: "#ffffff", outline: "none" }}
                    >
                        <option value="All">All Status</option>
                        <option value="Approved">Approved</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Pending Approval">Pending Approval</option>
                        <option value="Draft">Draft</option>
                    </select>
                </div>
                <div>
                    <span className="cgrn-page-badge">{filteredRows.length} Records</span>
                </div>
            </div>

            {/* Table */}
            <div className="cgrn-table-container">
                <table className="cgrn-table">
                    <thead>
                        <tr>
                            <th style={{ width: "80px", textAlign: "center" }}>Action</th>
                            <th>{isDebitNote ? "Advice No" : "PI No"}</th>
                            <th>Date</th>
                            <th>{isDebitNote ? "Party / Supplier" : "Buyer / Customer"}</th>
                            <th>{isDebitNote ? "Against Bill No" : "Order Ref No"}</th>
                            <th>{isDebitNote ? "Debit Amount" : "Total Value"}</th>
                            <th>Status</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRows.map(row => (
                            <tr key={row.id}>
                                <td style={{ textAlign: "center" }}>
                                    <button type="button" className="cgrn-action-btn">
                                        Action
                                    </button>
                                </td>
                                <td style={{ fontWeight: 600, color: "#1a5695" }}>{row.docNo}</td>
                                <td>{row.date}</td>
                                <td style={{ fontWeight: 500 }}>{row.party}</td>
                                <td style={{ color: "#475569" }}>{row.refDoc}</td>
                                <td style={{ fontWeight: 600, color: "#0f766e" }}>{row.amount}</td>
                                <td>
                                    <span className={`cgrn-status-badge ${
                                        row.status === "Approved" || row.status === "Confirmed"
                                            ? "cgrn-status-completed"
                                            : row.status.includes("Pending")
                                            ? "cgrn-status-approved"
                                            : "cgrn-status-draft"
                                    }`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td style={{ color: "#64748b" }}>{row.remarks}</td>
                            </tr>
                        ))}
                        {filteredRows.length === 0 && (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center", padding: "24px", color: "#94a3b8" }}>
                                    No records found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
