import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaSave,
    FaPrint,
    FaPlus,
    FaTrash,
    FaCheckCircle,
    FaUndo,
    FaListAlt
} from "react-icons/fa";
import {
    getInternalOrders,
    getInternalOrderById,
    createInternalOrder,
    updateInternalOrder,
    updateInternalOrderStatus
} from "../../../services/internalOrderService";
import "../../../styles/internalOrder.css";

export default function InternalOrderMaster() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Order list for selector (orders 168 to 212)
    const [allOrders, setAllOrders] = useState([]);
    const [selectedIoNo, setSelectedIoNo] = useState(id || "IO/9B/2627/212");

    // Form State
    const [formData, setFormData] = useState({
        IOID: null,
        IONo: "IO/9B/2627/212",
        VersionNo: 0,
        IODate: new Date().toISOString().split("T")[0],
        Customer: "TORY BURCH LLC",
        CustomerID: 1,
        CustomerOrderNo: "5500074188,99,200,201",
        CustomerPlanNo: "CP-2026-212",
        Season: "MFO-M2-2027",
        SoNo: "SO/9B/2627/148",
        MaterialSource: "Import",
        InternalMemo: "Priority production allotment for MFO-M2-2027",
        OrderMessage: "Shipment inspection required prior to packaging",
        Status: "Open",
        ClosedDate: "",
        ClosedBy: "",
        EnteredBy: "S. Sharma",
        DeliveryDate: "15-11-2026",
        DeliveryLocation: "Plot No. 9B Warehouse",
        Currency: "USD",
        PaymentTerms: "60 Days LC",
        ShipmentMode: "Sea",
        PriceTerm: "FOB",
        TotalQty: 1097.0,
        NoOfRows: 1
    });

    // Line Items Details State
    const [details, setDetails] = useState([
        {
            DetailID: 1,
            StyleNo: "TB-DRS-109",
            Description: "Floral Embroidered Silk Midi Dress",
            Colour: "Midnight Navy",
            SizeBreakdown: "XS:150, S:300, M:350, L:200, XL:97",
            Qty: 1097.0,
            Rate: 48.50,
            Amount: 53204.50,
            ExFactoryDate: "10-11-2026",
            Remarks: "Strict export quality tolerance"
        }
    ]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // Preload order choices (168 - 212)
    useEffect(() => {
        async function loadOrderList() {
            try {
                const res = await getInternalOrders({ limit: "all", sortBy: "IONo", sortDir: "DESC" });
                if (res && res.data) {
                    setAllOrders(res.data);
                }
            } catch (err) {
                console.warn("Could not load order list:", err);
            }
        }
        loadOrderList();
    }, []);

    // Load Selected Order
    const loadOrderData = useCallback(async (orderKey) => {
        if (!orderKey || orderKey === "new") {
            setFormData({
                IOID: null,
                IONo: "IO/9B/2627/" + (allOrders.length > 0 ? 213 : 213),
                VersionNo: 0,
                IODate: new Date().toISOString().split("T")[0],
                Customer: "TORY BURCH LLC",
                CustomerID: 1,
                CustomerOrderNo: "",
                CustomerPlanNo: "",
                Season: "MFO-M2-2027",
                SoNo: "",
                MaterialSource: "Import",
                InternalMemo: "",
                OrderMessage: "",
                Status: "Open",
                ClosedDate: "",
                ClosedBy: "",
                EnteredBy: "Current User",
                DeliveryDate: "15-11-2026",
                DeliveryLocation: "Plot No. 9B Warehouse",
                Currency: "USD",
                PaymentTerms: "60 Days LC",
                ShipmentMode: "Sea",
                PriceTerm: "FOB",
                TotalQty: 0,
                NoOfRows: 1
            });
            setDetails([
                {
                    DetailID: Date.now(),
                    StyleNo: "",
                    Description: "",
                    Colour: "",
                    SizeBreakdown: "",
                    Qty: 0,
                    Rate: 0,
                    Amount: 0,
                    ExFactoryDate: "",
                    Remarks: ""
                }
            ]);
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            const order = await getInternalOrderById(orderKey);
            if (order) {
                setFormData({
                    ...order,
                    TotalQty: parseFloat(order.TotalQty || 0)
                });
                if (order.details && order.details.length > 0) {
                    setDetails(order.details);
                } else {
                    setDetails([
                        {
                            DetailID: 1,
                            StyleNo: "ST-" + (order.IONo.split("/")[3] || "1") + "-EXP",
                            Description: "Garment Line Item for " + order.Customer,
                            Colour: "Navy / Black",
                            SizeBreakdown: "XS:15%, S:25%, M:35%, L:20%, XL:5%",
                            Qty: parseFloat(order.TotalQty || 0),
                            Rate: 45.00,
                            Amount: Math.round(parseFloat(order.TotalQty || 0) * 45 * 100) / 100,
                            ExFactoryDate: "10-11-2026",
                            Remarks: "Export tolerance ±3%"
                        }
                    ]);
                }
            }
        } catch (err) {
            console.error("Failed to load order:", err);
            setMessage({ type: "error", text: "Failed to load order " + orderKey });
        } finally {
            setLoading(false);
        }
    }, [allOrders.length]);

    useEffect(() => {
        if (id) {
            setSelectedIoNo(id);
            loadOrderData(id);
        } else {
            loadOrderData("IO/9B/2627/212");
        }
    }, [id, loadOrderData]);

    // Field Change
    const handleHeaderChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Line Item Changes
    const handleDetailChange = (index, field, value) => {
        setDetails(prev => {
            const updated = [...prev];
            const row = { ...updated[index], [field]: value };
            if (field === "Qty" || field === "Rate") {
                const q = parseFloat(field === "Qty" ? value : row.Qty) || 0;
                const r = parseFloat(field === "Rate" ? value : row.Rate) || 0;
                row.Amount = Math.round(q * r * 100) / 100;
            }
            updated[index] = row;
            return updated;
        });
    };

    // Add Detail Row
    const handleAddRow = () => {
        setDetails(prev => [
            ...prev,
            {
                DetailID: Date.now(),
                StyleNo: "",
                Description: "",
                Colour: "",
                SizeBreakdown: "",
                Qty: 0,
                Rate: 0,
                Amount: 0,
                ExFactoryDate: formData.DeliveryDate || "",
                Remarks: ""
            }
        ]);
    };

    // Remove Detail Row
    const handleRemoveRow = (index) => {
        if (details.length === 1) {
            alert("Order must have at least one line item.");
            return;
        }
        setDetails(prev => prev.filter((_, i) => i !== index));
    };

    // Calculate Totals
    const totalQty = details.reduce((sum, item) => sum + (parseFloat(item.Qty) || 0), 0);
    const totalAmount = details.reduce((sum, item) => sum + (parseFloat(item.Amount) || 0), 0);

    // Save / Update Handler
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const payload = {
                ...formData,
                TotalQty: totalQty,
                NoOfRows: details.length,
                details
            };
            if (formData.IOID) {
                await updateInternalOrder(formData.IOID, payload);
                setMessage({ type: "success", text: "Internal Order " + formData.IONo + " updated successfully!" });
            } else {
                const res = await createInternalOrder(payload);
                setMessage({ type: "success", text: "Internal Order " + (res.data?.data?.IONo || formData.IONo) + " created successfully!" });
                if (res.data?.data?.IOID) {
                    setFormData(prev => ({ ...prev, IOID: res.data.data.IOID }));
                }
            }
        } catch (err) {
            console.error("Save error:", err);
            setMessage({ type: "error", text: "Failed to save internal order: " + (err.response?.data?.message || err.message) });
        } finally {
            setSaving(false);
        }
    };

    // Toggle Status
    const handleToggleStatus = async () => {
        const next = formData.Status === "Closed" ? "Open" : "Closed";
        if (!formData.IOID) {
            setFormData(prev => ({ ...prev, Status: next }));
            return;
        }
        try {
            await updateInternalOrderStatus(formData.IOID, next, "Current User");
            setFormData(prev => ({ ...prev, Status: next }));
            setMessage({ type: "success", text: "Order status updated to " + next });
        } catch (err) {
            alert("Error updating status: " + err.message);
        }
    };

    return (
        <div className="io-master-container">
            {/* Header / Actions Bar */}
            <div className="io-header-row">
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <button
                        type="button"
                        className="io-btn-secondary"
                        onClick={() => navigate("/internal-orders")}
                    >
                        <FaArrowLeft /> Back to Orders
                    </button>
                    <h1 className="io-page-title">
                        Internal Order Master — {formData.IONo || "New Order"}
                    </h1>
                    <span className={"io-badge " + (formData.Status === "Closed" ? "io-badge-closed" : "io-badge-open")}>
                        {formData.Status}
                    </span>
                </div>

                <div className="io-header-actions">
                    {/* Quick Switcher across orders 168 to 212 */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>
                            Select IO (168-212):
                        </span>
                        <select
                            className="io-filter-select"
                            style={{ width: "170px" }}
                            value={selectedIoNo}
                            onChange={(e) => {
                                setSelectedIoNo(e.target.value);
                                navigate("/internal-order-master/" + e.target.value);
                            }}
                        >
                            <option value="new">+ New Internal Order</option>
                            {allOrders.map((o) => (
                                <option key={o.IOID} value={o.IONo}>
                                    {o.IONo} ({o.Customer})
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="button"
                        className="io-btn-secondary"
                        onClick={handleToggleStatus}
                    >
                        {formData.Status === "Closed" ? (
                            <>
                                <FaUndo style={{ color: "#16a34a" }} /> Reopen Order
                            </>
                        ) : (
                            <>
                                <FaCheckCircle style={{ color: "#64748b" }} /> Close Order
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        className="io-btn-secondary"
                        onClick={() => window.print()}
                    >
                        <FaPrint /> Print Order
                    </button>

                    <button
                        type="button"
                        className="io-btn-new"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        <FaSave /> {saving ? "Saving..." : "Save Order"}
                    </button>
                </div>
            </div>

            {/* Alert Message */}
            {message && (
                <div
                    className={"alert " + (message.type === "success" ? "alert-success" : "alert-danger") + " py-2"}
                    style={{ fontSize: "0.84rem", marginBottom: "14px" }}
                >
                    {message.text}
                </div>
            )}

            {loading ? (
                <div className="text-center py-5 text-muted">
                    <div className="spinner-border text-primary me-2" role="status" />
                    Loading Order Details...
                </div>
            ) : (
                <form onSubmit={handleSave}>
                    {/* 1. Order Header Information Card */}
                    <div className="io-card">
                        <div className="io-card-title">
                            <span>Internal Order Header Details</span>
                            <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "normal" }}>
                                Version: {formData.VersionNo} | Entered By: {formData.EnteredBy}
                            </span>
                        </div>

                        <div className="io-form-grid-4">
                            <div className="io-form-group">
                                <label className="io-form-label">Internal Order No (IO No)*</label>
                                <input
                                    type="text"
                                    name="IONo"
                                    className="io-form-input"
                                    value={formData.IONo}
                                    onChange={handleHeaderChange}
                                    required
                                />
                            </div>

                            <div className="io-form-group">
                                <label className="io-form-label">Order Date*</label>
                                <input
                                    type="text"
                                    name="IODate"
                                    className="io-form-input"
                                    value={formData.IODate}
                                    onChange={handleHeaderChange}
                                    required
                                />
                            </div>

                            <div className="io-form-group">
                                <label className="io-form-label">Customer Name*</label>
                                <input
                                    type="text"
                                    name="Customer"
                                    className="io-form-input"
                                    value={formData.Customer}
                                    onChange={handleHeaderChange}
                                    required
                                />
                            </div>

                            <div className="io-form-group">
                                <label className="io-form-label">Season*</label>
                                <input
                                    type="text"
                                    name="Season"
                                    className="io-form-input"
                                    value={formData.Season}
                                    onChange={handleHeaderChange}
                                    required
                                />
                            </div>

                            <div className="io-form-group">
                                <label className="io-form-label">Customer Order No (PO)</label>
                                <input
                                    type="text"
                                    name="CustomerOrderNo"
                                    className="io-form-input"
                                    value={formData.CustomerOrderNo || ""}
                                    onChange={handleHeaderChange}
                                />
                            </div>

                            <div className="io-form-group">
                                <label className="io-form-label">Customer Plan No</label>
                                <input
                                    type="text"
                                    name="CustomerPlanNo"
                                    className="io-form-input"
                                    value={formData.CustomerPlanNo || ""}
                                    onChange={handleHeaderChange}
                                />
                            </div>

                            <div className="io-form-group">
                                <label className="io-form-label">Sales Order No (SO No)</label>
                                <input
                                    type="text"
                                    name="SoNo"
                                    className="io-form-input"
                                    value={formData.SoNo || ""}
                                    onChange={handleHeaderChange}
                                />
                            </div>

                            <div className="io-form-group">
                                <label className="io-form-label">Material Source</label>
                                <select
                                    name="MaterialSource"
                                    className="io-form-select"
                                    value={formData.MaterialSource}
                                    onChange={handleHeaderChange}
                                >
                                    <option value="Import">Import</option>
                                    <option value="Domestic">Domestic</option>
                                </select>
                            </div>
                        </div>

                        <div className="io-form-grid-4" style={{ marginTop: "14px" }}>
                            <div className="io-form-group">
                                <label className="io-form-label">Delivery Date</label>
                                <input
                                    type="text"
                                    name="DeliveryDate"
                                    className="io-form-input"
                                    value={formData.DeliveryDate || ""}
                                    onChange={handleHeaderChange}
                                />
                            </div>

                            <div className="io-form-group">
                                <label className="io-form-label">Delivery Location</label>
                                <input
                                    type="text"
                                    name="DeliveryLocation"
                                    className="io-form-input"
                                    value={formData.DeliveryLocation || ""}
                                    onChange={handleHeaderChange}
                                />
                            </div>

                            <div className="io-form-group">
                                <label className="io-form-label">Currency</label>
                                <select
                                    name="Currency"
                                    className="io-form-select"
                                    value={formData.Currency || "USD"}
                                    onChange={handleHeaderChange}
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="INR">INR (₹)</option>
                                </select>
                            </div>

                            <div className="io-form-group">
                                <label className="io-form-label">Payment Terms</label>
                                <input
                                    type="text"
                                    name="PaymentTerms"
                                    className="io-form-input"
                                    value={formData.PaymentTerms || ""}
                                    onChange={handleHeaderChange}
                                />
                            </div>
                        </div>

                        <div className="io-form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginTop: "14px" }}>
                            <div className="io-form-group">
                                <label className="io-form-label">Internal Memo</label>
                                <textarea
                                    name="InternalMemo"
                                    className="io-form-textarea"
                                    rows="2"
                                    value={formData.InternalMemo || ""}
                                    onChange={handleHeaderChange}
                                />
                            </div>

                            <div className="io-form-group">
                                <label className="io-form-label">Message displayed in Order</label>
                                <textarea
                                    name="OrderMessage"
                                    className="io-form-textarea"
                                    rows="2"
                                    value={formData.OrderMessage || ""}
                                    onChange={handleHeaderChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Style & Line Item Breakdown Card */}
                    <div className="io-card">
                        <div className="io-card-title">
                            <span>Styles & Line Items Breakdown</span>
                            <button
                                type="button"
                                className="io-btn-new"
                                onClick={handleAddRow}
                                style={{ fontSize: "0.76rem", height: "26px", padding: "2px 10px" }}
                            >
                                <FaPlus /> Add Style Item
                            </button>
                        </div>

                        <div style={{ overflowX: "auto" }}>
                            <table className="io-detail-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "130px" }}>Style No*</th>
                                        <th style={{ width: "230px" }}>Description</th>
                                        <th style={{ width: "130px" }}>Colour</th>
                                        <th style={{ width: "220px" }}>Size Breakdown</th>
                                        <th style={{ width: "100px" }} className="text-end">Qty (pcs)*</th>
                                        <th style={{ width: "100px" }} className="text-end">Rate ($)*</th>
                                        <th style={{ width: "110px" }} className="text-end">Amount ($)</th>
                                        <th style={{ width: "120px" }}>Ex-Factory Date</th>
                                        <th style={{ width: "150px" }}>Remarks</th>
                                        <th style={{ width: "50px" }} className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {details.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={item.StyleNo}
                                                    onChange={(e) => handleDetailChange(index, "StyleNo", e.target.value)}
                                                    placeholder="Style No"
                                                    required
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={item.Description}
                                                    onChange={(e) => handleDetailChange(index, "Description", e.target.value)}
                                                    placeholder="Style description"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={item.Colour}
                                                    onChange={(e) => handleDetailChange(index, "Colour", e.target.value)}
                                                    placeholder="Colour"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={item.SizeBreakdown}
                                                    onChange={(e) => handleDetailChange(index, "SizeBreakdown", e.target.value)}
                                                    placeholder="XS:10, S:20, M:30..."
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="text-end"
                                                    value={item.Qty}
                                                    onChange={(e) => handleDetailChange(index, "Qty", e.target.value)}
                                                    step="0.1"
                                                    required
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="text-end"
                                                    value={item.Rate}
                                                    onChange={(e) => handleDetailChange(index, "Rate", e.target.value)}
                                                    step="0.01"
                                                    required
                                                />
                                            </td>
                                            <td className="text-end font-monospace" style={{ fontWeight: 600, color: "#0b4dbd" }}>
                                                ${(parseFloat(item.Amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={item.ExFactoryDate || ""}
                                                    onChange={(e) => handleDetailChange(index, "ExFactoryDate", e.target.value)}
                                                    placeholder="DD-MM-YYYY"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={item.Remarks || ""}
                                                    onChange={(e) => handleDetailChange(index, "Remarks", e.target.value)}
                                                    placeholder="Tolerance / Notes"
                                                />
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveRow(index)}
                                                    style={{ border: "none", background: "transparent", color: "#ef4444", cursor: "pointer" }}
                                                    title="Remove item"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr style={{ background: "#f8fafc", fontWeight: 700 }}>
                                        <td colSpan="4" className="text-end" style={{ paddingRight: "14px" }}>
                                            Total Quantity & Order Value:
                                        </td>
                                        <td className="text-end" style={{ color: "#047857", fontWeight: 700 }}>
                                            {totalQty.toLocaleString("en-US", { minimumFractionDigits: 1 })} pcs
                                        </td>
                                        <td></td>
                                        <td className="text-end font-monospace" style={{ color: "#0751bd", fontWeight: 700 }}>
                                            ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                        </td>
                                        <td colSpan="3"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Save Footer Buttons */}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                        <button
                            type="button"
                            className="io-btn-secondary"
                            onClick={() => navigate("/internal-orders")}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="io-btn-new"
                            disabled={saving}
                        >
                            <FaSave /> {saving ? "Saving..." : "Save Internal Order"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}