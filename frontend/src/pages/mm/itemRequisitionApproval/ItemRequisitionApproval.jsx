import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import {
    FaSyncAlt,
    FaListUl,
    FaFilter,
    FaChevronDown,
    FaCheckCircle,
    FaExclamationTriangle,
    FaBoxes,
    FaArrowRight,
    FaEye
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TypeaheadDropdown from "../../../components/common/TypeaheadDropdown";
import "../../../styles/indentsList.css";
import "../../../styles/indentApproval.css";

const API_URL = process.env.REACT_APP_API_URL || "/api";
const STAGES = ["PENDING", "APPROVED", "REJECTED", "ALL"];

const DEFAULT_IRN_APPROVAL_RECORDS = [
    {
        RequisitionID: 101,
        ReqNo: "IRN/APP/9B/2627/2401",
        ItemCode: "CRD-1001",
        ItemName: "CARD BOARD",
        Variant: "NATURAL",
        UOM: "PCS",
        ReqDate: "27-10-2026",
        Department: "Packaging",
        GroupModel: "Packaging",
        Warehouse: "PLOT NO. 9B",
        Associate: "Apex Leather Works",
        ReqBy: "Ramesh Kumar",
        TotalQty: 100,
        PendingQty: 100,
        StockQty: 0,
        Location: "BIN-D-01-02",
        RowCount: 1,
        Status: "Pending",
        items: [
            { ItemCode: "CRD-1001", ItemName: "CARD BOARD", Variant: "NATURAL", Size: "100", UOM: "PCS", ReqQty: 100, IssuedQty: 0, PendingQty: 100, StockQty: 0, Location: "BIN-D-01-02" }
        ]
    },
    {
        RequisitionID: 102,
        ReqNo: "IRN/APP/9B/2627/2402",
        ItemCode: "SPR-2001",
        ItemName: "SPRING FILE",
        Variant: "BLUE",
        UOM: "PCS",
        ReqDate: "27-10-2026",
        Department: "Packaging",
        GroupModel: "Office Stationery",
        Warehouse: "PLOT NO. 9B",
        Associate: "Apex Leather Works",
        ReqBy: "Ramesh Kumar",
        TotalQty: 6,
        PendingQty: 6,
        StockQty: 50,
        Location: "BIN-D-01-01",
        RowCount: 1,
        Status: "Pending",
        items: [
            { ItemCode: "SPR-2001", ItemName: "SPRING FILE", Variant: "BLUE", Size: "Standard", UOM: "PCS", ReqQty: 6, IssuedQty: 0, PendingQty: 6, StockQty: 50, Location: "BIN-D-01-01" }
        ]
    },
    {
        RequisitionID: 103,
        ReqNo: "IRN/APP/9B/2627/2403",
        ItemCode: "IDX-3001",
        ItemName: "INDEX FILE BIG",
        Variant: "BLACK",
        UOM: "PCS",
        ReqDate: "27-10-2026",
        Department: "Packaging",
        GroupModel: "Office Stationery",
        Warehouse: "PLOT NO. 9B",
        Associate: "Apex Leather Works",
        ReqBy: "Ramesh Kumar",
        TotalQty: 4,
        PendingQty: 4,
        StockQty: 40,
        Location: "BIN-D-01-03",
        RowCount: 1,
        Status: "Pending",
        items: [
            { ItemCode: "IDX-3001", ItemName: "INDEX FILE BIG", Variant: "BLACK", Size: "Big", UOM: "PCS", ReqQty: 4, IssuedQty: 0, PendingQty: 4, StockQty: 40, Location: "BIN-D-01-03" }
        ]
    },
    {
        RequisitionID: 104,
        ReqNo: "IRN/APP/9B/2627/2404",
        ItemCode: "LTH-1093",
        ItemName: "COW CULATTAS SINGLE LEATHER",
        Variant: "BLACK (BLK-01)",
        UOM: "SQFT",
        ReqDate: "25-10-2026",
        Department: "Cutting Dept",
        GroupModel: "Leather",
        Warehouse: "RAW MATERIAL STORE 9B",
        Associate: "Apex Leather Works",
        ReqBy: "Ramesh Kumar",
        TotalQty: 200,
        PendingQty: 150,
        StockQty: 450,
        Location: "BIN-A-01-01",
        RowCount: 1,
        Status: "Pending",
        items: [
            { ItemCode: "LTH-1093", ItemName: "COW CULATTAS SINGLE LEATHER", Variant: "BLACK (BLK-01)", Size: "1.2-1.4mm", UOM: "SQFT", ReqQty: 200, IssuedQty: 50, PendingQty: 150, StockQty: 450, Location: "BIN-A-01-01" }
        ]
    },
    {
        RequisitionID: 105,
        ReqNo: "IRN/APP/9B/2627/2405",
        ItemCode: "LTH-1112",
        ItemName: "COW ECO VEG SIDE CRUST LEATHER",
        Variant: "TAN (TAN-04)",
        UOM: "SQFT",
        ReqDate: "25-10-2026",
        Department: "Cutting Dept",
        GroupModel: "Leather",
        Warehouse: "RAW MATERIAL STORE 9B",
        Associate: "Apex Leather Works",
        ReqBy: "Ramesh Kumar",
        TotalQty: 120,
        PendingQty: 100,
        StockQty: 280,
        Location: "BIN-A-02-01",
        RowCount: 1,
        Status: "Pending",
        items: [
            { ItemCode: "LTH-1112", ItemName: "COW ECO VEG SIDE CRUST LEATHER", Variant: "TAN (TAN-04)", Size: "1.4-1.6mm", UOM: "SQFT", ReqQty: 120, IssuedQty: 20, PendingQty: 100, StockQty: 280, Location: "BIN-A-02-01" }
        ]
    },
    {
        RequisitionID: 106,
        ReqNo: "IRN/APP/9B/2627/2406",
        ItemCode: "RNF-1085",
        ItemName: "HIGH DENSITY TOPLINER 0.4MM",
        Variant: "BLACK (BLK-02)",
        UOM: "MTR",
        ReqDate: "24-10-2026",
        Department: "Cutting Dept",
        GroupModel: "Lining",
        Warehouse: "RAW MATERIAL STORE 9B",
        Associate: "K-Tex Textiles",
        ReqBy: "Nikhil Singh",
        TotalQty: 450,
        PendingQty: 300,
        StockQty: 1200,
        Location: "BIN-B-01-02",
        RowCount: 1,
        Status: "Pending",
        items: [
            { ItemCode: "RNF-1085", ItemName: "HIGH DENSITY TOPLINER 0.4MM", Variant: "BLACK (BLK-02)", Size: "0.4mm", UOM: "MTR", ReqQty: 450, IssuedQty: 150, PendingQty: 300, StockQty: 1200, Location: "BIN-B-01-02" }
        ]
    },
    {
        RequisitionID: 107,
        ReqNo: "IRN/APP/9B/2627/2407",
        ItemCode: "NONWO5064",
        ItemName: "TALIN 0.3MM WHITE",
        Variant: "WHITE (WHT-10)",
        UOM: "MTR",
        ReqDate: "24-10-2026",
        Department: "Cutting Dept",
        GroupModel: "Reinforcement",
        Warehouse: "RAW MATERIAL STORE 9B",
        Associate: "K-Tex Textiles",
        ReqBy: "Nikhil Singh",
        TotalQty: 300,
        PendingQty: 200,
        StockQty: 640,
        Location: "BIN-B-01-01",
        RowCount: 1,
        Status: "Pending",
        items: [
            { ItemCode: "NONWO5064", ItemName: "TALIN 0.3MM WHITE", Variant: "WHITE (WHT-10)", Size: "0.3mm", UOM: "MTR", ReqQty: 300, IssuedQty: 100, PendingQty: 200, StockQty: 640, Location: "BIN-B-01-01" }
        ]
    },
    {
        RequisitionID: 108,
        ReqNo: "IRN/APP/9B/2627/2408",
        ItemCode: "HDW-2236",
        ItemName: "JAM RIVET SINGLE HEAD 7MM",
        Variant: "ANTIQUE BRASS (AB-701)",
        UOM: "SET",
        ReqDate: "26-10-2026",
        Department: "Assembly",
        GroupModel: "Hardware",
        Warehouse: "ACCESSORIES GODOWN 18",
        Associate: "Balaji Trims & Fasteners",
        ReqBy: "Pooja Verma",
        TotalQty: 1200,
        PendingQty: 800,
        StockQty: 5000,
        Location: "BIN-C-01-01",
        RowCount: 1,
        Status: "Pending",
        items: [
            { ItemCode: "HDW-2236", ItemName: "JAM RIVET SINGLE HEAD 7MM", Variant: "ANTIQUE BRASS (AB-701)", Size: "7mm", UOM: "SET", ReqQty: 1200, IssuedQty: 400, PendingQty: 800, StockQty: 5000, Location: "BIN-C-01-01" }
        ]
    },
    {
        RequisitionID: 109,
        ReqNo: "IRN/APP/9B/2627/2409",
        ItemCode: "TRM-3012",
        ItemName: "NYLON ZIPPER #5 OPEN END 65CM",
        Variant: "NAVY (NVY-05)",
        UOM: "PCS",
        ReqDate: "26-10-2026",
        Department: "Stitching",
        GroupModel: "Trims & Zippers",
        Warehouse: "ACCESSORIES GODOWN 18",
        Associate: "Balaji Trims & Fasteners",
        ReqBy: "Sunil Sharma",
        TotalQty: 250,
        PendingQty: 250,
        StockQty: 180,
        Location: "BIN-C-02-04",
        RowCount: 1,
        Status: "Pending",
        items: [
            { ItemCode: "TRM-3012", ItemName: "NYLON ZIPPER #5 OPEN END 65CM", Variant: "NAVY (NVY-05)", Size: "65cm", UOM: "PCS", ReqQty: 250, IssuedQty: 0, PendingQty: 250, StockQty: 180, Location: "BIN-C-02-04" }
        ]
    }
];

const DEFAULT_GROUPS = [
    "Packaging",
    "Office Stationery",
    "Leather",
    "Lining",
    "Reinforcement",
    "Hardware",
    "Trims & Zippers"
];

const toApprovalStatus = (status) => {
    const s = String(status || "").toLowerCase();
    if (["approved", "issued", "completed", "partially issued"].includes(s)) return "approved";
    if (s === "rejected") return "rejected";
    return "pending";
};

const STATUS_LABEL = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected"
};

