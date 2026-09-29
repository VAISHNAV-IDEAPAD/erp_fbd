import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaEdit,
  FaPrint,
  FaFileInvoice,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export default function ItemReceiptView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [grn, setGrn] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------
  // LOAD GRN
  // ---------------------------------------
  useEffect(() => {
    loadGRN();
  }, [id]);

  const loadGRN = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/grn/${id}`);

      const data = response.data?.data || response.data;

      setGrn(data);
    } catch (error) {
      console.error("Error loading GRN:", error);
      setGrn(null);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  // PRINT
  // ---------------------------------------
  const handlePrint = () => {
    window.print();
  };

  // ---------------------------------------
  // LOADING
  // ---------------------------------------
  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" />
        <div className="mt-2 text-muted">
          Loading GRN...
        </div>
      </div>
    );
  }

  // ---------------------------------------
  // NOT FOUND
  // ---------------------------------------
  if (!grn) {
    return (
      <div className="container-fluid py-5 text-center">
        <h5>GRN not found</h5>

        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/item-receipt")}
        >
          <FaArrowLeft className="me-2" />
          Back to GRN
        </button>
      </div>
    );
  }

  const details =
    grn.details ||
    grn.GRNDetails ||
    grn.items ||
    [];

  const grnNo =
    grn.GRNNo ||
    grn.grnNo ||
    "-";

  const grnDate =
    grn.GRNDate ||
    grn.grnDate ||
    "-";

  const poNo =
    grn.PONo ||
    grn.PurchaseOrderNo ||
    grn.poNo ||
    "-";

  const supplier =
    grn.SupplierName ||
    grn.supplierName ||
    "-";

  const invoiceNo =
    grn.InvoiceNo ||
    grn.invoiceNo ||
    "-";

  const invoiceDate =
    grn.InvoiceDate ||
    grn.invoiceDate ||
    "-";

  const vehicleNo =
    grn.VehicleNo ||
    grn.vehicleNo ||
    "-";

  const warehouse =
    grn.Warehouse ||
    grn.warehouse ||
    "-";

  const receivedBy =
    grn.ReceivedBy ||
    grn.receivedBy ||
    "-";

  const remarks =
    grn.Remarks ||
    grn.remarks ||
    "-";

  const status =
    grn.Status ||
    grn.status ||
    "Draft";

  return (
    <div className="container-fluid py-3">

      {/* ACTION HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3 no-print">

        <div>
          <h4 className="fw-bold mb-1">
            <FaFileInvoice className="me-2" />
            GRN Details
          </h4>

          <small className="text-muted">
            Goods Receipt Note
          </small>
        </div>

        <div className="d-flex gap-2">

          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/item-receipt")}
          >
            <FaArrowLeft className="me-2" />
            Back
          </button>

          <button
            className="btn btn-outline-primary"
            onClick={() =>
              navigate(`/item-receipt/edit/${id}`)
            }
          >
            <FaEdit className="me-2" />
            Edit
          </button>

          <button
            className="btn btn-primary"
            onClick={handlePrint}
          >
            <FaPrint className="me-2" />
            Print
          </button>

        </div>

      </div>

      {/* GRN DOCUMENT */}
      <div className="card shadow-sm grn-document">

        {/* DOCUMENT HEADER */}
        <div className="card-body">

          <div className="row align-items-center border-bottom pb-3 mb-3">

            <div className="col-md-8">

              <h3 className="fw-bold mb-1">
                GOODS RECEIPT NOTE
              </h3>

              <div className="text-muted">
                Item Receipt
              </div>

            </div>

            <div className="col-md-4 text-md-end">

              <div>
                <strong>GRN No:</strong>{" "}
                {grnNo}
              </div>

              <div>
                <strong>GRN Date:</strong>{" "}
                {grnDate}
              </div>

              <div className="mt-1">

                <span
                  className={`badge ${
                    String(status).toLowerCase() ===
                    "completed"
                      ? "bg-success"
                      : String(status).toLowerCase() ===
                        "pending"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                  }`}
                >
                  {status}
                </span>

              </div>

            </div>

          </div>

          {/* INFORMATION */}
          <div className="row g-3 mb-4">

            <div className="col-md-6">

              <div className="info-box">

                <h6 className="fw-bold border-bottom pb-2">
                  Supplier Information
                </h6>

                <div className="row mb-1">
                  <div className="col-5 text-muted">
                    Supplier
                  </div>
                  <div className="col-7 fw-semibold">
                    {supplier}
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-5 text-muted">
                    PO No
                  </div>
                  <div className="col-7">
                    {poNo}
                  </div>
                </div>

                <div className="row">
                  <div className="col-5 text-muted">
                    Warehouse
                  </div>
                  <div className="col-7">
                    {warehouse}
                  </div>
                </div>

              </div>

            </div>

            <div className="col-md-6">

              <div className="info-box">

                <h6 className="fw-bold border-bottom pb-2">
                  Invoice / Transport
                </h6>

                <div className="row mb-1">
                  <div className="col-5 text-muted">
                    Invoice No
                  </div>
                  <div className="col-7">
                    {invoiceNo}
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-5 text-muted">
                    Invoice Date
                  </div>
                  <div className="col-7">
                    {invoiceDate}
                  </div>
                </div>

                <div className="row">
                  <div className="col-5 text-muted">
                    Vehicle No
                  </div>
                  <div className="col-7">
                    {vehicleNo}
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* ITEMS */}
          <div className="table-responsive">

            <table className="table table-bordered align-middle">

              <thead className="table-light">

                <tr>
                  <th style={{ width: "50px" }}>#</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>UOM</th>
                  <th className="text-end">PO Qty</th>
                  <th className="text-end">Received Qty</th>
                  <th className="text-end">Accepted Qty</th>
                  <th className="text-end">Rejected Qty</th>
                  <th>Remarks</th>
                </tr>

              </thead>

              <tbody>

                {details.length === 0 ? (

                  <tr>
                    <td
                      colSpan="9"
                      className="text-center text-muted py-4"
                    >
                      No item details available
                    </td>
                  </tr>

                ) : (

                  details.map((item, index) => {

                    const itemCode =
                      item.ItemCode ||
                      item.itemCode ||
                      "-";

                    const itemName =
                      item.ItemName ||
                      item.itemName ||
                      "-";

                    const uom =
                      item.UOM ||
                      item.uom ||
                      "-";

                    const poQty =
                      item.POQty ||
                      item.poQty ||
                      0;

                    const receivedQty =
                      item.ReceivedQty ||
                      item.receivedQty ||
                      0;

                    const acceptedQty =
                      item.AcceptedQty ||
                      item.acceptedQty ||
                      0;

                    const rejectedQty =
                      item.RejectedQty ||
                      item.rejectedQty ||
                      0;

                    const itemRemarks =
                      item.Remarks ||
                      item.remarks ||
                      "-";

                    return (
                      <tr key={item.GRNDetailID || index}>

                        <td>{index + 1}</td>

                        <td>
                          <strong>
                            {itemCode}
                          </strong>
                        </td>

                        <td>{itemName}</td>

                        <td>{uom}</td>

                        <td className="text-end">
                          {poQty}
                        </td>

                        <td className="text-end">
                          {receivedQty}
                        </td>

                        <td className="text-end">
                          {acceptedQty}
                        </td>

                        <td className="text-end">
                          {rejectedQty}
                        </td>

                        <td>
                          {itemRemarks}
                        </td>

                      </tr>
                    );
                  })

                )}

              </tbody>

            </table>

          </div>

          {/* REMARKS */}
          <div className="mt-4">

            <h6 className="fw-bold">
              Remarks
            </h6>

            <div className="border rounded p-3 bg-light">
              {remarks}
            </div>

          </div>

          {/* RECEIVED BY */}
          <div className="row mt-5">

            <div className="col-md-4 text-center">
              <div className="border-top pt-2">
                Prepared By
              </div>
            </div>

            <div className="col-md-4 text-center">
              <div className="border-top pt-2">
                Received By
                <br />
                <strong>{receivedBy}</strong>
              </div>
            </div>

            <div className="col-md-4 text-center">
              <div className="border-top pt-2">
                Authorized By
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* PRINT CSS */}
      <style>{`

        .info-box {
          border: 1px solid #dee2e6;
          border-radius: 6px;
          padding: 15px;
          height: 100%;
        }

        @media print {

          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .grn-document {
            border: none !important;
            box-shadow: none !important;
          }

          .container-fluid {
            padding: 0 !important;
          }

          .card-body {
            padding: 10px !important;
          }

          @page {
            size: A4;
            margin: 12mm;
          }

        }

      `}</style>

    </div>
  );
}