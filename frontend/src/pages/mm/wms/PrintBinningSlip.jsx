import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    FaPrint,
    FaQrcode,
    FaBarcode,
    FaSyncAlt,
    FaArrowLeft,
    FaCheckSquare
} from "react-icons/fa";
import wmsService from "../../../services/wmsService";
import "../../../styles/wms.css";

export default function PrintBinningSlip() {
    const location = useLocation();
    const [allocations, setAllocations] = useState([]);
    const [bins, setBins] = useState([]);
    const [rolls, setRolls] = useState([]);
    const [selectedAllocNo, setSelectedAllocNo] = useState(
        location.state?.allocationNo || "BA/9B/2627/001"
    );
    const [printFormat, setPrintFormat] = useState("slip"); // 'slip', 'rack-labels', 'roll-tags'
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [allocData, binData, rollData] = await Promise.all([
                wmsService.getAllocations(),
                wmsService.getBins(),
                wmsService.getRollSerials()
            ]);
            setAllocations(allocData);
            setBins(binData);
            setRolls(rollData);
            if (!selectedAllocNo && allocData.length > 0) {
                setSelectedAllocNo(allocData[0].AllocationNo);
            }
        } catch (e) {
            console.error("Error loading print data:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const currentAlloc = allocations.find((a) => a.AllocationNo === selectedAllocNo) || allocations[0];

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="wms-container">
            {/* Top Toolbar (Hidden during print) */}
            <div className="wms-header no-print">
                <div className="wms-title-section">
                    <FaPrint className="wms-title-icon" />
                    <div>
                        <h1 className="wms-title">Print Binning Slip & Warehouse Labels</h1>
                        <p className="wms-subtitle">
                            Put-away Slips, Bin Rack Barcodes & Roll QR Sticker Printing (V-Connect Inc. Plot No. 9B)
                        </p>
                    </div>
                </div>

                <div className="wms-header-actions">
                    <button type="button" className="wms-btn-primary" onClick={handlePrint}>
                        <FaPrint /> Print Document (Ctrl+P)
                    </button>
                </div>
            </div>

            {/* Selection Controls (Hidden during print) */}
            <div className="wms-toolbar no-print">
                <div className="wms-toolbar-left">
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>
                        Select Allocation Doc:
                    </label>
                    <select
                        className="wms-filter-select"
                        value={selectedAllocNo}
                        onChange={(e) => setSelectedAllocNo(e.target.value)}
                    >
                        {allocations.map((a) => (
                            <option key={a.AllocationID} value={a.AllocationNo}>
                                {a.AllocationNo} ({a.RefDocNo || "Direct"} - {a.AllocationDate})
                            </option>
                        ))}
                    </select>

                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", marginLeft: "14px" }}>
                        Format:
                    </label>
                    <div className="wms-view-toggle">
                        <button
                            type="button"
                            className={`wms-view-btn ${printFormat === "slip" ? "active" : ""}`}
                            onClick={() => setPrintFormat("slip")}
                        >
                            Put-Away Slip
                        </button>
                        <button
                            type="button"
                            className={`wms-view-btn ${printFormat === "rack-labels" ? "active" : ""}`}
                            onClick={() => setPrintFormat("rack-labels")}
                        >
                            Rack QR Stickers
                        </button>
                        <button
                            type="button"
                            className={`wms-view-btn ${printFormat === "roll-tags" ? "active" : ""}`}
                            onClick={() => setPrintFormat("roll-tags")}
                        >
                            Roll Barcode Tags
                        </button>
                    </div>
                </div>

                <div className="wms-toolbar-right">
                    <button type="button" className="wms-btn-secondary" onClick={loadData}>
                        <FaSyncAlt /> Reload
                    </button>
                </div>
            </div>

            {/* FORMAT 1: OFFICIAL PUT-AWAY SLIP */}
            {printFormat === "slip" && currentAlloc && (
                <div className="wms-print-container">
                    <div className="wms-print-header">
                        <div>
                            <div className="wms-company-title">V-CONNECT INC.</div>
                            <div style={{ fontSize: "12px", color: "#475569" }}>
                                Plot No. 9B, Industrial Sector, Apparel & Footwear Division
                            </div>
                            <div className="wms-doc-title">BINNING / PUT-AWAY SLIP</div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                            <div className="wms-barcode-box" style={{ marginBottom: "6px" }}>
                                <span className="wms-barcode-bars" style={{ fontSize: "28px" }}>
                                    |||||||||||||||||
                                </span>
                                <span className="wms-barcode-label">{currentAlloc.AllocationNo}</span>
                            </div>
                            <div style={{ fontSize: "12px", color: "#334155" }}>
                                FY 01-Apr-2026 - 31-Mar-2027
                            </div>
                        </div>
                    </div>

                    {/* Metadata Header Box */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "10px",
                            padding: "12px",
                            backgroundColor: "#f8fafc",
                            border: "1px solid #cbd5e1",
                            borderRadius: "4px",
                            marginBottom: "16px",
                            fontSize: "12px"
                        }}
                    >
                        <div>
                            <strong>Slip / Alloc No:</strong> {currentAlloc.AllocationNo}
                        </div>
                        <div>
                            <strong>Slip Date:</strong> {currentAlloc.AllocationDate}
                        </div>
                        <div>
                            <strong>Warehouse / Store:</strong> {currentAlloc.WarehouseName}
                        </div>
                        <div>
                            <strong>Reference Type:</strong> {currentAlloc.RefType}
                        </div>
                        <div>
                            <strong>Ref Doc (GRN #):</strong> {currentAlloc.RefDocNo || "N/A"}
                        </div>
                        <div>
                            <strong>Allocated Operator:</strong> {currentAlloc.AllocatedBy || "Tilak"}
                        </div>
                    </div>

                    {/* Items to Put-away */}
                    <table className="wms-table" style={{ border: "1px solid #cbd5e1", marginBottom: "24px" }}>
                        <thead>
                            <tr style={{ background: "#e2e8f0" }}>
                                <th style={{ width: "35px", textAlign: "center" }}>#</th>
                                <th>Item Code</th>
                                <th>Item Description</th>
                                <th>Roll / Serial #</th>
                                <th>Target Bin</th>
                                <th>Zone / Rack</th>
                                <th style={{ textAlign: "right" }}>Alloc Qty</th>
                                <th style={{ textAlign: "center" }}>UOM</th>
                                <th style={{ textAlign: "center", width: "70px" }}>Verified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(currentAlloc.items || []).map((it, idx) => (
                                <tr key={idx}>
                                    <td style={{ textAlign: "center" }}>{idx + 1}</td>
                                    <td>
                                        <strong>{it.ItemCode}</strong>
                                    </td>
                                    <td>{it.ItemName}</td>
                                    <td style={{ fontFamily: "monospace", fontSize: "11px" }}>
                                        {it.RollSerialNo || "-"}
                                    </td>
                                    <td>
                                        <span
                                            style={{
                                                fontWeight: 800,
                                                color: "#004fb6",
                                                padding: "2px 6px",
                                                backgroundColor: "#eff6ff",
                                                borderRadius: "3px"
                                            }}
                                        >
                                            {it.BinCode}
                                        </span>
                                    </td>
                                    <td>{it.LotNo || "Primary Rack"}</td>
                                    <td style={{ textAlign: "right", fontWeight: 700 }}>
                                        {it.AllocatedQty}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{it.UOM}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <span style={{ fontSize: "14px", color: "#94a3b8" }}>☐</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Signatures Footer */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "20px",
                            marginTop: "40px",
                            paddingTop: "20px",
                            borderTop: "1px dashed #cbd5e1",
                            fontSize: "12px",
                            textAlign: "center"
                        }}
                    >
                        <div>
                            <div style={{ height: "40px" }} />
                            <div style={{ borderTop: "1px solid #000", paddingTop: "4px" }}>
                                <strong>Put-Away Operator</strong>
                            </div>
                        </div>

                        <div>
                            <div style={{ height: "40px" }} />
                            <div style={{ borderTop: "1px solid #000", paddingTop: "4px" }}>
                                <strong>Store Incharge</strong>
                            </div>
                        </div>

                        <div>
                            <div style={{ height: "40px" }} />
                            <div style={{ borderTop: "1px solid #000", paddingTop: "4px" }}>
                                <strong>QC Inspector</strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FORMAT 2: RACK QR STICKERS */}
            {printFormat === "rack-labels" && (
                <div className="wms-print-container">
                    <div style={{ textAlign: "center", marginBottom: "16px" }}>
                        <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: "#004fb6" }}>
                            Warehouse Bin Rack Shelf Labels (Plot No. 9B)
                        </h2>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                            Print on Adhesive Label Sheets for Bin Signage
                        </span>
                    </div>

                    <div className="wms-sticker-sheet">
                        {bins.slice(0, 8).map((b) => (
                            <div className="wms-bin-sticker" key={b.BinID}>
                                <div>
                                    <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>
                                        {b.WarehouseName}
                                    </span>
                                    <div style={{ fontSize: "22px", fontWeight: 800, color: "#004fb6", margin: "4px 0" }}>
                                        {b.BinCode}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#334155" }}>
                                        {b.Zone} • {b.Rack} • {b.Shelf}
                                    </div>
                                    <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                                        Max: {b.MaxCapacity} {b.UOM} ({b.BinType})
                                    </div>
                                </div>

                                <div style={{ textAlign: "center" }}>
                                    <div
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            border: "2px solid #000",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "#f8fafc"
                                        }}
                                    >
                                        <FaQrcode style={{ fontSize: "50px", color: "#000" }} />
                                    </div>
                                    <span style={{ fontSize: "9px", fontFamily: "monospace", display: "block", marginTop: "2px" }}>
                                        {b.BinCode}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* FORMAT 3: ROLL BARCODE TAGS */}
            {printFormat === "roll-tags" && (
                <div className="wms-print-container">
                    <div style={{ textAlign: "center", marginBottom: "16px" }}>
                        <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: "#004fb6" }}>
                            Fabric & Leather Roll Barcode Tags
                        </h2>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                            Print on Roll Hanging Tags or Adhesive Labels
                        </span>
                    </div>

                    <div className="wms-sticker-sheet">
                        {rolls.slice(0, 8).map((r) => (
                            <div className="wms-bin-sticker" key={r.RollID}>
                                <div>
                                    <div style={{ fontSize: "15px", fontWeight: 800, color: "#004fb6" }}>
                                        {r.RollSerialNo}
                                    </div>
                                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#1e293b", margin: "2px 0" }}>
                                        {r.ItemName}
                                    </div>
                                    <div style={{ fontSize: "11px", color: "#64748b" }}>
                                        Lot: <strong>{r.LotNo || "N/A"}</strong> | Shade: <strong>{r.Shade || "STD"}</strong>
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#0f172a", marginTop: "4px" }}>
                                        Length: <strong>{r.LengthQty} {r.UOM}</strong> | Bin: <strong>{r.BinCode || "Unset"}</strong>
                                    </div>
                                </div>

                                <div style={{ textAlign: "center" }}>
                                    <div className="wms-barcode-box">
                                        <span className="wms-barcode-bars" style={{ fontSize: "24px" }}>
                                            ||||||||||||||
                                        </span>
                                        <span className="wms-barcode-label">{r.RollSerialNo}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
