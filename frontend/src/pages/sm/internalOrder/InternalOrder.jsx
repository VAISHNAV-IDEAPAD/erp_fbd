import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaPlus,
    FaFileExcel,
    FaPrint,
    FaSearch,
    FaChevronDown,
    FaEye,
    FaEdit,
    FaTrash,
    FaCheckCircle,
    FaUndo,
    FaTimes
} from "react-icons/fa";
import {
    getInternalOrders,
    updateInternalOrderStatus,
    bulkInternalOrderAction,
    deleteInternalOrder,
    getInternalOrderById
} from "../../../services/internalOrderService";
import "../../../styles/internalOrder.css";

export default function InternalOrder() {
    const navigate = useNavigate();

    // Data State
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters State matching screenshot
    const [customerFilter, setCustomerFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [enteredByFilter, setEnteredByFilter] = useState("");
    const [materialSourceFilter, setMaterialSourceFilter] = useState("Import");
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [totalPages, setTotalPages] = useState(1);

    // Row Selection & Actions
    const [selectedIds, setSelectedIds] = useState([]);
    const [openActionDropdown, setOpenActionDropdown] = useState(null);
    const [bulkAction, setBulkAction] = useState("");

    // Quick View Modal
    const [viewOrder, setViewOrder] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Fetch Orders
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                page,
                limit,
                customer: customerFilter,
                status: statusFilter,
                enteredBy: enteredByFilter,
                materialSource: materialSourceFilter,
                search: searchQuery,
                sortBy: "IONo",
                sortDir: "DESC"
            };
            const res = await getInternalOrders(params);
            if (res && res.data) {
                setOrders(res.data);
                setTotal(res.total || res.data.length);
                setTotalPages(res.totalPages || Math.ceil((res.total || res.data.length) / limit) || 1);
            }
        } catch (err) {
            console.error("Error loading internal orders:", err);
            setError("Failed to load internal orders. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [page, limit, customerFilter, statusFilter, enteredByFilter, materialSourceFilter, searchQuery]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Handle Checkbox Selection
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(orders.map((o) => o.IOID));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Toggle Status (Close / Reopen)
    const handleToggleStatus = async (order) => {
        const nextStatus = order.Status === "Closed" ? "Open" : "Closed";
        try {
            await updateInternalOrderStatus(order.IOID, nextStatus, "Current User");
            setOpenActionDropdown(null);
            fetchOrders();
        } catch (err) {
            alert("Error updating order status: " + (err.response?.data?.message || err.message));
        }
    };

    // Delete Single Order
    const handleDeleteOrder = async (order) => {
        if (!window.confirm("Are you sure you want to delete order " + order.IONo + "?")) return;
        try {
            await deleteInternalOrder(order.IOID);
            setOpenActionDropdown(null);
            fetchOrders();
        } catch (err) {
            alert("Error deleting order: " + (err.response?.data?.message || err.message));
        }
    };

    // Bulk Action Apply
    const handleApplyBulkAction = async () => {
        if (!bulkAction) {
            alert("Please select an action from the dropdown.");
            return;
        }
        if (selectedIds.length === 0) {
            alert("Please select at least one order to apply this action.");
            return;
        }
        if (!window.confirm("Are you sure you want to perform " + bulkAction + " on " + selectedIds.length + " orders?")) return;

        try {
            await bulkInternalOrderAction(bulkAction, selectedIds);
            setSelectedIds([]);
            setBulkAction("");
            fetchOrders();
        } catch (err) {
            alert("Error performing bulk action: " + (err.response?.data?.message || err.message));
        }
    };

    // Quick View Order Details
    const handleViewOrder = async (order) => {
        setOpenActionDropdown(null);
        setModalLoading(true);
        setViewOrder(order);
        try {
            const full = await getInternalOrderById(order.IOID);
            setViewOrder(full);
        } catch (err) {
            console.error("Error fetching full order:", err);
        } finally {
            setModalLoading(false);
        }
    };

    // Export to CSV
    const handleExportExcel = () => {
        if (orders.length === 0) {
            alert("No orders available to export.");
            return;
        }
        const headers = [
            "IO No", "Version No", "Date", "Customer", "Customer Order No",
            "Season", "So No", "Quantity", "No of Rows", "Material Source", "Status"
        ];
        const rows = orders.map(o => [
            o.IONo, o.VersionNo, o.IODate, `"${o.Customer}"`, `"${o.CustomerOrderNo || ""}"`,
            o.Season, o.SoNo, o.TotalQty, o.NoOfRows, o.MaterialSource, o.Status
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Internal_Orders_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Calculate Summary Totals
    const totalQtySum = orders.reduce((acc, curr) => acc + (parseFloat(curr.TotalQty) || 0), 0);
    const openOrdersCount = orders.filter(o => o.Status !== "Closed").length;
    const closedOrdersCount = orders.filter(o => o.Status === "Closed").length;

    return (
        <div className="io-workbench-container">
            {/* Header Row */}
            <div className="io-header-row">
                <h1 className="io-page-title">Internal Order</h1>
                <div className="io-header-actions">
                    <Link to="/internal-order-master/new" className="io-btn-new">
                        <FaPlus /> New
                    </Link>
                    <button type="button" className="io-btn-secondary" onClick={handleExportExcel} title="Export to Excel / CSV">
                        <FaFileExcel style={{ color: "#16a34a" }} /> Excel
                    </button>
                    <button type="button" className="io-btn-secondary" onClick={() => window.print()} title="Print Order Sheet">
                        <FaPrint style={{ color: "#475569" }} /> Print
                    </button>
                </div>
            </div>

            {/* Filter Bar matching media_1791313165704.png */}
            <div className="io-filter-card">
                <div className="io-filter-grid">
                    {/* Customer Filter */}
                    <div className="io-filter-item">
                        <label className="io-filter-label">Customer</label>
                        <input
                            type="text"
                            className="io-filter-input"
                            placeholder="Customer Search..."
                            value={customerFilter}
                            onChange={(e) => {
                                setCustomerFilter(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="io-filter-item">
                        <label className="io-filter-label">Status</label>
                        <select
                            className="io-filter-select"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="All">All</option>
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    {/* Entered by Filter */}
                    <div className="io-filter-item">
                        <label className="io-filter-label">Entered by</label>
                        <input
                            type="text"
                            className="io-filter-input"
                            placeholder="Entered by"
                            value={enteredByFilter}
                            onChange={(e) => {
                                setEnteredByFilter(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    {/* Material Source Radio (Import / Domestic) */}
                    <div className="io-filter-item">
                        <label className="io-filter-label">Material Source</label>
                        <div className="io-radio-group">
                            <label className="io-radio-label">
                                <input
                                    type="radio"
                                    name="materialSource"
                                    value="Import"
                                    checked={materialSourceFilter === "Import"}
                                    onChange={(e) => {
                                        setMaterialSourceFilter(e.target.value);
                                        setPage(1);
                                    }}
                                />
                                Import
                            </label>
                            <label className="io-radio-label">
                                <input
                                    type="radio"
                                    name="materialSource"
                                    value="Domestic"
                                    checked={materialSourceFilter === "Domestic"}
                                    onChange={(e) => {
                                        setMaterialSourceFilter(e.target.value);
                                        setPage(1);
                                    }}
                                />
                                Domestic
                            </label>
                            <label className="io-radio-label">
                                <input
                                    type="radio"
                                    name="materialSource"
                                    value="All"
                                    checked={materialSourceFilter === "All"}
                                    onChange={(e) => {
                                        setMaterialSourceFilter(e.target.value);
                                        setPage(1);
                                    }}
                                />
                                All
                            </label>
                        </div>
                    </div>

                    {/* General Search Input */}
                    <div className="io-filter-item" style={{ minWidth: "180px" }}>
                        <label className="io-filter-label">Quick Search</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type="text"
                                className="io-filter-input"
                                placeholder="Search IO / SO / PO..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setPage(1);
                                }}
                                style={{ paddingRight: "26px" }}
                            />
                            <FaSearch style={{ position: "absolute", right: "8px", top: "9px", color: "#94a3b8", fontSize: "12px" }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Metrics Ribbon */}
            <div className="io-summary-ribbon">
                <div className="io-summary-item">
                    <span>Total Orders:</span>
                    <span className="io-summary-val">{total}</span>
                </div>
                <div className="io-summary-item">
                    <span>Page Qty:</span>
                    <span className="io-summary-val">{totalQtySum.toLocaleString("en-US", { minimumFractionDigits: 1 })}</span>
                </div>
                <div className="io-summary-item">
                    <span>Open Orders:</span>
                    <span className="io-summary-val" style={{ color: "#16a34a" }}>{openOrdersCount}</span>
                </div>
                <div className="io-summary-item">
                    <span>Closed Orders:</span>
                    <span className="io-summary-val" style={{ color: "#64748b" }}>{closedOrdersCount}</span>
                </div>
                <div className="io-summary-item" style={{ marginLeft: "auto" }}>
                    <span>Orders Range:</span>
                    <span className="io-summary-val">IO/9B/2627/168 — 212</span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger py-2" style={{ fontSize: "0.82rem" }}>
                    {error}
                </div>
            )}

            {/* High-Density 17-Column Table */}
            <div className="io-table-wrapper">
                <table className="io-table">
                    <thead>
                        <tr>
                            <th style={{ width: "95px" }}>Action ▾</th>
                            <th style={{ width: "135px" }}>IO No</th>
                            <th style={{ width: "85px" }} className="text-center">Version No</th>
                            <th style={{ width: "95px" }}>Date</th>
                            <th style={{ width: "230px" }}>Message displayed in Order</th>
                            <th style={{ width: "190px" }}>Customer</th>
                            <th style={{ width: "190px" }}>Customer Order No</th>
                            <th style={{ width: "125px" }}>Season</th>
                            <th style={{ width: "200px" }}>Internal Memo</th>
                            <th style={{ width: "70px" }} className="text-center">Closed</th>
                            <th style={{ width: "95px" }}>Closed Date</th>
                            <th style={{ width: "120px" }}>Closed By</th>
                            <th style={{ width: "135px" }}>Customer Plan No</th>
                            <th style={{ width: "130px" }}>So No</th>
                            <th style={{ width: "95px" }} className="text-end">Quantity</th>
                            <th style={{ width: "85px" }} className="text-center">No. of rows</th>
                            <th style={{ width: "40px" }} className="text-center">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={orders.length > 0 && selectedIds.length === orders.length}
                                    style={{ cursor: "pointer", accentColor: "#1a689d" }}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="17" className="text-center py-4" style={{ color: "#64748b" }}>
                                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
                                    Loading Internal Orders...
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan="17" className="text-center py-4" style={{ color: "#64748b" }}>
                                    No internal orders matching current filters.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => {
                                const isSelected = selectedIds.includes(order.IOID);
                                const isClosed = order.Status === "Closed" || order.Closed === "Yes";
                                return (
                                    <tr key={order.IOID} className={isSelected ? "row-selected" : ""}>
                                        {/* 1. Action Dropdown */}
                                        <td>
                                            <div className="io-action-dropdown">
                                                <button
                                                    type="button"
                                                    className="io-action-btn"
                                                    onClick={() =>
                                                        setOpenActionDropdown(
                                                            openActionDropdown === order.IOID ? null : order.IOID
                                                        )
                                                    }
                                                >
                                                    Action <FaChevronDown style={{ fontSize: "8px" }} />
                                                </button>

                                                {openActionDropdown === order.IOID && (
                                                    <div className="io-dropdown-menu">
                                                        <button
                                                            type="button"
                                                            className="io-dropdown-item"
                                                            onClick={() => handleViewOrder(order)}
                                                        >
                                                            <FaEye style={{ color: "#0751bd" }} /> View
                                                        </button>
                                                        <Link
                                                            to={"/internal-order-master/" + order.IOID}
                                                            className="io-dropdown-item"
                                                            onClick={() => setOpenActionDropdown(null)}
                                                        >
                                                            <FaEdit style={{ color: "#0284c7" }} /> Edit Master
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            className="io-dropdown-item"
                                                            onClick={() => handleToggleStatus(order)}
                                                        >
                                                            {isClosed ? (
                                                                <>
                                                                    <FaUndo style={{ color: "#16a34a" }} /> Reopen IO
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FaCheckCircle style={{ color: "#64748b" }} /> Close IO
                                                                </>
                                                            )}
                                                        </button>
                                                        <div className="io-dropdown-divider" />
                                                        <button
                                                            type="button"
                                                            className="io-dropdown-item"
                                                            style={{ color: "#dc2626" }}
                                                            onClick={() => handleDeleteOrder(order)}
                                                        >
                                                            <FaTrash /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* 2. IO No */}
                                        <td>
                                            <Link
                                                to={"/internal-order-master/" + order.IOID}
                                                className="io-link"
                                                title="Open Internal Order Master"
                                            >
                                                {order.IONo}
                                            </Link>
                                        </td>

                                        {/* 3. Version No */}
                                        <td className="text-center">{order.VersionNo ?? 0}</td>
                                        <td>{order.IODate || "-"}</td>
                                        <td title={order.OrderMessage}>
                                            <span style={{ display: "block", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {order.OrderMessage || "-"}
                                            </span>
                                        </td>
                                        <td className="io-customer-cell">{order.Customer}</td>
                                        <td title={order.CustomerOrderNo}>
                                            <span style={{ display: "block", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {order.CustomerOrderNo || "-"}
                                            </span>
                                        </td>
                                        <td>{order.Season || "-"}</td>
                                        <td title={order.InternalMemo}>
                                            <span style={{ display: "block", maxWidth: "190px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {order.InternalMemo || "-"}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            {isClosed ? (
                                                <span className="io-badge io-badge-closed">Yes</span>
                                            ) : (
                                                <span className="io-badge io-badge-open">No</span>
                                            )}
                                        </td>
                                        <td>{order.ClosedDate || "-"}</td>
                                        <td>{order.ClosedBy || "-"}</td>
                                        <td>{order.CustomerPlanNo || "-"}</td>
                                        <td style={{ fontWeight: 500, color: "#1e3a5f" }}>{order.SoNo || "-"}</td>
                                        <td className="text-end" style={{ fontWeight: 600 }}>
                                            {typeof order.TotalQty === "number" ? order.TotalQty.toFixed(1) : parseFloat(order.TotalQty || 0).toFixed(1)}
                                        </td>
                                        <td className="text-center">{order.NoOfRows ?? 1}</td>
                                        <td className="text-center">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleSelectRow(order.IOID)}
                                                style={{ cursor: "pointer", accentColor: "#1a689d" }}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Bottom Controls / Bulk Actions & Pagination */}
            <div className="io-footer-row">
                <div className="io-bulk-actions">
                    <select
                        className="io-filter-select"
                        style={{ width: "160px" }}
                        value={bulkAction}
                        onChange={(e) => setBulkAction(e.target.value)}
                    >
                        <option value="">Bulk Action ▾</option>
                        <option value="Close">Close Selected</option>
                        <option value="Open">Reopen Selected</option>
                        <option value="Delete">Delete Selected</option>
                    </select>
                    <button
                        type="button"
                        className="io-btn-secondary"
                        onClick={handleApplyBulkAction}
                        disabled={selectedIds.length === 0 || !bulkAction}
                    >
                        Apply ({selectedIds.length})
                    </button>
                </div>

                <div className="io-pagination-controls">
                    <span>Rows per page:</span>
                    <select
                        className="io-filter-select"
                        style={{ width: "70px", padding: "2px 6px", height: "28px" }}
                        value={limit}
                        onChange={(e) => {
                            const val = e.target.value === "all" ? "all" : parseInt(e.target.value, 10);
                            setLimit(val);
                            setPage(1);
                        }}
                    >
                        <option value={15}>15</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value="all">All</option>
                    </select>

                    <span style={{ margin: "0 8px" }}>
                        Showing {orders.length > 0 ? (page - 1) * (limit === "all" ? total : limit) + 1 : 0} -{" "}
                        {Math.min(page * (limit === "all" ? total : limit), total)} of {total}
                    </span>

                    <button
                        type="button"
                        className="io-page-btn"
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                    >
                        First
                    </button>
                    <button
                        type="button"
                        className="io-page-btn"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Prev
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = page - 2 + i;
                        if (pageNum < 1) pageNum += 1 - pageNum;
                        if (pageNum > totalPages) return null;
                        return (
                            <button
                                key={pageNum}
                                type="button"
                                className={"io-page-btn " + (page === pageNum ? "active" : "")}
                                onClick={() => setPage(pageNum)}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        type="button"
                        className="io-page-btn"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || totalPages === 0}
                    >
                        Next
                    </button>
                    <button
                        type="button"
                        className="io-page-btn"
                        onClick={() => setPage(totalPages)}
                        disabled={page === totalPages || totalPages === 0}
                    >
                        Last
                    </button>
                </div>
            </div>

            {/* Quick View Modal */}
            {viewOrder && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2000,
                        padding: "20px"
                    }}
                >
                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: "6px",
                            maxWidth: "800px",
                            width: "100%",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                            padding: "20px"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
                            <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#1a689d", fontWeight: 700 }}>
                                Internal Order Overview — {viewOrder.IONo}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setViewOrder(null)}
                                style={{ background: "transparent", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {modalLoading ? (
                            <div className="text-center py-4 text-muted">
                                <div className="spinner-border spinner-border-sm me-2" role="status" />
                                Loading Details...
                            </div>
                        ) : (
                            <div style={{ marginTop: "16px" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", fontSize: "0.82rem" }}>
                                    <div><strong>Customer:</strong> {viewOrder.Customer}</div>
                                    <div><strong>Order Date:</strong> {viewOrder.IODate}</div>
                                    <div><strong>Customer Order No:</strong> {viewOrder.CustomerOrderNo}</div>
                                    <div><strong>Sales Order (SO):</strong> {viewOrder.SoNo}</div>
                                    <div><strong>Season:</strong> {viewOrder.Season}</div>
                                    <div><strong>Material Source:</strong> {viewOrder.MaterialSource}</div>
                                    <div><strong>Customer Plan No:</strong> {viewOrder.CustomerPlanNo}</div>
                                    <div><strong>Total Quantity:</strong> {parseFloat(viewOrder.TotalQty || 0).toLocaleString()} pcs</div>
                                    <div><strong>Status:</strong> {viewOrder.Status}</div>
                                    <div><strong>Internal Memo:</strong> {viewOrder.InternalMemo || "-"}</div>
                                </div>

                                <h4 style={{ fontSize: "0.9rem", color: "#1a689d", marginTop: "20px", marginBottom: "8px", fontWeight: 600 }}>
                                    Style & Line Item Breakdown
                                </h4>
                                <div style={{ overflowX: "auto" }}>
                                    <table className="io-detail-table">
                                        <thead>
                                            <tr>
                                                <th>Style No</th>
                                                <th>Description</th>
                                                <th>Colour</th>
                                                <th>Size Breakdown</th>
                                                <th className="text-end">Qty</th>
                                                <th className="text-end">Rate ($)</th>
                                                <th className="text-end">Amount ($)</th>
                                                <th>Ex-Factory Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(viewOrder.details || []).length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="text-center py-2 text-muted">
                                                        No style breakdowns registered for this order.
                                                    </td>
                                                </tr>
                                            ) : (
                                                viewOrder.details.map((d, idx) => (
                                                    <tr key={idx}>
                                                        <td><strong>{d.StyleNo}</strong></td>
                                                        <td>{d.Description}</td>
                                                        <td>{d.Colour}</td>
                                                        <td>{d.SizeBreakdown}</td>
                                                        <td className="text-end">{parseFloat(d.Qty || 0).toLocaleString()}</td>
                                                        <td className="text-end">{"$" + parseFloat(d.Rate || 0).toFixed(2)}</td>
                                                        <td className="text-end font-monospace">{"$" + parseFloat(d.Amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                        <td>{d.ExFactoryDate || "-"}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                                    <button
                                        type="button"
                                        className="io-btn-secondary"
                                        onClick={() => setViewOrder(null)}
                                    >
                                        Close
                                    </button>
                                    <Link
                                        to={"/internal-order-master/" + viewOrder.IOID}
                                        className="io-btn-new"
                                    >
                                        <FaEdit /> Open in Order Master
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}