import React, { useState, useEffect, useMemo, useRef } from "react";
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
    FaCheck
} from "react-icons/fa";
import {
    getItemRequisitions,
    createItemRequisition,
    updateItemRequisition,
    deleteItemRequisition,
    INITIAL_ITEM_REQUISITIONS
} from "../../../services/itemRequisitionService";
import "../../../styles/itemRequisition.css";

export default function ItemRequisitions() {
    const [records, setRecords] = useState(INITIAL_ITEM_REQUISITIONS);
    const [loading, setLoading] = useState(false);
    const [searchAssociate, setSearchAssociate] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedRowId, setSelectedRowId] = useState(1);
    const [openActionId, setOpenActionId] = useState(null);
    const [showFilterBar, setShowFilterBar] = useState(false);
    const [viewDensity, setViewDensity] = useState("normal"); // "normal" or "compact"

    // Filter drawer state
    const [filterDepartment, setFilterDepartment] = useState("All");
    const [filterWarehouse, setFilterWarehouse] = useState("All");
    const [filterReqBy, setFilterReqBy] = useState("");
    const [filterTransporter, setFilterTransporter] = useState("All");

    // Modals
    const [showNewModal, setShowNewModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [activeRecord, setActiveRecord] = useState(null);

    const actionMenuRef = useRef(null);

    // Standard dropdown master lists
    const WAREHOUSES = [
        "RAW MATERIAL STORE 9B",
        "SEMI FINISH STORE 9B",
        "SEMI FINISH STORE 18",
        "RAW MATERIAL STORE 30",
        "STORE 30",
        "FINISHED GOODS STORE"
    ];

    const DEPARTMENTS = [
        "Sampling Dept",
        "Cutting Dept",
        "Stitching Floor",
        "Finishing Dept",
        "Packaging",
        "Quality Control"
    ];

    const TRANSPORTERS = [
        "In-House Transfer",
        "Self",
        "Blue Dart Logistics",
        "ARC Logistics",
        "V-Trans"
    ];

    const ASSOCIATES = [
        "Apex Leather Works",
        "Balaji Trims & Fasteners",
        "Supreme Leathercraft",
        "K-Tex Textiles",
        "Classic Threads & Zips",
        "Rainbow Printers & Dyers"
    ];

    // Form state for New Requisition
    const [newForm, setNewForm] = useState({
        ReqNo: `REQ/AAPL9B/2627/${records.length + 46}`,
        IssueNo: "",
        ReqDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        Associate: "Apex Leather Works",
        Warehouse: "RAW MATERIAL STORE 9B",
        Remark: "",
        InternalMemo: "",
        Department: "Sampling Dept",
        Transporter: "In-House Transfer",
        ReqBy: "Nikhil Singh",
        Status: "Pending",
        items: [
            {
                ItemCode: "LTH-1093",
                ItemName: "COW CULATTAS SINGLE LEATHER",
                Color: "BLACK",
                Quantity: 100,
                UOM: "SQFT",
                RequiredDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
                Remarks: "Sample batch cutting"
            }
        ]
    });

    // Form state for Edit Requisition
    const [editForm, setEditForm] = useState(null);

    // Load Data
    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getItemRequisitions({
                search: searchAssociate,
                associate: searchAssociate,
                status: statusFilter,
                department: filterDepartment,
                warehouse: filterWarehouse
            });
            if (Array.isArray(data) && data.length > 0) {
                setRecords(data);
            }
        } catch (e) {
            console.warn("Using fallback item requisitions:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Close action popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
                setOpenActionId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filtered data in memory for instantaneous search and filter responses
    const filteredRecords = useMemo(() => {
        return records.filter((item) => {
            if (searchAssociate.trim()) {
                const term = searchAssociate.trim().toLowerCase();
                const matchAssoc = String(item.Associate || "").toLowerCase().includes(term);
                const matchReqNo = String(item.ReqNo || "").toLowerCase().includes(term);
                const matchIssueNo = String(item.IssueNo || "").toLowerCase().includes(term);
                const matchRemark = String(item.Remark || "").toLowerCase().includes(term);
                const matchReqBy = String(item.ReqBy || "").toLowerCase().includes(term);
                const matchDept = String(item.Department || "").toLowerCase().includes(term);
                if (!matchAssoc && !matchReqNo && !matchIssueNo && !matchRemark && !matchReqBy && !matchDept) {
                    return false;
                }
            }

            if (statusFilter !== "All" && item.Status !== statusFilter) {
                return false;
            }

            if (filterDepartment !== "All" && item.Department !== filterDepartment) {
                return false;
            }

            if (filterWarehouse !== "All" && item.Warehouse !== filterWarehouse) {
                return false;
            }

            if (filterTransporter !== "All" && item.Transporter !== filterTransporter) {
                return false;
            }

            if (filterReqBy.trim() && !String(item.ReqBy || "").toLowerCase().includes(filterReqBy.toLowerCase())) {
                return false;
            }

            return true;
        });
    }, [records, searchAssociate, statusFilter, filterDepartment, filterWarehouse, filterTransporter, filterReqBy]);

    // Add item row in New Form
    const handleAddRow = () => {
        setNewForm((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    ItemCode: "",
                    ItemName: "",
                    Color: "",
                    Quantity: 1,
                    UOM: "PCS",
                    RequiredDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
                    Remarks: ""
                }
            ]
        }));
    };

    const handleRemoveRow = (index) => {
        if (newForm.items.length <= 1) return;
        setNewForm((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleItemChange = (index, field, value) => {
        setNewForm((prev) => {
            const nextItems = [...prev.items];
            nextItems[index] = { ...nextItems[index], [field]: value };
            return { ...prev, items: nextItems };
        });
    };

    // Save New Requisition
    const handleSaveNew = async (e) => {
        e.preventDefault();
        const totalQty = newForm.items.reduce((s, it) => s + Number(it.Quantity || 0), 0);
        const payload = {
            ReqNo: newForm.ReqNo,
            IssueNo: newForm.IssueNo || "",
            ReqDate: newForm.ReqDate,
            Associate: newForm.Associate,
            Warehouse: newForm.Warehouse,
            Remark: newForm.Remark,
            InternalMemo: newForm.InternalMemo,
            Department: newForm.Department,
            Transporter: newForm.Transporter,
            ReqBy: newForm.ReqBy,
            EntryOn: new Date().toLocaleString(),
            Status: newForm.Status || "Pending",
            EntryBy: "Admin",
            UpdatedBy: "",
            TotalQty: totalQty,
            RowCount: Math.max(newForm.items.length, 1),
            details: newForm.items
        };

        try {
            await createItemRequisition(payload);
        } catch (err) {
            console.warn("Backend save failed, saved locally:", err);
        }

        const newRecord = {
            ...payload,
            RequisitionID: Date.now()
        };

        setRecords((prev) => [newRecord, ...prev]);
        setShowNewModal(false);

        // Reset new form with next sequential requisition number
        setNewForm({
            ReqNo: `REQ/AAPL9B/2627/${records.length + 47}`,
            IssueNo: "",
            ReqDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
            Associate: "Apex Leather Works",
            Warehouse: "RAW MATERIAL STORE 9B",
            Remark: "",
            InternalMemo: "",
            Department: "Sampling Dept",
            Transporter: "In-House Transfer",
            ReqBy: "Nikhil Singh",
            Status: "Pending",
            items: [
                {
                    ItemCode: "LTH-1093",
                    ItemName: "COW CULATTAS SINGLE LEATHER",
                    Color: "BLACK",
                    Quantity: 100,
                    UOM: "SQFT",
                    RequiredDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
                    Remarks: ""
                }
            ]
        });
    };

    // Handle Edit Click
    const handleOpenEdit = (rec) => {
        setEditForm({
            ...rec,
            items: rec.details && rec.details.length > 0 ? [...rec.details] : [
                {
                    ItemCode: "ITEM-001",
                    ItemName: "General Item Requisition",
                    Color: "STD",
                    Quantity: rec.TotalQty || 1,
                    UOM: "PCS",
                    RequiredDate: rec.ReqDate,
                    Remarks: rec.Remark || ""
                }
            ]
        });
        setShowEditModal(true);
        setOpenActionId(null);
    };

    // Save Edit
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editForm) return;
        const totalQty = editForm.items.reduce((s, it) => s + Number(it.Quantity || 0), 0);
        const updated = {
            ...editForm,
            TotalQty: totalQty,
            RowCount: Math.max(editForm.items.length, 1),
            UpdatedBy: "Admin",
            details: editForm.items
        };

        try {
            await updateItemRequisition(editForm.RequisitionID, updated);
        } catch (err) {
            console.warn("Backend update failed, updated locally:", err);
        }

        setRecords((prev) =>
            prev.map((r) => (r.RequisitionID === editForm.RequisitionID ? updated : r))
        );
        setShowEditModal(false);
    };

    // Delete Requisition
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this Item Requisition Note?")) {
            return;
        }
        try {
            await deleteItemRequisition(id);
        } catch (e) {
            console.warn("Backend delete error, deleted locally:", e);
        }
        setRecords((prev) => prev.filter((r) => r.RequisitionID !== id));
        setOpenActionId(null);
    };

    // View Details
    const handleOpenDetail = (rec) => {
        setActiveRecord(rec);
        setShowDetailModal(true);
        setOpenActionId(null);
    };

    // Print Requisition Note
    const handlePrint = (rec) => {
        const printWindow = window.open("", "_blank", "width=900,height=700");
        const details = rec.details || [
            {
                ItemCode: "ITEM-001",
                ItemName: "General Materials",
                Color: "STD",
                Quantity: rec.TotalQty,
                UOM: "PCS",
                Remarks: rec.Remark
            }
        ];

        printWindow.document.write(`
            <html>
                <head>
                    <title>Item Requisition Note - ${rec.ReqNo}</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 25px; color: #1e293b; }
                        .print-header { text-align: center; border-bottom: 2px solid #2172ba; padding-bottom: 12px; margin-bottom: 20px; }
                        .company-name { font-size: 20px; font-weight: bold; color: #1a5695; }
                        .company-sub { font-size: 13px; color: #64748b; margin-top: 3px; }
                        .doc-title { font-size: 17px; font-weight: 600; margin-top: 10px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; }
                        .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; font-size: 12.5px; }
                        .meta-item { display: flex; }
                        .meta-label { width: 150px; font-weight: 600; color: #475569; }
                        .meta-value { flex: 1; color: #0f172a; }
                        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
                        th { background-color: #2172ba; color: #ffffff; padding: 7px 10px; border: 1px solid #cbd5e1; text-align: left; }
                        td { padding: 6px 10px; border: 1px solid #cbd5e1; }
                        .signatures { margin-top: 60px; display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; padding: 0 20px; }
                    </style>
                </head>
                <body>
                    <div class="print-header">
                        <div class="company-name">V-CONNECT INC.</div>
                        <div class="company-sub">Plot No. 9B | Financial Year 2026 - 2027</div>
                        <div class="doc-title">Item Requisition Note</div>
                    </div>

                    <div class="meta-grid">
                        <div class="meta-item"><span class="meta-label">Requisition No:</span><span class="meta-value">${rec.ReqNo || "-"}</span></div>
                        <div class="meta-item"><span class="meta-label">Date:</span><span class="meta-value">${rec.ReqDate || "-"}</span></div>
                        <div class="meta-item"><span class="meta-label">Issue No:</span><span class="meta-value">${rec.IssueNo || "-"}</span></div>
                        <div class="meta-item"><span class="meta-label">Status:</span><span class="meta-value">${rec.Status || "-"}</span></div>
                        <div class="meta-item"><span class="meta-label">Associate:</span><span class="meta-value">${rec.Associate || "-"}</span></div>
                        <div class="meta-item"><span class="meta-label">Department:</span><span class="meta-value">${rec.Department || "-"}</span></div>
                        <div class="meta-item"><span class="meta-label">Warehouse:</span><span class="meta-value">${rec.Warehouse || "-"}</span></div>
                        <div class="meta-item"><span class="meta-label">Requested By:</span><span class="meta-value">${rec.ReqBy || "-"}</span></div>
                        <div class="meta-item"><span class="meta-label">Transporter:</span><span class="meta-value">${rec.Transporter || "-"}</span></div>
                        <div class="meta-item"><span class="meta-label">Remarks:</span><span class="meta-value">${rec.Remark || "-"}</span></div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Item Code</th>
                                <th>Item Name</th>
                                <th>Color</th>
                                <th>UOM</th>
                                <th style="text-align: right;">Quantity</th>
                                <th>Required Date</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${details.map((d, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${d.ItemCode || "-"}</td>
                                    <td>${d.ItemName || "-"}</td>
                                    <td>${d.Color || "-"}</td>
                                    <td>${d.UOM || "PCS"}</td>
                                    <td style="text-align: right;">${Number(d.Quantity || 0).toFixed(2)}</td>
                                    <td>${d.RequiredDate || rec.ReqDate}</td>
                                    <td>${d.Remarks || "-"}</td>
                                </tr>
                            `).join("")}
                            <tr style="font-weight: bold; background: #f8fafc;">
                                <td colspan="5" style="text-align: right;">Total Quantity:</td>
                                <td style="text-align: right;">${Number(rec.TotalQty || 0).toFixed(2)}</td>
                                <td colspan="2"></td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="signatures">
                        <div>Requested By: _________________</div>
                        <div>Department Head: _________________</div>
                        <div>Store Incharge: _________________</div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 350);
        setOpenActionId(null);
    };

    // Calculate empty rows to fill grid to 14 rows minimum (matching the screenshot's empty grid appearance)
    const emptyRowCount = Math.max(0, 14 - filteredRecords.length);

    return (
        <div className="item-requisition-page">
            {/* PAGE TITLE */}
            <h1 className="ir-page-title">Item Requisiton Note</h1>

            {/* TOP CRITERIA / SEARCH & NEW BUTTON */}
            <div className="ir-top-row">
                <div className="ir-criteria-group">
                    <div className="ir-field-item">
                        <label className="ir-field-label">Associate</label>
                        <input
                            type="text"
                            className="ir-search-input"
                            placeholder="Supplier Search..."
                            value={searchAssociate}
                            onChange={(e) => setSearchAssociate(e.target.value)}
                        />
                    </div>

                    <div className="ir-field-item">
                        <label className="ir-field-label">Status</label>
                        <select
                            className="ir-status-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Issued">Issued</option>
                            <option value="Completed">Completed</option>
                            <option value="Draft">Draft</option>
                        </select>
                    </div>
                </div>

                <button
                    type="button"
                    className="ir-btn-new"
                    onClick={() => setShowNewModal(true)}
                >
                    <FaPlus /> New Item Requisition Note
                </button>
            </div>

            {/* TOOLBAR ROW (Refresh, List, Settings, Filter) */}
            <div className="ir-toolbar-row">
                <div className="ir-toolbar-actions">
                    <button
                        type="button"
                        className="ir-tool-btn"
                        title="Reload"
                        onClick={loadData}
                    >
                        <FaSyncAlt />
                    </button>

                    <button
                        type="button"
                        className="ir-tool-btn"
                        title="Toggle Density"
                        onClick={() => setViewDensity((prev) => (prev === "normal" ? "compact" : "normal"))}
                    >
                        <FaBars />
                    </button>

                    <button
                        type="button"
                        className="ir-tool-btn"
                        title="Settings"
                        onClick={() => alert("Columns configured per V-CONNECT INC. Item Requisition standard.")}
                    >
                        <FaCog />
                    </button>

                    <button
                        type="button"
                        className={`ir-tool-btn ir-tool-btn-filter ${showFilterBar ? "active" : ""}`}
                        onClick={() => setShowFilterBar((prev) => !prev)}
                    >
                        <FaFilter /> Filter <FaCaretDown />
                    </button>
                </div>
            </div>

            {/* EXPANDABLE FILTER DRAWER */}
            {showFilterBar && (
                <div className="ir-filter-card">
                    <div className="ir-filter-item">
                        <label className="ir-filter-label">Department</label>
                        <select
                            className="ir-filter-select"
                            value={filterDepartment}
                            onChange={(e) => setFilterDepartment(e.target.value)}
                        >
                            <option value="All">All Departments</option>
                            {DEPARTMENTS.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <div className="ir-filter-item">
                        <label className="ir-filter-label">Warehouse</label>
                        <select
                            className="ir-filter-select"
                            value={filterWarehouse}
                            onChange={(e) => setFilterWarehouse(e.target.value)}
                        >
                            <option value="All">All Warehouses</option>
                            {WAREHOUSES.map((w) => (
                                <option key={w} value={w}>{w}</option>
                            ))}
                        </select>
                    </div>

                    <div className="ir-filter-item">
                        <label className="ir-filter-label">Transporter</label>
                        <select
                            className="ir-filter-select"
                            value={filterTransporter}
                            onChange={(e) => setFilterTransporter(e.target.value)}
                        >
                            <option value="All">All Transporters</option>
                            {TRANSPORTERS.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="ir-filter-item">
                        <label className="ir-filter-label">Requested By</label>
                        <input
                            type="text"
                            className="ir-filter-input"
                            placeholder="Filter by Name..."
                            value={filterReqBy}
                            onChange={(e) => setFilterReqBy(e.target.value)}
                        />
                    </div>

                    <button
                        type="button"
                        className="ir-filter-btn-reset"
                        onClick={() => {
                            setFilterDepartment("All");
                            setFilterWarehouse("All");
                            setFilterTransporter("All");
                            setFilterReqBy("");
                        }}
                    >
                        Reset Filters
                    </button>
                </div>
            )}

            {/* DATA TABLE (17 Columns matching the screenshot exactly) */}
            <div className="ir-table-container">
                <table className="ir-table">
                    <thead>
                        <tr>
                            <th className="th-center" style={{ width: "75px" }}>Action</th>
                            <th>Issue No</th>
                            <th>Req No</th>
                            <th>Date</th>
                            <th>Associate</th>
                            <th>Warehouse</th>
                            <th>Remark</th>
                            <th>Memo for internal use</th>
                            <th>Department</th>
                            <th>Transporter</th>
                            <th>Req By</th>
                            <th>Entry On</th>
                            <th className="th-center">Status</th>
                            <th>Entry By</th>
                            <th>Updated By</th>
                            <th className="th-right">Qty</th>
                            <th className="th-center">No. of rows</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.map((item) => {
                            const isSelected = selectedRowId === item.RequisitionID;
                            const isMenuOpen = openActionId === item.RequisitionID;
                            const statusLower = String(item.Status || "pending").toLowerCase();

                            return (
                                <tr
                                    key={item.RequisitionID || item.ReqNo}
                                    className={isSelected ? "row-selected" : ""}
                                    onClick={() => setSelectedRowId(item.RequisitionID)}
                                    style={{
                                        fontSize: viewDensity === "compact" ? "11px" : "12px",
                                        lineHeight: viewDensity === "compact" ? "1.2" : "1.5"
                                    }}
                                >
                                    {/* 1. Action */}
                                    <td className="ir-action-cell" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            type="button"
                                            className="ir-action-btn"
                                            onClick={() => setOpenActionId((prev) => (prev === item.RequisitionID ? null : item.RequisitionID))}
                                        >
                                            Select <FaCaretDown />
                                        </button>

                                        {isMenuOpen && (
                                            <div className="ir-action-menu" ref={actionMenuRef}>
                                                <div
                                                    className="ir-action-menu-item"
                                                    onClick={() => handleOpenDetail(item)}
                                                >
                                                    <FaEye color="#2172ba" /> View
                                                </div>
                                                <div
                                                    className="ir-action-menu-item"
                                                    onClick={() => handleOpenEdit(item)}
                                                >
                                                    <FaEdit color="#f59e0b" /> Edit
                                                </div>
                                                <div
                                                    className="ir-action-menu-item"
                                                    onClick={() => handlePrint(item)}
                                                >
                                                    <FaPrint color="#475569" /> Print
                                                </div>
                                                <div
                                                    className="ir-action-menu-item danger"
                                                    onClick={() => handleDelete(item.RequisitionID)}
                                                >
                                                    <FaTrash color="#ef4444" /> Delete
                                                </div>
                                            </div>
                                        )}
                                    </td>

                                    {/* 2. Issue No */}
                                    <td>{item.IssueNo || "-"}</td>

                                    {/* 3. Req No */}
                                    <td style={{ fontWeight: 600, color: "#1a5695" }}>{item.ReqNo}</td>

                                    {/* 4. Date */}
                                    <td>{item.ReqDate || "-"}</td>

                                    {/* 5. Associate */}
                                    <td style={{ fontWeight: 500 }}>{item.Associate || "-"}</td>

                                    {/* 6. Warehouse */}
                                    <td>{item.Warehouse || "-"}</td>

                                    {/* 7. Remark */}
                                    <td>{item.Remark || "-"}</td>

                                    {/* 8. Memo for internal use */}
                                    <td>{item.InternalMemo || "-"}</td>

                                    {/* 9. Department */}
                                    <td>{item.Department || "-"}</td>

                                    {/* 10. Transporter */}
                                    <td>{item.Transporter || "-"}</td>

                                    {/* 11. Req By */}
                                    <td>{item.ReqBy || "-"}</td>

                                    {/* 12. Entry On */}
                                    <td>{item.EntryOn || "-"}</td>

                                    {/* 13. Status */}
                                    <td className="td-center">
                                        <span className={`ir-status-pill ${statusLower}`}>
                                            {item.Status || "Pending"}
                                        </span>
                                    </td>

                                    {/* 14. Entry By */}
                                    <td>{item.EntryBy || "Admin"}</td>

                                    {/* 15. Updated By */}
                                    <td>{item.UpdatedBy || "-"}</td>

                                    {/* 16. Qty */}
                                    <td className="td-right" style={{ fontWeight: 600 }}>
                                        {Number(item.TotalQty || 0).toFixed(2)}
                                    </td>

                                    {/* 17. No. of rows */}
                                    <td className="td-center">
                                        {item.RowCount || (item.details ? item.details.length : 1)}
                                    </td>
                                </tr>
                            );
                        })}

                        {/* Visual empty rows matching the ERP spreadsheet grid from the user's screenshot */}
                        {Array.from({ length: emptyRowCount }).map((_, idx) => (
                            <tr key={`empty-${idx}`} className="empty-grid-row">
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

            {/* ======================================================
               MODAL: NEW ITEM REQUISITION NOTE
               ====================================================== */}
            {showNewModal && (
                <div className="ir-modal-backdrop">
                    <div className="ir-modal-container">
                        <div className="ir-modal-header">
                            <h3>New Item Requisition Note</h3>
                            <button
                                type="button"
                                className="ir-modal-close-btn"
                                onClick={() => setShowNewModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSaveNew}>
                            <div className="ir-modal-body">
                                <div className="ir-form-grid">
                                    <div className="ir-form-group">
                                        <label className="ir-form-label">Requisition No *</label>
                                        <input
                                            type="text"
                                            className="ir-form-input"
                                            value={newForm.ReqNo}
                                            required
                                            onChange={(e) => setNewForm({ ...newForm, ReqNo: e.target.value })}
                                        />
                                    </div>

                                    <div className="ir-form-group">
                                        <label className="ir-form-label">Date *</label>
                                        <input
                                            type="text"
                                            className="ir-form-input"
                                            value={newForm.ReqDate}
                                            required
                                            onChange={(e) => setNewForm({ ...newForm, ReqDate: e.target.value })}
                                        />
                                    </div>

                                    <div className="ir-form-group">
                                        <label className="ir-form-label">Associate / Supplier</label>
                                        <input
                                            type="text"
                                            className="ir-form-input"
                                            list="associates-list"
                                            placeholder="Select or enter associate"
                                            value={newForm.Associate}
                                            onChange={(e) => setNewForm({ ...newForm, Associate: e.target.value })}
                                        />
                                        <datalist id="associates-list">
                                            {ASSOCIATES.map((a) => (
                                                <option key={a} value={a} />
                                            ))}
                                        </datalist>
                                    </div>

                                    <div className="ir-form-group">
                                        <label className="ir-form-label">Warehouse *</label>
                                        <select
                                            className="ir-form-select"
                                            value={newForm.Warehouse}
                                            onChange={(e) => setNewForm({ ...newForm, Warehouse: e.target.value })}
                                        >
                                            {WAREHOUSES.map((w) => (
                                                <option key={w} value={w}>{w}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="ir-form-group">
                                        <label className="ir-form-label">Department *</label>
                                        <select
                                            className="ir-form-select"
                                            value={newForm.Department}
                                            onChange={(e) => setNewForm({ ...newForm, Department: e.target.value })}
                                        >
                                            {DEPARTMENTS.map((d) => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="ir-form-group">
                                        <label className="ir-form-label">Requested By *</label>
                                        <input
                                            type="text"
                                            className="ir-form-input"
                                            value={newForm.ReqBy}
                                            required
                                            onChange={(e) => setNewForm({ ...newForm, ReqBy: e.target.value })}
                                        />
                                    </div>

                                    <div className="ir-form-group">
                                        <label className="ir-form-label">Transporter</label>
                                        <select
                                            className="ir-form-select"
                                            value={newForm.Transporter}
                                            onChange={(e) => setNewForm({ ...newForm, Transporter: e.target.value })}
                                        >
                                            {TRANSPORTERS.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="ir-form-group">
                                        <label className="ir-form-label">Issue No (Optional)</label>
                                        <input
                                            type="text"
                                            className="ir-form-input"
                                            placeholder="e.g. IS/AAPL9B/2627/..."
                                            value={newForm.IssueNo}
                                            onChange={(e) => setNewForm({ ...newForm, IssueNo: e.target.value })}
                                        />
                                    </div>

                                    <div className="ir-form-group">
                                        <label className="ir-form-label">Status</label>
                                        <select
                                            className="ir-form-select"
                                            value={newForm.Status}
                                            onChange={(e) => setNewForm({ ...newForm, Status: e.target.value })}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Draft">Draft</option>
                                            <option value="Issued">Issued</option>
                                        </select>
                                    </div>

                                    <div className="ir-form-group full-width">
                                        <label className="ir-form-label">Remark</label>
                                        <input
                                            type="text"
                                            className="ir-form-input"
                                            placeholder="Brief requisition description"
                                            value={newForm.Remark}
                                            onChange={(e) => setNewForm({ ...newForm, Remark: e.target.value })}
                                        />
                                    </div>

                                    <div className="ir-form-group full-width">
                                        <label className="ir-form-label">Memo for internal use</label>
                                        <textarea
                                            className="ir-form-textarea"
                                            placeholder="Internal notes or cross-department instructions"
                                            value={newForm.InternalMemo}
                                            onChange={(e) => setNewForm({ ...newForm, InternalMemo: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Items Breakdown Table */}
                                <div className="ir-modal-items-title">
                                    <span>Requisition Line Items</span>
                                    <button
                                        type="button"
                                        className="ir-btn-new"
                                        style={{ fontSize: "11px", padding: "3px 10px" }}
                                        onClick={handleAddRow}
                                    >
                                        <FaPlus /> Add Line Item
                                    </button>
                                </div>

                                <table className="ir-modal-items-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "30px" }}>#</th>
                                            <th style={{ width: "120px" }}>Item Code</th>
                                            <th>Item Name</th>
                                            <th style={{ width: "90px" }}>Color</th>
                                            <th style={{ width: "70px" }}>UOM</th>
                                            <th style={{ width: "80px" }}>Qty</th>
                                            <th style={{ width: "110px" }}>Req Date</th>
                                            <th>Remarks</th>
                                            <th style={{ width: "40px" }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {newForm.items.map((it, idx) => (
                                            <tr key={idx}>
                                                <td style={{ textAlign: "center" }}>{idx + 1}</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={it.ItemCode}
                                                        placeholder="Item Code"
                                                        onChange={(e) => handleItemChange(idx, "ItemCode", e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={it.ItemName}
                                                        placeholder="Item Description"
                                                        required
                                                        onChange={(e) => handleItemChange(idx, "ItemName", e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={it.Color}
                                                        placeholder="Color"
                                                        onChange={(e) => handleItemChange(idx, "Color", e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        value={it.UOM}
                                                        onChange={(e) => handleItemChange(idx, "UOM", e.target.value)}
                                                    >
                                                        <option value="PCS">PCS</option>
                                                        <option value="MTR">MTR</option>
                                                        <option value="SQFT">SQFT</option>
                                                        <option value="KGS">KGS</option>
                                                        <option value="SET">SET</option>
                                                        <option value="SPOOL">SPOOL</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={it.Quantity}
                                                        required
                                                        onChange={(e) => handleItemChange(idx, "Quantity", e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={it.RequiredDate}
                                                        onChange={(e) => handleItemChange(idx, "RequiredDate", e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={it.Remarks}
                                                        placeholder="Line item note"
                                                        onChange={(e) => handleItemChange(idx, "Remarks", e.target.value)}
                                                    />
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    {newForm.items.length > 1 && (
                                                        <button
                                                            type="button"
                                                            style={{ border: "none", background: "none", color: "#ef4444", cursor: "pointer" }}
                                                            onClick={() => handleRemoveRow(idx)}
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="ir-modal-footer">
                                <button
                                    type="button"
                                    className="ir-btn-cancel"
                                    onClick={() => setShowNewModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="ir-btn-save">
                                    <FaCheck /> Save Requisition Note
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ======================================================
               MODAL: VIEW DETAILS
               ====================================================== */}
            {showDetailModal && activeRecord && (
                <div className="ir-modal-backdrop">
                    <div className="ir-modal-container">
                        <div className="ir-modal-header">
                            <h3>Item Requisition Note: {activeRecord.ReqNo}</h3>
                            <button
                                type="button"
                                className="ir-modal-close-btn"
                                onClick={() => setShowDetailModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="ir-modal-body">
                            <div className="ir-form-grid" style={{ marginBottom: "12px" }}>
                                <div><strong>Issue No:</strong> {activeRecord.IssueNo || "-"}</div>
                                <div><strong>Req Date:</strong> {activeRecord.ReqDate || "-"}</div>
                                <div><strong>Associate:</strong> {activeRecord.Associate || "-"}</div>
                                <div><strong>Warehouse:</strong> {activeRecord.Warehouse || "-"}</div>
                                <div><strong>Department:</strong> {activeRecord.Department || "-"}</div>
                                <div><strong>Requested By:</strong> {activeRecord.ReqBy || "-"}</div>
                                <div><strong>Transporter:</strong> {activeRecord.Transporter || "-"}</div>
                                <div><strong>Status:</strong> <span className={`ir-status-pill ${String(activeRecord.Status).toLowerCase()}`}>{activeRecord.Status}</span></div>
                                <div><strong>Total Qty:</strong> {Number(activeRecord.TotalQty || 0).toFixed(2)}</div>
                                <div style={{ gridColumn: "1 / -1" }}><strong>Remark:</strong> {activeRecord.Remark || "-"}</div>
                                <div style={{ gridColumn: "1 / -1" }}><strong>Internal Memo:</strong> {activeRecord.InternalMemo || "-"}</div>
                            </div>

                            <div className="ir-modal-items-title">Item Details</div>
                            <table className="ir-modal-items-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Item Code</th>
                                        <th>Item Name</th>
                                        <th>Color</th>
                                        <th>UOM</th>
                                        <th style={{ textAlign: "right" }}>Quantity</th>
                                        <th>Required Date</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(activeRecord.details || [
                                        {
                                            ItemCode: "ITEM-GEN",
                                            ItemName: "Assorted Materials",
                                            Color: "-",
                                            Quantity: activeRecord.TotalQty,
                                            UOM: "PCS",
                                            RequiredDate: activeRecord.ReqDate,
                                            Remarks: activeRecord.Remark
                                        }
                                    ]).map((d, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{d.ItemCode || "-"}</td>
                                            <td>{d.ItemName || "-"}</td>
                                            <td>{d.Color || "-"}</td>
                                            <td>{d.UOM || "PCS"}</td>
                                            <td style={{ textAlign: "right", fontWeight: 600 }}>{Number(d.Quantity || 0).toFixed(2)}</td>
                                            <td>{d.RequiredDate || activeRecord.ReqDate}</td>
                                            <td>{d.Remarks || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="ir-modal-footer">
                            <button
                                type="button"
                                className="ir-btn-cancel"
                                onClick={() => handlePrint(activeRecord)}
                            >
                                <FaPrint /> Print Note
                            </button>
                            <button
                                type="button"
                                className="ir-btn-save"
                                onClick={() => setShowDetailModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================
               MODAL: EDIT ITEM REQUISITION
               ====================================================== */}
            {showEditModal && editForm && (
                <div className="ir-modal-backdrop">
                    <div className="ir-modal-container">
                        <div className="ir-modal-header">
                            <h3>Edit Item Requisition Note: {editForm.ReqNo}</h3>
                            <button
                                type="button"
                                className="ir-modal-close-btn"
                                onClick={() => setShowEditModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit}>
                            <div className="ir-modal-body">
                                <div className="ir-form-grid">
                                    <div className="ir-form-group">
                                        <label className="ir-form-label">Requisition No</label>
                                        <input
                                            type="text"
                                            className="ir-form-input"
                                            disabled
                                            value={editForm.ReqNo}
                                        />
                                    </div>

                                    <div className="ir-form-group">
                                        <label className="ir-form-label">Date</label>
                                        <input
                                            type="text"
                                            className="ir-form-input"
                                            value={editForm.ReqDate}
                                            onChange={(e) => setEditForm({ ...editForm, ReqDate: e.target.value })}
                                        />
                                    </div>

                                    <div className="ir-form-group">
                                        <label className="ir-form-label">Associate</label>
                                        <input
                                            type="text"
                                            className="ir-form-input"
                                            value={editForm.Associate}
                                            onChange={(e) => setEditForm({ ...editForm, Associate: e.target.value })}
                                        />
                                    </div>

                                    <div className="ir-form-group">
                                        <label className="ir-form-label">Warehouse</label>
                                        <select
                                            className="ir-form-select"
                                            value={editForm.Warehouse}
                                            onChange={(e) => setEditForm({ ...editForm, Warehouse: e.target.value })}
                                        >
                                            {WAREHOUSES.map((w) => (
                                                <option key={w} value={w}>{w}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="ir-form-group">
                                        <label className="ir-form-label">Department</label>
                                        <select
                                            className="ir-form-select"
                                            value={editForm.Department}
                                            onChange={(e) => setEditForm({ ...editForm, Department: e.target.value })}
                                        >
                                            {DEPARTMENTS.map((d) => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="ir-form-group">
                                        <label className="ir-form-label">Requested By</label>
                                        <input
                                            type="text"
                                            className="ir-form-input"
                                            value={editForm.ReqBy}
                                            onChange={(e) => setEditForm({ ...editForm, ReqBy: e.target.value })}
                                        />
                                    </div>

                                    <div className="ir-form-group">
                                        <label className="ir-form-label">Issue No</label>
                                        <input
                                            type="text"
                                            className="ir-form-input"
                                            value={editForm.IssueNo}
                                            onChange={(e) => setEditForm({ ...editForm, IssueNo: e.target.value })}
                                        />
                                    </div>

                                    <div className="ir-form-group">
                                        <label className="ir-form-label">Status</label>
                                        <select
                                            className="ir-form-select"
                                            value={editForm.Status}
                                            onChange={(e) => setEditForm({ ...editForm, Status: e.target.value })}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Issued">Issued</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Draft">Draft</option>
                                        </select>
                                    </div>

                                    <div className="ir-form-group full-width">
                                        <label className="ir-form-label">Remark</label>
                                        <input
                                            type="text"
                                            className="ir-form-input"
                                            value={editForm.Remark}
                                            onChange={(e) => setEditForm({ ...editForm, Remark: e.target.value })}
                                        />
                                    </div>

                                    <div className="ir-form-group full-width">
                                        <label className="ir-form-label">Memo for internal use</label>
                                        <textarea
                                            className="ir-form-textarea"
                                            value={editForm.InternalMemo}
                                            onChange={(e) => setEditForm({ ...editForm, InternalMemo: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="ir-modal-footer">
                                <button
                                    type="button"
                                    className="ir-btn-cancel"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="ir-btn-save">
                                    <FaCheck /> Update Requisition
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
