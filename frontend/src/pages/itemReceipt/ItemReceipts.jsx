import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaSyncAlt,
  FaFileInvoice,
  FaThList,
  FaCog,
  FaBarcode,
  FaDownload,
  FaUpload,
  FaFilter,
  FaChevronDown,
  FaCheckCircle,
  FaTrash
} from "react-icons/fa";
import { Badge, Button } from "react-bootstrap";
import axios from "axios";
import "../../styles/purchaseOrder.css";

const DEFAULT_SAMPLE_GRNS = [
  {
    GRNID: 1,
    GRNNo: "GRN/AAPL9B/2627/0052",
    GRNDate: "24-10-2026",
    ApproveTag: "APPROVED",
    SupplierName: "Apex Leather Works",
    SupplierCode: "SUP-0012",
    DeliverTo: "Plot No. 9B",
    PONo: "PO-2026-0001",
    InvoiceNo: "INV-ALW-892",
    ChallanNo: "DC-ALW-104",
    Carrier: "In-House Logistics",
    EnteredBy: "Vaishnav V",
    EnteredOn: "24-10-2026 14:10",
    Quantity: 500,
    Status: "Approved",
    MaterialSource: "Domestic"
  },
  {
    GRNID: 2,
    GRNNo: "GRN/AAPL9B/2627/0051",
    GRNDate: "23-10-2026",
    ApproveTag: "PENDING",
    SupplierName: "Balaji Trims & Fasteners",
    SupplierCode: "SUP-0034",
    DeliverTo: "Plot No. 9B",
    PONo: "PO/AAPL9B/2627/0041",
    InvoiceNo: "BTF/INV/112",
    ChallanNo: "BTF/DC/44",
    Carrier: "Self Delivery",
    EnteredBy: "Admin",
    EnteredOn: "23-10-2026 11:30",
    Quantity: 5200,
    Status: "Pending",
    MaterialSource: "Domestic"
  },
  {
    GRNID: 3,
    GRNNo: "GRN/AAPL9B/2627/0050",
    GRNDate: "20-10-2026",
    ApproveTag: "APPROVED",
    SupplierName: "K-Tex Textiles",
    SupplierCode: "SUP-0056",
    DeliverTo: "Plot No. 9B",
    PONo: "PO/AAPL9B/2627/0040",
    InvoiceNo: "KTEX/26/890",
    ChallanNo: "KTEX/DC/890",
    Carrier: "V-Trans Cargo",
    EnteredBy: "Vaishnav V",
    EnteredOn: "20-10-2026 16:50",
    Quantity: 1200,
    Status: "Completed",
    MaterialSource: "Import"
  },
  {
    GRNID: 4,
    GRNNo: "GRN/AAPL9B/2627/0049",
    GRNDate: "19-10-2026",
    ApproveTag: "APPROVED",
    SupplierName: "Supreme Leathercraft",
    SupplierCode: "SUP-0021",
    DeliverTo: "Plot No. 9B",
    PONo: "PO/AAPL9B/2627/0039",
    InvoiceNo: "SLC/8812",
    ChallanNo: "SLC/DC/12",
    Carrier: "Blue Dart Surface",
    EnteredBy: "Suresh Patel",
    EnteredOn: "19-10-2026 10:15",
    Quantity: 350,
    Status: "Approved",
    MaterialSource: "Domestic"
  }
];

