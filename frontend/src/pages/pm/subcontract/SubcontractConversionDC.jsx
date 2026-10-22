import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FaPlus,
    FaSyncAlt,
    FaBars,
    FaCog,
    FaFilter,
    FaCalendarAlt,
    FaListAlt,
    FaChevronLeft,
    FaChevronRight,
    FaPaperclip,
    FaTimes,
    FaArrowLeft,
    FaSave,
    FaEye,
    FaCaretDown
} from "react-icons/fa";
import "../../../styles/conversionGRN.css";
import "../../../styles/subcontractConversionDC.css";

const INITIAL_CONVERSION_RECORDS = [
    {
        id: 1,
        docNo: "SUB/9B/2627/001",
        dcNo: "SDC/9B/2627/482",
        date: "12-10-2026",
        unit: "Plot No. 9B",
        qty: "120 PCS",
        status: "Active",
        remarks: "Standard production batch",
        subcontractor: "Supreme Embroidery Works",
        store: "Plot No. 9B - Fabric Store",
        operation: "Fabric Cutting & Slitting",
        poNo: "SPO-2627-104",
        issuedBy: "Tilak"
    },
    {
        id: 2,
        docNo: "SUB/9B/2627/002",
        dcNo: "SDC/9B/2627/481",
        date: "10-10-2026",
        unit: "Plot No. 9B",
        qty: "350 PCS",
        status: "Completed",
        remarks: "Verified by QC line 2",
        subcontractor: "Golden Stitchers Ltd",
        store: "Plot No. 9B - Trim Store",
        operation: "Panel Fusing & Interlining",
        poNo: "SPO-2627-098",
        issuedBy: "Vaishnav"
    },
    {
        id: 3,
        docNo: "SUB/9B/2627/003",
        dcNo: "SDC/9B/2627/480",
        date: "08-10-2026",
        unit: "Plot No. 9B",
        qty: "85 PCS",
        status: "Pending",
        remarks: "Scheduled for next shift",
        subcontractor: "Apex Dyeing & Washing",
        store: "Plot No. 9B - Processing Godown",
        operation: "Yarn Dyeing & Treatment",
        poNo: "SPO-2627-091",
        issuedBy: "Rajesh"
    }
];

