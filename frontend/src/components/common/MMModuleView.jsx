import React, { useState, useEffect, useMemo, useRef } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import {
    FaPlus,
    FaSyncAlt,
    FaSearch,
    FaBoxes,
    FaDownload,
    FaUpload,
    FaBarcode,
    FaCog,
    FaThList,
    FaFilter,
    FaChevronDown,
    FaCheckCircle,
    FaTrash,
    FaEye,
    FaEdit
} from "react-icons/fa";
import axios from "axios";
import "../../styles/purchaseOrder.css";

export default function MMModuleView({
    title,
    moduleName,
    apiEndpoint,
    columns = [
        { key: "DocNo", label: "Doc #" },
        { key: "DocDate", label: "Date" },
        { key: "Department", label: "Department" },
        { key: "ItemName", label: "Item / Material" },
        { key: "Quantity", label: "Quantity" },
        { key: "Status", label: "Status" }
    ],
    initialSampleData = []
}) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [materialSource, setMaterialSource] = useState("All"); // Domestic | Import | All
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [showBulkDropdown, setShowBulkDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [activeRecord, setActiveRecord] = useState(null);

    const [newItem, setNewItem] = useState({
        DocNo: "",
        Department: "Manufacturing",
        ItemName: "Fabric / Material",
        Quantity: "100",
        Remarks: "",
        Status: "Pending",
        MaterialSource: "Domestic"
    });

    const fileInputRef = useRef(null);

    const loadData = async () => {
        setLoading(true);
        try {
            if (apiEndpoint) {
                const res = await axios.get(apiEndpoint);
                const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                if (data.length > 0) {
                    setRecords(data);
                    setLoading(false);
                    return;
                }
            }
        } catch (e) {
            console.warn(`API ${apiEndpoint} not responding, using local persistence`);
        }

        // Check local storage for persistent user inputs
        const saved = localStorage.getItem(`erp_mm_${moduleName}`);
        if (saved) {
            try {
                setRecords(JSON.parse(saved));
                setLoading(false);
                return;
            } catch (err) {}
        }

        // Fallback default sample data
        setRecords(initialSampleData && initialSampleData.length > 0 ? initialSampleData : [
            { id: 1, DocNo: `${moduleName ? moduleName.toUpperCase().slice(0, 3) : "DOC"}/9B/2627/001`, DocDate: "24-10-2026", Department: "RAW MATERIAL STORE 9B", ItemName: "COW LEATHER BLACK 1.2MM", Quantity: "500 SQFT", Status: "Approved", MaterialSource: "Domestic" },
            { id: 2, DocNo: `${moduleName ? moduleName.toUpperCase().slice(0, 3) : "DOC"}/9B/2627/002`, DocDate: "22-10-2026", Department: "SEMI FINISH STORE 9B", ItemName: "CANVAS DRILL LINING 10 OZ", Quantity: "1,200 MTR", Status: "Pending", MaterialSource: "Import" },
            { id: 3, DocNo: `${moduleName ? moduleName.toUpperCase().slice(0, 3) : "DOC"}/9B/2627/003`, DocDate: "20-10-2026", Department: "CUTTING DEPARTMENT", ItemName: "YKK METAL ZIPPER #5 15CM", Quantity: "3,500 PCS", Status: "Completed", MaterialSource: "Domestic" }
        ]);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [moduleName]);

    const handleCreate = (e) => {
        e.preventDefault();
        const docNumber = newItem.DocNo || `${moduleName ? moduleName.toUpperCase().slice(0, 3) : "DOC"}/9B/2627/${Math.floor(100 + Math.random() * 900)}`;
        const record = {
            ...newItem,
            id: Date.now(),
            DocNo: docNumber,
            DocDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-")
        };

        const updated = [record, ...records];
        setRecords(updated);
        localStorage.setItem(`erp_mm_${moduleName}`, JSON.stringify(updated));
        setShowModal(false);
        setNewItem({
            DocNo: "",
            Department: "Manufacturing",
            ItemName: "Fabric / Material",
            Quantity: "100",
            Remarks: "",
            Status: "Pending",
            MaterialSource: "Domestic"
        });
    };

    const filtered = useMemo(() => {
        return records.filter((r) => {
            if (searchTerm.trim()) {
                const q = searchTerm.toLowerCase();
                const match = Object.values(r).some(val =>
                    String(val || "").toLowerCase().includes(q)
                );
                if (!match) return false;
            }
            if (materialSource !== "All") {
                const src = r.MaterialSource || "Domestic";
                if (src !== materialSource) return false;
            }
            if (statusFilter !== "All") {
                const stat = String(r.Status || "Pending").toLowerCase();
                if (stat !== statusFilter.toLowerCase()) return false;
            }
            return true;
        });
    }, [records, searchTerm, materialSource, statusFilter]);

    const handleToggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(new Set(filtered.map(r => r.id || r.DocNo)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleToggleSelectRow = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleToggleStatus = (record) => {
        const id = record.id || record.DocNo;
        const newStatus = record.Status === "Approved" ? "Pending" : "Approved";
        const updated = records.map(r => (r.id === id || r.DocNo === id) ? { ...r, Status: newStatus } : r);
        setRecords(updated);
        localStorage.setItem(`erp_mm_${moduleName}`, JSON.stringify(updated));
    };

    const handleDeleteRecord = (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        const updated = records.filter(r => (r.id !== id && r.DocNo !== id));
        setRecords(updated);
        localStorage.setItem(`erp_mm_${moduleName}`, JSON.stringify(updated));
    };

    const handleBulkAction = (action) => {
        setShowBulkDropdown(false);
        if (selectedIds.size === 0) {
            alert("Please select at least one record using the checkboxes.");
            return;
        }
        const ids = Array.from(selectedIds);
        if (action === "Approve") {
            const updated = records.map(r => ids.includes(r.id || r.DocNo) ? { ...r, Status: "Approved" } : r);
            setRecords(updated);
            localStorage.setItem(`erp_mm_${moduleName}`, JSON.stringify(updated));
            setSelectedIds(new Set());
        } else if (action === "Delete") {
            if (!window.confirm(`Delete ${ids.length} selected record(s)?`)) return;
            const updated = records.filter(r => !ids.includes(r.id || r.DocNo));
            setRecords(updated);
            localStorage.setItem(`erp_mm_${moduleName}`, JSON.stringify(updated));
            setSelectedIds(new Set());
        } else if (action === "Print") {
            window.print();
        }
    };

    const handleExportCSV = () => {
        if (filtered.length === 0) return;
        const colKeys = columns.map(c => c.key);
        const colLabels = columns.map(c => c.label);
        const csvRows = filtered.map(r => colKeys.map(k => `"${r[k] || ''}"`).join(","));
        const csvContent = "data:text/csv;charset=utf-8," + [colLabels.join(","), ...csvRows].join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `${title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="po-list-page p-3">
            {/* HEADER: Title & + New Button */}
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h1 className="po-list-title mb-0">{title}</h1>
                <div>
                    <button
                        type="button"
                        className="po-btn-new-green"
                        onClick={() => setShowModal(true)}
                    >
                        <FaPlus /> New {title} <FaChevronDown style={{ fontSize: 9 }} />
                    </button>
                </div>
            </div>

            {/* TOP FILTERS MATCHING JENIXCLOUD */}
            <div className="po-list-filter-row mb-3">
                <div className="po-list-filter-group">
                    {/* Search Field */}
                    <div className="po-list-filter-col">
                        <label className="po-list-filter-label">Search / Associate</label>
                        <input
                            type="text"
                            className="po-list-search-input"
                            placeholder="Search records..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Material Source Radio */}
                    <div className="po-list-filter-col">
                        <label className="po-list-filter-label">Material Source</label>
                        <div className="po-list-radio-group">
                            <label className="po-list-radio-label">
                                <input
                                    type="radio"
                                    name={`ms_${moduleName}`}
                                    value="Domestic"
                                    checked={materialSource === "Domestic"}
                                    onChange={() => setMaterialSource("Domestic")}
                                />
                                Domestic
                            </label>
                            <label className="po-list-radio-label">
                                <input
                                    type="radio"
                                    name={`ms_${moduleName}`}
                                    value="Import"
                                    checked={materialSource === "Import"}
                                    onChange={() => setMaterialSource("Import")}
                                />
                                Import
                            </label>
                            <label className="po-list-radio-label">
                                <input
                                    type="radio"
                                    name={`ms_${moduleName}`}
                                    value="All"
                                    checked={materialSource === "All"}
                                    onChange={() => setMaterialSource("All")}
                                />
                                All
                            </label>
                        </div>
                    </div>

                    {/* Status Dropdown */}
                    <div className="po-list-filter-col">
                        <label className="po-list-filter-label">Status</label>
                        <select
                            className="po-list-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ACTION TOOLBAR */}
            <div className="po-table-toolbar">
                <div className="po-toolbar-left">
                    <button
                        type="button"
                        className="po-icon-btn"
                        onClick={loadData}
                        title="Refresh"
                        disabled={loading}
                    >
                        <FaSyncAlt className={loading ? "fa-spin" : ""} />
                    </button>
                    <button type="button" className="po-icon-btn" title="Grid View">
                        <FaThList />
                    </button>
                    <button type="button" className="po-icon-btn" title="Settings">
                        <FaCog />
                    </button>
                    <button type="button" className="po-icon-btn" title="Barcode">
                        <FaBarcode />
                    </button>
                    <button
                        type="button"
                        className="po-icon-btn"
                        onClick={handleExportCSV}
                        title="Export Excel"
                    >
                        <FaDownload />
                    </button>
                    <button
                        type="button"
                        className="po-icon-btn"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        title="Import"
                    >
                        <FaUpload />
                    </button>
                    <button type="button" className="po-icon-btn" title="Filter">
                        <FaFilter /> Filter <FaChevronDown style={{ fontSize: 9 }} />
                    </button>
                </div>

                <div className="po-toolbar-right">
                    <div style={{ position: "relative" }}>
                        <button
                            type="button"
                            className="po-btn-bulk"
                            onClick={() => setShowBulkDropdown(!showBulkDropdown)}
                        >
                            <FaThList /> Bulk Action <FaChevronDown style={{ fontSize: 9 }} />
                        </button>
                        {showBulkDropdown && (
                            <div
                                style={{
                                    position: "absolute",
                                    right: 0,
                                    top: "100%",
                                    zIndex: 1050,
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #cccccc",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                    borderRadius: 3,
                                    minWidth: 140,
                                    padding: "4px 0"
                                }}
                            >
                                <button
                                    className="dropdown-item px-3 py-1 text-success"
                                    style={{ fontSize: 11.5 }}
                                    onClick={() => handleBulkAction("Approve")}
                                >
                                    <FaCheckCircle className="me-1" /> Approve Selected
                                </button>
                                <button
                                    className="dropdown-item px-3 py-1 text-primary"
                                    style={{ fontSize: 11.5 }}
                                    onClick={() => handleBulkAction("Print")}
                                >
                                    <FaEye className="me-1" /> Print Selected
                                </button>
                                <button
                                    className="dropdown-item px-3 py-1 text-danger"
                                    style={{ fontSize: 11.5 }}
                                    onClick={() => handleBulkAction("Delete")}
                                >
                                    <FaTrash className="me-1" /> Delete Selected
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* RIBBON TABLE MATCHING JENIXCLOUD */}
            <div className="po-grid-table-container">
                <table className="po-grid-table">
                    <thead>
                        <tr>
                            <th className="text-center" style={{ width: 90 }}>Action</th>
                            {columns.map(col => (
                                <th key={col.key} className={col.key === "Quantity" ? "text-end" : ""}>{col.label}</th>
                            ))}
                            <th className="text-center" style={{ width: 35 }}>
                                <input
                                    type="checkbox"
                                    onChange={handleToggleSelectAll}
                                    checked={filtered.length > 0 && selectedIds.size === filtered.length}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <tr key={`empty-${idx}`} className="po-empty-row">
                                    {Array.from({ length: columns.length + 2 }).map((_, cIdx) => (
                                        <td key={`empty-c-${cIdx}`}>&nbsp;</td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            filtered.map((item, idx) => {
                                const id = item.id || item.DocNo || idx;
                                const isSelected = selectedIds.has(id);
                                const isApproved = item.Status === "Approved" || item.Status === "Completed";
                                return (
                                    <tr key={id} className={isSelected ? "po-row-selected" : ""}>
                                        <td className="text-center">
                                            <div className="d-flex align-items-center justify-content-center gap-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-link p-0 text-primary"
                                                    title="View"
                                                    onClick={() => {
                                                        setActiveRecord(item);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <FaEye size={12} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-link p-0 text-secondary"
                                                    title="Edit"
                                                    onClick={() => {
                                                        setActiveRecord(item);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <FaEdit size={12} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm btn-link p-0 ${isApproved ? "text-success" : "text-muted"}`}
                                                    title={isApproved ? "Approved" : "Pending (Click to Approve)"}
                                                    onClick={() => handleToggleStatus(item)}
                                                >
                                                    <FaCheckCircle size={12} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-link p-0 text-danger"
                                                    title="Delete"
                                                    onClick={() => handleDeleteRecord(id)}
                                                >
                                                    <FaTrash size={11} />
                                                </button>
                                            </div>
                                        </td>
                                        {columns.map(col => {
                                            const val = item[col.key];
                                            if (col.key === "Status") {
                                                return (
                                                    <td key={col.key}>
                                                        <Badge
                                                            bg={isApproved ? "success" : "warning"}
                                                            text={isApproved ? "white" : "dark"}
                                                            style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px" }}
                                                        >
                                                            {val || "Pending"}
                                                        </Badge>
                                                    </td>
                                                );
                                            }
                                            return (
                                                <td
                                                    key={col.key}
                                                    className={col.key === "Quantity" ? "text-end fw-semibold" : col.key === "DocNo" ? "text-primary fw-semibold" : ""}
                                                >
                                                    {val !== undefined && val !== null ? String(val) : "-"}
                                                </td>
                                            );
                                        })}
                                        <td className="text-center">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleToggleSelectRow(id)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* FOOTER SUMMARY */}
            <div className="d-flex justify-content-between align-items-center mt-2 pt-1 text-muted small" style={{ fontSize: "11px" }}>
                <div>
                    Showing <strong>{filtered.length}</strong> record(s)
                    {selectedIds.size > 0 && (
                        <span className="ms-2 badge bg-primary text-white">
                            {selectedIds.size} row(s) selected
                        </span>
                    )}
                </div>
                <div>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        style={{ fontSize: "11px", height: "24px", padding: "1px 8px" }}
                        onClick={() => window.print()}
                    >
                        Print Register
                    </Button>
                </div>
            </div>

            {/* MODAL: NEW / VIEW RECORD */}
            <Modal show={showModal} onHide={() => { setShowModal(false); setActiveRecord(null); }} size="lg">
                <Modal.Header closeButton style={{ backgroundColor: "#337ab7", color: "#ffffff", padding: "8px 16px" }}>
                    <Modal.Title style={{ fontSize: "14px", fontWeight: "700" }}>
                        {activeRecord ? `View ${title}: ${activeRecord.DocNo}` : `New ${title}`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ fontSize: "12px" }}>
                    <Form onSubmit={handleCreate}>
                        <Row className="g-2 mb-2">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="po-erp-label">Document No</Form.Label>
                                    <Form.Control
                                        size="sm"
                                        placeholder="Auto-generated if blank"
                                        value={activeRecord ? activeRecord.DocNo : newItem.DocNo}
                                        onChange={(e) => setNewItem({ ...newItem, DocNo: e.target.value })}
                                        disabled={!!activeRecord}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="po-erp-label">Department / Store</Form.Label>
                                    <Form.Control
                                        size="sm"
                                        value={activeRecord ? activeRecord.Department : newItem.Department}
                                        onChange={(e) => setNewItem({ ...newItem, Department: e.target.value })}
                                        disabled={!!activeRecord}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="g-2 mb-2">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="po-erp-label">Item / Material</Form.Label>
                                    <Form.Control
                                        size="sm"
                                        value={activeRecord ? activeRecord.ItemName : newItem.ItemName}
                                        onChange={(e) => setNewItem({ ...newItem, ItemName: e.target.value })}
                                        disabled={!!activeRecord}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="po-erp-label">Quantity</Form.Label>
                                    <Form.Control
                                        size="sm"
                                        value={activeRecord ? activeRecord.Quantity : newItem.Quantity}
                                        onChange={(e) => setNewItem({ ...newItem, Quantity: e.target.value })}
                                        disabled={!!activeRecord}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="g-2 mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="po-erp-label">Status</Form.Label>
                                    <Form.Select
                                        size="sm"
                                        value={activeRecord ? activeRecord.Status : newItem.Status}
                                        onChange={(e) => setNewItem({ ...newItem, Status: e.target.value })}
                                        disabled={!!activeRecord}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Completed">Completed</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="po-erp-label">Material Source</Form.Label>
                                    <Form.Select
                                        size="sm"
                                        value={activeRecord ? (activeRecord.MaterialSource || "Domestic") : newItem.MaterialSource}
                                        onChange={(e) => setNewItem({ ...newItem, MaterialSource: e.target.value })}
                                        disabled={!!activeRecord}
                                    >
                                        <option value="Domestic">Domestic</option>
                                        <option value="Import">Import</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" size="sm" onClick={() => { setShowModal(false); setActiveRecord(null); }}>
                                Close
                            </Button>
                            {!activeRecord && (
                                <Button variant="success" size="sm" type="submit" style={{ backgroundColor: "#5cb85c", borderColor: "#4cae4c" }}>
                                    Save Record
                                </Button>
                            )}
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