export default function ItemReceipts() {
  const navigate = useNavigate();

  const [grns, setGrns] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters matching JenixCloud TPCS Fashion
  const [supplierSearch, setSupplierSearch] = useState("");
  const [materialSource, setMaterialSource] = useState("All"); // Domestic | Import | All
  const [statusFilter, setStatusFilter] = useState("All"); // All | Approved | Pending | Completed | Cancelled
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showBulkDropdown, setShowBulkDropdown] = useState(false);

  const excelInputRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL || "/api";

  // ---------------------------------------
  // LOAD GRNs
  // ---------------------------------------
  const loadGRNs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/grn`);
      const data = response.data?.data || response.data || [];
      const list = Array.isArray(data) ? data : [];

      if (list.length > 0) {
        // Merge with default sample GRNs so table has rich demo data
        const merged = [...list];
        DEFAULT_SAMPLE_GRNS.forEach((def) => {
          if (!merged.some((m) => (m.GRNNo && m.GRNNo === def.GRNNo) || (m.GRNID && m.GRNID === def.GRNID))) {
            merged.push(def);
          }
        });
        setGrns(merged);
      } else {
        setGrns(DEFAULT_SAMPLE_GRNS);
      }
    } catch (error) {
      console.warn("Could not load backend GRNs, using defaults:", error);
      setGrns(DEFAULT_SAMPLE_GRNS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGRNs();
  }, []);

  // ---------------------------------------
  // FILTERED GRNs
  // ---------------------------------------
  const filteredGRNs = useMemo(() => {
    return grns.filter((grn) => {
      // Supplier Name Search
      if (supplierSearch.trim()) {
        const q = supplierSearch.toLowerCase();
        const sName = String(grn.SupplierName || grn.supplierName || "").toLowerCase();
        const gNo = String(grn.GRNNo || grn.grnNo || "").toLowerCase();
        const pNo = String(grn.PONo || grn.poNo || "").toLowerCase();
        if (!sName.includes(q) && !gNo.includes(q) && !pNo.includes(q)) return false;
      }

      // Material Source
      if (materialSource !== "All") {
        const source = grn.MaterialSource || "Domestic";
        if (source !== materialSource) return false;
      }

      // Status
      if (statusFilter !== "All") {
        const stat = String(grn.Status || grn.status || "Pending").toLowerCase();
        const tag = String(grn.ApproveTag || "").toLowerCase();
        const target = statusFilter.toLowerCase();
        if (target === "approved") {
          if (stat !== "approved" && tag !== "approved") return false;
        } else if (target === "pending") {
          if (stat !== "pending" && tag !== "pending") return false;
        } else if (stat !== target && tag !== target) {
          return false;
        }
      }

      return true;
    });
  }, [grns, supplierSearch, materialSource, statusFilter]);

  // ---------------------------------------
  // CHECKBOX SELECTION
  // ---------------------------------------
  const handleToggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredGRNs.map((g) => g.GRNID || g.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggleSelectRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ---------------------------------------
  // APPROVE STATUS TOGGLE
  // ---------------------------------------
  const handleToggleApprove = async (grn) => {
    const id = grn.GRNID || grn.id;
    const isApproved = grn.ApproveTag === "APPROVED" || grn.Status === "Approved";
    const newStatus = isApproved ? "Pending" : "Approved";
    const newTag = isApproved ? "PENDING" : "APPROVED";

    try {
      await axios.patch(`${API_URL}/grn/${id}/status`, { status: newStatus, approveTag: newTag });
    } catch (e) {}

    setGrns((prev) =>
      prev.map((g) =>
        (g.GRNID || g.id) === id ? { ...g, Status: newStatus, ApproveTag: newTag } : g
      )
    );
  };

  // ---------------------------------------
  // DELETE GRN
  // ---------------------------------------
  const handleDeleteGRN = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Item Receipt (GRN)?")) return;
    try {
      await axios.delete(`${API_URL}/grn/${id}`);
    } catch (e) {}
    setGrns((prev) => prev.filter((g) => (g.GRNID || g.id) !== id));
  };

  // ---------------------------------------
  // BULK ACTIONS
  // ---------------------------------------
  const handleBulkAction = async (action) => {
    setShowBulkDropdown(false);
    if (selectedIds.size === 0) {
      alert("Please select at least one Item Receipt using the checkboxes.");
      return;
    }
    const ids = Array.from(selectedIds);
    if (action === "Approve") {
      setGrns((prev) =>
        prev.map((g) =>
          ids.includes(g.GRNID || g.id)
            ? { ...g, Status: "Approved", ApproveTag: "APPROVED" }
            : g
        )
      );
      setSelectedIds(new Set());
      alert(`Approved ${ids.length} Item Receipt(s).`);
    } else if (action === "Delete") {
      if (!window.confirm(`Are you sure you want to delete ${ids.length} selected Item Receipt(s)?`)) return;
      setGrns((prev) => prev.filter((g) => !ids.includes(g.GRNID || g.id)));
      setSelectedIds(new Set());
    } else if (action === "Print") {
      window.print();
    }
  };

  // ---------------------------------------
  // EXPORT TO EXCEL
  // ---------------------------------------
  const handleExportExcel = () => {
    if (filteredGRNs.length === 0) return;
    const headers = [
      "GRN No", "GRN Date", "Approve Tag", "Supplier Name", "Deliver To",
      "PO No", "Invoice No", "Challan No", "Carrier", "Entered By", "Quantity", "Status"
    ];
    const rows = filteredGRNs.map((g) => [
      `"${g.GRNNo || g.grnNo || ''}"`,
      `"${g.GRNDate || g.grnDate || ''}"`,
      `"${g.ApproveTag || g.Status || ''}"`,
      `"${g.SupplierName || g.supplierName || ''}"`,
      `"${g.DeliverTo || 'Plot No. 9B'}"`,
      `"${g.PONo || g.poNo || ''}"`,
      `"${g.InvoiceNo || g.invoiceNo || ''}"`,
      `"${g.ChallanNo || ''}"`,
      `"${g.Carrier || ''}"`,
      `"${g.EnteredBy || 'Vaishnav V'}"`,
      `"${g.Quantity || g.TotalQty || 0}"`,
      `"${g.Status || 'Active'}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Item_Receipts_GRN_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="po-list-page p-3">
      {/* HEADER: Title & + New Item Receipt Button */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h1 className="po-list-title mb-0">Item Receipt</h1>
        <div>
          <button
            type="button"
            className="po-btn-new-green"
            onClick={() => navigate("/item-receipt/new")}
          >
            <FaPlus /> New Item Receipt <FaChevronDown style={{ fontSize: 9 }} />
          </button>
        </div>
      </div>

      {/* TOP FILTERS MATCHING JENIXCLOUD */}
      <div className="po-list-filter-row mb-3">
        <div className="po-list-filter-group">
          {/* Supplier Name Search */}
          <div className="po-list-filter-col">
            <label className="po-list-filter-label">Supplier Name</label>
            <input
              type="text"
              className="po-list-search-input"
              placeholder="Supplier Name Search..."
              value={supplierSearch}
              onChange={(e) => setSupplierSearch(e.target.value)}
            />
          </div>

          {/* Material Source Radio */}
          <div className="po-list-filter-col">
            <label className="po-list-filter-label">Material Source</label>
            <div className="po-list-radio-group">
              <label className="po-list-radio-label">
                <input
                  type="radio"
                  name="grnMaterialSource"
                  value="Domestic"
                  checked={materialSource === "Domestic"}
                  onChange={() => setMaterialSource("Domestic")}
                />
                Domestic
              </label>
              <label className="po-list-radio-label">
                <input
                  type="radio"
                  name="grnMaterialSource"
                  value="Import"
                  checked={materialSource === "Import"}
                  onChange={() => setMaterialSource("Import")}
                />
                Import
              </label>
              <label className="po-list-radio-label">
                <input
                  type="radio"
                  name="grnMaterialSource"
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
              <option value="Cancelled">Cancelled</option>
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
            onClick={loadGRNs}
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
            onClick={handleExportExcel}
            title="Export Excel"
          >
            <FaDownload />
          </button>
          <button
            type="button"
            className="po-icon-btn"
            onClick={() => excelInputRef.current && excelInputRef.current.click()}
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
              <th>GRN No</th>
              <th>GRN Date</th>
              <th>Approve Tag</th>
              <th>Supplier Name</th>
              <th>Deliver To</th>
              <th>PO No</th>
              <th>Invoice No</th>
              <th>Challan No</th>
              <th>Entered By</th>
              <th>Entered On</th>
              <th className="text-end">Quantity</th>
              <th>Status</th>
              <th className="text-center" style={{ width: 35 }}>
                <input
                  type="checkbox"
                  onChange={handleToggleSelectAll}
                  checked={
                    filteredGRNs.length > 0 &&
                    selectedIds.size === filteredGRNs.length
                  }
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredGRNs.length === 0 ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <tr key={`empty-${idx}`} className="po-empty-row">
                  {Array.from({ length: 14 }).map((_, cIdx) => (
                    <td key={`empty-c-${cIdx}`}>&nbsp;</td>
                  ))}
                </tr>
              ))
            ) : (
              filteredGRNs.map((grn) => {
                const id = grn.GRNID || grn.GRNId || grn.grnId || grn.id;
                const isSelected = selectedIds.has(id);
                const isApproved = grn.ApproveTag === "APPROVED" || grn.Status === "Approved" || grn.Status === "Completed";
                return (
                  <tr
                    key={id}
                    className={isSelected ? "po-row-selected" : ""}
                  >
                    <td className="text-center">
                      <div className="d-flex align-items-center justify-content-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-primary"
                          title="View / Print GRN"
                          onClick={() => navigate(`/item-receipt/view/${id}`)}
                        >
                          <FaEye size={12} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-secondary"
                          title="Edit GRN"
                          onClick={() => navigate(`/item-receipt/edit/${id}`)}
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm btn-link p-0 ${isApproved ? "text-success" : "text-muted"}`}
                          title={isApproved ? "Approved (Click to change)" : "Pending (Click to Approve)"}
                          onClick={() => handleToggleApprove(grn)}
                        >
                          <FaCheckCircle size={12} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-danger"
                          title="Delete GRN"
                          onClick={() => handleDeleteGRN(id)}
                        >
                          <FaTrash size={11} />
                        </button>
                      </div>
                    </td>
                    <td>
                      <span
                        className="text-primary fw-semibold"
                        style={{ cursor: "pointer", textDecoration: "underline" }}
                        onClick={() => navigate(`/item-receipt/view/${id}`)}
                      >
                        {grn.GRNNo || grn.grnNo || `GRN-${id}`}
                      </span>
                    </td>
                    <td>{grn.GRNDate || grn.grnDate || grn.CreatedAt || "-"}</td>
                    <td>
                      <Badge
                        bg={isApproved ? "success" : "warning"}
                        text={isApproved ? "white" : "dark"}
                        style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px" }}
                      >
                        {grn.ApproveTag || (isApproved ? "APPROVED" : "PENDING")}
                      </Badge>
                    </td>
                    <td className="fw-medium">{grn.SupplierName || grn.supplierName || "-"}</td>
                    <td>{grn.DeliverTo || "Plot No. 9B"}</td>
                    <td>
                      <span className="text-secondary">{grn.PONo || grn.poNo || "-"}</span>
                    </td>
                    <td>{grn.InvoiceNo || grn.invoiceNo || "-"}</td>
                    <td>{grn.ChallanNo || "-"}</td>
                    <td>{grn.EnteredBy || "Vaishnav V"}</td>
                    <td>{grn.EnteredOn || grn.CreatedAt || "-"}</td>
                    <td className="text-end fw-semibold">
                      {Number(grn.Quantity || grn.TotalQty || 0).toLocaleString()}
                    </td>
                    <td>
                      <Badge
                        bg={
                          isApproved
                            ? "success"
                            : grn.Status === "Pending"
                            ? "warning"
                            : "secondary"
                        }
                        text={grn.Status === "Pending" ? "dark" : "white"}
                        style={{ fontSize: 10 }}
                      >
                        {grn.Status || "Active"}
                      </Badge>
                    </td>
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
          Showing <strong>{filteredGRNs.length}</strong> Item Receipt(s)
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
    </div>
  );
}