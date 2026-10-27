import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    FaCog,
    FaCalendarAlt,
    FaListUl,
    FaPlus,
    FaTrash,
    FaSave,
    FaEye,
    FaCaretDown,
    FaBars,
    FaFilter,
    FaPaperclip,
    FaPrint,
    FaRedo,
    FaFileExport,
    FaTimes,
    FaSearch,
    FaArrowLeft,
    FaCheckCircle,
    FaQrcode,
    FaBarcode,
    FaMapMarkerAlt,
    FaWarehouse,
    FaCheckSquare,
    FaSquare,
    FaBolt,
    FaBoxes,
    FaTags,
    FaLayerGroup
} from "react-icons/fa";
import { generateQRCodeSVG, generateBarcodeSVG } from "../../utils/qrBarcodeUtil";
import "../../styles/itemIssue.css";

const API_URL = process.env.REACT_APP_API_URL || "/api";

// Comprehensive Material Catalog with Stock Wise, Requirement Wise, Balance Wise, and Location
const DEFAULT_MATERIAL_CATALOG = [
    {
        ItemCode: "LTH-1093",
        ItemName: "COW CULATTAS SINGLE LEATHER",
        GroupName: "Leather",
        Color: "BLACK",
        ColorCode: "BLK-01",
        TypeSize: "A Grade (1.2-1.4mm)",
        UOM: "SQFT",
        StockQty: 450,
        ReqQty: 200,
        IssuedQty: 50,
        BalanceQty: 150,
        Rate: 145.0,
        Location: "BIN-A-01-01",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack A1",
        Shelf: "Level 1",
        Zone: "Zone A - Leather",
        Barcode: "BAR-RL-1001",
        hex: "#1e293b"
    },
    {
        ItemCode: "LTH-1112",
        ItemName: "COW ECO VEG SIDE CRUST LEATHER",
        GroupName: "Leather",
        Color: "TAN",
        ColorCode: "TAN-04",
        TypeSize: "Standard (1.4-1.6mm)",
        UOM: "SQFT",
        StockQty: 280,
        ReqQty: 120,
        IssuedQty: 20,
        BalanceQty: 100,
        Rate: 160.0,
        Location: "BIN-A-02-01",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack A2",
        Shelf: "Level 1",
        Zone: "Zone A - Leather",
        Barcode: "BAR-RL-1003",
        hex: "#d97706"
    },
    {
        ItemCode: "HDW-2236",
        ItemName: "JAM RIVET SINGLE HEAD 7MM",
        GroupName: "Hardware",
        Color: "ANTIQUE BRASS",
        ColorCode: "AB-701",
        TypeSize: "7mm Round",
        UOM: "SET",
        StockQty: 5000,
        ReqQty: 1200,
        IssuedQty: 400,
        BalanceQty: 800,
        Rate: 1.85,
        Location: "BIN-C-01-01",
        Warehouse: "ACCESSORIES GODOWN 18",
        Rack: "Rack C1",
        Shelf: "Level 1",
        Zone: "Zone C - Hardware",
        Barcode: "BAR-BIN-C0101",
        hex: "#b45309"
    },
    {
        ItemCode: "RNF-1085",
        ItemName: "HIGH DENSITY TOPLINER 0.4MM",
        GroupName: "Lining",
        Color: "BLACK",
        ColorCode: "BLK-02",
        TypeSize: "0.4mm Roll",
        UOM: "MTR",
        StockQty: 1200,
        ReqQty: 450,
        IssuedQty: 150,
        BalanceQty: 300,
        Rate: 32.5,
        Location: "BIN-B-01-02",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack B1",
        Shelf: "Level 2",
        Zone: "Zone B - Fabric & Lining",
        Barcode: "BAR-RL-2003",
        hex: "#0f172a"
    },
    {
        ItemCode: "NONWO5064",
        ItemName: "TALIN 0.3MM WHITE",
        GroupName: "Reinforcement",
        Color: "WHITE",
        ColorCode: "WHT-10",
        TypeSize: "0.3mm Sheet",
        UOM: "MTR",
        StockQty: 640,
        ReqQty: 300,
        IssuedQty: 100,
        BalanceQty: 200,
        Rate: 24.0,
        Location: "BIN-B-01-01",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack B1",
        Shelf: "Level 1",
        Zone: "Zone B - Fabric & Lining",
        Barcode: "BAR-RL-2001",
        hex: "#f8fafc"
    },
    {
        ItemCode: "PKG-2200",
        ItemName: "CARD PAPER 350G 31X43 INCH",
        GroupName: "Packaging",
        Color: "NATURAL",
        ColorCode: "NAT-01",
        TypeSize: "31x43 Inch",
        UOM: "SHEET",
        StockQty: 850,
        ReqQty: 500,
        IssuedQty: 200,
        BalanceQty: 300,
        Rate: 8.5,
        Location: "BIN-D-01-01",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack D1",
        Shelf: "Level 1",
        Zone: "Zone D - Thread & Trims",
        Barcode: "BAR-BIN-D0101",
        hex: "#e2e8f0"
    },
    {
        ItemCode: "THR-0021",
        ItemName: "BONDED NYLON THREAD #40",
        GroupName: "Thread",
        Color: "BLACK",
        ColorCode: "BLK-40",
        TypeSize: "#40 3000M",
        UOM: "CONE",
        StockQty: 120,
        ReqQty: 60,
        IssuedQty: 20,
        BalanceQty: 40,
        Rate: 95.0,
        Location: "BIN-D-01-01",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack D1",
        Shelf: "Level 1",
        Zone: "Zone D - Thread & Trims",
        Barcode: "BAR-RL-2002",
        hex: "#1e293b"
    },
    {
        ItemCode: "LTH-1205",
        ItemName: "NUBUCK SUEDE FINISH LEATHER",
        GroupName: "Leather",
        Color: "DARK BROWN",
        ColorCode: "DBR-08",
        TypeSize: "Premium 1.3mm",
        UOM: "SQFT",
        StockQty: 390,
        ReqQty: 250,
        IssuedQty: 80,
        BalanceQty: 170,
        Rate: 175.0,
        Location: "BIN-A-01-02",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack A1",
        Shelf: "Level 2",
        Zone: "Zone A - Leather",
        Barcode: "BAR-RL-1004",
        hex: "#78350f"
    },
    {
        ItemCode: "FAB-3011",
        ItemName: "COTTON TWILL LINING 120 GSM",
        GroupName: "Lining",
        Color: "WHITE",
        ColorCode: "WHT-02",
        TypeSize: "120 GSM 58 Inch",
        UOM: "MTR",
        StockQty: 850,
        ReqQty: 400,
        IssuedQty: 150,
        BalanceQty: 250,
        Rate: 45.0,
        Location: "BIN-B-01-01",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack B1",
        Shelf: "Level 1",
        Zone: "Zone B - Fabric & Lining",
        Barcode: "BAR-RL-2001",
        hex: "#ffffff"
    },
    {
        ItemCode: "HDW-3108",
        ItemName: "ANTIQUE BRASS EYELET 4MM",
        GroupName: "Hardware",
        Color: "ANTIQUE BRASS",
        ColorCode: "AB-402",
        TypeSize: "4mm Inner Dia",
        UOM: "PCS",
        StockQty: 8500,
        ReqQty: 2400,
        IssuedQty: 600,
        BalanceQty: 1800,
        Rate: 0.95,
        Location: "BIN-C-01-01",
        Warehouse: "ACCESSORIES GODOWN 18",
        Rack: "Rack C1",
        Shelf: "Level 1",
        Zone: "Zone C - Hardware",
        Barcode: "BAR-BIN-C0102",
        hex: "#b45309"
    }
];

const DEFAULT_WAREHOUSES = [
    "RAW MATERIAL STORE 9B",
    "SEMI FINISH STORE 9B",
    "LEATHER WAREHOUSE PLOT 9B",
    "ACCESSORIES GODOWN 18",
    "MAIN FINISHED GOODS STORE"
];

const DEFAULT_SUPPLIERS = [
    "Apex Leather Works",
    "Balaji Trims & Fasteners",
    "Supreme Leathercraft",
    "K-Tex Textiles",
    "Prime Leather Tanning",
    "Vardhman Yarns & Threads",
    "Shree Ganesh Fabrics"
];

const DEFAULT_DEPARTMENTS = [
    "Production",
    "Cutting",
    "Stitching",
    "Assembly",
    "Finishing",
    "Quality Control",
    "Packaging"
];

const DEFAULT_REQUISITIONS = [
    { reqNo: "REQ-2627-0104", date: "22-10-2026", dept: "Cutting", requestedBy: "Suresh Patel", totalItems: 3 },
    { reqNo: "REQ-2627-0103", date: "21-10-2026", dept: "Stitching", requestedBy: "Ramesh Kumar", totalItems: 2 },
    { reqNo: "REQ-2627-0102", date: "20-10-2026", dept: "Finishing", requestedBy: "Pooja Verma", totalItems: 5 }
];

const DEFAULT_JOBCARDS = [
    { jcNo: "JC-4512", slipNo: "CS-9041", style: "Oxford Classic Boot", buyer: "Clarks UK", orderQty: 1200 },
    { jcNo: "JC-4509", slipNo: "CS-9038", style: "Chelsea Suede Brown", buyer: "Zara Man", orderQty: 850 },
    { jcNo: "JC-4498", slipNo: "CS-9032", style: "Derby Formal Black", buyer: "Marks & Spencer", orderQty: 500 }
];

const DEFAULT_CUTTING_PLANS = [
    { planNo: "CP-2627-044", jcNo: "JC-4512", date: "22-10-2026", pairs: 1200 },
    { planNo: "CP-2627-043", jcNo: "JC-4509", date: "20-10-2026", pairs: 850 },
    { planNo: "CP-2627-042", jcNo: "JC-4498", date: "18-10-2026", pairs: 500 }
];

