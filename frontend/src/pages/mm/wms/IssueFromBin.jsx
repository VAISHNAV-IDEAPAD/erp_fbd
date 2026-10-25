import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FaSignOutAlt,
    FaPlus,
    FaSyncAlt,
    FaSearch,
    FaSave,
    FaTrash,
    FaCheckCircle,
    FaArrowLeft,
    FaPrint,
    FaBarcode
} from "react-icons/fa";
import wmsService from "../../../services/wmsService";
import "../../../styles/wms.css";

const DEPARTMENTS = [
    "Cutting Department Line 1",
    "Cutting Department Line 2",
    "Stitching Floor Plot 9B",
    "Assembly Godown",
    "Subcontractor - Bright Leather Finishers",
    "Sampling Unit"
];

const ISSUE_REASONS = [
    "Cutting Slip",
    "Production Floor Issue",
    "Store Transfer",
    "Sample Development",
    "Re-work Replacement"
];

export default function IssueFromBin({ initialMode = "list" }) {
    const [viewMode, setViewMode] = useState(initialMode);
    const [issues, setIssues] = useState([]);
    const [bins, setBins] = useState([]);
    const [rolls, setRolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    // Form fields
    const [issueNo, setIssueNo] = useState("");
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
    const [warehouseName, setWarehouseName] = useState("RAW MATERIAL STORE 9B");
    const [issueReason, setIssueReason] = useState("Cutting Slip");
    const [refDocNo, setRefDocNo] = useState("CS/2627/102");
    const [issuedToDepartment, setIssuedToDepartment] = useState("Cutting Department Line 1");
    const [issuedBy, setIssuedBy] = useState("Tilak");
    const [remarks, setRemarks] = useState("");

    const [rows, setRows] = useState([
        {
            id: 1,
            ItemCode: "FAB-3011",
            ItemName: "COTTON TWILL LINING 120 GSM",
            BinCode: "BIN-B-01-01",
            RollSerialNo: "RL-2627-2001",
            AvailableInBin: 850,
            PickQty: 50,
            UOM: "MTR",
            Remarks: "Issue for Order #4421"
        }
    ]);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3500);
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [issueData, binData, rollData] = await Promise.all([
                wmsService.getBinIssues(),
                wmsService.getBins(),
                wmsService.getRollSerials()
            ]);
            setIssues(issueData);
            setBins(binData);
            setRolls(rollData);
        } catch (e) {
            console.error("Failed to load bin issues:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        setIssueNo(`BI/9B/2627/${String(Date.now()).slice(-4)}`);
    }, []);

    const handleBinSelect = (rowId, binCode) => {
        const bin = bins.find((b) => b.BinCode === binCode);
        const matchingRolls = rolls.filter((r) => r.BinCode === binCode && r.Status !== "Issued");

        setRows((prev) =>
            prev.map((r) => {
                if (r.id === rowId) {
                    return {
                        ...r,
                        BinCode: binCode,
                        AvailableInBin: bin ? bin.CurrentQty : 0,
                        UOM: bin ? bin.UOM : r.UOM,
                        RollSerialNo: matchingRolls.length > 0 ? matchingRolls[0].RollSerialNo : ""
                    };
                }
                return r;
            })
        );
    };

    const handleRowChange = (rowId, field, val) => {
        setRows((prev) =>
            prev.map((r) => (r.id === rowId ? { ...r, [field]: val } : r))
        );
    };

    const handleAddRow = () => {
        const firstBin = bins[0];
        setRows((prev) => [
            ...prev,
            {
                id: Date.now(),
                ItemCode: "LTH-1093",
                ItemName: "COW CULATTAS SINGLE LEATHER",
                BinCode: firstBin ? firstBin.BinCode : "BIN-A-01-01",
                RollSerialNo: "",
                AvailableInBin: firstBin ? firstBin.CurrentQty : 250,
                PickQty: 25,
                UOM: firstBin ? firstBin.UOM : "SQFT",
                Remarks: ""
            }
        ]);
    };

    const handleRemoveRow = (rowId) => {
        if (rows.length === 1) {
            showToast("At least one line item is required");
            return;
        }
        setRows((prev) => prev.filter((r) => r.id !== rowId));
    };

    const handleSaveIssue = async () => {
        // Validation: verify pick quantities
        for (const r of rows) {
            const pick = parseFloat(r.PickQty) || 0;
            if (pick <= 0) {
                showToast(`Pick quantity must be greater than zero for row ${r.BinCode}`);
                return;
            }
            if (pick > r.AvailableInBin) {
                showToast(`Cannot pick ${pick} ${r.UOM} from ${r.BinCode}: Only ${r.AvailableInBin} available`);
                return;
            }
        }

        const payload = {
            IssueNo: issueNo,
            IssueDate: issueDate,
            WarehouseName: warehouseName,
            IssueReason: issueReason,
            RefDocNo: refDocNo,
            IssuedToDepartment: issuedToDepartment,
            IssuedBy: issuedBy,
            Remarks: remarks,
            items: rows.map((r) => ({
                ItemCode: r.ItemCode,
                ItemName: r.ItemName,
                BinCode: r.BinCode,
                RollSerialNo: r.RollSerialNo,
                PickQty: parseFloat(r.PickQty) || 0,
                UOM: r.UOM,
                Remarks: r.Remarks
            }))
        };

        try {
            await wmsService.createBinIssue(payload);
            showToast(`Issue ${issueNo} completed and bin stock updated!`);
            await loadData();
            setViewMode("list");
        } catch (e) {
            showToast("Error processing issue: " + e.message);
        }
    };

    const filteredIssues = issues.filter((iss) => {
        const q = searchTerm.toLowerCase();
        return (
            (iss.IssueNo || "").toLowerCase().includes(q) ||
            (iss.RefDocNo || "").toLowerCase().includes(q) ||
            (iss.IssuedToDepartment || "").toLowerCase().includes(q) ||
            (iss.IssuedBy || "").toLowerCase().includes(q)
        );
    });

    return (
        <div className="wms-container">
            {toastMessage && (
                <div
                    style={{
                        position: "fixed",
                        top: "70px",
                        right: "24px",
                        background: "#004fb6",
                        color: "#fff",
                        padding: "10px 18px",
                        borderRadius: "4px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        zIndex: 9999,
                        fontSize: "13px",
                        fontWeight: 600
                    }}
                >
                    {toastMessage}
                </div>
            )}

            {/* Header */}
            <div className="wms-header">
                <div className="wms-title-section">
                    <FaSignOutAlt className="wms-title-icon" />
                    <div>
                        <h1 className="wms-title">Issue from Bin</h1>
                        <p className="wms-subtitle">
                            Warehouse Picking and Material Issuance from Designated Bins against Cutting Slips & Production Notes
                        </p>
                    </div>
                </div>

                <div className="wms-header-actions">
                    {viewMode === "form" ? (
                        <>
                            <button
                                type="button"
                                className="wms-btn-secondary"
                                onClick={() => setViewMode("list")}
                            >
                                <FaArrowLeft /> View Register
                            </button>
                            <button
                                type="button"
                                className="wms-btn-primary"
                                onClick={handleSaveIssue}
                            >
                                <FaSave /> Confirm & Issue Stock
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            className="wms-btn-primary"
                            onClick={() => {
                                setIssueNo(`BI/9B/2627/${String(Date.now()).slice(-4)}`);
                                setViewMode("form");
                            }}
                        >
                            <FaPlus /> New Issue from Bin
                        </button>
                    )}
                </div>
            </div>

            {/* View Mode: FORM */}
            {viewMode === "form" ? (
                <div className="wms-form-card">
                    <div className="wms-form-header">
                        <div>
                            <span style={{ fontSize: "14px", fontWeight: 700, color: "#004fb6" }}>
                                Bin Pick Note: {issueNo}
                            </span>
                            <span style={{ marginLeft: "12px", fontSize: "12px", color: "#64748b" }}>
                                Source Warehouse: <strong>{warehouseName}</strong>
                            </span>
                        </div>
                    </div>

                    <div className="wms-form-grid">
                        <div className="wms-form-group">
                            <label className="wms-form-label">Issue Document No</label>
                            <input
                                type="text"
                                className="wms-form-input"
                                value={issueNo}
                                readOnly
                                style={{ backgroundColor: "#f8fafc", fontWeight: 600 }}
                            />
                        </div>

                        <div className="wms-form-group">
                            <label className="wms-form-label">Issue Date *</label>
                            <input
                                type="date"
                                className="wms-form-input"
                                value={issueDate}
                                onChange={(e) => setIssueDate(e.target.value)}
                            />
                        </div>

                        <div className="wms-form-group">
                            <label className="wms-form-label">Issuance Reason *</label>
                            <select
                                className="wms-form-select"
                                value={issueReason}
                                onChange={(e) => setIssueReason(e.target.value)}
                            >
                                {ISSUE_REASONS.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="wms-form-group">
                            <label className="wms-form-label">Ref Document No (Cutting Slip / Req)</label>
                            <input
                                type="text"
                                className="wms-form-input"
                                value={refDocNo}
                                onChange={(e) => setRefDocNo(e.target.value)}
                                placeholder="e.g. CS/2627/102"
                            />
                        </div>

                        <div className="wms-form-group">
                            <label className="wms-form-label">Issued To (Floor / Line) *</label>
                            <select
                                className="wms-form-select"
                                value={issuedToDepartment}
                                onChange={(e) => setIssuedToDepartment(e.target.value)}
                            >
                                {DEPARTMENTS.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="wms-form-group">
                            <label className="wms-form-label">Issued By</label>
                            <input
                                type="text"
                                className="wms-form-input"
                                value={issuedBy}
                                onChange={(e) => setIssuedBy(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Pick Line Items Grid */}
                    <div style={{ marginTop: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>
                                Pick Items & Bin Stock Allocation ({rows.length} items)
                            </h4>
                            <button
                                type="button"
                                className="wms-btn-secondary"
                                style={{ padding: "4px 10px", fontSize: "12px" }}
                                onClick={handleAddRow}
                            >
                                <FaPlus /> Add Pick Item
                            </button>
                        </div>

                        <div className="wms-table-responsive" style={{ border: "1px solid #cbd5e1", borderRadius: "4px" }}>
                            <table className="wms-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "40px", textAlign: "center" }}>#</th>
                                        <th style={{ width: "200px" }}>Source Bin *</th>
                                        <th style={{ width: "220px" }}>Item Description</th>
                                        <th style={{ width: "150px" }}>Roll / Serial #</th>
                                        <th style={{ width: "110px", textAlign: "right" }}>Bin Balance</th>
                                        <th style={{ width: "110px", textAlign: "right" }}>Pick Qty *</th>
                                        <th style={{ width: "70px" }}>UOM</th>
                                        <th style={{ width: "110px", textAlign: "right" }}>Balance After</th>
                                        <th>Remarks</th>
                                        <th style={{ width: "50px", textAlign: "center" }}>Del</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, idx) => {
                                        const pickVal = parseFloat(row.PickQty) || 0;
                                        const balanceAfter = Math.max(0, row.AvailableInBin - pickVal);
                                        const isOverpick = pickVal > row.AvailableInBin;

                                        return (
                                            <tr key={row.id}>
                                                <td style={{ textAlign: "center", color: "#64748b" }}>{idx + 1}</td>
                                                <td>
                                                    <select
                                                        className="wms-form-select"
                                                        value={row.BinCode}
                                                        onChange={(e) => handleBinSelect(row.id, e.target.value)}
                                                        style={{ width: "100%", fontSize: "12px", fontWeight: 600 }}
                                                    >
                                                        {bins.map((b) => (
                                                            <option key={b.BinID} value={b.BinCode}>
                                                                {b.BinCode} ({b.CurrentQty} {b.UOM} in stock)
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="wms-form-input"
                                                        value={row.ItemName}
                                                        onChange={(e) => handleRowChange(row.id, "ItemName", e.target.value)}
                                                        style={{ fontSize: "12px" }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="wms-form-input"
                                                        value={row.RollSerialNo}
                                                        onChange={(e) => handleRowChange(row.id, "RollSerialNo", e.target.value)}
                                                        placeholder="RL-2627-XXXX"
                                                        style={{ fontSize: "12px" }}
                                                    />
                                                </td>
                                                <td style={{ textAlign: "right", fontWeight: 600, color: "#334155" }}>
                                                    {row.AvailableInBin}
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="wms-form-input"
                                                        style={{
                                                            textAlign: "right",
                                                            fontSize: "12px",
                                                            borderColor: isOverpick ? "#ef4444" : "#cbd5e1"
                                                        }}
                                                        value={row.PickQty}
                                                        onChange={(e) => handleRowChange(row.id, "PickQty", e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>
                                                        {row.UOM}
                                                    </span>
                                                </td>
                                                <td
                                                    style={{
                                                        textAlign: "right",
                                                        fontWeight: 700,
                                                        color: isOverpick ? "#ef4444" : "#059669"
                                                    }}
                                                >
                                                    {isOverpick ? "Insufficient" : balanceAfter}
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="wms-form-input"
                                                        placeholder="Issue note"
                                                        value={row.Remarks}
                                                        onChange={(e) => handleRowChange(row.id, "Remarks", e.target.value)}
                                                        style={{ fontSize: "12px" }}
                                                    />
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveRow(row.id)}
                                                        style={{ border: "none", background: "none", color: "#ef4444", cursor: "pointer" }}
                                                        title="Remove Row"
                                                    >
                                                        <FaTrash style={{ fontSize: "12px" }} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <button
                            type="button"
                            className="wms-btn-secondary"
                            onClick={() => setViewMode("list")}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="wms-btn-primary"
                            onClick={handleSaveIssue}
                        >
                            <FaSave /> Confirm & Deduct Bin Stock
                        </button>
                    </div>
                </div>
            ) : (
                /* View Mode: REGISTER */
                <>
                    <div className="wms-toolbar">
                        <div className="wms-toolbar-left">
                            <div className="wms-search-input-wrap">
                                <FaSearch className="wms-search-icon" />
                                <input
                                    type="text"
                                    className="wms-search-input"
                                    placeholder="Search issue #, cutting slip, dept..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                className="wms-btn-secondary"
                                onClick={loadData}
                                title="Reload"
                            >
                                <FaSyncAlt />
                            </button>
                        </div>
                        <div className="wms-toolbar-right">
                            <span style={{ fontSize: "12px", color: "#64748b" }}>
                                Showing {filteredIssues.length} bin issues
                            </span>
                        </div>
                    </div>

                    <div className="wms-table-card">
                        <div className="wms-table-responsive">
                            <table className="wms-table">
                                <thead>
                                    <tr>
                                        <th>Issue #</th>
                                        <th>Date</th>
                                        <th>Warehouse</th>
                                        <th>Reason</th>
                                        <th>Ref Doc (Cutting Slip)</th>
                                        <th>Issued To Department</th>
                                        <th style={{ textAlign: "right" }}>Total Qty Picked</th>
                                        <th style={{ textAlign: "center" }}>Line Items</th>
                                        <th>Issued By</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={10} style={{ textAlign: "center", padding: "30px" }}>
                                                Loading bin issues...
                                            </td>
                                        </tr>
                                    ) : filteredIssues.length === 0 ? (
                                        <tr>
                                            <td colSpan={10} style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                                No bin issues found. Click "+ New Issue from Bin" to issue items.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredIssues.map((iss) => (
                                            <tr key={iss.IssueID}>
                                                <td>
                                                    <strong style={{ color: "#004fb6" }}>{iss.IssueNo}</strong>
                                                </td>
                                                <td>{iss.IssueDate}</td>
                                                <td>{iss.WarehouseName}</td>
                                                <td>
                                                    <span style={{ fontWeight: 600 }}>{iss.IssueReason}</span>
                                                </td>
                                                <td>{iss.RefDocNo || "-"}</td>
                                                <td>{iss.IssuedToDepartment}</td>
                                                <td style={{ textAlign: "right", fontWeight: 700, color: "#004fb6" }}>
                                                    {iss.TotalQty}
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    <span style={{ background: "#e2e8f0", padding: "2px 7px", borderRadius: "10px", fontSize: "11px" }}>
                                                        {iss.TotalRows || (iss.items ? iss.items.length : 1)}
                                                    </span>
                                                </td>
                                                <td>{iss.IssuedBy}</td>
                                                <td>
                                                    <span className="wms-badge wms-badge-completed">
                                                        <FaCheckCircle style={{ fontSize: "9px" }} /> {iss.Status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
