import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FaPlus,
    FaSyncAlt,
    FaFilter,
    FaCaretDown,
    FaEye,
    FaSave,
    FaTrash,
    FaEdit,
    FaPaperPlane,
    FaTimes,
    FaCheckCircle
} from "react-icons/fa";
import "../../../styles/configureAutoEmails.css";

const FUNCTIONALITY_OPTIONS = [
    "T&A Task Due Alert",
    "SO Amendment Approval",
    "PO Approval Alert",
    "Sales Order Alert",
    "Material Issue Alert",
    "Subcontract Order / DC Alert",
    "Subcontract Due Alert",
    "QC Inspection Rejection Alert",
    "Daily Production Target Alert",
    "Finished Goods Transfer Alert",
    "Low Stock Alert",
    "Customer Outstanding Alert"
];

const INITIAL_RECORDS = [
    {
        id: 1,
        functionality: "T&A Task Due Alert",
        emails: ["alerts-tna@vconnectfashion.com"],
        alertTime: "09:30"
    },
    {
        id: 2,
        functionality: "SO Amendment Approval",
        emails: ["sales-approvals@vconnectfashion.com"],
        alertTime: ""
    },
    {
        id: 3,
        functionality: "PO Approval Alert",
        emails: ["purchase-manager@vconnectfashion.com"],
        alertTime: "10:00"
    },
    {
        id: 4,
        functionality: "QC Inspection Rejection Alert",
        emails: ["quality-head@vconnectfashion.com"],
        alertTime: "17:30"
    }
];

