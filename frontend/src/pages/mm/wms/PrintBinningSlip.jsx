import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FaPrint,
    FaQrcode,
    FaSyncAlt,
    FaArrowRight,
    FaBoxes,
    FaMapMarkerAlt,
    FaClipboardList,
    FaCheckCircle,
    FaExclamationTriangle
} from "react-icons/fa";
import wmsService from "../../../services/wmsService";
import { generateQRCodeSVG } from "../../../utils/qrBarcodeUtil";
import "../../../styles/wms.css";

// Complete Mapping of Rack Bin QR Stickers -> Stored Material, Item-Wise Stock Qty & Item-Wise Pending IRN Required Qty (Linked to IO/9B/2627/35)
export const RACK_QR_BIN_CATALOG = [
    {
        BinID: 1,
        BinCode: "BIN-C-01-01",
        WarehouseName: "RAW MATERIAL STORE 9B",
        Warehouse: "RAW MATERIAL STORE 9B",
        Zone: "Zone C - Hardware",
        Rack: "Rack C1",
        Shelf: "Level 1",
        Level: "Level 1",
        MaxCapacity: 500,
        BinType: "Shelf Bin",
        Category: "BRIDGE",
        ItemCode: "HDW-6830",
        ItemName: "BRITTEN HASP 12.4MM HT-6830",
        Variant: "57-14K GOLD",
        Color: "57-14K GOLD",
        UOM: "PCS",
        Rate: 45.0,
        Barcode: "BAR-HDW-6830",
        ItemWiseStockQty: 25,
        PendingIrnNo: "IRN/APP/9B/2627/1575",
        IoNo: "IO/9B/2627/35",
        IoStage: "Sampling",
        IrnDate: "04-09-2026",
        Department: "BAG SAMPLING",
        IrnWiseReqQty: 4.0,
        IrnIssuedQty: 0.0,
        IrnPendingQty: 4.0
    },
    {
        BinID: 2,
        BinCode: "BIN-C-01-02",
        WarehouseName: "RAW MATERIAL STORE 9B",
        Warehouse: "RAW MATERIAL STORE 9B",
        Zone: "Zone C - Hardware",
        Rack: "Rack C1",
        Shelf: "Level 2",
        Level: "Level 2",
        MaxCapacity: 500,
        BinType: "Shelf Bin",
        Category: "CHAIN",
        ItemCode: "CHN-6582",
        ItemName: "METAL CHAIN 9.2MM OVAL LINK CHAIN 2.5MMGG 138CM HT-6582",
        Variant: "57-14K GOLD",
        Color: "57-14K GOLD",
        UOM: "PCS",
        Rate: 125.0,
        Barcode: "BAR-CHN-6582",
        ItemWiseStockQty: 10,
        PendingIrnNo: "IRN/APP/9B/2627/1575",
        IoNo: "IO/9B/2627/35",
        IoStage: "Sampling",
        IrnDate: "04-09-2026",
        Department: "BAG SAMPLING",
        IrnWiseReqQty: 2.0,
        IrnIssuedQty: 0.0,
        IrnPendingQty: 2.0
    },
    {
        BinID: 3,
        BinCode: "BIN-C-01-03",
        WarehouseName: "RAW MATERIAL STORE 9B",
        Warehouse: "RAW MATERIAL STORE 9B",
        Zone: "Zone C - Hardware",
        Rack: "Rack C1",
        Shelf: "Level 3",
        Level: "Level 3",
        MaxCapacity: 500,
        BinType: "Shelf Bin",
        Category: "PULLER",
        ItemCode: "PLR-3953",
        ItemName: "PULLER METAL NO.3 TBH-3953",
        Variant: "57-14K GOLD",
        Color: "57-14K GOLD",
        UOM: "PCS",
        Rate: 18.0,
        Barcode: "BAR-PLR-3953",
        ItemWiseStockQty: 30,
        PendingIrnNo: "IRN/APP/9B/2627/1575",
        IoNo: "IO/9B/2627/35",
        IoStage: "Sampling",
        IrnDate: "04-09-2026",
        Department: "BAG SAMPLING",
        IrnWiseReqQty: 2.0,
        IrnIssuedQty: 0.0,
        IrnPendingQty: 2.0
    },
    {
        BinID: 4,
        BinCode: "BIN-C-01-04",
        WarehouseName: "RAW MATERIAL STORE 9B",
        Warehouse: "RAW MATERIAL STORE 9B",
        Zone: "Zone C - Hardware",
        Rack: "Rack C1",
        Shelf: "Level 4",
        Level: "Level 4",
        MaxCapacity: 500,
        BinType: "Shelf Bin",
        Category: "STOPPER",
        ItemCode: "STP-03SG",
        ItemName: "YKK BOTTOM STOPPER NO.3 03 SG BAH1 JMA",
        Variant: "#57-14K GOLD -C722",
        Color: "#57-14K GOLD -C722",
        UOM: "PCS",
        Rate: 2.5,
        Barcode: "BAR-STP-03SG",
        ItemWiseStockQty: 100,
        PendingIrnNo: "IRN/APP/9B/2627/1575",
        IoNo: "IO/9B/2627/35",
        IoStage: "Sampling",
        IrnDate: "04-09-2026",
        Department: "BAG SAMPLING",
        IrnWiseReqQty: 4.0,
        IrnIssuedQty: 2.0,
        IrnPendingQty: 2.0
    },
    {
        BinID: 5,
        BinCode: "BIN-D-01-01",
        WarehouseName: "RAW MATERIAL STORE 9B",
        Warehouse: "RAW MATERIAL STORE 9B",
        Zone: "Zone D - Labels",
        Rack: "Rack D1",
        Shelf: "Level 1",
        Level: "Level 1",
        MaxCapacity: 5000,
        BinType: "Shelf Bin",
        Category: "COO LABEL",
        ItemCode: "LBL-COO01",
        ItemName: "TB COO LABEL 1.8X1.9CM TB24-BSN-COO01",
        Variant: "N/A",
        Color: "N/A",
        UOM: "PCS",
        Rate: 1.25,
        Barcode: "BAR-LBL-COO01",
        ItemWiseStockQty: 2500,
        PendingIrnNo: "IRN/APP/9B/2627/2437",
        IoNo: "IO/9B/2627/35",
        IoStage: "Production",
        IrnDate: "30-10-2026",
        Department: "BAG PRODUCTION",
        IrnWiseReqQty: 1785.0,
        IrnIssuedQty: 0.0,
        IrnPendingQty: 1785.0
    },
    {
        BinID: 6,
        BinCode: "BIN-B-01-01",
        WarehouseName: "RAW MATERIAL STORE 9B",
        Warehouse: "RAW MATERIAL STORE 9B",
        Zone: "Zone B - Cords & Trims",
        Rack: "Rack B1",
        Shelf: "Level 1",
        Level: "Level 1",
        MaxCapacity: 10000,
        BinType: "Roll Bin",
        Category: "CORD",
        ItemCode: "CRD-1800",
        ItemName: "ROUND LEATHER CORD 1.8MM IMP",
        Variant: "CAFFEINE",
        Color: "CAFFEINE",
        UOM: "MTR",
        Rate: 14.50,
        Barcode: "BAR-CRD-1800",
        ItemWiseStockQty: 8000,
        PendingIrnNo: "IRN/APP/9B/2627/2437",
        IoNo: "IO/9B/2627/35",
        IoStage: "Production",
        IrnDate: "30-10-2026",
        Department: "BAG PRODUCTION",
        IrnWiseReqQty: 7497.0,
        IrnIssuedQty: 0.0,
        IrnPendingQty: 7497.0
    },
    {
        BinID: 7,
        BinCode: "BIN-B-01-02",
        WarehouseName: "RAW MATERIAL STORE 9B",
        Warehouse: "RAW MATERIAL STORE 9B",
        Zone: "Zone B - Threads",
        Rack: "Rack B1",
        Shelf: "Level 2",
        Level: "Level 2",
        MaxCapacity: 100,
        BinType: "Shelf Bin",
        Category: "A&E NYLON BOND THREADS",
        ItemCode: "THR-TEX70-FW",
        ItemName: "TH-NY-TEX-70 T-40/3000",
        Variant: "FW0323",
        Color: "FW0323",
        UOM: "CONE (3000 MTR)",
        Rate: 185.0,
        Barcode: "BAR-THR-TEX70",
        ItemWiseStockQty: 15,
        PendingIrnNo: "IRN/APP/9B/2627/2437",
        IoNo: "IO/9B/2627/35",
        IoStage: "Production",
        IrnDate: "30-10-2026",
        Department: "BAG PRODUCTION",
        IrnWiseReqQty: 10.0,
        IrnIssuedQty: 6.0,
        IrnPendingQty: 4.0
    },
    {
        BinID: 8,
        BinCode: "BIN-B-02-01",
        WarehouseName: "RAW MATERIAL STORE 9B",
        Warehouse: "RAW MATERIAL STORE 9B",
        Zone: "Zone B - Fabric & Tapes",
        Rack: "Rack B2",
        Shelf: "Level 1",
        Level: "Level 1",
        MaxCapacity: 200,
        BinType: "Roll Bin",
        Category: "TAPE",
        ItemCode: "TAP-210D",
        ItemName: "NY6 210D OXFORD PU 58 INCH YS-NY210D",
        Variant: "WHITE",
        Color: "WHITE",
        UOM: "MTR",
        Rate: 32.0,
        Barcode: "BAR-TAP-210D",
        ItemWiseStockQty: 50,
        PendingIrnNo: "IRN/APP/9B/2627/2292",
        IoNo: "IO/9B/2627/35",
        IoStage: "Production",
        IrnDate: "22-10-2026",
        Department: "BAG PRODUCTION",
        IrnWiseReqQty: 23.205,
        IrnIssuedQty: 0.0,
        IrnPendingQty: 23.205
    },
    {
        BinID: 9,
        BinCode: "BIN-B-02-02",
        WarehouseName: "RAW MATERIAL STORE 9B",
        Warehouse: "RAW MATERIAL STORE 9B",
        Zone: "Zone B - Raffia",
        Rack: "Rack B2",
        Shelf: "Level 2",
        Level: "Level 2",
        MaxCapacity: 100,
        BinType: "Shelf Bin",
        Category: "RAFFIA",
        ItemCode: "RAF-1100",
        ItemName: "THIN RAFFIA DR1100D.R",
        Variant: "NATURAL",
        Color: "NATURAL",
        UOM: "KG",
        Rate: 350.0,
        Barcode: "BAR-RAF-1100",
        ItemWiseStockQty: 15,
        PendingIrnNo: "IRN/APP/9B/2627/2299",
        IoNo: "IO/9B/2627/35",
        IoStage: "Production",
        IrnDate: "22-10-2026",
        Department: "BAG PRODUCTION",
        IrnWiseReqQty: 5.36,
        IrnIssuedQty: 0.0,
        IrnPendingQty: 5.36
    }
];