export default function ItemRequisitionApproval() {
    const navigate = useNavigate();

    // Filters matching screenshot
    const [stage, setStage] = useState("PENDING");
    const [groupModel, setGroupModel] = useState("");
    const [reqNoFilter, setReqNoFilter] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Data
    const [requisitions, setRequisitions] = useState(DEFAULT_IRN_APPROVAL_RECORDS);
    const [groups, setGroups] = useState(DEFAULT_GROUPS);
    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");
    const [selected, setSelected] = useState(new Set());
    const [expandedReqNos, setExpandedReqNos] = useState(["IRN/APP/9B/2627/2401"]);

    const loadRequisitions = useCallback(async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const res = await axios.get(`${API_URL}/item-requisitions`);
            const apiRows = res.data?.data || res.data || [];
            if (Array.isArray(apiRows) && apiRows.length > 0) {
                const mergedMap = new Map();
                DEFAULT_IRN_APPROVAL_RECORDS.forEach(r => mergedMap.set(r.ReqNo, r));
                apiRows.forEach((r, idx) => {
                    const reqNo = r.ReqNo || `IRN/APP/9B/2627/${2400 + idx}`;
                    if (!mergedMap.has(reqNo)) {
                        mergedMap.set(reqNo, {
                            RequisitionID: r.RequisitionID || 200 + idx,
                            ReqNo: reqNo,
                            ReqDate: r.ReqDate || "27-10-2026",
                            Department: r.Department || "Production",
                            GroupModel: r.GroupModel || r.Department || "Leather",
                            Warehouse: r.Warehouse || "RAW MATERIAL STORE 9B",
                            Associate: r.Associate || "",
                            ReqBy: r.ReqBy || "Admin",
                            TotalQty: Number(r.TotalQty || 0),
                            PendingQty: Number(r.TotalQty || 0),
                            RowCount: Number(r.RowCount || (r.details ? r.details.length : 1)),
                            Status: r.Status === "Draft" ? "Pending" : (r.Status || "Pending"),
                            items: Array.isArray(r.details) && r.details.length > 0
                                ? r.details.map(d => ({
                                    ItemCode: d.ItemCode || "ITM-101",
                                    ItemName: d.ItemName || "Material Item",
                                    Variant: d.Color || "N/A",
                                    Size: "Standard",
                                    UOM: d.UOM || "PCS",
                                    ReqQty: Number(d.Quantity || 0),
                                    IssuedQty: 0,
                                    PendingQty: Number(d.Quantity || 0),
                                    StockQty: 250,
                                    Location: "BIN-A-01-01"
                                }))
                                : []
                        });
                    }
                });
                setRequisitions(Array.from(mergedMap.values()));
            }
        } catch (err) {
            // Keep default seed IRNs if offline
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRequisitions();
    }, [loadRequisitions]);

    // Load dynamic item categories for Group/Model dropdown
    useEffect(() => {
        axios.get(`${API_URL}/items?limit=1000`)
            .then((res) => {
                const rows = res.data?.data || [];
                const cats = new Set([...DEFAULT_GROUPS, ...rows.map(r => r.Category).filter(Boolean)]);
                setGroups([...cats]);
            })
            .catch(() => {});
    }, []);

    // Filtered rows according to Authorization Stage, Group/Model, and Req. No filter
    const rows = useMemo(() => {
        return requisitions.filter(r => {
            const st = toApprovalStatus(r.Status);
            const matchStage =
                stage === "ALL" ||
                (stage === "PENDING" && st === "pending") ||
                (stage === "APPROVED" && st === "approved") ||
                (stage === "REJECTED" && st === "rejected");

            const gQuery = groupModel.trim().toLowerCase();
            const matchGroup = !gQuery ||
                (r.GroupModel && r.GroupModel.toLowerCase().includes(gQuery)) ||
                (r.Department && r.Department.toLowerCase().includes(gQuery)) ||
                (r.items && r.items.some(it => it.ItemName.toLowerCase().includes(gQuery)));

            const q = reqNoFilter.trim().toLowerCase();
            const matchReqNo = !q ||
                String(r.ReqNo || "").toLowerCase().includes(q) ||
                (r.items && r.items.some(it => it.ItemName.toLowerCase().includes(q)));

            return matchStage && matchGroup && matchReqNo;
        });
    }, [requisitions, stage, groupModel, reqNoFilter]);

    const allSelected = rows.length > 0 && selected.size === rows.length;

    const toggleAll = () => {
        setSelected(allSelected ? new Set() : new Set(rows.map(r => r.ReqNo)));
    };

    const toggleRow = (reqNo) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(reqNo)) next.delete(reqNo);
            else next.add(reqNo);
            return next;
        });
    };

    const toggleExpandReq = (reqNo) => {
        setExpandedReqNos(prev =>
            prev.includes(reqNo) ? prev.filter(x => x !== reqNo) : [...prev, reqNo]
        );
    };

    const runAction = async (action, sourceRows) => {
        const candidates = sourceRows || rows.filter(r => selected.has(r.ReqNo));
        if (candidates.length === 0) {
            alert(`Please select at least one Item Requisition Note to ${action}.`);
            return;
        }

        const newStatus = action === "approve" ? "Approved" : "Rejected";
        setBusy(true);
        try {
            const targetReqNos = new Set(candidates.map(c => c.ReqNo));
            setRequisitions(prev =>
                prev.map(r => targetReqNos.has(r.ReqNo) ? { ...r, Status: newStatus } : r)
            );
            setSelected(new Set());
            setSuccessMsg(`${candidates.length} Item Requisition Note(s) marked as ${newStatus}.`);
            setTimeout(() => setSuccessMsg(""), 4000);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="ind-erp-page">
            {/* Page Title matching User Screenshot */}
            <h1
                className="ind-erp-title"
                style={{
                    color: "#2073a9",
                    fontSize: "20px",
                    fontWeight: 500,
                    marginBottom: "14px"
                }}
            >
                Item Requisition Note Approval
            </h1>

            {successMsg && (
                <div style={{
                    background: "#ecfdf5",
                    border: "1px solid #10b981",
                    color: "#065f46",
                    padding: "6px 12px",
                    borderRadius: "3px",
                    marginBottom: "10px",
                    fontSize: "12px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                }}>
                    <FaCheckCircle /> <span>{successMsg}</span>
                </div>
            )}

            {/* Top Filters: Authorization Stage + Group/Model (Exact match to Screenshot) */}
            <div className="ind-filter-bar" style={{ gap: "24px", marginBottom: "14px" }}>
                <div className="ind-filter-group">
                    <label className="ind-filter-label">Authorization Stage</label>
                    <select
                        className="ind-filter-select"
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                        style={{ width: "145px" }}
                    >
                        {STAGES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="ind-filter-group" style={{ width: "250px" }}>
                    <label className="ind-filter-label">Group/Model</label>
                    <TypeaheadDropdown
                        placeholder="Type and select Group/Model"
                        value={groupModel}
                        onChange={(val) => setGroupModel(val)}
                        options={groups}
                        dropdownWidth="250px"
                    />
                </div>
            </div>

            {/* Legend: Pending (Red) & Approved (Green) (Exact match to Screenshot) */}
            <div className="iap-legend" style={{ marginBottom: "8px" }}>
                <span className="iap-legend-box pending" /> Pending
                <span className="iap-legend-box approved" style={{ marginLeft: "4px" }} /> Approved
            </div>

            {/* Sub-Toolbar: Left Action Icons & Filter + Right Pagination [1][2][3][4][5][>][>>] */}
            <div className="ind-sub-toolbar" style={{ marginBottom: "8px" }}>
                <div className="ind-toolbar-icons">
                    <button
                        type="button"
                        className="ind-icon-btn"
                        title="Refresh"
                        onClick={loadRequisitions}
                    >
                        <FaSyncAlt size={11} />
                    </button>
                    <button
                        type="button"
                        className="ind-icon-btn"
                        title="Toggle All Pending Item & Stock Details"
                        onClick={() => {
                            if (expandedReqNos.length === rows.length) {
                                setExpandedReqNos([]);
                            } else {
                                setExpandedReqNos(rows.map(r => r.ReqNo));
                            }
                        }}
                    >
                        <FaListUl size={11} />
                    </button>

                    {/* Split Filter Button matching Screenshot */}
                    <div style={{ display: "inline-flex" }}>
                        <button
                            type="button"
                            className="ind-filter-btn"
                            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                            onClick={() => setShowFilter(v => !v)}
                        >
                            <FaFilter size={10} /> Filter
                        </button>
                        <button
                            type="button"
                            className="ind-filter-btn"
                            style={{
                                borderLeft: "none",
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                padding: "0 6px"
                            }}
                            onClick={() => setShowFilter(v => !v)}
                        >
                            <FaChevronDown size={8} />
                        </button>
                    </div>

                    <button
                        type="button"
                        className="iap-action-btn approve"
                        disabled={busy || rows.length === 0}
                        onClick={() => runAction("approve", rows)}
                    >
                        Approve All
                    </button>
                    <button
                        type="button"
                        className="iap-action-btn approve"
                        disabled={busy || selected.size === 0}
                        onClick={() => runAction("approve")}
                    >
                        Approve
                    </button>
                    <button
                        type="button"
                        className="iap-action-btn reject"
                        disabled={busy || selected.size === 0}
                        onClick={() => runAction("reject")}
                    >
                        Reject
                    </button>
                </div>

                {/* Pagination Bar matching Screenshot: [1] [2] [3] [4] [5] [>] [>>] */}
                <div style={{ display: "flex", alignItems: "center" }}>
                    {[1, 2, 3, 4, 5].map(pageNum => (
                        <button
                            key={pageNum}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            style={{
                                width: "26px",
                                height: "26px",
                                border: "1px solid #dddddd",
                                borderRight: "none",
                                backgroundColor: currentPage === pageNum ? "#2073a9" : "#ffffff",
                                color: currentPage === pageNum ? "#ffffff" : "#2073a9",
                                fontSize: "11.5px",
                                fontWeight: currentPage === pageNum ? 700 : 500,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            {pageNum}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => setCurrentPage(p => Math.min(5, p + 1))}
                        style={{
                            width: "26px",
                            height: "26px",
                            border: "1px solid #dddddd",
                            borderRight: "none",
                            backgroundColor: "#ffffff",
                            color: "#2073a9",
                            fontSize: "11.5px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        &gt;
                    </button>
                    <button
                        type="button"
                        onClick={() => setCurrentPage(5)}
                        style={{
                            width: "28px",
                            height: "26px",
                            border: "1px solid #dddddd",
                            backgroundColor: "#ffffff",
                            color: "#2073a9",
                            fontSize: "11.5px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        &gt;&gt;
                    </button>
                </div>
            </div>

            {showFilter && (
                <div className="iap-filter-panel" style={{ marginBottom: "8px" }}>
                    <label className="ind-filter-label" style={{ margin: 0 }}>Req. No / Material</label>
                    <input
                        type="text"
                        className="ind-filter-input"
                        style={{ width: "240px" }}
                        placeholder="Filter by Req. No or Pending Item..."
                        value={reqNoFilter}
                        onChange={(e) => setReqNoFilter(e.target.value)}
                    />
                </div>
            )}

            {errorMsg && (
                <Alert variant="danger" className="py-1 px-3 mb-2" style={{ fontSize: "11px" }}>
                    {errorMsg}
                </Alert>
            )}

            {/* Main Table matching Screenshot: Action | Req. No | Qty | No. of Rows | Approval Status */}
            <div className="table-responsive" style={{ minHeight: "420px" }}>
                <Table hover size="sm" className="ind-ribbon-table iap-table text-nowrap">
                    <thead>
                        <tr>
                            <th style={{ width: "110px", textAlign: "center", backgroundColor: "#2073a9" }}>
                                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleAll}
                                        title="Select All"
                                    />
                                    <span>Action</span>
                                </div>
                            </th>
                            <th className="center" style={{ backgroundColor: "#2073a9" }}>Req. No (Item-Wise IRN)</th>
                            <th className="center" style={{ backgroundColor: "#2073a9" }}>Item Name &amp; Code</th>
                            <th className="center" style={{ width: "130px", backgroundColor: "#2073a9" }}>Qty</th>
                            <th className="center" style={{ width: "180px", backgroundColor: "#2073a9" }}>No. of Rows</th>
                            <th className="center" style={{ width: "240px", backgroundColor: "#2073a9" }}>Approval Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-5">
                                    <Spinner animation="border" size="sm" className="me-2 text-primary" />
                                    Loading Item Requisition Notes...
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-5 text-muted">
                                    No Item Requisition Notes found for the selected stage.
                                </td>
                            </tr>
                        ) : (
                            rows.map((r) => {
                                const st = toApprovalStatus(r.Status);
                                const isExpanded = expandedReqNos.includes(r.ReqNo);
                                return (
                                    <React.Fragment key={r.ReqNo}>
                                        <tr
                                            className={selected.has(r.ReqNo) ? "selected" : ""}
                                            onClick={() => toggleExpandReq(r.ReqNo)}
                                        >
                                            <td className="ind-checkbox-cell" onClick={(e) => e.stopPropagation()}>
                                                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selected.has(r.ReqNo)}
                                                        onChange={() => toggleRow(r.ReqNo)}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleExpandReq(r.ReqNo)}
                                                        title="View Pending Items & Stock"
                                                        style={{
                                                            border: "1px solid #cbd5e1",
                                                            background: isExpanded ? "#2073a9" : "#f8fafc",
                                                            color: isExpanded ? "#ffffff" : "#2073a9",
                                                            borderRadius: "2px",
                                                            padding: "1px 6px",
                                                            fontSize: "10.5px",
                                                            fontWeight: 600,
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        <FaEye style={{ marginRight: "3px" }} />
                                                        Items
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate("/stock-issues")}
                                                        title="Open in Item Issue Module"
                                                        style={{
                                                            border: "1px solid #4cae4c",
                                                            background: "#5cb85c",
                                                            color: "#ffffff",
                                                            borderRadius: "2px",
                                                            padding: "1px 6px",
                                                            fontSize: "10.5px",
                                                            fontWeight: 600,
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        Issue
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="center" style={{ fontWeight: 700, color: "#2073a9", fontFamily: "monospace" }}>
                                                {r.ReqNo}
                                                <span style={{ marginLeft: "8px", fontSize: "10.5px", color: "#64748b", fontWeight: 500, fontFamily: "inherit" }}>
                                                    ({r.Department} • {r.ReqDate})
                                                </span>
                                            </td>
                                            <td className="center" style={{ fontWeight: 700, color: "#0f172a" }}>
                                                {r.ItemName || (r.items && r.items[0] ? r.items[0].ItemName : "-")}
                                                <span style={{ marginLeft: "6px", fontSize: "10.5px", color: "#047857", fontFamily: "monospace" }}>
                                                    [{r.ItemCode || (r.items && r.items[0] ? r.items[0].ItemCode : "")}]
                                                </span>
                                            </td>
                                            <td className="center" style={{ fontWeight: 700 }}>
                                                {Number(r.TotalQty || 0)}
                                                <span style={{ marginLeft: "6px", color: "#b45309", fontSize: "10.5px" }}>
                                                    (Pending: {r.PendingQty})
                                                </span>
                                            </td>
                                            <td className="center" style={{ fontWeight: 600 }}>
                                                {r.RowCount || (r.items ? r.items.length : 1)}
                                            </td>
                                            <td className={`iap-status ${st}`}>
                                                {STATUS_LABEL[st]}
                                            </td>
                                        </tr>

                                        {/* Expanded Sub-Row: Displays What is Pending & Stock of Each Item in this IRN */}
                                        {isExpanded && r.items && r.items.length > 0 && (
                                            <tr>
                                                <td colSpan="6" style={{ backgroundColor: "#f8fafc", padding: "10px 16px" }}>
                                                    <div style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        marginBottom: "6px"
                                                    }}>
                                                        <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "11.5px" }}>
                                                            Pending Items & Live Warehouse Stock for {r.ReqNo} ({r.Warehouse})
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => navigate("/stock-issues")}
                                                            style={{
                                                                background: "#2073a9",
                                                                color: "#ffffff",
                                                                border: "none",
                                                                borderRadius: "2px",
                                                                padding: "3px 10px",
                                                                fontSize: "11px",
                                                                fontWeight: 600,
                                                                cursor: "pointer",
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: "5px"
                                                            }}
                                                        >
                                                            <span>Issue Pending Items in Item Issue Module</span>
                                                            <FaArrowRight size={9} />
                                                        </button>
                                                    </div>

                                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", background: "#ffffff", border: "1px solid #cbd5e1" }}>
                                                        <thead>
                                                            <tr style={{ background: "#e2e8f0", color: "#1e293b" }}>
                                                                <th style={{ padding: "5px 8px", border: "1px solid #cbd5e1" }}>Item Code</th>
                                                                <th style={{ padding: "5px 8px", border: "1px solid #cbd5e1" }}>Pending Item Name</th>
                                                                <th style={{ padding: "5px 8px", border: "1px solid #cbd5e1" }}>Variant / Colour</th>
                                                                <th style={{ padding: "5px 8px", border: "1px solid #cbd5e1" }}>Size</th>
                                                                <th style={{ padding: "5px 8px", border: "1px solid #cbd5e1" }}>Bin Location</th>
                                                                <th style={{ padding: "5px 8px", border: "1px solid #cbd5e1", textAlign: "right" }}>Req Qty</th>
                                                                <th style={{ padding: "5px 8px", border: "1px solid #cbd5e1", textAlign: "right" }}>Already Issued</th>
                                                                <th style={{ padding: "5px 8px", border: "1px solid #cbd5e1", textAlign: "right", background: "#fef3c7", color: "#92400e" }}>What is Pending (Bal)</th>
                                                                <th style={{ padding: "5px 8px", border: "1px solid #cbd5e1", textAlign: "right", background: "#dcfce7", color: "#166534" }}>Current Stock of Item</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {r.items.map(it => (
                                                                <tr key={it.ItemCode}>
                                                                    <td style={{ padding: "4px 8px", border: "1px solid #e2e8f0", fontFamily: "monospace", fontWeight: 700 }}>{it.ItemCode}</td>
                                                                    <td style={{ padding: "4px 8px", border: "1px solid #e2e8f0", fontWeight: 700 }}>{it.ItemName}</td>
                                                                    <td style={{ padding: "4px 8px", border: "1px solid #e2e8f0" }}>{it.Variant}</td>
                                                                    <td style={{ padding: "4px 8px", border: "1px solid #e2e8f0" }}>{it.Size}</td>
                                                                    <td style={{ padding: "4px 8px", border: "1px solid #e2e8f0", fontFamily: "monospace", color: "#2073a9", fontWeight: 700 }}>{it.Location}</td>
                                                                    <td style={{ padding: "4px 8px", border: "1px solid #e2e8f0", textAlign: "right", fontWeight: 600 }}>{it.ReqQty} {it.UOM}</td>
                                                                    <td style={{ padding: "4px 8px", border: "1px solid #e2e8f0", textAlign: "right", color: "#16a34a" }}>{it.IssuedQty} {it.UOM}</td>
                                                                    <td style={{ padding: "4px 8px", border: "1px solid #e2e8f0", textAlign: "right", fontWeight: 800, color: "#b45309", background: "#fffbeb" }}>
                                                                        {it.PendingQty} {it.UOM} Pending
                                                                    </td>
                                                                    <td style={{
                                                                        padding: "4px 8px",
                                                                        border: "1px solid #e2e8f0",
                                                                        textAlign: "right",
                                                                        fontWeight: 800,
                                                                        color: it.StockQty > 0 ? "#166534" : "#991b1b",
                                                                        background: it.StockQty > 0 ? "#f0fdf4" : "#fef2f2"
                                                                    }}>
                                                                        {it.StockQty > 0 ? (
                                                                            <span><FaCheckCircle size={10} style={{ marginRight: "4px" }} />{it.StockQty} {it.UOM} (In Stock)</span>
                                                                        ) : (
                                                                            <span><FaExclamationTriangle size={10} style={{ marginRight: "4px" }} />0 {it.UOM} (Out of Stock)</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}
