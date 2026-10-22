import React, { useState, useRef, useEffect } from "react";
import {
    FaSyncAlt,
    FaCog,
    FaFileAlt,
    FaFileExcel,
    FaFilter,
    FaCaretDown,
    FaCalendarAlt,
    FaTimes,
    FaFilePdf
} from "react-icons/fa";
import "../../../styles/taskDelayAnalysis.css";

const TASK_DELAY_DATA = [
    { id: 1, taskName: "Buyer Order entry in TPCS (SALES ORDER)", notYetDue: 0, d0_5: 3, d6_10: 4, d11_20: 7, dAbove20: 138 },
    { id: 2, taskName: "IO Release Date", notYetDue: 0, d0_5: 0, d6_10: 0, d11_20: 0, dAbove20: 4 },
    { id: 3, taskName: "BOM entry in TPCS", notYetDue: 0, d0_5: 1, d6_10: 3, d11_20: 3, dAbove20: 54 },
    { id: 4, taskName: "RMR Recalculate", notYetDue: 0, d0_5: 2, d6_10: 3, d11_20: 2, dAbove20: 54 },
    { id: 5, taskName: "file submission to planning", notYetDue: 0, d0_5: 2, d6_10: 4, d11_20: 1, dAbove20: 53 },
    { id: 6, taskName: "Product file authorized (BOM LOCKED)", notYetDue: 0, d0_5: 2, d6_10: 3, d11_20: 2, dAbove20: 53 },
    { id: 7, taskName: "file submit to Sourcing", notYetDue: 0, d0_5: 2, d6_10: 4, d11_20: 1, dAbove20: 54 },
    { id: 8, taskName: "Indent no. Allotment", notYetDue: 0, d0_5: 4, d6_10: 5, d11_20: 4, dAbove20: 117 },
    { id: 9, taskName: "Job file submit to Sourcing from Store", notYetDue: 0, d0_5: 4, d6_10: 4, d11_20: 5, dAbove20: 114 },
    { id: 10, taskName: "Fabric ordering", notYetDue: 0, d0_5: 0, d6_10: 0, d11_20: 0, dAbove20: 56 },
    { id: 11, taskName: "Leather Order", notYetDue: 0, d0_5: 0, d6_10: 0, d11_20: 0, dAbove20: 57 },
    { id: 12, taskName: "Hardware ordering", notYetDue: 0, d0_5: 0, d6_10: 0, d11_20: 0, dAbove20: 44 },
    { id: 13, taskName: "Lining ordering", notYetDue: 0, d0_5: 0, d6_10: 0, d11_20: 0, dAbove20: 57 },
    { id: 14, taskName: "Threads ordering", notYetDue: 0, d0_5: 0, d6_10: 0, d11_20: 0, dAbove20: 41 },
    { id: 15, taskName: "ZIPPER-Ordering", notYetDue: 0, d0_5: 0, d6_10: 0, d11_20: 0, dAbove20: 63 }
];

