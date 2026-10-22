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
import "../../../styles/conversionGRNForm.css";

const INITIAL_CONVERSION_GRN_RECORDS = [
    {
        id: 1,
        docNo: "SUB/9B/2627/001",
        grnNo: "CRN/9B/2627/553",
        date: "12-10-2026",
        unit: "Plot No. 9B",
        qty: "120 PCS",
        status: "Active",
        remarks: "Standard production batch",
        subcontractor: "Supreme Embroidery Works",
        store: "Plot No. 9B - RM Godown",
        invoiceNo: "INV-2026-901",
        dcNo: "DC-4401",
        ourDcNo: "SDC/9B/2627/480",
        receivedBy: "Tilak"
    },
    {
        id: 2,
        docNo: "SUB/9B/2627/002",
        grnNo: "CRN/9B/2627/552",
        date: "10-10-2026",
        unit: "Plot No. 9B",
        qty: "350 PCS",
        status: "Completed",
        remarks: "Verified by QC line 2",
        subcontractor: "Golden Stitchers Ltd",
        store: "Plot No. 9B - Processing Godown",
        invoiceNo: "INV-2026-880",
        dcNo: "DC-4390",
        ourDcNo: "SDC/9B/2627/479",
        receivedBy: "Vaishnav"
    },
    {
        id: 3,
        docNo: "SUB/9B/2627/003",
        grnNo: "CRN/9B/2627/551",
        date: "08-10-2026",
        unit: "Plot No. 9B",
        qty: "85 PCS",
        status: "Pending",
        remarks: "Scheduled for next shift",
        subcontractor: "Apex Dyeing & Washing",
        store: "Plot No. 9B - Accessories Godown",
        invoiceNo: "INV-2026-855",
        dcNo: "DC-4381",
        ourDcNo: "SDC/9B/2627/475",
        receivedBy: "Rajesh"
    }
];

