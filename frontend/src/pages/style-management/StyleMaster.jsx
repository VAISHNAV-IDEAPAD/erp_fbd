import React, { useState, useEffect, useMemo } from "react";
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
  InputGroup,
  Pagination
} from "react-bootstrap";
import {
  FaPlus,
  FaSearch,
  FaFileExport,
  FaSync,
  FaEdit,
  FaTrash,
  FaCopy,
  FaFileAlt,
  FaCheck,
  FaTimes,
  FaLayerGroup,
  FaPalette,
  FaRulerCombined,
  FaPaperclip,
  FaInfoCircle,
  FaEye,
  FaCogs
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getStyles,
  getStyleById,
  createStyle,
  updateStyle,
  deleteStyle,
  duplicateStyle,
  getStyleOptions
} from "../../services/styleManagementService";

export default function StyleMaster() {
  const navigate = useNavigate();

  // Data states
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

  // Metadata dropdowns
  const [categories, setCategories] = useState([]);
  const [bagTypes, setBagTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [genders, setGenders] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [viewStyleData, setViewStyleData] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Form State
  const initialForm = {
    style_id: null,
    style_no: "",
    style_name: "",
    short_description: "",
    product_category: "Bags",
    product_type: "Tote Bag",
    sub_category: "",
    brand: "",
    collection: "",
    season: "FW25",
    gender: "Unisex",
    customer_id: "",
    status: "Draft",
    revision: "01",
    bag_type: "Tote Bag",
    usage: "Everyday / Work",
    target_market: "Global",
    material_group: "Full Grain Leather",
    construction_type: "Turned Edge Stitched",
    packaging_type: "Dust Bag + Master Carton",
    country_of_origin: "India",
    hsn_code: "42022190",
    uom: "PCS",
    moq: 100,
    lead_time: "45 Days",
    remarks: "",
    colors: [
      { color_code: "BLK-01", color_name: "Midnight Black", pantone: "19-4008 TCX", color_family: "Black", material_color: "Matte Black", status: "Active" }
    ],
    sizes: [
      { size_code: "STD", size_name: "Standard", length: 35, width: 12, height: 28, gusset: 12, handle_drop: 22, strap_length: 55, strap_width: 2.5, weight: 0.7, uom: "cm" }
    ],
    documents: []
  };

  const [formData, setFormData] = useState(initialForm);

  // ==========================================
  // LOAD DATA
  // ==========================================
  useEffect(() => {
    loadMetadata();
    loadStyles();
  }, []);

  const loadMetadata = async () => {
    try {
      const res = await getStyleOptions();
      if (res.data) {
        setCategories(res.data.categories || []);
        setBagTypes(res.data.bagTypes || []);
        setStatuses(res.data.statuses || []);
        setSeasons(res.data.seasons || []);
        setGenders(res.data.genders || []);
        setUoms(res.data.uoms || []);
        setCustomers(res.data.customers || []);
      }
    } catch (err) {
      console.error("Failed to load metadata options:", err);
    }
  };

  const loadStyles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStyles();
      setStyles(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load styles.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTERING & PAGINATION
  // ==========================================
  const filteredStyles = useMemo(() => {
    return styles.filter((s) => {
      const matchesSearch =
        !searchTerm ||
        (s.style_no && s.style_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.style_name && s.style_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.brand && s.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.season && s.season.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCat = !selectedCategory || s.product_category === selectedCategory;
      const matchesStatus = !selectedStatus || s.status === selectedStatus;
      const matchesCust = !selectedCustomer || String(s.customer_id) === String(selectedCustomer);

      return matchesSearch && matchesCat && matchesStatus && matchesCust;
    });
  }, [styles, searchTerm, selectedCategory, selectedStatus, selectedCustomer]);

  const totalPages = Math.ceil(filteredStyles.length / itemsPerPage);
  const paginatedStyles = filteredStyles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData(initialForm);
    setActiveTab("basic");
    setShowModal(true);
  };

  const handleOpenEdit = async (styleId) => {
    try {
      const res = await getStyleById(styleId);
      const s = res.data;
      setFormData({
        style_id: s.style_id,
        style_no: s.style_no,
        style_name: s.style_name,
        short_description: s.short_description || "",
        product_category: s.product_category || "Bags",
        product_type: s.product_type || "",
        sub_category: s.sub_category || "",
        brand: s.brand || "",
        collection: s.collection || "",
        season: s.season || "",
        gender: s.gender || "Unisex",
        customer_id: s.customer_id || "",
        status: s.status || "Draft",
        revision: s.revision || "01",
        bag_type: s.bag_type || "",
        usage: s.usage || "",
        target_market: s.target_market || "",
        material_group: s.material_group || "",
        construction_type: s.construction_type || "",
        packaging_type: s.packaging_type || "",
        country_of_origin: s.country_of_origin || "India",
        hsn_code: s.hsn_code || "",
        uom: s.uom || "PCS",
        moq: s.moq || 1,
        lead_time: s.lead_time || "",
        remarks: s.remarks || "",
        colors: s.colors || [],
        sizes: s.sizes || [],
        documents: s.documents || []
      });
      setIsEditing(true);
      setActiveTab("basic");
      setShowModal(true);
    } catch (err) {
      alert("Failed to fetch style details: " + (err.response?.data?.message || err.message));
    }
  };

  const handleOpenView = async (styleId) => {
    try {
      const res = await getStyleById(styleId);
      setViewStyleData(res.data);
      setShowViewModal(true);
    } catch (err) {
      alert("Failed to fetch style details: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDuplicate = async (styleId, styleNo) => {
    if (!window.confirm(`Are you sure you want to duplicate Style "${styleNo}"?`)) return;
    try {
      const res = await duplicateStyle(styleId);
      setSuccessMsg(res.data.message || `Style duplicated successfully as ${res.data.style_no}`);
      loadStyles();
    } catch (err) {
      alert("Failed to duplicate style: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (styleId, styleNo) => {
    if (!window.confirm(`Are you sure you want to delete Style "${styleNo}"? This action cannot be undone.`)) return;
    try {
      const res = await deleteStyle(styleId);
      setSuccessMsg(res.data.message || "Style deleted successfully");
      loadStyles();
    } catch (err) {
      alert("Failed to delete style: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.style_name) {
      alert("Style Name is required.");
      return;
    }

    try {
      if (isEditing) {
        await updateStyle(formData.style_id, formData);
        setSuccessMsg("Style updated successfully.");
      } else {
        await createStyle(formData);
        setSuccessMsg("Style created successfully.");
      }
      setShowModal(false);
      loadStyles();
    } catch (err) {
      alert("Failed to save style: " + (err.response?.data?.message || err.message));
    }
  };

  // Color row handlers
  const handleAddColor = () => {
    setFormData({
      ...formData,
      colors: [
        ...formData.colors,
        { color_code: "", color_name: "", pantone: "", color_family: "", material_color: "", status: "Active" }
      ]
    });
  };

  const handleRemoveColor = (index) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== index)
    });
  };

  const handleColorChange = (index, field, value) => {
    const updated = [...formData.colors];
    updated[index][field] = value;
    setFormData({ ...formData, colors: updated });
  };

  // Size row handlers
  const handleAddSize = () => {
    setFormData({
      ...formData,
      sizes: [
        ...formData.sizes,
        { size_code: "", size_name: "", length: 0, width: 0, height: 0, gusset: 0, handle_drop: 0, strap_length: 0, strap_width: 0, weight: 0, uom: "cm" }
      ]
    });
  };

  const handleRemoveSize = (index) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index)
    });
  };

  const handleSizeChange = (index, field, value) => {
    const updated = [...formData.sizes];
    updated[index][field] = value;
    setFormData({ ...formData, sizes: updated });
  };

  // Document row handlers
  const handleAddDoc = () => {
    setFormData({
      ...formData,
      documents: [
        ...formData.documents,
        { document_type: "Technical Sketch", document_name: "", file_url: "", file_size: "" }
      ]
    });
  };

  const handleRemoveDoc = (index) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((_, i) => i !== index)
    });
  };

  const handleDocChange = (index, field, value) => {
    const updated = [...formData.documents];
    updated[index][field] = value;
    setFormData({ ...formData, documents: updated });
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredStyles.length === 0) {
      alert("No data to export.");
      return;
    }
    const headers = [
      "Style ID", "Style No", "Style Name", "Category", "Product Type", "Bag Type",
      "Customer", "Brand", "Season", "Status", "Revision", "Colors Count", "Sizes Count", "Tech Sheets"
    ];
    const rows = filteredStyles.map((s) => [
      s.style_id,
      `"${s.style_no || ""}"`,
      `"${s.style_name || ""}"`,
      `"${s.product_category || ""}"`,
      `"${s.product_type || ""}"`,
      `"${s.bag_type || ""}"`,
      `"${s.CustomerName || ""}"`,
      `"${s.brand || ""}"`,
      `"${s.season || ""}"`,
      `"${s.status || ""}"`,
      `"${s.revision || ""}"`,
      s.color_count || 0,
      s.size_count || 0,
      s.tech_sheet_count || 0
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Style_Master_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <Badge bg="success">Active</Badge>;
      case "Approved":
        return <Badge bg="primary">Approved</Badge>;
      case "In Review":
        return <Badge bg="warning" text="dark">In Review</Badge>;
      case "Archived":
        return <Badge bg="secondary">Archived</Badge>;
      default:
        return <Badge bg="light" text="dark" className="border">Draft</Badge>;
    }
  };

  return (
    <Container fluid className="py-3 px-4">
      {/* Header Banner */}
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
        <div>
          <h4 className="mb-1 text-primary fw-bold">
            <FaLayerGroup className="me-2 text-primary" />
            Style Master
          </h4>
          <p className="text-muted mb-0 small">
            Finished product master for bags, leather goods, belts, wallets, card holders & apparels
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" onClick={loadStyles} disabled={loading}>
            <FaSync className={loading ? "fa-spin me-1" : "me-1"} /> Refresh
          </Button>
          <Button variant="outline-success" size="sm" onClick={handleExportCSV}>
            <FaFileExport className="me-1" /> Export CSV
          </Button>
          <Button variant="primary" size="sm" onClick={handleOpenCreate}>
            <FaPlus className="me-1" /> New Style
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
            <Col md={4}>
              <InputGroup size="sm">
                <InputGroup.Text><FaSearch /></InputGroup.Text>
                <Form.Control
                  placeholder="Search Style No, Name, Brand, Season..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select
                size="sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                size="sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                size="sm"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="">All Customers</option>
                {customers.map((c) => (
                  <option key={c.CustomerID} value={c.CustomerID}>{c.CustomerName}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2} className="text-end">
              <span className="small text-muted fw-semibold">
                Total: {filteredStyles.length} style(s)
              </span>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Styles List Table */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted small">Loading styles...</p>
            </div>
          ) : paginatedStyles.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaLayerGroup size={36} className="mb-2 text-secondary opacity-50" />
              <p className="mb-2">No styles found matching the criteria.</p>
              <Button variant="outline-primary" size="sm" onClick={handleOpenCreate}>
                <FaPlus className="me-1" /> Create First Style
              </Button>
            </div>
          ) : (
            <Table hover responsive className="align-middle mb-0 text-nowrap" style={{ fontSize: "13px" }}>
              <thead className="table-light text-secondary">
                <tr>
                  <th style={{ width: "130px" }}>Style No</th>
                  <th>Style Name</th>
                  <th>Category / Type</th>
                  <th>Customer / Brand</th>
                  <th>Season</th>
                  <th className="text-center">Colors</th>
                  <th className="text-center">Sizes</th>
                  <th className="text-center">Tech Sheets</th>
                  <th>Status</th>
                  <th className="text-center" style={{ width: "160px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStyles.map((s) => (
                  <tr key={s.style_id}>
                    <td>
                      <span className="fw-bold text-primary font-monospace">{s.style_no}</span>
                      <div className="small text-muted">Rev: {s.revision || "01"}</div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{s.style_name}</div>
                      {s.short_description && (
                        <div className="small text-muted text-truncate" style={{ maxWidth: "240px" }}>
                          {s.short_description}
                        </div>
                      )}
                    </td>
                    <td>
                      <div><Badge bg="secondary" className="me-1">{s.product_category}</Badge></div>
                      <small className="text-muted">{s.product_type} {s.bag_type ? "• " + s.bag_type : ""}</small>
                    </td>
                    <td>
                      <div className="fw-medium">{s.CustomerName || "—"}</div>
                      <small className="text-muted">{s.brand || "—"}</small>
                    </td>
                    <td>
                      <Badge bg="light" text="dark" className="border">{s.season || "N/A"}</Badge>
                    </td>
                    <td className="text-center">
                      <Badge bg="info" text="dark" className="rounded-pill px-2">
                        <FaPalette className="me-1" />
                        {s.color_count || 0}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Badge bg="secondary" className="rounded-pill px-2">
                        <FaRulerCombined className="me-1" />
                        {s.size_count || 0}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Button
                        variant={s.tech_sheet_count > 0 ? "outline-primary" : "outline-secondary"}
                        size="sm"
                        className="py-0 px-2 rounded-pill small"
                        onClick={() => navigate(`/tech-sheets?style_id=${s.style_id}`)}
                        title="View or Create Tech Sheets for this Style"
                      >
                        <FaFileAlt className="me-1" />
                        {s.tech_sheet_count || 0} Sheets
                      </Button>
                    </td>
                    <td>{getStatusBadge(s.status)}</td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <Button
                          variant="light"
                          className="text-secondary"
                          title="View Details"
                          onClick={() => handleOpenView(s.style_id)}
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant="light"
                          className="text-primary"
                          title="Edit Style"
                          onClick={() => handleOpenEdit(s.style_id)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="light"
                          className="text-info"
                          title="Duplicate Style"
                          onClick={() => handleDuplicate(s.style_id, s.style_no)}
                        >
                          <FaCopy />
                        </Button>
                        <Button
                          variant="light"
                          className="text-danger"
                          title="Delete Style"
                          onClick={() => handleDelete(s.style_id, s.style_no)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center p-3 border-top">
              <small className="text-muted">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredStyles.length)} of {filteredStyles.length}
              </small>
              <Pagination size="sm" className="mb-0">
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                />
                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* ========================================================
          CREATE / EDIT MODAL (5 SECTIONS)
      ======================================================== */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" backdrop="static">
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton className="bg-light py-2">
            <Modal.Title className="h6 fw-bold mb-0 text-primary">
              {isEditing ? (
                <>
                  <FaEdit className="me-2" /> Edit Style: {formData.style_no} - {formData.style_name}
                </>
              ) : (
                <>
                  <FaPlus className="me-2" /> Create New Style Master
                </>
              )}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-3">
            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <Nav variant="pills" className="nav-fill mb-3 bg-light p-1 rounded border">
                <Nav.Item>
                  <Nav.Link eventKey="basic" className="py-1 small fw-semibold">
                    <FaInfoCircle className="me-1" /> 1. Basic Info
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="product" className="py-1 small fw-semibold">
                    <FaCogs className="me-1" /> 2. Product & Bag Details
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="colors" className="py-1 small fw-semibold">
                    <FaPalette className="me-1" /> 3. Colors ({formData.colors.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="sizes" className="py-1 small fw-semibold">
                    <FaRulerCombined className="me-1" /> 4. Sizes & Dims ({formData.sizes.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="docs" className="py-1 small fw-semibold">
                    <FaPaperclip className="me-1" /> 5. Documents ({formData.documents.length})
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                {/* 1. BASIC INFO */}
                <Tab.Pane eventKey="basic">
                  <Row className="g-3">
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Style Number / Code</Form.Label>
                        <Form.Control
                          size="sm"
                          placeholder="Auto-generated if blank (e.g. BAG-1024)"
                          value={formData.style_no}
                          onChange={(e) => setFormData({ ...formData, style_no: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold text-danger">Style Name *</Form.Label>
                        <Form.Control
                          size="sm"
                          required
                          placeholder="e.g. Premium Napa Leather Tote Bag"
                          value={formData.style_name}
                          onChange={(e) => setFormData({ ...formData, style_name: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Product Category</Form.Label>
                        <Form.Select
                          size="sm"
                          value={formData.product_category}
                          onChange={(e) => setFormData({ ...formData, product_category: e.target.value })}
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Customer / Buyer</Form.Label>
                        <Form.Select
                          size="sm"
                          value={formData.customer_id}
                          onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                        >
                          <option value="">Select Customer...</option>
                          {customers.map((c) => (
                            <option key={c.CustomerID} value={c.CustomerID}>{c.CustomerName} ({c.CustomerCode})</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Brand</Form.Label>
                        <Form.Control
                          size="sm"
                          placeholder="e.g. Signature Brand"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Collection</Form.Label>
                        <Form.Control
                          size="sm"
                          placeholder="e.g. Autumn Elegance 2025"
                          value={formData.collection}
                          onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Season</Form.Label>
                        <Form.Select
                          size="sm"
                          value={formData.season}
                          onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                        >
                          {seasons.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Gender</Form.Label>
                        <Form.Select
                          size="sm"
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        >
                          {genders.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Status</Form.Label>
                        <Form.Select
                          size="sm"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Revision</Form.Label>
                        <Form.Control
                          size="sm"
                          value={formData.revision}
                          onChange={(e) => setFormData({ ...formData, revision: e.target.value })}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Short Description / Design Concept</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          size="sm"
                          placeholder="Brief technical or visual description of finished product..."
                          value={formData.short_description}
                          onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab.Pane>

                {/* 2. PRODUCT & MANUFACTURING DETAILS */}
                <Tab.Pane eventKey="product">
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Product Type</Form.Label>
                        <Form.Control
                          size="sm"
                          placeholder="e.g. Tote Bag, Wallet, Backpack"
                          value={formData.product_type}
                          onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Bag Type (if Bag)</Form.Label>
                        <Form.Select
                          size="sm"
                          value={formData.bag_type}
                          onChange={(e) => setFormData({ ...formData, bag_type: e.target.value })}
                        >
                          <option value="">N/A or Select...</option>
                          {bagTypes.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Sub Category</Form.Label>
                        <Form.Control
                          size="sm"
                          placeholder="e.g. Shoulder Bags, Travel Accessories"
                          value={formData.sub_category}
                          onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Usage</Form.Label>
                        <Form.Control
                          size="sm"
                          placeholder="e.g. Everyday / Work / Travel"
                          value={formData.usage}
                          onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Target Market</Form.Label>
                        <Form.Control
                          size="sm"
                          placeholder="e.g. North America, EU, Domestic"
                          value={formData.target_market}
                          onChange={(e) => setFormData({ ...formData, target_market: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Material Group</Form.Label>
                        <Form.Control
                          size="sm"
                          placeholder="e.g. Napa Cowhide, Veg Tan, Canvas 18oz"
                          value={formData.material_group}
                          onChange={(e) => setFormData({ ...formData, material_group: e.target.value })}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Construction Type</Form.Label>
                        <Form.Control
                          size="sm"
                          placeholder="e.g. Turned Edge Stitched, Raw Edge Painted"
                          value={formData.construction_type}
                          onChange={(e) => setFormData({ ...formData, construction_type: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Packaging Type</Form.Label>
                        <Form.Control
                          size="sm"
                          placeholder="e.g. Dust bag + Master export carton"
                          value={formData.packaging_type}
                          onChange={(e) => setFormData({ ...formData, packaging_type: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Country of Origin</Form.Label>
                        <Form.Control
                          size="sm"
                          value={formData.country_of_origin}
                          onChange={(e) => setFormData({ ...formData, country_of_origin: e.target.value })}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">HSN Code</Form.Label>
                        <Form.Control
                          size="sm"
                          placeholder="e.g. 42022190"
                          value={formData.hsn_code}
                          onChange={(e) => setFormData({ ...formData, hsn_code: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">UOM</Form.Label>
                        <Form.Select
                          size="sm"
                          value={formData.uom}
                          onChange={(e) => setFormData({ ...formData, uom: e.target.value })}
                        >
                          {uoms.map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">MOQ (Minimum Order)</Form.Label>
                        <Form.Control
                          type="number"
                          size="sm"
                          value={formData.moq}
                          onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Lead Time</Form.Label>
                        <Form.Control
                          size="sm"
                          placeholder="e.g. 45 Days"
                          value={formData.lead_time}
                          onChange={(e) => setFormData({ ...formData, lead_time: e.target.value })}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Manufacturing Remarks</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          size="sm"
                          placeholder="Special cutting, assembly, or packing requirements..."
                          value={formData.remarks}
                          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab.Pane>

                {/* 3. MULTI-COLOR GRID */}
                <Tab.Pane eventKey="colors">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted fw-semibold">
                      Define multi-color variations and Pantone specifications for this style.
                    </span>
                    <Button variant="outline-primary" size="sm" onClick={handleAddColor}>
                      <FaPlus className="me-1" /> Add Color Row
                    </Button>
                  </div>

                  <Table bordered hover responsive size="sm" className="align-middle text-nowrap" style={{ fontSize: "12px" }}>
                    <thead className="table-light">
                      <tr>
                        <th>Color Code</th>
                        <th>Color Name *</th>
                        <th>Pantone Code</th>
                        <th>Color Family</th>
                        <th>Material Color / Finish</th>
                        <th>Status</th>
                        <th style={{ width: "40px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.colors.map((c, idx) => (
                        <tr key={idx}>
                          <td>
                            <Form.Control
                              size="sm"
                              placeholder="e.g. BLK-01"
                              value={c.color_code || ""}
                              onChange={(e) => handleColorChange(idx, "color_code", e.target.value)}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              required
                              placeholder="e.g. Midnight Black"
                              value={c.color_name || ""}
                              onChange={(e) => handleColorChange(idx, "color_name", e.target.value)}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              placeholder="e.g. 19-4008 TCX"
                              value={c.pantone || ""}
                              onChange={(e) => handleColorChange(idx, "pantone", e.target.value)}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              placeholder="e.g. Black / Tan / Brown"
                              value={c.color_family || ""}
                              onChange={(e) => handleColorChange(idx, "color_family", e.target.value)}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              placeholder="e.g. Matte Napa"
                              value={c.material_color || ""}
                              onChange={(e) => handleColorChange(idx, "material_color", e.target.value)}
                            />
                          </td>
                          <td>
                            <Form.Select
                              size="sm"
                              value={c.status || "Active"}
                              onChange={(e) => handleColorChange(idx, "status", e.target.value)}
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </Form.Select>
                          </td>
                          <td className="text-center">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="p-1"
                              onClick={() => handleRemoveColor(idx)}
                              title="Delete Row"
                            >
                              <FaTrash size={12} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {formData.colors.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center text-muted py-3">
                            No colors configured. Click "Add Color Row" above.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Tab.Pane>

                {/* 4. MULTI-SIZE & DIMENSIONS GRID */}
                <Tab.Pane eventKey="sizes">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted fw-semibold">
                      Define multi-size dimensions (Length x Width x Height x Gusset x Handle Drop) for bags & goods.
                    </span>
                    <Button variant="outline-primary" size="sm" onClick={handleAddSize}>
                      <FaPlus className="me-1" /> Add Size Row
                    </Button>
                  </div>

                  <Table bordered hover responsive size="sm" className="align-middle text-nowrap" style={{ fontSize: "12px" }}>
                    <thead className="table-light">
                      <tr>
                        <th>Size Code</th>
                        <th>Size Name *</th>
                        <th>L (cm)</th>
                        <th>W (cm)</th>
                        <th>H (cm)</th>
                        <th>Gusset (cm)</th>
                        <th>Handle Drop</th>
                        <th>Strap L</th>
                        <th>Weight (kg)</th>
                        <th>Unit</th>
                        <th style={{ width: "40px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.sizes.map((s, idx) => (
                        <tr key={idx}>
                          <td style={{ width: "90px" }}>
                            <Form.Control
                              size="sm"
                              placeholder="e.g. STD"
                              value={s.size_code || ""}
                              onChange={(e) => handleSizeChange(idx, "size_code", e.target.value)}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              required
                              placeholder="e.g. Standard"
                              value={s.size_name || ""}
                              onChange={(e) => handleSizeChange(idx, "size_name", e.target.value)}
                            />
                          </td>
                          <td style={{ width: "70px" }}>
                            <Form.Control
                              type="number"
                              step="0.1"
                              size="sm"
                              value={s.length || ""}
                              onChange={(e) => handleSizeChange(idx, "length", e.target.value)}
                            />
                          </td>
                          <td style={{ width: "70px" }}>
                            <Form.Control
                              type="number"
                              step="0.1"
                              size="sm"
                              value={s.width || ""}
                              onChange={(e) => handleSizeChange(idx, "width", e.target.value)}
                            />
                          </td>
                          <td style={{ width: "70px" }}>
                            <Form.Control
                              type="number"
                              step="0.1"
                              size="sm"
                              value={s.height || ""}
                              onChange={(e) => handleSizeChange(idx, "height", e.target.value)}
                            />
                          </td>
                          <td style={{ width: "70px" }}>
                            <Form.Control
                              type="number"
                              step="0.1"
                              size="sm"
                              value={s.gusset || ""}
                              onChange={(e) => handleSizeChange(idx, "gusset", e.target.value)}
                            />
                          </td>
                          <td style={{ width: "75px" }}>
                            <Form.Control
                              type="number"
                              step="0.1"
                              size="sm"
                              value={s.handle_drop || ""}
                              onChange={(e) => handleSizeChange(idx, "handle_drop", e.target.value)}
                            />
                          </td>
                          <td style={{ width: "75px" }}>
                            <Form.Control
                              type="number"
                              step="0.1"
                              size="sm"
                              value={s.strap_length || ""}
                              onChange={(e) => handleSizeChange(idx, "strap_length", e.target.value)}
                            />
                          </td>
                          <td style={{ width: "75px" }}>
                            <Form.Control
                              type="number"
                              step="0.01"
                              size="sm"
                              value={s.weight || ""}
                              onChange={(e) => handleSizeChange(idx, "weight", e.target.value)}
                            />
                          </td>
                          <td style={{ width: "70px" }}>
                            <Form.Select
                              size="sm"
                              value={s.uom || "cm"}
                              onChange={(e) => handleSizeChange(idx, "uom", e.target.value)}
                            >
                              <option value="cm">cm</option>
                              <option value="inch">in</option>
                              <option value="mm">mm</option>
                            </Form.Select>
                          </td>
                          <td className="text-center">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="p-1"
                              onClick={() => handleRemoveSize(idx)}
                              title="Delete Row"
                            >
                              <FaTrash size={12} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {formData.sizes.length === 0 && (
                        <tr>
                          <td colSpan={11} className="text-center text-muted py-3">
                            No size dimensions configured. Click "Add Size Row" above.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Tab.Pane>

                {/* 5. DOCUMENT ATTACHMENTS */}
                <Tab.Pane eventKey="docs">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted fw-semibold">
                      Attach CAD sketches, technical flats, spec sheets, and reference images.
                    </span>
                    <Button variant="outline-primary" size="sm" onClick={handleAddDoc}>
                      <FaPlus className="me-1" /> Add Document Row
                    </Button>
                  </div>

                  <Table bordered hover responsive size="sm" className="align-middle text-nowrap" style={{ fontSize: "12px" }}>
                    <thead className="table-light">
                      <tr>
                        <th>Doc Type</th>
                        <th>Document / File Name *</th>
                        <th>File URL / Storage Path</th>
                        <th>File Size</th>
                        <th style={{ width: "40px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.documents.map((d, idx) => (
                        <tr key={idx}>
                          <td style={{ width: "180px" }}>
                            <Form.Select
                              size="sm"
                              value={d.document_type || "Technical Sketch"}
                              onChange={(e) => handleDocChange(idx, "document_type", e.target.value)}
                            >
                              <option value="Technical Sketch">Technical Sketch</option>
                              <option value="CAD Drawing">CAD Drawing</option>
                              <option value="Specification Sheet">Specification Sheet</option>
                              <option value="Artwork / Logo">Artwork / Logo</option>
                              <option value="Packaging Design">Packaging Design</option>
                              <option value="Other">Other</option>
                            </Form.Select>
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              required
                              placeholder="e.g. tote_front_back_cad.pdf"
                              value={d.document_name || ""}
                              onChange={(e) => handleDocChange(idx, "document_name", e.target.value)}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              placeholder="e.g. /docs/tote_cad.pdf or cloud link"
                              value={d.file_url || ""}
                              onChange={(e) => handleDocChange(idx, "file_url", e.target.value)}
                            />
                          </td>
                          <td style={{ width: "100px" }}>
                            <Form.Control
                              size="sm"
                              placeholder="e.g. 2.4 MB"
                              value={d.file_size || ""}
                              onChange={(e) => handleDocChange(idx, "file_size", e.target.value)}
                            />
                          </td>
                          <td className="text-center">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="p-1"
                              onClick={() => handleRemoveDoc(idx)}
                              title="Delete Row"
                            >
                              <FaTrash size={12} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {formData.documents.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center text-muted py-3">
                            No documents attached. Click "Add Document Row" above.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Modal.Body>

          <Modal.Header className="bg-light py-2 border-top d-flex justify-content-between">
            <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                type="button"
                onClick={() => {
                  if (activeTab === "basic") setActiveTab("product");
                  else if (activeTab === "product") setActiveTab("colors");
                  else if (activeTab === "colors") setActiveTab("sizes");
                  else if (activeTab === "sizes") setActiveTab("docs");
                }}
              >
                Next Section →
              </Button>
              <Button variant="success" size="sm" type="submit">
                <FaCheck className="me-1" /> Save Style
              </Button>
            </div>
          </Modal.Header>
        </Form>
      </Modal>

      {/* ========================================================
          VIEW STYLE MODAL
      ======================================================== */}
      {viewStyleData && (
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
          <Modal.Header closeButton className="bg-light py-2">
            <Modal.Title className="h6 fw-bold mb-0">
              Style Details: {viewStyleData.style_no} - {viewStyleData.style_name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-3">
            <Row className="g-3 mb-3">
              <Col md={6}>
                <div className="border p-2 rounded bg-light">
                  <div className="small text-muted">Category / Product Type</div>
                  <div className="fw-bold">{viewStyleData.product_category} • {viewStyleData.product_type}</div>
                  <div className="small text-muted mt-2">Bag Type / Usage</div>
                  <div>{viewStyleData.bag_type || "N/A"} • {viewStyleData.usage || "N/A"}</div>
                  <div className="small text-muted mt-2">Target Market / Origin</div>
                  <div>{viewStyleData.target_market || "N/A"} • {viewStyleData.country_of_origin}</div>
                </div>
              </Col>
              <Col md={6}>
                <div className="border p-2 rounded bg-light">
                  <div className="small text-muted">Customer & Brand</div>
                  <div className="fw-bold">{viewStyleData.CustomerName || "—"} ({viewStyleData.brand || "—"})</div>
                  <div className="small text-muted mt-2">Season / Gender</div>
                  <div>{viewStyleData.season || "N/A"} • {viewStyleData.gender || "Unisex"}</div>
                  <div className="small text-muted mt-2">Status & Revision</div>
                  <div>{getStatusBadge(viewStyleData.status)} • Rev: {viewStyleData.revision || "01"}</div>
                </div>
              </Col>
            </Row>

            {/* Colors */}
            <h6 className="fw-bold text-secondary mb-2 small">Configured Colorways ({viewStyleData.colors?.length || 0})</h6>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {viewStyleData.colors?.map((c, i) => (
                <Badge key={i} bg="light" text="dark" className="border p-2">
                  <span className="fw-bold">{c.color_name}</span> ({c.color_code || "No Code"})
                  {c.pantone && <span className="text-muted ms-1">[{c.pantone}]</span>}
                </Badge>
              ))}
              {(!viewStyleData.colors || viewStyleData.colors.length === 0) && (
                <span className="text-muted small">No colors defined.</span>
              )}
            </div>

            {/* Sizes */}
            <h6 className="fw-bold text-secondary mb-2 small">Dimensions & Sizing ({viewStyleData.sizes?.length || 0})</h6>
            <Table size="sm" bordered responsive className="small mb-3">
              <thead className="table-light">
                <tr>
                  <th>Size</th>
                  <th>Length</th>
                  <th>Width</th>
                  <th>Height</th>
                  <th>Gusset</th>
                  <th>Handle Drop</th>
                  <th>Weight</th>
                </tr>
              </thead>
              <tbody>
                {viewStyleData.sizes?.map((sz, i) => (
                  <tr key={i}>
                    <td>{sz.size_name} ({sz.size_code})</td>
                    <td>{sz.length} cm</td>
                    <td>{sz.width} cm</td>
                    <td>{sz.height} cm</td>
                    <td>{sz.gusset} cm</td>
                    <td>{sz.handle_drop} cm</td>
                    <td>{sz.weight} kg</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Tech Sheets */}
            <h6 className="fw-bold text-secondary mb-2 small">Linked Tech Sheets ({viewStyleData.tech_sheets?.length || 0})</h6>
            {viewStyleData.tech_sheets?.length > 0 ? (
              <div className="d-flex flex-wrap gap-2">
                {viewStyleData.tech_sheets.map((ts) => (
                  <Button
                    key={ts.tech_sheet_id}
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      setShowViewModal(false);
                      navigate(`/tech-sheets?id=${ts.tech_sheet_id}`);
                    }}
                  >
                    <FaFileAlt className="me-1" />
                    {ts.tech_sheet_no} ({ts.status}) - Rev {ts.revision}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small">No Tech Sheets created yet.</span>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => {
                    setShowViewModal(false);
                    navigate(`/tech-sheets?create_for_style=${viewStyleData.style_id}`);
                  }}
                >
                  <FaPlus className="me-1" /> Create Tech Sheet Now
                </Button>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="py-2">
            <Button variant="secondary" size="sm" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}
