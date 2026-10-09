import React, { useState, useEffect, useMemo } from "react";
import { Table, Modal, Button, Alert, Spinner } from "react-bootstrap";
import { 
    FaFileExcel, 
    FaFolderOpen, 
    FaFileImport, 
    FaPlus, 
    FaTimes, 
    FaListUl, 
    FaSyncAlt, 
    FaCog, 
    FaFilePdf, 
    FaFilter, 
    FaCheck, 
    FaExternalLinkAlt 
} from "react-icons/fa";
import { materialPlanningService } from "../../../services/materialPlanningService";
import "../../../styles/materialPlanning.css";

export default function MaterialPlanning() {
    // -------------------------------------------------------------------------
    // MASTER DATA STATE
    // -------------------------------------------------------------------------
    const [ioList, setIoList] = useState([]);
    const [itemGroups, setItemGroups] = useState([]);
    const [itemsList, setItemsList] = useState([]);
    const [colourList, setColourList] = useState([]);
    const [sizeList, setSizeList] = useState([]);
    const [loadingMasters, setLoadingMasters] = useState(true);

    // -------------------------------------------------------------------------
    // FORM SELECTION STATE (4 COLUMNS)
    // -------------------------------------------------------------------------
    // Col 1: IO No & Sourcing
    const [selectedIOs, setSelectedIOs] = useState([]);
    const [currentIOInput, setCurrentIOInput] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [materialSource, setMaterialSource] = useState("All"); // "Import", "Domestic", "All"

    // Col 2: Item Group & Indent Rules
    const [selectedItemGroups, setSelectedItemGroups] = useState([]);
    const [currentGroupInput, setCurrentGroupInput] = useState("");
    const [itemCategory, setItemCategory] = useState("");
    const [daysBeforeShipDate, setDaysBeforeShipDate] = useState(15);
    const [postAsSingleIndent, setPostAsSingleIndent] = useState(true);
    const [reduceAvailableStock, setReduceAvailableStock] = useState(true);
    const [oneIndentPerIO, setOneIndentPerIO] = useState(false);

    // Col 3: Item & MRP Summary
    const [selectedItems, setSelectedItems] = useState([]);
    const [currentItemInput, setCurrentItemInput] = useState("");
    const [sizeInput, setSizeInput] = useState("");
    const [buyerPO, setBuyerPO] = useState("");
    const [mrpSummaryType, setMrpSummaryType] = useState("detail"); // "detail", "summaryItem", "summaryGroup"

    // Col 4: Colour & Plan Numbers
    const [selectedColours, setSelectedColours] = useState([]);
    const [currentColourInput, setCurrentColourInput] = useState("");
    const [globalPlanNo, setGlobalPlanNo] = useState("");
    const [monthlyPlanNo, setMonthlyPlanNo] = useState("");
    const [weeklyPlanNo, setWeeklyPlanNo] = useState("");

    // -------------------------------------------------------------------------
    // MRP CALCULATION & RESULTS STATE
    // -------------------------------------------------------------------------
    const [mrpResults, setMrpResults] = useState([]);
    const [summaryData, setSummaryData] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isPreparingIndent, setIsPreparingIndent] = useState(false);
    const [hasCalculated, setHasCalculated] = useState(false);
    const [alertMsg, setAlertMsg] = useState(null);

    // Modals
    const [showExcelFormatModal, setShowExcelFormatModal] = useState(false);
    const [createdIndentsModal, setCreatedIndentsModal] = useState(null);

    // -------------------------------------------------------------------------
    // FETCH MASTERS ON MOUNT
    // -------------------------------------------------------------------------
    useEffect(() => {
        loadMasters();
    }, []);

    const loadMasters = async () => {
        try {
            setLoadingMasters(true);
            const res = await materialPlanningService.getMasters();
            if (res.success && res.data) {
                setIoList(res.data.ioList || []);
                setItemGroups(res.data.itemGroups || []);
                setItemsList(res.data.items || []);
                setColourList(res.data.colours || []);
                setSizeList(res.data.sizes || []);
                
                // Pre-populate 1 or 2 IOs for immediate exploration if available
                if (res.data.ioList && res.data.ioList.length > 0 && selectedIOs.length === 0) {
                    setSelectedIOs([res.data.ioList[0].IONo]);
                }
            }
        } catch (err) {
            console.error("Failed to load Material Planning masters:", err);
            setAlertMsg({ type: "danger", text: "Failed to connect to Material Planning master data." });
        } finally {
            setLoadingMasters(false);
        }
    };

    // -------------------------------------------------------------------------
    // ADD / REMOVE HELPERS FOR LISTBOXES
    // -------------------------------------------------------------------------
    const handleAddIO = (ioVal) => {
        const val = (ioVal || currentIOInput).trim();
        if (val && !selectedIOs.includes(val)) {
            setSelectedIOs([...selectedIOs, val]);
            setCurrentIOInput("");
        }
    };

    const handleRemoveIO = (ioNo) => {
        setSelectedIOs(selectedIOs.filter((item) => item !== ioNo));
    };

    const handleAddGroup = (grpVal) => {
        const val = (grpVal || currentGroupInput).trim();
        if (val && !selectedItemGroups.includes(val)) {
            setSelectedItemGroups([...selectedItemGroups, val]);
            setCurrentGroupInput("");
        }
    };

    const handleRemoveGroup = (grp) => {
        setSelectedItemGroups(selectedItemGroups.filter((g) => g !== grp));
    };

    const handleAddItem = (itemVal) => {
        const val = (itemVal || currentItemInput).trim();
        if (val && !selectedItems.includes(val)) {
            setSelectedItems([...selectedItems, val]);
            setCurrentItemInput("");
        }
    };

    const handleRemoveItem = (it) => {
        setSelectedItems(selectedItems.filter((i) => i !== it));
    };

    const handleAddColour = (colVal) => {
        const val = (colVal || currentColourInput).trim();
        if (val && !selectedColours.includes(val)) {
            setSelectedColours([...selectedColours, val]);
            setCurrentColourInput("");
        }
    };

    const handleRemoveColour = (col) => {
        setSelectedColours(selectedColours.filter((c) => c !== col));
    };

    // -------------------------------------------------------------------------
    // EXECUTE MRP CALCULATION
    // -------------------------------------------------------------------------
    const handleCalculateMRP = async () => {
        try {
            setIsCalculating(true);
            setAlertMsg(null);

            const payload = {
                selectedIOs,
                selectedItemGroups,
                selectedItems,
                selectedColours,
                materialSource,
                reduceAvailableStock,
                daysBeforeShipDate: parseInt(daysBeforeShipDate, 10) || 15,
                summaryType: mrpSummaryType,
                buyerPO
            };

            const res = await materialPlanningService.calculateMRP(payload);
            if (res.success) {
                setMrpResults(res.data || []);
                setSummaryData(res.summary || null);
                setHasCalculated(true);
                if (res.data.length === 0) {
                    setAlertMsg({ type: "info", text: "No requirement records found matching the specified parameters." });
                }
            } else {
                setAlertMsg({ type: "danger", text: res.message || "Failed to calculate material requirements." });
            }
        } catch (err) {
            console.error("MRP Calculation Error:", err);
            setAlertMsg({ type: "danger", text: "Error during MRP calculation. Please check server connection." });
        } finally {
            setIsCalculating(false);
        }
    };

    // -------------------------------------------------------------------------
    // PREPARE INDENT FROM RESULTS
    // -------------------------------------------------------------------------
    const handlePrepareIndent = async () => {
        if (!hasCalculated || mrpResults.length === 0) {
            // If user directly clicked "Prepare Indent", calculate first then prepare
            await handleCalculateMRP();
            return;
        }

        const validItems = mrpResults.filter(i => parseFloat(i.netIndentQty) > 0);
        if (validItems.length === 0) {
            setAlertMsg({ 
                type: "warning", 
                text: "All required materials are already covered by current inventory stock. Net indent requirement is 0." 
            });
            return;
        }

        try {
            setIsPreparingIndent(true);
            const payload = {
                mrpItems: validItems,
                postAsSingleIndent,
                oneIndentPerIO,
                department: "Production Planning",
                priority: "High"
            };

            const res = await materialPlanningService.prepareIndent(payload);
            if (res.success) {
                setCreatedIndentsModal(res.data || []);
                setAlertMsg({ type: "success", text: res.message });
            } else {
                setAlertMsg({ type: "danger", text: res.message || "Failed to prepare indent." });
            }
        } catch (err) {
            console.error("Prepare Indent Error:", err);
            setAlertMsg({ type: "danger", text: "Error preparing indent. Please try again." });
        } finally {
            setIsPreparingIndent(false);
        }
    };

    // -------------------------------------------------------------------------
    // EXPORT TO EXCEL (CSV FORMAT)
    // -------------------------------------------------------------------------
    const handleExportExcel = () => {
        if (!mrpResults || mrpResults.length === 0) {
            alert("No MRP data available to export. Click 'View & Prepare Indent' first.");
            return;
        }

        const headers = [
            "Line No", "IO No", "Buyer PO", "Style No", "Style Description", 
            "Item Group", "Item Code", "Item Description", "Colour", "Size", 
            "UOM", "Gross Req Qty", "Available Stock", "Stock Allocated", 
            "Net Indent Qty", "Rate", "Est Amount", "Required By Date", "Status"
        ];

        const rows = mrpResults.map(r => [
            r.lineNo,
            `"${r.ioNo || ""}"`,
            `"${r.buyerPo || ""}"`,
            `"${r.styleNo || ""}"`,
            `"${(r.styleDescription || "").replace(/"/g, '""')}"`,
            `"${r.itemGroup || ""}"`,
            `"${r.itemCode || ""}"`,
            `"${(r.itemName || "").replace(/"/g, '""')}"`,
            `"${r.colour || ""}"`,
            `"${r.size || ""}"`,
            `"${r.uom || ""}"`,
            r.grossRequiredQty,
            r.availableStock,
            r.stockAllocated,
            r.netIndentQty,
            r.rate,
            r.estAmount,
            `"${r.requiredByDate || ""}"`,
            `"${r.status || ""}"`
        ]);

        const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Material_Planning_MRP_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // -------------------------------------------------------------------------
    // PRINT / PDF
    // -------------------------------------------------------------------------
    const handlePrintPDF = () => {
        if (!mrpResults || mrpResults.length === 0) {
            alert("No MRP data available to print. Click 'View & Prepare Indent' first.");
            return;
        }
        window.print();
    };

    // -------------------------------------------------------------------------
    // RENDER UI
    // -------------------------------------------------------------------------
    return (
        <div className="mp-erp-page">
            {/* Page Header */}
            <h1 className="mp-erp-title">Material Planning</h1>

            {/* Alert Box */}
            {alertMsg && (
                <Alert 
                    variant={alertMsg.type} 
                    onClose={() => setAlertMsg(null)} 
                    dismissible 
                    className="py-1 px-3 mb-3 font-semibold"
                    style={{ fontSize: "11.5px" }}
                >
                    {alertMsg.text}
                </Alert>
            )}

            {/* 4-COLUMN CONFIGURATION GRID */}
            <div className="mp-grid-container">
                {/* =========================================================
                    COLUMN 1: IO NOS EXCEL, IO NO, SOURCING & ACTIONS
                    ========================================================= */}
                <div className="mp-column">
                    {/* IO Nos Excel */}
                    <div>
                        <div className="mp-erp-label-row">
                            <span className="mp-erp-label">IO Nos Excel</span>
                            <span 
                                className="mp-link-blue" 
                                onClick={() => setShowExcelFormatModal(true)}
                            >
                                <FaFileExcel size={10} /> View excel format
                            </span>
                        </div>
                        <div className="mp-file-picker-group">
                            <div className="mp-file-picker-text">
                                {selectedFile ? selectedFile.name : "No file"}
                            </div>
                            <label className="mp-file-picker-btn mb-0">
                                <FaFolderOpen size={11} /> Choose file
                                <input 
                                    type="file" 
                                    accept=".xlsx, .xls, .csv" 
                                    style={{ display: "none" }} 
                                    onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Import Button */}
                    <div>
                        <button 
                            type="button" 
                            className="mp-btn-primary" 
                            style={{ height: "26px", padding: "0 14px" }}
                            onClick={() => {
                                if (!selectedFile) {
                                    alert("Please choose an Excel file containing IO numbers first.");
                                } else {
                                    alert(`Importing IO numbers from ${selectedFile.name}...`);
                                }
                            }}
                        >
                            <FaFileImport size={11} /> Import
                        </button>
                    </div>

                    {/* IO No Input */}
                    <div>
                        <label className="mp-erp-label">IO No</label>
                        <div className="mp-input-group">
                            <input 
                                type="text" 
                                className="mp-erp-input" 
                                placeholder="Type and Select IO No"
                                value={currentIOInput}
                                onChange={(e) => setCurrentIOInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddIO();
                                }}
                                list="io-datalist"
                            />
                            <datalist id="io-datalist">
                                {ioList.map((io) => (
                                    <option key={io.IOID} value={io.IONo}>{io.Customer} - {io.Season}</option>
                                ))}
                            </datalist>
                            <button 
                                type="button" 
                                className="mp-btn-addon" 
                                title="Add IO No"
                                onClick={() => handleAddIO()}
                            >
                                <FaPlus size={10} />
                            </button>
                        </div>
                    </div>

                    {/* IO No Listbox */}
                    <div>
                        <label className="mp-erp-label">IO No</label>
                        <div className="mp-listbox-container">
                            <div className="mp-listbox-content">
                                {selectedIOs.length === 0 ? (
                                    <span className="text-muted" style={{ fontStyle: "italic" }}>No IO selected (All IOs)</span>
                                ) : (
                                    selectedIOs.map((io) => (
                                        <div key={io} className="mp-listbox-item">
                                            <span>{io}</span>
                                            <span 
                                                className="mp-item-remove-x" 
                                                title="Remove"
                                                onClick={() => handleRemoveIO(io)}
                                            >
                                                &times;
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="mp-listbox-actions">
                                <button 
                                    type="button" 
                                    className="mp-listbox-action-icon text-primary" 
                                    title="View IO Summary"
                                    onClick={() => alert(`Selected IOs: ${selectedIOs.join(", ") || "All"}`)}
                                >
                                    <FaListUl size={10} />
                                </button>
                                {selectedIOs.length > 0 && (
                                    <button 
                                        type="button" 
                                        className="mp-listbox-action-icon text-danger" 
                                        title="Clear All"
                                        onClick={() => setSelectedIOs([])}
                                    >
                                        <FaTimes size={10} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Material Source Radios */}
                    <div className="mp-radio-group">
                        <label className="mp-radio-item">
                            <input 
                                type="radio" 
                                name="matSource" 
                                checked={materialSource === "Import"} 
                                onChange={() => setMaterialSource("Import")}
                            />
                            Import
                        </label>
                        <label className="mp-radio-item">
                            <input 
                                type="radio" 
                                name="matSource" 
                                checked={materialSource === "Domestic"} 
                                onChange={() => setMaterialSource("Domestic")}
                            />
                            Domestic
                        </label>
                        <label className="mp-radio-item">
                            <input 
                                type="radio" 
                                name="matSource" 
                                checked={materialSource === "All"} 
                                onChange={() => setMaterialSource("All")}
                            />
                            All
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div>
                        <button 
                            type="button" 
                            className="mp-btn-primary mp-btn-action-lg"
                            onClick={handleCalculateMRP}
                            disabled={isCalculating}
                        >
                            {isCalculating ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-1" />
                                    Calculating MRP...
                                </>
                            ) : (
                                "View & Prepare Indent"
                            )}
                        </button>
                        <button 
                            type="button" 
                            className="mp-btn-primary mp-btn-action-lg"
                            onClick={handlePrepareIndent}
                            disabled={isPreparingIndent}
                        >
                            {isPreparingIndent ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-1" />
                                    Creating Indent...
                                </>
                            ) : (
                                "Prepare Indent"
                            )}
                        </button>
                    </div>

                    {/* Bottom Toolbar Icons */}
                    <div className="mp-bottom-toolbar">
                        <button 
                            type="button" 
                            className="mp-toolbar-btn" 
                            title="Refresh"
                            onClick={loadMasters}
                        >
                            <FaSyncAlt size={11} />
                        </button>
                        <button 
                            type="button" 
                            className="mp-toolbar-btn" 
                            title="Configuration Settings"
                            onClick={() => alert("Settings: MRP Engine tolerance 5%, Standard lead time 15 days.")}
                        >
                            <FaCog size={12} />
                        </button>
                        <button 
                            type="button" 
                            className="mp-toolbar-btn text-success" 
                            title="Export to Excel"
                            onClick={handleExportExcel}
                        >
                            <FaFileExcel size={12} />
                        </button>
                        <button 
                            type="button" 
                            className="mp-toolbar-btn text-danger" 
                            title="Print / PDF View"
                            onClick={handlePrintPDF}
                        >
                            <FaFilePdf size={12} />
                        </button>
                        <button 
                            type="button" 
                            className="mp-toolbar-btn filter-btn text-primary" 
                            title="Toggle Quick Filter"
                            onClick={handleCalculateMRP}
                        >
                            <FaFilter size={10} /> Filter
                        </button>
                    </div>
                </div>

                {/* =========================================================
                    COLUMN 2: ITEM GROUP, CATEGORY, REQ DATE & INDENT OPTIONS
                    ========================================================= */}
                <div className="mp-column">
                    {/* Item Group Input */}
                    <div>
                        <label className="mp-erp-label">Item Group</label>
                        <div className="mp-input-group">
                            <input 
                                type="text" 
                                className="mp-erp-input" 
                                placeholder="Item Group"
                                value={currentGroupInput}
                                onChange={(e) => setCurrentGroupInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddGroup();
                                }}
                                list="group-datalist"
                            />
                            <datalist id="group-datalist">
                                {itemGroups.map((g, idx) => (
                                    <option key={idx} value={g} />
                                ))}
                            </datalist>
                            <button 
                                type="button" 
                                className="mp-btn-addon" 
                                title="Add Group"
                                onClick={() => handleAddGroup()}
                            >
                                <FaPlus size={10} />
                            </button>
                        </div>
                    </div>

                    {/* Item Group Listbox */}
                    <div>
                        <div className="mp-listbox-container">
                            <div className="mp-listbox-content">
                                {selectedItemGroups.length === 0 ? (
                                    <span className="text-muted" style={{ fontStyle: "italic" }}>All Item Groups</span>
                                ) : (
                                    selectedItemGroups.map((grp) => (
                                        <div key={grp} className="mp-listbox-item">
                                            <span>{grp}</span>
                                            <span 
                                                className="mp-item-remove-x" 
                                                title="Remove"
                                                onClick={() => handleRemoveGroup(grp)}
                                            >
                                                &times;
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="mp-listbox-actions">
                                {selectedItemGroups.length > 0 && (
                                    <button 
                                        type="button" 
                                        className="mp-listbox-action-icon text-danger" 
                                        title="Clear All"
                                        onClick={() => setSelectedItemGroups([])}
                                    >
                                        <FaTimes size={10} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Item Category */}
                    <div>
                        <label className="mp-erp-label">Item Category</label>
                        <input 
                            type="text" 
                            className="mp-erp-input" 
                            placeholder="Type & select Item Category"
                            value={itemCategory}
                            onChange={(e) => setItemCategory(e.target.value)}
                        />
                    </div>

                    {/* Items Required Date Should be */}
                    <div>
                        <label className="mp-erp-label">Items Required Date Should be</label>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <input 
                                type="number" 
                                className="mp-erp-input text-center" 
                                style={{ width: "70px" }}
                                value={daysBeforeShipDate}
                                onChange={(e) => setDaysBeforeShipDate(e.target.value)}
                            />
                            <span style={{ fontSize: "11px", color: "#333333" }}>days before ship date</span>
                        </div>
                    </div>

                    {/* Indent Posting Checkboxes */}
                    <div className="mp-vertical-checkboxes">
                        <label className="mp-checkbox-item">
                            <input 
                                type="checkbox" 
                                checked={postAsSingleIndent} 
                                onChange={(e) => setPostAsSingleIndent(e.target.checked)}
                            />
                            Post as Single Indent
                        </label>
                        <label className="mp-checkbox-item">
                            <input 
                                type="checkbox" 
                                checked={reduceAvailableStock} 
                                onChange={(e) => setReduceAvailableStock(e.target.checked)}
                            />
                            Reduce Available Stock
                        </label>
                        <label className="mp-checkbox-item">
                            <input 
                                type="checkbox" 
                                checked={oneIndentPerIO} 
                                onChange={(e) => setOneIndentPerIO(e.target.checked)}
                            />
                            One Indent per IO
                        </label>
                    </div>
                </div>

                {/* =========================================================
                    COLUMN 3: ITEM, SIZE, BUYER PO & MRP SUMMARY
                    ========================================================= */}
                <div className="mp-column">
                    {/* Item Input */}
                    <div>
                        <label className="mp-erp-label">Item</label>
                        <div className="mp-input-group">
                            <input 
                                type="text" 
                                className="mp-erp-input" 
                                placeholder="Item"
                                value={currentItemInput}
                                onChange={(e) => setCurrentItemInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddItem();
                                }}
                                list="items-datalist"
                            />
                            <datalist id="items-datalist">
                                {itemsList.map((it) => (
                                    <option key={it.ItemID} value={it.ItemCode}>{it.ItemName} ({it.Category})</option>
                                ))}
                            </datalist>
                            <button 
                                type="button" 
                                className="mp-btn-addon" 
                                title="Add Item"
                                onClick={() => handleAddItem()}
                            >
                                <FaPlus size={10} />
                            </button>
                            <button 
                                type="button" 
                                className="mp-btn-addon" 
                                title="Select from Master"
                                onClick={() => {
                                    if (itemsList.length > 0) {
                                        handleAddItem(itemsList[0].ItemCode);
                                    }
                                }}
                            >
                                <FaListUl size={10} />
                            </button>
                        </div>
                    </div>

                    {/* Item Listbox */}
                    <div>
                        <div className="mp-listbox-container">
                            <div className="mp-listbox-content">
                                {selectedItems.length === 0 ? (
                                    <span className="text-muted" style={{ fontStyle: "italic" }}>All Items</span>
                                ) : (
                                    selectedItems.map((item) => (
                                        <div key={item} className="mp-listbox-item">
                                            <span>{item}</span>
                                            <span 
                                                className="mp-item-remove-x" 
                                                title="Remove"
                                                onClick={() => handleRemoveItem(item)}
                                            >
                                                &times;
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="mp-listbox-actions">
                                {selectedItems.length > 0 && (
                                    <button 
                                        type="button" 
                                        className="mp-listbox-action-icon text-danger" 
                                        title="Clear All"
                                        onClick={() => setSelectedItems([])}
                                    >
                                        <FaTimes size={10} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Size */}
                    <div>
                        <label className="mp-erp-label">Size</label>
                        <input 
                            type="text" 
                            className="mp-erp-input" 
                            placeholder="Type and select Size"
                            value={sizeInput}
                            onChange={(e) => setSizeInput(e.target.value)}
                            list="size-datalist"
                        />
                        <datalist id="size-datalist">
                            {sizeList.map((sz, idx) => (
                                <option key={idx} value={sz} />
                            ))}
                        </datalist>
                    </div>

                    {/* Buyer PO */}
                    <div>
                        <label className="mp-erp-label">Buyer PO</label>
                        <input 
                            type="text" 
                            className="mp-erp-input" 
                            placeholder="Buyer PO"
                            value={buyerPO}
                            onChange={(e) => setBuyerPO(e.target.value)}
                        />
                    </div>

                    {/* MRP Aggregation Level Radios */}
                    <div className="mp-vertical-radios">
                        <label className="mp-radio-item">
                            <input 
                                type="radio" 
                                name="mrpSummary" 
                                checked={mrpSummaryType === "detail"} 
                                onChange={() => setMrpSummaryType("detail")}
                            />
                            MRP detail by IoNo
                        </label>
                        <label className="mp-radio-item">
                            <input 
                                type="radio" 
                                name="mrpSummary" 
                                checked={mrpSummaryType === "summaryItem"} 
                                onChange={() => setMrpSummaryType("summaryItem")}
                            />
                            MRP summary by item
                        </label>
                        <label className="mp-radio-item">
                            <input 
                                type="radio" 
                                name="mrpSummary" 
                                checked={mrpSummaryType === "summaryGroup"} 
                                onChange={() => setMrpSummaryType("summaryGroup")}
                            />
                            MRP summary by group
                        </label>
                    </div>
                </div>

                {/* =========================================================
                    COLUMN 4: COLOUR, GLOBAL & APPROVED PLAN NOS
                    ========================================================= */}
                <div className="mp-column">
                    {/* Colour Input */}
                    <div>
                        <label className="mp-erp-label">Colour</label>
                        <div className="mp-input-group">
                            <input 
                                type="text" 
                                className="mp-erp-input" 
                                placeholder="Colour"
                                value={currentColourInput}
                                onChange={(e) => setCurrentColourInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddColour();
                                }}
                                list="colour-datalist"
                            />
                            <datalist id="colour-datalist">
                                {colourList.map((col, idx) => (
                                    <option key={idx} value={col} />
                                ))}
                            </datalist>
                            <button 
                                type="button" 
                                className="mp-btn-addon" 
                                title="Add Colour"
                                onClick={() => handleAddColour()}
                            >
                                <FaPlus size={10} />
                            </button>
                        </div>
                    </div>

                    {/* Colour Listbox */}
                    <div>
                        <div className="mp-listbox-container">
                            <div className="mp-listbox-content">
                                {selectedColours.length === 0 ? (
                                    <span className="text-muted" style={{ fontStyle: "italic" }}>All Colours</span>
                                ) : (
                                    selectedColours.map((col) => (
                                        <div key={col} className="mp-listbox-item">
                                            <span>{col}</span>
                                            <span 
                                                className="mp-item-remove-x" 
                                                title="Remove"
                                                onClick={() => handleRemoveColour(col)}
                                            >
                                                &times;
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="mp-listbox-actions">
                                {selectedColours.length > 0 && (
                                    <button 
                                        type="button" 
                                        className="mp-listbox-action-icon text-danger" 
                                        title="Clear All"
                                        onClick={() => setSelectedColours([])}
                                    >
                                        <FaTimes size={10} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Global Plan No */}
                    <div>
                        <label className="mp-erp-label">Global Plan No</label>
                        <input 
                            type="text" 
                            className="mp-erp-input" 
                            placeholder="Enter Plan No."
                            value={globalPlanNo}
                            onChange={(e) => setGlobalPlanNo(e.target.value)}
                        />
                    </div>

                    {/* Monthly Approved Plan No */}
                    <div>
                        <label className="mp-erp-label">Monthly Approved Plan No</label>
                        <input 
                            type="text" 
                            className="mp-erp-input" 
                            placeholder="Enter Plan No."
                            value={monthlyPlanNo}
                            onChange={(e) => setMonthlyPlanNo(e.target.value)}
                        />
                    </div>

                    {/* Weekly Approved Plan No */}
                    <div>
                        <label className="mp-erp-label">Weekly Approved Plan No</label>
                        <input 
                            type="text" 
                            className="mp-erp-input" 
                            placeholder="Enter Plan No."
                            value={weeklyPlanNo}
                            onChange={(e) => setWeeklyPlanNo(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* =========================================================
                RESULTS SECTION: MRP CALCULATION GRID & TOTALS
                ========================================================= */}
            {hasCalculated && (
                <div className="mp-results-section">
                    <div className="mp-results-header">
                        <span className="mp-results-title">
                            Requirement Calculation Results ({mrpResults.length} Items)
                        </span>
                        <div className="d-flex gap-2">
                            <button 
                                type="button" 
                                className="mp-btn-primary"
                                style={{ height: "26px", fontSize: "11px" }}
                                onClick={handlePrepareIndent}
                                disabled={isPreparingIndent}
                            >
                                <FaCheck size={10} /> Convert to Indent(s)
                            </button>
                            <button 
                                type="button" 
                                className="mp-toolbar-btn text-success" 
                                title="Download Excel"
                                onClick={handleExportExcel}
                            >
                                <FaFileExcel size={12} />
                            </button>
                            <button 
                                type="button" 
                                className="mp-toolbar-btn text-danger" 
                                title="Print MRP"
                                onClick={handlePrintPDF}
                            >
                                <FaFilePdf size={12} />
                            </button>
                        </div>
                    </div>

                    {/* Table Ribbon */}
                    <div className="table-responsive">
                        <Table hover size="sm" className="mp-ribbon-table text-nowrap">
                            <thead>
                                <tr>
                                    <th style={{ width: "45px" }}>#</th>
                                    <th>IO No</th>
                                    <th>Buyer PO</th>
                                    <th>Style No</th>
                                    <th>Item Group</th>
                                    <th>Item Code</th>
                                    <th>Material Description</th>
                                    <th>Colour</th>
                                    <th>UOM</th>
                                    <th className="text-end">Gross Req</th>
                                    <th className="text-end">Avail Stock</th>
                                    <th className="text-end">Stock Deducted</th>
                                    <th className="text-end">Net Indent Qty</th>
                                    <th className="text-end">Rate (₹)</th>
                                    <th className="text-end">Est Amount (₹)</th>
                                    <th>Required Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mrpResults.length === 0 ? (
                                    <tr>
                                        <td colSpan="17" className="text-center py-4 text-muted">
                                            No materials matched the planning filter.
                                        </td>
                                    </tr>
                                ) : (
                                    mrpResults.map((row) => (
                                        <tr key={row.lineNo}>
                                            <td className="text-center">{row.lineNo}</td>
                                            <td className="fw-semibold text-primary">{row.ioNo}</td>
                                            <td>{row.buyerPo || "-"}</td>
                                            <td>
                                                <div className="fw-semibold">{row.styleNo}</div>
                                                <small className="text-muted" style={{ fontSize: "10px" }}>{row.styleDescription}</small>
                                            </td>
                                            <td>{row.itemGroup}</td>
                                            <td className="font-monospace">{row.itemCode}</td>
                                            <td>{row.itemName}</td>
                                            <td>{row.colour}</td>
                                            <td className="text-center">{row.uom}</td>
                                            <td className="text-end fw-semibold">{row.grossRequiredQty}</td>
                                            <td className="text-end text-muted">{row.availableStock}</td>
                                            <td className="text-end text-success">{row.stockAllocated}</td>
                                            <td className="text-end fw-bold" style={{ color: row.netIndentQty > 0 ? "#d9534f" : "#5cb85c" }}>
                                                {row.netIndentQty}
                                            </td>
                                            <td className="text-end">{row.rate}</td>
                                            <td className="text-end fw-semibold">{row.estAmount ? row.estAmount.toLocaleString() : "0"}</td>
                                            <td className="text-center">{row.requiredByDate}</td>
                                            <td className="text-center">
                                                <span 
                                                    className={`badge ${row.netIndentQty > 0 ? "bg-warning text-dark" : "bg-success"}`}
                                                    style={{ fontSize: "10px", padding: "3px 6px" }}
                                                >
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>

                    {/* Summary Ribbon */}
                    {summaryData && (
                        <div className="mp-summary-bar">
                            <div className="mp-summary-item">
                                <span className="mp-summary-label">Target Orders</span>
                                <span className="mp-summary-value">{summaryData.totalIOs} IO(s)</span>
                            </div>
                            <div className="mp-summary-item">
                                <span className="mp-summary-label">Materials Count</span>
                                <span className="mp-summary-value">{summaryData.totalLines} Lines</span>
                            </div>
                            <div className="mp-summary-item">
                                <span className="mp-summary-label">Gross Required</span>
                                <span className="mp-summary-value">{summaryData.totalGrossQty.toLocaleString()}</span>
                            </div>
                            <div className="mp-summary-item">
                                <span className="mp-summary-label">Stock Covered</span>
                                <span className="mp-summary-value" style={{ color: "#5cb85c" }}>
                                    {summaryData.totalStockDeducted.toLocaleString()}
                                </span>
                            </div>
                            <div className="mp-summary-item">
                                <span className="mp-summary-label">Net Indent Demand</span>
                                <span className="mp-summary-value" style={{ color: "#d9534f" }}>
                                    {summaryData.totalNetQty.toLocaleString()}
                                </span>
                            </div>
                            <div className="mp-summary-item ms-auto">
                                <span className="mp-summary-label">Est Procurement Value</span>
                                <span className="mp-summary-value" style={{ color: "#2e7d32", fontSize: "14px" }}>
                                    ₹ {summaryData.totalEstAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* =========================================================
                EXCEL FORMAT MODAL
                ========================================================= */}
            <Modal 
                show={showExcelFormatModal} 
                onHide={() => setShowExcelFormatModal(false)}
                centered
            >
                <Modal.Header closeButton style={{ background: "#337ab7", color: "#fff", padding: "8px 16px" }}>
                    <Modal.Title style={{ fontSize: "13px", fontWeight: "700" }}>
                        <FaFileExcel className="me-2" /> IO Nos Excel Import Format
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ fontSize: "11.5px" }}>
                    <p className="mb-2">Your Excel (.xlsx, .xls) file must contain the following columns in row 1:</p>
                    <Table bordered size="sm" className="mb-3 text-center" style={{ fontSize: "11px" }}>
                        <thead style={{ background: "#f1f5f9" }}>
                            <tr>
                                <th>Col A</th>
                                <th>Col B</th>
                                <th>Col C</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="fw-bold">IO No</td>
                                <td>Buyer PO (Optional)</td>
                                <td>Ship Date (Optional)</td>
                            </tr>
                            <tr>
                                <td>IO/9B/2627/212</td>
                                <td>PO-77491</td>
                                <td>2026-11-20</td>
                            </tr>
                            <tr>
                                <td>IO/9B/2627/208</td>
                                <td>PO-88301</td>
                                <td>2026-11-25</td>
                            </tr>
                        </tbody>
                    </Table>
                    <p className="text-muted mb-0 small">
                        * You can also enter or paste IO numbers directly into the <strong>IO No</strong> input box.
                    </p>
                </Modal.Body>
                <Modal.Footer style={{ padding: "6px 16px" }}>
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => setShowExcelFormatModal(false)}
                        style={{ fontSize: "11px" }}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* =========================================================
                CREATED INDENTS SUCCESS MODAL
                ========================================================= */}
            <Modal 
                show={!!createdIndentsModal} 
                onHide={() => setCreatedIndentsModal(null)}
                centered
            >
                <Modal.Header closeButton style={{ background: "#5cb85c", color: "#fff", padding: "8px 16px" }}>
                    <Modal.Title style={{ fontSize: "13px", fontWeight: "700" }}>
                        <FaCheck className="me-2" /> Indents Generated Successfully
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ fontSize: "11.5px" }}>
                    <p className="mb-2">The following Indent(s) have been generated and registered in the Indent Master:</p>
                    <Table bordered size="sm" className="mb-3" style={{ fontSize: "11px" }}>
                        <thead style={{ background: "#f1f5f9" }}>
                            <tr>
                                <th>Indent No</th>
                                <th className="text-center">Items Count</th>
                                <th className="text-end">Total Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(createdIndentsModal || []).map((ind, idx) => (
                                <tr key={idx}>
                                    <td className="fw-bold text-primary">{ind.indentNo}</td>
                                    <td className="text-center">{ind.itemCount}</td>
                                    <td className="text-end fw-semibold">{ind.totalQty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="d-flex gap-2">
                        <Button 
                            size="sm" 
                            variant="primary" 
                            style={{ fontSize: "11px" }}
                            onClick={() => window.location.href = "/indents"}
                        >
                            <FaExternalLinkAlt className="me-1" /> View in Indents Module
                        </Button>
                        <Button 
                            size="sm" 
                            variant="outline-secondary" 
                            style={{ fontSize: "11px" }}
                            onClick={() => setCreatedIndentsModal(null)}
                        >
                            Done
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
