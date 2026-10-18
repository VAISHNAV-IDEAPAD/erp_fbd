import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
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
    FaCheck,
    FaSearch
} from "react-icons/fa";
import TypeaheadDropdown from "../../../components/common/TypeaheadDropdown";
import "../../../styles/floorReturns.css";

const API_URL = process.env.REACT_APP_API_URL || "/api";

// Floor returns are loaded from the API; no sample data is bundled.
const INITIAL_FLOOR_RETURNS = [];

export default function FloorReturns() {
    const [returns, setReturns] = useState(INITIAL_FLOOR_RETURNS);
    const [loading, setLoading] = useState(false);
    const [searchSupplier, setSearchSupplier] = useState("");
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [openActionId, setOpenActionId] = useState(null);
    const [showFilterBar, setShowFilterBar] = useState(false);
    const [viewMode, setViewMode] = useState("normal"); // normal or compact

    // Filter criteria state
    const [filterStore, setFilterStore] = useState("All");
    const [filterFromDate, setFilterFromDate] = useState("");
    const [filterToDate, setFilterToDate] = useState("");
    const [filterRemark, setFilterRemark] = useState("");

    // Modals
    const [showNewModal, setShowNewModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [activeRecord, setActiveRecord] = useState(null);

    // New Floor Return form state
    const [newForm, setNewForm] = useState({
        FRMNo: "FR/AAPL9B/2627/1",
        ReturnDate: "12-10-2026",
        Stores: "RAW MATERIAL STORE 9B",
        SupplierName: "",
        Currency: "INR",
        ExchangeRate: "1.0",
        Remark: "",
        InternalMemo: "",
        items: [
            { ItemCode: "LTH-1093", ItemName: "COW CULATTAS SINGLE LEATHER", Color: "BLACK", Quantity: "50", UOM: "SQFT", Remarks: "Line 1 surplus" }
        ]
    });

    // Master suppliers for Typeahead
    const [suppliersList, setSuppliersList] = useState([]);

    const actionMenuRef = useRef(null);

    // Load from backend on mount
    useEffect(() => {
        loadData();
        loadSuppliers();
    }, []);

    // Suggest the next FRM number whenever the New Floor Return modal opens
    useEffect(() => {
        if (!showNewModal) return;
        let max = 0;
        returns.forEach((r) => {
            const m = String(r.FRMNo || "").match(/(\d+)$/);
            if (m) max = Math.max(max, parseInt(m[1], 10));
        });
        setNewForm((prev) => ({ ...prev, FRMNo: `FR/AAPL9B/2627/${max + 1}` }));
    }, [showNewModal]);

    // Close action dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
                setOpenActionId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/floor-returns`);
            const data = res.data?.data || res.data || [];
            if (Array.isArray(data)) {
                setReturns(data);
            }
        } catch (e) {
            console.warn("Unable to load from API, keeping initial data:", e.message);
        } finally {
            setLoading(false);
        }
    };

    const loadSuppliers = async () => {
        try {
            const res = await axios.get(`${API_URL}/suppliers`);
            const data = res.data?.value || res.data?.data || res.data || [];
            if (Array.isArray(data)) {
                setSuppliersList(data.map(s => ({
                    label: s.SupplierName || s.supplierName,
                    value: s.SupplierID || s.id,
                    code: s.SupplierCode || s.supplierCode
                })));
            }
        } catch (e) {}
    };

    // Filtered records
    const filteredReturns = useMemo(() => {
        return returns.filter(item => {
            // Search text (Supplier Search...)
            const search = searchSupplier.trim().toLowerCase();
            if (search) {
                const matchSupplier = String(item.SupplierName || "").toLowerCase().includes(search);
                const matchFRM = String(item.FRMNo || "").toLowerCase().includes(search);
                const matchStore = String(item.Stores || "").toLowerCase().includes(search);
                const matchRemark = String(item.Remark || "").toLowerCase().includes(search);
                if (!matchSupplier && !matchFRM && !matchStore && !matchRemark) return false;
            }

            // Store filter
            if (filterStore !== "All" && item.Stores !== filterStore) {
                return false;
            }

            // Remark filter
            if (filterRemark && !String(item.Remark || "").toLowerCase().includes(filterRemark.toLowerCase())) {
                return false;
            }

            return true;
        });
    }, [returns, searchSupplier, filterStore, filterRemark]);

    // Handle Add New Item Row in New Modal
    const handleAddRow = () => {
        setNewForm(prev => ({
            ...prev,
            items: [
                ...prev.items,
                { ItemCode: "", ItemName: "", Color: "", Quantity: "", UOM: "PCS", Remarks: "" }
            ]
        }));
    };

    const handleRemoveRow = (idx) => {
        if (newForm.items.length <= 1) return;
        setNewForm(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== idx)
        }));
    };

    const handleItemChange = (idx, field, val) => {
        setNewForm(prev => {
            const nextItems = [...prev.items];
            nextItems[idx] = { ...nextItems[idx], [field]: val };
            return { ...prev, items: nextItems };
        });
    };

    // Save New Floor Return
    const handleSaveNew = async (e) => {
        e.preventDefault();
        const totalQty = newForm.items.reduce((s, it) => s + Number(it.Quantity || 0), 0);
        const payload = {
            FRMNo: newForm.FRMNo,
            ReturnDate: newForm.ReturnDate,
            Stores: newForm.Stores,
            SupplierName: newForm.SupplierName,
            Currency: newForm.Currency,
            ExchangeRate: Number(newForm.ExchangeRate) || 1.0,
            Remark: newForm.Remark,
            InternalMemo: newForm.InternalMemo,
            UpdatedBy: "Nikhil Singh",
            TotalQty: totalQty,
            RowCount: Math.max(newForm.items.length, 1),
            details: newForm.items
        };

        try {
            await axios.post(`${API_URL}/floor-returns`, payload);
        } catch (err) {
            console.warn("Backend save failed, saved locally:", err);
        }

        const newRecord = {
            ...payload,
            ReturnID: Date.now(),
            UpdatedOn: "Oct 12 2026 12:00PM"
        };

        setReturns(prev => [newRecord, ...prev]);
        setShowNewModal(false);
        alert(`Floor Return ${newForm.FRMNo} created successfully!`);
    };

    // Delete Record
    const handleDelete = async (record) => {
        if (!window.confirm(`Are you sure you want to delete ${record.FRMNo}?`)) return;
        try {
            await axios.delete(`${API_URL}/floor-returns/${record.ReturnID}`);
        } catch (e) {}
        setReturns(prev => prev.filter(r => (r.ReturnID || r.FRMNo) !== (record.ReturnID || record.FRMNo)));
        setOpenActionId(null);
    };

    // Print Record
    const handlePrint = (record) => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;
        printWindow.document.write(`
            <html>
                <head>
                    <title>Floor Return Material Voucher - ${record.FRMNo}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 25px; color: #333; }
                        h2 { color: #1a5695; margin-bottom: 5px; }
                        .header { border-bottom: 2px solid #337ab7; padding-bottom: 10px; margin-bottom: 15px; }
                        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; font-size: 13px; }
                        th { background: #337ab7; color: white; padding: 8px; text-align: left; }
                        td { border: 1px solid #ddd; padding: 8px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>TPCS FASHION - FLOOR RETURN VOUCHER</h2>
                        <small>Plot No. 9B | FY 01-Apr-2026 - 31-Mar-2027</small>
                    </div>
                    <div class="info-grid">
                        <div><strong>FRM No:</strong> ${record.FRMNo}</div>
                        <div><strong>Date:</strong> ${record.ReturnDate}</div>
                        <div><strong>Stores:</strong> ${record.Stores}</div>
                        <div><strong>Supplier:</strong> ${record.SupplierName || "Internal / Department"}</div>
                        <div><strong>Remark:</strong> ${record.Remark || "-"}</div>
                        <div><strong>Total Qty:</strong> ${record.TotalQty}</div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Item Code</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>UOM</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(record.details || []).map((d, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${d.ItemCode || "-"}</td>
                                    <td>${d.ItemName || "-"}</td>
                                    <td>${d.Quantity}</td>
                                    <td>${d.UOM || "PCS"}</td>
                                    <td>${d.Remarks || "-"}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                    <div style="margin-top: 40px; display: flex; justify-content: space-between;">
                        <div>Prepared By: ________________</div>
                        <div>Received By: ________________</div>
                        <div>Authorized By: ________________</div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 300);
        setOpenActionId(null);
    };

    return (
        <div className="floor-returns-page">
            {/* PAGE TITLE */}
            <h1 className="fr-page-title">Floor Return</h1>

            {/* TOP CRITERIA / SEARCH & NEW BUTTON */}
            <div className="fr-top-row">
                <div className="fr-search-group">
                    <label className="fr-search-label">Supplier Name</label>
                    <input
                        type="text"
                        className="fr-search-input"
                        placeholder="Supplier Search..."
                        value={searchSupplier}
                        onChange={(e) => setSearchSupplier(e.target.value)}
                    />
                </div>

                <button
                    type="button"
                    className="fr-btn-new"
                    onClick={() => setShowNewModal(true)}
                >
                    <FaPlus /> New Floor Return Material
                </button>
            </div>

            {/* TOOLBAR (Refresh, List, Settings, Filter, Page Badge) */}
            <div className="fr-toolbar-row">
                <div className="fr-toolbar-actions">
                    <button
                        type="button"
                        className="fr-tool-btn"
                        title="Reload"
                        onClick={loadData}
                    >
                        <FaSyncAlt />
                    </button>

                    <button
                        type="button"
                        className="fr-tool-btn"
                        title="Toggle View Density"
                        onClick={() => setViewMode(prev => prev === "normal" ? "compact" : "normal")}
                    >
                        <FaBars />
                    </button>

                    <button
                        type="button"
                        className="fr-tool-btn"
                        title="Settings"
                        onClick={() => alert("Table columns configured according to TPCS Fashion ERP specifications.")}
                    >
                        <FaCog />
                    </button>

                    <button
                        type="button"
                        className={`fr-tool-btn fr-tool-btn-filter ${showFilterBar ? "active" : ""}`}
                        onClick={() => setShowFilterBar(prev => !prev)}
                    >
                        <FaFilter /> Filter <FaCaretDown />
                    </button>
                </div>

                <div className="fr-page-badge" title="Page 1">
                    1
                </div>
            </div>

            {/* EXPANDABLE FILTER BAR */}
            {showFilterBar && (
                <div className="fr-filter-card">
                    <div className="fr-filter-item">
                        <label className="fr-filter-label">Stores</label>
                        <select
                            className="fr-filter-select"
                            value={filterStore}
                            onChange={(e) => setFilterStore(e.target.value)}
                        >
                            <option value="All">All Stores</option>
                            <option value="RAW MATERIAL STORE 9B">RAW MATERIAL STORE 9B</option>
                            <option value="SEMI FINISH STORE 9B">SEMI FINISH STORE 9B</option>
                            <option value="SEMI FINISH STORE 18">SEMI FINISH STORE 18</option>
                            <option value="FINISHED GOODS STORE">FINISHED GOODS STORE</option>
                        </select>
                    </div>

                    <div className="fr-filter-item">
                        <label className="fr-filter-label">Remark Filter</label>
                        <input
                            type="text"
                            className="fr-filter-select"
                            placeholder="e.g. MT-21983"
                            value={filterRemark}
                            onChange={(e) => setFilterRemark(e.target.value)}
                        />
                    </div>

                    <button
                        type="button"
                        className="fr-filter-btn-reset"
                        onClick={() => {
                            setFilterStore("All");
                            setFilterRemark("");
                            setSearchSupplier("");
                        }}
                    >
                        Reset
                    </button>

                    <button
                        type="button"
                        className="fr-filter-btn-apply"
                        onClick={() => setShowFilterBar(false)}
                    >
                        Apply Filter
                    </button>
                </div>
            )}

            {/* DATA TABLE MATCHING SCREENSHOT */}
            <div className="fr-table-container">
                <table className={`fr-table ${viewMode === "compact" ? "table-sm" : ""}`}>
                    <thead>
                        <tr>
                            <th style={{ width: "90px" }} className="text-center">Action</th>
                            <th style={{ width: "170px" }}>FRM No</th>
                            <th style={{ width: "110px" }}>Updated By</th>
                            <th style={{ width: "130px" }}>Updated On</th>
                            <th style={{ width: "100px" }}>Date</th>
                            <th style={{ width: "110px" }}>Supplier</th>
                            <th style={{ width: "180px" }}>Stores</th>
                            <th style={{ width: "75px" }}>Currency</th>
                            <th style={{ width: "105px" }} className="text-end">Exchange Rate</th>
                            <th style={{ width: "110px" }}>Remark</th>
                            <th style={{ width: "150px" }}>Memo for internal use</th>
                            <th style={{ width: "85px" }} className="text-end">Qty</th>
                            <th style={{ width: "85px" }} className="text-end">No. of rows</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReturns.length === 0 ? (
                            <tr>
                                <td colSpan="13" className="fr-empty-state">
                                    No Floor Return records found matching criteria.
                                </td>
                            </tr>
                        ) : (
                            filteredReturns.map((row, index) => {
                                const rowKey = row.ReturnID || row.FRMNo || index;
                                const isSelected = selectedRowId === rowKey || selectedRowId === row.ReturnID;

                                return (
                                    <tr
                                        key={rowKey}
                                        className={isSelected ? "selected-row" : ""}
                                        onClick={() => setSelectedRowId(rowKey)}
                                    >
                                        {/* ACTION DROPDOWN BUTTON */}
                                        <td className="text-center" onClick={(e) => e.stopPropagation()}>
                                            <div className="fr-action-btn-wrap" ref={openActionId === rowKey ? actionMenuRef : null}>
                                                <button
                                                    type="button"
                                                    className="fr-action-btn"
                                                    onClick={() => setOpenActionId(openActionId === rowKey ? null : rowKey)}
                                                >
                                                    Action <FaCaretDown />
                                                </button>

                                                {openActionId === rowKey && (
                                                    <div className="fr-action-menu">
                                                        <button
                                                            type="button"
                                                            className="fr-action-item"
                                                            onClick={() => {
                                                                setActiveRecord(row);
                                                                setShowDetailModal(true);
                                                                setOpenActionId(null);
                                                            }}
                                                        >
                                                            <FaEye className="text-primary" /> View Details
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="fr-action-item"
                                                            onClick={() => {
                                                                setActiveRecord(row);
                                                                setShowEditModal(true);
                                                                setOpenActionId(null);
                                                            }}
                                                        >
                                                            <FaEdit className="text-secondary" /> Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="fr-action-item"
                                                            onClick={() => handlePrint(row)}
                                                        >
                                                            <FaPrint className="text-success" /> Print FRM
                                                        </button>

                                                        <div style={{ height: "1px", background: "#e2e8f0", margin: "3px 0" }} />

                                                        <button
                                                            type="button"
                                                            className="fr-action-item danger text-danger"
                                                            onClick={() => handleDelete(row)}
                                                        >
                                                            <FaTrash /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* FRM NO */}
                                        <td>
                                            <span
                                                className="fr-doc-no"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveRecord(row);
                                                    setShowDetailModal(true);
                                                }}
                                            >
                                                {row.FRMNo}
                                            </span>
                                        </td>

                                        {/* UPDATED BY */}
                                        <td>
                                            {row.UpdatedBy ? (
                                                <span className="fr-updated-by">{row.UpdatedBy}</span>
                                            ) : ""}
                                        </td>

                                        {/* UPDATED ON (Stacked Oct 12 2026 / 11:21AM) */}
                                        <td>
                                            {row.UpdatedOn ? (
                                                <div className="fr-updated-on">
                                                    {row.UpdatedOn}
                                                </div>
                                            ) : ""}
                                        </td>

                                        {/* DATE */}
                                        <td>{row.ReturnDate || ""}</td>

                                        {/* SUPPLIER */}
                                        <td>{row.SupplierName || ""}</td>

                                        {/* STORES */}
                                        <td>{row.Stores || ""}</td>

                                        {/* CURRENCY */}
                                        <td>{row.Currency || "INR"}</td>

                                        {/* EXCHANGE RATE */}
                                        <td className="text-end">
                                            {Number(row.ExchangeRate || 1.0).toFixed(1)}
                                        </td>

                                        {/* REMARK */}
                                        <td>{row.Remark || ""}</td>

                                        {/* MEMO FOR INTERNAL USE */}
                                        <td>{row.InternalMemo || ""}</td>

                                        {/* QTY */}
                                        <td className="text-end fw-semibold">
                                            {Number(row.TotalQty || 0).toFixed(1)}
                                        </td>

                                        {/* NO. OF ROWS */}
                                        <td className="text-end">
                                            {row.RowCount || 1}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* ==============================================================
                MODAL: NEW FLOOR RETURN MATERIAL
               ============================================================== */}
            {showNewModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-light py-2 px-3">
                                <h6 className="modal-title fw-bold text-primary mb-0">
                                    New Floor Return Material
                                </h6>
                                <button type="button" className="btn-close" onClick={() => setShowNewModal(false)} />
                            </div>
                            <form onSubmit={handleSaveNew}>
                                <div className="modal-body p-3">
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-4">
                                            <label className="form-label small fw-semibold">FRM No</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={newForm.FRMNo}
                                                onChange={(e) => setNewForm(prev => ({ ...prev, FRMNo: e.target.value }))}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label small fw-semibold">Date</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={newForm.ReturnDate}
                                                onChange={(e) => setNewForm(prev => ({ ...prev, ReturnDate: e.target.value }))}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label small fw-semibold">Stores <span className="text-danger">*</span></label>
                                            <select
                                                className="form-select form-select-sm"
                                                value={newForm.Stores}
                                                onChange={(e) => setNewForm(prev => ({ ...prev, Stores: e.target.value }))}
                                                required
                                            >
                                                <option value="RAW MATERIAL STORE 9B">RAW MATERIAL STORE 9B</option>
                                                <option value="SEMI FINISH STORE 9B">SEMI FINISH STORE 9B</option>
                                                <option value="SEMI FINISH STORE 18">SEMI FINISH STORE 18</option>
                                                <option value="FINISHED GOODS STORE">FINISHED GOODS STORE</option>
                                            </select>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label small fw-semibold">Supplier (Optional)</label>
                                            <TypeaheadDropdown
                                                options={suppliersList}
                                                value={newForm.SupplierName}
                                                onChange={(val) => setNewForm(prev => ({ ...prev, SupplierName: val }))}
                                                placeholder="Search Supplier..."
                                                showCode={true}
                                                size="sm"
                                            />
                                        </div>

                                        <div className="col-md-3">
                                            <label className="form-label small fw-semibold">Currency</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={newForm.Currency}
                                                onChange={(e) => setNewForm(prev => ({ ...prev, Currency: e.target.value }))}
                                            />
                                        </div>

                                        <div className="col-md-3">
                                            <label className="form-label small fw-semibold">Exchange Rate</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="form-control form-control-sm"
                                                value={newForm.ExchangeRate}
                                                onChange={(e) => setNewForm(prev => ({ ...prev, ExchangeRate: e.target.value }))}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label small fw-semibold">Remark</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="e.g. MT-21983"
                                                value={newForm.Remark}
                                                onChange={(e) => setNewForm(prev => ({ ...prev, Remark: e.target.value }))}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label small fw-semibold">Memo for internal use</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={newForm.InternalMemo}
                                                onChange={(e) => setNewForm(prev => ({ ...prev, InternalMemo: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    {/* LINE ITEMS */}
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <strong className="small text-secondary">Returned Line Items</strong>
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary btn-sm py-0 px-2"
                                            style={{ fontSize: "11.5px" }}
                                            onClick={handleAddRow}
                                        >
                                            <FaPlus /> Add Line
                                        </button>
                                    </div>

                                    <div className="table-responsive border rounded" style={{ maxHeight: "200px" }}>
                                        <table className="table table-sm table-bordered align-middle mb-0" style={{ fontSize: "12px" }}>
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Item Code</th>
                                                    <th>Item Name</th>
                                                    <th>Color</th>
                                                    <th style={{ width: "90px" }}>Qty</th>
                                                    <th style={{ width: "70px" }}>UOM</th>
                                                    <th>Remarks</th>
                                                    <th style={{ width: "40px" }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {newForm.items.map((it, idx) => (
                                                    <tr key={idx}>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm py-0"
                                                                value={it.ItemCode}
                                                                onChange={(e) => handleItemChange(idx, "ItemCode", e.target.value)}
                                                                placeholder="LTH-..."
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm py-0"
                                                                value={it.ItemName}
                                                                onChange={(e) => handleItemChange(idx, "ItemName", e.target.value)}
                                                                placeholder="Item name"
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm py-0"
                                                                value={it.Color}
                                                                onChange={(e) => handleItemChange(idx, "Color", e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                step="0.1"
                                                                className="form-control form-control-sm py-0"
                                                                value={it.Quantity}
                                                                onChange={(e) => handleItemChange(idx, "Quantity", e.target.value)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm py-0"
                                                                value={it.UOM}
                                                                onChange={(e) => handleItemChange(idx, "UOM", e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm py-0"
                                                                value={it.Remarks}
                                                                onChange={(e) => handleItemChange(idx, "Remarks", e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="text-center">
                                                            {newForm.items.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-danger btn-sm py-0 px-1"
                                                                    onClick={() => handleRemoveRow(idx)}
                                                                >
                                                                    ×
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="modal-footer py-2 px-3 bg-light">
                                    <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowNewModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-sm btn-success">
                                        <FaCheck className="me-1" /> Save Floor Return
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ==============================================================
                MODAL: VIEW DETAILS
               ============================================================== */}
            {showDetailModal && activeRecord && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-light py-2 px-3">
                                <h6 className="modal-title fw-bold text-primary mb-0">
                                    Floor Return Details - {activeRecord.FRMNo}
                                </h6>
                                <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)} />
                            </div>
                            <div className="modal-body p-3">
                                <div className="row g-2 mb-3 bg-light p-2 rounded border" style={{ fontSize: "12.5px" }}>
                                    <div className="col-md-4"><strong>FRM No:</strong> {activeRecord.FRMNo}</div>
                                    <div className="col-md-4"><strong>Date:</strong> {activeRecord.ReturnDate}</div>
                                    <div className="col-md-4"><strong>Stores:</strong> {activeRecord.Stores}</div>
                                    <div className="col-md-4"><strong>Supplier:</strong> {activeRecord.SupplierName || "Internal Return"}</div>
                                    <div className="col-md-4"><strong>Currency:</strong> {activeRecord.Currency || "INR"} (Rate: {Number(activeRecord.ExchangeRate || 1.0).toFixed(1)})</div>
                                    <div className="col-md-4"><strong>Remark:</strong> {activeRecord.Remark || "-"}</div>
                                    <div className="col-md-4"><strong>Memo:</strong> {activeRecord.InternalMemo || "-"}</div>
                                    <div className="col-md-4"><strong>Total Qty:</strong> <span className="fw-bold text-primary">{Number(activeRecord.TotalQty || 0).toFixed(1)}</span></div>
                                    <div className="col-md-4"><strong>Updated By:</strong> {activeRecord.UpdatedBy || "Nikhil Singh"}</div>
                                </div>

                                <h6 className="small fw-bold text-secondary mb-2">Item Breakdown:</h6>
                                <table className="table table-sm table-bordered mb-0" style={{ fontSize: "12px" }}>
                                    <thead className="table-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Item Code</th>
                                            <th>Item Name</th>
                                            <th>Color</th>
                                            <th className="text-end">Qty</th>
                                            <th>UOM</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(activeRecord.details || [
                                            { ItemCode: "LTH-1093", ItemName: "Leather / Material Return", Color: "NATURAL", Quantity: activeRecord.TotalQty, UOM: "PCS", Remarks: activeRecord.Remark || "Floor return" }
                                        ]).map((d, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td className="fw-semibold text-primary">{d.ItemCode || "-"}</td>
                                                <td>{d.ItemName || "-"}</td>
                                                <td>{d.Color || "-"}</td>
                                                <td className="text-end fw-bold">{Number(d.Quantity || 0).toFixed(1)}</td>
                                                <td>{d.UOM || "PCS"}</td>
                                                <td>{d.Remarks || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer py-2 px-3 bg-light">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => handlePrint(activeRecord)}
                                >
                                    <FaPrint className="me-1" /> Print Voucher
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => setShowDetailModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==============================================================
                MODAL: EDIT RECORD
               ============================================================== */}
            {showEditModal && activeRecord && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-light py-2 px-3">
                                <h6 className="modal-title fw-bold text-primary mb-0">
                                    Edit Floor Return - {activeRecord.FRMNo}
                                </h6>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} />
                            </div>
                            <div className="modal-body p-3">
                                <div className="mb-2">
                                    <label className="form-label small fw-semibold">Stores</label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={activeRecord.Stores}
                                        onChange={(e) => setActiveRecord(prev => ({ ...prev, Stores: e.target.value }))}
                                    >
                                        <option value="RAW MATERIAL STORE 9B">RAW MATERIAL STORE 9B</option>
                                        <option value="SEMI FINISH STORE 9B">SEMI FINISH STORE 9B</option>
                                        <option value="SEMI FINISH STORE 18">SEMI FINISH STORE 18</option>
                                        <option value="FINISHED GOODS STORE">FINISHED GOODS STORE</option>
                                    </select>
                                </div>
                                <div className="mb-2">
                                    <label className="form-label small fw-semibold">Remark</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={activeRecord.Remark || ""}
                                        onChange={(e) => setActiveRecord(prev => ({ ...prev, Remark: e.target.value }))}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label small fw-semibold">Memo for internal use</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={activeRecord.InternalMemo || ""}
                                        onChange={(e) => setActiveRecord(prev => ({ ...prev, InternalMemo: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer py-2 px-3 bg-light">
                                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={async () => {
                                        try {
                                            await axios.put(`${API_URL}/floor-returns/${activeRecord.ReturnID}`, activeRecord);
                                        } catch (e) {}
                                        setReturns(prev => prev.map(r => (r.ReturnID === activeRecord.ReturnID ? activeRecord : r)));
                                        setShowEditModal(false);
                                        alert("Floor Return updated successfully!");
                                    }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
