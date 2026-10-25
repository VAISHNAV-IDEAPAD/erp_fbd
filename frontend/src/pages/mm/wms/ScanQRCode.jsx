import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaQrcode,
    FaBarcode,
    FaSearch,
    FaCheckCircle,
    FaWarehouse,
    FaBoxes,
    FaArrowRight,
    FaCamera
} from "react-icons/fa";
import wmsService from "../../../services/wmsService";
import "../../../styles/wms.css";

export default function ScanQRCode() {
    const [scanInput, setScanInput] = useState("");
    const [result, setResult] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [simulating, setSimulating] = useState(false);

    const handleSearch = async (codeToSearch) => {
        const query = (codeToSearch || scanInput).trim();
        if (!query) return;

        setErrorMsg("");
        setResult(null);

        try {
            const res = await wmsService.lookupCode(query);
            if (res.success) {
                setResult(res);
            } else {
                setErrorMsg(res.message || `No record found for '${query}'`);
            }
        } catch (e) {
            setErrorMsg("Lookup failed: " + e.message);
        }
    };

    const handleSimulateScan = (sampleCode) => {
        setScanInput(sampleCode);
        setSimulating(true);
        setTimeout(() => {
            setSimulating(false);
            handleSearch(sampleCode);
        }, 600);
    };

    return (
        <div className="wms-container">
            {/* Header */}
            <div className="wms-header">
                <div className="wms-title-section">
                    <FaQrcode className="wms-title-icon" />
                    <div>
                        <h1 className="wms-title">Scan QR Code / Barcode Lookup</h1>
                        <p className="wms-subtitle">
                            Scan Warehouse Bins, Fabric Rolls, Material Tags or Enter Code for Live Stock & Location
                        </p>
                    </div>
                </div>
            </div>

            <div className="wms-scan-card">
                {/* Visual Viewfinder */}
                <div className="wms-scanner-viewfinder">
                    <div className="wms-scanner-laser" />
                    <FaCamera style={{ fontSize: "36px", marginBottom: "8px", opacity: 0.8 }} />
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>
                        {simulating ? "Scanning barcode..." : "Align QR Code or Barcode in Frame"}
                    </span>
                    <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                        Optical Scanner & USB Barcode Reader Active
                    </span>
                </div>

                {/* Input Bar */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}
                >
                    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                        <div style={{ position: "relative", flex: 1 }}>
                            <FaBarcode
                                style={{
                                    position: "absolute",
                                    left: "12px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#94a3b8"
                                }}
                            />
                            <input
                                type="text"
                                className="wms-form-input"
                                style={{ paddingLeft: "36px", width: "100%", height: "42px", fontSize: "14px" }}
                                placeholder="Scan or type Bin Code, Roll No, or Barcode..."
                                value={scanInput}
                                onChange={(e) => setScanInput(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="wms-btn-primary" style={{ padding: "0 20px" }}>
                            <FaSearch /> Lookup
                        </button>
                    </div>
                </form>

                {/* Quick Simulation Chips */}
                <div style={{ marginBottom: "20px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b", display: "block", marginBottom: "6px" }}>
                        Quick Scan Presets:
                    </span>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button
                            type="button"
                            className="wms-btn-secondary"
                            style={{ fontSize: "11px", padding: "4px 8px" }}
                            onClick={() => handleSimulateScan("BIN-A-01-01")}
                        >
                            <FaWarehouse /> Bin: BIN-A-01-01
                        </button>
                        <button
                            type="button"
                            className="wms-btn-secondary"
                            style={{ fontSize: "11px", padding: "4px 8px" }}
                            onClick={() => handleSimulateScan("BIN-B-01-01")}
                        >
                            <FaWarehouse /> Bin: BIN-B-01-01
                        </button>
                        <button
                            type="button"
                            className="wms-btn-secondary"
                            style={{ fontSize: "11px", padding: "4px 8px" }}
                            onClick={() => handleSimulateScan("RL-2627-1001")}
                        >
                            <FaBarcode /> Roll: RL-2627-1001
                        </button>
                        <button
                            type="button"
                            className="wms-btn-secondary"
                            style={{ fontSize: "11px", padding: "4px 8px" }}
                            onClick={() => handleSimulateScan("RL-2627-2001")}
                        >
                            <FaBarcode /> Roll: RL-2627-2001
                        </button>
                        <button
                            type="button"
                            className="wms-btn-secondary"
                            style={{ fontSize: "11px", padding: "4px 8px" }}
                            onClick={() => handleSimulateScan("BA/9B/2627/001")}
                        >
                            <FaBoxes /> Alloc: BA/9B/2627/001
                        </button>
                    </div>
                </div>

                {/* Error message */}
                {errorMsg && (
                    <div
                        style={{
                            padding: "12px 16px",
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: "6px",
                            color: "#991b1b",
                            fontSize: "13px"
                        }}
                    >
                        {errorMsg}
                    </div>
                )}

                {/* Scanned Result Card */}
                {result && (
                    <div
                        style={{
                            padding: "18px",
                            backgroundColor: "#f0fdf4",
                            border: "1.5px solid #86efac",
                            borderRadius: "8px"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                            <FaCheckCircle style={{ color: "#16a34a", fontSize: "18px" }} />
                            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#166534" }}>
                                Scanned {result.type.toUpperCase()}: {result.data.BinCode || result.data.RollSerialNo || result.data.AllocationNo}
                            </h3>
                        </div>

                        {result.type === "bin" && (
                            <div style={{ fontSize: "13px", color: "#1e293b", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                <div><strong>Bin Code:</strong> {result.data.BinCode}</div>
                                <div><strong>Warehouse:</strong> {result.data.WarehouseName}</div>
                                <div><strong>Zone:</strong> {result.data.Zone}</div>
                                <div><strong>Rack / Level:</strong> {result.data.Rack} / {result.data.Shelf}</div>
                                <div><strong>Current Stock:</strong> {result.data.CurrentQty} {result.data.UOM}</div>
                                <div><strong>Max Capacity:</strong> {result.data.MaxCapacity} {result.data.UOM}</div>
                                <div><strong>Bin Type:</strong> {result.data.BinType}</div>
                                <div><strong>Status:</strong> {result.data.Status}</div>
                            </div>
                        )}

                        {result.type === "roll" && (
                            <div style={{ fontSize: "13px", color: "#1e293b", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                <div><strong>Roll Serial:</strong> {result.data.RollSerialNo}</div>
                                <div><strong>Item Code:</strong> {result.data.ItemCode}</div>
                                <div style={{ gridColumn: "1 / -1" }}><strong>Description:</strong> {result.data.ItemName}</div>
                                <div><strong>Length / Qty:</strong> {result.data.LengthQty} {result.data.UOM}</div>
                                <div><strong>Lot / Shade:</strong> {result.data.LotNo || "-"} ({result.data.Shade || "N/A"})</div>
                                <div><strong>Current Bin Location:</strong> <strong style={{ color: "#004fb6" }}>{result.data.BinCode || "Unallocated"}</strong></div>
                                <div><strong>Status:</strong> {result.data.Status}</div>
                            </div>
                        )}

                        {result.type === "allocation" && (
                            <div style={{ fontSize: "13px", color: "#1e293b", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                <div><strong>Allocation #:</strong> {result.data.AllocationNo}</div>
                                <div><strong>Date:</strong> {result.data.AllocationDate}</div>
                                <div><strong>Ref Doc:</strong> {result.data.RefDocNo}</div>
                                <div><strong>Total Qty:</strong> {result.data.TotalQty}</div>
                                <div><strong>Warehouse:</strong> {result.data.WarehouseName}</div>
                                <div><strong>Operator:</strong> {result.data.AllocatedBy}</div>
                            </div>
                        )}

                        <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #bbf7d0", display: "flex", gap: "10px" }}>
                            {result.type === "bin" && (
                                <>
                                    <Link to="/wms/bin-allocation" className="wms-btn-primary" style={{ fontSize: "12px", padding: "5px 12px" }}>
                                        Allocate Goods to Bin <FaArrowRight />
                                    </Link>
                                    <Link to="/wms/issue-from-bin" className="wms-btn-secondary" style={{ fontSize: "12px", padding: "5px 12px" }}>
                                        Issue from this Bin
                                    </Link>
                                </>
                            )}
                            {result.type === "roll" && (
                                <Link to="/wms/issue-from-bin" className="wms-btn-primary" style={{ fontSize: "12px", padding: "5px 12px" }}>
                                    Pick & Issue Roll <FaArrowRight />
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
