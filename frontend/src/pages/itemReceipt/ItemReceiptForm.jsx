import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaSave,
  FaPlus,
  FaTrash,
  FaFileInvoice,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export default function ItemReceiptForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  const [form, setForm] = useState({
    GRNNo: "",
    GRNDate: new Date().toISOString().split("T")[0],
    PONo: "",
    SupplierID: "",
    InvoiceNo: "",
    InvoiceDate: "",
    VehicleNo: "",
    Warehouse: "",
    ReceivedBy: "",
    Remarks: "",
    Status: "Draft",
  });

  const [details, setDetails] = useState([
    {
      ItemID: "",
      ItemCode: "",
      ItemName: "",
      UOM: "",
      POQty: "",
      ReceivedQty: "",
      AcceptedQty: "",
      RejectedQty: "",
      Remarks: "",
    },
  ]);

  // ---------------------------------------
  // LOAD MASTER DATA
  // ---------------------------------------
  useEffect(() => {
    loadSuppliers();
    loadPurchaseOrders();

    if (isEdit) {
      loadGRN();
    }
  }, [id]);

  const loadSuppliers = async () => {
    try {
      const response = await axios.get(`${API_URL}/suppliers`);

      const data = response.data?.data || response.data || [];

      setSuppliers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Supplier loading error:", error);
    }
  };

  const loadPurchaseOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/purchaseorders`);

      const data = response.data?.data || response.data || [];

      setPurchaseOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Purchase order loading error:", error);
    }
  };

  // ---------------------------------------
  // LOAD EXISTING GRN
  // ---------------------------------------
  const loadGRN = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/grn/${id}`);

      const result = response.data?.data || response.data;

      if (result) {
        setForm({
          GRNNo: result.GRNNo || "",
          GRNDate: result.GRNDate || "",
          PONo: result.PONo || "",
          SupplierID: result.SupplierID || "",
          InvoiceNo: result.InvoiceNo || "",
          InvoiceDate: result.InvoiceDate || "",
          VehicleNo: result.VehicleNo || "",
          Warehouse: result.Warehouse || "",
          ReceivedBy: result.ReceivedBy || "",
          Remarks: result.Remarks || "",
          Status: result.Status || "Draft",
        });

        if (Array.isArray(result.details)) {
          setDetails(result.details);
        }
      }
    } catch (error) {
      console.error("GRN loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  // FORM CHANGE
  // ---------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ---------------------------------------
  // DETAIL CHANGE
  // ---------------------------------------
  const handleDetailChange = (index, field, value) => {
    setDetails((previous) => {
      const updated = [...previous];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      // Automatically calculate rejected quantity
      if (field === "ReceivedQty" || field === "AcceptedQty") {
        const received = Number(
          field === "ReceivedQty"
            ? value
            : updated[index].ReceivedQty || 0
        );

        const accepted = Number(
          field === "AcceptedQty"
            ? value
            : updated[index].AcceptedQty || 0
        );

        updated[index].RejectedQty = Math.max(
          received - accepted,
          0
        );
      }

      return updated;
    });
  };

  // ---------------------------------------
  // ADD ROW
  // ---------------------------------------
  const addRow = () => {
    setDetails((previous) => [
      ...previous,
      {
        ItemID: "",
        ItemCode: "",
        ItemName: "",
        UOM: "",
        POQty: "",
        ReceivedQty: "",
        AcceptedQty: "",
        RejectedQty: "",
        Remarks: "",
      },
    ]);
  };

  // ---------------------------------------
  // REMOVE ROW
  // ---------------------------------------
  const removeRow = (index) => {
    if (details.length === 1) return;

    setDetails((previous) =>
      previous.filter((_, rowIndex) => rowIndex !== index)
    );
  };

  // ---------------------------------------
  // PURCHASE ORDER SELECT
  // ---------------------------------------
  const handlePOChange = (e) => {
    const poNo = e.target.value;

    const selectedPO = purchaseOrders.find(
      (po) =>
        String(po.PONo || po.PurchaseOrderNo || po.poNo) ===
        String(poNo)
    );

    setForm((previous) => ({
      ...previous,
      PONo: poNo,
      SupplierID:
        selectedPO?.SupplierID ||
        selectedPO?.supplierId ||
        previous.SupplierID,
    }));
  };

  // ---------------------------------------
  // SAVE GRN
  // ---------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.GRNDate) {
      alert("Please select GRN date.");
      return;
    }

    if (!form.SupplierID) {
      alert("Please select supplier.");
      return;
    }

    if (details.length === 0) {
      alert("Please add at least one item.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        details,
      };

      if (isEdit) {
        await axios.put(`${API_URL}/grn/${id}`, payload);
        alert("GRN updated successfully.");
      } else {
        await axios.post(`${API_URL}/grn`, payload);
        alert("GRN created successfully.");
      }

      navigate("/item-receipt");
    } catch (error) {
      console.error("GRN save error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to save GRN."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-3">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">

        <div>
          <h4 className="fw-bold mb-1">
            <FaFileInvoice className="me-2" />
            {isEdit ? "Edit GRN" : "New GRN"}
          </h4>

          <small className="text-muted">
            Goods Receipt Note / Item Receipt
          </small>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/item-receipt")}
        >
          <FaArrowLeft className="me-2" />
          Back
        </button>

      </div>

      <form onSubmit={handleSubmit}>

        {/* BASIC INFORMATION */}
        <div className="card shadow-sm mb-3">

          <div className="card-header bg-white fw-bold">
            GRN Information
          </div>

          <div className="card-body">

            <div className="row g-3">

              <div className="col-md-3">
                <label className="form-label">
                  GRN No
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="GRNNo"
                  value={form.GRNNo}
                  onChange={handleChange}
                  placeholder="Auto / Enter GRN No"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  GRN Date <span className="text-danger">*</span>
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="GRNDate"
                  value={form.GRNDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Purchase Order
                </label>

                <select
                  className="form-select"
                  name="PONo"
                  value={form.PONo}
                  onChange={handlePOChange}
                >
                  <option value="">
                    Select PO
                  </option>

                  {purchaseOrders.map((po, index) => {
                    const poNo =
                      po.PONo ||
                      po.PurchaseOrderNo ||
                      po.poNo;

                    return (
                      <option
                        key={po.POID || po.PurchaseOrderID || index}
                        value={poNo}
                      >
                        {poNo}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Supplier <span className="text-danger">*</span>
                </label>

                <select
                  className="form-select"
                  name="SupplierID"
                  value={form.SupplierID}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Supplier
                  </option>

                  {suppliers.map((supplier, index) => (
                    <option
                      key={
                        supplier.SupplierID ||
                        supplier.supplierId ||
                        index
                      }
                      value={
                        supplier.SupplierID ||
                        supplier.supplierId
                      }
                    >
                      {supplier.SupplierName ||
                        supplier.supplierName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Invoice No
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="InvoiceNo"
                  value={form.InvoiceNo}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Invoice Date
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="InvoiceDate"
                  value={form.InvoiceDate}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Vehicle No
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="VehicleNo"
                  value={form.VehicleNo}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Warehouse
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="Warehouse"
                  value={form.Warehouse}
                  onChange={handleChange}
                  placeholder="Main Warehouse"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Received By
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="ReceivedBy"
                  value={form.ReceivedBy}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Status
                </label>

                <select
                  className="form-select"
                  name="Status"
                  value={form.Status}
                  onChange={handleChange}
                >
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Remarks
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="Remarks"
                  value={form.Remarks}
                  onChange={handleChange}
                />
              </div>

            </div>

          </div>
        </div>

        {/* ITEMS */}
        <div className="card shadow-sm mb-3">

          <div className="card-header bg-white d-flex justify-content-between align-items-center">

            <strong>Received Items</strong>

            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={addRow}
            >
              <FaPlus className="me-1" />
              Add Item
            </button>

          </div>

          <div className="table-responsive">

            <table className="table table-bordered align-middle mb-0">

              <thead className="table-light">

                <tr>
                  <th style={{ width: "50px" }}>#</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>UOM</th>
                  <th>PO Qty</th>
                  <th>Received Qty</th>
                  <th>Accepted Qty</th>
                  <th>Rejected Qty</th>
                  <th>Remarks</th>
                  <th style={{ width: "55px" }}></th>
                </tr>

              </thead>

              <tbody>

                {details.map((item, index) => (

                  <tr key={index}>

                    <td>{index + 1}</td>

                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={item.ItemCode}
                        onChange={(e) =>
                          handleDetailChange(
                            index,
                            "ItemCode",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={item.ItemName}
                        onChange={(e) =>
                          handleDetailChange(
                            index,
                            "ItemName",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={item.UOM}
                        onChange={(e) =>
                          handleDetailChange(
                            index,
                            "UOM",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={item.POQty}
                        onChange={(e) =>
                          handleDetailChange(
                            index,
                            "POQty",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm"
                        value={item.ReceivedQty}
                        onChange={(e) =>
                          handleDetailChange(
                            index,
                            "ReceivedQty",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm"
                        value={item.AcceptedQty}
                        onChange={(e) =>
                          handleDetailChange(
                            index,
                            "AcceptedQty",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={item.RejectedQty}
                        readOnly
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={item.Remarks}
                        onChange={(e) =>
                          handleDetailChange(
                            index,
                            "Remarks",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td className="text-center">

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeRow(index)}
                        disabled={details.length === 1}
                        title="Remove"
                      >
                        <FaTrash />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        </div>

        {/* FOOTER */}
        <div className="d-flex justify-content-end gap-2 mb-4">

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/item-receipt")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            <FaSave className="me-2" />

            {loading
              ? "Saving..."
              : isEdit
                ? "Update GRN"
                : "Save GRN"}
          </button>

        </div>

      </form>

    </div>
  );
}