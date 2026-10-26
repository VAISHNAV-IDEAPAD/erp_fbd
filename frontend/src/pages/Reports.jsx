import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaChartBar,
    FaRegFileAlt,
    FaSearch,
    FaCog,
    FaArrowsAlt,
    FaRegEdit,
    FaTimes,
    FaFilePdf,
    FaFileExcel,
    FaChevronDown,
    FaChevronUp,
    FaArrowUp,
    FaExternalLinkAlt,
    FaPrint,
    FaCopy,
    FaCheckCircle,
    FaUndo,
    FaSyncAlt,
    FaFolder,
    FaCogs,
    FaChartLine
} from "react-icons/fa";
import {
    INITIAL_REPORT_CATEGORIES_DATA,
    getReportIcon,
    generateLiveReportData,
    exportReportToCSV,
    copyReportToClipboard,
    printReportDocument
} from "./reports/reportsDataGenerator";
import "../styles/reports.css";

const STORAGE_KEY_CATEGORIES = "tpcs_report_headings_config";
const STORAGE_KEY_CUSTOM_DATA = "tpcs_reports_custom_data";
const STORAGE_KEY_SETTINGS = "tpcs_reports_settings";

export default function Reports() {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [openCategories, setOpenCategories] = useState({ cat_general: true });
    const [selectedPill, setSelectedPill] = useState("All");
    const [headingSearch, setHeadingSearch] = useState("");
    const [reportSearch, setReportSearch] = useState("");

    // Custom Category Configuration & Reports Data
    const [categoriesData, setCategoriesData] = useState(() => {
        try {
            const savedCats = localStorage.getItem(STORAGE_KEY_CATEGORIES);
            const savedReports = localStorage.getItem(STORAGE_KEY_CUSTOM_DATA);

            let base = INITIAL_REPORT_CATEGORIES_DATA;

            if (savedCats) {
                const parsedCats = JSON.parse(savedCats);
                base = base.map(c => {
                    const match = parsedCats.find(pc => pc.id === c.id);
                    return match ? { ...c, ...match } : c;
                });
            }

            if (savedReports) {
                const parsedReports = JSON.parse(savedReports);
                base = base.map(cat => ({
                    ...cat,
                    reports: cat.reports.map(r => {
                        const customR = parsedReports[r.id];
                        return customR ? { ...r, ...customR } : r;
                    })
                }));
            }

            return base;
        } catch (e) {
            console.error("Error loading saved reports config:", e);
            return INITIAL_REPORT_CATEGORIES_DATA;
        }
    });

    // Modals state
    const [configModalOpen, setConfigModalOpen] = useState(false);
    const [activeReportModal, setActiveReportModal] = useState(null);
    const [activeEditModal, setActiveEditModal] = useState(null);
    const [activeSettingsModal, setActiveSettingsModal] = useState(null);

    // Edit Modal form fields
    const [editFormName, setEditFormName] = useState("");
    const [editFormDesc, setEditFormDesc] = useState("");

    // Settings Modal form fields
    const [settingsExcel, setSettingsExcel] = useState(true);
    const [settingsPdf, setSettingsPdf] = useState(true);
    const [settingsAdmin, setSettingsAdmin] = useState(true);

    // Config Modal form categories working copy
    const [configCategoriesDraft, setConfigCategoriesDraft] = useState([]);

    // Live Report Generator Parameters inside Modal
    const [reportBranch, setReportBranch] = useState("Plot No. 9B");
    const [reportFY, setReportFY] = useState("FY 01-Apr-2026 – 31-Mar-2027");
    const [reportFromDate, setReportFromDate] = useState("2026-10-01");
    const [reportToDate, setReportToDate] = useState("2026-10-26");
    const [activeDatePreset, setActiveDatePreset] = useState("Month");
    const [modalTableSearch, setModalTableSearch] = useState("");

    // Toast notification state
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (message, type = "success") => {
        setToastMessage({ message, type });
        setTimeout(() => setToastMessage(null), 3200);
    };

    // Calculate Summary Metrics
    const metrics = useMemo(() => {
        let totalReports = 0;
        let documentedCount = 0;
        let activeModules = 0;

        categoriesData.forEach(cat => {
            if (cat.enabled !== false) {
                activeModules++;
                totalReports += cat.reports.length;
                cat.reports.forEach(r => {
                    if (r.description && r.description.trim() !== "") {
                        documentedCount++;
                    }
                });
            }
        });

        return {
            totalReports,
            categoriesCount: categoriesData.length,
            documentedCount,
            activeModules
        };
    }, [categoriesData]);

    // Handle Date Presets for Report Generator
    const applyDatePreset = (preset) => {
        setActiveDatePreset(preset);
        if (preset === "Today") {
            setReportFromDate("2026-10-26");
            setReportToDate("2026-10-26");
        } else if (preset === "7D") {
            setReportFromDate("2026-10-19");
            setReportToDate("2026-10-26");
        } else if (preset === "Month") {
            setReportFromDate("2026-10-01");
            setReportToDate("2026-10-26");
        } else if (preset === "FY") {
            setReportFromDate("2026-04-01");
            setReportToDate("2027-03-31");
        }
    };

    // Toggle specific category accordion
    const toggleCategory = (catId) => {
        setOpenCategories(prev => ({
            ...prev,
            [catId]: !prev[catId]
        }));
    };

    // Expand / Collapse All
    const allExpanded = Object.keys(openCategories).length === categoriesData.length &&
        Object.values(openCategories).every(Boolean);

    const toggleExpandAll = () => {
        if (allExpanded) {
            setOpenCategories({});
        } else {
            const next = {};
            categoriesData.forEach(c => { next[c.id] = true; });
            setOpenCategories(next);
        }
    };

    // Filter categories and reports based on search inputs & pills
    const filteredCategories = useMemo(() => {
        return categoriesData.filter(cat => {
            if (cat.enabled === false) return false;

            // Pill filter
            if (selectedPill !== "All") {
                if (selectedPill === "" && cat.rawTitle !== "") return false;
                if (selectedPill !== "" && cat.rawTitle !== selectedPill) return false;
            }

            // Heading search filter
            if (headingSearch.trim()) {
                const searchLower = headingSearch.toLowerCase();
                const titleMatches = (cat.title || "general").toLowerCase().includes(searchLower) ||
                    (cat.displayTitle || "").toLowerCase().includes(searchLower);
                if (!titleMatches) return false;
            }

            // Report search filter
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
    }, [categoriesData, selectedPill, headingSearch, reportSearch]);

    // Split filtered categories into left and right columns
    const leftCategories = filteredCategories.filter(c => c.column === "left");
    const rightCategories = filteredCategories.filter(c => c.column === "right");

    // Scroll to top handler
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // List of pill items matching the reference
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

    // Open Edit Modal
    const handleOpenEdit = (report) => {
        setActiveEditModal(report);
        setEditFormName(report.name || "");
        setEditFormDesc(report.description || "");
    };

    // Save Edit Modal
    const handleSaveEdit = () => {
        if (!activeEditModal) return;
        const reportId = activeEditModal.id;

        setCategoriesData(prev => {
            const next = prev.map(cat => ({
                ...cat,
                reports: cat.reports.map(r => {
                    if (r.id === reportId) {
                        return {
                            ...r,
                            name: editFormName.trim() || r.name,
                            description: editFormDesc.trim() || null
                        };
                    }
                    return r;
                })
            }));

            // Persist to localStorage
            try {
                const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_DATA) || "{}");
                existing[reportId] = {
                    name: editFormName.trim() || activeEditModal.name,
                    description: editFormDesc.trim() || null
                };
                localStorage.setItem(STORAGE_KEY_CUSTOM_DATA, JSON.stringify(existing));
            } catch (e) {
                console.error("Storage error:", e);
            }

            return next;
        });

        showToast(`Report '${editFormName}' updated successfully!`);
        setActiveEditModal(null);
    };

    // Open Settings Modal
    const handleOpenSettings = (report) => {
        setActiveSettingsModal(report);
        try {
            const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS) || "{}");
            const conf = existing[report.id] || {};
            setSettingsExcel(conf.excel !== false);
            setSettingsPdf(conf.pdf !== false);
            setSettingsAdmin(conf.admin !== false);
        } catch (e) {
            setSettingsExcel(true);
            setSettingsPdf(true);
            setSettingsAdmin(true);
        }
    };

    // Save Settings Modal
    const handleSaveSettings = () => {
        if (!activeSettingsModal) return;
        try {
            const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS) || "{}");
            existing[activeSettingsModal.id] = {
                excel: settingsExcel,
                pdf: settingsPdf,
                admin: settingsAdmin
            };
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(existing));
            showToast(`Permissions & settings saved for '${activeSettingsModal.name}'!`);
        } catch (e) {
            console.error("Settings save error:", e);
        }
        setActiveSettingsModal(null);
    };

    // Open Config Modal
    const handleOpenConfig = () => {
        setConfigCategoriesDraft(categoriesData.map(c => ({
            id: c.id,
            title: c.title,
            displayTitle: c.displayTitle || c.title || "(General Module)",
            enabled: c.enabled !== false
        })));
        setConfigModalOpen(true);
    };

    // Save Config Modal
    const handleSaveConfig = () => {
        setCategoriesData(prev => {
            const next = prev.map(c => {
                const draft = configCategoriesDraft.find(d => d.id === c.id);
                if (draft) {
                    return {
                        ...c,
                        title: draft.title,
                        displayTitle: draft.displayTitle,
                        enabled: draft.enabled
                    };
                }
                return c;
            });

            try {
                localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(configCategoriesDraft));
            } catch (e) {
                console.error("Category save error:", e);
            }

            return next;
        });

        showToast("Report heading configuration updated and saved!");
        setConfigModalOpen(false);
    };

    // Reset Config to Factory Defaults
    const handleResetConfig = () => {
        try {
            localStorage.removeItem(STORAGE_KEY_CATEGORIES);
            localStorage.removeItem(STORAGE_KEY_CUSTOM_DATA);
            setCategoriesData(INITIAL_REPORT_CATEGORIES_DATA);
            showToast("Restored all report titles and settings to default!");
            setConfigModalOpen(false);
        } catch (e) {
            console.error("Reset error:", e);
        }
    };

    // Generate live data for active report modal
    const liveReportData = useMemo(() => {
        if (!activeReportModal) return null;
        return generateLiveReportData(activeReportModal, {
            branch: reportBranch,
            fy: reportFY,
            fromDate: reportFromDate,
            toDate: reportToDate
        });
    }, [activeReportModal, reportBranch, reportFY, reportFromDate, reportToDate]);

    // Filter table rows inside modal by search
    const filteredModalRows = useMemo(() => {
        if (!liveReportData || !liveReportData.rows) return [];
        if (!modalTableSearch.trim()) return liveReportData.rows;
        const q = modalTableSearch.toLowerCase();
        return liveReportData.rows.filter(row =>
            Object.values(row).some(val => String(val).toLowerCase().includes(q))
        );
    }, [liveReportData, modalTableSearch]);

    // Handle CSV Export
    const handleExportCSV = () => {
        if (!activeReportModal || !liveReportData) return;
        const success = exportReportToCSV(activeReportModal.name, liveReportData.columns, filteredModalRows);
        if (success) {
            showToast(`Exported ${activeReportModal.name} to Excel (.csv)!`);
        } else {
            showToast("Failed to generate CSV file.", "error");
        }
    };

    // Handle Copy Table
    const handleCopyTable = async () => {
        if (!liveReportData) return;
        const success = await copyReportToClipboard(liveReportData.columns, filteredModalRows);
        if (success) {
            showToast("Report table copied to clipboard! Ready to paste into Excel.");
        } else {
            showToast("Clipboard copy failed.", "error");
        }
    };

    // Handle Print PDF
    const handlePrintPDF = () => {
        if (!activeReportModal || !liveReportData) return;
        printReportDocument(activeReportModal, {
            branch: reportBranch,
            fy: reportFY,
            fromDate: reportFromDate,
            toDate: reportToDate
        }, liveReportData.columns, filteredModalRows, liveReportData.summary);
    };

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
                        onClick={handleOpenConfig}
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
                    <div className="reports-stat-value reports-stat-val-blue">{metrics.totalReports}</div>
                    <div className="reports-stat-subtitle">Across all modules</div>
                </div>

                <div className="reports-stat-card">
                    <div className="reports-stat-header">
                        <FaFolder />
                        <span>CATEGORIES</span>
                    </div>
                    <div className="reports-stat-value reports-stat-val-teal">{metrics.categoriesCount}</div>
                    <div className="reports-stat-subtitle">Report groups</div>
                </div>

                <div className="reports-stat-card">
                    <div className="reports-stat-header">
                        <FaChartLine />
                        <span>DOCUMENTED</span>
                    </div>
                    <div className="reports-stat-value reports-stat-val-amber">{metrics.documentedCount}</div>
                    <div className="reports-stat-subtitle">With description</div>
                </div>

                <div className="reports-stat-card">
                    <div className="reports-stat-header">
                        <FaCogs />
                        <span>ACTIVE MODULES</span>
                    </div>
                    <div className="reports-stat-value reports-stat-val-purple">{metrics.activeModules}</div>
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
                        {reportSearch ? (
                            <button
                                type="button"
                                className="reports-search-box-btn"
                                onClick={() => setReportSearch("")}
                                title="Clear report search"
                            >
                                <FaTimes style={{ color: "#94a3b8" }} />
                            </button>
                        ) : (
                            <button type="button" className="reports-search-box-btn">
                                <FaSearch style={{ color: "#1a73e8" }} />
                            </button>
                        )}
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

            {/* Toast Notification */}
            {toastMessage && (
                <div className={`reports-toast ${toastMessage.type === "error" ? "reports-toast-error" : "reports-toast-success"}`}>
                    <FaCheckCircle style={{ color: toastMessage.type === "error" ? "#ef4444" : "#10b981" }} />
                    <span>{toastMessage.message}</span>
                </div>
            )}

            {/* ======================================================== */}
            {/* MODAL 1: REPORT HEADING CONFIG */}
            {/* ======================================================== */}
            {configModalOpen && (
                <div className="reports-modal-overlay" onClick={() => setConfigModalOpen(false)}>
                    <div className="reports-modal-content" style={{ width: "620px" }} onClick={e => e.stopPropagation()}>
                        <div className="reports-modal-header">
                            <h5 style={{ margin: 0, fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                                <FaCog style={{ color: "#2563eb" }} /> Report Heading Configuration
                            </h5>
                            <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px" }} onClick={() => setConfigModalOpen(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="reports-modal-body">
                            <p style={{ fontSize: "12.5px", color: "#64748b", marginBottom: "12px" }}>
                                Customize category heading titles and toggle active visibility across all 14 report groups.
                            </p>
                            <div style={{ maxHeight: "360px", overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                                {configCategoriesDraft.map((c, i) => (
                                    <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderBottom: "1px solid #f1f5f9", fontSize: "12.5px" }}>
                                        <input
                                            type="checkbox"
                                            checked={c.enabled !== false}
                                            onChange={(e) => {
                                                const nextDraft = [...configCategoriesDraft];
                                                nextDraft[i].enabled = e.target.checked;
                                                setConfigCategoriesDraft(nextDraft);
                                            }}
                                            title="Toggle category active"
                                        />
                                        <div style={{ flex: 1 }}>
                                            <input
                                                type="text"
                                                value={c.displayTitle || c.title || ""}
                                                placeholder={c.title || "(General Module)"}
                                                onChange={(e) => {
                                                    const nextDraft = [...configCategoriesDraft];
                                                    nextDraft[i].displayTitle = e.target.value;
                                                    setConfigCategoriesDraft(nextDraft);
                                                }}
                                                style={{ width: "100%", padding: "5px 8px", fontSize: "12.5px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                                            />
                                        </div>
                                        <span style={{ color: "#2563eb", fontWeight: 600, fontSize: "11.5px", minWidth: "60px", textAlign: "right" }}>
                                            {categoriesData.find(cat => cat.id === c.id)?.reports.length || 0} reps
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="reports-modal-footer" style={{ display: "flex", justifyContent: "space-between" }}>
                            <button
                                type="button"
                                className="reports-btn-expand"
                                style={{ color: "#dc2626", border: "1px solid #fca5a5" }}
                                onClick={handleResetConfig}
                            >
                                <FaUndo style={{ fontSize: "11px" }} /> Reset to Defaults
                            </button>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button type="button" className="reports-btn-expand" onClick={() => setConfigModalOpen(false)}>Cancel</button>
                                <button type="button" className="reports-btn-config" onClick={handleSaveConfig}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* MODAL 2: INTERACTIVE LIVE REPORT GENERATOR & VIEWER */}
            {/* ======================================================== */}
            {activeReportModal && (
                <div className="reports-modal-overlay" onClick={() => setActiveReportModal(null)}>
                    <div className="reports-modal-content reports-modal-lg" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="reports-modal-header">
                            <div>
                                <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>
                                    V-CONNECT INC. — MIS REPORT WORKBENCH
                                </span>
                                <h4 style={{ margin: "2px 0 0 0", fontWeight: 800, color: "#1e40af", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <FaRegFileAlt style={{ color: "#3b82f6" }} />
                                    {activeReportModal.name}
                                </h4>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {activeReportModal.path && (
                                    <button
                                        type="button"
                                        className="reports-btn-expand"
                                        style={{ color: "#2563eb", borderColor: "#bfdbfe", background: "#eff6ff", fontSize: "12px", fontWeight: 600 }}
                                        onClick={() => {
                                            setActiveReportModal(null);
                                            navigate(activeReportModal.path);
                                        }}
                                        title="Navigate to dedicated full screen module"
                                    >
                                        <FaExternalLinkAlt /> Open Full Module
                                    </button>
                                )}
                                <button
                                    type="button"
                                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#64748b" }}
                                    onClick={() => setActiveReportModal(null)}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="reports-modal-body">
                            {/* Controls Card */}
                            <div className="reports-preview-controls-card">
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "12px" }}>
                                    <div>
                                        <label style={{ fontSize: "11.5px", fontWeight: 700, display: "block", marginBottom: "4px", color: "#475569" }}>
                                            BRANCH / MANUFACTURING UNIT
                                        </label>
                                        <select
                                            value={reportBranch}
                                            onChange={(e) => setReportBranch(e.target.value)}
                                            style={{ width: "100%", padding: "6px 10px", fontSize: "12.5px", border: "1px solid #cbd5e1", borderRadius: "5px", background: "#ffffff" }}
                                        >
                                            <option value="Plot No. 9B">Plot No. 9B (Garment Unit)</option>
                                            <option value="Plot No. 12B">Plot No. 12B (Weaving & Knitting)</option>
                                            <option value="Central Warehouse">Central Logistics Warehouse</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: "11.5px", fontWeight: 700, display: "block", marginBottom: "4px", color: "#475569" }}>
                                            FINANCIAL YEAR
                                        </label>
                                        <select
                                            value={reportFY}
                                            onChange={(e) => setReportFY(e.target.value)}
                                            style={{ width: "100%", padding: "6px 10px", fontSize: "12.5px", border: "1px solid #cbd5e1", borderRadius: "5px", background: "#ffffff" }}
                                        >
                                            <option value="FY 01-Apr-2026 – 31-Mar-2027">FY 01-Apr-2026 – 31-Mar-2027</option>
                                            <option value="FY 01-Apr-2025 – 31-Mar-2026">FY 01-Apr-2025 – 31-Mar-2026</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: "11.5px", fontWeight: 700, display: "block", marginBottom: "4px", color: "#475569" }}>
                                            FROM DATE
                                        </label>
                                        <input
                                            type="date"
                                            value={reportFromDate}
                                            onChange={(e) => { setReportFromDate(e.target.value); setActiveDatePreset("Custom"); }}
                                            style={{ width: "100%", padding: "5px 10px", fontSize: "12.5px", border: "1px solid #cbd5e1", borderRadius: "5px" }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ fontSize: "11.5px", fontWeight: 700, display: "block", marginBottom: "4px", color: "#475569" }}>
                                            TO DATE
                                        </label>
                                        <input
                                            type="date"
                                            value={reportToDate}
                                            onChange={(e) => { setReportToDate(e.target.value); setActiveDatePreset("Custom"); }}
                                            style={{ width: "100%", padding: "5px 10px", fontSize: "12.5px", border: "1px solid #cbd5e1", borderRadius: "5px" }}
                                        />
                                    </div>
                                </div>

                                {/* Preset Filters & Table Search */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#64748b" }}>Quick Range:</span>
                                        {["Today", "7D", "Month", "FY"].map(preset => (
                                            <button
                                                key={preset}
                                                type="button"
                                                className={`reports-preset-btn ${activeDatePreset === preset ? "active" : ""}`}
                                                onClick={() => applyDatePreset(preset)}
                                            >
                                                {preset}
                                            </button>
                                        ))}
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <div style={{ position: "relative", width: "220px" }}>
                                            <input
                                                type="text"
                                                placeholder="Filter rows in report..."
                                                value={modalTableSearch}
                                                onChange={(e) => setModalTableSearch(e.target.value)}
                                                style={{ width: "100%", padding: "5px 28px 5px 8px", fontSize: "12px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                                            />
                                            {modalTableSearch ? (
                                                <FaTimes
                                                    style={{ position: "absolute", right: "8px", top: "8px", color: "#94a3b8", cursor: "pointer", fontSize: "11px" }}
                                                    onClick={() => setModalTableSearch("")}
                                                />
                                            ) : (
                                                <FaSearch style={{ position: "absolute", right: "8px", top: "8px", color: "#94a3b8", fontSize: "11px" }} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Summary Metrics Banner */}
                            {liveReportData?.summary && (
                                <div className="reports-preview-stats">
                                    <div className="reports-stat-pill">
                                        <span className="reports-stat-pill-label">Total Records:</span>
                                        <span style={{ color: "#1e40af" }}>{filteredModalRows.length} rows</span>
                                    </div>
                                    <div className="reports-stat-pill">
                                        <span className="reports-stat-pill-label">Total Volume:</span>
                                        <span style={{ color: "#0f766e" }}>{liveReportData.summary.totalQty}</span>
                                    </div>
                                    <div className="reports-stat-pill">
                                        <span className="reports-stat-pill-label">Valuation:</span>
                                        <span style={{ color: "#d97706" }}>{liveReportData.summary.totalVal}</span>
                                    </div>
                                    <div className="reports-stat-pill" style={{ marginLeft: "auto" }}>
                                        <span style={{ fontSize: "11px", background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: "12px", fontWeight: 700 }}>
                                            ✓ {liveReportData.summary.badge}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Live Tabular Grid */}
                            <div className="reports-preview-table-wrap">
                                <table className="reports-preview-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "35px", textAlign: "center" }}>#</th>
                                            {liveReportData?.columns.map(col => (
                                                <th key={col}>{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredModalRows.map((row, rIdx) => (
                                            <tr key={rIdx}>
                                                <td style={{ textAlign: "center", color: "#94a3b8", fontWeight: 600 }}>{rIdx + 1}</td>
                                                {liveReportData?.columns.map(col => (
                                                    <td key={col}>
                                                        {col === "Status" ? (
                                                            <span style={{
                                                                display: "inline-block",
                                                                padding: "2px 8px",
                                                                borderRadius: "10px",
                                                                fontSize: "11px",
                                                                fontWeight: 600,
                                                                background: String(row[col]).includes("Delay") || String(row[col]).includes("Over") || String(row[col]).includes("Alert") ? "#fee2e2" :
                                                                    String(row[col]).includes("Comp") || String(row[col]).includes("Paid") || String(row[col]).includes("Suff") || String(row[col]).includes("Achiev") ? "#dcfce7" : "#e0f2fe",
                                                                color: String(row[col]).includes("Delay") || String(row[col]).includes("Over") || String(row[col]).includes("Alert") ? "#991b1b" :
                                                                    String(row[col]).includes("Comp") || String(row[col]).includes("Paid") || String(row[col]).includes("Suff") || String(row[col]).includes("Achiev") ? "#166534" : "#0369a1"
                                                            }}>
                                                                {row[col]}
                                                            </span>
                                                        ) : (
                                                            row[col] !== undefined && row[col] !== null ? row[col] : "—"
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                        {filteredModalRows.length === 0 && (
                                            <tr>
                                                <td colSpan={(liveReportData?.columns.length || 0) + 1} style={{ textAlign: "center", padding: "24px", color: "#94a3b8" }}>
                                                    No matching records found for this filter criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="reports-modal-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                    type="button"
                                    className="reports-btn-expand"
                                    onClick={handleCopyTable}
                                    title="Copy table data to clipboard for Excel"
                                >
                                    <FaCopy /> Copy Data
                                </button>
                            </div>

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    type="button"
                                    className="reports-btn-expand"
                                    onClick={() => setActiveReportModal(null)}
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    className="reports-btn-expand"
                                    style={{ color: "#059669", borderColor: "#a7f3d0", background: "#f0fdf4", fontWeight: 600 }}
                                    onClick={handleExportCSV}
                                    title="Download CSV Spreadsheet with UTF-8 BOM"
                                >
                                    <FaFileExcel /> Export Excel (.CSV)
                                </button>

                                <button
                                    type="button"
                                    className="reports-btn-config"
                                    onClick={handlePrintPDF}
                                    title="Print or Save PDF with Company Letterhead"
                                >
                                    <FaPrint /> Print / Save PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* MODAL 3: EDIT REPORT DETAILS */}
            {/* ======================================================== */}
            {activeEditModal && (
                <div className="reports-modal-overlay" onClick={() => setActiveEditModal(null)}>
                    <div className="reports-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="reports-modal-header">
                            <h5 style={{ margin: 0, fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                                <FaRegEdit style={{ color: "#2563eb" }} /> Edit Report Details
                            </h5>
                            <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px" }} onClick={() => setActiveEditModal(null)}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="reports-modal-body">
                            <div style={{ marginBottom: "14px" }}>
                                <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px", color: "#475569" }}>
                                    REPORT TITLE
                                </label>
                                <input
                                    type="text"
                                    value={editFormName}
                                    onChange={(e) => setEditFormName(e.target.value)}
                                    style={{ width: "100%", padding: "7px 10px", fontSize: "13px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px", color: "#475569" }}>
                                    DESCRIPTION / TAG BADGE
                                </label>
                                <input
                                    type="text"
                                    value={editFormDesc}
                                    onChange={(e) => setEditFormDesc(e.target.value)}
                                    placeholder="e.g. Sample Order Register, Variance Audit, Realtime Ledger"
                                    style={{ width: "100%", padding: "7px 10px", fontSize: "13px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                                />
                                <small style={{ color: "#64748b", display: "block", marginTop: "4px" }}>
                                    Adding a description badge increments the "DOCUMENTED" count metric on the reports dashboard.
                                </small>
                            </div>
                        </div>
                        <div className="reports-modal-footer">
                            <button type="button" className="reports-btn-expand" onClick={() => setActiveEditModal(null)}>Cancel</button>
                            <button type="button" className="reports-btn-config" onClick={handleSaveEdit}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* MODAL 4: SETTINGS & PERMISSIONS */}
            {/* ======================================================== */}
            {activeSettingsModal && (
                <div className="reports-modal-overlay" onClick={() => setActiveSettingsModal(null)}>
                    <div className="reports-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="reports-modal-header">
                            <h5 style={{ margin: 0, fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                                <FaCog style={{ color: "#2563eb" }} /> Report Settings & Permissions
                            </h5>
                            <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px" }} onClick={() => setActiveSettingsModal(null)}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="reports-modal-body">
                            <div style={{ fontSize: "12.5px", lineHeight: "1.6" }}>
                                <div style={{ marginBottom: "14px", padding: "8px 12px", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                                    <strong style={{ color: "#1e40af" }}>Selected Report:</strong> {activeSettingsModal.name}<br />
                                    <span style={{ color: "#64748b", fontSize: "11.5px" }}>Target Route: <code>{activeSettingsModal.path || "/reports"}</code></span>
                                </div>
                                <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                        <input
                                            type="checkbox"
                                            checked={settingsExcel}
                                            onChange={(e) => setSettingsExcel(e.target.checked)}
                                        />
                                        <span>Enable Excel (.CSV) Data Export for Users</span>
                                    </label>
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                        <input
                                            type="checkbox"
                                            checked={settingsPdf}
                                            onChange={(e) => setSettingsPdf(e.target.checked)}
                                        />
                                        <span>Enable Official Letterhead PDF Printing</span>
                                    </label>
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                        <input
                                            type="checkbox"
                                            checked={settingsAdmin}
                                            onChange={(e) => setSettingsAdmin(e.target.checked)}
                                        />
                                        <span>Authorize Merchandising & Store Operators for Live Generation</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="reports-modal-footer">
                            <button type="button" className="reports-btn-expand" onClick={() => setActiveSettingsModal(null)}>Close</button>
                            <button type="button" className="reports-btn-config" onClick={handleSaveSettings}>Save Permissions</button>
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
                            {getReportIcon(cat.iconName, cat.badgeColor)}
                        </div>
                        <span className="reports-cat-title">
                            {cat.displayTitle || cat.title}
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
                                                title={`Click to generate and view ${report.name}`}
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
                                                {/* One-Click Direct Module Launch */}
                                                {report.path && (
                                                    <button
                                                        type="button"
                                                        className="reports-btn-action-launch"
                                                        title={`Open ${report.name} module screen`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(report.path);
                                                        }}
                                                    >
                                                        <FaExternalLinkAlt />
                                                    </button>
                                                )}

                                                {/* Edit Button */}
                                                <button
                                                    type="button"
                                                    className="reports-btn-action-icon"
                                                    title="Edit report details & badge"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenEdit(report);
                                                    }}
                                                >
                                                    <FaRegEdit />
                                                </button>

                                                {/* Settings Button */}
                                                <button
                                                    type="button"
                                                    className="reports-btn-action-icon"
                                                    title="Report settings & permissions"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenSettings(report);
                                                    }}
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