export default function ConversionGRN({ initialMode = "list" }) {
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
    const [records, setRecords] = useState(INITIAL_CONVERSION_GRN_RECORDS);
    const [toastMessage, setToastMessage] = useState("");

    // Form Top State (Matching Screenshot 2)
    const [receiptType, setReceiptType] = useState("Conversion GRN");
    const [defaultReceiptType, setDefaultReceiptType] = useState(false);
    const [grnPrefix, setGrnPrefix] = useState("CRN/9B/2627/");
    const [grnNo, setGrnNo] = useState("554");
    const [date, setDate] = useState("22-10-2026");
    const [subcontractor, setSubcontractor] = useState("");
    const [store, setStore] = useState("");
    const [invoiceNo, setInvoiceNo] = useState("");
    const [dcNo, setDcNo] = useState("");
    const [gateEntryNo, setGateEntryNo] = useState("");
    const [ourDcNo, setOurDcNo] = useState("");
    const [transportDetails, setTransportDetails] = useState("");
    const [receivedBy, setReceivedBy] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [dcDate, setDcDate] = useState("");

    // Line Items Grid (Matching Screenshot 3)
    const [itemLines, setItemLines] = useState([
        {
            id: 1,
            dcNo: "",
            ioNo: "",
            group: "",
            item: "",
            description: "",
            sizeRange: "",
            color: "",
            uom: "PCS",
            dnQty: "",
            recdQty: "",
            rate: "",
            amount: 0
        }
    ]);

    // Other Charges Grid (Matching Screenshot 3)
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
                dcNo: dcNo || ourDcNo || "",
                ioNo: "",
                group: "",
                item: "",
                description: "",
                sizeRange: "",
                color: "",
                uom: "PCS",
                dnQty: "",
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
                    dcNo: "",
                    ioNo: "",
                    group: "",
                    item: "",
                    description: "",
                    sizeRange: "",
                    color: "",
                    uom: "PCS",
                    dnQty: "",
                    recdQty: "",
                    rate: "",
                    amount: 0
                }
            ]);
            return;
        }
        setItemLines(itemLines.filter((l) => l.id !== id));
    };

    // Populate from Our DC No (Screenshot 2)
    const handleDisplayFromDc = () => {
        if (!ourDcNo.trim()) {
            setOurDcNo("SDC/9B/2627/483");
        }
        if (!subcontractor) setSubcontractor("Supreme Embroidery Works");
        if (!store) setStore("Plot No. 9B - Raw Material Godown");
        if (!dcNo) setDcNo("DC-4421");

        setItemLines([
            {
                id: 1,
                dcNo: ourDcNo.trim() || "SDC/9B/2627/483",
                ioNo: "IO/9B/2627/102",
                group: "Garment Panels",
                item: "Embroidered Front Panels",
                description: "Single jersey knitted panel with embroidery",
                sizeRange: "S - XXL",
                color: "Navy Blue",
                uom: "PCS",
                dnQty: "1200",
                recdQty: "1200",
                rate: "145.00",
                amount: 174000
            }
        ]);
        showToast("Populated line items from Delivery Challan successfully!");
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

    // File attachments
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setAttachments((prev) => [...prev, ...files.map((f) => f.name)]);
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
                    : "120 PCS",
            status: "Active",
            remarks: transportDetails || "Conversion GRN Inward Completed",
            subcontractor: subcontractor || "Supreme Embroidery Works",
            store: store || "Plot No. 9B - RM Godown",
            invoiceNo: invoiceNo || "INV-9022",
            dcNo: dcNo || "DC-4421",
            ourDcNo: ourDcNo || "SDC/9B/2627/483",
            receivedBy: receivedBy || "Tilak"
        };

        setRecords([newRecord, ...records]);
        showToast(`Conversion GRN ${fullGrnNo} saved successfully!`);

        if (saveAndNew) {
            setGrnNo((parseInt(grnNo, 10) + 1).toString());
            setDcNo("");
            setInvoiceNo("");
            setTransportDetails("");
            setItemLines([
                {
                    id: Date.now(),
                    dcNo: "",
                    ioNo: "",
                    group: "",
                    item: "",
                    description: "",
                    sizeRange: "",
                    color: "",
                    uom: "PCS",
                    dnQty: "",
                    recdQty: "",
                    rate: "",
                    amount: 0
                }
            ]);
            setAttachments([]);
        } else {
            setViewMode("list");
            if (window.history && window.history.pushState) {
                window.history.pushState({}, "", "/pm/conversion-grn");
            }
        }
    };

    // =========================================================================
    // RENDER: LIST VIEW
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
                            Conversion GRN
                        </h1>
                    </div>

                    <div className="cgrn-right-actions">
                        <button
                            type="button"
                            className="cgrn-btn-new"
                            onClick={() => {
                                setViewMode("form");
                                if (window.history && window.history.pushState) {
                                    window.history.pushState({}, "", "/pm/conversion-grn/new");
                                }
                            }}
                        >
                            <FaPlus style={{ fontSize: "11px" }} />
                            <span>New Conversion GRN</span>
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
                            onClick={() => showToast("Conversion GRN records reloaded")}
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

                {/* Table */}
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
                                                setInvoiceNo(row.invoiceNo);
                                                setDcNo(row.dcNo);
                                                setOurDcNo(row.ourDcNo);
                                                setReceivedBy(row.receivedBy);
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
    // RENDER: CONVERSION GRN FORM (MATCHING SCREENSHOTS 2, 3, 4)
    // =========================================================================
    return (
        <div className="cgrnf-page">
            {/* Header */}
            <div className="cgrnf-header-row">
                <div>
                    <h1 className="cgrnf-title">
                        Conversion GRN
                        <span className="cgrnf-badge-unit">Plot No. 9B &bull; FY 01-Apr-2026 - 31-Mar-2027</span>
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
                                window.history.pushState({}, "", "/pm/conversion-grn");
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

            {/* Receipt Type dropdown & checkbox (Screenshot 2) */}
            <div style={{ marginBottom: "16px", maxWidth: "320px" }}>
                <label className="cgrnf-field-label">Receipt Type</label>
                <select
                    className="cgrnf-select"
                    value={receiptType}
                    onChange={(e) => setReceiptType(e.target.value)}
                >
                    <option value="Conversion GRN">Conversion GRN</option>
                    <option value="Sample GRN">Sample GRN</option>
                    <option value="Job Work GRN">Job Work GRN</option>
                </select>
                <label className="cgrnf-checkbox-label">
                    <input
                        type="checkbox"
                        checked={defaultReceiptType}
                        onChange={(e) => setDefaultReceiptType(e.target.checked)}
                    />
                    Make this as my default Receipt Type
                </label>
            </div>

            {/* ==============================================================
                TOP 2-COLUMN FORM FIELDS (Screenshot 2)
                ============================================================== */}
            <div className="cgrnf-top-grid">
                {/* Left Col 1: GRN No */}
                <div className="cgrnf-field-group">
                    <label className="cgrnf-field-label">GRN No</label>
                    <div className="cgrnf-compound-grn">
                        <select
                            className="cgrnf-prefix-select"
                            value={grnPrefix}
                            onChange={(e) => setGrnPrefix(e.target.value)}
                        >
                            <option value="CRN/9B/2627/">CRN/9B/2627/</option>
                            <option value="CRN/9B/2526/">CRN/9B/2526/</option>
                            <option value="CRN/FBD/2627/">CRN/FBD/2627/</option>
                        </select>
                        <input
                            type="text"
                            className="cgrnf-num-input"
                            value={grnNo}
                            onChange={(e) => setGrnNo(e.target.value)}
                        />
                        <button
                            type="button"
                            className="cgrnf-gear-btn"
                            title="GRN Settings"
                            onClick={() => showToast("GRN numbering sequence configuration")}
                        >
                            <FaCog size={13} />
                        </button>
                    </div>
                </div>

                {/* Right Col 1: Transport Details (spans multiple rows in Screenshot 2) */}
                <div className="cgrnf-field-group" style={{ gridRow: "span 3" }}>
                    <label className="cgrnf-field-label">Transport Details</label>
                    <textarea
                        className="cgrnf-textarea"
                        rows={6}
                        placeholder="Enter Transport Details"
                        value={transportDetails}
                        onChange={(e) => setTransportDetails(e.target.value)}
                    />
                </div>

                {/* Left Col 2: Date */}
                <div className="cgrnf-field-group">
                    <label className="cgrnf-field-label">
                        Date <span className="cgrnf-req">*</span>
                    </label>
                    <div className="cgrnf-date-wrap">
                        <input
                            type="date"
                            className="cgrnf-date-input"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <span className="cgrnf-date-icon-btn">
                            <FaCalendarAlt size={12} />
                        </span>
                    </div>
                </div>

                {/* Left Col 3: Subcontractor */}
                <div className="cgrnf-field-group">
                    <label className="cgrnf-field-label">
                        Subcontractor <span className="cgrnf-req">*</span>
                    </label>
                    <input
                        type="text"
                        className="cgrnf-input"
                        placeholder="Select Subcontractor"
                        value={subcontractor}
                        onChange={(e) => setSubcontractor(e.target.value)}
                        list="subcontractor-cgrn-list"
                    />
                    <datalist id="subcontractor-cgrn-list">
                        <option value="Supreme Embroidery Works" />
                        <option value="Golden Stitchers Ltd" />
                        <option value="Apex Dyeing & Washing" />
                        <option value="Classic Button Holing & Finishing" />
                    </datalist>
                </div>

                {/* Right Col: Received By */}
                <div className="cgrnf-field-group">
                    <label className="cgrnf-field-label">Received By</label>
                    <input
                        type="text"
                        className="cgrnf-input"
                        placeholder="Enter Recd By"
                        value={receivedBy}
                        onChange={(e) => setReceivedBy(e.target.value)}
                    />
                </div>

                {/* Left Col 4: Store */}
                <div className="cgrnf-field-group">
                    <label className="cgrnf-field-label">
                        Store <span className="cgrnf-req">*</span>
                    </label>
                    <input
                        type="text"
                        className="cgrnf-input"
                        placeholder="Type and select Store"
                        value={store}
                        onChange={(e) => setStore(e.target.value)}
                        list="stores-cgrn-list"
                    />
                    <datalist id="stores-cgrn-list">
                        <option value="Plot No. 9B - Raw Material Godown" />
                        <option value="Plot No. 9B - Fabric Store" />
                        <option value="Plot No. 9B - Trim Store" />
                        <option value="Unit 2 - Okhla Plant Store" />
                    </datalist>
                </div>

                {/* Right Col: Invoice Date */}
                <div className="cgrnf-field-group">
                    <label className="cgrnf-field-label">Invoice Date</label>
                    <div className="cgrnf-date-wrap">
                        <input
                            type="date"
                            className="cgrnf-date-input"
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                        />
                        <span className="cgrnf-date-icon-btn">
                            <FaCalendarAlt size={12} />
                        </span>
                    </div>
                </div>

                {/* Left Col 5: Invoice No */}
                <div className="cgrnf-field-group">
                    <label className="cgrnf-field-label">Invoice No</label>
                    <input
                        type="text"
                        className="cgrnf-input"
                        placeholder="Enter Invoice No"
                        value={invoiceNo}
                        onChange={(e) => setInvoiceNo(e.target.value)}
                    />
                </div>

                {/* Right Col: DC Date */}
                <div className="cgrnf-field-group">
                    <label className="cgrnf-field-label">DC Date</label>
                    <div className="cgrnf-date-wrap">
                        <input
                            type="date"
                            className="cgrnf-date-input"
                            value={dcDate}
                            onChange={(e) => setDcDate(e.target.value)}
                        />
                        <span className="cgrnf-date-icon-btn">
                            <FaCalendarAlt size={12} />
                        </span>
                    </div>
                </div>

                {/* Left Col 6: DC No */}
                <div className="cgrnf-field-group">
                    <label className="cgrnf-field-label">DC No</label>
                    <input
                        type="text"
                        className="cgrnf-input"
                        placeholder="Enter DC No"
                        value={dcNo}
                        onChange={(e) => setDcNo(e.target.value)}
                    />
                </div>

                {/* Empty column right */}
                <div></div>

                {/* Left Col 7: Gate Entry No */}
                <div className="cgrnf-field-group">
                    <label className="cgrnf-field-label">Gate Entry No</label>
                    <input
                        type="text"
                        className="cgrnf-input"
                        placeholder="Type and Select Gate Entry No"
                        value={gateEntryNo}
                        onChange={(e) => setGateEntryNo(e.target.value)}
                    />
                </div>

                {/* Empty column right */}
                <div></div>

                {/* Left Col 8: Our Dc No with Button (Screenshot 2) */}
                <div className="cgrnf-field-group">
                    <label className="cgrnf-field-label">Our Dc No</label>
                    <div className="cgrnf-dc-row">
                        <input
                            type="text"
                            className="cgrnf-input"
                            placeholder="Type and select Dc No"
                            value={ourDcNo}
                            onChange={(e) => setOurDcNo(e.target.value)}
                            list="our-dc-list"
                        />
                        <datalist id="our-dc-list">
                            <option value="SDC/9B/2627/483" />
                            <option value="SDC/9B/2627/482" />
                            <option value="SDC/9B/2627/481" />
                        </datalist>
                        <button
                            type="button"
                            className="cgrnf-btn-blue"
                            onClick={handleDisplayFromDc}
                        >
                            Display From JSDC
                        </button>
                    </div>
                </div>
            </div>

            {/* ==============================================================
                TABLE: LINE ITEMS (Screenshot 3)
                ============================================================== */}
            <div className="cgrnf-table-wrapper" ref={tableScrollRef}>
                <table className="cgrnf-table">
                    <thead>
                        <tr>
                            <th style={{ minWidth: "120px" }}>DC No</th>
                            <th style={{ minWidth: "130px" }}>IO No</th>
                            <th style={{ minWidth: "150px" }}>Group</th>
                            <th style={{ minWidth: "160px" }}>
                                Item <span className="cgrnf-req">*</span>
                            </th>
                            <th style={{ minWidth: "180px" }}>Description</th>
                            <th style={{ minWidth: "130px" }}>
                                Size Range <span className="cgrnf-req">*</span>
                            </th>
                            <th style={{ minWidth: "130px" }}>
                                Color <span className="cgrnf-req">*</span>
                            </th>
                            <th style={{ minWidth: "80px" }}>
                                UOM <span className="cgrnf-req">*</span>
                            </th>
                            <th style={{ minWidth: "100px" }}>DN Qty</th>
                            <th style={{ minWidth: "100px" }}>
                                Recd Qty <span className="cgrnf-req">*</span>
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
                                        className="cgrnf-tbl-input"
                                        placeholder="Enter DC No"
                                        value={line.dcNo}
                                        onChange={(e) => handleItemChange(line.id, "dcNo", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <div className="cgrnf-io-compound">
                                        <input
                                            type="text"
                                            className="cgrnf-tbl-input"
                                            placeholder="Enter IO No"
                                            value={line.ioNo}
                                            onChange={(e) => handleItemChange(line.id, "ioNo", e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="cgrnf-io-btn"
                                            title="Pick IO No"
                                            onClick={() => handleItemChange(line.id, "ioNo", "IO/9B/2627/102")}
                                        >
                                            <FaListAlt />
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="cgrnf-tbl-input"
                                        placeholder="Type and Select"
                                        value={line.group}
                                        onChange={(e) => handleItemChange(line.id, "group", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="cgrnf-tbl-input"
                                        placeholder="Type and select"
                                        value={line.item}
                                        onChange={(e) => handleItemChange(line.id, "item", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="cgrnf-tbl-input"
                                        placeholder="Description"
                                        value={line.description}
                                        onChange={(e) => handleItemChange(line.id, "description", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="cgrnf-tbl-input"
                                        placeholder="Type & Select Si"
                                        value={line.sizeRange}
                                        onChange={(e) => handleItemChange(line.id, "sizeRange", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="cgrnf-tbl-input"
                                        placeholder="Type and select"
                                        value={line.color}
                                        onChange={(e) => handleItemChange(line.id, "color", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="cgrnf-tbl-input"
                                        placeholder="UOM"
                                        value={line.uom}
                                        onChange={(e) => handleItemChange(line.id, "uom", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="cgrnf-tbl-input"
                                        placeholder="As per DN"
                                        value={line.dnQty}
                                        onChange={(e) => handleItemChange(line.id, "dnQty", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="cgrnf-tbl-input"
                                        placeholder="Enter Recd Qty"
                                        value={line.recdQty}
                                        onChange={(e) => handleItemChange(line.id, "recdQty", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="cgrnf-tbl-input"
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
                <span className="cgrnf-add-line-link" onClick={handleAddItemLine}>
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
            <div className="cgrnf-other-charges-header">
                <span>Other Charges</span>
                <FaCog size={13} style={{ cursor: "pointer", color: "#64748b" }} />
            </div>

            <div className="cgrnf-table-wrapper" style={{ marginBottom: "8px" }}>
                <table className="cgrnf-table">
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
                                        className="cgrnf-tbl-input"
                                        placeholder="Type and selec"
                                        value={oc.accountName}
                                        onChange={(e) => handleOtherChargeChange(oc.id, "accountName", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <select
                                        className="cgrnf-select"
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
                                        className="cgrnf-tbl-input"
                                        placeholder="Enter Amount"
                                        value={oc.value}
                                        onChange={(e) => handleOtherChargeChange(oc.id, "value", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <select
                                        className="cgrnf-select"
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

            <label className="cgrnf-checkbox-label">
                <input
                    type="checkbox"
                    checked={defaultOtherCharges}
                    onChange={(e) => setDefaultOtherCharges(e.target.checked)}
                />
                Make it as my default other charges
            </label>

            {/* Sub Total & Total summary */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
                <div style={{ width: "220px", background: "#f8fafc", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#334155", marginBottom: "6px" }}>
                        <span>Sub Total :</span>
                        <span style={{ fontWeight: 600 }}>{subTotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 700, color: "#1e293b", borderTop: "2px solid #cbd5e1", paddingTop: "6px" }}>
                        <span>Total :</span>
                        <span>{grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Remark & Internal Memo (Screenshot 4) */}
            <div className="cgrnf-remarks-grid">
                <div className="cgrnf-field-group">
                    <label className="cgrnf-field-label">Remark</label>
                    <textarea
                        className="cgrnf-textarea"
                        rows={3}
                        placeholder="Enter Remark"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                    />
                </div>

                <div className="cgrnf-field-group">
                    <label className="cgrnf-field-label">Memo for internal use</label>
                    <textarea
                        className="cgrnf-textarea"
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
                    className="cgrnf-btn-blue"
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
                BOTTOM ACTION BUTTONS (Exact Match for Screenshot 4)
                ============================================================== */}
            <div className="cgrnf-bottom-actions-row">
                <button
                    type="button"
                    className="cgrnf-btn-save"
                    onClick={() => handleSaveGRN(false)}
                >
                    <FaSave size={12} /> Save
                </button>

                <div style={{ position: "relative", display: "inline-block" }}>
                    <button
                        type="button"
                        className="cgrnf-btn-action-drop"
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
                    className="cgrnf-btn-view"
                    onClick={() => showToast("Viewing Conversion GRN")}
                >
                    <FaEye size={12} /> View
                </button>
            </div>
        </div>
    );
}
