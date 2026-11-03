import React, { useState, useEffect, useMemo, useRef } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import {
    FaPlus,
    FaSyncAlt,
    FaBars,
    FaCog,
    FaFilter,
    FaCaretDown,
    FaEye,
    FaEdit,
    FaTrash,
    FaPrint,
    FaTimes,
    FaCheck,
    FaListUl,
    FaCalendarAlt,
    FaSave,
    FaPaperclip,
    FaSearch,
    FaCheckSquare,
    FaSquare,
    FaFileExcel,
    FaDownload
} from "react-icons/fa";
import {
    getItemRequisitions,
    createItemRequisition,
    updateItemRequisition,
    deleteItemRequisition,
    INITIAL_ITEM_REQUISITIONS
} from "../../../services/itemRequisitionService";
import "../../../styles/itemRequisition.css";

// -----------------------------------------------------------------------------
// MASTER LOOKUP CATALOGS (Matching TPCS Fashion Enterprise ERP)
// -----------------------------------------------------------------------------
const STORES_LIST = [
    "RAW MATERIAL STORE 9B",
    "SEMI FINISH STORE 9B",
    "STORE 30",
    "FINISHED GOODS STORE",
    "SEMI FINISH STORE 18",
    "SAMPLE DEVELOPMENT STORE"
];

const DEPARTMENTS_LIST = [
    "BAG SAMPLING",
    "Cutting Dept",
    "Stitching Floor",
    "Finishing Dept",
    "Packaging",
    "Sampling Dept",
    "Quality Control",
    "Stores / Inward"
];

const SHIFT_OPTIONS = ["Shift I", "Shift II", "Shift III", "General"];
const REQ_TYPES = ["Production", "Sampling", "General", "Jobwork"];
const PREFIX_OPTIONS = [
    "IRN/APP/9B/2627/",
    "IRN/APP/18/2627/",
    "IRN/APP/30/2627/",
    "IRN/GEN/9B/2627/"
];

const MASTER_IOS = [
    {
        IoNo: "IO/9B/2627/35",
        Customer: "Michael Kors USA",
        CustomerOrderNo: "PO-MK-88219",
        Season: "AW26",
        TotalQty: 1250,
        DeliveryDate: "20-11-2026",
        Stage: "Sampling"
    },
    {
        IoNo: "IO/9B/2627/168",
        Customer: "Tory Burch LLC",
        CustomerOrderNo: "TB-ORD-2026-991",
        Season: "SS27",
        TotalQty: 3400,
        DeliveryDate: "15-12-2026",
        Stage: "Bulk Production"
    },
    {
        IoNo: "IO/9B/2627/172",
        Customer: "Coach New York",
        CustomerOrderNo: "COACH-NY-7712",
        Season: "AW26",
        TotalQty: 2100,
        DeliveryDate: "28-11-2026",
        Stage: "Bulk Production"
    },
    {
        IoNo: "IO/9B/2627/180",
        Customer: "Kate Spade NYC",
        CustomerOrderNo: "KS-BAG-4410",
        Season: "AW26",
        TotalQty: 850,
        DeliveryDate: "10-12-2026",
        Stage: "Sampling"
    },
    {
        IoNo: "IO/9B/2627/185",
        Customer: "Tommy Hilfiger Europe",
        CustomerOrderNo: "TH-EUR-5509",
        Season: "SS27",
        TotalQty: 1800,
        DeliveryDate: "05-01-2027",
        Stage: "Bulk Production"
    }
];

const MASTER_ITEMS = [
    {
        ItemCode: "HDW-6830",
        ItemName: "BRITTEN HASP 12.4MM HT-6830",
        Variant: "57-14K GOLD",
        SizeRange: "12.4mm",
        Color: "57-14K GOLD",
        UOM: "PCS",
        Rate: 45.0
    },
    {
        ItemCode: "CHN-6582",
        ItemName: "METAL CHAIN 9.2MM OVAL LINK 2.5MMGG HT-6582",
        Variant: "57-14K GOLD",
        SizeRange: "138cm",
        Color: "57-14K GOLD",
        UOM: "PCS",
        Rate: 125.0
    },
    {
        ItemCode: "PLR-3953",
        ItemName: "PULLER METAL NO.3 TBH-3953",
        Variant: "57-14K GOLD",
        SizeRange: "No. 3",
        Color: "57-14K GOLD",
        UOM: "PCS",
        Rate: 18.0
    },
    {
        ItemCode: "STP-03SG",
        ItemName: "YKK BOTTOM STOPPER NO.3 03 SG BAH1 JMA",
        Variant: "#57-14K GOLD -C722",
        SizeRange: "No. 3",
        Color: "#57-14K GOLD -C722",
        UOM: "PCS",
        Rate: 15.0
    },
    {
        ItemCode: "LTH-1093",
        ItemName: "COW CULATTAS SINGLE LEATHER",
        Variant: "REGULAR",
        SizeRange: "Standard",
        Color: "BLACK",
        UOM: "SQFT",
        Rate: 165.0
    },
    {
        ItemCode: "LTH-1112",
        ItemName: "COW ECO VEG SIDE CRUST LEATHER",
        Variant: "NATURAL GRAIN",
        SizeRange: "Standard",
        Color: "TAN",
        UOM: "SQFT",
        Rate: 180.0
    },
    {
        ItemCode: "HDW-2236",
        ItemName: "JAM RIVET SINGLE HEAD 7MM",
        Variant: "NICKEL FREE",
        SizeRange: "7mm",
        Color: "ANTIQUE BRASS",
        UOM: "SET",
        Rate: 2.2
    },
    {
        ItemCode: "RNF-1085",
        ItemName: "HIGH DENSITY TOPLINER 0.4MM",
        Variant: "ECO RESIN",
        SizeRange: "0.4mm",
        Color: "BLACK",
        UOM: "MTR",
        Rate: 85.0
    },
    {
        ItemCode: "TRM-3012",
        ItemName: "NYLON ZIPPER #5 OPEN END 65CM",
        Variant: "WATER REPELLENT",
        SizeRange: "65cm",
        Color: "NAVY",
        UOM: "PCS",
        Rate: 24.0
    },
    {
        ItemCode: "THD-1020",
        ItemName: "POLY-CORE SEWING THREAD 40/2",
        Variant: "BONDED",
        SizeRange: "40/2",
        Color: "NAVY",
        UOM: "SPOOL",
        Rate: 35.0
    }
];

