import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FaQrcode,
    FaBarcode,
    FaPlus,
    FaSyncAlt,
    FaSearch,
    FaPrint,
    FaFileExport,
    FaCheckCircle,
    FaArrowRight,
    FaCogs
} from "react-icons/fa";
import wmsService from "../../../services/wmsService";
import "../../../styles/wms.css";

const ITEMS_LIST = [
    { code: "LTH-1093", name: "COW CULATTAS SINGLE LEATHER", uom: "SQFT", defaultLen: 150, prefix: "RL-LTH-" },
    { code: "LTH-1112", name: "COW ECO VEG SIDE CRUST LEATHER", uom: "SQFT", defaultLen: 140, prefix: "RL-LTH-" },
    { code: "FAB-3011", name: "COTTON TWILL LINING 120 GSM", uom: "MTR", defaultLen: 50, prefix: "RL-FAB-" },
    { code: "RNF-1085", name: "HIGH DENSITY TOPLINER 0.4MM", uom: "MTR", defaultLen: 100, prefix: "RL-RNF-" },
    { code: "HDW-2236", name: "JAM RIVET SINGLE HEAD 7MM", uom: "SET", defaultLen: 1000, prefix: "SR-HDW-" },
    { code: "ZIP-4022", name: "YKK METALLIC ZIPPER #5 BRONZE", uom: "PCS", defaultLen: 250, prefix: "SR-ZIP-" }
];

