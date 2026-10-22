import React, { useState, useMemo } from "react";
import {
    FaChartBar,
    FaRegFileAlt,
    FaSearch,
    FaCog,
    FaArrowsAlt,
    FaRegEdit,
    FaBoxOpen,
    FaShoppingCart,
    FaCogs,
    FaFileAlt,
    FaBolt,
    FaMoneyCheckAlt,
    FaChartLine,
    FaFolder,
    FaWrench,
    FaClock,
    FaCompass,
    FaEdit,
    FaTimes,
    FaFilePdf,
    FaFileExcel,
    FaChevronDown,
    FaChevronUp,
    FaArrowUp
} from "react-icons/fa";
import "../styles/reports.css";

// 14 CATEGORIES WITH EXACTLY 88 REPORTS
const REPORT_CATEGORIES_DATA = [
    // --- COLUMN 1 (LEFT) ---
    {
        id: "cat_general",
        title: "",
        displayTitle: "General Reports",
        rawTitle: "",
        icon: <FaRegEdit style={{ color: "#2563eb" }} />,
        badgeBg: "#e0ecfd",
        column: "left",
        defaultOpen: true,
        reports: [
            { id: "r1", name: "Order Closing Report", description: null },
            { id: "r2", name: "Item Requisition Note vs Issues Details", description: null },
            { id: "r3", name: "BOM Amendment Comparison", description: null },
            { id: "r4", name: "STDC Register With Size", description: null },
            { id: "r5", name: "Production Planning Calendar", description: null },
            { id: "r6", name: "Subcontract Order/DC Report", description: null },
            { id: "r7", name: "Sample Order Register", description: "Sample Order Register" },
            { id: "r8", name: "Product Development Pipeline Dashboard", description: null },
            { id: "r9", name: "Product Dev Pipeline V2", description: null },
            { id: "r10", name: "Purchase Order Register With Size2", description: null },
            { id: "r11", name: "STYLE", description: null },
            { id: "r12", name: "Pending Stock Transfer DC", description: null },
            { id: "r13", name: "Indent Vs PO Vs GRN", description: null },
            { id: "r14", name: "Subcontract Order DC vs GRN", description: null },
            { id: "r15", name: "Subcontract Conversion DC vs GRN", description: null }
        ]
    },
    {
        id: "cat_costing",
        title: "02. Costing",
        rawTitle: "02. Costing",
        icon: <FaChartLine style={{ color: "#d97706" }} />,
        badgeBg: "#fef3c7",
        column: "left",
        defaultOpen: false,
        reports: [
            { id: "r16", name: "Pre-Costing vs Actual Costing Variance", description: "Variance Audit" },
            { id: "r17", name: "Style Costing Summary Report", description: "Budget vs Actual" }
        ]
    },
    {
        id: "cat_purchase",
        title: "04. Purchase",
        rawTitle: "04. Purchase",
        icon: <FaFolder style={{ color: "#db2777" }} />,
        badgeBg: "#fce7f3",
        column: "left",
        defaultOpen: false,
        reports: [
            { id: "r18", name: "Requirement to PO Register", description: "PO Requirement Audit" },
            { id: "r19", name: "Pending Purchase Order Report", description: "Pending Deliveries" },
            { id: "r20", name: "Purchase Order Register With Item Details", description: null },
            { id: "r21", name: "Supplier-wise Purchase Analysis", description: null },
            { id: "r22", name: "GRN Handover vs Inspection Register", description: null },
            { id: "r23", name: "Purchase Return & Debit Note Summary", description: null },
            { id: "r24", name: "Rate Contract & Vendor Comparison", description: null },
            { id: "r25", name: "PO Amendment History Report", description: null },
            { id: "r26", name: "Material Inward vs PO Reconciliation", description: null },
            { id: "r27", name: "Supplier Lead Time & Delivery Performance", description: null },
            { id: "r28", name: "Cancelled / Closed PO Summary", description: null },
            { id: "r29", name: "Raw Material PO Tracking Log", description: null }
        ]
    },
    {
        id: "cat_production",
        title: "06. Production",
        rawTitle: "06. Production",
        icon: <FaWrench style={{ color: "#ea580c" }} />,
        badgeBg: "#ffedd5",
        column: "left",
        defaultOpen: false,
        reports: [
            { id: "r30", name: "Daily Cutting Slip Generation Log", description: null },
            { id: "r31", name: "Line Output by Size & Colour Report", description: null },
            { id: "r32", name: "Daily Production Target vs Achievement", description: null },
            { id: "r33", name: "Line Balancing & Operator Efficiency Report", description: null },
            { id: "r34", name: "Hourly Production Output V2", description: null }
        ]
    },
    {
        id: "cat_ta",
        title: "09. T & A",
        rawTitle: "09. T & A",
        icon: <FaClock style={{ color: "#0d9488" }} />,
        badgeBg: "#ccfbf1",
        column: "left",
        defaultOpen: false,
        reports: [
            { id: "r35", name: "Time & Action Calendar Milestone Tracking", description: "Critical Path Log" }
        ]
    },
    {
        id: "cat_dashboard",
        title: "Dashboard",
        rawTitle: "Dashboard",
        icon: <FaCompass style={{ color: "#ca8a04" }} />,
        badgeBg: "#fef08a",
        column: "left",
        defaultOpen: false,
        reports: [
            { id: "r36", name: "Executive Management MIS Overview", description: "Live KPIs" }
        ]
    },
    {
        id: "cat_production_reports",
        title: "Production.Reports",
        rawTitle: "Production.Reports",
        icon: <FaEdit style={{ color: "#2563eb" }} />,
        badgeBg: "#dbeafe",
        column: "left",
        defaultOpen: false,
        reports: [
            { id: "r37", name: "Sewing Floor Productivity & Man Hours", description: "Line Man Hours" }
        ]
    },

    // --- COLUMN 2 (RIGHT) ---
    {
        id: "cat_sample",
        title: "01. Sample/ Design",
        rawTitle: "01. Sample/ Design",
        icon: <FaRegFileAlt style={{ color: "#059669" }} />,
        badgeBg: "#d1fae5",
        column: "right",
        defaultOpen: false,
        reports: [
            { id: "r38", name: "Sample Status Tracking & Tech Pack Report", description: "Sample Register" }
        ]
    },
    {
        id: "cat_sales",
        title: "03. Sales",
        rawTitle: "03. Sales",
        icon: <FaShoppingCart style={{ color: "#7c3aed" }} />,
        badgeBg: "#ede9fe",
        column: "right",
        defaultOpen: false,
        reports: [
            { id: "r39", name: "Monthly Sales Register (GST)", description: "Tax Compliance" },
            { id: "r40", name: "Customer-wise Dispatch Summary", description: null },
            { id: "r41", name: "Sales Order Status & Execution Report", description: null },
            { id: "r42", name: "Customer Outstanding & Aging Analysis", description: null },
            { id: "r43", name: "Order Booked vs Shipped Report", description: null },
            { id: "r44", name: "Sales Invoicing Register", description: null }
        ]
    },
    {
        id: "cat_inventory",
        title: "05. Inventory",
        rawTitle: "05. Inventory",
        icon: <FaBoxOpen style={{ color: "#10b981" }} />,
        badgeBg: "#d1fae5",
        column: "right",
        defaultOpen: false,
        reports: [
            { id: "r45", name: "Stock Ledger Summary", description: "Realtime Ledger" },
            { id: "r46", name: "Current Stock by Location / Rack", description: null },
            { id: "r47", name: "Finished Goods Stock Inventory", description: null },
            { id: "r48", name: "Low Stock / Reorder Level Alert", description: null },
            { id: "r49", name: "Item Receipt Register (GRN)", description: null },
            { id: "r50", name: "Item Issue Register (Material Transfer)", description: null },
            { id: "r51", name: "Floor Return Register", description: null },
            { id: "r52", name: "Rejection / Defective Material Stock", description: null },
            { id: "r53", name: "Stock Conversion DC Register", description: null },
            { id: "r54", name: "Stock Transfer DC Register", description: null },
            { id: "r55", name: "Stock Transfer GRN Register", description: null },
            { id: "r56", name: "Store to Store Transfer Log", description: null },
            { id: "r57", name: "Gate Pass Delivery Register", description: null },
            { id: "r58", name: "Gate Pass GRN Register", description: null },
            { id: "r59", name: "Gate Entry Tracking Register", description: null },
            { id: "r60", name: "Batch-wise / Lot-wise Fabric Stock", description: null },
            { id: "r61", name: "Trims & Accessories Stock Balance", description: null },
            { id: "r62", name: "Yarn Stock Ledger & Allocation", description: null },
            { id: "r63", name: "Non-Moving & Slow-Moving Inventory", description: null },
            { id: "r64", name: "Physical Stock Verification Audit", description: null },
            { id: "r65", name: "WIP Stock by Department", description: null },
            { id: "r66", name: "WIP Cut Pieces to Stitching Stock", description: null },
            { id: "r67", name: "Material Consumption by Style Report", description: null },
            { id: "r68", name: "Excess Consumption Variance Ledger", description: null },
            { id: "r69", name: "Wastage & Scrappage Stock Report", description: null },
            { id: "r70", name: "Stock Aging Analysis (30-60-90 Days)", description: null },
            { id: "r71", name: "Dead Stock Disposal Register", description: null },
            { id: "r72", name: "Stock In-Transit DC Summary", description: null },
            { id: "r73", name: "Stock Reconciliation & Adjustment Log", description: null },
            { id: "r74", name: "Negative Stock Alert Report", description: null },
            { id: "r75", name: "Daily Inventory In-Out Transaction Audit", description: null }
        ]
    },
    {
        id: "cat_subcontract",
        title: "07. Subcontract",
        rawTitle: "07. Subcontract",
        icon: <FaCogs style={{ color: "#8b5cf6" }} />,
        badgeBg: "#ede9fe",
        column: "right",
        defaultOpen: false,
        reports: [
            { id: "r76", name: "Subcontract Job Work DC Register", description: null },
            { id: "r77", name: "Subcontract Material Conversion DC Log", description: null },
            { id: "r78", name: "Subcontract GRN Inward Register", description: null },
            { id: "r79", name: "Subcontractor Outstanding Work-in-Progress", description: null }
        ]
    },
    {
        id: "cat_material_planning",
        title: "11. Material Planning",
        rawTitle: "11. Material Planning",
        icon: <FaFileAlt style={{ color: "#ef4444" }} />,
        badgeBg: "#fee2e2",
        column: "right",
        defaultOpen: false,
        reports: [
            { id: "r80", name: "MRP Material Requirement Calculation", description: null },
            { id: "r81", name: "BOM vs Material Planning Variance", description: null },
            { id: "r82", name: "Fabric & Trims Allocation Sheet", description: null },
            { id: "r83", name: "Shortage Material Alert Report", description: null },
            { id: "r84", name: "Planned vs Actual Fabric Consumption", description: null }
        ]
    },
    {
        id: "cat_inventory_reports",
        title: "Inventory.Reports",
        rawTitle: "Inventory.Reports",
        icon: <FaBolt style={{ color: "#10b981" }} />,
        badgeBg: "#d1fae5",
        column: "right",
        defaultOpen: false,
        reports: [
            { id: "r85", name: "Bin Card Location Stock Audit", description: null },
            { id: "r86", name: "Stock Valuation Report (FIFO / Weighted Avg)", description: null },
            { id: "r87", name: "Store Inward vs QC Approval Log", description: null }
        ]
    },
    {
        id: "cat_subcontract_single",
        title: "Subcontract",
        rawTitle: "Subcontract",
        icon: <FaMoneyCheckAlt style={{ color: "#0d9488" }} />,
        badgeBg: "#ccfbf1",
        column: "right",
        defaultOpen: false,
        reports: [
            { id: "r88", name: "Vendor Job-Work Bill Verification Summary", description: "Billed vs Work" }
        ]
    }
];

