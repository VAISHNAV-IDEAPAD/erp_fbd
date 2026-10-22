import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import {
    FaPlus,
    FaSyncAlt,
    FaBars,
    FaCog,
    FaFilter,
    FaCaretDown,
    FaEye,
    FaEdit,
    FaTrash,
    FaPrint,
    FaTimes,
    FaCheck,
    FaSearch
} from "react-icons/fa";
import "../../styles/itemIssue.css";

const API_URL = process.env.REACT_APP_API_URL || "/api";

// Default seed data matching V-CONNECT INC. ERP specifications
const INITIAL_ITEM_ISSUES = [
    {
        IssueID: 1,
        IssueNo: "IS/AAPL9B/2627/088",
        IssueDate: "13-10-2026",
        UpdatedBy: "Nikhil Singh",
        UpdatedOn: "Oct 13 2026 04:30PM",
        JWNo: "JW-9821",
        ExchangeRate: 1.0,
        Remark: "Batch 104 Cutting",
        SupplierName: "Apex Leather Works",
        IssuedBy: "Ramesh Kumar",
        Stores: "RAW MATERIAL STORE 9B",
        InternalMemo: "Bulk cutting line 1",
        Currency: "INR",
        ExpiryDate: "31-10-2026",
        JCNo: "JC-4512",
        TotalQty: 185.5,
        RowCount: 2,
        Status: "Completed",
        details: [
            { ItemCode: "LTH-1093", ItemName: "COW CULATTAS SINGLE LEATHER", Color: "BLACK", Quantity: 120.5, UOM: "SQFT", Rate: 145.0, Amount: 17472.5, Remarks: "Upper cutting" },
            { ItemCode: "LTH-1112", ItemName: "COW ECO VEG SIDE CRUST LEATHER", Color: "TAN", Quantity: 65.0, UOM: "SQFT", Rate: 160.0, Amount: 10400.0, Remarks: "Counter reinforcement" }
        ]
    },
    {
        IssueID: 2,
        IssueNo: "IS/AAPL9B/2627/087",
        IssueDate: "13-10-2026",
        UpdatedBy: "Admin",
        UpdatedOn: "Oct 13 2026 02:15PM",
        JWNo: "JW-9818",
        ExchangeRate: 1.0,
        Remark: "Urgent sampling line",
        SupplierName: "Balaji Trims & Fasteners",
        IssuedBy: "Nikhil Singh",
        Stores: "SEMI FINISH STORE 9B",
        InternalMemo: "Internal sample dev FY26-27",
        Currency: "INR",
        ExpiryDate: "28-10-2026",
        JCNo: "JC-4509",
        TotalQty: 450.0,
        RowCount: 1,
        Status: "Completed",
        details: [
            { ItemCode: "HDW-2236", ItemName: "JAM RIVET SINGLE HEAD 7MM", Color: "ANTIQUE BRASS", Quantity: 450.0, UOM: "SET", Rate: 1.85, Amount: 832.5, Remarks: "Riveting section" }
        ]
    },
    {
        IssueID: 3,
        IssueNo: "IS/AAPL9B/2627/086",
        IssueDate: "12-10-2026",
        UpdatedBy: "",
        UpdatedOn: "",
        JWNo: "JW-9805",
        ExchangeRate: 1.0,
        Remark: "Stitching floor issue",
        SupplierName: "Supreme Leathercraft",
        IssuedBy: "Pooja Verma",
        Stores: "SEMI FINISH STORE 18",
        InternalMemo: "Regular order dispatch",
        Currency: "INR",
        ExpiryDate: "",
        JCNo: "JC-4498",
        TotalQty: 320.0,
        RowCount: 2,
        Status: "Completed",
        details: [
            { ItemCode: "SFS-105", ItemName: "Reinforcement Strips 25mm", Color: "WHITE", Quantity: 200.0, UOM: "MTR", Rate: 12.0, Amount: 2400.0, Remarks: "Collar reinforcement" },
            { ItemCode: "SFS-106", ItemName: "Padded Tongue Inserts", Color: "NATURAL", Quantity: 120.0, UOM: "PCS", Rate: 18.5, Amount: 2220.0, Remarks: "Assembly line" }
        ]
    },
    {
        IssueID: 4,
        IssueNo: "IS/AAPL9B/2627/085",
        IssueDate: "12-10-2026",
        UpdatedBy: "Nikhil Singh",
        UpdatedOn: "Oct 12 2026 11:45AM",
        JWNo: "",
        ExchangeRate: 1.0,
        Remark: "MT-21980 Lining issue",
        SupplierName: "K-Tex Textiles",
        IssuedBy: "Ramesh Kumar",
        Stores: "RAW MATERIAL STORE 9B",
        InternalMemo: "Export batch lining",
        Currency: "INR",
        ExpiryDate: "15-11-2026",
        JCNo: "JC-4481",
        TotalQty: 600.0,
        RowCount: 1,
        Status: "Completed",
        details: [
            { ItemCode: "RNF-1085", ItemName: "HIGH DENSITY TOPLINER 0.4MM", Color: "BLACK", Quantity: 600.0, UOM: "MTR", Rate: 32.5, Amount: 19500.0, Remarks: "Lining cutting" }
        ]
    },
    {
        IssueID: 5,
        IssueNo: "IS/AAPL9B/2627/084",
        IssueDate: "11-10-2026",
        UpdatedBy: "",
        UpdatedOn: "",
        JWNo: "JW-9791",
        ExchangeRate: 1.0,
        Remark: "Assembly batch 19",
        SupplierName: "Shree Ganesh Fabrics",
        IssuedBy: "Suresh Patel",
        Stores: "RAW MATERIAL STORE 9B",
        InternalMemo: "Production run order #4021",
        Currency: "INR",
        ExpiryDate: "",
        JCNo: "JC-4465",
        TotalQty: 85.0,
        RowCount: 1,
        Status: "Completed",
        details: [
            { ItemCode: "NONWO5064", ItemName: "TALIN 0.3MM WHITE", Color: "WHITE", Quantity: 85.0, UOM: "MTR", Rate: 24.0, Amount: 2040.0, Remarks: "Toe puff reinforcement" }
        ]
    },
    {
        IssueID: 6,
        IssueNo: "IS/AAPL9B/2627/083",
        IssueDate: "10-10-2026",
        UpdatedBy: "Admin",
        UpdatedOn: "Oct 10 2026 05:00PM",
        JWNo: "JW-9780",
        ExchangeRate: 1.0,
        Remark: "Premium upper dispatch",
        SupplierName: "Prime Leather Tanning",
        IssuedBy: "Nikhil Singh",
        Stores: "RAW MATERIAL STORE 9B",
        InternalMemo: "Sample boots prototype",
        Currency: "INR",
        ExpiryDate: "30-10-2026",
        JCNo: "JC-4450",
        TotalQty: 112.5,
        RowCount: 1,
        Status: "Completed",
        details: [
            { ItemCode: "LTH-1263", ItemName: "COW PLOSE SUEDE LEATHER", Color: "COGNAC", Quantity: 112.5, UOM: "SQFT", Rate: 175.0, Amount: 19687.5, Remarks: "High grade suede issue" }
        ]
    },
    {
        IssueID: 7,
        IssueNo: "IS/AAPL9B/2627/082",
        IssueDate: "10-10-2026",
        UpdatedBy: "",
        UpdatedOn: "",
        JWNo: "",
        ExchangeRate: 1.0,
        Remark: "Packing division issue",
        SupplierName: "Vardhman Yarns & Threads",
        IssuedBy: "Pooja Verma",
        Stores: "RAW MATERIAL STORE 9B",
        InternalMemo: "Final box packaging",
        Currency: "INR",
        ExpiryDate: "",
        JCNo: "JC-4432",
        TotalQty: 250.0,
        RowCount: 1,
        Status: "Completed",
        details: [
            { ItemCode: "PKG-2200", ItemName: "CARD PAPER 350G 31X43 INCH", Color: "NATURAL", Quantity: 250.0, UOM: "SHEET", Rate: 8.5, Amount: 2125.0, Remarks: "Shoe box inserts" }
        ]
    }
];

