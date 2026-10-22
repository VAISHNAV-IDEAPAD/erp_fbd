import React, { useState, useEffect, useRef } from "react";
import {
    FaSyncAlt,
    FaBars,
    FaCog,
    FaFilter,
    FaCaretDown,
    FaCalendarAlt,
    FaPrint,
    FaEye,
    FaEdit,
    FaCheck,
    FaTimes,
    FaFileExport,
    FaPlus
} from "react-icons/fa";
import "../../../styles/projectionOrders.css";

const INITIAL_PROJECTION_ORDERS = [
    {
        id: 1,
        projectionNo: "PRJ/9B/2627/001",
        versionNo: "V1.0",
        date: "12-10-2026",
        messageDisplayedInOrder: "Advance Booking for SS27 Collection",
        customer: "Zara Retail Apparel",
        customerOrderNo: "PO-ZRA-9021",
        season: "SS27",
        internalMemo: "Fabric under procurement from Arvind Mills",
        closed: "No",
        closedDate: "—",
        closedBy: "—",
        customerPlanNo: "CPN-881",
        copiedFrom: "—",
        soNo: "SO/9B/2627/001",
        quantity: "10,000 PCS",
        enteredBy: "Tilak",
        status: "Open"
    },
    {
        id: 2,
        projectionNo: "PRJ/9B/2627/002",
        versionNo: "V1.0",
        date: "14-10-2026",
        messageDisplayedInOrder: "Fall Winter Initial Run - Knitted Tops",
        customer: "H&M Hennes & Mauritz",
        customerOrderNo: "HM-FW-4410",
        season: "FW26",
        internalMemo: "Yarn dye lab dips approved by buyer",
        closed: "No",
        closedDate: "—",
        closedBy: "—",
        customerPlanNo: "CPN-892",
        copiedFrom: "PRJ/9B/2526/890",
        soNo: "SO/9B/2627/004",
        quantity: "15,000 PCS",
        enteredBy: "Vaishnav",
        status: "Approved"
    },
    {
        id: 3,
        projectionNo: "PRJ/9B/2627/003",
        versionNo: "V2.0",
        date: "18-10-2026",
        messageDisplayedInOrder: "Denim Jackets Spring Bulk Projection",
        customer: "Levi Strauss & Co.",
        customerOrderNo: "LS-2026-789",
        season: "SP27",
        internalMemo: "Wash approvals pending from HK tech office",
        closed: "No",
        closedDate: "—",
        closedBy: "—",
        customerPlanNo: "CPN-904",
        copiedFrom: "—",
        soNo: "SO/9B/2627/008",
        quantity: "8,500 PCS",
        enteredBy: "Rajesh",
        status: "Pending"
    },
    {
        id: 4,
        projectionNo: "PRJ/9B/2627/004",
        versionNo: "V1.1",
        date: "05-10-2026",
        messageDisplayedInOrder: "Polo T-Shirts Cotton Blend 220 GSM",
        customer: "Marks & Spencer PLC",
        customerOrderNo: "MS-UK-1102",
        season: "AW26",
        internalMemo: "Production completed & shipped under SO-002",
        closed: "Yes",
        closedDate: "20-10-2026",
        closedBy: "Rajesh Kumar",
        customerPlanNo: "CPN-870",
        copiedFrom: "—",
        soNo: "SO/9B/2627/002",
        quantity: "12,000 PCS",
        enteredBy: "Tilak",
        status: "Closed"
    },
    {
        id: 5,
        projectionNo: "PRJ/9B/2627/005",
        versionNo: "V1.0",
        date: "20-10-2026",
        messageDisplayedInOrder: "Cotton Poplin Casual Shirts",
        customer: "Tommy Hilfiger",
        customerOrderNo: "TH-GL-3341",
        season: "SS27",
        internalMemo: "Trim card dispatched for bulk signoff",
        closed: "No",
        closedDate: "—",
        closedBy: "—",
        customerPlanNo: "CPN-915",
        copiedFrom: "—",
        soNo: "SO/9B/2627/011",
        quantity: "6,200 PCS",
        enteredBy: "Vaishnav",
        status: "Open"
    }
];

