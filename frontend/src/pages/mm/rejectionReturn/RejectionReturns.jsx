import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    FaPlus,
    FaSyncAlt,
    FaListUl,
    FaCog,
    FaFilter,
    FaCaretDown,
    FaCalendarAlt,
    FaSave,
    FaEye,
    FaEdit,
    FaTrash,
    FaPrint
} from "react-icons/fa";
import "../../../styles/rejectionReturn.css";

const API_URL = process.env.REACT_APP_API_URL || "/api";

const DEFAULT_OTHER_CHARGES = () => [
    {
        accountName: "",
        currency: "",
        value: "",
        taxGroup: "",
        cgst: "",
        sgst: "",
        igst: ""
    },
    {
        accountName: "",
        currency: "",
        value: "",
        taxGroup: "",
        cgst: "",
        sgst: "",
        igst: ""
    }
];

const SAMPLE_GRN_NUMBERS = [
    "GRN/9B/2627/114",
    "GRN/9B/2627/118",
    "GRN/9B/2627/121",
    "GRN/9B/2627/125"
];

const SAMPLE_GROUPS = [
    "LEATHER",
    "METAL FITTINGS",
    "LINING FABRIC",
    "ZIPPERS & SLIDERS",
    "PACKAGING MATERIAL"
];

const SAMPLE_ITEMS = [
    "COW CULATTAS SINGLE LEATHER 1.2-1.4 MM",
    "YKK #5 METAL ZIPPER SLIDER ANTIQUE BRASS",
    "POLYESTER TWILL LINING 120 GSM",
    "MAGNETIC SNAP BUTTON 18MM"
];