export default function TaskDelayAnalysis() {
    const [asOnDate, setAsOnDate] = useState("22-10-2026");
    const [tasks, setTasks] = useState(TASK_DELAY_DATA);
    const [filterOpen, setFilterOpen] = useState(false);
    const filterRef = useRef(null);

    // Filter fields
    const [buyerFilter, setBuyerFilter] = useState("All");
    const [searchTask, setSearchTask] = useState("");

    // Drill-down modal state
    const [drillDown, setDrillDown] = useState(null);

    // Close filter flyout on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setFilterOpen(false);
            }
        };
        if (filterOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [filterOpen]);

    const filteredTasks = tasks.filter(t => {
        if (searchTask.trim() && !t.taskName.toLowerCase().includes(searchTask.toLowerCase())) {
            return false;
        }
        return true;
    });

    const handleCellClick = (task, bucketName, count) => {
        if (count === 0) return;
        setDrillDown({
            taskName: task.taskName,
            bucket: bucketName,
            count: count,
            orders: [
                { orderNo: "SO/9B/2627/001", buyer: "Zara Retail Apparel", style: "Casual Linen Shirt", targetDate: "12-10-2026", delayDays: bucketName === ">20" ? "24 Days" : "4 Days", status: "Delayed" },
                { orderNo: "SO/9B/2627/002", buyer: "H&M Sourcing Hub", style: "Ladies Denim Jeans", targetDate: "08-10-2026", delayDays: bucketName === ">20" ? "28 Days" : "8 Days", status: "Critical" },
                { orderNo: "SO/9B/2627/003", buyer: "Marks & Spencer PLC", style: "Classic Oxford Cotton", targetDate: "02-10-2026", delayDays: bucketName === ">20" ? "34 Days" : "14 Days", status: "Escalated" }
            ]
        });
    };

    return (
        <div className="tna-page">
            {/* Title */}
            <h1 className="tna-title">Task Delay Analysis Report</h1>

            {/* As on date filter */}
            <div className="tna-date-filter-group">
                <label className="tna-date-label">As on date</label>
                <div className="tna-date-input-wrap">
                    <input
                        type="text"
                        value={asOnDate}
                        onChange={(e) => setAsOnDate(e.target.value)}
                        className="tna-date-input"
                    />
                    <FaCalendarAlt style={{ color: "#64748b", fontSize: "12px", cursor: "pointer" }} />
                </div>
            </div>

            {/* Toolbar */}
            <div className="tna-toolbar">
                <div className="tna-icon-group">
                    <button
                        type="button"
                        className="tna-icon-btn"
                        title="Reload"
                        onClick={() => {
                            setSearchTask("");
                            setBuyerFilter("All");
                            setTasks(TASK_DELAY_DATA);
                        }}
                    >
                        <FaSyncAlt />
                    </button>
                    <button
                        type="button"
                        className="tna-icon-btn"
                        title="Settings"
                        onClick={() => alert("Task Delay preferences")}
                    >
                        <FaCog />
                    </button>
                    <button
                        type="button"
                        className="tna-icon-btn"
                        title="Export PDF / Print"
                        onClick={() => alert("Exporting Task Delay Analysis PDF")}
                    >
                        <FaFilePdf style={{ color: "#dc2626" }} />
                    </button>
                    <button
                        type="button"
                        className="tna-icon-btn"
                        title="Export Excel"
                        onClick={() => alert("Exporting Task Delay Analysis Excel")}
                    >
                        <FaFileExcel style={{ color: "#16a34a" }} />
                    </button>
                </div>

                {/* Filter button with caret */}
                <button
                    type="button"
                    className={`tna-filter-btn ${filterOpen ? "active" : ""}`}
                    onClick={() => setFilterOpen(!filterOpen)}
                >
                    <FaFilter style={{ fontSize: "11px" }} />
                    <span>Filter</span>
                    <FaCaretDown style={{ fontSize: "11px", marginLeft: "2px" }} />
                </button>

                {/* Filter Flyout Drawer */}
                {filterOpen && (
                    <div className="tna-filter-popup" ref={filterRef}>
                        <div className="tna-popup-field">
                            <label className="tna-popup-label">Search Task</label>
                            <input
                                type="text"
                                placeholder="Filter by task name..."
                                value={searchTask}
                                onChange={(e) => setSearchTask(e.target.value)}
                                className="tna-popup-input"
                            />
                        </div>
                        <div className="tna-popup-field">
                            <label className="tna-popup-label">Buyer / Customer</label>
                            <select
                                value={buyerFilter}
                                onChange={(e) => setBuyerFilter(e.target.value)}
                                className="tna-popup-select"
                            >
                                <option value="All">All Buyers</option>
                                <option value="Zara">Zara Retail Apparel</option>
                                <option value="HM">H&M Sourcing Hub</option>
                                <option value="MS">Marks & Spencer PLC</option>
                            </select>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px", marginTop: "10px" }}>
                            <button
                                type="button"
                                style={{ padding: "3px 8px", fontSize: "11.5px", border: "1px solid #cbd5e1", background: "#ffffff", borderRadius: "2px", cursor: "pointer" }}
                                onClick={() => {
                                    setSearchTask("");
                                    setBuyerFilter("All");
                                }}
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                style={{ padding: "3px 10px", fontSize: "11.5px", background: "#337ab7", color: "#ffffff", border: "none", borderRadius: "2px", cursor: "pointer" }}
                                onClick={() => setFilterOpen(false)}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="tna-table-wrap">
                <table className="tna-table">
                    <thead>
                        <tr>
                            <th style={{ width: "42%", textAlign: "left" }}>Task Name</th>
                            <th style={{ width: "11%", textAlign: "center" }}>Not yet due</th>
                            <th style={{ width: "11%", textAlign: "center" }}>0-5</th>
                            <th style={{ width: "11%", textAlign: "center" }}>6-10</th>
                            <th style={{ width: "11%", textAlign: "center" }}>11-20</th>
                            <th style={{ width: "14%", textAlign: "center" }}>&gt;20</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map(row => (
                            <tr key={row.id}>
                                <td>
                                    <span
                                        className="tna-task-link"
                                        onClick={() => handleCellClick(row, "All Delays", row.d0_5 + row.d6_10 + row.d11_20 + row.dAbove20)}
                                    >
                                        {row.taskName}
                                    </span>
                                </td>
                                <td className="tna-count-cell">
                                    <span className={row.notYetDue === 0 ? "tna-count-zero" : "tna-count-val"}>
                                        {row.notYetDue}
                                    </span>
                                </td>
                                <td className="tna-count-cell">
                                    <span
                                        className={row.d0_5 === 0 ? "tna-count-zero" : "tna-count-val"}
                                        onClick={() => handleCellClick(row, "0-5 days", row.d0_5)}
                                    >
                                        {row.d0_5}
                                    </span>
                                </td>
                                <td className="tna-count-cell">
                                    <span
                                        className={row.d6_10 === 0 ? "tna-count-zero" : "tna-count-val"}
                                        onClick={() => handleCellClick(row, "6-10 days", row.d6_10)}
                                    >
                                        {row.d6_10}
                                    </span>
                                </td>
                                <td className="tna-count-cell">
                                    <span
                                        className={row.d11_20 === 0 ? "tna-count-zero" : "tna-count-val"}
                                        onClick={() => handleCellClick(row, "11-20 days", row.d11_20)}
                                    >
                                        {row.d11_20}
                                    </span>
                                </td>
                                <td className="tna-count-cell">
                                    <span
                                        className={row.dAbove20 === 0 ? "tna-count-zero" : "tna-count-val"}
                                        onClick={() => handleCellClick(row, ">20 days", row.dAbove20)}
                                    >
                                        {row.dAbove20}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Drilldown Detail Modal */}
            {drillDown && (
                <div className="tna-modal-overlay" onClick={() => setDrillDown(null)}>
                    <div className="tna-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="tna-modal-header">
                            <div>
                                <span style={{ fontSize: "11px", opacity: 0.85, textTransform: "uppercase" }}>T&amp;A Delay Breakdown</span>
                                <h5 style={{ margin: "2px 0 0 0", fontWeight: 600 }}>{drillDown.taskName}</h5>
                            </div>
                            <button
                                type="button"
                                style={{ background: "none", border: "none", color: "#ffffff", fontSize: "16px", cursor: "pointer" }}
                                onClick={() => setDrillDown(null)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="tna-modal-body">
                            <div style={{ marginBottom: "12px", fontSize: "12.5px", color: "#475569" }}>
                                Showing orders in delay bucket: <strong>{drillDown.bucket}</strong> (Total {drillDown.count} orders delayed)
                            </div>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                                <thead>
                                    <tr style={{ background: "#f1f5fb", borderBottom: "1px solid #cbd5e1", textAlign: "left" }}>
                                        <th style={{ padding: "6px 8px" }}>Order No</th>
                                        <th style={{ padding: "6px 8px" }}>Buyer</th>
                                        <th style={{ padding: "6px 8px" }}>Style</th>
                                        <th style={{ padding: "6px 8px" }}>Due Date</th>
                                        <th style={{ padding: "6px 8px" }}>Delay</th>
                                        <th style={{ padding: "6px 8px" }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {drillDown.orders.map((ord, i) => (
                                        <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <td style={{ padding: "6px 8px", fontWeight: 600, color: "#337ab7" }}>{ord.orderNo}</td>
                                            <td style={{ padding: "6px 8px" }}>{ord.buyer}</td>
                                            <td style={{ padding: "6px 8px" }}>{ord.style}</td>
                                            <td style={{ padding: "6px 8px" }}>{ord.targetDate}</td>
                                            <td style={{ padding: "6px 8px", color: "#dc2626", fontWeight: 600 }}>{ord.delayDays}</td>
                                            <td style={{ padding: "6px 8px" }}>
                                                <span style={{ background: "#fee2e2", color: "#991b1b", padding: "1px 6px", borderRadius: "3px", fontSize: "11px" }}>
                                                    {ord.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="tna-modal-footer">
                            <button
                                type="button"
                                style={{ padding: "4px 14px", fontSize: "12px", border: "1px solid #cbd5e1", background: "#ffffff", borderRadius: "3px", cursor: "pointer" }}
                                onClick={() => setDrillDown(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
