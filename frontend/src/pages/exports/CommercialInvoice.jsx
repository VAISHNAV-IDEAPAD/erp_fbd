import React, { useState, useEffect, useCallback } from "react";
import {
    FaSyncAlt,
    FaBars,
    FaFilter,
    FaCaretDown,
    FaPlus,
    FaCog,
    FaTimes,
    FaCheck,
    FaArrowLeft,
    FaTrash
} from "react-icons/fa";
import axios from "axios";
import commercialInvoiceService from "../../services/commercialInvoiceService";
import "../../styles/commercialInvoice.css";

const DEFAULT_PACK_CATALOG = [
    {
        packNo: "PP/9B/2627/101",
        ioNo: "IO/9B/2627/60",
        styleNo: "171524",
        description: "171524 BRITTEN CONVERTIBLE CROSSBODY (LB-17097) V2 - FOREST BROWN",
        hsnCode: "42022110",
        uom: "PCS",
        qty: 150,
        rate: 125.0,
        amount: 18750.0
    },
    {
        packNo: "PP/9B/2627/102",
        ioNo: "IO/9B/2627/61",
        styleNo: "189386",
        description: "189386 ROBINSON WALLET ON A CHAIN (LB-17228) V2 - AGED TAN",
        hsnCode: "42023120",
        uom: "PCS",
        qty: 100,
        rate: 125.0,
        amount: 12500.0
    },
    {
        packNo: "PP/9B/2627/103",
        ioNo: "IO/9B/2627/63",
        styleNo: "187239",
        description: "187239 BRITTEN RAFFIA CONVERTIBLE CROSSBODY (CLB-2601 B) V2 - RAFFIA",
        hsnCode: "42022290",
        uom: "PCS",
        qty: 120,
        rate: 138.0,
        amount: 16560.0
    },
    {
        packNo: "PP/9B/2627/094",
        ioNo: "IO/68/2627/322",
        styleNo: "283860",
        description: "283860 MERCEROVERNIGHTER:CHOC (TB-701) - CHOCOLATE",
        hsnCode: "42021220",
        uom: "PCS",
        qty: 180,
        rate: 145.0,
        amount: 26100.0
    },
    {
        packNo: "PP/9B/2627/088",
        ioNo: "IO/9B/2627/84",
        styleNo: "178665",
        description: "178665 ROMY STRAW BUCKET BAG (CLB-2201 A) V3 - NATURAL",
        hsnCode: "42022290",
        uom: "PCS",
        qty: 120,
        rate: 140.0,
        amount: 16800.0
    }
];

const INITIAL_FORM = {
    InvoicePrefix: "TI/9B/2627/",
    InvoiceSeq: 18,
    InvoiceDate: "",
    InvoiceRef: "",
    ReverseCharge: "No",
    FreightCharges: "Collect",
    ExporterName: "Plot No. 9B",
    BranchCode: "",
    ExporterAddress:
        "Alpine Apparels Pvt. Ltd.\nPLOT NO.9B, SECTOR-27A\nFARIDABAD\nHARYANA-121003",
    ExporterTel: "",
    ExporterEmail: "",
    ExporterIEC: "",
    ExporterGSTNo: "06AADCA0100D1ZS",
    ExporterCINNo: "U74899DL1995PTC068562",
    ExporterPANNo: "AADCA0100D",
    ExporterState: "HARYANA",
    BuyerNo: "",
    BuyerDate: "",
    OtherReference: "",
    SegmentCode: "",
    DateOfSupply: "",
    PlaceOfSupply: "",
    ConsigneeName: "",
    ConsigneeAddress: "",
    ConsigneeGSTNo: "",
    ConsigneePANNo: "",
    ConsigneeState: "",
    Currency: "",
    ExchangeRate: "0.0",
    ShipToName: "",
    ShipToAddress: "",
    ShipToGSTNo: "",
    ShipToPANNo: "",
    ShipToState: "",
    Destination: "",
    BuyerOtherName: "",
    BuyerOtherAddress: "",
    NotifyParty: "",
    NotifyPartyAddress: "",
    NotifyPartyLocation: "",
    ForwarderName: "",
    PreCarriageBy: "",
    PlaceOfReceipt: "",
    VesselFlightNo: "",
    PortOfLoading: "",
    PortOfDischarge: "",
    FinalDestination: "",
    MarksAndNos: "",
    NoAndKindOfPkgs: "",
    CountryOfOrigin: "",
    CountryOfFinalDest: "",
    StandardUnitQty: "",
    ExportPreferentialDetails: "",
    TermsOfDeliveryPayment: "",
    DescriptionOfGoods: "",
    Declaration1: "",
    Declaration2: "",
    Location: "Plot No. 9B"
};