export default function RejectionReturns({ initialMode = "list" }) {
    const [mode, setMode] = useState(initialMode); // "list" | "form"
    const [records, setRecords] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    // List View states
    const [supplierSearch, setSupplierSearch] = useState("");
    const [showFilterDrawer, setShowFilterDrawer] = useState(false);
    const [filterDateFrom, setFilterDateFrom] = useState("");
    const [filterDateTo, setFilterDateTo] = useState("");
    const [filterReturnNo, setFilterReturnNo] = useState("");
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [openActionRowId, setOpenActionRowId] = useState(null);
    const [showBulkMenu, setShowBulkMenu] = useState(false);

    // Form View (+ Display From GRN) states
    const [editingId, setEditingId] = useState(null);
    const [supplierInput, setSupplierInput] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [grnInput, setGrnInput] = useState("");
    const [grnList, setGrnList] = useState([]);
    const [activeGrnIdx, setActiveGrnIdx] = useState(null);

    const [groupInput, setGroupInput] = useState("");
    const [groupList, setGroupList] = useState([]);
    const [activeGroupIdx, setActiveGroupIdx] = useState(null);

    const [itemInput, setItemInput] = useState("");
    const [itemList, setItemList] = useState([]);
    const [activeItemIdx, setActiveItemIdx] = useState(null);

    const [grnItems, setGrnItems] = useState([]);
    const [otherCharges, setOtherCharges] = useState(DEFAULT_OTHER_CHARGES());
    const [grnMessage, setGrnMessage] = useState("");
    const [internalMemo, setInternalMemo] = useState("");
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [saving, setSaving] = useState(false);

    const fromDatePickerRef = useRef(null);
    const toDatePickerRef = useRef(null);
    const fileInputRef = useRef(null);
    const actionWrapRef = useRef(null);
    const bulkWrapRef = useRef(null);

    const fetchRecords = async (supplierVal = supplierSearch) => {
        try {
            const params = {};
            if (supplierVal && supplierVal.trim()) {
                params.supplier = supplierVal.trim();
            }
            const res = await axios.get(`${API_URL}/rejection-returns`, { params });
            setRecords(res.data?.data || []);
        } catch (_) {
            setRecords([]);
        }
    };

    useEffect(() => {
        fetchRecords("");
        axios
            .get(`${API_URL}/suppliers`)
            .then((res) => {
                const list = res.data?.data || res.data?.value || [];
                if (Array.isArray(list)) {
                    setSuppliers(
                        list
                            .map((s) => s.SupplierName || s.supplierName || "")
                            .filter(Boolean)
                    );
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const handleDocClick = (e) => {
            if (actionWrapRef.current && !actionWrapRef.current.contains(e.target)) {
                setOpenActionRowId(null);
            }
            if (bulkWrapRef.current && !bulkWrapRef.current.contains(e.target)) {
                setShowBulkMenu(false);
            }
        };
        document.addEventListener("mousedown", handleDocClick);
        return () => document.removeEventListener("mousedown", handleDocClick);
    }, []);

    // Filter records in list view
    const filteredRecords = records.filter((r) => {
        if (
            supplierSearch.trim() &&
            !String(r.SupplierName || "")
                .toLowerCase()
                .includes(supplierSearch.trim().toLowerCase())
        ) {
            return false;
        }
        if (
            filterReturnNo.trim() &&
            !String(r.ReturnNo || "")
                .toLowerCase()
                .includes(filterReturnNo.trim().toLowerCase())
        ) {
            return false;
        }
        return true;
    });

    const resetForm = () => {
        setEditingId(null);
        setSupplierInput("");
        setFromDate("");
        setToDate("");
        setGrnInput("");
        setGrnList([]);
        setActiveGrnIdx(null);
        setGroupInput("");
        setGroupList([]);
        setActiveGroupIdx(null);
        setItemInput("");
        setItemList([]);
        setActiveItemIdx(null);
        setGrnItems([]);
        setOtherCharges(DEFAULT_OTHER_CHARGES());
        setGrnMessage("");
        setInternalMemo("");
        setAttachedFiles([]);
    };

    const handleOpenDisplayFromGrn = () => {
        resetForm();
        setMode("form");
    };

    // Multi-select add/remove helpers
    const handleAddGrn = () => {
        const val = grnInput.trim();
        if (!val) return;
        if (!grnList.includes(val)) {
            setGrnList((prev) => [...prev, val]);
        }
        setGrnInput("");
    };

    const handleRemoveGrn = () => {
        if (grnList.length === 0) return;
        if (activeGrnIdx !== null && activeGrnIdx >= 0 && activeGrnIdx < grnList.length) {
            setGrnList((prev) => prev.filter((_, i) => i !== activeGrnIdx));
            setActiveGrnIdx(null);
        } else {
            setGrnList((prev) => prev.slice(0, -1));
        }
    };

    const handleAddGroup = () => {
        const val = groupInput.trim();
        if (!val) return;
        if (!groupList.includes(val)) {
            setGroupList((prev) => [...prev, val]);
        }
        setGroupInput("");
    };

    const handleRemoveGroup = () => {
        if (groupList.length === 0) return;
        if (activeGroupIdx !== null && activeGroupIdx >= 0 && activeGroupIdx < groupList.length) {
            setGroupList((prev) => prev.filter((_, i) => i !== activeGroupIdx));
            setActiveGroupIdx(null);
        } else {
            setGroupList((prev) => prev.slice(0, -1));
        }
    };

    const handleAddItem = () => {
        const val = itemInput.trim();
        if (!val) return;
        if (!itemList.includes(val)) {
            setItemList((prev) => [...prev, val]);
        }
        setItemInput("");
    };

    const handleRemoveItem = () => {
        if (itemList.length === 0) return;
        if (activeItemIdx !== null && activeItemIdx >= 0 && activeItemIdx < itemList.length) {
            setItemList((prev) => prev.filter((_, i) => i !== activeItemIdx));
            setActiveItemIdx(null);
        } else {
            setItemList((prev) => prev.slice(0, -1));
        }
    };

    // Display GRN items
    const handleDisplayGrnItems = async () => {
        try {
            const res = await axios.get(`${API_URL}/rejection-returns/grn-items`, {
                params: { supplier: supplierInput }
            });
            let loaded = res.data?.data || [];
            if (grnList.length > 0) {
                const match = loaded.filter((r) => grnList.includes(r.trNo));
                if (match.length > 0) loaded = match;
            }
            setGrnItems(loaded);
        } catch (_) {
            setGrnItems([
                {
                    id: "grn-1",
                    selected: true,
                    trNo: grnList[0] || "GRN/9B/2627/114",
                    trDate: fromDate || "16-10-2026",
                    poNo: "PO/9B/2627/88",
                    itemName: itemList[0] || "COW CULATTAS SINGLE LEATHER 1.2-1.4 MM",
                    variant: "FOREST BROWN",
                    sizeRange: "STD",
                    taxGroup: "GST 12%",
                    pendingQty: 45,
                    rate: 210,
                    qtyToReturn: 15,
                    discountPercent: 0,
                    value: 3150.0
                }
            ]);
        }
    };

    const handleItemRowChange = (idx, field, val) => {
        setGrnItems((prev) =>
            prev.map((row, i) => {
                if (i !== idx) return row;
                const updated = { ...row, [field]: val };
                const rate = Number(updated.rate) || 0;
                const qty = Number(updated.qtyToReturn) || 0;
                const disc = Number(updated.discountPercent) || 0;
                const gross = rate * qty;
                const net = gross - (gross * disc) / 100;
                updated.value = Number(net.toFixed(2));
                return updated;
            })
        );
    };

    const handleChargeChange = (idx, field, val) => {
        setOtherCharges((prev) =>
            prev.map((row, i) => {
                if (i !== idx) return row;
                const updated = { ...row, [field]: val };
                const amt = Number(updated.value) || 0;
                if (amt > 0 && updated.taxGroup) {
                    const tg = String(updated.taxGroup).toUpperCase();
                    if (tg.includes("IGST")) {
                        updated.cgst = "0.00";
                        updated.sgst = "0.00";
                        updated.igst = (amt * 0.18).toFixed(2);
                    } else {
                        updated.cgst = (amt * 0.09).toFixed(2);
                        updated.sgst = (amt * 0.09).toFixed(2);
                        updated.igst = "0.00";
                    }
                }
                return updated;
            })
        );
    };

    const handleAddChargeRow = () => {
        setOtherCharges((prev) => [
            ...prev,
            {
                accountName: "",
                currency: "",
                value: "",
                taxGroup: "",
                cgst: "",
                sgst: "",
                igst: ""
            }
        ]);
    };

    // Totals calculation
    const selectedGrnItems = grnItems.filter((r) => r.selected !== false);
    const totalAcceptedQty = selectedGrnItems.reduce(
        (sum, r) => sum + (Number(r.qtyToReturn) || 0),
        0
    );
    const subTotal = selectedGrnItems.reduce(
        (sum, r) => sum + (Number(r.value) || 0),
        0
    );
    const otherChargesSum = otherCharges.reduce(
        (sum, c) =>
            sum +
            (Number(c.value) || 0) +
            (Number(c.cgst) || 0) +
            (Number(c.sgst) || 0) +
            (Number(c.igst) || 0),
        0
    );
    const grandTotal = subTotal + otherChargesSum;

    const handleSave = async () => {
        if (!supplierInput.trim()) {
            alert("Please enter / select a Supplier.");
            return;
        }
        setSaving(true);
        try {
            const payload = {
                SupplierName: supplierInput.trim(),
                Currency:
                    otherCharges.find((c) => c.currency)?.currency || "INR",
                ExchangeRate: 1.0,
                Remark: grnMessage,
                InternalMemo: internalMemo,
                TotalQty: totalAcceptedQty,
                NoOfRows: Math.max(selectedGrnItems.length, 1),
                SubTotal: subTotal,
                TotalAmount: grandTotal,
                GRNNos: grnList,
                Groups: groupList,
                ItemsFilter: itemList,
                items: selectedGrnItems,
                otherCharges
            };

            if (editingId) {
                await axios.put(`${API_URL}/rejection-returns/${editingId}`, payload);
            } else {
                await axios.post(`${API_URL}/rejection-returns`, payload);
            }
            await fetchRecords("");
            setMode("list");
        } catch (err) {
            alert(err.response?.data?.message || "Error saving Rejection Return.");
        } finally {
            setSaving(false);
        }
    };

    const handleEditRecord = (rec) => {
        setOpenActionRowId(null);
        setEditingId(rec.RejectionReturnID);
        setSupplierInput(rec.SupplierName || "");
        setGrnMessage(rec.Remark || "");
        setInternalMemo(rec.InternalMemo || "");
        setGrnList(
            rec.GRNNos
                ? String(rec.GRNNos)
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                : []
        );
        setGroupList(
            rec.Groups
                ? String(rec.Groups)
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                : []
        );
        setItemList(
            rec.ItemsFilter
                ? String(rec.ItemsFilter)
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                : []
        );
        setGrnItems(Array.isArray(rec.items) ? rec.items : []);
        setOtherCharges(
            Array.isArray(rec.otherCharges) && rec.otherCharges.length > 0
                ? rec.otherCharges
                : DEFAULT_OTHER_CHARGES()
        );
        setMode("form");
    };

    const handleDeleteRecord = async (rec) => {
        setOpenActionRowId(null);
        if (!window.confirm(`Delete Rejection Return ${rec.ReturnNo}?`)) return;
        try {
            await axios.delete(`${API_URL}/rejection-returns/${rec.RejectionReturnID}`);
            fetchRecords(supplierSearch);
        } catch (_) {}
    };

    const toggleRowSelection = (id) => {
        setSelectedRowIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleAllRows = (checked) => {
        if (checked) {
            setSelectedRowIds(filteredRecords.map((r) => r.RejectionReturnID));
        } else {
            setSelectedRowIds([]);
        }
    };

    const handleBulkDelete = async () => {
        setShowBulkMenu(false);
        if (selectedRowIds.length === 0) {
            alert("Select at least one row to perform bulk delete.");
            return;
        }
        if (!window.confirm(`Delete ${selectedRowIds.length} selected Rejection Return(s)?`)) {
            return;
        }
        for (const id of selectedRowIds) {
            try {
                await axios.delete(`${API_URL}/rejection-returns/${id}`);
            } catch (_) {}
        }
        setSelectedRowIds([]);
        fetchRecords(supplierSearch);
    };

    // =========================================================
    // RENDER: FORM VIEW (+ DISPLAY FROM GRN)
    // =========================================================
    if (mode === "form") {
        return (
            <div className="rr-page">
                <h1 className="rr-page-title">Rejection Return</h1>

                {/* Top 4-Column Filter & Multi-Select Section */}
                <div className="rr-form-top-grid">
                    {/* Column 1: Supplier, From Date, To Date */}
                    <div className="rr-col-left">
                        <div className="rr-field-group">
                            <label className="rr-field-label">Supplier</label>
                            <div className="rr-required-input-wrap">
                                <input
                                    type="text"
                                    className="rr-form-input"
                                    placeholder="Type and select Supplier"
                                    list="rr-supplier-datalist"
                                    value={supplierInput}
                                    onChange={(e) => setSupplierInput(e.target.value)}
                                />
                                <span className="rr-req-star">*</span>
                                <datalist id="rr-supplier-datalist">
                                    {suppliers.map((s, idx) => (
                                        <option key={idx} value={s} />
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        <div className="rr-field-group">
                            <label className="rr-field-label">From Date</label>
                            <div className="rr-date-input-group">
                                <input
                                    type="text"
                                    className="rr-form-input"
                                    placeholder="Select From Date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="rr-date-addon"
                                    title="Select From Date"
                                    onClick={() =>
                                        fromDatePickerRef.current &&
                                        fromDatePickerRef.current.showPicker &&
                                        fromDatePickerRef.current.showPicker()
                                    }
                                >
                                    <FaCalendarAlt />
                                </button>
                                <input
                                    ref={fromDatePickerRef}
                                    type="date"
                                    style={{ position: "absolute", opacity: 0, width: 0, height: 0, pointerEvents: "none" }}
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            const [y, m, d] = e.target.value.split("-");
                                            setFromDate(`${d}-${m}-${y}`);
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="rr-field-group">
                            <label className="rr-field-label">To Date</label>
                            <div className="rr-date-input-group">
                                <input
                                    type="text"
                                    className="rr-form-input"
                                    placeholder="Select To Date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="rr-date-addon"
                                    title="Select To Date"
                                    onClick={() =>
                                        toDatePickerRef.current &&
                                        toDatePickerRef.current.showPicker &&
                                        toDatePickerRef.current.showPicker()
                                    }
                                >
                                    <FaCalendarAlt />
                                </button>
                                <input
                                    ref={toDatePickerRef}
                                    type="date"
                                    style={{ position: "absolute", opacity: 0, width: 0, height: 0, pointerEvents: "none" }}
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            const [y, m, d] = e.target.value.split("-");
                                            setToDate(`${d}-${m}-${y}`);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Column 2: GRN No */}
                    <div className="rr-multiselect-col">
                        <label className="rr-field-label">GRN No</label>
                        <div className="rr-add-input-group">
                            <input
                                type="text"
                                className="rr-form-input"
                                placeholder="Type and select GRN No"
                                list="rr-grn-datalist"
                                value={grnInput}
                                onChange={(e) => setGrnInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddGrn();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className="rr-plus-addon-btn"
                                title="Add GRN No"
                                onClick={handleAddGrn}
                            >
                                <FaPlus size={9} />
                            </button>
                            <datalist id="rr-grn-datalist">
                                {SAMPLE_GRN_NUMBERS.map((g) => (
                                    <option key={g} value={g} />
                                ))}
                            </datalist>
                        </div>

                        <div className="rr-listbox-wrap">
                            <div className="rr-listbox-items">
                                {grnList.map((g, i) => (
                                    <div
                                        key={i}
                                        className={`rr-listbox-item ${activeGrnIdx === i ? "active" : ""}`}
                                        onClick={() => setActiveGrnIdx(i)}
                                    >
                                        <span>{g}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="rr-listbox-scrollstrip">
                                <span>▲</span>
                                <span>▼</span>
                            </div>
                            <div className="rr-listbox-remove-strip">
                                <button
                                    type="button"
                                    className="rr-remove-x-btn"
                                    title="Remove GRN No"
                                    onClick={handleRemoveGrn}
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Group */}
                    <div className="rr-multiselect-col">
                        <label className="rr-field-label">Group</label>
                        <div className="rr-add-input-group">
                            <input
                                type="text"
                                className="rr-form-input"
                                placeholder="Type and select Group"
                                list="rr-group-datalist"
                                value={groupInput}
                                onChange={(e) => setGroupInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddGroup();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className="rr-plus-addon-btn"
                                title="Add Group"
                                onClick={handleAddGroup}
                            >
                                <FaPlus size={9} />
                            </button>
                            <datalist id="rr-group-datalist">
                                {SAMPLE_GROUPS.map((g) => (
                                    <option key={g} value={g} />
                                ))}
                            </datalist>
                        </div>

                        <div className="rr-listbox-wrap">
                            <div className="rr-listbox-items">
                                {groupList.map((g, i) => (
                                    <div
                                        key={i}
                                        className={`rr-listbox-item ${activeGroupIdx === i ? "active" : ""}`}
                                        onClick={() => setActiveGroupIdx(i)}
                                    >
                                        <span>{g}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="rr-listbox-scrollstrip">
                                <span>▲</span>
                                <span>▼</span>
                            </div>
                            <div className="rr-listbox-remove-strip">
                                <button
                                    type="button"
                                    className="rr-remove-x-btn"
                                    title="Remove Group"
                                    onClick={handleRemoveGroup}
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Item */}
                    <div className="rr-multiselect-col">
                        <label className="rr-field-label">Item</label>
                        <div className="rr-add-input-group">
                            <input
                                type="text"
                                className="rr-form-input"
                                placeholder="Item"
                                list="rr-item-datalist"
                                value={itemInput}
                                onChange={(e) => setItemInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddItem();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className="rr-plus-addon-btn"
                                title="Add Item"
                                onClick={handleAddItem}
                            >
                                <FaPlus size={9} />
                            </button>
                            <datalist id="rr-item-datalist">
                                {SAMPLE_ITEMS.map((it) => (
                                    <option key={it} value={it} />
                                ))}
                            </datalist>
                        </div>

                        <div className="rr-listbox-wrap">
                            <div className="rr-listbox-items">
                                {itemList.map((it, i) => (
                                    <div
                                        key={i}
                                        className={`rr-listbox-item ${activeItemIdx === i ? "active" : ""}`}
                                        onClick={() => setActiveItemIdx(i)}
                                    >
                                        <span>{it}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="rr-listbox-scrollstrip">
                                <span>▲</span>
                                <span>▼</span>
                            </div>
                            <div className="rr-listbox-remove-strip">
                                <button
                                    type="button"
                                    className="rr-remove-x-btn"
                                    title="Remove Item"
                                    onClick={handleRemoveItem}
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Display Button */}
                <div className="rr-display-btn-row">
                    <button
                        type="button"
                        className="rr-btn-display"
                        onClick={handleDisplayGrnItems}
                    >
                        Display
                    </button>
                </div>

                {/* 13-Column GRN Items Table */}
                <div className="rr-items-table-wrap">
                    <table className="rr-items-table">
                        <thead>
                            <tr>
                                <th style={{ width: "36px" }}>
                                    <input
                                        type="checkbox"
                                        className="rr-header-check"
                                        checked={
                                            grnItems.length > 0 &&
                                            grnItems.every((r) => r.selected !== false)
                                        }
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setGrnItems((prev) =>
                                                prev.map((r) => ({ ...r, selected: checked }))
                                            );
                                        }}
                                    />
                                </th>
                                <th>Tr No</th>
                                <th>Tr Date</th>
                                <th>PO No</th>
                                <th>Item Name</th>
                                <th>Variant</th>
                                <th>Size Range</th>
                                <th>Tax Group</th>
                                <th>Pending Qty</th>
                                <th>Rate</th>
                                <th>Qty to Return</th>
                                <th>Discount %</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grnItems.map((row, idx) => (
                                <tr key={row.id || idx}>
                                    <td style={{ textAlign: "center" }}>
                                        <input
                                            type="checkbox"
                                            checked={row.selected !== false}
                                            onChange={(e) =>
                                                handleItemRowChange(
                                                    idx,
                                                    "selected",
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </td>
                                    <td>{row.trNo}</td>
                                    <td>{row.trDate}</td>
                                    <td>{row.poNo}</td>
                                    <td>{row.itemName}</td>
                                    <td>{row.variant}</td>
                                    <td>{row.sizeRange}</td>
                                    <td>{row.taxGroup}</td>
                                    <td style={{ textAlign: "right" }}>{row.pendingQty}</td>
                                    <td style={{ textAlign: "right" }}>
                                        <input
                                            type="number"
                                            className="rr-cell-input"
                                            value={row.rate}
                                            onChange={(e) =>
                                                handleItemRowChange(idx, "rate", e.target.value)
                                            }
                                        />
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <input
                                            type="number"
                                            className="rr-cell-input"
                                            value={row.qtyToReturn}
                                            onChange={(e) =>
                                                handleItemRowChange(
                                                    idx,
                                                    "qtyToReturn",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <input
                                            type="number"
                                            className="rr-cell-input"
                                            value={row.discountPercent}
                                            onChange={(e) =>
                                                handleItemRowChange(
                                                    idx,
                                                    "discountPercent",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </td>
                                    <td style={{ textAlign: "right", fontWeight: 600 }}>
                                        {Number(row.value || 0).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Middle Summary: Other Charges Title + Totals Block */}
                <div className="rr-mid-summary-row">
                    <div className="rr-other-charges-title">Other Charges</div>
                    <div className="rr-totals-box">
                        <div className="rr-total-line">
                            <span className="rr-total-label">Total Accepted Qty :</span>
                            <span className="rr-total-val">
                                {totalAcceptedQty > 0 ? totalAcceptedQty : ""}
                            </span>
                        </div>
                        <div className="rr-total-line">
                            <span className="rr-total-label">Sub Total :</span>
                            <span className="rr-total-val">
                                {subTotal > 0 ? subTotal.toFixed(2) : ""}
                            </span>
                        </div>
                        <div className="rr-total-line">
                            <span className="rr-total-label">Total :</span>
                            <span className="rr-total-val">{grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Other Charges Table */}
                <div className="rr-other-charges-wrap">
                    <table className="rr-charges-table">
                        <thead>
                            <tr>
                                <th style={{ width: "130px" }}>Account Name</th>
                                <th style={{ width: "120px" }}>Currency</th>
                                <th style={{ width: "125px" }}>Value</th>
                                <th style={{ width: "125px" }}>Tax Group</th>
                                <th colSpan={3}>
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr 1fr",
                                            textAlign: "center"
                                        }}
                                    >
                                        <span>CGST</span>
                                        <span>SGST</span>
                                        <span>IGST</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {otherCharges.map((ch, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <input
                                            type="text"
                                            className="rr-charge-input"
                                            placeholder="Type and sele"
                                            value={ch.accountName}
                                            onChange={(e) =>
                                                handleChargeChange(
                                                    idx,
                                                    "accountName",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <select
                                            className="rr-charge-select"
                                            value={ch.currency}
                                            onChange={(e) =>
                                                handleChargeChange(
                                                    idx,
                                                    "currency",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">&lt;--Select-</option>
                                            <option value="INR">INR</option>
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="rr-charge-input"
                                            placeholder="Enter Amount"
                                            value={ch.value}
                                            onChange={(e) =>
                                                handleChargeChange(idx, "value", e.target.value)
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="rr-charge-input"
                                            placeholder="Select Tax Gro"
                                            value={ch.taxGroup}
                                            onChange={(e) =>
                                                handleChargeChange(
                                                    idx,
                                                    "taxGroup",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </td>
                                    <td colSpan={3}>
                                        <div className="rr-tax-readonly-group">
                                            <input
                                                type="text"
                                                className="rr-tax-readonly-box"
                                                value={ch.cgst}
                                                readOnly
                                            />
                                            <input
                                                type="text"
                                                className="rr-tax-readonly-box"
                                                value={ch.sgst}
                                                readOnly
                                            />
                                            <input
                                                type="text"
                                                className="rr-tax-readonly-box"
                                                value={ch.igst}
                                                readOnly
                                            />
                                            {idx === otherCharges.length - 1 && (
                                                <button
                                                    type="button"
                                                    className="rr-charge-add-btn"
                                                    title="Add Charge Row"
                                                    onClick={handleAddChargeRow}
                                                >
                                                    <FaPlus size={9} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Bottom Notes Row */}
                <div className="rr-bottom-notes-row">
                    <div className="rr-note-block">
                        <label className="rr-field-label">
                            Message displayed in Item Receipt
                        </label>
                        <textarea
                            className="rr-note-textarea"
                            placeholder="Enter GRN Message"
                            value={grnMessage}
                            onChange={(e) => setGrnMessage(e.target.value)}
                        />
                    </div>

                    <div className="rr-note-block">
                        <label className="rr-field-label">Memo for internal use</label>
                        <textarea
                            className="rr-note-textarea"
                            placeholder="Enter Internal Memo"
                            value={internalMemo}
                            onChange={(e) => setInternalMemo(e.target.value)}
                        />
                    </div>
                </div>

                {/* Footer Actions Row */}
                <div className="rr-footer-actions-row">
                    <div>
                        <button
                            type="button"
                            className="rr-btn-add-files"
                            onClick={() =>
                                fileInputRef.current && fileInputRef.current.click()
                            }
                        >
                            <FaPlus size={10} /> Add files...
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            style={{ display: "none" }}
                            onChange={(e) => {
                                const files = Array.from(e.target.files || []).map(
                                    (f) => f.name
                                );
                                setAttachedFiles((prev) => [...prev, ...files]);
                            }}
                        />
                        {attachedFiles.length > 0 && (
                            <span
                                style={{
                                    marginLeft: "10px",
                                    fontSize: "11.5px",
                                    color: "#555"
                                }}
                            >
                                {attachedFiles.join(", ")}
                            </span>
                        )}
                    </div>

                    <div className="rr-right-save-view">
                        <button
                            type="button"
                            className="rr-btn-save"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            <FaSave size={11} /> {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            className="rr-btn-view"
                            onClick={() => setMode("list")}
                        >
                            <FaEye size={11} /> View
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================
    // RENDER: LIST VIEW
    // =========================================================
    const emptyRowCount = Math.max(0, 14 - filteredRecords.length);

    return (
        <div className="rr-page">
            <h1 className="rr-page-title">Rejection Return</h1>

            {/* Top Supplier Filter & + Display From GRN Button */}
            <div className="rr-list-top-row">
                <div className="rr-supplier-filter-block">
                    <label className="rr-field-label">Supplier</label>
                    <input
                        type="text"
                        className="rr-search-input"
                        placeholder="Customer Search..."
                        list="rr-list-supplier-options"
                        value={supplierSearch}
                        onChange={(e) => setSupplierSearch(e.target.value)}
                    />
                    <datalist id="rr-list-supplier-options">
                        {suppliers.map((s, idx) => (
                            <option key={idx} value={s} />
                        ))}
                    </datalist>
                </div>

                <button
                    type="button"
                    className="rr-btn-display-grn"
                    onClick={handleOpenDisplayFromGrn}
                >
                    <FaPlus size={10} /> Display From GRN
                </button>
            </div>

            {/* Sub-Toolbar Row */}
            <div className="rr-toolbar-row">
                <div className="rr-toolbar-left">
                    <div className="rr-icon-group">
                        <button
                            type="button"
                            className="rr-icon-btn"
                            title="Refresh"
                            onClick={() => fetchRecords(supplierSearch)}
                        >
                            <FaSyncAlt />
                        </button>
                        <button
                            type="button"
                            className="rr-icon-btn"
                            title="List Summary"
                            onClick={() => fetchRecords(supplierSearch)}
                        >
                            <FaListUl />
                        </button>
                        <button
                            type="button"
                            className="rr-icon-btn"
                            title="Settings"
                            onClick={() => {}}
                        >
                            <FaCog />
                        </button>
                    </div>

                    <div className="rr-filter-split-group">
                        <button
                            type="button"
                            className="rr-filter-main-btn"
                            onClick={() => setShowFilterDrawer((prev) => !prev)}
                        >
                            <FaFilter size={10} /> Filter
                        </button>
                        <button
                            type="button"
                            className="rr-filter-caret-btn"
                            onClick={() => setShowFilterDrawer((prev) => !prev)}
                        >
                            <FaCaretDown size={10} />
                        </button>
                    </div>
                </div>

                <div className="rr-bulk-action-wrap" ref={bulkWrapRef}>
                    <button
                        type="button"
                        className="rr-bulk-action-btn"
                        onClick={() => setShowBulkMenu((prev) => !prev)}
                    >
                        <FaListUl size={11} className="rr-bulk-icon" />
                        <span>Bulk Action</span>
                        <FaCaretDown size={10} />
                    </button>
                    {showBulkMenu && (
                        <div className="rr-bulk-menu">
                            <div className="rr-bulk-menu-item" onClick={handleBulkDelete}>
                                Delete Selected
                            </div>
                            <div
                                className="rr-bulk-menu-item"
                                onClick={() => {
                                    setShowBulkMenu(false);
                                    window.print();
                                }}
                            >
                                Print Selected
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Optional Filter Drawer */}
            {showFilterDrawer && (
                <div className="rr-filter-drawer">
                    <div className="rr-supplier-filter-block">
                        <label className="rr-field-label">Return No</label>
                        <input
                            type="text"
                            className="rr-search-input"
                            placeholder="Search Return No..."
                            value={filterReturnNo}
                            onChange={(e) => setFilterReturnNo(e.target.value)}
                        />
                    </div>
                    <div className="rr-supplier-filter-block">
                        <label className="rr-field-label">From Date</label>
                        <input
                            type="date"
                            className="rr-search-input"
                            value={filterDateFrom}
                            onChange={(e) => setFilterDateFrom(e.target.value)}
                        />
                    </div>
                    <div className="rr-supplier-filter-block">
                        <label className="rr-field-label">To Date</label>
                        <input
                            type="date"
                            className="rr-search-input"
                            value={filterDateTo}
                            onChange={(e) => setFilterDateTo(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        className="rr-btn-display"
                        onClick={() => {
                            setFilterReturnNo("");
                            setFilterDateFrom("");
                            setFilterDateTo("");
                            setSupplierSearch("");
                        }}
                    >
                        Reset
                    </button>
                </div>
            )}

            {/* 16-Column Rejection Return Grid */}
            <div className="rr-table-wrap">
                <table className="rr-list-table">
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Return No</th>
                            <th>Currency</th>
                            <th>Exchange Rate</th>
                            <th>Remark</th>
                            <th>Memo for internal use</th>
                            <th>Entered By</th>
                            <th>Entered On</th>
                            <th>Updated By</th>
                            <th>Updated On</th>
                            <th>Rejection No</th>
                            <th>Date</th>
                            <th>Supplier</th>
                            <th>Qty</th>
                            <th>No. of rows</th>
                            <th>
                                <input
                                    type="checkbox"
                                    className="rr-header-check"
                                    checked={
                                        filteredRecords.length > 0 &&
                                        selectedRowIds.length === filteredRecords.length
                                    }
                                    onChange={(e) => toggleAllRows(e.target.checked)}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.map((rec) => (
                            <tr key={rec.RejectionReturnID}>
                                <td style={{ textAlign: "center" }}>
                                    <div className="rr-action-wrap" ref={actionWrapRef}>
                                        <button
                                            type="button"
                                            className="rr-action-btn"
                                            onClick={() =>
                                                setOpenActionRowId(
                                                    openActionRowId === rec.RejectionReturnID
                                                        ? null
                                                        : rec.RejectionReturnID
                                                )
                                            }
                                        >
                                            Action <FaCaretDown size={9} />
                                        </button>
                                        {openActionRowId === rec.RejectionReturnID && (
                                            <div className="rr-action-dropdown">
                                                <div
                                                    className="rr-action-item"
                                                    onClick={() => handleEditRecord(rec)}
                                                >
                                                    <FaEye size={11} color="#337ab7" /> View / Edit
                                                </div>
                                                <div
                                                    className="rr-action-item"
                                                    onClick={() => {
                                                        setOpenActionRowId(null);
                                                        window.print();
                                                    }}
                                                >
                                                    <FaPrint size={11} color="#555" /> Print
                                                </div>
                                                <div
                                                    className="rr-action-item"
                                                    onClick={() => handleDeleteRecord(rec)}
                                                >
                                                    <FaTrash size={11} color="#d9534f" /> Delete
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td>{rec.ReturnNo}</td>
                                <td style={{ textAlign: "center" }}>{rec.Currency || "INR"}</td>
                                <td style={{ textAlign: "right" }}>
                                    {Number(rec.ExchangeRate || 1).toFixed(2)}
                                </td>
                                <td>{rec.Remark}</td>
                                <td>{rec.InternalMemo}</td>
                                <td>{rec.EnteredBy}</td>
                                <td>{rec.EnteredOn}</td>
                                <td>{rec.UpdatedBy}</td>
                                <td>{rec.UpdatedOn}</td>
                                <td>{rec.RejectionNo}</td>
                                <td>{rec.ReturnDate}</td>
                                <td>{rec.SupplierName}</td>
                                <td style={{ textAlign: "right" }}>
                                    {Number(rec.TotalQty || 0)}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    {rec.NoOfRows || 1}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedRowIds.includes(
                                            rec.RejectionReturnID
                                        )}
                                        onChange={() =>
                                            toggleRowSelection(rec.RejectionReturnID)
                                        }
                                    />
                                </td>
                            </tr>
                        ))}

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
