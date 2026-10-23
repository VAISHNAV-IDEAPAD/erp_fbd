import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    FaCog,
    FaCalendarAlt,
    FaListUl,
    FaPlus,
    FaTrash,
    FaSave,
    FaEye,
    FaCaretDown,
    FaPaperclip,
    FaPrint,
    FaRedo,
    FaFileExport,
    FaTimes,
    FaSearch,
    FaArrowLeft,
    FaCheckCircle
} from "react-icons/fa";
import "../../styles/itemIssue.css";

const API_URL = process.env.REACT_APP_API_URL || "/api";

// Seed/mock items for lookup
const DEFAULT_ITEMS = [
    { ItemCode: "LTH-1093", ItemName: "COW CULATTAS SINGLE LEATHER", GroupName: "Leather", Color: "BLACK", UOM: "SQFT", StockQty: 450, Rate: 145 },
    { ItemCode: "LTH-1112", ItemName: "COW ECO VEG SIDE CRUST LEATHER", GroupName: "Leather", Color: "TAN", UOM: "SQFT", StockQty: 280, Rate: 160 },
    { ItemCode: "HDW-2236", ItemName: "JAM RIVET SINGLE HEAD 7MM", GroupName: "Hardware", Color: "ANTIQUE BRASS", UOM: "SET", StockQty: 5000, Rate: 1.85 },
    { ItemCode: "RNF-1085", ItemName: "HIGH DENSITY TOPLINER 0.4MM", GroupName: "Lining", Color: "BLACK", UOM: "MTR", StockQty: 1200, Rate: 32.5 },
    { ItemCode: "NONWO5064", ItemName: "TALIN 0.3MM WHITE", GroupName: "Reinforcement", Color: "WHITE", UOM: "MTR", StockQty: 640, Rate: 24.0 },
    { ItemCode: "PKG-2200", ItemName: "CARD PAPER 350G 31X43 INCH", GroupName: "Packaging", Color: "NATURAL", UOM: "SHEET", StockQty: 850, Rate: 8.5 },
    { ItemCode: "THR-0021", ItemName: "BONDED NYLON THREAD #40", GroupName: "Thread", Color: "BLACK", UOM: "CONE", StockQty: 120, Rate: 95.0 }
];

const DEFAULT_WAREHOUSES = [
    "RAW MATERIAL STORE 9B",
    "SEMI FINISH STORE 9B",
    "LEATHER WAREHOUSE PLOT 9B",
    "ACCESSORIES GODOWN 18",
    "MAIN FINISHED GOODS STORE"
];

const DEFAULT_SUPPLIERS = [
    "Apex Leather Works",
    "Balaji Trims & Fasteners",
    "Supreme Leathercraft",
    "K-Tex Textiles",
    "Prime Leather Tanning",
    "Vardhman Yarns & Threads",
    "Shree Ganesh Fabrics"
];

const DEFAULT_DEPARTMENTS = [
    "Production",
    "Cutting",
    "Stitching",
    "Assembly",
    "Finishing",
    "Quality Control",
    "Packaging"
];

const DEFAULT_REQUISITIONS = [
    { reqNo: "REQ-2627-0104", date: "22-10-2026", dept: "Cutting", requestedBy: "Suresh Patel", totalItems: 3 },
    { reqNo: "REQ-2627-0103", date: "21-10-2026", dept: "Stitching", requestedBy: "Ramesh Kumar", totalItems: 2 },
    { reqNo: "REQ-2627-0102", date: "20-10-2026", dept: "Finishing", requestedBy: "Pooja Verma", totalItems: 5 }
];

const DEFAULT_JOBCARDS = [
    { jcNo: "JC-4512", slipNo: "CS-9041", style: "Oxford Classic Boot", buyer: "Clarks UK", orderQty: 1200 },
    { jcNo: "JC-4509", slipNo: "CS-9038", style: "Chelsea Suede Brown", buyer: "Zara Man", orderQty: 850 },
    { jcNo: "JC-4498", slipNo: "CS-9032", style: "Derby Formal Black", buyer: "Marks & Spencer", orderQty: 500 }
];

const DEFAULT_CUTTING_PLANS = [
    { planNo: "CP-2627-044", jcNo: "JC-4512", date: "22-10-2026", pairs: 1200 },
    { planNo: "CP-2627-043", jcNo: "JC-4509", date: "20-10-2026", pairs: 850 },
    { planNo: "CP-2627-042", jcNo: "JC-4498", date: "18-10-2026", pairs: 500 }
];

const INITIAL_SAVED_ISSUES = [
    {
        id: 1,
        issueNo: "ISSP/AAPL9B/2627/2003",
        date: "22-10-2026",
        issueTo: "Production",
        associate: "Apex Leather Works",
        department: "Cutting",
        stores: "RAW MATERIAL STORE 9B",
        issuedBy: "Nikhil Singh",
        receivedBy: "Ramesh Kumar",
        requisitionNo: "REQ-2627-0104",
        jobcardNo: "JC-4512",
        cuttingPlanNo: "CP-2627-044",
        remark: "Batch 104 Cutting leather issue",
        internalMemo: "Bulk cutting line 1",
        totalQty: 185.5,
        totalAmount: 27872.5,
        status: "Completed",
        items: [
            { id: 1, issueType: "Lot Issue", ioNo: "IO-9821", group: "Leather", item: "COW CULATTAS SINGLE LEATHER", description: "Upper cutting leather", colour: "BLACK", typeSize: "A Grade", uom: "SQFT", stockQty: 450, issueQty: 120.5, rate: 145, amount: 17472.5, remarks: "Checked by QC" },
            { id: 2, issueType: "Lot Issue", ioNo: "IO-9821", group: "Leather", item: "COW ECO VEG SIDE CRUST LEATHER", description: "Counter reinforcement", colour: "TAN", typeSize: "Standard", uom: "SQFT", stockQty: 280, issueQty: 65, rate: 160, amount: 10400, remarks: "" }
        ]
    },
    {
        id: 2,
        issueNo: "ISSP/AAPL9B/2627/2002",
        date: "21-10-2026",
        issueTo: "Production",
        associate: "Balaji Trims & Fasteners",
        department: "Assembly",
        stores: "SEMI FINISH STORE 9B",
        issuedBy: "Nikhil Singh",
        receivedBy: "Pooja Verma",
        requisitionNo: "REQ-2627-0103",
        jobcardNo: "JC-4509",
        cuttingPlanNo: "CP-2627-043",
        remark: "Urgent hardware issue",
        internalMemo: "Line 2 assembly run",
        totalQty: 450,
        totalAmount: 832.5,
        status: "Completed",
        items: [
            { id: 1, issueType: "Lot Issue", ioNo: "IO-9818", group: "Hardware", item: "JAM RIVET SINGLE HEAD 7MM", description: "Riveting section", colour: "ANTIQUE BRASS", typeSize: "7mm", uom: "SET", stockQty: 5000, issueQty: 450, rate: 1.85, amount: 832.5, remarks: "" }
        ]
    }
];