const INITIAL_SAVED_ISSUES = [
    {
        id: 1,
        issueNo: "ISSP/AAPL9B/2627/2003",
        date: "22-10-2026",
        issueTo: "Production",
        associate: "Apex Leather Works",
        department: "Cutting",
        stores: "RAW MATERIAL STORE 9B",
        issuedBy: "Nikhil Singh",
        receivedBy: "Ramesh Kumar",
        requisitionNo: "REQ-2627-0104",
        jobcardNo: "JC-4512",
        cuttingPlanNo: "CP-2627-044",
        remark: "Batch 104 Cutting leather issue",
        internalMemo: "Bulk cutting line 1",
        totalQty: 185.5,
        totalAmount: 27872.5,
        status: "Completed",
        items: [
            { id: 1, issueType: "Lot Issue", ioNo: "IO-9821", group: "Leather", item: "COW CULATTAS SINGLE LEATHER", description: "Upper cutting leather", colour: "BLACK", typeSize: "A Grade", uom: "SQFT", location: "BIN-A-01-01", stockQty: 450, issueQty: 120.5, rate: 145, amount: 17472.5, remarks: "Checked by QC" },
            { id: 2, issueType: "Lot Issue", ioNo: "IO-9821", group: "Leather", item: "COW ECO VEG SIDE CRUST LEATHER", description: "Counter reinforcement", colour: "TAN", typeSize: "Standard", uom: "SQFT", location: "BIN-A-02-01", stockQty: 280, issueQty: 65, rate: 160, amount: 10400, remarks: "" }
        ]
    },
    {
        id: 2,
        issueNo: "ISSP/AAPL9B/2627/2002",
        date: "21-10-2026",
        issueTo: "Production",
        associate: "Balaji Trims & Fasteners",
        department: "Assembly",
        stores: "SEMI FINISH STORE 9B",
        issuedBy: "Nikhil Singh",
        receivedBy: "Pooja Verma",
        requisitionNo: "REQ-2627-0103",
        jobcardNo: "JC-4509",
        cuttingPlanNo: "CP-2627-043",
        remark: "Urgent hardware issue",
        internalMemo: "Line 2 assembly run",
        totalQty: 450,
        totalAmount: 832.5,
        status: "Completed",
        items: [
            { id: 1, issueType: "Lot Issue", ioNo: "IO-9818", group: "Hardware", item: "JAM RIVET SINGLE HEAD 7MM", description: "Riveting section", colour: "ANTIQUE BRASS", typeSize: "7mm", uom: "SET", location: "BIN-C-01-01", stockQty: 5000, issueQty: 450, rate: 1.85, amount: 832.5, remarks: "" }
        ]
    }
];