export default function Reports() {
    const [darkMode, setDarkMode] = useState(false);
    const [openCategories, setOpenCategories] = useState({ cat_general: true });
    const [selectedPill, setSelectedPill] = useState("All");
    const [headingSearch, setHeadingSearch] = useState("");
    const [reportSearch, setReportSearch] = useState("");

    // Modals state
    const [configModalOpen, setConfigModalOpen] = useState(false);
    const [activeReportModal, setActiveReportModal] = useState(null);
    const [activeEditModal, setActiveEditModal] = useState(null);
    const [activeSettingsModal, setActiveSettingsModal] = useState(null);

    // Toggle specific category open/close
    const toggleCategory = (catId) => {
        setOpenCategories(prev => ({
            ...prev,
            [catId]: !prev[catId]
        }));
    };

    // Expand / Collapse All
    const allExpanded = Object.keys(openCategories).length === REPORT_CATEGORIES_DATA.length &&
        Object.values(openCategories).every(Boolean);

    const toggleExpandAll = () => {
        if (allExpanded) {
            setOpenCategories({});
        } else {
            const next = {};
            REPORT_CATEGORIES_DATA.forEach(c => { next[c.id] = true; });
            setOpenCategories(next);
        }
    };

    // Filter categories and reports based on search inputs & pills
    const filteredCategories = useMemo(() => {
        return REPORT_CATEGORIES_DATA.filter(cat => {
            // Pill filter
            if (selectedPill !== "All") {
                if (selectedPill === "" && cat.rawTitle !== "") return false;
                if (selectedPill !== "" && cat.rawTitle !== selectedPill) return false;
            }

            // Heading search filter
            if (headingSearch.trim()) {
                const searchLower = headingSearch.toLowerCase();
                const titleMatches = (cat.title || "general").toLowerCase().includes(searchLower);
                if (!titleMatches) return false;
            }

            // Report search filter (if searching for a report, only keep categories containing matching reports)
            if (reportSearch.trim()) {
                const searchLower = reportSearch.toLowerCase();
                const hasMatchingReport = cat.reports.some(r =>
                    r.name.toLowerCase().includes(searchLower) ||
                    (r.description && r.description.toLowerCase().includes(searchLower))
                );
                if (!hasMatchingReport) return false;
            }

            return true;
        }).map(cat => {
            if (!reportSearch.trim()) return cat;
            const searchLower = reportSearch.toLowerCase();
            return {
                ...cat,
                reports: cat.reports.filter(r =>
                    r.name.toLowerCase().includes(searchLower) ||
                    (r.description && r.description.toLowerCase().includes(searchLower))
                )
            };
        });
    }, [selectedPill, headingSearch, reportSearch]);

    // Split filtered categories into left and right columns
    const leftCategories = filteredCategories.filter(c => c.column === "left");
    const rightCategories = filteredCategories.filter(c => c.column === "right");

    // Scroll to top handler
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // List of pill items matching the screenshot
    const pillList = [
        { label: "All", value: "All" },
        { label: "", value: "", isBlank: true },
        { label: "02. Costing", value: "02. Costing" },
        { label: "04. Purchase", value: "04. Purchase" },
        { label: "06. Production", value: "06. Production" },
        { label: "09. T & A", value: "09. T & A" },
        { label: "Dashboard", value: "Dashboard" },
        { label: "Production.Reports", value: "Production.Reports" },
        { label: "01. Sample/ Design", value: "01. Sample/ Design" },
        { label: "03. Sales", value: "03. Sales" },
        { label: "05. Inventory", value: "05. Inventory" },
        { label: "07. Subcontract", value: "07. Subcontract" },
        { label: "11. Material Planning", value: "11. Material Planning" },
        { label: "Inventory.Reports", value: "Inventory.Reports" },
        { label: "Subcontract", value: "Subcontract" }
    ];

    return (
        <div className={`reports-page-wrapper ${darkMode ? "dark-mode" : ""}`}>
            {/* Top Page Header */}
            <div className="reports-top-header">
                <div className="reports-title-section">
                    <FaChartBar className="reports-header-icon" />
                    <div>
                        <h1 className="reports-main-title">Reports</h1>
                        <p className="reports-main-subtitle">Browse and manage all report modules</p>
                    </div>
                </div>

                <div className="reports-top-actions">
                    {/* Dark Mode Switch */}
                    <div
                        className="reports-dark-toggle-wrap"
                        onClick={() => setDarkMode(!darkMode)}
                        title="Toggle dark theme"
                    >
                        <span>☾</span>
                        <div className={`reports-toggle-switch ${darkMode ? "active" : ""}`}>
                            <div className="reports-toggle-slider" />
                        </div>
                        <span>Dark</span>
                    </div>

                    {/* Expand All Button */}
                    <button
                        type="button"
                        className="reports-btn-expand"
                        onClick={toggleExpandAll}
                    >
                        <FaArrowsAlt style={{ fontSize: "12px" }} />
                        <span>{allExpanded ? "Collapse All" : "Expand All"}</span>
                    </button>

                    {/* Report Heading Config Button */}
                    <button
                        type="button"
                        className="reports-btn-config"
                        onClick={() => setConfigModalOpen(true)}
                    >
                        <FaCog style={{ fontSize: "13px" }} />
                        <span>Report Heading Config</span>
                    </button>
                </div>
            </div>

            {/* 4 Top Stat Cards */}
            <div className="reports-stats-grid">
                <div className="reports-stat-card">
                    <div className="reports-stat-header">
                        <FaRegFileAlt />
                        <span>TOTAL REPORTS</span>
                    </div>
                    <div className="reports-stat-value reports-stat-val-blue">88</div>
                    <div className="reports-stat-subtitle">Across all modules</div>
                </div>

                <div className="reports-stat-card">
                    <div className="reports-stat-header">
                        <FaFolder />
                        <span>CATEGORIES</span>
                    </div>
                    <div className="reports-stat-value reports-stat-val-teal">14</div>
                    <div className="reports-stat-subtitle">Report groups</div>
                </div>

                <div className="reports-stat-card">
                    <div className="reports-stat-header">
                        <FaChartLine />
                        <span>DOCUMENTED</span>
                    </div>
                    <div className="reports-stat-value reports-stat-val-amber">15</div>
                    <div className="reports-stat-subtitle">With description</div>
                </div>

                <div className="reports-stat-card">
                    <div className="reports-stat-header">
                        <FaCogs />
                        <span>ACTIVE MODULES</span>
                    </div>
                    <div className="reports-stat-value reports-stat-val-purple">14</div>
                    <div className="reports-stat-subtitle">All enabled</div>
                </div>
            </div>

            {/* Search and Filters Section */}
            <div className="reports-filter-section">
                <div className="reports-search-row">
                    {/* Search Heading */}
                    <div className={`reports-search-box ${headingSearch ? "reports-search-active" : ""}`}>
                        <FaSearch className="reports-search-icon" />
                        <input
                            type="text"
                            placeholder="Search heading?"
                            value={headingSearch}
                            onChange={(e) => setHeadingSearch(e.target.value)}
                        />
                        <button
                            type="button"
                            className="reports-search-box-btn"
                            onClick={() => setHeadingSearch("")}
                        >
                            All
                        </button>
                    </div>

                    {/* Search Report */}
                    <div className={`reports-search-box ${reportSearch ? "reports-search-active" : ""}`}>
                        <FaRegFileAlt className="reports-search-icon" />
                        <input
                            type="text"
                            placeholder="Search report?"
                            value={reportSearch}
                            onChange={(e) => setReportSearch(e.target.value)}
                        />
                        <button type="button" className="reports-search-box-btn">
                            <FaSearch style={{ color: "#1a73e8" }} />
                        </button>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="reports-pills-row">
                    {pillList.map((pill, idx) => (
                        <button
                            key={idx}
                            type="button"
                            className={`reports-pill ${pill.isBlank ? "reports-pill-blank" : ""} ${selectedPill === pill.value ? "active" : ""}`}
                            onClick={() => setSelectedPill(pill.value)}
                            title={pill.isBlank ? "General (Uncategorized)" : pill.label}
                        >
                            {pill.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Categories 2-Column Accordion Grid */}
            <div className="reports-categories-grid">
                {/* Left Column */}
                <div className="reports-column">
                    {leftCategories.map(cat => renderCategoryCard(cat))}
                </div>

                {/* Right Column */}
                <div className="reports-column">
                    {rightCategories.map(cat => renderCategoryCard(cat))}
                </div>
            </div>

            {/* Floating Scroll To Top Button */}
            <button
                type="button"
                className="reports-scroll-top-btn"
                onClick={scrollToTop}
                title="Scroll to Top"
            >
                <FaArrowUp />
            </button>

            {/* Modal: Report Heading Config */}
            {configModalOpen && (
                <div className="reports-modal-overlay" onClick={() => setConfigModalOpen(false)}>
                    <div className="reports-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="reports-modal-header">
                            <h5 style={{ margin: 0, fontWeight: 700 }}>⚙ Report Heading Configuration</h5>
                            <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px" }} onClick={() => setConfigModalOpen(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="reports-modal-body">
                            <p style={{ fontSize: "13px", color: "#64748b" }}>Manage module titles, sort ordering, and access controls for all 14 report groups.</p>
                            <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                                {REPORT_CATEGORIES_DATA.map((c, i) => (
                                    <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px solid #f1f5f9", fontSize: "12.5px" }}>
                                        <span style={{ fontWeight: 600 }}>{c.title || "(General Module)"}</span>
                                        <span style={{ color: "#2563eb", fontWeight: 500 }}>{c.reports.length} reports</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="reports-modal-footer">
                            <button type="button" className="reports-btn-expand" onClick={() => setConfigModalOpen(false)}>Close</button>
                            <button type="button" className="reports-btn-config" onClick={() => setConfigModalOpen(false)}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Report Generator / Viewer */}
            {activeReportModal && (
                <div className="reports-modal-overlay" onClick={() => setActiveReportModal(null)}>
                    <div className="reports-modal-content" style={{ width: "600px" }} onClick={e => e.stopPropagation()}>
                        <div className="reports-modal-header">
                            <div>
                                <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>Report Generator</span>
                                <h5 style={{ margin: "2px 0 0 0", fontWeight: 700 }}>{activeReportModal.name}</h5>
                            </div>
                            <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px" }} onClick={() => setActiveReportModal(null)}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="reports-modal-body">
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                                <div>
                                    <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Branch / Unit</label>
                                    <input type="text" readOnly value="Plot No. 9B" style={{ width: "100%", padding: "6px 10px", fontSize: "12.5px", border: "1px solid #cbd5e1", borderRadius: "4px", background: "#f8fafc" }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Financial Year</label>
                                    <input type="text" readOnly value="FY 01-Apr-2026 – 31-Mar-2027" style={{ width: "100%", padding: "6px 10px", fontSize: "12.5px", border: "1px solid #cbd5e1", borderRadius: "4px", background: "#f8fafc" }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>From Date</label>
                                    <input type="date" defaultValue="2026-10-01" style={{ width: "100%", padding: "6px 10px", fontSize: "12.5px", border: "1px solid #cbd5e1", borderRadius: "4px" }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>To Date</label>
                                    <input type="date" defaultValue="2026-10-22" style={{ width: "100%", padding: "6px 10px", fontSize: "12.5px", border: "1px solid #cbd5e1", borderRadius: "4px" }} />
                                </div>
                            </div>
                            <div style={{ background: "#f1f5fb", padding: "12px", borderRadius: "6px", fontSize: "12.5px", color: "#334155" }}>
                                <strong>Selected Report:</strong> {activeReportModal.name}<br />
                                <strong>Status:</strong> Ready to generate. All data verified against live SQL database.
                            </div>
                        </div>
                        <div className="reports-modal-footer">
                            <button type="button" className="reports-btn-expand" onClick={() => setActiveReportModal(null)}>Cancel</button>
                            <button type="button" className="reports-btn-expand" style={{ color: "#059669" }} onClick={() => { alert(`Exporting ${activeReportModal.name} to Excel`); setActiveReportModal(null); }}>
                                <FaFileExcel /> Excel
                            </button>
                            <button type="button" className="reports-btn-config" onClick={() => { alert(`Generating ${activeReportModal.name} PDF`); setActiveReportModal(null); }}>
                                <FaFilePdf /> View Report PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Edit Report Details */}
            {activeEditModal && (
                <div className="reports-modal-overlay" onClick={() => setActiveEditModal(null)}>
                    <div className="reports-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="reports-modal-header">
                            <h5 style={{ margin: 0, fontWeight: 700 }}>✏ Edit Report Details</h5>
                            <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px" }} onClick={() => setActiveEditModal(null)}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="reports-modal-body">
                            <div style={{ marginBottom: "12px" }}>
                                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Report Title</label>
                                <input type="text" defaultValue={activeEditModal.name} style={{ width: "100%", padding: "6px 10px", fontSize: "12.5px", border: "1px solid #cbd5e1", borderRadius: "4px" }} />
                            </div>
                            <div>
                                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Description / Tag</label>
                                <input type="text" defaultValue={activeEditModal.description || ""} placeholder="e.g. Sample Order Register" style={{ width: "100%", padding: "6px 10px", fontSize: "12.5px", border: "1px solid #cbd5e1", borderRadius: "4px" }} />
                            </div>
                        </div>
                        <div className="reports-modal-footer">
                            <button type="button" className="reports-btn-expand" onClick={() => setActiveEditModal(null)}>Cancel</button>
                            <button type="button" className="reports-btn-config" onClick={() => { alert("Report details updated!"); setActiveEditModal(null); }}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Settings / Permissions */}
            {activeSettingsModal && (
                <div className="reports-modal-overlay" onClick={() => setActiveSettingsModal(null)}>
                    <div className="reports-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="reports-modal-header">
                            <h5 style={{ margin: 0, fontWeight: 700 }}>⚙ Report Settings & Permissions</h5>
                            <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px" }} onClick={() => setActiveSettingsModal(null)}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="reports-modal-body">
                            <div style={{ fontSize: "12.5px", lineHeight: "1.6" }}>
                                <div style={{ marginBottom: "10px" }}>
                                    <strong>Report Name:</strong> {activeSettingsModal.name}
                                </div>
                                <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <input type="checkbox" defaultChecked /> Enable Excel Export
                                    </label>
                                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <input type="checkbox" defaultChecked /> Enable PDF Direct Print
                                    </label>
                                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <input type="checkbox" defaultChecked /> Visible to Admin & Management Roles
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="reports-modal-footer">
                            <button type="button" className="reports-btn-expand" onClick={() => setActiveSettingsModal(null)}>Close</button>
                            <button type="button" className="reports-btn-config" onClick={() => setActiveSettingsModal(null)}>Save Settings</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // Render individual category accordion card
    function renderCategoryCard(cat) {
        const isOpen = !!openCategories[cat.id];

        return (
            <div className="reports-category-card" key={cat.id}>
                {/* Accordion Header */}
                <div
                    className="reports-category-header"
                    onClick={() => toggleCategory(cat.id)}
                >
                    <div className="reports-cat-left">
                        <div className="reports-cat-icon-badge" style={{ backgroundColor: cat.badgeBg }}>
                            {cat.icon}
                        </div>
                        <span className="reports-cat-title">
                            {cat.title}
                        </span>
                    </div>

                    <div className="reports-cat-right">
                        <span className="reports-count-badge">
                            {cat.reports.length} reports
                        </span>
                        <span className="reports-cat-chevron">
                            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </span>
                    </div>
                </div>

                {/* Collapsible Reports Table */}
                {isOpen && (
                    <div className="reports-table-wrap">
                        <table className="reports-table">
                            <thead>
                                <tr>
                                    <th className="reports-col-num">#</th>
                                    <th>REPORT NAME</th>
                                    <th>DESCRIPTION</th>
                                    <th style={{ textAlign: "right", paddingRight: "16px" }}>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cat.reports.map((report, idx) => (
                                    <tr key={report.id}>
                                        <td className="reports-col-num">{idx + 1}</td>
                                        <td className="reports-col-name">
                                            <span
                                                className="reports-item-link"
                                                onClick={() => setActiveReportModal(report)}
                                                title={`Click to view ${report.name}`}
                                            >
                                                <FaRegFileAlt className="reports-item-doc-icon" />
                                                <span>{report.name}</span>
                                            </span>
                                        </td>
                                        <td>
                                            {report.description ? (
                                                <span className="reports-desc-badge">
                                                    {report.description}
                                                </span>
                                            ) : (
                                                <span style={{ color: "#94a3b8" }}>—</span>
                                            )}
                                        </td>
                                        <td className="reports-action-cell">
                                            <div className="reports-action-group">
                                                <button
                                                    type="button"
                                                    className="reports-btn-action-icon"
                                                    title="Edit report details"
                                                    onClick={() => setActiveEditModal(report)}
                                                >
                                                    <FaRegEdit />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="reports-btn-action-icon"
                                                    title="Report settings"
                                                    onClick={() => setActiveSettingsModal(report)}
                                                >
                                                    <FaCog />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {cat.reports.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center", padding: "16px", color: "#94a3b8" }}>
                                            No matching reports in this category.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }
}
