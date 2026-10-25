import React, { useState, useEffect } from "react";
import {
    FaFileImport,
    FaDownload,
    FaCloudUploadAlt,
    FaCheckCircle,
    FaExclamationTriangle,
    FaHistory,
    FaSyncAlt
} from "react-icons/fa";
import wmsService from "../../../services/wmsService";
import "../../../styles/wms.css";

const SAMPLE_IMPORT_TEMPLATE = `BinCode,ItemCode,ItemName,RollSerialNo,LotNo,Qty,UOM
BIN-A-01-01,LTH-1093,COW CULATTAS SINGLE LEATHER,RL-2627-1008,LOT-9B-A,120,SQFT
BIN-A-02-01,LTH-1112,COW ECO VEG SIDE CRUST LEATHER,RL-2627-1009,LOT-9B-B,180,SQFT
BIN-B-01-01,FAB-3011,COTTON TWILL LINING 120 GSM,RL-2627-2004,LOT-F44,250,MTR
BIN-B-01-02,RNF-1085,HIGH DENSITY TOPLINER 0.4MM,RL-2627-2005,LOT-R09,300,MTR
BIN-C-01-01,HDW-2236,JAM RIVET SINGLE HEAD 7MM,,LOT-RV-99,2000,SET`;

export default function StockImport() {
    const [warehouseName, setWarehouseName] = useState("RAW MATERIAL STORE 9B");
    const [importType, setImportType] = useState("Bin Opening Balance");
    const [parsedData, setParsedData] = useState([]);
    const [fileName, setFileName] = useState("");
    const [importHistory, setImportHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3500);
    };

    const loadHistory = () => {
        setImportHistory(wmsService.getImportHistory());
    };

    useEffect(() => {
        loadHistory();
    }, []);

    // Download sample CSV template
    const handleDownloadTemplate = () => {
        const blob = new Blob([SAMPLE_IMPORT_TEMPLATE], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "WMS_Stock_Import_Template.csv");
        link.click();
        showToast("Template downloaded successfully");
    };

    // Load sample demo data into preview
    const handleLoadSampleData = () => {
        parseCSVText(SAMPLE_IMPORT_TEMPLATE);
        setFileName("Sample_WMS_Inventory_Batch.csv");
        showToast("Sample WMS batch loaded into validation preview");
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (evt) => {
            const text = evt.target.result;
            parseCSVText(text);
        };
        reader.readAsText(file);
    };

    const parseCSVText = (csvText) => {
        const lines = csvText.trim().split("\n");
        if (lines.length <= 1) {
            showToast("CSV file appears to be empty");
            return;
        }

        const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
        const rows = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
            const obj = {};
            headers.forEach((h, idx) => {
                obj[h] = values[idx] || "";
            });

            // Validation
            const isValid = !!(obj.BinCode && obj.ItemCode && obj.Qty);
            rows.push({
                ...obj,
                id: i,
                isValid,
                error: !isValid ? "Missing BinCode, ItemCode, or Qty" : ""
            });
        }

        setParsedData(rows);
    };

    const handleExecuteImport = async () => {
        if (parsedData.length === 0) {
            showToast("Please upload or load a CSV file first");
            return;
        }

        setLoading(true);
        try {
            const res = await wmsService.importStock({
                WarehouseName: warehouseName,
                ImportType: importType,
                FileName: fileName || "StockImport.csv",
                records: parsedData.filter((r) => r.isValid)
            });

            showToast(res.message || "Import completed successfully");
            setParsedData([]);
            setFileName("");
            loadHistory();
        } catch (e) {
            showToast("Import error: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const totalQty = parsedData.reduce((acc, r) => acc + (parseFloat(r.Qty) || 0), 0);
    const validCount = parsedData.filter((r) => r.isValid).length;

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
                    <FaFileImport className="wms-title-icon" />
                    <div>
                        <h1 className="wms-title">WMS Stock Import</h1>
                        <p className="wms-subtitle">
                            Bulk Import Bin Balances, Roll Quantities & Physical Audit Stock via Excel / CSV (Plot No. 9B)
                        </p>
                    </div>
                </div>

                <div className="wms-header-actions">
                    <button type="button" className="wms-btn-secondary" onClick={handleDownloadTemplate}>
                        <FaDownload /> Download CSV Template
                    </button>
                    <button type="button" className="wms-btn-secondary" onClick={handleLoadSampleData}>
                        Load Sample Data
                    </button>
                </div>
            </div>

            {/* Step 1 & 2 Card */}
            <div className="wms-form-card">
                <div className="wms-form-header">
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#004fb6" }}>
                        Step 1: Import Parameters & File Upload
                    </span>
                </div>

                <div className="wms-form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                    <div className="wms-form-group">
                        <label className="wms-form-label">Target Warehouse *</label>
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
                        <label className="wms-form-label">Import Type *</label>
                        <select
                            className="wms-form-select"
                            value={importType}
                            onChange={(e) => setImportType(e.target.value)}
                        >
                            <option value="Bin Opening Balance">Bin Opening Balance</option>
                            <option value="Roll / Hide Stock Register">Roll / Hide Stock Register</option>
                            <option value="Physical Stock Audit Adjustment">Physical Stock Audit Adjustment</option>
                        </select>
                    </div>
                </div>

                {/* Upload Box */}
                <div
                    style={{
                        border: "2px dashed #94a3b8",
                        borderRadius: "8px",
                        padding: "30px",
                        textAlign: "center",
                        backgroundColor: "#f8fafc",
                        cursor: "pointer",
                        position: "relative",
                        marginTop: "10px"
                    }}
                >
                    <input
                        type="file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={handleFileUpload}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            opacity: 0,
                            cursor: "pointer"
                        }}
                    />
                    <FaCloudUploadAlt style={{ fontSize: "40px", color: "#004fb6", marginBottom: "8px" }} />
                    <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", margin: "4px 0" }}>
                        {fileName ? `Selected File: ${fileName}` : "Click or Drag & Drop CSV Stock File Here"}
                    </h4>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                        Accepts CSV format with columns: BinCode, ItemCode, ItemName, RollSerialNo, LotNo, Qty, UOM
                    </p>
                </div>
            </div>

            {/* Step 3: Live Validation & Preview Table */}
            {parsedData.length > 0 && (
                <div className="wms-form-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                        <div>
                            <span style={{ fontSize: "14px", fontWeight: 700, color: "#004fb6" }}>
                                Step 2: Verification & Data Preview
                            </span>
                            <span style={{ marginLeft: "14px", fontSize: "12px", color: "#475569" }}>
                                Total Rows: <strong>{parsedData.length}</strong> | Valid:{" "}
                                <strong style={{ color: "#10b981" }}>{validCount}</strong> | Total Qty:{" "}
                                <strong>{totalQty.toLocaleString()}</strong>
                            </span>
                        </div>

                        <button
                            type="button"
                            className="wms-btn-primary"
                            onClick={handleExecuteImport}
                            disabled={loading || validCount === 0}
                        >
                            <FaCheckCircle /> {loading ? "Importing..." : `Commit & Import (${validCount} items)`}
                        </button>
                    </div>

                    <div className="wms-table-responsive" style={{ border: "1px solid #cbd5e1", borderRadius: "4px" }}>
                        <table className="wms-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "40px", textAlign: "center" }}>#</th>
                                    <th>Target Bin</th>
                                    <th>Item Code</th>
                                    <th>Item Description</th>
                                    <th>Roll / Serial #</th>
                                    <th>Lot #</th>
                                    <th style={{ textAlign: "right" }}>Quantity</th>
                                    <th>UOM</th>
                                    <th style={{ textAlign: "center" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parsedData.map((row, idx) => (
                                    <tr key={row.id}>
                                        <td style={{ textAlign: "center", color: "#64748b" }}>{idx + 1}</td>
                                        <td>
                                            <strong style={{ color: "#004fb6" }}>{row.BinCode}</strong>
                                        </td>
                                        <td>{row.ItemCode}</td>
                                        <td>{row.ItemName}</td>
                                        <td>{row.RollSerialNo || "-"}</td>
                                        <td>{row.LotNo || "-"}</td>
                                        <td style={{ textAlign: "right", fontWeight: 600 }}>{row.Qty}</td>
                                        <td>{row.UOM}</td>
                                        <td style={{ textAlign: "center" }}>
                                            {row.isValid ? (
                                                <span className="wms-badge wms-badge-available">
                                                    <FaCheckCircle style={{ fontSize: "9px" }} /> Ready
                                                </span>
                                            ) : (
                                                <span className="wms-badge wms-badge-full">
                                                    <FaExclamationTriangle style={{ fontSize: "9px" }} /> Invalid
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Import History */}
            <div className="wms-table-card" style={{ marginTop: "24px" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaHistory style={{ color: "#004fb6" }} />
                    <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>
                        Recent Stock Import Activity Log
                    </h3>
                </div>

                <div className="wms-table-responsive">
                    <table className="wms-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Target Warehouse</th>
                                <th>Import Type</th>
                                <th>File Name</th>
                                <th style={{ textAlign: "center" }}>Total Lines</th>
                                <th style={{ textAlign: "center" }}>Imported Lines</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {importHistory.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                                        No past import history found.
                                    </td>
                                </tr>
                            ) : (
                                importHistory.map((h) => (
                                    <tr key={h.id}>
                                        <td>{h.date}</td>
                                        <td>{h.warehouse}</td>
                                        <td>{h.type}</td>
                                        <td style={{ fontFamily: "monospace", fontSize: "11px" }}>{h.fileName}</td>
                                        <td style={{ textAlign: "center" }}>{h.totalRows}</td>
                                        <td style={{ textAlign: "center", fontWeight: 600, color: "#10b981" }}>
                                            {h.validRows}
                                        </td>
                                        <td>
                                            <span className="wms-badge wms-badge-completed">{h.status}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
