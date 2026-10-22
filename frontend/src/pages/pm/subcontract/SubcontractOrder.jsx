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
    FaTrash,
    FaArrowLeft,
    FaSave,
    FaPrint,
    FaTimes
} from "react-icons/fa";
import "../../../styles/conversionGRN.css";
import "../../../styles/subcontractOrder.css";

const INITIAL_SUBCONTRACT_ORDERS = [
    {
        id: 1,
        orderNo: "SCO/9B/2627/028",
        date: "20-10-2026",
        subcontractor: "Supreme Embroidery Works",
        season: "SS27",
        branch: "Plot No. 9B - Main Unit",
        refNo: "REF-SEW-991",
        qty: "2,500 PCS",
        totalAmount: 112500,
        status: "Approved",
        remarks: "Embroidery on Front Panel"
    },
    {
        id: 2,
        orderNo: "SCO/9B/2627/027",
        date: "18-10-2026",
        subcontractor: "Golden Stitchers Ltd",
        season: "AW26",
        branch: "Plot No. 9B - Main Unit",
        refNo: "REF-GSL-402",
        qty: "4,000 PCS",
        totalAmount: 180000,
        status: "In Progress",
        remarks: "Collar & Cuff Attachment"
    },
    {
        id: 3,
        orderNo: "SCO/9B/2627/026",
        date: "15-10-2026",
        subcontractor: "Apex Dyeing & Washing",
        season: "SS27",
        branch: "Plot No. 9B - Main Unit",
        refNo: "REF-ADW-112",
        qty: "1,800 PCS",
        totalAmount: 72000,
        status: "Completed",
        remarks: "Enzyme Bio-wash Batch 4"
    }
];

