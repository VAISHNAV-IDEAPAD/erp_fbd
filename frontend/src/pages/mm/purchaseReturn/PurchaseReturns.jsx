import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Table, Modal, Button, Spinner, Alert } from "react-bootstrap";
import {
    FaPlus,
    FaSyncAlt,
    FaListUl,
    FaCog,
    FaFilter,
    FaChevronDown,
    FaEye,
    FaTimes,
    FaBan
} from "react-icons/fa";
import axios from "axios";
import TypeaheadDropdown from "../../../components/common/TypeaheadDropdown";
import "../../../styles/indentsList.css";
import "../../../styles/purchaseReturn.css";

const STATUS_OPTIONS = ["All", "Completed", "Cancelled"];

const emptyRow = () => ({ ItemID: null, ItemCode: "", ItemName: "", Quantity: "", UOM: "", Rate: "", Reason: "" });

const today = () => new Date().toISOString().substring(0, 10);

export default function PurchaseReturns() {
    // List state
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    // Filters
    const [supplierFilter, setSupplierFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [searchText, setSearchText] = useState("");
    const [showFilter, setShowFilter] = useState(false);

    // Lookups
    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([]);

    // Row action menu
    const [activeActionRow, setActiveActionRow] = useState(null);
    const actionMenuRef = useRef(null);

    // View modal
    const [viewReturn, setViewReturn] = useState(null);

    // New return modal
    const [showNew, setShowNew] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState(null);
    const [nextNo, setNextNo] = useState("");
    const [form, setForm] = useState({ ReturnDate: today(), SupplierName: "", SupplierID: null, InvoiceNo: "", Remarks: "" });
    const [rows, setRows] = useState([emptyRow()]);

    const loadReturns = useCallback(async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const params = { status: statusFilter };
            if (supplierFilter.trim()) params.supplier = supplierFilter.trim();
            if (searchText.trim()) params.search = searchText.trim();
            const res = await axios.get("/api/purchase-returns", { params });
            setReturns(res.data?.data || []);
        } catch (err) {
            console.error("Purchase return load error:", err);
            setErrorMsg(err.response?.data?.message || "Failed to load purchase returns.");
            setReturns([]);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, supplierFilter, searchText]);

    useEffect(() => {
        loadReturns();
    }, [loadReturns]);

    useEffect(() => {
        axios.get("/api/suppliers").then((res) => setSuppliers(res.data?.data || [])).catch(() => {});
        axios.get("/api/items?limit=5000").then((res) => setItems(res.data?.data || [])).catch(() => {});
    }, []);

    // Close the row action menu on outside click
    useEffect(() => {
        const onDown = (e) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
                setActiveActionRow(null);
            }
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    const supplierOptions = useMemo(
        () => suppliers.map((s) => s.SupplierName || s.name || s),
        [suppliers]
    );

    const itemByName = useMemo(() => {
        const map = new Map();
        items.forEach((it) => {
            if (it.ItemName && !map.has(it.ItemName)) map.set(it.ItemName, it);
        });
        return map;
    }, [items]);

    const itemOptions = useMemo(() => [...itemByName.keys()], [itemByName]);

    // ---------------------------------------------------------------
    // Row actions
    // ---------------------------------------------------------------
    const handleView = async (row) => {
        setActiveActionRow(null);
        try {
            const res = await axios.get(`/api/purchase-returns/${row.ReturnID}`);
            setViewReturn(res.data?.data || row);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to load purchase return.");
        }
    };

    const handleCancel = async (row) => {
        setActiveActionRow(null);
        if (!window.confirm(`Cancel purchase return ${row.ReturnNo}?`)) return;
        try {
            await axios.patch(`/api/purchase-returns/${row.ReturnID}/cancel`);
            loadReturns();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to cancel purchase return.");
        }
    };

    // ---------------------------------------------------------------
    // New purchase return
    // ---------------------------------------------------------------
    const openNew = async () => {
        setForm({ ReturnDate: today(), SupplierName: "", SupplierID: null, InvoiceNo: "", Remarks: "" });
        setRows([emptyRow()]);
        setFormError(null);
        setShowNew(true);
        try {
            const res = await axios.get("/api/purchase-returns/next-number");
            setNextNo(res.data?.fullReturnNo || "");
        } catch {
            setNextNo("");
        }
    };

    const setSupplier = (name) => {
        const match = suppliers.find((s) => (s.SupplierName || s.name) === name);
        setForm((f) => ({ ...f, SupplierName: name, SupplierID: match?.SupplierID || null }));
    };

    const updateRow = (idx, patch) => {
        setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
    };

    const pickItem = (idx, name) => {
        const it = itemByName.get(name);
        if (it) {
            updateRow(idx, {
                ItemID: it.ItemID || null,
                ItemCode: it.ItemCode || "",
                ItemName: it.ItemName,
                UOM: it.UOM || it.Unit || "",
                Rate: it.Rate != null && it.Rate !== "" ? it.Rate : ""
            });
        } else {
            updateRow(idx, { ItemID: null, ItemCode: "", ItemName: name });
        }
    };

    const totalQty = rows.reduce((sum, r) => sum + (Number(r.Quantity) || 0), 0);

    const handleSave = async () => {
        setFormError(null);
        if (!form.SupplierName.trim()) {
            setFormError("Please select a supplier.");
            return;
        }
        const details = rows.filter((r) => r.ItemName.trim() && Number(r.Quantity) > 0);
        if (details.length === 0) {
            setFormError("Add at least one item with a quantity greater than 0.");
            return;
        }

        setSaving(true);
        try {
            await axios.post("/api/purchase-returns", { ...form, details });
            setShowNew(false);
            loadReturns();
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to save purchase return.");
        } finally {
            setSaving(false);
        }
    };

    const COLS = 11;

    return (
        <div className="ind-erp-page">
            <h1 className="ind-erp-title">Purchase Return</h1>

            {/* Filters */}
            <div className="ind-filter-bar">
                <div className="ind-filter-group" style={{ width: "230px" }}>
                    <label className="ind-filter-label">Supplier</label>
                    <TypeaheadDropdown
                        placeholder="Customer Search..."
                        value={supplierFilter}
                        onChange={(val) => setSupplierFilter(val)}
                        options={supplierOptions}
                        dropdownWidth="280px"
                    />
                </div>

                <div className="ind-filter-group">
                    <label className="ind-filter-label">Status</label>
                    <select
                        className="ind-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ width: "160px" }}
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <button type="button" className="ind-btn-new" onClick={openNew}>
                    <FaPlus size={11} /> New Purchase Return
                </button>
            </div>

            {/* Toolbar */}
            <div className="ind-sub-toolbar">
                <div className="ind-toolbar-icons">
                    <button type="button" className="ind-icon-btn" title="Refresh" onClick={loadReturns}>
                        <FaSyncAlt size={11} />
                    </button>
                    <button
                        type="button"
                        className="ind-icon-btn"
                        title="Summary"
                        onClick={() => alert(`Purchase returns listed: ${returns.length}`)}
                    >
                        <FaListUl size={11} />
                    </button>
                    <button
                        type="button"
                        className="ind-icon-btn"
                        title="Settings"
                        onClick={() => alert("Purchase Return Settings: Active financial year 2026-2027.")}
                    >
                        <FaCog size={12} />
                    </button>
                    <button type="button" className="ind-filter-btn" onClick={() => setShowFilter((v) => !v)}>
                        <FaFilter size={10} /> Filter <FaChevronDown size={8} />
                    </button>
                </div>
            </div>

            {showFilter && (
                <div className="prt-filter-panel">
                    <label className="ind-filter-label" style={{ margin: 0 }}>Search</label>
                    <input
                        type="text"
                        className="ind-filter-input"
                        style={{ width: "260px" }}
                        placeholder="Return No / Invoice No / Remarks"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            )}

            {errorMsg && (
                <Alert variant="danger" className="py-1 px-3 mb-2" style={{ fontSize: "11px" }}>
                    {errorMsg}
                </Alert>
            )}

            {/* Grid */}
            <div className="table-responsive" style={{ minHeight: "400px" }}>
                <Table hover size="sm" className="ind-ribbon-table text-nowrap">
                    <thead>
                        <tr>
                            <th style={{ width: "80px" }}>Action</th>
                            <th>Return No</th>
                            <th>Date</th>
                            <th>Supplier</th>
                            <th>Invoice No</th>
                            <th>Entered By</th>
                            <th>Entered On</th>
                            <th>Updated By</th>
                            <th>Updated On</th>
                            <th className="text-end">Qty</th>
                            <th className="text-end">No. of rows</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={COLS} className="text-center py-5">
                                    <Spinner animation="border" size="sm" className="me-2 text-primary" />
                                    Loading Purchase Returns...
                                </td>
                            </tr>
                        ) : returns.length === 0 ? (
                            <tr>
                                <td colSpan={COLS} className="text-center py-5 text-muted">
                                    No purchase returns found. Click <strong>+ New Purchase Return</strong> to create one.
                                </td>
                            </tr>
                        ) : (
                            returns.map((row) => (
                                <tr key={row.ReturnID} className={row.Status === "Cancelled" ? "prt-cancelled" : ""}>
                                    <td className="text-center" style={{ overflow: "visible", position: "relative" }}>
                                        <div className="ind-action-container">
                                            <button
                                                type="button"
                                                className="ind-action-trigger"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveActionRow(activeActionRow === row.ReturnID ? null : row.ReturnID);
                                                }}
                                            >
                                                Action <FaChevronDown size={8} />
                                            </button>
                                            {activeActionRow === row.ReturnID && (
                                                <div className="ind-action-menu text-start" ref={actionMenuRef}>
                                                    <div className="ind-action-menu-header">Action</div>
                                                    <div className="ind-action-item" onClick={() => handleView(row)}>
                                                        <FaEye size={10} className="text-primary" /> View
                                                    </div>
                                                    {row.Status !== "Cancelled" && (
                                                        <div className="ind-action-item danger" onClick={() => handleCancel(row)}>
                                                            <FaBan size={10} className="text-danger" /> Cancel
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>{row.ReturnNo}</td>
                                    <td>{row.ReturnDate}</td>
                                    <td>{row.SupplierName}</td>
                                    <td>{row.InvoiceNo}</td>
                                    <td>{row.EnteredBy}</td>
                                    <td>{row.EnteredOn}</td>
                                    <td>{row.UpdatedBy}</td>
                                    <td>{row.UpdatedOn}</td>
                                    <td className="text-end">{Number(row.TotalQty || 0)}</td>
                                    <td className="text-end">{row.RowCount || 0}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </div>

            {/* ---------------- NEW PURCHASE RETURN ---------------- */}
            <Modal show={showNew} onHide={() => !saving && setShowNew(false)} size="xl" centered backdrop="static">
                <Modal.Header closeButton style={{ background: "#337ab7", color: "#ffffff", padding: "8px 16px" }}>
                    <Modal.Title style={{ fontSize: "14px", fontWeight: 600 }}>New Purchase Return</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ fontSize: "11.5px" }}>
                    {formError && (
                        <Alert variant="danger" className="py-1 px-3 mb-2" style={{ fontSize: "11px" }}>
                            {formError}
                        </Alert>
                    )}

                    <div className="prt-form-grid">
                        <div>
                            <label className="ind-form-label">Return No</label>
                            <input className="ind-form-input" value={nextNo} readOnly placeholder="Auto" />
                        </div>
                        <div>
                            <label className="ind-form-label">Date</label>
                            <input
                                type="date"
                                className="ind-form-input"
                                value={form.ReturnDate}
                                onChange={(e) => setForm((f) => ({ ...f, ReturnDate: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="ind-form-label">Supplier <span style={{ color: "#d9534f" }}>*</span></label>
                            <TypeaheadDropdown
                                placeholder="Type & Select Supplier"
                                value={form.SupplierName}
                                onChange={setSupplier}
                                options={supplierOptions}
                                dropdownWidth="320px"
                            />
                        </div>
                        <div>
                            <label className="ind-form-label">Invoice No</label>
                            <input
                                className="ind-form-input"
                                value={form.InvoiceNo}
                                onChange={(e) => setForm((f) => ({ ...f, InvoiceNo: e.target.value }))}
                            />
                        </div>
                        <div className="prt-span-all">
                            <label className="ind-form-label">Remarks</label>
                            <input
                                className="ind-form-input"
                                value={form.Remarks}
                                onChange={(e) => setForm((f) => ({ ...f, Remarks: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-end my-2">
                        <button type="button" className="ind-btn-view" onClick={() => setRows((r) => [...r, emptyRow()])}>
                            <FaPlus size={9} /> Add Row
                        </button>
                    </div>

                    <div className="table-responsive" style={{ minHeight: "180px" }}>
                        <Table size="sm" className="ind-ribbon-table prt-items-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "34px" }}>#</th>
                                    <th style={{ width: "340px" }}>Item</th>
                                    <th style={{ width: "110px" }}>Item Code</th>
                                    <th style={{ width: "100px" }}>Qty</th>
                                    <th style={{ width: "80px" }}>UOM</th>
                                    <th style={{ width: "100px" }}>Rate</th>
                                    <th>Reason</th>
                                    <th style={{ width: "34px" }} />
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r, idx) => (
                                    <tr key={idx}>
                                        <td className="text-center">{idx + 1}</td>
                                        <td style={{ overflow: "visible" }}>
                                            <TypeaheadDropdown
                                                placeholder="Type & Select Item"
                                                value={r.ItemName}
                                                onChange={(val) => pickItem(idx, val)}
                                                options={itemOptions}
                                                dropdownWidth="420px"
                                            />
                                        </td>
                                        <td>
                                            <input className="ind-grid-input" value={r.ItemCode} readOnly />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                min="0"
                                                className="ind-grid-input"
                                                value={r.Quantity}
                                                onChange={(e) => updateRow(idx, { Quantity: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="ind-grid-input"
                                                value={r.UOM}
                                                onChange={(e) => updateRow(idx, { UOM: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                min="0"
                                                className="ind-grid-input"
                                                value={r.Rate}
                                                onChange={(e) => updateRow(idx, { Rate: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="ind-grid-input"
                                                value={r.Reason}
                                                onChange={(e) => updateRow(idx, { Reason: e.target.value })}
                                            />
                                        </td>
                                        <td className="text-center">
                                            <button
                                                type="button"
                                                className="prt-remove-btn"
                                                title="Remove row"
                                                disabled={rows.length === 1}
                                                onClick={() => setRows((prev) => prev.filter((_, i) => i !== idx))}
                                            >
                                                <FaTimes size={10} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    <div className="text-end fw-bold" style={{ fontSize: "12px" }}>
                        Total Qty: {totalQty}
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ padding: "6px 16px" }}>
                    <Button variant="light" size="sm" onClick={() => setShowNew(false)} disabled={saving}>
                        Close
                    </Button>
                    <Button
                        size="sm"
                        style={{ background: "#337ab7", borderColor: "#2e6da4", fontSize: "11px" }}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ---------------- VIEW ---------------- */}
            <Modal show={!!viewReturn} onHide={() => setViewReturn(null)} size="lg" centered>
                <Modal.Header closeButton style={{ background: "#337ab7", color: "#ffffff", padding: "8px 16px" }}>
                    <Modal.Title style={{ fontSize: "14px", fontWeight: 600 }}>
                        Purchase Return {viewReturn?.ReturnNo}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ fontSize: "11.5px" }}>
                    {viewReturn && (
                        <>
                            <div className="prt-view-grid">
                                <div><strong>Date:</strong> {viewReturn.ReturnDate}</div>
                                <div><strong>Supplier:</strong> {viewReturn.SupplierName}</div>
                                <div><strong>Invoice No:</strong> {viewReturn.InvoiceNo || "-"}</div>
                                <div><strong>Status:</strong> {viewReturn.Status}</div>
                                <div><strong>Entered:</strong> {viewReturn.EnteredBy} {viewReturn.EnteredOn}</div>
                                <div><strong>Remarks:</strong> {viewReturn.Remarks || "-"}</div>
                            </div>
                            <Table size="sm" className="ind-ribbon-table mt-2">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Item Code</th>
                                        <th>Item</th>
                                        <th className="text-end">Qty</th>
                                        <th>UOM</th>
                                        <th className="text-end">Rate</th>
                                        <th>Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(viewReturn.details || []).map((d, i) => (
                                        <tr key={d.DetailID || i}>
                                            <td>{i + 1}</td>
                                            <td>{d.ItemCode}</td>
                                            <td>{d.ItemName}</td>
                                            <td className="text-end">{d.Quantity}</td>
                                            <td>{d.UOM}</td>
                                            <td className="text-end">{d.Rate}</td>
                                            <td>{d.Reason}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <div className="text-end fw-bold">Total Qty: {Number(viewReturn.TotalQty || 0)}</div>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}
