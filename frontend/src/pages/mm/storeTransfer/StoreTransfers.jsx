import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FaPlus,
    FaSyncAlt,
    FaBars,
    FaCog,
    FaFilter,
    FaCalendarAlt,
    FaSave,
    FaEye,
    FaCaretDown,
    FaPaperclip,
    FaTrash,
    FaCheckCircle,
    FaSearch
} from "react-icons/fa";
import "../../../styles/storeTransfer.css";

// Sample / Lookup items for auto-populating item rows
const LOOKUP_ITEMS = [
    {
        itemCode: "LTH-1093",
        name: "COW CULATTAS SINGLE LEATHER",
        description: "Upper cutting leather - export grade",
        colour: "BLACK",
        sizeRange: "A Grade",
        uom: "SQFT",
        availableQty: 450,
        rate: 145.0
    },
    {
        itemCode: "LTH-1112",
        name: "COW ECO VEG SIDE CRUST LEATHER",
        description: "Counter reinforcement crust",
        colour: "TAN",
        sizeRange: "Standard",
        uom: "SQFT",
        availableQty: 280,
        rate: 160.0
    },
    {
        itemCode: "HDW-2236",
        name: "JAM RIVET SINGLE HEAD 7MM",
        description: "Metallic antique rivets for boots",
        colour: "ANTIQUE BRASS",
        sizeRange: "7MM",
        uom: "SET",
        availableQty: 5000,
        rate: 1.85
    },
    {
        itemCode: "RNF-1085",
        name: "HIGH DENSITY TOPLINER 0.4MM",
        description: "High density collar and topliner",
        colour: "BLACK",
        sizeRange: "0.4MM",
        uom: "MTR",
        availableQty: 1200,
        rate: 32.5
    },
    {
        itemCode: "FAB-3011",
        name: "COTTON TWILL LINING 120 GSM",
        description: "Pure cotton inner sock lining",
        colour: "WHITE",
        sizeRange: "58 INCH",
        uom: "MTR",
        availableQty: 850,
        rate: 45.0
    },
    {
        itemCode: "ZIP-4022",
        name: "YKK METALLIC ZIPPER #5 BRONZE",
        description: "Heavy duty brass closed end zipper",
        colour: "ANTIQUE BRONZE",
        sizeRange: "20 CM",
        uom: "PCS",
        availableQty: 1500,
        rate: 18.0
    },
    {
        itemCode: "THR-0021",
        name: "BONDED NYLON THREAD #40",
        description: "Heavy stitching nylon thread",
        colour: "BLACK",
        sizeRange: "#40",
        uom: "CONE",
        availableQty: 120,
        rate: 95.0
    }
];

const STORE_OPTIONS = [
    "RAW MATERIAL STORE 9B",
    "SEMI FINISH STORE 9B",
    "LEATHER WAREHOUSE PLOT 9B",
    "ACCESSORIES GODOWN 18",
    "CENTRAL STORE",
    "SEWING FLOOR STORE",
    "FINISHING STORE",
    "CUTTING STORE",
    "ASSEMBLY GODOWN",
    "MAIN FINISHED GOODS STORE",
    "PACKING GODOWN"
];