export default function RollSerialGeneration() {
    const [rolls, setRolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("register"); // 'register' or 'generator'
    const [toastMessage, setToastMessage] = useState("");

    // Generator form state
    const [selectedItemCode, setSelectedItemCode] = useState("FAB-3011");
    const [lotNo, setLotNo] = useState("LOT-2026-F44");
    const [shade, setShade] = useState("OFF WHITE");
    const [standardLength, setStandardLength] = useState(50);
    const [quantityCount, setQuantityCount] = useState(5);
    const [prefix, setPrefix] = useState("RL-FAB-");
    const [startIndex, setStartIndex] = useState(101);
    const [refDocNo, setRefDocNo] = useState("GRN-2026-088");

    // Live preview of rolls to generate
    const [previewList, setPreviewList] = useState([]);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3500);
    };

    const loadRolls = async () => {
        setLoading(true);
        try {
            const data = await wmsService.getRollSerials();
            setRolls(data);
        } catch (e) {
            console.error("Failed to load rolls:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRolls();
    }, []);

    // Recompute preview when generator parameters change
    useEffect(() => {
        const item = ITEMS_LIST.find((i) => i.code === selectedItemCode);
        const count = Math.min(Math.max(parseInt(quantityCount, 10) || 1, 1), 50);
        const start = parseInt(startIndex, 10) || 100;
        const list = [];

        for (let i = 0; i < count; i++) {
            const rollNo = `${prefix}${String(start + i).padStart(4, "0")}`;
            list.push({
                rollNo,
                itemCode: item?.code,
                itemName: item?.name,
                lotNo,
                shade,
                lengthQty: parseFloat(standardLength) || 50,
                uom: item?.uom || "MTR",
                barcode: `BAR-${rollNo.replace(/[^A-Za-z0-9]/g, "")}`
            });
        }
        setPreviewList(list);
    }, [selectedItemCode, lotNo, shade, standardLength, quantityCount, prefix, startIndex]);

    const handleItemSelect = (code) => {
        setSelectedItemCode(code);
        const item = ITEMS_LIST.find((i) => i.code === code);
        if (item) {
            setStandardLength(item.defaultLen);
            setPrefix(item.prefix);
        }
    };

    const handleGenerate = async () => {
        const item = ITEMS_LIST.find((i) => i.code === selectedItemCode);
        const payload = {
            ItemCode: item.code,
            ItemName: item.name,
            LotNo: lotNo,
            Shade: shade,
            StandardLength: standardLength,
            QuantityCount: quantityCount,
            UOM: item.uom,
            Prefix: prefix,
            StartIndex: startIndex,
            RefDocNo: refDocNo,
            CreatedBy: "Tilak"
        };

        try {
            await wmsService.generateRollSerials(payload);
            showToast(`Generated ${quantityCount} roll serial numbers successfully!`);
            await loadRolls();
            setActiveTab("register");
        } catch (e) {
            showToast("Error generating serials: " + e.message);
        }
    };

    const handleExportCSV = () => {
        const headers = "RollSerialNo,ItemCode,ItemName,LotNo,Shade,LengthQty,UOM,BinCode,Status,GeneratedDate\n";
        const rows = rolls
            .map(
                (r) =>
                    `"${r.RollSerialNo}","${r.ItemCode}","${r.ItemName}","${r.LotNo || ""}","${r.Shade || ""}","${r.LengthQty}","${r.UOM}","${r.BinCode || ""}","${r.Status}","${r.GeneratedDate}"`
            )
            .join("\n");
        const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Roll_Serials_${new Date().toISOString().split("T")[0]}.csv`);
        link.click();
        showToast("Exported serials list to CSV");
    };

    const filteredRolls = rolls.filter((r) => {
        const q = searchTerm.toLowerCase();
        return (
            (r.RollSerialNo || "").toLowerCase().includes(q) ||
            (r.ItemCode || "").toLowerCase().includes(q) ||
            (r.ItemName || "").toLowerCase().includes(q) ||
            (r.BinCode || "").toLowerCase().includes(q) ||
            (r.LotNo || "").toLowerCase().includes(q)
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
                    <FaBarcode className="wms-title-icon" />
                    <div>
                        <h1 className="wms-title">Roll OR Serial Num. Generation</h1>
                        <p className="wms-subtitle">
                            Automated Unique Roll ID, Leather Hide & Serial Barcode/QR Generation for Production & Stock
                        </p>
                    </div>
                </div>

                <div className="wms-header-actions">
                    <Link to="/wms/print-binning-slip" className="wms-btn-secondary">
                        <FaPrint /> Print Barcode Tags
                    </Link>
                    <button type="button" className="wms-btn-secondary" onClick={handleExportCSV}>
                        <FaFileExport /> Export CSV
                    </button>
                    {activeTab === "register" ? (
                        <button
                            type="button"
                            className="wms-btn-primary"
                            onClick={() => setActiveTab("generator")}
                        >
                            <FaPlus /> Generate Rolls / Serials
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="wms-btn-secondary"
                            onClick={() => setActiveTab("register")}
                        >
                            View Register
                        </button>
                    )}
                </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="wms-toolbar">
                <div className="wms-toolbar-left">
                    <div className="wms-view-toggle">
                        <button
                            type="button"
                            className={`wms-view-btn ${activeTab === "register" ? "active" : ""}`}
                            onClick={() => setActiveTab("register")}
                        >
                            <FaBarcode /> Serial Register ({rolls.length})
                        </button>
                        <button
                            type="button"
                            className={`wms-view-btn ${activeTab === "generator" ? "active" : ""}`}
                            onClick={() => setActiveTab("generator")}
                        >
                            <FaCogs /> Roll Generator
                        </button>
                    </div>

                    {activeTab === "register" && (
                        <div className="wms-search-input-wrap">
                            <FaSearch className="wms-search-icon" />
                            <input
                                type="text"
                                className="wms-search-input"
                                placeholder="Search roll #, item code, bin..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <div className="wms-toolbar-right">
                    <button
                        type="button"
                        className="wms-btn-secondary"
                        onClick={loadRolls}
                        title="Reload"
                    >
                        <FaSyncAlt />
                    </button>
                </div>
            </div>

            {/* TAB 1: GENERATOR */}
            {activeTab === "generator" && (
                <div className="wms-form-card">
                    <div className="wms-form-header">
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#004fb6" }}>
                            Batch Roll & Serial Number Generator
                        </span>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                            Generating {quantityCount} rolls ({parseFloat(standardLength) * parseInt(quantityCount, 10)} total units)
                        </span>
                    </div>

                    <div className="wms-form-grid">
                        <div className="wms-form-group">
                            <label className="wms-form-label">Material / Item *</label>
                            <select
                                className="wms-form-select"
                                value={selectedItemCode}
                                onChange={(e) => handleItemSelect(e.target.value)}
                            >
                                {ITEMS_LIST.map((item) => (
                                    <option key={item.code} value={item.code}>
                                        {item.code} - {item.name} ({item.uom})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="wms-form-group">
                            <label className="wms-form-label">Lot / Batch Number</label>
                            <input
                                type="text"
                                className="wms-form-input"
                                value={lotNo}
                                onChange={(e) => setLotNo(e.target.value)}
                            />
                        </div>

                        <div className="wms-form-group">
                            <label className="wms-form-label">Color / Shade</label>
                            <input
                                type="text"
                                className="wms-form-input"
                                value={shade}
                                onChange={(e) => setShade(e.target.value)}
                            />
                        </div>

                        <div className="wms-form-group">
                            <label className="wms-form-label">Standard Roll Length / Qty</label>
                            <input
                                type="number"
                                className="wms-form-input"
                                value={standardLength}
                                onChange={(e) => setStandardLength(parseFloat(e.target.value) || 0)}
                            />
                        </div>

                        <div className="wms-form-group">
                            <label className="wms-form-label">Number of Rolls to Generate</label>
                            <input
                                type="number"
                                min="1"
                                max="50"
                                className="wms-form-input"
                                value={quantityCount}
                                onChange={(e) => setQuantityCount(parseInt(e.target.value, 10) || 1)}
                            />
                        </div>

                        <div className="wms-form-group">
                            <label className="wms-form-label">Roll ID Prefix</label>
                            <input
                                type="text"
                                className="wms-form-input"
                                value={prefix}
                                onChange={(e) => setPrefix(e.target.value)}
                            />
                        </div>

                        <div className="wms-form-group">
                            <label className="wms-form-label">Starting Serial Index</label>
                            <input
                                type="number"
                                className="wms-form-input"
                                value={startIndex}
                                onChange={(e) => setStartIndex(parseInt(e.target.value, 10) || 1)}
                            />
                        </div>

                        <div className="wms-form-group">
                            <label className="wms-form-label">Inward Reference (GRN / PO)</label>
                            <input
                                type="text"
                                className="wms-form-input"
                                value={refDocNo}
                                onChange={(e) => setRefDocNo(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Preview Table */}
                    <div style={{ marginTop: "18px" }}>
                        <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", marginBottom: "8px" }}>
                            Generation Output Preview ({previewList.length} tags)
                        </h4>
                        <div className="wms-table-responsive" style={{ border: "1px solid #cbd5e1", borderRadius: "4px" }}>
                            <table className="wms-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "40px", textAlign: "center" }}>#</th>
                                        <th>Generated Roll Serial No</th>
                                        <th>Item Description</th>
                                        <th>Lot / Shade</th>
                                        <th style={{ textAlign: "right" }}>Length / Qty</th>
                                        <th>Barcode Value</th>
                                        <th style={{ textAlign: "center" }}>Barcode Tag</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewList.map((p, idx) => (
                                        <tr key={p.rollNo}>
                                            <td style={{ textAlign: "center", color: "#64748b" }}>{idx + 1}</td>
                                            <td>
                                                <strong style={{ color: "#004fb6" }}>{p.rollNo}</strong>
                                            </td>
                                            <td>{p.itemName}</td>
                                            <td>{p.lotNo} ({p.shade})</td>
                                            <td style={{ textAlign: "right", fontWeight: 600 }}>
                                                {p.lengthQty} {p.uom}
                                            </td>
                                            <td>
                                                <span style={{ fontFamily: "monospace", fontSize: "11px" }}>
                                                    {p.barcode}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <div className="wms-barcode-box">
                                                    <span className="wms-barcode-bars">||||||||||||</span>
                                                    <span className="wms-barcode-label">{p.rollNo}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <button
                            type="button"
                            className="wms-btn-secondary"
                            onClick={() => setActiveTab("register")}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="wms-btn-primary"
                            onClick={handleGenerate}
                        >
                            <FaCheckCircle /> Confirm & Generate {quantityCount} Rolls
                        </button>
                    </div>
                </div>
            )}

            {/* TAB 2: REGISTER */}
            {activeTab === "register" && (
                <div className="wms-table-card">
                    <div className="wms-table-responsive">
                        <table className="wms-table">
                            <thead>
                                <tr>
                                    <th>Roll / Serial #</th>
                                    <th>Item Code</th>
                                    <th>Item Name</th>
                                    <th>Lot / Shade</th>
                                    <th style={{ textAlign: "right" }}>Length / Qty</th>
                                    <th>Current Bin</th>
                                    <th>Barcode</th>
                                    <th>Status</th>
                                    <th>Generated Date</th>
                                    <th>Reference</th>
                                    <th style={{ textAlign: "center" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={11} style={{ textAlign: "center", padding: "30px" }}>
                                            Loading roll serial numbers...
                                        </td>
                                    </tr>
                                ) : filteredRolls.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                            No rolls or serial numbers found. Click "+ Generate Rolls / Serials" to create new ones.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRolls.map((roll) => (
                                        <tr key={roll.RollID}>
                                            <td>
                                                <strong style={{ color: "#004fb6" }}>{roll.RollSerialNo}</strong>
                                            </td>
                                            <td>{roll.ItemCode}</td>
                                            <td>{roll.ItemName}</td>
                                            <td>
                                                {roll.LotNo || "-"}
                                                {roll.Shade ? ` (${roll.Shade})` : ""}
                                            </td>
                                            <td style={{ textAlign: "right", fontWeight: 700 }}>
                                                {roll.LengthQty} {roll.UOM}
                                            </td>
                                            <td>
                                                {roll.BinCode ? (
                                                    <span style={{ fontWeight: 600, color: "#0f172a" }}>
                                                        {roll.BinCode}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
                                                        Unallocated
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <span style={{ fontFamily: "monospace", fontSize: "11px" }}>
                                                    {roll.Barcode || `BAR-${roll.RollSerialNo}`}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`wms-badge ${
                                                        roll.Status === "Allocated"
                                                            ? "wms-badge-completed"
                                                            : roll.Status === "Issued"
                                                            ? "wms-badge-pending"
                                                            : "wms-badge-available"
                                                    }`}
                                                >
                                                    {roll.Status}
                                                </span>
                                            </td>
                                            <td>{roll.GeneratedDate}</td>
                                            <td style={{ fontSize: "11px" }}>{roll.RefDocNo || "-"}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <Link
                                                    to="/wms/print-binning-slip"
                                                    state={{ rollNo: roll.RollSerialNo }}
                                                    className="wms-btn-secondary"
                                                    style={{ padding: "3px 7px", fontSize: "11px" }}
                                                    title="Print Label"
                                                >
                                                    <FaPrint /> Print
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
