import React, { useState, useEffect, useCallback, useRef } from "react";
import { Modal, Button, Spinner, Alert, ProgressBar } from "react-bootstrap";
import {
    FaSyncAlt,
    FaFileExcel,
    FaFilePdf,
    FaFilter,
    FaTimes,
    FaSearch,
    FaUpload,
    FaAngleDoubleLeft,
    FaAngleLeft,
    FaAngleRight,
    FaAngleDoubleRight,
    FaBuilding
} from "react-icons/fa";
import requirementToPOService from "../../../services/requirementToPOService";
import "../../../styles/requirementToPO.css";

function parseCSVLine(text) {
    const result = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === '"') {
            if (inQuotes && text[i + 1] === '"') {
                cur += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === "," && !inQuotes) {
            result.push(cur.trim());
            cur = "";
        } else {
            cur += ch;
        }
    }
    result.push(cur.trim());
    return result;
}

export default function RequirementToPO() {
    // -------------------------------------------------------------------------
    // DATA & PAGINATION STATE
    // -------------------------------------------------------------------------
    const [rows, setRows] = useState([]);
    const [totals, setTotals] = useState({
        RequiredQty: 0,
        IndentQty: 0,
        BalanceToIndent: 0,
        ExcessIndent: 0,
        POQty: 0,
        POValue: 0,
        BalanceToPO: 0,
        ExcessPO: 0,
        GRNQty: 0,
        GRNValue: 0,
        BalanceToGRN: 0,
        ExcessGRN: 0,
        ISSQty: 0,
        ISSValue: 0,
        BalanceToISS: 0,
        ExcessISS: 0,
        ExcessISSValue: 0
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 100,
        totalRows: 0,
        totalPages: 1
    });
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    // -------------------------------------------------------------------------
    // FILTER OPTIONS & ACTIVE FILTERS
    // -------------------------------------------------------------------------
    const [filterOptions, setFilterOptions] = useState({
        groups: [],
        customers: [],
        categories: [],
        ioNos: [],
        buyerPOs: [],
        items: [],
        colors: [],
        products: []
    });

    const initialFilters = {
        fromDate: "",
        toDate: "",
        reqFromDate: "",
        reqToDate: "",
        group: "",
        customer: "",
        buyerPo: "",
        product: "",
        prodColor: "",
        ioNo: "",
        item: "",
        color: "",
        itemCategory: "All",
        statusFilter: "",
        search: ""
    };

    const [filters, setFilters] = useState(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState(initialFilters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // -------------------------------------------------------------------------
    // CSV UPLOAD MODAL STATE
    // -------------------------------------------------------------------------
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadMode, setUploadMode] = useState("replace");
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState(null);
    const fileInputRef = useRef(null);

    // -------------------------------------------------------------------------
    // LOAD FILTER OPTIONS
    // -------------------------------------------------------------------------
    const loadFilterOptions = useCallback(async () => {
        try {
            const res = await requirementToPOService.getFilterOptions();
            if (res && res.success && res.data) {
                setFilterOptions(res.data);
            }
        } catch (err) {
            console.error("Failed to load Requirement to PO filter options:", err);
        }
    }, []);

    // -------------------------------------------------------------------------
    // LOAD PAGINATED REQUIREMENTS DATA
    // -------------------------------------------------------------------------
    const loadData = useCallback(
        async (pageOverride, limitOverride, customFilters) => {
            try {
                setLoading(true);
                setErrorMsg(null);
                const active = customFilters || appliedFilters;
                const targetPage = pageOverride ?? pagination.page;
                const targetLimit = limitOverride ?? pagination.limit;

                const res = await requirementToPOService.getRequirements({
                    ...active,
                    page: targetPage,
                    limit: targetLimit
                });

                if (res && res.success) {
                    setRows(res.data || []);
                    if (res.totals) setTotals(res.totals);
                    if (res.pagination) setPagination(res.pagination);
                } else {
                    setErrorMsg(res?.message || "Failed to load Requirement to PO data.");
                }
            } catch (err) {
                console.error("Error fetching Requirement to PO:", err);
                setErrorMsg(err.response?.data?.message || err.message || "Error connecting to server.");
            } finally {
                setLoading(false);
            }
        },
        [appliedFilters, pagination.page, pagination.limit]
    );

    useEffect(() => {
        loadFilterOptions();
    }, [loadFilterOptions]);

    useEffect(() => {
        loadData(1, pagination.limit, appliedFilters);
    }, [appliedFilters]);

    // -------------------------------------------------------------------------
    // FILTER HANDLERS
    // -------------------------------------------------------------------------
    const handleFilterFieldChange = (field, val) => {
        setFilters((prev) => ({ ...prev, [field]: val }));
    };

    const handleQuickFilterChange = (field, val) => {
        const updated = { ...filters, [field]: val };
        setFilters(updated);
        setAppliedFilters(updated);
    };

    const handleApplyFilters = (e) => {
        if (e) e.preventDefault();
        setAppliedFilters({ ...filters });
        setIsFilterOpen(false);
    };

    const handleResetFilters = () => {
        setFilters(initialFilters);
        setAppliedFilters(initialFilters);
        setIsFilterOpen(false);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages || newPage === pagination.page) return;
        loadData(newPage, pagination.limit, appliedFilters);
    };

    const handleLimitChange = (newLimit) => {
        const lim = parseInt(newLimit, 10) || 100;
        loadData(1, lim, appliedFilters);
    };

    // -------------------------------------------------------------------------
    // CSV UPLOAD HANDLER (CHUNKED FOR LARGE 21,000+ ROW FILES)
    // -------------------------------------------------------------------------
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            setUploadProgress(5);
            setUploadStatus({ type: "info", text: `Reading ${file.name}...` });

            const text = await file.text();
            const lines = text.split(/\r?\n/);

            let headerIdx = -1;
            for (let i = 0; i < Math.min(lines.length, 30); i++) {
                if (
                    lines[i].includes("Group,Customer,Buyer Po,Product") ||
                    lines[i].includes("Required Qty,Indent Qty")
                ) {
                    headerIdx = i;
                    break;
                }
            }
            if (headerIdx === -1) headerIdx = 0;

            const parsedRows = [];
            for (let i = headerIdx + 1; i < lines.length; i++) {
                const raw = lines[i].trim();
                if (!raw) continue;
                const cols = parseCSVLine(lines[i]);
                if (cols.length < 15) continue;
                if (cols[0] === "Grand Total" || (!cols[1] && !cols[7] && !cols[8])) continue;
                parsedRows.push(cols);
            }

            if (parsedRows.length === 0) {
                setUploadStatus({
                    type: "danger",
                    text: "No valid Requirement to PO rows found in the selected CSV file."
                });
                setUploading(false);
                return;
            }

            const chunkSize = 2000;
            let totalInserted = 0;

            for (let i = 0; i < parsedRows.length; i += chunkSize) {
                const chunk = parsedRows.slice(i, i + chunkSize);
                const isFirstChunk = i === 0;
                const res = await requirementToPOService.uploadRequirements({
                    rows: chunk,
                    mode: isFirstChunk && uploadMode === "replace" ? "replace" : "append",
                    clearFirst: isFirstChunk && uploadMode === "replace"
                });

                totalInserted += res?.inserted || chunk.length;
                const pct = Math.min(99, Math.round(((i + chunk.length) / parsedRows.length) * 100));
                setUploadProgress(pct);
                setUploadStatus({
                    type: "info",
                    text: `Uploading rows: ${Math.min(i + chunk.length, parsedRows.length).toLocaleString()} / ${parsedRows.length.toLocaleString()}...`
                });
            }

            setUploadProgress(100);
            setUploadStatus({
                type: "success",
                text: `Successfully uploaded ${totalInserted.toLocaleString()} Requirement to PO records!`
            });

            await loadFilterOptions();
            await loadData(1, pagination.limit, appliedFilters);
        } catch (err) {
            console.error("CSV Upload error:", err);
            setUploadStatus({
                type: "danger",
                text: err.response?.data?.message || err.message || "Failed to upload CSV file."
            });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // -------------------------------------------------------------------------
    // EXPORT TO EXCEL (CSV)
    // -------------------------------------------------------------------------
    const handleExportExcel = async () => {
        try {
            setExporting(true);
            const res = await requirementToPOService.getRequirements({
                ...appliedFilters,
                all: "true"
            });

            const exportRows = res?.data || rows;
            const exportTotals = res?.totals || totals;

            const headers = [
                "Group",
                "Customer",
                "Buyer Po",
                "Product",
                "Prod Color",
                "Required Date",
                "IO Date",
                "IO No",
                "Item",
                "Uom",
                "Color",
                "Size Range",
                "Size",
                "Required Qty",
                "Indent Qty",
                "Balance to Indent",
                "Excess Indent",
                "PO Qty",
                "PO Value",
                "Balance to PO",
                "Excess PO",
                "GRN Qty",
                "GRN Value",
                "Balance to GRN",
                "Excess GRN",
                "ISS Qty",
                "ISS Value",
                "Balance to ISS",
                "Excess ISS",
                "Excess ISS Value",
                "Item Category"
            ];

            const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

            const csvLines = [
                "Plot No. 9B",
                '"Alpine Apparels Pvt. Ltd. - PLOT NO.9B, SECTOR-27A, FARIDABAD, HARYANA-121003"',
                "Requirement to PO Report",
                headers.join(",")
            ];

            for (const r of exportRows) {
                csvLines.push(
                    [
                        esc(r.ItemGroup),
                        esc(r.Customer),
                        esc(r.BuyerPO),
                        esc(r.Product),
                        esc(r.ProdColor),
                        esc(r.RequiredDate),
                        esc(r.IODate),
                        esc(r.IONo),
                        esc(r.Item),
                        esc(r.UOM),
                        esc(r.Color),
                        esc(r.SizeRange),
                        esc(r.Size),
                        r.RequiredQty || 0,
                        r.IndentQty || 0,
                        r.BalanceToIndent || 0,
                        r.ExcessIndent || 0,
                        r.POQty || 0,
                        r.POValue || 0,
                        r.BalanceToPO || 0,
                        r.ExcessPO || 0,
                        r.GRNQty || 0,
                        r.GRNValue || 0,
                        r.BalanceToGRN || 0,
                        r.ExcessGRN || 0,
                        r.ISSQty || 0,
                        r.ISSValue || 0,
                        r.BalanceToISS || 0,
                        r.ExcessISS || 0,
                        r.ExcessISSValue || 0,
                        esc(r.ItemCategory)
                    ].join(",")
                );
            }

            csvLines.push(
                [
                    "Grand Total",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    exportTotals.RequiredQty || 0,
                    exportTotals.IndentQty || 0,
                    exportTotals.BalanceToIndent || 0,
                    exportTotals.ExcessIndent || 0,
                    exportTotals.POQty || 0,
                    exportTotals.POValue || 0,
                    exportTotals.BalanceToPO || 0,
                    exportTotals.ExcessPO || 0,
                    exportTotals.GRNQty || 0,
                    exportTotals.GRNValue || 0,
                    exportTotals.BalanceToGRN || 0,
                    exportTotals.ExcessGRN || 0,
                    exportTotals.ISSQty || 0,
                    exportTotals.ISSValue || 0,
                    exportTotals.BalanceToISS || 0,
                    exportTotals.ExcessISS || 0,
                    exportTotals.ExcessISSValue || 0,
                    ""
                ].join(",")
            );

            const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Requirement_to_PO_Report.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Export error:", err);
            alert("Failed to export Requirement to PO report.");
        } finally {
            setExporting(false);
        }
    };

    // -------------------------------------------------------------------------
    // NUMBER FORMATTERS
    // -------------------------------------------------------------------------
    const fmtNum = (val, maxDec = 4) => {
        const num = Number(val || 0);
        if (num === 0) return "0";
        return num.toLocaleString("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: maxDec
        });
    };

    const fmtCurr = (val) => {
        const num = Number(val || 0);
        if (num === 0) return "0.00";
        return num.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const startRow = pagination.totalRows === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
    const endRow = Math.min(pagination.totalRows, pagination.page * pagination.limit);

    return (
        <div className="req-to-po-page">
            {/* TOP TITLE & COMPANY HEADER */}
            <div className="rpo-header-row">
                <div className="rpo-title-group">
                    <h1 className="rpo-title">Requirement to PO</h1>
                    <span className="rpo-subtitle">
                        Material Requirement, Indent, Purchase Order, GRN &amp; Issue Tracking
                    </span>
                </div>
                <div className="rpo-company-tag">
                    <FaBuilding className="text-primary" />
                    <span>Alpine Apparels Pvt. Ltd. • Plot No. 9B, Sector-27A, Faridabad</span>
                </div>
            </div>

            {/* KPI SUMMARY STRIP */}
            <div className="rpo-kpi-grid">
                <div className="rpo-kpi-card">
                    <div className="rpo-kpi-label">Total Requirement</div>
                    <div className="rpo-kpi-val">{fmtNum(totals.RequiredQty, 2)}</div>
                    <div className="rpo-kpi-sub">
                        {pagination.totalRows.toLocaleString("en-IN")} Line Items
                    </div>
                </div>

                <div className="rpo-kpi-card kpi-indent">
                    <div className="rpo-kpi-label">Indent Qty</div>
                    <div className="rpo-kpi-val">{fmtNum(totals.IndentQty, 2)}</div>
                    <div className="rpo-kpi-sub">
                        Bal to Indent: <strong className="text-danger">{fmtNum(totals.BalanceToIndent, 2)}</strong>
                    </div>
                </div>

                <div className="rpo-kpi-card kpi-po">
                    <div className="rpo-kpi-label">PO Qty &amp; Value</div>
                    <div className="rpo-kpi-val">₹{fmtCurr(totals.POValue)}</div>
                    <div className="rpo-kpi-sub">
                        PO Qty: <strong>{fmtNum(totals.POQty, 2)}</strong> | Bal: {fmtNum(totals.BalanceToPO, 2)}
                    </div>
                </div>

                <div className="rpo-kpi-card kpi-grn">
                    <div className="rpo-kpi-label">GRN Qty &amp; Value</div>
                    <div className="rpo-kpi-val">₹{fmtCurr(totals.GRNValue)}</div>
                    <div className="rpo-kpi-sub">
                        GRN Qty: <strong>{fmtNum(totals.GRNQty, 2)}</strong> | Bal: {fmtNum(totals.BalanceToGRN, 2)}
                    </div>
                </div>

                <div className="rpo-kpi-card kpi-iss">
                    <div className="rpo-kpi-label">Issued (ISS) Value</div>
                    <div className="rpo-kpi-val">₹{fmtCurr(totals.ISSValue)}</div>
                    <div className="rpo-kpi-sub">
                        ISS Qty: <strong>{fmtNum(totals.ISSQty, 2)}</strong> | Bal: {fmtNum(totals.BalanceToISS, 2)}
                    </div>
                </div>

                <div className="rpo-kpi-card kpi-balance">
                    <div className="rpo-kpi-label">Excess Issued Value</div>
                    <div className="rpo-kpi-val">₹{fmtCurr(totals.ExcessISSValue)}</div>
                    <div className="rpo-kpi-sub">
                        Excess ISS Qty: <strong>{fmtNum(totals.ExcessISS, 2)}</strong>
                    </div>
                </div>
            </div>

            {/* TOP CRITERIA BAR */}
            <form className="rpo-criteria-bar" onSubmit={handleApplyFilters}>
                <div className="rpo-field-group">
                    <label className="rpo-field-label">IO Date From</label>
                    <input
                        type="date"
                        className="rpo-input"
                        value={filters.fromDate}
                        onChange={(e) => handleFilterFieldChange("fromDate", e.target.value)}
                    />
                </div>

                <div className="rpo-field-group">
                    <label className="rpo-field-label">IO Date To</label>
                    <input
                        type="date"
                        className="rpo-input"
                        value={filters.toDate}
                        onChange={(e) => handleFilterFieldChange("toDate", e.target.value)}
                    />
                </div>

                <div className="rpo-field-group">
                    <label className="rpo-field-label">Item Category</label>
                    <select
                        className="rpo-select"
                        value={filters.itemCategory}
                        onChange={(e) => handleQuickFilterChange("itemCategory", e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        {filterOptions.categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="rpo-field-group">
                    <label className="rpo-field-label">Customer</label>
                    <select
                        className="rpo-select"
                        value={filters.customer}
                        onChange={(e) => handleQuickFilterChange("customer", e.target.value)}
                        style={{ maxWidth: "210px" }}
                    >
                        <option value="">All Customers</option>
                        {filterOptions.customers.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="rpo-field-group">
                    <label className="rpo-field-label">Group</label>
                    <select
                        className="rpo-select"
                        value={filters.group}
                        onChange={(e) => handleQuickFilterChange("group", e.target.value)}
                        style={{ maxWidth: "200px" }}
                    >
                        <option value="">All Groups</option>
                        {filterOptions.groups.map((g) => (
                            <option key={g} value={g}>
                                {g}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="rpo-field-group rpo-search-wrap">
                    <label className="rpo-field-label">Quick Search (IO No, Buyer PO, Product, Item, Color)</label>
                    <div className="position-relative">
                        <FaSearch className="rpo-search-icon" />
                        <input
                            type="text"
                            className="rpo-input"
                            placeholder="Search IO/9B/..., Buyer PO, Item, Product..."
                            value={filters.search}
                            onChange={(e) => handleFilterFieldChange("search", e.target.value)}
                        />
                    </div>
                </div>

                <div className="d-flex align-items-end gap-2">
                    <button type="submit" className="rpo-tool-btn active">
                        <FaSearch size={11} /> Search
                    </button>
                    <button type="button" className="rpo-tool-btn" onClick={handleResetFilters}>
                        <FaTimes size={11} /> Reset
                    </button>
                </div>
            </form>

            {/* ACTION TOOLBAR & STATUS PILLS */}
            <div className="rpo-toolbar-row">
                <div className="rpo-toolbar-left">
                    <button
                        type="button"
                        className="rpo-tool-btn"
                        title="Refresh Data"
                        onClick={() => loadData(pagination.page, pagination.limit, appliedFilters)}
                        disabled={loading}
                    >
                        <FaSyncAlt className={loading ? "fa-spin" : ""} size={12} /> Refresh
                    </button>

                    <button
                        type="button"
                        className="rpo-tool-btn btn-upload"
                        title="Upload Requirement to PO CSV"
                        onClick={() => {
                            setUploadStatus(null);
                            setUploadProgress(0);
                            setShowUploadModal(true);
                        }}
                    >
                        <FaUpload size={12} /> Upload CSV
                    </button>

                    <button
                        type="button"
                        className="rpo-tool-btn btn-excel"
                        title="Export Filtered Data to Excel (CSV)"
                        onClick={handleExportExcel}
                        disabled={exporting || loading}
                    >
                        <FaFileExcel size={13} /> {exporting ? "Exporting..." : "Export Excel"}
                    </button>

                    <button
                        type="button"
                        className="rpo-tool-btn btn-pdf"
                        title="Print / Save PDF"
                        onClick={() => window.print()}
                    >
                        <FaFilePdf size={13} /> Print / PDF
                    </button>

                    <button
                        type="button"
                        className={`rpo-tool-btn ${isFilterOpen ? "active" : ""}`}
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <FaFilter size={11} /> Advanced Filter ▾
                    </button>

                    <div className="rpo-status-pills ms-2">
                        {[
                            { label: "All Rows", value: "" },
                            { label: "Pending Indent", value: "PendingIndent" },
                            { label: "Pending PO", value: "PendingPO" },
                            { label: "Pending GRN", value: "PendingGRN" },
                            { label: "Pending Issue", value: "PendingISS" },
                            { label: "Excess PO", value: "ExcessPO" }
                        ].map((pill) => (
                            <button
                                key={pill.label}
                                type="button"
                                className={`rpo-pill ${appliedFilters.statusFilter === pill.value ? "active" : ""}`}
                                onClick={() => handleQuickFilterChange("statusFilter", pill.value)}
                            >
                                {pill.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* PAGINATION CONTROLS */}
                <div className="rpo-toolbar-right">
                    <span className="rpo-pagination-info">
                        Showing <strong>{startRow.toLocaleString("en-IN")}</strong> –{" "}
                        <strong>{endRow.toLocaleString("en-IN")}</strong> of{" "}
                        <strong>{pagination.totalRows.toLocaleString("en-IN")}</strong>
                    </span>

                    <select
                        className="rpo-select"
                        style={{ width: "92px", height: "29px" }}
                        value={pagination.limit}
                        onChange={(e) => handleLimitChange(e.target.value)}
                    >
                        <option value={50}>50 / page</option>
                        <option value={100}>100 / page</option>
                        <option value={250}>250 / page</option>
                        <option value={500}>500 / page</option>
                        <option value={1000}>1000 / page</option>
                    </select>

                    <button
                        type="button"
                        className="rpo-tool-btn"
                        onClick={() => handlePageChange(1)}
                        disabled={pagination.page <= 1 || loading}
                        title="First Page"
                    >
                        <FaAngleDoubleLeft size={12} />
                    </button>
                    <button
                        type="button"
                        className="rpo-tool-btn"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1 || loading}
                        title="Previous Page"
                    >
                        <FaAngleLeft size={12} />
                    </button>

                    <span className="badge bg-primary px-2 py-1" style={{ fontSize: "12px" }}>
                        Page {pagination.page} / {pagination.totalPages}
                    </span>

                    <button
                        type="button"
                        className="rpo-tool-btn"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages || loading}
                        title="Next Page"
                    >
                        <FaAngleRight size={12} />
                    </button>
                    <button
                        type="button"
                        className="rpo-tool-btn"
                        onClick={() => handlePageChange(pagination.totalPages)}
                        disabled={pagination.page >= pagination.totalPages || loading}
                        title="Last Page"
                    >
                        <FaAngleDoubleRight size={12} />
                    </button>
                </div>
            </div>

            {/* ADVANCED FILTER POPOVER */}
            {isFilterOpen && (
                <div className="rpo-filter-popover">
                    <div className="rpo-popover-grid">
                        <div className="rpo-popover-field">
                            <label>IO No</label>
                            <input
                                type="text"
                                list="rpo-iono-list"
                                placeholder="e.g. IO/9B/2627/60"
                                value={filters.ioNo}
                                onChange={(e) => handleFilterFieldChange("ioNo", e.target.value)}
                            />
                            <datalist id="rpo-iono-list">
                                {filterOptions.ioNos.slice(0, 300).map((v) => (
                                    <option key={v} value={v} />
                                ))}
                            </datalist>
                        </div>

                        <div className="rpo-popover-field">
                            <label>Buyer PO</label>
                            <input
                                type="text"
                                list="rpo-buyerpo-list"
                                placeholder="e.g. 5500071001"
                                value={filters.buyerPo}
                                onChange={(e) => handleFilterFieldChange("buyerPo", e.target.value)}
                            />
                            <datalist id="rpo-buyerpo-list">
                                {filterOptions.buyerPOs.slice(0, 300).map((v) => (
                                    <option key={v} value={v} />
                                ))}
                            </datalist>
                        </div>

                        <div className="rpo-popover-field">
                            <label>Product / Style</label>
                            <input
                                type="text"
                                list="rpo-product-list"
                                placeholder="Filter by Product / Style"
                                value={filters.product}
                                onChange={(e) => handleFilterFieldChange("product", e.target.value)}
                            />
                            <datalist id="rpo-product-list">
                                {filterOptions.products.slice(0, 300).map((v) => (
                                    <option key={v} value={v} />
                                ))}
                            </datalist>
                        </div>

                        <div className="rpo-popover-field">
                            <label>Product Color</label>
                            <input
                                type="text"
                                placeholder="e.g. FOREST BROWN, NATURAL"
                                value={filters.prodColor}
                                onChange={(e) => handleFilterFieldChange("prodColor", e.target.value)}
                            />
                        </div>

                        <div className="rpo-popover-field">
                            <label>Material / Item</label>
                            <input
                                type="text"
                                list="rpo-item-list"
                                placeholder="Filter by Item Name"
                                value={filters.item}
                                onChange={(e) => handleFilterFieldChange("item", e.target.value)}
                            />
                            <datalist id="rpo-item-list">
                                {filterOptions.items.slice(0, 300).map((v) => (
                                    <option key={v} value={v} />
                                ))}
                            </datalist>
                        </div>

                        <div className="rpo-popover-field">
                            <label>Item Color</label>
                            <input
                                type="text"
                                list="rpo-color-list"
                                placeholder="Filter by Item Color"
                                value={filters.color}
                                onChange={(e) => handleFilterFieldChange("color", e.target.value)}
                            />
                            <datalist id="rpo-color-list">
                                {filterOptions.colors.slice(0, 300).map((v) => (
                                    <option key={v} value={v} />
                                ))}
                            </datalist>
                        </div>

                        <div className="rpo-popover-field">
                            <label>Required Date From</label>
                            <input
                                type="date"
                                value={filters.reqFromDate}
                                onChange={(e) => handleFilterFieldChange("reqFromDate", e.target.value)}
                            />
                        </div>

                        <div className="rpo-popover-field">
                            <label>Required Date To</label>
                            <input
                                type="date"
                                value={filters.reqToDate}
                                onChange={(e) => handleFilterFieldChange("reqToDate", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rpo-popover-actions">
                        <button type="button" className="rpo-tool-btn" onClick={handleResetFilters}>
                            <FaTimes size={11} /> Clear All
                        </button>
                        <button type="button" className="rpo-tool-btn active" onClick={handleApplyFilters}>
                            <FaSearch size={11} /> Apply Filters
                        </button>
                    </div>
                </div>
            )}

            {errorMsg && (
                <Alert variant="danger" className="py-2 mb-2">
                    {errorMsg}
                </Alert>
            )}

            {/* MAIN 31-COLUMN REQUIREMENT TO PO TABLE */}
            <div className="rpo-table-wrapper">
                <table className="rpo-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Group</th>
                            <th>Customer</th>
                            <th>Buyer Po</th>
                            <th>Product</th>
                            <th>Prod Color</th>
                            <th>Required Date</th>
                            <th>IO Date</th>
                            <th>IO No</th>
                            <th>Item</th>
                            <th>Uom</th>
                            <th>Color</th>
                            <th>Size Range</th>
                            <th>Size</th>
                            <th className="num-col">Required Qty</th>
                            <th className="num-col">Indent Qty</th>
                            <th className="num-col">Balance to Indent</th>
                            <th className="num-col">Excess Indent</th>
                            <th className="num-col">PO Qty</th>
                            <th className="num-col">PO Value</th>
                            <th className="num-col">Balance to PO</th>
                            <th className="num-col">Excess PO</th>
                            <th className="num-col">GRN Qty</th>
                            <th className="num-col">GRN Value</th>
                            <th className="num-col">Balance to GRN</th>
                            <th className="num-col">Excess GRN</th>
                            <th className="num-col">ISS Qty</th>
                            <th className="num-col">ISS Value</th>
                            <th className="num-col">Balance to ISS</th>
                            <th className="num-col">Excess ISS</th>
                            <th className="num-col">Excess ISS Value</th>
                            <th>Item Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="32" className="text-center py-5">
                                    <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                                    Loading Requirement to PO records...
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan="32" className="text-center py-5 text-muted">
                                    No Requirement to PO records found matching the selected criteria.
                                </td>
                            </tr>
                        ) : (
                            rows.map((r, idx) => (
                                <tr key={r.RequirementID || idx}>
                                    <td className="text-muted">{startRow + idx}</td>
                                    <td className="fw-semibold">{r.ItemGroup}</td>
                                    <td>{r.Customer}</td>
                                    <td>{r.BuyerPO}</td>
                                    <td className="col-wrap">{r.Product}</td>
                                    <td>{r.ProdColor}</td>
                                    <td>{r.RequiredDate}</td>
                                    <td>{r.IODate}</td>
                                    <td className="io-badge">{r.IONo}</td>
                                    <td className="col-wrap fw-medium">{r.Item}</td>
                                    <td>{r.UOM}</td>
                                    <td>{r.Color}</td>
                                    <td>{r.SizeRange}</td>
                                    <td>{r.Size}</td>
                                    <td className="num-col val-positive">{fmtNum(r.RequiredQty)}</td>
                                    <td className="num-col">{fmtNum(r.IndentQty)}</td>
                                    <td className={`num-col ${Number(r.BalanceToIndent) > 0 ? "val-balance" : ""}`}>
                                        {fmtNum(r.BalanceToIndent)}
                                    </td>
                                    <td className={`num-col ${Number(r.ExcessIndent) > 0 ? "val-excess" : ""}`}>
                                        {fmtNum(r.ExcessIndent)}
                                    </td>
                                    <td className="num-col val-positive">{fmtNum(r.POQty)}</td>
                                    <td className="num-col">{fmtCurr(r.POValue)}</td>
                                    <td className={`num-col ${Number(r.BalanceToPO) > 0 ? "val-balance" : ""}`}>
                                        {fmtNum(r.BalanceToPO)}
                                    </td>
                                    <td className={`num-col ${Number(r.ExcessPO) > 0 ? "val-excess" : ""}`}>
                                        {fmtNum(r.ExcessPO)}
                                    </td>
                                    <td className="num-col val-positive">{fmtNum(r.GRNQty)}</td>
                                    <td className="num-col">{fmtCurr(r.GRNValue)}</td>
                                    <td className={`num-col ${Number(r.BalanceToGRN) > 0 ? "val-balance" : ""}`}>
                                        {fmtNum(r.BalanceToGRN)}
                                    </td>
                                    <td className={`num-col ${Number(r.ExcessGRN) > 0 ? "val-excess" : ""}`}>
                                        {fmtNum(r.ExcessGRN)}
                                    </td>
                                    <td className="num-col val-positive">{fmtNum(r.ISSQty)}</td>
                                    <td className="num-col">{fmtCurr(r.ISSValue)}</td>
                                    <td className={`num-col ${Number(r.BalanceToISS) > 0 ? "val-balance" : ""}`}>
                                        {fmtNum(r.BalanceToISS)}
                                    </td>
                                    <td className={`num-col ${Number(r.ExcessISS) > 0 ? "val-excess" : ""}`}>
                                        {fmtNum(r.ExcessISS)}
                                    </td>
                                    <td className={`num-col ${Number(r.ExcessISSValue) > 0 ? "val-excess" : ""}`}>
                                        {fmtCurr(r.ExcessISSValue)}
                                    </td>
                                    <td>
                                        {r.ItemCategory && (
                                            <span className="rpo-category-badge">{r.ItemCategory}</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    {!loading && rows.length > 0 && (
                        <tfoot>
                            <tr className="rpo-grand-total-row">
                                <td colSpan="14">
                                    Grand Total ({pagination.totalRows.toLocaleString("en-IN")} Rows)
                                </td>
                                <td className="num-col">{fmtNum(totals.RequiredQty)}</td>
                                <td className="num-col">{fmtNum(totals.IndentQty)}</td>
                                <td className="num-col">{fmtNum(totals.BalanceToIndent)}</td>
                                <td className="num-col">{fmtNum(totals.ExcessIndent)}</td>
                                <td className="num-col">{fmtNum(totals.POQty)}</td>
                                <td className="num-col">{fmtCurr(totals.POValue)}</td>
                                <td className="num-col">{fmtNum(totals.BalanceToPO)}</td>
                                <td className="num-col">{fmtNum(totals.ExcessPO)}</td>
                                <td className="num-col">{fmtNum(totals.GRNQty)}</td>
                                <td className="num-col">{fmtCurr(totals.GRNValue)}</td>
                                <td className="num-col">{fmtNum(totals.BalanceToGRN)}</td>
                                <td className="num-col">{fmtNum(totals.ExcessGRN)}</td>
                                <td className="num-col">{fmtNum(totals.ISSQty)}</td>
                                <td className="num-col">{fmtCurr(totals.ISSValue)}</td>
                                <td className="num-col">{fmtNum(totals.BalanceToISS)}</td>
                                <td className="num-col">{fmtNum(totals.ExcessISS)}</td>
                                <td className="num-col">{fmtCurr(totals.ExcessISSValue)}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            {/* CSV UPLOAD MODAL */}
            <Modal show={showUploadModal} onHide={() => !uploading && setShowUploadModal(false)} centered>
                <Modal.Header closeButton={!uploading}>
                    <Modal.Title className="fs-6 fw-bold">
                        <FaUpload className="me-2 text-primary" />
                        Upload Requirement to PO CSV
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted small mb-3">
                        Select a <strong>Requirement_to_PO.csv</strong> export file (standard 31-column V-CONNECT INC.
                        format) to import into the Requirement to PO module.
                    </p>

                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Import Mode</label>
                        <div className="d-flex gap-3">
                            <label className="d-flex align-items-center gap-2 small" style={{ cursor: "pointer" }}>
                                <input
                                    type="radio"
                                    name="uploadMode"
                                    value="replace"
                                    checked={uploadMode === "replace"}
                                    onChange={() => setUploadMode("replace")}
                                    disabled={uploading}
                                />
                                <span>
                                    <strong>Replace All</strong> (Clear existing &amp; load fresh dataset)
                                </span>
                            </label>
                            <label className="d-flex align-items-center gap-2 small" style={{ cursor: "pointer" }}>
                                <input
                                    type="radio"
                                    name="uploadMode"
                                    value="append"
                                    checked={uploadMode === "append"}
                                    onChange={() => setUploadMode("append")}
                                    disabled={uploading}
                                />
                                <span>
                                    <strong>Append</strong> (Add to existing rows)
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Select CSV File</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            className="form-control form-control-sm"
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                    </div>

                    {uploading && (
                        <div className="my-3">
                            <ProgressBar animated now={uploadProgress} label={`${uploadProgress}%`} />
                        </div>
                    )}

                    {uploadStatus && (
                        <Alert variant={uploadStatus.type} className="py-2 small mb-0">
                            {uploadStatus.text}
                        </Alert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowUploadModal(false)}
                        disabled={uploading}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