const INITIAL_RECORDS = [
    {
        id: 1,
        trNo: "ST/9B/2627/105",
        date: "24-10-2026",
        purpose: "Transfer to Stitching Floor line 2",
        receivedBy: "Suresh Kumar",
        fromStore: "RAW MATERIAL STORE 9B",
        toStore: "SEWING FLOOR STORE",
        currency: "INR",
        exchangeRate: "1.00",
        remark: "Transfer for Batch 2627 production",
        internalMemo: "Approved by Floor Manager",
        issuedBy: "Nikhil Singh",
        qty: "450.00",
        noOfRows: 2,
        items: [
            {
                id: 1,
                item: "COW CULATTAS SINGLE LEATHER",
                description: "Upper cutting leather - export grade",
                colour: "BLACK",
                sizeRange: "A Grade",
                uom: "SQFT",
                availableQty: "450",
                qty: "250",
                rate: "145.00",
                amount: 36250
            },
            {
                id: 2,
                item: "BONDED NYLON THREAD #40",
                description: "Heavy stitching nylon thread",
                colour: "BLACK",
                sizeRange: "#40",
                uom: "CONE",
                availableQty: "120",
                qty: "20",
                rate: "95.00",
                amount: 1900
            }
        ]
    },
    {
        id: 2,
        trNo: "ST/9B/2627/104",
        date: "22-10-2026",
        purpose: "Hardware issue for boots assembly",
        receivedBy: "Ramesh Patel",
        fromStore: "ACCESSORIES GODOWN 18",
        toStore: "ASSEMBLY GODOWN",
        currency: "INR",
        exchangeRate: "1.00",
        remark: "Urgent hardware movement for Clarks order",
        internalMemo: "Line 1 priority run",
        issuedBy: "Tilak",
        qty: "5000.00",
        noOfRows: 1,
        items: [
            {
                id: 1,
                item: "JAM RIVET SINGLE HEAD 7MM",
                description: "Metallic antique rivets for boots",
                colour: "ANTIQUE BRASS",
                sizeRange: "7MM",
                uom: "SET",
                availableQty: "5000",
                qty: "5000",
                rate: "1.85",
                amount: 9250
            }
        ]
    },
    {
        id: 3,
        trNo: "ST/9B/2627/103",
        date: "18-10-2026",
        purpose: "Interlining fabric issue",
        receivedBy: "Anil Verma",
        fromStore: "RAW MATERIAL STORE 9B",
        toStore: "CUTTING STORE",
        currency: "INR",
        exchangeRate: "1.00",
        remark: "Lining material movement",
        internalMemo: "Batch QC Verified",
        issuedBy: "Rajesh",
        qty: "850.00",
        noOfRows: 1,
        items: [
            {
                id: 1,
                item: "COTTON TWILL LINING 120 GSM",
                description: "Pure cotton inner sock lining",
                colour: "WHITE",
                sizeRange: "58 INCH",
                uom: "MTR",
                availableQty: "850",
                qty: "850",
                rate: "45.00",
                amount: 38250
            }
        ]
    }
];