export default function PrintBinningSlip() {
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const initialFormat = queryParams.get("format") || location.state?.format || "rack-labels";

    const [allocations, setAllocations] = useState([]);
    const [bins, setBins] = useState(RACK_QR_BIN_CATALOG);
    const [rolls, setRolls] = useState([]);
    const [selectedAllocNo, setSelectedAllocNo] = useState(
        location.state?.allocationNo || "BA/9B/2627/001"
    );
    const [printFormat, setPrintFormat] = useState(initialFormat); // 'slip', 'rack-labels', 'roll-tags'
    const [selectedIrnFilter, setSelectedIrnFilter] = useState("ALL");

    const loadData = async () => {
        try {
            const [allocData, binData, rollData] = await Promise.all([
                wmsService.getAllocations(),
                wmsService.getBins(),
                wmsService.getRollSerials()
            ]);
            setAllocations(allocData);
            if (Array.isArray(binData) && binData.length > 0) {
                const enriched = RACK_QR_BIN_CATALOG.map((cat, i) => {
                    const found = binData.find(b => b.BinCode === cat.BinCode) || binData[i];
                    return found ? { ...found, ...cat } : cat;
                });
                setBins(enriched);
            }
            setRolls(rollData);
            if (!selectedAllocNo && allocData.length > 0) {
                setSelectedAllocNo(allocData[0].AllocationNo);
            }
        } catch (e) {
            console.error("Error loading print data:", e);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const currentAlloc = allocations.find((a) => a.AllocationNo === selectedAllocNo) || allocations[0];

    const handlePrint = () => {
        window.print();
    };

    // Direct navigation to Item Issue with selected Rack QR Sticker / Bin Location + Pending IRN
    const handleDirectIssueFromRackQR = (binObj) => {
        const params = new URLSearchParams({
            bin: binObj.BinCode,
            irn: binObj.PendingIrnNo || "IRN/APP/9B/2627/2401",
            item: binObj.ItemCode || "CRD-1001"
        });
        navigate(`/stock-issues?${params.toString()}`, {
            state: {
                binCode: binObj.BinCode,
                warehouseName: binObj.WarehouseName,
                zone: binObj.Zone,
                rack: binObj.Rack,
                shelf: binObj.Shelf,
                itemCode: binObj.ItemCode,
                itemName: binObj.ItemName,
                pendingIrnNo: binObj.PendingIrnNo,
                irnWiseReqQty: binObj.IrnWiseReqQty,
                irnPendingQty: binObj.IrnPendingQty,
                itemWiseStockQty: binObj.ItemWiseStockQty,
                fromRackSticker: true
            }
        });
    };

    const filteredBins = selectedIrnFilter === "ALL"
        ? bins
        : bins.filter(b => b.PendingIrnNo === selectedIrnFilter);

    const uniquePendingIrns = Array.from(new Set(RACK_QR_BIN_CATALOG.map(b => b.PendingIrnNo)));

    return (
        <div className="wms-container">
            {/* Top Toolbar (Hidden during print) */}
            <div className="wms-header no-print">
                <div className="wms-title-section">
                    <FaPrint className="wms-title-icon" />
                    <div>
                        <h1 className="wms-title">Print Binning Slip & Warehouse Labels</h1>
                        <p className="wms-subtitle">
                            Put-away Slips, Bin Rack QR Stickers & Direct Location-Wise / QR-Wise Item Issue (V-Connect Inc. Plot No. 9B)
                        </p>
                    </div>
                </div>

                <div className="wms-header-actions" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                        type="button"
                        className="wms-btn-secondary"
                        onClick={() => navigate("/stock-issues")}
                        style={{
                            backgroundColor: "#004fb6",
                            borderColor: "#004fb6",
                            color: "#ffffff",
                            fontWeight: 700
                        }}
                    >
                        <FaQrcode /> Direct Item Issue (Location & QR Code Wise)
                    </button>
                    <button type="button" className="wms-btn-primary" onClick={handlePrint}>
                        <FaPrint /> Print Document (Ctrl+P)
                    </button>
                </div>
            </div>

            {/* Selection Controls (Hidden during print) */}
            <div className="wms-toolbar no-print">
                <div className="wms-toolbar-left" style={{ flexWrap: "wrap", gap: "10px" }}>
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

                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", marginLeft: "8px" }}>
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

                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", marginLeft: "8px" }}>
                        Filter Pending IRN:
                    </label>
                    <select
                        className="wms-filter-select"
                        value={selectedIrnFilter}
                        onChange={(e) => setSelectedIrnFilter(e.target.value)}
                    >
                        <option value="ALL">All Pending IRNs ({uniquePendingIrns.length})</option>
                        {uniquePendingIrns.map(irn => (
                            <option key={irn} value={irn}>{irn}</option>
                        ))}
                    </select>
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
                                <th className="no-print" style={{ textAlign: "center" }}>Direct Issue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(currentAlloc.items || []).map((it, idx) => (
                                <tr key={idx}>
                                    <td style={{ textAlign: "center" }}>{idx + 1}</td>
                                    <td><strong>{it.ItemCode}</strong></td>
                                    <td>{it.ItemName}</td>
                                    <td style={{ fontFamily: "monospace", fontSize: "11px" }}>{it.RollSerialNo || "-"}</td>
                                    <td>
                                        <span style={{ fontWeight: 800, color: "#004fb6", padding: "2px 6px", backgroundColor: "#eff6ff", borderRadius: "3px" }}>
                                            {it.BinCode}
                                        </span>
                                    </td>
                                    <td>{it.LotNo || "Primary Rack"}</td>
                                    <td style={{ textAlign: "right", fontWeight: 700 }}>{it.AllocatedQty}</td>
                                    <td style={{ textAlign: "center" }}>{it.UOM}</td>
                                    <td className="no-print" style={{ textAlign: "center" }}>
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/stock-issues?bin=${encodeURIComponent(it.BinCode)}&item=${encodeURIComponent(it.ItemCode)}`)}
                                            style={{
                                                background: "#004fb6",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "3px",
                                                padding: "3px 9px",
                                                fontSize: "11px",
                                                fontWeight: 600,
                                                cursor: "pointer"
                                            }}
                                        >
                                            Direct Issue →
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* FORMAT 2: RACK QR STICKERS (LINKED DIRECTLY WITH ITEM ISSUE, PENDING IRN & STOCK VS REQ QTY) */}
            {printFormat === "rack-labels" && (
                <div className="wms-print-container">
                    <div style={{ textAlign: "center", marginBottom: "14px" }}>
                        <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: "#004fb6" }}>
                            Warehouse Bin Rack Shelf Labels (Plot No. 9B)
                        </h2>
                        <span style={{ fontSize: "12px", color: "#64748b", display: "block" }}>
                            Print on Adhesive Label Sheets for Bin Signage • Click any Rack QR Sticker for Direct Location-Wise & QR-Code-Wise Item Issue
                        </span>
                    </div>

                    {/* Summary Banner: Pending IRNs to Issue & Item-Wise Stock Qty APART FROM IRN-Wise Item Required Qty */}
                    <div
                        className="no-print"
                        style={{
                            background: "#f8fafc",
                            border: "1.5px solid #cbd5e1",
                            borderRadius: "6px",
                            padding: "12px 14px",
                            marginBottom: "18px"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                            <div style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
                                <FaClipboardList style={{ color: "#004fb6" }} />
                                <span>Pending IRNs to Issue — Item-Wise Stock Qty vs IRN-Wise Required Qty (Rack QR Linked)</span>
                            </div>
                            <span style={{ fontSize: "11px", color: "#475569", fontWeight: 600 }}>
                                Click any row or Rack QR Sticker below to auto-fill Location-Wise Item Issue
                            </span>
                        </div>

                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", background: "#ffffff", border: "1px solid #cbd5e1" }}>
                                <thead>
                                    <tr style={{ background: "#1e293b", color: "#ffffff" }}>
                                        <th style={{ padding: "6px 8px", borderRight: "1px solid rgba(255,255,255,0.15)" }}>Rack Bin QR</th>
                                        <th style={{ padding: "6px 8px", borderRight: "1px solid rgba(255,255,255,0.15)" }}>Zone / Rack / Level</th>
                                        <th style={{ padding: "6px 8px", borderRight: "1px solid rgba(255,255,255,0.15)" }}>Item Name & Code</th>
                                        <th style={{ padding: "6px 8px", textAlign: "right", background: "#065f46", borderRight: "1px solid rgba(255,255,255,0.15)" }}>
                                            Item-Wise Stock Qty (Bin Stock)
                                        </th>
                                        <th style={{ padding: "6px 8px", background: "#1e3a8a", borderRight: "1px solid rgba(255,255,255,0.15)" }}>
                                            Pending IRN to Issue
                                        </th>
                                        <th style={{ padding: "6px 8px", textAlign: "right", background: "#1e3a8a", borderRight: "1px solid rgba(255,255,255,0.15)" }}>
                                            IRN-Wise Required Qty
                                        </th>
                                        <th style={{ padding: "6px 8px", textAlign: "right", background: "#b45309", borderRight: "1px solid rgba(255,255,255,0.15)" }}>
                                            IRN Pending to Issue
                                        </th>
                                        <th style={{ padding: "6px 8px", textAlign: "center" }}>Direct QR Issue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBins.map((b) => (
                                        <tr
                                            key={b.BinID}
                                            style={{ borderBottom: "1px solid #e2e8f0", cursor: "pointer" }}
                                            onClick={() => handleDirectIssueFromRackQR(b)}
                                        >
                                            <td style={{ padding: "5px 8px", fontWeight: 800, color: "#004fb6", fontFamily: "monospace" }}>
                                                {b.BinCode}
                                            </td>
                                            <td style={{ padding: "5px 8px", color: "#475569" }}>
                                                {b.Zone} • {b.Rack} ({b.Shelf})
                                            </td>
                                            <td style={{ padding: "5px 8px", fontWeight: 700, color: "#0f172a" }}>
                                                {b.ItemName} <span style={{ color: "#64748b", fontFamily: "monospace", fontSize: "10.5px" }}>({b.ItemCode})</span>
                                            </td>
                                            {/* ITEM-WISE STOCK QTY (SEPARATE COLUMN) */}
                                            <td style={{
                                                padding: "5px 8px",
                                                textAlign: "right",
                                                fontWeight: 800,
                                                background: b.ItemWiseStockQty > 0 ? "#ecfdf5" : "#fef2f2",
                                                color: b.ItemWiseStockQty > 0 ? "#065f46" : "#991b1b",
                                                borderLeft: "2px solid #10b981",
                                                borderRight: "2px solid #10b981"
                                            }}>
                                                {b.ItemWiseStockQty} {b.UOM}
                                            </td>
                                            {/* PENDING IRN NO */}
                                            <td style={{ padding: "5px 8px", fontWeight: 700, color: "#1d4ed8", fontFamily: "monospace", background: "#eff6ff" }}>
                                                {b.PendingIrnNo}
                                            </td>
                                            {/* IRN-WISE ITEM REQUIRED QTY (APART FROM STOCK QTY) */}
                                            <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 800, color: "#1e3a8a", background: "#eff6ff" }}>
                                                {b.IrnWiseReqQty} {b.UOM}
                                            </td>
                                            {/* IRN PENDING TO ISSUE */}
                                            <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 800, color: "#b45309", background: "#fffbeb" }}>
                                                {b.IrnPendingQty} {b.UOM}
                                            </td>
                                            <td style={{ padding: "5px 8px", textAlign: "center" }}>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDirectIssueFromRackQR(b);
                                                    }}
                                                    style={{
                                                        background: "#004fb6",
                                                        color: "#ffffff",
                                                        border: "none",
                                                        borderRadius: "3px",
                                                        padding: "3px 8px",
                                                        fontSize: "10.5px",
                                                        fontWeight: 700,
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Issue by QR →
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RACK QR STICKERS GRID */}
                    <div className="wms-sticker-sheet">
                        {filteredBins.map((b) => (
                            <div
                                className="wms-bin-sticker"
                                key={b.BinID}
                                style={{ position: "relative", cursor: "pointer" }}
                                onClick={() => handleDirectIssueFromRackQR(b)}
                                title={`Click Rack QR Sticker ${b.BinCode} to issue ${b.ItemName} directly in Item Issue`}
                            >
                                <div style={{ flex: 1, paddingRight: "10px" }}>
                                    <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>
                                        {b.WarehouseName}
                                    </span>
                                    <div style={{ fontSize: "22px", fontWeight: 800, color: "#004fb6", margin: "2px 0" }}>
                                        {b.BinCode}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#334155", fontWeight: 600 }}>
                                        {b.Zone} • {b.Rack} • {b.Shelf}
                                    </div>
                                    <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                                        Max: {b.MaxCapacity} {b.UOM} ({b.BinType})
                                    </div>

                                    {/* Stored Item + Separate Item-Wise Stock Qty & IRN-Wise Required Qty */}
                                    <div style={{
                                        marginTop: "6px",
                                        paddingTop: "6px",
                                        borderTop: "1px dashed #cbd5e1",
                                        fontSize: "11px"
                                    }}>
                                        <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>
                                            {b.ItemName} <span style={{ color: "#475569", fontFamily: "monospace" }}>({b.ItemCode})</span>
                                        </div>

                                        {/* Two distinct boxes: 1) Item-Wise Stock Qty vs 2) IRN-Wise Required Qty & Pending IRN */}
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
                                            <div style={{
                                                background: b.ItemWiseStockQty > 0 ? "#ecfdf5" : "#fef2f2",
                                                border: `1px solid ${b.ItemWiseStockQty > 0 ? "#86efac" : "#fca5a5"}`,
                                                borderRadius: "3px",
                                                padding: "3px 6px"
                                            }}>
                                                <div style={{ fontSize: "9.5px", color: "#475569", fontWeight: 700, textTransform: "uppercase" }}>
                                                    Item-Wise Stock Qty
                                                </div>
                                                <div style={{
                                                    fontSize: "12px",
                                                    fontWeight: 800,
                                                    color: b.ItemWiseStockQty > 0 ? "#065f46" : "#991b1b"
                                                }}>
                                                    {b.ItemWiseStockQty} {b.UOM}
                                                </div>
                                            </div>

                                            <div style={{
                                                background: "#eff6ff",
                                                border: "1px solid #93c5fd",
                                                borderRadius: "3px",
                                                padding: "3px 6px"
                                            }}>
                                                <div style={{ fontSize: "9.5px", color: "#1e40af", fontWeight: 700, textTransform: "uppercase" }}>
                                                    IRN-Wise Req Qty
                                                </div>
                                                <div style={{ fontSize: "12px", fontWeight: 800, color: "#1e3a8a" }}>
                                                    {b.IrnWiseReqQty} {b.UOM} <span style={{ color: "#b45309", fontSize: "10.5px" }}>(Pend: {b.IrnPendingQty})</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: "4px", fontSize: "10.5px", fontWeight: 700, color: "#1976d2", fontFamily: "monospace" }}>
                                            Pending IRN: {b.PendingIrnNo} ({b.Department})
                                        </div>
                                    </div>

                                    <div className="no-print" style={{ marginTop: "7px" }}>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDirectIssueFromRackQR(b);
                                            }}
                                            style={{
                                                background: "#004fb6",
                                                color: "#ffffff",
                                                border: "none",
                                                borderRadius: "3px",
                                                padding: "4px 10px",
                                                fontSize: "11px",
                                                fontWeight: 700,
                                                cursor: "pointer",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "5px"
                                            }}
                                        >
                                            <FaQrcode size={10} />
                                            <span>Direct Item Issue ({b.BinCode})</span>
                                            <FaArrowRight size={9} />
                                        </button>
                                    </div>
                                </div>

                                <div style={{ textAlign: "center" }}>
                                    <div
                                        style={{
                                            width: "78px",
                                            height: "78px",
                                            border: "2px solid #000",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "#ffffff",
                                            padding: "3px"
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: generateQRCodeSVG(b.BinCode, { size: 70 })
                                        }}
                                    />
                                    <span style={{ fontSize: "9.5px", fontWeight: 700, fontFamily: "monospace", display: "block", marginTop: "3px" }}>
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
                            <div
                                className="wms-bin-sticker"
                                key={r.RollID}
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/stock-issues?bin=${encodeURIComponent(r.BinCode || "BIN-A-01-01")}&item=${encodeURIComponent(r.ItemCode)}`)}
                            >
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
