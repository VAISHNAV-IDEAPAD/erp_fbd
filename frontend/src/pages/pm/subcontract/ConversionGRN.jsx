import React, { useState, useEffect, useMemo, useRef } from "react";
import {
    FaPlus,
    FaSyncAlt,
    FaBars,
    FaCog,
    FaFilter,
    FaCaretDown,
    FaEye,
    FaEdit,
    FaTrash,
    FaPrint,
    FaTimes,
    FaCheck
} from "react-icons/fa";
import {
    getConversionGRNs,
    createConversionGRN,
    updateConversionGRN,
    deleteConversionGRN,
    INITIAL_CONVERSION_GRNS
} from "../../../services/conversionGRNService";
import "../../../styles/conversionGRN.css";

export default function ConversionGRN() {
    const [records, setRecords] = useState(INITIAL_CONVERSION_GRNS);
    const [loading, setLoading] = useState(false);
    const [searchSupplier, setSearchSupplier] = useState("");
    const [selectedRowId, setSelectedRowId] = useState(1);
    const [openActionId, setOpenActionId] = useState(null);
    const [showFilterBar, setShowFilterBar] = useState(false);
    const [viewDensity, setViewDensity] = useState("normal");

    // Filters
    const [filterSubcontractor, setFilterSubcontractor] = useState("All");
    const [filterStore, setFilterStore] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");

    // Modals
    const [showNewModal, setShowNewModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [activeRecord, setActiveRecord] = useState(null);

    // Form state for New Conversion GRN
    const [formData, setFormData] = useState({
        JSTCNo: `JSTC/30/2627/${Math.floor(10 + Math.random() * 90)}`,
        Subcontractor: "Apex Garment Processors",
        SubcontractOrderNo: "SCO/30/2627/45",
        ConversionDate: new Date().toISOString().split("T")[0],
        Store: "RAW MATERIAL STORE 30",
        Currency: "INR",
        ExchangeRate: 1.0,
        Remarks: "",
        items: [
            {
                FromItemCode: "FAB-1001",
                FromItemName: "CANVAS CLOTH 278 GSM 10 OZ GREIGE",
                FromColor: "GREIGE",
                FromUOM: "MTR",
                FromQty: 100.0,
                ToItemCode: "FAB-1004",
                ToItemName: "WASHED CANVAS CLOTH 10 OZ",
                ToColor: "VINTAGE WASH",
                ToUOM: "MTR",
                ToQty: 98.5,
                ProcessName: "Enzyme Wash & Softening",
                Remarks: "Subcontract lot"
            }
        ]
    });

    const actionMenuRef = useRef(null);

    // Available choices
    const SUBCONTRACTORS = [
        "Apex Garment Processors",
        "Quality Leather Works",
        "Vanguard Stitches Ltd",
        "TexCraft Dyeing & Treatment",
        "Rainbow Printers & Dyers"
    ];

    const STORES = [
        "RAW MATERIAL STORE 30",
        "STORE 30",
        "RAW MATERIAL STORE 9B",
        "SEMI FINISH STORE 9B",
        "SEMI FINISH STORE 18",
        "FINISHED GOODS STORE"
    ];

    // Load data
    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getConversionGRNs({
                search: searchSupplier,
                subcontractor: filterSubcontractor,
                store: filterStore,
                status: filterStatus
            });
            setRecords(data);
        } catch {
            setRecords(INITIAL_CONVERSION_GRNS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [searchSupplier, filterSubcontractor, filterStore, filterStatus]);

    // Close action popup on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
                setOpenActionId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filtered data in memory for immediate responsiveness
    const filteredRecords = useMemo(() => {
        return records.filter(item => {
            if (searchSupplier.trim()) {
                const term = searchSupplier.toLowerCase();
                const matchSupplier = item.Subcontractor && item.Subcontractor.toLowerCase().includes(term);
                const matchNo = item.JSTCNo && item.JSTCNo.toLowerCase().includes(term);
                const matchOrder = item.SubcontractOrderNo && item.SubcontractOrderNo.toLowerCase().includes(term);
                if (!matchSupplier && !matchNo && !matchOrder) return false;
            }
            if (filterSubcontractor !== "All" && item.Subcontractor !== filterSubcontractor) return false;
            if (filterStore !== "All" && item.Store !== filterStore) return false;
            if (filterStatus !== "All" && item.Status !== filterStatus) return false;
            return true;
        });
    }, [records, searchSupplier, filterSubcontractor, filterStore, filterStatus]);

    // Handle New Record Save
    const handleSaveNew = async (e) => {
        e.preventDefault();
        const totalQty = formData.items.reduce((acc, curr) => acc + (parseFloat(curr.ToQty) || 0), 0);
        const payload = {
            JSTCNo: formData.JSTCNo,
            Subcontractor: formData.Subcontractor,
            SubcontractOrderNo: formData.SubcontractOrderNo,
            ConversionDate: formData.ConversionDate,
            Store: formData.Store,
            Currency: formData.Currency,
            ExchangeRate: formData.ExchangeRate,
            TotalQty: totalQty,
            RowCount: formData.items.length,
            Status: "Approved",
            Remarks: formData.Remarks,
            details: formData.items
        };

        await createConversionGRN(payload);
        setShowNewModal(false);
        loadData();

        // Reset form
        setFormData({
            JSTCNo: `JSTC/30/2627/${Math.floor(10 + Math.random() * 90)}`,
            Subcontractor: "Apex Garment Processors",
            SubcontractOrderNo: `SCO/30/2627/${Math.floor(10 + Math.random() * 90)}`,
            ConversionDate: new Date().toISOString().split("T")[0],
            Store: "RAW MATERIAL STORE 30",
            Currency: "INR",
            ExchangeRate: 1.0,
            Remarks: "",
            items: [
                {
                    FromItemCode: "FAB-1001",
                    FromItemName: "CANVAS CLOTH 278 GSM 10 OZ GREIGE",
                    FromColor: "GREIGE",
                    FromUOM: "MTR",
                    FromQty: 100.0,
                    ToItemCode: "FAB-1004",
                    ToItemName: "WASHED CANVAS CLOTH 10 OZ",
                    ToColor: "VINTAGE WASH",
                    ToUOM: "MTR",
                    ToQty: 98.5,
                    ProcessName: "Enzyme Wash & Softening",
                    Remarks: "Subcontract lot"
                }
            ]
        });
    };

    // Print Voucher
    const handlePrintVoucher = (record) => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Conversion GRN Voucher - ${record.JSTCNo}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 24px; color: #222; }
                    .header { text-align: center; border-bottom: 2px solid #2172ba; padding-bottom: 12px; margin-bottom: 18px; }
                    .header h2 { margin: 0; color: #1a5695; }
                    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; margin-bottom: 18px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 12px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                    th { background-color: #2172ba; color: #fff; }
                    .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 13px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>TPCS FASHION - SUBCONTRACT MATERIAL CONVERSION GRN</h2>
                    <p style="margin: 4px 0; font-size: 13px;">Plot No. 30 | FY 01-Apr-2026 - 31-Mar-2027</p>
                </div>
                <div class="meta-grid">
                    <div><strong>JSTC No:</strong> ${record.JSTCNo}</div>
                    <div><strong>Date:</strong> ${record.ConversionDate}</div>
                    <div><strong>Subcontractor:</strong> ${record.Subcontractor}</div>
                    <div><strong>Subcontract Order:</strong> ${record.SubcontractOrderNo || "N/A"}</div>
                    <div><strong>Store:</strong> ${record.Store}</div>
                    <div><strong>Status:</strong> ${record.Status}</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>From Item Code</th>
                            <th>From Item Name</th>
                            <th>From Qty</th>
                            <th>To Item Code</th>
                            <th>To Item Name</th>
                            <th>To Qty</th>
                            <th>Process</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(record.details || []).map(d => `
                            <tr>
                                <td>${d.FromItemCode || ""}</td>
                                <td>${d.FromItemName || ""}</td>
                                <td>${d.FromQty || ""} ${d.FromUOM || ""}</td>
                                <td>${d.ToItemCode || ""}</td>
                                <td>${d.ToItemName || ""}</td>
                                <td>${d.ToQty || ""} ${d.ToUOM || ""}</td>
                                <td>${d.ProcessName || ""}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
                <div class="footer">
                    <div>Prepared By: ________________</div>
                    <div>QC Inspector: ________________</div>
                    <div>Authorized Signatory: ________________</div>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 350);
    };

    // Delete
    const handleDelete = async (record) => {
        if (window.confirm(`Are you sure you want to delete Conversion GRN ${record.JSTCNo}?`)) {
            await deleteConversionGRN(record.GRNID);
            loadData();
        }
    };

    return (
        <div className="cgrn-page">
            {/* Page Title matching screenshot */}
            <h1 className="cgrn-page-title">Conversion GRN</h1>

            {/* Top Row: Search by Associate & New Button */}
            <div className="cgrn-top-row">
                <div className="cgrn-search-group">
                    <label className="cgrn-search-label">Associate</label>
                    <input
                        type="text"
                        className="cgrn-search-input"
                        placeholder="Supplier Search..."
                        value={searchSupplier}
                        onChange={(e) => setSearchSupplier(e.target.value)}
                    />
                </div>

                <div className="cgrn-right-actions">
                    <button
                        type="button"
                        className="cgrn-btn-new"
                        onClick={() => setShowNewModal(true)}
                    >
                        <FaPlus style={{ fontSize: "11px" }} />
                        <span>+ New Conversion GRN</span>
                    </button>

                    <button
                        type="button"
                        className="cgrn-btn-bulk"
                        onClick={() => alert("Bulk Action: Select rows using checkboxes to process batch conversions.")}
                    >
                        <span>Bulk Action</span>
                        <FaCaretDown style={{ fontSize: "10px" }} />
                    </button>
                </div>
            </div>

            {/* Action Toolbar */}
            <div className="cgrn-toolbar">
                <div className="cgrn-toolbar-left">
                    <button
                        type="button"
                        className="cgrn-icon-btn"
                        title="Reload"
                        onClick={loadData}
                    >
                        <FaSyncAlt className={loading ? "fa-spin" : ""} />
                    </button>

                    <button
                        type="button"
                        className="cgrn-icon-btn"
                        title="Toggle View Density"
                        onClick={() => setViewDensity(prev => prev === "normal" ? "compact" : "normal")}
                    >
                        <FaBars />
                    </button>

                    <button
                        type="button"
                        className="cgrn-icon-btn"
                        title="Settings"
                        onClick={() => alert("Settings: Column visibility and export configurations.")}
                    >
                        <FaCog />
                    </button>

                    <button
                        type="button"
                        className={`cgrn-filter-btn ${showFilterBar ? "active" : ""}`}
                        onClick={() => setShowFilterBar(!showFilterBar)}
                    >
                        <FaFilter style={{ fontSize: "11px" }} />
                        <span>Filter</span>
                        <FaCaretDown style={{ fontSize: "9px" }} />
                    </button>
                </div>

                <div>
                    <span className="cgrn-page-badge">1</span>
                </div>
            </div>

            {/* Expandable Filter Drawer */}
            {showFilterBar && (
                <div className="cgrn-filter-drawer">
                    <div className="cgrn-filter-group">
                        <label>Subcontractor</label>
                        <select
                            value={filterSubcontractor}
                            onChange={(e) => setFilterSubcontractor(e.target.value)}
                        >
                            <option value="All">All Subcontractors</option>
                            {SUBCONTRACTORS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="cgrn-filter-group">
                        <label>Store</label>
                        <select
                            value={filterStore}
                            onChange={(e) => setFilterStore(e.target.value)}
                        >
                            <option value="All">All Stores</option>
                            {STORES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="cgrn-filter-group">
                        <label>Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending Approval">Pending Approval</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        style={{
                            alignSelf: "flex-end",
                            height: "28px",
                            padding: "0 12px",
                            background: "#2172ba",
                            color: "#fff",
                            border: "none",
                            borderRadius: "3px",
                            fontSize: "12px",
                            cursor: "pointer"
                        }}
                        onClick={() => {
                            setFilterSubcontractor("All");
                            setFilterStore("All");
                            setFilterStatus("All");
                            setSearchSupplier("");
                        }}
                    >
                        Reset
                    </button>
                </div>
            )}

            {/* Conversion GRN Table */}
            <div className="cgrn-table-container">
                <table className="cgrn-table">
                    <thead>
                        <tr>
                            <th style={{ width: "80px", textAlign: "center" }}>Action</th>
                            <th>JSTC No</th>
                            <th>Subcontractor</th>
                            <th>Subcontract Order No</th>
                            <th>Date</th>
                            <th>Store</th>
                            <th style={{ textAlign: "right" }}>Total Qty</th>
                            <th>Status</th>
                            <th style={{ textAlign: "center" }}>No. of rows</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.length === 0 ? (
                            <tr>
                                <td colSpan="9" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                    No Conversion GRN records found.
                                </td>
                            </tr>
                        ) : (
                            filteredRecords.map((item, idx) => {
                                const isSelected = selectedRowId === item.GRNID;
                                const isActionOpen = openActionId === item.GRNID;

                                return (
                                    <tr
                                        key={item.GRNID || idx}
                                        className={isSelected ? "selected" : ""}
                                        onClick={() => setSelectedRowId(item.GRNID)}
                                        style={{ height: viewDensity === "compact" ? "32px" : "40px" }}
                                    >
                                        <td style={{ textAlign: "center", position: "relative" }}>
                                            <button
                                                type="button"
                                                className="cgrn-action-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenActionId(isActionOpen ? null : item.GRNID);
                                                }}
                                            >
                                                <span>Action</span>
                                                <FaCaretDown style={{ fontSize: "9px" }} />
                                            </button>

                                            {isActionOpen && (
                                                <div
                                                    className="cgrn-action-menu"
                                                    ref={actionMenuRef}
                                                    style={{ top: "100%", left: "10px" }}
                                                >
                                                    <div
                                                        className="cgrn-action-menu-item"
                                                        onClick={() => {
                                                            setActiveRecord(item);
                                                            setShowDetailModal(true);
                                                            setOpenActionId(null);
                                                        }}
                                                    >
                                                        <FaEye style={{ color: "#2172ba" }} />
                                                        <span>View Details</span>
                                                    </div>
                                                    <div
                                                        className="cgrn-action-menu-item"
                                                        onClick={() => {
                                                            handlePrintVoucher(item);
                                                            setOpenActionId(null);
                                                        }}
                                                    >
                                                        <FaPrint style={{ color: "#16a34a" }} />
                                                        <span>Print Voucher</span>
                                                    </div>
                                                    <div
                                                        className="cgrn-action-menu-item"
                                                        onClick={() => {
                                                            handleDelete(item);
                                                            setOpenActionId(null);
                                                        }}
                                                    >
                                                        <FaTrash style={{ color: "#dc2626" }} />
                                                        <span>Delete</span>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ fontWeight: 600, color: "#1a5695" }}>
                                            {item.JSTCNo}
                                        </td>
                                        <td>{item.Subcontractor}</td>
                                        <td style={{ color: "#64748b" }}>{item.SubcontractOrderNo || "-"}</td>
                                        <td>{item.ConversionDate}</td>
                                        <td>{item.Store}</td>
                                        <td style={{ textAlign: "right", fontWeight: 600 }}>
                                            {typeof item.TotalQty === "number" ? item.TotalQty.toFixed(1) : item.TotalQty}
                                        </td>
                                        <td>
                                            <span className={`cgrn-status-badge ${
                                                item.Status === "Approved" ? "cgrn-status-approved" :
                                                item.Status === "Pending Approval" ? "cgrn-status-pending" : "cgrn-status-completed"
                                            }`}>
                                                {item.Status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            {item.RowCount || (item.details ? item.details.length : 1)}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal: New Conversion GRN */}
            {showNewModal && (
                <div className="cgrn-modal-overlay">
                    <div className="cgrn-modal-container">
                        <div className="cgrn-modal-header">
                            <h2 className="cgrn-modal-title">+ Create New Conversion GRN</h2>
                            <button
                                type="button"
                                className="cgrn-modal-close"
                                onClick={() => setShowNewModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSaveNew}>
                            <div className="cgrn-modal-body">
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                                    <div>
                                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: "4px" }}>
                                            JSTC No (Conversion GRN No)
                                        </label>
                                        <input
                                            type="text"
                                            style={{ width: "100%", height: "32px", padding: "4px 8px", border: "1px solid #cbd5e1", borderRadius: "3px" }}
                                            value={formData.JSTCNo}
                                            onChange={(e) => setFormData({ ...formData, JSTCNo: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: "4px" }}>
                                            Conversion Date
                                        </label>
                                        <input
                                            type="date"
                                            style={{ width: "100%", height: "32px", padding: "4px 8px", border: "1px solid #cbd5e1", borderRadius: "3px" }}
                                            value={formData.ConversionDate}
                                            onChange={(e) => setFormData({ ...formData, ConversionDate: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: "4px" }}>
                                            Subcontractor
                                        </label>
                                        <select
                                            style={{ width: "100%", height: "32px", padding: "4px 8px", border: "1px solid #cbd5e1", borderRadius: "3px" }}
                                            value={formData.Subcontractor}
                                            onChange={(e) => setFormData({ ...formData, Subcontractor: e.target.value })}
                                        >
                                            {SUBCONTRACTORS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: "4px" }}>
                                            Subcontract Order / DC No
                                        </label>
                                        <input
                                            type="text"
                                            style={{ width: "100%", height: "32px", padding: "4px 8px", border: "1px solid #cbd5e1", borderRadius: "3px" }}
                                            value={formData.SubcontractOrderNo}
                                            onChange={(e) => setFormData({ ...formData, SubcontractOrderNo: e.target.value })}
                                            placeholder="e.g. SCO/30/2627/45"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: "4px" }}>
                                            Store
                                        </label>
                                        <select
                                            style={{ width: "100%", height: "32px", padding: "4px 8px", border: "1px solid #cbd5e1", borderRadius: "3px" }}
                                            value={formData.Store}
                                            onChange={(e) => setFormData({ ...formData, Store: e.target.value })}
                                        >
                                            {STORES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: "4px" }}>
                                            Remarks / Notes
                                        </label>
                                        <input
                                            type="text"
                                            style={{ width: "100%", height: "32px", padding: "4px 8px", border: "1px solid #cbd5e1", borderRadius: "3px" }}
                                            value={formData.Remarks}
                                            onChange={(e) => setFormData({ ...formData, Remarks: e.target.value })}
                                            placeholder="Batch details or conversion notes"
                                        />
                                    </div>
                                </div>

                                {/* Items Section */}
                                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "14px" }}>
                                    <h4 style={{ fontSize: "13px", fontWeight: 600, color: "#1a5695", marginBottom: "8px" }}>
                                        Material Conversion Details
                                    </h4>
                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px" }}>
                                        <thead>
                                            <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                                                <th style={{ padding: "6px", border: "1px solid #cbd5e1" }}>From Item</th>
                                                <th style={{ padding: "6px", border: "1px solid #cbd5e1" }}>From Qty</th>
                                                <th style={{ padding: "6px", border: "1px solid #cbd5e1" }}>To Inward Item</th>
                                                <th style={{ padding: "6px", border: "1px solid #cbd5e1" }}>To Qty</th>
                                                <th style={{ padding: "6px", border: "1px solid #cbd5e1" }}>Process</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>
                                                        <input
                                                            type="text"
                                                            style={{ width: "100%", border: "none", outline: "none", background: "transparent" }}
                                                            value={item.FromItemName}
                                                            onChange={(e) => {
                                                                const updated = [...formData.items];
                                                                updated[idx].FromItemName = e.target.value;
                                                                setFormData({ ...formData, items: updated });
                                                            }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>
                                                        <input
                                                            type="number"
                                                            style={{ width: "80px", border: "none", outline: "none", background: "transparent" }}
                                                            value={item.FromQty}
                                                            onChange={(e) => {
                                                                const updated = [...formData.items];
                                                                updated[idx].FromQty = parseFloat(e.target.value) || 0;
                                                                setFormData({ ...formData, items: updated });
                                                            }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>
                                                        <input
                                                            type="text"
                                                            style={{ width: "100%", border: "none", outline: "none", background: "transparent" }}
                                                            value={item.ToItemName}
                                                            onChange={(e) => {
                                                                const updated = [...formData.items];
                                                                updated[idx].ToItemName = e.target.value;
                                                                setFormData({ ...formData, items: updated });
                                                            }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>
                                                        <input
                                                            type="number"
                                                            style={{ width: "80px", border: "none", outline: "none", background: "transparent" }}
                                                            value={item.ToQty}
                                                            onChange={(e) => {
                                                                const updated = [...formData.items];
                                                                updated[idx].ToQty = parseFloat(e.target.value) || 0;
                                                                setFormData({ ...formData, items: updated });
                                                            }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>
                                                        <input
                                                            type="text"
                                                            style={{ width: "100%", border: "none", outline: "none", background: "transparent" }}
                                                            value={item.ProcessName}
                                                            onChange={(e) => {
                                                                const updated = [...formData.items];
                                                                updated[idx].ProcessName = e.target.value;
                                                                setFormData({ ...formData, items: updated });
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="cgrn-modal-footer">
                                <button
                                    type="button"
                                    style={{ padding: "6px 14px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "3px", cursor: "pointer" }}
                                    onClick={() => setShowNewModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: "6px 16px", background: "#35aa47", color: "#fff", border: "none", borderRadius: "3px", fontWeight: 600, cursor: "pointer" }}
                                >
                                    Save Conversion GRN
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: View Details */}
            {showDetailModal && activeRecord && (
                <div className="cgrn-modal-overlay">
                    <div className="cgrn-modal-container">
                        <div className="cgrn-modal-header">
                            <h2 className="cgrn-modal-title">Conversion GRN Details - {activeRecord.JSTCNo}</h2>
                            <button
                                type="button"
                                className="cgrn-modal-close"
                                onClick={() => setShowDetailModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="cgrn-modal-body">
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px", marginBottom: "16px" }}>
                                <div><strong>JSTC No:</strong> {activeRecord.JSTCNo}</div>
                                <div><strong>Date:</strong> {activeRecord.ConversionDate}</div>
                                <div><strong>Subcontractor:</strong> {activeRecord.Subcontractor}</div>
                                <div><strong>Subcontract Order:</strong> {activeRecord.SubcontractOrderNo || "-"}</div>
                                <div><strong>Store:</strong> {activeRecord.Store}</div>
                                <div><strong>Status:</strong> {activeRecord.Status}</div>
                                <div><strong>Total Qty:</strong> {activeRecord.TotalQty}</div>
                                <div><strong>Remarks:</strong> {activeRecord.Remarks || "-"}</div>
                            </div>

                            <h4 style={{ fontSize: "13px", fontWeight: 600, color: "#1a5695", marginBottom: "8px" }}>
                                Inward Material Line Items
                            </h4>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                                <thead>
                                    <tr style={{ background: "#2172ba", color: "#fff" }}>
                                        <th style={{ padding: "6px 8px" }}>From Item</th>
                                        <th style={{ padding: "6px 8px" }}>From Qty</th>
                                        <th style={{ padding: "6px 8px" }}>To Inward Item</th>
                                        <th style={{ padding: "6px 8px" }}>To Qty</th>
                                        <th style={{ padding: "6px 8px" }}>Process</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(activeRecord.details || []).map((det, idx) => (
                                        <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                                            <td style={{ padding: "6px 8px" }}>{det.FromItemName} ({det.FromItemCode})</td>
                                            <td style={{ padding: "6px 8px" }}>{det.FromQty} {det.FromUOM}</td>
                                            <td style={{ padding: "6px 8px", fontWeight: 600, color: "#1a5695" }}>{det.ToItemName} ({det.ToItemCode})</td>
                                            <td style={{ padding: "6px 8px", fontWeight: 600 }}>{det.ToQty} {det.ToUOM}</td>
                                            <td style={{ padding: "6px 8px" }}>{det.ProcessName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="cgrn-modal-footer">
                            <button
                                type="button"
                                style={{ padding: "6px 14px", background: "#2172ba", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" }}
                                onClick={() => handlePrintVoucher(activeRecord)}
                            >
                                <FaPrint style={{ marginRight: "6px" }} />
                                Print Voucher
                            </button>
                            <button
                                type="button"
                                style={{ padding: "6px 14px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "3px", cursor: "pointer" }}
                                onClick={() => setShowDetailModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
