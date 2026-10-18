import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import { FaSyncAlt, FaListUl, FaFilter, FaChevronDown } from "react-icons/fa";
import axios from "axios";
import TypeaheadDropdown from "../../../components/common/TypeaheadDropdown";
import "../../../styles/indentsList.css";
import "../../../styles/indentApproval.css";

const STAGES = ["PENDING", "APPROVED", "REJECTED", "ALL"];

// Maps backend Indent.Status to the Approval Status shown in the grid
const toApprovalStatus = (status) => {
    const s = String(status || "").toLowerCase();
    if (["approved", "partially ordered", "closed"].includes(s)) return "approved";
    if (s === "rejected") return "rejected";
    return "pending";
};

const STATUS_LABEL = { pending: "Pending", approved: "Approved", rejected: "Rejected" };

export default function IndentApproval() {
    // Filters
    const [supplier, setSupplier] = useState("");
    const [stage, setStage] = useState("PENDING");
    const [group, setGroup] = useState("");
    const [indentNoFilter, setIndentNoFilter] = useState("");
    const [showFilter, setShowFilter] = useState(false);

    // Data
    const [indents, setIndents] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [selected, setSelected] = useState(new Set());

    const loadIndents = useCallback(async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const params = { status: stage };
            if (supplier.trim()) params.supplier = supplier.trim();
            if (group.trim()) params.group = group.trim();
            const res = await axios.get("/api/indents", { params });
            setIndents(res.data?.data || []);
            setSelected(new Set());
        } catch (err) {
            console.error("Indent approval load error:", err);
            setErrorMsg(err.response?.data?.message || "Failed to load indents.");
            setIndents([]);
        } finally {
            setLoading(false);
        }
    }, [stage, supplier, group]);

    useEffect(() => {
        loadIndents();
    }, [loadIndents]);

    // Lookup lists for the typeahead filters
    useEffect(() => {
        axios.get("/api/suppliers")
            .then((res) => setSuppliers(res.data?.data || []))
            .catch(() => {});
        axios.get("/api/items?limit=5000")
            .then((res) => {
                const rows = res.data?.data || [];
                const cats = new Set(rows.map((r) => r.Category).filter(Boolean));
                setGroups([...cats].sort());
            })
            .catch(() => {});
    }, []);

    const rows = useMemo(() => {
        const q = indentNoFilter.trim().toLowerCase();
        if (!q) return indents;
        return indents.filter((r) => String(r.IndentNo || "").toLowerCase().includes(q));
    }, [indents, indentNoFilter]);

    const allSelected = rows.length > 0 && selected.size === rows.length;

    const toggleAll = () => {
        setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.IndentID)));
    };

    const toggleRow = (id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const runAction = async (action, sourceRows) => {
        const candidates = sourceRows || rows.filter((r) => selected.has(r.IndentID));
        const targets = candidates.filter(
            (r) => toApprovalStatus(r.Status) !== (action === "approve" ? "approved" : "rejected")
        );
        if (targets.length === 0) {
            alert(`Select at least one indent that can be ${action === "approve" ? "approved" : "rejected"}.`);
            return;
        }

        let remarks = "";
        if (action === "reject") {
            const input = window.prompt(`Reason for rejecting ${targets.length} indent(s):`, "");
            if (input === null) return;
            remarks = input.trim();
        } else if (!window.confirm(`Approve ${targets.length} indent(s)?`)) {
            return;
        }

        setBusy(true);
        try {
            const results = await Promise.allSettled(
                targets.map((r) =>
                    axios.patch(`/api/indents/${r.IndentID}/${action}`, {
                        remarks: remarks || `${action === "approve" ? "Approved" : "Rejected"} via Indent Approval`
                    })
                )
            );
            const failed = results.filter((r) => r.status === "rejected");
            if (failed.length > 0) {
                const msg = failed[0].reason?.response?.data?.message || failed[0].reason?.message;
                alert(`${failed.length} of ${targets.length} failed. ${msg || ""}`);
            }
            await loadIndents();
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="ind-erp-page">
            <h1 className="ind-erp-title">Indent Approval</h1>

            {/* Filters */}
            <div className="ind-filter-bar">
                <div className="ind-filter-group" style={{ width: "230px" }}>
                    <label className="ind-filter-label">Supplier</label>
                    <TypeaheadDropdown
                        placeholder="Type and select Supplier"
                        value={supplier}
                        onChange={(val) => setSupplier(val)}
                        options={suppliers.map((s) => s.SupplierName || s.name || s)}
                        dropdownWidth="280px"
                    />
                </div>

                <div className="ind-filter-group">
                    <label className="ind-filter-label">Authorization Stage</label>
                    <select
                        className="ind-filter-select"
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                        style={{ width: "150px" }}
                    >
                        {STAGES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="ind-filter-group" style={{ width: "230px" }}>
                    <label className="ind-filter-label">Group/Model</label>
                    <TypeaheadDropdown
                        placeholder="Type and select Group/Model"
                        value={group}
                        onChange={(val) => setGroup(val)}
                        options={groups}
                        dropdownWidth="280px"
                    />
                </div>
            </div>

            {/* Legend */}
            <div className="iap-legend">
                <span className="iap-legend-box pending" /> Pending
                <span className="iap-legend-box approved" /> Approved
            </div>

            {/* Toolbar */}
            <div className="ind-sub-toolbar">
                <div className="ind-toolbar-icons">
                    <button type="button" className="ind-icon-btn" title="Refresh" onClick={loadIndents}>
                        <FaSyncAlt size={11} />
                    </button>
                    <button
                        type="button"
                        className="ind-icon-btn"
                        title="Summary"
                        onClick={() => alert(`Indents listed: ${rows.length}\nSelected: ${selected.size}`)}
                    >
                        <FaListUl size={11} />
                    </button>
                    <button type="button" className="ind-filter-btn" onClick={() => setShowFilter((v) => !v)}>
                        <FaFilter size={10} /> Filter <FaChevronDown size={8} />
                    </button>

                    <button
                        type="button"
                        className="iap-action-btn approve"
                        title="Approve all listed pending indents"
                        disabled={busy || !rows.some((r) => toApprovalStatus(r.Status) === "pending")}
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
            </div>

            {showFilter && (
                <div className="iap-filter-panel">
                    <label className="ind-filter-label" style={{ margin: 0 }}>Indent No.</label>
                    <input
                        type="text"
                        className="ind-filter-input"
                        style={{ width: "220px" }}
                        placeholder="Filter by Indent No."
                        value={indentNoFilter}
                        onChange={(e) => setIndentNoFilter(e.target.value)}
                    />
                </div>
            )}

            {errorMsg && (
                <Alert variant="danger" className="py-1 px-3 mb-2" style={{ fontSize: "11px" }}>
                    {errorMsg}
                </Alert>
            )}

            {/* Grid */}
            <div className="table-responsive" style={{ minHeight: "400px" }}>
                <Table hover size="sm" className="ind-ribbon-table iap-table text-nowrap">
                    <thead>
                        <tr>
                            <th className="ind-checkbox-cell" style={{ width: "170px" }}>
                                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                            </th>
                            <th className="center">Indent No.</th>
                            <th className="center">Qty</th>
                            <th className="center">No. of rows</th>
                            <th className="center">Approval Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-5">
                                    <Spinner animation="border" size="sm" className="me-2 text-primary" />
                                    Loading Indents...
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-5 text-muted">
                                    No indents found for the selected criteria.
                                </td>
                            </tr>
                        ) : (
                            rows.map((r) => {
                                const st = toApprovalStatus(r.Status);
                                return (
                                    <tr
                                        key={r.IndentID}
                                        className={selected.has(r.IndentID) ? "selected" : ""}
                                        onClick={() => toggleRow(r.IndentID)}
                                    >
                                        <td className="ind-checkbox-cell" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selected.has(r.IndentID)}
                                                onChange={() => toggleRow(r.IndentID)}
                                            />
                                        </td>
                                        <td className="center">{r.IndentNo}</td>
                                        <td className="num">{Number(r.TotalQty || 0)}</td>
                                        <td className="num">{r.TotalItems || 0}</td>
                                        <td className={`iap-status ${st}`}>{STATUS_LABEL[st]}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}
