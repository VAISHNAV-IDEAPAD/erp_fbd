import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
    FaSyncAlt,
    FaCog,
    FaFileExcel,
    FaFilePdf,
    FaFilter,
    FaTimes,
    FaSearch
} from "react-icons/fa";
import "../../../styles/stockLedger.css";

// Default comprehensive sample dataset extracted from TPCS Fashion Stock Ledger
const DEFAULT_LEDGER_ITEMS = [
    {
        itemHeader: "TALIN 0.3MM, Code :NONWO5064, Description : , Color :WHITE, UOM :MTR",
        itemCode: "NONWO5064",
        itemName: "TALIN 0.3MM",
        color: "WHITE",
        uom: "MTR",
        itemCategory: "REINFORCEMENT",
        location: "Plot No. 9B",
        materialSource: "Import",
        transactions: [
            {
                id: 1,
                trDate: "",
                trNo: "",
                trType: "OPENING",
                ioNo: "",
                style: "",
                party: "",
                invoiceNo: "",
                invoiceDate: "",
                rate: null,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 0,
                valOut: 0,
                closingQty: 1897.99666,
                closingVal: 862640.48197,
                category: "",
                location: ""
            },
            {
                id: 2,
                trDate: "02-04-2026",
                trNo: "SAGRN/AAPL9B/2627/5",
                trType: "SAGRN",
                ioNo: "",
                style: "",
                party: "ALPINE APPARELS PVT. LTD.",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0.1,
                valIn: 45.45,
                qtyOut: 0,
                valOut: 0,
                closingQty: 1898.09666,
                closingVal: 862685.93197,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 3,
                trDate: "06-04-2026",
                trNo: "STC/9B/2627/82",
                trType: "STDC",
                ioNo: "",
                style: "",
                party: "ALPINE APPARELS PVT. LTD.",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 0.0001,
                valOut: 0.04545,
                closingQty: 1898.09656,
                closingVal: 862685.88652,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 4,
                trDate: "07-04-2026",
                trNo: "STC/9B/2627/20",
                trType: "STDC",
                ioNo: "IO/AAPL68/25-26/391",
                style: "",
                party: "Plot No. 68",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 2.22,
                valOut: 1008.99,
                closingQty: 1895.87656,
                closingVal: 861676.89652,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 5,
                trDate: "07-04-2026",
                trNo: "STC/9B/2627/20",
                trType: "STDC",
                ioNo: "IO/AAPL68/25-26/392",
                style: "",
                party: "Plot No. 68",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 2.48,
                valOut: 1127.16,
                closingQty: 1893.39656,
                closingVal: 860549.73652,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 6,
                trDate: "07-04-2026",
                trNo: "STC/9B/2627/20",
                trType: "STDC",
                ioNo: "IO/AAPL68/25-26/393",
                style: "",
                party: "Plot No. 68",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 1.05,
                valOut: 477.225,
                closingQty: 1892.34656,
                closingVal: 860072.51152,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 7,
                trDate: "07-04-2026",
                trNo: "STC/9B/2627/20",
                trType: "STDC",
                ioNo: "IO/AAPL68/25-26/394",
                style: "",
                party: "Plot No. 68",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 1.96,
                valOut: 890.82,
                closingQty: 1890.38656,
                closingVal: 859181.69152,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 8,
                trDate: "09-04-2026",
                trNo: "STC/9B/2627/33",
                trType: "STDC",
                ioNo: "",
                style: "",
                party: "Plot No. 68",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 0.01,
                valOut: 4.545,
                closingQty: 1890.37656,
                closingVal: 859177.14652,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 9,
                trDate: "10-04-2026",
                trNo: "FRM/9B/2627/12",
                trType: "FRM",
                ioNo: "",
                style: "",
                party: "ALPINE APPARELS PVT. LTD.",
                invoiceNo: "",
                invoiceDate: "",
                rate: 457.06199,
                qtyIn: 0.01,
                valIn: 4.57062,
                qtyOut: 0,
                valOut: 0,
                closingQty: 1881.88656,
                closingVal: 855317.52138,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 10,
                trDate: "12-04-2026",
                trNo: "STC/9B/2627/45",
                trType: "STDC",
                ioNo: "",
                style: "",
                party: "ALPINE APPARELS PVT. LTD.",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 0.1,
                valOut: 45.45,
                closingQty: 1881.78656,
                closingVal: 855272.07138,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 11,
                trDate: "14-04-2026",
                trNo: "STC/9B/2627/56",
                trType: "STDC",
                ioNo: "IO/AAPL/25-26/1605",
                style: "",
                party: "ALPINE APPARELS PVT. LTD.",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 1.5,
                valOut: 681.75,
                closingQty: 1880.28656,
                closingVal: 854590.32138,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 12,
                trDate: "15-04-2026",
                trNo: "STC/9B/2627/58",
                trType: "STDC",
                ioNo: "IO/AAPL/25-26/1613",
                style: "",
                party: "ALPINE APPARELS PVT. LTD.",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 1.5,
                valOut: 681.75,
                closingQty: 1878.78656,
                closingVal: 853908.57138,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 13,
                trDate: "18-04-2026",
                trNo: "STC/9B/2627/71",
                trType: "STDC",
                ioNo: "",
                style: "",
                party: "ALPINE APPARELS PVT. LTD.",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 2,
                valOut: 909,
                closingQty: 1876.78656,
                closingVal: 852999.57138,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 14,
                trDate: "20-04-2026",
                trNo: "ISS/9B/2627/174",
                trType: "ISS",
                ioNo: "",
                style: "",
                party: "Plot No. 9B",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 0.01,
                valOut: 4.545,
                closingQty: 1876.77656,
                closingVal: 852995.02638,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 15,
                trDate: "22-04-2026",
                trNo: "STC/9B/2627/89",
                trType: "STDC",
                ioNo: "",
                style: "",
                party: "Plot No. 68",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 0.01,
                valOut: 4.545,
                closingQty: 1876.76656,
                closingVal: 852990.48138,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 16,
                trDate: "25-04-2026",
                trNo: "STC/9B/2627/95",
                trType: "STDC",
                ioNo: "",
                style: "",
                party: "ALPINE APPARELS PVT. LTD.",
                invoiceNo: "",
                invoiceDate: "",
                rate: 0,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 0,
                valOut: 0,
                closingQty: 1876.76656,
                closingVal: 852990.48138,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 17,
                trDate: "28-04-2026",
                trNo: "ISS/9B/2627/1044",
                trType: "ISS",
                ioNo: "",
                style: "",
                party: "Plot No. 9B",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 75,
                valOut: 34087.50012,
                closingQty: 1801.76656,
                closingVal: 818902.98126,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 18,
                trDate: "30-04-2026",
                trNo: "FRM/9B/2627/293",
                trType: "FRM",
                ioNo: "",
                style: "",
                party: "Plot No. 9B",
                invoiceNo: "",
                invoiceDate: "",
                rate: 457.06199,
                qtyIn: 0.23011,
                valIn: 105.17453,
                qtyOut: 0,
                valOut: 0,
                closingQty: 1801.99667,
                closingVal: 819008.15579,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            }
        ]
    }
];

