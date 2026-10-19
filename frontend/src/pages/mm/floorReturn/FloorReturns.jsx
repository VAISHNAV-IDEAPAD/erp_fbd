import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    FaPlus,
    FaSyncAlt,
    FaBars,
    FaCog,
    FaFilter,
    FaCaretDown,
    FaCaretUp,
    FaEye,
    FaEdit,
    FaTrash,
    FaPrint,
    FaCalendarAlt,
    FaListUl,
    FaSave
} from "react-icons/fa";
import "../../../styles/floorReturns.css";

const API_URL = process.env.REACT_APP_API_URL || "/api";

const EMPTY_LINE = () => ({
    ioNo: "",
    ioDesc: "",
    group: "",
    item: "",
    colour: "",
    sizeRange: "",
    uom: "",
    qty: ""
});

const STORES_OPTIONS = [
    "RAW MATERIAL STORE 9B",
    "SEMI FINISH STORE 9B",
    "SEMI FINISH STORE 18",
    "RAW MATERIAL STORE 30",
    "FINISHED GOODS STORE"
];

const GROUP_OPTIONS = [
    "LEATHER",
    "LINING FABRIC",
    "METAL FITTINGS",
    "ZIPPERS & SLIDERS",
    "THREAD & REINFORCEMENT",
    "PACKAGING MATERIAL"
];

const ITEM_OPTIONS = [
    { name: "COW CULATTAS SINGLE LEATHER 1.2-1.4 MM", group: "LEATHER", colour: "BLACK", sizeRange: "STD", uom: "SQFT" },
    { name: "COW NAPPA MILLED LEATHER 1.1-1.3 MM", group: "LEATHER", colour: "FOREST BROWN", sizeRange: "STD", uom: "SQFT" },
    { name: "YKK #5 METAL ZIPPER SLIDER ANTIQUE BRASS", group: "ZIPPERS & SLIDERS", colour: "ANTIQUE BRASS", sizeRange: "5 NO", uom: "PCS" },
    { name: "POLYESTER TWILL LINING 120 GSM", group: "LINING FABRIC", colour: "BEIGE", sizeRange: "58 INCH", uom: "MTR" }
];

const CUTTING_SLIPS = [
    "CS/9B/2627/104",
    "CS/9B/2627/108",
    "JC/9B/2627/215",
    "JC/9B/2627/219"
];

const IO_NUMBERS = [
    { ioNo: "IO/9B/2627/60", desc: "171524 BRITTEN CROSSBODY" },
    { ioNo: "IO/9B/2627/61", desc: "189386 ROBINSON WOC" },
    { ioNo: "IO/9B/2627/72", desc: "176290 QUILTED POUCH" },
    { ioNo: "IO/9B/2627/84", desc: "178665 ROMY BUCKET BAG" }
];

