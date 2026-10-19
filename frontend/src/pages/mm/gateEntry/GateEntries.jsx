import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    FaPlus,
    FaSyncAlt,
    FaListUl,
    FaFilter,
    FaCaretDown,
    FaCaretUp,
    FaCog,
    FaCalendarAlt,
    FaRegClock,
    FaSave,
    FaEye,
    FaEdit,
    FaTrash,
    FaPrint
} from "react-icons/fa";
import "../../../styles/gateEntry.css";

const API_URL = process.env.REACT_APP_API_URL || "/api";

const INITIAL_FORM = () => ({
    GateEntryPrefix: "Prefix",
    GateEntryNo: "",
    SupplierDCDate: "",
    GateEntryDate: "",
    GateEntryInTime: "22:18",
    InvoiceDate: "",
    SupplierName: "",
    InvoiceNo: "",
    SupplierDCNo: "",
    Weight: "",
    Boxes: "0",
    ReceivedBy: "",
    TransportDetails: "",
    TransporterDocRefNo: "",
    ItemDetails: "",
    Remarks: "",
    POReference: "",
    QtyUnitDetails: "",
    Amount: ""
});

export default function GateEntries({ initialMode = "list" }) {
    const [mode, setMode] = useState(initialMode); // "list" | "form"
    const [records, setRecords] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    // List View states
    const [filterGateEntryNo, setFilterGateEntryNo] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showFilterDrawer, setShowFilterDrawer] = useState(false);
    const [filterSupplier, setFilterSupplier] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openActionRowId, setOpenActionRowId] = useState(null);

    // Form View states
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(INITIAL_FORM());
    const [saving, setSaving] = useState(false);
    const [showSaveMenu, setShowSaveMenu] = useState(false);

    const dcDateRef = useRef(null);
    const geDateRef = useRef(null);
    const invDateRef = useRef(null);
    const timePickerRef = useRef(null);
    const actionMenuRef = useRef(null);
    const saveWrapRef = useRef(null);

    const fetchGateEntries = async () => {
        try {
            const params = {};
            if (filterGateEntryNo.trim()) params.gateEntryNo = filterGateEntryNo.trim();
            if (statusFilter !== "All") params.status = statusFilter;
            const res = await axios.get(`${API_URL}/gate-entries`, { params });
            setRecords(res.data?.data || []);
        } catch (_) {
            setRecords([]);
        }
    };

    useEffect(() => {
        fetchGateEntries();
        axios
            .get(`${API_URL}/suppliers`)
            .then((res) => {
                const list = res.data?.data || res.data?.value || [];
                if (Array.isArray(list)) {
                    setSuppliers(
                        list
                            .map((s) => s.SupplierName || s.supplierName || "")
                            .filter(Boolean)
                    );
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const handleOutside = (e) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
                setOpenActionRowId(null);
            }
            if (saveWrapRef.current && !saveWrapRef.current.contains(e.target)) {
                setShowSaveMenu(false);
            }
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    const handleChange = (field, val) => {
        setForm((prev) => ({ ...prev, [field]: val }));
    };

    const handleOpenNew = () => {
        setEditingId(null);
        setForm(INITIAL_FORM());
        setMode("form");
    };

    const handleEditRecord = (rec) => {
        setOpenActionRowId(null);
        setEditingId(rec.GateEntryID);
        setForm({
            GateEntryPrefix: rec.GateEntryPrefix || "GE/9B/2627/",
            GateEntryNo: rec.GateEntryNo || "",
            SupplierDCDate: rec.SupplierDCDate || "",
            GateEntryDate: rec.GateEntryDate || "",
            GateEntryInTime: rec.GateEntryInTime || "22:18",
            InvoiceDate: rec.InvoiceDate || "",
            SupplierName: rec.SupplierName || "",
            InvoiceNo: rec.InvoiceNo || "",
            SupplierDCNo: rec.SupplierDCNo || "",
            Weight: rec.Weight !== undefined ? String(rec.Weight) : "",
            Boxes: rec.Boxes !== undefined ? String(rec.Boxes) : "0",
            ReceivedBy: rec.ReceivedBy || "",
            TransportDetails: rec.TransportDetails || "",
            TransporterDocRefNo: rec.TransporterDocRefNo || "",
            ItemDetails: rec.ItemDetails || "",
            Remarks: rec.Remarks || "",
            POReference: rec.POReference || "",
            QtyUnitDetails: rec.QtyUnitDetails || "",
            Amount: rec.Amount !== undefined ? String(rec.Amount) : ""
        });
        setMode("form");
    };

    const handleDeleteRecord = async (rec) => {
        setOpenActionRowId(null);
        if (!window.confirm(`Delete Gate Entry ${rec.GateEntryNo}?`)) return;
        try {
            await axios.delete(`${API_URL}/gate-entries/${rec.GateEntryID}`);
            fetchGateEntries();
        } catch (_) {}
    };

    const handleSave = async (afterAction = "view") => {
        setShowSaveMenu(false);
        if (!String(form.SupplierName || "").trim()) {
            alert("Please enter / select Supplier.");
            return;
        }
        if (!String(form.Weight || "").trim()) {
            alert("Please enter Weight (KG).");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                ...form,
                GateEntryPrefix:
                    form.GateEntryPrefix === "Prefix"
                        ? "GE/9B/2627/"
                        : form.GateEntryPrefix,
                Weight: Number(form.Weight || 0),
                Boxes: Number(form.Boxes || 0),
                Amount: Number(form.Amount || 0)
            };

            if (editingId) {
                await axios.put(`${API_URL}/gate-entries/${editingId}`, payload);
            } else {
                await axios.post(`${API_URL}/gate-entries`, payload);
            }
            await fetchGateEntries();
            if (afterAction === "print") {
                window.print();
            } else if (afterAction === "new") {
                setEditingId(null);
                setForm(INITIAL_FORM());
            } else {
                setMode("list");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Error saving Gate Entry.");
        } finally {
            setSaving(false);
        }
    };

    // =========================================================================
    // RENDER: FORM VIEW (SCREENSHOTS 2, 3, 4 — "GATE ENTRY")
    // =========================================================================
    if (mode === "form") {
        return (
            <div className="ge-page">
                <h1 className="ge-title">GATE ENTRY</h1>

                <div className="ge-form-stack">
                    {/* Row 1: Prefix + Enter Gate + Gear button */}
                    <div className="ge-prefix-row">
                        <select
                            className="ge-prefix-select"
                            value={form.GateEntryPrefix}
                            onChange={(e) =>
                                handleChange("GateEntryPrefix", e.target.value)
                            }
                        >
                            <option value="Prefix">Prefix</option>
                            <option value="GE/9B/2627/">GE/9B/2627/</option>
                            <option value="GE/30/2627/">GE/30/2627/</option>
                        </select>
                        <input
                            type="text"
                            className="ge-seq-input"
                            placeholder="Enter Gate"
                            value={form.GateEntryNo}
                            onChange={(e) =>
                                handleChange("GateEntryNo", e.target.value)
                            }
                        />
                        <button
                            type="button"
                            className="ge-gear-btn"
                            title="Configure Numbering Series"
                            onClick={() => {}}
                        >
                            <FaCog />
                        </button>
                    </div>

                    {/* Supplier DC Date */}
                    <div className="ge-field-block">
                        <label className="ge-label">Supplier DC Date</label>
                        <div className="ge-input-addon-group">
                            <input
                                type="text"
                                className="ge-input"
                                placeholder="Select Supplier DC Date"
                                value={form.SupplierDCDate}
                                onChange={(e) =>
                                    handleChange("SupplierDCDate", e.target.value)
                                }
                            />
                            <button
                                type="button"
                                className="ge-addon-btn"
                                title="Select Supplier DC Date"
                                onClick={() =>
                                    dcDateRef.current &&
                                    dcDateRef.current.showPicker &&
                                    dcDateRef.current.showPicker()
                                }
                            >
                                <FaCalendarAlt />
                            </button>
                            <input
                                ref={dcDateRef}
                                type="date"
                                style={{
                                    position: "absolute",
                                    opacity: 0,
                                    width: 0,
                                    height: 0,
                                    pointerEvents: "none"
                                }}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        const [y, m, d] = e.target.value.split("-");
                                        handleChange(
                                            "SupplierDCDate",
                                            `${d}-${m}-${y}`
                                        );
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Gate Entry Date */}
                    <div className="ge-field-block">
                        <label className="ge-label">Gate Entry Date</label>
                        <div className="ge-input-addon-group">
                            <input
                                type="text"
                                className="ge-input"
                                placeholder="Select Gate Entry Date"
                                value={form.GateEntryDate}
                                onChange={(e) =>
                                    handleChange("GateEntryDate", e.target.value)
                                }
                            />
                            <button
                                type="button"
                                className="ge-addon-btn"
                                title="Select Gate Entry Date"
                                onClick={() =>
                                    geDateRef.current &&
                                    geDateRef.current.showPicker &&
                                    geDateRef.current.showPicker()
                                }
                            >
                                <FaCalendarAlt />
                            </button>
                            <input
                                ref={geDateRef}
                                type="date"
                                style={{
                                    position: "absolute",
                                    opacity: 0,
                                    width: 0,
                                    height: 0,
                                    pointerEvents: "none"
                                }}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        const [y, m, d] = e.target.value.split("-");
                                        handleChange(
                                            "GateEntryDate",
                                            `${d}-${m}-${y}`
                                        );
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Gate Entry In Time */}
                    <div className="ge-field-block">
                        <label className="ge-label">Gate Entry In Time</label>
                        <div className="ge-input-addon-group">
                            <input
                                type="text"
                                className="ge-input"
                                value={form.GateEntryInTime}
                                onChange={(e) =>
                                    handleChange("GateEntryInTime", e.target.value)
                                }
                            />
                            <button
                                type="button"
                                className="ge-addon-btn"
                                title="Select Gate Entry In Time"
                                onClick={() =>
                                    timePickerRef.current &&
                                    timePickerRef.current.showPicker &&
                                    timePickerRef.current.showPicker()
                                }
                            >
                                <FaRegClock />
                            </button>
                            <input
                                ref={timePickerRef}
                                type="time"
                                style={{
                                    position: "absolute",
                                    opacity: 0,
                                    width: 0,
                                    height: 0,
                                    pointerEvents: "none"
                                }}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        handleChange(
                                            "GateEntryInTime",
                                            e.target.value
                                        );
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Invoice Date */}
                    <div className="ge-field-block">
                        <label className="ge-label">Invoice Date</label>
                        <div className="ge-input-addon-group">
                            <input
                                type="text"
                                className="ge-input"
                                placeholder="Select Invoice Date"
                                value={form.InvoiceDate}
                                onChange={(e) =>
                                    handleChange("InvoiceDate", e.target.value)
                                }
                            />
                            <button
                                type="button"
                                className="ge-addon-btn"
                                title="Select Invoice Date"
                                onClick={() =>
                                    invDateRef.current &&
                                    invDateRef.current.showPicker &&
                                    invDateRef.current.showPicker()
                                }
                            >
                                <FaCalendarAlt />
                            </button>
                            <input
                                ref={invDateRef}
                                type="date"
                                style={{
                                    position: "absolute",
                                    opacity: 0,
                                    width: 0,
                                    height: 0,
                                    pointerEvents: "none"
                                }}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        const [y, m, d] = e.target.value.split("-");
                                        handleChange("InvoiceDate", `${d}-${m}-${y}`);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Supplier */}
                    <div className="ge-field-block">
                        <label className="ge-label">Supplier</label>
                        <div className="ge-req-wrap">
                            <input
                                type="text"
                                className="ge-input"
                                placeholder="Type and select Supplier"
                                list="ge-supplier-datalist"
                                value={form.SupplierName}
                                onChange={(e) =>
                                    handleChange("SupplierName", e.target.value)
                                }
                            />
                            <span className="ge-req-star">*</span>
                            <datalist id="ge-supplier-datalist">
                                {suppliers.map((s, idx) => (
                                    <option key={idx} value={s} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    {/* Invoice No */}
                    <div className="ge-field-block">
                        <label className="ge-label">Invoice No</label>
                        <input
                            type="text"
                            className="ge-input"
                            placeholder="Enter Invoice No"
                            value={form.InvoiceNo}
                            onChange={(e) => handleChange("InvoiceNo", e.target.value)}
                        />
                    </div>

                    {/* Supplier Dc No */}
                    <div className="ge-field-block">
                        <label className="ge-label">Supplier Dc No</label>
                        <input
                            type="text"
                            className="ge-input"
                            placeholder="Enter Supplier Dc No"
                            value={form.SupplierDCNo}
                            onChange={(e) =>
                                handleChange("SupplierDCNo", e.target.value)
                            }
                        />
                    </div>

                    {/* Weight (*KG) */}
                    <div className="ge-field-block">
                        <label className="ge-label">Weight</label>
                        <div className="ge-weight-row">
                            <div className="ge-weight-input-wrap">
                                <input
                                    type="text"
                                    className="ge-input"
                                    placeholder="Enter Weight"
                                    value={form.Weight}
                                    onChange={(e) =>
                                        handleChange("Weight", e.target.value)
                                    }
                                />
                                <span className="ge-req-star">*</span>
                            </div>
                            <span className="ge-weight-kg">KG</span>
                        </div>
                    </div>

                    {/* No of Boxes */}
                    <div className="ge-field-block">
                        <label className="ge-label">No of Boxes</label>
                        <input
                            type="number"
                            className="ge-input"
                            value={form.Boxes}
                            onChange={(e) => handleChange("Boxes", e.target.value)}
                        />
                    </div>

                    {/* Received By */}
                    <div className="ge-field-block">
                        <label className="ge-label">Received By</label>
                        <input
                            type="text"
                            className="ge-input"
                            placeholder="Enter Received By"
                            value={form.ReceivedBy}
                            onChange={(e) =>
                                handleChange("ReceivedBy", e.target.value)
                            }
                        />
                    </div>

                    {/* Transport Details */}
                    <div className="ge-field-block">
                        <label className="ge-label">Transport Details</label>
                        <input
                            type="text"
                            className="ge-input"
                            placeholder="Select or enter Transport Details"
                            value={form.TransportDetails}
                            onChange={(e) =>
                                handleChange("TransportDetails", e.target.value)
                            }
                        />
                    </div>

                    {/* Transporter Doc. Ref. No. */}
                    <div className="ge-field-block">
                        <label className="ge-label">Transporter Doc. Ref. No.</label>
                        <input
                            type="text"
                            className="ge-input"
                            placeholder="Enter Transporter Doc. Ref. No."
                            value={form.TransporterDocRefNo}
                            onChange={(e) =>
                                handleChange("TransporterDocRefNo", e.target.value)
                            }
                        />
                    </div>

                    {/* Item Detail */}
                    <div className="ge-field-block">
                        <label className="ge-label">Item Detail</label>
                        <textarea
                            className="ge-textarea"
                            placeholder="item_details"
                            value={form.ItemDetails}
                            onChange={(e) =>
                                handleChange("ItemDetails", e.target.value)
                            }
                        />
                    </div>

                    {/* Remarks */}
                    <div className="ge-field-block">
                        <label className="ge-label">Remarks</label>
                        <textarea
                            className="ge-textarea"
                            placeholder="remarks"
                            value={form.Remarks}
                            onChange={(e) => handleChange("Remarks", e.target.value)}
                        />
                    </div>

                    {/* PO Reference */}
                    <div className="ge-field-block">
                        <label className="ge-label">PO Reference</label>
                        <textarea
                            className="ge-textarea"
                            placeholder="PO Reference"
                            value={form.POReference}
                            onChange={(e) =>
                                handleChange("POReference", e.target.value)
                            }
                        />
                    </div>

                    {/* Qty & Unit Details */}
                    <div className="ge-field-block">
                        <label className="ge-label">Qty &amp; Unit Details</label>
                        <textarea
                            className="ge-textarea"
                            placeholder="Qty & Unit Details"
                            value={form.QtyUnitDetails}
                            onChange={(e) =>
                                handleChange("QtyUnitDetails", e.target.value)
                            }
                        />
                    </div>

                    {/* Amount */}
                    <div className="ge-field-block">
                        <label className="ge-label">Amount</label>
                        <input
                            type="text"
                            className="ge-input"
                            placeholder="Enter Amount"
                            value={form.Amount}
                            onChange={(e) => handleChange("Amount", e.target.value)}
                        />
                    </div>
                </div>

                {/* Bottom Right Save | ▴ & View Buttons */}
                <div className="ge-bottom-actions">
                    <div className="ge-save-split" ref={saveWrapRef}>
                        <button
                            type="button"
                            className="ge-btn-save-main"
                            onClick={() => handleSave("view")}
                            disabled={saving}
                        >
                            <FaSave size={11} /> {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            className="ge-btn-save-caret"
                            onClick={() => setShowSaveMenu((prev) => !prev)}
                        >
                            <FaCaretUp />
                        </button>
                        {showSaveMenu && (
                            <div className="ge-save-dropup">
                                <div
                                    className="ge-save-dropup-item"
                                    onClick={() => handleSave("new")}
                                >
                                    Save &amp; New
                                </div>
                                <div
                                    className="ge-save-dropup-item"
                                    onClick={() => handleSave("print")}
                                >
                                    Save &amp; Print
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className="ge-btn-view"
                        onClick={() => setMode("list")}
                    >
                        <FaEye size={11} /> View
                    </button>
                </div>
            </div>
        );
    }

    // =========================================================================
    // RENDER: LIST VIEW (SCREENSHOT 1)
    // =========================================================================
    const filtered = records.filter((r) => {
        if (
            filterGateEntryNo.trim() &&
            !String(r.GateEntryNo || "")
                .toLowerCase()
                .includes(filterGateEntryNo.trim().toLowerCase()) &&
            !String(r.GateEntryPrefix || "")
                .toLowerCase()
                .includes(filterGateEntryNo.trim().toLowerCase())
        ) {
            return false;
        }
        if (
            statusFilter !== "All" &&
            String(r.Status || "").toLowerCase() !== statusFilter.toLowerCase()
        ) {
            return false;
        }
        if (
            filterSupplier.trim() &&
            !String(r.SupplierName || "")
                .toLowerCase()
                .includes(filterSupplier.trim().toLowerCase())
        ) {
            return false;
        }
        return true;
    });

    const emptyRowCount = Math.max(0, 14 - filtered.length);

    return (
        <div className="ge-page">
            <h1 className="ge-title">Gate Entry</h1>

            {/* Top Filter & + Gate entry Row */}
            <div className="ge-list-top-row">
                <div className="ge-list-filters-left">
                    <div className="ge-filter-group">
                        <label className="ge-label">Gate Entry No</label>
                        <input
                            type="text"
                            className="ge-filter-input"
                            placeholder="Gate Entry No"
                            value={filterGateEntryNo}
                            onChange={(e) => setFilterGateEntryNo(e.target.value)}
                        />
                    </div>

                    <div className="ge-filter-group">
                        <label className="ge-label">Status</label>
                        <select
                            className="ge-status-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="GRN Done">GRN Done</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <button
                    type="button"
                    className="ge-btn-new-gate"
                    onClick={handleOpenNew}
                >
                    <FaPlus size={10} /> Gate entry
                </button>
            </div>

            {/* Sub-Toolbar & Pagination Row */}
            <div className="ge-toolbar-row">
                <div className="ge-toolbar-left">
                    <div className="ge-icon-group">
                        <button
                            type="button"
                            className="ge-icon-btn"
                            title="Refresh"
                            onClick={fetchGateEntries}
                        >
                            <FaSyncAlt />
                        </button>
                        <button
                            type="button"
                            className="ge-icon-btn"
                            title="List Summary"
                            onClick={fetchGateEntries}
                        >
                            <FaListUl />
                        </button>
                    </div>

                    <div className="ge-filter-split">
                        <button
                            type="button"
                            className="ge-filter-btn"
                            onClick={() => setShowFilterDrawer((prev) => !prev)}
                        >
                            <FaFilter size={10} /> Filter
                        </button>
                        <button
                            type="button"
                            className="ge-filter-caret"
                            onClick={() => setShowFilterDrawer((prev) => !prev)}
                        >
                            <FaCaretDown size={10} />
                        </button>
                    </div>
                </div>

                <div className="ge-pagination-group">
                    {[1, 2, 3, 4, 5].map((p) => (
                        <button
                            key={p}
                            type="button"
                            className={`ge-page-btn ${
                                currentPage === p ? "active" : ""
                            }`}
                            onClick={() => setCurrentPage(p)}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        type="button"
                        className="ge-page-btn"
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(5, prev + 1))
                        }
                    >
                        &gt;
                    </button>
                    <button
                        type="button"
                        className="ge-page-btn"
                        onClick={() => setCurrentPage(5)}
                    >
                        &gt;&gt;
                    </button>
                </div>
            </div>

            {/* Optional Filter Drawer */}
            {showFilterDrawer && (
                <div className="ge-filter-drawer">
                    <div className="ge-filter-group">
                        <label className="ge-label">Supplier</label>
                        <input
                            type="text"
                            className="ge-filter-input"
                            placeholder="Search Supplier..."
                            value={filterSupplier}
                            onChange={(e) => setFilterSupplier(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* 17-Column Gate Entry List Table */}
            <div className="ge-table-wrap">
                <table className="ge-table">
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>
                                Gate Entry
                                <br />
                                Prefix
                            </th>
                            <th>
                                Gate
                                <br />
                                Entry
                                <br />
                                No
                            </th>
                            <th>
                                Gate Entry
                                <br />
                                Date
                            </th>
                            <th>Supplier</th>
                            <th>Invoice No</th>
                            <th>
                                Invoice
                                <br />
                                Date
                            </th>
                            <th>Supplier DC No</th>
                            <th>
                                Supplier DC
                                <br />
                                Date
                            </th>
                            <th>Boxes</th>
                            <th>Remarks</th>
                            <th>
                                GRN
                                <br />
                                No
                            </th>
                            <th>
                                GRN
                                <br />
                                Date
                            </th>
                            <th>Weight</th>
                            <th>Item Details</th>
                            <th>
                                Received
                                <br />
                                By
                            </th>
                            <th>
                                Entered
                                <br />
                                By
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((rec) => (
                            <tr key={rec.GateEntryID}>
                                <td style={{ textAlign: "center" }}>
                                    <div
                                        className="ge-action-wrap"
                                        ref={
                                            openActionRowId === rec.GateEntryID
                                                ? actionMenuRef
                                                : null
                                        }
                                    >
                                        <button
                                            type="button"
                                            className="ge-action-btn"
                                            onClick={() =>
                                                setOpenActionRowId(
                                                    openActionRowId ===
                                                        rec.GateEntryID
                                                        ? null
                                                        : rec.GateEntryID
                                                )
                                            }
                                        >
                                            Action <FaCaretDown size={9} />
                                        </button>
                                        {openActionRowId === rec.GateEntryID && (
                                            <div className="ge-action-menu">
                                                <div
                                                    className="ge-action-item"
                                                    onClick={() =>
                                                        handleEditRecord(rec)
                                                    }
                                                >
                                                    <FaEdit
                                                        size={11}
                                                        color="#337ab7"
                                                    />{" "}
                                                    View / Edit
                                                </div>
                                                <div
                                                    className="ge-action-item"
                                                    onClick={() => {
                                                        setOpenActionRowId(null);
                                                        window.print();
                                                    }}
                                                >
                                                    <FaPrint
                                                        size={11}
                                                        color="#555"
                                                    />{" "}
                                                    Print
                                                </div>
                                                <div
                                                    className="ge-action-item"
                                                    onClick={() =>
                                                        handleDeleteRecord(rec)
                                                    }
                                                >
                                                    <FaTrash
                                                        size={11}
                                                        color="#d9534f"
                                                    />{" "}
                                                    Delete
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td>{rec.GateEntryPrefix}</td>
                                <td>{rec.GateEntryNo}</td>
                                <td>{rec.GateEntryDate}</td>
                                <td>{rec.SupplierName}</td>
                                <td>{rec.InvoiceNo}</td>
                                <td>{rec.InvoiceDate}</td>
                                <td>{rec.SupplierDCNo}</td>
                                <td>{rec.SupplierDCDate}</td>
                                <td style={{ textAlign: "right" }}>
                                    {rec.Boxes || 0}
                                </td>
                                <td>{rec.Remarks}</td>
                                <td>{rec.GRNNo}</td>
                                <td>{rec.GRNDate}</td>
                                <td style={{ textAlign: "right" }}>
                                    {rec.Weight}
                                </td>
                                <td>{rec.ItemDetails}</td>
                                <td>{rec.ReceivedBy}</td>
                                <td>{rec.EnteredBy}</td>
                            </tr>
                        ))}

                        {Array.from({ length: emptyRowCount }).map((_, idx) => (
                            <tr key={`empty-${idx}`}>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
