import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaSyncAlt,
  FaFileInvoice,
} from "react-icons/fa";
import axios from "axios";

export default function ItemReceipts() {
  const navigate = useNavigate();

  const [grns, setGrns] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "/api";

  // ---------------------------------------
  // LOAD GRNs
  // ---------------------------------------
  const loadGRNs = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/grn`);

      const data = response.data?.data || response.data || [];

      setGrns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading GRNs:", error);
      setGrns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGRNs();
  }, []);

  // ---------------------------------------
  // SEARCH
  // ---------------------------------------
  const filteredGRNs = grns.filter((grn) => {
    const searchText = search.toLowerCase();

    return (
      String(grn.GRNNo || grn.grnNo || "")
        .toLowerCase()
        .includes(searchText) ||
      String(grn.SupplierName || grn.supplierName || "")
        .toLowerCase()
        .includes(searchText) ||
      String(grn.PONo || grn.poNo || "")
        .toLowerCase()
        .includes(searchText) ||
      String(grn.Status || grn.status || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  // ---------------------------------------
  // STATUS
  // ---------------------------------------
  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "completed" || value === "complete") {
      return "grn-status completed";
    }

    if (value === "pending") {
      return "grn-status pending";
    }

    if (value === "cancelled" || value === "canceled") {
      return "grn-status cancelled";
    }

    return "grn-status draft";
  };

  // ---------------------------------------
  // NEW GRN
  // ---------------------------------------
  const handleNewGRN = () => {
    navigate("/item-receipt/new");
  };

  // ---------------------------------------
  // VIEW GRN
  // ---------------------------------------
  const handleView = (id) => {
    navigate(`/item-receipt/view/${id}`);
  };

  // ---------------------------------------
  // EDIT GRN
  // ---------------------------------------
  const handleEdit = (id) => {
    navigate(`/item-receipt/edit/${id}`);
  };

  return (
    <div className="container-fluid py-3">

      {/* PAGE HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">

        <div>
          <h4 className="mb-1 fw-bold">
            <FaFileInvoice className="me-2" />
            Item Receipt / GRN
          </h4>

          <small className="text-muted">
            Goods Receipt Notes
          </small>
        </div>

        <div className="d-flex gap-2">

          <button
            className="btn btn-outline-secondary"
            onClick={loadGRNs}
            disabled={loading}
          >
            <FaSyncAlt className={loading ? "spin" : ""} />
            <span className="ms-2">Refresh</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={handleNewGRN}
          >
            <FaPlus className="me-2" />
            New GRN
          </button>

        </div>
      </div>

      {/* SEARCH */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">

          <div className="input-group">

            <span className="input-group-text">
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search GRN No, Supplier, PO No or Status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setSearch("")}
              >
                Clear
              </button>
            )}

          </div>

        </div>
      </div>

      {/* GRN TABLE */}
      <div className="card shadow-sm">

        <div className="card-header bg-white d-flex justify-content-between align-items-center">

          <strong>GRN Register</strong>

          <span className="badge bg-secondary">
            {filteredGRNs.length} Records
          </span>

        </div>

        <div className="table-responsive">

          <table className="table table-hover table-bordered align-middle mb-0">

            <thead className="table-light">

              <tr>
                <th>#</th>
                <th>GRN No</th>
                <th>GRN Date</th>
                <th>PO No</th>
                <th>Supplier</th>
                <th>Invoice No</th>
                <th>Received By</th>
                <th>Status</th>
                <th style={{ width: "120px" }}>Action</th>
              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td colSpan="9" className="text-center py-4">
                    Loading GRNs...
                  </td>
                </tr>

              ) : filteredGRNs.length === 0 ? (

                <tr>
                  <td colSpan="9" className="text-center py-5">

                    <div className="text-muted mb-2">
                      No GRN records found
                    </div>

                    <button
                      className="btn btn-sm btn-primary"
                      onClick={handleNewGRN}
                    >
                      <FaPlus className="me-1" />
                      Create First GRN
                    </button>

                  </td>
                </tr>

              ) : (

                filteredGRNs.map((grn, index) => {

                  const id =
                    grn.GRNID ||
                    grn.GRNId ||
                    grn.grnId ||
                    grn.id;

                  const grnNo =
                    grn.GRNNo ||
                    grn.grnNo ||
                    "-";

                  const grnDate =
                    grn.GRNDate ||
                    grn.grnDate ||
                    grn.CreatedAt ||
                    grn.createdAt ||
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

                  const receivedBy =
                    grn.ReceivedBy ||
                    grn.receivedBy ||
                    "-";

                  const status =
                    grn.Status ||
                    grn.status ||
                    "Draft";

                  return (

                    <tr key={id || index}>

                      <td>{index + 1}</td>

                      <td>
                        <strong>{grnNo}</strong>
                      </td>

                      <td>{grnDate}</td>

                      <td>{poNo}</td>

                      <td>{supplier}</td>

                      <td>{invoiceNo}</td>

                      <td>{receivedBy}</td>

                      <td>
                        <span className={getStatusClass(status)}>
                          {status}
                        </span>
                      </td>

                      <td>

                        <div className="d-flex gap-1">

                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="View"
                            onClick={() => handleView(id)}
                          >
                            <FaEye />
                          </button>

                          <button
                            className="btn btn-sm btn-outline-secondary"
                            title="Edit"
                            onClick={() => handleEdit(id)}
                          >
                            <FaEdit />
                          </button>

                        </div>

                      </td>

                    </tr>

                  );
                })

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* LOCAL STYLES */}
      <style>{`
        .grn-status {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .grn-status.completed {
          background: #d1e7dd;
          color: #0f5132;
        }

        .grn-status.pending {
          background: #f8d7da;
          color: #842029;
        }

        .grn-status.cancelled {
          background: #e2e3e5;
          color: #41464b;
        }

        .grn-status.draft {
          background: #fff3cd;
          color: #664d03;
        }

        .spin {
          animation: grnSpin 1s linear infinite;
        }

        @keyframes grnSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

    </div>
  );
}