export default function SubcontractConversionDC({ initialMode = "list" }) {
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

    // List State
    const [records, setRecords] = useState(INITIAL_CONVERSION_RECORDS);
    const [toastMessage, setToastMessage] = useState("");

    // Form Top State (Matching Screenshot 2)
    const [dcType, setDcType] = useState("Conversion DC");
    const [defaultDcType, setDefaultDcType] = useState(false);
    const [dcPrefix, setDcPrefix] = useState("SDC/9B/2627/");
    const [dcNo, setDcNo] = useState("483");
    const [date, setDate] = useState("22-10-2026");
    const [subcontractor, setSubcontractor] = useState("");
    const [store, setStore] = useState("");
    const [operation, setOperation] = useState("");
    const [subcontractPoNo, setSubcontractPoNo] = useState("");
    const [transportDetails, setTransportDetails] = useState("");
    const [issuedBy, setIssuedBy] = useState("");

    // Items Issued Grid (Matching Screenshot 3)
    const [itemsIssued, setItemsIssued] = useState([
        {
            id: 1,
            issueType: "Lot Issue",
            ioNo: "",
            group: "",
            item: "",
            description: "",
            color: "",
            uom: "MTR",
            sizeRange: "",
            qty: "",
            rate: "",
            amount: 0
        }
    ]);

    // Items Expected Grid (Matching Screenshot 4)
    const [itemsExpected, setItemsExpected] = useState([
        {
            id: 1,
            ioNo: "",
            group: "",
            item: "",
            description: "",
            color: "",
            sizeRange: "",
            uom: "PCS",
            qty: "",
            rate: "",
            amount: 0
        }
    ]);

    // Other Charges Grid (Matching Screenshot 5)
    const [otherCharges, setOtherCharges] = useState([
        {
            id: 1,
            accountName: "",
            currency: "",
            value: "",
            taxGroup: "",
            cgst: "",
            sgst: "",
            igst: ""
        },
        {
            id: 2,
            accountName: "",
            currency: "",
            value: "",
            taxGroup: "",
            cgst: "",
            sgst: "",
            igst: ""
        }
    ]);

    const [defaultOtherCharges, setDefaultOtherCharges] = useState(false);
    const [remark, setRemark] = useState("");
    const [internalMemo, setInternalMemo] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [actionMenuOpen, setActionMenuOpen] = useState(false);

    const fileInputRef = useRef(null);
    const issuedTableScrollRef = useRef(null);
    const expectedTableScrollRef = useRef(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3500);
    };

    // Calculate Totals
    const calculateIssuedTotal = () => {
        return itemsIssued.reduce((acc, l) => acc + (parseFloat(l.amount) || 0), 0);
    };

    const calculateExpectedTotal = () => {
        return itemsExpected.reduce((acc, l) => acc + (parseFloat(l.amount) || 0), 0);
    };

    // Issued items change
    const handleIssuedChange = (id, field, val) => {
        setItemsIssued((prev) =>
            prev.map((line) => {
                if (line.id !== id) return line;
                const updated = { ...line, [field]: val };
                if (field === "qty" || field === "rate") {
                    const q = parseFloat(field === "qty" ? val : line.qty) || 0;
                    const r = parseFloat(field === "rate" ? val : line.rate) || 0;
                    updated.amount = q * r;
                }
                return updated;
            })
        );
    };

    const handleAddIssuedLine = () => {
        setItemsIssued((prev) => [
            ...prev,
            {
                id: Date.now(),
                issueType: "Lot Issue",
                ioNo: "",
                group: "",
                item: "",
                description: "",
                color: "",
                uom: "MTR",
                sizeRange: "",
                qty: "",
                rate: "",
                amount: 0
            }
        ]);
    };

    const handleDeleteIssuedLine = (id) => {
        if (itemsIssued.length <= 1) return;
        setItemsIssued(itemsIssued.filter((l) => l.id !== id));
    };

    // Expected items change
    const handleExpectedChange = (id, field, val) => {
        setItemsExpected((prev) =>
            prev.map((line) => {
                if (line.id !== id) return line;
                const updated = { ...line, [field]: val };
                if (field === "qty" || field === "rate") {
                    const q = parseFloat(field === "qty" ? val : line.qty) || 0;
                    const r = parseFloat(field === "rate" ? val : line.rate) || 0;
                    updated.amount = q * r;
                }
                return updated;
            })
        );
    };

    const handleAddExpectedLine = () => {
        setItemsExpected((prev) => [
            ...prev,
            {
                id: Date.now(),
                ioNo: "",
                group: "",
                item: "",
                description: "",
                color: "",
                sizeRange: "",
                uom: "PCS",
                qty: "",
                rate: "",
                amount: 0
            }
        ]);
    };

    const handleDeleteExpectedLine = (id) => {
        if (itemsExpected.length <= 1) return;
        setItemsExpected(itemsExpected.filter((l) => l.id !== id));
    };

    // Other Charges change
    const handleOtherChargeChange = (id, field, val) => {
        setOtherCharges((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;
                const updated = { ...item, [field]: val };
                if (field === "taxGroup" || field === "value") {
                    const v = parseFloat(field === "value" ? val : item.value) || 0;
                    const tg = field === "taxGroup" ? val : item.taxGroup;
                    if (tg === "GST 5%") {
                        updated.cgst = (v * 0.025).toFixed(2);
                        updated.sgst = (v * 0.025).toFixed(2);
                        updated.igst = "0.00";
                    } else if (tg === "GST 12%") {
                        updated.cgst = (v * 0.06).toFixed(2);
                        updated.sgst = (v * 0.06).toFixed(2);
                        updated.igst = "0.00";
                    } else if (tg === "GST 18%") {
                        updated.cgst = (v * 0.09).toFixed(2);
                        updated.sgst = (v * 0.09).toFixed(2);
                        updated.igst = "0.00";
                    } else {
                        updated.cgst = "0.00";
                        updated.sgst = "0.00";
                        updated.igst = "0.00";
                    }
                }
                return updated;
            })
        );
    };

    const handleAddOtherCharge = () => {
        setOtherCharges((prev) => [
            ...prev,
            { id: Date.now(), accountName: "", currency: "", value: "", taxGroup: "", cgst: "", sgst: "", igst: "" }
        ]);
    };

    const handleDeleteOtherCharge = (id) => {
        if (otherCharges.length <= 1) return;
        setOtherCharges(otherCharges.filter((c) => c.id !== id));
    };

    // Populate from Subcontract PO
    const handleDisplayFromPO = () => {
        if (!subcontractPoNo.trim()) {
            setSubcontractPoNo("SPO/9B/2627/088");
        }
        if (!subcontractor) setSubcontractor("Supreme Embroidery Works");
        if (!store) setStore("Plot No. 9B - Raw Material Godown");
        if (!operation) setOperation("Fabric Slitting & Quilting");

        setItemsIssued([
            {
                id: 1,
                issueType: "Lot Issue",
                ioNo: "IO/9B/2627/102",
                group: "Fabric Knits",
                item: "Single Jersey 100% Cotton 180 GSM",
                description: "Knitted fabric in rolls",
                color: "Navy Blue",
                uom: "KGS",
                sizeRange: "Standard",
                qty: "450",
                rate: "380.00",
                amount: 171000
            }
        ]);

        setItemsExpected([
            {
                id: 1,
                ioNo: "IO/9B/2627/102",
                group: "Garment Panels",
                item: "Cut Front & Back Panels",
                description: "Cut components ready for sewing",
                color: "Navy Blue",
                sizeRange: "S - XXL",
                uom: "SETS",
                qty: "1200",
                rate: "142.50",
                amount: 171000
            }
        ]);

        showToast("Populated conversion items from Subcontract PO successfully!");
    };

    // File attachments
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setAttachments((prev) => [...prev, ...files.map((f) => f.name)]);
            showToast(`Attached ${files.length} file(s)`);
        }
    };

    // Save Action
    const handleSaveDC = (saveAndNew = false) => {
        const fullDcNo = `${dcPrefix}${dcNo}`;
        const newRecord = {
            id: Date.now(),
            docNo: `SUB/9B/2627/00${records.length + 1}`,
            dcNo: fullDcNo,
            date: date || new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
            unit: store || "Plot No. 9B",
            qty:
                itemsIssued.reduce((acc, l) => acc + (parseFloat(l.qty) || 0), 0) > 0
                    ? `${itemsIssued.reduce((acc, l) => acc + (parseFloat(l.qty) || 0), 0)} PCS`
                    : "120 PCS",
            status: "Active",
            remarks: transportDetails || "Conversion DC Inward Completed",
            subcontractor: subcontractor || "Supreme Embroidery Works",
            store: store || "Plot No. 9B - Fabric Godown",
            operation: operation || "General Conversion",
            poNo: subcontractPoNo || "SPO-2627-104",
            issuedBy: issuedBy || "Tilak"
        };

        setRecords([newRecord, ...records]);
        showToast(`Conversion DC ${fullDcNo} saved successfully!`);

        if (saveAndNew) {
            setDcNo((parseInt(dcNo, 10) + 1).toString());
            setTransportDetails("");
            setRemark("");
            setInternalMemo("");
            setAttachments([]);
        } else {
            setViewMode("list");
            if (window.history && window.history.pushState) {
                window.history.pushState({}, "", "/pm/subcontract-material-conversion-dc");
            }
        }
    };

    // =========================================================================
    // RENDER: LIST VIEW (EXACT MATCH FOR SCREENSHOT 1)
    // =========================================================================
    if (viewMode === "list") {
        return (
            <div className="cgrn-page">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px"
                    }}
                >
                    <div>
                        <span
                            style={{
                                fontSize: "11.5px",
                                color: "#64748b",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px"
                            }}
                        >
                            PM &bull; SUBCONTRACT
                        </span>
                        <h1 className="cgrn-page-title" style={{ margin: "2px 0 0 0" }}>
                            Subcontract Material Conversion DC
                        </h1>
                    </div>

                    <div className="cgrn-right-actions">
                        <button
                            type="button"
                            className="cgrn-btn-new"
                            onClick={() => {
                                setViewMode("form");
                                if (window.history && window.history.pushState) {
                                    window.history.pushState({}, "", "/pm/subcontract-material-conversion-dc/new");
                                }
                            }}
                        >
                            <FaPlus style={{ fontSize: "11px" }} />
                            <span>New Subcontract Material Conversion DC</span>
                        </button>
                    </div>
                </div>

                {/* Status toast message */}
                {toastMessage && (
                    <div className="alert alert-success py-1 px-3 mb-2" style={{ fontSize: "12px" }}>
                        {toastMessage}
                    </div>
                )}

                {/* Top Toolbar */}
                <div className="cgrn-toolbar">
                    <div className="cgrn-toolbar-left">
                        <button
                            type="button"
                            className="cgrn-icon-btn"
                            title="Reload"
                            onClick={() => showToast("Records reloaded")}
                        >
                            <FaSyncAlt />
                        </button>
                        <button type="button" className="cgrn-icon-btn" title="Toggle Density">
                            <FaBars />
                        </button>
                        <button
                            type="button"
                            className="cgrn-icon-btn"
                            title="Settings"
                            onClick={() => showToast("Grid display settings configured")}
                        >
                            <FaCog />
                        </button>
                        <button
                            type="button"
                            className="cgrn-filter-btn"
                            onClick={() => showToast("Filter active")}
                        >
                            <FaFilter style={{ fontSize: "11px" }} />
                            <span>Filter</span>
                        </button>
                    </div>
                    <div>
                        <span className="cgrn-page-badge">1</span>
                    </div>
                </div>

                {/* Table matching Screenshot 1 */}
                <div className="cgrn-table-container">
                    <table className="cgrn-table">
                        <thead>
                            <tr>
                                <th style={{ width: "80px", textAlign: "center" }}>Action</th>
                                <th>Document No</th>
                                <th>Date</th>
                                <th>Category / Unit</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((row) => (
                                <tr key={row.id}>
                                    <td style={{ textAlign: "center" }}>
                                        <button
                                            type="button"
                                            className="cgrn-action-btn"
                                            onClick={() => {
                                                setSubcontractor(row.subcontractor);
                                                setStore(row.store);
                                                setDate(row.date);
                                                setOperation(row.operation);
                                                setSubcontractPoNo(row.poNo);
                                                setIssuedBy(row.issuedBy);
                                                setViewMode("form");
                                            }}
                                        >
                                            Action
                                        </button>
                                    </td>
                                    <td style={{ fontWeight: 600, color: "#1a5695" }}>{row.docNo}</td>
                                    <td>{row.date}</td>
                                    <td>{row.unit}</td>
                                    <td style={{ fontWeight: 600 }}>{row.qty}</td>
                                    <td>
                                        <span
                                            className={`cgrn-status-badge ${
                                                row.status === "Completed"
                                                    ? "cgrn-status-completed"
                                                    : row.status === "Pending"
                                                    ? "cgrn-status-pending"
                                                    : "cgrn-status-approved"
                                            }`}
                                        >
                                            {row.status}
                                        </span>
                                    </td>
                                    <td style={{ color: "#64748b" }}>{row.remarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // =========================================================================
    // RENDER: CONVERSION DC FORM (MATCHING SCREENSHOTS 2, 3, 4, 5)
    // =========================================================================
    return (
        <div className="scdc-page">
            {/* Header */}
            <div className="scdc-header-row">
                <div>
                    <h1 className="scdc-title">
                        Conversion DC
                        <span className="scdc-badge-unit">Plot No. 9B &bull; FY 01-Apr-2026 - 31-Mar-2027</span>
                    </h1>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                        style={{ height: "28px", fontSize: "12px" }}
                        onClick={() => {
                            setViewMode("list");
                            if (window.history && window.history.pushState) {
                                window.history.pushState({}, "", "/pm/subcontract-material-conversion-dc");
                            }
                        }}
                    >
                        <FaArrowLeft /> Back to List
                    </button>
                </div>
            </div>

            {/* Notification alert */}
            {toastMessage && (
                <div className="alert alert-info py-1 px-3 mb-3" style={{ fontSize: "12px" }}>
                    {toastMessage}
                </div>
            )}

            {/* DC Type dropdown & checkbox (Screenshot 2) */}
            <div style={{ marginBottom: "16px", maxWidth: "320px" }}>
                <label className="scdc-field-label">DC Type</label>
                <select
                    className="scdc-select"
                    value={dcType}
                    onChange={(e) => setDcType(e.target.value)}
                >
                    <option value="Conversion DC">Conversion DC</option>
                    <option value="Sample DC">Sample DC</option>
                    <option value="Job Work DC">Job Work DC</option>
                </select>
                <label className="scdc-checkbox-label">
                    <input
                        type="checkbox"
                        checked={defaultDcType}
                        onChange={(e) => setDefaultDcType(e.target.checked)}
                    />
                    Make this as my default DC Type
                </label>
            </div>

            {/* ==============================================================
                TOP 2-COLUMN FORM FIELDS (Screenshot 2)
                ============================================================== */}
            <div className="scdc-top-grid">
                {/* Left Col: DC No */}
                <div className="scdc-field-group">
                    <label className="scdc-field-label">DC No</label>
                    <div className="scdc-compound-dc">
                        <select
                            className="scdc-prefix-select"
                            value={dcPrefix}
                            onChange={(e) => setDcPrefix(e.target.value)}
                        >
                            <option value="SDC/9B/2627/">SDC/9B/2627/</option>
                            <option value="SDC/9B/2526/">SDC/9B/2526/</option>
                            <option value="SDC/FBD/2627/">SDC/FBD/2627/</option>
                        </select>
                        <input
                            type="text"
                            className="scdc-num-input"
                            value={dcNo}
                            onChange={(e) => setDcNo(e.target.value)}
                        />
                        <button
                            type="button"
                            className="scdc-gear-btn"
                            title="Sequence Settings"
                            onClick={() => showToast("DC sequence configuration")}
                        >
                            <FaCog size={13} />
                        </button>
                    </div>
                </div>

                {/* Right Col: Transport Details (spans 3 rows in Screenshot 2) */}
                <div className="scdc-field-group" style={{ gridRow: "span 3" }}>
                    <label className="scdc-field-label">Transport Details</label>
                    <textarea
                        className="scdc-textarea"
                        rows={6}
                        placeholder="Enter Transport Details"
                        value={transportDetails}
                        onChange={(e) => setTransportDetails(e.target.value)}
                    />
                </div>

                {/* Left Col: Date */}
                <div className="scdc-field-group">
                    <label className="scdc-field-label">
                        Date <span className="scdc-req">*</span>
                    </label>
                    <div className="scdc-date-wrap">
                        <input
                            type="date"
                            className="scdc-date-input"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <span className="scdc-date-icon-btn">
                            <FaCalendarAlt size={12} />
                        </span>
                    </div>
                </div>

                {/* Left Col: Subcontractor */}
                <div className="scdc-field-group">
                    <label className="scdc-field-label">
                        Subcontractor <span className="scdc-req">*</span>
                    </label>
                    <input
                        type="text"
                        className="scdc-input"
                        placeholder="Select Subcantractor"
                        value={subcontractor}
                        onChange={(e) => setSubcontractor(e.target.value)}
                        list="subcontractor-dc-list"
                    />
                    <datalist id="subcontractor-dc-list">
                        <option value="Supreme Embroidery Works" />
                        <option value="Golden Stitchers Ltd" />
                        <option value="Apex Dyeing & Washing" />
                        <option value="Classic Button Holing & Finishing" />
                    </datalist>
                </div>

                {/* Right Col: Issued By */}
                <div className="scdc-field-group">
                    <label className="scdc-field-label">Issued By</label>
                    <input
                        type="text"
                        className="scdc-input"
                        placeholder="Enter Issued By"
                        value={issuedBy}
                        onChange={(e) => setIssuedBy(e.target.value)}
                    />
                </div>

                {/* Left Col: Store */}
                <div className="scdc-field-group">
                    <label className="scdc-field-label">
                        Store <span className="scdc-req">*</span>
                    </label>
                    <input
                        type="text"
                        className="scdc-input"
                        placeholder="Type and select Store"
                        value={store}
                        onChange={(e) => setStore(e.target.value)}
                        list="stores-dc-list"
                    />
                    <datalist id="stores-dc-list">
                        <option value="Plot No. 9B - Raw Material Godown" />
                        <option value="Plot No. 9B - Fabric Store" />
                        <option value="Plot No. 9B - Trim Store" />
                        <option value="Unit 2 - Okhla Plant Store" />
                    </datalist>
                </div>

                {/* Empty column right */}
                <div></div>

                {/* Left Col: Operation */}
                <div className="scdc-field-group">
                    <label className="scdc-field-label">Operation</label>
                    <input
                        type="text"
                        className="scdc-input"
                        placeholder="Type and select Operation"
                        value={operation}
                        onChange={(e) => setOperation(e.target.value)}
                        list="operations-dc-list"
                    />
                    <datalist id="operations-dc-list">
                        <option value="Fabric Cutting & Slitting" />
                        <option value="Panel Fusing & Interlining" />
                        <option value="Yarn Dyeing & Treatment" />
                        <option value="Screen Printing Batch" />
                    </datalist>
                </div>

                {/* Empty column right */}
                <div></div>

                {/* Left Col: Subcontract PO No with Button */}
                <div className="scdc-field-group">
                    <label className="scdc-field-label">Subcontract PO No</label>
                    <div className="scdc-po-row">
                        <input
                            type="text"
                            className="scdc-input"
                            placeholder="Type and "
                            value={subcontractPoNo}
                            onChange={(e) => setSubcontractPoNo(e.target.value)}
                        />
                        <button
                            type="button"
                            className="scdc-btn-blue"
                            onClick={handleDisplayFromPO}
                        >
                            Display from Subcontract PO
                        </button>
                    </div>
                </div>

                {/* Empty column right */}
                <div></div>

                {/* Display Button */}
                <div>
                    <button
                        type="button"
                        className="scdc-btn-blue"
                        style={{ height: "28px", minWidth: "75px", justifyContent: "center" }}
                        onClick={handleDisplayFromPO}
                    >
                        Display
                    </button>
                </div>
            </div>

            {/* ==============================================================
                TABLE 1: ITEMS ISSUED (Screenshot 3)
                ============================================================== */}
            <div className="scdc-section-title">Items Issued</div>

            <div className="scdc-table-wrapper" ref={issuedTableScrollRef}>
                <table className="scdc-table">
                    <thead>
                        <tr>
                            <th style={{ minWidth: "120px" }}>Issue Type</th>
                            <th style={{ minWidth: "130px" }}>IO No</th>
                            <th style={{ minWidth: "150px" }}>Group</th>
                            <th style={{ minWidth: "160px" }}>
                                Item <span className="scdc-req">*</span>
                            </th>
                            <th style={{ minWidth: "180px" }}>Description</th>
                            <th style={{ minWidth: "130px" }}>
                                Color <span className="scdc-req">*</span>
                            </th>
                            <th style={{ minWidth: "80px" }}>
                                UOM <span className="scdc-req">*</span>
                            </th>
                            <th style={{ minWidth: "120px" }}>Size Range</th>
                            <th style={{ minWidth: "100px" }}>Issue Qty</th>
                            <th style={{ minWidth: "90px" }}>Rate</th>
                            <th style={{ minWidth: "110px", textAlign: "right" }}>Amount</th>
                            <th style={{ width: "35px", textAlign: "center" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsIssued.map((line) => (
                            <tr key={line.id}>
                                <td>
                                    <select
                                        className="scdc-select"
                                        style={{ height: "26px", fontSize: "11.5px" }}
                                        value={line.issueType}
                                        onChange={(e) => handleIssuedChange(line.id, "issueType", e.target.value)}
                                    >
                                        <option value="Lot Issue">Lot Issue</option>
                                        <option value="Direct Issue">Direct Issue</option>
                                        <option value="Batch Issue">Batch Issue</option>
                                    </select>
                                </td>
                                <td>
                                    <div className="scdc-io-compound">
                                        <input
                                            type="text"
                                            className="scdc-tbl-input"
                                            placeholder="Enter IO No"
                                            value={line.ioNo}
                                            onChange={(e) => handleIssuedChange(line.id, "ioNo", e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="scdc-io-btn"
                                            title="Pick IO No"
                                            onClick={() => handleIssuedChange(line.id, "ioNo", "IO/9B/2627/102")}
                                        >
                                            <FaListAlt />
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="scdc-tbl-input"
                                        placeholder="Type and Select Grou"
                                        value={line.group}
                                        onChange={(e) => handleIssuedChange(line.id, "group", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="scdc-tbl-input"
                                        placeholder="Type and select Item"
                                        value={line.item}
                                        onChange={(e) => handleIssuedChange(line.id, "item", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="scdc-tbl-input"
                                        placeholder="Description"
                                        value={line.description}
                                        onChange={(e) => handleIssuedChange(line.id, "description", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="scdc-tbl-input"
                                        placeholder="Type and select Colo"
                                        value={line.color}
                                        onChange={(e) => handleIssuedChange(line.id, "color", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="scdc-tbl-input"
                                        placeholder="UOM"
                                        value={line.uom}
                                        onChange={(e) => handleIssuedChange(line.id, "uom", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="scdc-tbl-input"
                                        placeholder="Type & Selec"
                                        value={line.sizeRange}
                                        onChange={(e) => handleIssuedChange(line.id, "sizeRange", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="scdc-tbl-input"
                                        placeholder="Qty"
                                        value={line.qty}
                                        onChange={(e) => handleIssuedChange(line.id, "qty", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="scdc-tbl-input"
                                        placeholder="Rate"
                                        value={line.rate}
                                        onChange={(e) => handleIssuedChange(line.id, "rate", e.target.value)}
                                    />
                                </td>
                                <td style={{ textAlign: "right", fontWeight: 600 }}>
                                    {Number(line.amount || 0).toFixed(2)}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteIssuedLine(line.id)}
                                        style={{ border: "none", background: "transparent", color: "#ef4444", cursor: "pointer" }}
                                    >
                                        <FaTimes size={11} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span className="scdc-add-line-link" onClick={handleAddIssuedLine}>
                    <FaPlus size={10} /> Add Another Line
                </span>
                <div style={{ fontSize: "12px", fontWeight: 600 }}>
                    Total : {calculateIssuedTotal().toFixed(2)}
                </div>
            </div>

            {/* ==============================================================
                TABLE 2: ITEMS EXPECTED (Screenshot 4)
                ============================================================== */}
            <div className="scdc-section-title">Items Expected</div>

            <div className="scdc-table-wrapper" ref={expectedTableScrollRef}>
                <table className="scdc-table">
                    <thead>
                        <tr>
                            <th style={{ minWidth: "130px" }}>IO No</th>
                            <th style={{ minWidth: "150px" }}>Group</th>
                            <th style={{ minWidth: "160px" }}>
                                Item <span className="scdc-req">*</span>
                            </th>
                            <th style={{ minWidth: "180px" }}>Description</th>
                            <th style={{ minWidth: "130px" }}>
                                Color <span className="scdc-req">*</span>
                            </th>
                            <th style={{ minWidth: "130px" }}>
                                Size Range <span className="scdc-req">*</span>
                            </th>
                            <th style={{ minWidth: "80px" }}>
                                UOM <span className="scdc-req">*</span>
                            </th>
                            <th style={{ minWidth: "100px" }}>Enter Qty</th>
                            <th style={{ minWidth: "90px" }}>Rate</th>
                            <th style={{ minWidth: "110px", textAlign: "right" }}>Amount</th>
                            <th style={{ width: "35px", textAlign: "center" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsExpected.map((line) => (
                            <tr key={line.id}>
                                <td>
                                    <div className="scdc-io-compound">
                                        <input
                                            type="text"
                                            className="scdc-tbl-input"
                                            placeholder="Enter IO No"
                                            value={line.ioNo}
                                            onChange={(e) => handleExpectedChange(line.id, "ioNo", e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="scdc-io-btn"
                                            title="Pick IO No"
                                            onClick={() => handleExpectedChange(line.id, "ioNo", "IO/9B/2627/102")}
                                        >
                                            <FaListAlt />
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="scdc-tbl-input"
                                        placeholder="Type and select Group"
                                        value={line.group}
                                        onChange={(e) => handleExpectedChange(line.id, "group", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="scdc-tbl-input"
                                        placeholder="Type and select Item"
                                        value={line.item}
                                        onChange={(e) => handleExpectedChange(line.id, "item", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="scdc-tbl-input"
                                        placeholder="Description"
                                        value={line.description}
                                        onChange={(e) => handleExpectedChange(line.id, "description", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="scdc-tbl-input"
                                        placeholder="Color"
                                        value={line.color}
                                        onChange={(e) => handleExpectedChange(line.id, "color", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="scdc-tbl-input"
                                        placeholder="Type & Select Size Rar"
                                        value={line.sizeRange}
                                        onChange={(e) => handleExpectedChange(line.id, "sizeRange", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="scdc-tbl-input"
                                        placeholder="UOM"
                                        value={line.uom}
                                        onChange={(e) => handleExpectedChange(line.id, "uom", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="scdc-tbl-input"
                                        placeholder="Qty"
                                        value={line.qty}
                                        onChange={(e) => handleExpectedChange(line.id, "qty", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="scdc-tbl-input"
                                        placeholder="Rate"
                                        value={line.rate}
                                        onChange={(e) => handleExpectedChange(line.id, "rate", e.target.value)}
                                    />
                                </td>
                                <td style={{ textAlign: "right", fontWeight: 600 }}>
                                    {Number(line.amount || 0).toFixed(2)}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteExpectedLine(line.id)}
                                        style={{ border: "none", background: "transparent", color: "#ef4444", cursor: "pointer" }}
                                    >
                                        <FaTimes size={11} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span className="scdc-add-line-link" onClick={handleAddExpectedLine}>
                    <FaPlus size={10} /> Add Another Line
                </span>
                <div style={{ fontSize: "12px", fontWeight: 600 }}>
                    Expected Total : {calculateExpectedTotal().toFixed(2)}
                </div>
            </div>

            {/* ==============================================================
                TABLE 3: OTHER CHARGES SECTION (Screenshot 5)
                ============================================================== */}
            <div className="scdc-other-charges-header">
                <span>Other Charges</span>
                <FaCog size={13} style={{ cursor: "pointer", color: "#64748b" }} />
            </div>

            <div className="scdc-table-wrapper" style={{ marginBottom: "8px" }}>
                <table className="scdc-table">
                    <thead>
                        <tr>
                            <th style={{ minWidth: "180px" }}>Account Name</th>
                            <th style={{ minWidth: "120px" }}>Currency</th>
                            <th style={{ minWidth: "120px" }}>Value</th>
                            <th style={{ minWidth: "140px" }}>Tax Group</th>
                            <th style={{ minWidth: "100px" }}>CGST</th>
                            <th style={{ minWidth: "100px" }}>SGST</th>
                            <th style={{ minWidth: "100px" }}>IGST</th>
                            <th style={{ width: "35px", textAlign: "center" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {otherCharges.map((oc, idx) => (
                            <tr key={oc.id}>
                                <td>
                                    <input
                                        type="text"
                                        className="scdc-tbl-input"
                                        placeholder="Type and selec"
                                        value={oc.accountName}
                                        onChange={(e) => handleOtherChargeChange(oc.id, "accountName", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <select
                                        className="scdc-select"
                                        style={{ height: "26px", fontSize: "11.5px" }}
                                        value={oc.currency}
                                        onChange={(e) => handleOtherChargeChange(oc.id, "currency", e.target.value)}
                                    >
                                        <option value="">&lt;--Select-</option>
                                        <option value="INR">INR</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="scdc-tbl-input"
                                        placeholder="Enter Amount"
                                        value={oc.value}
                                        onChange={(e) => handleOtherChargeChange(oc.id, "value", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <select
                                        className="scdc-select"
                                        style={{ height: "26px", fontSize: "11.5px" }}
                                        value={oc.taxGroup}
                                        onChange={(e) => handleOtherChargeChange(oc.id, "taxGroup", e.target.value)}
                                    >
                                        <option value="">Select Tax Gro</option>
                                        <option value="GST 5%">GST 5%</option>
                                        <option value="GST 12%">GST 12%</option>
                                        <option value="GST 18%">GST 18%</option>
                                    </select>
                                </td>
                                <td>
                                    <div style={{ background: "#f8fafc", padding: "2px 6px", fontSize: "11.5px", height: "26px", display: "flex", alignItems: "center" }}>
                                        {oc.cgst || "0.00"}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ background: "#f8fafc", padding: "2px 6px", fontSize: "11.5px", height: "26px", display: "flex", alignItems: "center" }}>
                                        {oc.sgst || "0.00"}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ background: "#f8fafc", padding: "2px 6px", fontSize: "11.5px", height: "26px", display: "flex", alignItems: "center" }}>
                                        {oc.igst || "0.00"}
                                    </div>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    {idx === otherCharges.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={handleAddOtherCharge}
                                            style={{ border: "1px solid #cbd5e1", background: "#ffffff", color: "#337ab7", borderRadius: "2px", padding: "2px 5px", cursor: "pointer" }}
                                        >
                                            <FaPlus size={10} />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteOtherCharge(oc.id)}
                                            style={{ border: "none", background: "transparent", color: "#94a3b8", cursor: "pointer" }}
                                        >
                                            <FaTimes size={10} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <label className="scdc-checkbox-label">
                <input
                    type="checkbox"
                    checked={defaultOtherCharges}
                    onChange={(e) => setDefaultOtherCharges(e.target.checked)}
                />
                Make it as my default other charges
            </label>

            {/* Remark & Internal Memo (Screenshot 5) */}
            <div className="scdc-remarks-grid">
                <div className="scdc-field-group">
                    <label className="scdc-field-label">Remark</label>
                    <textarea
                        className="scdc-textarea"
                        rows={3}
                        placeholder="Enter Remark"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                    />
                </div>

                <div className="scdc-field-group">
                    <label className="scdc-field-label">Memo for internal use</label>
                    <textarea
                        className="scdc-textarea"
                        rows={3}
                        placeholder="Enter Internal Memo"
                        value={internalMemo}
                        onChange={(e) => setInternalMemo(e.target.value)}
                    />
                </div>
            </div>

            {/* + Attachments... button */}
            <div>
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                />
                <button
                    type="button"
                    className="scdc-btn-blue"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                    <FaPlus size={10} /> Attachments...
                </button>

                {attachments.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                        {attachments.map((fn, i) => (
                            <span key={i} className="badge bg-light text-dark border p-1" style={{ fontSize: "11px" }}>
                                <FaPaperclip size={9} /> {fn}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* ==============================================================
                BOTTOM ACTION BUTTONS (Exact Match for Screenshot 5)
                ============================================================== */}
            <div className="scdc-bottom-actions-row">
                <button
                    type="button"
                    className="scdc-btn-save"
                    onClick={() => handleSaveDC(false)}
                >
                    <FaSave size={12} /> Save
                </button>

                <div style={{ position: "relative", display: "inline-block" }}>
                    <button
                        type="button"
                        className="scdc-btn-action-drop"
                        onClick={() => setActionMenuOpen(!actionMenuOpen)}
                    >
                        <FaCog size={11} /> Action <FaCaretDown size={11} />
                    </button>
                    {actionMenuOpen && (
                        <div
                            style={{
                                position: "absolute",
                                bottom: "34px",
                                right: 0,
                                background: "#ffffff",
                                border: "1px solid #cbd5e1",
                                borderRadius: "4px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                minWidth: "150px",
                                zIndex: 50
                            }}
                        >
                            <div
                                style={{ padding: "6px 12px", fontSize: "12px", cursor: "pointer", color: "#333" }}
                                onClick={() => {
                                    setActionMenuOpen(false);
                                    handleSaveDC(true);
                                }}
                            >
                                Save &amp; New
                            </div>
                            <div
                                style={{ padding: "6px 12px", fontSize: "12px", cursor: "pointer", color: "#333" }}
                                onClick={() => {
                                    setActionMenuOpen(false);
                                    window.print();
                                }}
                            >
                                Save &amp; Print
                            </div>
                            <div
                                style={{ padding: "6px 12px", fontSize: "12px", cursor: "pointer", color: "#e11d48" }}
                                onClick={() => {
                                    setActionMenuOpen(false);
                                    setViewMode("list");
                                }}
                            >
                                Cancel / Back to List
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className="scdc-btn-view"
                    onClick={() => showToast("Viewing Conversion DC")}
                >
                    <FaEye size={12} /> View
                </button>
            </div>
        </div>
    );
}