export default function FloorReturns({ initialMode = "form" }) {
    const [mode, setMode] = useState(initialMode); // "form" | "list"
    const [returns, setReturns] = useState([]);
    const [suppliersList, setSuppliersList] = useState([]);

    // Form states matching Screenshots 1 & 2
    const [editingId, setEditingId] = useState(null);
    const [frmType, setFrmType] = useState("Production"); // "Production" | "Subcontract"
    const [frmPrefix, setFrmPrefix] = useState("FR/AAPL9B/2627/");
    const [frmSeq, setFrmSeq] = useState("166");
    const [returnDate, setReturnDate] = useState("19-10-2026");

    const [supplier, setSupplier] = useState("");
    const [supplierError, setSupplierError] = useState(false);
    const [stores, setStores] = useState("");
    const [receivedBy, setReceivedBy] = useState("");
    const [cuttingSlipNo, setCuttingSlipNo] = useState("");

    const [lines, setLines] = useState([EMPTY_LINE()]);
    const [remark, setRemark] = useState("");
    const [internalMemo, setInternalMemo] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [saving, setSaving] = useState(false);
    const [showSaveMenu, setShowSaveMenu] = useState(false);

    // List view states
    const [searchSupplier, setSearchSupplier] = useState("");
    const [openActionId, setOpenActionId] = useState(null);

    const datePickerRef = useRef(null);
    const fileInputRef = useRef(null);
    const saveWrapRef = useRef(null);
    const actionMenuRef = useRef(null);

    const loadData = async () => {
        try {
            const res = await axios.get(`${API_URL}/floor-returns`);
            const data = res.data?.data || res.data || [];
            if (Array.isArray(data)) {
                setReturns(data);
                if (data.length > 0 && !editingId) {
                    let maxSeq = 165;
                    data.forEach((r) => {
                        const m = String(r.FRMNo || "").match(/(\d+)$/);
                        if (m) maxSeq = Math.max(maxSeq, parseInt(m[1], 10));
                    });
                    setFrmSeq(String(maxSeq + 1));
                }
            }
        } catch (_) {}
    };

    const loadSuppliers = async () => {
        try {
            const res = await axios.get(`${API_URL}/suppliers`);
            const data = res.data?.value || res.data?.data || res.data || [];
            if (Array.isArray(data)) {
                setSuppliersList(
                    data
                        .map((s) => s.SupplierName || s.supplierName || "")
                        .filter(Boolean)
                );
            }
        } catch (_) {}
    };

    useEffect(() => {
        loadData();
        loadSuppliers();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (saveWrapRef.current && !saveWrapRef.current.contains(e.target)) {
                setShowSaveMenu(false);
            }
            if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
                setOpenActionId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLineChange = (idx, field, val) => {
        setLines((prev) =>
            prev.map((row, i) => {
                if (i !== idx) return row;
                const next = { ...row, [field]: val };
                if (field === "ioNo") {
                    const matchedIo = IO_NUMBERS.find(
                        (x) => x.ioNo.toLowerCase() === String(val).trim().toLowerCase()
                    );
                    if (matchedIo) next.ioDesc = matchedIo.desc;
                }
                if (field === "item") {
                    const matchedItem = ITEM_OPTIONS.find(
                        (x) => x.name.toLowerCase() === String(val).trim().toLowerCase()
                    );
                    if (matchedItem) {
                        next.group = next.group || matchedItem.group;
                        next.colour = next.colour || matchedItem.colour;
                        next.sizeRange = next.sizeRange || matchedItem.sizeRange;
                        next.uom = matchedItem.uom;
                    }
                }
                return next;
            })
        );
    };

    const handleAddAnotherLine = () => {
        setLines((prev) => [...prev, EMPTY_LINE()]);
    };

    const handleDisplayFromSlip = () => {
        setLines([
            {
                ioNo: "IO/9B/2627/60",
                ioDesc: "171524 BRITTEN CROSSBODY",
                group: "LEATHER",
                item: "COW CULATTAS SINGLE LEATHER 1.2-1.4 MM",
                colour: "FOREST BROWN",
                sizeRange: "STD",
                uom: "SQFT",
                qty: "25"
            }
        ]);
    };

    const totalQty = lines.reduce((sum, l) => sum + (Number(l.qty) || 0), 0);

    const resetForm = () => {
        setEditingId(null);
        setFrmType("Production");
        setFrmPrefix("FR/AAPL9B/2627/");
        setReturnDate("19-10-2026");
        setSupplier("");
        setSupplierError(false);
        setStores("");
        setReceivedBy("");
        setCuttingSlipNo("");
        setLines([EMPTY_LINE()]);
        setRemark("");
        setInternalMemo("");
        setAttachments([]);
    };

    const handleSave = async (afterAction = "view") => {
        setShowSaveMenu(false);
        if (frmType !== "Production" && !supplier.trim()) {
            setSupplierError(true);
            return;
        }
        setSupplierError(false);

        const fullFrmNo = `${frmPrefix}${frmSeq}`;
        const validDetails = lines
            .filter((l) => l.item || l.ioNo || Number(l.qty) > 0)
            .map((l) => ({
                ItemCode: l.ioNo || "LTH-1093",
                ItemName: l.item || "COW CULATTAS SINGLE LEATHER",
                Color: l.colour || "STD",
                Quantity: Number(l.qty) || 0,
                UOM: l.uom || "SQFT",
                Remarks: `${l.group || ""} ${l.sizeRange || ""}`.trim()
            }));

        const payload = {
            FRMNo: fullFrmNo,
            ReturnDate: returnDate,
            Stores: stores || "RAW MATERIAL STORE 9B",
            SupplierName:
                frmType === "Production"
                    ? supplier || "Production Floor"
                    : supplier,
            Currency: "INR",
            ExchangeRate: 1.0,
            Remark: remark,
            InternalMemo: internalMemo,
            UpdatedBy: receivedBy || "Admin",
            TotalQty: totalQty,
            RowCount: Math.max(validDetails.length, 1),
            details:
                validDetails.length > 0
                    ? validDetails
                    : [
                          {
                              ItemCode: "LTH-1093",
                              ItemName: "FLOOR RETURN MATERIAL",
                              Color: "STD",
                              Quantity: totalQty,
                              UOM: "PCS",
                              Remarks: remark
                          }
                      ]
        };

        setSaving(true);
        try {
            if (editingId) {
                await axios.put(`${API_URL}/floor-returns/${editingId}`, payload);
            } else {
                await axios.post(`${API_URL}/floor-returns`, payload);
            }
            await loadData();
            if (afterAction === "print") {
                window.print();
            } else if (afterAction === "new") {
                resetForm();
                setFrmSeq(String(Number(frmSeq || 166) + 1));
            } else {
                setMode("list");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Saved Floor Return.");
            setMode("list");
        } finally {
            setSaving(false);
        }
    };

    const handleEditRow = (row) => {
        setOpenActionId(null);
        setEditingId(row.ReturnID);
        const rawNo = String(row.FRMNo || "FR/AAPL9B/2627/166");
        const lastSlash = rawNo.lastIndexOf("/");
        if (lastSlash !== -1) {
            setFrmPrefix(rawNo.slice(0, lastSlash + 1));
            setFrmSeq(rawNo.slice(lastSlash + 1));
        }
        setReturnDate(row.ReturnDate || "19-10-2026");
        setSupplier(row.SupplierName || "");
        setStores(row.Stores || "");
        setReceivedBy(row.UpdatedBy || "");
        setRemark(row.Remark || "");
        setInternalMemo(row.InternalMemo || "");
        if (Array.isArray(row.details) && row.details.length > 0) {
            setLines(
                row.details.map((d) => ({
                    ioNo: d.ItemCode || "",
                    ioDesc: "",
                    group: "",
                    item: d.ItemName || "",
                    colour: d.Color || "",
                    sizeRange: "STD",
                    uom: d.UOM || "PCS",
                    qty: String(d.Quantity || "")
                }))
            );
        } else {
            setLines([EMPTY_LINE()]);
        }
        setMode("form");
    };

    const handleDeleteRow = async (row) => {
        setOpenActionId(null);
        if (!window.confirm(`Delete Floor Return ${row.FRMNo}?`)) return;
        try {
            await axios.delete(`${API_URL}/floor-returns/${row.ReturnID}`);
            loadData();
        } catch (_) {}
    };

    // =========================================================================
    // RENDER: FORM VIEW (SCREENSHOTS 1 & 2)
    // =========================================================================
    if (mode === "form") {
        return (
            <div className="floor-returns-page">
                <h1 className="fr-page-title">Floor Return</h1>

                {/* Top Stacked Fields: FRM Type, FRMNo, Date */}
                <div className="fr-form-header-stack">
                    {/* FRM Type */}
                    <div className="fr-field-block">
                        <label className="fr-label">FRM Type</label>
                        <select
                            className="fr-type-select"
                            value={frmType}
                            onChange={(e) => {
                                setFrmType(e.target.value);
                                setSupplierError(false);
                            }}
                        >
                            <option value="Production">Production</option>
                            <option value="Subcontract">Subcontract</option>
                            <option value="Supplier">Supplier</option>
                        </select>
                    </div>

                    {/* FRMNo */}
                    <div className="fr-field-block">
                        <label className="fr-label">FRMNo</label>
                        <div className="fr-frmno-row">
                            <select
                                className="fr-prefix-select"
                                value={frmPrefix}
                                onChange={(e) => setFrmPrefix(e.target.value)}
                            >
                                <option value="FR/AAPL9B/2627/">FR/AAPL9B/2627/</option>
                                <option value="FR/AAPL30/2627/">FR/AAPL30/2627/</option>
                            </select>
                            <input
                                type="text"
                                className="fr-seq-input"
                                value={frmSeq}
                                onChange={(e) => setFrmSeq(e.target.value)}
                            />
                            <button
                                type="button"
                                className="fr-gear-btn"
                                title="Configure Numbering Series"
                                onClick={() => {}}
                            >
                                <FaCog />
                            </button>
                        </div>
                    </div>

                    {/* Date */}
                    <div className="fr-field-block">
                        <label className="fr-label">Date</label>
                        <div className="fr-date-group">
                            <div className="fr-req-input-wrap">
                                <input
                                    type="text"
                                    className="fr-input"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                />
                                <span className="fr-req-star">*</span>
                            </div>
                            <button
                                type="button"
                                className="fr-addon-btn"
                                title="Select Date"
                                onClick={() =>
                                    datePickerRef.current &&
                                    datePickerRef.current.showPicker &&
                                    datePickerRef.current.showPicker()
                                }
                            >
                                <FaCalendarAlt />
                            </button>
                            <input
                                ref={datePickerRef}
                                type="date"
                                style={{
                                    position: "absolute",
                                    opacity: 0,
                                    width: 0,
                                    height: 0,
                                    pointerEvents: "none"
                                }}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        const [y, m, d] = e.target.value.split("-");
                                        setReturnDate(`${d}-${m}-${y}`);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* General Tab Box */}
                <div className="fr-general-tab-box">
                    <div className="fr-general-tab-bar">
                        <div className="fr-general-tab-pill">General</div>
                    </div>

                    <div className="fr-general-tab-body">
                        {frmType === "Production" ? (
                            <>
                                {/* Screenshot 1 Layout: Stores | Received By | Cutting Slip,Jobcard No + Display below */}
                                <div className="fr-general-grid-3">
                                    <div className="fr-field-block">
                                        <label className="fr-label">Stores</label>
                                        <div className="fr-req-input-wrap">
                                            <input
                                                type="text"
                                                className="fr-input"
                                                placeholder="Type and select Stores"
                                                list="fr-stores-datalist"
                                                value={stores}
                                                onChange={(e) => setStores(e.target.value)}
                                            />
                                            <span className="fr-req-star">*</span>
                                        </div>
                                    </div>

                                    <div className="fr-field-block">
                                        <label className="fr-label">Received By</label>
                                        <input
                                            type="text"
                                            className="fr-input"
                                            placeholder="Enter Received By"
                                            value={receivedBy}
                                            onChange={(e) => setReceivedBy(e.target.value)}
                                        />
                                    </div>

                                    <div className="fr-field-block">
                                        <label className="fr-label">
                                            Cutting Slip,Jobcard No
                                        </label>
                                        <div style={{ display: "flex", width: "100%" }}>
                                            <input
                                                type="text"
                                                className="fr-input"
                                                placeholder="Select Cutting Slip,Jobcard No"
                                                list="fr-cuttingslip-datalist"
                                                value={cuttingSlipNo}
                                                onChange={(e) =>
                                                    setCuttingSlipNo(e.target.value)
                                                }
                                            />
                                            <button
                                                type="button"
                                                className="fr-addon-btn"
                                                title="Select Cutting Slip / Jobcard No"
                                                onClick={() => {
                                                    if (!cuttingSlipNo) {
                                                        setCuttingSlipNo(CUTTING_SLIPS[0]);
                                                    }
                                                }}
                                            >
                                                <FaListUl />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: "24px" }}>
                                    <button
                                        type="button"
                                        className="fr-btn-display"
                                        onClick={handleDisplayFromSlip}
                                    >
                                        Display
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Screenshot 2 Layout: Supplier | Stores | Received By + Cutting Slip,Jobcard No | Display */}
                                <div className="fr-general-grid-3">
                                    <div className="fr-field-block">
                                        <label className="fr-label">Supplier</label>
                                        <div className="fr-req-input-wrap">
                                            <input
                                                type="text"
                                                className={`fr-input ${
                                                    supplierError ? "has-error" : ""
                                                }`}
                                                placeholder="Type and select Supplier"
                                                list="fr-supplier-datalist"
                                                value={supplier}
                                                onChange={(e) => {
                                                    setSupplier(e.target.value);
                                                    if (e.target.value.trim()) {
                                                        setSupplierError(false);
                                                    }
                                                }}
                                            />
                                            <span className="fr-req-star">*</span>
                                            {supplierError && (
                                                <span className="fr-error-x">×</span>
                                            )}
                                        </div>
                                        {supplierError && (
                                            <div className="fr-error-text">
                                                This field is required
                                            </div>
                                        )}
                                    </div>

                                    <div className="fr-field-block">
                                        <label className="fr-label">Stores</label>
                                        <div className="fr-req-input-wrap">
                                            <input
                                                type="text"
                                                className="fr-input"
                                                placeholder="Type and select Stores"
                                                list="fr-stores-datalist"
                                                value={stores}
                                                onChange={(e) => setStores(e.target.value)}
                                            />
                                            <span className="fr-req-star">*</span>
                                        </div>
                                    </div>

                                    <div className="fr-field-block">
                                        <label className="fr-label">Received By</label>
                                        <input
                                            type="text"
                                            className="fr-input"
                                            placeholder="Enter Received By"
                                            value={receivedBy}
                                            onChange={(e) => setReceivedBy(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div
                                    className="fr-general-grid-3"
                                    style={{ marginTop: "12px", alignItems: "end" }}
                                >
                                    <div className="fr-field-block">
                                        <label className="fr-label">
                                            Cutting Slip,Jobcard No
                                        </label>
                                        <div style={{ display: "flex", width: "100%" }}>
                                            <input
                                                type="text"
                                                className="fr-input"
                                                placeholder="Select Cutting Slip,Jobcard No"
                                                list="fr-cuttingslip-datalist"
                                                value={cuttingSlipNo}
                                                onChange={(e) =>
                                                    setCuttingSlipNo(e.target.value)
                                                }
                                            />
                                            <button
                                                type="button"
                                                className="fr-addon-btn"
                                                title="Select Cutting Slip / Jobcard No"
                                                onClick={() => {
                                                    if (!cuttingSlipNo) {
                                                        setCuttingSlipNo(CUTTING_SLIPS[0]);
                                                    }
                                                }}
                                            >
                                                <FaListUl />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            className="fr-btn-display"
                                            onClick={handleDisplayFromSlip}
                                        >
                                            Display
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        <datalist id="fr-stores-datalist">
                            {STORES_OPTIONS.map((s) => (
                                <option key={s} value={s} />
                            ))}
                        </datalist>
                        <datalist id="fr-supplier-datalist">
                            {suppliersList.map((s, idx) => (
                                <option key={idx} value={s} />
                            ))}
                        </datalist>
                        <datalist id="fr-cuttingslip-datalist">
                            {CUTTING_SLIPS.map((c) => (
                                <option key={c} value={c} />
                            ))}
                        </datalist>
                    </div>
                </div>

                {/* 7-Column Items Table: IO No | Group | Item | Colour | Size Range | UOM | Qty */}
                <div className="fr-items-grid-section">
                    <table className="fr-items-table">
                        <thead>
                            <tr>
                                <th style={{ width: "20%" }}>IO No</th>
                                <th style={{ width: "13.5%" }}>Group</th>
                                <th style={{ width: "13.5%" }}>Item</th>
                                <th style={{ width: "13.5%" }}>Colour</th>
                                <th style={{ width: "13.5%" }}>Size Range</th>
                                <th style={{ width: "13%" }}>UOM</th>
                                <th style={{ width: "13%" }}>Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lines.map((line, idx) => (
                                <tr key={idx}>
                                    {/* IO No */}
                                    <td>
                                        <div className="fr-iono-cell-group">
                                            <input
                                                type="text"
                                                className="fr-iono-input"
                                                placeholder="Enter IO No"
                                                list="fr-iono-datalist"
                                                value={line.ioNo}
                                                onChange={(e) =>
                                                    handleLineChange(
                                                        idx,
                                                        "ioNo",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <button
                                                type="button"
                                                className="fr-iono-list-btn"
                                                title="Select IO No"
                                                onClick={() => {
                                                    if (!line.ioNo) {
                                                        handleLineChange(
                                                            idx,
                                                            "ioNo",
                                                            IO_NUMBERS[0].ioNo
                                                        );
                                                    }
                                                }}
                                            >
                                                <FaListUl />
                                            </button>
                                            <input
                                                type="text"
                                                className="fr-iono-readonly"
                                                value={line.ioDesc}
                                                readOnly
                                            />
                                        </div>
                                    </td>

                                    {/* Group */}
                                    <td>
                                        <input
                                            type="text"
                                            className="fr-input"
                                            placeholder="Type & Select Group"
                                            list="fr-group-datalist"
                                            value={line.group}
                                            onChange={(e) =>
                                                handleLineChange(idx, "group", e.target.value)
                                            }
                                        />
                                    </td>

                                    {/* Item */}
                                    <td>
                                        <div className="fr-req-input-wrap">
                                            <input
                                                type="text"
                                                className="fr-input"
                                                placeholder="Type and select Item"
                                                list="fr-item-datalist"
                                                value={line.item}
                                                onChange={(e) =>
                                                    handleLineChange(
                                                        idx,
                                                        "item",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <span className="fr-req-star">*</span>
                                        </div>
                                    </td>

                                    {/* Colour */}
                                    <td>
                                        <input
                                            type="text"
                                            className="fr-input"
                                            placeholder="Type and select Colou"
                                            value={line.colour}
                                            onChange={(e) =>
                                                handleLineChange(
                                                    idx,
                                                    "colour",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </td>

                                    {/* Size Range */}
                                    <td>
                                        <div className="fr-req-input-wrap">
                                            <input
                                                type="text"
                                                className="fr-input"
                                                placeholder="Type & Select Size Rar"
                                                value={line.sizeRange}
                                                onChange={(e) =>
                                                    handleLineChange(
                                                        idx,
                                                        "sizeRange",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <span className="fr-req-star">*</span>
                                        </div>
                                    </td>

                                    {/* UOM */}
                                    <td>
                                        <div className="fr-req-input-wrap">
                                            <input
                                                type="text"
                                                className="fr-input fr-uom-readonly"
                                                placeholder="UOM"
                                                value={line.uom}
                                                onChange={(e) =>
                                                    handleLineChange(
                                                        idx,
                                                        "uom",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <span className="fr-req-star">*</span>
                                        </div>
                                    </td>

                                    {/* Qty */}
                                    <td>
                                        <div className="fr-req-input-wrap">
                                            <input
                                                type="number"
                                                className="fr-input fr-qty-input"
                                                placeholder="Qty"
                                                value={line.qty}
                                                onChange={(e) =>
                                                    handleLineChange(
                                                        idx,
                                                        "qty",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <span className="fr-req-star">*</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <datalist id="fr-iono-datalist">
                        {IO_NUMBERS.map((io) => (
                            <option key={io.ioNo} value={io.ioNo} />
                        ))}
                    </datalist>
                    <datalist id="fr-group-datalist">
                        {GROUP_OPTIONS.map((g) => (
                            <option key={g} value={g} />
                        ))}
                    </datalist>
                    <datalist id="fr-item-datalist">
                        {ITEM_OPTIONS.map((it) => (
                            <option key={it.name} value={it.name} />
                        ))}
                    </datalist>

                    {/* Scrollbar Bar matching Screenshots 1 & 2 */}
                    <div className="fr-scrollbar-deco">
                        <div className="fr-scrollbar-top-arrow">◀</div>
                        <div className="fr-scrollbar-track">
                            <span className="fr-scrollbar-arrow">◀</span>
                            <div className="fr-scrollbar-thumb" />
                            <span className="fr-scrollbar-arrow">▶</span>
                        </div>
                    </div>

                    {/* + Add Another Line */}
                    <div className="fr-add-line-row">
                        <button
                            type="button"
                            className="fr-add-line-btn"
                            onClick={handleAddAnotherLine}
                        >
                            <FaPlus size={10} /> Add Another Line
                        </button>
                    </div>
                </div>

                {/* Bottom Notes (Remark, Memo for internal use) + Total */}
                <div className="fr-bottom-notes-total-row">
                    <div className="fr-notes-pair">
                        <div className="fr-note-col">
                            <label className="fr-label">Remark</label>
                            <textarea
                                className="fr-textarea"
                                placeholder="Enter Remark"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                            />
                        </div>

                        <div className="fr-note-col">
                            <label className="fr-label">Memo for internal use</label>
                            <textarea
                                className="fr-textarea"
                                placeholder="Enter Internal Memo"
                                value={internalMemo}
                                onChange={(e) => setInternalMemo(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="fr-total-display">
                        Total : {totalQty > 0 ? totalQty.toFixed(2) : ""}
                    </div>
                </div>

                {/* + Attachments... */}
                <div className="fr-attachments-row">
                    <button
                        type="button"
                        className="fr-btn-attachments"
                        onClick={() =>
                            fileInputRef.current && fileInputRef.current.click()
                        }
                    >
                        <FaPlus size={10} /> Attachments...
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        style={{ display: "none" }}
                        onChange={(e) => {
                            const names = Array.from(e.target.files || []).map(
                                (f) => f.name
                            );
                            setAttachments((prev) => [...prev, ...names]);
                        }}
                    />
                    {attachments.length > 0 && (
                        <span
                            style={{
                                marginLeft: "10px",
                                fontSize: "11.5px",
                                color: "#555"
                            }}
                        >
                            {attachments.join(", ")}
                        </span>
                    )}
                </div>

                {/* Bottom Right Save | ▴ & View Buttons */}
                <div className="fr-bottom-save-bar">
                    <div className="fr-save-split-wrap" ref={saveWrapRef}>
                        <button
                            type="button"
                            className="fr-btn-save-main"
                            onClick={() => handleSave("view")}
                            disabled={saving}
                        >
                            <FaSave size={11} /> {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            className="fr-btn-save-caret"
                            onClick={() => setShowSaveMenu((prev) => !prev)}
                        >
                            <FaCaretUp />
                        </button>
                        {showSaveMenu && (
                            <div className="fr-save-dropup">
                                <div
                                    className="fr-save-dropup-item"
                                    onClick={() => handleSave("new")}
                                >
                                    Save &amp; New
                                </div>
                                <div
                                    className="fr-save-dropup-item"
                                    onClick={() => handleSave("print")}
                                >
                                    Save &amp; Print
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className="fr-btn-view-list"
                        onClick={() => setMode("list")}
                    >
                        <FaEye size={11} /> View
                    </button>
                </div>
            </div>
        );
    }

    // =========================================================================
    // RENDER: LIST VIEW (WHEN CLICKING "View")
    // =========================================================================
    const filteredReturns = returns.filter((r) => {
        if (!searchSupplier.trim()) return true;
        const q = searchSupplier.trim().toLowerCase();
        return (
            String(r.SupplierName || "").toLowerCase().includes(q) ||
            String(r.FRMNo || "").toLowerCase().includes(q) ||
            String(r.Stores || "").toLowerCase().includes(q)
        );
    });

    const emptyRowCount = Math.max(0, 14 - filteredReturns.length);

    return (
        <div className="floor-returns-page">
            <h1 className="fr-page-title">Floor Return</h1>

            <div className="fr-top-row">
                <div className="fr-search-group">
                    <label className="fr-search-label">Supplier Name</label>
                    <input
                        type="text"
                        className="fr-search-input"
                        placeholder="Supplier Search..."
                        value={searchSupplier}
                        onChange={(e) => setSearchSupplier(e.target.value)}
                    />
                </div>

                <button
                    type="button"
                    className="fr-btn-new"
                    onClick={() => {
                        resetForm();
                        setMode("form");
                    }}
                >
                    <FaPlus size={10} /> New Floor Return Material
                </button>
            </div>

            <div className="fr-toolbar-row">
                <div className="fr-toolbar-actions">
                    <button
                        type="button"
                        className="fr-tool-btn"
                        title="Reload"
                        onClick={loadData}
                    >
                        <FaSyncAlt />
                    </button>
                    <button type="button" className="fr-tool-btn" title="List">
                        <FaBars />
                    </button>
                    <button type="button" className="fr-tool-btn" title="Settings">
                        <FaCog />
                    </button>
                    <button type="button" className="fr-tool-btn">
                        <FaFilter /> Filter <FaCaretDown />
                    </button>
                </div>

                <div className="fr-page-badge">1</div>
            </div>

            <div className="fr-table-container">
                <table className="fr-table">
                    <thead>
                        <tr>
                            <th style={{ width: "85px" }}>Action</th>
                            <th>FRM No</th>
                            <th>Updated By</th>
                            <th>Updated On</th>
                            <th>Date</th>
                            <th>Supplier</th>
                            <th>Stores</th>
                            <th>Currency</th>
                            <th>Exchange Rate</th>
                            <th>Remark</th>
                            <th>Memo for internal use</th>
                            <th>Qty</th>
                            <th>No. of rows</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReturns.map((row, index) => {
                            const rowKey = row.ReturnID || row.FRMNo || index;
                            return (
                                <tr key={rowKey}>
                                    <td style={{ textAlign: "center" }}>
                                        <div
                                            className="fr-action-btn-wrap"
                                            ref={
                                                openActionId === rowKey
                                                    ? actionMenuRef
                                                    : null
                                            }
                                        >
                                            <button
                                                type="button"
                                                className="fr-action-btn"
                                                onClick={() =>
                                                    setOpenActionId(
                                                        openActionId === rowKey
                                                            ? null
                                                            : rowKey
                                                    )
                                                }
                                            >
                                                Action <FaCaretDown />
                                            </button>
                                            {openActionId === rowKey && (
                                                <div className="fr-action-menu">
                                                    <button
                                                        type="button"
                                                        className="fr-action-item"
                                                        onClick={() => handleEditRow(row)}
                                                    >
                                                        <FaEdit /> View / Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="fr-action-item"
                                                        onClick={() => {
                                                            setOpenActionId(null);
                                                            window.print();
                                                        }}
                                                    >
                                                        <FaPrint /> Print
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="fr-action-item"
                                                        style={{ color: "#d9534f" }}
                                                        onClick={() =>
                                                            handleDeleteRow(row)
                                                        }
                                                    >
                                                        <FaTrash /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>{row.FRMNo}</td>
                                    <td>{row.UpdatedBy}</td>
                                    <td>{row.UpdatedOn}</td>
                                    <td>{row.ReturnDate}</td>
                                    <td>{row.SupplierName}</td>
                                    <td>{row.Stores}</td>
                                    <td style={{ textAlign: "center" }}>
                                        {row.Currency || "INR"}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        {Number(row.ExchangeRate || 1.0).toFixed(1)}
                                    </td>
                                    <td>{row.Remark}</td>
                                    <td>{row.InternalMemo}</td>
                                    <td style={{ textAlign: "right" }}>
                                        {Number(row.TotalQty || 0).toFixed(1)}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        {row.RowCount || 1}
                                    </td>
                                </tr>
                            );
                        })}

                        {Array.from({ length: emptyRowCount }).map((_, idx) => (
                            <tr key={`empty-${idx}`}>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