// All 17 table columns config
const ALL_COLUMNS = [
    { key: "action", label: "Action", fixed: true },
    { key: "issueNo", label: "Issue No", fixed: true },
    { key: "updatedBy", label: "Updated By" },
    { key: "updatedOn", label: "Updated On" },
    { key: "jwNo", label: "JW No." },
    { key: "exchangeRate", label: "Exchange Rate" },
    { key: "remark", label: "Remark" },
    { key: "date", label: "Date" },
    { key: "supplier", label: "Supplier" },
    { key: "issuedBy", label: "Issued By" },
    { key: "stores", label: "Stores" },
    { key: "memo", label: "Memo for internal use" },
    { key: "currency", label: "Currency" },
    { key: "expiryDate", label: "Expiry Date" },
    { key: "jcNo", label: "JC No" },
    { key: "qty", label: "Qty" },
    { key: "rowCount", label: "No. of rows" }
];

export default function ItemIssue() {
    const [issues, setIssues] = useState(INITIAL_ITEM_ISSUES);
    const [loading, setLoading] = useState(false);
    const [searchSupplier, setSearchSupplier] = useState("");
    const [selectedRowId, setSelectedRowId] = useState(1);
    const [openActionId, setOpenActionId] = useState(null);
    const [showFilterBar, setShowFilterBar] = useState(false);
    const [showColumnChooser, setShowColumnChooser] = useState(false);
    const [viewMode, setViewMode] = useState("normal"); // normal or compact

    // Column visibility map (all true by default)
    const [columnVisibility, setColumnVisibility] = useState(
        ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
    );

    // Filter criteria state
    const [filterStore, setFilterStore] = useState("All");
    const [filterJWNo, setFilterJWNo] = useState("");
    const [filterJCNo, setFilterJCNo] = useState("");
    const [filterRemark, setFilterRemark] = useState("");

    // Modals state
    const [showNewModal, setShowNewModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [activeRecord, setActiveRecord] = useState(null);

    // New Item Issue form state
    const [newForm, setNewForm] = useState({
        IssueNo: `IS/AAPL9B/2627/${String(89 + (issues.length > 7 ? issues.length - 7 : 0)).padStart(3, "0")}`,
        IssueDate: "13-10-2026",
        SupplierName: "",
        IssuedBy: "Nikhil Singh",
        Stores: "RAW MATERIAL STORE 9B",
        JWNo: "",
        JCNo: "",
        Currency: "INR",
        ExchangeRate: "1.0",
        ExpiryDate: "",
        Remark: "",
        InternalMemo: "",
        items: [
            { ItemCode: "LTH-1093", ItemName: "COW CULATTAS SINGLE LEATHER", Color: "BLACK", Quantity: "50", UOM: "SQFT", Rate: "145", Remarks: "Batch cutting" }
        ]
    });

    // Master suppliers & items for selection
    const [suppliersList, setSuppliersList] = useState([]);
    const [itemsList, setItemsList] = useState([]);

    const actionMenuRef = useRef(null);
    const columnMenuRef = useRef(null);

    // Load from backend on mount
    useEffect(() => {
        loadData();
        loadSuppliers();
        loadItems();
    }, []);

    // Close action dropdown and column chooser on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
                setOpenActionId(null);
            }
            if (columnMenuRef.current && !columnMenuRef.current.contains(e.target)) {
                setShowColumnChooser(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/item-issues`);
            const data = res.data?.data || res.data || [];
            if (Array.isArray(data) && data.length > 0) {
                setIssues(data);
            }
        } catch (e) {
            console.warn("Unable to load from API, keeping initial data:", e.message);
        } finally {
            setLoading(false);
        }
    };

    const loadSuppliers = async () => {
        try {
            const res = await axios.get(`${API_URL}/suppliers`);
            const data = res.data?.value || res.data?.data || res.data || [];
            if (Array.isArray(data)) {
                setSuppliersList(data.map(s => ({
                    label: s.SupplierName || s.supplierName,
                    value: s.SupplierID || s.id,
                    code: s.SupplierCode || s.supplierCode
                })));
            }
        } catch (e) {}
    };

    const loadItems = async () => {
        try {
            const res = await axios.get(`${API_URL}/items`);
            const data = res.data?.data || res.data || [];
            if (Array.isArray(data)) {
                setItemsList(data);
            }
        } catch (e) {}
    };

    // Filtered records
    const filteredIssues = useMemo(() => {
        return issues.filter(item => {
            // Associate / Supplier search
            const search = searchSupplier.trim().toLowerCase();
            if (search) {
                const matchSupplier = String(item.SupplierName || "").toLowerCase().includes(search);
                const matchIssueNo = String(item.IssueNo || "").toLowerCase().includes(search);
                const matchStore = String(item.Stores || "").toLowerCase().includes(search);
                const matchRemark = String(item.Remark || "").toLowerCase().includes(search);
                const matchIssuedBy = String(item.IssuedBy || "").toLowerCase().includes(search);
                if (!matchSupplier && !matchIssueNo && !matchStore && !matchRemark && !matchIssuedBy) {
                    return false;
                }
            }

            // Store filter
            if (filterStore !== "All" && item.Stores !== filterStore) {
                return false;
            }

            // JW No filter
            if (filterJWNo && !String(item.JWNo || "").toLowerCase().includes(filterJWNo.toLowerCase())) {
                return false;
            }

            // JC No filter
            if (filterJCNo && !String(item.JCNo || "").toLowerCase().includes(filterJCNo.toLowerCase())) {
                return false;
            }

            // Remark filter
            if (filterRemark && !String(item.Remark || "").toLowerCase().includes(filterRemark.toLowerCase())) {
                return false;
            }

            return true;
        });
    }, [issues, searchSupplier, filterStore, filterJWNo, filterJCNo, filterRemark]);

    // Handle Item Row changes in New Modal
    const handleAddRow = () => {
        setNewForm(prev => ({
            ...prev,
            items: [
                ...prev.items,
                { ItemCode: "", ItemName: "", Color: "", Quantity: "", UOM: "PCS", Rate: "", Remarks: "" }
            ]
        }));
    };

    const handleRemoveRow = (idx) => {
        if (newForm.items.length <= 1) return;
        setNewForm(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== idx)
        }));
    };

    const handleItemChange = (idx, field, val) => {
        setNewForm(prev => {
            const nextItems = [...prev.items];
            nextItems[idx] = { ...nextItems[idx], [field]: val };
            // If item code selected, autofill ItemName if matching
            if (field === "ItemCode" && itemsList.length > 0) {
                const match = itemsList.find(it => it.ItemCode === val);
                if (match) {
                    nextItems[idx].ItemName = match.ItemName || nextItems[idx].ItemName;
                    nextItems[idx].UOM = match.UOM || nextItems[idx].UOM;
                }
            }
            return { ...prev, items: nextItems };
        });
    };

    // Save New Item Issue
    const handleSaveNew = async (e) => {
        e.preventDefault();
        const totalQty = newForm.items.reduce((s, it) => s + Number(it.Quantity || 0), 0);
        const payload = {
            IssueNo: newForm.IssueNo,
            IssueDate: newForm.IssueDate,
            Stores: newForm.Stores,
            SupplierName: newForm.SupplierName,
            IssuedBy: newForm.IssuedBy,
            JWNo: newForm.JWNo,
            JCNo: newForm.JCNo,
            Currency: newForm.Currency,
            ExchangeRate: Number(newForm.ExchangeRate) || 1.0,
            ExpiryDate: newForm.ExpiryDate,
            Remark: newForm.Remark,
            InternalMemo: newForm.InternalMemo,
            UpdatedBy: "Nikhil Singh",
            TotalQty: totalQty,
            RowCount: Math.max(newForm.items.length, 1),
            details: newForm.items
        };

        try {
            await axios.post(`${API_URL}/item-issues`, payload);
        } catch (err) {
            console.warn("Backend save fallback:", err);
        }

        const now = new Date();
        const updatedOn = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) +
            " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        const newRecord = {
            ...payload,
            IssueID: Date.now(),
            UpdatedOn: updatedOn
        };

        setIssues(prev => [newRecord, ...prev]);
        setShowNewModal(false);
        alert(`Item Issue ${newForm.IssueNo} created successfully!`);
    };

    // Save Edited Item Issue
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!activeRecord) return;
        const totalQty = (activeRecord.details || []).reduce((s, it) => s + Number(it.Quantity || 0), 0);
        const now = new Date();
        const updatedOn = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) +
            " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        const updatedPayload = {
            ...activeRecord,
            UpdatedBy: "Nikhil Singh",
            UpdatedOn: updatedOn,
            TotalQty: totalQty,
            RowCount: Math.max((activeRecord.details || []).length, 1)
        };

        try {
            await axios.put(`${API_URL}/item-issues/${activeRecord.IssueID || activeRecord.IssueNo}`, updatedPayload);
        } catch (e) {
            console.warn("Backend update fallback:", e);
        }

        setIssues(prev => prev.map(item =>
            (item.IssueID === activeRecord.IssueID || item.IssueNo === activeRecord.IssueNo)
                ? updatedPayload
                : item
        ));
        setShowEditModal(false);
        alert(`Item Issue ${activeRecord.IssueNo} updated successfully!`);
    };

    // Delete Record
    const handleDelete = async (record) => {
        if (!window.confirm(`Are you sure you want to delete ${record.IssueNo}?`)) return;
        try {
            await axios.delete(`${API_URL}/item-issues/${record.IssueID || record.IssueNo}`);
        } catch (e) {}
        setIssues(prev => prev.filter(r => (r.IssueID || r.IssueNo) !== (record.IssueID || record.IssueNo)));
        setOpenActionId(null);
    };

    // Print Record
    const handlePrint = (record) => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;
        printWindow.document.write(`
            <html>
                <head>
                    <title>Item Issue Voucher - ${record.IssueNo}</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 25px; color: #333; }
                        h2 { color: #1a5695; margin-bottom: 4px; }
                        .header { border-bottom: 2px solid #337ab7; padding-bottom: 10px; margin-bottom: 16px; }
                        .info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 13px; margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
                        th { background: #337ab7; color: white; padding: 8px; text-align: left; }
                        td { border: 1px solid #ddd; padding: 8px; }
                        .text-end { text-align: right; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>V-CONNECT INC. - ITEM ISSUE VOUCHER</h2>
                        <small>Plot No. 9B | FY 01-Apr-2026 - 31-Mar-2027</small>
                    </div>
                    <div class="info-grid">
                        <div><strong>Issue No:</strong> ${record.IssueNo}</div>
                        <div><strong>Date:</strong> ${record.IssueDate}</div>
                        <div><strong>Supplier / Associate:</strong> ${record.SupplierName || "-"}</div>
                        <div><strong>Issued By:</strong> ${record.IssuedBy || "-"}</div>
                        <div><strong>Stores:</strong> ${record.Stores || "-"}</div>
                        <div><strong>JW No:</strong> ${record.JWNo || "-"}</div>
                        <div><strong>JC No:</strong> ${record.JCNo || "-"}</div>
                        <div><strong>Currency:</strong> ${record.Currency || "INR"} (${Number(record.ExchangeRate || 1.0).toFixed(1)})</div>
                        <div><strong>Expiry Date:</strong> ${record.ExpiryDate || "-"}</div>
                        <div><strong>Remark:</strong> ${record.Remark || "-"}</div>
                        <div><strong>Internal Memo:</strong> ${record.InternalMemo || "-"}</div>
                        <div><strong>Total Qty:</strong> ${record.TotalQty}</div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Item Code</th>
                                <th>Item Name</th>
                                <th>Color</th>
                                <th class="text-end">Qty</th>
                                <th>UOM</th>
                                <th class="text-end">Rate</th>
                                <th class="text-end">Amount</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(record.details || []).map((d, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${d.ItemCode || "-"}</td>
                                    <td>${d.ItemName || "-"}</td>
                                    <td>${d.Color || "-"}</td>
                                    <td class="text-end">${d.Quantity}</td>
                                    <td>${d.UOM || "PCS"}</td>
                                    <td class="text-end">${d.Rate ? Number(d.Rate).toFixed(2) : "-"}</td>
                                    <td class="text-end">${d.Amount ? Number(d.Amount).toFixed(2) : "-"}</td>
                                    <td>${d.Remarks || "-"}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                    <div style="margin-top: 50px; display: flex; justify-content: space-between; font-size: 13px;">
                        <div>Issued By: ________________</div>
                        <div>Received By: ________________</div>
                        <div>Authorized By: ________________</div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 300);
        setOpenActionId(null);
    };

    // Number of empty rows to render to match the spreadsheet look in screenshot
    const emptyRowsCount = Math.max(0, 15 - filteredIssues.length);

    return (
        <div className="item-issue-page">
            {/* PAGE TITLE */}
            <h1 className="ii-page-title">Item Issue</h1>

            {/* TOP CRITERIA / ASSOCIATE SEARCH & NEW BUTTON ROW */}
            <div className="ii-top-row">
                <div className="ii-search-group">
                    <label className="ii-search-label">Associate</label>
                    <input
                        type="text"
                        className="ii-search-input"
                        placeholder="Supplier Search..."
                        value={searchSupplier}
                        onChange={(e) => setSearchSupplier(e.target.value)}
                    />
                </div>

                <button
                    type="button"
                    className="ii-btn-new"
                    onClick={() => {
                        setNewForm(prev => ({
                            ...prev,
                            IssueNo: `IS/AAPL9B/2627/${String(89 + issues.length).padStart(3, "0")}`,
                            IssueDate: "13-10-2026"
                        }));
                        setShowNewModal(true);
                    }}
                >
                    <FaPlus /> New Item Issue
                </button>
            </div>

            {/* ACTION TOOLBAR ROW */}
            <div className="ii-toolbar-row">
                <div className="ii-toolbar-actions">
                    {/* Refresh */}
                    <button
                        type="button"
                        className="ii-tool-btn"
                        title="Reload"
                        onClick={loadData}
                    >
                        <FaSyncAlt className={loading ? "spin" : ""} />
                    </button>

                    {/* Density / View Toggle */}
                    <button
                        type="button"
                        className="ii-tool-btn"
                        title="Toggle Density"
                        onClick={() => setViewMode(prev => prev === "normal" ? "compact" : "normal")}
                    >
                        <FaBars />
                    </button>

                    {/* Column Settings */}
                    <button
                        type="button"
                        className="ii-tool-btn"
                        title="Table Columns Settings"
                        onClick={() => setShowColumnChooser(prev => !prev)}
                    >
                        <FaCog />
                    </button>

                    {/* Column chooser popup */}
                    {showColumnChooser && (
                        <div className="ii-column-dropdown" ref={columnMenuRef}>
                            <div className="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom">
                                <strong style={{ fontSize: "12px" }}>Select Columns</strong>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-link p-0 text-decoration-none"
                                    style={{ fontSize: "11px" }}
                                    onClick={() => setColumnVisibility(ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: true }), {}))}
                                >
                                    Reset
                                </button>
                            </div>
                            {ALL_COLUMNS.map(col => (
                                <label key={col.key} className="ii-col-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={columnVisibility[col.key] !== false}
                                        disabled={col.fixed}
                                        onChange={(e) => setColumnVisibility(prev => ({
                                            ...prev,
                                            [col.key]: e.target.checked
                                        }))}
                                    />
                                    <span>{col.label}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {/* Filter Toggle */}
                    <button
                        type="button"
                        className={`ii-tool-btn ii-tool-btn-filter ${showFilterBar ? "active" : ""}`}
                        onClick={() => setShowFilterBar(prev => !prev)}
                    >
                        <FaFilter /> Filter <FaCaretDown />
                    </button>
                </div>

                <div className="ii-page-badge" title="Page 1">
                    1
                </div>
            </div>

            {/* EXPANDABLE FILTER CARD */}
            {showFilterBar && (
                <div className="ii-filter-card">
                    <div className="ii-filter-item">
                        <label className="ii-filter-label">Stores</label>
                        <select
                            className="ii-filter-select"
                            value={filterStore}
                            onChange={(e) => setFilterStore(e.target.value)}
                        >
                            <option value="All">All Stores</option>
                            <option value="RAW MATERIAL STORE 9B">RAW MATERIAL STORE 9B</option>
                            <option value="SEMI FINISH STORE 9B">SEMI FINISH STORE 9B</option>
                            <option value="SEMI FINISH STORE 18">SEMI FINISH STORE 18</option>
                            <option value="FINISHED GOODS STORE">FINISHED GOODS STORE</option>
                        </select>
                    </div>

                    <div className="ii-filter-item">
                        <label className="ii-filter-label">JW No.</label>
                        <input
                            type="text"
                            className="ii-filter-select"
                            placeholder="e.g. JW-9821"
                            value={filterJWNo}
                            onChange={(e) => setFilterJWNo(e.target.value)}
                        />
                    </div>

                    <div className="ii-filter-item">
                        <label className="ii-filter-label">JC No.</label>
                        <input
                            type="text"
                            className="ii-filter-select"
                            placeholder="e.g. JC-4512"
                            value={filterJCNo}
                            onChange={(e) => setFilterJCNo(e.target.value)}
                        />
                    </div>

                    <div className="ii-filter-item">
                        <label className="ii-filter-label">Remark Filter</label>
                        <input
                            type="text"
                            className="ii-filter-select"
                            placeholder="e.g. Cutting"
                            value={filterRemark}
                            onChange={(e) => setFilterRemark(e.target.value)}
                        />
                    </div>

                    <button
                        type="button"
                        className="ii-filter-btn-reset"
                        onClick={() => {
                            setFilterStore("All");
                            setFilterJWNo("");
                            setFilterJCNo("");
                            setFilterRemark("");
                            setSearchSupplier("");
                        }}
                    >
                        Reset
                    </button>

                    <button
                        type="button"
                        className="ii-filter-btn-apply"
                        onClick={() => setShowFilterBar(false)}
                    >
                        Apply Filter
                    </button>
                </div>
            )}

            {/* DATA TABLE MATCHING SCREENSHOT */}
            <div className="ii-table-container">
                <table className={`ii-table ${viewMode === "compact" ? "table-sm" : ""}`}>
                    <thead>
                        <tr>
                            {columnVisibility.action !== false && (
                                <th style={{ width: "90px" }} className="text-center">Action</th>
                            )}
                            {columnVisibility.issueNo !== false && (
                                <th style={{ width: "165px" }}>Issue No</th>
                            )}
                            {columnVisibility.updatedBy !== false && (
                                <th style={{ width: "115px" }}>Updated By</th>
                            )}
                            {columnVisibility.updatedOn !== false && (
                                <th style={{ width: "135px" }}>Updated On</th>
                            )}
                            {columnVisibility.jwNo !== false && (
                                <th style={{ width: "95px" }}>JW No.</th>
                            )}
                            {columnVisibility.exchangeRate !== false && (
                                <th style={{ width: "105px" }} className="text-end">Exchange Rate</th>
                            )}
                            {columnVisibility.remark !== false && (
                                <th style={{ width: "130px" }}>Remark</th>
                            )}
                            {columnVisibility.date !== false && (
                                <th style={{ width: "95px" }}>Date</th>
                            )}
                            {columnVisibility.supplier !== false && (
                                <th style={{ width: "140px" }}>Supplier</th>
                            )}
                            {columnVisibility.issuedBy !== false && (
                                <th style={{ width: "115px" }}>Issued By</th>
                            )}
                            {columnVisibility.stores !== false && (
                                <th style={{ width: "175px" }}>Stores</th>
                            )}
                            {columnVisibility.memo !== false && (
                                <th style={{ width: "155px" }}>Memo for internal use</th>
                            )}
                            {columnVisibility.currency !== false && (
                                <th style={{ width: "75px" }}>Currency</th>
                            )}
                            {columnVisibility.expiryDate !== false && (
                                <th style={{ width: "100px" }}>Expiry Date</th>
                            )}
                            {columnVisibility.jcNo !== false && (
                                <th style={{ width: "95px" }}>JC No</th>
                            )}
                            {columnVisibility.qty !== false && (
                                <th style={{ width: "85px" }} className="text-end">Qty</th>
                            )}
                            {columnVisibility.rowCount !== false && (
                                <th style={{ width: "85px" }} className="text-end">No. of rows</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIssues.map((row, index) => {
                            const rowKey = row.IssueID || row.IssueNo || index;
                            const isSelected = selectedRowId === rowKey || selectedRowId === row.IssueID;

                            return (
                                <tr
                                    key={rowKey}
                                    className={isSelected ? "selected-row" : ""}
                                    onClick={() => setSelectedRowId(rowKey)}
                                >
                                    {/* ACTION DROPDOWN */}
                                    {columnVisibility.action !== false && (
                                        <td className="text-center" onClick={(e) => e.stopPropagation()}>
                                            <div className="ii-action-btn-wrap" ref={openActionId === rowKey ? actionMenuRef : null}>
                                                <button
                                                    type="button"
                                                    className="ii-action-btn"
                                                    onClick={() => setOpenActionId(openActionId === rowKey ? null : rowKey)}
                                                >
                                                    Action <FaCaretDown />
                                                </button>

                                                {openActionId === rowKey && (
                                                    <div className="ii-action-menu">
                                                        <button
                                                            type="button"
                                                            className="ii-action-item"
                                                            onClick={() => {
                                                                setActiveRecord(row);
                                                                setShowDetailModal(true);
                                                                setOpenActionId(null);
                                                            }}
                                                        >
                                                            <FaEye className="text-primary" /> View Details
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="ii-action-item"
                                                            onClick={() => {
                                                                setActiveRecord({
                                                                    ...row,
                                                                    details: row.details ? [...row.details] : []
                                                                });
                                                                setShowEditModal(true);
                                                                setOpenActionId(null);
                                                            }}
                                                        >
                                                            <FaEdit className="text-secondary" /> Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="ii-action-item"
                                                            onClick={() => handlePrint(row)}
                                                        >
                                                            <FaPrint className="text-success" /> Print Issue
                                                        </button>

                                                        <div style={{ height: "1px", background: "#e2e8f0", margin: "3px 0" }} />

                                                        <button
                                                            type="button"
                                                            className="ii-action-item danger text-danger"
                                                            onClick={() => handleDelete(row)}
                                                        >
                                                            <FaTrash /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    )}

                                    {/* ISSUE NO */}
                                    {columnVisibility.issueNo !== false && (
                                        <td>
                                            <span
                                                className="ii-doc-no"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveRecord(row);
                                                    setShowDetailModal(true);
                                                }}
                                            >
                                                {row.IssueNo}
                                            </span>
                                        </td>
                                    )}

                                    {/* UPDATED BY */}
                                    {columnVisibility.updatedBy !== false && (
                                        <td>
                                            {row.UpdatedBy ? (
                                                <span className="ii-updated-by">{row.UpdatedBy}</span>
                                            ) : ""}
                                        </td>
                                    )}

                                    {/* UPDATED ON */}
                                    {columnVisibility.updatedOn !== false && (
                                        <td>
                                            {row.UpdatedOn ? (
                                                <div className="ii-updated-on">
                                                    {row.UpdatedOn}
                                                </div>
                                            ) : ""}
                                        </td>
                                    )}

                                    {/* JW NO */}
                                    {columnVisibility.jwNo !== false && (
                                        <td>{row.JWNo || ""}</td>
                                    )}

                                    {/* EXCHANGE RATE */}
                                    {columnVisibility.exchangeRate !== false && (
                                        <td className="text-end">
                                            {Number(row.ExchangeRate || 1.0).toFixed(1)}
                                        </td>
                                    )}

                                    {/* REMARK */}
                                    {columnVisibility.remark !== false && (
                                        <td>{row.Remark || ""}</td>
                                    )}

                                    {/* DATE */}
                                    {columnVisibility.date !== false && (
                                        <td>{row.IssueDate || ""}</td>
                                    )}

                                    {/* SUPPLIER */}
                                    {columnVisibility.supplier !== false && (
                                        <td>{row.SupplierName || ""}</td>
                                    )}

                                    {/* ISSUED BY */}
                                    {columnVisibility.issuedBy !== false && (
                                        <td>{row.IssuedBy || ""}</td>
                                    )}

                                    {/* STORES */}
                                    {columnVisibility.stores !== false && (
                                        <td>{row.Stores || ""}</td>
                                    )}

                                    {/* MEMO FOR INTERNAL USE */}
                                    {columnVisibility.memo !== false && (
                                        <td>{row.InternalMemo || ""}</td>
                                    )}

                                    {/* CURRENCY */}
                                    {columnVisibility.currency !== false && (
                                        <td>{row.Currency || "INR"}</td>
                                    )}

                                    {/* EXPIRY DATE */}
                                    {columnVisibility.expiryDate !== false && (
                                        <td>{row.ExpiryDate || ""}</td>
                                    )}

                                    {/* JC NO */}
                                    {columnVisibility.jcNo !== false && (
                                        <td>{row.JCNo || ""}</td>
                                    )}

                                    {/* QTY */}
                                    {columnVisibility.qty !== false && (
                                        <td className="text-end">
                                            {Number(row.TotalQty || 0).toFixed(1)}
                                        </td>
                                    )}

                                    {/* NO. OF ROWS */}
                                    {columnVisibility.rowCount !== false && (
                                        <td className="text-end">
                                            {row.RowCount || 1}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}

                        {/* EMPTY SPREADSHEET GRID ROWS (Matches screenshot's authentic ERP grid lines) */}
                        {Array.from({ length: emptyRowsCount }).map((_, idx) => (
                            <tr key={`empty-${idx}`} className="empty-grid-row">
                                {ALL_COLUMNS.filter(c => columnVisibility[c.key] !== false).map(c => (
                                    <td key={c.key}>&nbsp;</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* =============================================================
                MODAL: NEW ITEM ISSUE
            ============================================================= */}
            {showNewModal && (
                <div className="ii-modal-backdrop" onClick={() => setShowNewModal(false)}>
                    <div className="ii-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="ii-modal-header">
                            <h5 className="ii-modal-title">New Item Issue</h5>
                            <button
                                type="button"
                                className="ii-modal-close-btn"
                                onClick={() => setShowNewModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSaveNew}>
                            <div className="ii-modal-body">
                                {/* Header Fields */}
                                <div className="ii-form-row">
                                    <div className="ii-form-col">
                                        <label className="ii-form-label">Issue No *</label>
                                        <input
                                            type="text"
                                            className="ii-form-control"
                                            value={newForm.IssueNo}
                                            onChange={(e) => setNewForm({ ...newForm, IssueNo: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="ii-form-col">
                                        <label className="ii-form-label">Issue Date *</label>
                                        <input
                                            type="text"
                                            className="ii-form-control"
                                            value={newForm.IssueDate}
                                            onChange={(e) => setNewForm({ ...newForm, IssueDate: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="ii-form-col">
                                        <label className="ii-form-label">Associate / Supplier</label>
                                        <input
                                            type="text"
                                            className="ii-form-control"
                                            placeholder="Enter supplier or select..."
                                            list="suppliersListDatalist"
                                            value={newForm.SupplierName}
                                            onChange={(e) => setNewForm({ ...newForm, SupplierName: e.target.value })}
                                        />
                                        <datalist id="suppliersListDatalist">
                                            {suppliersList.map(s => (
                                                <option key={s.value} value={s.label} />
                                            ))}
                                        </datalist>
                                    </div>

                                    <div className="ii-form-col">
                                        <label className="ii-form-label">Issued By</label>
                                        <input
                                            type="text"
                                            className="ii-form-control"
                                            value={newForm.IssuedBy}
                                            onChange={(e) => setNewForm({ ...newForm, IssuedBy: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="ii-form-row">
                                    <div className="ii-form-col">
                                        <label className="ii-form-label">Stores</label>
                                        <select
                                            className="ii-form-control"
                                            value={newForm.Stores}
                                            onChange={(e) => setNewForm({ ...newForm, Stores: e.target.value })}
                                        >
                                            <option value="RAW MATERIAL STORE 9B">RAW MATERIAL STORE 9B</option>
                                            <option value="SEMI FINISH STORE 9B">SEMI FINISH STORE 9B</option>
                                            <option value="SEMI FINISH STORE 18">SEMI FINISH STORE 18</option>
                                            <option value="FINISHED GOODS STORE">FINISHED GOODS STORE</option>
                                        </select>
                                    </div>

                                    <div className="ii-form-col">
                                        <label className="ii-form-label">JW No. (Job Work)</label>
                                        <input
                                            type="text"
                                            className="ii-form-control"
                                            placeholder="e.g. JW-9821"
                                            value={newForm.JWNo}
                                            onChange={(e) => setNewForm({ ...newForm, JWNo: e.target.value })}
                                        />
                                    </div>

                                    <div className="ii-form-col">
                                        <label className="ii-form-label">JC No. (Job Card)</label>
                                        <input
                                            type="text"
                                            className="ii-form-control"
                                            placeholder="e.g. JC-4512"
                                            value={newForm.JCNo}
                                            onChange={(e) => setNewForm({ ...newForm, JCNo: e.target.value })}
                                        />
                                    </div>

                                    <div className="ii-form-col">
                                        <label className="ii-form-label">Currency & Ex. Rate</label>
                                        <div className="d-flex gap-2">
                                            <select
                                                className="ii-form-control"
                                                style={{ width: "90px" }}
                                                value={newForm.Currency}
                                                onChange={(e) => setNewForm({ ...newForm, Currency: e.target.value })}
                                            >
                                                <option value="INR">INR</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                            </select>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="ii-form-control"
                                                placeholder="1.0"
                                                value={newForm.ExchangeRate}
                                                onChange={(e) => setNewForm({ ...newForm, ExchangeRate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="ii-form-row">
                                    <div className="ii-form-col">
                                        <label className="ii-form-label">Expiry Date</label>
                                        <input
                                            type="text"
                                            className="ii-form-control"
                                            placeholder="DD-MM-YYYY"
                                            value={newForm.ExpiryDate}
                                            onChange={(e) => setNewForm({ ...newForm, ExpiryDate: e.target.value })}
                                        />
                                    </div>

                                    <div className="ii-form-col">
                                        <label className="ii-form-label">Remark</label>
                                        <input
                                            type="text"
                                            className="ii-form-control"
                                            placeholder="e.g. Batch cutting issue"
                                            value={newForm.Remark}
                                            onChange={(e) => setNewForm({ ...newForm, Remark: e.target.value })}
                                        />
                                    </div>

                                    <div className="ii-form-col" style={{ gridColumn: "span 2" }}>
                                        <label className="ii-form-label">Memo for internal use</label>
                                        <input
                                            type="text"
                                            className="ii-form-control"
                                            placeholder="Internal department instructions"
                                            value={newForm.InternalMemo}
                                            onChange={(e) => setNewForm({ ...newForm, InternalMemo: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Items Section */}
                                <div className="d-flex justify-content-between align-items-center mt-3 mb-1">
                                    <strong style={{ color: "#1a5695", fontSize: "13px" }}>Line Items</strong>
                                    <button
                                        type="button"
                                        className="ii-btn-add-row"
                                        onClick={handleAddRow}
                                    >
                                        <FaPlus /> Add Item Row
                                    </button>
                                </div>

                                <div className="table-responsive">
                                    <table className="ii-items-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "35px" }}>#</th>
                                                <th style={{ width: "160px" }}>Item Code</th>
                                                <th>Item Name</th>
                                                <th style={{ width: "120px" }}>Color / Spec</th>
                                                <th style={{ width: "85px" }}>Qty *</th>
                                                <th style={{ width: "80px" }}>UOM</th>
                                                <th style={{ width: "85px" }}>Rate</th>
                                                <th>Remarks</th>
                                                <th style={{ width: "40px" }} className="text-center"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newForm.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            placeholder="Code"
                                                            value={item.ItemCode}
                                                            onChange={(e) => handleItemChange(idx, "ItemCode", e.target.value)}
                                                            required
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            placeholder="Description"
                                                            value={item.ItemName}
                                                            onChange={(e) => handleItemChange(idx, "ItemName", e.target.value)}
                                                            required
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            placeholder="Color"
                                                            value={item.Color}
                                                            onChange={(e) => handleItemChange(idx, "Color", e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            min="0.1"
                                                            placeholder="0"
                                                            value={item.Quantity}
                                                            onChange={(e) => handleItemChange(idx, "Quantity", e.target.value)}
                                                            required
                                                        />
                                                    </td>
                                                    <td>
                                                        <select
                                                            value={item.UOM}
                                                            onChange={(e) => handleItemChange(idx, "UOM", e.target.value)}
                                                        >
                                                            <option value="PCS">PCS</option>
                                                            <option value="SQFT">SQFT</option>
                                                            <option value="MTR">MTR</option>
                                                            <option value="SET">SET</option>
                                                            <option value="SHEET">SHEET</option>
                                                            <option value="KGS">KGS</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                            value={item.Rate}
                                                            onChange={(e) => handleItemChange(idx, "Rate", e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            placeholder="Line notes"
                                                            value={item.Remarks}
                                                            onChange={(e) => handleItemChange(idx, "Remarks", e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="text-center">
                                                        {newForm.items.length > 1 && (
                                                            <button
                                                                type="button"
                                                                className="ii-btn-del-row"
                                                                onClick={() => handleRemoveRow(idx)}
                                                                title="Delete row"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="ii-modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => setShowNewModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-sm btn-success px-3"
                                >
                                    <FaCheck className="me-1" /> Save Item Issue
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =============================================================
                MODAL: VIEW DETAILS
            ============================================================= */}
            {showDetailModal && activeRecord && (
                <div className="ii-modal-backdrop" onClick={() => setShowDetailModal(false)}>
                    <div className="ii-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="ii-modal-header">
                            <h5 className="ii-modal-title">Item Issue Details - {activeRecord.IssueNo}</h5>
                            <button
                                type="button"
                                className="ii-modal-close-btn"
                                onClick={() => setShowDetailModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="ii-modal-body">
                            <div className="row g-2 mb-3 p-3 bg-light rounded border">
                                <div className="col-md-3"><strong>Issue No:</strong> {activeRecord.IssueNo}</div>
                                <div className="col-md-3"><strong>Date:</strong> {activeRecord.IssueDate}</div>
                                <div className="col-md-3"><strong>Associate / Supplier:</strong> {activeRecord.SupplierName || "-"}</div>
                                <div className="col-md-3"><strong>Issued By:</strong> {activeRecord.IssuedBy || "-"}</div>
                                <div className="col-md-3"><strong>Stores:</strong> {activeRecord.Stores || "-"}</div>
                                <div className="col-md-3"><strong>JW No.:</strong> {activeRecord.JWNo || "-"}</div>
                                <div className="col-md-3"><strong>JC No.:</strong> {activeRecord.JCNo || "-"}</div>
                                <div className="col-md-3"><strong>Currency:</strong> {activeRecord.Currency || "INR"} ({Number(activeRecord.ExchangeRate || 1.0).toFixed(1)})</div>
                                <div className="col-md-3"><strong>Expiry Date:</strong> {activeRecord.ExpiryDate || "-"}</div>
                                <div className="col-md-3"><strong>Total Quantity:</strong> <span className="badge bg-primary">{activeRecord.TotalQty}</span></div>
                                <div className="col-md-6"><strong>Remark:</strong> {activeRecord.Remark || "-"}</div>
                                <div className="col-md-12"><strong>Memo for internal use:</strong> {activeRecord.InternalMemo || "-"}</div>
                            </div>

                            <h6 className="fw-bold text-primary mt-3 mb-2">Issued Line Items ({activeRecord.RowCount || (activeRecord.details || []).length} rows)</h6>
                            <div className="table-responsive">
                                <table className="table table-bordered table-sm mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>#</th>
                                            <th>Item Code</th>
                                            <th>Item Name</th>
                                            <th>Color</th>
                                            <th className="text-end">Quantity</th>
                                            <th>UOM</th>
                                            <th className="text-end">Rate</th>
                                            <th className="text-end">Amount</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(activeRecord.details || []).length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="text-center text-muted py-3">No detail records available</td>
                                            </tr>
                                        ) : (
                                            activeRecord.details.map((d, i) => (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td><strong>{d.ItemCode || "-"}</strong></td>
                                                    <td>{d.ItemName || "-"}</td>
                                                    <td>{d.Color || "-"}</td>
                                                    <td className="text-end fw-bold text-primary">{d.Quantity}</td>
                                                    <td>{d.UOM || "PCS"}</td>
                                                    <td className="text-end">{d.Rate ? Number(d.Rate).toFixed(2) : "-"}</td>
                                                    <td className="text-end">{d.Amount ? Number(d.Amount).toFixed(2) : "-"}</td>
                                                    <td>{d.Remarks || "-"}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="ii-modal-footer">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handlePrint(activeRecord)}
                            >
                                <FaPrint className="me-1" /> Print Voucher
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm btn-secondary"
                                onClick={() => setShowDetailModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =============================================================
                MODAL: EDIT ITEM ISSUE
            ============================================================= */}
            {showEditModal && activeRecord && (
                <div className="ii-modal-backdrop" onClick={() => setShowEditModal(false)}>
                    <div className="ii-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="ii-modal-header">
                            <h5 className="ii-modal-title">Edit Item Issue - {activeRecord.IssueNo}</h5>
                            <button
                                type="button"
                                className="ii-modal-close-btn"
                                onClick={() => setShowEditModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit}>
                            <div className="ii-modal-body">
                                <div className="ii-form-row">
                                    <div className="ii-form-col">
                                        <label className="ii-form-label">Issue No</label>
                                        <input
                                            type="text"
                                            className="ii-form-control"
                                            value={activeRecord.IssueNo}
                                            readOnly
                                        />
                                    </div>

                                    <div className="ii-form-col">
                                        <label className="ii-form-label">Issue Date</label>
                                        <input
                                            type="text"
                                            className="ii-form-control"
                                            value={activeRecord.IssueDate || ""}
                                            onChange={(e) => setActiveRecord({ ...activeRecord, IssueDate: e.target.value })}
                                        />
                                    </div>

                                    <div className="ii-form-col">
                                        <label className="ii-form-label">Associate / Supplier</label>
                                        <input
                                            type="text"
                                            className="ii-form-control"
                                            value={activeRecord.SupplierName || ""}
                                            onChange={(e) => setActiveRecord({ ...activeRecord, SupplierName: e.target.value })}
                                        />
                                    </div>

                                    <div className="ii-form-col">
                                        <label className="ii-form-label">Issued By</label>
                                        <input
                                            type="text"
                                            className="ii-form-control"
                                            value={activeRecord.IssuedBy || ""}
                                            onChange={(e) => setActiveRecord({ ...activeRecord, IssuedBy: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="ii-form-row">
                                    <div className="ii-form-col">
                                        <label className="ii-form-label">Stores</label>
                                        <select
                                            className="ii-form-control"
                                            value={activeRecord.Stores || ""}
                                            onChange={(e) => setActiveRecord({ ...activeRecord, Stores: e.target.value })}
                                        >
                                            <option value="RAW MATERIAL STORE 9B">RAW MATERIAL STORE 9B</option>
                                            <option value="SEMI FINISH STORE 9B">SEMI FINISH STORE 9B</option>
                                            <option value="SEMI FINISH STORE 18">SEMI FINISH STORE 18</option>
                                            <option value="FINISHED GOODS STORE">FINISHED GOODS STORE</option>
                                        </select>
                                    </div>

                                    <div className="ii-form-col">
                                        <label className="ii-form-label">JW No.</label>
                                        <input
                                            type="text"
                                            className="ii-form-control"
                                            value={activeRecord.JWNo || ""}
                                            onChange={(e) => setActiveRecord({ ...activeRecord, JWNo: e.target.value })}
                                        />
                                    </div>

                                    <div className="ii-form-col">
                                        <label className="ii-form-label">JC No.</label>
                                        <input
                                            type="text"
                                            className="ii-form-control"
                                            value={activeRecord.JCNo || ""}
                                            onChange={(e) => setActiveRecord({ ...activeRecord, JCNo: e.target.value })}
                                        />
                                    </div>

                                    <div className="ii-form-col">
                                        <label className="ii-form-label">Remark</label>
                                        <input
                                            type="text"
                                            className="ii-form-control"
                                            value={activeRecord.Remark || ""}
                                            onChange={(e) => setActiveRecord({ ...activeRecord, Remark: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="ii-form-row">
                                    <div className="ii-form-col" style={{ gridColumn: "span 2" }}>
                                        <label className="ii-form-label">Memo for internal use</label>
                                        <input
                                            type="text"
                                            className="ii-form-control"
                                            value={activeRecord.InternalMemo || ""}
                                            onChange={(e) => setActiveRecord({ ...activeRecord, InternalMemo: e.target.value })}
                                        />
                                    </div>

                                    <div className="ii-form-col">
                                        <label className="ii-form-label">Expiry Date</label>
                                        <input
                                            type="text"
                                            className="ii-form-control"
                                            value={activeRecord.ExpiryDate || ""}
                                            onChange={(e) => setActiveRecord({ ...activeRecord, ExpiryDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Line items editing */}
                                <div className="d-flex justify-content-between align-items-center mt-3 mb-1">
                                    <strong style={{ color: "#1a5695", fontSize: "13px" }}>Line Items</strong>
                                    <button
                                        type="button"
                                        className="ii-btn-add-row"
                                        onClick={() => {
                                            const items = activeRecord.details || [];
                                            setActiveRecord({
                                                ...activeRecord,
                                                details: [
                                                    ...items,
                                                    { ItemCode: "", ItemName: "", Color: "", Quantity: 1, UOM: "PCS", Rate: 0, Remarks: "" }
                                                ]
                                            });
                                        }}
                                    >
                                        <FaPlus /> Add Item Row
                                    </button>
                                </div>

                                <div className="table-responsive">
                                    <table className="ii-items-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "35px" }}>#</th>
                                                <th style={{ width: "160px" }}>Item Code</th>
                                                <th>Item Name</th>
                                                <th style={{ width: "120px" }}>Color</th>
                                                <th style={{ width: "85px" }}>Qty</th>
                                                <th style={{ width: "80px" }}>UOM</th>
                                                <th>Remarks</th>
                                                <th style={{ width: "40px" }} className="text-center"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(activeRecord.details || []).map((d, i) => (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={d.ItemCode || ""}
                                                            onChange={(e) => {
                                                                const copy = [...activeRecord.details];
                                                                copy[i].ItemCode = e.target.value;
                                                                setActiveRecord({ ...activeRecord, details: copy });
                                                            }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={d.ItemName || ""}
                                                            onChange={(e) => {
                                                                const copy = [...activeRecord.details];
                                                                copy[i].ItemName = e.target.value;
                                                                setActiveRecord({ ...activeRecord, details: copy });
                                                            }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={d.Color || ""}
                                                            onChange={(e) => {
                                                                const copy = [...activeRecord.details];
                                                                copy[i].Color = e.target.value;
                                                                setActiveRecord({ ...activeRecord, details: copy });
                                                            }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            value={d.Quantity || ""}
                                                            onChange={(e) => {
                                                                const copy = [...activeRecord.details];
                                                                copy[i].Quantity = e.target.value;
                                                                setActiveRecord({ ...activeRecord, details: copy });
                                                            }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={d.UOM || "PCS"}
                                                            onChange={(e) => {
                                                                const copy = [...activeRecord.details];
                                                                copy[i].UOM = e.target.value;
                                                                setActiveRecord({ ...activeRecord, details: copy });
                                                            }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={d.Remarks || ""}
                                                            onChange={(e) => {
                                                                const copy = [...activeRecord.details];
                                                                copy[i].Remarks = e.target.value;
                                                                setActiveRecord({ ...activeRecord, details: copy });
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="text-center">
                                                        <button
                                                            type="button"
                                                            className="ii-btn-del-row"
                                                            onClick={() => {
                                                                const copy = activeRecord.details.filter((_, idx) => idx !== i);
                                                                setActiveRecord({ ...activeRecord, details: copy });
                                                            }}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="ii-modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-sm btn-primary px-3"
                                >
                                    Update Issue
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}