export default function ItemIssue({ initialMode = "form" }) {
    // View mode: 'form' or 'list'
    const [viewMode, setViewMode] = useState(initialMode);

    // Form Header State
    const [issueTo, setIssueTo] = useState("Production");
    const [issuePrefix, setIssuePrefix] = useState("ISSP/AAPL9B/2627/");
    const [issueSerial, setIssueSerial] = useState("2004");
    const [issueDate, setIssueDate] = useState(() => {
        const d = new Date();
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    });

    const [associate, setAssociate] = useState("");
    const [receivedBy, setReceivedBy] = useState("");
    const [department, setDepartment] = useState("");
    const [stores, setStores] = useState("RAW MATERIAL STORE 9B");
    const [issuedBy, setIssuedBy] = useState("Admin");
    const [requisitionNo, setRequisitionNo] = useState("");
    const [jobcardNo, setJobcardNo] = useState("");
    const [cuttingPlanNo, setCuttingPlanNo] = useState("");

    // =========================================================================
    // 4x4 QR CODE & LOCATION MODULE STATE (LEFT MIDDLE SIDE)
    // =========================================================================
    const [show4x4Panel, setShow4x4Panel] = useState(true);
    const [activeItem4x4, setActiveItem4x4] = useState(DEFAULT_MATERIAL_CATALOG[0]);
    const [scanInput, setScanInput] = useState("");
    const [scanLaserActive, setScanLaserActive] = useState(false);
    const [autoFillToast, setAutoFillToast] = useState("");

    // =========================================================================
    // SEARCH BY MATERIAL NAME & COLOUR (STOCK WISE, REQ WISE, BALANCE WISE)
    // =========================================================================
    const [searchMaterialName, setSearchMaterialName] = useState("");
    const [searchColour, setSearchColour] = useState("");
    const [searchGroup, setSearchGroup] = useState("");
    const [markedItemCodes, setMarkedItemCodes] = useState([]);
    const [searchIssueQtys, setSearchIssueQtys] = useState({});

    // Table Lines State
    const [lines, setLines] = useState([
        {
            id: 1,
            selected: false,
            issueType: "Lot Issue",
            ioNo: "IO-9821",
            group: DEFAULT_MATERIAL_CATALOG[0].GroupName,
            item: DEFAULT_MATERIAL_CATALOG[0].ItemName,
            itemCode: DEFAULT_MATERIAL_CATALOG[0].ItemCode,
            description: "Upper cutting leather batch A",
            colour: DEFAULT_MATERIAL_CATALOG[0].Color,
            typeSize: DEFAULT_MATERIAL_CATALOG[0].TypeSize,
            uom: DEFAULT_MATERIAL_CATALOG[0].UOM,
            location: DEFAULT_MATERIAL_CATALOG[0].Location,
            stockQty: DEFAULT_MATERIAL_CATALOG[0].StockQty,
            issueQty: DEFAULT_MATERIAL_CATALOG[0].BalanceQty,
            rate: DEFAULT_MATERIAL_CATALOG[0].Rate,
            amount: parseFloat((DEFAULT_MATERIAL_CATALOG[0].BalanceQty * DEFAULT_MATERIAL_CATALOG[0].Rate).toFixed(2)),
            remarks: "Standard production issue"
        }
    ]);

    // Footer State
    const [remark, setRemark] = useState("");
    const [internalMemo, setInternalMemo] = useState("");
    const [attachments, setAttachments] = useState([]);

    // Action menu dropdown state
    const [showActionMenu, setShowActionMenu] = useState(false);
    const actionBtnRef = useRef(null);

    // Saved list records
    const [savedIssues, setSavedIssues] = useState(INITIAL_SAVED_ISSUES);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeRecord, setActiveRecord] = useState(null);

    // Modals
    const [activeModal, setActiveModal] = useState(null); // 'materialSearch' | 'sticker4x4' | 'requisition' | 'jobcard' | 'plan' | 'attach' | 'settings' | 'print'
    const [successMessage, setSuccessMessage] = useState("");

    // Load registered lists from backend on mount
    useEffect(() => {
        let mounted = true;
        axios.get(`${API_URL}/item-issues`)
            .then(res => {
                const data = res.data?.data || res.data;
                if (mounted && Array.isArray(data) && data.length > 0) {
                    const mapped = data.map((d, i) => ({
                        id: d.IssueID || d.id || i + 1,
                        issueNo: d.IssueNo || `ISSP/AAPL9B/2627/${2000 + i}`,
                        date: d.IssueDate || "23-10-2026",
                        issueTo: d.IssueTo || "Production",
                        associate: d.SupplierName || d.associate || "",
                        department: d.Department || d.department || "Production",
                        stores: d.Stores || d.stores || "RAW MATERIAL STORE 9B",
                        issuedBy: d.IssuedBy || "Admin",
                        receivedBy: d.ReceivedBy || "",
                        requisitionNo: d.RequisitionNo || "",
                        jobcardNo: d.JCNo || d.jobcardNo || "",
                        cuttingPlanNo: d.CuttingPlanNo || "",
                        remark: d.Remark || "",
                        internalMemo: d.InternalMemo || "",
                        totalQty: d.TotalQty || 0,
                        totalAmount: d.TotalAmount || 0,
                        status: d.Status || "Completed",
                        items: d.details || []
                    }));
                    setSavedIssues(mapped);
                }
            })
            .catch(() => {});
        return () => { mounted = false; };
    }, []);

    // Close action dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (actionBtnRef.current && !actionBtnRef.current.contains(e.target)) {
                setShowActionMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Auto-calculate totals
    const totalQty = lines.reduce((acc, row) => acc + (parseFloat(row.issueQty) || 0), 0);
    const totalAmount = lines.reduce((acc, row) => acc + (parseFloat(row.amount) || 0), 0);

    // =========================================================================
    // AUTO FILL LOGIC ON SCAN / CODE ENTRY
    // =========================================================================
    const handleScanAutoFill = (inputCode) => {
        const query = (inputCode || scanInput).trim();
        if (!query) return;

        setScanLaserActive(true);
        setTimeout(() => setScanLaserActive(false), 800);

        // Find material by ItemCode, Barcode, Bin Code, or ItemName
        const matched = DEFAULT_MATERIAL_CATALOG.find(m =>
            m.ItemCode.toLowerCase() === query.toLowerCase() ||
            (m.Barcode && m.Barcode.toLowerCase() === query.toLowerCase()) ||
            (m.Location && m.Location.toLowerCase() === query.toLowerCase()) ||
            m.ItemName.toLowerCase().includes(query.toLowerCase())
        );

        if (matched) {
            setActiveItem4x4(matched);

            // Auto-fill into lines table
            setLines(prev => {
                const emptyIdx = prev.findIndex(r => !r.item || r.item.trim() === "");
                const targetIssueQty = matched.BalanceQty > 0 ? matched.BalanceQty : Math.min(matched.StockQty, 50);
                const newRow = {
                    id: emptyIdx !== -1 ? prev[emptyIdx].id : (prev.length > 0 ? Math.max(...prev.map(l => l.id)) + 1 : 1),
                    selected: false,
                    issueType: "Lot Issue",
                    ioNo: jobcardNo ? "IO-9821" : "IO-9805",
                    group: matched.GroupName,
                    item: matched.ItemName,
                    itemCode: matched.ItemCode,
                    description: `${matched.ItemName} - Location: ${matched.Location}`,
                    colour: matched.Color,
                    typeSize: matched.TypeSize,
                    uom: matched.UOM,
                    location: matched.Location,
                    stockQty: matched.StockQty,
                    issueQty: targetIssueQty,
                    rate: matched.Rate,
                    amount: parseFloat((targetIssueQty * matched.Rate).toFixed(2)),
                    remarks: `Auto-filled from QR/Barcode [${query}]`
                };

                if (emptyIdx !== -1) {
                    const copy = [...prev];
                    copy[emptyIdx] = newRow;
                    return copy;
                }
                return [...prev, newRow];
            });

            setAutoFillToast(`Auto-filled: ${matched.ItemName} (${matched.Color}) from QR Code / Barcode!`);
            setTimeout(() => setAutoFillToast(""), 4500);
            setScanInput("");
        } else {
            alert(`No material found matching '${query}'. Try quick presets or the Material Search option.`);
        }
    };

    // =========================================================================
    // SEARCH MODAL & MARK OPTION LOGIC
    // =========================================================================
    const filteredSearchMaterials = DEFAULT_MATERIAL_CATALOG.filter(m => {
        const matchName = !searchMaterialName.trim() ||
            m.ItemName.toLowerCase().includes(searchMaterialName.toLowerCase()) ||
            m.ItemCode.toLowerCase().includes(searchMaterialName.toLowerCase());

        const matchColour = !searchColour.trim() ||
            m.Color.toLowerCase() === searchColour.toLowerCase() ||
            (m.ColorCode && m.ColorCode.toLowerCase().includes(searchColour.toLowerCase()));

        const matchGroup = !searchGroup.trim() || m.GroupName.toLowerCase() === searchGroup.toLowerCase();

        return matchName && matchColour && matchGroup;
    });

    const handleToggleMark = (itemCode) => {
        setMarkedItemCodes(prev => {
            const next = prev.includes(itemCode) ? prev.filter(c => c !== itemCode) : [...prev, itemCode];
            return next;
        });
        // Update active 4x4 panel on row selection
        const target = DEFAULT_MATERIAL_CATALOG.find(m => m.ItemCode === itemCode);
        if (target) {
            setActiveItem4x4(target);
        }
    };

    const handleMarkAll = () => {
        if (markedItemCodes.length === filteredSearchMaterials.length) {
            setMarkedItemCodes([]);
        } else {
            setMarkedItemCodes(filteredSearchMaterials.map(m => m.ItemCode));
        }
    };

    const handleApplyMarkedItems = () => {
        if (markedItemCodes.length === 0) {
            alert("Please mark at least one item to apply.");
            return;
        }

        const markedMaterials = DEFAULT_MATERIAL_CATALOG.filter(m => markedItemCodes.includes(m.ItemCode));

        setLines(prev => {
            const existing = prev.filter(r => r.item && r.item.trim());
            let maxId = existing.length > 0 ? Math.max(...existing.map(l => l.id)) : 0;

            const newRows = markedMaterials.map(m => {
                maxId += 1;
                const qty = parseFloat(searchIssueQtys[m.ItemCode]) || (m.BalanceQty > 0 ? m.BalanceQty : Math.min(m.StockQty, 50));
                return {
                    id: maxId,
                    selected: false,
                    issueType: "Lot Issue",
                    ioNo: jobcardNo ? "IO-9821" : "IO-9805",
                    group: m.GroupName,
                    item: m.ItemName,
                    itemCode: m.ItemCode,
                    description: `${m.ItemName} [Loc: ${m.Location}]`,
                    colour: m.Color,
                    typeSize: m.TypeSize,
                    uom: m.UOM,
                    location: m.Location,
                    stockQty: m.StockQty,
                    issueQty: qty,
                    rate: m.Rate,
                    amount: parseFloat((qty * m.Rate).toFixed(2)),
                    remarks: `Marked issue (${m.ColorCode})`
                };
            });

            return [...existing, ...newRows];
        });

        // Set the first marked item as active in 4x4 panel
        if (markedMaterials.length > 0) {
            setActiveItem4x4(markedMaterials[0]);
        }

        setAutoFillToast(`Added ${markedMaterials.length} marked item(s) to Item Issue!`);
        setTimeout(() => setAutoFillToast(""), 4500);
        setActiveModal(null);
        setMarkedItemCodes([]);
    };

    // Line items change handler
    const handleLineChange = (id, field, value) => {
        setLines(prev => prev.map(row => {
            if (row.id !== id) return row;
            const updated = { ...row, [field]: value };

            // If item changed, autofill group, colour, UOM, stockQty, rate, location
            if (field === "item") {
                const found = DEFAULT_MATERIAL_CATALOG.find(it =>
                    it.ItemName.toLowerCase() === String(value).toLowerCase() ||
                    it.ItemCode.toLowerCase() === String(value).toLowerCase()
                );
                if (found) {
                    updated.item = found.ItemName;
                    updated.itemCode = found.ItemCode;
                    updated.group = found.GroupName || updated.group;
                    updated.colour = found.Color || updated.colour;
                    updated.uom = found.UOM || updated.uom;
                    updated.location = found.Location || updated.location;
                    updated.stockQty = found.StockQty || 0;
                    updated.rate = found.Rate || updated.rate;
                    if (updated.issueQty && updated.rate) {
                        updated.amount = parseFloat((parseFloat(updated.issueQty) * parseFloat(updated.rate)).toFixed(2));
                    }
                    setActiveItem4x4(found);
                }
            }

            // If issueQty or rate changed, recompute amount
            if (field === "issueQty" || field === "rate") {
                const qty = field === "issueQty" ? parseFloat(value) || 0 : parseFloat(row.issueQty) || 0;
                const rate = field === "rate" ? parseFloat(value) || 0 : parseFloat(row.rate) || 0;
                updated.amount = parseFloat((qty * rate).toFixed(2));
            }

            return updated;
        }));
    };

    // Add another row
    const handleAddLine = () => {
        const nextId = lines.length > 0 ? Math.max(...lines.map(l => l.id)) + 1 : 1;
        setLines(prev => [
            ...prev,
            {
                id: nextId,
                selected: false,
                issueType: "Lot Issue",
                ioNo: "",
                group: "",
                item: "",
                description: "",
                colour: "",
                typeSize: "",
                uom: "PCS",
                location: "",
                stockQty: 0,
                issueQty: "",
                rate: "",
                amount: 0,
                remarks: ""
            }
        ]);
    };

    // Delete single line
    const handleDeleteLine = (id) => {
        if (lines.length <= 1) {
            setLines([{
                id: 1,
                selected: false,
                issueType: "Lot Issue",
                ioNo: "",
                group: "",
                item: "",
                description: "",
                colour: "",
                typeSize: "",
                uom: "PCS",
                location: "",
                stockQty: 0,
                issueQty: "",
                rate: "",
                amount: 0,
                remarks: ""
            }]);
            return;
        }
        setLines(prev => prev.filter(r => r.id !== id));
    };

    // Toggle select all lines
    const handleSelectAll = (checked) => {
        setLines(prev => prev.map(r => ({ ...r, selected: checked })));
    };

    // Display button action
    const handleDisplay = () => {
        if (jobcardNo || requisitionNo) {
            setLines(DEFAULT_MATERIAL_CATALOG.slice(0, 3).map((it, idx) => ({
                id: idx + 1,
                selected: false,
                issueType: "Lot Issue",
                ioNo: jobcardNo ? "IO-9821" : "IO-9805",
                group: it.GroupName,
                item: it.ItemName,
                itemCode: it.ItemCode,
                description: `${it.ItemName} for ${jobcardNo || requisitionNo}`,
                colour: it.Color,
                typeSize: it.TypeSize,
                uom: it.UOM,
                location: it.Location,
                stockQty: it.StockQty,
                issueQty: it.BalanceQty || (25 + idx * 10),
                rate: it.Rate,
                amount: (it.BalanceQty || (25 + idx * 10)) * it.Rate,
                remarks: "Auto loaded via Display"
            })));
            setActiveItem4x4(DEFAULT_MATERIAL_CATALOG[0]);
        } else {
            alert("Select a Jobcard, Cutting Plan, or Requisition to populate line items, or use the 4x4 QR scan & Material Search options.");
        }
    };

    // Save Item Issue
    const handleSave = async () => {
        if (!stores.trim()) {
            alert("Please enter or select a Store/Warehouse (marked with *).");
            return;
        }

        const validLines = lines.filter(l => l.item.trim() || l.issueQty);
        if (validLines.length === 0) {
            alert("Please add at least one Item with Issue Quantity.");
            return;
        }

        const fullIssueNo = `${issuePrefix}${issueSerial}`;
        const newRecord = {
            id: Date.now(),
            issueNo: fullIssueNo,
            date: issueDate,
            issueTo,
            associate,
            department: department || "Production",
            stores,
            issuedBy,
            receivedBy,
            requisitionNo,
            jobcardNo,
            cuttingPlanNo,
            remark,
            internalMemo,
            totalQty,
            totalAmount,
            status: "Completed",
            items: lines
        };

        try {
            await axios.post(`${API_URL}/item-issues`, {
                IssueNo: fullIssueNo,
                IssueDate: issueDate,
                IssueTo: issueTo,
                SupplierName: associate,
                Department: department,
                Stores: stores,
                IssuedBy: issuedBy,
                ReceivedBy: receivedBy,
                JCNo: jobcardNo,
                Remark: remark,
                InternalMemo: internalMemo,
                TotalQty: totalQty,
                TotalAmount: totalAmount,
                details: lines.map(l => ({
                    ItemName: l.item,
                    ItemCode: l.itemCode || l.item,
                    Color: l.colour,
                    Quantity: parseFloat(l.issueQty) || 0,
                    UOM: l.uom,
                    Location: l.location,
                    Rate: parseFloat(l.rate) || 0,
                    Amount: parseFloat(l.amount) || 0,
                    Remarks: l.remarks
                }))
            });
        } catch (e) {
            console.warn("Backend API not reachable, saved to local state:", e.message);
        }

        setSavedIssues(prev => [newRecord, ...prev]);
        setSuccessMessage(`Item Issue ${fullIssueNo} saved successfully!`);
        setIssueSerial(prev => String(parseInt(prev, 10) + 1));
        setTimeout(() => setSuccessMessage(""), 4000);
    };

    // Clear form
    const handleResetForm = () => {
        setAssociate("");
        setReceivedBy("");
        setDepartment("");
        setStores("RAW MATERIAL STORE 9B");
        setRequisitionNo("");
        setJobcardNo("");
        setCuttingPlanNo("");
        setRemark("");
        setInternalMemo("");
        setLines([
            {
                id: 1,
                selected: false,
                issueType: "Lot Issue",
                ioNo: "",
                group: "",
                item: "",
                description: "",
                colour: "",
                typeSize: "",
                uom: "PCS",
                location: "",
                stockQty: 0,
                issueQty: "",
                rate: "",
                amount: 0,
                remarks: ""
            }
        ]);
        setShowActionMenu(false);
    };

    // Filtered list records for list view
    const filteredIssues = savedIssues.filter(item => {
        const q = searchTerm.toLowerCase();
        return (
            item.issueNo.toLowerCase().includes(q) ||
            item.associate.toLowerCase().includes(q) ||
            item.stores.toLowerCase().includes(q) ||
            item.department.toLowerCase().includes(q) ||
            item.date.toLowerCase().includes(q)
        );
    });

    return (
        <div className="tpcs-item-issue-container">

            {/* Success notification banner */}
            {successMessage && (
                <div style={{
                    background: "#ecfdf5",
                    border: "1px solid #10b981",
                    color: "#065f46",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    marginBottom: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: 600
                }}>
                    <FaCheckCircle style={{ color: "#10b981" }} />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Auto-fill notification banner */}
            {autoFillToast && (
                <div style={{
                    background: "#eff6ff",
                    border: "1.5px solid #3b82f6",
                    color: "#1e40af",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    marginBottom: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    animation: "fadeIn 0.2s ease"
                }}>
                    <FaBolt style={{ color: "#3b82f6" }} />
                    <span>{autoFillToast}</span>
                </div>
            )}

            {/* ==========================================================
               MODE: FORM VIEW (ITEM ISSUE WITH 4x4 QR & LOCATION OPTION)
            =========================================================== */}
            {viewMode === "form" && (
                <div>
                    {/* Header: Title + Option Buttons */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <h1 className="tpcs-ii-title" style={{ margin: 0 }}>Item Issue</h1>
                            <span style={{
                                background: "#e0f2fe",
                                color: "#0369a1",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "11px",
                                fontWeight: 700,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px"
                            }}>
                                <FaQrcode /> 4x4 QR & Location Module
                            </span>
                        </div>

                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            {/* Option Button: 4x4 QR Scanner & Location Panel Toggle */}
                            <button
                                type="button"
                                className={`tpcs-ii-btn-view ${show4x4Panel ? "primary" : ""}`}
                                onClick={() => setShow4x4Panel(prev => !prev)}
                                title="Toggle 4x4 QR & Location Panel on Left Middle"
                                style={{
                                    backgroundColor: show4x4Panel ? "#1976d2" : "#f1f5f9",
                                    color: show4x4Panel ? "#ffffff" : "#334155",
                                    borderColor: show4x4Panel ? "#1976d2" : "#cbd5e1"
                                }}
                            >
                                <FaQrcode />
                                <span>4x4 Panel: {show4x4Panel ? "ON" : "OFF"}</span>
                            </button>

                            {/* Option Button: Search from Material Name & Colour Code (Stock/Req/Balance) */}
                            <button
                                type="button"
                                className="tpcs-ii-btn-save"
                                onClick={() => setActiveModal("materialSearch")}
                                title="Search materials stock wise, requirement wise, balance wise with Mark option"
                                style={{ backgroundColor: "#0284c7" }}
                            >
                                <FaSearch />
                                <span>Search Materials (Stock/Req/Balance)</span>
                            </button>

                            {/* Switch to Register */}
                            <button
                                type="button"
                                className="tpcs-ii-btn-view"
                                onClick={() => setViewMode("list")}
                                title="Switch to Item Issue Register"
                            >
                                <FaEye /> <span>View Register</span>
                            </button>
                        </div>
                    </div>

                    {/* Issue To Row */}
                    <div className="tpcs-ii-issue-to-row">
                        <label className="tpcs-ii-label">Issue To</label>
                        <select
                            className="tpcs-ii-select"
                            value={issueTo}
                            onChange={(e) => setIssueTo(e.target.value)}
                        >
                            <option value="Production">Production</option>
                            <option value="General">General</option>
                            <option value="Jobwork">Jobwork</option>
                            <option value="Department">Department</option>
                            <option value="Sample Development">Sample Development</option>
                        </select>
                    </div>

                    {/* 4-Columns Header Form Grid */}
                    <div className="tpcs-ii-grid">
                        {/* COLUMN 1: IssueNo */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">IssueNo</label>
                            <div className="tpcs-ii-issueno-group">
                                <select
                                    className="tpcs-ii-issueno-prefix"
                                    value={issuePrefix}
                                    onChange={(e) => setIssuePrefix(e.target.value)}
                                >
                                    <option value="ISSP/AAPL9B/2627/">ISSP/AAPL9B/2627/</option>
                                    <option value="ISSG/AAPL9B/2627/">ISSG/AAPL9B/2627/</option>
                                    <option value="ISJ/AAPL9B/2627/">ISJ/AAPL9B/2627/</option>
                                </select>
                                <input
                                    type="text"
                                    className="tpcs-ii-issueno-num"
                                    value={issueSerial}
                                    onChange={(e) => setIssueSerial(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="tpcs-ii-addon-btn btn-gear"
                                    title="Prefix & Numbering Settings"
                                    onClick={() => setActiveModal("settings")}
                                >
                                    <FaCog />
                                </button>
                            </div>
                        </div>

                        {/* COLUMN 2: Associate */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">Associate</label>
                            <input
                                type="text"
                                className="tpcs-ii-input"
                                placeholder="Type and select Supplier"
                                value={associate}
                                onChange={(e) => setAssociate(e.target.value)}
                                list="suppliers-datalist"
                            />
                            <datalist id="suppliers-datalist">
                                {DEFAULT_SUPPLIERS.map(s => <option key={s} value={s} />)}
                            </datalist>
                        </div>

                        {/* COLUMN 3: Received By */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">Received By</label>
                            <input
                                type="text"
                                className="tpcs-ii-input"
                                placeholder="Enter Received By"
                                value={receivedBy}
                                onChange={(e) => setReceivedBy(e.target.value)}
                            />
                        </div>

                        {/* COLUMN 4: Department */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">Department</label>
                            <input
                                type="text"
                                className="tpcs-ii-input"
                                placeholder="Type and select Department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                list="depts-datalist"
                            />
                            <datalist id="depts-datalist">
                                {DEFAULT_DEPARTMENTS.map(d => <option key={d} value={d} />)}
                            </datalist>
                        </div>

                        {/* ROW 2 - COL 1: Date */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">
                                Date <span className="tpcs-ii-req">*</span>
                            </label>
                            <div className="tpcs-ii-input-group">
                                <input
                                    type="text"
                                    className="tpcs-ii-input"
                                    value={issueDate}
                                    onChange={(e) => setIssueDate(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="tpcs-ii-addon-btn"
                                    title="Select Date"
                                    onClick={() => {
                                        const d = prompt("Enter Date (DD-MM-YYYY):", issueDate);
                                        if (d) setIssueDate(d);
                                    }}
                                >
                                    <FaCalendarAlt />
                                </button>
                            </div>
                        </div>

                        {/* ROW 2 - COL 2: Stores */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">
                                Stores <span className="tpcs-ii-req">*</span>
                            </label>
                            <input
                                type="text"
                                className="tpcs-ii-input"
                                placeholder="Type and select Warehouse"
                                value={stores}
                                onChange={(e) => setStores(e.target.value)}
                                list="stores-datalist"
                            />
                            <datalist id="stores-datalist">
                                {DEFAULT_WAREHOUSES.map(w => <option key={w} value={w} />)}
                            </datalist>
                        </div>

                        {/* ROW 2 - COL 3: Issued By */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">Issued By</label>
                            <input
                                type="text"
                                className="tpcs-ii-input"
                                placeholder="Enter Issued By"
                                value={issuedBy}
                                onChange={(e) => setIssuedBy(e.target.value)}
                            />
                        </div>

                        {/* ROW 2 - COL 4: Requisition No */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">Requisition No</label>
                            <div className="tpcs-ii-input-group">
                                <input
                                    type="text"
                                    className="tpcs-ii-input"
                                    placeholder="Select Requisition No"
                                    value={requisitionNo}
                                    onChange={(e) => setRequisitionNo(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="tpcs-ii-addon-btn"
                                    title="Select Requisition No"
                                    onClick={() => setActiveModal("requisition")}
                                >
                                    <FaListUl />
                                </button>
                            </div>
                        </div>

                        {/* ROW 3 - COL 1: Cutting Slip, Jobcard No */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">Cutting Slip,Jobcard No</label>
                            <div className="tpcs-ii-input-group">
                                <input
                                    type="text"
                                    className="tpcs-ii-input"
                                    placeholder="Select Cutting Slip,Jobcard No"
                                    value={jobcardNo}
                                    onChange={(e) => setJobcardNo(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="tpcs-ii-addon-btn"
                                    title="Select Cutting Slip / Jobcard"
                                    onClick={() => setActiveModal("jobcard")}
                                >
                                    <FaListUl />
                                </button>
                            </div>
                        </div>

                        {/* ROW 3 - COL 2: Cutting Plan No */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">Cutting Plan No</label>
                            <div className="tpcs-ii-input-group">
                                <input
                                    type="text"
                                    className="tpcs-ii-input"
                                    placeholder="Select Cutting Plan No"
                                    value={cuttingPlanNo}
                                    onChange={(e) => setCuttingPlanNo(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="tpcs-ii-addon-btn"
                                    title="Select Cutting Plan No"
                                    onClick={() => setActiveModal("plan")}
                                >
                                    <FaListUl />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Display Button Row */}
                    <div className="tpcs-ii-display-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <button
                            type="button"
                            className="tpcs-ii-btn-display"
                            onClick={handleDisplay}
                        >
                            Display
                        </button>

                        <div style={{ display: "flex", gap: "8px" }}>
                            <button
                                type="button"
                                className="tpcs-ii-btn-action"
                                style={{ fontSize: "11.5px", padding: "5px 10px" }}
                                onClick={() => setActiveModal("materialSearch")}
                            >
                                <FaSearch /> <span>Search & Mark Items</span>
                            </button>
                            <button
                                type="button"
                                className="tpcs-ii-btn-action"
                                style={{ fontSize: "11.5px", padding: "5px 10px" }}
                                onClick={() => setActiveModal("sticker4x4")}
                            >
                                <FaPrint /> <span>Print 4x4 Sticker</span>
                            </button>
                        </div>
                    </div>

                    {/* ==========================================================
                       MAIN MIDDLE SECTION: 4x4 QR & LOCATION ON LEFT + TABLE
                    =========================================================== */}
                    <div className="tpcs-ii-main-layout">

                        {/* ------------------------------------------------------
                           LEFT MIDDLE SIDE: 4x4 QR CODE & LOCATION CARD
                        ------------------------------------------------------- */}
                        {show4x4Panel && (
                            <div className="tpcs-ii-4x4-card">
                                {/* Header badge */}
                                <div className="tpcs-ii-4x4-header">
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <FaQrcode />
                                        <span>4x4 QR & Location</span>
                                    </div>
                                    <span className="tpcs-ii-4x4-header-pill">4x4 Standard</span>
                                </div>

                                {/* TOP SECTION: QR CODE & BARCODE */}
                                <div className="tpcs-ii-4x4-top">
                                    <div className="tpcs-ii-4x4-top-title">
                                        <span>Top: QR Code & Barcode</span>
                                        <span style={{ fontSize: "10px", color: "#64748b", fontFamily: "monospace" }}>
                                            {activeItem4x4?.ItemCode || "CODE-4X4"}
                                        </span>
                                    </div>

                                    {/* QR Code Container */}
                                    <div className="tpcs-ii-qr-box">
                                        {scanLaserActive && <div className="tpcs-ii-qr-laser-line" />}
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: generateQRCodeSVG(activeItem4x4?.ItemCode || "LTH-1093", { size: 130 })
                                            }}
                                        />
                                    </div>

                                    {/* Barcode representation */}
                                    <div className="tpcs-ii-barcode-box">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: generateBarcodeSVG(activeItem4x4?.Barcode || activeItem4x4?.ItemCode || "BAR-RL-1001", { width: 220, height: 42, showText: true })
                                            }}
                                        />
                                    </div>

                                    {/* Quick Scan Input with Auto Fill */}
                                    <div className="tpcs-ii-4x4-scan-input-group">
                                        <input
                                            type="text"
                                            className="tpcs-ii-4x4-scan-input"
                                            placeholder="Scan QR/Barcode & Enter..."
                                            value={scanInput}
                                            onChange={(e) => setScanInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleScanAutoFill();
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="tpcs-ii-4x4-btn-autofill"
                                            onClick={() => handleScanAutoFill()}
                                            title="Auto-fill line item from QR Code / Barcode"
                                        >
                                            <FaBolt /> <span>Auto Fill</span>
                                        </button>
                                    </div>

                                    {/* Quick Scan Presets */}
                                    <div className="tpcs-ii-4x4-presets">
                                        <span style={{ fontSize: "10px", color: "#64748b", width: "100%", marginBottom: "2px" }}>
                                            Quick Scan Presets:
                                        </span>
                                        {DEFAULT_MATERIAL_CATALOG.slice(0, 5).map(m => (
                                            <button
                                                key={m.ItemCode}
                                                type="button"
                                                className="tpcs-ii-preset-chip"
                                                onClick={() => handleScanAutoFill(m.ItemCode)}
                                                title={`Scan ${m.ItemName}`}
                                            >
                                                {m.ItemCode}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* DOWN SECTION: LOCATION DETAILS */}
                                <div className="tpcs-ii-4x4-down">
                                    <div className="tpcs-ii-4x4-down-title">
                                        <span>Down: Location Details</span>
                                        <FaMapMarkerAlt style={{ color: "#ef4444" }} />
                                    </div>

                                    <div className="tpcs-ii-location-box">
                                        <div className="tpcs-ii-loc-row">
                                            <span className="tpcs-ii-loc-label">Warehouse:</span>
                                            <span className="tpcs-ii-loc-val">{activeItem4x4?.Warehouse || stores}</span>
                                        </div>
                                        <div className="tpcs-ii-loc-row">
                                            <span className="tpcs-ii-loc-label">Bin Location:</span>
                                            <span className="tpcs-ii-loc-val" style={{ color: "#1976d2", fontWeight: 800 }}>
                                                {activeItem4x4?.Location || "BIN-A-01-01"}
                                            </span>
                                        </div>
                                        <div className="tpcs-ii-loc-row">
                                            <span className="tpcs-ii-loc-label">Rack & Shelf:</span>
                                            <span className="tpcs-ii-loc-val">{activeItem4x4?.Rack} ({activeItem4x4?.Shelf})</span>
                                        </div>
                                        <div className="tpcs-ii-loc-row">
                                            <span className="tpcs-ii-loc-label">Zone:</span>
                                            <span className="tpcs-ii-loc-val">{activeItem4x4?.Zone}</span>
                                        </div>
                                        <div className="tpcs-ii-loc-row">
                                            <span className="tpcs-ii-loc-label">Current Stock:</span>
                                            <span className="tpcs-ii-loc-val" style={{ color: "#16a34a" }}>
                                                {activeItem4x4?.StockQty} {activeItem4x4?.UOM}
                                            </span>
                                        </div>
                                        <div className="tpcs-ii-loc-row">
                                            <span className="tpcs-ii-loc-label">Material & Colour:</span>
                                            <span className="tpcs-ii-loc-val">
                                                {activeItem4x4?.Color} ({activeItem4x4?.ColorCode})
                                            </span>
                                        </div>
                                    </div>

                                    <div className="tpcs-ii-4x4-actions">
                                        <button
                                            type="button"
                                            className="tpcs-ii-4x4-btn-action primary"
                                            onClick={() => setActiveModal("materialSearch")}
                                        >
                                            <FaSearch /> Search Items
                                        </button>
                                        <button
                                            type="button"
                                            className="tpcs-ii-4x4-btn-action"
                                            onClick={() => setActiveModal("sticker4x4")}
                                        >
                                            <FaPrint /> Print 4x4
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ------------------------------------------------------
                           RIGHT SIDE: LINE ITEMS TABLE
                        ------------------------------------------------------- */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="tpcs-ii-table-container">
                                <table className="tpcs-ii-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "32px", textAlign: "center" }}>
                                                <input
                                                    type="checkbox"
                                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                                />
                                            </th>
                                            <th style={{ width: "110px" }}>Issue Type</th>
                                            <th style={{ width: "140px" }}>IO No.</th>
                                            <th style={{ width: "120px" }}>Group</th>
                                            <th style={{ width: "200px" }}>Item <span className="tpcs-ii-req">*</span></th>
                                            <th style={{ width: "160px" }}>Description</th>
                                            <th style={{ width: "120px" }}>Colour</th>
                                            <th style={{ width: "100px" }}>Type & Size</th>
                                            <th style={{ width: "70px" }}>UOM</th>
                                            <th style={{ width: "110px" }}>Location</th>
                                            <th style={{ width: "85px" }}>Stock Qty</th>
                                            <th style={{ width: "95px" }}>Issue Qty <span className="tpcs-ii-req">*</span></th>
                                            <th style={{ width: "85px" }}>Rate</th>
                                            <th style={{ width: "95px" }}>Amount</th>
                                            <th style={{ width: "120px" }}>Remarks</th>
                                            <th style={{ width: "45px", textAlign: "center" }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lines.map((row) => (
                                            <tr key={row.id}>
                                                <td style={{ textAlign: "center" }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={row.selected || false}
                                                        onChange={(e) => handleLineChange(row.id, "selected", e.target.checked)}
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        className="tpcs-ii-tbl-select"
                                                        value={row.issueType}
                                                        onChange={(e) => handleLineChange(row.id, "issueType", e.target.value)}
                                                    >
                                                        <option value="Lot Issue">Lot Issue</option>
                                                        <option value="General Issue">General Issue</option>
                                                        <option value="Direct Issue">Direct Issue</option>
                                                        <option value="Sample Issue">Sample Issue</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <div className="tpcs-ii-tbl-io-group">
                                                        <input
                                                            type="text"
                                                            className="tpcs-ii-tbl-input"
                                                            placeholder="IO No"
                                                            value={row.ioNo}
                                                            onChange={(e) => handleLineChange(row.id, "ioNo", e.target.value)}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="tpcs-ii-addon-btn"
                                                            style={{ height: "27px", padding: "0 6px" }}
                                                            onClick={() => {
                                                                const io = prompt("Enter IO No:", row.ioNo || "IO-9821");
                                                                if (io) handleLineChange(row.id, "ioNo", io);
                                                            }}
                                                        >
                                                            <FaListUl style={{ fontSize: "10px" }} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="tpcs-ii-tbl-input"
                                                        placeholder="Group"
                                                        value={row.group}
                                                        onChange={(e) => handleLineChange(row.id, "group", e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="tpcs-ii-tbl-input"
                                                        placeholder="Type and select Item"
                                                        value={row.item}
                                                        onChange={(e) => handleLineChange(row.id, "item", e.target.value)}
                                                        list={`items-datalist-${row.id}`}
                                                    />
                                                    <datalist id={`items-datalist-${row.id}`}>
                                                        {DEFAULT_MATERIAL_CATALOG.map(it => (
                                                            <option key={it.ItemCode} value={it.ItemName}>
                                                                {it.ItemCode} - {it.GroupName} ({it.Color})
                                                            </option>
                                                        ))}
                                                    </datalist>
                                                </td>
                                                <td>
                                                    <textarea
                                                        className="tpcs-ii-tbl-desc"
                                                        placeholder="Description"
                                                        value={row.description}
                                                        onChange={(e) => handleLineChange(row.id, "description", e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="tpcs-ii-tbl-input"
                                                        placeholder="Colour"
                                                        value={row.colour}
                                                        onChange={(e) => handleLineChange(row.id, "colour", e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="tpcs-ii-tbl-input"
                                                        placeholder="Type & Size"
                                                        value={row.typeSize}
                                                        onChange={(e) => handleLineChange(row.id, "typeSize", e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        className="tpcs-ii-tbl-select"
                                                        value={row.uom}
                                                        onChange={(e) => handleLineChange(row.id, "uom", e.target.value)}
                                                    >
                                                        <option value="PCS">PCS</option>
                                                        <option value="SQFT">SQFT</option>
                                                        <option value="MTR">MTR</option>
                                                        <option value="SET">SET</option>
                                                        <option value="SHEET">SHEET</option>
                                                        <option value="CONE">CONE</option>
                                                        <option value="KGS">KGS</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="tpcs-ii-tbl-input"
                                                        placeholder="Bin Location"
                                                        value={row.location || ""}
                                                        onChange={(e) => handleLineChange(row.id, "location", e.target.value)}
                                                        style={{ fontFamily: "monospace", fontSize: "11px", color: "#1976d2", fontWeight: 600 }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="tpcs-ii-tbl-input"
                                                        value={row.stockQty || 0}
                                                        readOnly
                                                        style={{ background: "#f8fafc", textAlign: "right" }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="tpcs-ii-tbl-input"
                                                        placeholder="0.00"
                                                        value={row.issueQty}
                                                        onChange={(e) => handleLineChange(row.id, "issueQty", e.target.value)}
                                                        style={{ textAlign: "right", fontWeight: 700 }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="tpcs-ii-tbl-input"
                                                        placeholder="0.00"
                                                        value={row.rate}
                                                        onChange={(e) => handleLineChange(row.id, "rate", e.target.value)}
                                                        style={{ textAlign: "right" }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="tpcs-ii-tbl-input"
                                                        value={row.amount ? row.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00"}
                                                        readOnly
                                                        style={{ background: "#f8fafc", textAlign: "right", fontWeight: 700 }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="tpcs-ii-tbl-input"
                                                        placeholder="Line Remark"
                                                        value={row.remarks}
                                                        onChange={(e) => handleLineChange(row.id, "remarks", e.target.value)}
                                                    />
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteLine(row.id)}
                                                        style={{
                                                            background: "transparent",
                                                            border: "none",
                                                            color: "#ef4444",
                                                            cursor: "pointer",
                                                            padding: "2px"
                                                        }}
                                                        title="Remove line"
                                                    >
                                                        <FaTrash style={{ fontSize: "11px" }} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Line Actions */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                                <button
                                    type="button"
                                    className="tpcs-ii-add-line-btn"
                                    onClick={handleAddLine}
                                    style={{ margin: 0 }}
                                >
                                    <FaPlus style={{ fontSize: "11px" }} /> <span>Add Another Line</span>
                                </button>

                                <button
                                    type="button"
                                    className="tpcs-ii-btn-action"
                                    style={{ fontSize: "11.5px" }}
                                    onClick={() => setActiveModal("materialSearch")}
                                >
                                    <FaSearch /> <span>Search & Mark Items (Stock / Req / Balance)</span>
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* ==========================================================
                       FOOTER SECTION (REMARK, MEMO, TOTALS, ACTIONS)
                    =========================================================== */}
                    <div className="tpcs-ii-footer-grid">
                        {/* LEFT: Remark + Attachments */}
                        <div>
                            <label className="tpcs-ii-label">Remark</label>
                            <textarea
                                className="tpcs-ii-textarea"
                                placeholder="Enter Remark"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                            />

                            <div>
                                <button
                                    type="button"
                                    className="tpcs-ii-btn-attach"
                                    onClick={() => setActiveModal("attach")}
                                >
                                    <FaPaperclip />
                                    <span>+ Attachments... {attachments.length > 0 && `(${attachments.length})`}</span>
                                </button>
                            </div>
                        </div>

                        {/* MIDDLE: Memo for internal use */}
                        <div>
                            <label className="tpcs-ii-label">Memo for internal use</label>
                            <textarea
                                className="tpcs-ii-textarea"
                                placeholder="Enter Internal Memo"
                                value={internalMemo}
                                onChange={(e) => setInternalMemo(e.target.value)}
                            />
                        </div>

                        {/* RIGHT: Total + Action Buttons */}
                        <div className="tpcs-ii-footer-right">
                            <div className="tpcs-ii-total-display">
                                <span>Total :</span>
                                <span className="tpcs-ii-total-num">
                                    {totalQty > 0 ? totalQty.toLocaleString() : "0"}
                                </span>
                            </div>

                            <div className="tpcs-ii-actions-row" ref={actionBtnRef}>
                                {/* Save Button */}
                                <button
                                    type="button"
                                    className="tpcs-ii-btn-save"
                                    onClick={handleSave}
                                >
                                    <FaSave /> <span>Save</span>
                                </button>

                                {/* Action Dropdown Button */}
                                <button
                                    type="button"
                                    className="tpcs-ii-btn-action"
                                    onClick={() => setShowActionMenu(prev => !prev)}
                                >
                                    <FaCog /> <span>Action</span> <FaCaretDown />
                                </button>

                                {/* Action Menu */}
                                {showActionMenu && (
                                    <div className="tpcs-ii-action-menu">
                                        <div
                                            className="tpcs-ii-menu-item"
                                            onClick={() => {
                                                setShowActionMenu(false);
                                                setActiveModal("materialSearch");
                                            }}
                                        >
                                            <FaSearch /> <span>Search & Mark Items</span>
                                        </div>
                                        <div
                                            className="tpcs-ii-menu-item"
                                            onClick={() => {
                                                setShowActionMenu(false);
                                                setActiveModal("sticker4x4");
                                            }}
                                        >
                                            <FaQrcode /> <span>Print 4x4 QR Sticker</span>
                                        </div>
                                        <div
                                            className="tpcs-ii-menu-item"
                                            onClick={() => {
                                                setShowActionMenu(false);
                                                setActiveModal("print");
                                            }}
                                        >
                                            <FaPrint /> <span>Print Issue Note</span>
                                        </div>
                                        <div
                                            className="tpcs-ii-menu-item"
                                            onClick={handleResetForm}
                                        >
                                            <FaRedo /> <span>Reset Form</span>
                                        </div>
                                        <div
                                            className="tpcs-ii-menu-item"
                                            onClick={() => {
                                                setShowActionMenu(false);
                                                alert("Exporting line items to Excel...");
                                            }}
                                        >
                                            <FaFileExport /> <span>Export to Excel</span>
                                        </div>
                                    </div>
                                )}

                                {/* View Button (switches to list view) */}
                                <button
                                    type="button"
                                    className="tpcs-ii-btn-view"
                                    onClick={() => setViewMode("list")}
                                >
                                    <FaEye /> <span>View</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================================================
               MODE: REGISTER / LIST VIEW
            =========================================================== */}
            {viewMode === "list" && (
                <div style={{ backgroundColor: "#ffffff" }}>
                    <div style={{ marginBottom: "6px" }}>
                        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1976d2", margin: "0 0 10px 0" }}>
                            Item Issue
                        </h2>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "8px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                            <label style={{ fontSize: "12px", color: "#334155", fontWeight: 600 }}>Associate</label>
                            <input
                                type="text"
                                placeholder="Supplier Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: "220px",
                                    height: "28px",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "3px",
                                    padding: "2px 8px",
                                    fontSize: "12px",
                                    outline: "none"
                                }}
                            />
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => setViewMode("form")}
                                style={{
                                    backgroundColor: "#4caf50",
                                    color: "#ffffff",
                                    border: "none",
                                    borderRadius: "3px",
                                    padding: "6px 14px",
                                    fontSize: "12.5px",
                                    fontWeight: 600,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    cursor: "pointer",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                                }}
                            >
                                <FaPlus style={{ fontSize: "11px" }} />
                                <span>New Item Issue</span>
                            </button>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "12px" }}>
                        <button
                            type="button"
                            onClick={() => {
                                setSavedIssues([...INITIAL_SAVED_ISSUES]);
                                alert("Item issue records reloaded");
                            }}
                            title="Reload"
                            style={{
                                width: "28px",
                                height: "28px",
                                border: "1px solid #cbd5e1",
                                borderRadius: "3px",
                                background: "#ffffff",
                                color: "#475569",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                fontSize: "12px"
                            }}
                        >
                            <FaRedo />
                        </button>
                        <button
                            type="button"
                            title="View Options"
                            style={{
                                width: "28px",
                                height: "28px",
                                border: "1px solid #cbd5e1",
                                borderRadius: "3px",
                                background: "#ffffff",
                                color: "#475569",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                fontSize: "12px"
                            }}
                        >
                            <FaListUl />
                        </button>
                        <button
                            type="button"
                            title="Settings"
                            style={{
                                width: "28px",
                                height: "28px",
                                border: "1px solid #cbd5e1",
                                borderRadius: "3px",
                                background: "#ffffff",
                                color: "#475569",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                fontSize: "12px"
                            }}
                        >
                            <FaCog />
                        </button>
                    </div>

                    <div style={{ width: "100%", overflowX: "auto", border: "1px solid #cbd5e1", borderRadius: "2px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1400px" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#1976d2", color: "#ffffff", textAlign: "left" }}>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)", width: "70px", textAlign: "center" }}>Action</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Issue No</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Updated By</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Updated On</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>JW No.</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Exchange Rate</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Remark</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Date</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Supplier</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Issued By</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Stores</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Memo for internal use</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Currency</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Expiry Date</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>JC No</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)", textAlign: "right" }}>Qty</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, textAlign: "center" }}>No. of rows</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredIssues.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                                        <td style={{ textAlign: "center", padding: "6px 8px", borderRight: "1px solid #f1f5f9" }}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setActiveRecord(item);
                                                    setViewMode("form");
                                                }}
                                                title="View / Edit Record"
                                                style={{
                                                    background: "#e0f2fe",
                                                    border: "1px solid #bae6fd",
                                                    color: "#0284c7",
                                                    borderRadius: "3px",
                                                    padding: "2px 6px",
                                                    cursor: "pointer",
                                                    fontSize: "11px"
                                                }}
                                            >
                                                <FaEye />
                                            </button>
                                        </td>
                                        <td style={{ padding: "6px 10px", fontWeight: 600, color: "#1976d2", borderRight: "1px solid #f1f5f9" }}>{item.issueNo}</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>{item.issuedBy || "Admin"}</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>{item.date}</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>-</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>1.00</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>{item.remark || "-"}</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>{item.date}</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>{item.associate || "-"}</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>{item.issuedBy}</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>{item.stores}</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>{item.internalMemo || "-"}</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>INR</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>-</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>{item.jobcardNo || "-"}</td>
                                        <td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, borderRight: "1px solid #f1f5f9" }}>{item.totalQty.toLocaleString()}</td>
                                        <td style={{ padding: "6px 10px", textAlign: "center" }}>{item.items ? item.items.length : 1}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ==========================================================
               MODAL: SEARCH FROM MATERIAL NAME & COLOUR CODE
               (STOCK WISE, REQUIREMENT WISE, BALANCE WISE, MARK OPTION)
            =========================================================== */}
            {activeModal === "materialSearch" && (
                <div className="tpcs-ii-modal-backdrop" onClick={() => setActiveModal(null)}>
                    <div className="tpcs-ii-modal-content tpcs-ii-search-modal" onClick={e => e.stopPropagation()}>
                        <div className="tpcs-ii-modal-header" style={{ background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <FaSearch />
                                <h3 className="tpcs-ii-modal-title">Search Materials — Stock Wise, Requirement Wise, Balance Wise</h3>
                            </div>
                            <button className="tpcs-ii-modal-close" onClick={() => setActiveModal(null)}><FaTimes /></button>
                        </div>

                        <div className="tpcs-ii-modal-body">
                            {/* Search & Filter Header Row */}
                            <div className="tpcs-ii-search-filters">
                                <div className="tpcs-ii-filter-field">
                                    <label className="tpcs-ii-filter-label">Material Name / Item Code</label>
                                    <input
                                        type="text"
                                        className="tpcs-ii-filter-input"
                                        placeholder="Type material name (e.g. Leather, Rivet, Lining)..."
                                        value={searchMaterialName}
                                        onChange={(e) => setSearchMaterialName(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                <div className="tpcs-ii-filter-field">
                                    <label className="tpcs-ii-filter-label">Colour / Colour Code</label>
                                    <select
                                        className="tpcs-ii-filter-input"
                                        value={searchColour}
                                        onChange={(e) => setSearchColour(e.target.value)}
                                    >
                                        <option value="">-- All Colours --</option>
                                        <option value="BLACK">BLACK (BLK-01 / BLK-02)</option>
                                        <option value="TAN">TAN (TAN-04)</option>
                                        <option value="ANTIQUE BRASS">ANTIQUE BRASS (AB-701)</option>
                                        <option value="WHITE">WHITE (WHT-10)</option>
                                        <option value="NATURAL">NATURAL (NAT-01)</option>
                                        <option value="DARK BROWN">DARK BROWN (DBR-08)</option>
                                    </select>
                                </div>

                                <div className="tpcs-ii-filter-field">
                                    <label className="tpcs-ii-filter-label">Item Group</label>
                                    <select
                                        className="tpcs-ii-filter-input"
                                        value={searchGroup}
                                        onChange={(e) => setSearchGroup(e.target.value)}
                                    >
                                        <option value="">-- All Groups --</option>
                                        <option value="Leather">Leather</option>
                                        <option value="Hardware">Hardware</option>
                                        <option value="Lining">Lining</option>
                                        <option value="Reinforcement">Reinforcement</option>
                                        <option value="Packaging">Packaging</option>
                                        <option value="Thread">Thread</option>
                                    </select>
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchMaterialName("");
                                            setSearchColour("");
                                            setSearchGroup("");
                                        }}
                                        style={{
                                            height: "30px",
                                            padding: "0 10px",
                                            fontSize: "11.5px",
                                            background: "#f1f5f9",
                                            border: "1px solid #cbd5e1",
                                            borderRadius: "3px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>

                            {/* Info bar */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", fontSize: "11.5px", color: "#475569" }}>
                                <div>
                                    Showing <strong>{filteredSearchMaterials.length}</strong> material(s) |
                                    <strong style={{ color: "#0284c7", marginLeft: "4px" }}>{markedItemCodes.length}</strong> marked for issue
                                </div>
                                <div style={{ display: "flex", gap: "6px" }}>
                                    <button
                                        type="button"
                                        onClick={handleMarkAll}
                                        style={{ background: "#e0f2fe", border: "1px solid #bae6fd", color: "#0369a1", padding: "2px 8px", borderRadius: "3px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}
                                    >
                                        {markedItemCodes.length === filteredSearchMaterials.length && filteredSearchMaterials.length > 0 ? "Unmark All" : "Mark All Filtered"}
                                    </button>
                                </div>
                            </div>

                            {/* Search Table with Stock Wise, Requirement Wise, Balance Wise */}
                            <div style={{ maxHeight: "420px", overflowY: "auto", border: "1px solid #cbd5e1", borderRadius: "4px" }}>
                                <table className="tpcs-ii-table" style={{ width: "100%", margin: 0 }}>
                                    <thead style={{ position: "sticky", top: 0, zIndex: 5 }}>
                                        <tr>
                                            <th style={{ width: "50px", textAlign: "center" }}>Mark</th>
                                            <th style={{ width: "95px" }}>Item Code</th>
                                            <th style={{ width: "190px" }}>Material Name</th>
                                            <th style={{ width: "120px" }}>Colour Code</th>
                                            <th style={{ width: "60px" }}>UOM</th>
                                            <th style={{ width: "95px", textAlign: "right" }}>Stock Wise</th>
                                            <th style={{ width: "95px", textAlign: "right" }}>Req Wise</th>
                                            <th style={{ width: "90px", textAlign: "right" }}>Issued</th>
                                            <th style={{ width: "95px", textAlign: "right" }}>Balance Wise</th>
                                            <th style={{ width: "100px" }}>Location</th>
                                            <th style={{ width: "85px", textAlign: "right" }}>Issue Qty</th>
                                            <th style={{ width: "70px", textAlign: "right" }}>Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSearchMaterials.map(m => {
                                            const isMarked = markedItemCodes.includes(m.ItemCode);
                                            const currentIssueQty = searchIssueQtys[m.ItemCode] ?? (m.BalanceQty > 0 ? m.BalanceQty : Math.min(m.StockQty, 50));

                                            return (
                                                <tr
                                                    key={m.ItemCode}
                                                    className={isMarked ? "tpcs-ii-row-marked" : ""}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleToggleMark(m.ItemCode)}
                                                >
                                                    {/* Mark Option Checkbox */}
                                                    <td style={{ textAlign: "center" }} onClick={e => e.stopPropagation()}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isMarked}
                                                            onChange={() => handleToggleMark(m.ItemCode)}
                                                            style={{ cursor: "pointer", width: "15px", height: "15px" }}
                                                        />
                                                    </td>
                                                    <td style={{ fontFamily: "monospace", fontWeight: 700, color: "#0369a1" }}>{m.ItemCode}</td>
                                                    <td style={{ fontWeight: 600 }}>{m.ItemName}</td>
                                                    <td>
                                                        <div className="tpcs-ii-colour-swatch">
                                                            <span className="tpcs-ii-swatch-dot" style={{ backgroundColor: m.hex || "#94a3b8" }} />
                                                            <span>{m.Color} ({m.ColorCode})</span>
                                                        </div>
                                                    </td>
                                                    <td>{m.UOM}</td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <span className="tpcs-ii-badge-stock">{m.StockQty}</span>
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <span className="tpcs-ii-badge-req">{m.ReqQty}</span>
                                                    </td>
                                                    <td style={{ textAlign: "right", color: "#64748b" }}>{m.IssuedQty}</td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <span className="tpcs-ii-badge-balance">{m.BalanceQty}</span>
                                                    </td>
                                                    <td style={{ fontFamily: "monospace", fontSize: "11px", color: "#1976d2", fontWeight: 600 }}>
                                                        {m.Location}
                                                    </td>
                                                    <td style={{ textAlign: "right" }} onClick={e => e.stopPropagation()}>
                                                        <input
                                                            type="number"
                                                            value={currentIssueQty}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setSearchIssueQtys(prev => ({ ...prev, [m.ItemCode]: val }));
                                                            }}
                                                            style={{
                                                                width: "70px",
                                                                height: "24px",
                                                                textAlign: "right",
                                                                padding: "1px 4px",
                                                                fontSize: "11.5px",
                                                                border: "1px solid #cbd5e1",
                                                                borderRadius: "3px",
                                                                fontWeight: 700
                                                            }}
                                                        />
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>₹{m.Rate.toFixed(2)}</td>
                                                </tr>
                                            );
                                        })}
                                        {filteredSearchMaterials.length === 0 && (
                                            <tr>
                                                <td colSpan={12} style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                                                    No materials matched your search criteria. Try modifying your filter.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="tpcs-ii-modal-footer" style={{ justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontSize: "12px", color: "#334155" }}>
                                    Marked: <strong style={{ color: "#0284c7" }}>{markedItemCodes.length}</strong> items
                                </span>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                    type="button"
                                    className="tpcs-ii-btn-view"
                                    onClick={() => setActiveModal(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="tpcs-ii-btn-save"
                                    onClick={handleApplyMarkedItems}
                                    style={{ backgroundColor: "#0284c7" }}
                                    disabled={markedItemCodes.length === 0}
                                >
                                    <FaCheckCircle /> <span>Apply Marked Items to Issue ({markedItemCodes.length})</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================================================
               MODAL: 4x4 THERMAL LABEL STICKER PRINT PREVIEW
            =========================================================== */}
            {activeModal === "sticker4x4" && (
                <div className="tpcs-ii-modal-backdrop" onClick={() => setActiveModal(null)}>
                    <div className="tpcs-ii-modal-content" style={{ width: "460px" }} onClick={e => e.stopPropagation()}>
                        <div className="tpcs-ii-modal-header">
                            <h3 className="tpcs-ii-modal-title">4x4 Thermal Sticker Print Preview</h3>
                            <button className="tpcs-ii-modal-close" onClick={() => setActiveModal(null)}><FaTimes /></button>
                        </div>
                        <div className="tpcs-ii-modal-body" style={{ background: "#f1f5f9", padding: "18px" }}>
                            {/* 4x4 Thermal Sticker Format */}
                            <div className="tpcs-ii-sticker-preview">
                                <div className="tpcs-ii-sticker-header">
                                    <span style={{ fontWeight: 800, fontSize: "13px" }}>V-CONNECT INC.</span>
                                    <span style={{ fontSize: "10px", fontWeight: 700, color: "#1976d2" }}>4" x 4" LABEL</span>
                                </div>

                                {/* Top QR Code & Barcode */}
                                <div className="tpcs-ii-sticker-top-qr">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: generateQRCodeSVG(activeItem4x4?.ItemCode || "LTH-1093", { size: 120 })
                                        }}
                                    />
                                    <div style={{ margin: "4px 0", width: "100%" }}>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: generateBarcodeSVG(activeItem4x4?.Barcode || activeItem4x4?.ItemCode || "BAR-RL-1001", { width: 240, height: 38, showText: true })
                                            }}
                                        />
                                    </div>
                                    <div style={{ fontSize: "11px", fontWeight: 800, textAlign: "center" }}>
                                        {activeItem4x4?.ItemName}
                                    </div>
                                    <div style={{ fontSize: "10px", color: "#334155" }}>
                                        Colour: <strong>{activeItem4x4?.Color} ({activeItem4x4?.ColorCode})</strong> | UOM: <strong>{activeItem4x4?.UOM}</strong>
                                    </div>
                                </div>

                                {/* Down Location */}
                                <div className="tpcs-ii-sticker-down-loc">
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                                        <span>Location:</span>
                                        <strong style={{ fontSize: "12px", color: "#1976d2" }}>{activeItem4x4?.Location}</strong>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                                        <span>Warehouse:</span>
                                        <strong>{activeItem4x4?.Warehouse || stores}</strong>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                                        <span>Rack / Shelf:</span>
                                        <span>{activeItem4x4?.Rack} / {activeItem4x4?.Shelf}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span>Stock Available:</span>
                                        <strong style={{ color: "#16a34a" }}>{activeItem4x4?.StockQty} {activeItem4x4?.UOM}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="tpcs-ii-modal-footer">
                            <button
                                type="button"
                                className="tpcs-ii-btn-save"
                                onClick={() => window.print()}
                            >
                                <FaPrint /> <span>Print 4x4 Sticker</span>
                            </button>
                            <button
                                type="button"
                                className="tpcs-ii-btn-view"
                                onClick={() => setActiveModal(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Requisition Lookup Modal */}
            {activeModal === "requisition" && (
                <div className="tpcs-ii-modal-backdrop" onClick={() => setActiveModal(null)}>
                    <div className="tpcs-ii-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="tpcs-ii-modal-header">
                            <h3 className="tpcs-ii-modal-title">Select Requisition No</h3>
                            <button className="tpcs-ii-modal-close" onClick={() => setActiveModal(null)}><FaTimes /></button>
                        </div>
                        <div className="tpcs-ii-modal-body">
                            <table className="tpcs-ii-table">
                                <thead>
                                    <tr>
                                        <th>Requisition No</th>
                                        <th>Date</th>
                                        <th>Department</th>
                                        <th>Requested By</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {DEFAULT_REQUISITIONS.map(r => (
                                        <tr key={r.reqNo}>
                                            <td style={{ fontWeight: 700, color: "#1976d2" }}>{r.reqNo}</td>
                                            <td>{r.date}</td>
                                            <td>{r.dept}</td>
                                            <td>{r.requestedBy}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="tpcs-ii-btn-save"
                                                    style={{ padding: "3px 10px", fontSize: "11.5px" }}
                                                    onClick={() => {
                                                        setRequisitionNo(r.reqNo);
                                                        setDepartment(r.dept);
                                                        setActiveModal(null);
                                                    }}
                                                >
                                                    Select
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Jobcard Lookup Modal */}
            {activeModal === "jobcard" && (
                <div className="tpcs-ii-modal-backdrop" onClick={() => setActiveModal(null)}>
                    <div className="tpcs-ii-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="tpcs-ii-modal-header">
                            <h3 className="tpcs-ii-modal-title">Select Cutting Slip / Jobcard</h3>
                            <button className="tpcs-ii-modal-close" onClick={() => setActiveModal(null)}><FaTimes /></button>
                        </div>
                        <div className="tpcs-ii-modal-body">
                            <table className="tpcs-ii-table">
                                <thead>
                                    <tr>
                                        <th>Jobcard No</th>
                                        <th>Cutting Slip</th>
                                        <th>Style</th>
                                        <th>Buyer</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {DEFAULT_JOBCARDS.map(j => (
                                        <tr key={j.jcNo}>
                                            <td style={{ fontWeight: 700, color: "#1976d2" }}>{j.jcNo}</td>
                                            <td>{j.slipNo}</td>
                                            <td>{j.style}</td>
                                            <td>{j.buyer}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="tpcs-ii-btn-save"
                                                    style={{ padding: "3px 10px", fontSize: "11.5px" }}
                                                    onClick={() => {
                                                        setJobcardNo(j.jcNo);
                                                        setActiveModal(null);
                                                    }}
                                                >
                                                    Select
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Cutting Plan Lookup Modal */}
            {activeModal === "plan" && (
                <div className="tpcs-ii-modal-backdrop" onClick={() => setActiveModal(null)}>
                    <div className="tpcs-ii-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="tpcs-ii-modal-header">
                            <h3 className="tpcs-ii-modal-title">Select Cutting Plan No</h3>
                            <button className="tpcs-ii-modal-close" onClick={() => setActiveModal(null)}><FaTimes /></button>
                        </div>
                        <div className="tpcs-ii-modal-body">
                            <table className="tpcs-ii-table">
                                <thead>
                                    <tr>
                                        <th>Cutting Plan No</th>
                                        <th>Jobcard No</th>
                                        <th>Date</th>
                                        <th>Pairs</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {DEFAULT_CUTTING_PLANS.map(p => (
                                        <tr key={p.planNo}>
                                            <td style={{ fontWeight: 700, color: "#1976d2" }}>{p.planNo}</td>
                                            <td>{p.jcNo}</td>
                                            <td>{p.date}</td>
                                            <td>{p.pairs}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="tpcs-ii-btn-save"
                                                    style={{ padding: "3px 10px", fontSize: "11.5px" }}
                                                    onClick={() => {
                                                        setCuttingPlanNo(p.planNo);
                                                        if (!jobcardNo) setJobcardNo(p.jcNo);
                                                        setActiveModal(null);
                                                    }}
                                                >
                                                    Select
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Attachments Modal */}
            {activeModal === "attach" && (
                <div className="tpcs-ii-modal-backdrop" onClick={() => setActiveModal(null)}>
                    <div className="tpcs-ii-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="tpcs-ii-modal-header">
                            <h3 className="tpcs-ii-modal-title">Attachments for Item Issue</h3>
                            <button className="tpcs-ii-modal-close" onClick={() => setActiveModal(null)}><FaTimes /></button>
                        </div>
                        <div className="tpcs-ii-modal-body">
                            <div style={{
                                border: "2px dashed #cbd5e1",
                                padding: "24px",
                                textAlign: "center",
                                borderRadius: "6px",
                                marginBottom: "16px"
                            }}>
                                <p style={{ margin: "0 0 10px 0", color: "#64748b", fontSize: "13px" }}>
                                    Drag and drop documents, spec sheets, or inspection photos here
                                </p>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            const fileNames = Array.from(e.target.files).map(f => f.name);
                                            setAttachments(prev => [...prev, ...fileNames]);
                                        }
                                    }}
                                />
                            </div>

                            {attachments.length > 0 && (
                                <div>
                                    <h4 style={{ fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>Attached Files:</h4>
                                    <ul style={{ listStyle: "none", padding: 0 }}>
                                        {attachments.map((file, i) => (
                                            <li key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "3px", marginBottom: "4px", fontSize: "12px" }}>
                                                <span>📎 {file}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                                    style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }}
                                                >
                                                    <FaTimes />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="tpcs-ii-modal-footer">
                            <button type="button" className="tpcs-ii-btn-save" onClick={() => setActiveModal(null)}>Done</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Modal */}
            {activeModal === "print" && (
                <div className="tpcs-ii-modal-backdrop" onClick={() => setActiveModal(null)}>
                    <div className="tpcs-ii-modal-content" style={{ width: "800px" }} onClick={e => e.stopPropagation()}>
                        <div className="tpcs-ii-modal-header">
                            <h3 className="tpcs-ii-modal-title">Item Issue Voucher Print Preview</h3>
                            <button className="tpcs-ii-modal-close" onClick={() => setActiveModal(null)}><FaTimes /></button>
                        </div>
                        <div className="tpcs-ii-modal-body" style={{ background: "#ffffff", padding: "24px" }}>
                            <div style={{ textAlign: "center", borderBottom: "2px solid #0f172a", paddingBottom: "12px", marginBottom: "16px" }}>
                                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800 }}>V-CONNECT INC. ERP</h2>
                                <h3 style={{ margin: "4px 0", fontSize: "16px", color: "#1976d2" }}>ITEM ISSUE VOUCHER</h3>
                                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Plot No. 9B | FY 01-Apr-2026 - 31-Mar-2027</p>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px", marginBottom: "16px" }}>
                                <div><strong>Issue No:</strong> {activeRecord ? activeRecord.issueNo : `${issuePrefix}${issueSerial}`}</div>
                                <div><strong>Date:</strong> {activeRecord ? activeRecord.date : issueDate}</div>
                                <div><strong>Issue To:</strong> {activeRecord ? activeRecord.issueTo : issueTo}</div>
                                <div><strong>Stores:</strong> {activeRecord ? activeRecord.stores : stores}</div>
                                <div><strong>Associate/Supplier:</strong> {activeRecord ? activeRecord.associate : associate || "-"}</div>
                                <div><strong>Department:</strong> {activeRecord ? activeRecord.department : department || "-"}</div>
                            </div>

                            <table className="tpcs-ii-table" style={{ width: "100%", marginBottom: "20px" }}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Item Name</th>
                                        <th>Colour</th>
                                        <th>Location</th>
                                        <th>UOM</th>
                                        <th style={{ textAlign: "right" }}>Qty</th>
                                        <th style={{ textAlign: "right" }}>Rate</th>
                                        <th style={{ textAlign: "right" }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(activeRecord ? activeRecord.items : lines).map((r, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{r.item || r.ItemName}</td>
                                            <td>{r.colour || r.Color || "-"}</td>
                                            <td>{r.location || "BIN-A-01-01"}</td>
                                            <td>{r.uom || r.UOM}</td>
                                            <td style={{ textAlign: "right", fontWeight: 700 }}>{r.issueQty || r.Quantity}</td>
                                            <td style={{ textAlign: "right" }}>{r.rate || r.Rate || 0}</td>
                                            <td style={{ textAlign: "right" }}>{r.amount || r.Amount || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px", fontSize: "12px" }}>
                                <div>
                                    <div style={{ borderTop: "1px solid #94a3b8", width: "160px", textAlign: "center", paddingTop: "4px" }}>
                                        Prepared By ({issuedBy})
                                    </div>
                                </div>
                                <div>
                                    <div style={{ borderTop: "1px solid #94a3b8", width: "160px", textAlign: "center", paddingTop: "4px" }}>
                                        Received By ({receivedBy || "________________"})
                                    </div>
                                </div>
                                <div>
                                    <div style={{ borderTop: "1px solid #94a3b8", width: "160px", textAlign: "center", paddingTop: "4px" }}>
                                        Authorized Signatory
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tpcs-ii-modal-footer">
                            <button type="button" className="tpcs-ii-btn-save" onClick={() => window.print()}>
                                <FaPrint /> <span>Print</span>
                            </button>
                            <button type="button" className="tpcs-ii-btn-view" onClick={() => setActiveModal(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sequence Settings Modal */}
            {activeModal === "settings" && (
                <div className="tpcs-ii-modal-backdrop" onClick={() => setActiveModal(null)}>
                    <div className="tpcs-ii-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="tpcs-ii-modal-header">
                            <h3 className="tpcs-ii-modal-title">Item Issue Numbering Format</h3>
                            <button className="tpcs-ii-modal-close" onClick={() => setActiveModal(null)}><FaTimes /></button>
                        </div>
                        <div className="tpcs-ii-modal-body">
                            <div style={{ marginBottom: "12px" }}>
                                <label className="tpcs-ii-label">Series Prefix</label>
                                <input
                                    type="text"
                                    className="tpcs-ii-input"
                                    value={issuePrefix}
                                    onChange={(e) => setIssuePrefix(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="tpcs-ii-label">Next Serial Number</label>
                                <input
                                    type="text"
                                    className="tpcs-ii-input"
                                    value={issueSerial}
                                    onChange={(e) => setIssueSerial(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="tpcs-ii-modal-footer">
                            <button type="button" className="tpcs-ii-btn-save" onClick={() => setActiveModal(null)}>Save Settings</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
