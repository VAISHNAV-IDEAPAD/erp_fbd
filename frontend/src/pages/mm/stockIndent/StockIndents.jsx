import React, { useState, useEffect, useRef } from "react";
import { Table, Modal, Button, Spinner, Alert, Badge } from "react-bootstrap";
import { 
    FaPlus, 
    FaSyncAlt, 
    FaListUl, 
    FaCog, 
    FaFilter, 
    FaChevronDown, 
    FaPrint, 
    FaEye, 
    FaHistory, 
    FaEdit, 
    FaTimes, 
    FaTrash, 
    FaCheck, 
    FaBuilding 
} from "react-icons/fa";
import axios from "axios";
import IndentForm from "../../indent/IndentForm";
import "../../../styles/indentsList.css";

export default function StockIndents(props) {
    // Mode: "list" or "form"
    const [viewMode, setViewMode] = useState(props.mode || "list");

    // -------------------------------------------------------------------------
    // STATE: LIST DATA & FILTERS
    // -------------------------------------------------------------------------
    const [indents, setIndents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    // Filters
    const [supplierSearch, setSupplierSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [enteredByFilter, setEnteredByFilter] = useState("");
    const [selectedRows, setSelectedRows] = useState(new Set());

    // Active Action Menu (tracked by row IndentID)
    const [activeActionRow, setActiveActionRow] = useState(null);
    const actionMenuRef = useRef(null);

    // Modals
    const [viewIndent, setViewIndent] = useState(null);
    const [printIndent, setPrintIndent] = useState(null);
    const [showNewModal, setShowNewModal] = useState(false);
    const [historyModal, setHistoryModal] = useState(null);

    // -------------------------------------------------------------------------
    // STATE: NEW INDENT FORM
    // -------------------------------------------------------------------------
    const [newIndentForm, setNewIndentForm] = useState({
        indentNo: `IND/AAPL/9B/26-27/${Math.floor(1190 + Math.random() * 50)}`,
        indentDate: new Date().toISOString().split("T")[0],
        indentMethod: "Manual",
        indentType: "For Stock",
        department: "Raw Material Store",
        priority: "Normal",
        status: "Open",
        remarks: "",
        items: [
            { itemId: 1, itemCode: "FAB-1001", itemName: "CANVAS CLOTH 278 GSM 10 OZ", color: "GREIGE", uom: "MTR", qty: 100, rate: 129, remarks: "" }
        ]
    });

    const [availableItems, setAvailableItems] = useState([]);
    const [departments, setDepartments] = useState(["Raw Material Store", "Cutting", "Sewing", "Finishing", "Packaging", "Quality Control"]);
    const [isSaving, setIsSaving] = useState(false);

    // -------------------------------------------------------------------------
    // FETCH INDENTS ON MOUNT & FILTER CHANGE
    // -------------------------------------------------------------------------
    useEffect(() => {
        loadIndents();
        loadAvailableItems();
    }, [statusFilter]);

    // Close action dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
                setActiveActionRow(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loadIndents = async () => {
        try {
            setLoading(true);
            setErrorMsg(null);
            const params = {};
            if (statusFilter !== "All") params.status = statusFilter;
            if (supplierSearch.trim()) params.supplier = supplierSearch.trim();
            if (enteredByFilter.trim()) params.enteredBy = enteredByFilter.trim();

            const res = await axios.get("/api/indents", { params });
            if (res.data && res.data.success) {
                setIndents(res.data.data || []);
            } else {
                setIndents([]);
            }
        } catch (err) {
            console.error("Failed to load indents:", err);
            setErrorMsg("Failed to connect to Indent records from server.");
        } finally {
            setLoading(false);
        }
    };

    const loadAvailableItems = async () => {
        try {
            const res = await axios.get("/api/items?limit=50");
            if (res.data && res.data.success) {
                setAvailableItems(res.data.data || []);
            }
        } catch (e) {}
    };

    // Filter indents locally by supplier & entered by for real-time typing
    const filteredIndents = indents.filter((row) => {
        if (supplierSearch.trim() && !(row.SupplierName || "").toLowerCase().includes(supplierSearch.toLowerCase())) {
            return false;
        }
        if (enteredByFilter.trim() && !(row.EnteredBy || "").toLowerCase().includes(enteredByFilter.toLowerCase())) {
            return false;
        }
        return true;
    });

    // -------------------------------------------------------------------------
    // SELECTION CHECKBOXES
    // -------------------------------------------------------------------------
    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(new Set(filteredIndents.map(i => i.IndentID)));
        } else {
            setSelectedRows(new Set());
        }
    };

    const toggleSelectRow = (id) => {
        const next = new Set(selectedRows);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedRows(next);
    };

    // -------------------------------------------------------------------------
    // ACTION HANDLERS
    // -------------------------------------------------------------------------
    const handleView = async (row) => {
        setActiveActionRow(null);
        try {
            const res = await axios.get(`/api/indents/${row.IndentID}`);
            if (res.data && res.data.success) {
                setViewIndent(res.data.data);
            } else {
                setViewIndent(row);
            }
        } catch (err) {
            setViewIndent(row);
        }
    };

    const handlePrint = async (row) => {
        setActiveActionRow(null);
        try {
            const res = await axios.get(`/api/indents/${row.IndentID}`);
            if (res.data && res.data.success) {
                setPrintIndent(res.data.data);
            } else {
                setPrintIndent(row);
            }
        } catch (err) {
            setPrintIndent(row);
        }
    };

    const handleCloseIndent = async (row) => {
        setActiveActionRow(null);
        if (window.confirm(`Are you sure you want to mark Indent ${row.IndentNo} as Closed?`)) {
            try {
                await axios.patch(`/api/indents/${row.IndentID}/cancel`);
                loadIndents();
            } catch (err) {
                alert("Failed to close indent.");
            }
        }
    };

    // -------------------------------------------------------------------------
    // NEW INDENT SUBMISSION
    // -------------------------------------------------------------------------
    const handleSaveNewIndent = async () => {
        if (!newIndentForm.items || newIndentForm.items.length === 0) {
            alert("Please add at least one line item to the indent.");
            return;
        }

        try {
            setIsSaving(true);
            const payload = {
                IndentNo: newIndentForm.indentNo,
                IndentDate: newIndentForm.indentDate,
                Department: newIndentForm.department,
                RequestedBy: "Admin",
                Priority: newIndentForm.priority,
                Status: newIndentForm.status,
                Remarks: newIndentForm.remarks,
                IndentMethod: newIndentForm.indentMethod,
                IndentType: newIndentForm.indentType,
                Items: newIndentForm.items.map(it => ({
                    ItemID: it.itemId,
                    Qty: parseFloat(it.qty) || 1,
                    UOM: it.uom || "PCS",
                    Remarks: it.remarks || ""
                }))
            };

            const res = await axios.post("/api/indents", payload);
            if (res.data && res.data.success) {
                setShowNewModal(false);
                loadIndents();
                alert(`Indent ${newIndentForm.indentNo} created successfully!`);
            } else {
                alert(res.data?.message || "Failed to create indent.");
            }
        } catch (err) {
            console.error("Save Indent Error:", err);
            alert("Error creating indent. Please check all required fields.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddLineItem = () => {
        setNewIndentForm({
            ...newIndentForm,
            items: [
                ...newIndentForm.items,
                { itemId: 2, itemCode: "RAW-1002", itemName: "New Material Requirement", color: "BLACK", uom: "MTR", qty: 50, rate: 100, remarks: "" }
            ]
        });
    };

    const handleRemoveLineItem = (idx) => {
        setNewIndentForm({
            ...newIndentForm,
            items: newIndentForm.items.filter((_, i) => i !== idx)
        });
    };

    // Format entered on datetime nicely: "Oct 9 2026 2:57PM"
    const formatEnteredOn = (dateStr) => {
        if (!dateStr) return "-";
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = months[d.getMonth()];
            const day = d.getDate();
            const year = d.getFullYear();
            let hours = d.getHours();
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            hours = hours ? hours : 12;
            const minutes = d.getMinutes().toString().padStart(2, "0");
            return `${month} ${day} ${year} ${hours}:${minutes}${ampm}`;
        } catch (e) {
            return dateStr;
        }
    };

    if (viewMode === "form") {
        return (
            <IndentForm 
                onNavigateView={() => {
                    setViewMode("list");
                    loadIndents();
                }}
            />
        );
    }

    return (
        <div className="ind-erp-page">
            {/* Page Title */}
            <h1 className="ind-erp-title">Indent</h1>

            {/* Top Filter Bar matching JenixCloud */}
            <div className="ind-filter-bar">
                {/* Supplier Name */}
                <div className="ind-filter-group">
                    <label className="ind-filter-label">Supplier Name</label>
                    <input 
                        type="text" 
                        className="ind-filter-input" 
                        placeholder="Supplier Search..."
                        value={supplierSearch}
                        onChange={(e) => setSupplierSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") loadIndents();
                        }}
                    />
                </div>

                {/* Status Dropdown */}
                <div className="ind-filter-group">
                    <label className="ind-filter-label">Status</label>
                    <select 
                        className="ind-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ width: "160px" }}
                    >
                        <option value="All">All</option>
                        <option value="Open">Open</option>
                        <option value="Approved">Approved</option>
                        <option value="Draft">Draft</option>
                        <option value="Partially Ordered">Partially Ordered</option>
                        <option value="Closed">Closed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Entered by */}
                <div className="ind-filter-group">
                    <label className="ind-filter-label">Entered by</label>
                    <input 
                        type="text" 
                        className="ind-filter-input" 
                        placeholder="Entered by"
                        value={enteredByFilter}
                        onChange={(e) => setEnteredByFilter(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") loadIndents();
                        }}
                    />
                </div>

                {/* + New Indent Button (Green #5cb85c) */}
                <button 
                    type="button" 
                    className="ind-btn-new"
                    onClick={() => setViewMode("form")}
                >
                    <FaPlus size={11} /> New Indent
                </button>
            </div>

            {/* Sub-Toolbar & Pagination Bar */}
            <div className="ind-sub-toolbar">
                <div className="ind-toolbar-icons">
                    <button 
                        type="button" 
                        className="ind-icon-btn" 
                        title="Refresh"
                        onClick={loadIndents}
                    >
                        <FaSyncAlt size={11} />
                    </button>
                    <button 
                        type="button" 
                        className="ind-icon-btn" 
                        title="View Summary"
                        onClick={() => alert(`Total Indents: ${filteredIndents.length}`)}
                    >
                        <FaListUl size={11} />
                    </button>
                    <button 
                        type="button" 
                        className="ind-icon-btn" 
                        title="Settings"
                        onClick={() => alert("Indent Module Settings: Active financial year 2026-2027.")}
                    >
                        <FaCog size={12} />
                    </button>
                    <button 
                        type="button" 
                        className="ind-filter-btn" 
                        onClick={loadIndents}
                    >
                        <FaFilter size={10} /> Filter <FaChevronDown size={8} />
                    </button>
                </div>

                {/* Page Indicator [1] */}
                <div>
                    <button type="button" className="ind-page-btn" title="Page 1">
                        1
                    </button>
                </div>
            </div>

            {/* Error Alert */}
            {errorMsg && (
                <Alert variant="danger" className="py-1 px-3 mb-2" style={{ fontSize: "11px" }}>
                    {errorMsg}
                </Alert>
            )}

            {/* Table Ribbon Header matching JenixCloud (#337ab7) */}
            <div className="table-responsive" style={{ minHeight: "400px" }}>
                <Table hover size="sm" className="ind-ribbon-table text-nowrap">
                    <thead>
                        <tr>
                            <th style={{ width: "80px" }}>Action</th>
                            <th>Indent No.</th>
                            <th>Indent Method</th>
                            <th>Indent No.</th>
                            <th>Indent Type</th>
                            <th>Date</th>
                            <th>Other Reference</th>
                            <th>Remarks</th>
                            <th>Department</th>
                            <th>Version No</th>
                            <th>Status</th>
                            <th>Entered On</th>
                            <th>Entered By</th>
                            <th className="text-end">Qty</th>
                            <th className="text-end">No. of rows</th>
                            <th className="ind-checkbox-cell">
                                <input 
                                    type="checkbox" 
                                    checked={selectedRows.size > 0 && selectedRows.size === filteredIndents.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="16" className="text-center py-5">
                                    <Spinner animation="border" size="sm" className="me-2 text-primary" />
                                    Loading Indents...
                                </td>
                            </tr>
                        ) : filteredIndents.length === 0 ? (
                            <tr>
                                <td colSpan="16" className="text-center py-5 text-muted">
                                    No Indents found matching criteria. Click <strong>+ New Indent</strong> to create one.
                                </td>
                            </tr>
                        ) : (
                            filteredIndents.map((row) => (
                                <tr key={row.IndentID}>
                                    {/* Action Dropdown Column */}
                                    <td className="text-center" style={{ overflow: "visible", position: "relative" }}>
                                        <div className="ind-action-container">
                                            <button 
                                                type="button" 
                                                className="ind-action-trigger"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveActionRow(activeActionRow === row.IndentID ? null : row.IndentID);
                                                }}
                                            >
                                                Action <FaChevronDown size={8} />
                                            </button>

                                            {/* Dropdown Menu Popup matching screenshot */}
                                            {activeActionRow === row.IndentID && (
                                                <div className="ind-action-menu text-start" ref={actionMenuRef}>
                                                    <div className="ind-action-menu-header">Action</div>
                                                    <div className="ind-action-item" onClick={() => handleView(row)}>
                                                        <FaEye size={10} className="text-primary" /> View
                                                    </div>
                                                    <div className="ind-action-item" onClick={() => handlePrint(row)}>
                                                        <FaPrint size={10} className="text-secondary" /> Print
                                                    </div>
                                                    <div className="ind-action-item" onClick={() => {
                                                        setActiveActionRow(null);
                                                        setHistoryModal(row);
                                                    }}>
                                                        <FaHistory size={10} className="text-info" /> View History
                                                    </div>
                                                    <div className="ind-action-item" onClick={() => {
                                                        setActiveActionRow(null);
                                                        handleView(row);
                                                    }}>
                                                        <FaEdit size={10} className="text-warning" /> Amendment
                                                    </div>
                                                    <div className="ind-action-item danger" onClick={() => handleCloseIndent(row)}>
                                                        <FaTimes size={10} className="text-danger" /> Close
                                                    </div>
                                                    <div className="ind-action-item" onClick={() => {
                                                        setActiveActionRow(null);
                                                        setHistoryModal(row);
                                                    }}>
                                                        <FaHistory size={10} className="text-muted" /> View History
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Indent No */}
                                    <td className="fw-semibold text-primary" style={{ cursor: "pointer" }} onClick={() => handleView(row)}>
                                        {row.IndentNo}
                                    </td>

                                    {/* Indent Method */}
                                    <td>{row.IndentMethod || "Manual"}</td>

                                    {/* Sub-Indent / Ref No */}
                                    <td>{row.SubIndentNo || ""}</td>

                                    {/* Indent Type */}
                                    <td>{row.IndentType || "For Stock"}</td>

                                    {/* Date */}
                                    <td>{row.IndentDate || "-"}</td>

                                    {/* Other Reference */}
                                    <td>{row.OtherReference || ""}</td>

                                    {/* Remarks */}
                                    <td>{row.Remarks || ""}</td>

                                    {/* Department */}
                                    <td>{row.DepartmentName || ""}</td>

                                    {/* Version No */}
                                    <td className="text-center">{row.VersionNo !== undefined ? row.VersionNo : 0}</td>

                                    {/* Status */}
                                    <td>
                                        <span 
                                            className={`badge ${
                                                row.Status === "Open" ? "bg-primary" : 
                                                row.Status === "Approved" ? "bg-success" : 
                                                row.Status === "Draft" ? "bg-secondary" : "bg-dark"
                                            }`}
                                            style={{ fontSize: "10px", padding: "3px 6px" }}
                                        >
                                            {row.Status || "Open"}
                                        </span>
                                    </td>

                                    {/* Entered On */}
                                    <td>{formatEnteredOn(row.CreatedAt)}</td>

                                    {/* Entered By */}
                                    <td>{row.EnteredBy || row.EmployeeName || "Admin"}</td>

                                    {/* Qty */}
                                    <td className="text-end fw-semibold">
                                        {row.TotalQty ? Number(row.TotalQty).toLocaleString() : "-"}
                                    </td>

                                    {/* No. of rows */}
                                    <td className="text-end">{row.TotalItems || 1}</td>

                                    {/* Checkbox */}
                                    <td className="ind-checkbox-cell">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedRows.has(row.IndentID)}
                                            onChange={() => toggleSelectRow(row.IndentID)}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </div>

            {/* =================================================================
                MODAL 1: VIEW INDENT DETAILS
                ================================================================= */}
            <Modal 
                show={!!viewIndent} 
                onHide={() => setViewIndent(null)}
                size="lg"
                centered
            >
                <Modal.Header closeButton style={{ background: "#337ab7", color: "#ffffff", padding: "8px 16px" }}>
                    <Modal.Title style={{ fontSize: "13px", fontWeight: "700" }}>
                        <FaEye className="me-2" /> Indent Details: {viewIndent?.IndentNo}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ fontSize: "11.5px" }}>
                    {viewIndent && (
                        <>
                            <div className="row g-2 mb-3 pb-2 border-bottom">
                                <div className="col-md-3"><strong>Indent No:</strong> {viewIndent.IndentNo}</div>
                                <div className="col-md-3"><strong>Date:</strong> {viewIndent.IndentDate}</div>
                                <div className="col-md-3"><strong>Type:</strong> {viewIndent.IndentType || "For Stock"}</div>
                                <div className="col-md-3"><strong>Method:</strong> {viewIndent.IndentMethod || "Manual"}</div>
                                <div className="col-md-3"><strong>Department:</strong> {viewIndent.DepartmentName || "Store"}</div>
                                <div className="col-md-3"><strong>Status:</strong> {viewIndent.Status}</div>
                                <div className="col-md-3"><strong>Entered By:</strong> {viewIndent.EnteredBy || "Admin"}</div>
                                <div className="col-md-3"><strong>Version:</strong> {viewIndent.VersionNo || 0}</div>
                                {viewIndent.Remarks && (
                                    <div className="col-12 mt-1"><strong>Remarks:</strong> {viewIndent.Remarks}</div>
                                )}
                            </div>

                            <h6 className="fw-bold mb-2 text-primary" style={{ fontSize: "12px" }}>Line Items</h6>
                            <Table bordered size="sm" className="mb-0 text-nowrap" style={{ fontSize: "11px" }}>
                                <thead style={{ background: "#f8fafc" }}>
                                    <tr>
                                        <th style={{ width: "40px" }}>#</th>
                                        <th>Item Code</th>
                                        <th>Item Description</th>
                                        <th>Color / Variant</th>
                                        <th>UOM</th>
                                        <th className="text-end">Quantity</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(viewIndent.details || viewIndent.items || []).length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-2 text-muted">
                                                No line items registered.
                                            </td>
                                        </tr>
                                    ) : (
                                        (viewIndent.details || viewIndent.items || []).map((it, idx) => (
                                            <tr key={idx}>
                                                <td className="text-center">{idx + 1}</td>
                                                <td className="font-monospace fw-semibold">{it.ItemCode || `RM-${it.ItemID}`}</td>
                                                <td>{it.ItemName || it.Description || "Standard Material"}</td>
                                                <td>{it.Color || "-"}</td>
                                                <td>{it.UOM || "PCS"}</td>
                                                <td className="text-end fw-bold">{it.Qty}</td>
                                                <td>{it.Remarks || "-"}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ padding: "6px 16px" }}>
                    <Button 
                        size="sm" 
                        variant="primary" 
                        style={{ fontSize: "11px", background: "#337ab7" }}
                        onClick={() => {
                            const row = viewIndent;
                            setViewIndent(null);
                            handlePrint(row);
                        }}
                    >
                        <FaPrint className="me-1" /> Print Voucher
                    </Button>
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => setViewIndent(null)}
                        style={{ fontSize: "11px" }}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* =================================================================
                MODAL 2: PRINT INDENT VOUCHER (Alpine Apparels 9B)
                ================================================================= */}
            <Modal 
                show={!!printIndent} 
                onHide={() => setPrintIndent(null)}
                size="lg"
                centered
            >
                <Modal.Header closeButton style={{ background: "#337ab7", color: "#ffffff", padding: "8px 16px" }}>
                    <Modal.Title style={{ fontSize: "13px", fontWeight: "700" }}>
                        <FaPrint className="me-2" /> Indent Voucher Preview: {printIndent?.IndentNo}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4" style={{ fontFamily: "Segoe UI, sans-serif" }}>
                    {printIndent && (
                        <div id="indent-print-sheet" style={{ background: "#ffffff", color: "#000000", padding: "10px" }}>
                            {/* Header */}
                            <div className="text-center border-bottom pb-2 mb-3">
                                <h4 className="fw-bold mb-1" style={{ color: "#1e3a8a", fontSize: "16px" }}>
                                    Alpine Apparels Pvt. Ltd.
                                </h4>
                                <div style={{ fontSize: "11px", color: "#475569" }}>
                                    PLOT NO. 9B, SECTOR-27A, FARIDABAD, HARYANA-121003
                                </div>
                                <div className="mt-2 py-1 px-3 d-inline-block fw-bold text-uppercase border" style={{ fontSize: "13px", background: "#f1f5f9" }}>
                                    MATERIAL INDENT VOUCHER
                                </div>
                            </div>

                            {/* Meta Table */}
                            <div className="row g-2 mb-3" style={{ fontSize: "11.5px" }}>
                                <div className="col-6">
                                    <div><strong>Indent No:</strong> {printIndent.IndentNo}</div>
                                    <div><strong>Indent Date:</strong> {printIndent.IndentDate}</div>
                                    <div><strong>Department:</strong> {printIndent.DepartmentName || "Raw Material Store"}</div>
                                    <div><strong>Priority:</strong> {printIndent.Priority || "Normal"}</div>
                                </div>
                                <div className="col-6 text-end">
                                    <div><strong>Method:</strong> {printIndent.IndentMethod || "Manual"}</div>
                                    <div><strong>Type:</strong> {printIndent.IndentType || "For Stock"}</div>
                                    <div><strong>Status:</strong> {printIndent.Status || "Open"}</div>
                                    <div><strong>Entered By:</strong> {printIndent.EnteredBy || "Admin"}</div>
                                </div>
                            </div>

                            {/* Items Table */}
                            <Table bordered size="sm" className="mb-4 text-nowrap" style={{ fontSize: "11px" }}>
                                <thead style={{ background: "#f8fafc" }}>
                                    <tr>
                                        <th style={{ width: "35px" }}>#</th>
                                        <th>Item Code</th>
                                        <th>Description</th>
                                        <th>Variant / Colour</th>
                                        <th>UOM</th>
                                        <th className="text-end">Required Qty</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(printIndent.details || printIndent.items || []).length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-2 text-muted">
                                                No line items registered.
                                            </td>
                                        </tr>
                                    ) : (
                                        (printIndent.details || printIndent.items || []).map((it, idx) => (
                                            <tr key={idx}>
                                                <td className="text-center">{idx + 1}</td>
                                                <td className="font-monospace">{it.ItemCode || `RM-${it.ItemID}`}</td>
                                                <td>{it.ItemName || it.Description || "Material"}</td>
                                                <td>{it.Color || "-"}</td>
                                                <td>{it.UOM || "PCS"}</td>
                                                <td className="text-end fw-bold">{it.Qty}</td>
                                                <td>{it.Remarks || "-"}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>

                            {/* Signatures */}
                            <div className="row pt-5 mt-4 border-top text-center" style={{ fontSize: "11px" }}>
                                <div className="col-4">
                                    <div className="border-top pt-1 fw-bold">Prepared By</div>
                                    <div className="text-muted small">{printIndent.EnteredBy || "Store Executive"}</div>
                                </div>
                                <div className="col-4">
                                    <div className="border-top pt-1 fw-bold">Checked By</div>
                                    <div className="text-muted small">Store In-Charge</div>
                                </div>
                                <div className="col-4">
                                    <div className="border-top pt-1 fw-bold">Authorized Signatory</div>
                                    <div className="text-muted small">Production Manager</div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ padding: "6px 16px" }}>
                    <Button 
                        size="sm" 
                        variant="primary" 
                        style={{ fontSize: "11px", background: "#337ab7" }}
                        onClick={() => window.print()}
                    >
                        <FaPrint className="me-1" /> Print Document
                    </Button>
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => setPrintIndent(null)}
                        style={{ fontSize: "11px" }}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* =================================================================
                MODAL 3: + NEW INDENT FORM
                ================================================================= */}
            <Modal 
                show={showNewModal} 
                onHide={() => setShowNewModal(false)}
                size="xl"
                centered
            >
                <Modal.Header closeButton style={{ background: "#337ab7", color: "#ffffff", padding: "8px 16px" }}>
                    <Modal.Title style={{ fontSize: "13px", fontWeight: "700" }}>
                        <FaPlus className="me-2" /> Create New Material Indent
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ fontSize: "11.5px" }}>
                    {/* Header Controls */}
                    <div className="row g-2 mb-3 pb-3 border-bottom">
                        <div className="col-md-3">
                            <label className="fw-bold mb-1" style={{ fontSize: "11px" }}>Indent No *</label>
                            <input 
                                type="text" 
                                className="form-control form-control-sm"
                                style={{ height: "26px", fontSize: "11.5px" }}
                                value={newIndentForm.indentNo}
                                onChange={(e) => setNewIndentForm({ ...newIndentForm, indentNo: e.target.value })}
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="fw-bold mb-1" style={{ fontSize: "11px" }}>Indent Date *</label>
                            <input 
                                type="date" 
                                className="form-control form-control-sm"
                                style={{ height: "26px", fontSize: "11.5px" }}
                                value={newIndentForm.indentDate}
                                onChange={(e) => setNewIndentForm({ ...newIndentForm, indentDate: e.target.value })}
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="fw-bold mb-1" style={{ fontSize: "11px" }}>Indent Type</label>
                            <select 
                                className="form-select form-select-sm"
                                style={{ height: "26px", fontSize: "11.5px" }}
                                value={newIndentForm.indentType}
                                onChange={(e) => setNewIndentForm({ ...newIndentForm, indentType: e.target.value })}
                            >
                                <option value="For Stock">For Stock</option>
                                <option value="Excess">Excess</option>
                                <option value="Order Specific">Order Specific</option>
                                <option value="Project">Project</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="fw-bold mb-1" style={{ fontSize: "11px" }}>Department *</label>
                            <select 
                                className="form-select form-select-sm"
                                style={{ height: "26px", fontSize: "11.5px" }}
                                value={newIndentForm.department}
                                onChange={(e) => setNewIndentForm({ ...newIndentForm, department: e.target.value })}
                            >
                                {departments.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="fw-bold mb-1" style={{ fontSize: "11px" }}>Priority</label>
                            <select 
                                className="form-select form-select-sm"
                                style={{ height: "26px", fontSize: "11.5px" }}
                                value={newIndentForm.priority}
                                onChange={(e) => setNewIndentForm({ ...newIndentForm, priority: e.target.value })}
                            >
                                <option value="Normal">Normal</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>
                        <div className="col-12 mt-2">
                            <label className="fw-bold mb-1" style={{ fontSize: "11px" }}>Remarks / Justification</label>
                            <input 
                                type="text" 
                                className="form-control form-control-sm"
                                style={{ height: "26px", fontSize: "11.5px" }}
                                placeholder="Enter indent justification or reference details..."
                                value={newIndentForm.remarks}
                                onChange={(e) => setNewIndentForm({ ...newIndentForm, remarks: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Items Grid */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-primary" style={{ fontSize: "12px" }}>
                            Indent Line Items ({newIndentForm.items.length})
                        </span>
                        <Button 
                            size="sm" 
                            variant="outline-primary"
                            style={{ fontSize: "11px", height: "26px", padding: "2px 10px" }}
                            onClick={handleAddLineItem}
                        >
                            <FaPlus className="me-1" /> Add Line Item
                        </Button>
                    </div>

                    <Table bordered size="sm" className="mb-0 text-nowrap" style={{ fontSize: "11px" }}>
                        <thead style={{ background: "#f8fafc" }}>
                            <tr>
                                <th style={{ width: "35px" }}>#</th>
                                <th style={{ width: "160px" }}>Item Code</th>
                                <th>Item Description</th>
                                <th style={{ width: "120px" }}>Colour / Variant</th>
                                <th style={{ width: "80px" }}>UOM</th>
                                <th style={{ width: "110px" }} className="text-end">Quantity *</th>
                                <th>Line Remarks</th>
                                <th style={{ width: "40px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {newIndentForm.items.map((it, idx) => (
                                <tr key={idx}>
                                    <td className="text-center">{idx + 1}</td>
                                    <td>
                                        <input 
                                            type="text" 
                                            className="form-control form-control-sm font-monospace"
                                            style={{ height: "24px", fontSize: "11px" }}
                                            value={it.itemCode}
                                            onChange={(e) => {
                                                const next = [...newIndentForm.items];
                                                next[idx].itemCode = e.target.value;
                                                setNewIndentForm({ ...newIndentForm, items: next });
                                            }}
                                            list={`item-list-${idx}`}
                                        />
                                        <datalist id={`item-list-${idx}`}>
                                            {availableItems.map(item => (
                                                <option key={item.ItemID} value={item.ItemCode}>{item.ItemName}</option>
                                            ))}
                                        </datalist>
                                    </td>
                                    <td>
                                        <input 
                                            type="text" 
                                            className="form-control form-control-sm"
                                            style={{ height: "24px", fontSize: "11px" }}
                                            value={it.itemName}
                                            onChange={(e) => {
                                                const next = [...newIndentForm.items];
                                                next[idx].itemName = e.target.value;
                                                setNewIndentForm({ ...newIndentForm, items: next });
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="text" 
                                            className="form-control form-control-sm"
                                            style={{ height: "24px", fontSize: "11px" }}
                                            value={it.color}
                                            onChange={(e) => {
                                                const next = [...newIndentForm.items];
                                                next[idx].color = e.target.value;
                                                setNewIndentForm({ ...newIndentForm, items: next });
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="text" 
                                            className="form-control form-control-sm text-center"
                                            style={{ height: "24px", fontSize: "11px" }}
                                            value={it.uom}
                                            onChange={(e) => {
                                                const next = [...newIndentForm.items];
                                                next[idx].uom = e.target.value;
                                                setNewIndentForm({ ...newIndentForm, items: next });
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="number" 
                                            className="form-control form-control-sm text-end fw-bold"
                                            style={{ height: "24px", fontSize: "11px" }}
                                            value={it.qty}
                                            onChange={(e) => {
                                                const next = [...newIndentForm.items];
                                                next[idx].qty = e.target.value;
                                                setNewIndentForm({ ...newIndentForm, items: next });
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="text" 
                                            className="form-control form-control-sm"
                                            style={{ height: "24px", fontSize: "11px" }}
                                            placeholder="Optional remarks"
                                            value={it.remarks}
                                            onChange={(e) => {
                                                const next = [...newIndentForm.items];
                                                next[idx].remarks = e.target.value;
                                                setNewIndentForm({ ...newIndentForm, items: next });
                                            }}
                                        />
                                    </td>
                                    <td className="text-center">
                                        <button 
                                            type="button" 
                                            className="btn btn-sm btn-link text-danger p-0"
                                            title="Delete Line"
                                            onClick={() => handleRemoveLineItem(idx)}
                                        >
                                            <FaTrash size={10} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer style={{ padding: "6px 16px" }}>
                    <Button 
                        size="sm" 
                        variant="success" 
                        style={{ fontSize: "12px", background: "#5cb85c", borderColor: "#4cae4c", fontWeight: "700" }}
                        onClick={handleSaveNewIndent}
                        disabled={isSaving}
                    >
                        {isSaving ? <Spinner animation="border" size="sm" /> : <><FaCheck className="me-1" /> Save &amp; Submit Indent</>}
                    </Button>
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => setShowNewModal(false)}
                        style={{ fontSize: "11px" }}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* =================================================================
                MODAL 4: VIEW HISTORY
                ================================================================= */}
            <Modal 
                show={!!historyModal} 
                onHide={() => setHistoryModal(null)}
                centered
            >
                <Modal.Header closeButton style={{ background: "#337ab7", color: "#ffffff", padding: "8px 16px" }}>
                    <Modal.Title style={{ fontSize: "13px", fontWeight: "700" }}>
                        <FaHistory className="me-2" /> Audit History: {historyModal?.IndentNo}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ fontSize: "11.5px" }}>
                    {historyModal && (
                        <div>
                            <div className="mb-2"><strong>Indent No:</strong> {historyModal.IndentNo}</div>
                            <div className="mb-2"><strong>Created On:</strong> {historyModal.CreatedAt || historyModal.IndentDate}</div>
                            <div className="mb-2"><strong>Created By:</strong> {historyModal.EnteredBy || "Admin"}</div>
                            <div className="mb-2"><strong>Revision Version:</strong> {historyModal.VersionNo || 0}</div>
                            <div className="mb-2"><strong>Method:</strong> {historyModal.IndentMethod || "Manual"}</div>
                            <div className="mb-2"><strong>Status History:</strong> Draft &rarr; Open ({historyModal.Status})</div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ padding: "6px 16px" }}>
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => setHistoryModal(null)}
                        style={{ fontSize: "11px" }}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