export default function SubcontractOrder({ initialMode = "list" }) {
    const location = useLocation();
    const navigate = useNavigate();

    // View mode: 'list' or 'form'
    const isInitialForm =
        initialMode === "form" ||
        (location && (location.pathname.endsWith("/new") || location.search.includes("mode=new")));

    const [viewMode, setViewMode] = useState(isInitialForm ? "form" : "list");

    useEffect(() => {
        if (location && (location.pathname.endsWith("/new") || location.search.includes("mode=new") || initialMode === "form")) {
            setViewMode("form");
        }
    }, [location, initialMode]);

    // List view state
    const [orders, setOrders] = useState(INITIAL_SUBCONTRACT_ORDERS);
    const [searchFilter, setSearchFilter] = useState("");
    const [statusToast, setStatusToast] = useState("");

    // Top Form State (Matching Screenshot 1)
    const [orderPrefix, setOrderPrefix] = useState("SCO/9B/2627/");
    const [orderNoNumber, setOrderNoNumber] = useState("29");
    const [season, setSeason] = useState("");
    const [branch, setBranch] = useState("");
    const [defaultBranch, setDefaultBranch] = useState(false);
    const [date, setDate] = useState("");
    const [transportDetails, setTransportDetails] = useState("");
    const [subcontractor, setSubcontractor] = useState("");
    const [refNo, setRefNo] = useState("");

    // Primary Grid Lines (IO & Style lines)
    const [itemLines, setItemLines] = useState([
        {
            id: 1,
            ioNo: "",
            style: "",
            colour: "",
            sizeRange: "",
            qty: "",
            price: "",
            remark: "",
            amount: 0
        }
    ]);

    // Secondary Grid Lines (Accounts & Tax)
    const [accountLines, setAccountLines] = useState([
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

    // Instructions & Terms (Matching Screenshot 2 & 3)
    const [paymentTerms, setPaymentTerms] = useState("");
    const [deliveryTerms, setDeliveryTerms] = useState("");
    const [insuranceDetails, setInsuranceDetails] = useState("");
    const [specialInstruction, setSpecialInstruction] = useState("");
    const [packingInstruction, setPackingInstruction] = useState("");
    const [termsExpanded, setTermsExpanded] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState([]);

    const fileInputRef = useRef(null);
    const tableScrollRef = useRef(null);

    // Calculations
    const calculateItemsSubTotal = () => {
        return itemLines.reduce((acc, line) => {
            const val = parseFloat(line.amount) || 0;
            return acc + val;
        }, 0);
    };

    const calculateAccountsTotal = () => {
        return accountLines.reduce((acc, line) => {
            const val = parseFloat(line.value) || 0;
            return acc + val;
        }, 0);
    };

    const subTotal = calculateItemsSubTotal() + calculateAccountsTotal();
    const grandTotal = subTotal; // In standard setup tax can add to this

    const showNotification = (msg) => {
        setStatusToast(msg);
        setTimeout(() => setStatusToast(""), 3500);
    };

    // Primary grid item change
    const handleItemChange = (id, field, val) => {
        setItemLines((prev) =>
            prev.map((line) => {
                if (line.id !== id) return line;
                const updated = { ...line, [field]: val };
                if (field === "qty" || field === "price") {
                    const q = parseFloat(field === "qty" ? val : line.qty) || 0;
                    const p = parseFloat(field === "price" ? val : line.price) || 0;
                    updated.amount = q * p;
                }
                return updated;
            })
        );
    };

    const handleAddItemLine = () => {
        setItemLines((prev) => [
            ...prev,
            {
                id: Date.now(),
                ioNo: "",
                style: "",
                colour: "",
                sizeRange: "",
                qty: "",
                price: "",
                remark: "",
                amount: 0
            }
        ]);
    };

    const handleDeleteItemLine = (id) => {
        if (itemLines.length === 1) {
            setItemLines([
                {
                    id: Date.now(),
                    ioNo: "",
                    style: "",
                    colour: "",
                    sizeRange: "",
                    qty: "",
                    price: "",
                    remark: "",
                    amount: 0
                }
            ]);
            return;
        }
        setItemLines(itemLines.filter((l) => l.id !== id));
    };

    // Secondary grid account change
    const handleAccountChange = (id, field, val) => {
        setAccountLines((prev) =>
            prev.map((line) => {
                if (line.id !== id) return line;
                const updated = { ...line, [field]: val };
                if (field === "taxGroup" || field === "value") {
                    const v = parseFloat(field === "value" ? val : line.value) || 0;
                    const tg = field === "taxGroup" ? val : line.taxGroup;
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

    const handleAddAccountLine = () => {
        setAccountLines((prev) => [
            ...prev,
            {
                id: Date.now(),
                accountName: "",
                currency: "",
                value: "",
                taxGroup: "",
                cgst: "",
                sgst: "",
                igst: ""
            }
        ]);
    };

    const handleDeleteAccountLine = (id) => {
        if (accountLines.length <= 1) return;
        setAccountLines(accountLines.filter((l) => l.id !== id));
    };

    // File attachments
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setAttachedFiles((prev) => [...prev, ...files.map((f) => f.name)]);
            showNotification(`Attached ${files.length} file(s)`);
        }
    };

    const handleScrollTable = (direction) => {
        if (tableScrollRef.current) {
            const shift = direction === "left" ? -200 : 200;
            tableScrollRef.current.scrollBy({ left: shift, behavior: "smooth" });
        }
    };

    // Reset Form for New
    const resetForm = () => {
        const nextNum = (parseInt(orderNoNumber, 10) + 1).toString();
        setOrderNoNumber(nextNum);
        setSeason("");
        setBranch("");
        setDate("");
        setTransportDetails("");
        setSubcontractor("");
        setRefNo("");
        setItemLines([
            {
                id: Date.now(),
                ioNo: "",
                style: "",
                colour: "",
                sizeRange: "",
                qty: "",
                price: "",
                remark: "",
                amount: 0
            }
        ]);
        setAccountLines([
            { id: 1, accountName: "", currency: "", value: "", taxGroup: "", cgst: "", sgst: "", igst: "" },
            { id: 2, accountName: "", currency: "", value: "", taxGroup: "", cgst: "", sgst: "", igst: "" }
        ]);
        setPaymentTerms("");
        setDeliveryTerms("");
        setInsuranceDetails("");
        setSpecialInstruction("");
        setPackingInstruction("");
        setAttachedFiles([]);
    };

    // Save Form
    const handleSaveOrder = (saveAndNew = false) => {
        const newRecord = {
            id: Date.now(),
            orderNo: `${orderPrefix}${orderNoNumber}`,
            date: date || new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
            subcontractor: subcontractor || "Supreme Embroidery Works",
            season: season || "SS27",
            branch: branch || "Plot No. 9B - Main Unit",
            refNo: refNo || "REF-" + Math.floor(100 + Math.random() * 900),
            qty:
                itemLines.reduce((acc, l) => acc + (parseFloat(l.qty) || 0), 0) > 0
                    ? `${itemLines.reduce((acc, l) => acc + (parseFloat(l.qty) || 0), 0)} PCS`
                    : "1,200 PCS",
            totalAmount: grandTotal || 45000,
            status: "Draft",
            remarks: transportDetails || "New Subcontract Order Created"
        };

        setOrders([newRecord, ...orders]);
        showNotification(`Subcontract Order ${newRecord.orderNo} saved successfully!`);

        if (saveAndNew) {
            resetForm();
        } else {
            setViewMode("list");
        }
    };

    // Filtered list view records
    const filteredOrders = orders.filter((o) => {
        if (!searchFilter.trim()) return true;
        const q = searchFilter.toLowerCase();
        return (
            o.orderNo.toLowerCase().includes(q) ||
            o.subcontractor.toLowerCase().includes(q) ||
            o.season.toLowerCase().includes(q) ||
            o.branch.toLowerCase().includes(q)
        );
    });

    // =========================================================================
    // RENDER: LIST VIEW (EXACT MATCH FOR SCREENSHOT WITH GREEN NEW BUTTON)
    // =========================================================================
    if (viewMode === "list") {
        return (
            <div className="cgrn-page">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div>
                        <span style={{ fontSize: "11.5px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            PM &bull; SUBCONTRACT
                        </span>
                        <h1 className="cgrn-page-title" style={{ margin: "2px 0 0 0" }}>Subcontract Order / DC</h1>
                    </div>

                    <div className="cgrn-right-actions">
                        <button
                            type="button"
                            className="cgrn-btn-new"
                            onClick={() => {
                                setViewMode("form");
                                if (window.history && window.history.pushState) {
                                    window.history.pushState({}, "", "/pm/subcontract-order-dc/new");
                                }
                            }}
                        >
                            <FaPlus style={{ fontSize: "11px" }} />
                            <span>New Subcontract Order / DC</span>
                        </button>
                    </div>
                </div>

                {/* Status toast message */}
                {statusToast && (
                    <div className="alert alert-success py-1 px-3 mb-2" style={{ fontSize: "12px" }}>
                        {statusToast}
                    </div>
                )}

                {/* Top Toolbar */}
                <div className="cgrn-toolbar">
                    <div className="cgrn-toolbar-left">
                        <button
                            type="button"
                            className="cgrn-icon-btn"
                            title="Reload"
                            onClick={() => showNotification("Subcontract orders reloaded")}
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
                            onClick={() => showNotification("Grid settings configured")}
                        >
                            <FaCog />
                        </button>
                        <button
                            type="button"
                            className="cgrn-filter-btn"
                            onClick={() => showNotification("Filter activated")}
                        >
                            <FaFilter style={{ fontSize: "11px" }} />
                            <span>Filter</span>
                        </button>
                    </div>
                    <div>
                        <span className="cgrn-page-badge">1</span>
                    </div>
                </div>

                {/* Table matching Screenshot */}
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
                            {orders.map((row) => (
                                <tr key={row.id}>
                                    <td style={{ textAlign: "center" }}>
                                        <button
                                            type="button"
                                            className="cgrn-action-btn"
                                            onClick={() => {
                                                setSubcontractor(row.subcontractor);
                                                setSeason(row.season);
                                                setBranch(row.branch);
                                                setDate(row.date);
                                                setRefNo(row.refNo);
                                                setViewMode("form");
                                            }}
                                        >
                                            Action
                                        </button>
                                    </td>
                                    <td style={{ fontWeight: 600, color: "#1a5695" }}>{row.orderNo}</td>
                                    <td>{row.date}</td>
                                    <td>{row.branch}</td>
                                    <td style={{ fontWeight: 600 }}>{row.qty}</td>
                                    <td>
                                        <span
                                            className={`cgrn-status-badge ${
                                                row.status === "Completed"
                                                    ? "cgrn-status-completed"
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
    // RENDER: NEW SUBCONTRACT ORDER FORM (EXACT MATCH FOR SCREENSHOTS 1, 2, 3)
    // =========================================================================
    return (
        <div className="sco-page">
            {/* Top Title & Navigation */}
            <div className="sco-header-row">
                <div>
                    <h1 className="sco-title">
                        Subcontract Order
                        <span className="sco-badge-unit">Plot No. 9B &bull; FY 01-Apr-2026 - 31-Mar-2027</span>
                    </h1>
                </div>

                <div className="sco-header-actions">
                    <button
                        type="button"
                        className="sco-btn-secondary"
                        onClick={() => {
                            setViewMode("list");
                            if (window.history && window.history.pushState) {
                                window.history.pushState({}, "", "/pm/subcontract-order-dc");
                            }
                        }}
                    >
                        <FaArrowLeft /> Back to List
                    </button>
                    <button
                        type="button"
                        className="sco-btn-primary"
                        onClick={() => handleSaveOrder(false)}
                    >
                        <FaSave /> Save
                    </button>
                    <button
                        type="button"
                        className="sco-btn-primary"
                        style={{ background: "#2563eb", borderColor: "#1d4ed8" }}
                        onClick={() => handleSaveOrder(true)}
                    >
                        Save &amp; New
                    </button>
                    <button
                        type="button"
                        className="sco-btn-secondary"
                        onClick={() => window.print()}
                    >
                        <FaPrint /> Print
                    </button>
                </div>
            </div>

            {/* Notification alert */}
            {statusToast && (
                <div className="alert alert-info py-1 px-3 mb-3" style={{ fontSize: "12px" }}>
                    {statusToast}
                </div>
            )}

            {/* ==============================================================
                TOP FORM FIELDS (Row 1-4 matching Screenshot 1)
                ============================================================== */}
            <div className="sco-form-top-grid">
                {/* Order No. */}
                <div className="sco-field-group">
                    <label className="sco-field-label">Order No.</label>
                    <div className="sco-order-compound">
                        <select
                            className="sco-order-prefix-select"
                            value={orderPrefix}
                            onChange={(e) => setOrderPrefix(e.target.value)}
                        >
                            <option value="SCO/9B/2627/">SCO/9B/2627/</option>
                            <option value="SCO/9B/2526/">SCO/9B/2526/</option>
                            <option value="SCO/FBD/2627/">SCO/FBD/2627/</option>
                        </select>
                        <input
                            type="text"
                            className="sco-order-num-input"
                            value={orderNoNumber}
                            onChange={(e) => setOrderNoNumber(e.target.value)}
                        />
                        <button
                            type="button"
                            className="sco-btn-gear"
                            title="Order Number Settings"
                            onClick={() => showNotification("Order Number Sequence configured")}
                        >
                            <FaCog size={13} />
                        </button>
                    </div>
                </div>

                {/* Season */}
                <div className="sco-field-group">
                    <label className="sco-field-label">Season</label>
                    <input
                        type="text"
                        className="sco-input"
                        placeholder="Type & Select Season"
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        list="seasons-list"
                    />
                    <datalist id="seasons-list">
                        <option value="SS27" />
                        <option value="AW26" />
                        <option value="FW26" />
                        <option value="Spring Summer 2027" />
                    </datalist>
                </div>

                {/* Branch */}
                <div className="sco-field-group">
                    <label className="sco-field-label">
                        Branch <span className="sco-req">*</span>
                    </label>
                    <input
                        type="text"
                        className="sco-input"
                        placeholder="Type and select Branch"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        list="branches-list"
                    />
                    <datalist id="branches-list">
                        <option value="Plot No. 9B - Main Unit" />
                        <option value="Unit 2 - Okhla Phase 1" />
                        <option value="Faridabad Central Plant" />
                    </datalist>
                    <label className="sco-checkbox-label">
                        <input
                            type="checkbox"
                            checked={defaultBranch}
                            onChange={(e) => setDefaultBranch(e.target.checked)}
                        />
                        Make this as my default branch
                    </label>
                </div>

                {/* Date */}
                <div className="sco-field-group">
                    <label className="sco-field-label">
                        Date <span className="sco-req">*</span>
                    </label>
                    <div className="sco-date-wrap">
                        <input
                            type="date"
                            className="sco-date-input"
                            placeholder="Select Date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <span className="sco-date-icon-btn">
                            <FaCalendarAlt size={12} />
                        </span>
                    </div>
                </div>

                {/* Transport Details (Spans rows 2 & 3 in Screenshot 1) */}
                <div className="sco-field-group" style={{ gridRow: "span 2" }}>
                    <label className="sco-field-label">Transport Details</label>
                    <textarea
                        className="sco-textarea"
                        rows={4}
                        placeholder="Enter Transport Details"
                        value={transportDetails}
                        onChange={(e) => setTransportDetails(e.target.value)}
                    />
                </div>

                {/* Empty column placeholder for row 2 to align with screenshot */}
                <div></div>

                {/* Subcontractor */}
                <div className="sco-field-group">
                    <label className="sco-field-label">
                        Subcontractor <span className="sco-req">*</span>
                    </label>
                    <input
                        type="text"
                        className="sco-input"
                        placeholder="Type & Select Subcontractor"
                        value={subcontractor}
                        onChange={(e) => setSubcontractor(e.target.value)}
                        list="subcontractor-list"
                    />
                    <datalist id="subcontractor-list">
                        <option value="Supreme Embroidery Works" />
                        <option value="Golden Stitchers Ltd" />
                        <option value="Apex Dyeing & Washing" />
                        <option value="Classic Button Holing & Finishing" />
                        <option value="Quality Print Craft Unit" />
                    </datalist>
                </div>

                {/* Row 4: Ref No. */}
                <div className="sco-field-group">
                    <label className="sco-field-label">Ref No.</label>
                    <input
                        type="text"
                        className="sco-input"
                        placeholder="Enter Ref No."
                        value={refNo}
                        onChange={(e) => setRefNo(e.target.value)}
                    />
                </div>
            </div>

            {/* ==============================================================
                PRIMARY TABLE: IO / STYLE GRID (Screenshot 1)
                ============================================================== */}
            <div className="sco-table-wrapper" ref={tableScrollRef}>
                <table className="sco-table">
                    <thead>
                        <tr>
                            <th style={{ minWidth: "140px" }}>
                                IO No <span className="sco-req">*</span>
                            </th>
                            <th style={{ minWidth: "160px" }}>
                                Style <span className="sco-req">*</span>
                            </th>
                            <th style={{ minWidth: "140px" }}>Colour</th>
                            <th style={{ minWidth: "140px" }}>
                                Size range <span className="sco-req">*</span>
                            </th>
                            <th style={{ minWidth: "100px" }}>
                                Qty <span className="sco-req">*</span>
                            </th>
                            <th style={{ minWidth: "100px" }}>Price</th>
                            <th style={{ minWidth: "140px" }}>Remark</th>
                            <th style={{ minWidth: "110px", textAlign: "right" }}>Amount</th>
                            <th style={{ width: "40px", textAlign: "center" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemLines.map((line) => (
                            <tr key={line.id}>
                                {/* IO No */}
                                <td>
                                    <div className="sco-io-compound">
                                        <input
                                            type="text"
                                            className="sco-tbl-input"
                                            placeholder="Enter IO No"
                                            value={line.ioNo}
                                            onChange={(e) => handleItemChange(line.id, "ioNo", e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="sco-io-btn"
                                            title="Pick IO No"
                                            onClick={() =>
                                                handleItemChange(line.id, "ioNo", "IO/9B/2627/042")
                                            }
                                        >
                                            <FaListAlt />
                                        </button>
                                    </div>
                                </td>

                                {/* Style */}
                                <td>
                                    <input
                                        type="text"
                                        className="sco-tbl-input"
                                        placeholder="Type & Select Style"
                                        value={line.style}
                                        onChange={(e) => handleItemChange(line.id, "style", e.target.value)}
                                    />
                                </td>

                                {/* Colour */}
                                <td>
                                    <input
                                        type="text"
                                        className="sco-tbl-input"
                                        placeholder="Type & Select Colour"
                                        value={line.colour}
                                        onChange={(e) => handleItemChange(line.id, "colour", e.target.value)}
                                    />
                                </td>

                                {/* Size range */}
                                <td>
                                    <input
                                        type="text"
                                        className="sco-tbl-input"
                                        placeholder="Type & Select Size range"
                                        value={line.sizeRange}
                                        onChange={(e) => handleItemChange(line.id, "sizeRange", e.target.value)}
                                    />
                                </td>

                                {/* Qty */}
                                <td>
                                    <input
                                        type="number"
                                        className="sco-tbl-input"
                                        placeholder="Enter Qty"
                                        value={line.qty}
                                        onChange={(e) => handleItemChange(line.id, "qty", e.target.value)}
                                    />
                                </td>

                                {/* Price */}
                                <td>
                                    <input
                                        type="number"
                                        className="sco-tbl-input"
                                        placeholder="Enter Price"
                                        value={line.price}
                                        onChange={(e) => handleItemChange(line.id, "price", e.target.value)}
                                    />
                                </td>

                                {/* Remark */}
                                <td>
                                    <input
                                        type="text"
                                        className="sco-tbl-input"
                                        placeholder="Enter Remark"
                                        value={line.remark}
                                        onChange={(e) => handleItemChange(line.id, "remark", e.target.value)}
                                    />
                                </td>

                                {/* Amount */}
                                <td style={{ textAlign: "right", fontWeight: 600 }}>
                                    {Number(line.amount || 0).toFixed(2)}
                                </td>

                                {/* Delete */}
                                <td style={{ textAlign: "center" }}>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteItemLine(line.id)}
                                        style={{
                                            border: "none",
                                            background: "transparent",
                                            color: "#ef4444",
                                            cursor: "pointer"
                                        }}
                                        title="Remove Line"
                                    >
                                        <FaTimes size={11} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Scroll navigation arrows */}
            <div className="sco-scroll-controls">
                <button
                    type="button"
                    className="sco-scroll-arrow"
                    onClick={() => handleScrollTable("left")}
                    title="Scroll left"
                >
                    <FaChevronLeft />
                </button>
                <div className="sco-scroll-track"></div>
                <button
                    type="button"
                    className="sco-scroll-arrow"
                    onClick={() => handleScrollTable("right")}
                    title="Scroll right"
                >
                    <FaChevronRight />
                </button>
            </div>

            {/* + Add Another Line link */}
            <div>
                <span className="sco-add-line-link" onClick={handleAddItemLine}>
                    <FaPlus size={10} /> Add Another Line
                </span>
            </div>

            {/* ==============================================================
                SECONDARY TABLE: ACCOUNTS & TAXES (Screenshot 1 & 2)
                ============================================================== */}
            <div className="sco-accounts-table-wrapper">
                <table className="sco-accounts-table">
                    <thead>
                        <tr>
                            <th style={{ minWidth: "180px" }}>Account Name</th>
                            <th style={{ minWidth: "120px" }}>Currency</th>
                            <th style={{ minWidth: "120px" }}>Value</th>
                            <th style={{ minWidth: "140px" }}>Tax Group</th>
                            <th style={{ minWidth: "100px" }}>CGST</th>
                            <th style={{ minWidth: "100px" }}>SGST</th>
                            <th style={{ minWidth: "100px" }}>IGST</th>
                            <th style={{ width: "40px", textAlign: "center" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {accountLines.map((accLine, idx) => (
                            <tr key={accLine.id}>
                                <td>
                                    <input
                                        type="text"
                                        className="sco-tbl-input"
                                        placeholder="Type and select..."
                                        value={accLine.accountName}
                                        onChange={(e) => handleAccountChange(accLine.id, "accountName", e.target.value)}
                                        list="accounts-list"
                                    />
                                    <datalist id="accounts-list">
                                        <option value="Job Work Charges - Embroidery" />
                                        <option value="Dyeing & Washing Charges" />
                                        <option value="Freight & Forwarding" />
                                        <option value="Packaging & Handling" />
                                    </datalist>
                                </td>
                                <td>
                                    <select
                                        className="sco-tbl-select"
                                        value={accLine.currency}
                                        onChange={(e) => handleAccountChange(accLine.id, "currency", e.target.value)}
                                    >
                                        <option value="">&lt;--Select-</option>
                                        <option value="INR">INR</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="sco-tbl-input"
                                        placeholder="Enter Amount"
                                        value={accLine.value}
                                        onChange={(e) => handleAccountChange(accLine.id, "value", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <select
                                        className="sco-tbl-select"
                                        value={accLine.taxGroup}
                                        onChange={(e) => handleAccountChange(accLine.id, "taxGroup", e.target.value)}
                                    >
                                        <option value="">Select Tax Group...</option>
                                        <option value="GST 5%">GST 5%</option>
                                        <option value="GST 12%">GST 12%</option>
                                        <option value="GST 18%">GST 18%</option>
                                        <option value="Exempted">Exempted</option>
                                    </select>
                                </td>
                                <td>
                                    <div className="sco-tax-readonly">{accLine.cgst || "0.00"}</div>
                                </td>
                                <td>
                                    <div className="sco-tax-readonly">{accLine.sgst || "0.00"}</div>
                                </td>
                                <td>
                                    <div className="sco-tax-readonly">{accLine.igst || "0.00"}</div>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    {idx === accountLines.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={handleAddAccountLine}
                                            style={{
                                                border: "1px solid #cbd5e1",
                                                background: "#ffffff",
                                                color: "#337ab7",
                                                borderRadius: "2px",
                                                padding: "2px 5px",
                                                cursor: "pointer"
                                            }}
                                            title="Add Account Line"
                                        >
                                            <FaPlus size={10} />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteAccountLine(accLine.id)}
                                            style={{
                                                border: "none",
                                                background: "transparent",
                                                color: "#94a3b8",
                                                cursor: "pointer"
                                            }}
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

            {/* ==============================================================
                INSTRUCTIONS & TERMS SECTION (Screenshot 2 & 3)
                ============================================================== */}
            <h3 className="sco-section-title">Instructions &amp; Terms</h3>

            <div className="sco-instructions-grid">
                {/* Column 1 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div className="sco-field-group">
                        <label className="sco-field-label">Payment Terms</label>
                        <textarea
                            className="sco-textarea"
                            rows={3}
                            placeholder="Enter Payment Terms"
                            value={paymentTerms}
                            onChange={(e) => setPaymentTerms(e.target.value)}
                        />
                    </div>

                    <div className="sco-field-group">
                        <label className="sco-field-label">Delivery Terms</label>
                        <textarea
                            className="sco-textarea"
                            rows={3}
                            placeholder="Enter Delivery Terms"
                            value={deliveryTerms}
                            onChange={(e) => setDeliveryTerms(e.target.value)}
                        />
                    </div>

                    {/* Packing & labeling Instruction (Screenshot 3) */}
                    <div className="sco-field-group">
                        <label className="sco-field-label">Packing &amp; labeling Instruction</label>
                        <textarea
                            className="sco-textarea"
                            rows={3}
                            placeholder="Enter Packing & labeling Instruction"
                            value={packingInstruction}
                            onChange={(e) => setPackingInstruction(e.target.value)}
                        />
                    </div>

                    {/* Add Files button */}
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
                            className="sco-btn-add-files"
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        >
                            <FaPlus size={10} /> Add files...
                        </button>

                        {attachedFiles.length > 0 && (
                            <div className="sco-file-chips">
                                {attachedFiles.map((fn, i) => (
                                    <span key={i} className="sco-file-chip">
                                        <FaPaperclip size={10} /> {fn}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Terms & Conditions expandable link */}
                    <div>
                        <span
                            className="sco-terms-link"
                            onClick={() => setTermsExpanded(!termsExpanded)}
                        >
                            Terms &amp; Conditions {termsExpanded ? "▲" : "▼"}
                        </span>
                        {termsExpanded && (
                            <div
                                style={{
                                    marginTop: "6px",
                                    padding: "8px 12px",
                                    background: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "3px",
                                    fontSize: "11.5px",
                                    color: "#475569",
                                    lineHeight: "1.5"
                                }}
                            >
                                1. Goods delivered must conform strictly to the approved technical specification.<br />
                                2. Inward inspection rejection exceeding 2% will be debited to subcontractor account.<br />
                                3. Payment will be released within 30 days of QC approval and GRN generation.
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 2 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div className="sco-field-group">
                        <label className="sco-field-label">Insurance Details</label>
                        <textarea
                            className="sco-textarea"
                            rows={3}
                            placeholder="Enter Insurance Details"
                            value={insuranceDetails}
                            onChange={(e) => setInsuranceDetails(e.target.value)}
                        />
                    </div>

                    <div className="sco-field-group">
                        <label className="sco-field-label">Special Instruction</label>
                        <textarea
                            className="sco-textarea"
                            rows={3}
                            placeholder="Enter Special Instruction"
                            value={specialInstruction}
                            onChange={(e) => setSpecialInstruction(e.target.value)}
                        />
                    </div>
                </div>

                {/* Column 3: Totals Summary Box (Screenshot 2 & 3) */}
                <div>
                    <div className="sco-summary-box">
                        <div className="sco-summary-line">
                            <span>Sub Total :</span>
                            <span style={{ fontWeight: 600 }}>{subTotal.toFixed(2)}</span>
                        </div>
                        <div className="sco-summary-line total">
                            <span>Total :</span>
                            <span>{grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="sco-bottom-bar">
                <button
                    type="button"
                    className="sco-btn-primary"
                    onClick={() => handleSaveOrder(false)}
                >
                    <FaSave /> Save Subcontract Order
                </button>
                <button
                    type="button"
                    className="sco-btn-primary"
                    style={{ background: "#2563eb", borderColor: "#1d4ed8" }}
                    onClick={() => handleSaveOrder(true)}
                >
                    Save &amp; New
                </button>
                <button
                    type="button"
                    className="sco-btn-secondary"
                    onClick={() => {
                        setViewMode("list");
                        if (window.history && window.history.pushState) {
                            window.history.pushState({}, "", "/pm/subcontract-order-dc");
                        }
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
