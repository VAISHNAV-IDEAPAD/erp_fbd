import React, { useState, useRef } from "react";
import {
    FaFileExcel,
    FaFolderOpen,
    FaDownload,
    FaPlus,
    FaListUl,
    FaTimes,
    FaCaretUp,
    FaCaretDown,
    FaCheckCircle,
    FaSpinner
} from "react-icons/fa";
import "../../../styles/ioRmrRecalculate.css";

const SAMPLE_IO_LIST = [
    "IO/9B/2627/001",
    "IO/9B/2627/002",
    "IO/9B/2627/003"
];

export default function IoRmrRecalculate() {
    // File upload state
    const [fileName, setFileName] = useState("No file");
    const fileInputRef = useRef(null);

    // IO Nos state
    const [ioInput, setIoInput] = useState("");
    const [ioList, setIoList] = useState(SAMPLE_IO_LIST);
    const [selectedIo, setSelectedIo] = useState(SAMPLE_IO_LIST[0] || null);

    // Right column fields
    const [group, setGroup] = useState("");
    const [item, setItem] = useState("");
    const [variant, setVariant] = useState("");
    const [itemCategory, setItemCategory] = useState("");

    // Modal state
    const [excelFormatModal, setExcelFormatModal] = useState(false);

    // Recalculate processing state
    const [calculating, setCalculating] = useState(false);
    const [resultMessage, setResultMessage] = useState(null);

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
        }
    };

    // Handle import from file
    const handleImportFile = () => {
        if (fileName === "No file") {
            alert("Please choose an Excel file first!");
            return;
        }
        // Simulated parsed IOs from Excel
        const newIos = ["IO/9B/2627/004", "IO/9B/2627/005", "IO/9B/2627/006"];
        setIoList(prev => [...new Set([...prev, ...newIos])]);
        alert(`Successfully imported ${newIos.length} IO numbers from ${fileName}!`);
    };

    // Add manual IO
    const handleAddIo = () => {
        const trimmed = ioInput.trim();
        if (!trimmed) return;
        if (!ioList.includes(trimmed)) {
            setIoList(prev => [...prev, trimmed]);
            setSelectedIo(trimmed);
        }
        setIoInput("");
    };

    // Remove selected IO
    const handleRemoveIo = () => {
        if (!selectedIo) return;
        setIoList(prev => prev.filter(i => i !== selectedIo));
        setSelectedIo(null);
    };

    // Clear all fields
    const handleClear = () => {
        setFileName("No file");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setIoInput("");
        setIoList([]);
        setSelectedIo(null);
        setGroup("");
        setItem("");
        setVariant("");
        setItemCategory("");
        setResultMessage(null);
    };

    // Trigger Recalculate
    const handleRecalculate = () => {
        if (ioList.length === 0) {
            alert("Please add or import at least one IO No to recalculate!");
            return;
        }

        setCalculating(true);
        setResultMessage(null);

        setTimeout(() => {
            setCalculating(false);
            setResultMessage({
                success: true,
                count: ioList.length,
                ios: ioList.join(", "),
                timestamp: new Date().toLocaleTimeString(),
                details: "Raw Material Requirement (RMR) recalculated successfully against live BOM parameters & inventory stock."
            });
        }, 800);
    };

    return (
        <div className="rmr-page">
            {/* Title */}
            <h1 className="rmr-title">IO RMR Recalculate</h1>

            {/* 2-Column Form */}
            <div className="rmr-form-container">
                {/* Left Column */}
                <div className="rmr-col">
                    {/* IO Nos Excel */}
                    <div className="rmr-field-group">
                        <div className="rmr-label-row">
                            <label className="rmr-label">IO Nos Excel</label>
                            <span
                                className="rmr-excel-link"
                                onClick={() => setExcelFormatModal(true)}
                            >
                                <FaFileExcel style={{ color: "#16a34a", fontSize: "12px" }} />
                                <span>View excel format</span>
                            </span>
                        </div>

                        {/* File picker row */}
                        <div className="rmr-file-picker-row">
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                accept=".xlsx, .xls, .csv"
                                onChange={handleFileChange}
                            />
                            <div className="rmr-file-display">{fileName}</div>
                            <button
                                type="button"
                                className="rmr-btn-choose-file"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <FaFolderOpen />
                                <span>Choose file</span>
                            </button>
                        </div>

                        {/* Import button */}
                        <button
                            type="button"
                            className="rmr-btn-import"
                            onClick={handleImportFile}
                        >
                            <FaDownload style={{ fontSize: "11px" }} />
                            <span>Import</span>
                        </button>
                    </div>

                    {/* IO No input with + button */}
                    <div className="rmr-field-group">
                        <label className="rmr-label">IO No.</label>
                        <div className="rmr-input-group">
                            <input
                                type="text"
                                placeholder="IO No"
                                value={ioInput}
                                onChange={(e) => setIoInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddIo();
                                    }
                                }}
                                className="rmr-input"
                            />
                            <button
                                type="button"
                                className="rmr-btn-add"
                                onClick={handleAddIo}
                                title="Add IO No"
                            >
                                <FaPlus style={{ fontSize: "11px" }} />
                            </button>
                        </div>
                    </div>

                    {/* IO No Selected Listbox */}
                    <div className="rmr-field-group">
                        <label className="rmr-label">IO No</label>
                        <div className="rmr-listbox-container">
                            {/* Scrollable list of IOs */}
                            <div className="rmr-listbox-items">
                                {ioList.map((ioItem, idx) => (
                                    <div
                                        key={idx}
                                        className={`rmr-list-item ${selectedIo === ioItem ? "selected" : ""}`}
                                        onClick={() => setSelectedIo(ioItem)}
                                    >
                                        {ioItem}
                                    </div>
                                ))}
                                {ioList.length === 0 && (
                                    <div style={{ padding: "8px", color: "#94a3b8", fontSize: "11.5px" }}>
                                        No IOs added yet.
                                    </div>
                                )}
                            </div>

                            {/* Listbox controls */}
                            <div className="rmr-listbox-controls">
                                <div className="rmr-listbox-scroll-btns">
                                    <button
                                        type="button"
                                        className="rmr-scroll-btn"
                                        title="Scroll Up"
                                        onClick={() => {
                                            if (ioList.length === 0) return;
                                            const idx = ioList.indexOf(selectedIo);
                                            if (idx > 0) setSelectedIo(ioList[idx - 1]);
                                        }}
                                    >
                                        <FaCaretUp />
                                    </button>
                                    <button
                                        type="button"
                                        className="rmr-scroll-btn"
                                        title="Scroll Down"
                                        onClick={() => {
                                            if (ioList.length === 0) return;
                                            const idx = ioList.indexOf(selectedIo);
                                            if (idx < ioList.length - 1) setSelectedIo(ioList[idx + 1]);
                                        }}
                                    >
                                        <FaCaretDown />
                                    </button>
                                </div>
                                <div className="rmr-listbox-action-btns">
                                    <button
                                        type="button"
                                        className="rmr-action-btn-ctrl"
                                        title="Select / View All"
                                        onClick={() => alert(`Total ${ioList.length} IOs queued: ${ioList.join(", ")}`)}
                                    >
                                        <FaListUl style={{ fontSize: "10px", color: "#64748b" }} />
                                    </button>
                                    <button
                                        type="button"
                                        className="rmr-action-btn-ctrl rmr-btn-delete-item"
                                        title="Delete Selected IO"
                                        onClick={handleRemoveIo}
                                    >
                                        <FaTimes style={{ fontSize: "11px" }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="rmr-col">
                    {/* Group */}
                    <div className="rmr-field-group">
                        <label className="rmr-label">Group</label>
                        <input
                            type="text"
                            placeholder="Type and select Group"
                            value={group}
                            onChange={(e) => setGroup(e.target.value)}
                            className="rmr-input"
                        />
                    </div>

                    {/* Item */}
                    <div className="rmr-field-group">
                        <label className="rmr-label">Item</label>
                        <input
                            type="text"
                            placeholder="Type and select Item"
                            value={item}
                            onChange={(e) => setItem(e.target.value)}
                            className="rmr-input"
                        />
                    </div>

                    {/* Variant */}
                    <div className="rmr-field-group">
                        <label className="rmr-label">Variant</label>
                        <input
                            type="text"
                            placeholder="Type and select Variant"
                            value={variant}
                            onChange={(e) => setVariant(e.target.value)}
                            className="rmr-input"
                        />
                    </div>

                    {/* Item Category */}
                    <div className="rmr-field-group">
                        <label className="rmr-label">Item Category</label>
                        <input
                            type="text"
                            placeholder="Type and select Item Category"
                            value={itemCategory}
                            onChange={(e) => setItemCategory(e.target.value)}
                            className="rmr-input"
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Actions Row: Clear & Recalculate */}
            <div className="rmr-actions-row">
                <button
                    type="button"
                    className="rmr-btn-clear"
                    onClick={handleClear}
                >
                    Clear
                </button>
                <button
                    type="button"
                    className="rmr-btn-recalculate"
                    onClick={handleRecalculate}
                    disabled={calculating}
                >
                    {calculating ? (
                        <>
                            <FaSpinner className="fa-spin" style={{ marginRight: "6px" }} />
                            Calculating...
                        </>
                    ) : (
                        "Recalculate"
                    )}
                </button>
            </div>

            {/* Results Feedback Banner */}
            {resultMessage && (
                <div className="rmr-alert-success">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, marginBottom: "4px" }}>
                        <FaCheckCircle style={{ color: "#16a34a", fontSize: "16px" }} />
                        <span>Recalculation Completed ({resultMessage.timestamp})</span>
                    </div>
                    <div>{resultMessage.details}</div>
                    <div style={{ marginTop: "6px", fontSize: "11.5px", color: "#15803d" }}>
                        <strong>Queued Orders:</strong> {resultMessage.ios}
                    </div>
                </div>
            )}

            {/* Excel Format Modal */}
            {excelFormatModal && (
                <div className="rmr-modal-overlay" onClick={() => setExcelFormatModal(false)}>
                    <div className="rmr-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="rmr-modal-header">
                            <h5 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>IO Excel Template Specification</h5>
                            <button
                                type="button"
                                style={{ background: "none", border: "none", color: "#ffffff", fontSize: "15px", cursor: "pointer" }}
                                onClick={() => setExcelFormatModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="rmr-modal-body">
                            <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "12px" }}>
                                The Excel spreadsheet should contain a single column header <code>IO_NO</code> in Row 1:
                            </p>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                                <thead>
                                    <tr style={{ background: "#f1f5fb", borderBottom: "1px solid #cbd5e1" }}>
                                        <th style={{ padding: "6px 10px", textAlign: "left" }}>IO_NO (Column A)</th>
                                        <th style={{ padding: "6px 10px", textAlign: "left" }}>Remarks (Optional)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                                        <td style={{ padding: "5px 10px", fontWeight: 600, color: "#337ab7" }}>IO/9B/2627/001</td>
                                        <td style={{ padding: "5px 10px", color: "#64748b" }}>Men's Casual Shirt</td>
                                    </tr>
                                    <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                                        <td style={{ padding: "5px 10px", fontWeight: 600, color: "#337ab7" }}>IO/9B/2627/002</td>
                                        <td style={{ padding: "5px 10px", color: "#64748b" }}>Denim Jacket</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="rmr-modal-footer">
                            <button
                                type="button"
                                style={{ padding: "4px 14px", fontSize: "12px", border: "1px solid #cbd5e1", background: "#ffffff", borderRadius: "2px", cursor: "pointer" }}
                                onClick={() => setExcelFormatModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
