import React, { useState, useEffect, useRef } from "react";
import {
    FaSyncAlt,
    FaBars,
    FaCog,
    FaFilter,
    FaCaretDown,
    FaFileAlt,
    FaCalendarAlt,
    FaCheckSquare,
    FaSquare,
    FaPrint,
    FaEye,
    FaEdit,
    FaTrash
} from "react-icons/fa";
import axios from "axios";
import "../../../styles/salesOrders.css";

const INITIAL_SALES_ORDERS = [
    {
        id: 1,
        soNo: "SO/9B/2627/001",
        customerName: "Zara Retail Apparel",
        brand: "Zara Men",
        orderReceivedDate: "12-10-2026",
        date: "14-10-2026",
        enteredOn: "14-10-2026 11:32",
        currency: "USD",
        modeOfShipment: "Air",
        customerPoNo: "PO-ZRA-9021",
        season: "SS27",
        enteredBy: "Tilak",
        exRate: "83.50",
        priceWithEffectFrom: "14-10-2026",
        attachment: "PO_ZRA.pdf",
        qty: "5,000 PCS",
        status: "Approved"
    },
    {
        id: 2,
        soNo: "SO/9B/2627/002",
        customerName: "H&M Sourcing Hub",
        brand: "H&M Basic",
        orderReceivedDate: "15-10-2026",
        date: "16-10-2026",
        enteredOn: "16-10-2026 15:45",
        currency: "USD",
        modeOfShipment: "Sea",
        customerPoNo: "PO-HM-8841-B",
        season: "AW26",
        enteredBy: "Vaishnav",
        exRate: "83.50",
        priceWithEffectFrom: "16-10-2026",
        attachment: "PO_HM.pdf",
        qty: "8,500 PCS",
        status: "Open"
    },
    {
        id: 3,
        soNo: "SO/9B/2627/003",
        customerName: "Marks & Spencer PLC",
        brand: "M&S Casual",
        orderReceivedDate: "18-10-2026",
        date: "19-10-2026",
        enteredOn: "19-10-2026 09:20",
        currency: "GBP",
        modeOfShipment: "Sea/Air",
        customerPoNo: "PO-MS-7712",
        season: "SS27",
        enteredBy: "Tilak",
        exRate: "108.20",
        priceWithEffectFrom: "19-10-2026",
        attachment: "PO_MS.pdf",
        qty: "4,200 PCS",
        status: "Pending"
    }
];