export default function StockLedger() {
    // ---------------------------------------------------------
    // Top Bar Criteria State
    // ---------------------------------------------------------
    const [fromDate, setFromDate] = useState("2026-04-01");
    const [toDate, setToDate] = useState("2026-10-11");
    const [store, setStore] = useState("RAW MATERIAL STORE 9B");

    // ---------------------------------------------------------
    // Advanced Filter Popover State
    // ---------------------------------------------------------
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        group: "",
        colour: "",
        profitCenter: "",
        itemCategory: "",
        style: "",
        item: "",
        code: "",
        location: "",
        ioNo: "",
        materialSource: "All" // "All" | "Import" | "Domestic"
    });

    const [activeFilters, setActiveFilters] = useState({ ...filters });

    // ---------------------------------------------------------
    // Data State
    // ---------------------------------------------------------
    const [ledgerData, setLedgerData] = useState(DEFAULT_LEDGER_ITEMS);
    const [loading, setLoading] = useState(false);

    // Fetch live backend ledger if available
    const loadLedger = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/stock-ledger");
            const dbData = res.data?.data || res.data;
            if (Array.isArray(dbData) && dbData.length > 0) {
                // Group by item if returned from database
                const grouped = {};
                dbData.forEach(row => {
                    const key = row.ItemCode || "DEFAULT";
                    if (!grouped[key]) {
                        grouped[key] = {
                            itemHeader: `${row.ItemName || "ITEM"}, Code :${row.ItemCode || ""}, Description : ${row.Description || ""}, Color :${row.Color || ""}, UOM :${row.UOM || "PCS"}`,
                            itemCode: row.ItemCode || "",
                            itemName: row.ItemName || "",
                            color: row.Color || "",
                            uom: row.UOM || "PCS",
                            itemCategory: row.ItemCategory || row.Category || "GENERAL",
                            location: row.Location || row.Warehouse || "Plot No. 9B",
                            materialSource: row.MaterialSource || "Import",
                            transactions: []
                        };
                    }
                    grouped[key].transactions.push({
                        id: row.LedgerID || row.id || Math.random(),
                        trDate: row.TransactionDate || row.Date || "",
                        trNo: row.ReferenceNo || row.TrNo || "",
                        trType: row.TransactionType || row.Type || "TR",
                        ioNo: row.IONo || "",
                        style: row.Style || "",
                        party: row.Party || row.SupplierName || "",
                        invoiceNo: row.InvoiceNo || "",
                        invoiceDate: row.InvoiceDate || "",
                        rate: row.Rate != null ? Number(row.Rate) : null,
                        qtyIn: Number(row.QtyIn || 0),
                        valIn: Number(row.ValueIn || (row.QtyIn * (row.Rate || 0)) || 0),
                        qtyOut: Number(row.QtyOut || 0),
                        valOut: Number(row.ValueOut || (row.QtyOut * (row.Rate || 0)) || 0),
                        closingQty: Number(row.BalanceQty || row.ClosingQty || 0),
                        closingVal: Number(row.BalanceValue || row.ClosingValue || 0),
                        category: row.ItemCategory || "",
                        location: row.Location || ""
                    });
                });
                setLedgerData(Object.values(grouped));
            } else {
                setLedgerData(DEFAULT_LEDGER_ITEMS);
            }
        } catch (e) {
            console.warn("Using default stock ledger dataset:", e.message);
            setLedgerData(DEFAULT_LEDGER_ITEMS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLedger();
    }, []);

    // ---------------------------------------------------------
    // Filter Handlers
    // ---------------------------------------------------------
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleApplyFilter = () => {
        setActiveFilters({ ...filters });
        setIsFilterOpen(false);
    };

    const handleResetFilter = () => {
        const cleared = {
            group: "",
            colour: "",
            profitCenter: "",
            itemCategory: "",
            style: "",
            item: "",
            code: "",
            location: "",
            ioNo: "",
            materialSource: "All"
        };
        setFilters(cleared);
        setActiveFilters(cleared);
        setIsFilterOpen(false);
    };

    // ---------------------------------------------------------
    // Filtered Ledger Calculation
    // ---------------------------------------------------------
    const filteredLedger = useMemo(() => {
        return ledgerData.map(group => {
            // Check item-level criteria
            if (activeFilters.code && !group.itemCode.toLowerCase().includes(activeFilters.code.toLowerCase())) {
                return null;
            }
            if (activeFilters.item && !group.itemName.toLowerCase().includes(activeFilters.item.toLowerCase())) {
                return null;
            }
            if (activeFilters.colour && !group.color.toLowerCase().includes(activeFilters.colour.toLowerCase())) {
                return null;
            }
            if (activeFilters.itemCategory && !group.itemCategory.toLowerCase().includes(activeFilters.itemCategory.toLowerCase())) {
                return null;
            }
            if (activeFilters.location && !group.location.toLowerCase().includes(activeFilters.location.toLowerCase())) {
                return null;
            }
            if (activeFilters.materialSource !== "All" && group.materialSource !== activeFilters.materialSource) {
                return null;
            }

            // Filter transactions
            const filteredTxns = group.transactions.filter(t => {
                if (activeFilters.ioNo && t.ioNo && !t.ioNo.toLowerCase().includes(activeFilters.ioNo.toLowerCase())) {
                    return false;
                }
                if (activeFilters.style && t.style && !t.style.toLowerCase().includes(activeFilters.style.toLowerCase())) {
                    return false;
                }
                return true;
            });

            return {
                ...group,
                transactions: filteredTxns
            };
        }).filter(Boolean);
    }, [ledgerData, activeFilters]);

    // ---------------------------------------------------------
    // Export Functions
    // ---------------------------------------------------------
    const exportToExcel = () => {
        const headers = [
            "Item", "Tr Date", "Tr No", "Tr Type", "IO No", "Style", "Party",
            "Invoice No", "Invoice Date", "Rate", "Quantity In", "Value In",
            "Quantity Out", "Value Out", "Closing Quantity", "Closing Value",
            "Item Category", "Location"
        ];

        const rows = [];
        filteredLedger.forEach(group => {
            rows.push([group.itemHeader, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
            group.transactions.forEach(t => {
                rows.push([
                    "",
                    t.trDate,
                    t.trNo,
                    t.trType,
                    t.ioNo,
                    t.style,
                    t.party,
                    t.invoiceNo,
                    t.invoiceDate,
                    t.rate != null ? t.rate : "",
                    t.qtyIn || 0,
                    t.valIn || 0,
                    t.qtyOut || 0,
                    t.valOut || 0,
                    t.closingQty != null ? t.closingQty : "",
                    t.closingVal != null ? t.closingVal : "",
                    t.category || group.itemCategory,
                    t.location || group.location
                ]);
            });
        });

        // Convert to CSV
        const csvContent = "data:text/csv;charset=utf-8," +
            [headers.join(","), ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Stock_Ledger_${fromDate}_to_${toDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        window.print();
    };

    // ---------------------------------------------------------
    // Formatters
    // ---------------------------------------------------------
    const fmtNum = (val, maxDec = 5) => {
        if (val == null || val === "" || isNaN(val)) return "";
        const num = Number(val);
        if (num === 0) return "0";
        return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: maxDec });
    };

    return (
        <div className="stock-ledger-page">
            {/* Header Title */}
            <h1 className="stock-ledger-title">Stock Ledger</h1>

            {/* Top Criteria Filters Bar */}
            <div className="sl-filter-bar">
                <div className="sl-field-group">
                    <label className="sl-field-label">From</label>
                    <div className="sl-input-date-wrap">
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="sl-field-group">
                    <label className="sl-field-label">To</label>
                    <div className="sl-input-date-wrap">
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="sl-field-group">
                    <label className="sl-field-label">Store</label>
                    <div className="sl-input-store-wrap">
                        <input
                            type="text"
                            placeholder="Type and Select Store"
                            value={store}
                            onChange={(e) => setStore(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Toolbar Buttons Row */}
            <div className="sl-toolbar-row">
                <div className="sl-toolbar-actions">
                    <button
                        type="button"
                        className="sl-tool-btn"
                        title="Refresh"
                        onClick={loadLedger}
                        disabled={loading}
                    >
                        <FaSyncAlt className={loading ? "fa-spin" : ""} size={13} />
                    </button>

                    <button
                        type="button"
                        className="sl-tool-btn"
                        title="Settings"
                        onClick={() => alert("Column Configuration & Settings")}
                    >
                        <FaCog size={13} />
                    </button>

                    <button
                        type="button"
                        className="sl-tool-btn btn-excel"
                        title="Export to Excel"
                        onClick={exportToExcel}
                    >
                        <FaFileExcel size={14} />
                    </button>

                    <button
                        type="button"
                        className="sl-tool-btn btn-pdf"
                        title="Print / Export PDF"
                        onClick={handlePrint}
                    >
                        <FaFilePdf size={14} />
                    </button>

                    <button
                        type="button"
                        className={`sl-filter-toggle-btn ${isFilterOpen ? "active" : ""}`}
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <FaFilter size={11} />
                        Filter ▾
                    </button>
                </div>

                <div className="sl-pagination-badge">1</div>
            </div>

            {/* Filter Popover Dropdown (Matches Screenshot 2) */}
            {isFilterOpen && (
                <div className="sl-filter-popover">
                    <div className="sl-popover-grid">
                        {/* Left Column */}
                        <div className="sl-popover-field">
                            <label>Group</label>
                            <input
                                type="text"
                                placeholder="Type and select Group"
                                value={filters.group}
                                onChange={(e) => handleFilterChange("group", e.target.value)}
                            />
                        </div>

                        {/* Right Column */}
                        <div className="sl-popover-field">
                            <label>Item</label>
                            <input
                                type="text"
                                placeholder="Type and select Material"
                                value={filters.item}
                                onChange={(e) => handleFilterChange("item", e.target.value)}
                            />
                        </div>

                        <div className="sl-popover-field">
                            <label>Colour</label>
                            <input
                                type="text"
                                placeholder="Type and select Colour"
                                value={filters.colour}
                                onChange={(e) => handleFilterChange("colour", e.target.value)}
                            />
                        </div>

                        <div className="sl-popover-field">
                            <label>Code</label>
                            <input
                                type="text"
                                placeholder="Enter code"
                                value={filters.code}
                                onChange={(e) => handleFilterChange("code", e.target.value)}
                            />
                        </div>

                        <div className="sl-popover-field">
                            <label>Profit Center</label>
                            <input
                                type="text"
                                placeholder="Type and Select Profit Center"
                                value={filters.profitCenter}
                                onChange={(e) => handleFilterChange("profitCenter", e.target.value)}
                            />
                        </div>

                        <div className="sl-popover-field">
                            <label>Location</label>
                            <input
                                type="text"
                                placeholder="Type and select Location"
                                value={filters.location}
                                onChange={(e) => handleFilterChange("location", e.target.value)}
                            />
                        </div>

                        <div className="sl-popover-field">
                            <label>Item Category</label>
                            <input
                                type="text"
                                placeholder="Type and select Item Category"
                                value={filters.itemCategory}
                                onChange={(e) => handleFilterChange("itemCategory", e.target.value)}
                            />
                        </div>

                        <div className="sl-popover-field">
                            <label>IO No</label>
                            <input
                                type="text"
                                placeholder="Type and select IO No"
                                value={filters.ioNo}
                                onChange={(e) => handleFilterChange("ioNo", e.target.value)}
                            />
                        </div>

                        <div className="sl-popover-field">
                            <label>Style</label>
                            <input
                                type="text"
                                placeholder="Type and select Style"
                                value={filters.style}
                                onChange={(e) => handleFilterChange("style", e.target.value)}
                            />
                        </div>

                        <div className="sl-popover-field">
                            <label>Item Material Source</label>
                            <div className="sl-radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="matSource"
                                        value="All"
                                        checked={filters.materialSource === "All"}
                                        onChange={() => handleFilterChange("materialSource", "All")}
                                    />
                                    All
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="matSource"
                                        value="Import"
                                        checked={filters.materialSource === "Import"}
                                        onChange={() => handleFilterChange("materialSource", "Import")}
                                    />
                                    Import
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="matSource"
                                        value="Domestic"
                                        checked={filters.materialSource === "Domestic"}
                                        onChange={() => handleFilterChange("materialSource", "Domestic")}
                                    />
                                    Domestic
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="sl-popover-actions">
                        <button
                            type="button"
                            className="sl-btn-reset"
                            onClick={handleResetFilter}
                        >
                            <FaTimes size={11} /> Reset
                        </button>
                        <button
                            type="button"
                            className="sl-btn-apply"
                            onClick={handleApplyFilter}
                        >
                            <FaSearch size={11} /> Apply
                        </button>
                    </div>
                </div>
            )}

            {/* Stock Ledger Table */}
            <div className="sl-table-container">
                <table className="sl-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Tr Date</th>
                            <th>Tr No</th>
                            <th>Tr Type</th>
                            <th>IO No</th>
                            <th>Style</th>
                            <th>Party</th>
                            <th>Invoice No</th>
                            <th>Invoice Date</th>
                            <th className="num-col">Rate</th>
                            <th className="num-col">Quantity In</th>
                            <th className="num-col">Value In</th>
                            <th className="num-col">Quantity Out</th>
                            <th className="num-col">Value Out</th>
                            <th className="num-col">Closing Quantity</th>
                            <th className="num-col">Closing Value</th>
                            <th>Item Category</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLedger.length === 0 ? (
                            <tr>
                                <td colSpan="18" className="sl-empty-state">
                                    No stock ledger transactions found for the specified criteria.
                                </td>
                            </tr>
                        ) : (
                            filteredLedger.map((group, gIdx) => {
                                // Compute group totals
                                const sumQtyIn = group.transactions.reduce((acc, t) => acc + (t.qtyIn || 0), 0);
                                const sumValIn = group.transactions.reduce((acc, t) => acc + (t.valIn || 0), 0);
                                const sumQtyOut = group.transactions.reduce((acc, t) => acc + (t.qtyOut || 0), 0);
                                const sumValOut = group.transactions.reduce((acc, t) => acc + (t.valOut || 0), 0);
                                const lastTxn = group.transactions[group.transactions.length - 1];
                                const finalClosingQty = lastTxn ? lastTxn.closingQty : 0;
                                const finalClosingVal = lastTxn ? lastTxn.closingVal : 0;

                                return (
                                    <React.Fragment key={gIdx}>
                                        {/* Item Header Band */}
                                        <tr className="sl-item-header-row">
                                            <td colSpan="18">{group.itemHeader}</td>
                                        </tr>

                                        {/* Transaction Rows */}
                                        {group.transactions.map((t, tIdx) => (
                                            <tr key={t.id || tIdx}>
                                                <td></td>
                                                <td>{t.trDate || ""}</td>
                                                <td>{t.trNo || ""}</td>
                                                <td>{t.trType || ""}</td>
                                                <td>{t.ioNo || ""}</td>
                                                <td>{t.style || ""}</td>
                                                <td>{t.party || ""}</td>
                                                <td>{t.invoiceNo || ""}</td>
                                                <td>{t.invoiceDate || ""}</td>
                                                <td className="num-col">{t.rate != null ? fmtNum(t.rate) : ""}</td>
                                                <td className="num-col">{t.qtyIn ? fmtNum(t.qtyIn) : (t.trType === "OPENING" ? "0" : "")}</td>
                                                <td className="num-col">{t.valIn ? fmtNum(t.valIn) : (t.trType === "OPENING" ? "0" : "")}</td>
                                                <td className="num-col">{t.qtyOut ? fmtNum(t.qtyOut) : (t.trType === "OPENING" ? "0" : "")}</td>
                                                <td className="num-col">{t.valOut ? fmtNum(t.valOut) : (t.trType === "OPENING" ? "0" : "")}</td>
                                                <td className="num-col">{fmtNum(t.closingQty)}</td>
                                                <td className="num-col">{fmtNum(t.closingVal)}</td>
                                                <td>{t.category || (t.trType !== "OPENING" ? group.itemCategory : "")}</td>
                                                <td>{t.location || (t.trType !== "OPENING" ? group.location : "")}</td>
                                            </tr>
                                        ))}

                                        {/* Group Totals Row (Matching Screenshot 4) */}
                                        <tr className="sl-total-row">
                                            <td colSpan="10" className="text-end"></td>
                                            <td className="num-col">{fmtNum(sumQtyIn)}</td>
                                            <td className="num-col">{fmtNum(sumValIn)}</td>
                                            <td className="num-col">{fmtNum(sumQtyOut)}</td>
                                            <td className="num-col">{fmtNum(sumValOut)}</td>
                                            <td className="num-col">{fmtNum(finalClosingQty)}</td>
                                            <td className="num-col">{fmtNum(finalClosingVal)}</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