export default function CommercialInvoice({ initialMode = "list" }) {
    const [mode, setMode] = useState(initialMode); // "list" | "form"
    const [invoices, setInvoices] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // List filters
    const [customerFilter, setCustomerFilter] = useState("");
    const [showFilterBar, setShowFilterBar] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [page, setPage] = useState(1);

    // Form state
    const [form, setForm] = useState(INITIAL_FORM);
    const [packInput, setPackInput] = useState("");
    const [packList, setPackList] = useState([]);
    const [selectedPackIdx, setSelectedPackIdx] = useState(0);
    const [displayedItems, setDisplayedItems] = useState([]);
    const [showDisplayedTable, setShowDisplayedTable] = useState(false);
    const [statusBanner, setStatusBanner] = useState(null);

    const loadInvoices = useCallback(async () => {
        try {
            setLoading(true);
            const res = await commercialInvoiceService.getAll({
                customer: customerFilter,
                search: searchText
            });
            if (res && res.success) {
                setInvoices(res.data || []);
            }
        } catch (err) {
            console.error("Failed to load Commercial Invoices:", err);
        } finally {
            setLoading(false);
        }
    }, [customerFilter, searchText]);

    useEffect(() => {
        loadInvoices();
    }, [loadInvoices]);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL || "/api"}/customers`)
            .then((res) => {
                const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
                setCustomers(list);
            })
            .catch(() => {});
    }, []);

    // Open New Commercial Invoice Form
    const handleOpenNew = () => {
        const maxSeq = invoices.reduce(
            (max, inv) => Math.max(max, Number(inv.InvoiceSeq) || 17),
            17
        );
        setEditingId(null);
        setForm({
            ...INITIAL_FORM,
            InvoiceSeq: maxSeq + 1
        });
        setPackInput("");
        setPackList([]);
        setSelectedPackIdx(0);
        setDisplayedItems([]);
        setShowDisplayedTable(false);
        setStatusBanner(null);
        setMode("form");
    };

    // Open Existing Commercial Invoice for Edit / View
    const handleEditInvoice = (inv) => {
        setEditingId(inv.CommercialInvoiceID);
        const packs = inv.ProductionPackNos
            ? String(inv.ProductionPackNos)
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
            : [];
        setForm({
            InvoicePrefix: inv.InvoicePrefix || "TI/9B/2627/",
            InvoiceSeq: inv.InvoiceSeq || 18,
            InvoiceDate: inv.InvoiceDate || "",
            InvoiceRef: inv.InvoiceRef || "",
            ReverseCharge: inv.ReverseCharge || "No",
            FreightCharges: inv.FreightCharges || "Collect",
            ExporterName: inv.ExporterName || "Plot No. 9B",
            BranchCode: inv.BranchCode || "",
            ExporterAddress:
                inv.ExporterAddress ||
                "Alpine Apparels Pvt. Ltd.\nPLOT NO.9B, SECTOR-27A\nFARIDABAD\nHARYANA-121003",
            ExporterTel: inv.ExporterTel || "",
            ExporterEmail: inv.ExporterEmail || "",
            ExporterIEC: inv.ExporterIEC || "",
            ExporterGSTNo: inv.ExporterGSTNo || "06AADCA0100D1ZS",
            ExporterCINNo: inv.ExporterCINNo || "U74899DL1995PTC068562",
            ExporterPANNo: inv.ExporterPANNo || "AADCA0100D",
            ExporterState: inv.ExporterState || "HARYANA",
            BuyerNo: inv.BuyerNo || "",
            BuyerDate: inv.BuyerDate || "",
            OtherReference: inv.OtherReference || "",
            SegmentCode: inv.SegmentCode || "",
            DateOfSupply: inv.DateOfSupply || "",
            PlaceOfSupply: inv.PlaceOfSupply || "",
            ConsigneeName: inv.ConsigneeName || "",
            ConsigneeAddress: inv.ConsigneeAddress || "",
            ConsigneeGSTNo: inv.ConsigneeGSTNo || "",
            ConsigneePANNo: inv.ConsigneePANNo || "",
            ConsigneeState: inv.ConsigneeState || "",
            Currency: inv.Currency || "USD",
            ExchangeRate: inv.ExchangeRate ?? "0.0",
            ShipToName: inv.ShipToName || "",
            ShipToAddress: inv.ShipToAddress || "",
            ShipToGSTNo: inv.ShipToGSTNo || "",
            ShipToPANNo: inv.ShipToPANNo || "",
            ShipToState: inv.ShipToState || "",
            Destination: inv.Destination || "",
            BuyerOtherName: inv.BuyerOtherName || "",
            BuyerOtherAddress: inv.BuyerOtherAddress || "",
            NotifyParty: inv.NotifyParty || "",
            NotifyPartyAddress: inv.NotifyPartyAddress || "",
            NotifyPartyLocation: inv.NotifyPartyLocation || "",
            ForwarderName: inv.ForwarderName || "",
            PreCarriageBy: inv.PreCarriageBy || "",
            PlaceOfReceipt: inv.PlaceOfReceipt || "",
            VesselFlightNo: inv.VesselFlightNo || "",
            PortOfLoading: inv.PortOfLoading || "",
            PortOfDischarge: inv.PortOfDischarge || "",
            FinalDestination: inv.FinalDestination || "",
            MarksAndNos: inv.MarksAndNos || "",
            NoAndKindOfPkgs: inv.NoAndKindOfPkgs || "",
            CountryOfOrigin: inv.CountryOfOrigin || "INDIA",
            CountryOfFinalDest: inv.CountryOfFinalDest || "",
            StandardUnitQty: inv.StandardUnitQty || "",
            ExportPreferentialDetails: inv.ExportPreferentialDetails || "",
            TermsOfDeliveryPayment: inv.TermsOfDeliveryPayment || "",
            DescriptionOfGoods: inv.DescriptionOfGoods || "",
            Declaration1: inv.Declaration1 || "",
            Declaration2: inv.Declaration2 || "",
            Location: inv.Location || "Plot No. 9B"
        });
        setPackList(packs);
        setSelectedPackIdx(0);
        const items = Array.isArray(inv.items) ? inv.items : [];
        setDisplayedItems(items);
        setShowDisplayedTable(items.length > 0);
        setStatusBanner(null);
        setMode("form");
    };

    const handleDeleteInvoice = async (id) => {
        if (!window.confirm("Are you sure you want to delete this Commercial Invoice?")) return;
        try {
            await commercialInvoiceService.remove(id);
            loadInvoices();
        } catch (err) {
            alert("Failed to delete Commercial Invoice.");
        }
    };

    const handleFieldChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddPack = () => {
        const val = packInput.trim() || `PP/9B/2627/${101 + packList.length}`;
        if (!packList.includes(val)) {
            const next = [...packList, val];
            setPackList(next);
            setSelectedPackIdx(next.length - 1);
        }
        setPackInput("");
    };

    const handleRemovePack = () => {
        if (packList.length === 0) return;
        const targetIdx =
            selectedPackIdx >= 0 && selectedPackIdx < packList.length
                ? selectedPackIdx
                : packList.length - 1;
        const removedPack = packList[targetIdx];
        const next = packList.filter((_, i) => i !== targetIdx);
        setPackList(next);
        setSelectedPackIdx(Math.max(0, next.length - 1));
        setDisplayedItems((prev) => prev.filter((it) => it.packNo !== removedPack));
    };

    // Clicking "Display" loads/generates the line items for the added Production Pack Nos
    const handleDisplayPacks = () => {
        let activePacks = [...packList];
        if (activePacks.length === 0 && packInput.trim()) {
            activePacks = [packInput.trim()];
            setPackList(activePacks);
            setPackInput("");
        }
        if (activePacks.length === 0) {
            activePacks = ["PP/9B/2627/101"];
            setPackList(activePacks);
        }

        const generated = activePacks.map((pNo, idx) => {
            const existing = displayedItems.find((d) => d.packNo === pNo);
            if (existing) return existing;
            const catalogMatch = DEFAULT_PACK_CATALOG.find(
                (c) => c.packNo.toLowerCase() === pNo.toLowerCase()
            );
            if (catalogMatch) return { ...catalogMatch };
            return {
                packNo: pNo,
                ioNo: form.OtherReference || `IO/9B/2627/${60 + idx}`,
                styleNo: `ST-${171524 + idx}`,
                description:
                    form.DescriptionOfGoods ||
                    "171524 BRITTEN CONVERTIBLE CROSSBODY (LB-17097) V2",
                hsnCode: "42022110",
                uom: form.StandardUnitQty || "PCS",
                qty: 100,
                rate: 125.0,
                amount: 12500.0
            };
        });

        setDisplayedItems(generated);
        setShowDisplayedTable(true);
    };

    const handleItemChange = (idx, field, val) => {
        setDisplayedItems((prev) =>
            prev.map((item, i) => {
                if (i !== idx) return item;
                const updated = { ...item, [field]: val };
                if (field === "qty" || field === "rate") {
                    const q = Number(field === "qty" ? val : updated.qty) || 0;
                    const r = Number(field === "rate" ? val : updated.rate) || 0;
                    updated.amount = Number((q * r).toFixed(2));
                }
                return updated;
            })
        );
    };

    const subTotal = displayedItems.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
    const totalQty = displayedItems.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);

    const handleSaveInvoice = async (e) => {
        if (e) e.preventDefault();
        try {
            setSaving(true);
            setStatusBanner(null);
            const payload = {
                ...form,
                InvoiceNo: `${form.InvoicePrefix}${form.InvoiceSeq}`,
                ProductionPackNos: packList.join(", "),
                TotalQty: totalQty,
                NoOfRows: Math.max(1, displayedItems.length),
                SubTotal: subTotal,
                TotalAmount: subTotal,
                items: displayedItems
            };

            if (editingId) {
                await commercialInvoiceService.update(editingId, payload);
            } else {
                await commercialInvoiceService.create(payload);
            }

            await loadInvoices();
            setMode("list");
        } catch (err) {
            console.error("Error saving Commercial Invoice:", err);
            setStatusBanner({
                type: "danger",
                text: err.response?.data?.message || "Failed to save Commercial Invoice."
            });
        } finally {
            setSaving(false);
        }
    };

    const toggleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(invoices.map((i) => i.CommercialInvoiceID));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelectRow = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // =========================================================================
    // RENDER LIST VIEW (SCREENSHOT 2)
    // =========================================================================
    if (mode === "list") {
        return (
            <div className="ci-page">
                <h1 className="ci-page-title">Commercial Invoice</h1>

                {/* Customer Search + New Commercial Invoice Button */}
                <div className="ci-list-topbar">
                    <div className="ci-customer-filter">
                        <label>Customer</label>
                        <input
                            type="text"
                            list="ci-customer-options"
                            placeholder="Type and select customer"
                            value={customerFilter}
                            onChange={(e) => setCustomerFilter(e.target.value)}
                        />
                        <datalist id="ci-customer-options">
                            <option value="TORY BURCH LLC" />
                            <option value="WILLIAMS SONOMA SINGAPORE PTE LTD" />
                            <option value="RALPH LAUREN EUROPE SARL" />
                            {customers.map((c, idx) => (
                                <option
                                    key={c.CustomerID || idx}
                                    value={c.CustomerName || c.Name || ""}
                                />
                            ))}
                        </datalist>
                    </div>

                    <button type="button" className="ci-btn-new" onClick={handleOpenNew}>
                        <FaPlus size={11} />
                        <span>New Commercial Invoice</span>
                    </button>
                </div>

                {/* Toolbar Row */}
                <div className="ci-toolbar-row">
                    <div className="ci-toolbar-left">
                        <button
                            type="button"
                            className="ci-icon-btn"
                            title="Refresh"
                            onClick={loadInvoices}
                        >
                            <FaSyncAlt className={loading ? "fa-spin" : ""} />
                        </button>
                        <button type="button" className="ci-icon-btn" title="Columns">
                            <FaBars />
                        </button>
                        <div className="ci-filter-split">
                            <button
                                type="button"
                                onClick={() => setShowFilterBar(!showFilterBar)}
                            >
                                <FaFilter size={10} style={{ color: "#2b669a" }} />
                                <span>Filter</span>
                            </button>
                            <button
                                type="button"
                                className="ci-split-caret"
                                onClick={() => setShowFilterBar(!showFilterBar)}
                            >
                                <FaCaretDown size={10} />
                            </button>
                        </div>
                    </div>

                    <div className="ci-pagination-group">
                        <button
                            type="button"
                            className={`ci-page-btn ${page === 1 ? "active" : ""}`}
                            onClick={() => setPage(1)}
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className={`ci-page-btn ${page === 2 ? "active" : ""}`}
                            onClick={() => setPage(2)}
                        >
                            2
                        </button>
                        <button
                            type="button"
                            className="ci-page-btn"
                            onClick={() => setPage((p) => Math.min(2, p + 1))}
                        >
                            &gt;
                        </button>
                        <button
                            type="button"
                            className="ci-page-btn"
                            onClick={() => setPage(2)}
                        >
                            &gt;&gt;
                        </button>
                    </div>
                </div>

                {showFilterBar && (
                    <div
                        style={{
                            background: "#f8fafc",
                            border: "1px solid #cbd5e1",
                            padding: "10px 12px",
                            marginBottom: "10px",
                            display: "flex",
                            gap: "10px",
                            alignItems: "center"
                        }}
                    >
                        <input
                            type="text"
                            className="ci-input"
                            style={{ maxWidth: "320px" }}
                            placeholder="Search by Invoice No, Buyer No, Pack No, Place of Supply..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <button
                            type="button"
                            className="ci-btn-cancel"
                            onClick={() => {
                                setSearchText("");
                                setCustomerFilter("");
                            }}
                        >
                            Reset
                        </button>
                    </div>
                )}

                {/* Commercial Invoice List Table (Exact 14 columns from Screenshot 2) */}
                <div className="ci-table-wrap">
                    <table className="ci-list-table">
                        <thead>
                            <tr>
                                <th style={{ width: "90px" }}>Action</th>
                                <th>Invoice No</th>
                                <th>
                                    Total
                                    <br />
                                    Qty
                                </th>
                                <th>Buyer No</th>
                                <th>Exporter GST No</th>
                                <th>
                                    Exporter
                                    <br />
                                    State
                                </th>
                                <th>
                                    Notify
                                    <br />
                                    Party
                                    <br />
                                    Location
                                </th>
                                <th>
                                    Pre
                                    <br />
                                    Carriage
                                    <br />
                                    By
                                </th>
                                <th>Production Pack No</th>
                                <th>
                                    Buyer Consignee
                                    <br />
                                    Address
                                </th>
                                <th>Location</th>
                                <th>Place of supply</th>
                                <th>
                                    No.
                                    <br />
                                    of
                                    <br />
                                    rows
                                </th>
                                <th style={{ width: "36px" }}>
                                    <input
                                        type="checkbox"
                                        checked={
                                            invoices.length > 0 &&
                                            selectedIds.length === invoices.length
                                        }
                                        onChange={(e) => toggleSelectAll(e.target.checked)}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="14" style={{ textAlign: "center", padding: "24px" }}>
                                        Loading Commercial Invoices...
                                    </td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="14" style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                                        No Commercial Invoices found. Click "+ New Commercial Invoice" to create one.
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((inv) => (
                                    <tr key={inv.CommercialInvoiceID}>
                                        <td style={{ textAlign: "center" }}>
                                            <select
                                                className="ci-action-select"
                                                defaultValue=""
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    e.target.value = "";
                                                    if (val === "edit" || val === "view") {
                                                        handleEditInvoice(inv);
                                                    } else if (val === "delete") {
                                                        handleDeleteInvoice(inv.CommercialInvoiceID);
                                                    }
                                                }}
                                            >
                                                <option value="" disabled>
                                                    Action
                                                </option>
                                                <option value="edit">Edit / View</option>
                                                <option value="delete">Delete</option>
                                            </select>
                                        </td>
                                        <td
                                            style={{
                                                fontWeight: 600,
                                                color: "#2b669a",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => handleEditInvoice(inv)}
                                        >
                                            {inv.InvoiceNo}
                                        </td>
                                        <td style={{ textAlign: "right", fontWeight: 600 }}>
                                            {Number(inv.TotalQty || 0).toLocaleString()}
                                        </td>
                                        <td>{inv.BuyerNo}</td>
                                        <td>{inv.ExporterGSTNo || "06AADCA0100D1ZS"}</td>
                                        <td>{inv.ExporterState || "HARYANA"}</td>
                                        <td>{inv.NotifyPartyLocation}</td>
                                        <td>{inv.PreCarriageBy}</td>
                                        <td>{inv.ProductionPackNos}</td>
                                        <td style={{ maxWidth: "240px" }}>
                                            {inv.ConsigneeName ? (
                                                <strong>{inv.ConsigneeName}: </strong>
                                            ) : null}
                                            {inv.ConsigneeAddress}
                                        </td>
                                        <td>{inv.Location || "Plot No. 9B"}</td>
                                        <td>{inv.PlaceOfSupply}</td>
                                        <td style={{ textAlign: "center" }}>{inv.NoOfRows || 1}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(inv.CommercialInvoiceID)}
                                                onChange={() =>
                                                    toggleSelectRow(inv.CommercialInvoiceID)
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // =========================================================================
    // RENDER FORM VIEW (SCREENSHOTS 3, 4, 5)
    // =========================================================================
    return (
        <div className="ci-page">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h1 className="ci-page-title" style={{ marginBottom: 0 }}>
                    Commercial Invoice
                </h1>
                <button
                    type="button"
                    className="ci-btn-cancel"
                    onClick={() => setMode("list")}
                >
                    <FaArrowLeft size={11} className="me-1" /> Back to List
                </button>
            </div>

            {statusBanner && (
                <div
                    className={`alert alert-${statusBanner.type} py-2 small mb-2`}
                    role="alert"
                >
                    {statusBanner.text}
                </div>
            )}

            <form className="ci-form-container" onSubmit={handleSaveInvoice}>
                {/* =============================================================
                    TOP HEADER FIELDS (SCREENSHOT 3 TOP)
                ============================================================= */}
                <div className="ci-top-fields-grid">
                    <div>
                        <div className="ci-field-row">
                            <label className="ci-label-sm">Invoice No</label>
                            <div className="ci-invoiceno-group">
                                <select
                                    className="ci-invoiceno-prefix"
                                    value={form.InvoicePrefix}
                                    onChange={(e) =>
                                        handleFieldChange("InvoicePrefix", e.target.value)
                                    }
                                >
                                    <option value="TI/9B/2627/">TI/9B/2627/</option>
                                    <option value="CI/9B/2627/">CI/9B/2627/</option>
                                    <option value="EXP/9B/2627/">EXP/9B/2627/</option>
                                </select>
                                <input
                                    type="text"
                                    className="ci-invoiceno-seq"
                                    value={form.InvoiceSeq}
                                    onChange={(e) =>
                                        handleFieldChange("InvoiceSeq", e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    className="ci-gear-btn"
                                    title="Document Numbering Settings"
                                >
                                    <FaCog size={12} />
                                </button>
                            </div>
                        </div>

                        <div className="ci-field-row" style={{ marginBottom: 0 }}>
                            <label className="ci-label-sm">
                                Freight
                                <br />
                                Charges
                            </label>
                            <select
                                className="ci-select"
                                value={form.FreightCharges}
                                onChange={(e) =>
                                    handleFieldChange("FreightCharges", e.target.value)
                                }
                            >
                                <option value="Collect">Collect</option>
                                <option value="Prepaid">Prepaid</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="ci-field-row">
                            <label className="ci-label-sm">Invoice Date</label>
                            <input
                                type="date"
                                className="ci-input"
                                value={form.InvoiceDate}
                                onChange={(e) =>
                                    handleFieldChange("InvoiceDate", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <div className="ci-field-row">
                            <label className="ci-label-sm">Invoice Ref</label>
                            <input
                                type="text"
                                className="ci-input"
                                value={form.InvoiceRef}
                                onChange={(e) =>
                                    handleFieldChange("InvoiceRef", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <div className="ci-field-row">
                            <label className="ci-label-sm">
                                Reverse
                                <br />
                                Charge
                            </label>
                            <select
                                className="ci-select"
                                value={form.ReverseCharge}
                                onChange={(e) =>
                                    handleFieldChange("ReverseCharge", e.target.value)
                                }
                            >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* =============================================================
                    SECTION 1: EXPORTER (LEFT) & BUYER / SUPPLY (RIGHT) - SCREENSHOT 3
                ============================================================= */}
                <div className="ci-split-section">
                    <div className="ci-split-left">
                        <h3 className="ci-section-heading">EXPORTER</h3>

                        <div className="ci-two-col-inline">
                            <div className="ci-field-row">
                                <label className="ci-label-sm">
                                    Exporter
                                    <br />
                                    Name:
                                </label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.ExporterName}
                                    onChange={(e) =>
                                        handleFieldChange("ExporterName", e.target.value)
                                    }
                                />
                            </div>
                            <div className="ci-field-row">
                                <label className="ci-label-sm">
                                    Branch
                                    <br />
                                    Code:
                                </label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.BranchCode}
                                    onChange={(e) =>
                                        handleFieldChange("BranchCode", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="ci-field-row" style={{ alignItems: "flex-start" }}>
                            <label className="ci-label-sm" style={{ paddingTop: "4px" }}>
                                Address:
                            </label>
                            <textarea
                                className="ci-textarea"
                                rows={3}
                                value={form.ExporterAddress}
                                onChange={(e) =>
                                    handleFieldChange("ExporterAddress", e.target.value)
                                }
                            />
                        </div>

                        <div className="ci-two-col-inline">
                            <div className="ci-field-row">
                                <label className="ci-label-sm">Tel:</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.ExporterTel}
                                    onChange={(e) =>
                                        handleFieldChange("ExporterTel", e.target.value)
                                    }
                                />
                            </div>
                            <div className="ci-field-row">
                                <label className="ci-label-sm">Email:</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.ExporterEmail}
                                    onChange={(e) =>
                                        handleFieldChange("ExporterEmail", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="ci-sub-divider" />

                        <div className="ci-two-col-inline">
                            <div className="ci-field-row">
                                <label className="ci-label-sm">IEC:</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.ExporterIEC}
                                    onChange={(e) =>
                                        handleFieldChange("ExporterIEC", e.target.value)
                                    }
                                />
                            </div>
                            <div className="ci-field-row">
                                <label className="ci-label-sm">GST#:</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.ExporterGSTNo}
                                    onChange={(e) =>
                                        handleFieldChange("ExporterGSTNo", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="ci-two-col-inline">
                            <div className="ci-field-row">
                                <label className="ci-label-sm">CIN No:</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.ExporterCINNo}
                                    onChange={(e) =>
                                        handleFieldChange("ExporterCINNo", e.target.value)
                                    }
                                />
                            </div>
                            <div className="ci-field-row">
                                <label className="ci-label-sm">PAN#:</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.ExporterPANNo}
                                    onChange={(e) =>
                                        handleFieldChange("ExporterPANNo", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="ci-two-col-inline">
                            <div className="ci-field-row" style={{ marginBottom: 0 }}>
                                <label className="ci-label-sm">State:</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.ExporterState}
                                    onChange={(e) =>
                                        handleFieldChange("ExporterState", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="ci-split-right" style={{ paddingTop: "26px" }}>
                        <div className="ci-two-col-inline">
                            <div className="ci-field-row">
                                <label className="ci-label-sm">Buyer No</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.BuyerNo}
                                    onChange={(e) =>
                                        handleFieldChange("BuyerNo", e.target.value)
                                    }
                                />
                            </div>
                            <div className="ci-field-row">
                                <label className="ci-label-sm">
                                    Buyer
                                    <br />
                                    Date
                                </label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.BuyerDate}
                                    onChange={(e) =>
                                        handleFieldChange("BuyerDate", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="ci-field-row">
                            <label className="ci-label-sm">
                                Other
                                <br />
                                Reference
                            </label>
                            <input
                                type="text"
                                className="ci-input"
                                value={form.OtherReference}
                                onChange={(e) =>
                                    handleFieldChange("OtherReference", e.target.value)
                                }
                            />
                        </div>

                        <div className="ci-field-row">
                            <label className="ci-label-sm">
                                Segment
                                <br />
                                Code
                            </label>
                            <input
                                type="text"
                                className="ci-input"
                                value={form.SegmentCode}
                                onChange={(e) =>
                                    handleFieldChange("SegmentCode", e.target.value)
                                }
                            />
                        </div>

                        <div className="ci-sub-divider" style={{ marginTop: "32px" }} />

                        <div className="ci-field-row">
                            <label className="ci-label-sm">
                                Date of
                                <br />
                                Supply
                            </label>
                            <input
                                type="text"
                                className="ci-input"
                                style={{ maxWidth: "220px" }}
                                value={form.DateOfSupply}
                                onChange={(e) =>
                                    handleFieldChange("DateOfSupply", e.target.value)
                                }
                            />
                        </div>

                        <div className="ci-field-row" style={{ marginBottom: 0 }}>
                            <label className="ci-label-sm">
                                Place of
                                <br />
                                Supply
                            </label>
                            <input
                                type="text"
                                className="ci-input"
                                style={{ maxWidth: "220px" }}
                                value={form.PlaceOfSupply}
                                onChange={(e) =>
                                    handleFieldChange("PlaceOfSupply", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* =============================================================
                    SECTION 2: CONSIGNEE (LEFT) & SHIP TO (RIGHT) - SCREENSHOT 4
                ============================================================= */}
                <div className="ci-split-section">
                    <div className="ci-split-left">
                        <h3 className="ci-section-heading">CONSIGNEE</h3>

                        <div className="ci-field-row">
                            <label className="ci-label-sm">
                                Buyer
                                <br />
                                Name:
                            </label>
                            <input
                                type="text"
                                list="ci-customer-options"
                                className="ci-input"
                                style={{ maxWidth: "220px" }}
                                value={form.ConsigneeName}
                                onChange={(e) =>
                                    handleFieldChange("ConsigneeName", e.target.value)
                                }
                            />
                        </div>

                        <div className="ci-field-row" style={{ alignItems: "flex-start" }}>
                            <label className="ci-label-sm" style={{ paddingTop: "4px" }}>
                                Address:
                            </label>
                            <textarea
                                className="ci-textarea"
                                rows={3}
                                value={form.ConsigneeAddress}
                                onChange={(e) =>
                                    handleFieldChange("ConsigneeAddress", e.target.value)
                                }
                            />
                        </div>

                        <div className="ci-two-col-inline">
                            <div className="ci-field-row">
                                <label className="ci-label-sm">GST # :</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.ConsigneeGSTNo}
                                    onChange={(e) =>
                                        handleFieldChange("ConsigneeGSTNo", e.target.value)
                                    }
                                />
                            </div>
                            <div className="ci-field-row">
                                <label className="ci-label-sm">PAN# :</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.ConsigneePANNo}
                                    onChange={(e) =>
                                        handleFieldChange("ConsigneePANNo", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="ci-two-col-inline">
                            <div className="ci-field-row">
                                <label className="ci-label-sm">State:</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.ConsigneeState}
                                    onChange={(e) =>
                                        handleFieldChange("ConsigneeState", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="ci-two-col-inline">
                            <div className="ci-field-row" style={{ marginBottom: 0 }}>
                                <label className="ci-label-sm">Currency:</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.Currency}
                                    onChange={(e) =>
                                        handleFieldChange("Currency", e.target.value)
                                    }
                                />
                            </div>
                            <div className="ci-field-row" style={{ marginBottom: 0 }}>
                                <label className="ci-label-sm">
                                    Exchange
                                    <br />
                                    Rate:
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="ci-input"
                                    value={form.ExchangeRate}
                                    onChange={(e) =>
                                        handleFieldChange("ExchangeRate", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="ci-split-right">
                        <h3 className="ci-section-heading">SHIP TO</h3>

                        <div className="ci-field-row">
                            <label className="ci-label-sm">Ship To:</label>
                            <input
                                type="text"
                                className="ci-input"
                                style={{ maxWidth: "220px" }}
                                value={form.ShipToName}
                                onChange={(e) =>
                                    handleFieldChange("ShipToName", e.target.value)
                                }
                            />
                        </div>

                        <div className="ci-field-row" style={{ alignItems: "flex-start" }}>
                            <label className="ci-label-sm" style={{ paddingTop: "4px" }}>
                                Address:
                            </label>
                            <textarea
                                className="ci-textarea"
                                rows={3}
                                value={form.ShipToAddress}
                                onChange={(e) =>
                                    handleFieldChange("ShipToAddress", e.target.value)
                                }
                            />
                        </div>

                        <div className="ci-two-col-inline">
                            <div className="ci-field-row">
                                <label className="ci-label-sm">GST # :</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.ShipToGSTNo}
                                    onChange={(e) =>
                                        handleFieldChange("ShipToGSTNo", e.target.value)
                                    }
                                />
                            </div>
                            <div className="ci-field-row">
                                <label className="ci-label-sm">PAN# :</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.ShipToPANNo}
                                    onChange={(e) =>
                                        handleFieldChange("ShipToPANNo", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="ci-two-col-inline">
                            <div className="ci-field-row">
                                <label className="ci-label-sm">State:</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.ShipToState}
                                    onChange={(e) =>
                                        handleFieldChange("ShipToState", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="ci-field-row" style={{ marginBottom: 0 }}>
                            <label className="ci-label-sm">Destination:</label>
                            <input
                                type="text"
                                className="ci-input"
                                placeholder="Type and select Destination"
                                value={form.Destination}
                                onChange={(e) =>
                                    handleFieldChange("Destination", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* =============================================================
                    SECTION 3: BUYER (OTHER THAN CONSIGNEE) & NOTIFY PARTY - SCREENSHOT 4
                ============================================================= */}
                <div className="ci-split-section">
                    <div className="ci-split-left">
                        <div className="ci-field-row">
                            <label style={{ width: "160px" }}>
                                Buyer (Other than Consignee)
                            </label>
                            <input
                                type="text"
                                className="ci-input"
                                value={form.BuyerOtherName}
                                onChange={(e) =>
                                    handleFieldChange("BuyerOtherName", e.target.value)
                                }
                            />
                        </div>
                        <div
                            className="ci-field-row"
                            style={{ alignItems: "flex-start", marginBottom: 0 }}
                        >
                            <label className="ci-label-sm" style={{ paddingTop: "4px" }}>
                                Address:
                            </label>
                            <textarea
                                className="ci-textarea"
                                rows={3}
                                value={form.BuyerOtherAddress}
                                onChange={(e) =>
                                    handleFieldChange("BuyerOtherAddress", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="ci-split-right">
                        <div className="ci-field-row">
                            <label style={{ width: "140px" }}>Notify Party</label>
                            <input
                                type="text"
                                className="ci-input"
                                value={form.NotifyParty}
                                onChange={(e) =>
                                    handleFieldChange("NotifyParty", e.target.value)
                                }
                            />
                        </div>
                        <div
                            className="ci-field-row"
                            style={{ alignItems: "flex-start", marginBottom: 0 }}
                        >
                            <label className="ci-label-sm" style={{ paddingTop: "4px" }}>
                                Address:
                            </label>
                            <textarea
                                className="ci-textarea"
                                rows={3}
                                value={form.NotifyPartyAddress}
                                onChange={(e) =>
                                    handleFieldChange("NotifyPartyAddress", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* =============================================================
                    SECTION 4: LOGISTICS, PORTS, MARKS, ORIGIN & DECLARATIONS - SCREENSHOT 5
                ============================================================= */}
                <div className="ci-split-section">
                    <div className="ci-split-left">
                        <div className="ci-two-col-inline">
                            <div className="ci-field-row">
                                <label>Forwarder Name:</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.ForwarderName}
                                    onChange={(e) =>
                                        handleFieldChange("ForwarderName", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="ci-two-col-inline">
                            <div className="ci-field-row">
                                <label>Pre Carriage By</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.PreCarriageBy}
                                    onChange={(e) =>
                                        handleFieldChange("PreCarriageBy", e.target.value)
                                    }
                                />
                            </div>
                            <div className="ci-field-row">
                                <label>
                                    Place of Receipts by
                                    <br />
                                    pre carrier
                                </label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.PlaceOfReceipt}
                                    onChange={(e) =>
                                        handleFieldChange("PlaceOfReceipt", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="ci-two-col-inline">
                            <div className="ci-field-row">
                                <label>Vessel/Flight No.</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.VesselFlightNo}
                                    onChange={(e) =>
                                        handleFieldChange("VesselFlightNo", e.target.value)
                                    }
                                />
                            </div>
                            <div className="ci-field-row">
                                <label>Port of Loading</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.PortOfLoading}
                                    onChange={(e) =>
                                        handleFieldChange("PortOfLoading", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="ci-two-col-inline">
                            <div className="ci-field-row">
                                <label>Port of Discharge</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.PortOfDischarge}
                                    onChange={(e) =>
                                        handleFieldChange("PortOfDischarge", e.target.value)
                                    }
                                />
                            </div>
                            <div className="ci-field-row">
                                <label>Final Destination</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.FinalDestination}
                                    onChange={(e) =>
                                        handleFieldChange("FinalDestination", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="ci-two-col-inline">
                            <div className="ci-field-row">
                                <label>
                                    Marks &amp;
                                    <br />
                                    Nos./Container's
                                    <br />
                                    No.
                                </label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.MarksAndNos}
                                    onChange={(e) =>
                                        handleFieldChange("MarksAndNos", e.target.value)
                                    }
                                />
                            </div>
                            <div className="ci-field-row">
                                <label>No. &amp; kind of Pkgs.</label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.NoAndKindOfPkgs}
                                    onChange={(e) =>
                                        handleFieldChange("NoAndKindOfPkgs", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div
                            className="ci-field-row"
                            style={{ alignItems: "flex-start", marginBottom: 0 }}
                        >
                            <label style={{ paddingTop: "4px" }}>Declaration1:</label>
                            <textarea
                                className="ci-textarea"
                                rows={3}
                                value={form.Declaration1}
                                onChange={(e) =>
                                    handleFieldChange("Declaration1", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="ci-split-right">
                        <div className="ci-two-col-inline">
                            <div className="ci-field-row">
                                <label>
                                    Country Of Origin
                                    <br />
                                    Goods
                                </label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.CountryOfOrigin}
                                    onChange={(e) =>
                                        handleFieldChange("CountryOfOrigin", e.target.value)
                                    }
                                />
                            </div>
                            <div className="ci-field-row">
                                <label>
                                    Country of Final
                                    <br />
                                    Destination
                                </label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.CountryOfFinalDest}
                                    onChange={(e) =>
                                        handleFieldChange("CountryOfFinalDest", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="ci-two-col-inline">
                            <div className="ci-field-row">
                                <label>
                                    Standard Unit
                                    <br />
                                    Quantity (SQC)
                                </label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.StandardUnitQty}
                                    onChange={(e) =>
                                        handleFieldChange("StandardUnitQty", e.target.value)
                                    }
                                />
                            </div>
                            <div className="ci-field-row">
                                <label>
                                    Details of Export
                                    <br />
                                    Under Preferential
                                    <br />
                                    (EPT)
                                </label>
                                <input
                                    type="text"
                                    className="ci-input"
                                    value={form.ExportPreferentialDetails}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "ExportPreferentialDetails",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="ci-field-row" style={{ alignItems: "flex-start" }}>
                            <label style={{ paddingTop: "4px" }}>
                                Terms of delivery &amp;
                                <br />
                                payment:
                            </label>
                            <textarea
                                className="ci-textarea"
                                rows={2}
                                value={form.TermsOfDeliveryPayment}
                                onChange={(e) =>
                                    handleFieldChange("TermsOfDeliveryPayment", e.target.value)
                                }
                            />
                        </div>

                        <div className="ci-field-row" style={{ alignItems: "flex-start" }}>
                            <label style={{ paddingTop: "4px" }}>
                                Description of
                                <br />
                                Goods:
                            </label>
                            <textarea
                                className="ci-textarea"
                                rows={2}
                                value={form.DescriptionOfGoods}
                                onChange={(e) =>
                                    handleFieldChange("DescriptionOfGoods", e.target.value)
                                }
                            />
                        </div>

                        <div
                            className="ci-field-row"
                            style={{ alignItems: "flex-start", marginBottom: 0 }}
                        >
                            <label style={{ paddingTop: "4px" }}>Declaration2:</label>
                            <textarea
                                className="ci-textarea"
                                rows={3}
                                value={form.Declaration2}
                                onChange={(e) =>
                                    handleFieldChange("Declaration2", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* =============================================================
                    SECTION 5: PRODUCTION PACK NO & TOTALS (SCREENSHOT 5 BOTTOM)
                ============================================================= */}
                <div className="ci-pack-section">
                    <div className="ci-pack-controls">
                        <label>Production Pack No</label>
                        <div className="ci-pack-box-wrap">
                            <div className="ci-pack-input-row">
                                <input
                                    type="text"
                                    list="ci-pack-options"
                                    placeholder="Type and Select Production Pack No"
                                    value={packInput}
                                    onChange={(e) => setPackInput(e.target.value)}
                                />
                                <datalist id="ci-pack-options">
                                    {DEFAULT_PACK_CATALOG.map((p) => (
                                        <option
                                            key={p.packNo}
                                            value={p.packNo}
                                            label={`${p.styleNo} - ${p.description}`}
                                        />
                                    ))}
                                </datalist>
                                <button
                                    type="button"
                                    className="ci-pack-add-btn"
                                    title="Add Production Pack No"
                                    onClick={handleAddPack}
                                >
                                    +
                                </button>
                            </div>

                            <div className="ci-pack-listbox-row">
                                <div className="ci-pack-listbox">
                                    {packList.map((p, idx) => (
                                        <div
                                            key={p}
                                            className={`ci-pack-item ${
                                                selectedPackIdx === idx ? "selected" : ""
                                            }`}
                                            onClick={() => setSelectedPackIdx(idx)}
                                        >
                                            <span>{p}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    className="ci-pack-remove-btn"
                                    title="Remove Selected Production Pack No"
                                    onClick={handleRemovePack}
                                >
                                    <FaTimes size={11} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="ci-totals-box">
                        <div className="ci-totals-line">
                            <span>Sub Total :</span>
                            <span className="val">
                                {subTotal > 0 ? subTotal.toFixed(2) : ""}
                            </span>
                        </div>
                        <div className="ci-totals-line">
                            <span>Total :</span>
                            <span className="val">{subTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* DISPLAYED PRODUCTION PACK ITEMS TABLE */}
                {showDisplayedTable && (
                    <div className="ci-table-wrap mb-3">
                        <table className="ci-list-table" style={{ minWidth: "900px" }}>
                            <thead>
                                <tr>
                                    <th>Pack No</th>
                                    <th>IO No</th>
                                    <th>Style No</th>
                                    <th>Description of Goods</th>
                                    <th>HSN Code</th>
                                    <th>UOM</th>
                                    <th>Qty</th>
                                    <th>Rate ({form.Currency || "USD"})</th>
                                    <th>Amount</th>
                                    <th style={{ width: "50px" }}>Del</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedItems.map((it, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <input
                                                type="text"
                                                className="ci-input"
                                                value={it.packNo}
                                                onChange={(e) =>
                                                    handleItemChange(idx, "packNo", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="ci-input"
                                                value={it.ioNo}
                                                onChange={(e) =>
                                                    handleItemChange(idx, "ioNo", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="ci-input"
                                                value={it.styleNo}
                                                onChange={(e) =>
                                                    handleItemChange(idx, "styleNo", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="ci-input"
                                                value={it.description}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        idx,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="ci-input"
                                                value={it.hsnCode}
                                                onChange={(e) =>
                                                    handleItemChange(idx, "hsnCode", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="ci-input"
                                                style={{ width: "65px" }}
                                                value={it.uom}
                                                onChange={(e) =>
                                                    handleItemChange(idx, "uom", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="ci-input"
                                                style={{ width: "85px", textAlign: "right" }}
                                                value={it.qty}
                                                onChange={(e) =>
                                                    handleItemChange(idx, "qty", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="ci-input"
                                                style={{ width: "95px", textAlign: "right" }}
                                                value={it.rate}
                                                onChange={(e) =>
                                                    handleItemChange(idx, "rate", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td style={{ textAlign: "right", fontWeight: 600 }}>
                                            {Number(it.amount || 0).toFixed(2)}
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger py-0 px-1"
                                                onClick={() =>
                                                    setDisplayedItems((prev) =>
                                                        prev.filter((_, i) => i !== idx)
                                                    )
                                                }
                                            >
                                                <FaTrash size={10} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* BOTTOM ACTION BUTTONS */}
                <div className="ci-bottom-actions">
                    <button
                        type="button"
                        className="ci-btn-display"
                        onClick={handleDisplayPacks}
                    >
                        Display
                    </button>

                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="ci-btn-cancel"
                            onClick={() => setMode("list")}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="ci-btn-save" disabled={saving}>
                            <FaCheck size={11} className="me-1" />
                            {saving ? "Saving..." : "Save Commercial Invoice"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
