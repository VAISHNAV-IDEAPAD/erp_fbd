import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaBoxes,
    FaPlus,
    FaSyncAlt,
    FaSearch,
    FaSave,
    FaPrint,
    FaTrash,
    FaCheckCircle,
    FaArrowLeft,
    FaBarcode,
    FaMagic
} from "react-icons/fa";
import wmsService from "../../../services/wmsService";
import "../../../styles/wms.css";

const SAMPLE_ITEMS = [
    { code: "LTH-1093", name: "COW CULATTAS SINGLE LEATHER", uom: "SQFT", zone: "Zone A - Leather", lot: "LOT-9B-2026-A", shade: "BLACK" },
    { code: "LTH-1112", name: "COW ECO VEG SIDE CRUST LEATHER", uom: "SQFT", zone: "Zone A - Leather", lot: "LOT-9B-2026-B", shade: "TAN" },
    { code: "FAB-3011", name: "COTTON TWILL LINING 120 GSM", uom: "MTR", zone: "Zone B - Fabric & Lining", lot: "LOT-FAB-441", shade: "WHITE" },
    { code: "RNF-1085", name: "HIGH DENSITY TOPLINER 0.4MM", uom: "MTR", zone: "Zone B - Fabric & Lining", lot: "LOT-RNF-09", shade: "BLACK" },
    { code: "HDW-2236", name: "JAM RIVET SINGLE HEAD 7MM", uom: "SET", zone: "Zone C - Hardware", lot: "LOT-RV-12", shade: "ANTIQUE BRASS" },
    { code: "ZIP-4022", name: "YKK METALLIC ZIPPER #5 BRONZE", uom: "PCS", zone: "Zone C - Hardware", lot: "LOT-ZP-05", shade: "ANTIQUE BRONZE" },
    { code: "THR-0021", name: "BONDED NYLON THREAD #40", uom: "CONE", zone: "Zone D - Thread & Trims", lot: "LOT-TH-88", shade: "BLACK" }
];