export default function ItemRequisitions() {
    // -------------------------------------------------------------------------
    // VIEW STATE ("list" matches Screenshot 1, "form" matches Screenshot 2 & 3)
    // -------------------------------------------------------------------------
    const [viewMode, setViewMode] = useState("list"); // "list" | "form"
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeEditId, setActiveEditId] = useState(null);

    // Records & Loading
    const [records, setRecords] = useState(INITIAL_ITEM_REQUISITIONS);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);

    // List Page Controls (Screenshot 1)
    const [searchSupplier, setSearchSupplier] = useState("");
    const [selectedRowId, setSelectedRowId] = useState(1);
    const [selectedCheckboxIds, setSelectedCheckboxIds] = useState([]);
    const [openActionId, setOpenActionId] = useState(null);
    const [showFilterBar, setShowFilterBar] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const [showBulkMenu, setShowBulkMenu] = useState(false);

    // Filter drawer state
    const [filterDepartment, setFilterDepartment] = useState("All");
    const [filterStore, setFilterStore] = useState("All");
    const [filterShift, setFilterShift] = useState("All");
    const [filterReqType, setFilterReqType] = useState("All");

    // Action menu ref
    const actionMenuRef = useRef(null);
    const bulkMenuRef = useRef(null);

    // -------------------------------------------------------------------------
    // FORM STATE (Screenshots 2 & 3)
    // -------------------------------------------------------------------------
    const getNextReqNumber = () => {
        const nums = records.map((r) => {
            const m = String(r.ReqNo || "").match(/(\d+)$/);
            return m ? parseInt(m[1], 10) : 2500;
        });
        const maxNum = nums.length > 0 ? Math.max(...nums) : 2501;
        return maxNum + 1;
    };

    const [formHeader, setFormHeader] = useState({
        ReqType: "Production",
        Shift: "Shift I",
        Prefix: "IRN/APP/9B/2627/",
        ReqNumber: "2501",
        Date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        Stores: "RAW MATERIAL STORE 9B",
        ReceivedBy: "",
        ApprovedBy: "",
        Department: "BAG SAMPLING",
        Supplier: "Apex Leather Works",
        Currency: "INR",
        ExchangeRate: 1.00,
        Remark: "",
        InternalMemo: ""
    });

    const [lineItems, setLineItems] = useState([
        {
            id: 1,
            IoNo: "IO/9B/2627/35",
            ItemCode: "HDW-6830",
            ItemName: "BRITTEN HASP 12.4MM HT-6830",
            Variant: "57-14K GOLD",
            SizeRange: "12.4mm",
            Color: "57-14K GOLD",
            Quantity: 15.0,
            UOM: "PCS",
            RequiredDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
            Rate: 45.0,
            Amount: 675.0,
            Remarks: "Flap closure assembly"
        }
    ]);

    // -------------------------------------------------------------------------
    // MODALS STATE
    // -------------------------------------------------------------------------
    // IO Lookup Modal
    const [showIoModal, setShowIoModal] = useState(false);
    const [ioModalTargetRowIndex, setIoModalTargetRowIndex] = useState(null);
    const [ioSearchText, setIoSearchText] = useState("");
    const [ioCustomerFilter, setIoCustomerFilter] = useState("All");
    const [ioSeasonFilter, setIoSeasonFilter] = useState("All");

    // Item Typeahead / Suggestions Modal or Popup
    const [activeItemSuggestRow, setActiveItemSuggestRow] = useState(null);

    // Attachments Modal
    const [showAttachModal, setShowAttachModal] = useState(false);
    const [attachments, setAttachments] = useState([
        { name: "IRN_Tech_Spec_Rev2.pdf", size: "142 KB", uploadDate: "03-11-2026" },
        { name: "Material_Swatch_Gold_Plate.png", size: "380 KB", uploadDate: "03-11-2026" }
    ]);
    const [newAttachmentName, setNewAttachmentName] = useState("");

    // Settings Modal (Gear icon next to Req No)
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [settingsConfig, setSettingsConfig] = useState({
        seriesPrefix: "IRN/APP/9B/2627/",
        startNumber: "2501",
        autoIncrement: true,
        allowManualNumber: true
    });

    // -------------------------------------------------------------------------
    // LOAD DATA FROM BACKEND
    // -------------------------------------------------------------------------
    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getItemRequisitions({
                supplier: searchSupplier,
                department: filterDepartment,
                warehouse: filterStore,
                shift: filterShift
            });
            if (Array.isArray(data) && data.length > 0) {
                setRecords(data);
            }
        } catch (e) {
            console.warn("Using local item requisitions fallback:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Close action popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
                setOpenActionId(null);
            }
            if (bulkMenuRef.current && !bulkMenuRef.current.contains(e.target)) {
                setShowBulkMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // -------------------------------------------------------------------------
    // FILTERED RECORDS (LIST VIEW)
    // -------------------------------------------------------------------------
    const filteredRecords = useMemo(() => {
        return records.filter((item) => {
            if (searchSupplier.trim()) {
                const term = searchSupplier.trim().toLowerCase();
                const matchSupplier = String(item.Supplier || item.Associate || "").toLowerCase().includes(term);
                const matchReqNo = String(item.ReqNo || "").toLowerCase().includes(term);
                const matchDept = String(item.Department || "").toLowerCase().includes(term);
                const matchStore = String(item.StoreName || item.Warehouse || "").toLowerCase().includes(term);
                const matchIssuedBy = String(item.IssuedBy || "").toLowerCase().includes(term);
                if (!matchSupplier && !matchReqNo && !matchDept && !matchStore && !matchIssuedBy) {
                    return false;
                }
            }

            if (filterDepartment !== "All" && item.Department !== filterDepartment) {
                return false;
            }

            if (filterStore !== "All" && (item.StoreName !== filterStore && item.Warehouse !== filterStore)) {
                return false;
            }

            if (filterShift !== "All" && item.Shift !== filterShift) {
                return false;
            }

            if (filterReqType !== "All" && item.ReqType !== filterReqType) {
                return false;
            }

            return true;
        });
    }, [records, searchSupplier, filterDepartment, filterStore, filterShift, filterReqType]);

    // Checkbox selection in list
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedCheckboxIds(filteredRecords.map((r) => r.RequisitionID || r.ReqNo));
        } else {
            setSelectedCheckboxIds([]);
        }
    };

    const handleRowCheckbox = (id) => {
        setSelectedCheckboxIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // -------------------------------------------------------------------------
    // CREATE / EDIT ACTIONS
    // -------------------------------------------------------------------------
    const handleOpenCreateForm = () => {
        const nextNum = String(getNextReqNumber());
        setFormHeader({
            ReqType: "Production",
            Shift: "Shift I",
            Prefix: "IRN/APP/9B/2627/",
            ReqNumber: nextNum,
            Date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
            Stores: "RAW MATERIAL STORE 9B",
            ReceivedBy: "",
            ApprovedBy: "",
            Department: "BAG SAMPLING",
            Supplier: "Apex Leather Works",
            Currency: "INR",
            ExchangeRate: 1.00,
            Remark: "",
            InternalMemo: ""
        });
        setLineItems([
            {
                id: 1,
                IoNo: "IO/9B/2627/35",
                ItemCode: "HDW-6830",
                ItemName: "BRITTEN HASP 12.4MM HT-6830",
                Variant: "57-14K GOLD",
                SizeRange: "12.4mm",
                Color: "57-14K GOLD",
                Quantity: 15.0,
                UOM: "PCS",
                RequiredDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
                Rate: 45.0,
                Amount: 675.0,
                Remarks: ""
            }
        ]);
        setIsEditMode(false);
        setActiveEditId(null);
        setViewMode("form");
    };

    const handleOpenEditForm = (rec) => {
        const fullReqNo = rec.ReqNo || "";
        let prefix = "IRN/APP/9B/2627/";
        let num = "2501";
        const matched = fullReqNo.match(/^(.*\/)(\d+)$/);
        if (matched) {
            prefix = matched[1];
            num = matched[2];
        }

        setFormHeader({
            ReqType: rec.ReqType || "Production",
            Shift: rec.Shift || "Shift I",
            Prefix: prefix,
            ReqNumber: num,
            Date: rec.Date || rec.ReqDate || new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
            Stores: rec.StoreName || rec.Stores || rec.Warehouse || "RAW MATERIAL STORE 9B",
            ReceivedBy: rec.ReceivedBy || "",
            ApprovedBy: rec.ApprovedBy || "",
            Department: rec.Department || "BAG SAMPLING",
            Supplier: rec.Supplier || rec.Associate || "Apex Leather Works",
            Currency: rec.Currency || "INR",
            ExchangeRate: rec.ExchangeRate || 1.00,
            Remark: rec.Remark || "",
            InternalMemo: rec.InternalMemo || ""
        });

        const details = (rec.details && rec.details.length > 0)
            ? rec.details.map((d, idx) => ({
                id: idx + 1,
                IoNo: d.IoNo || "IO/9B/2627/35",
                ItemCode: d.ItemCode || "",
                ItemName: d.ItemName || "",
                Variant: d.Variant || "",
                SizeRange: d.SizeRange || "",
                Color: d.Color || "",
                Quantity: Number(d.Quantity) || 1,
                UOM: d.UOM || "PCS",
                RequiredDate: d.RequiredDate || rec.Date || "",
                Rate: Number(d.Rate) || 0,
                Amount: Number(d.Amount) || (Number(d.Quantity || 0) * Number(d.Rate || 0)),
                Remarks: d.Remarks || ""
            }))
            : [
                {
                    id: 1,
                    IoNo: "IO/9B/2627/35",
                    ItemCode: "HDW-6830",
                    ItemName: "BRITTEN HASP 12.4MM HT-6830",
                    Variant: "57-14K GOLD",
                    SizeRange: "12.4mm",
                    Color: "57-14K GOLD",
                    Quantity: Number(rec.Qty || 1),
                    UOM: "PCS",
                    RequiredDate: rec.Date || "",
                    Rate: 45.0,
                    Amount: 45.0 * Number(rec.Qty || 1),
                    Remarks: ""
                }
            ];

        setLineItems(details);
        setIsEditMode(true);
        setActiveEditId(rec.RequisitionID);
        setOpenActionId(null);
        setViewMode("form");
    };

    // -------------------------------------------------------------------------
    // LINE ITEM ACTIONS (Form)
    // -------------------------------------------------------------------------
    const handleAddAnotherLine = () => {
        const nextId = lineItems.length > 0 ? Math.max(...lineItems.map((l) => l.id)) + 1 : 1;
        setLineItems((prev) => [
            ...prev,
            {
                id: nextId,
                IoNo: prev.length > 0 ? prev[prev.length - 1].IoNo : "IO/9B/2627/35",
                ItemCode: "",
                ItemName: "",
                Variant: "",
                SizeRange: "",
                Color: "",
                Quantity: 1,
                UOM: "PCS",
                RequiredDate: formHeader.Date,
                Rate: 0,
                Amount: 0,
                Remarks: ""
            }
        ]);
    };

    const handleDeleteLine = (rowId) => {
        if (lineItems.length <= 1) {
            alert("A requisition note must have at least one line item.");
            return;
        }
        setLineItems((prev) => prev.filter((item) => item.id !== rowId));
    };

    const handleLineChange = (rowId, field, value) => {
        setLineItems((prev) =>
            prev.map((item) => {
                if (item.id === rowId) {
                    const updated = { ...item, [field]: value };
                    if (field === "Quantity" || field === "Rate") {
                        const q = field === "Quantity" ? Number(value) || 0 : Number(item.Quantity) || 0;
                        const r = field === "Rate" ? Number(value) || 0 : Number(item.Rate) || 0;
                        updated.Amount = +(q * r).toFixed(2);
                    }
                    return updated;
                }
                return item;
            })
        );
    };

    // -------------------------------------------------------------------------
    // IO LOOKUP MODAL ACTIONS
    // -------------------------------------------------------------------------
    const handleOpenIoModal = (index) => {
        setIoModalTargetRowIndex(index);
        setShowIoModal(true);
    };

    const handleSelectIo = (io) => {
        if (ioModalTargetRowIndex !== null && lineItems[ioModalTargetRowIndex]) {
            const targetId = lineItems[ioModalTargetRowIndex].id;
            handleLineChange(targetId, "IoNo", io.IoNo);
        }
        setShowIoModal(false);
    };

    const filteredIos = useMemo(() => {
        return MASTER_IOS.filter((io) => {
            if (ioSearchText.trim()) {
                const term = ioSearchText.toLowerCase();
                const matchNo = io.IoNo.toLowerCase().includes(term);
                const matchCust = io.Customer.toLowerCase().includes(term);
                const matchOrder = io.CustomerOrderNo.toLowerCase().includes(term);
                const matchSeason = io.Season.toLowerCase().includes(term);
                if (!matchNo && !matchCust && !matchOrder && !matchSeason) return false;
            }
            if (ioCustomerFilter !== "All" && io.Customer !== ioCustomerFilter) return false;
            if (ioSeasonFilter !== "All" && io.Season !== ioSeasonFilter) return false;
            return true;
        });
    }, [ioSearchText, ioCustomerFilter, ioSeasonFilter]);

    // -------------------------------------------------------------------------
    // ITEM AUTO-COMPLETE / CATALOG PICKER
    // -------------------------------------------------------------------------
    const handleSelectItemFromCatalog = (rowId, catItem) => {
        setLineItems((prev) =>
            prev.map((item) => {
                if (item.id === rowId) {
                    const qty = Number(item.Quantity) || 1;
                    return {
                        ...item,
                        ItemCode: catItem.ItemCode,
                        ItemName: catItem.ItemName,
                        Variant: catItem.Variant,
                        SizeRange: catItem.SizeRange,
                        Color: catItem.Color,
                        UOM: catItem.UOM,
                        Rate: catItem.Rate,
                        Amount: +(qty * catItem.Rate).toFixed(2)
                    };
                }
                return item;
            })
        );
        setActiveItemSuggestRow(null);
    };

    // -------------------------------------------------------------------------
    // SAVE REQUISITION NOTE
    // -------------------------------------------------------------------------
    const handleSaveRequisition = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        const fullReqNo = `${formHeader.Prefix}${formHeader.ReqNumber}`;
        const totalQty = lineItems.reduce((acc, it) => acc + (Number(it.Quantity) || 0), 0);

        const payload = {
            ReqNo: fullReqNo,
            ReqType: formHeader.ReqType,
            Shift: formHeader.Shift,
            Date: formHeader.Date,
            ReqDate: formHeader.Date,
            Stores: formHeader.Stores,
            StoreName: formHeader.Stores,
            ReceivedBy: formHeader.ReceivedBy,
            ApprovedBy: formHeader.ApprovedBy,
            Department: formHeader.Department,
            Supplier: formHeader.Supplier,
            Associate: formHeader.Supplier,
            Currency: formHeader.Currency,
            ExchangeRate: formHeader.ExchangeRate,
            Remark: formHeader.Remark,
            InternalMemo: formHeader.InternalMemo,
            Qty: totalQty,
            TotalQty: totalQty,
            RowCount: lineItems.length,
            details: lineItems
        };

        try {
            if (isEditMode && activeEditId) {
                await updateItemRequisition(activeEditId, payload);
                setRecords((prev) =>
                    prev.map((r) =>
                        r.RequisitionID === activeEditId ? { ...r, ...payload } : r
                    )
                );
                setAlertMessage(`Requisition Note ${fullReqNo} updated successfully.`);
            } else {
                const res = await createItemRequisition(payload);
                const newRec = {
                    ...payload,
                    RequisitionID: res.data && res.data.RequisitionID ? res.data.RequisitionID : Date.now()
                };
                setRecords((prev) => [newRec, ...prev]);
                setAlertMessage(`Item Requisition Note ${fullReqNo} created successfully.`);
            }
        } catch (err) {
            console.error("Save error:", err);
            setAlertMessage(`Saved locally: ${fullReqNo}`);
        }

        setTimeout(() => setAlertMessage(null), 4000);
        setViewMode("list");
    };

    // Delete Requisition
    const handleDeleteRecord = async (recId) => {
        if (!window.confirm("Are you sure you want to delete this Item Requisition Note?")) return;
        try {
            await deleteItemRequisition(recId);
            setRecords((prev) => prev.filter((r) => r.RequisitionID !== recId));
            setAlertMessage("Item Requisition Note deleted.");
        } catch (e) {
            console.warn("Delete fallback:", e);
            setRecords((prev) => prev.filter((r) => r.RequisitionID !== recId));
        }
        setOpenActionId(null);
        setTimeout(() => setAlertMessage(null), 3000);
    };

    // -------------------------------------------------------------------------
    // PRINT FUNCTIONALITY
    // -------------------------------------------------------------------------
    const handlePrintRecord = (rec) => {
        const printWindow = window.open("", "_blank", "width=920,height=720");
        const items = rec.details || lineItems;
        const totalQty = items.reduce((s, it) => s + (Number(it.Quantity) || 0), 0);

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Item Requisition Note - ${rec.ReqNo}</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 25px; color: #1e293b; }
                        .header-box { display: flex; justify-content: space-between; border-bottom: 2px solid #1e70ba; padding-bottom: 12px; margin-bottom: 18px; }
                        .brand-title { font-size: 22px; font-weight: 700; color: #1e70ba; }
                        .doc-heading { font-size: 16px; font-weight: 600; text-transform: uppercase; color: #0f172a; margin-top: 4px; }
                        .unit-sub { font-size: 12px; color: #64748b; }
                        .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px 16px; margin-bottom: 20px; font-size: 12px; }
                        .meta-col { display: flex; flex-direction: column; }
                        .meta-lbl { font-weight: 600; color: #475569; font-size: 11px; text-transform: uppercase; }
                        .meta-val { font-weight: 500; color: #0f172a; margin-top: 2px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11.5px; }
                        th { background-color: #1e70ba; color: #ffffff; padding: 7px 10px; border: 1px solid #165b97; text-align: left; }
                        td { padding: 6px 10px; border: 1px solid #cbd5e1; vertical-align: middle; }
                        .th-r, .td-r { text-align: right; }
                        .tot-row { background-color: #f8fafc; font-weight: bold; }
                        .footer-notes { margin-top: 25px; padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; font-size: 11.5px; }
                        .signatures { margin-top: 55px; display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; padding: 0 20px; }
                    </style>
                </head>
                <body>
                    <div class="header-box">
                        <div>
                            <div class="brand-title">TPCS Fashion</div>
                            <div class="doc-heading">Item Requisition Note</div>
                        </div>
                        <div style="text-align: right;">
                            <div class="unit-sub">Plot No. 9B | FY 01-Apr-2026 - 31-Mar-2027</div>
                            <div style="font-size: 14px; font-weight: 700; color: #1e70ba; margin-top: 4px;">${rec.ReqNo}</div>
                        </div>
                    </div>

                    <div class="meta-grid">
                        <div class="meta-col"><span class="meta-lbl">Req Type</span><span class="meta-val">${rec.ReqType || "Production"}</span></div>
                        <div class="meta-col"><span class="meta-lbl">Shift</span><span class="meta-val">${rec.Shift || "Shift I"}</span></div>
                        <div class="meta-col"><span class="meta-lbl">Date</span><span class="meta-val">${rec.Date || rec.ReqDate || "-"}</span></div>
                        <div class="meta-col"><span class="meta-lbl">Stores / Warehouse</span><span class="meta-val">${rec.StoreName || rec.Stores || rec.Warehouse || "-"}</span></div>
                        <div class="meta-col"><span class="meta-lbl">Department</span><span class="meta-val">${rec.Department || "-"}</span></div>
                        <div class="meta-col"><span class="meta-lbl">Supplier</span><span class="meta-val">${rec.Supplier || rec.Associate || "-"}</span></div>
                        <div class="meta-col"><span class="meta-lbl">Received By</span><span class="meta-val">${rec.ReceivedBy || "-"}</span></div>
                        <div class="meta-col"><span class="meta-lbl">Approved By</span><span class="meta-val">${rec.ApprovedBy || "-"}</span></div>
                        <div class="meta-col"><span class="meta-lbl">Currency / Rate</span><span class="meta-val">${rec.Currency || "INR"} (Ex: ${rec.ExchangeRate || 1.00})</span></div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th style="width: 30px;">#</th>
                                <th>IO No.</th>
                                <th>Item Code</th>
                                <th>Item Description</th>
                                <th>Variant</th>
                                <th>Size Range</th>
                                <th class="th-r">Qty</th>
                                <th>UOM</th>
                                <th class="th-r">Rate</th>
                                <th class="th-r">Amount</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map((it, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${it.IoNo || "-"}</td>
                                    <td>${it.ItemCode || "-"}</td>
                                    <td><strong>${it.ItemName || "-"}</strong></td>
                                    <td>${it.Variant || "-"}</td>
                                    <td>${it.SizeRange || "-"}</td>
                                    <td class="td-r">${Number(it.Quantity || 0).toFixed(2)}</td>
                                    <td>${it.UOM || "PCS"}</td>
                                    <td class="td-r">${Number(it.Rate || 0).toFixed(2)}</td>
                                    <td class="td-r">${Number(it.Amount || 0).toFixed(2)}</td>
                                    <td>${it.Remarks || "-"}</td>
                                </tr>
                            `).join("")}
                            <tr class="tot-row">
                                <td colspan="6" style="text-align: right;">Total Quantity:</td>
                                <td class="td-r">${Number(totalQty).toFixed(2)}</td>
                                <td colspan="4"></td>
                            </tr>
                        </tbody>
                    </table>

                    ${rec.Remark ? `<div class="footer-notes"><strong>Remark:</strong> ${rec.Remark}</div>` : ""}
                    ${rec.InternalMemo ? `<div class="footer-notes" style="margin-top: 6px;"><strong>Internal Memo:</strong> ${rec.InternalMemo}</div>` : ""}

                    <div class="signatures">
                        <div>Prepared By: _________________</div>
                        <div>Store In-Charge: _________________</div>
                        <div>Authorized Signatory: _________________</div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 350);
        setOpenActionId(null);
    };

    // Calculate empty rows in list view to maintain clean enterprise table height
    const emptyRowCount = Math.max(0, 10 - filteredRecords.length);

    // =========================================================================
    // RENDER
    // =========================================================================
    return (
        <div className="item-requisition-page">
            {/* ALERT NOTIFICATION */}
            {alertMessage && (
                <Alert variant="success" onClose={() => setAlertMessage(null)} dismissible className="py-2 mb-3">
                    {alertMessage}
                </Alert>
            )}

            {/* -----------------------------------------------------------------
                MODE 1: LIST VIEW (Screenshot 1)
               ----------------------------------------------------------------- */}
            {viewMode === "list" ? (
                <div>
                    {/* PAGE TITLE */}
                    <h1 className="ir-page-title">Item Requisition Note</h1>

                    {/* TOP SEARCH & NEW BUTTON ROW */}
                    <div className="ir-list-top-row">
                        <div className="ir-supplier-group">
                            <label className="ir-field-label">Supplier Name</label>
                            <input
                                type="text"
                                className="ir-supplier-input"
                                placeholder="Supplier Search..."
                                value={searchSupplier}
                                onChange={(e) => setSearchSupplier(e.target.value)}
                            />
                        </div>

                        <button
                            type="button"
                            className="ir-btn-new-requisition"
                            onClick={handleOpenCreateForm}
                        >
                            <FaPlus /> New Requisition Note
                        </button>
                    </div>

                    {/* TOOLBAR ROW (Icons + Filter Drawer + Pagination + Bulk Action) */}
                    <div className="ir-toolbar-row">
                        <div className="ir-toolbar-left">
                            <button
                                type="button"
                                className="ir-tool-btn"
                                title="Refresh"
                                onClick={loadData}
                            >
                                <FaSyncAlt />
                            </button>

                            <button
                                type="button"
                                className="ir-tool-btn"
                                title="List Density / Layout"
                                onClick={() => alert("Enterprise list view layout active.")}
                            >
                                <FaBars />
                            </button>

                            <button
                                type="button"
                                className="ir-tool-btn"
                                title="Columns Configuration"
                                onClick={() => setShowSettingsModal(true)}
                            >
                                <FaCog />
                            </button>

                            <button
                                type="button"
                                className={`ir-filter-toggle-btn ${showFilterBar ? "active" : ""}`}
                                onClick={() => setShowFilterBar((prev) => !prev)}
                            >
                                <FaFilter /> Filter <FaCaretDown />
                            </button>
                        </div>

                        <div className="ir-toolbar-right">
                            {/* Pagination Buttons (1, 2, 3, 4, 5, >, >>) */}
                            <div className="ir-pagination-group">
                                {[1, 2, 3, 4, 5].map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        type="button"
                                        className={`ir-page-pill ${activePage === pageNum ? "active" : ""}`}
                                        onClick={() => setActivePage(pageNum)}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    className="ir-page-pill"
                                    onClick={() => setActivePage((prev) => Math.min(5, prev + 1))}
                                >
                                    &gt;
                                </button>
                                <button
                                    type="button"
                                    className="ir-page-pill"
                                    onClick={() => setActivePage(5)}
                                >
                                    &gt;&gt;
                                </button>
                            </div>

                            {/* Bulk Action Dropdown */}
                            <div style={{ position: "relative" }} ref={bulkMenuRef}>
                                <button
                                    type="button"
                                    className="ir-bulk-dropdown-btn"
                                    onClick={() => setShowBulkMenu((prev) => !prev)}
                                >
                                    <FaCheckSquare /> Bulk Action <FaCaretDown />
                                </button>

                                {showBulkMenu && (
                                    <div className="ir-action-popover" style={{ right: 0, left: "auto", minWidth: "150px" }}>
                                        <div
                                            className="ir-action-item"
                                            onClick={() => {
                                                alert(`Exporting ${selectedCheckboxIds.length || filteredRecords.length} records to Excel.`);
                                                setShowBulkMenu(false);
                                            }}
                                        >
                                            <FaFileExcel color="#16a34a" /> Export Excel
                                        </div>
                                        <div
                                            className="ir-action-item"
                                            onClick={() => {
                                                if (selectedCheckboxIds.length === 0) {
                                                    alert("Please check at least one requisition row to print.");
                                                } else {
                                                    alert(`Printing ${selectedCheckboxIds.length} requisition notes batch.`);
                                                }
                                                setShowBulkMenu(false);
                                            }}
                                        >
                                            <FaPrint color="#2563eb" /> Print Selected
                                        </div>
                                        <div
                                            className="ir-action-item danger"
                                            onClick={() => {
                                                if (selectedCheckboxIds.length === 0) {
                                                    alert("Please check records to delete.");
                                                } else if (window.confirm(`Delete ${selectedCheckboxIds.length} records?`)) {
                                                    setRecords((prev) =>
                                                        prev.filter((r) => !selectedCheckboxIds.includes(r.RequisitionID || r.ReqNo))
                                                    );
                                                    setSelectedCheckboxIds([]);
                                                }
                                                setShowBulkMenu(false);
                                            }}
                                        >
                                            <FaTrash color="#ef4444" /> Delete Selected
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* EXPANDABLE FILTER DRAWER */}
                    {showFilterBar && (
                        <div className="ir-filter-drawer">
                            <div className="ir-filter-item">
                                <label className="ir-field-label">Department</label>
                                <select
                                    className="ir-filter-select"
                                    value={filterDepartment}
                                    onChange={(e) => setFilterDepartment(e.target.value)}
                                >
                                    <option value="All">All Departments</option>
                                    {DEPARTMENTS_LIST.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="ir-filter-item">
                                <label className="ir-field-label">Store Name</label>
                                <select
                                    className="ir-filter-select"
                                    value={filterStore}
                                    onChange={(e) => setFilterStore(e.target.value)}
                                >
                                    <option value="All">All Stores</option>
                                    {STORES_LIST.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="ir-filter-item">
                                <label className="ir-field-label">Shift</label>
                                <select
                                    className="ir-filter-select"
                                    value={filterShift}
                                    onChange={(e) => setFilterShift(e.target.value)}
                                >
                                    <option value="All">All Shifts</option>
                                    {SHIFT_OPTIONS.map((sh) => (
                                        <option key={sh} value={sh}>{sh}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="ir-filter-item">
                                <label className="ir-field-label">Req Type</label>
                                <select
                                    className="ir-filter-select"
                                    value={filterReqType}
                                    onChange={(e) => setFilterReqType(e.target.value)}
                                >
                                    <option value="All">All Types</option>
                                    {REQ_TYPES.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="button"
                                className="ir-filter-reset-btn"
                                onClick={() => {
                                    setFilterDepartment("All");
                                    setFilterStore("All");
                                    setFilterShift("All");
                                    setFilterReqType("All");
                                    setSearchSupplier("");
                                }}
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}

                    {/* DATA TABLE (13 Columns Exact Match to Screenshot 1) */}
                    <div className="ir-table-container">
                        <table className="ir-data-table">
                            <thead>
                                <tr>
                                    <th className="th-center" style={{ width: "75px" }}>Action</th>
                                    <th>Req No</th>
                                    <th>Shift</th>
                                    <th>Department</th>
                                    <th>Issued By</th>
                                    <th>Supplier</th>
                                    <th>Date</th>
                                    <th>Store Name</th>
                                    <th>Currency</th>
                                    <th className="th-right">Exchange Rate</th>
                                    <th className="th-right">Qty</th>
                                    <th className="th-center">No. of rows</th>
                                    <th className="th-center" style={{ width: "35px" }}>
                                        <input
                                            type="checkbox"
                                            checked={
                                                filteredRecords.length > 0 &&
                                                selectedCheckboxIds.length === filteredRecords.length
                                            }
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecords.map((item) => {
                                    const isRowSelected = selectedRowId === item.RequisitionID;
                                    const isMenuOpen = openActionId === item.RequisitionID;
                                    const isChecked = selectedCheckboxIds.includes(item.RequisitionID || item.ReqNo);

                                    return (
                                        <tr
                                            key={item.RequisitionID || item.ReqNo}
                                            className={isRowSelected ? "row-selected" : ""}
                                            onClick={() => setSelectedRowId(item.RequisitionID)}
                                        >
                                            {/* 1. Action */}
                                            <td className="ir-action-cell" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    type="button"
                                                    className="ir-action-select-btn"
                                                    onClick={() =>
                                                        setOpenActionId((prev) =>
                                                            prev === item.RequisitionID ? null : item.RequisitionID
                                                        )
                                                    }
                                                >
                                                    Select <FaCaretDown />
                                                </button>

                                                {isMenuOpen && (
                                                    <div className="ir-action-popover" ref={actionMenuRef}>
                                                        <div
                                                            className="ir-action-item"
                                                            onClick={() => handleOpenEditForm(item)}
                                                        >
                                                            <FaEye color="#1e70ba" /> View / Edit
                                                        </div>
                                                        <div
                                                            className="ir-action-item"
                                                            onClick={() => handlePrintRecord(item)}
                                                        >
                                                            <FaPrint color="#475569" /> Print
                                                        </div>
                                                        <div
                                                            className="ir-action-item danger"
                                                            onClick={() => handleDeleteRecord(item.RequisitionID)}
                                                        >
                                                            <FaTrash color="#ef4444" /> Delete
                                                        </div>
                                                    </div>
                                                )}
                                            </td>

                                            {/* 2. Req No */}
                                            <td style={{ fontWeight: 600, color: "#1b6ca8" }}>
                                                {item.ReqNo || "-"}
                                            </td>

                                            {/* 3. Shift */}
                                            <td>{item.Shift || "Shift I"}</td>

                                            {/* 4. Department */}
                                            <td>{item.Department || "-"}</td>

                                            {/* 5. Issued By */}
                                            <td>{item.IssuedBy || item.ReqBy || "-"}</td>

                                            {/* 6. Supplier */}
                                            <td>{item.Supplier || item.Associate || "-"}</td>

                                            {/* 7. Date */}
                                            <td>{item.Date || item.ReqDate || "-"}</td>

                                            {/* 8. Store Name */}
                                            <td>{item.StoreName || item.Stores || item.Warehouse || "RAW MATERIAL STORE 9B"}</td>

                                            {/* 9. Currency */}
                                            <td>{item.Currency || "INR"}</td>

                                            {/* 10. Exchange Rate */}
                                            <td className="td-right">
                                                {Number(item.ExchangeRate || 1.00).toFixed(2)}
                                            </td>

                                            {/* 11. Qty */}
                                            <td className="td-right" style={{ fontWeight: 600 }}>
                                                {Number(item.Qty || item.TotalQty || 0).toFixed(2)}
                                            </td>

                                            {/* 12. No. of rows */}
                                            <td className="td-center">
                                                {item.RowCount || (item.details ? item.details.length : 1)}
                                            </td>

                                            {/* 13. Checkbox */}
                                            <td className="td-center" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => handleRowCheckbox(item.RequisitionID || item.ReqNo)}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}

                                {/* Empty rows padding to match screenshot's full enterprise grid */}
                                {Array.from({ length: emptyRowCount }).map((_, idx) => (
                                    <tr key={`empty-${idx}`} className="empty-row">
                                        <td>&nbsp;</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* -----------------------------------------------------------------
                   MODE 2: CREATE / EDIT FORM VIEW (Screenshots 2 & 3)
                   ----------------------------------------------------------------- */
                <div className="ir-form-container">
                    {/* PAGE TITLE */}
                    <h1 className="ir-page-title">Item Requisition Note</h1>

                    {/* TOP HEADER FORM FIELDS (Screenshot 2) */}
                    <div className="ir-form-header-grid">
                        {/* 1. Req Type */}
                        <div className="ir-form-group">
                            <label className="ir-form-label">Req Type</label>
                            <select
                                className="ir-form-select"
                                value={formHeader.ReqType}
                                onChange={(e) => setFormHeader((prev) => ({ ...prev, ReqType: e.target.value }))}
                            >
                                {REQ_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        {/* 2. Shift */}
                        <div className="ir-form-group">
                            <label className="ir-form-label">Shift</label>
                            <select
                                className="ir-form-select"
                                value={formHeader.Shift}
                                onChange={(e) => setFormHeader((prev) => ({ ...prev, Shift: e.target.value }))}
                            >
                                {SHIFT_OPTIONS.map((sh) => (
                                    <option key={sh} value={sh}>{sh}</option>
                                ))}
                            </select>
                        </div>

                        {/* 3. Req No (Composite: Prefix dropdown + number input + gear icon) */}
                        <div className="ir-form-group">
                            <label className="ir-form-label">Req No</label>
                            <div className="ir-composite-reqno">
                                <select
                                    className="ir-reqno-prefix-select"
                                    value={formHeader.Prefix}
                                    onChange={(e) => setFormHeader((prev) => ({ ...prev, Prefix: e.target.value }))}
                                >
                                    {PREFIX_OPTIONS.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    className="ir-reqno-number-input"
                                    value={formHeader.ReqNumber}
                                    onChange={(e) => setFormHeader((prev) => ({ ...prev, ReqNumber: e.target.value }))}
                                />
                                <button
                                    type="button"
                                    className="ir-reqno-gear-btn"
                                    title="Series Configuration"
                                    onClick={() => setShowSettingsModal(true)}
                                >
                                    <FaCog />
                                </button>
                            </div>
                        </div>

                        {/* 4. Date (with red star * and calendar icon) */}
                        <div className="ir-form-group">
                            <label className="ir-form-label">
                                Date <span className="ir-required">*</span>
                            </label>
                            <div className="ir-date-group">
                                <input
                                    type="text"
                                    className="ir-date-input"
                                    value={formHeader.Date}
                                    onChange={(e) => setFormHeader((prev) => ({ ...prev, Date: e.target.value }))}
                                    placeholder="DD-MM-YYYY"
                                />
                                <button
                                    type="button"
                                    className="ir-date-cal-btn"
                                    onClick={() => {
                                        const now = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
                                        setFormHeader((prev) => ({ ...prev, Date: now }));
                                    }}
                                    title="Set Today's Date"
                                >
                                    <FaCalendarAlt />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* TAB BAR (Screenshot 2: [General]) */}
                    <div className="ir-tab-nav">
                        <button type="button" className="ir-tab-pill">
                            General
                        </button>
                    </div>

                    {/* GENERAL SECTION CARD (Screenshot 2) */}
                    <div className="ir-general-card">
                        {/* Row 1: Stores | Received By | Approved By */}
                        <div className="ir-general-row-1">
                            <div className="ir-form-group">
                                <label className="ir-form-label">Stores</label>
                                <input
                                    type="text"
                                    className="ir-form-input"
                                    placeholder="Type and select Stores"
                                    value={formHeader.Stores}
                                    onChange={(e) => setFormHeader((prev) => ({ ...prev, Stores: e.target.value }))}
                                    list="stores-datalist"
                                />
                                <datalist id="stores-datalist">
                                    {STORES_LIST.map((s) => (
                                        <option key={s} value={s} />
                                    ))}
                                </datalist>
                            </div>

                            <div className="ir-form-group">
                                <label className="ir-form-label">Received By</label>
                                <input
                                    type="text"
                                    className="ir-form-input"
                                    placeholder="Enter Received By"
                                    value={formHeader.ReceivedBy}
                                    onChange={(e) => setFormHeader((prev) => ({ ...prev, ReceivedBy: e.target.value }))}
                                />
                            </div>

                            <div className="ir-form-group">
                                <label className="ir-form-label">Approved By</label>
                                <input
                                    type="text"
                                    className="ir-form-input"
                                    placeholder="Enter Approved By"
                                    value={formHeader.ApprovedBy}
                                    onChange={(e) => setFormHeader((prev) => ({ ...prev, ApprovedBy: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Row 2: Department */}
                        <div className="ir-general-row-2">
                            <div className="ir-form-group">
                                <label className="ir-form-label">Department</label>
                                <input
                                    type="text"
                                    className="ir-form-input"
                                    placeholder="Type and select Department"
                                    value={formHeader.Department}
                                    onChange={(e) => setFormHeader((prev) => ({ ...prev, Department: e.target.value }))}
                                    list="dept-datalist"
                                />
                                <datalist id="dept-datalist">
                                    {DEPARTMENTS_LIST.map((d) => (
                                        <option key={d} value={d} />
                                    ))}
                                </datalist>
                            </div>
                        </div>
                    </div>

                    {/* LINE ITEMS GRID TABLE (Screenshot 2 & 3) */}
                    <div className="ir-line-items-container">
                        <table className="ir-line-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "160px" }}>IO No.</th>
                                    <th style={{ minWidth: "260px" }}>
                                        Item <span className="ir-required">*</span>
                                    </th>
                                    <th style={{ width: "160px" }}>Variant</th>
                                    <th style={{ width: "140px" }}>Size Range</th>
                                    <th style={{ width: "130px" }}>Color</th>
                                    <th style={{ width: "95px", textAlign: "right" }}>Req Qty</th>
                                    <th style={{ width: "80px" }}>UOM</th>
                                    <th style={{ width: "110px" }}>Required Date</th>
                                    <th style={{ width: "90px", textAlign: "right" }}>Rate</th>
                                    <th style={{ width: "95px", textAlign: "right" }}>Amount</th>
                                    <th style={{ minWidth: "160px" }}>Remarks</th>
                                    <th style={{ width: "40px", textAlign: "center" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {lineItems.map((row, idx) => (
                                    <tr key={row.id}>
                                        {/* 1. IO No. (with list icon button to open IO Lookup Modal) */}
                                        <td>
                                            <div className="ir-io-input-group">
                                                <input
                                                    type="text"
                                                    className="ir-io-input"
                                                    placeholder="IO No."
                                                    value={row.IoNo}
                                                    onChange={(e) => handleLineChange(row.id, "IoNo", e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    className="ir-io-lookup-btn"
                                                    title="Internal Order (IO) Lookup"
                                                    onClick={() => handleOpenIoModal(idx)}
                                                >
                                                    <FaListUl />
                                                </button>
                                            </div>
                                        </td>

                                        {/* 2. Item (Type and select Item with red *) */}
                                        <td style={{ position: "relative" }}>
                                            <input
                                                type="text"
                                                className="ir-cell-input"
                                                placeholder="Type and select Item"
                                                value={row.ItemName}
                                                onChange={(e) => {
                                                    handleLineChange(row.id, "ItemName", e.target.value);
                                                    setActiveItemSuggestRow(row.id);
                                                }}
                                                onFocus={() => setActiveItemSuggestRow(row.id)}
                                            />

                                            {/* Item quick search suggestion popup */}
                                            {activeItemSuggestRow === row.id && (
                                                <div
                                                    className="ir-action-popover"
                                                    style={{
                                                        top: "100%",
                                                        left: 0,
                                                        width: "360px",
                                                        maxHeight: "220px",
                                                        overflowY: "auto",
                                                        zIndex: 1100
                                                    }}
                                                >
                                                    <div style={{ padding: "4px 8px", background: "#f8fafc", fontSize: "11px", fontWeight: "700", color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>
                                                        Select from Catalog
                                                    </div>
                                                    {MASTER_ITEMS.filter((m) =>
                                                        !row.ItemName ||
                                                        m.ItemName.toLowerCase().includes(row.ItemName.toLowerCase()) ||
                                                        m.ItemCode.toLowerCase().includes(row.ItemName.toLowerCase())
                                                    ).map((cat) => (
                                                        <div
                                                            key={cat.ItemCode}
                                                            className="ir-action-item"
                                                            style={{ fontSize: "11.5px", padding: "6px 8px" }}
                                                            onMouseDown={() => handleSelectItemFromCatalog(row.id, cat)}
                                                        >
                                                            <div>
                                                                <strong style={{ color: "#1e70ba" }}>{cat.ItemCode}</strong> - {cat.ItemName}
                                                                <div style={{ fontSize: "10.5px", color: "#64748b" }}>
                                                                    {cat.Variant} | {cat.SizeRange} | {cat.UOM} | ₹{cat.Rate}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </td>

                                        {/* 3. Variant */}
                                        <td>
                                            <input
                                                type="text"
                                                className="ir-cell-input"
                                                placeholder="Type and select Variant"
                                                value={row.Variant}
                                                onChange={(e) => handleLineChange(row.id, "Variant", e.target.value)}
                                            />
                                        </td>

                                        {/* 4. Size Range */}
                                        <td>
                                            <input
                                                type="text"
                                                className="ir-cell-input"
                                                placeholder="Type & Select S..."
                                                value={row.SizeRange}
                                                onChange={(e) => handleLineChange(row.id, "SizeRange", e.target.value)}
                                            />
                                        </td>

                                        {/* 5. Color */}
                                        <td>
                                            <input
                                                type="text"
                                                className="ir-cell-input"
                                                placeholder="Color"
                                                value={row.Color}
                                                onChange={(e) => handleLineChange(row.id, "Color", e.target.value)}
                                            />
                                        </td>

                                        {/* 6. Req Qty */}
                                        <td>
                                            <input
                                                type="number"
                                                className="ir-cell-input"
                                                style={{ textAlign: "right" }}
                                                value={row.Quantity}
                                                onChange={(e) => handleLineChange(row.id, "Quantity", e.target.value)}
                                                min="0.01"
                                                step="any"
                                            />
                                        </td>

                                        {/* 7. UOM */}
                                        <td>
                                            <select
                                                className="ir-cell-input"
                                                value={row.UOM}
                                                onChange={(e) => handleLineChange(row.id, "UOM", e.target.value)}
                                            >
                                                <option value="PCS">PCS</option>
                                                <option value="SQFT">SQFT</option>
                                                <option value="MTR">MTR</option>
                                                <option value="SET">SET</option>
                                                <option value="KGS">KGS</option>
                                                <option value="SPOOL">SPOOL</option>
                                            </select>
                                        </td>

                                        {/* 8. Required Date */}
                                        <td>
                                            <input
                                                type="text"
                                                className="ir-cell-input"
                                                placeholder="DD-MM-YYYY"
                                                value={row.RequiredDate}
                                                onChange={(e) => handleLineChange(row.id, "RequiredDate", e.target.value)}
                                            />
                                        </td>

                                        {/* 9. Rate */}
                                        <td>
                                            <input
                                                type="number"
                                                className="ir-cell-input"
                                                style={{ textAlign: "right" }}
                                                value={row.Rate}
                                                onChange={(e) => handleLineChange(row.id, "Rate", e.target.value)}
                                                min="0"
                                                step="any"
                                            />
                                        </td>

                                        {/* 10. Amount */}
                                        <td style={{ textAlign: "right", fontWeight: 600, paddingRight: "8px" }}>
                                            {Number(row.Amount || 0).toFixed(2)}
                                        </td>

                                        {/* 11. Remarks */}
                                        <td>
                                            <input
                                                type="text"
                                                className="ir-cell-input"
                                                placeholder="Remarks"
                                                value={row.Remarks}
                                                onChange={(e) => handleLineChange(row.id, "Remarks", e.target.value)}
                                            />
                                        </td>

                                        {/* 12. Delete Action */}
                                        <td style={{ textAlign: "center" }}>
                                            <button
                                                type="button"
                                                className="ir-cell-delete-btn"
                                                title="Delete Line"
                                                onClick={() => handleDeleteLine(row.id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* + Add Another Line (Screenshot 3) */}
                    <div>
                        <button
                            type="button"
                            className="ir-add-line-btn"
                            onClick={handleAddAnotherLine}
                        >
                            <FaPlus /> Add Another Line
                        </button>
                    </div>

                    {/* TEXTAREAS (Remark & Memo for internal use, Screenshot 3) */}
                    <div className="ir-textareas-container">
                        <div className="ir-form-group">
                            <label className="ir-form-label">Remark</label>
                            <textarea
                                className="ir-textarea-field"
                                placeholder="Enter Remark"
                                value={formHeader.Remark}
                                onChange={(e) => setFormHeader((prev) => ({ ...prev, Remark: e.target.value }))}
                            />
                        </div>

                        <div className="ir-form-group">
                            <label className="ir-form-label">Memo for internal use</label>
                            <textarea
                                className="ir-textarea-field"
                                placeholder="Enter Internal Memo"
                                value={formHeader.InternalMemo}
                                onChange={(e) => setFormHeader((prev) => ({ ...prev, InternalMemo: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* BOTTOM ACTION BAR (Screenshot 3: + Attachments... | Save | Action v | View) */}
                    <div className="ir-bottom-actions-row">
                        <div>
                            <button
                                type="button"
                                className="ir-btn-attachments"
                                onClick={() => setShowAttachModal(true)}
                            >
                                <FaPlus /> Attachments...
                            </button>
                        </div>

                        <div className="ir-bottom-right-actions">
                            <button
                                type="button"
                                className="ir-btn-save"
                                onClick={handleSaveRequisition}
                            >
                                <FaSave /> Save
                            </button>

                            <button
                                type="button"
                                className="ir-btn-action-dropdown"
                                onClick={() => {
                                    handleSaveRequisition();
                                    handlePrintRecord({ ...formHeader, details: lineItems, ReqNo: `${formHeader.Prefix}${formHeader.ReqNumber}` });
                                }}
                                title="Save & Print"
                            >
                                Action <FaCaretDown />
                            </button>

                            <button
                                type="button"
                                className="ir-btn-view-return"
                                onClick={() => setViewMode("list")}
                            >
                                <FaEye /> View
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* -----------------------------------------------------------------
                MODAL 1: INTERNAL ORDER (IO) LOOKUP MODAL
               ----------------------------------------------------------------- */}
            <Modal
                show={showIoModal}
                onHide={() => setShowIoModal(false)}
                size="lg"
                centered
            >
                <Modal.Header
                    closeButton
                    style={{ background: "#1e70ba", color: "#ffffff", padding: "10px 16px" }}
                >
                    <Modal.Title style={{ fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaListUl /> Internal Order (IO) Lookup
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: "14px" }}>
                    {/* Search & Filters */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
                        <div style={{ flex: 2, minWidth: "220px", position: "relative" }}>
                            <input
                                type="text"
                                className="ir-supplier-input"
                                style={{ width: "100%" }}
                                placeholder="Search by IO No, Customer, Buyer PO, Season..."
                                value={ioSearchText}
                                onChange={(e) => setIoSearchText(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <select
                            className="ir-filter-select"
                            value={ioCustomerFilter}
                            onChange={(e) => setIoCustomerFilter(e.target.value)}
                        >
                            <option value="All">All Customers</option>
                            {Array.from(new Set(MASTER_IOS.map((i) => i.Customer))).map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <select
                            className="ir-filter-select"
                            value={ioSeasonFilter}
                            onChange={(e) => setIoSeasonFilter(e.target.value)}
                        >
                            <option value="All">All Seasons</option>
                            {Array.from(new Set(MASTER_IOS.map((i) => i.Season))).map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Table */}
                    <div style={{ maxHeight: "320px", overflowY: "auto", border: "1px solid #cbd5e1" }}>
                        <table className="ir-data-table">
                            <thead>
                                <tr>
                                    <th>IO No</th>
                                    <th>Customer</th>
                                    <th>Buyer Order No</th>
                                    <th>Season</th>
                                    <th className="th-right">Total Qty</th>
                                    <th>Delivery Date</th>
                                    <th className="th-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredIos.map((io) => (
                                    <tr key={io.IoNo} onDoubleClick={() => handleSelectIo(io)}>
                                        <td style={{ fontWeight: 600, color: "#1e70ba" }}>{io.IoNo}</td>
                                        <td>{io.Customer}</td>
                                        <td>{io.CustomerOrderNo}</td>
                                        <td>{io.Season}</td>
                                        <td className="td-right">{io.TotalQty.toLocaleString()}</td>
                                        <td>{io.DeliveryDate}</td>
                                        <td className="td-center">
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                style={{ fontSize: "11px", padding: "2px 10px", background: "#1e70ba" }}
                                                onClick={() => handleSelectIo(io)}
                                            >
                                                Select
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ padding: "8px 16px" }}>
                    <Button variant="secondary" size="sm" onClick={() => setShowIoModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* -----------------------------------------------------------------
                MODAL 2: ATTACHMENTS MODAL (+ Attachments...)
               ----------------------------------------------------------------- */}
            <Modal
                show={showAttachModal}
                onHide={() => setShowAttachModal(false)}
                centered
            >
                <Modal.Header closeButton style={{ background: "#1e70ba", color: "#ffffff", padding: "10px 16px" }}>
                    <Modal.Title style={{ fontSize: "14px", fontWeight: "700" }}>
                        <FaPaperclip /> Attachments ({attachments.length})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: "16px" }}>
                    <div style={{ marginBottom: "14px" }}>
                        <label className="ir-field-label">Attach File</label>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <input
                                type="text"
                                className="ir-supplier-input"
                                style={{ flex: 1 }}
                                placeholder="Enter document name or browse..."
                                value={newAttachmentName}
                                onChange={(e) => setNewAttachmentName(e.target.value)}
                            />
                            <Button
                                size="sm"
                                variant="primary"
                                style={{ background: "#1e70ba", fontSize: "12px" }}
                                onClick={() => {
                                    if (newAttachmentName.trim()) {
                                        setAttachments((prev) => [
                                            ...prev,
                                            {
                                                name: newAttachmentName.trim(),
                                                size: "215 KB",
                                                uploadDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-")
                                            }
                                        ]);
                                        setNewAttachmentName("");
                                    }
                                }}
                            >
                                Add
                            </Button>
                        </div>
                    </div>

                    <div style={{ border: "1px solid #cbd5e1", borderRadius: "3px", overflow: "hidden" }}>
                        <table className="ir-data-table">
                            <thead>
                                <tr>
                                    <th>Document Name</th>
                                    <th>Size</th>
                                    <th>Uploaded</th>
                                    <th className="th-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attachments.map((att, i) => (
                                    <tr key={i}>
                                        <td><FaPaperclip color="#64748b" style={{ marginRight: "6px" }} /> {att.name}</td>
                                        <td>{att.size}</td>
                                        <td>{att.uploadDate}</td>
                                        <td className="td-center">
                                            <button
                                                type="button"
                                                className="ir-cell-delete-btn"
                                                onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ padding: "8px 16px" }}>
                    <Button variant="secondary" size="sm" onClick={() => setShowAttachModal(false)}>
                        Done
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* -----------------------------------------------------------------
                MODAL 3: NUMBERING & SERIES SETTINGS MODAL (Gear icon)
               ----------------------------------------------------------------- */}
            <Modal
                show={showSettingsModal}
                onHide={() => setShowSettingsModal(false)}
                centered
            >
                <Modal.Header closeButton style={{ background: "#1e70ba", color: "#ffffff", padding: "10px 16px" }}>
                    <Modal.Title style={{ fontSize: "14px", fontWeight: "700" }}>
                        <FaCog /> Item Requisition Note Configuration
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: "16px" }}>
                    <div style={{ marginBottom: "12px" }}>
                        <label className="ir-field-label">Prefix Format</label>
                        <input
                            type="text"
                            className="ir-supplier-input w-100"
                            value={settingsConfig.seriesPrefix}
                            onChange={(e) => setSettingsConfig((prev) => ({ ...prev, seriesPrefix: e.target.value }))}
                        />
                    </div>
                    <div style={{ marginBottom: "12px" }}>
                        <label className="ir-field-label">Starting / Next Sequence</label>
                        <input
                            type="text"
                            className="ir-supplier-input w-100"
                            value={settingsConfig.startNumber}
                            onChange={(e) => setSettingsConfig((prev) => ({ ...prev, startNumber: e.target.value }))}
                        />
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                        Sequence automatically increments per Financial Year (e.g. 2627 for FY 2026-2027) according to Plot No. 9B configuration.
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ padding: "8px 16px" }}>
                    <Button
                        variant="primary"
                        size="sm"
                        style={{ background: "#1e70ba" }}
                        onClick={() => {
                            setFormHeader((prev) => ({
                                ...prev,
                                Prefix: settingsConfig.seriesPrefix,
                                ReqNumber: settingsConfig.startNumber
                            }));
                            setShowSettingsModal(false);
                        }}
                    >
                        Save Settings
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setShowSettingsModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