export default function SalesOrders() {
    // Top filters
    const [customerNameSearch, setCustomerNameSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [enteredByFilter, setEnteredByFilter] = useState("");

    // Filter Flyout Drawer / Popup state
    const [filterPopupOpen, setFilterPopupOpen] = useState(false);
    const filterPopupRef = useRef(null);

    // Advanced Filter Form values (from Screenshot 2)
    const [advFilters, setAdvFilters] = useState({
        specialInstruction: "",
        packingInstruction: "",
        orderNo: "",
        fromDate: "22-10-2026",
        toDate: "22-10-2026",
        customerPoNo: "",
        customerPlanNumber: "",
        season: "",
        agentName: "",
        brand: "",
        group: "",
        style: "",
        colour: "",
        dynamicField1: "",
        dynamicField2: "",
        dynamicField3: ""
    });

    // Orders state
    const [orders, setOrders] = useState(INITIAL_SALES_ORDERS);
    const [selectedRows, setSelectedRows] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [openActionId, setOpenActionId] = useState(null);
    const [density, setDensity] = useState("normal"); // normal / compact

    // Fetch from backend if available
    const fetchOrders = async () => {
        try {
            const res = await axios.get("/api/sales-orders");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            if (data.length > 0) {
                const mapped = data.map((item, idx) => ({
                    id: item.SOID || idx + 1,
                    soNo: item.SONumber || `SO/9B/2627/${String(idx + 1).padStart(3, "0")}`,
                    customerName: item.CustomerName || "Direct Customer",
                    brand: item.Brand || "Standard",
                    orderReceivedDate: item.OrderReceivedDate || item.OrderDate || "12-10-2026",
                    date: item.OrderDate || "14-10-2026",
                    enteredOn: item.CreatedAt ? new Date(item.CreatedAt).toLocaleString() : "14-10-2026 11:32",
                    currency: item.Currency || "USD",
                    modeOfShipment: item.ModeOfShipment || "Air",
                    customerPoNo: item.CustomerPONo || "PO-REF-001",
                    season: item.Season || "SS27",
                    enteredBy: item.EnteredBy || "Admin",
                    exRate: item.ExchangeRate || "83.50",
                    priceWithEffectFrom: item.PriceDate || "14-10-2026",
                    attachment: item.Attachment || "—",
                    qty: item.TotalQty ? `${item.TotalQty} PCS` : (item.TotalAmount ? `₹ ${item.TotalAmount}` : "5,000 PCS"),
                    status: item.Status || "Approved"
                }));
                setOrders(mapped);
            }
        } catch (err) {
            // Keep initial fallback data
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Close flyout on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterPopupRef.current && !filterPopupRef.current.contains(e.target)) {
                setFilterPopupOpen(false);
            }
        };
        if (filterPopupOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [filterPopupOpen]);

    // Handle select all rows
    const handleToggleSelectAll = () => {
        const next = !selectAll;
        setSelectAll(next);
        const map = {};
        if (next) {
            orders.forEach(o => { map[o.id] = true; });
        }
        setSelectedRows(map);
    };

    const handleToggleRow = (id) => {
        setSelectedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Filter orders
    const filteredOrders = orders.filter(row => {
        // Customer name search
        if (customerNameSearch.trim()) {
            if (!row.customerName.toLowerCase().includes(customerNameSearch.toLowerCase())) {
                return false;
            }
        }
        // Status filter
        if (statusFilter !== "All") {
            if (row.status !== statusFilter) return false;
        }
        // Entered by filter
        if (enteredByFilter.trim()) {
            if (!row.enteredBy.toLowerCase().includes(enteredByFilter.toLowerCase())) {
                return false;
            }
        }
        // Advanced filters from popup
        if (advFilters.orderNo.trim() && !row.soNo.toLowerCase().includes(advFilters.orderNo.toLowerCase())) {
            return false;
        }
        if (advFilters.customerPoNo.trim() && !row.customerPoNo.toLowerCase().includes(advFilters.customerPoNo.toLowerCase())) {
            return false;
        }
        if (advFilters.season.trim() && !row.season.toLowerCase().includes(advFilters.season.toLowerCase())) {
            return false;
        }
        if (advFilters.brand.trim() && !row.brand.toLowerCase().includes(advFilters.brand.toLowerCase())) {
            return false;
        }
        return true;
    });

    // Generate empty rows to ensure spreadsheet appearance
    const emptyRowsCount = Math.max(12, 18 - filteredOrders.length);
    const emptyRows = Array.from({ length: emptyRowsCount });

    return (
        <div className="so-page">
            {/* Title */}
            <h1 className="so-title">Sales Order</h1>

            {/* Top Filters Row (Customer Name, Status, Entered by) */}
            <div className="so-top-filters">
                {/* Customer Name */}
                <div className="so-filter-group">
                    <label className="so-label">Customer Name</label>
                    <input
                        type="text"
                        placeholder="Customer Name Search..."
                        value={customerNameSearch}
                        onChange={(e) => setCustomerNameSearch(e.target.value)}
                        className="so-filter-input"
                    />
                </div>

                {/* Status */}
                <div className="so-filter-group">
                    <label className="so-label">Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="so-status-select"
                    >
                        <option value="All">All</option>
                        <option value="Open">Open</option>
                        <option value="Approved">Approved</option>
                        <option value="Pending">Pending</option>
                        <option value="Closed">Closed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Entered by */}
                <div className="so-filter-group">
                    <label className="so-label">Entered by</label>
                    <input
                        type="text"
                        placeholder="Entered by"
                        value={enteredByFilter}
                        onChange={(e) => setEnteredByFilter(e.target.value)}
                        className="so-filter-input"
                    />
                </div>
            </div>

            {/* Toolbar Row */}
            <div className="so-toolbar-row">
                <div className="so-toolbar-left">
                    {/* Icon group: Reload, Density, Settings */}
                    <div className="so-icon-group">
                        <button
                            type="button"
                            className="so-icon-btn"
                            title="Reload"
                            onClick={() => {
                                setCustomerNameSearch("");
                                setStatusFilter("All");
                                setEnteredByFilter("");
                                fetchOrders();
                            }}
                        >
                            <FaSyncAlt />
                        </button>
                        <button
                            type="button"
                            className="so-icon-btn"
                            title="Toggle Density"
                            onClick={() => setDensity(d => d === "normal" ? "compact" : "normal")}
                        >
                            <FaBars />
                        </button>
                        <button
                            type="button"
                            className="so-icon-btn"
                            title="Settings"
                            onClick={() => alert("Table column preferences")}
                        >
                            <FaCog />
                        </button>
                    </div>

                    {/* Filter button with caret */}
                    <button
                        type="button"
                        className={`so-filter-dropdown-btn ${filterPopupOpen ? "active" : ""}`}
                        onClick={() => setFilterPopupOpen(!filterPopupOpen)}
                    >
                        <FaFilter style={{ fontSize: "11px" }} />
                        <span>Filter</span>
                        <FaCaretDown style={{ fontSize: "11px", marginLeft: "2px" }} />
                    </button>
                </div>

                {/* Right side: Bulk Action */}
                <div>
                    <button
                        type="button"
                        className="so-btn-bulk"
                        onClick={() => alert("Bulk Action: Print Selected or Export Excel")}
                    >
                        <FaFileAlt style={{ fontSize: "11px", color: "#337ab7" }} />
                        <span>Bulk Action</span>
                        <FaCaretDown style={{ fontSize: "11px" }} />
                    </button>
                </div>

                {/* Flyout Filter Popup (Screenshot 2) */}
                {filterPopupOpen && (
                    <div className="so-filter-popup" ref={filterPopupRef}>
                        <div className="so-filter-popup-grid">
                            {/* Left Column */}
                            <div className="so-popup-field">
                                <label className="so-popup-label">Special Instruction</label>
                                <input
                                    type="text"
                                    placeholder="Enter Special Instruction"
                                    value={advFilters.specialInstruction}
                                    onChange={(e) => setAdvFilters({ ...advFilters, specialInstruction: e.target.value })}
                                    className="so-popup-input"
                                />
                            </div>

                            {/* Right Column */}
                            <div className="so-popup-field">
                                <label className="so-popup-label">Packing Instruction</label>
                                <input
                                    type="text"
                                    placeholder="Enter Packing Instruction"
                                    value={advFilters.packingInstruction}
                                    onChange={(e) => setAdvFilters({ ...advFilters, packingInstruction: e.target.value })}
                                    className="so-popup-input"
                                />
                            </div>

                            {/* Order No. */}
                            <div className="so-popup-field">
                                <label className="so-popup-label">Order No.</label>
                                <input
                                    type="text"
                                    placeholder="Enter Order No."
                                    value={advFilters.orderNo}
                                    onChange={(e) => setAdvFilters({ ...advFilters, orderNo: e.target.value })}
                                    className="so-popup-input"
                                />
                            </div>

                            {/* From Date */}
                            <div className="so-popup-field">
                                <label className="so-popup-label">From Date</label>
                                <input
                                    type="text"
                                    defaultValue={advFilters.fromDate}
                                    onChange={(e) => setAdvFilters({ ...advFilters, fromDate: e.target.value })}
                                    className="so-popup-date-input"
                                />
                            </div>

                            {/* To Date */}
                            <div className="so-popup-field">
                                <label className="so-popup-label">To Date</label>
                                <input
                                    type="text"
                                    defaultValue={advFilters.toDate}
                                    onChange={(e) => setAdvFilters({ ...advFilters, toDate: e.target.value })}
                                    className="so-popup-date-input"
                                />
                            </div>

                            {/* Customer PO No. */}
                            <div className="so-popup-field">
                                <label className="so-popup-label">Customer PO No.</label>
                                <input
                                    type="text"
                                    placeholder="Select Customer PO No."
                                    value={advFilters.customerPoNo}
                                    onChange={(e) => setAdvFilters({ ...advFilters, customerPoNo: e.target.value })}
                                    className="so-popup-input"
                                />
                            </div>

                            {/* Customer Plan Number */}
                            <div className="so-popup-field">
                                <label className="so-popup-label">Customer Plan Number</label>
                                <input
                                    type="text"
                                    placeholder="Select Customer Plan Number"
                                    value={advFilters.customerPlanNumber}
                                    onChange={(e) => setAdvFilters({ ...advFilters, customerPlanNumber: e.target.value })}
                                    className="so-popup-input"
                                />
                            </div>

                            {/* Season */}
                            <div className="so-popup-field">
                                <label className="so-popup-label">Season</label>
                                <input
                                    type="text"
                                    placeholder="Enter Season"
                                    value={advFilters.season}
                                    onChange={(e) => setAdvFilters({ ...advFilters, season: e.target.value })}
                                    className="so-popup-input"
                                />
                            </div>

                            {/* Agent Name */}
                            <div className="so-popup-field">
                                <label className="so-popup-label">Agent Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter Agent Name"
                                    value={advFilters.agentName}
                                    onChange={(e) => setAdvFilters({ ...advFilters, agentName: e.target.value })}
                                    className="so-popup-input"
                                />
                            </div>

                            {/* Brand */}
                            <div className="so-popup-field">
                                <label className="so-popup-label">Brand</label>
                                <input
                                    type="text"
                                    placeholder="Enter Brand"
                                    value={advFilters.brand}
                                    onChange={(e) => setAdvFilters({ ...advFilters, brand: e.target.value })}
                                    className="so-popup-input"
                                />
                            </div>

                            {/* Group */}
                            <div className="so-popup-field">
                                <label className="so-popup-label">Group</label>
                                <input
                                    type="text"
                                    placeholder="Enter Group"
                                    value={advFilters.group}
                                    onChange={(e) => setAdvFilters({ ...advFilters, group: e.target.value })}
                                    className="so-popup-input"
                                />
                            </div>

                            {/* Style */}
                            <div className="so-popup-field">
                                <label className="so-popup-label">Style</label>
                                <input
                                    type="text"
                                    placeholder="Enter Style"
                                    value={advFilters.style}
                                    onChange={(e) => setAdvFilters({ ...advFilters, style: e.target.value })}
                                    className="so-popup-input"
                                />
                            </div>

                            {/* Colour */}
                            <div className="so-popup-field">
                                <label className="so-popup-label">Colour</label>
                                <input
                                    type="text"
                                    placeholder="Enter Colour"
                                    value={advFilters.colour}
                                    onChange={(e) => setAdvFilters({ ...advFilters, colour: e.target.value })}
                                    className="so-popup-input"
                                />
                            </div>

                            {/* Dynamic Field 1 */}
                            <div className="so-popup-field">
                                <select className="so-popup-select">
                                    <option>&lt;--Select Dynamic Field--&gt;</option>
                                    <option>Factory Location</option>
                                    <option>Merchant Name</option>
                                    <option>Payment Terms</option>
                                </select>
                            </div>

                            {/* Dynamic Field 2 */}
                            <div className="so-popup-field">
                                <select className="so-popup-select">
                                    <option>&lt;--Select Dynamic Field--&gt;</option>
                                    <option>Incoterms</option>
                                    <option>Production Line</option>
                                </select>
                            </div>

                            {/* Dynamic Field 3 */}
                            <div className="so-popup-field">
                                <select className="so-popup-select">
                                    <option>&lt;--Select Dynamic Field--&gt;</option>
                                    <option>Tolerance %</option>
                                    <option>Inspection Agency</option>
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="so-popup-actions">
                            <button
                                type="button"
                                className="so-popup-btn-reset"
                                onClick={() => {
                                    setAdvFilters({
                                        specialInstruction: "",
                                        packingInstruction: "",
                                        orderNo: "",
                                        fromDate: "22-10-2026",
                                        toDate: "22-10-2026",
                                        customerPoNo: "",
                                        customerPlanNumber: "",
                                        season: "",
                                        agentName: "",
                                        brand: "",
                                        group: "",
                                        style: "",
                                        colour: "",
                                        dynamicField1: "",
                                        dynamicField2: "",
                                        dynamicField3: ""
                                    });
                                }}
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                className="so-popup-btn-apply"
                                onClick={() => setFilterPopupOpen(false)}
                            >
                                Apply Filter
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 17-Column Sales Order Table */}
            <div className="so-table-wrap">
                <table className="so-table">
                    <thead>
                        <tr>
                            <th style={{ width: "70px" }}>Action</th>
                            <th style={{ minWidth: "120px" }}>SO No.</th>
                            <th style={{ minWidth: "150px" }}>Customer Name</th>
                            <th style={{ minWidth: "100px" }}>Brand</th>
                            <th style={{ minWidth: "120px" }}>Order Received Date</th>
                            <th style={{ minWidth: "90px" }}>Date</th>
                            <th style={{ minWidth: "120px" }}>Entered On</th>
                            <th style={{ minWidth: "80px" }}>Currency</th>
                            <th style={{ minWidth: "110px" }}>Mode of Shipment</th>
                            <th style={{ minWidth: "120px" }}>Customer PO No.</th>
                            <th style={{ minWidth: "80px" }}>Season</th>
                            <th style={{ minWidth: "90px" }}>Entered By</th>
                            <th style={{ minWidth: "75px" }}>Ex.Rate</th>
                            <th style={{ minWidth: "135px" }}>Price with Effect From</th>
                            <th style={{ minWidth: "95px" }}>Attachment</th>
                            <th style={{ minWidth: "90px" }}>Qty</th>
                            <th style={{ minWidth: "95px" }}>
                                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                    <span>No. of rows</span>
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleToggleSelectAll}
                                        style={{ cursor: "pointer" }}
                                    />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(row => (
                            <tr key={row.id}>
                                <td style={{ textAlign: "center" }}>
                                    <div className="so-action-wrap">
                                        <button
                                            type="button"
                                            className="so-action-btn"
                                            onClick={() => setOpenActionId(openActionId === row.id ? null : row.id)}
                                        >
                                            <span>Action</span>
                                            <FaCaretDown style={{ fontSize: "10px" }} />
                                        </button>
                                        {openActionId === row.id && (
                                            <div className="so-action-menu">
                                                <div className="so-action-menu-item" onClick={() => { alert(`Viewing ${row.soNo}`); setOpenActionId(null); }}>
                                                    <FaEye style={{ marginRight: "5px" }} /> View
                                                </div>
                                                <div className="so-action-menu-item" onClick={() => { alert(`Editing ${row.soNo}`); setOpenActionId(null); }}>
                                                    <FaEdit style={{ marginRight: "5px" }} /> Edit
                                                </div>
                                                <div className="so-action-menu-item" onClick={() => { alert(`Printing ${row.soNo}`); setOpenActionId(null); }}>
                                                    <FaPrint style={{ marginRight: "5px" }} /> Print SO
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td style={{ fontWeight: 600, color: "#337ab7" }}>{row.soNo}</td>
                                <td>{row.customerName}</td>
                                <td>{row.brand}</td>
                                <td>{row.orderReceivedDate}</td>
                                <td>{row.date}</td>
                                <td>{row.enteredOn}</td>
                                <td style={{ textAlign: "center" }}>{row.currency}</td>
                                <td>{row.modeOfShipment}</td>
                                <td style={{ color: "#475569" }}>{row.customerPoNo}</td>
                                <td>{row.season}</td>
                                <td>{row.enteredBy}</td>
                                <td style={{ textAlign: "right" }}>{row.exRate}</td>
                                <td>{row.priceWithEffectFrom}</td>
                                <td style={{ color: "#2563eb", cursor: "pointer" }}>{row.attachment}</td>
                                <td style={{ fontWeight: 600, textAlign: "right" }}>{row.qty}</td>
                                <td style={{ textAlign: "center" }}>
                                    <input
                                        type="checkbox"
                                        checked={!!selectedRows[row.id]}
                                        onChange={() => handleToggleRow(row.id)}
                                        style={{ cursor: "pointer" }}
                                    />
                                </td>
                            </tr>
                        ))}

                        {/* Blank Grid Rows Matching Screenshot */}
                        {emptyRows.map((_, idx) => (
                            <tr key={`empty-${idx}`} className="so-empty-grid-row">
                                <td>&nbsp;</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
