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
import "../../../styles/subcontractGRN.css";

const INITIAL_GRN_RECORDS = [
    {
        id: 1,
        docNo: "SUB/9B/2627/001",
        grnNo: "JW/GRN/2627/025",
        date: "12-10-2026",
        unit: "Plot No. 9B",
        qty: "120 PCS",
        status: "Active",
        remarks: "Standard production batch",
        subcontractor: "Supreme Embroidery Works",
        dcNo: "DC-9011",
        invoiceNo: "INV-2026-441",
        store: "Plot No. 9B - Raw Material Godown",
        jwOrderNo: "JWO-2627-019"
    },
    {
        id: 2,
        docNo: "SUB/9B/2627/002",
        grnNo: "JW/GRN/2627/024",
        date: "10-10-2026",
        unit: "Plot No. 9B",
        qty: "350 PCS",
        status: "Completed",
        remarks: "Verified by QC line 2",
        subcontractor: "Golden Stitchers Ltd",
        dcNo: "DC-8974",
        invoiceNo: "INV-2026-419",
        store: "Plot No. 9B - Accessories Godown",
        jwOrderNo: "JWO-2627-015"
    },
    {
        id: 3,
        docNo: "SUB/9B/2627/003",
        grnNo: "JW/GRN/2627/023",
        date: "08-10-2026",
        unit: "Plot No. 9B",
        qty: "85 PCS",
        status: "Pending",
        remarks: "Scheduled for next shift",
        subcontractor: "Apex Dyeing & Washing",
        dcNo: "DC-8910",
        invoiceNo: "INV-2026-388",
        store: "Plot No. 9B - Processing Godown",
        jwOrderNo: "JWO-2627-011"
    }
];