export default function ItemIssue({ initialMode = "form" }) {
    // View mode: 'form' (matches screenshots) or 'list' (registers)
    const [viewMode, setViewMode] = useState(initialMode);

    // Form Header State (matches Screenshot 1)
    const [issueTo, setIssueTo] = useState("Production");
    const [issuePrefix, setIssuePrefix] = useState("ISSP/AAPL9B/2627/");
    const [issueSerial, setIssueSerial] = useState("2004");
    const [issueDate, setIssueDate] = useState(() => {
        const d = new Date();
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    });

    const [associate, setAssociate] = useState("");
    const [receivedBy, setReceivedBy] = useState("");
    const [department, setDepartment] = useState("");
    const [stores, setStores] = useState("");
    const [issuedBy, setIssuedBy] = useState("Admin");
    const [requisitionNo, setRequisitionNo] = useState("");
    const [jobcardNo, setJobcardNo] = useState("");
    const [cuttingPlanNo, setCuttingPlanNo] = useState("");

    // Table Lines State (matches Screenshot 1 & 2)
    const [lines, setLines] = useState([
        {
            id: 1,
            selected: false,
            issueType: "Lot Issue",
            ioNo: "",
            group: "",
            item: "",
            description: "",
            colour: "",
            typeSize: "",
            uom: "PCS",
            stockQty: 0,
            issueQty: "",
            rate: "",
            amount: 0,
            remarks: ""
        }
    ]);

    // Footer State (matches Screenshot 2)
    const [remark, setRemark] = useState("");
    const [internalMemo, setInternalMemo] = useState("");
    const [attachments, setAttachments] = useState([]);

    // Action menu dropdown state
    const [showActionMenu, setShowActionMenu] = useState(false);
    const actionBtnRef = useRef(null);

    // Saved list records
    const [savedIssues, setSavedIssues] = useState(INITIAL_SAVED_ISSUES);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeRecord, setActiveRecord] = useState(null);

    // Modals
    const [activeModal, setActiveModal] = useState(null); // 'requisition' | 'jobcard' | 'plan' | 'attach' | 'settings' | 'print'
    const [successMessage, setSuccessMessage] = useState("");

    // Load registered lists from backend on mount
    useEffect(() => {
        let mounted = true;
        axios.get(`${API_URL}/item-issues`)
            .then(res => {
                const data = res.data?.data || res.data;
                if (mounted && Array.isArray(data) && data.length > 0) {
                    // Normalize backend records
                    const mapped = data.map((d, i) => ({
                        id: d.IssueID || d.id || i + 1,
                        issueNo: d.IssueNo || `ISSP/AAPL9B/2627/${2000 + i}`,
                        date: d.IssueDate || "23-10-2026",
                        issueTo: d.IssueTo || "Production",
                        associate: d.SupplierName || d.associate || "",
                        department: d.Department || d.department || "Production",
                        stores: d.Stores || d.stores || "RAW MATERIAL STORE 9B",
                        issuedBy: d.IssuedBy || "Admin",
                        receivedBy: d.ReceivedBy || "",
                        requisitionNo: d.RequisitionNo || "",
                        jobcardNo: d.JCNo || d.jobcardNo || "",
                        cuttingPlanNo: d.CuttingPlanNo || "",
                        remark: d.Remark || "",
                        internalMemo: d.InternalMemo || "",
                        totalQty: d.TotalQty || 0,
                        totalAmount: d.TotalAmount || 0,
                        status: d.Status || "Completed",
                        items: d.details || []
                    }));
                    setSavedIssues(mapped);
                }
            })
            .catch(() => {});
        return () => { mounted = false; };
    }, []);

    // Close action dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (actionBtnRef.current && !actionBtnRef.current.contains(e.target)) {
                setShowActionMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Auto-calculate totals
    const totalQty = lines.reduce((acc, row) => acc + (parseFloat(row.issueQty) || 0), 0);
    const totalAmount = lines.reduce((acc, row) => acc + (parseFloat(row.amount) || 0), 0);

    // Line items change handler
    const handleLineChange = (id, field, value) => {
        setLines(prev => prev.map(row => {
            if (row.id !== id) return row;
            const updated = { ...row, [field]: value };

            // If item changed, autofill group, colour, UOM, stockQty, rate
            if (field === "item") {
                const found = DEFAULT_ITEMS.find(it =>
                    it.ItemName.toLowerCase() === String(value).toLowerCase() ||
                    it.ItemCode.toLowerCase() === String(value).toLowerCase()
                );
                if (found) {
                    updated.item = found.ItemName;
                    updated.group = found.GroupName || updated.group;
                    updated.colour = found.Color || updated.colour;
                    updated.uom = found.UOM || updated.uom;
                    updated.stockQty = found.StockQty || 0;
                    updated.rate = found.Rate || updated.rate;
                    if (updated.issueQty && updated.rate) {
                        updated.amount = parseFloat((parseFloat(updated.issueQty) * parseFloat(updated.rate)).toFixed(2));
                    }
                }
            }

            // If issueQty or rate changed, recompute amount
            if (field === "issueQty" || field === "rate") {
                const qty = field === "issueQty" ? parseFloat(value) || 0 : parseFloat(row.issueQty) || 0;
                const rate = field === "rate" ? parseFloat(value) || 0 : parseFloat(row.rate) || 0;
                updated.amount = parseFloat((qty * rate).toFixed(2));
            }

            return updated;
        }));
    };

    // Add another row
    const handleAddLine = () => {
        const nextId = lines.length > 0 ? Math.max(...lines.map(l => l.id)) + 1 : 1;
        setLines(prev => [
            ...prev,
            {
                id: nextId,
                selected: false,
                issueType: "Lot Issue",
                ioNo: "",
                group: "",
                item: "",
                description: "",
                colour: "",
                typeSize: "",
                uom: "PCS",
                stockQty: 0,
                issueQty: "",
                rate: "",
                amount: 0,
                remarks: ""
            }
        ]);
    };

    // Delete single line
    const handleDeleteLine = (id) => {
        if (lines.length <= 1) {
            setLines([{
                id: 1,
                selected: false,
                issueType: "Lot Issue",
                ioNo: "",
                group: "",
                item: "",
                description: "",
                colour: "",
                typeSize: "",
                uom: "PCS",
                stockQty: 0,
                issueQty: "",
                rate: "",
                amount: 0,
                remarks: ""
            }]);
            return;
        }
        setLines(prev => prev.filter(r => r.id !== id));
    };

    // Toggle select all lines
    const handleSelectAll = (checked) => {
        setLines(prev => prev.map(r => ({ ...r, selected: checked })));
    };

    // Display button action
    const handleDisplay = () => {
        // Load items based on selection
        if (jobcardNo || requisitionNo) {
            setLines(DEFAULT_ITEMS.slice(0, 3).map((it, idx) => ({
                id: idx + 1,
                selected: false,
                issueType: "Lot Issue",
                ioNo: jobcardNo ? "IO-9821" : "IO-9805",
                group: it.GroupName,
                item: it.ItemName,
                description: `${it.ItemName} for ${jobcardNo || requisitionNo}`,
                colour: it.Color,
                typeSize: "Standard",
                uom: it.UOM,
                stockQty: it.StockQty,
                issueQty: 25 + idx * 10,
                rate: it.Rate,
                amount: (25 + idx * 10) * it.Rate,
                remarks: "Auto loaded via Display"
            })));
        } else {
            alert("Select a Jobcard, Cutting Plan, or Requisition to populate line items, or enter line items manually.");
        }
    };

    // Save Item Issue
    const handleSave = async () => {
        if (!stores.trim()) {
            alert("Please enter or select a Store/Warehouse (marked with *).");
            return;
        }

        const validLines = lines.filter(l => l.item.trim() || l.issueQty);
        if (validLines.length === 0) {
            alert("Please add at least one Item with Issue Quantity.");
            return;
        }

        const fullIssueNo = `${issuePrefix}${issueSerial}`;
        const newRecord = {
            id: Date.now(),
            issueNo: fullIssueNo,
            date: issueDate,
            issueTo,
            associate,
            department: department || "Production",
            stores,
            issuedBy,
            receivedBy,
            requisitionNo,
            jobcardNo,
            cuttingPlanNo,
            remark,
            internalMemo,
            totalQty,
            totalAmount,
            status: "Completed",
            items: lines
        };

        // Attempt backend save
        try {
            await axios.post(`${API_URL}/item-issues`, {
                IssueNo: fullIssueNo,
                IssueDate: issueDate,
                IssueTo: issueTo,
                SupplierName: associate,
                Department: department,
                Stores: stores,
                IssuedBy: issuedBy,
                ReceivedBy: receivedBy,
                JCNo: jobcardNo,
                Remark: remark,
                InternalMemo: internalMemo,
                TotalQty: totalQty,
                TotalAmount: totalAmount,
                details: lines.map(l => ({
                    ItemName: l.item,
                    ItemCode: l.item,
                    Color: l.colour,
                    Quantity: parseFloat(l.issueQty) || 0,
                    UOM: l.uom,
                    Rate: parseFloat(l.rate) || 0,
                    Amount: parseFloat(l.amount) || 0,
                    Remarks: l.remarks
                }))
            });
        } catch (e) {
            console.warn("Backend API not reachable, saved to local state:", e.message);
        }

        setSavedIssues(prev => [newRecord, ...prev]);
        setSuccessMessage(`Item Issue ${fullIssueNo} saved successfully!`);

        // Increment serial
        setIssueSerial(prev => String(parseInt(prev, 10) + 1));

        setTimeout(() => setSuccessMessage(""), 4000);
    };

    // Clear form
    const handleResetForm = () => {
        setAssociate("");
        setReceivedBy("");
        setDepartment("");
        setStores("");
        setRequisitionNo("");
        setJobcardNo("");
        setCuttingPlanNo("");
        setRemark("");
        setInternalMemo("");
        setLines([
            {
                id: 1,
                selected: false,
                issueType: "Lot Issue",
                ioNo: "",
                group: "",
                item: "",
                description: "",
                colour: "",
                typeSize: "",
                uom: "PCS",
                stockQty: 0,
                issueQty: "",
                rate: "",
                amount: 0,
                remarks: ""
            }
        ]);
        setShowActionMenu(false);
    };

    // Filtered list records for list view
    const filteredIssues = savedIssues.filter(item => {
        const q = searchTerm.toLowerCase();
        return (
            item.issueNo.toLowerCase().includes(q) ||
            item.associate.toLowerCase().includes(q) ||
            item.stores.toLowerCase().includes(q) ||
            item.department.toLowerCase().includes(q) ||
            item.date.toLowerCase().includes(q)
        );
    });

    return (
        <div className="tpcs-item-issue-container">

            {/* Success notification banner */}
            {successMessage && (
                <div style={{
                    background: "#ecfdf5",
                    border: "1px solid #10b981",
                    color: "#065f46",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    marginBottom: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: 600
                }}>
                    <FaCheckCircle style={{ color: "#10b981" }} />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* ==========================================================
               MODE: FORM VIEW (EXACT REPLICA OF SCREENSHOT 1 & 2)
            =========================================================== */}
            {viewMode === "form" && (
                <div>
                    {/* Header: Title in blue */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <h1 className="tpcs-ii-title">Item Issue</h1>

                        <button
                            type="button"
                            className="tpcs-ii-btn-view"
                            onClick={() => setViewMode("list")}
                            title="Switch to Item Issue Register"
                        >
                            <FaEye /> <span>View Register</span>
                        </button>
                    </div>

                    {/* Issue To Row matching Screenshot 1 */}
                    <div className="tpcs-ii-issue-to-row">
                        <label className="tpcs-ii-label">Issue To</label>
                        <select
                            className="tpcs-ii-select"
                            value={issueTo}
                            onChange={(e) => setIssueTo(e.target.value)}
                        >
                            <option value="Production">Production</option>
                            <option value="General">General</option>
                            <option value="Jobwork">Jobwork</option>
                            <option value="Department">Department</option>
                            <option value="Sample Development">Sample Development</option>
                        </select>
                    </div>

                    {/* 4-Columns Grid matching Screenshot 1 */}
                    <div className="tpcs-ii-grid">
                        {/* COLUMN 1 */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">IssueNo</label>
                            <div className="tpcs-ii-issueno-group">
                                <select
                                    className="tpcs-ii-issueno-prefix"
                                    value={issuePrefix}
                                    onChange={(e) => setIssuePrefix(e.target.value)}
                                >
                                    <option value="ISSP/AAPL9B/2627/">ISSP/AAPL9B/2627/</option>
                                    <option value="ISSG/AAPL9B/2627/">ISSG/AAPL9B/2627/</option>
                                    <option value="ISJ/AAPL9B/2627/">ISJ/AAPL9B/2627/</option>
                                </select>
                                <input
                                    type="text"
                                    className="tpcs-ii-issueno-num"
                                    value={issueSerial}
                                    onChange={(e) => setIssueSerial(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="tpcs-ii-addon-btn btn-gear"
                                    title="Prefix & Numbering Settings"
                                    onClick={() => setActiveModal("settings")}
                                >
                                    <FaCog />
                                </button>
                            </div>
                        </div>

                        {/* COLUMN 2 */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">Associate</label>
                            <input
                                type="text"
                                className="tpcs-ii-input"
                                placeholder="Type and select Supplier"
                                value={associate}
                                onChange={(e) => setAssociate(e.target.value)}
                                list="suppliers-datalist"
                            />
                            <datalist id="suppliers-datalist">
                                {DEFAULT_SUPPLIERS.map(s => <option key={s} value={s} />)}
                            </datalist>
                        </div>

                        {/* COLUMN 3 */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">Received By</label>
                            <input
                                type="text"
                                className="tpcs-ii-input"
                                placeholder="Enter Received By"
                                value={receivedBy}
                                onChange={(e) => setReceivedBy(e.target.value)}
                            />
                        </div>

                        {/* COLUMN 4 */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">Department</label>
                            <input
                                type="text"
                                className="tpcs-ii-input"
                                placeholder="Type and select Department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                list="depts-datalist"
                            />
                            <datalist id="depts-datalist">
                                {DEFAULT_DEPARTMENTS.map(d => <option key={d} value={d} />)}
                            </datalist>
                        </div>

                        {/* ROW 2 - COL 1: Date */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">
                                Date <span className="tpcs-ii-req">*</span>
                            </label>
                            <div className="tpcs-ii-input-group">
                                <input
                                    type="text"
                                    className="tpcs-ii-input"
                                    value={issueDate}
                                    onChange={(e) => setIssueDate(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="tpcs-ii-addon-btn"
                                    title="Select Date"
                                    onClick={() => {
                                        const d = prompt("Enter Date (DD-MM-YYYY):", issueDate);
                                        if (d) setIssueDate(d);
                                    }}
                                >
                                    <FaCalendarAlt />
                                </button>
                            </div>
                        </div>

                        {/* ROW 2 - COL 2: Stores */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">
                                Stores <span className="tpcs-ii-req">*</span>
                            </label>
                            <input
                                type="text"
                                className="tpcs-ii-input"
                                placeholder="Type and select Warehouse"
                                value={stores}
                                onChange={(e) => setStores(e.target.value)}
                                list="stores-datalist"
                            />
                            <datalist id="stores-datalist">
                                {DEFAULT_WAREHOUSES.map(w => <option key={w} value={w} />)}
                            </datalist>
                        </div>

                        {/* ROW 2 - COL 3: Issued By */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">Issued By</label>
                            <input
                                type="text"
                                className="tpcs-ii-input"
                                placeholder="Enter Issued By"
                                value={issuedBy}
                                onChange={(e) => setIssuedBy(e.target.value)}
                            />
                        </div>

                        {/* ROW 2 - COL 4: Requisition No */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">Requisition No</label>
                            <div className="tpcs-ii-input-group">
                                <input
                                    type="text"
                                    className="tpcs-ii-input"
                                    placeholder="Select Requisition No"
                                    value={requisitionNo}
                                    onChange={(e) => setRequisitionNo(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="tpcs-ii-addon-btn"
                                    title="Select Requisition No"
                                    onClick={() => setActiveModal("requisition")}
                                >
                                    <FaListUl />
                                </button>
                            </div>
                        </div>

                        {/* ROW 3 - COL 1: Cutting Slip, Jobcard No */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">Cutting Slip,Jobcard No</label>
                            <div className="tpcs-ii-input-group">
                                <input
                                    type="text"
                                    className="tpcs-ii-input"
                                    placeholder="Select Cutting Slip,Jobcard No"
                                    value={jobcardNo}
                                    onChange={(e) => setJobcardNo(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="tpcs-ii-addon-btn"
                                    title="Select Cutting Slip / Jobcard"
                                    onClick={() => setActiveModal("jobcard")}
                                >
                                    <FaListUl />
                                </button>
                            </div>
                        </div>

                        {/* ROW 3 - COL 2: Cutting Plan No */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">Cutting Plan No</label>
                            <div className="tpcs-ii-input-group">
                                <input
                                    type="text"
                                    className="tpcs-ii-input"
                                    placeholder="Select Cutting Plan No"
                                    value={cuttingPlanNo}
                                    onChange={(e) => setCuttingPlanNo(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="tpcs-ii-addon-btn"
                                    title="Select Cutting Plan No"
                                    onClick={() => setActiveModal("plan")}
                                >
                                    <FaListUl />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Display Button matching Screenshot 1 */}
                    <div className="tpcs-ii-display-row">
                        <button
                            type="button"
                            className="tpcs-ii-btn-display"
                            onClick={handleDisplay}
                        >
                            Display
                        </button>
                    </div>

                    {/* ==========================================================
                       LINE ITEMS TABLE (MATCHING SCREENSHOT 1 & 2)
                    =========================================================== */}
                    <div className="tpcs-ii-table-container">
                        <table className="tpcs-ii-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "32px", textAlign: "center" }}>
                                        <input
                                            type="checkbox"
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                        />
                                    </th>
                                    <th style={{ width: "120px" }}>Issue Type</th>
                                    <th style={{ width: "180px" }}>IO No.</th>
                                    <th style={{ width: "140px" }}>Group</th>
                                    <th style={{ width: "200px" }}>Item <span className="tpcs-ii-req">*</span></th>
                                    <th style={{ width: "180px" }}>Description</th>
                                    <th style={{ width: "130px" }}>Colour</th>
                                    <th style={{ width: "110px" }}>Type & Size</th>
                                    <th style={{ width: "80px" }}>UOM</th>
                                    <th style={{ width: "90px" }}>Stock Qty</th>
                                    <th style={{ width: "100px" }}>Issue Qty <span className="tpcs-ii-req">*</span></th>
                                    <th style={{ width: "90px" }}>Rate</th>
                                    <th style={{ width: "100px" }}>Amount</th>
                                    <th style={{ width: "130px" }}>Remarks</th>
                                    <th style={{ width: "50px", textAlign: "center" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lines.map((row) => (
                                    <tr key={row.id}>
                                        <td style={{ textAlign: "center" }}>
                                            <input
                                                type="checkbox"
                                                checked={row.selected || false}
                                                onChange={(e) => handleLineChange(row.id, "selected", e.target.checked)}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                className="tpcs-ii-tbl-select"
                                                value={row.issueType}
                                                onChange={(e) => handleLineChange(row.id, "issueType", e.target.value)}
                                            >
                                                <option value="Lot Issue">Lot Issue</option>
                                                <option value="General Issue">General Issue</option>
                                                <option value="Direct Issue">Direct Issue</option>
                                                <option value="Sample Issue">Sample Issue</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div className="tpcs-ii-tbl-io-group">
                                                <input
                                                    type="text"
                                                    className="tpcs-ii-tbl-input"
                                                    placeholder="Enter IO No"
                                                    value={row.ioNo}
                                                    onChange={(e) => handleLineChange(row.id, "ioNo", e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    className="tpcs-ii-addon-btn"
                                                    style={{ height: "27px", padding: "0 6px" }}
                                                    onClick={() => {
                                                        const io = prompt("Enter IO No:", row.ioNo || "IO-9821");
                                                        if (io) handleLineChange(row.id, "ioNo", io);
                                                    }}
                                                >
                                                    <FaListUl style={{ fontSize: "10px" }} />
                                                </button>
                                                <div className="tpcs-ii-tbl-code-box"></div>
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="tpcs-ii-tbl-input"
                                                placeholder="Type and Select Group"
                                                value={row.group}
                                                onChange={(e) => handleLineChange(row.id, "group", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="tpcs-ii-tbl-input"
                                                placeholder="Type and select Item"
                                                value={row.item}
                                                onChange={(e) => handleLineChange(row.id, "item", e.target.value)}
                                                list={`items-datalist-${row.id}`}
                                            />
                                            <datalist id={`items-datalist-${row.id}`}>
                                                {DEFAULT_ITEMS.map(it => (
                                                    <option key={it.ItemCode} value={it.ItemName}>
                                                        {it.ItemCode} - {it.GroupName} ({it.UOM})
                                                    </option>
                                                ))}
                                            </datalist>
                                        </td>
                                        <td>
                                            <textarea
                                                className="tpcs-ii-tbl-desc"
                                                placeholder="Description"
                                                value={row.description}
                                                onChange={(e) => handleLineChange(row.id, "description", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="tpcs-ii-tbl-input"
                                                placeholder="Type and select Colour"
                                                value={row.colour}
                                                onChange={(e) => handleLineChange(row.id, "colour", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="tpcs-ii-tbl-input"
                                                placeholder="Type & Size"
                                                value={row.typeSize}
                                                onChange={(e) => handleLineChange(row.id, "typeSize", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                className="tpcs-ii-tbl-select"
                                                value={row.uom}
                                                onChange={(e) => handleLineChange(row.id, "uom", e.target.value)}
                                            >
                                                <option value="PCS">PCS</option>
                                                <option value="SQFT">SQFT</option>
                                                <option value="MTR">MTR</option>
                                                <option value="SET">SET</option>
                                                <option value="SHEET">SHEET</option>
                                                <option value="CONE">CONE</option>
                                                <option value="KGS">KGS</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="tpcs-ii-tbl-input"
                                                value={row.stockQty || 0}
                                                readOnly
                                                style={{ background: "#f8fafc", textAlign: "right" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="tpcs-ii-tbl-input"
                                                placeholder="0.00"
                                                value={row.issueQty}
                                                onChange={(e) => handleLineChange(row.id, "issueQty", e.target.value)}
                                                style={{ textAlign: "right", fontWeight: 600 }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="tpcs-ii-tbl-input"
                                                placeholder="0.00"
                                                value={row.rate}
                                                onChange={(e) => handleLineChange(row.id, "rate", e.target.value)}
                                                style={{ textAlign: "right" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="tpcs-ii-tbl-input"
                                                value={row.amount ? row.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00"}
                                                readOnly
                                                style={{ background: "#f8fafc", textAlign: "right", fontWeight: 600 }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="tpcs-ii-tbl-input"
                                                placeholder="Line Remark"
                                                value={row.remarks}
                                                onChange={(e) => handleLineChange(row.id, "remarks", e.target.value)}
                                            />
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteLine(row.id)}
                                                style={{
                                                    background: "transparent",
                                                    border: "none",
                                                    color: "#ef4444",
                                                    cursor: "pointer",
                                                    padding: "2px"
                                                }}
                                                title="Remove line"
                                            >
                                                <FaTrash style={{ fontSize: "11px" }} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* + Add Another Line link matching Screenshot 1 & 2 */}
                    <button
                        type="button"
                        className="tpcs-ii-add-line-btn"
                        onClick={handleAddLine}
                    >
                        <FaPlus style={{ fontSize: "11px" }} /> <span>Add Another Line</span>
                    </button>

                    {/* ==========================================================
                       FOOTER SECTION (MATCHING SCREENSHOT 2)
                    =========================================================== */}
                    <div className="tpcs-ii-footer-grid">
                        {/* LEFT: Remark + Attachments */}
                        <div>
                            <label className="tpcs-ii-label">Remark</label>
                            <textarea
                                className="tpcs-ii-textarea"
                                placeholder="Enter Remark"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                            />

                            <div>
                                <button
                                    type="button"
                                    className="tpcs-ii-btn-attach"
                                    onClick={() => setActiveModal("attach")}
                                >
                                    <FaPaperclip />
                                    <span>+ Attachments... {attachments.length > 0 && `(${attachments.length})`}</span>
                                </button>
                            </div>
                        </div>

                        {/* MIDDLE: Memo for internal use */}
                        <div>
                            <label className="tpcs-ii-label">Memo for internal use</label>
                            <textarea
                                className="tpcs-ii-textarea"
                                placeholder="Enter Internal Memo"
                                value={internalMemo}
                                onChange={(e) => setInternalMemo(e.target.value)}
                            />
                        </div>

                        {/* RIGHT: Total + Action Buttons */}
                        <div className="tpcs-ii-footer-right">
                            <div className="tpcs-ii-total-display">
                                <span>Total :</span>
                                <span className="tpcs-ii-total-num">
                                    {totalQty > 0 ? totalQty.toLocaleString() : "0"}
                                </span>
                            </div>

                            <div className="tpcs-ii-actions-row" ref={actionBtnRef}>
                                {/* Save Button */}
                                <button
                                    type="button"
                                    className="tpcs-ii-btn-save"
                                    onClick={handleSave}
                                >
                                    <FaSave /> <span>Save</span>
                                </button>

                                {/* Action Dropdown Button */}
                                <button
                                    type="button"
                                    className="tpcs-ii-btn-action"
                                    onClick={() => setShowActionMenu(prev => !prev)}
                                >
                                    <FaCog /> <span>Action</span> <FaCaretDown />
                                </button>

                                {/* Action Menu */}
                                {showActionMenu && (
                                    <div className="tpcs-ii-action-menu">
                                        <div
                                            className="tpcs-ii-menu-item"
                                            onClick={() => {
                                                setShowActionMenu(false);
                                                setActiveModal("print");
                                            }}
                                        >
                                            <FaPrint /> <span>Print Issue Note</span>
                                        </div>
                                        <div
                                            className="tpcs-ii-menu-item"
                                            onClick={handleResetForm}
                                        >
                                            <FaRedo /> <span>Reset Form</span>
                                        </div>
                                        <div
                                            className="tpcs-ii-menu-item"
                                            onClick={() => {
                                                setShowActionMenu(false);
                                                alert("Exporting line items to Excel...");
                                            }}
                                        >
                                            <FaFileExport /> <span>Export to Excel</span>
                                        </div>
                                    </div>
                                )}

                                {/* View Button (switches to list view) */}
                                <button
                                    type="button"
                                    className="tpcs-ii-btn-view"
                                    onClick={() => setViewMode("list")}
                                >
                                    <FaEye /> <span>View</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================================================
               MODE: REGISTER / LIST VIEW (ACCESSIBLE VIA EYE VIEW BUTTON)
            =========================================================== */}
            {viewMode === "list" && (
                <div>
                    <div className="tpcs-ii-list-header">
                        <div>
                            <h1 className="tpcs-ii-title" style={{ margin: 0 }}>Item Issue Register</h1>
                            <p style={{ margin: "2px 0 0 0", fontSize: "12.5px", color: "#64748b" }}>
                                All item issues dispatched to production and jobwork
                            </p>
                        </div>

                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <div className="tpcs-ii-list-search">
                                <input
                                    type="text"
                                    className="tpcs-ii-list-input"
                                    placeholder="Search Issue No, Associate, Store..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <button
                                type="button"
                                className="tpcs-ii-btn-save"
                                onClick={() => setViewMode("form")}
                            >
                                <FaPlus /> <span>+ New Issue</span>
                            </button>
                        </div>
                    </div>

                    <div className="tpcs-ii-table-container">
                        <table className="tpcs-ii-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "90px" }}>Actions</th>
                                    <th>Issue No</th>
                                    <th>Date</th>
                                    <th>Issue To</th>
                                    <th>Associate / Supplier</th>
                                    <th>Department</th>
                                    <th>Stores</th>
                                    <th>Issued By</th>
                                    <th>Requisition No</th>
                                    <th style={{ textAlign: "right" }}>Total Qty</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredIssues.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                            No Item Issue records found. Click <strong>+ New Issue</strong> to create one.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredIssues.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div style={{ display: "flex", gap: "6px" }}>
                                                    <button
                                                        type="button"
                                                        title="View Details"
                                                        onClick={() => {
                                                            setActiveRecord(item);
                                                            setActiveModal("details");
                                                        }}
                                                        style={{ background: "#e0f2fe", border: "1px solid #bae6fd", color: "#0284c7", borderRadius: "3px", padding: "3px 6px", cursor: "pointer" }}
                                                    >
                                                        <FaEye style={{ fontSize: "11px" }} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Print Issue Slip"
                                                        onClick={() => {
                                                            setActiveRecord(item);
                                                            setActiveModal("print");
                                                        }}
                                                        style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#334155", borderRadius: "3px", padding: "3px 6px", cursor: "pointer" }}
                                                    >
                                                        <FaPrint style={{ fontSize: "11px" }} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 700, color: "#1976d2" }}>{item.issueNo}</td>
                                            <td>{item.date}</td>
                                            <td><span style={{ background: "#e0f2fe", color: "#0369a1", padding: "2px 6px", borderRadius: "3px", fontSize: "11px", fontWeight: 600 }}>{item.issueTo}</span></td>
                                            <td>{item.associate || "-"}</td>
                                            <td>{item.department || "-"}</td>
                                            <td>{item.stores}</td>
                                            <td>{item.issuedBy}</td>
                                            <td>{item.requisitionNo || "-"}</td>
                                            <td style={{ textAlign: "right", fontWeight: 700 }}>{item.totalQty.toLocaleString()}</td>
                                            <td>
                                                <span style={{
                                                    background: item.status === "Completed" ? "#dcfce7" : "#fef3c7",
                                                    color: item.status === "Completed" ? "#15803d" : "#b45309",
                                                    padding: "2px 8px",
                                                    borderRadius: "9999px",
                                                    fontSize: "11px",
                                                    fontWeight: 600
                                                }}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ==========================================================
               MODALS (REQUISITION, JOBCARD, PLAN, ATTACHMENTS, PRINT)
            =========================================================== */}

            {/* Requisition Lookup Modal */}
            {activeModal === "requisition" && (
                <div className="tpcs-ii-modal-backdrop" onClick={() => setActiveModal(null)}>
                    <div className="tpcs-ii-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="tpcs-ii-modal-header">
                            <h3 className="tpcs-ii-modal-title">Select Requisition No</h3>
                            <button className="tpcs-ii-modal-close" onClick={() => setActiveModal(null)}><FaTimes /></button>
                        </div>
                        <div className="tpcs-ii-modal-body">
                            <table className="tpcs-ii-table">
                                <thead>
                                    <tr>
                                        <th>Requisition No</th>
                                        <th>Date</th>
                                        <th>Department</th>
                                        <th>Requested By</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {DEFAULT_REQUISITIONS.map(r => (
                                        <tr key={r.reqNo}>
                                            <td style={{ fontWeight: 700, color: "#1976d2" }}>{r.reqNo}</td>
                                            <td>{r.date}</td>
                                            <td>{r.dept}</td>
                                            <td>{r.requestedBy}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="tpcs-ii-btn-save"
                                                    style={{ padding: "3px 10px", fontSize: "11.5px" }}
                                                    onClick={() => {
                                                        setRequisitionNo(r.reqNo);
                                                        setDepartment(r.dept);
                                                        setActiveModal(null);
                                                    }}
                                                >
                                                    Select
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Jobcard Lookup Modal */}
            {activeModal === "jobcard" && (
                <div className="tpcs-ii-modal-backdrop" onClick={() => setActiveModal(null)}>
                    <div className="tpcs-ii-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="tpcs-ii-modal-header">
                            <h3 className="tpcs-ii-modal-title">Select Cutting Slip / Jobcard</h3>
                            <button className="tpcs-ii-modal-close" onClick={() => setActiveModal(null)}><FaTimes /></button>
                        </div>
                        <div className="tpcs-ii-modal-body">
                            <table className="tpcs-ii-table">
                                <thead>
                                    <tr>
                                        <th>Jobcard No</th>
                                        <th>Cutting Slip</th>
                                        <th>Style</th>
                                        <th>Buyer</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {DEFAULT_JOBCARDS.map(j => (
                                        <tr key={j.jcNo}>
                                            <td style={{ fontWeight: 700, color: "#1976d2" }}>{j.jcNo}</td>
                                            <td>{j.slipNo}</td>
                                            <td>{j.style}</td>
                                            <td>{j.buyer}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="tpcs-ii-btn-save"
                                                    style={{ padding: "3px 10px", fontSize: "11.5px" }}
                                                    onClick={() => {
                                                        setJobcardNo(j.jcNo);
                                                        setActiveModal(null);
                                                    }}
                                                >
                                                    Select
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Cutting Plan Lookup Modal */}
            {activeModal === "plan" && (
                <div className="tpcs-ii-modal-backdrop" onClick={() => setActiveModal(null)}>
                    <div className="tpcs-ii-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="tpcs-ii-modal-header">
                            <h3 className="tpcs-ii-modal-title">Select Cutting Plan No</h3>
                            <button className="tpcs-ii-modal-close" onClick={() => setActiveModal(null)}><FaTimes /></button>
                        </div>
                        <div className="tpcs-ii-modal-body">
                            <table className="tpcs-ii-table">
                                <thead>
                                    <tr>
                                        <th>Cutting Plan No</th>
                                        <th>Jobcard No</th>
                                        <th>Date</th>
                                        <th>Pairs</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {DEFAULT_CUTTING_PLANS.map(p => (
                                        <tr key={p.planNo}>
                                            <td style={{ fontWeight: 700, color: "#1976d2" }}>{p.planNo}</td>
                                            <td>{p.jcNo}</td>
                                            <td>{p.date}</td>
                                            <td>{p.pairs}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="tpcs-ii-btn-save"
                                                    style={{ padding: "3px 10px", fontSize: "11.5px" }}
                                                    onClick={() => {
                                                        setCuttingPlanNo(p.planNo);
                                                        if (!jobcardNo) setJobcardNo(p.jcNo);
                                                        setActiveModal(null);
                                                    }}
                                                >
                                                    Select
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Attachments Modal */}
            {activeModal === "attach" && (
                <div className="tpcs-ii-modal-backdrop" onClick={() => setActiveModal(null)}>
                    <div className="tpcs-ii-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="tpcs-ii-modal-header">
                            <h3 className="tpcs-ii-modal-title">Attachments for Item Issue</h3>
                            <button className="tpcs-ii-modal-close" onClick={() => setActiveModal(null)}><FaTimes /></button>
                        </div>
                        <div className="tpcs-ii-modal-body">
                            <div style={{
                                border: "2px dashed #cbd5e1",
                                padding: "24px",
                                textAlign: "center",
                                borderRadius: "6px",
                                marginBottom: "16px"
                            }}>
                                <p style={{ margin: "0 0 10px 0", color: "#64748b", fontSize: "13px" }}>
                                    Drag and drop documents, spec sheets, or inspection photos here
                                </p>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            const fileNames = Array.from(e.target.files).map(f => f.name);
                                            setAttachments(prev => [...prev, ...fileNames]);
                                        }
                                    }}
                                />
                            </div>

                            {attachments.length > 0 && (
                                <div>
                                    <h4 style={{ fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>Attached Files:</h4>
                                    <ul style={{ listStyle: "none", padding: 0 }}>
                                        {attachments.map((file, i) => (
                                            <li key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "3px", marginBottom: "4px", fontSize: "12px" }}>
                                                <span>📎 {file}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                                    style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }}
                                                >
                                                    <FaTimes />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="tpcs-ii-modal-footer">
                            <button type="button" className="tpcs-ii-btn-save" onClick={() => setActiveModal(null)}>Done</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Modal */}
            {activeModal === "print" && (
                <div className="tpcs-ii-modal-backdrop" onClick={() => setActiveModal(null)}>
                    <div className="tpcs-ii-modal-content" style={{ width: "800px" }} onClick={e => e.stopPropagation()}>
                        <div className="tpcs-ii-modal-header">
                            <h3 className="tpcs-ii-modal-title">Item Issue Voucher Print Preview</h3>
                            <button className="tpcs-ii-modal-close" onClick={() => setActiveModal(null)}><FaTimes /></button>
                        </div>
                        <div className="tpcs-ii-modal-body" style={{ background: "#ffffff", padding: "24px" }}>
                            <div style={{ textAlign: "center", borderBottom: "2px solid #0f172a", paddingBottom: "12px", marginBottom: "16px" }}>
                                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800 }}>TPCS FASHION ERP</h2>
                                <h3 style={{ margin: "4px 0", fontSize: "16px", color: "#1976d2" }}>ITEM ISSUE VOUCHER</h3>
                                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Plot No. 9B | FY 01-Apr-2026 - 31-Mar-2027</p>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px", marginBottom: "16px" }}>
                                <div><strong>Issue No:</strong> {activeRecord ? activeRecord.issueNo : `${issuePrefix}${issueSerial}`}</div>
                                <div><strong>Date:</strong> {activeRecord ? activeRecord.date : issueDate}</div>
                                <div><strong>Issue To:</strong> {activeRecord ? activeRecord.issueTo : issueTo}</div>
                                <div><strong>Stores:</strong> {activeRecord ? activeRecord.stores : stores}</div>
                                <div><strong>Associate/Supplier:</strong> {activeRecord ? activeRecord.associate : associate || "-"}</div>
                                <div><strong>Department:</strong> {activeRecord ? activeRecord.department : department || "-"}</div>
                            </div>

                            <table className="tpcs-ii-table" style={{ width: "100%", marginBottom: "20px" }}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Item Name</th>
                                        <th>Colour</th>
                                        <th>UOM</th>
                                        <th style={{ textAlign: "right" }}>Qty</th>
                                        <th style={{ textAlign: "right" }}>Rate</th>
                                        <th style={{ textAlign: "right" }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(activeRecord ? activeRecord.items : lines).map((r, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{r.item || r.ItemName}</td>
                                            <td>{r.colour || r.Color || "-"}</td>
                                            <td>{r.uom || r.UOM}</td>
                                            <td style={{ textAlign: "right", fontWeight: 700 }}>{r.issueQty || r.Quantity}</td>
                                            <td style={{ textAlign: "right" }}>{r.rate || r.Rate || 0}</td>
                                            <td style={{ textAlign: "right" }}>{r.amount || r.Amount || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px", fontSize: "12px" }}>
                                <div>
                                    <div style={{ borderTop: "1px solid #94a3b8", width: "160px", textAlign: "center", paddingTop: "4px" }}>
                                        Prepared By ({issuedBy})
                                    </div>
                                </div>
                                <div>
                                    <div style={{ borderTop: "1px solid #94a3b8", width: "160px", textAlign: "center", paddingTop: "4px" }}>
                                        Received By ({receivedBy || "________________"})
                                    </div>
                                </div>
                                <div>
                                    <div style={{ borderTop: "1px solid #94a3b8", width: "160px", textAlign: "center", paddingTop: "4px" }}>
                                        Authorized Signatory
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tpcs-ii-modal-footer">
                            <button type="button" className="tpcs-ii-btn-save" onClick={() => window.print()}>
                                <FaPrint /> <span>Print</span>
                            </button>
                            <button type="button" className="tpcs-ii-btn-view" onClick={() => setActiveModal(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sequence Settings Modal */}
            {activeModal === "settings" && (
                <div className="tpcs-ii-modal-backdrop" onClick={() => setActiveModal(null)}>
                    <div className="tpcs-ii-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="tpcs-ii-modal-header">
                            <h3 className="tpcs-ii-modal-title">Item Issue Numbering Format</h3>
                            <button className="tpcs-ii-modal-close" onClick={() => setActiveModal(null)}><FaTimes /></button>
                        </div>
                        <div className="tpcs-ii-modal-body">
                            <div style={{ marginBottom: "12px" }}>
                                <label className="tpcs-ii-label">Series Prefix</label>
                                <input
                                    type="text"
                                    className="tpcs-ii-input"
                                    value={issuePrefix}
                                    onChange={(e) => setIssuePrefix(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="tpcs-ii-label">Next Serial Number</label>
                                <input
                                    type="text"
                                    className="tpcs-ii-input"
                                    value={issueSerial}
                                    onChange={(e) => setIssueSerial(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="tpcs-ii-modal-footer">
                            <button type="button" className="tpcs-ii-btn-save" onClick={() => setActiveModal(null)}>Save Settings</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}