export default function BinAllocation({ initialMode = "list" }) {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState(initialMode); // 'list' or 'form'
    const [allocations, setAllocations] = useState([]);
    const [bins, setBins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    // Form State
    const [allocNo, setAllocNo] = useState("");
    const [allocDate, setAllocDate] = useState(new Date().toISOString().split("T")[0]);
    const [warehouseName, setWarehouseName] = useState("RAW MATERIAL STORE 9B");
    const [refType, setRefType] = useState("Item Receipt (GRN)");
    const [refDocNo, setRefDocNo] = useState("GRN-2026-081");
    const [allocatedBy, setAllocatedBy] = useState("Store Incharge");
    const [remarks, setRemarks] = useState("");

    const [rows, setRows] = useState([
        {
            id: 1,
            ItemCode: "LTH-1093",
            ItemName: "COW CULATTAS SINGLE LEATHER",
            RollSerialNo: "RL-2627-1004",
            LotNo: "LOT-9B-2026-A",
            BinCode: "BIN-A-01-01",
            AllocatedQty: "100",
            UOM: "SQFT",
            Remarks: "Upper batch 1"
        }
    ]);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3500);
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [allocData, binData] = await Promise.all([
                wmsService.getAllocations(),
                wmsService.getBins()
            ]);
            setAllocations(allocData);
            setBins(binData);
        } catch (e) {
            console.error("Error loading allocation data:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        setAllocNo(`BA/9B/2627/${String(Date.now()).slice(-4)}`);
    }, []);

    const handleItemChange = (rowId, itemCode) => {
        const found = SAMPLE_ITEMS.find((i) => i.code === itemCode);
        if (!found) return;

        setRows((prev) =>
            prev.map((r) => {
                if (r.id === rowId) {
                    // Try finding default bin in matching zone
                    const matchingBin = bins.find((b) => b.Zone.includes(found.zone.split(" - ")[0]));
                    return {
                        ...r,
                        ItemCode: found.code,
                        ItemName: found.name,
                        UOM: found.uom,
                        LotNo: found.lot,
                        BinCode: matchingBin ? matchingBin.BinCode : r.BinCode
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
        setRows((prev) => [
            ...prev,
            {
                id: Date.now(),
                ItemCode: "FAB-3011",
                ItemName: "COTTON TWILL LINING 120 GSM",
                RollSerialNo: `RL-2627-${Math.floor(1000 + Math.random() * 9000)}`,
                LotNo: "LOT-FAB-441",
                BinCode: "BIN-B-01-01",
                AllocatedQty: "50",
                UOM: "MTR",
                Remarks: ""
            }
        ]);
    };

    const handleRemoveRow = (rowId) => {
        if (rows.length === 1) {
            showToast("At least one item row is required");
            return;
        }
        setRows((prev) => prev.filter((r) => r.id !== rowId));
    };

    // Auto-suggest optimal bins based on item zone & current capacity
    const handleAutoSuggestBins = () => {
        let suggestedCount = 0;
        const updated = rows.map((r) => {
            const item = SAMPLE_ITEMS.find((it) => it.code === r.ItemCode);
            const zoneKeyword = item ? item.zone.split(" - ")[0] : "";
            // Find bin with lowest occupancy in this zone
            const availableBins = bins
                .filter((b) => !zoneKeyword || b.Zone.includes(zoneKeyword))
                .filter((b) => b.Status !== "Full")
                .sort((a, b) => (parseFloat(a.CurrentQty) || 0) - (parseFloat(b.CurrentQty) || 0));

            if (availableBins.length > 0) {
                suggestedCount++;
                return { ...r, BinCode: availableBins[0].BinCode };
            }
            return r;
        });

        setRows(updated);
        showToast(`Auto-allocated optimal bins for ${suggestedCount} items`);
    };

    const handleSaveAllocation = async () => {
        if (rows.length === 0) {
            showToast("Please add at least one item row to allocate");
            return;
        }

        const payload = {
            AllocationNo: allocNo,
            AllocationDate: allocDate,
            WarehouseName: warehouseName,
            RefType: refType,
            RefDocNo: refDocNo,
            AllocatedBy: allocatedBy,
            Remarks: remarks,
            items: rows.map((r) => ({
                ItemCode: r.ItemCode,
                ItemName: r.ItemName,
                RollSerialNo: r.RollSerialNo,
                BinCode: r.BinCode,
                AllocatedQty: parseFloat(r.AllocatedQty) || 0,
                UOM: r.UOM,
                LotNo: r.LotNo,
                Remarks: r.Remarks
            }))
        };

        try {
            await wmsService.createAllocation(payload);
            showToast(`Allocation ${allocNo} saved successfully!`);
            await loadData();
            setViewMode("list");
        } catch (e) {
            showToast("Error saving allocation: " + e.message);
        }
    };

    const filteredAllocations = allocations.filter((a) => {
        const q = searchTerm.toLowerCase();
        return (
            (a.AllocationNo || "").toLowerCase().includes(q) ||
            (a.RefDocNo || "").toLowerCase().includes(q) ||
            (a.WarehouseName || "").toLowerCase().includes(q) ||
            (a.AllocatedBy || "").toLowerCase().includes(q)
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
                    <FaBoxes className="wms-title-icon" />
                    <div>
                        <h1 className="wms-title">Bin Allocation</h1>
                        <p className="wms-subtitle">
                            Put-away Incoming Material, Fabric Rolls, and Leather Hides into Designated Warehouse Bins
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
                                className="wms-btn-secondary"
                                onClick={handleAutoSuggestBins}
                            >
                                <FaMagic /> Auto-Suggest Bins
                            </button>
                            <button
                                type="button"
                                className="wms-btn-primary"
                                onClick={handleSaveAllocation}
                            >
                                <FaSave /> Save Allocation
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/wms/print-binning-slip" className="wms-btn-secondary">
                                <FaPrint /> Print Binning Slip
                            </Link>
                            <button
                                type="button"
                                className="wms-btn-primary"
                                onClick={() => {
                                    setAllocNo(`BA/9B/2627/${String(Date.now()).slice(-4)}`);
                                    setViewMode("form");
                                }}
                            >
                                <FaPlus /> New Bin Allocation
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* View Mode: FORM */}
            {viewMode === "form" ? (
                <div className="wms-form-card">
                    <div className="wms-form-header">
                        <div>
                            <span style={{ fontSize: "14px", fontWeight: 700, color: "#004fb6" }}>
                                Document Details: {allocNo}
                            </span>
                            <span style={{ marginLeft: "12px", fontSize: "12px", color: "#64748b" }}>
                                Status: <strong style={{ color: "#10b981" }}>Draft / Active</strong>
                            </span>
                        </div>
                    </div>

                    {/* Header Fields */}
                    <div className="wms-form-grid">
                        <div className="wms-form-group">
                            <label className="wms-form-label">Allocation No</label>
                            <input
                                type="text"
                                className="wms-form-input"
                                value={allocNo}
                                readOnly
                                style={{ backgroundColor: "#f8fafc", fontWeight: 600 }}
                            />
                        </div>

                        <div className="wms-form-group">
                            <label className="wms-form-label">Allocation Date *</label>
                            <input
                                type="date"
                                className="wms-form-input"
                                value={allocDate}
                                onChange={(e) => setAllocDate(e.target.value)}
                            />
                        </div>

                        <div className="wms-form-group">
                            <label className="wms-form-label">Store / Warehouse *</label>
                            <select
                                className="wms-form-select"
                                value={warehouseName}
                                onChange={(e) => setWarehouseName(e.target.value)}
                            >
                                <option value="RAW MATERIAL STORE 9B">RAW MATERIAL STORE 9B</option>
                                <option value="ACCESSORIES GODOWN 18">ACCESSORIES GODOWN 18</option>
                                <option value="LEATHER WAREHOUSE PLOT 9B">LEATHER WAREHOUSE PLOT 9B</option>
                                <option value="CENTRAL STORE">CENTRAL STORE</option>
                            </select>
                        </div>

                        <div className="wms-form-group">
                            <label className="wms-form-label">Reference Type</label>
                            <select
                                className="wms-form-select"
                                value={refType}
                                onChange={(e) => setRefType(e.target.value)}
                            >
                                <option value="Item Receipt (GRN)">Item Receipt (GRN)</option>
                                <option value="Production Receipt">Production Receipt</option>
                                <option value="Store Transfer">Store Transfer</option>
                                <option value="Gate Entry">Gate Entry</option>
                            </select>
                        </div>

                        <div className="wms-form-group">
                            <label className="wms-form-label">Ref Document No</label>
                            <input
                                type="text"
                                className="wms-form-input"
                                placeholder="e.g. GRN-2026-085"
                                value={refDocNo}
                                onChange={(e) => setRefDocNo(e.target.value)}
                            />
                        </div>

                        <div className="wms-form-group">
                            <label className="wms-form-label">Allocated By</label>
                            <input
                                type="text"
                                className="wms-form-input"
                                value={allocatedBy}
                                onChange={(e) => setAllocatedBy(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table of Items to Allocate */}
                    <div style={{ marginTop: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>
                                Put-Away Items & Target Bins ({rows.length} rows)
                            </h4>
                            <button
                                type="button"
                                className="wms-btn-secondary"
                                style={{ padding: "4px 10px", fontSize: "12px" }}
                                onClick={handleAddRow}
                            >
                                <FaPlus /> Add Line Item
                            </button>
                        </div>

                        <div className="wms-table-responsive" style={{ border: "1px solid #cbd5e1", borderRadius: "4px" }}>
                            <table className="wms-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "40px", textAlign: "center" }}>#</th>
                                        <th style={{ width: "240px" }}>Item / Material *</th>
                                        <th style={{ width: "140px" }}>Roll / Serial #</th>
                                        <th style={{ width: "120px" }}>Lot / Shade</th>
                                        <th style={{ width: "200px" }}>Target Bin *</th>
                                        <th style={{ width: "110px", textAlign: "right" }}>Alloc Qty *</th>
                                        <th style={{ width: "70px" }}>UOM</th>
                                        <th>Remarks</th>
                                        <th style={{ width: "50px", textAlign: "center" }}>Del</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, idx) => {
                                        const currentBin = bins.find((b) => b.BinCode === row.BinCode);
                                        const remainingCap = currentBin
                                            ? Math.max(0, currentBin.MaxCapacity - currentBin.CurrentQty)
                                            : 0;

                                        return (
                                            <tr key={row.id}>
                                                <td style={{ textAlign: "center", color: "#64748b" }}>{idx + 1}</td>
                                                <td>
                                                    <select
                                                        className="wms-form-select"
                                                        value={row.ItemCode}
                                                        onChange={(e) => handleItemChange(row.id, e.target.value)}
                                                        style={{ width: "100%", fontSize: "12px" }}
                                                    >
                                                        {SAMPLE_ITEMS.map((item) => (
                                                            <option key={item.code} value={item.code}>
                                                                {item.code} - {item.name}
                                                            </option>
                                                        ))}
                                                    </select>
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
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="wms-form-input"
                                                        value={row.LotNo}
                                                        onChange={(e) => handleRowChange(row.id, "LotNo", e.target.value)}
                                                        style={{ fontSize: "12px" }}
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        className="wms-form-select"
                                                        value={row.BinCode}
                                                        onChange={(e) => handleRowChange(row.id, "BinCode", e.target.value)}
                                                        style={{ width: "100%", fontSize: "12px" }}
                                                    >
                                                        {bins.map((b) => (
                                                            <option key={b.BinID} value={b.BinCode}>
                                                                {b.BinCode} ({b.Zone.split(" - ")[0]} | Avail: {Math.max(0, b.MaxCapacity - b.CurrentQty)} {b.UOM})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="wms-form-input"
                                                        style={{ textAlign: "right", fontSize: "12px" }}
                                                        value={row.AllocatedQty}
                                                        onChange={(e) => handleRowChange(row.id, "AllocatedQty", e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>
                                                        {row.UOM}
                                                    </span>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="wms-form-input"
                                                        placeholder="Placement note"
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
                            onClick={handleSaveAllocation}
                        >
                            <FaSave /> Save & Commit Allocation
                        </button>
                    </div>
                </div>
            ) : (
                /* View Mode: REGISTER / LIST */
                <>
                    <div className="wms-toolbar">
                        <div className="wms-toolbar-left">
                            <div className="wms-search-input-wrap">
                                <FaSearch className="wms-search-icon" />
                                <input
                                    type="text"
                                    className="wms-search-input"
                                    placeholder="Search allocation #, GRN, store..."
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
                                Showing {filteredAllocations.length} allocations
                            </span>
                        </div>
                    </div>

                    <div className="wms-table-card">
                        <div className="wms-table-responsive">
                            <table className="wms-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "90px", textAlign: "center" }}>Action</th>
                                        <th>Allocation #</th>
                                        <th>Date</th>
                                        <th>Warehouse / Store</th>
                                        <th>Ref Document</th>
                                        <th style={{ textAlign: "right" }}>Total Qty</th>
                                        <th style={{ textAlign: "center" }}>Line Items</th>
                                        <th>Allocated By</th>
                                        <th>Status</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={10} style={{ textAlign: "center", padding: "30px" }}>
                                                Loading allocations...
                                            </td>
                                        </tr>
                                    ) : filteredAllocations.length === 0 ? (
                                        <tr>
                                            <td colSpan={10} style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                                No bin allocations found. Click "+ New Bin Allocation" to create one.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredAllocations.map((alloc) => (
                                            <tr key={alloc.AllocationID}>
                                                <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                                    <Link
                                                        to="/wms/print-binning-slip"
                                                        state={{ allocationNo: alloc.AllocationNo }}
                                                        className="wms-btn-secondary"
                                                        style={{ padding: "3px 6px" }}
                                                        title="Print Binning Slip"
                                                    >
                                                        <FaPrint style={{ fontSize: "11px" }} />
                                                    </Link>
                                                </td>
                                                <td>
                                                    <strong style={{ color: "#004fb6" }}>{alloc.AllocationNo}</strong>
                                                </td>
                                                <td>{alloc.AllocationDate}</td>
                                                <td>{alloc.WarehouseName}</td>
                                                <td>
                                                    <span style={{ fontWeight: 600 }}>{alloc.RefDocNo || "-"}</span>
                                                    <span style={{ display: "block", fontSize: "11px", color: "#64748b" }}>
                                                        {alloc.RefType}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: "right", fontWeight: 700 }}>
                                                    {alloc.TotalQty}
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    <span style={{ background: "#e2e8f0", padding: "2px 7px", borderRadius: "10px", fontSize: "11px" }}>
                                                        {alloc.TotalItems || (alloc.items ? alloc.items.length : 1)}
                                                    </span>
                                                </td>
                                                <td>{alloc.AllocatedBy || "Store Staff"}</td>
                                                <td>
                                                    <span className="wms-badge wms-badge-completed">
                                                        <FaCheckCircle style={{ fontSize: "9px" }} /> {alloc.Status || "Completed"}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: "11px", color: "#64748b" }}>{alloc.Remarks || "-"}</td>
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