export default function SubcontractGRN({ initialMode = "list" }) {
    const location = useLocation();
    const navigate = useNavigate();

    // Determine initial mode based on prop or route
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
    const [records, setRecords] = useState(INITIAL_GRN_RECORDS);
    const [toastMessage, setToastMessage] = useState("");

    // Form State (Matching Screenshot 2)
    const [grnPrefix, setGrnPrefix] = useState("JW/GRN/2627/");
    const [grnNo, setGrnNo] = useState("26");
    const [receivedBy, setReceivedBy] = useState("");
    const [date, setDate] = useState("");
    const [dcNo, setDcNo] = useState("");
    const [subcontractor, setSubcontractor] = useState("");
    const [dcDate, setDcDate] = useState("");
    const [invoiceNo, setInvoiceNo] = useState("");
    const [transportDetails, setTransportDetails] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [store, setStore] = useState("");
    const [workCompletionStatus, setWorkCompletionStatus] = useState("Work is completed");
    const [gateEntryNo, setGateEntryNo] = useState("");
    const [jwOrderNo, setJwOrderNo] = useState("");

    // Primary Grid Lines (Matching Screenshot 3)
    const [itemLines, setItemLines] = useState([
        {
            id: 1,
            jwOrderNo: "",
            component: "",
            operation: "",
            ioNo: "",
            style: "",
            uom: "PCS",
            colour: "",
            sizeRange: "",
            recdQty: "",
            rate: "",
            amount: 0
        }
    ]);

    // Other Charges Lines (Matching Screenshot 3)
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

    // Instructions & Terms (Matching Screenshot 3, 4, 5)
    const [paymentTerms, setPaymentTerms] = useState("");
    const [deliveryTerms, setDeliveryTerms] = useState("");
    const [insuranceDetails, setInsuranceDetails] = useState("");
    const [specialInstruction, setSpecialInstruction] = useState("");
    const [packingInstruction, setPackingInstruction] = useState("");
    const [termsExpanded, setTermsExpanded] = useState(false);
    const [defaultTerms, setDefaultTerms] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [actionMenuOpen, setActionMenuOpen] = useState(false);

    const fileInputRef = useRef(null);
    const tableScrollRef = useRef(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3500);
    };

    // Calculate totals
    const calculateItemsTotal = () => {
        return itemLines.reduce((acc, line) => acc + (parseFloat(line.amount) || 0), 0);
    };

    const calculateOtherChargesTotal = () => {
        return otherCharges.reduce((acc, line) => acc + (parseFloat(line.value) || 0), 0);
    };

    const subTotal = calculateItemsTotal() + calculateOtherChargesTotal();
    const grandTotal = subTotal;

    // Handle Item changes
    const handleItemChange = (id, field, val) => {
        setItemLines((prev) =>
            prev.map((line) => {
                if (line.id !== id) return line;
                const updated = { ...line, [field]: val };
                if (field === "recdQty" || field === "rate") {
                    const q = parseFloat(field === "recdQty" ? val : line.recdQty) || 0;
                    const r = parseFloat(field === "rate" ? val : line.rate) || 0;
                    updated.amount = q * r;
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
                jwOrderNo: jwOrderNo || "",
                component: "",
                operation: "",
                ioNo: "",
                style: "",
                uom: "PCS",
                colour: "",
                sizeRange: "",
                recdQty: "",
                rate: "",
                amount: 0
            }
        ]);
    };

    const handleDeleteItemLine = (id) => {
        if (itemLines.length === 1) {
            setItemLines([
                {
                    id: Date.now(),
                    jwOrderNo: "",
                    component: "",
                    operation: "",
                    ioNo: "",
                    style: "",
                    uom: "PCS",
                    colour: "",
                    sizeRange: "",
                    recdQty: "",
                    rate: "",
                    amount: 0
                }
            ]);
            return;
        }
        setItemLines(itemLines.filter((l) => l.id !== id));
    };

    // Populate from JW Order
    const handleDisplayFromJwOrder = () => {
        if (!jwOrderNo.trim()) {
            setJwOrderNo("JWO/9B/2627/041");
        }
        setItemLines([
            {
                id: 1,
                jwOrderNo: jwOrderNo.trim() || "JWO/9B/2627/041",
                component: "Front Panel Embroidery",
                operation: "Multi-head Embroidery",
                ioNo: "IO/9B/2627/088",
                style: "STY-5510 Cotton Polo",
                uom: "PCS",
                colour: "Navy Blue",
                sizeRange: "S-XXL",
                recdQty: "850",
                rate: "35.00",
                amount: 29750
            },
            {
                id: 2,
                jwOrderNo: jwOrderNo.trim() || "JWO/9B/2627/041",
                component: "Collar & Cuff Jacquard",
                operation: "Flat Knit Attaching",
                ioNo: "IO/9B/2627/088",
                style: "STY-5510 Cotton Polo",
                uom: "PCS",
                colour: "White Trim",
                sizeRange: "S-XXL",
                recdQty: "850",
                rate: "18.00",
                amount: 15300
            }
        ]);
        if (!subcontractor) setSubcontractor("Supreme Embroidery Works");
        if (!store) setStore("Plot No. 9B - Raw Material Godown");
        showToast("Loaded line items from Job Work Order successfully!");
    };

    // Other Charges
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

    // File Upload
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setAttachedFiles((prev) => [...prev, ...files.map((f) => f.name)]);
            showToast(`Attached ${files.length} file(s)`);
        }
    };

    const handleScrollTable = (direction) => {
        if (tableScrollRef.current) {
            const shift = direction === "left" ? -220 : 220;
            tableScrollRef.current.scrollBy({ left: shift, behavior: "smooth" });
        }
    };

    // Save Action
    const handleSaveGRN = (saveAndNew = false) => {
        const fullGrnNo = `${grnPrefix}${grnNo}`;
        const newRecord = {
            id: Date.now(),
            docNo: `SUB/9B/2627/00${records.length + 1}`,
            grnNo: fullGrnNo,
            date: date || new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
            unit: store || "Plot No. 9B",
            qty:
                itemLines.reduce((acc, l) => acc + (parseFloat(l.recdQty) || 0), 0) > 0
                    ? `${itemLines.reduce((acc, l) => acc + (parseFloat(l.recdQty) || 0), 0)} PCS`
                    : "150 PCS",
            status: "Active",
            remarks: transportDetails || "Subcontract GRN Inward Completed",
            subcontractor: subcontractor || "Supreme Embroidery Works",
            dcNo: dcNo || "DC-9088",
            invoiceNo: invoiceNo || "INV-9921",
            store: store || "Plot No. 9B - RM Godown",
            jwOrderNo: jwOrderNo || "JWO-2627-041"
        };

        setRecords([newRecord, ...records]);
        showToast(`Subcontract GRN ${fullGrnNo} saved successfully!`);

        if (saveAndNew) {
            setGrnNo((parseInt(grnNo, 10) + 1).toString());
            setDcNo("");
            setInvoiceNo("");
            setTransportDetails("");
            setItemLines([
                {
                    id: Date.now(),
                    jwOrderNo: "",
                    component: "",
                    operation: "",
                    ioNo: "",
                    style: "",
                    uom: "PCS",
                    colour: "",
                    sizeRange: "",
                    recdQty: "",
                    rate: "",
                    amount: 0
                }
            ]);
            setAttachedFiles([]);
        } else {
            setViewMode("list");
            if (window.history && window.history.pushState) {
                window.history.pushState({}, "", "/pm/subcontract-grn");
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
                            Subcontract GRN
                        </h1>
                    </div>

                    <div className="cgrn-right-actions">
                        <button
                            type="button"
                            className="cgrn-btn-new"
                            onClick={() => {
                                setViewMode("form");
                                if (window.history && window.history.pushState) {
                                    window.history.pushState({}, "", "/pm/subcontract-grn/new");
                                }
                            }}
                        >
                            <FaPlus style={{ fontSize: "11px" }} />
                            <span>New Subcontract GRN</span>
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
                            onClick={() => showToast("Subcontract GRN records refreshed")}
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
                                                setDcNo(row.dcNo);
                                                setInvoiceNo(row.invoiceNo);
                                                setJwOrderNo(row.jwOrderNo);
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
    // RENDER: NEW SUBCONTRACT GRN FORM (MATCHING SCREENSHOTS 2, 3, 4, 5)
    // =========================================================================
    return (
        <div className="scgrn-page">
            {/* Header */}
            <div className="scgrn-header-row">
                <div>
                    <h1 className="scgrn-title">
                        Subcontract GRN
                        <span className="scgrn-badge-unit">Plot No. 9B &bull; FY 01-Apr-2026 - 31-Mar-2027</span>
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
                                window.history.pushState({}, "", "/pm/subcontract-grn");
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

            {/* ==============================================================
                TOP 2-COLUMN FORM FIELDS (Screenshot 2)
                ============================================================== */}
            <div className="scgrn-top-grid">
                {/* Left Col 1: GRN No */}
                <div className="scgrn-field-group">
                    <label className="scgrn-field-label">GRN No</label>
                    <div className="scgrn-compound-grn">
                        <select
                            className="scgrn-prefix-select"
                            value={grnPrefix}
                            onChange={(e) => setGrnPrefix(e.target.value)}
                        >
                            <option value="JW/GRN/2627/">JW/GRN/2627/</option>
                            <option value="JW/GRN/2526/">JW/GRN/2526/</option>
                            <option value="JW/GRN/FBD/">JW/GRN/FBD/</option>
                        </select>
                        <input
                            type="text"
                            className="scgrn-num-input"
                            value={grnNo}
                            onChange={(e) => setGrnNo(e.target.value)}
                        />
                        <button
                            type="button"
                            className="scgrn-gear-btn"
                            title="GRN Sequence Settings"
                            onClick={() => showToast("GRN numbering sequence configuration")}
                        >
                            <FaCog size={13} />
                        </button>
                    </div>
                </div>

                {/* Right Col 1: Received By */}
                <div className="scgrn-field-group">
                    <label className="scgrn-field-label">Received By</label>
                    <input
                        type="text"
                        className="scgrn-input"
                        placeholder="Enter Recd By"
                        value={receivedBy}
                        onChange={(e) => setReceivedBy(e.target.value)}
                    />
                </div>

                {/* Left Col 2: Date */}
                <div className="scgrn-field-group">
                    <label className="scgrn-field-label">
                        Date <span className="scgrn-req">*</span>
                    </label>
                    <div className="scgrn-date-wrap">
                        <input
                            type="date"
                            className="scgrn-date-input"
                            placeholder="Select Date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <span className="scgrn-date-icon-btn">
                            <FaCalendarAlt size={12} />
                        </span>
                    </div>
                </div>

                {/* Right Col 2: DC No */}
                <div className="scgrn-field-group">
                    <label className="scgrn-field-label">DC No</label>
                    <input
                        type="text"
                        className="scgrn-input"
                        placeholder="Enter DC No"
                        value={dcNo}
                        onChange={(e) => setDcNo(e.target.value)}
                    />
                </div>

                {/* Left Col 3: Subcontractor */}
                <div className="scgrn-field-group">
                    <label className="scgrn-field-label">
                        Subcontractor <span className="scgrn-req">*</span>
                    </label>
                    <input
                        type="text"
                        className="scgrn-input"
                        placeholder="Select Subcantractor"
                        value={subcontractor}
                        onChange={(e) => setSubcontractor(e.target.value)}
                        list="subcontractor-grn-list"
                    />
                    <datalist id="subcontractor-grn-list">
                        <option value="Supreme Embroidery Works" />
                        <option value="Golden Stitchers Ltd" />
                        <option value="Apex Dyeing & Washing" />
                        <option value="Classic Button Holing & Finishing" />
                    </datalist>
                </div>

                {/* Right Col 3: DC Date */}
                <div className="scgrn-field-group">
                    <label className="scgrn-field-label">DC Date</label>
                    <div className="scgrn-date-wrap">
                        <input
                            type="date"
                            className="scgrn-date-input"
                            placeholder="Select DC Date"
                            value={dcDate}
                            onChange={(e) => setDcDate(e.target.value)}
                        />
                        <span className="scgrn-date-icon-btn">
                            <FaCalendarAlt size={12} />
                        </span>
                    </div>
                </div>

                {/* Left Col 4: Invoice No */}
                <div className="scgrn-field-group">
                    <label className="scgrn-field-label">Invoice No</label>
                    <input
                        type="text"
                        className="scgrn-input"
                        placeholder="Enter Invoice No"
                        value={invoiceNo}
                        onChange={(e) => setInvoiceNo(e.target.value)}
                    />
                </div>

                {/* Right Col 4: Transport Details (spans 3 rows in Screenshot 2) */}
                <div className="scgrn-field-group" style={{ gridRow: "span 3" }}>
                    <label className="scgrn-field-label">Transport Details</label>
                    <textarea
                        className="scgrn-textarea"
                        rows={6}
                        placeholder="Enter Transport Details"
                        value={transportDetails}
                        onChange={(e) => setTransportDetails(e.target.value)}
                    />
                </div>

                {/* Left Col 5: Invoice Date */}
                <div className="scgrn-field-group">
                    <label className="scgrn-field-label">Invoice Date</label>
                    <div className="scgrn-date-wrap">
                        <input
                            type="date"
                            className="scgrn-date-input"
                            placeholder="Select Invoice Date"
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                        />
                        <span className="scgrn-date-icon-btn">
                            <FaCalendarAlt size={12} />
                        </span>
                    </div>
                </div>

                {/* Left Col 6: Store */}
                <div className="scgrn-field-group">
                    <label className="scgrn-field-label">
                        Store <span className="scgrn-req">*</span>
                    </label>
                    <input
                        type="text"
                        className="scgrn-input"
                        placeholder="Type and select Warehouse"
                        value={store}
                        onChange={(e) => setStore(e.target.value)}
                        list="stores-list"
                    />
                    <datalist id="stores-list">
                        <option value="Plot No. 9B - Raw Material Godown" />
                        <option value="Plot No. 9B - Accessories Godown" />
                        <option value="Plot No. 9B - Finished Goods Store" />
                        <option value="Unit 2 - Okhla Plant Store" />
                    </datalist>
                </div>

                {/* Left Col 7: Work Completion Status */}
                <div className="scgrn-field-group">
                    <label className="scgrn-field-label">Work Completion Status</label>
                    <select
                        className="scgrn-select"
                        value={workCompletionStatus}
                        onChange={(e) => setWorkCompletionStatus(e.target.value)}
                    >
                        <option value="Work is completed">Work is completed</option>
                        <option value="Partially completed">Partially completed</option>
                        <option value="Pending QC Inspection">Pending QC Inspection</option>
                    </select>
                </div>

                {/* Left Col 8: Gate Entry No */}
                <div className="scgrn-field-group">
                    <label className="scgrn-field-label">Gate Entry No</label>
                    <input
                        type="text"
                        className="scgrn-input"
                        placeholder="Type and Select Gate Entry No"
                        value={gateEntryNo}
                        onChange={(e) => setGateEntryNo(e.target.value)}
                    />
                </div>
            </div>

            {/* Row 9: JW Order No + Display From JW Order Button (Screenshot 2) */}
            <div className="scgrn-jw-row">
                <div className="scgrn-field-group" style={{ width: "320px" }}>
                    <label className="scgrn-field-label">JW Order No</label>
                    <input
                        type="text"
                        className="scgrn-input"
                        placeholder="Type and select JW Order No"
                        value={jwOrderNo}
                        onChange={(e) => setJwOrderNo(e.target.value)}
                        list="jw-order-list"
                    />
                    <datalist id="jw-order-list">
                        <option value="JWO/9B/2627/041" />
                        <option value="JWO/9B/2627/042" />
                        <option value="JWO/9B/2627/043" />
                    </datalist>
                </div>

                <button
                    type="button"
                    className="scgrn-btn-display-jw"
                    onClick={handleDisplayFromJwOrder}
                >
                    Display From JW Order
                </button>
            </div>

            {/* ==============================================================
                PRIMARY ITEMS GRID (Screenshot 3)
                ============================================================== */}
            <div className="scgrn-table-wrapper" ref={tableScrollRef}>
                <table className="scgrn-table">
                    <thead>
                        <tr>
                            <th style={{ minWidth: "130px" }}>JW Order No</th>
                            <th style={{ minWidth: "150px" }}>Component</th>
                            <th style={{ minWidth: "150px" }}>Operation</th>
                            <th style={{ minWidth: "130px" }}>IO No</th>
                            <th style={{ minWidth: "160px" }}>
                                Style <span className="scgrn-req">*</span>
                            </th>
                            <th style={{ minWidth: "80px" }}>
                                UOM <span className="scgrn-req">*</span>
                            </th>
                            <th style={{ minWidth: "130px" }}>Colour</th>
                            <th style={{ minWidth: "130px" }}>Size range</th>
                            <th style={{ minWidth: "100px" }}>
                                Recd Qty <span className="scgrn-req">*</span>
                            </th>
                            <th style={{ minWidth: "90px" }}>Rate</th>
                            <th style={{ minWidth: "110px", textAlign: "right" }}>Amount</th>
                            <th style={{ width: "35px", textAlign: "center" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemLines.map((line) => (
                            <tr key={line.id}>
                                <td>
                                    <input
                                        type="text"
                                        className="scgrn-tbl-input"
                                        placeholder="JW Order No"
                                        value={line.jwOrderNo}
                                        onChange={(e) => handleItemChange(line.id, "jwOrderNo", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="scgrn-tbl-input"
                                        placeholder="Type & Select Comp"
                                        value={line.component}
                                        onChange={(e) => handleItemChange(line.id, "component", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="scgrn-tbl-input"
                                        placeholder="Type & Select Opera"
                                        value={line.operation}
                                        onChange={(e) => handleItemChange(line.id, "operation", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <div className="scgrn-io-compound">
                                        <input
                                            type="text"
                                            className="scgrn-tbl-input"
                                            placeholder="Enter IO No"
                                            value={line.ioNo}
                                            onChange={(e) => handleItemChange(line.id, "ioNo", e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="scgrn-io-btn"
                                            title="Pick IO No"
                                            onClick={() => handleItemChange(line.id, "ioNo", "IO/9B/2627/088")}
                                        >
                                            <FaListAlt />
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="scgrn-tbl-input"
                                        placeholder="Type & Select Style"
                                        value={line.style}
                                        onChange={(e) => handleItemChange(line.id, "style", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="scgrn-tbl-input"
                                        placeholder="UOM"
                                        value={line.uom}
                                        onChange={(e) => handleItemChange(line.id, "uom", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="scgrn-tbl-input"
                                        placeholder="Type & Select Colou"
                                        value={line.colour}
                                        onChange={(e) => handleItemChange(line.id, "colour", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="scgrn-tbl-input"
                                        placeholder="Type & Select Size r"
                                        value={line.sizeRange}
                                        onChange={(e) => handleItemChange(line.id, "sizeRange", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="scgrn-tbl-input"
                                        placeholder="Enter Qty"
                                        value={line.recdQty}
                                        onChange={(e) => handleItemChange(line.id, "recdQty", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="scgrn-tbl-input"
                                        placeholder="Rate"
                                        value={line.rate}
                                        onChange={(e) => handleItemChange(line.id, "rate", e.target.value)}
                                    />
                                </td>
                                <td style={{ textAlign: "right", fontWeight: 600 }}>
                                    {Number(line.amount || 0).toFixed(2)}
                                </td>
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

            {/* Scroll Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span className="scgrn-add-line-link" onClick={handleAddItemLine}>
                    <FaPlus size={10} /> Add Another Line
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                    <button
                        type="button"
                        className="btn btn-sm btn-light py-0 px-2"
                        onClick={() => handleScrollTable("left")}
                        title="Scroll Left"
                    >
                        <FaChevronLeft size={10} />
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-light py-0 px-2"
                        onClick={() => handleScrollTable("right")}
                        title="Scroll Right"
                    >
                        <FaChevronRight size={10} />
                    </button>
                </div>
            </div>

            {/* ==============================================================
                OTHER CHARGES SECTION (Screenshot 3)
                ============================================================== */}
            <div className="scgrn-section-title-gear">
                <span>Other Charges</span>
                <FaCog size={13} style={{ cursor: "pointer", color: "#64748b" }} />
            </div>

            <div className="scgrn-table-wrapper" style={{ marginBottom: "8px" }}>
                <table className="scgrn-table">
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
                                        className="scgrn-tbl-input"
                                        placeholder="Type and sele..."
                                        value={oc.accountName}
                                        onChange={(e) => handleOtherChargeChange(oc.id, "accountName", e.target.value)}
                                        list="oc-accounts-list"
                                    />
                                    <datalist id="oc-accounts-list">
                                        <option value="Job Work Charges - Dyeing" />
                                        <option value="Freight & Transport" />
                                        <option value="QC & Inspection Fee" />
                                    </datalist>
                                </td>
                                <td>
                                    <select
                                        className="scgrn-select"
                                        style={{ height: "26px", fontSize: "11.5px" }}
                                        value={oc.currency}
                                        onChange={(e) => handleOtherChargeChange(oc.id, "currency", e.target.value)}
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
                                        className="scgrn-tbl-input"
                                        placeholder="Enter Amount"
                                        value={oc.value}
                                        onChange={(e) => handleOtherChargeChange(oc.id, "value", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <select
                                        className="scgrn-select"
                                        style={{ height: "26px", fontSize: "11.5px" }}
                                        value={oc.taxGroup}
                                        onChange={(e) => handleOtherChargeChange(oc.id, "taxGroup", e.target.value)}
                                    >
                                        <option value="">Select Tax Grc</option>
                                        <option value="GST 5%">GST 5%</option>
                                        <option value="GST 12%">GST 12%</option>
                                        <option value="GST 18%">GST 18%</option>
                                        <option value="Exempted">Exempted</option>
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
                                            style={{
                                                border: "1px solid #cbd5e1",
                                                background: "#ffffff",
                                                color: "#337ab7",
                                                borderRadius: "2px",
                                                padding: "2px 5px",
                                                cursor: "pointer"
                                            }}
                                            title="Add Line"
                                        >
                                            <FaPlus size={10} />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteOtherCharge(oc.id)}
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

            {/* Checkbox: Make it as my default other charges (Screenshot 3) */}
            <label className="scgrn-checkbox-label">
                <input
                    type="checkbox"
                    checked={defaultOtherCharges}
                    onChange={(e) => setDefaultOtherCharges(e.target.checked)}
                />
                Make it as my default other charges
            </label>

            {/* ==============================================================
                INSTRUCTIONS & TERMS SECTION (Screenshot 3, 4, 5)
                ============================================================== */}
            <div style={{ color: "#337ab7", fontSize: "14px", fontWeight: 600, margin: "20px 0 10px 0" }}>
                Instructions &amp; Terms
            </div>

            <div className="scgrn-instructions-grid">
                {/* Col 1 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div className="scgrn-field-group">
                        <label className="scgrn-field-label">Payment Terms</label>
                        <textarea
                            className="scgrn-textarea"
                            rows={3}
                            placeholder="Enter Payment Terms"
                            value={paymentTerms}
                            onChange={(e) => setPaymentTerms(e.target.value)}
                        />
                    </div>

                    <div className="scgrn-field-group">
                        <label className="scgrn-field-label">Delivery Terms</label>
                        <textarea
                            className="scgrn-textarea"
                            rows={3}
                            placeholder="Enter Delivery Terms"
                            value={deliveryTerms}
                            onChange={(e) => setDeliveryTerms(e.target.value)}
                        />
                    </div>

                    {/* Packing & labeling Instruction (Screenshot 4 & 5) */}
                    <div className="scgrn-field-group">
                        <label className="scgrn-field-label">Packing &amp; labeling Instruction</label>
                        <textarea
                            className="scgrn-textarea"
                            rows={3}
                            placeholder="Enter Packing & labeling Instruction"
                            value={packingInstruction}
                            onChange={(e) => setPackingInstruction(e.target.value)}
                        />
                    </div>

                    {/* + Add files... */}
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
                            className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                            style={{ background: "#337ab7", borderColor: "#2e6da4", height: "26px", fontSize: "11.5px" }}
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        >
                            <FaPlus size={10} /> Add files...
                        </button>

                        {attachedFiles.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                                {attachedFiles.map((fn, i) => (
                                    <span key={i} className="badge bg-light text-dark border p-1" style={{ fontSize: "11px" }}>
                                        <FaPaperclip size={9} /> {fn}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Terms & Conditions expandable link */}
                    <div>
                        <span
                            style={{ color: "#337ab7", fontSize: "12px", fontWeight: 600, cursor: "pointer", textDecoration: "none" }}
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
                                1. Material received must be inspected by QC within 24 hours of arrival.<br />
                                2. Inward DC quantities will be matched against physical count.<br />
                                3. Discrepancies if any will be reported within 2 working days.
                            </div>
                        )}
                    </div>

                    {/* Checkbox: Make this as my default Terms & Conditions (Screenshot 5) */}
                    <label className="scgrn-checkbox-label">
                        <input
                            type="checkbox"
                            checked={defaultTerms}
                            onChange={(e) => setDefaultTerms(e.target.checked)}
                        />
                        Make this as my default Terms &amp; Conditions
                    </label>
                </div>

                {/* Col 2 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div className="scgrn-field-group">
                        <label className="scgrn-field-label">Insurance Details</label>
                        <textarea
                            className="scgrn-textarea"
                            rows={3}
                            placeholder="Enter Insurance Details"
                            value={insuranceDetails}
                            onChange={(e) => setInsuranceDetails(e.target.value)}
                        />
                    </div>

                    <div className="scgrn-field-group">
                        <label className="scgrn-field-label">Special Instruction</label>
                        <textarea
                            className="scgrn-textarea"
                            rows={3}
                            placeholder="Enter Special Instruction"
                            value={specialInstruction}
                            onChange={(e) => setSpecialInstruction(e.target.value)}
                        />
                    </div>
                </div>

                {/* Col 3: Totals Summary (Screenshot 3, 4, 5) */}
                <div>
                    <div className="scgrn-summary-box">
                        <div className="scgrn-summary-line">
                            <span>Sub Total :</span>
                            <span style={{ fontWeight: 600 }}>{subTotal.toFixed(2)}</span>
                        </div>
                        <div className="scgrn-summary-line total">
                            <span>Total :</span>
                            <span>{grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==============================================================
                BOTTOM ACTION BUTTONS (Exact match for Screenshot 5)
                ============================================================== */}
            <div className="scgrn-bottom-actions-row">
                <button
                    type="button"
                    className="scgrn-btn-save"
                    onClick={() => handleSaveGRN(false)}
                >
                    <FaSave size={12} /> Save
                </button>

                <div style={{ position: "relative", display: "inline-block" }}>
                    <button
                        type="button"
                        className="scgrn-btn-action-drop"
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
                                    handleSaveGRN(true);
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
                    className="scgrn-btn-view"
                    onClick={() => showToast("Previewing Subcontract GRN")}
                >
                    <FaEye size={12} /> View
                </button>
            </div>
        </div>
    );
}
