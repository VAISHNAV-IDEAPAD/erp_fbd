import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FaWarehouse,
    FaPlus,
    FaSyncAlt,
    FaSearch,
    FaThLarge,
    FaList,
    FaBarcode,
    FaEdit,
    FaTrash,
    FaQrcode,
    FaPrint,
    FaArrowRight
} from "react-icons/fa";
import wmsService from "../../../services/wmsService";
import "../../../styles/wms.css";

const STORE_OPTIONS = [
    "ALL WAREHOUSES",
    "RAW MATERIAL STORE 9B",
    "ACCESSORIES GODOWN 18",
    "LEATHER WAREHOUSE PLOT 9B",
    "CENTRAL STORE",
    "SEWING FLOOR STORE"
];

const ZONE_OPTIONS = [
    "ALL ZONES",
    "Zone A - Leather",
    "Zone B - Fabric & Lining",
    "Zone C - Hardware",
    "Zone D - Thread & Trims"
];

export default function Bins() {
    const [bins, setBins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("table"); // 'table' or 'heatmap'
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStore, setSelectedStore] = useState("ALL WAREHOUSES");
    const [selectedZone, setSelectedZone] = useState("ALL ZONES");

    // Modal state for Add/Edit
    const [showModal, setShowModal] = useState(false);
    const [editBin, setEditBin] = useState(null);
    const [formData, setFormData] = useState({
        BinCode: "",
        WarehouseName: "RAW MATERIAL STORE 9B",
        Zone: "Zone A - Leather",
        Rack: "Rack A1",
        Shelf: "Level 1",
        BinType: "Roll Bin",
        MaxCapacity: 500,
        CurrentQty: 0,
        UOM: "SQFT",
        Status: "Available",
        Remarks: ""
    });

    const [toastMessage, setToastMessage] = useState("");

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3500);
    };

    const loadBins = async () => {
        setLoading(true);
        try {
            const data = await wmsService.getBins();
            setBins(data);
        } catch (err) {
            console.error("Failed to load bins:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBins();
    }, []);

    const handleOpenAdd = () => {
        setEditBin(null);
        setFormData({
            BinCode: `BIN-${Date.now().toString().slice(-4)}`,
            WarehouseName: "RAW MATERIAL STORE 9B",
            Zone: "Zone A - Leather",
            Rack: "Rack A1",
            Shelf: "Level 1",
            BinType: "Roll Bin",
            MaxCapacity: 500,
            CurrentQty: 0,
            UOM: "SQFT",
            Status: "Available",
            Remarks: ""
        });
        setShowModal(true);
    };

    const handleOpenEdit = (bin) => {
        setEditBin(bin);
        setFormData({
            BinCode: bin.BinCode,
            WarehouseName: bin.WarehouseName,
            Zone: bin.Zone,
            Rack: bin.Rack,
            Shelf: bin.Shelf,
            BinType: bin.BinType || "Roll Bin",
            MaxCapacity: bin.MaxCapacity || 500,
            CurrentQty: bin.CurrentQty || 0,
            UOM: bin.UOM || "MTR",
            Status: bin.Status || "Available",
            Remarks: bin.Remarks || ""
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editBin) {
                await wmsService.updateBin(editBin.BinID, formData);
                showToast(`Bin ${formData.BinCode} updated successfully`);
            } else {
                await wmsService.createBin(formData);
                showToast(`New Bin ${formData.BinCode} created successfully`);
            }
            setShowModal(false);
            loadBins();
        } catch (err) {
            showToast("Error saving bin: " + err.message);
        }
    };

    const handleDelete = async (id, code) => {
        if (window.confirm(`Are you sure you want to delete bin ${code}?`)) {
            await wmsService.deleteBin(id);
            showToast(`Bin ${code} deleted`);
            loadBins();
        }
    };

    const filteredBins = bins.filter((b) => {
        const matchesSearch =
            (b.BinCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b.Zone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b.WarehouseName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b.Barcode || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStore = selectedStore === "ALL WAREHOUSES" || b.WarehouseName === selectedStore;
        const matchesZone = selectedZone === "ALL ZONES" || b.Zone === selectedZone;
        return matchesSearch && matchesStore && matchesZone;
    });

    const getOccupancyClass = (current, max) => {
        const pct = (parseFloat(current) / (parseFloat(max) || 1)) * 100;
        if (pct >= 90) return "high";
        if (pct >= 50) return "medium";
        return "low";
    };

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
                    <FaWarehouse className="wms-title-icon" />
                    <div>
                        <h1 className="wms-title">Bin Master</h1>
                        <p className="wms-subtitle">
                            Warehouse Bin Allocation, Rack Positions, and Capacity Control (Plot No. 9B)
                        </p>
                    </div>
                </div>
                <div className="wms-header-actions">
                    <Link to="/wms/bin-allocation" className="wms-btn-secondary">
                        <FaArrowRight /> Bin Allocation
                    </Link>
                    <Link to="/wms/print-binning-slip" className="wms-btn-secondary">
                        <FaPrint /> Print Binning Slip
                    </Link>
                    <button type="button" className="wms-btn-primary" onClick={handleOpenAdd}>
                        <FaPlus /> New Bin
                    </button>
                </div>
            </div>

            {/* Secondary Toolbar */}
            <div className="wms-toolbar">
                <div className="wms-toolbar-left">
                    <div className="wms-search-input-wrap">
                        <FaSearch className="wms-search-icon" />
                        <input
                            type="text"
                            className="wms-search-input"
                            placeholder="Search bin code, zone, barcode..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="wms-filter-select"
                        value={selectedStore}
                        onChange={(e) => setSelectedStore(e.target.value)}
                    >
                        {STORE_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                                {st}
                            </option>
                        ))}
                    </select>

                    <select
                        className="wms-filter-select"
                        value={selectedZone}
                        onChange={(e) => setSelectedZone(e.target.value)}
                    >
                        {ZONE_OPTIONS.map((zn) => (
                            <option key={zn} value={zn}>
                                {zn}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        className="wms-btn-secondary"
                        onClick={loadBins}
                        title="Reload Bins"
                    >
                        <FaSyncAlt />
                    </button>
                </div>

                <div className="wms-toolbar-right">
                    <div className="wms-view-toggle">
                        <button
                            type="button"
                            className={`wms-view-btn ${viewMode === "table" ? "active" : ""}`}
                            onClick={() => setViewMode("table")}
                        >
                            <FaList /> Table
                        </button>
                        <button
                            type="button"
                            className={`wms-view-btn ${viewMode === "heatmap" ? "active" : ""}`}
                            onClick={() => setViewMode("heatmap")}
                        >
                            <FaThLarge /> Heatmap
                        </button>
                    </div>
                </div>
            </div>

            {/* Content: Table View */}
            {viewMode === "table" && (
                <div className="wms-table-card">
                    <div className="wms-table-responsive">
                        <table className="wms-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "90px", textAlign: "center" }}>Action</th>
                                    <th>Bin Code</th>
                                    <th>Warehouse / Store</th>
                                    <th>Zone</th>
                                    <th>Rack / Shelf</th>
                                    <th>Bin Type</th>
                                    <th style={{ textAlign: "right" }}>Max Capacity</th>
                                    <th style={{ textAlign: "right" }}>Current Qty</th>
                                    <th style={{ textAlign: "center" }}>Utilization</th>
                                    <th>Status</th>
                                    <th>Barcode / QR</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={12} style={{ textAlign: "center", padding: "30px" }}>
                                            Loading warehouse bins...
                                        </td>
                                    </tr>
                                ) : filteredBins.length === 0 ? (
                                    <tr>
                                        <td colSpan={12} style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                            No warehouse bins found matching your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBins.map((bin) => {
                                        const pct = Math.min(
                                            100,
                                            Math.round(((parseFloat(bin.CurrentQty) || 0) / (parseFloat(bin.MaxCapacity) || 1)) * 100)
                                        );
                                        return (
                                            <tr key={bin.BinID}>
                                                <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                                    <button
                                                        type="button"
                                                        className="wms-btn-secondary"
                                                        style={{ padding: "3px 6px", marginRight: "4px" }}
                                                        onClick={() => handleOpenEdit(bin)}
                                                        title="Edit Bin"
                                                    >
                                                        <FaEdit style={{ fontSize: "11px" }} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="wms-btn-secondary"
                                                        style={{ padding: "3px 6px", color: "#ef4444" }}
                                                        onClick={() => handleDelete(bin.BinID, bin.BinCode)}
                                                        title="Delete Bin"
                                                    >
                                                        <FaTrash style={{ fontSize: "11px" }} />
                                                    </button>
                                                </td>
                                                <td>
                                                    <strong style={{ color: "#004fb6" }}>{bin.BinCode}</strong>
                                                </td>
                                                <td>{bin.WarehouseName}</td>
                                                <td>{bin.Zone}</td>
                                                <td>{bin.Rack} / {bin.Shelf}</td>
                                                <td>{bin.BinType || "Roll Bin"}</td>
                                                <td style={{ textAlign: "right" }}>
                                                    {bin.MaxCapacity} {bin.UOM}
                                                </td>
                                                <td style={{ textAlign: "right", fontWeight: 600 }}>
                                                    {bin.CurrentQty} {bin.UOM}
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                        <div className="wms-bin-occupancy-bar" style={{ margin: 0, flex: 1 }}>
                                                            <div
                                                                className={`wms-bin-occupancy-fill ${getOccupancyClass(bin.CurrentQty, bin.MaxCapacity)}`}
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                        <span style={{ fontSize: "11px", fontWeight: 600, minWidth: "30px" }}>{pct}%</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`wms-badge ${
                                                            bin.Status === "Available"
                                                                ? "wms-badge-available"
                                                                : bin.Status === "Full"
                                                                ? "wms-badge-full"
                                                                : "wms-badge-partial"
                                                        }`}
                                                    >
                                                        {bin.Status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#0f172a" }}>
                                                        <FaBarcode style={{ marginRight: "4px", color: "#475569" }} />
                                                        {bin.Barcode || `BAR-${bin.BinCode}`}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: "11px", color: "#64748b" }}>{bin.Remarks || "-"}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Content: Heatmap View */}
            {viewMode === "heatmap" && (
                <div className="wms-table-card">
                    <div className="wms-heatmap-grid">
                        {filteredBins.map((bin) => {
                            const pct = Math.min(
                                100,
                                Math.round(((parseFloat(bin.CurrentQty) || 0) / (parseFloat(bin.MaxCapacity) || 1)) * 100)
                            );
                            return (
                                <div className="wms-bin-card" key={bin.BinID}>
                                    <div className="wms-bin-card-header">
                                        <div>
                                            <span className="wms-bin-code">{bin.BinCode}</span>
                                            <span className="wms-bin-zone">{bin.Zone} • {bin.Rack}</span>
                                        </div>
                                        <span
                                            className={`wms-badge ${
                                                bin.Status === "Available"
                                                    ? "wms-badge-available"
                                                    : bin.Status === "Full"
                                                    ? "wms-badge-full"
                                                    : "wms-badge-partial"
                                            }`}
                                        >
                                            {bin.Status}
                                        </span>
                                    </div>

                                    <div className="wms-bin-occupancy-bar">
                                        <div
                                            className={`wms-bin-occupancy-fill ${getOccupancyClass(bin.CurrentQty, bin.MaxCapacity)}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>

                                    <div className="wms-bin-card-details">
                                        <span>Capacity: {bin.MaxCapacity} {bin.UOM}</span>
                                        <span>Occupied: <strong>{bin.CurrentQty} {bin.UOM}</strong> ({pct}%)</span>
                                    </div>

                                    <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: "10.5px", color: "#64748b" }}>
                                            <FaQrcode style={{ marginRight: "4px" }} />
                                            {bin.Shelf}
                                        </span>
                                        <button
                                            type="button"
                                            className="wms-btn-secondary"
                                            style={{ padding: "3px 8px", fontSize: "11px" }}
                                            onClick={() => handleOpenEdit(bin)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Modal for Add / Edit Bin */}
            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(15, 23, 42, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10000,
                        padding: "20px"
                    }}
                >
                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: "8px",
                            maxWidth: "600px",
                            width: "100%",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                            padding: "24px"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <h3 style={{ margin: 0, fontSize: "18px", color: "#004fb6", fontWeight: 700 }}>
                                {editBin ? `Edit Bin: ${editBin.BinCode}` : "Create New Warehouse Bin"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="wms-form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                                <div className="wms-form-group">
                                    <label className="wms-form-label">Bin Code *</label>
                                    <input
                                        type="text"
                                        className="wms-form-input"
                                        required
                                        value={formData.BinCode}
                                        onChange={(e) => setFormData({ ...formData, BinCode: e.target.value.toUpperCase() })}
                                        placeholder="e.g. BIN-A-01-01"
                                    />
                                </div>

                                <div className="wms-form-group">
                                    <label className="wms-form-label">Warehouse / Store *</label>
                                    <select
                                        className="wms-form-select"
                                        value={formData.WarehouseName}
                                        onChange={(e) => setFormData({ ...formData, WarehouseName: e.target.value })}
                                    >
                                        {STORE_OPTIONS.filter((s) => s !== "ALL WAREHOUSES").map((st) => (
                                            <option key={st} value={st}>
                                                {st}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="wms-form-group">
                                    <label className="wms-form-label">Zone *</label>
                                    <select
                                        className="wms-form-select"
                                        value={formData.Zone}
                                        onChange={(e) => setFormData({ ...formData, Zone: e.target.value })}
                                    >
                                        {ZONE_OPTIONS.filter((z) => z !== "ALL ZONES").map((zn) => (
                                            <option key={zn} value={zn}>
                                                {zn}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="wms-form-group">
                                    <label className="wms-form-label">Rack Identifier</label>
                                    <input
                                        type="text"
                                        className="wms-form-input"
                                        value={formData.Rack}
                                        onChange={(e) => setFormData({ ...formData, Rack: e.target.value })}
                                        placeholder="e.g. Rack A1"
                                    />
                                </div>

                                <div className="wms-form-group">
                                    <label className="wms-form-label">Shelf / Level</label>
                                    <input
                                        type="text"
                                        className="wms-form-input"
                                        value={formData.Shelf}
                                        onChange={(e) => setFormData({ ...formData, Shelf: e.target.value })}
                                        placeholder="e.g. Level 1"
                                    />
                                </div>

                                <div className="wms-form-group">
                                    <label className="wms-form-label">Bin Type</label>
                                    <select
                                        className="wms-form-select"
                                        value={formData.BinType}
                                        onChange={(e) => setFormData({ ...formData, BinType: e.target.value })}
                                    >
                                        <option value="Roll Bin">Roll Bin (Fabrics / Leather)</option>
                                        <option value="Pallet Bin">Pallet Bin (Heavy Goods)</option>
                                        <option value="Shelf Bin">Shelf Bin (Hardware / Accessories)</option>
                                        <option value="Floor Location">Floor Location</option>
                                    </select>
                                </div>

                                <div className="wms-form-group">
                                    <label className="wms-form-label">Max Capacity</label>
                                    <input
                                        type="number"
                                        className="wms-form-input"
                                        value={formData.MaxCapacity}
                                        onChange={(e) => setFormData({ ...formData, MaxCapacity: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>

                                <div className="wms-form-group">
                                    <label className="wms-form-label">UOM</label>
                                    <select
                                        className="wms-form-select"
                                        value={formData.UOM}
                                        onChange={(e) => setFormData({ ...formData, UOM: e.target.value })}
                                    >
                                        <option value="SQFT">SQFT (Leather)</option>
                                        <option value="MTR">MTR (Fabrics & Linings)</option>
                                        <option value="PCS">PCS (Hardware & Accessories)</option>
                                        <option value="SET">SET (Rivets & Fasteners)</option>
                                        <option value="CONE">CONE (Threads)</option>
                                        <option value="KGS">KGS</option>
                                    </select>
                                </div>

                                <div className="wms-form-group" style={{ gridColumn: "1 / -1" }}>
                                    <label className="wms-form-label">Remarks / Storage Notes</label>
                                    <input
                                        type="text"
                                        className="wms-form-input"
                                        value={formData.Remarks}
                                        onChange={(e) => setFormData({ ...formData, Remarks: e.target.value })}
                                        placeholder="Special handling instructions or restrictions"
                                    />
                                </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                                <button type="button" className="wms-btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="wms-btn-primary">
                                    {editBin ? "Update Bin" : "Save Bin"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