export default function ProjectionOrders() {
    // Top filter inputs
    const [customerSearch, setCustomerSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [enteredByFilter, setEnteredByFilter] = useState("");

    // Flyout filter state
    const [filterPopupOpen, setFilterPopupOpen] = useState(false);
    const filterPopupRef = useRef(null);

    // Advanced filters
    const [advFilters, setAdvFilters] = useState({
        projectionNo: "",
        versionNo: "",
        fromDate: "",
        toDate: "",
        customerOrderNo: "",
        season: "",
        customerPlanNo: "",
        soNo: ""
    });

    // Orders state
    const [orders, setOrders] = useState(INITIAL_PROJECTION_ORDERS);
    const [selectedRows, setSelectedRows] = useState([]);
    const [activeActionMenu, setActiveActionMenu] = useState(null);
    const [bulkActionOpen, setBulkActionOpen] = useState(false);
    const [density, setDensity] = useState("normal"); // 'normal' | 'compact'
    const [statusMessage, setStatusMessage] = useState("");

    // Modal state for View / Edit
    const [modalData, setModalData] = useState(null);
    const [modalMode, setModalMode] = useState(null); // 'view' | 'edit' | 'new'

    // Close popups on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (filterPopupRef.current && !filterPopupRef.current.contains(event.target)) {
                if (!event.target.closest(".po-prj-filter-dropdown-btn")) {
                    setFilterPopupOpen(false);
                }
            }
            if (!event.target.closest(".po-prj-action-wrap")) {
                setActiveActionMenu(null);
            }
            if (!event.target.closest(".po-prj-bulk-wrap")) {
                setBulkActionOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter computation
    const filteredOrders = orders.filter((order) => {
        // Customer text filter
        if (customerSearch.trim() && !order.customer.toLowerCase().includes(customerSearch.toLowerCase().trim())) {
            return false;
        }

        // Status select filter
        if (statusFilter !== "All") {
            if (statusFilter === "Closed" && order.closed !== "Yes") return false;
            if (statusFilter === "Open" && (order.closed === "Yes" || order.status !== "Open")) return false;
            if (statusFilter === "Approved" && order.status !== "Approved") return false;
            if (statusFilter === "Pending" && order.status !== "Pending") return false;
        }

        // Entered By filter
        if (enteredByFilter.trim() && !order.enteredBy.toLowerCase().includes(enteredByFilter.toLowerCase().trim())) {
            return false;
        }

        // Advanced filter popup criteria
        if (advFilters.projectionNo && !order.projectionNo.toLowerCase().includes(advFilters.projectionNo.toLowerCase())) {
            return false;
        }
        if (advFilters.versionNo && !order.versionNo.toLowerCase().includes(advFilters.versionNo.toLowerCase())) {
            return false;
        }
        if (advFilters.customerOrderNo && !order.customerOrderNo.toLowerCase().includes(advFilters.customerOrderNo.toLowerCase())) {
            return false;
        }
        if (advFilters.season && !order.season.toLowerCase().includes(advFilters.season.toLowerCase())) {
            return false;
        }
        if (advFilters.customerPlanNo && !order.customerPlanNo.toLowerCase().includes(advFilters.customerPlanNo.toLowerCase())) {
            return false;
        }
        if (advFilters.soNo && !order.soNo.toLowerCase().includes(advFilters.soNo.toLowerCase())) {
            return false;
        }

        return true;
    });

    // Checkbox selection
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(filteredOrders.map((o) => o.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter((rId) => rId !== id));
        } else {
            setSelectedRows([...selectedRows, id]);
        }
    };

    // Actions
    const handleReload = () => {
        setOrders(INITIAL_PROJECTION_ORDERS);
        setCustomerSearch("");
        setStatusFilter("All");
        setEnteredByFilter("");
        setAdvFilters({
            projectionNo: "",
            versionNo: "",
            fromDate: "",
            toDate: "",
            customerOrderNo: "",
            season: "",
            customerPlanNo: "",
            soNo: ""
        });
        setSelectedRows([]);
        showToast("Projection Order records refreshed");
    };

    const toggleDensity = () => {
        setDensity(density === "normal" ? "compact" : "normal");
        showToast(`Density set to ${density === "normal" ? "compact" : "comfortable"}`);
    };

    const showToast = (msg) => {
        setStatusMessage(msg);
        setTimeout(() => setStatusMessage(""), 3500);
    };

    const handleExportCSV = () => {
        const headers = [
            "Projection No",
            "Version No",
            "Date",
            "Message displayed In Order",
            "Customer",
            "Customer Order No",
            "Season",
            "Internal Memo",
            "Closed",
            "Closed Date",
            "Closed By",
            "Customer Plan No",
            "Copied From",
            "So No",
            "Quantity"
        ];
        const rows = filteredOrders.map((o) => [
            o.projectionNo,
            o.versionNo,
            o.date,
            `"${o.messageDisplayedInOrder}"`,
            `"${o.customer}"`,
            o.customerOrderNo,
            o.season,
            `"${o.internalMemo}"`,
            o.closed,
            o.closedDate,
            o.closedBy,
            o.customerPlanNo,
            o.copiedFrom,
            o.soNo,
            o.quantity
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `projection_orders_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("CSV exported successfully");
    };

    const handleCloseProjection = (id) => {
        setOrders(
            orders.map((o) =>
                o.id === id
                    ? {
                          ...o,
                          closed: "Yes",
                          closedDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
                          closedBy: "Tilak",
                          status: "Closed"
                      }
                    : o
            )
        );
        setActiveActionMenu(null);
        showToast("Projection Order closed successfully");
    };

    // Blank filler rows count to mimic ERP spreadsheet view
    const blankRowsCount = Math.max(0, 10 - filteredOrders.length);

    return (
        <div className={`po-prj-page ${density === "compact" ? "density-compact" : ""}`}>
            {/* Page Title */}
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h1 className="po-prj-title">Projection Order</h1>
                {statusMessage && (
                    <div className="alert alert-info py-1 px-3 mb-0" style={{ fontSize: "12px" }}>
                        {statusMessage}
                    </div>
                )}
            </div>

            {/* Top Filters Row */}
            <div className="po-prj-top-filters">
                <div className="po-prj-filter-group">
                    <label className="po-prj-label">Customer</label>
                    <input
                        type="text"
                        className="po-prj-filter-input"
                        placeholder="Customer Search..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                    />
                </div>

                <div className="po-prj-filter-group">
                    <label className="po-prj-label">Status</label>
                    <select
                        className="po-prj-status-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Open">Open</option>
                        <option value="Approved">Approved</option>
                        <option value="Pending">Pending</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                <div className="po-prj-filter-group">
                    <label className="po-prj-label">Entered by</label>
                    <input
                        type="text"
                        className="po-prj-filter-input"
                        placeholder="Entered by"
                        value={enteredByFilter}
                        onChange={(e) => setEnteredByFilter(e.target.value)}
                    />
                </div>
            </div>

            {/* Toolbar Row */}
            <div className="po-prj-toolbar-row">
                <div className="po-prj-toolbar-left">
                    {/* Icon group: Reload, Toggle density, Settings */}
                    <div className="po-prj-icon-group">
                        <button className="po-prj-icon-btn" title="Reload" onClick={handleReload}>
                            <FaSyncAlt />
                        </button>
                        <button className="po-prj-icon-btn" title="Toggle view density" onClick={toggleDensity}>
                            <FaBars />
                        </button>
                        <button
                            className="po-prj-icon-btn"
                            title="Grid Settings"
                            onClick={() => showToast("Grid display settings configured")}
                        >
                            <FaCog />
                        </button>
                    </div>

                    {/* Filter button that toggles flyout */}
                    <button
                        className={`po-prj-filter-dropdown-btn ${filterPopupOpen ? "active" : ""}`}
                        onClick={() => setFilterPopupOpen(!filterPopupOpen)}
                    >
                        <FaFilter size={11} />
                        Filter
                        <FaCaretDown size={11} />
                    </button>

                    {/* Bulk Action button */}
                    <div className="po-prj-bulk-wrap" style={{ position: "relative", display: "inline-block" }}>
                        <button
                            className="po-prj-btn-bulk"
                            onClick={() => setBulkActionOpen(!bulkActionOpen)}
                            disabled={selectedRows.length === 0}
                            style={{ opacity: selectedRows.length === 0 ? 0.6 : 1 }}
                        >
                            Bulk Action
                            <FaCaretDown size={11} />
                        </button>
                        {bulkActionOpen && selectedRows.length > 0 && (
                            <div className="po-prj-action-menu" style={{ minWidth: "150px" }}>
                                <div
                                    className="po-prj-action-menu-item"
                                    onClick={() => {
                                        setOrders(orders.filter((o) => !selectedRows.includes(o.id)));
                                        setSelectedRows([]);
                                        setBulkActionOpen(false);
                                        showToast(`Deleted ${selectedRows.length} selected orders`);
                                    }}
                                >
                                    Delete Selected
                                </div>
                                <div
                                    className="po-prj-action-menu-item"
                                    onClick={() => {
                                        setOrders(
                                            orders.map((o) =>
                                                selectedRows.includes(o.id)
                                                    ? { ...o, closed: "Yes", closedDate: "22-10-2026", closedBy: "Tilak", status: "Closed" }
                                                    : o
                                            )
                                        );
                                        setSelectedRows([]);
                                        setBulkActionOpen(false);
                                        showToast(`Closed ${selectedRows.length} selected projections`);
                                    }}
                                >
                                    Mark as Closed
                                </div>
                                <div
                                    className="po-prj-action-menu-item"
                                    onClick={() => {
                                        handleExportCSV();
                                        setBulkActionOpen(false);
                                    }}
                                >
                                    Export Selected
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right toolbar utilities */}
                <div className="d-flex align-items-center gap-2">
                    <button
                        className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                        style={{ height: "26px", fontSize: "11.5px" }}
                        onClick={handleExportCSV}
                    >
                        <FaFileExport size={11} /> Export CSV
                    </button>
                    <button
                        className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                        style={{ height: "26px", fontSize: "11.5px", background: "#337ab7", borderColor: "#2e6da4" }}
                        onClick={() => {
                            setModalMode("new");
                            setModalData({
                                projectionNo: `PRJ/9B/2627/00${orders.length + 1}`,
                                versionNo: "V1.0",
                                date: "22-10-2026",
                                messageDisplayedInOrder: "",
                                customer: "",
                                customerOrderNo: "",
                                season: "SS27",
                                internalMemo: "",
                                closed: "No",
                                closedDate: "—",
                                closedBy: "—",
                                customerPlanNo: "",
                                copiedFrom: "—",
                                soNo: "",
                                quantity: "",
                                enteredBy: "Tilak",
                                status: "Open"
                            });
                        }}
                    >
                        <FaPlus size={10} /> New Projection
                    </button>
                </div>

                {/* Flyout Filter Dropdown Popup */}
                {filterPopupOpen && (
                    <div className="po-prj-filter-popup" ref={filterPopupRef}>
                        <div className="po-prj-filter-popup-grid">
                            <div className="po-prj-popup-field">
                                <label className="po-prj-popup-label">Projection No</label>
                                <input
                                    type="text"
                                    className="po-prj-popup-input"
                                    value={advFilters.projectionNo}
                                    onChange={(e) => setAdvFilters({ ...advFilters, projectionNo: e.target.value })}
                                />
                            </div>

                            <div className="po-prj-popup-field">
                                <label className="po-prj-popup-label">Version No</label>
                                <input
                                    type="text"
                                    className="po-prj-popup-input"
                                    value={advFilters.versionNo}
                                    onChange={(e) => setAdvFilters({ ...advFilters, versionNo: e.target.value })}
                                />
                            </div>

                            <div className="po-prj-popup-field">
                                <label className="po-prj-popup-label">From Date</label>
                                <input
                                    type="date"
                                    className="po-prj-popup-input"
                                    value={advFilters.fromDate}
                                    onChange={(e) => setAdvFilters({ ...advFilters, fromDate: e.target.value })}
                                />
                            </div>

                            <div className="po-prj-popup-field">
                                <label className="po-prj-popup-label">To Date</label>
                                <input
                                    type="date"
                                    className="po-prj-popup-input"
                                    value={advFilters.toDate}
                                    onChange={(e) => setAdvFilters({ ...advFilters, toDate: e.target.value })}
                                />
                            </div>

                            <div className="po-prj-popup-field">
                                <label className="po-prj-popup-label">Customer Order No</label>
                                <input
                                    type="text"
                                    className="po-prj-popup-input"
                                    value={advFilters.customerOrderNo}
                                    onChange={(e) => setAdvFilters({ ...advFilters, customerOrderNo: e.target.value })}
                                />
                            </div>

                            <div className="po-prj-popup-field">
                                <label className="po-prj-popup-label">Season</label>
                                <input
                                    type="text"
                                    className="po-prj-popup-input"
                                    value={advFilters.season}
                                    onChange={(e) => setAdvFilters({ ...advFilters, season: e.target.value })}
                                />
                            </div>

                            <div className="po-prj-popup-field">
                                <label className="po-prj-popup-label">Customer Plan No</label>
                                <input
                                    type="text"
                                    className="po-prj-popup-input"
                                    value={advFilters.customerPlanNo}
                                    onChange={(e) => setAdvFilters({ ...advFilters, customerPlanNo: e.target.value })}
                                />
                            </div>

                            <div className="po-prj-popup-field">
                                <label className="po-prj-popup-label">So No</label>
                                <input
                                    type="text"
                                    className="po-prj-popup-input"
                                    value={advFilters.soNo}
                                    onChange={(e) => setAdvFilters({ ...advFilters, soNo: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="po-prj-popup-actions">
                            <button
                                type="button"
                                className="po-prj-popup-btn-reset"
                                onClick={() => {
                                    setAdvFilters({
                                        projectionNo: "",
                                        versionNo: "",
                                        fromDate: "",
                                        toDate: "",
                                        customerOrderNo: "",
                                        season: "",
                                        customerPlanNo: "",
                                        soNo: ""
                                    });
                                }}
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                className="po-prj-popup-btn-apply"
                                onClick={() => setFilterPopupOpen(false)}
                            >
                                Apply Filter
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 17-Column Spreadsheet Table matching Screenshot */}
            <div className="po-prj-table-wrap">
                <table className="po-prj-table">
                    <thead>
                        <tr>
                            <th style={{ width: "75px" }}>Action</th>
                            <th style={{ minWidth: "140px" }}>Projection No</th>
                            <th style={{ minWidth: "90px" }}>Version No</th>
                            <th style={{ minWidth: "100px" }}>Date</th>
                            <th style={{ minWidth: "220px" }}>Message displayed In Order</th>
                            <th style={{ minWidth: "180px" }}>Customer</th>
                            <th style={{ minWidth: "140px" }}>Customer Order No</th>
                            <th style={{ minWidth: "90px" }}>Season</th>
                            <th style={{ minWidth: "220px" }}>Internal Memo</th>
                            <th style={{ minWidth: "75px" }}>Closed</th>
                            <th style={{ minWidth: "110px" }}>Closed Date</th>
                            <th style={{ minWidth: "120px" }}>Closed By</th>
                            <th style={{ minWidth: "130px" }}>Customer Plan No</th>
                            <th style={{ minWidth: "120px" }}>Copied From</th>
                            <th style={{ minWidth: "130px" }}>So No</th>
                            <th style={{ minWidth: "110px" }}>Quantity</th>
                            <th style={{ width: "95px", textAlign: "center" }}>
                                <div className="d-flex align-items-center justify-content-center gap-1">
                                    <span>No. of rows</span>
                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredOrders.length > 0 &&
                                            selectedRows.length === filteredOrders.length
                                        }
                                        onChange={handleSelectAll}
                                        style={{ cursor: "pointer" }}
                                    />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order, index) => (
                            <tr key={order.id}>
                                {/* Action dropdown button */}
                                <td style={{ textAlign: "center" }}>
                                    <div className="po-prj-action-wrap">
                                        <button
                                            className="po-prj-action-btn"
                                            onClick={() =>
                                                setActiveActionMenu(activeActionMenu === order.id ? null : order.id)
                                            }
                                        >
                                            Action <FaCaretDown size={9} />
                                        </button>
                                        {activeActionMenu === order.id && (
                                            <div className="po-prj-action-menu">
                                                <div
                                                    className="po-prj-action-menu-item"
                                                    onClick={() => {
                                                        setModalData(order);
                                                        setModalMode("view");
                                                        setActiveActionMenu(null);
                                                    }}
                                                >
                                                    <FaEye size={11} style={{ marginRight: 6 }} /> View
                                                </div>
                                                <div
                                                    className="po-prj-action-menu-item"
                                                    onClick={() => {
                                                        setModalData({ ...order });
                                                        setModalMode("edit");
                                                        setActiveActionMenu(null);
                                                    }}
                                                >
                                                    <FaEdit size={11} style={{ marginRight: 6 }} /> Edit
                                                </div>
                                                <div
                                                    className="po-prj-action-menu-item"
                                                    onClick={() => {
                                                        window.print();
                                                        setActiveActionMenu(null);
                                                    }}
                                                >
                                                    <FaPrint size={11} style={{ marginRight: 6 }} /> Print
                                                </div>
                                                {order.closed !== "Yes" && (
                                                    <div
                                                        className="po-prj-action-menu-item"
                                                        onClick={() => handleCloseProjection(order.id)}
                                                    >
                                                        <FaCheck size={11} style={{ marginRight: 6 }} /> Close Projection
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {/* Column 2: Projection No */}
                                <td style={{ fontWeight: 600, color: "#2563eb" }}>{order.projectionNo}</td>

                                {/* Column 3: Version No */}
                                <td>{order.versionNo}</td>

                                {/* Column 4: Date */}
                                <td>{order.date}</td>

                                {/* Column 5: Message displayed In Order */}
                                <td title={order.messageDisplayedInOrder}>{order.messageDisplayedInOrder}</td>

                                {/* Column 6: Customer */}
                                <td style={{ fontWeight: 500 }}>{order.customer}</td>

                                {/* Column 7: Customer Order No */}
                                <td>{order.customerOrderNo}</td>

                                {/* Column 8: Season */}
                                <td>{order.season}</td>

                                {/* Column 9: Internal Memo */}
                                <td title={order.internalMemo}>{order.internalMemo}</td>

                                {/* Column 10: Closed */}
                                <td style={{ textAlign: "center" }}>
                                    <span
                                        style={{
                                            padding: "2px 6px",
                                            borderRadius: "3px",
                                            fontSize: "11px",
                                            fontWeight: 600,
                                            background: order.closed === "Yes" ? "#fee2e2" : "#e0f2fe",
                                            color: order.closed === "Yes" ? "#991b1b" : "#0369a1"
                                        }}
                                    >
                                        {order.closed}
                                    </span>
                                </td>

                                {/* Column 11: Closed Date */}
                                <td>{order.closedDate}</td>

                                {/* Column 12: Closed By */}
                                <td>{order.closedBy}</td>

                                {/* Column 13: Customer Plan No */}
                                <td>{order.customerPlanNo}</td>

                                {/* Column 14: Copied From */}
                                <td>{order.copiedFrom}</td>

                                {/* Column 15: So No */}
                                <td style={{ color: "#0284c7" }}>{order.soNo}</td>

                                {/* Column 16: Quantity */}
                                <td style={{ fontWeight: 600, textAlign: "right" }}>{order.quantity}</td>

                                {/* Column 17: No. of rows (Row Checkbox) */}
                                <td style={{ textAlign: "center" }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(order.id)}
                                        onChange={() => handleSelectRow(order.id)}
                                        style={{ cursor: "pointer" }}
                                    />
                                </td>
                            </tr>
                        ))}

                        {/* Blank rows fill matching classic ERP grid */}
                        {Array.from({ length: blankRowsCount }).map((_, i) => (
                            <tr key={`blank-${i}`} className="po-prj-empty-grid-row">
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

            {/* Footer Summary Bar */}
            <div
                className="d-flex justify-content-between align-items-center mt-2 px-2"
                style={{ fontSize: "11.5px", color: "#64748b" }}
            >
                <div>
                    Showing <strong>{filteredOrders.length}</strong> record(s) &bull; Selected:{" "}
                    <strong>{selectedRows.length}</strong>
                </div>
                <div>
                    V-Connect Inc. &bull; Projection Order Management System &bull; Jenixcloud ERP Engine
                </div>
            </div>

            {/* View / Edit / Create Modal */}
            {modalMode && modalData && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999
                    }}
                >
                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: "6px",
                            width: "720px",
                            maxWidth: "95vw",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
                        }}
                    >
                        <div
                            style={{
                                padding: "12px 18px",
                                borderBottom: "1px solid #e2e8f0",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background: "#f8fafc"
                            }}
                        >
                            <h5 style={{ margin: 0, fontSize: "15px", color: "#1e293b", fontWeight: 600 }}>
                                {modalMode === "view"
                                    ? `Projection Order Details — ${modalData.projectionNo}`
                                    : modalMode === "edit"
                                    ? `Edit Projection Order — ${modalData.projectionNo}`
                                    : "Create New Projection Order"}
                            </h5>
                            <button
                                onClick={() => {
                                    setModalMode(null);
                                    setModalData(null);
                                }}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                    color: "#64748b"
                                }}
                            >
                                <FaTimes size={15} />
                            </button>
                        </div>

                        <div style={{ padding: "18px" }}>
                            <div className="row g-3" style={{ fontSize: "12px" }}>
                                <div className="col-md-6">
                                    <label className="form-label mb-1 fw-bold">Projection No</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        disabled={modalMode === "view"}
                                        value={modalData.projectionNo}
                                        onChange={(e) => setModalData({ ...modalData, projectionNo: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label mb-1 fw-bold">Version No</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        disabled={modalMode === "view"}
                                        value={modalData.versionNo}
                                        onChange={(e) => setModalData({ ...modalData, versionNo: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label mb-1 fw-bold">Date</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        disabled={modalMode === "view"}
                                        value={modalData.date}
                                        onChange={(e) => setModalData({ ...modalData, date: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label mb-1 fw-bold">Customer</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        disabled={modalMode === "view"}
                                        value={modalData.customer}
                                        onChange={(e) => setModalData({ ...modalData, customer: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label mb-1 fw-bold">Customer Order No</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        disabled={modalMode === "view"}
                                        value={modalData.customerOrderNo}
                                        onChange={(e) => setModalData({ ...modalData, customerOrderNo: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label mb-1 fw-bold">Season</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        disabled={modalMode === "view"}
                                        value={modalData.season}
                                        onChange={(e) => setModalData({ ...modalData, season: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label mb-1 fw-bold">Customer Plan No</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        disabled={modalMode === "view"}
                                        value={modalData.customerPlanNo}
                                        onChange={(e) => setModalData({ ...modalData, customerPlanNo: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label mb-1 fw-bold">Quantity</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        disabled={modalMode === "view"}
                                        value={modalData.quantity}
                                        onChange={(e) => setModalData({ ...modalData, quantity: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label mb-1 fw-bold">Linked SO No</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        disabled={modalMode === "view"}
                                        value={modalData.soNo}
                                        onChange={(e) => setModalData({ ...modalData, soNo: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label mb-1 fw-bold">Entered By</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        disabled={modalMode === "view"}
                                        value={modalData.enteredBy}
                                        onChange={(e) => setModalData({ ...modalData, enteredBy: e.target.value })}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label mb-1 fw-bold">Message Displayed In Order</label>
                                    <textarea
                                        className="form-control form-control-sm"
                                        rows={2}
                                        disabled={modalMode === "view"}
                                        value={modalData.messageDisplayedInOrder}
                                        onChange={(e) => setModalData({ ...modalData, messageDisplayedInOrder: e.target.value })}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label mb-1 fw-bold">Internal Memo</label>
                                    <textarea
                                        className="form-control form-control-sm"
                                        rows={2}
                                        disabled={modalMode === "view"}
                                        value={modalData.internalMemo}
                                        onChange={(e) => setModalData({ ...modalData, internalMemo: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                padding: "10px 18px",
                                borderTop: "1px solid #e2e8f0",
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "8px",
                                background: "#f8fafc"
                            }}
                        >
                            <button
                                type="button"
                                className="btn btn-sm btn-secondary"
                                onClick={() => {
                                    setModalMode(null);
                                    setModalData(null);
                                }}
                            >
                                Close
                            </button>
                            {modalMode !== "view" && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    style={{ background: "#337ab7", borderColor: "#2e6da4" }}
                                    onClick={() => {
                                        if (modalMode === "edit") {
                                            setOrders(orders.map((o) => (o.id === modalData.id ? modalData : o)));
                                            showToast("Projection Order updated successfully");
                                        } else if (modalMode === "new") {
                                            setOrders([{ ...modalData, id: Date.now() }, ...orders]);
                                            showToast("New Projection Order created");
                                        }
                                        setModalMode(null);
                                        setModalData(null);
                                    }}
                                >
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
