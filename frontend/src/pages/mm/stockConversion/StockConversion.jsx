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
    FaExchangeAlt
} from "react-icons/fa";
import {
    getStockConversions,
    createStockConversion,
    updateStockConversion,
    deleteStockConversion,
    INITIAL_STOCK_CONVERSIONS
} from "../../../services/stockConversionService";
import "../../../styles/stockConversion.css";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export default function StockConversion() {
    const [conversions, setConversions] = useState(INITIAL_STOCK_CONVERSIONS);
    const [loading, setLoading] = useState(false);
    const [searchSupplier, setSearchSupplier] = useState("");
    const [selectedRowId, setSelectedRowId] = useState(1);
    const [openActionId, setOpenActionId] = useState(null);
    const [showFilterBar, setShowFilterBar] = useState(false);
    const [viewMode, setViewMode] = useState("normal"); // "normal" or "compact"

    // Filter drawer state
    const [filterFromStore, setFilterFromStore] = useState("All");
    const [filterToStore, setFilterToStore] = useState("All");
    const [filterIssuedBy, setFilterIssuedBy] = useState("");
    const [filterReceivedBy, setFilterReceivedBy] = useState("");

    // Modals
    const [showNewModal, setShowNewModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [activeRecord, setActiveRecord] = useState(null);

    // Available Stores
    const STORES_LIST = [
        "RAW MATERIAL STORE 30",
        "STORE_30",
        "STORE 30",
        "RAW MATERIAL STORE 9B",
        "SEMI FINISH STORE 9B",
        "SEMI FINISH STORE 18",
        "FINISHED GOODS STORE"
    ];

    // New Conversion Form State
    const [newForm, setNewForm] = useState({
        ConversionNo: `SC/30/2627/${conversions.length + 1}`,
        ConversionDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        FromStore: "RAW MATERIAL STORE 30",
        ToStore: "RAW MATERIAL STORE 30",
        Currency: "INR",
        ExchangeRate: "1.0",
        Message: "",
        InternalMemo: "",
        IssuedBy: "9b Fabric",
        ReceivedBy: "9b Fabric",
        SupplierName: "",
        items: [
            {
                FromItemCode: "FAB-1001",
                FromItemName: "CANVAS CLOTH 278 GSM 10 OZ GREIGE",
                FromColor: "GREIGE",
                FromUOM: "MTR",
                FromQty: "10.0",
                ToItemCode: "FAB-1002",
                ToItemName: "CANVAS CLOTH 278 GSM 10 OZ DYED",
                ToColor: "NAVY",
                ToUOM: "MTR",
                ToQty: "10.0",
                Remarks: "Greige to dyed fabric conversion"
            }
        ]
    });

    const actionMenuRef = useRef(null);

    // Fetch on Mount
    useEffect(() => {
        loadData();
    }, []);

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
            const data = await getStockConversions();
            if (Array.isArray(data) && data.length > 0) {
                setConversions(data);
            }
        } catch (e) {
            console.warn("Using fallback stock conversions:", e);
        } finally {
            setLoading(false);
        }
    };

    // Filter conversions
    const filteredConversions = useMemo(() => {
        return conversions.filter((item) => {
            const search = searchSupplier.trim().toLowerCase();
            if (search) {
                const matchSupplier = String(item.SupplierName || "").toLowerCase().includes(search);
                const matchNo = String(item.ConversionNo || "").toLowerCase().includes(search);
                const matchFromStore = String(item.FromStore || "").toLowerCase().includes(search);
                const matchToStore = String(item.ToStore || "").toLowerCase().includes(search);
                const matchIssued = String(item.IssuedBy || "").toLowerCase().includes(search);
                const matchReceived = String(item.ReceivedBy || "").toLowerCase().includes(search);
                if (!matchSupplier && !matchNo && !matchFromStore && !matchToStore && !matchIssued && !matchReceived) {
                    return false;
                }
            }

            if (filterFromStore !== "All" && item.FromStore !== filterFromStore) {
                return false;
            }

            if (filterToStore !== "All" && item.ToStore !== filterToStore) {
                return false;
            }

            if (filterIssuedBy.trim() && !String(item.IssuedBy || "").toLowerCase().includes(filterIssuedBy.toLowerCase())) {
                return false;
            }

            if (filterReceivedBy.trim() && !String(item.ReceivedBy || "").toLowerCase().includes(filterReceivedBy.toLowerCase())) {
                return false;
            }

            return true;
        });
    }, [conversions, searchSupplier, filterFromStore, filterToStore, filterIssuedBy, filterReceivedBy]);

    // Handle Add New Row in Form Modal
    const handleAddRow = () => {
        setNewForm((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    FromItemCode: "",
                    FromItemName: "",
                    FromColor: "",
                    FromUOM: "MTR",
                    FromQty: "1",
                    ToItemCode: "",
                    ToItemName: "",
                    ToColor: "",
                    ToUOM: "MTR",
                    ToQty: "1",
                    Remarks: ""
                }
            ]
        }));
    };

    const handleRemoveRow = (idx) => {
        if (newForm.items.length <= 1) return;
        setNewForm((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== idx)
        }));
    };

    const handleItemChange = (idx, field, val) => {
        setNewForm((prev) => {
            const nextItems = [...prev.items];
            nextItems[idx] = { ...nextItems[idx], [field]: val };
            return { ...prev, items: nextItems };
        });
    };

    // Save New Conversion
    const handleSaveNew = async (e) => {
        e.preventDefault();
        const totalQty = newForm.items.reduce((s, it) => s + Number(it.ToQty || it.FromQty || 0), 0);
        const payload = {
            ConversionNo: newForm.ConversionNo,
            ConversionDate: newForm.ConversionDate,
            FromStore: newForm.FromStore,
            ToStore: newForm.ToStore,
            Currency: newForm.Currency,
            ExchangeRate: Number(newForm.ExchangeRate) || 1.0,
            Message: newForm.Message,
            InternalMemo: newForm.InternalMemo,
            IssuedBy: newForm.IssuedBy,
            ReceivedBy: newForm.ReceivedBy,
            SupplierName: newForm.SupplierName,
            TotalQty: totalQty,
            DisplayQty: String(totalQty),
            RowCount: Math.max(newForm.items.length, 1),
            Status: "Completed",
            details: newForm.items
        };

        try {
            await createStockConversion(payload);
        } catch (err) {
            console.warn("Backend save failed, saved locally:", err);
        }

        const newRecord = {
            ...payload,
            ConversionID: Date.now()
        };

        setConversions((prev) => [newRecord, ...prev]);
        setShowNewModal(false);

        // Reset new form with next sequential number
        setNewForm({
            ConversionNo: `SC/30/2627/${conversions.length + 2}`,
            ConversionDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
            FromStore: "RAW MATERIAL STORE 30",
            ToStore: "RAW MATERIAL STORE 30",
            Currency: "INR",
            ExchangeRate: "1.0",
            Message: "",
            InternalMemo: "",
            IssuedBy: "9b Fabric",
            ReceivedBy: "9b Fabric",
            SupplierName: "",
            items: [
                {
                    FromItemCode: "",
                    FromItemName: "",
                    FromColor: "",
                    FromUOM: "MTR",
                    FromQty: "1",
                    ToItemCode: "",
                    ToItemName: "",
                    ToColor: "",
                    ToUOM: "MTR",
                    ToQty: "1",
                    Remarks: ""
                }
            ]
        });

        alert(`Stock Conversion ${payload.ConversionNo} created successfully!`);
    };

    // Delete Conversion
    const handleDelete = async (record) => {
        if (!window.confirm(`Are you sure you want to delete conversion ${record.ConversionNo}?`)) return;
        try {
            await deleteStockConversion(record.ConversionID);
        } catch (e) {}
        setConversions((prev) => prev.filter((r) => (r.ConversionID || r.ConversionNo) !== (record.ConversionID || record.ConversionNo)));
        setOpenActionId(null);
    };

    // Print Voucher
    const handlePrint = (record) => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Stock Conversion Voucher - ${record.ConversionNo}</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 25px; color: #1e293b; }
                        h2 { color: #1a5695; margin-bottom: 4px; }
                        .subtitle { color: #64748b; font-size: 13px; margin-bottom: 20px; }
                        .header-box { border-bottom: 2px solid #2172ba; padding-bottom: 12px; margin-bottom: 20px; }
                        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 13px; margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; font-size: 12.5px; margin-top: 15px; }
                        th { background: #2172ba; color: white; padding: 8px 10px; text-align: left; }
                        td { border: 1px solid #cbd5e1; padding: 8px 10px; }
                        .text-end { text-align: right; }
                        .footer { margin-top: 50px; display: flex; justify-content: space-between; font-size: 13px; }
                    </style>
                </head>
                <body>
                    <div class="header-box">
                        <h2>TPCS FASHION - STOCK CONVERSION VOUCHER</h2>
                        <div class="subtitle">Plot No. 30 | FY 01-Apr-2026 - 31-Mar-2027</div>
                    </div>
                    <div class="info-grid">
                        <div><strong>Conversion No:</strong> ${record.ConversionNo}</div>
                        <div><strong>Date:</strong> ${record.ConversionDate}</div>
                        <div><strong>From Store:</strong> ${record.FromStore}</div>
                        <div><strong>To Store:</strong> ${record.ToStore}</div>
                        <div><strong>Issued By:</strong> ${record.IssuedBy || "-"}</div>
                        <div><strong>Received By:</strong> ${record.ReceivedBy || "-"}</div>
                        <div><strong>Currency / Rate:</strong> ${record.Currency || "INR"} (${Number(record.ExchangeRate || 1.0).toFixed(1)})</div>
                        <div><strong>Supplier:</strong> ${record.SupplierName || "-"}</div>
                        <div><strong>Total Qty:</strong> ${record.DisplayQty || record.TotalQty}</div>
                        <div><strong>Internal Memo:</strong> ${record.InternalMemo || "-"}</div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>From Item</th>
                                <th>From UOM</th>
                                <th class="text-end">From Qty</th>
                                <th>To Item</th>
                                <th>To UOM</th>
                                <th class="text-end">To Qty</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(record.details || []).map((d, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${d.FromItemCode ? `[${d.FromItemCode}] ` : ""}${d.FromItemName || "-"}</td>
                                    <td>${d.FromUOM || "MTR"}</td>
                                    <td class="text-end">${d.FromQty}</td>
                                    <td>${d.ToItemCode ? `[${d.ToItemCode}] ` : ""}${d.ToItemName || "-"}</td>
                                    <td>${d.ToUOM || "MTR"}</td>
                                    <td class="text-end">${d.ToQty}</td>
                                    <td>${d.Remarks || "-"}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>

                    <div class="footer">
                        <div>Issued By: ________________</div>
                        <div>Received By: ________________</div>
                        <div>Store Manager: ________________</div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 350);
        setOpenActionId(null);
    };

    return (
        <div className="stock-conversion-page">
            {/* PAGE TITLE */}
            <h1 className="sc-page-title">Stock Conversion</h1>

            {/* TOP CRITERIA / SEARCH & NEW BUTTON */}
            <div className="sc-top-row">
                <div className="sc-search-group">
                    <label className="sc-search-label">Supplier Name</label>
                    <input
                        type="text"
                        className="sc-search-input"
                        placeholder="Supplier Search..."
                        value={searchSupplier}
                        onChange={(e) => setSearchSupplier(e.target.value)}
                    />
                </div>

                <button
                    type="button"
                    className="sc-btn-new"
                    onClick={() => setShowNewModal(true)}
                >
                    <FaPlus /> New Stock Conversion
                </button>
            </div>

            {/* TOOLBAR ROW (Refresh, List, Settings, Filter, Page Badge) */}
            <div className="sc-toolbar-row">
                <div className="sc-toolbar-actions">
                    <button
                        type="button"
                        className="sc-tool-btn"
                        title="Reload"
                        onClick={loadData}
                    >
                        <FaSyncAlt />
                    </button>

                    <button
                        type="button"
                        className="sc-tool-btn"
                        title="Toggle View Density"
                        onClick={() => setViewMode((prev) => (prev === "normal" ? "compact" : "normal"))}
                    >
                        <FaBars />
                    </button>

                    <button
                        type="button"
                        className="sc-tool-btn"
                        title="Settings"
                        onClick={() => alert("Columns configured per TPCS Fashion Stock Conversion standard.")}
                    >
                        <FaCog />
                    </button>

                    <button
                        type="button"
                        className={`sc-tool-btn sc-tool-btn-filter ${showFilterBar ? "active" : ""}`}
                        onClick={() => setShowFilterBar((prev) => !prev)}
                    >
                        <FaFilter /> Filter <FaCaretDown />
                    </button>
                </div>

                <div className="sc-page-badge" title="Page 1">
                    1
                </div>
            </div>

            {/* EXPANDABLE FILTER DRAWER */}
            {showFilterBar && (
                <div className="sc-filter-card">
                    <div className="sc-filter-item">
                        <label className="sc-filter-label">From Store</label>
                        <select
                            className="sc-filter-select"
                            value={filterFromStore}
                            onChange={(e) => setFilterFromStore(e.target.value)}
                        >
                            <option value="All">All Stores</option>
                            {STORES_LIST.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="sc-filter-item">
                        <label className="sc-filter-label">To Store</label>
                        <select
                            className="sc-filter-select"
                            value={filterToStore}
                            onChange={(e) => setFilterToStore(e.target.value)}
                        >
                            <option value="All">All Stores</option>
                            {STORES_LIST.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="sc-filter-item">
                        <label className="sc-filter-label">Issued By</label>
                        <input
                            type="text"
                            className="sc-filter-select"
                            placeholder="e.g. 9b Fabric"
                            value={filterIssuedBy}
                            onChange={(e) => setFilterIssuedBy(e.target.value)}
                        />
                    </div>

                    <div className="sc-filter-item">
                        <label className="sc-filter-label">Received By</label>
                        <input
                            type="text"
                            className="sc-filter-select"
                            placeholder="e.g. 9b Fabric"
                            value={filterReceivedBy}
                            onChange={(e) => setFilterReceivedBy(e.target.value)}
                        />
                    </div>

                    <button
                        type="button"
                        className="sc-filter-btn-reset"
                        onClick={() => {
                            setFilterFromStore("All");
                            setFilterToStore("All");
                            setFilterIssuedBy("");
                            setFilterReceivedBy("");
                            setSearchSupplier("");
                        }}
                    >
                        Reset
                    </button>

                    <button
                        type="button"
                        className="sc-filter-btn-apply"
                        onClick={() => setShowFilterBar(false)}
                    >
                        Apply Filter
                    </button>
                </div>
            )}

            {/* DATA TABLE MATCHING SCREENSHOT EXACTLY */}
            <div className="sc-table-container">
                <table className={`sc-table ${viewMode === "compact" ? "table-sm" : ""}`}>
                    <thead>
                        <tr>
                            <th style={{ width: "85px" }} className="text-center">Action</th>
                            <th style={{ width: "140px" }}>Stock Conversion No</th>
                            <th style={{ width: "100px" }}>Date</th>
                            <th style={{ width: "160px" }}>From Store</th>
                            <th style={{ width: "160px" }}>To Store</th>
                            <th style={{ width: "75px" }}>Currency</th>
                            <th style={{ width: "95px" }} className="text-end">Exchange Rate</th>
                            <th style={{ width: "180px" }}>Message displayed in Stock Conversion</th>
                            <th style={{ width: "150px" }}>Memo for internal use</th>
                            <th style={{ width: "95px" }}>Issued By</th>
                            <th style={{ width: "95px" }}>Received By</th>
                            <th style={{ width: "100px" }}>Supplier</th>
                            <th style={{ width: "85px" }} className="text-end">Qty</th>
                            <th style={{ width: "80px" }} className="text-end">No. of rows</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredConversions.length === 0 ? (
                            <tr>
                                <td colSpan="14" className="sc-empty-state">
                                    No Stock Conversion records found.
                                </td>
                            </tr>
                        ) : (
                            filteredConversions.map((row, index) => {
                                const rowKey = row.ConversionID || row.ConversionNo || index;
                                const isSelected = selectedRowId === rowKey || selectedRowId === row.ConversionID;

                                return (
                                    <tr
                                        key={rowKey}
                                        className={isSelected ? "selected-row" : ""}
                                        onClick={() => setSelectedRowId(rowKey)}
                                    >
                                        {/* ACTION DROPDOWN BUTTON */}
                                        <td className="text-center" onClick={(e) => e.stopPropagation()}>
                                            <div
                                                className="sc-action-btn-wrap"
                                                ref={openActionId === rowKey ? actionMenuRef : null}
                                            >
                                                <button
                                                    type="button"
                                                    className="sc-action-btn"
                                                    onClick={() => setOpenActionId(openActionId === rowKey ? null : rowKey)}
                                                >
                                                    Action <FaCaretDown />
                                                </button>

                                                {openActionId === rowKey && (
                                                    <div className="sc-action-menu">
                                                        <button
                                                            type="button"
                                                            className="sc-action-item"
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
                                                            className="sc-action-item"
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
                                                            className="sc-action-item"
                                                            onClick={() => handlePrint(row)}
                                                        >
                                                            <FaPrint className="text-success" /> Print Voucher
                                                        </button>

                                                        <div style={{ height: "1px", background: "#e2e8f0", margin: "3px 0" }} />

                                                        <button
                                                            type="button"
                                                            className="sc-action-item danger text-danger"
                                                            onClick={() => handleDelete(row)}
                                                        >
                                                            <FaTrash /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* STOCK CONVERSION NO */}
                                        <td>
                                            <span
                                                className="sc-doc-no"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveRecord(row);
                                                    setShowDetailModal(true);
                                                }}
                                            >
                                                {row.ConversionNo}
                                            </span>
                                        </td>

                                        {/* DATE */}
                                        <td>{row.ConversionDate || ""}</td>

                                        {/* FROM STORE */}
                                        <td>{row.FromStore || ""}</td>

                                        {/* TO STORE */}
                                        <td>{row.ToStore || ""}</td>

                                        {/* CURRENCY */}
                                        <td>{row.Currency || "INR"}</td>

                                        {/* EXCHANGE RATE */}
                                        <td className="text-end">
                                            {Number(row.ExchangeRate || 1.0).toFixed(1)}
                                        </td>

                                        {/* MESSAGE DISPLAYED IN STOCK CONVERSION */}
                                        <td>{row.Message || ""}</td>

                                        {/* MEMO FOR INTERNAL USE */}
                                        <td>{row.InternalMemo || ""}</td>

                                        {/* ISSUED BY */}
                                        <td>{row.IssuedBy || ""}</td>

                                        {/* RECEIVED BY */}
                                        <td>{row.ReceivedBy || ""}</td>

                                        {/* SUPPLIER */}
                                        <td>{row.SupplierName || ""}</td>

                                        {/* QTY */}
                                        <td className="text-end">
                                            {row.DisplayQty !== undefined
                                                ? row.DisplayQty
                                                : (Number(row.TotalQty) < 0.0001 && Number(row.TotalQty) > 0 ? "1.0E-8" : row.TotalQty)}
                                        </td>

                                        {/* NO. OF ROWS */}
                                        <td className="text-end">
                                            {row.RowCount || (row.details ? row.details.length : 1)}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* ================================================================= */}
            {/* MODAL: NEW STOCK CONVERSION */}
            {/* ================================================================= */}
            {showNewModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="sc-modal-header">
                                <h5 className="sc-modal-title">New Stock Conversion</h5>
                                <button
                                    type="button"
                                    className="sc-modal-close"
                                    onClick={() => setShowNewModal(false)}
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <form onSubmit={handleSaveNew}>
                                <div className="sc-modal-body">
                                    <div className="sc-form-grid">
                                        <div className="sc-form-group">
                                            <label className="sc-form-label">
                                                Stock Conversion No <span className="req">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="sc-form-control"
                                                value={newForm.ConversionNo}
                                                onChange={(e) => setNewForm({ ...newForm, ConversionNo: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="sc-form-group">
                                            <label className="sc-form-label">
                                                Date <span className="req">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="sc-form-control"
                                                value={newForm.ConversionDate}
                                                onChange={(e) => setNewForm({ ...newForm, ConversionDate: e.target.value })}
                                                placeholder="DD-MM-YYYY"
                                                required
                                            />
                                        </div>

                                        <div className="sc-form-group">
                                            <label className="sc-form-label">
                                                From Store <span className="req">*</span>
                                            </label>
                                            <select
                                                className="sc-form-control"
                                                value={newForm.FromStore}
                                                onChange={(e) => setNewForm({ ...newForm, FromStore: e.target.value })}
                                                required
                                            >
                                                {STORES_LIST.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="sc-form-group">
                                            <label className="sc-form-label">
                                                To Store <span className="req">*</span>
                                            </label>
                                            <select
                                                className="sc-form-control"
                                                value={newForm.ToStore}
                                                onChange={(e) => setNewForm({ ...newForm, ToStore: e.target.value })}
                                                required
                                            >
                                                {STORES_LIST.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="sc-form-group">
                                            <label className="sc-form-label">Issued By</label>
                                            <input
                                                type="text"
                                                className="sc-form-control"
                                                value={newForm.IssuedBy}
                                                onChange={(e) => setNewForm({ ...newForm, IssuedBy: e.target.value })}
                                                placeholder="e.g. 9b Fabric"
                                            />
                                        </div>

                                        <div className="sc-form-group">
                                            <label className="sc-form-label">Received By</label>
                                            <input
                                                type="text"
                                                className="sc-form-control"
                                                value={newForm.ReceivedBy}
                                                onChange={(e) => setNewForm({ ...newForm, ReceivedBy: e.target.value })}
                                                placeholder="e.g. 9b Fabric"
                                            />
                                        </div>

                                        <div className="sc-form-group">
                                            <label className="sc-form-label">Currency</label>
                                            <input
                                                type="text"
                                                className="sc-form-control"
                                                value={newForm.Currency}
                                                onChange={(e) => setNewForm({ ...newForm, Currency: e.target.value })}
                                            />
                                        </div>

                                        <div className="sc-form-group">
                                            <label className="sc-form-label">Exchange Rate</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="sc-form-control"
                                                value={newForm.ExchangeRate}
                                                onChange={(e) => setNewForm({ ...newForm, ExchangeRate: e.target.value })}
                                            />
                                        </div>

                                        <div className="sc-form-group" style={{ gridColumn: "span 2" }}>
                                            <label className="sc-form-label">Message displayed in Stock Conversion</label>
                                            <input
                                                type="text"
                                                className="sc-form-control"
                                                value={newForm.Message}
                                                onChange={(e) => setNewForm({ ...newForm, Message: e.target.value })}
                                                placeholder="Optional public note..."
                                            />
                                        </div>

                                        <div className="sc-form-group" style={{ gridColumn: "span 2" }}>
                                            <label className="sc-form-label">Memo for internal use</label>
                                            <input
                                                type="text"
                                                className="sc-form-control"
                                                value={newForm.InternalMemo}
                                                onChange={(e) => setNewForm({ ...newForm, InternalMemo: e.target.value })}
                                                placeholder="Optional internal remark..."
                                            />
                                        </div>
                                    </div>

                                    {/* CONVERSION ITEMS TABLE */}
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="mb-0 text-primary font-weight-bold">
                                            <FaExchangeAlt className="me-2" /> Conversion Item Details
                                        </h6>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-success"
                                            onClick={handleAddRow}
                                        >
                                            <FaPlus /> Add Item Row
                                        </button>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="sc-items-table">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "35px" }}>#</th>
                                                    <th>From Item Code</th>
                                                    <th>From Item Description</th>
                                                    <th>From UOM</th>
                                                    <th style={{ width: "90px" }}>From Qty</th>
                                                    <th>To Item Code</th>
                                                    <th>To Item Description</th>
                                                    <th>To UOM</th>
                                                    <th style={{ width: "90px" }}>To Qty</th>
                                                    <th>Remarks</th>
                                                    <th style={{ width: "40px" }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {newForm.items.map((row, idx) => (
                                                    <tr key={idx}>
                                                        <td className="text-center">{idx + 1}</td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. FAB-1001"
                                                                value={row.FromItemCode}
                                                                onChange={(e) => handleItemChange(idx, "FromItemCode", e.target.value)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. CANVAS CLOTH GREIGE"
                                                                value={row.FromItemName}
                                                                onChange={(e) => handleItemChange(idx, "FromItemName", e.target.value)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={row.FromUOM}
                                                                onChange={(e) => handleItemChange(idx, "FromUOM", e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                step="any"
                                                                value={row.FromQty}
                                                                onChange={(e) => handleItemChange(idx, "FromQty", e.target.value)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. FAB-1002"
                                                                value={row.ToItemCode}
                                                                onChange={(e) => handleItemChange(idx, "ToItemCode", e.target.value)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. CANVAS CLOTH DYED NAVY"
                                                                value={row.ToItemName}
                                                                onChange={(e) => handleItemChange(idx, "ToItemName", e.target.value)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={row.ToUOM}
                                                                onChange={(e) => handleItemChange(idx, "ToUOM", e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                step="any"
                                                                value={row.ToQty}
                                                                onChange={(e) => handleItemChange(idx, "ToQty", e.target.value)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                placeholder="Notes"
                                                                value={row.Remarks}
                                                                onChange={(e) => handleItemChange(idx, "Remarks", e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="text-center">
                                                            {newForm.items.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm text-danger p-0"
                                                                    onClick={() => handleRemoveRow(idx)}
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="sc-modal-footer">
                                    <button
                                        type="button"
                                        className="sc-btn-cancel"
                                        onClick={() => setShowNewModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="sc-btn-save"
                                    >
                                        <FaCheck className="me-1" /> Create Stock Conversion
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ================================================================= */}
            {/* MODAL: VIEW DETAILS */}
            {/* ================================================================= */}
            {showDetailModal && activeRecord && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="sc-modal-header">
                                <h5 className="sc-modal-title">
                                    Stock Conversion - {activeRecord.ConversionNo}
                                </h5>
                                <button
                                    type="button"
                                    className="sc-modal-close"
                                    onClick={() => setShowDetailModal(false)}
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="sc-modal-body">
                                <div className="sc-detail-header-card">
                                    <div><span className="sc-detail-label">Conversion No:</span><span className="sc-detail-val">{activeRecord.ConversionNo}</span></div>
                                    <div><span className="sc-detail-label">Date:</span><span className="sc-detail-val">{activeRecord.ConversionDate}</span></div>
                                    <div><span className="sc-detail-label">From Store:</span><span className="sc-detail-val">{activeRecord.FromStore}</span></div>
                                    <div><span className="sc-detail-label">To Store:</span><span className="sc-detail-val">{activeRecord.ToStore}</span></div>
                                    <div><span className="sc-detail-label">Issued By:</span><span className="sc-detail-val">{activeRecord.IssuedBy || "-"}</span></div>
                                    <div><span className="sc-detail-label">Received By:</span><span className="sc-detail-val">{activeRecord.ReceivedBy || "-"}</span></div>
                                    <div><span className="sc-detail-label">Currency / Rate:</span><span className="sc-detail-val">{activeRecord.Currency || "INR"} ({Number(activeRecord.ExchangeRate || 1.0).toFixed(1)})</span></div>
                                    <div><span className="sc-detail-label">Total Qty:</span><span className="sc-detail-val font-weight-bold text-primary">{activeRecord.DisplayQty || activeRecord.TotalQty}</span></div>
                                    <div><span className="sc-detail-label">Supplier:</span><span className="sc-detail-val">{activeRecord.SupplierName || "-"}</span></div>
                                    <div><span className="sc-detail-label">Internal Memo:</span><span className="sc-detail-val">{activeRecord.InternalMemo || "-"}</span></div>
                                </div>

                                <h6 className="text-secondary font-weight-bold mb-2">Item Conversions</h6>
                                <div className="table-responsive">
                                    <table className="sc-items-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>From Item</th>
                                                <th>From UOM</th>
                                                <th className="text-end">From Qty</th>
                                                <th>To Item</th>
                                                <th>To UOM</th>
                                                <th className="text-end">To Qty</th>
                                                <th>Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activeRecord.details && activeRecord.details.length > 0 ? (
                                                activeRecord.details.map((d, i) => (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td><strong>{d.FromItemCode || ""}</strong> {d.FromItemName || ""}</td>
                                                        <td>{d.FromUOM || "PCS"}</td>
                                                        <td className="text-end">{d.FromQty}</td>
                                                        <td><strong>{d.ToItemCode || ""}</strong> {d.ToItemName || ""}</td>
                                                        <td>{d.ToUOM || "PCS"}</td>
                                                        <td className="text-end font-weight-bold">{d.ToQty}</td>
                                                        <td>{d.Remarks || "-"}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="text-center text-muted">
                                                        Standard Conversion: Qty {activeRecord.DisplayQty || activeRecord.TotalQty}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="sc-modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-outline-success"
                                    onClick={() => handlePrint(activeRecord)}
                                >
                                    <FaPrint className="me-1" /> Print Voucher
                                </button>
                                <button
                                    type="button"
                                    className="sc-btn-cancel"
                                    onClick={() => setShowDetailModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================================================================= */}
            {/* MODAL: EDIT STOCK CONVERSION */}
            {/* ================================================================= */}
            {showEditModal && activeRecord && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="sc-modal-header">
                                <h5 className="sc-modal-title">
                                    Edit Stock Conversion - {activeRecord.ConversionNo}
                                </h5>
                                <button
                                    type="button"
                                    className="sc-modal-close"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="sc-modal-body">
                                <div className="sc-form-grid">
                                    <div className="sc-form-group">
                                        <label className="sc-form-label">From Store</label>
                                        <select
                                            className="sc-form-control"
                                            value={activeRecord.FromStore}
                                            onChange={(e) => setActiveRecord({ ...activeRecord, FromStore: e.target.value })}
                                        >
                                            {STORES_LIST.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="sc-form-group">
                                        <label className="sc-form-label">To Store</label>
                                        <select
                                            className="sc-form-control"
                                            value={activeRecord.ToStore}
                                            onChange={(e) => setActiveRecord({ ...activeRecord, ToStore: e.target.value })}
                                        >
                                            {STORES_LIST.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="sc-form-group">
                                        <label className="sc-form-label">Issued By</label>
                                        <input
                                            type="text"
                                            className="sc-form-control"
                                            value={activeRecord.IssuedBy || ""}
                                            onChange={(e) => setActiveRecord({ ...activeRecord, IssuedBy: e.target.value })}
                                        />
                                    </div>

                                    <div className="sc-form-group">
                                        <label className="sc-form-label">Received By</label>
                                        <input
                                            type="text"
                                            className="sc-form-control"
                                            value={activeRecord.ReceivedBy || ""}
                                            onChange={(e) => setActiveRecord({ ...activeRecord, ReceivedBy: e.target.value })}
                                        />
                                    </div>

                                    <div className="sc-form-group">
                                        <label className="sc-form-label">Total Qty</label>
                                        <input
                                            type="text"
                                            className="sc-form-control"
                                            value={activeRecord.DisplayQty || activeRecord.TotalQty || ""}
                                            onChange={(e) => setActiveRecord({
                                                ...activeRecord,
                                                TotalQty: Number(e.target.value) || 0,
                                                DisplayQty: e.target.value
                                            })}
                                        />
                                    </div>

                                    <div className="sc-form-group">
                                        <label className="sc-form-label">Message</label>
                                        <input
                                            type="text"
                                            className="sc-form-control"
                                            value={activeRecord.Message || ""}
                                            onChange={(e) => setActiveRecord({ ...activeRecord, Message: e.target.value })}
                                        />
                                    </div>

                                    <div className="sc-form-group" style={{ gridColumn: "span 2" }}>
                                        <label className="sc-form-label">Internal Memo</label>
                                        <input
                                            type="text"
                                            className="sc-form-control"
                                            value={activeRecord.InternalMemo || ""}
                                            onChange={(e) => setActiveRecord({ ...activeRecord, InternalMemo: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sc-modal-footer">
                                <button
                                    type="button"
                                    className="sc-btn-cancel"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="sc-btn-save"
                                    onClick={async () => {
                                        try {
                                            await updateStockConversion(activeRecord.ConversionID, activeRecord);
                                        } catch (e) {}
                                        setConversions((prev) =>
                                            prev.map((c) =>
                                                (c.ConversionID === activeRecord.ConversionID ? activeRecord : c)
                                            )
                                        );
                                        setShowEditModal(false);
                                        alert("Stock conversion updated successfully!");
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
