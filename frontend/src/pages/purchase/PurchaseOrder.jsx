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
  InputGroup,
  Modal,
  Alert,
  Spinner
} from "react-bootstrap";
import {
  FaPlus,
  FaTimes,
  FaFileExcel,
  FaCog,
  FaSave,
  FaEye,
  FaPaperclip,
  FaTrash,
  FaBuilding,
  FaCheck,
  FaDownload,
  FaUpload
} from "react-icons/fa";

import {
  getPendingIndentsForPO,
  getNextPONumber,
  savePurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  deletePurchaseOrder,
  getSuppliers,
  getDepartments,
  getColours,
  getItems
} from "../../services/purchaseService";

import PurchaseOrderPrintModal from "../../components/purchase/PurchaseOrderPrintModal";

export default function PurchaseOrder() {
  // ==========================================
  // FILTERS & SELECTION STATES
  // ==========================================
  const [purchaseType, setPurchaseType] = useState("Domestic");
  const [releaseOption, setReleaseOption] = useState("1. One PO per supplier");
  const [enteredBy, setEnteredBy] = useState("Vaishnav V");
  const [customerOrderNo, setCustomerOrderNo] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [indentType, setIndentType] = useState("");
  const [materialSource, setMaterialSource] = useState("Domestic"); // Domestic | Import | All
  const [classification, setClassification] = useState("Both"); // Both | Leather | Non-Leather
  const [supplierInput, setSupplierInput] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [departmentInput, setDepartmentInput] = useState("");

  // Multi-item Tag Lists
  const [indentInput, setIndentInput] = useState("");
  const [indentNosList, setIndentNosList] = useState([]);

  const [itemGroupInput, setItemGroupInput] = useState("");
  const [itemGroupsList, setItemGroupsList] = useState([]);

  const [itemInput, setItemInput] = useState("");
  const [itemsList, setItemsList] = useState([]);

  const [colourInput, setColourInput] = useState("");
  const [coloursList, setColoursList] = useState([]);

  // Masters cached for autocompletes / suggestions
  const [suppliersMaster, setSuppliersMaster] = useState([]);
  const [departmentsMaster, setDepartmentsMaster] = useState([]);
  const [coloursMaster, setColoursMaster] = useState([]);
  const [itemsMaster, setItemsMaster] = useState([]);

  // ==========================================
  // ITEMS GRID STATES
  // ==========================================
  const [gridRows, setGridRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState(new Set());
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingGrid, setLoadingGrid] = useState(false);

  // ==========================================
  // OTHER CHARGES & TERMS STATES
  // ==========================================
  const [otherCharges, setOtherCharges] = useState([
    { id: 1, accountName: "Freight Charges", currency: "INR", value: "", taxGroup: "GST 18%", cgst: 0, sgst: 0, igst: 0 },
    { id: 2, accountName: "Packing & Forwarding", currency: "INR", value: "", taxGroup: "GST 18%", cgst: 0, sgst: 0, igst: 0 }
  ]);
  const [quoteNo, setQuoteNo] = useState("");
  const [quoteDate, setQuoteDate] = useState("");
  const [freightCharges, setFreightCharges] = useState("");

  const [remark, setRemark] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("30 Days from date of invoice / GRN approval.");
  const [deliveryTerms, setDeliveryTerms] = useState("Door Delivery at Faridabad Unit 9B.");
  const [shipToAddress, setShipToAddress] = useState(
    `Alpine Apparels Pvt. Ltd.\nPLOT NO.9B, SECTOR-27A\nFARIDABAD\nHARYANA-121003`
  );
  const [internalMemo, setInternalMemo] = useState("");

  // File Attachments
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const excelFileInputRef = useRef(null);

  // Terms & Conditions
  const [termsAndConditions, setTermsAndConditions] = useState(
    `1. Goods must strictly match approved garment lab dips and spec sheets.\n2. Defective or non-compliant materials will be rejected at supplier cost.\n3. Delivery must be strictly adhered to as per the agreed Ex-Factory Date.\n4. Proper GST tax invoice and delivery challan must accompany all shipments.`
  );
  const [defaultTermsChecked, setDefaultTermsChecked] = useState(true);

  // ==========================================
  // UI FEEDBACK & MODALS
  // ==========================================
  const [notification, setNotification] = useState(null); // { type: 'success'|'danger'|'info', message }
  const [savingPO, setSavingPO] = useState(false);
  const [showExcelFormatModal, setShowExcelFormatModal] = useState(false);
  const [showAddressPickerModal, setShowAddressPickerModal] = useState(false);

  // PO Register & Print Modal
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [viewingPO, setViewingPO] = useState(null);
  const [allPurchaseOrders, setAllPurchaseOrders] = useState([]);

  // ==========================================
  // INITIAL DATA LOADING
  // ==========================================
  useEffect(() => {
    loadMasters();
    loadAllOrders();
  }, []);

  const loadMasters = async () => {
    try {
      const [supRes, deptRes, colRes, itmRes] = await Promise.allSettled([
        getSuppliers(),
        getDepartments(),
        getColours(),
        getItems()
      ]);

      if (supRes.status === "fulfilled" && supRes.value.data) {
        setSuppliersMaster(Array.isArray(supRes.value.data) ? supRes.value.data : supRes.value.data.data || []);
      }
      if (deptRes.status === "fulfilled" && deptRes.value.data) {
        setDepartmentsMaster(Array.isArray(deptRes.value.data) ? deptRes.value.data : deptRes.value.data.data || []);
      }
      if (colRes.status === "fulfilled" && colRes.value.data) {
        setColoursMaster(Array.isArray(colRes.value.data) ? colRes.value.data : colRes.value.data.data || []);
      }
      if (itmRes.status === "fulfilled" && itmRes.value.data) {
        setItemsMaster(Array.isArray(itmRes.value.data) ? itmRes.value.data : itmRes.value.data.data || []);
      }
    } catch (e) {
      console.warn("Could not load some masters:", e);
    }
  };

  const loadAllOrders = async () => {
    try {
      const res = await getPurchaseOrders();
      if (res.data) {
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        setAllPurchaseOrders(list);
      }
    } catch (e) {
      console.error("Failed to load POs:", e);
    }
  };

  // ==========================================
  // TAG LIST HELPERS
  // ==========================================
  const addTag = (value, list, setList, setInput) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (!list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tagToRemove, list, setList) => {
    setList(list.filter((t) => t !== tagToRemove));
  };

  // ==========================================
  // EXCEL IMPORT FOR INDENT NUMBERS
  // ==========================================
  const handleExcelImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        // Match indent tokens like IND000001, IND-001, IND123, or comma/newline separated
        const matches = text.match(/IND[0-9A-Za-z_-]+/gi);
        if (matches && matches.length > 0) {
          const unique = Array.from(new Set([...indentNosList, ...matches]));
          setIndentNosList(unique);
          setNotification({
            type: "success",
            message: `Successfully imported ${matches.length} Indent number(s) from ${file.name}.`
          });
        } else {
          // Fallback line by line parsing
          const lines = text
            .split(/\r?\n|,/)
            .map((s) => s.trim())
            .filter((s) => s && s.length > 2 && !s.toLowerCase().includes("indent no"));
          if (lines.length > 0) {
            const unique = Array.from(new Set([...indentNosList, ...lines]));
            setIndentNosList(unique);
            setNotification({
              type: "success",
              message: `Imported ${lines.length} indent codes from file.`
            });
          } else {
            setNotification({
              type: "warning",
              message: "No indent numbers detected in the uploaded file."
            });
          }
        }
      } catch (err) {
        setNotification({
          type: "danger",
          message: "Failed to read excel/csv file."
        });
      }
    };
    reader.readAsText(file);
    e.target.value = null; // Reset input
  };

  // ==========================================
  // QUERY / DISPLAY INDENT ITEMS
  // ==========================================
  const handleFetchIndentItems = async (enableEdit = false) => {
    setLoadingGrid(true);
    setNotification(null);
    setIsEditMode(enableEdit);

    try {
      const params = {
        indentNos: indentNosList.join(","),
        itemGroup: itemGroupsList.join(","),
        item: itemsList.join(","),
        colour: coloursList.join(","),
        supplier: supplierInput,
        supplierId: selectedSupplierId,
        department: departmentInput,
        indentType: indentType,
        materialSource: materialSource,
        itemType: classification
      };

      const res = await getPendingIndentsForPO(params);
      const items = res.data?.data || [];

      if (items.length === 0) {
        setNotification({
          type: "info",
          message: "No pending indent items matched the selected criteria."
        });
        setGridRows([]);
        setSelectedRowKeys(new Set());
      } else {
        const formatted = items.map((row, idx) => ({
          key: `${row.IndentID || 'IND'}_${row.IndentDetailID || idx}`,
          indentId: row.IndentID,
          indentDetailId: row.IndentDetailID,
          indentNo: row.IndentNo,
          profitCenter: row.ProfitCenter || "Main Unit",
          supplierId: row.SupplierID || 1,
          supplierName: row.SupplierName || "Standard Supplier",
          group: row.Group || "FABRIC",
          itemId: row.ItemID,
          itemCode: row.ItemCode || "",
          itemName: row.ItemName || "Material",
          color: row.Color || "-",
          sizeRange: row.SizeRange || "-",
          rate: Number(row.Rate || 0),
          costPrice: Number(row.CostPrice || row.Rate || 0),
          balIndentQty: Number(row.BalIndentQty || row.IndentQty || 1),
          orderQty: Number(row.BalIndentQty || row.IndentQty || 1),
          exFTYDate: row.ExFTYDate || new Date().toISOString().slice(0, 10),
          matReqDate: row.MatReqDate || new Date().toISOString().slice(0, 10),
          uom: row.UOM || "PCS"
        }));

        setGridRows(formatted);
        // By default select all displayed rows
        setSelectedRowKeys(new Set(formatted.map((r) => r.key)));
        setNotification({
          type: "success",
          message: `Displayed ${formatted.length} pending item(s) from Indent.`
        });
      }
    } catch (err) {
      console.error(err);
      setNotification({
        type: "danger",
        message: err.response?.data?.error || "Error querying indent items."
      });
      setGridRows([]);
    } finally {
      setLoadingGrid(false);
    }
  };

  // Checkbox row toggles
  const handleToggleRow = (key) => {
    const updated = new Set(selectedRowKeys);
    if (updated.has(key)) {
      updated.delete(key);
    } else {
      updated.add(key);
    }
    setSelectedRowKeys(updated);
  };

  const handleToggleAllRows = () => {
    if (selectedRowKeys.size === gridRows.length) {
      setSelectedRowKeys(new Set());
    } else {
      setSelectedRowKeys(new Set(gridRows.map((r) => r.key)));
    }
  };

  // In-grid row editing
  const handleGridCellChange = (key, field, value) => {
    setGridRows((current) =>
      current.map((row) => {
        if (row.key === key) {
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };

  // ==========================================
  // OTHER CHARGES CALCULATIONS
  // ==========================================
  const handleChargeChange = (id, field, value) => {
    setOtherCharges((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          const updated = { ...ch, [field]: value };
          // Calculate GST amounts based on taxGroup and value
          const amt = Number(updated.value) || 0;
          let rate = 0;
          if (updated.taxGroup === "GST 5%") rate = 0.05;
          else if (updated.taxGroup === "GST 12%") rate = 0.12;
          else if (updated.taxGroup === "GST 18%") rate = 0.18;
          else if (updated.taxGroup === "GST 28%") rate = 0.28;

          const totalTax = amt * rate;
          updated.cgst = (totalTax / 2).toFixed(2);
          updated.sgst = (totalTax / 2).toFixed(2);
          updated.igst = 0;
          return updated;
        }
        return ch;
      })
    );
  };

  const addChargeRow = () => {
    const newId = otherCharges.length ? Math.max(...otherCharges.map((c) => c.id)) + 1 : 1;
    setOtherCharges([
      ...otherCharges,
      { id: newId, accountName: "Insurance Charges", currency: "INR", value: "", taxGroup: "GST 18%", cgst: 0, sgst: 0, igst: 0 }
    ]);
  };

  const removeChargeRow = (id) => {
    setOtherCharges(otherCharges.filter((c) => c.id !== id));
  };

  // ==========================================
  // TOTALS COMPUTATION
  // ==========================================
  const selectedRows = useMemo(() => {
    return gridRows.filter((r) => selectedRowKeys.has(r.key));
  }, [gridRows, selectedRowKeys]);

  const itemsSubTotal = useMemo(() => {
    return selectedRows.reduce((acc, row) => {
      const q = Number(row.orderQty) || 0;
      const r = Number(row.rate) || 0;
      return acc + q * r;
    }, 0);
  }, [selectedRows]);

  const otherChargesTotal = useMemo(() => {
    return otherCharges.reduce((acc, c) => acc + (Number(c.value) || 0), 0);
  }, [otherCharges]);

  const otherChargesGst = useMemo(() => {
    return otherCharges.reduce((acc, c) => {
      return acc + (Number(c.cgst) || 0) + (Number(c.sgst) || 0) + (Number(c.igst) || 0);
    }, 0);
  }, [otherCharges]);

  const freightAmount = Number(freightCharges) || 0;
  const itemsGstAmount = itemsSubTotal * 0.18; // Standard 18% GST on apparel materials
  const totalTaxAmount = itemsGstAmount + otherChargesGst;
  const grandTotalAmount = itemsSubTotal + otherChargesTotal + freightAmount + totalTaxAmount;

  // ==========================================
  // FILE ATTACHMENTS
  // ==========================================
  const handleFileAttachment = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newFiles = files.map((f) => ({
      name: f.name,
      size: (f.size / 1024).toFixed(1) + " KB",
      type: f.type
    }));
    setAttachments([...attachments, ...newFiles]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // ==========================================
  // EXPORT CURRENT TABLE TO CSV
  // ==========================================
  const handleExportCSV = () => {
    if (gridRows.length === 0) {
      alert("No data available in table to export.");
      return;
    }
    const headers = [
      "Indent No",
      "Profit Center",
      "Supplier",
      "Group",
      "Item Code",
      "Item Name",
      "Color",
      "Size Range",
      "Rate",
      "Cost Price",
      "Bal Indent Qty",
      "Order Qty",
      "Ex FTY Date",
      "Mat Req Date"
    ];
    const rows = gridRows.map((r) => [
      r.indentNo,
      r.profitCenter,
      r.supplierName,
      r.group,
      r.itemCode,
      r.itemName,
      r.color,
      r.sizeRange,
      r.rate,
      r.costPrice,
      r.balIndentQty,
      r.orderQty,
      r.exFTYDate,
      r.matReqDate
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((cell) => `"${cell}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Purchase_Order_Indent_Items_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==========================================
  // SAVE PURCHASE ORDER
  // ==========================================
  const handleSavePO = async () => {
    if (selectedRows.length === 0) {
      setNotification({
        type: "danger",
        message: "Please select at least one item from the grid before saving the Purchase Order."
      });
      return;
    }

    setSavingPO(true);
    setNotification(null);

    const payload = {
      purchaseType,
      releaseOption,
      supplierId: selectedSupplierId || selectedRows[0]?.supplierId || 1,
      quoteNo,
      quoteDate,
      freightCharges: freightAmount,
      otherCharges,
      subTotal: itemsSubTotal,
      totalAmount: itemsSubTotal,
      gstAmount: totalTaxAmount,
      cgstAmount: (totalTaxAmount / 2).toFixed(2),
      sgstAmount: (totalTaxAmount / 2).toFixed(2),
      igstAmount: 0,
      netAmount: grandTotalAmount,
      remarks: remark,
      paymentTerms,
      deliveryTerms,
      shipToAddress,
      internalMemo,
      termsConditions: termsAndConditions,
      attachments,
      enteredBy,
      customerOrderNo,
      items: selectedRows.map((r) => ({
        indentId: r.indentId,
        indentDetailId: r.indentDetailId,
        indentNo: r.indentNo,
        profitCenter: r.profitCenter,
        itemId: r.itemId,
        color: r.color,
        sizeRange: r.sizeRange,
        costPrice: r.costPrice,
        balIndentQty: r.balIndentQty,
        orderQty: r.orderQty,
        rate: r.rate,
        amount: Number(r.orderQty) * Number(r.rate),
        exFTYDate: r.exFTYDate,
        matReqDate: r.matReqDate,
        supplierId: r.supplierId
      }))
    };

    try {
      const res = await savePurchaseOrder(payload);
      const data = res.data;

      setNotification({
        type: "success",
        message: `${data.message || 'Purchase Order Created'}. PO Number(s): ${(data.poNumbers || []).join(', ')}`
      });

      // Reload orders register
      await loadAllOrders();

      // Open view voucher if PO ID was returned
      if (data.firstPoId) {
        try {
          const detailRes = await getPurchaseOrderById(data.firstPoId);
          setViewingPO(detailRes.data?.data || detailRes.data);
          setShowPrintModal(true);
        } catch (e) {
          console.warn("Could not fetch newly created PO voucher:", e);
        }
      }

      // Re-fetch remaining indent balances
      await handleFetchIndentItems(isEditMode);
    } catch (err) {
      console.error(err);
      setNotification({
        type: "danger",
        message: err.response?.data?.error || err.response?.data?.message || "Failed to save Purchase Order."
      });
    } finally {
      setSavingPO(false);
    }
  };

  // ==========================================
  // VIEW PO / VOUCHER MODAL TRIGGER
  // ==========================================
  const handleOpenPOViewer = async (poId) => {
    try {
      if (poId) {
        const res = await getPurchaseOrderById(poId);
        setViewingPO(res.data?.data || res.data);
      } else if (allPurchaseOrders.length > 0) {
        const res = await getPurchaseOrderById(allPurchaseOrders[0].POID);
        setViewingPO(res.data?.data || res.data);
      } else {
        setViewingPO(null);
      }
      setShowPrintModal(true);
    } catch (e) {
      console.error(e);
      alert("Failed to load Purchase Order details.");
    }
  };

  const handleDeletePO = async (poId) => {
    if (!window.confirm("Are you sure you want to delete this Purchase Order? Linked Indent balances will be restored.")) {
      return;
    }
    try {
      await deletePurchaseOrder(poId);
      await loadAllOrders();
      if (viewingPO && viewingPO.POID === poId) {
        setViewingPO(null);
      }
      setNotification({
        type: "success",
        message: "Purchase Order deleted and Indent balances restored."
      });
    } catch (e) {
      alert("Failed to delete Purchase Order");
    }
  };

  return (
    <Container fluid className="px-3 py-3" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      {/* ====================================================
          PAGE HEADER
      ===================================================== */}
      <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
        <div>
          <h4 className="fw-bold text-primary mb-0" style={{ letterSpacing: "-0.5px" }}>
            Purchase Order
          </h4>
          <span className="text-muted small">Create and link Purchase Orders with approved Indents</span>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm" onClick={() => handleOpenPOViewer(null)}>
            <FaEye className="me-1" /> View Past Orders ({allPurchaseOrders.length})
          </Button>
        </div>
      </div>

      {notification && (
        <Alert
          variant={notification.type}
          dismissible
          onClose={() => setNotification(null)}
          className="py-2 small shadow-sm"
        >
          {notification.message}
        </Alert>
      )}

      {/* ====================================================
          TOP FILTER & CRITERIA FORM (MATCHING SCREENSHOT 1)
      ===================================================== */}
      <Card className="border shadow-sm mb-3" style={{ background: "#ffffff" }}>
        <Card.Body className="p-3">
          <Row className="g-3">
            {/* ---------------- COLUMN 1 ---------------- */}
            <Col lg={3} md={6}>
              {/* Purchase Type */}
              <Form.Group className="mb-2">
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  Purchase Type <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  size="sm"
                  value={purchaseType}
                  onChange={(e) => setPurchaseType(e.target.value)}
                  className="border-secondary-subtle"
                >
                  <option value="">&lt;--Select--&gt;</option>
                  <option value="Domestic">Domestic</option>
                  <option value="Import">Import</option>
                  <option value="Job Work">Job Work</option>
                  <option value="Regular Purchase">Regular Purchase</option>
                  <option value="Capital Goods">Capital Goods</option>
                </Form.Select>
              </Form.Group>

              {/* Indent Nos Excel Import */}
              <Form.Group className="mb-2">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <Form.Label className="small fw-semibold text-secondary mb-0">
                    Indent Nos Excel
                  </Form.Label>
                  <Button
                    variant="link"
                    className="p-0 small text-decoration-none"
                    style={{ fontSize: "11px" }}
                    onClick={() => setShowExcelFormatModal(true)}
                  >
                    <FaFileExcel className="me-1 text-success" />
                    View excel format
                  </Button>
                </div>
                <div className="d-flex gap-1">
                  <input
                    type="file"
                    ref={excelFileInputRef}
                    style={{ display: "none" }}
                    accept=".xlsx,.xls,.csv,.txt"
                    onChange={handleExcelImport}
                  />
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="w-100 text-truncate text-start small d-flex align-items-center justify-content-between"
                    onClick={() => excelFileInputRef.current?.click()}
                  >
                    <span>Choose file</span>
                    <FaUpload className="text-muted ms-1" />
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="d-flex align-items-center px-2"
                    onClick={() => excelFileInputRef.current?.click()}
                    title="Import Indents from Excel"
                  >
                    <FaUpload className="me-1" /> Import
                  </Button>
                </div>
              </Form.Group>

              {/* Indent No + List Box */}
              <Form.Group className="mb-2">
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  Indent No
                </Form.Label>
                <InputGroup size="sm" className="mb-1">
                  <Form.Control
                    placeholder="Enter Indent No"
                    value={indentInput}
                    onChange={(e) => setIndentInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(indentInput, indentNosList, setIndentNosList, setIndentInput);
                      }
                    }}
                    list="indentSuggestions"
                  />
                  <datalist id="indentSuggestions">
                    <option value="IND000001" />
                    <option value="IND000002" />
                    <option value="IND000003" />
                    <option value="IND000004" />
                    <option value="IND000005" />
                  </datalist>
                  <Button
                    variant="outline-secondary"
                    onClick={() => addTag(indentInput, indentNosList, setIndentNosList, setIndentInput)}
                  >
                    <FaPlus />
                  </Button>
                </InputGroup>
                {/* Scrollable List Box matching screenshot */}
                <div
                  className="border rounded p-1 bg-light overflow-auto"
                  style={{ height: "72px" }}
                >
                  {indentNosList.length > 0 ? (
                    indentNosList.map((tag) => (
                      <div
                        key={tag}
                        className="d-flex justify-content-between align-items-center bg-white px-2 py-0 mb-1 rounded border small"
                      >
                        <span className="fw-semibold text-dark">{tag}</span>
                        <span
                          role="button"
                          className="text-danger fw-bold ms-2"
                          onClick={() => removeTag(tag, indentNosList, setIndentNosList)}
                          title="Remove"
                        >
                          ×
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted text-center small py-3" style={{ fontSize: "11px" }}>
                      No Indents added yet
                    </div>
                  )}
                </div>
              </Form.Group>

              {/* Entered By */}
              <Form.Group className="mb-2">
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  Entered By
                </Form.Label>
                <Form.Control
                  size="sm"
                  placeholder="Type and select Entered By"
                  value={enteredBy}
                  onChange={(e) => setEnteredBy(e.target.value)}
                />
              </Form.Group>

              {/* Release Option */}
              <Form.Group className="mb-2">
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  Release Option <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  size="sm"
                  value={releaseOption}
                  onChange={(e) => setReleaseOption(e.target.value)}
                >
                  <option value="1. One PO per supplier">1. One PO per supplier</option>
                  <option value="2. Combined PO">2. Combined PO</option>
                </Form.Select>
              </Form.Group>

              {/* Customer Order No */}
              <Form.Group className="mb-2">
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  Customer Order No
                </Form.Label>
                <Form.Control
                  size="sm"
                  placeholder="Type and select Customer Order No"
                  value={customerOrderNo}
                  onChange={(e) => setCustomerOrderNo(e.target.value)}
                />
              </Form.Group>

              {/* Display & Edit Row Buttons */}
              <div className="d-flex gap-2 mt-3 align-items-center">
                <Button
                  variant="primary"
                  size="sm"
                  className="fw-semibold px-3"
                  onClick={() => handleFetchIndentItems(true)}
                  disabled={loadingGrid}
                >
                  {loadingGrid && isEditMode ? <Spinner size="sm" className="me-1" /> : null}
                  Display & Edit Row
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="fw-semibold px-3"
                  onClick={() => handleFetchIndentItems(false)}
                  disabled={loadingGrid}
                >
                  {loadingGrid && !isEditMode ? <Spinner size="sm" className="me-1" /> : null}
                  Display
                </Button>
                <Button
                  variant="outline-success"
                  size="sm"
                  className="px-2"
                  onClick={handleExportCSV}
                  title="Export table to Excel / CSV"
                >
                  <FaFileExcel />
                </Button>
              </div>
            </Col>

            {/* ---------------- COLUMN 2 ---------------- */}
            <Col lg={3} md={6}>
              {/* Item Group */}
              <Form.Group className="mb-2">
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  Item Group
                </Form.Label>
                <InputGroup size="sm" className="mb-1">
                  <Form.Control
                    placeholder="Type and select Item Group"
                    value={itemGroupInput}
                    onChange={(e) => setItemGroupInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(itemGroupInput, itemGroupsList, setItemGroupsList, setItemGroupInput);
                      }
                    }}
                    list="groupSuggestions"
                  />
                  <datalist id="groupSuggestions">
                    <option value="Fabrics" />
                    <option value="Leather" />
                    <option value="Zippers" />
                    <option value="Buttons" />
                    <option value="Threads" />
                    <option value="Accessories" />
                  </datalist>
                  <Button
                    variant="outline-secondary"
                    onClick={() => addTag(itemGroupInput, itemGroupsList, setItemGroupsList, setItemGroupInput)}
                  >
                    <FaPlus />
                  </Button>
                </InputGroup>
                <div
                  className="border rounded p-1 bg-light overflow-auto"
                  style={{ height: "72px" }}
                >
                  {itemGroupsList.length > 0 ? (
                    itemGroupsList.map((tag) => (
                      <div
                        key={tag}
                        className="d-flex justify-content-between align-items-center bg-white px-2 py-0 mb-1 rounded border small"
                      >
                        <span className="fw-semibold text-dark">{tag}</span>
                        <span
                          role="button"
                          className="text-danger fw-bold ms-2"
                          onClick={() => removeTag(tag, itemGroupsList, setItemGroupsList)}
                        >
                          ×
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted text-center small py-3" style={{ fontSize: "11px" }}>
                      All Groups
                    </div>
                  )}
                </div>
              </Form.Group>

              {/* Item Category */}
              <Form.Group className="mb-2">
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  Item Category
                </Form.Label>
                <Form.Control
                  size="sm"
                  placeholder="Type & select Item Category"
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                />
              </Form.Group>

              {/* Indent Type */}
              <Form.Group className="mb-2">
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  Indent Type
                </Form.Label>
                <Form.Control
                  size="sm"
                  placeholder="Type & Select Indent Type"
                  value={indentType}
                  onChange={(e) => setIndentType(e.target.value)}
                />
              </Form.Group>

              {/* Material Source Radio */}
              <Form.Group className="mb-2 mt-3">
                <Form.Label className="small fw-semibold text-secondary mb-1 d-block">
                  Material Source
                </Form.Label>
                <div className="d-flex gap-3 small">
                  <Form.Check
                    type="radio"
                    id="src-dom"
                    label="Domestic"
                    name="materialSource"
                    checked={materialSource === "Domestic"}
                    onChange={() => setMaterialSource("Domestic")}
                  />
                  <Form.Check
                    type="radio"
                    id="src-imp"
                    label="Import"
                    name="materialSource"
                    checked={materialSource === "Import"}
                    onChange={() => setMaterialSource("Import")}
                  />
                  <Form.Check
                    type="radio"
                    id="src-all"
                    label="All"
                    name="materialSource"
                    checked={materialSource === "All"}
                    onChange={() => setMaterialSource("All")}
                  />
                </div>
              </Form.Group>
            </Col>

            {/* ---------------- COLUMN 3 ---------------- */}
            <Col lg={3} md={6}>
              {/* Item */}
              <Form.Group className="mb-2">
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  Item
                </Form.Label>
                <InputGroup size="sm" className="mb-1">
                  <Form.Control
                    placeholder="Item"
                    value={itemInput}
                    onChange={(e) => setItemInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(itemInput, itemsList, setItemsList, setItemInput);
                      }
                    }}
                    list="itemSuggestions"
                  />
                  <datalist id="itemSuggestions">
                    {itemsMaster.map((it) => (
                      <option key={it.ItemID} value={it.ItemName} />
                    ))}
                  </datalist>
                  <Button
                    variant="outline-secondary"
                    onClick={() => addTag(itemInput, itemsList, setItemsList, setItemInput)}
                  >
                    <FaPlus />
                  </Button>
                </InputGroup>
                <div
                  className="border rounded p-1 bg-light overflow-auto"
                  style={{ height: "72px" }}
                >
                  {itemsList.length > 0 ? (
                    itemsList.map((tag) => (
                      <div
                        key={tag}
                        className="d-flex justify-content-between align-items-center bg-white px-2 py-0 mb-1 rounded border small"
                      >
                        <span className="fw-semibold text-dark text-truncate">{tag}</span>
                        <span
                          role="button"
                          className="text-danger fw-bold ms-2"
                          onClick={() => removeTag(tag, itemsList, setItemsList)}
                        >
                          ×
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted text-center small py-3" style={{ fontSize: "11px" }}>
                      All Items
                    </div>
                  )}
                </div>
              </Form.Group>

              {/* Supplier */}
              <Form.Group className="mb-2">
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  Supplier
                </Form.Label>
                <Form.Select
                  size="sm"
                  value={selectedSupplierId}
                  onChange={(e) => {
                    setSelectedSupplierId(e.target.value);
                    const sup = suppliersMaster.find((s) => String(s.SupplierID) === e.target.value);
                    setSupplierInput(sup ? sup.SupplierName : "");
                  }}
                >
                  <option value="">Type and select Received From</option>
                  {suppliersMaster.map((s) => (
                    <option key={s.SupplierID} value={s.SupplierID}>
                      {s.SupplierName} ({s.SupplierCode || "SUP"})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Classification Radio: Both / Leather / Non-Leather */}
              <Form.Group className="mb-2 mt-3">
                <Form.Label className="small fw-semibold text-secondary mb-1 d-block">
                  Classification
                </Form.Label>
                <div className="d-flex gap-3 small">
                  <Form.Check
                    type="radio"
                    id="class-both"
                    label="Both"
                    name="classification"
                    checked={classification === "Both"}
                    onChange={() => setClassification("Both")}
                  />
                  <Form.Check
                    type="radio"
                    id="class-lth"
                    label="Leather"
                    name="classification"
                    checked={classification === "Leather"}
                    onChange={() => setClassification("Leather")}
                  />
                  <Form.Check
                    type="radio"
                    id="class-non"
                    label="Non-Leather"
                    name="classification"
                    checked={classification === "Non-Leather"}
                    onChange={() => setClassification("Non-Leather")}
                  />
                </div>
              </Form.Group>
            </Col>

            {/* ---------------- COLUMN 4 ---------------- */}
            <Col lg={3} md={6}>
              {/* Colour */}
              <Form.Group className="mb-2">
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  Colour
                </Form.Label>
                <InputGroup size="sm" className="mb-1">
                  <Form.Control
                    placeholder="Colour"
                    value={colourInput}
                    onChange={(e) => setColourInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(colourInput, coloursList, setColoursList, setColourInput);
                      }
                    }}
                    list="colourSuggestions"
                  />
                  <datalist id="colourSuggestions">
                    <option value="Black" />
                    <option value="Navy Blue" />
                    <option value="Tan Brown" />
                    <option value="Antique Brass" />
                    <option value="Dark Brown" />
                  </datalist>
                  <Button
                    variant="outline-secondary"
                    onClick={() => addTag(colourInput, coloursList, setColoursList, setColourInput)}
                  >
                    <FaPlus />
                  </Button>
                </InputGroup>
                <div
                  className="border rounded p-1 bg-light overflow-auto"
                  style={{ height: "72px" }}
                >
                  {coloursList.length > 0 ? (
                    coloursList.map((tag) => (
                      <div
                        key={tag}
                        className="d-flex justify-content-between align-items-center bg-white px-2 py-0 mb-1 rounded border small"
                      >
                        <span className="fw-semibold text-dark">{tag}</span>
                        <span
                          role="button"
                          className="text-danger fw-bold ms-2"
                          onClick={() => removeTag(tag, coloursList, setColoursList)}
                        >
                          ×
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted text-center small py-3" style={{ fontSize: "11px" }}>
                      All Colours
                    </div>
                  )}
                </div>
              </Form.Group>

              {/* Department */}
              <Form.Group className="mb-2">
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  Department
                </Form.Label>
                <Form.Select
                  size="sm"
                  value={departmentInput}
                  onChange={(e) => setDepartmentInput(e.target.value)}
                >
                  <option value="">Type & Select Department</option>
                  {departmentsMaster.map((d) => (
                    <option key={d.DepartmentID} value={d.DepartmentName}>
                      {d.DepartmentName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ====================================================
          ITEMS TABLE (DEEP BLUE HEADER MATCHING SCREENSHOT 1 & 2)
      ===================================================== */}
      <Card className="border shadow-sm mb-3">
        <style>{`
          .po-main-table th {
            background-color: #1976d2 !important;
            color: #ffffff !important;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
            vertical-align: middle;
            border-color: #1565c0 !important;
          }
          .po-main-table td {
            font-size: 13px;
            vertical-align: middle;
          }
        `}</style>
        <div className="table-responsive" style={{ maxHeight: "420px" }}>
          <Table bordered hover size="sm" className="po-main-table mb-0 text-nowrap">
            <thead className="sticky-top">
              <tr>
                <th style={{ width: "38px" }} className="text-center">
                  <Form.Check
                    type="checkbox"
                    checked={gridRows.length > 0 && selectedRowKeys.size === gridRows.length}
                    onChange={handleToggleAllRows}
                  />
                </th>
                <th>Indent No</th>
                <th>Profit Center</th>
                <th>Supplier</th>
                <th>Group</th>
                <th>Item Name</th>
                <th>Color</th>
                <th>Size Range</th>
                <th className="text-end">Rate</th>
                <th className="text-end">Cost Price</th>
                <th className="text-end">Bal Indent Qty</th>
                {isEditMode && <th className="text-end text-warning">Order Qty</th>}
                <th>Ex.FTY Date</th>
                <th>Mat. Req. Date</th>
              </tr>
            </thead>
            <tbody>
              {gridRows.length > 0 ? (
                gridRows.map((row) => {
                  const isChecked = selectedRowKeys.has(row.key);
                  return (
                    <tr key={row.key} className={isChecked ? "table-active" : ""}>
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleRow(row.key)}
                        />
                      </td>
                      <td className="fw-bold text-primary">{row.indentNo}</td>
                      <td>{row.profitCenter}</td>
                      <td>{row.supplierName}</td>
                      <td>{row.group}</td>
                      <td className="fw-semibold">
                        {row.itemName}
                        {row.itemCode && <span className="text-muted small ms-1">({row.itemCode})</span>}
                      </td>
                      <td>{row.color}</td>
                      <td>{row.sizeRange}</td>

                      {/* Rate (editable in edit mode) */}
                      <td className="text-end">
                        {isEditMode ? (
                          <Form.Control
                            type="number"
                            size="sm"
                            className="text-end py-0 px-1"
                            style={{ width: "90px", display: "inline-block" }}
                            value={row.rate}
                            onChange={(e) => handleGridCellChange(row.key, "rate", e.target.value)}
                          />
                        ) : (
                          Number(row.rate).toFixed(2)
                        )}
                      </td>

                      <td className="text-end text-muted">{Number(row.costPrice).toFixed(2)}</td>
                      <td className="text-end fw-bold text-secondary">{row.balIndentQty}</td>

                      {/* Order Qty (editable in edit mode) */}
                      {isEditMode && (
                        <td className="text-end">
                          <Form.Control
                            type="number"
                            size="sm"
                            className="text-end py-0 px-1 fw-bold text-success"
                            style={{ width: "90px", display: "inline-block" }}
                            value={row.orderQty}
                            max={row.balIndentQty}
                            onChange={(e) => handleGridCellChange(row.key, "orderQty", e.target.value)}
                          />
                        </td>
                      )}

                      {/* Ex FTY Date */}
                      <td>
                        {isEditMode ? (
                          <Form.Control
                            type="date"
                            size="sm"
                            value={row.exFTYDate}
                            onChange={(e) => handleGridCellChange(row.key, "exFTYDate", e.target.value)}
                          />
                        ) : (
                          row.exFTYDate
                        )}
                      </td>

                      {/* Mat Req Date */}
                      <td>{row.matReqDate}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isEditMode ? 14 : 13} className="text-center py-5 text-muted">
                    {loadingGrid ? (
                      <div>
                        <Spinner animation="border" size="sm" className="me-2 text-primary" />
                        Fetching pending Indent items...
                      </div>
                    ) : (
                      <div>
                        No items displayed. Select Indent No or filters above and click{" "}
                        <strong>Display</strong> or <strong>Display & Edit Row</strong>.
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <Card.Footer className="bg-light py-2 d-flex justify-content-between align-items-center small text-muted">
          <span>
            Showing <strong>{gridRows.length}</strong> items | <strong>{selectedRowKeys.size}</strong> selected for Purchase Order
          </span>
          <span className="fw-semibold text-dark">
            Selected Items Subtotal: ₹{itemsSubTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </Card.Footer>
      </Card>

      {/* ====================================================
          OTHER CHARGES & QUOTE DETAILS (SCREENSHOT 2)
      ===================================================== */}
      <Card className="border shadow-sm mb-3">
        <Card.Body className="p-3">
          <div className="d-flex align-items-center gap-2 mb-2 pb-1 border-bottom">
            <span className="fw-bold text-primary fs-6">Other Charges</span>
            <FaCog className="text-muted" />
          </div>

          <Row className="g-3">
            {/* Charges Table */}
            <Col lg={7}>
              <Table bordered size="sm" className="small mb-2">
                <thead style={{ background: "#e3f2fd" }}>
                  <tr>
                    <th>Account Name</th>
                    <th style={{ width: "95px" }}>Currency</th>
                    <th style={{ width: "110px" }}>Value</th>
                    <th style={{ width: "120px" }}>Tax Group</th>
                    <th style={{ width: "65px" }} className="text-end">CGST</th>
                    <th style={{ width: "65px" }} className="text-end">SGST</th>
                    <th style={{ width: "65px" }} className="text-end">IGST</th>
                    <th style={{ width: "40px" }} className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {otherCharges.map((ch) => (
                    <tr key={ch.id}>
                      <td>
                        <Form.Control
                          size="sm"
                          placeholder="Type an..."
                          value={ch.accountName}
                          onChange={(e) => handleChargeChange(ch.id, "accountName", e.target.value)}
                        />
                      </td>
                      <td>
                        <Form.Select
                          size="sm"
                          value={ch.currency}
                          onChange={(e) => handleChargeChange(ch.id, "currency", e.target.value)}
                        >
                          <option value="INR">INR</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          size="sm"
                          placeholder="Enter Amount"
                          value={ch.value}
                          onChange={(e) => handleChargeChange(ch.id, "value", e.target.value)}
                        />
                      </td>
                      <td>
                        <Form.Select
                          size="sm"
                          value={ch.taxGroup}
                          onChange={(e) => handleChargeChange(ch.id, "taxGroup", e.target.value)}
                        >
                          <option value="Exempt">Exempt</option>
                          <option value="GST 5%">GST 5%</option>
                          <option value="GST 12%">GST 12%</option>
                          <option value="GST 18%">GST 18%</option>
                          <option value="GST 28%">GST 28%</option>
                        </Form.Select>
                      </td>
                      <td className="text-end align-middle bg-light">{ch.cgst}</td>
                      <td className="text-end align-middle bg-light">{ch.sgst}</td>
                      <td className="text-end align-middle bg-light">{ch.igst}</td>
                      <td className="text-center align-middle">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="py-0 px-1 border-0"
                          onClick={() => removeChargeRow(ch.id)}
                          title="Remove Charge"
                        >
                          <FaTimes />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="outline-primary" size="sm" onClick={addChargeRow} className="small">
                <FaPlus className="me-1" /> Add Charge Row
              </Button>
            </Col>

            {/* Quote and Freight Inputs */}
            <Col lg={5}>
              <Row className="g-2">
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small fw-semibold text-secondary mb-1">
                      Quote No
                    </Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder="Enter Quote No"
                      value={quoteNo}
                      onChange={(e) => setQuoteNo(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small fw-semibold text-secondary mb-1">
                      Freight Charges
                    </Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      placeholder="Enter Freight Charges"
                      value={freightCharges}
                      onChange={(e) => setFreightCharges(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small fw-semibold text-secondary mb-1">
                      Quote Date
                    </Form.Label>
                    <Form.Control
                      type="date"
                      size="sm"
                      value={quoteDate}
                      onChange={(e) => setQuoteDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ====================================================
          INSTRUCTIONS & TERMS (SCREENSHOTS 2 & 3)
      ===================================================== */}
      <Card className="border shadow-sm mb-3">
        <Card.Body className="p-3">
          <div className="fw-bold text-primary fs-6 mb-2 pb-1 border-bottom">
            Instructions & Terms
          </div>

          <Row className="g-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  Remark
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  size="sm"
                  placeholder="Enter Remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  Payment Terms
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  size="sm"
                  placeholder="Enter Payment Terms"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  Delivery Terms
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  size="sm"
                  placeholder="Enter Delivery Terms"
                  value={deliveryTerms}
                  onChange={(e) => setDeliveryTerms(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <Form.Label className="small fw-semibold text-secondary mb-0">
                    Ship To Address
                  </Form.Label>
                  <Button
                    variant="link"
                    className="p-0 text-decoration-none small"
                    onClick={() => setShowAddressPickerModal(true)}
                    title="Select Alternate Plant Address"
                  >
                    <FaBuilding className="me-1" /> Choose Address
                  </Button>
                </div>
                <Form.Control
                  as="textarea"
                  rows={3}
                  size="sm"
                  value={shipToAddress}
                  onChange={(e) => setShipToAddress(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  Internal Memo
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  size="sm"
                  placeholder="Enter Internal Memo"
                  value={internalMemo}
                  onChange={(e) => setInternalMemo(e.target.value)}
                />
              </Form.Group>
            </Col>

            {/* Attachments (Screenshot 4) */}
            <Col md={6}>
              <Form.Label className="small fw-semibold text-secondary mb-1 d-block">
                Attachments
              </Form.Label>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileAttachment}
              />
              <Button
                variant="outline-primary"
                size="sm"
                className="mb-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaPaperclip className="me-1" /> + Add files...
              </Button>
              <div className="border rounded p-2 bg-light overflow-auto" style={{ maxHeight: "80px" }}>
                {attachments.length > 0 ? (
                  attachments.map((file, i) => (
                    <Badge
                      bg="info"
                      key={i}
                      className="me-2 mb-1 p-2 text-dark border d-inline-flex align-items-center gap-1"
                    >
                      {file.name} ({file.size})
                      <FaTimes
                        role="button"
                        className="text-danger ms-1"
                        onClick={() => removeAttachment(i)}
                      />
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted small">No files attached.</span>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ====================================================
          TERMS & CONDITIONS (SCREENSHOT 4)
      ===================================================== */}
      <Card className="border shadow-sm mb-4">
        <Card.Body className="p-3">
          <div className="fw-bold text-primary fs-6 mb-2 pb-1 border-bottom">
            Terms & Conditions
          </div>
          <Form.Group className="mb-2">
            <Form.Control
              as="textarea"
              rows={3}
              size="sm"
              value={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.value)}
            />
          </Form.Group>
          <Form.Check
            type="checkbox"
            id="default-terms-check"
            label="Make this as my default Terms & Conditions"
            checked={defaultTermsChecked}
            onChange={(e) => setDefaultTermsChecked(e.target.checked)}
            className="small text-secondary"
          />
        </Card.Body>
      </Card>

      {/* ====================================================
          BOTTOM TOTALS & ACTION BUTTONS (SCREENSHOT 4)
      ===================================================== */}
      <Card className="border shadow-sm mb-4 bg-white sticky-bottom">
        <Card.Body className="py-2 px-3 d-flex flex-wrap justify-content-between align-items-center">
          <div className="d-flex gap-4 small text-secondary">
            <div>
              Items Total: <strong>₹{itemsSubTotal.toFixed(2)}</strong>
            </div>
            {otherChargesTotal > 0 && (
              <div>
                Other Charges: <strong>₹{otherChargesTotal.toFixed(2)}</strong>
              </div>
            )}
            {freightAmount > 0 && (
              <div>
                Freight: <strong>₹{freightAmount.toFixed(2)}</strong>
              </div>
            )}
            <div>
              Est. GST: <strong>₹{totalTaxAmount.toFixed(2)}</strong>
            </div>
            <div className="fs-6 fw-bold text-primary border-start ps-3">
              Net Total: ₹{grandTotalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="d-flex gap-2">
            <Button
              variant="success"
              size="md"
              className="fw-bold px-4 d-flex align-items-center gap-2"
              onClick={handleSavePO}
              disabled={savingPO}
              style={{ backgroundColor: "#2e7d32", borderColor: "#2e7d32" }}
            >
              {savingPO ? <Spinner size="sm" /> : <FaSave />}
              Save
            </Button>
            <Button
              variant="primary"
              size="md"
              className="fw-bold px-4 d-flex align-items-center gap-2"
              onClick={() => handleOpenPOViewer(null)}
              style={{ backgroundColor: "#1976d2", borderColor: "#1976d2" }}
            >
              <FaEye />
              View
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* ====================================================
          MODAL 1: EXCEL FORMAT GUIDE
      ===================================================== */}
      <Modal show={showExcelFormatModal} onHide={() => setShowExcelFormatModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">Excel Indent Format Guide</Modal.Title>
        </Modal.Header>
        <Modal.Body className="small">
          <p>
            You can upload a <strong>.xlsx</strong>, <strong>.xls</strong>, or <strong>.csv</strong> file containing
            one column named <code>Indent No</code>.
          </p>
          <Table size="sm" bordered className="bg-light">
            <thead>
              <tr>
                <th>Indent No</th>
                <th>Remarks (Optional)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>IND000001</td>
                <td>Urgent cutting requirement</td>
              </tr>
              <tr>
                <td>IND000002</td>
                <td>Raw materials store</td>
              </tr>
              <tr>
                <td>IND000003</td>
                <td>Season order EXP-901</td>
              </tr>
            </tbody>
          </Table>
          <p className="text-muted mb-0">
            Clicking <em>Import</em> will parse all Indent IDs and add them to your active Indent No filter listbox.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowExcelFormatModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ====================================================
          MODAL 2: SHIP TO ADDRESS PICKER
      ===================================================== */}
      <Modal show={showAddressPickerModal} onHide={() => setShowAddressPickerModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">Select Plant Delivery Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {[
            {
              title: "Faridabad Unit 9B (Headquarters)",
              addr: "Alpine Apparels Pvt. Ltd.\nPLOT NO.9B, SECTOR-27A\nFARIDABAD\nHARYANA-121003"
            },
            {
              title: "Faridabad Unit 25 (Cutting & Prep)",
              addr: "Alpine Apparels Pvt. Ltd.\nPLOT NO. 25, INDUSTRIAL AREA NIT\nFARIDABAD\nHARYANA-121001"
            },
            {
              title: "Gurugram Warehouse (Central Stores)",
              addr: "Alpine Apparels Pvt. Ltd.\nWAREHOUSE 14, SECTOR 37 PACE CITY\nGURUGRAM\nHARYANA-122001"
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="border p-2 rounded mb-2 bg-light"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setShipToAddress(item.addr);
                setShowAddressPickerModal(false);
              }}
            >
              <div className="fw-bold small text-primary">{item.title}</div>
              <pre className="small mb-0 text-dark" style={{ fontFamily: "inherit" }}>
                {item.addr}
              </pre>
            </div>
          ))}
        </Modal.Body>
      </Modal>

      {/* ====================================================
          MODAL 3: PURCHASE ORDER PRINT & EXPLORER MODAL
      ===================================================== */}
      <PurchaseOrderPrintModal
        show={showPrintModal}
        onHide={() => setShowPrintModal(false)}
        poData={viewingPO}
        allOrders={allPurchaseOrders}
        onSelectPO={handleOpenPOViewer}
        onDeletePO={handleDeletePO}
      />
    </Container>
  );
}