export default function StoreTransfers({ initialMode = "list" }) {
    const location = useLocation();
    const navigate = useNavigate();

    // Mode determination
    const isFormRoute =
        initialMode === "form" ||
        (location && (location.pathname.endsWith("/new") || location.search.includes("mode=new")));

    const [viewMode, setViewMode] = useState(isFormRoute ? "form" : "list");

    useEffect(() => {
        if (
            location &&
            (location.pathname.endsWith("/new") || location.search.includes("mode=new") || initialMode === "form")
        ) {
            setViewMode("form");
        }
    }, [location, initialMode]);

    // Saved Records State
    const [records, setRecords] = useState(() => {
        const saved = localStorage.getItem("erp_store_transfers");
        return saved ? JSON.parse(saved) : INITIAL_RECORDS;
    });

    // Toast
    const [toastMessage, setToastMessage] = useState("");
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3500);
    };

    // Filter search state (Screenshot 1: Supplier Search...)
    const [supplierSearch, setSupplierSearch] = useState("");

    // Form Fields (Screenshot 2)
    const [purpose, setPurpose] = useState("");
    const [trPrefix, setTrPrefix] = useState("ST/9B/2627/");
    const [trNoNum, setTrNoNum] = useState("106");
    const [trDate, setTrDate] = useState("24-10-2026");
    const [fromStore, setFromStore] = useState("");
    const [toStore, setToStore] = useState("");
    const [issuedBy, setIssuedBy] = useState("");
    const [receivedBy, setReceivedBy] = useState("");
    const [remark, setRemark] = useState("");
    const [internalMemo, setInternalMemo] = useState("");

    // Items Grid Rows (Screenshot 2 & 3)
    const [items, setItems] = useState([
        {
            id: 1,
            item: "",
            description: "",
            colour: "",
            sizeRange: "",
            uom: "",
            availableQty: "",
            qty: "",
            rate: "",
            amount: 0
        }
    ]);

    // Save dropdown menu open state
    const [showSaveDropdown, setShowSaveDropdown] = useState(false);

    // Active item suggestions dropdown row id
    const [activeSuggestionRowId, setActiveSuggestionRowId] = useState(null);

    // Handle Item Field Change
    const handleItemChange = (id, field, val) => {
        setItems((prev) =>
            prev.map((row) => {
                if (row.id !== id) return row;
                const updated = { ...row, [field]: val };
                if (field === "qty" || field === "rate") {
                    const q = parseFloat(field === "qty" ? val : row.qty) || 0;
                    const r = parseFloat(field === "rate" ? val : row.rate) || 0;
                    updated.amount = q * r;
                }
                return updated;
            })
        );
    };

    // Auto-populate when selecting a known item
    const handleSelectLookupItem = (rowId, lookup) => {
        setItems((prev) =>
            prev.map((row) => {
                if (row.id !== rowId) return row;
                const q = parseFloat(row.qty) || 0;
                return {
                    ...row,
                    item: lookup.name,
                    description: lookup.description,
                    colour: lookup.colour,
                    sizeRange: lookup.sizeRange,
                    uom: lookup.uom,
                    availableQty: lookup.availableQty.toString(),
                    rate: lookup.rate.toFixed(2),
                    amount: q * lookup.rate
                };
            })
        );
        setActiveSuggestionRowId(null);
    };

    // Add another line
    const handleAddLine = () => {
        setItems((prev) => [
            ...prev,
            {
                id: Date.now(),
                item: "",
                description: "",
                colour: "",
                sizeRange: "",
                uom: "",
                availableQty: "",
                qty: "",
                rate: "",
                amount: 0
            }
        ]);
    };

    // Delete line
    const handleDeleteLine = (id) => {
        if (items.length <= 1) {
            showToast("At least one line item is required.");
            return;
        }
        setItems(items.filter((r) => r.id !== id));
    };

    // Save Store Transfer
    const handleSave = (actionType = "view") => {
        if (!fromStore) {
            showToast("Please select 'From Store'");
            return;
        }
        if (!toStore) {
            showToast("Please select 'To Store'");
            return;
        }

        const fullTrNo = `${trPrefix}${trNoNum}`;
        const totalQty = items.reduce((acc, row) => acc + (parseFloat(row.qty) || 0), 0);

        const newRecord = {
            id: Date.now(),
            trNo: fullTrNo,
            date: trDate,
            purpose: purpose || "Store Transfer",
            receivedBy: receivedBy || "Store Incharge",
            fromStore,
            toStore,
            currency: "INR",
            exchangeRate: "1.00",
            remark: remark || "Store Transfer Movement",
            internalMemo: internalMemo || "Internal Transfer Note",
            issuedBy: issuedBy || "Nikhil Singh",
            qty: totalQty > 0 ? totalQty.toFixed(2) : "100.00",
            noOfRows: items.length,
            items: [...items]
        };

        const updated = [newRecord, ...records];
        setRecords(updated);
        localStorage.setItem("erp_store_transfers", JSON.stringify(updated));

        showToast(`Store Transfer ${fullTrNo} saved successfully!`);
        setShowSaveDropdown(false);

        if (actionType === "new") {
            // Increment Tr No and reset fields
            setTrNoNum((prev) => (parseInt(prev, 10) + 1).toString());
            setPurpose("");
            setIssuedBy("");
            setReceivedBy("");
            setItems([
                {
                    id: Date.now(),
                    item: "",
                    description: "",
                    colour: "",
                    sizeRange: "",
                    uom: "",
                    availableQty: "",
                    qty: "",
                    rate: "",
                    amount: 0
                }
            ]);
        } else {
            setViewMode("list");
            if (window.history && window.history.pushState) {
                window.history.pushState({}, "", "/stock-transfer");
            }
        }
    };

    // View Record from List View
    const handleEditRecord = (rec) => {
        setPurpose(rec.purpose || "");
        if (rec.trNo.includes("/")) {
            const parts = rec.trNo.split("/");
            const num = parts.pop();
            setTrPrefix(parts.join("/") + "/");
            setTrNoNum(num);
        } else {
            setTrNoNum(rec.trNo);
        }
        setTrDate(rec.date);
        setFromStore(rec.fromStore);
        setToStore(rec.toStore);
        setIssuedBy(rec.issuedBy);
        setReceivedBy(rec.receivedBy);
        setRemark(rec.remark || "");
        setInternalMemo(rec.internalMemo || "");
        if (rec.items && rec.items.length > 0) {
            setItems(rec.items);
        } else {
            setItems([
                {
                    id: Date.now(),
                    item: "COW CULATTAS SINGLE LEATHER",
                    description: "Standard stock issue",
                    colour: "BLACK",
                    sizeRange: "A Grade",
                    uom: "SQFT",
                    availableQty: "450",
                    qty: rec.qty || "100",
                    rate: "145.00",
                    amount: (parseFloat(rec.qty) || 100) * 145
                }
            ]);
        }
        setViewMode("form");
    };

    // Filtered records based on supplierSearch
    const filteredRecords = records.filter((r) => {
        if (!supplierSearch.trim()) return true;
        const q = supplierSearch.toLowerCase();
        return (
            (r.receivedBy && r.receivedBy.toLowerCase().includes(q)) ||
            (r.issuedBy && r.issuedBy.toLowerCase().includes(q)) ||
            (r.fromStore && r.fromStore.toLowerCase().includes(q)) ||
            (r.toStore && r.toStore.toLowerCase().includes(q)) ||
            (r.trNo && r.trNo.toLowerCase().includes(q))
        );
    });

    // =========================================================================
    // RENDER: LIST / REGISTER VIEW (MATCHING SCREENSHOT 1)
    // =========================================================================
    if (viewMode === "list") {
        return (
            <div className="st-page">
                {toastMessage && (
                    <div className="st-toast">
                        <FaCheckCircle />
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* Page Title */}
                <div className="st-list-header">
                    <h1 className="st-page-title">Store Transfer</h1>
                </div>

                {/* Top Filter & New Store Transfer Button */}
                <div className="st-top-filter-row">
                    <div className="st-filter-group">
                        <label className="st-filter-label">Supplier Name</label>
                        <input
                            type="text"
                            className="st-search-input"
                            placeholder="Supplier Search..."
                            value={supplierSearch}
                            onChange={(e) => setSupplierSearch(e.target.value)}
                        />
                    </div>

                    <button
                        type="button"
                        className="st-btn-new"
                        onClick={() => {
                            setViewMode("form");
                            if (window.history && window.history.pushState) {
                                window.history.pushState({}, "", "/stock-transfer/new");
                            }
                        }}
                    >
                        <FaPlus style={{ fontSize: "11px" }} />
                        <span>New Store Transfer</span>
                    </button>
                </div>

                {/* Second Row Toolbar */}
                <div className="st-toolbar">
                    <div className="st-toolbar-left">
                        <button
                            type="button"
                            className="st-icon-btn"
                            title="Reload"
                            onClick={() => showToast("Store Transfer records reloaded")}
                        >
                            <FaSyncAlt />
                        </button>
                        <button
                            type="button"
                            className="st-icon-btn"
                            title="View Options"
                        >
                            <FaBars />
                        </button>
                        <button
                            type="button"
                            className="st-icon-btn"
                            title="Settings"
                        >
                            <FaCog />
                        </button>
                        <button
                            type="button"
                            className="st-filter-btn"
                            onClick={() => showToast("Filters applied")}
                        >
                            <FaFilter style={{ fontSize: "11px" }} />
                            <span>Filter</span>
                            <FaCaretDown style={{ fontSize: "10px" }} />
                        </button>
                    </div>

                    <div className="st-toolbar-right">
                        <span className="st-page-badge">1</span>
                        <button
                            type="button"
                            className="st-bulk-btn"
                            onClick={() => showToast("Bulk Action options available")}
                        >
                            <FaBars style={{ fontSize: "11px" }} />
                            <span>Bulk Action</span>
                            <FaCaretDown style={{ fontSize: "10px" }} />
                        </button>
                    </div>
                </div>

                {/* Table matching Screenshot 1 */}
                <div className="st-table-container">
                    <table className="st-table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: "center", width: "70px" }}>Action</th>
                                <th>Tr No</th>
                                <th>Date</th>
                                <th>Received By</th>
                                <th>From Store</th>
                                <th>To Store</th>
                                <th>Currency</th>
                                <th>Exchange Rate</th>
                                <th>Remark</th>
                                <th>Memo for internal use</th>
                                <th>Issued By</th>
                                <th style={{ textAlign: "right" }}>Qty</th>
                                <th style={{ textAlign: "center" }}>No. of rows</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={13} style={{ textAlign: "center", padding: "28px", color: "#64748b" }}>
                                        No store transfers found matching search.
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((r) => (
                                    <tr key={r.id}>
                                        <td style={{ textAlign: "center" }}>
                                            <button
                                                type="button"
                                                className="st-action-btn"
                                                onClick={() => handleEditRecord(r)}
                                                title="View / Edit Store Transfer"
                                            >
                                                Action
                                                <FaCaretDown style={{ fontSize: "9px" }} />
                                            </button>
                                        </td>
                                        <td>
                                            <span
                                                className="st-trno-link"
                                                onClick={() => handleEditRecord(r)}
                                                title="Open details"
                                            >
                                                {r.trNo}
                                            </span>
                                        </td>
                                        <td>{r.date}</td>
                                        <td style={{ fontWeight: 500 }}>{r.receivedBy}</td>
                                        <td>{r.fromStore}</td>
                                        <td>{r.toStore}</td>
                                        <td>{r.currency}</td>
                                        <td>{r.exchangeRate}</td>
                                        <td style={{ color: "#475569", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {r.remark}
                                        </td>
                                        <td style={{ color: "#64748b", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {r.internalMemo}
                                        </td>
                                        <td>{r.issuedBy}</td>
                                        <td style={{ textAlign: "right", fontWeight: 600 }}>{r.qty}</td>
                                        <td style={{ textAlign: "center" }}>{r.noOfRows}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // =========================================================================
    // RENDER: NEW / EDIT FORM VIEW (MATCHING SCREENSHOT 2 & 3)
    // =========================================================================
    return (
        <div className="st-page">
            {toastMessage && (
                <div className="st-toast">
                    <FaCheckCircle />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Title */}
            <div className="st-form-header">
                <h1 className="st-page-title" style={{ margin: 0 }}>Store Transfer</h1>
            </div>

            {/* Form Fields matching Screenshot 2 */}
            <div className="st-form-top-card">
                {/* Purpose */}
                <div className="st-form-row">
                    <label className="st-form-label">Purpose</label>
                    <input
                        type="text"
                        className="st-input"
                        placeholder="Enter Purpose"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                    />
                </div>

                {/* Tr No Compound Control */}
                <div className="st-form-row">
                    <label className="st-form-label">Tr No</label>
                    <div className="st-trno-compound">
                        <select
                            className="st-prefix-select"
                            value={trPrefix}
                            onChange={(e) => setTrPrefix(e.target.value)}
                        >
                            <option value="ST/9B/2627/">ST/9B/2627/</option>
                            <option value="ST/AAPL9B/2627/">ST/AAPL9B/2627/</option>
                            <option value="TR/9B/2627/">TR/9B/2627/</option>
                        </select>
                        <input
                            type="text"
                            className="st-num-input"
                            value={trNoNum}
                            onChange={(e) => setTrNoNum(e.target.value)}
                        />
                        <button
                            type="button"
                            className="st-gear-btn"
                            title="Configure Document Numbering"
                            onClick={() => showToast("Configuring Numbering sequence...")}
                        >
                            <FaCog />
                        </button>
                    </div>
                </div>

                {/* Date */}
                <div className="st-form-row">
                    <label className="st-form-label">
                        Date <span className="st-req">*</span>
                    </label>
                    <div className="st-date-wrapper">
                        <input
                            type="text"
                            className="st-input"
                            value={trDate}
                            onChange={(e) => setTrDate(e.target.value)}
                            placeholder="DD-MM-YYYY"
                        />
                        <FaCalendarAlt className="st-date-icon" />
                    </div>
                </div>

                {/* From Store */}
                <div className="st-form-row">
                    <label className="st-form-label">
                        From Store <span className="st-req">*</span>
                    </label>
                    <select
                        className="st-select"
                        value={fromStore}
                        onChange={(e) => setFromStore(e.target.value)}
                    >
                        <option value="">Select From Store</option>
                        {STORE_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                                {st}
                            </option>
                        ))}
                    </select>
                </div>

                {/* To Store */}
                <div className="st-form-row">
                    <label className="st-form-label">
                        To Store <span className="st-req">*</span>
                    </label>
                    <select
                        className="st-select"
                        value={toStore}
                        onChange={(e) => setToStore(e.target.value)}
                    >
                        <option value="">Select To Store</option>
                        {STORE_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                                {st}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Issued By */}
                <div className="st-form-row">
                    <label className="st-form-label">Issued By</label>
                    <input
                        type="text"
                        className="st-input"
                        placeholder="Enter Issued By"
                        value={issuedBy}
                        onChange={(e) => setIssuedBy(e.target.value)}
                    />
                </div>

                {/* Received By */}
                <div className="st-form-row">
                    <label className="st-form-label">Received By</label>
                    <input
                        type="text"
                        className="st-input"
                        placeholder="Enter Received By"
                        value={receivedBy}
                        onChange={(e) => setReceivedBy(e.target.value)}
                    />
                </div>
            </div>

            {/* Line Items Grid matching Screenshot 2 & 3 */}
            <div className="st-grid-container">
                <table className="st-grid-table">
                    <thead>
                        <tr>
                            <th style={{ minWidth: "170px" }}>
                                Item <span className="st-req">*</span>
                            </th>
                            <th style={{ minWidth: "180px" }}>Description</th>
                            <th style={{ minWidth: "140px" }}>Colour</th>
                            <th style={{ minWidth: "140px" }}>
                                Size Range <span className="st-req">*</span>
                            </th>
                            <th style={{ minWidth: "85px" }}>
                                UOM <span className="st-req">*</span>
                            </th>
                            <th style={{ minWidth: "110px" }}>Available Qty</th>
                            <th style={{ minWidth: "100px" }}>
                                Qty <span className="st-req">*</span>
                            </th>
                            <th style={{ minWidth: "90px" }}>Rate</th>
                            <th style={{ minWidth: "100px" }}>Amount</th>
                            <th style={{ width: "40px", textAlign: "center" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((row) => (
                            <tr key={row.id}>
                                {/* Item with Autocomplete suggestions */}
                                <td style={{ position: "relative" }}>
                                    <input
                                        type="text"
                                        className="st-cell-input"
                                        placeholder="Type and select Item"
                                        value={row.item}
                                        onFocus={() => setActiveSuggestionRowId(row.id)}
                                        onChange={(e) => {
                                            handleItemChange(row.id, "item", e.target.value);
                                            setActiveSuggestionRowId(row.id);
                                        }}
                                    />
                                    {activeSuggestionRowId === row.id && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "100%",
                                                left: 0,
                                                width: "280px",
                                                background: "#ffffff",
                                                border: "1px solid #cbd5e1",
                                                borderRadius: "4px",
                                                boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                                                zIndex: 999,
                                                maxHeight: "180px",
                                                overflowY: "auto"
                                            }}
                                        >
                                            <div
                                                style={{
                                                    padding: "4px 8px",
                                                    fontSize: "11px",
                                                    color: "#64748b",
                                                    background: "#f8fafc",
                                                    borderBottom: "1px solid #e2e8f0"
                                                }}
                                            >
                                                Select item to auto-fill:
                                            </div>
                                            {LOOKUP_ITEMS.filter(
                                                (l) =>
                                                    !row.item ||
                                                    l.name.toLowerCase().includes(row.item.toLowerCase()) ||
                                                    l.itemCode.toLowerCase().includes(row.item.toLowerCase())
                                            ).map((lookup) => (
                                                <div
                                                    key={lookup.itemCode}
                                                    style={{
                                                        padding: "6px 10px",
                                                        fontSize: "11.5px",
                                                        cursor: "pointer",
                                                        borderBottom: "1px solid #f1f5f9"
                                                    }}
                                                    onMouseDown={() => handleSelectLookupItem(row.id, lookup)}
                                                >
                                                    <div style={{ fontWeight: 600, color: "#1e293b" }}>
                                                        {lookup.name}
                                                    </div>
                                                    <div style={{ fontSize: "10.5px", color: "#64748b" }}>
                                                        {lookup.itemCode} &bull; {lookup.colour} &bull; Stock: {lookup.availableQty} {lookup.uom}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </td>

                                {/* Description */}
                                <td>
                                    <textarea
                                        className="st-cell-textarea"
                                        placeholder="Description"
                                        value={row.description}
                                        onChange={(e) => handleItemChange(row.id, "description", e.target.value)}
                                    />
                                </td>

                                {/* Colour */}
                                <td>
                                    <input
                                        type="text"
                                        className="st-cell-input"
                                        placeholder="Type and select Colour"
                                        value={row.colour}
                                        onChange={(e) => handleItemChange(row.id, "colour", e.target.value)}
                                    />
                                </td>

                                {/* Size Range */}
                                <td>
                                    <input
                                        type="text"
                                        className="st-cell-input"
                                        placeholder="Type & Select Size Range"
                                        value={row.sizeRange}
                                        onChange={(e) => handleItemChange(row.id, "sizeRange", e.target.value)}
                                    />
                                </td>

                                {/* UOM */}
                                <td>
                                    <input
                                        type="text"
                                        className="st-cell-input"
                                        placeholder="UOM"
                                        value={row.uom}
                                        onChange={(e) => handleItemChange(row.id, "uom", e.target.value)}
                                    />
                                </td>

                                {/* Available Qty */}
                                <td>
                                    <input
                                        type="text"
                                        className="st-cell-input"
                                        placeholder="Available Qty"
                                        value={row.availableQty}
                                        readOnly
                                        disabled
                                    />
                                </td>

                                {/* Qty */}
                                <td>
                                    <input
                                        type="number"
                                        className="st-cell-input"
                                        placeholder="Enter Qty"
                                        value={row.qty}
                                        onChange={(e) => handleItemChange(row.id, "qty", e.target.value)}
                                    />
                                </td>

                                {/* Rate */}
                                <td>
                                    <input
                                        type="number"
                                        className="st-cell-input"
                                        placeholder="Rate"
                                        value={row.rate}
                                        onChange={(e) => handleItemChange(row.id, "rate", e.target.value)}
                                    />
                                </td>

                                {/* Amount */}
                                <td>
                                    <input
                                        type="text"
                                        className="st-cell-input"
                                        value={row.amount ? row.amount.toFixed(2) : "0.00"}
                                        readOnly
                                        disabled
                                    />
                                </td>

                                {/* Delete */}
                                <td style={{ textAlign: "center" }}>
                                    <button
                                        type="button"
                                        className="st-del-btn"
                                        title="Delete Line"
                                        onClick={() => handleDeleteLine(row.id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* + Add Another Line matching Screenshot 3 */}
            <button
                type="button"
                className="st-add-line-btn"
                onClick={handleAddLine}
            >
                <FaPlus style={{ fontSize: "11px" }} />
                <span>Add Another Line</span>
            </button>

            {/* Bottom Actions Bar matching Screenshot 3 */}
            <div className="st-bottom-bar">
                {/* Left: Attachments */}
                <div>
                    <button
                        type="button"
                        className="st-btn-attachments"
                        onClick={() => showToast("File attachment dialog ready")}
                    >
                        <FaPlus style={{ fontSize: "11px" }} />
                        <span>Attachments...</span>
                    </button>
                </div>

                {/* Right: Save split button & View */}
                <div className="st-bottom-right-actions">
                    <div className="st-btn-save-group">
                        <button
                            type="button"
                            className="st-btn-save"
                            onClick={() => handleSave("view")}
                        >
                            <FaSave style={{ fontSize: "12px" }} />
                            <span>Save</span>
                        </button>
                        <button
                            type="button"
                            className="st-btn-save-caret"
                            onClick={() => setShowSaveDropdown(!showSaveDropdown)}
                        >
                            <FaCaretDown />
                        </button>

                        {showSaveDropdown && (
                            <div className="st-save-dropdown-menu">
                                <button
                                    type="button"
                                    className="st-save-menu-item"
                                    onClick={() => handleSave("view")}
                                >
                                    Save &amp; View
                                </button>
                                <button
                                    type="button"
                                    className="st-save-menu-item"
                                    onClick={() => handleSave("new")}
                                >
                                    Save &amp; New
                                </button>
                                <button
                                    type="button"
                                    className="st-save-menu-item"
                                    onClick={() => {
                                        handleSave("view");
                                        window.print();
                                    }}
                                >
                                    Save &amp; Print
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className="st-btn-view"
                        onClick={() => {
                            setViewMode("list");
                            if (window.history && window.history.pushState) {
                                window.history.pushState({}, "", "/stock-transfer");
                            }
                        }}
                    >
                        <FaEye style={{ fontSize: "12px" }} />
                        <span>View</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