export default function ConfigureAutoEmails({ initialMode = "list" }) {
    const location = useLocation();
    const navigate = useNavigate();

    // Check if URL ends with /new or has ?mode=n
    const isNewRoute =
        initialMode === "form" ||
        (location && (location.pathname.endsWith("/new") || location.search.includes("mode=n")));

    const [viewMode, setViewMode] = useState(isNewRoute ? "form" : "list");
    const [records, setRecords] = useState(INITIAL_RECORDS);

    // Filters in List View
    const [filterFunctionality, setFilterFunctionality] = useState("");
    const [filterEmail, setFilterEmail] = useState("");
    const [appliedFilterFunctionality, setAppliedFilterFunctionality] = useState("");
    const [appliedFilterEmail, setAppliedFilterEmail] = useState("");

    // Active Action Menu Dropdown (by Record ID)
    const [openActionId, setOpenActionId] = useState(null);

    // Form View States
    const [editingId, setEditingId] = useState(null);
    const [formFunctionality, setFormFunctionality] = useState("--Select--");
    const [formEmailInput, setFormEmailInput] = useState("");
    const [formEmailsList, setFormEmailsList] = useState([]);
    const [formAlertTime, setFormAlertTime] = useState("");

    // Notification toast
    const [toastMessage, setToastMessage] = useState("");

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3500);
    };

    // Synchronize mode from URL
    useEffect(() => {
        if (
            location &&
            (location.pathname.endsWith("/new") || location.search.includes("mode=n") || initialMode === "form")
        ) {
            setViewMode("form");
        }
    }, [location, initialMode]);

    // Close action menu on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".cae-action-btn-wrapper")) {
                setOpenActionId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter actions
    const handleApplyFilter = () => {
        setAppliedFilterFunctionality(filterFunctionality.trim().toLowerCase());
        setAppliedFilterEmail(filterEmail.trim().toLowerCase());
    };

    const handleResetFilter = () => {
        setFilterFunctionality("");
        setFilterEmail("");
        setAppliedFilterFunctionality("");
        setAppliedFilterEmail("");
    };

    const filteredRecords = records.filter((rec) => {
        const matchFunc = !appliedFilterFunctionality || rec.functionality.toLowerCase().includes(appliedFilterFunctionality);
        const matchEmail =
            !appliedFilterEmail ||
            rec.emails.some((em) => em.toLowerCase().includes(appliedFilterEmail)) ||
            (rec.emails.join(", ").toLowerCase().includes(appliedFilterEmail));
        return matchFunc && matchEmail;
    });

    // Handle Open New Form
    const handleOpenNew = () => {
        setEditingId(null);
        setFormFunctionality("--Select--");
        setFormEmailInput("");
        setFormEmailsList([]);
        setFormAlertTime("");
        setViewMode("form");
    };

    // Handle Edit Record
    const handleEditRecord = (rec) => {
        setEditingId(rec.id);
        setFormFunctionality(rec.functionality);
        setFormEmailInput("");
        setFormEmailsList(rec.emails || []);
        setFormAlertTime(rec.alertTime || "");
        setOpenActionId(null);
        setViewMode("form");
    };

    // Handle Delete Record
    const handleDeleteRecord = (id) => {
        setRecords((prev) => prev.filter((r) => r.id !== id));
        setOpenActionId(null);
        showToast("Record deleted successfully");
    };

    // Add email to chip list
    const handleAddEmail = () => {
        const clean = formEmailInput.trim().replace(/,/g, "");
        if (clean && !formEmailsList.includes(clean)) {
            setFormEmailsList([...formEmailsList, clean]);
            setFormEmailInput("");
        }
    };

    const handleEmailKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            handleAddEmail();
        }
    };

    const handleRemoveEmail = (index) => {
        setFormEmailsList(formEmailsList.filter((_, i) => i !== index));
    };

    // Save Form
    const handleSave = () => {
        if (!formFunctionality || formFunctionality === "--Select--") {
            alert("Please select a Functionality");
            return;
        }

        // Include any unsaved input in email list
        let finalEmails = [...formEmailsList];
        if (formEmailInput.trim() && !finalEmails.includes(formEmailInput.trim())) {
            finalEmails.push(formEmailInput.trim());
        }

        if (editingId) {
            // Update existing
            setRecords((prev) =>
                prev.map((rec) =>
                    rec.id === editingId
                        ? {
                              ...rec,
                              functionality: formFunctionality,
                              emails: finalEmails,
                              alertTime: formAlertTime
                          }
                        : rec
                )
            );
            showToast("Configuration updated successfully!");
        } else {
            // Create new
            const newRecord = {
                id: Date.now(),
                functionality: formFunctionality,
                emails: finalEmails,
                alertTime: formAlertTime || "09:30"
            };
            setRecords((prev) => [newRecord, ...prev]);
            showToast("e-Mail ID configuration saved successfully!");
        }

        setViewMode("list");
    };

    return (
        <div className="cae-page">
            <div className="cae-breadcrumb">ADMIN &bull; SYSTEM</div>
            <h1 className="cae-title">Configure e-Mail IDs to send Auto e-Mails</h1>

            {viewMode === "list" ? (
                /* ==========================================================
                   LIST VIEW (Matching Screenshot 1)
                   ========================================================== */
                <div>
                    {/* Top Filter and New Button Row */}
                    <div className="cae-filter-bar">
                        <div className="cae-filter-controls">
                            <div className="cae-filter-field">
                                <label className="cae-filter-label">Functionality</label>
                                <input
                                    type="text"
                                    className="cae-filter-input"
                                    placeholder="Enter Functionality"
                                    value={filterFunctionality}
                                    onChange={(e) => setFilterFunctionality(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleApplyFilter()}
                                />
                            </div>

                            <div className="cae-filter-field">
                                <label className="cae-filter-label">e-Mail</label>
                                <input
                                    type="text"
                                    className="cae-filter-input"
                                    placeholder="Enter e-Mail"
                                    value={filterEmail}
                                    onChange={(e) => setFilterEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleApplyFilter()}
                                />
                            </div>

                            <button
                                type="button"
                                className="cae-btn-refresh"
                                title="Reset / Refresh"
                                onClick={handleResetFilter}
                            >
                                <FaSyncAlt />
                            </button>

                            <button
                                type="button"
                                className="cae-btn-filter"
                                onClick={handleApplyFilter}
                            >
                                <FaFilter style={{ fontSize: "11px" }} />
                                <span>Filter</span>
                            </button>
                        </div>

                        <button
                            type="button"
                            className="cae-btn-new"
                            onClick={handleOpenNew}
                        >
                            <FaPlus style={{ fontSize: "11px" }} />
                            <span>New Configure e-Mail IDs</span>
                        </button>
                    </div>

                    {/* Pagination on top right */}
                    <div className="cae-pagination-bar">
                        <span className="cae-page-num">1</span>
                    </div>

                    {/* Main Table Matching Screenshot 1 */}
                    <div className="cae-table-container">
                        <table className="cae-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "110px", textAlign: "center" }}>Action</th>
                                    <th style={{ width: "38%" }}>Functionality</th>
                                    <th style={{ width: "36%" }}>e-Mail</th>
                                    <th style={{ width: "16%" }}>Alert Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecords.map((rec) => (
                                    <tr key={rec.id}>
                                        <td style={{ textAlign: "center" }}>
                                            <div className="cae-action-btn-wrapper">
                                                <button
                                                    type="button"
                                                    className="cae-action-btn"
                                                    onClick={() =>
                                                        setOpenActionId(openActionId === rec.id ? null : rec.id)
                                                    }
                                                >
                                                    <span>Action</span>
                                                    <FaCaretDown style={{ fontSize: "10px", color: "#666" }} />
                                                </button>

                                                {openActionId === rec.id && (
                                                    <div className="cae-action-menu">
                                                        <div
                                                            className="cae-action-item"
                                                            onClick={() => handleEditRecord(rec)}
                                                        >
                                                            <FaEdit size={11} color="#2563eb" />
                                                            <span>Edit</span>
                                                        </div>
                                                        <div
                                                            className="cae-action-item"
                                                            onClick={() => {
                                                                setOpenActionId(null);
                                                                showToast(`Test alert queued for ${rec.functionality}`);
                                                            }}
                                                        >
                                                            <FaPaperPlane size={11} color="#059669" />
                                                            <span>Test Alert</span>
                                                        </div>
                                                        <div
                                                            className="cae-action-item delete"
                                                            onClick={() => handleDeleteRecord(rec.id)}
                                                        >
                                                            <FaTrash size={11} />
                                                            <span>Delete</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{rec.functionality}</td>
                                        <td>
                                            {rec.emails && rec.emails.length > 0
                                                ? rec.emails.join(", ")
                                                : ""}
                                        </td>
                                        <td>{rec.alertTime || ""}</td>
                                    </tr>
                                ))}

                                {/* Placeholder rows to match the screenshot grid appearance */}
                                {Array.from({ length: Math.max(0, 10 - filteredRecords.length) }).map(
                                    (_, idx) => (
                                        <tr key={`empty-${idx}`} className="cae-empty-row">
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* ==========================================================
                   FORM VIEW (Matching Screenshot 2)
                   ========================================================== */
                <div className="cae-form-container">
                    {/* Functionality Dropdown */}
                    <div className="cae-form-group">
                        <label className="cae-form-label">Functionality</label>
                        <select
                            className="cae-form-select"
                            value={formFunctionality}
                            onChange={(e) => setFormFunctionality(e.target.value)}
                        >
                            <option value="--Select--">--Select--</option>
                            {FUNCTIONALITY_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* e-Mail IDs Input */}
                    <div className="cae-form-group">
                        <label className="cae-form-label">e-Mail IDs</label>
                        <input
                            type="text"
                            className="cae-form-input"
                            placeholder="Type e-Mail and press Enter"
                            value={formEmailInput}
                            onChange={(e) => setFormEmailInput(e.target.value)}
                            onKeyDown={handleEmailKeyDown}
                            onBlur={handleAddEmail}
                        />

                        {/* Chips list */}
                        {formEmailsList.length > 0 && (
                            <div className="cae-email-chips">
                                {formEmailsList.map((em, idx) => (
                                    <span key={idx} className="cae-email-chip">
                                        <span>{em}</span>
                                        <span
                                            className="cae-chip-remove"
                                            onClick={() => handleRemoveEmail(idx)}
                                            title="Remove"
                                        >
                                            &times;
                                        </span>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Alert Time (Optional) */}
                    <div className="cae-form-group">
                        <label className="cae-form-label">Alert Time (Optional)</label>
                        <input
                            type="time"
                            className="cae-form-input"
                            value={formAlertTime}
                            onChange={(e) => setFormAlertTime(e.target.value)}
                            style={{ maxWidth: "200px" }}
                        />
                    </div>

                    {/* Bottom Buttons Matching Screenshot 2: View and Save */}
                    <div className="cae-form-actions">
                        <button
                            type="button"
                            className="cae-btn-view"
                            onClick={() => setViewMode("list")}
                        >
                            <FaEye size={12} />
                            <span>View</span>
                        </button>

                        <button
                            type="button"
                            className="cae-btn-save"
                            onClick={handleSave}
                        >
                            <FaSave size={12} />
                            <span>Save</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Notification Toast */}
            {toastMessage && (
                <div className="cae-toast">
                    <FaCheckCircle color="#4ade80" />
                    <span>{toastMessage}</span>
                </div>
            )}
        </div>
    );
}
