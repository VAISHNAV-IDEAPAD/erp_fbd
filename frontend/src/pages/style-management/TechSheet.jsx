import "../../styles/techSheetPrint.css";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
  Badge,
  Modal,
  Alert,
  Spinner,
  Nav,
  Tab,
  InputGroup
} from "react-bootstrap";
import {
  FaPlus,
  FaSearch,
  FaSync,
  FaEdit,
  FaTrash,
  FaFileAlt,
  FaCheck,
  FaTimes,
  FaPrint,
  FaHistory,
  FaLock,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaBoxes,
  FaTools,
  FaShieldAlt,
  FaRuler,
  FaPalette,
  FaClipboardList,
  FaInfoCircle
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getTechSheets,
  getTechSheetById,
  createTechSheet,
  updateTechSheet,
  deleteTechSheet,
  submitTechSheet,
  approveTechSheet,
  rejectTechSheet,
  createRevision,
  getStyles,
  getStyleById,
  getItems
} from "../../services/styleManagementService";

export default function TechSheet() {
  const location = useLocation();
  const navigate = useNavigate();

  // URL search params
  const searchParams = new URLSearchParams(location.search);
  const paramStyleId = searchParams.get("style_id");
  const paramCreateForStyle = searchParams.get("create_for_style");
  const paramTechSheetId = searchParams.get("id");

  // Data states
  const [techSheets, setTechSheets] = useState([]);
  const [stylesList, setStylesList] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStyleFilter, setSelectedStyleFilter] = useState(paramStyleId || "");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("");

  // Modals
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printSheetData, setPrintSheetData] = useState(null);

  // Approval Action Modals
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState("approve"); // approve | reject
  const [approvalRemarks, setApprovalRemarks] = useState("");
  const [targetTechSheetId, setTargetTechSheetId] = useState(null);

  // Form State for 10-Tab Editor
  const initialForm = {
    tech_sheet_id: null,
    style_id: "",
    tech_sheet_no: "",
    revision: "01",
    version: "1.0",
    status: "Draft",
    sample_no: "",
    effective_date: new Date().toISOString().slice(0, 10),
    prepared_by: "Admin",
    remarks: "",
    dimensions: [],
    materials: [],
    components: [],
    construction: {
      construction_method: "Turned Edge Stitched",
      stitch_type: "Lockstitch 301",
      stitch_density: "Regular balanced tension",
      spi: "7-8 SPI",
      thread_type: "Bonded Nylon / Serafil",
      thread_size: "Tex 70 (No. 40)",
      seam_allowance: "8 mm",
      skiving_requirement: "Bevel skive 0.4mm on edges",
      edge_treatment: "Italian acrylic edge paint, 3 coats with sanding",
      edge_paint: "Fenice Matt Dark Brown",
      folding_requirement: "Clean 8mm fold",
      adhesive_requirement: "Water-based polyurethane cement",
      reinforcement_requirement: "Salpa 0.6mm in base panel",
      special_notes: ""
    },
    colors: [],
    operations: [],
    quality: [],
    packaging: {
      polybag_type: "Self-adhesive LDPE vented",
      polybag_size: "500 x 600 mm",
      hangtag: "Brand Embossed Hangtag with hemp cord",
      barcode: "EAN-13 Barcode Sticker",
      sticker: "Care label inside pocket",
      dust_bag: "100% Non-woven 90 GSM with logo",
      box: "None",
      carton: "5-Ply Export Corrugated",
      carton_qty: 10,
      packing_instruction: "Stuff bag with acid-free tissue paper to preserve 3D silhouette. Insert 2x silica gel.",
      special_packaging_instruction: "Store below 60% humidity."
    }
  };

  const [formData, setFormData] = useState(initialForm);
  const [selectedStyleDetail, setSelectedStyleDetail] = useState(null);

  // ==========================================
  // LOAD DATA
  // ==========================================
  useEffect(() => {
    loadLookups();
    loadTechSheets();
  }, [selectedStyleFilter, selectedStatusFilter]);

  useEffect(() => {
    if (paramCreateForStyle && stylesList.length > 0) {
      handleOpenCreate(paramCreateForStyle);
    }
  }, [paramCreateForStyle, stylesList]);

  useEffect(() => {
    if (paramTechSheetId) {
      handleOpenPrint(paramTechSheetId);
    }
  }, [paramTechSheetId]);

  const loadLookups = async () => {
    try {
      const [sRes, iRes] = await Promise.all([getStyles(), getItems()]);
      setStylesList(Array.isArray(sRes.data) ? sRes.data : (sRes.data.data || []));
      setItemsList(Array.isArray(iRes.data) ? iRes.data : (iRes.data.data || []));
    } catch (err) {
      console.error("Failed to load lookups:", err);
    }
  };

  const loadTechSheets = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedStyleFilter) params.style_id = selectedStyleFilter;
      if (selectedStatusFilter) params.status = selectedStatusFilter;
      const res = await getTechSheets(params);
      setTechSheets(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load Tech Sheets.");
    } finally {
      setLoading(false);
    }
  };

  // Filtered Sheets
  const filteredSheets = useMemo(() => {
    return techSheets.filter((ts) => {
      const matchesSearch =
        !searchTerm ||
        (ts.tech_sheet_no && ts.tech_sheet_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ts.style_no && ts.style_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ts.style_name && ts.style_name.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [techSheets, searchTerm]);

  // When style_id is selected in editor
  const handleStyleSelect = async (styleId) => {
    setFormData((prev) => ({ ...prev, style_id: styleId }));
    if (!styleId) {
      setSelectedStyleDetail(null);
      return;
    }
    try {
      const res = await getStyleById(styleId);
      const s = res.data;
      setSelectedStyleDetail(s);

      // Auto-populate dimensions if empty
      if (formData.dimensions.length === 0 && s.sizes && s.sizes.length > 0) {
        const defaultDims = [
          { dimension_type: "Body Height", specification: "Vertical height from base to rim", value: s.sizes[0].height || 30, tolerance_minus: 0.5, tolerance_plus: 0.5, uom: "cm", remarks: "" },
          { dimension_type: "Body Width (Base)", specification: "Horizontal base width seam to seam", value: s.sizes[0].length || 35, tolerance_minus: 0.5, tolerance_plus: 0.5, uom: "cm", remarks: "" },
          { dimension_type: "Gusset / Depth", specification: "Bottom panel depth front to back", value: s.sizes[0].gusset || 12, tolerance_minus: 0.3, tolerance_plus: 0.3, uom: "cm", remarks: "" },
          { dimension_type: "Handle Drop", specification: "Vertical drop from handle peak to bag opening", value: s.sizes[0].handle_drop || 22, tolerance_minus: 0.5, tolerance_plus: 0.5, uom: "cm", remarks: "" }
        ];
        setFormData((prev) => ({ ...prev, dimensions: defaultDims }));
      }

      // Auto-populate colors if empty
      if (formData.colors.length === 0 && s.colors && s.colors.length > 0) {
        const defaultCols = s.colors.map((c) => ({
          color_code: c.color_code,
          color_name: c.color_name,
          pantone: c.pantone || "",
          main_material_color: c.material_color || c.color_name,
          lining_color: "Sand Beige Twill",
          thread_color: "Tone on Tone",
          hardware_color: "Antique Brass",
          edge_paint_color: "Dark Brown"
        }));
        setFormData((prev) => ({ ...prev, colors: defaultCols }));
      }
    } catch (err) {
      console.error("Failed to load style details:", err);
    }
  };

  // ==========================================
  // ACTIONS
  // ==========================================
  const handleOpenCreate = (preStyleId = "") => {
    setIsEditing(false);
    const newForm = {
      ...initialForm,
      style_id: preStyleId || selectedStyleFilter || "",
      dimensions: [
        { dimension_type: "Body Height", specification: "Vertical height from base to rim", value: 30, tolerance_minus: 0.5, tolerance_plus: 0.5, uom: "cm", remarks: "" },
        { dimension_type: "Body Width (Base)", specification: "Horizontal base width", value: 35, tolerance_minus: 0.5, tolerance_plus: 0.5, uom: "cm", remarks: "" },
        { dimension_type: "Gusset / Depth", specification: "Bottom panel depth", value: 14, tolerance_minus: 0.3, tolerance_plus: 0.3, uom: "cm", remarks: "" }
      ],
      materials: [
        { line_no: 1, item_id: "", material_code: "", material_name: "", material_type: "Main Leather", specification: "Cowhide Napa", color: "", thickness: "1.2 - 1.4 mm", width: "50 sqft", consumption: 14.5, uom: "SQFT", wastage_percent: 10, remarks: "" }
      ],
      components: [
        { line_no: 1, item_id: "", item_code: "", component_name: "Metal Zipper #5", component_type: "Hardware", specification: "Antique Brass", color: "Antique Brass", size: "38 cm", qty: 1, uom: "PCS", remarks: "" }
      ],
      operations: [
        { sequence: 1, operation_code: "OP-01", operation_name: "Leather Cutting", work_center: "Cutting Dept", machine: "Clicker Press", smv: 4.5, skill_level: "Skilled", subcontract: "No", remarks: "" },
        { sequence: 2, operation_code: "OP-02", operation_name: "Edge Skiving & Splitting", work_center: "Preparation", machine: "Fortuna Skiving", smv: 3.0, skill_level: "Skilled", subcontract: "No", remarks: "" },
        { sequence: 3, operation_code: "OP-03", operation_name: "Main Body Stitching", work_center: "Stitching Line", machine: "Post Bed Machine", smv: 12.0, skill_level: "Master Artisan", subcontract: "No", remarks: "" },
        { sequence: 4, operation_code: "OP-04", operation_name: "Final Inspection & Packing", work_center: "QC & Finishing", machine: "Manual", smv: 3.5, skill_level: "General", subcontract: "No", remarks: "" }
      ],
      quality: [
        { inspection_point: "Overall Dimensions", specification: "Length, Width, Height", standard: "AQL 1.5", tolerance: "+/- 5mm", inspection_method: "Steel Ruler", critical: "Yes", remarks: "" },
        { inspection_point: "Stitch Uniformity", specification: "7-8 SPI without skipped stitches", standard: "ISO 4915 #301", tolerance: "+/- 0.5 SPI", inspection_method: "Magnifier Gauge", critical: "Yes", remarks: "" }
      ]
    };
    setFormData(newForm);
    setActiveTab("general");
    setShowEditorModal(true);
    if (preStyleId) {
      handleStyleSelect(preStyleId);
    }
  };

  const handleOpenEdit = async (sheetId) => {
    try {
      const res = await getTechSheetById(sheetId);
      const d = res.data;
      const sheet = d.sheet;

      setFormData({
        tech_sheet_id: sheet.tech_sheet_id,
        style_id: sheet.style_id,
        tech_sheet_no: sheet.tech_sheet_no,
        revision: sheet.revision,
        version: sheet.version,
        status: sheet.status,
        sample_no: sheet.sample_no || "",
        effective_date: sheet.effective_date || "",
        prepared_by: sheet.prepared_by || "Admin",
        remarks: sheet.remarks || "",
        dimensions: d.dimensions || [],
        materials: d.materials || [],
        components: d.components || [],
        construction: d.construction || initialForm.construction,
        colors: d.colors || [],
        operations: d.operations || [],
        quality: d.quality || [],
        packaging: d.packaging || initialForm.packaging
      });

      setSelectedStyleDetail(sheet);
      setIsEditing(true);
      setActiveTab("general");
      setShowEditorModal(true);
    } catch (err) {
      alert("Failed to load Tech Sheet: " + (err.response?.data?.message || err.message));
    }
  };

  const handleOpenPrint = async (sheetId) => {
    try {
      const res = await getTechSheetById(sheetId);
      setPrintSheetData(res.data);
      setShowPrintModal(true);
    } catch (err) {
      alert("Failed to load Tech Sheet for printing: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSaveTechSheet = async (e) => {
    e.preventDefault();
    if (!formData.style_id) {
      alert("Please select a Style for this Tech Sheet.");
      return;
    }

    try {
      if (isEditing) {
        await updateTechSheet(formData.tech_sheet_id, formData);
        setSuccessMsg("Tech Sheet updated successfully.");
      } else {
        await createTechSheet(formData);
        setSuccessMsg("Tech Sheet created successfully.");
      }
      setShowEditorModal(false);
      loadTechSheets();
    } catch (err) {
      alert("Failed to save Tech Sheet: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (sheetId, sheetNo, status) => {
    if (status === "Approved") {
      alert("Approved Tech Sheets cannot be deleted for audit integrity.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete Tech Sheet "${sheetNo}"?`)) return;
    try {
      await deleteTechSheet(sheetId);
      setSuccessMsg("Tech Sheet deleted successfully.");
      loadTechSheets();
    } catch (err) {
      alert("Failed to delete Tech Sheet: " + (err.response?.data?.message || err.message));
    }
  };

  // Workflow Actions
  const handleSubmitForApproval = async (sheetId) => {
    if (!window.confirm("Submit this Tech Sheet for review & approval?")) return;
    try {
      await submitTechSheet(sheetId, { submitted_by: "Merchandiser" });
      setSuccessMsg("Tech Sheet submitted for approval.");
      loadTechSheets();
    } catch (err) {
      alert("Failed to submit: " + (err.response?.data?.message || err.message));
    }
  };

  const handleOpenApprovalDialog = (sheetId, action) => {
    setTargetTechSheetId(sheetId);
    setApprovalAction(action);
    setApprovalRemarks("");
    setShowApprovalModal(true);
  };

  const handleExecuteApproval = async () => {
    try {
      if (approvalAction === "approve") {
        await approveTechSheet(targetTechSheetId, {
          approved_by: "QA Director",
          approval_remarks: approvalRemarks
        });
        setSuccessMsg("Tech Sheet Approved and Locked successfully!");
      } else {
        if (!approvalRemarks) {
          alert("Please enter a rejection reason.");
          return;
        }
        await rejectTechSheet(targetTechSheetId, {
          rejection_reason: approvalRemarks,
          rejected_by: "QA Director"
        });
        setSuccessMsg("Tech Sheet has been rejected.");
      }
      setShowApprovalModal(false);
      loadTechSheets();
    } catch (err) {
      alert("Action failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateRevision = async (sheetId, sheetNo) => {
    if (!window.confirm(`Create a new revision clone of "${sheetNo}"?\n\nA new Draft revision will be created with all specifications pre-copied.`)) return;
    try {
      const res = await createRevision(sheetId);
      setSuccessMsg(res.data.message || `Revision ${res.data.revision} created successfully!`);
      loadTechSheets();
      handleOpenEdit(res.data.tech_sheet_id);
    } catch (err) {
      alert("Failed to create revision: " + (err.response?.data?.message || err.message));
    }
  };

  // Dynamic Item Selection Helper
  const handleMaterialItemSelect = (index, itemId) => {
    const selectedItem = itemsList.find((i) => String(i.ItemID) === String(itemId));
    const updated = [...formData.materials];
    if (selectedItem) {
      updated[index] = {
        ...updated[index],
        item_id: selectedItem.ItemID,
        material_code: selectedItem.ItemCode,
        material_name: selectedItem.ItemName,
        material_type: selectedItem.MaterialType || selectedItem.Category || "Main Material",
        uom: selectedItem.UOM || "MTR"
      };
    } else {
      updated[index] = { ...updated[index], item_id: "" };
    }
    setFormData({ ...formData, materials: updated });
  };

  const handleComponentItemSelect = (index, itemId) => {
    const selectedItem = itemsList.find((i) => String(i.ItemID) === String(itemId));
    const updated = [...formData.components];
    if (selectedItem) {
      updated[index] = {
        ...updated[index],
        item_id: selectedItem.ItemID,
        item_code: selectedItem.ItemCode,
        component_name: selectedItem.ItemName,
        uom: selectedItem.UOM || "PCS"
      };
    } else {
      updated[index] = { ...updated[index], item_id: "" };
    }
    setFormData({ ...formData, components: updated });
  };

  // Total SMV calculation
  const totalSMV = useMemo(() => {
    return (formData.operations || []).reduce((acc, curr) => acc + (parseFloat(curr.smv) || 0), 0);
  }, [formData.operations]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <Badge bg="success"><FaCheckCircle className="me-1" /> Approved</Badge>;
      case "Pending Approval":
        return <Badge bg="warning" text="dark"><FaHistory className="me-1" /> Pending Approval</Badge>;
      case "Rejected":
        return <Badge bg="danger"><FaTimesCircle className="me-1" /> Rejected</Badge>;
      default:
        return <Badge bg="secondary">Draft</Badge>;
    }
  };

  return (
    <Container fluid className="py-3 px-4">
      {/* Header Banner */}
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
        <div>
          <h4 className="mb-1 text-primary fw-bold">
            <FaFileAlt className="me-2 text-primary" />
            Tech Sheet (Technical Specification Sheet)
          </h4>
          <p className="text-muted mb-0 small">
            Factory master technical specification sheet linking Style Master with Item Master BOM, Operations & Quality standards
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" onClick={loadTechSheets} disabled={loading}>
            <FaSync className={loading ? "fa-spin me-1" : "me-1"} /> Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => handleOpenCreate()}>
            <FaPlus className="me-1" /> New Tech Sheet
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)} className="py-2 small">
          {successMsg}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="py-2 small">
          {error}
        </Alert>
      )}

      {/* Filter Card */}
      <Card className="mb-3 shadow-sm border-0 bg-light">
        <Card.Body className="py-2">
          <Row className="g-2 align-items-center">
            <Col md={5}>
              <InputGroup size="sm">
                <InputGroup.Text><FaSearch /></InputGroup.Text>
                <Form.Control
                  placeholder="Search Tech Sheet No, Style No, Style Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                size="sm"
                value={selectedStyleFilter}
                onChange={(e) => setSelectedStyleFilter(e.target.value)}
              >
                <option value="">All Styles</option>
                {stylesList.map((s) => (
                  <option key={s.style_id} value={s.style_id}>
                    {s.style_no} - {s.style_name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                size="sm"
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </Form.Select>
            </Col>
            <Col md={2} className="text-end">
              <span className="small text-muted fw-semibold">
                Total: {filteredSheets.length} sheet(s)
              </span>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tech Sheets List Table */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted small">Loading Tech Sheets...</p>
            </div>
          ) : filteredSheets.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaFileAlt size={36} className="mb-2 text-secondary opacity-50" />
              <p className="mb-2">No Tech Sheets found matching criteria.</p>
              <Button variant="outline-primary" size="sm" onClick={() => handleOpenCreate()}>
                <FaPlus className="me-1" /> Create First Tech Sheet
              </Button>
            </div>
          ) : (
            <Table hover responsive className="align-middle mb-0 text-nowrap" style={{ fontSize: "13px" }}>
              <thead className="table-light text-secondary">
                <tr>
                  <th style={{ width: "170px" }}>Tech Sheet No</th>
                  <th>Style Information</th>
                  <th>Customer</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Effective Date</th>
                  <th className="text-center">Materials</th>
                  <th className="text-center">Operations</th>
                  <th className="text-center" style={{ width: "230px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSheets.map((ts) => (
                  <tr key={ts.tech_sheet_id} className={ts.status === "Approved" ? "table-light" : ""}>
                    <td>
                      <div className="fw-bold text-primary font-monospace">{ts.tech_sheet_no}</div>
                      <div className="small text-muted">
                        Rev: <Badge bg="dark">{ts.revision || "01"}</Badge>
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{ts.style_name}</div>
                      <div className="small text-muted font-monospace">{ts.style_no} • {ts.product_category}</div>
                    </td>
                    <td>{ts.CustomerName || "—"}</td>
                    <td>
                      <Badge bg="light" text="dark" className="border">v{ts.version || "1.0"}</Badge>
                    </td>
                    <td>{getStatusBadge(ts.status)}</td>
                    <td className="small text-muted">{ts.effective_date || "—"}</td>
                    <td className="text-center">
                      <Badge bg="info" text="dark" className="rounded-pill px-2">
                        {ts.material_count || 0} Items
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Badge bg="secondary" className="rounded-pill px-2">
                        {ts.operation_count || 0} Steps
                      </Badge>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-1">
                        {/* Print / Preview */}
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="py-0 px-2"
                          title="Print Factory Specification Sheet"
                          onClick={() => handleOpenPrint(ts.tech_sheet_id)}
                        >
                          <FaPrint className="me-1" /> Spec
                        </Button>

                        {/* Edit Button */}
                        <Button
                          variant={ts.status === "Approved" ? "light" : "outline-primary"}
                          size="sm"
                          className="py-0 px-2"
                          title={ts.status === "Approved" ? "Locked (Approved)" : "Edit Tech Sheet"}
                          onClick={() => handleOpenEdit(ts.tech_sheet_id)}
                        >
                          {ts.status === "Approved" ? <FaLock className="text-muted" /> : <FaEdit />}
                        </Button>

                        {/* Submit if Draft */}
                        {ts.status === "Draft" && (
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="py-0 px-2 text-dark"
                            title="Submit for Approval"
                            onClick={() => handleSubmitForApproval(ts.tech_sheet_id)}
                          >
                            Submit
                          </Button>
                        )}

                        {/* Approve/Reject if Pending */}
                        {ts.status === "Pending Approval" && (
                          <>
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="py-0 px-1"
                              title="Approve Tech Sheet"
                              onClick={() => handleOpenApprovalDialog(ts.tech_sheet_id, "approve")}
                            >
                              <FaCheck />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="py-0 px-1"
                              title="Reject Tech Sheet"
                              onClick={() => handleOpenApprovalDialog(ts.tech_sheet_id, "reject")}
                            >
                              <FaTimes />
                            </Button>
                          </>
                        )}

                        {/* New Revision if Approved */}
                        {ts.status === "Approved" && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            className="py-0 px-2 small"
                            title="Create Next Revision Clone (e.g. 02, 03)"
                            onClick={() => handleCreateRevision(ts.tech_sheet_id, ts.tech_sheet_no)}
                          >
                            + Rev
                          </Button>
                        )}

                        {/* Delete if not approved */}
                        {ts.status !== "Approved" && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="py-0 px-2"
                            title="Delete Tech Sheet"
                            onClick={() => handleDelete(ts.tech_sheet_id, ts.tech_sheet_no, ts.status)}
                          >
                            <FaTrash />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* ========================================================
          10-TAB TECH SHEET EDITOR MODAL
      ======================================================== */}
      <Modal show={showEditorModal} onHide={() => setShowEditorModal(false)} size="xl" backdrop="static">
        <Form onSubmit={handleSaveTechSheet}>
          <Modal.Header closeButton className="bg-light py-2">
            <div className="d-flex align-items-center justify-content-between w-100 me-3">
              <Modal.Title className="h6 fw-bold mb-0 text-primary">
                {isEditing ? (
                  <>
                    <FaEdit className="me-2" /> Tech Sheet: {formData.tech_sheet_no} (Rev {formData.revision})
                  </>
                ) : (
                  <>
                    <FaPlus className="me-2" /> New Technical Specification Sheet
                  </>
                )}
              </Modal.Title>
              <div className="d-flex align-items-center gap-2">
                {getStatusBadge(formData.status)}
                {formData.status === "Approved" && (
                  <span className="small text-danger fw-semibold">
                    <FaLock className="me-1" /> Locked (Read-Only)
                  </span>
                )}
              </div>
            </div>
          </Modal.Header>

          <Modal.Body className="p-3">
            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <Nav variant="tabs" className="mb-3 small fw-semibold flex-nowrap overflow-auto">
                <Nav.Item><Nav.Link eventKey="general">1. General</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="dimensions">2. Dimensions</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="materials">3. Materials (BOM)</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="components">4. Components & Hardware</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="construction">5. Construction</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="colors">6. Colors</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="operations">7. Operations ({totalSMV.toFixed(1)} SMV)</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="quality">8. Quality Specs</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="packaging">9. Packaging</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="approval">10. Approvals</Nav.Link></Nav.Item>
              </Nav>

              <Tab.Content>
                {/* 1. GENERAL TAB */}
                <Tab.Pane eventKey="general">
                  <Row className="g-3">
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold text-danger">Target Style Master *</Form.Label>
                        <Form.Select
                          size="sm"
                          required
                          disabled={isEditing}
                          value={formData.style_id}
                          onChange={(e) => handleStyleSelect(e.target.value)}
                        >
                          <option value="">Select Finished Style...</option>
                          {stylesList.map((s) => (
                            <option key={s.style_id} value={s.style_id}>
                              {s.style_no} - {s.style_name} ({s.product_category})
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Tech Sheet No</Form.Label>
                        <Form.Control
                          size="sm"
                          placeholder="Auto-generated (e.g. TS-STYLE-01)"
                          disabled={isEditing}
                          value={formData.tech_sheet_no}
                          onChange={(e) => setFormData({ ...formData, tech_sheet_no: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Revision</Form.Label>
                        <Form.Control
                          size="sm"
                          disabled
                          value={formData.revision}
                        />
                      </Form.Group>
                    </Col>

                    {/* Style Quick Overview Card */}
                    {selectedStyleDetail && (
                      <Col md={12}>
                        <div className="p-3 bg-light rounded border">
                          <Row className="g-2 small">
                            <Col md={3}>
                              <span className="text-muted">Customer:</span>{" "}
                              <strong>{selectedStyleDetail.CustomerName || "—"}</strong>
                            </Col>
                            <Col md={3}>
                              <span className="text-muted">Product Type:</span>{" "}
                              <strong>{selectedStyleDetail.product_type || "—"}</strong>
                            </Col>
                            <Col md={3}>
                              <span className="text-muted">Bag Type:</span>{" "}
                              <strong>{selectedStyleDetail.bag_type || "—"}</strong>
                            </Col>
                            <Col md={3}>
                              <span className="text-muted">Season:</span>{" "}
                              <strong>{selectedStyleDetail.season || "—"}</strong>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    )}

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Sample No / Reference</Form.Label>
                        <Form.Control
                          size="sm"
                          placeholder="e.g. SMP-TOTE-001"
                          value={formData.sample_no}
                          onChange={(e) => setFormData({ ...formData, sample_no: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Effective Date</Form.Label>
                        <Form.Control
                          type="date"
                          size="sm"
                          value={formData.effective_date}
                          onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Prepared By</Form.Label>
                        <Form.Control
                          size="sm"
                          value={formData.prepared_by}
                          onChange={(e) => setFormData({ ...formData, prepared_by: e.target.value })}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">General Remarks / Change Notes</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          size="sm"
                          placeholder="General engineering instructions or revisions history..."
                          value={formData.remarks}
                          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab.Pane>

                {/* 2. DIMENSIONS TAB */}
                <Tab.Pane eventKey="dimensions">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted fw-semibold">
                      Factory finished product dimensions and measurement tolerances.
                    </span>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          dimensions: [
                            ...formData.dimensions,
                            { dimension_type: "", specification: "", value: 0, tolerance_minus: 0.5, tolerance_plus: 0.5, uom: "cm", remarks: "" }
                          ]
                        })
                      }
                    >
                      <FaPlus className="me-1" /> Add Measurement
                    </Button>
                  </div>

                  <Table bordered hover responsive size="sm" className="align-middle text-nowrap" style={{ fontSize: "12px" }}>
                    <thead className="table-light">
                      <tr>
                        <th>Dimension / Point of Measure *</th>
                        <th>Specification Description</th>
                        <th style={{ width: "90px" }}>Value *</th>
                        <th style={{ width: "80px" }}>Tol (-)</th>
                        <th style={{ width: "80px" }}>Tol (+)</th>
                        <th style={{ width: "70px" }}>Unit</th>
                        <th>Remarks / Method</th>
                        <th style={{ width: "40px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.dimensions.map((d, idx) => (
                        <tr key={idx}>
                          <td>
                            <Form.Control
                              size="sm"
                              required
                              placeholder="e.g. Body Height"
                              value={d.dimension_type || ""}
                              onChange={(e) => {
                                const arr = [...formData.dimensions];
                                arr[idx].dimension_type = e.target.value;
                                setFormData({ ...formData, dimensions: arr });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              placeholder="e.g. Base seam to top rim"
                              value={d.specification || ""}
                              onChange={(e) => {
                                const arr = [...formData.dimensions];
                                arr[idx].specification = e.target.value;
                                setFormData({ ...formData, dimensions: arr });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              step="0.1"
                              size="sm"
                              value={d.value || ""}
                              onChange={(e) => {
                                const arr = [...formData.dimensions];
                                arr[idx].value = e.target.value;
                                setFormData({ ...formData, dimensions: arr });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              step="0.1"
                              size="sm"
                              value={d.tolerance_minus || ""}
                              onChange={(e) => {
                                const arr = [...formData.dimensions];
                                arr[idx].tolerance_minus = e.target.value;
                                setFormData({ ...formData, dimensions: arr });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              step="0.1"
                              size="sm"
                              value={d.tolerance_plus || ""}
                              onChange={(e) => {
                                const arr = [...formData.dimensions];
                                arr[idx].tolerance_plus = e.target.value;
                                setFormData({ ...formData, dimensions: arr });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Select
                              size="sm"
                              value={d.uom || "cm"}
                              onChange={(e) => {
                                const arr = [...formData.dimensions];
                                arr[idx].uom = e.target.value;
                                setFormData({ ...formData, dimensions: arr });
                              }}
                            >
                              <option value="cm">cm</option>
                              <option value="inch">in</option>
                              <option value="mm">mm</option>
                            </Form.Select>
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              placeholder="Measurement notes..."
                              value={d.remarks || ""}
                              onChange={(e) => {
                                const arr = [...formData.dimensions];
                                arr[idx].remarks = e.target.value;
                                setFormData({ ...formData, dimensions: arr });
                              }}
                            />
                          </td>
                          <td className="text-center">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="p-1"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  dimensions: formData.dimensions.filter((_, i) => i !== idx)
                                });
                              }}
                            >
                              <FaTrash size={12} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab.Pane>

                {/* 3. MATERIALS (BOM) TAB */}
                <Tab.Pane eventKey="materials">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted fw-semibold">
                      Raw materials BOM linked with Item Master. Define unit consumption & wastage %.
                    </span>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          materials: [
                            ...formData.materials,
                            { line_no: formData.materials.length + 1, item_id: "", material_code: "", material_name: "", material_type: "Main Leather", specification: "", color: "", thickness: "", width: "", consumption: 1, uom: "SQFT", wastage_percent: 5, remarks: "" }
                          ]
                        })
                      }
                    >
                      <FaPlus className="me-1" /> Add Material Row
                    </Button>
                  </div>

                  <Table bordered hover responsive size="sm" className="align-middle text-nowrap" style={{ fontSize: "12px" }}>
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Link Item Master</th>
                        <th>Material Name *</th>
                        <th>Type / Placement</th>
                        <th>Color / Spec</th>
                        <th>Thickness / Width</th>
                        <th style={{ width: "90px" }}>Consumption *</th>
                        <th style={{ width: "70px" }}>Unit</th>
                        <th style={{ width: "80px" }}>Waste %</th>
                        <th>Total Req.</th>
                        <th style={{ width: "40px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.materials.map((m, idx) => {
                        const cons = parseFloat(m.consumption) || 0;
                        const waste = parseFloat(m.wastage_percent) || 0;
                        const totalReq = (cons * (1 + waste / 100)).toFixed(2);
                        return (
                          <tr key={idx}>
                            <td className="text-center">{idx + 1}</td>
                            <td style={{ minWidth: "160px" }}>
                              <Form.Select
                                size="sm"
                                value={m.item_id || ""}
                                onChange={(e) => handleMaterialItemSelect(idx, e.target.value)}
                              >
                                <option value="">Select Item Master...</option>
                                {itemsList.map((it) => (
                                  <option key={it.ItemID} value={it.ItemID}>
                                    {it.ItemCode} - {it.ItemName}
                                  </option>
                                ))}
                              </Form.Select>
                            </td>
                            <td>
                              <Form.Control
                                size="sm"
                                required
                                placeholder="e.g. Cow Napa Leather"
                                value={m.material_name || ""}
                                onChange={(e) => {
                                  const arr = [...formData.materials];
                                  arr[idx].material_name = e.target.value;
                                  setFormData({ ...formData, materials: arr });
                                }}
                              />
                            </td>
                            <td style={{ width: "120px" }}>
                              <Form.Control
                                size="sm"
                                placeholder="Main / Lining / Trim"
                                value={m.material_type || ""}
                                onChange={(e) => {
                                  const arr = [...formData.materials];
                                  arr[idx].material_type = e.target.value;
                                  setFormData({ ...formData, materials: arr });
                                }}
                              />
                            </td>
                            <td>
                              <Form.Control
                                size="sm"
                                placeholder="Color / Finish"
                                value={m.color || ""}
                                onChange={(e) => {
                                  const arr = [...formData.materials];
                                  arr[idx].color = e.target.value;
                                  setFormData({ ...formData, materials: arr });
                                }}
                              />
                            </td>
                            <td style={{ width: "110px" }}>
                              <Form.Control
                                size="sm"
                                placeholder="e.g. 1.2 mm"
                                value={m.thickness || ""}
                                onChange={(e) => {
                                  const arr = [...formData.materials];
                                  arr[idx].thickness = e.target.value;
                                  setFormData({ ...formData, materials: arr });
                                }}
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                step="0.01"
                                size="sm"
                                value={m.consumption || ""}
                                onChange={(e) => {
                                  const arr = [...formData.materials];
                                  arr[idx].consumption = e.target.value;
                                  setFormData({ ...formData, materials: arr });
                                }}
                              />
                            </td>
                            <td style={{ width: "70px" }}>
                              <Form.Control
                                size="sm"
                                value={m.uom || "MTR"}
                                onChange={(e) => {
                                  const arr = [...formData.materials];
                                  arr[idx].uom = e.target.value;
                                  setFormData({ ...formData, materials: arr });
                                }}
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                step="1"
                                size="sm"
                                value={m.wastage_percent || 0}
                                onChange={(e) => {
                                  const arr = [...formData.materials];
                                  arr[idx].wastage_percent = e.target.value;
                                  setFormData({ ...formData, materials: arr });
                                }}
                              />
                            </td>
                            <td className="fw-semibold font-monospace">{totalReq}</td>
                            <td className="text-center">
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="p-1"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    materials: formData.materials.filter((_, i) => i !== idx)
                                  });
                                }}
                              >
                                <FaTrash size={12} />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Tab.Pane>

                {/* 4. COMPONENTS & HARDWARE TAB */}
                <Tab.Pane eventKey="components">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted fw-semibold">
                      Zippers, buckles, snaps, rivets, and decorative hardware linked to Item Master.
                    </span>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          components: [
                            ...formData.components,
                            { line_no: formData.components.length + 1, item_id: "", item_code: "", component_name: "", component_type: "Hardware", specification: "", color: "", size: "", qty: 1, uom: "PCS", remarks: "" }
                          ]
                        })
                      }
                    >
                      <FaPlus className="me-1" /> Add Component Row
                    </Button>
                  </div>

                  <Table bordered hover responsive size="sm" className="align-middle text-nowrap" style={{ fontSize: "12px" }}>
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Link Item Master</th>
                        <th>Component Name *</th>
                        <th>Type / Placement</th>
                        <th>Color / Plating Finish</th>
                        <th>Size / Specification</th>
                        <th style={{ width: "80px" }}>Qty *</th>
                        <th style={{ width: "70px" }}>UOM</th>
                        <th style={{ width: "40px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.components.map((c, idx) => (
                        <tr key={idx}>
                          <td className="text-center">{idx + 1}</td>
                          <td style={{ minWidth: "160px" }}>
                            <Form.Select
                              size="sm"
                              value={c.item_id || ""}
                              onChange={(e) => handleComponentItemSelect(idx, e.target.value)}
                            >
                              <option value="">Select Hardware Item...</option>
                              {itemsList.map((it) => (
                                <option key={it.ItemID} value={it.ItemID}>
                                  {it.ItemCode} - {it.ItemName}
                                </option>
                              ))}
                            </Form.Select>
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              required
                              placeholder="e.g. Antique Brass D-Ring"
                              value={c.component_name || ""}
                              onChange={(e) => {
                                const arr = [...formData.components];
                                arr[idx].component_name = e.target.value;
                                setFormData({ ...formData, components: arr });
                              }}
                            />
                          </td>
                          <td style={{ width: "120px" }}>
                            <Form.Control
                              size="sm"
                              placeholder="Hardware / Trim"
                              value={c.component_type || ""}
                              onChange={(e) => {
                                const arr = [...formData.components];
                                arr[idx].component_type = e.target.value;
                                setFormData({ ...formData, components: arr });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              placeholder="e.g. Antique Brass"
                              value={c.color || ""}
                              onChange={(e) => {
                                const arr = [...formData.components];
                                arr[idx].color = e.target.value;
                                setFormData({ ...formData, components: arr });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              placeholder="e.g. 25mm / #5"
                              value={c.size || ""}
                              onChange={(e) => {
                                const arr = [...formData.components];
                                arr[idx].size = e.target.value;
                                setFormData({ ...formData, components: arr });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              step="1"
                              size="sm"
                              value={c.qty || 1}
                              onChange={(e) => {
                                const arr = [...formData.components];
                                arr[idx].qty = e.target.value;
                                setFormData({ ...formData, components: arr });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              value={c.uom || "PCS"}
                              onChange={(e) => {
                                const arr = [...formData.components];
                                arr[idx].uom = e.target.value;
                                setFormData({ ...formData, components: arr });
                              }}
                            />
                          </td>
                          <td className="text-center">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="p-1"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  components: formData.components.filter((_, i) => i !== idx)
                                });
                              }}
                            >
                              <FaTrash size={12} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab.Pane>

                {/* 5. CONSTRUCTION TAB */}
                <Tab.Pane eventKey="construction">
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Construction Method</Form.Label>
                        <Form.Control
                          size="sm"
                          value={formData.construction.construction_method || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              construction: { ...formData.construction, construction_method: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Stitch Type</Form.Label>
                        <Form.Control
                          size="sm"
                          value={formData.construction.stitch_type || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              construction: { ...formData.construction, stitch_type: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">SPI (Stitches Per Inch)</Form.Label>
                        <Form.Control
                          size="sm"
                          value={formData.construction.spi || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              construction: { ...formData.construction, spi: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Thread Type & Size</Form.Label>
                        <Form.Control
                          size="sm"
                          value={formData.construction.thread_type || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              construction: { ...formData.construction, thread_type: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Seam Allowance</Form.Label>
                        <Form.Control
                          size="sm"
                          value={formData.construction.seam_allowance || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              construction: { ...formData.construction, seam_allowance: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Skiving Requirement</Form.Label>
                        <Form.Control
                          size="sm"
                          value={formData.construction.skiving_requirement || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              construction: { ...formData.construction, skiving_requirement: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Edge Treatment & Edge Paint</Form.Label>
                        <Form.Control
                          size="sm"
                          value={formData.construction.edge_treatment || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              construction: { ...formData.construction, edge_treatment: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Edge Paint Shade</Form.Label>
                        <Form.Control
                          size="sm"
                          value={formData.construction.edge_paint || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              construction: { ...formData.construction, edge_paint: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Adhesive Specification</Form.Label>
                        <Form.Control
                          size="sm"
                          value={formData.construction.adhesive_requirement || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              construction: { ...formData.construction, adhesive_requirement: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Reinforcement / Interlining Placement</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          size="sm"
                          value={formData.construction.reinforcement_requirement || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              construction: { ...formData.construction, reinforcement_requirement: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Special Manufacturing Notes</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          size="sm"
                          value={formData.construction.special_notes || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              construction: { ...formData.construction, special_notes: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab.Pane>

                {/* 6. COLORS TAB */}
                <Tab.Pane eventKey="colors">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted fw-semibold">
                      Colorway combinations across leather body, lining, thread, hardware, and edge paint.
                    </span>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          colors: [
                            ...formData.colors,
                            { color_code: "", color_name: "", pantone: "", main_material_color: "", lining_color: "", thread_color: "", hardware_color: "", edge_paint_color: "" }
                          ]
                        })
                      }
                    >
                      <FaPlus className="me-1" /> Add Colorway
                    </Button>
                  </div>

                  <Table bordered hover responsive size="sm" className="align-middle text-nowrap" style={{ fontSize: "12px" }}>
                    <thead className="table-light">
                      <tr>
                        <th>Color Name *</th>
                        <th>Pantone TCX</th>
                        <th>Main Material</th>
                        <th>Lining Color</th>
                        <th>Thread Color</th>
                        <th>Hardware Finish</th>
                        <th>Edge Paint</th>
                        <th style={{ width: "40px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.colors.map((col, idx) => (
                        <tr key={idx}>
                          <td>
                            <Form.Control
                              size="sm"
                              required
                              placeholder="e.g. Cognac Tan"
                              value={col.color_name || ""}
                              onChange={(e) => {
                                const arr = [...formData.colors];
                                arr[idx].color_name = e.target.value;
                                setFormData({ ...formData, colors: arr });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              placeholder="e.g. 18-1140 TCX"
                              value={col.pantone || ""}
                              onChange={(e) => {
                                const arr = [...formData.colors];
                                arr[idx].pantone = e.target.value;
                                setFormData({ ...formData, colors: arr });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              value={col.main_material_color || ""}
                              onChange={(e) => {
                                const arr = [...formData.colors];
                                arr[idx].main_material_color = e.target.value;
                                setFormData({ ...formData, colors: arr });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              value={col.lining_color || ""}
                              onChange={(e) => {
                                const arr = [...formData.colors];
                                arr[idx].lining_color = e.target.value;
                                setFormData({ ...formData, colors: arr });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              value={col.thread_color || ""}
                              onChange={(e) => {
                                const arr = [...formData.colors];
                                arr[idx].thread_color = e.target.value;
                                setFormData({ ...formData, colors: arr });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              value={col.hardware_color || ""}
                              onChange={(e) => {
                                const arr = [...formData.colors];
                                arr[idx].hardware_color = e.target.value;
                                setFormData({ ...formData, colors: arr });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              value={col.edge_paint_color || ""}
                              onChange={(e) => {
                                const arr = [...formData.colors];
                                arr[idx].edge_paint_color = e.target.value;
                                setFormData({ ...formData, colors: arr });
                              }}
                            />
                          </td>
                          <td className="text-center">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="p-1"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  colors: formData.colors.filter((_, i) => i !== idx)
                                });
                              }}
                            >
                              <FaTrash size={12} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab.Pane>

                {/* 7. OPERATIONS & ROUTING TAB */}
                <Tab.Pane eventKey="operations">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <span className="small text-muted fw-semibold">
                        Manufacturing operation sequence with Work Centers, Machines, and Standard Minute Value (SMV).
                      </span>
                      <div className="fw-bold text-success mt-1">
                        Total Standard Minutes (SMV): {totalSMV.toFixed(2)} mins per unit
                      </div>
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          operations: [
                            ...formData.operations,
                            { sequence: formData.operations.length + 1, operation_code: "", operation_name: "", work_center: "Stitching", machine: "", smv: 1.0, skill_level: "Skilled", subcontract: "No", remarks: "" }
                          ]
                        })
                      }
                    >
                      <FaPlus className="me-1" /> Add Operation
                    </Button>
                  </div>

                  <Table bordered hover responsive size="sm" className="align-middle text-nowrap" style={{ fontSize: "12px" }}>
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "40px" }}>Seq</th>
                        <th>Op Code</th>
                        <th>Operation Name *</th>
                        <th>Work Center</th>
                        <th>Machine Required</th>
                        <th style={{ width: "90px" }}>SMV (mins) *</th>
                        <th>Skill Level</th>
                        <th>Subcontract</th>
                        <th style={{ width: "40px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.operations.map((op, idx) => (
                        <tr key={idx}>
                          <td className="text-center">{idx + 1}</td>
                          <td style={{ width: "100px" }}>
                            <Form.Control
                              size="sm"
                              placeholder="OP-01"
                              value={op.operation_code || ""}
                              onChange={(e) => {
                                const arr = [...formData.operations];
                                arr[idx].operation_code = e.target.value;
                                setFormData({ ...formData, operations: arr });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              required
                              placeholder="e.g. Leather Edge Skiving"
                              value={op.operation_name || ""}
                              onChange={(e) => {
                                const arr = [...formData.operations];
                                arr[idx].operation_name = e.target.value;
                                setFormData({ ...formData, operations: arr });
                              }}
                            />
                          </td>
                          <td style={{ width: "140px" }}>
                            <Form.Control
                              size="sm"
                              placeholder="Cutting / Stitching"
                              value={op.work_center || ""}
                              onChange={(e) => {
                                const arr = [...formData.operations];
                                arr[idx].work_center = e.target.value;
                                setFormData({ ...formData, operations: arr });
                              }}
                            />
                          </td>
                          <td style={{ width: "140px" }}>
                            <Form.Control
                              size="sm"
                              placeholder="e.g. Post Bed"
                              value={op.machine || ""}
                              onChange={(e) => {
                                const arr = [...formData.operations];
                                arr[idx].machine = e.target.value;
                                setFormData({ ...formData, operations: arr });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              step="0.1"
                              size="sm"
                              value={op.smv || 0}
                              onChange={(e) => {
                                const arr = [...formData.operations];
                                arr[idx].smv = e.target.value;
                                setFormData({ ...formData, operations: arr });
                              }}
                            />
                          </td>
                          <td style={{ width: "110px" }}>
                            <Form.Select
                              size="sm"
                              value={op.skill_level || "Skilled"}
                              onChange={(e) => {
                                const arr = [...formData.operations];
                                arr[idx].skill_level = e.target.value;
                                setFormData({ ...formData, operations: arr });
                              }}
                            >
                              <option value="Skilled">Skilled</option>
                              <option value="Semi-Skilled">Semi-Skilled</option>
                              <option value="Master Artisan">Master Artisan</option>
                              <option value="General">General</option>
                            </Form.Select>
                          </td>
                          <td style={{ width: "90px" }}>
                            <Form.Select
                              size="sm"
                              value={op.subcontract || "No"}
                              onChange={(e) => {
                                const arr = [...formData.operations];
                                arr[idx].subcontract = e.target.value;
                                setFormData({ ...formData, operations: arr });
                              }}
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </Form.Select>
                          </td>
                          <td className="text-center">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="p-1"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  operations: formData.operations.filter((_, i) => i !== idx)
                                });
                              }}
                            >
                              <FaTrash size={12} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab.Pane>

                {/* 8. QUALITY TAB */}
                <Tab.Pane eventKey="quality">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted fw-semibold">
                      In-line inspection points, tolerances, test standards, and critical acceptance criteria.
                    </span>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          quality: [
                            ...formData.quality,
                            { inspection_point: "", specification: "", standard: "AQL 1.5", tolerance: "", inspection_method: "Visual", critical: "No", remarks: "" }
                          ]
                        })
                      }
                    >
                      <FaPlus className="me-1" /> Add Inspection Point
                    </Button>
                  </div>

                  <Table bordered hover responsive size="sm" className="align-middle text-nowrap" style={{ fontSize: "12px" }}>
                    <thead className="table-light">
                      <tr>
                        <th>Inspection Point *</th>
                        <th>Specification Required</th>
                        <th>Standard</th>
                        <th>Tolerance</th>
                        <th>Inspection Method</th>
                        <th>Critical Defect</th>
                        <th style={{ width: "40px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.quality.map((q, idx) => (
                        <tr key={idx}>
                          <td>
                            <Form.Control
                              size="sm"
                              required
                              placeholder="e.g. Handle Pull Strength"
                              value={q.inspection_point || ""}
                              onChange={(e) => {
                                const arr = [...formData.quality];
                                arr[idx].inspection_point = e.target.value;
                                setFormData({ ...formData, quality: arr });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              placeholder="e.g. Min 18kg load for 4h"
                              value={q.specification || ""}
                              onChange={(e) => {
                                const arr = [...formData.quality];
                                arr[idx].specification = e.target.value;
                                setFormData({ ...formData, quality: arr });
                              }}
                            />
                          </td>
                          <td style={{ width: "120px" }}>
                            <Form.Control
                              size="sm"
                              placeholder="SATRA / ISO"
                              value={q.standard || ""}
                              onChange={(e) => {
                                const arr = [...formData.quality];
                                arr[idx].standard = e.target.value;
                                setFormData({ ...formData, quality: arr });
                              }}
                            />
                          </td>
                          <td style={{ width: "110px" }}>
                            <Form.Control
                              size="sm"
                              placeholder="+/- 2mm"
                              value={q.tolerance || ""}
                              onChange={(e) => {
                                const arr = [...formData.quality];
                                arr[idx].tolerance = e.target.value;
                                setFormData({ ...formData, quality: arr });
                              }}
                            />
                          </td>
                          <td style={{ width: "130px" }}>
                            <Form.Control
                              size="sm"
                              placeholder="Visual / Tensile"
                              value={q.inspection_method || ""}
                              onChange={(e) => {
                                const arr = [...formData.quality];
                                arr[idx].inspection_method = e.target.value;
                                setFormData({ ...formData, quality: arr });
                              }}
                            />
                          </td>
                          <td style={{ width: "100px" }}>
                            <Form.Select
                              size="sm"
                              value={q.critical || "No"}
                              onChange={(e) => {
                                const arr = [...formData.quality];
                                arr[idx].critical = e.target.value;
                                setFormData({ ...formData, quality: arr });
                              }}
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes (Critical)</option>
                            </Form.Select>
                          </td>
                          <td className="text-center">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="p-1"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  quality: formData.quality.filter((_, i) => i !== idx)
                                });
                              }}
                            >
                              <FaTrash size={12} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab.Pane>

                {/* 9. PACKAGING TAB */}
                <Tab.Pane eventKey="packaging">
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Polybag Specifications & Size</Form.Label>
                        <Form.Control
                          size="sm"
                          value={formData.packaging.polybag_size || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              packaging: { ...formData.packaging, polybag_size: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Dust Bag Specification</Form.Label>
                        <Form.Control
                          size="sm"
                          value={formData.packaging.dust_bag || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              packaging: { ...formData.packaging, dust_bag: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Hangtag & Attachment Method</Form.Label>
                        <Form.Control
                          size="sm"
                          value={formData.packaging.hangtag || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              packaging: { ...formData.packaging, hangtag: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Barcode & Sticker Specification</Form.Label>
                        <Form.Control
                          size="sm"
                          value={formData.packaging.barcode || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              packaging: { ...formData.packaging, barcode: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Inner Box / Gift Box</Form.Label>
                        <Form.Control
                          size="sm"
                          value={formData.packaging.box || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              packaging: { ...formData.packaging, box: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Master Export Carton</Form.Label>
                        <Form.Control
                          size="sm"
                          value={formData.packaging.carton || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              packaging: { ...formData.packaging, carton: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Carton Packing Qty (pcs)</Form.Label>
                        <Form.Control
                          type="number"
                          size="sm"
                          value={formData.packaging.carton_qty || 1}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              packaging: { ...formData.packaging, carton_qty: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Stuffing & Packing Instructions</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          size="sm"
                          value={formData.packaging.packing_instruction || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              packaging: { ...formData.packaging, packing_instruction: e.target.value }
                            })
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab.Pane>

                {/* 10. APPROVALS TAB */}
                <Tab.Pane eventKey="approval">
                  <div className="border p-3 rounded bg-light mb-3">
                    <h6 className="fw-bold mb-3 text-secondary">Tech Sheet Sign-Off & Lifecycle</h6>
                    <Row className="g-3 small">
                      <Col md={4}>
                        <div className="text-muted">Current Lifecycle State:</div>
                        <div className="h5 mt-1">{getStatusBadge(formData.status)}</div>
                      </Col>
                      <Col md={4}>
                        <div className="text-muted">Prepared By:</div>
                        <div className="fw-bold mt-1">{formData.prepared_by || "—"}</div>
                      </Col>
                      <Col md={4}>
                        <div className="text-muted">Effective Date:</div>
                        <div className="fw-bold mt-1">{formData.effective_date || "—"}</div>
                      </Col>
                    </Row>
                  </div>

                  <Alert variant="info" className="small">
                    <strong>Technical Specification Rules:</strong>
                    <ul className="mb-0 mt-1">
                      <li>Draft sheets can be freely modified, updated, and re-configured.</li>
                      <li>Submitting transitions the sheet to "Pending Approval" for QA inspection.</li>
                      <li>Approved Tech Sheets become completely <strong>LOCKED & IMMUTABLE</strong> for audit integrity.</li>
                      <li>Any design changes to an Approved sheet require clicking <strong>"+ New Revision"</strong> to increment revision (e.g. 01 → 02).</li>
                    </ul>
                  </Alert>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Modal.Body>

          <Modal.Footer className="py-2 bg-light d-flex justify-content-between">
            <Button variant="secondary" size="sm" onClick={() => setShowEditorModal(false)}>
              Cancel
            </Button>
            <div className="d-flex gap-2">
              {formData.status !== "Approved" && (
                <Button variant="success" size="sm" type="submit">
                  <FaCheck className="me-1" /> Save Tech Sheet
                </Button>
              )}
            </div>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ========================================================
          PRINTABLE TECHNICAL SPECIFICATION SHEET MODAL
      ======================================================== */}
      {printSheetData && (
        <Modal show={showPrintModal} onHide={() => setShowPrintModal(false)} size="xl">
          <Modal.Header closeButton className="py-2 bg-light d-print-none">
            <Modal.Title className="h6 fw-bold mb-0">
              <FaPrint className="me-2 text-primary" /> Technical Specification Sheet Preview
            </Modal.Title>
            <div className="ms-auto me-3 d-flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => window.print()}
              >
                <FaPrint className="me-1" /> Print / Export PDF
              </Button>
            </div>
          </Modal.Header>

          <Modal.Body className="p-4 printable-spec-sheet" id="printable-spec-sheet">
            {/* FACTORY HEADER */}
            <div className="border-bottom pb-3 mb-3 d-flex justify-content-between align-items-center">
              <div>
                <h4 className="fw-bold text-dark mb-0">GLOBAL LEATHER & APPAREL ERP</h4>
                <div className="small text-uppercase text-secondary fw-semibold">
                  Factory Technical Specification Sheet (Tech Pack)
                </div>
              </div>
              <div className="text-end">
                <div className="h5 fw-bold font-monospace text-primary mb-0">
                  {printSheetData.sheet.tech_sheet_no}
                </div>
                <div className="small text-muted">
                  Revision: <strong>{printSheetData.sheet.revision}</strong> | Version: <strong>{printSheetData.sheet.version}</strong>
                </div>
                <div>{getStatusBadge(printSheetData.sheet.status)}</div>
              </div>
            </div>

            {/* PRODUCT OVERVIEW GRID */}
            <div className="border rounded p-3 mb-4 bg-light">
              <Row className="g-3 small">
                <Col md={3}>
                  <div className="text-muted">Style Number:</div>
                  <strong className="font-monospace h6 mb-0 d-block">{printSheetData.sheet.style_no}</strong>
                </Col>
                <Col md={5}>
                  <div className="text-muted">Style Name:</div>
                  <strong className="h6 mb-0 d-block">{printSheetData.sheet.style_name}</strong>
                </Col>
                <Col md={4}>
                  <div className="text-muted">Customer / Buyer:</div>
                  <strong>{printSheetData.sheet.CustomerName || "—"} ({printSheetData.sheet.CustomerCode || "—"})</strong>
                </Col>
                <Col md={3}>
                  <div className="text-muted">Category / Bag Type:</div>
                  <strong>{printSheetData.sheet.product_category} • {printSheetData.sheet.bag_type || printSheetData.sheet.product_type}</strong>
                </Col>
                <Col md={3}>
                  <div className="text-muted">Season:</div>
                  <strong>{printSheetData.sheet.season || "Core"}</strong>
                </Col>
                <Col md={3}>
                  <div className="text-muted">Effective Date:</div>
                  <strong>{printSheetData.sheet.effective_date || "—"}</strong>
                </Col>
                <Col md={3}>
                  <div className="text-muted">Sample No:</div>
                  <strong className="font-monospace">{printSheetData.sheet.sample_no || "—"}</strong>
                </Col>
              </Row>
            </div>

            {/* SECTION A: DIMENSIONS */}
            <h6 className="fw-bold text-dark border-bottom pb-1 mb-2">
              1. FINISHED PRODUCT DIMENSIONS & TOLERANCES
            </h6>
            <Table size="sm" bordered className="mb-4 small align-middle">
              <thead className="table-light">
                <tr>
                  <th>Measurement Point</th>
                  <th>Specification Description</th>
                  <th className="text-center">Nominal Value</th>
                  <th className="text-center">Tolerance (-)</th>
                  <th className="text-center">Tolerance (+)</th>
                  <th className="text-center">Unit</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {printSheetData.dimensions?.map((d, i) => (
                  <tr key={i}>
                    <td className="fw-semibold">{d.dimension_type}</td>
                    <td>{d.specification || "—"}</td>
                    <td className="text-center fw-bold">{d.value}</td>
                    <td className="text-center text-muted">-{d.tolerance_minus}</td>
                    <td className="text-center text-muted">+{d.tolerance_plus}</td>
                    <td className="text-center">{d.uom}</td>
                    <td>{d.remarks || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* SECTION B: BILL OF MATERIALS (BOM) */}
            <h6 className="fw-bold text-dark border-bottom pb-1 mb-2">
              2. BILL OF MATERIALS (BOM) - RAW MATERIALS
            </h6>
            <Table size="sm" bordered className="mb-4 small align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Item Code</th>
                  <th>Material Name & Description</th>
                  <th>Placement</th>
                  <th>Color / Finish</th>
                  <th>Thickness</th>
                  <th className="text-end">Cons.</th>
                  <th className="text-center">Unit</th>
                  <th className="text-center">Waste %</th>
                  <th className="text-end">Total Req.</th>
                </tr>
              </thead>
              <tbody>
                {printSheetData.materials?.map((m, i) => {
                  const cons = parseFloat(m.consumption) || 0;
                  const waste = parseFloat(m.wastage_percent) || 0;
                  const tot = (cons * (1 + waste / 100)).toFixed(2);
                  return (
                    <tr key={i}>
                      <td className="text-center">{i + 1}</td>
                      <td className="font-monospace small">{m.ItemCode || m.material_code || "—"}</td>
                      <td className="fw-semibold">{m.material_name}</td>
                      <td>{m.material_type || "—"}</td>
                      <td>{m.color || "—"}</td>
                      <td>{m.thickness || "—"}</td>
                      <td className="text-end">{cons.toFixed(2)}</td>
                      <td className="text-center">{m.uom}</td>
                      <td className="text-center">{waste}%</td>
                      <td className="text-end fw-bold">{tot}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            {/* SECTION C: HARDWARE & COMPONENTS */}
            <h6 className="fw-bold text-dark border-bottom pb-1 mb-2">
              3. HARDWARE, FASTENERS & COMPONENTS
            </h6>
            <Table size="sm" bordered className="mb-4 small align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Component Name</th>
                  <th>Type</th>
                  <th>Color / Plating Finish</th>
                  <th>Size / Specification</th>
                  <th className="text-center">Qty / Unit</th>
                  <th className="text-center">UOM</th>
                  <th>Placement Remarks</th>
                </tr>
              </thead>
              <tbody>
                {printSheetData.components?.map((c, i) => (
                  <tr key={i}>
                    <td className="text-center">{i + 1}</td>
                    <td className="fw-semibold">{c.component_name}</td>
                    <td>{c.component_type || "—"}</td>
                    <td>{c.color || "—"}</td>
                    <td>{c.size || c.specification || "—"}</td>
                    <td className="text-center fw-bold">{c.qty}</td>
                    <td className="text-center">{c.uom}</td>
                    <td>{c.remarks || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* SECTION D: CONSTRUCTION & STITCHING */}
            <h6 className="fw-bold text-dark border-bottom pb-1 mb-2">
              4. ENGINEERING SPECIFICATIONS & STITCHING
            </h6>
            {printSheetData.construction && (
              <Row className="g-2 mb-4 small border rounded p-2">
                <Col md={4}>
                  <span className="text-muted">Construction Method:</span>
                  <div><strong>{printSheetData.construction.construction_method || "—"}</strong></div>
                </Col>
                <Col md={4}>
                  <span className="text-muted">Stitch Type & Density:</span>
                  <div><strong>{printSheetData.construction.stitch_type || "—"} ({printSheetData.construction.spi || "7-8 SPI"})</strong></div>
                </Col>
                <Col md={4}>
                  <span className="text-muted">Thread Type & Size:</span>
                  <div><strong>{printSheetData.construction.thread_type || "—"} ({printSheetData.construction.thread_size || "Tex 70"})</strong></div>
                </Col>
                <Col md={4}>
                  <span className="text-muted">Seam Allowance:</span>
                  <div><strong>{printSheetData.construction.seam_allowance || "8 mm"}</strong></div>
                </Col>
                <Col md={4}>
                  <span className="text-muted">Edge Treatment & Paint:</span>
                  <div><strong>{printSheetData.construction.edge_treatment || "—"} ({printSheetData.construction.edge_paint || "—"})</strong></div>
                </Col>
                <Col md={4}>
                  <span className="text-muted">Skiving & Reinforcement:</span>
                  <div><strong>{printSheetData.construction.skiving_requirement || "—"} • {printSheetData.construction.reinforcement_requirement || "—"}</strong></div>
                </Col>
              </Row>
            )}

            {/* SECTION E: OPERATIONS & SMV */}
            <h6 className="fw-bold text-dark border-bottom pb-1 mb-2">
              5. MANUFACTURING OPERATIONS ROUTING (TOTAL SMV: {printSheetData.operations?.reduce((s, o) => s + (o.smv || 0), 0).toFixed(1)} MINS)
            </h6>
            <Table size="sm" bordered className="mb-4 small align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "40px" }}>Seq</th>
                  <th>Op Code</th>
                  <th>Operation Name</th>
                  <th>Work Center</th>
                  <th>Machine</th>
                  <th className="text-end">SMV (mins)</th>
                  <th>Skill Level</th>
                </tr>
              </thead>
              <tbody>
                {printSheetData.operations?.map((op, i) => (
                  <tr key={i}>
                    <td className="text-center">{op.sequence || i + 1}</td>
                    <td className="font-monospace small">{op.operation_code || "—"}</td>
                    <td className="fw-semibold">{op.operation_name}</td>
                    <td>{op.work_center || "—"}</td>
                    <td>{op.machine || "—"}</td>
                    <td className="text-end fw-bold">{op.smv || 0}</td>
                    <td>{op.skill_level || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* SECTION F: QUALITY STANDARDS */}
            <h6 className="fw-bold text-dark border-bottom pb-1 mb-2">
              6. QUALITY CONTROL & ACCEPTANCE CRITERIA
            </h6>
            <Table size="sm" bordered className="mb-4 small align-middle">
              <thead className="table-light">
                <tr>
                  <th>Inspection Point</th>
                  <th>Specification</th>
                  <th>Standard</th>
                  <th>Tolerance</th>
                  <th>Method</th>
                  <th className="text-center">Critical</th>
                </tr>
              </thead>
              <tbody>
                {printSheetData.quality?.map((q, i) => (
                  <tr key={i}>
                    <td className="fw-semibold">{q.inspection_point}</td>
                    <td>{q.specification || "—"}</td>
                    <td>{q.standard || "—"}</td>
                    <td>{q.tolerance || "—"}</td>
                    <td>{q.inspection_method || "—"}</td>
                    <td className="text-center">
                      {q.critical === "Yes" ? (
                        <Badge bg="danger">Critical</Badge>
                      ) : (
                        <span className="text-muted">Standard</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* SECTION G: PACKAGING */}
            <h6 className="fw-bold text-dark border-bottom pb-1 mb-2">
              7. PACKAGING & PACKING SPECIFICATIONS
            </h6>
            {printSheetData.packaging && (
              <Row className="g-2 mb-4 small border rounded p-2">
                <Col md={4}>
                  <span className="text-muted">Polybag:</span>
                  <div><strong>{printSheetData.packaging.polybag_size || "—"} ({printSheetData.packaging.polybag_type || "LDPE"})</strong></div>
                </Col>
                <Col md={4}>
                  <span className="text-muted">Dust Bag:</span>
                  <div><strong>{printSheetData.packaging.dust_bag || "—"}</strong></div>
                </Col>
                <Col md={4}>
                  <span className="text-muted">Master Carton:</span>
                  <div><strong>{printSheetData.packaging.carton || "—"} ({printSheetData.packaging.carton_qty || 1} pcs/carton)</strong></div>
                </Col>
                <Col md={12}>
                  <span className="text-muted">Stuffing & Packaging Notes:</span>
                  <div>{printSheetData.packaging.packing_instruction || "—"}</div>
                </Col>
              </Row>
            )}

            {/* SECTION H: FACTORY SIGN-OFF BOX */}
            <div className="border rounded p-3 mt-4">
              <Row className="text-center small">
                <Col md={3}>
                  <div className="text-muted mb-4">PREPARED BY (TECH DESIGN)</div>
                  <div className="border-top pt-1 fw-bold">{printSheetData.sheet.prepared_by || "Admin"}</div>
                  <div className="text-muted small">{printSheetData.sheet.prepared_date || "—"}</div>
                </Col>
                <Col md={3}>
                  <div className="text-muted mb-4">CHECKED BY (MERCHANDISER)</div>
                  <div className="border-top pt-1 fw-bold">{printSheetData.sheet.submitted_by || "Merchandiser"}</div>
                  <div className="text-muted small">{printSheetData.sheet.submitted_date || "—"}</div>
                </Col>
                <Col md={3}>
                  <div className="text-muted mb-4">APPROVED BY (QA DIRECTOR)</div>
                  <div className="border-top pt-1 fw-bold">{printSheetData.sheet.approved_by || "QA Technical Director"}</div>
                  <div className="text-muted small">{printSheetData.sheet.approved_date || "—"}</div>
                </Col>
                <Col md={3}>
                  <div className="text-muted mb-4">FACTORY MANAGER SIGN-OFF</div>
                  <div className="border-top pt-1 fw-bold">Production Head</div>
                  <div className="text-muted small">Bulk Ready Stamp</div>
                </Col>
              </Row>
            </div>
          </Modal.Body>
        </Modal>
      )}

      {/* ========================================================
          APPROVAL / REJECT DIALOG MODAL
      ======================================================== */}
      <Modal show={showApprovalModal} onHide={() => setShowApprovalModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h6 fw-bold">
            {approvalAction === "approve" ? "Approve Tech Sheet" : "Reject Tech Sheet"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="small text-muted mb-2">
            {approvalAction === "approve"
              ? "Approving will LOCK this Tech Sheet against further changes and make it the factory standard."
              : "Please specify why this Tech Sheet is being rejected back to the designer."}
          </p>
          <Form.Group>
            <Form.Label className="small fw-semibold">
              {approvalAction === "approve" ? "Approval Remarks (Optional)" : "Rejection Reason *"}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              size="sm"
              placeholder={approvalAction === "approve" ? "Ready for bulk production..." : "Reason for rejection..."}
              value={approvalRemarks}
              onChange={(e) => setApprovalRemarks(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="py-2">
          <Button variant="secondary" size="sm" onClick={() => setShowApprovalModal(false)}>
            Cancel
          </Button>
          <Button
            variant={approvalAction === "approve" ? "success" : "danger"}
            size="sm"
            onClick={handleExecuteApproval}
          >
            {approvalAction === "approve" ? "Confirm Approval" : "Confirm Rejection"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
