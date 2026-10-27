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
    FaPaperclip,
    FaPrint,
    FaRedo,
    FaFileExport,
    FaTimes,
    FaSearch,
    FaCheckCircle,
    FaQrcode,
    FaMapMarkerAlt,
    FaBolt,
    FaBoxes,
    FaClipboardList,
    FaExclamationTriangle,
    FaArrowRight
} from "react-icons/fa";
import { generateQRCodeSVG, generateBarcodeSVG } from "../../utils/qrBarcodeUtil";
import "../../styles/itemIssue.css";

const API_URL = process.env.REACT_APP_API_URL || "/api";

// Master Catalog incorporating User Reference Screenshot items & ERP Inventory with Pending IRN mapping
const DEFAULT_MATERIAL_CATALOG = [
    {
        ItemCode: "CRD-1001",
        ItemName: "CARD BOARD",
        IrnNo: "IRN/APP/9B/2627/2401",
        IrnDate: "27-10-2026",
        Department: "Packaging",
        Associate: "Apex Leather Works",
        RequestedBy: "Ramesh Kumar",
        JobcardNo: "JC-4512",
        GroupName: "Packaging",
        Variant: "N/A",
        Color: "NATURAL",
        ColorCode: "N/A",
        SizeRange: "N/A",
        Size: "100",
        UOM: "PCS",
        StockQty: 0,
        ReqQty: 100,
        IssuedQty: 0,
        BalanceQty: 100,
        Rate: 15.0,
        Location: "BIN-D-01-02",
        Warehouse: "PLOT NO. 9B",
        Rack: "Rack D1",
        Shelf: "Level 2",
        Zone: "Zone D - Packaging",
        Barcode: "BAR-CRD-1001",
        SlipId: "000000000000224"
    },
    {
        ItemCode: "SPR-2001",
        ItemName: "SPRING FILE",
        IrnNo: "IRN/APP/9B/2627/2401",
        IrnDate: "27-10-2026",
        Department: "Packaging",
        Associate: "Apex Leather Works",
        RequestedBy: "Ramesh Kumar",
        JobcardNo: "JC-4512",
        GroupName: "Office Stationery",
        Variant: "N/A",
        Color: "BLUE",
        ColorCode: "N/A",
        SizeRange: "N/A",
        Size: "Standard",
        UOM: "PCS",
        StockQty: 50,
        ReqQty: 6,
        IssuedQty: 0,
        BalanceQty: 6,
        Rate: 25.0,
        Location: "BIN-D-01-01",
        Warehouse: "PLOT NO. 9B",
        Rack: "Rack D1",
        Shelf: "Level 1",
        Zone: "Zone D - Stationery",
        Barcode: "BAR-SPR-2001",
        SlipId: "000000000000225"
    },
    {
        ItemCode: "IDX-3001",
        ItemName: "INDEX FILE BIG",
        IrnNo: "IRN/APP/9B/2627/2401",
        IrnDate: "27-10-2026",
        Department: "Packaging",
        Associate: "Apex Leather Works",
        RequestedBy: "Ramesh Kumar",
        JobcardNo: "JC-4512",
        GroupName: "Office Stationery",
        Variant: "N/A",
        Color: "BLACK",
        ColorCode: "N/A",
        SizeRange: "N/A",
        Size: "Big",
        UOM: "PCS",
        StockQty: 40,
        ReqQty: 4,
        IssuedQty: 0,
        BalanceQty: 4,
        Rate: 45.0,
        Location: "BIN-D-01-01",
        Warehouse: "PLOT NO. 9B",
        Rack: "Rack D1",
        Shelf: "Level 1",
        Zone: "Zone D - Stationery",
        Barcode: "BAR-IDX-3001",
        SlipId: "000000000000226"
    },
    {
        ItemCode: "LTH-1093",
        ItemName: "COW CULATTAS SINGLE LEATHER",
        IrnNo: "REQ/AAPL9B/2627/045",
        IrnDate: "25-10-2026",
        Department: "Cutting",
        Associate: "Apex Leather Works",
        RequestedBy: "Ramesh Kumar",
        JobcardNo: "JC-4515",
        GroupName: "Leather",
        Variant: "BLACK (BLK-01)",
        Color: "BLACK",
        ColorCode: "BLK-01",
        SizeRange: "A Grade",
        Size: "1.2-1.4mm",
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
        SlipId: "000000000000227"
    },
    {
        ItemCode: "LTH-1112",
        ItemName: "COW ECO VEG SIDE CRUST LEATHER",
        IrnNo: "REQ/AAPL9B/2627/045",
        IrnDate: "25-10-2026",
        Department: "Cutting",
        Associate: "Apex Leather Works",
        RequestedBy: "Ramesh Kumar",
        JobcardNo: "JC-4515",
        GroupName: "Leather",
        Variant: "TAN (TAN-04)",
        Color: "TAN",
        ColorCode: "TAN-04",
        SizeRange: "Standard",
        Size: "1.4-1.6mm",
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
        SlipId: "000000000000228"
    },
    {
        ItemCode: "RNF-1085",
        ItemName: "HIGH DENSITY TOPLINER 0.4MM",
        IrnNo: "REQ/AAPL9B/2627/042",
        IrnDate: "24-10-2026",
        Department: "Cutting",
        Associate: "K-Tex Textiles",
        RequestedBy: "Nikhil Singh",
        JobcardNo: "JC-4518",
        GroupName: "Lining",
        Variant: "BLACK (BLK-02)",
        Color: "BLACK",
        ColorCode: "BLK-02",
        SizeRange: "Roll",
        Size: "0.4mm",
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
        SlipId: "000000000000230"
    },
    {
        ItemCode: "NONWO5064",
        ItemName: "TALIN 0.3MM WHITE",
        IrnNo: "REQ/AAPL9B/2627/042",
        IrnDate: "24-10-2026",
        Department: "Cutting",
        Associate: "K-Tex Textiles",
        RequestedBy: "Nikhil Singh",
        JobcardNo: "JC-4518",
        GroupName: "Reinforcement",
        Variant: "WHITE (WHT-10)",
        Color: "WHITE",
        ColorCode: "WHT-10",
        SizeRange: "Sheet",
        Size: "0.3mm",
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
        SlipId: "000000000000231"
    },
    {
        ItemCode: "HDW-2236",
        ItemName: "JAM RIVET SINGLE HEAD 7MM",
        IrnNo: "IRN/APP/9B/2627/2402",
        IrnDate: "26-10-2026",
        Department: "Assembly",
        Associate: "Balaji Trims & Fasteners",
        RequestedBy: "Pooja Verma",
        JobcardNo: "JC-4520",
        GroupName: "Hardware",
        Variant: "ANTIQUE BRASS (AB-701)",
        Color: "ANTIQUE BRASS",
        ColorCode: "AB-701",
        SizeRange: "Standard",
        Size: "7mm",
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
        SlipId: "000000000000229"
    },
    {
        ItemCode: "TRM-3012",
        ItemName: "NYLON ZIPPER #5 OPEN END 65CM",
        IrnNo: "IRN/APP/9B/2627/2402",
        IrnDate: "26-10-2026",
        Department: "Stitching",
        Associate: "Balaji Trims & Fasteners",
        RequestedBy: "Sunil Sharma",
        JobcardNo: "JC-4520",
        GroupName: "Trims & Zippers",
        Variant: "NAVY (NVY-05)",
        Color: "NAVY",
        ColorCode: "NVY-05",
        SizeRange: "Open End",
        Size: "65cm",
        UOM: "PCS",
        StockQty: 180,
        ReqQty: 250,
        IssuedQty: 0,
        BalanceQty: 250,
        Rate: 18.5,
        Location: "BIN-C-02-04",
        Warehouse: "ACCESSORIES GODOWN 18",
        Rack: "Rack C2",
        Shelf: "Level 4",
        Zone: "Zone C - Hardware",
        Barcode: "BAR-TRM-3012",
        SlipId: "000000000000232"
    }
];

const DEFAULT_WAREHOUSES = [
    "PLOT NO. 9B",
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
        requisitionNo: "IRN/APP/9B/2627/2401",
        jobcardNo: "JC-4512",
        cuttingPlanNo: "CP-2627-044",
        remark: "Batch 104 Cutting leather issue",
        internalMemo: "Bulk cutting line 1",
        totalQty: 185.5,
        totalAmount: 27872.5,
        status: "Completed",
        items: [
            { id: 1, issueType: "Lot Issue", ioNo: "IRN/APP/9B/2627/2401", group: "Leather", item: "COW CULATTAS SINGLE LEATHER", description: "Upper cutting leather", colour: "BLACK", typeSize: "A Grade", uom: "SQFT", location: "BIN-A-01-01", reqQty: 200, pendingQty: 150, stockQty: 450, issueQty: 120.5, rate: 145, amount: 17472.5, remarks: "Checked by QC" },
            { id: 2, issueType: "Lot Issue", ioNo: "IRN/APP/9B/2627/2401", group: "Leather", item: "COW ECO VEG SIDE CRUST LEATHER", description: "Counter reinforcement", colour: "TAN", typeSize: "Standard", uom: "SQFT", location: "BIN-A-02-01", reqQty: 120, pendingQty: 100, stockQty: 280, issueQty: 65, rate: 160, amount: 10400, remarks: "" }
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
        requisitionNo: "IRN/APP/9B/2627/2402",
        jobcardNo: "JC-4509",
        cuttingPlanNo: "CP-2627-043",
        remark: "Urgent hardware issue",
        internalMemo: "Line 2 assembly run",
        totalQty: 450,
        totalAmount: 832.5,
        status: "Completed",
        items: [
            { id: 1, issueType: "Lot Issue", ioNo: "IRN/APP/9B/2627/2402", group: "Hardware", item: "JAM RIVET SINGLE HEAD 7MM", description: "Riveting section", colour: "ANTIQUE BRASS", typeSize: "7mm", uom: "SET", location: "BIN-C-01-01", reqQty: 1200, pendingQty: 800, stockQty: 5000, issueQty: 450, rate: 1.85, amount: 832.5, remarks: "" }
        ]
    }
];

export default function ItemIssue({ initialMode = "form" }) {
    // View mode: 'form' or 'list'
    const [viewMode, setViewMode] = useState(initialMode);

    // Stateful catalog so pending IRN quantities & stock update dynamically when issues are saved or fetched from API
    const [catalogItems, setCatalogItems] = useState(DEFAULT_MATERIAL_CATALOG);

    // Pending IRN & Stock Display Panel State
    const [showPendingIrnPanel, setShowPendingIrnPanel] = useState(true);
    const [selectedIrnFilter, setSelectedIrnFilter] = useState("ALL");
    const [pendingSearchQuery, setPendingSearchQuery] = useState("");
    const [stockStatusFilter, setStockStatusFilter] = useState("ALL"); // ALL | IN_STOCK | LOW_STOCK | OUT_STOCK

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

    const [associate, setAssociate] = useState("Apex Leather Works");
    const [receivedBy, setReceivedBy] = useState("Ramesh Kumar");
    const [department, setDepartment] = useState("Packaging");
    const [stores, setStores] = useState("PLOT NO. 9B");
    const [issuedBy, setIssuedBy] = useState("Admin");
    const [requisitionNo, setRequisitionNo] = useState("IRN/APP/9B/2627/2401");
    const [jobcardNo, setJobcardNo] = useState("JC-4512");
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
    // REQUISITION ITEMS MODAL STATE (EXACT USER REFERENCE SCREENSHOT 2)
    // =========================================================================
    const [reqFilterItem, setReqFilterItem] = useState("");
    const [reqFilterVariant, setReqFilterVariant] = useState("");
    const [reqFilterSizeRange, setReqFilterSizeRange] = useState("");
    const [reqFilterSize, setReqFilterSize] = useState("");
    const [reqFilterReqQty, setReqFilterReqQty] = useState("");
    const [reqFilterStock, setReqFilterStock] = useState("");
    const [reqFilterAlreadyIssued, setReqFilterAlreadyIssued] = useState("");
    const [reqFilterBalToIssue, setReqFilterBalToIssue] = useState("");
    const [reqFilterIssueQty, setReqFilterIssueQty] = useState("");
    const [modalIrnFilter, setModalIrnFilter] = useState("ALL");

    const [tickedItemCodes, setTickedItemCodes] = useState(["CRD-1001", "SPR-2001", "IDX-3001"]);
    const [rowIssueQtys, setRowIssueQtys] = useState({
        "CRD-1001": 100,
        "SPR-2001": 6,
        "IDX-3001": 4
    });

    // Table Lines State
    const [lines, setLines] = useState([
        {
            id: 1,
            selected: false,
            issueType: "Lot Issue",
            ioNo: "IRN/APP/9B/2627/2401",
            group: "Packaging",
            item: "CARD BOARD",
            itemCode: "CRD-1001",
            description: "Cardboard material for IRN/APP/9B/2627/2401",
            colour: "N/A",
            typeSize: "100",
            uom: "PCS",
            location: "BIN-D-01-02",
            reqQty: 100,
            pendingQty: 100,
            stockQty: 0,
            issueQty: 100,
            rate: 15.0,
            amount: 1500.0,
            remarks: "Pending IRN issue"
        },
        {
            id: 2,
            selected: false,
            issueType: "Lot Issue",
            ioNo: "IRN/APP/9B/2627/2401",
            group: "Office Stationery",
            item: "SPRING FILE",
            itemCode: "SPR-2001",
            description: "Spring File for IRN/APP/9B/2627/2401",
            colour: "BLUE",
            typeSize: "Standard",
            uom: "PCS",
            location: "BIN-D-01-01",
            reqQty: 6,
            pendingQty: 6,
            stockQty: 50,
            issueQty: 6,
            rate: 25.0,
            amount: 150.0,
            remarks: "Pending IRN issue"
        },
        {
            id: 3,
            selected: false,
            issueType: "Lot Issue",
            ioNo: "IRN/APP/9B/2627/2401",
            group: "Office Stationery",
            item: "INDEX FILE BIG",
            itemCode: "IDX-3001",
            description: "Index File Big for IRN/APP/9B/2627/2401",
            colour: "BLACK",
            typeSize: "Big",
            uom: "PCS",
            location: "BIN-D-01-01",
            reqQty: 4,
            pendingQty: 4,
            stockQty: 40,
            issueQty: 4,
            rate: 45.0,
            amount: 180.0,
            remarks: "Pending IRN issue"
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

    // Modals: 'requisitionItems' | 'pickingSlip' | 'attach' | 'settings' | 'print'
    const [activeModal, setActiveModal] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    // Load registered lists, live stock & pending IRNs from backend on mount
    useEffect(() => {
        let mounted = true;

        // 1. Fetch Item Issues Register
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

        // 2. Fetch Live Items Stock from /api/items to enrich StockQty if available
        axios.get(`${API_URL}/items`)
            .then(res => {
                const itemsData = res.data?.data || res.data;
                if (mounted && Array.isArray(itemsData) && itemsData.length > 0) {
                    setCatalogItems(prev => prev.map(cat => {
                        const match = itemsData.find(dbIt =>
                            (dbIt.ItemCode && dbIt.ItemCode.toLowerCase() === cat.ItemCode.toLowerCase()) ||
                            (dbIt.ItemName && dbIt.ItemName.toLowerCase() === cat.ItemName.toLowerCase())
                        );
                        if (match && (match.CurrentStock !== undefined || match.OpeningStock !== undefined)) {
                            const liveStock = Number(match.CurrentStock ?? match.OpeningStock ?? cat.StockQty);
                            return { ...cat, StockQty: liveStock };
                        }
                        return cat;
                    }));
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

    // =========================================================================
    // COMPUTED PENDING IRN SUMMARIES & PENDING ITEMS WITH LIVE STOCK
    // =========================================================================
    const pendingIrnSummaries = React.useMemo(() => {
        const map = new Map();
        catalogItems.forEach(item => {
            const irn = item.IrnNo || "IRN/APP/9B/2627/2401";
            if (!map.has(irn)) {
                map.set(irn, {
                    irnNo: irn,
                    date: item.IrnDate || "27-10-2026",
                    department: item.Department || "Production",
                    associate: item.Associate || "Apex Leather Works",
                    requestedBy: item.RequestedBy || "Ramesh Kumar",
                    warehouse: item.Warehouse || "RAW MATERIAL STORE 9B",
                    jobcardNo: item.JobcardNo || "JC-4512",
                    totalItems: 0,
                    pendingItemsCount: 0,
                    totalReqQty: 0,
                    totalIssuedQty: 0,
                    totalPendingQty: 0,
                    items: []
                });
            }
            const group = map.get(irn);
            group.totalItems += 1;
            if (item.BalanceQty > 0) {
                group.pendingItemsCount += 1;
            }
            group.totalReqQty += Number(item.ReqQty || 0);
            group.totalIssuedQty += Number(item.IssuedQty || 0);
            group.totalPendingQty += Number(item.BalanceQty || 0);
            group.items.push(item);
        });

        return Array.from(map.values()).map(g => ({
            ...g,
            status: g.totalPendingQty <= 0
                ? "Completed"
                : g.totalIssuedQty > 0
                    ? "Partial Issue"
                    : "Pending"
        }));
    }, [catalogItems]);

    // Filtered items for the live "What is Pending & Stock of That Item" table
    const displayedPendingItems = React.useMemo(() => {
        return catalogItems.filter(item => {
            const matchIrn = selectedIrnFilter === "ALL" || item.IrnNo === selectedIrnFilter;
            const q = pendingSearchQuery.trim().toLowerCase();
            const matchQuery = !q ||
                item.ItemName.toLowerCase().includes(q) ||
                item.ItemCode.toLowerCase().includes(q) ||
                (item.IrnNo && item.IrnNo.toLowerCase().includes(q)) ||
                (item.Variant && item.Variant.toLowerCase().includes(q)) ||
                (item.Color && item.Color.toLowerCase().includes(q)) ||
                (item.Location && item.Location.toLowerCase().includes(q));

            let matchStock = true;
            if (stockStatusFilter === "IN_STOCK") {
                matchStock = item.StockQty >= item.BalanceQty && item.StockQty > 0;
            } else if (stockStatusFilter === "LOW_STOCK") {
                matchStock = item.StockQty > 0 && item.StockQty < item.BalanceQty;
            } else if (stockStatusFilter === "OUT_STOCK") {
                matchStock = item.StockQty <= 0;
            }

            return matchIrn && matchQuery && matchStock;
        });
    }, [catalogItems, selectedIrnFilter, pendingSearchQuery, stockStatusFilter]);

    // Overall Pending KPIs
    const totalPendingIrnsCount = pendingIrnSummaries.filter(g => g.totalPendingQty > 0).length;
    const totalPendingItemsCount = catalogItems.filter(i => i.BalanceQty > 0).length;
    const totalPendingUnits = catalogItems.reduce((acc, i) => acc + (Number(i.BalanceQty) || 0), 0);
    const inStockReadyItemsCount = catalogItems.filter(i => i.BalanceQty > 0 && i.StockQty >= i.BalanceQty).length;

    // Auto-calculate totals for current form lines
    const totalQty = lines.reduce((acc, row) => acc + (parseFloat(row.issueQty) || 0), 0);
    const totalAmount = lines.reduce((acc, row) => acc + (parseFloat(row.amount) || 0), 0);

    // =========================================================================
    // SELECT A PENDING IRN OR LOAD ITS PENDING ITEMS INTO ISSUE FORM
    // =========================================================================
    const handleSelectPendingIrn = (irnSummary, autoLoadToTable = false) => {
        setSelectedIrnFilter(irnSummary.irnNo);
        setRequisitionNo(irnSummary.irnNo);
        setDepartment(irnSummary.department);
        setStores(irnSummary.warehouse);
        setAssociate(irnSummary.associate);
        setReceivedBy(irnSummary.requestedBy);
        if (irnSummary.jobcardNo) {
            setJobcardNo(irnSummary.jobcardNo);
        }

        const pendingItemsForIrn = irnSummary.items.filter(it => it.BalanceQty > 0);
        const itemsToUse = pendingItemsForIrn.length > 0 ? pendingItemsForIrn : irnSummary.items;

        if (itemsToUse.length > 0) {
            setActiveItem4x4(itemsToUse[0]);
            setTickedItemCodes(itemsToUse.map(m => m.ItemCode));
            const newQtys = { ...rowIssueQtys };
            itemsToUse.forEach(m => {
                newQtys[m.ItemCode] = m.BalanceQty > 0 ? m.BalanceQty : m.ReqQty;
            });
            setRowIssueQtys(newQtys);
        }

        if (autoLoadToTable && itemsToUse.length > 0) {
            const loadedLines = itemsToUse.map((m, idx) => {
                const qty = m.BalanceQty > 0 ? m.BalanceQty : (m.ReqQty || 1);
                return {
                    id: idx + 1,
                    selected: false,
                    issueType: "Lot Issue",
                    ioNo: m.IrnNo,
                    group: m.GroupName,
                    item: m.ItemName,
                    itemCode: m.ItemCode,
                    description: `${m.ItemName} [${m.Variant}] - IRN: ${m.IrnNo}`,
                    colour: m.Variant || m.Color,
                    typeSize: m.Size || m.SizeRange,
                    uom: m.UOM,
                    location: m.Location,
                    reqQty: m.ReqQty,
                    pendingQty: m.BalanceQty,
                    stockQty: m.StockQty,
                    issueQty: qty,
                    rate: m.Rate,
                    amount: parseFloat((qty * m.Rate).toFixed(2)),
                    remarks: `Pending IRN ${m.IrnNo} (Stock: ${m.StockQty} ${m.UOM})`
                };
            });
            setLines(loadedLines);
            setAutoFillToast(`Loaded ${loadedLines.length} pending item(s) from ${irnSummary.irnNo} into Item Issue!`);
            setTimeout(() => setAutoFillToast(""), 4500);
        }
    };

    // Issue a single pending item directly from the Pending IRN table
    const handleIssueSinglePendingItem = (m) => {
        setActiveItem4x4(m);
        setRequisitionNo(m.IrnNo || requisitionNo);
        if (m.Department) setDepartment(m.Department);
        if (m.Warehouse) setStores(m.Warehouse);
        if (m.Associate) setAssociate(m.Associate);
        if (m.RequestedBy) setReceivedBy(m.RequestedBy);

        const qtyToIssue = parseFloat(rowIssueQtys[m.ItemCode]) || (m.BalanceQty > 0 ? m.BalanceQty : m.ReqQty || 1);

        setLines(prev => {
            const existingNonEmpty = prev.filter(r => r.item && r.item.trim() !== "");
            const existingIdx = existingNonEmpty.findIndex(r => r.itemCode === m.ItemCode || r.item === m.ItemName);

            const newLineObj = {
                id: existingIdx !== -1
                    ? existingNonEmpty[existingIdx].id
                    : (existingNonEmpty.length > 0 ? Math.max(...existingNonEmpty.map(l => l.id)) + 1 : 1),
                selected: false,
                issueType: "Lot Issue",
                ioNo: m.IrnNo || requisitionNo,
                group: m.GroupName,
                item: m.ItemName,
                itemCode: m.ItemCode,
                description: `${m.ItemName} [${m.Variant}] - Loc: ${m.Location}`,
                colour: m.Variant || m.Color,
                typeSize: m.Size || m.SizeRange,
                uom: m.UOM,
                location: m.Location,
                reqQty: m.ReqQty,
                pendingQty: m.BalanceQty,
                stockQty: m.StockQty,
                issueQty: qtyToIssue,
                rate: m.Rate,
                amount: parseFloat((qtyToIssue * m.Rate).toFixed(2)),
                remarks: `Pending IRN ${m.IrnNo} | Bal: ${m.BalanceQty} | Stock: ${m.StockQty}`
            };

            if (existingIdx !== -1) {
                const copy = [...existingNonEmpty];
                copy[existingIdx] = newLineObj;
                return copy;
            }
            return [...existingNonEmpty, newLineObj];
        });

        setAutoFillToast(`Added ${m.ItemName} (Pending: ${m.BalanceQty} ${m.UOM}, Stock: ${m.StockQty} ${m.UOM}) from ${m.IrnNo}!`);
        setTimeout(() => setAutoFillToast(""), 4000);
    };

    // =========================================================================
    // AUTO FILL LOGIC ON SCAN / CODE ENTRY
    // =========================================================================
    const handleScanAutoFill = (inputCode) => {
        const query = (inputCode || scanInput).trim();
        if (!query) return;

        setScanLaserActive(true);
        setTimeout(() => setScanLaserActive(false), 800);

        const matched = catalogItems.find(m =>
            m.ItemCode.toLowerCase() === query.toLowerCase() ||
            (m.Barcode && m.Barcode.toLowerCase() === query.toLowerCase()) ||
            (m.Location && m.Location.toLowerCase() === query.toLowerCase()) ||
            (m.IrnNo && m.IrnNo.toLowerCase() === query.toLowerCase()) ||
            m.ItemName.toLowerCase().includes(query.toLowerCase())
        );

        if (matched) {
            setActiveItem4x4(matched);
            if (matched.IrnNo) setRequisitionNo(matched.IrnNo);

            setLines(prev => {
                const emptyIdx = prev.findIndex(r => !r.item || r.item.trim() === "");
                const targetIssueQty = matched.BalanceQty > 0 ? matched.BalanceQty : (matched.StockQty > 0 ? matched.StockQty : 1);
                const newRow = {
                    id: emptyIdx !== -1 ? prev[emptyIdx].id : (prev.length > 0 ? Math.max(...prev.map(l => l.id)) + 1 : 1),
                    selected: false,
                    issueType: "Lot Issue",
                    ioNo: matched.IrnNo || requisitionNo || "IO-9821",
                    group: matched.GroupName,
                    item: matched.ItemName,
                    itemCode: matched.ItemCode,
                    description: `${matched.ItemName} - Location: ${matched.Location}`,
                    colour: matched.Variant || matched.Color,
                    typeSize: matched.Size || matched.SizeRange,
                    uom: matched.UOM,
                    location: matched.Location,
                    reqQty: matched.ReqQty,
                    pendingQty: matched.BalanceQty,
                    stockQty: matched.StockQty,
                    issueQty: targetIssueQty,
                    rate: matched.Rate,
                    amount: parseFloat((targetIssueQty * matched.Rate).toFixed(2)),
                    remarks: `Auto-filled via QR/Barcode [${query}]`
                };

                if (emptyIdx !== -1) {
                    const copy = [...prev];
                    copy[emptyIdx] = newRow;
                    return copy;
                }
                return [...prev, newRow];
            });

            setAutoFillToast(`Auto-filled: ${matched.ItemName} (Pending: ${matched.BalanceQty} ${matched.UOM}, Stock: ${matched.StockQty} ${matched.UOM})`);
            setTimeout(() => setAutoFillToast(""), 4500);
            setScanInput("");
        } else {
            alert(`No material or IRN found matching '${query}'.`);
        }
    };

    // =========================================================================
    // REQUISITION ITEMS MODAL FILTERING & TICK SELECTION (SCREENSHOT 2)
    // =========================================================================
    const filteredReqMaterials = catalogItems.filter(m => {
        const matchIrn = modalIrnFilter === "ALL" || m.IrnNo === modalIrnFilter;
        const matchItem = !reqFilterItem || m.ItemName.toLowerCase().includes(reqFilterItem.toLowerCase()) || m.ItemCode.toLowerCase().includes(reqFilterItem.toLowerCase()) || (m.IrnNo && m.IrnNo.toLowerCase().includes(reqFilterItem.toLowerCase()));
        const matchVariant = !reqFilterVariant || m.Variant.toLowerCase().includes(reqFilterVariant.toLowerCase());
        const matchSizeRange = !reqFilterSizeRange || m.SizeRange.toLowerCase().includes(reqFilterSizeRange.toLowerCase());
        const matchSize = !reqFilterSize || String(m.Size).toLowerCase().includes(reqFilterSize.toLowerCase());
        const matchReq = !reqFilterReqQty || String(m.ReqQty).includes(reqFilterReqQty);
        const matchStock = !reqFilterStock || String(m.StockQty).includes(reqFilterStock);
        const matchAlready = !reqFilterAlreadyIssued || String(m.IssuedQty).includes(reqFilterAlreadyIssued);
        const matchBal = !reqFilterBalToIssue || String(m.BalanceQty).includes(reqFilterBalToIssue);
        return matchIrn && matchItem && matchVariant && matchSizeRange && matchSize && matchReq && matchStock && matchAlready && matchBal;
    });

    const handleResetReqFilters = () => {
        setReqFilterItem("");
        setReqFilterVariant("");
        setReqFilterSizeRange("");
        setReqFilterSize("");
        setReqFilterReqQty("");
        setReqFilterStock("");
        setReqFilterAlreadyIssued("");
        setReqFilterBalToIssue("");
        setReqFilterIssueQty("");
        setModalIrnFilter("ALL");
    };

    const handleToggleReqTick = (itemCode) => {
        setTickedItemCodes(prev => {
            const exists = prev.includes(itemCode);
            if (exists) {
                return prev.filter(c => c !== itemCode);
            } else {
                const target = catalogItems.find(m => m.ItemCode === itemCode);
                if (target && !rowIssueQtys[itemCode]) {
                    setRowIssueQtys(q => ({
                        ...q,
                        [itemCode]: target.BalanceQty > 0 ? target.BalanceQty : target.ReqQty
                    }));
                }
                return [...prev, itemCode];
            }
        });

        // Update 4x4 card preview on selection
        const target = catalogItems.find(m => m.ItemCode === itemCode);
        if (target) {
            setActiveItem4x4(target);
        }
    };

    const handleSelectAllReq = () => {
        if (tickedItemCodes.length === filteredReqMaterials.length) {
            setTickedItemCodes([]);
        } else {
            setTickedItemCodes(filteredReqMaterials.map(m => m.ItemCode));
            const newQtys = { ...rowIssueQtys };
            filteredReqMaterials.forEach(m => {
                if (!newQtys[m.ItemCode]) {
                    newQtys[m.ItemCode] = m.BalanceQty > 0 ? m.BalanceQty : m.ReqQty;
                }
            });
            setRowIssueQtys(newQtys);
        }
    };

    // Green [ Save ] button action in Requisition Items Modal / Pending IRN Table
    const handleSaveReqItems = () => {
        if (tickedItemCodes.length === 0) {
            alert("Please tick at least one checkbox to select the pending items you want to issue.");
            return;
        }

        const selectedItems = catalogItems.filter(m => tickedItemCodes.includes(m.ItemCode));

        setLines(() => {
            let maxId = 0;
            return selectedItems.map(m => {
                maxId += 1;
                const qty = parseFloat(rowIssueQtys[m.ItemCode]) || (m.BalanceQty > 0 ? m.BalanceQty : m.ReqQty || 1);
                return {
                    id: maxId,
                    selected: false,
                    issueType: "Lot Issue",
                    ioNo: m.IrnNo || requisitionNo || "IO-9821",
                    group: m.GroupName,
                    item: m.ItemName,
                    itemCode: m.ItemCode,
                    description: `${m.ItemName} [${m.Variant}] - Loc: ${m.Location}`,
                    colour: m.Variant || m.Color,
                    typeSize: m.Size || m.SizeRange,
                    uom: m.UOM,
                    location: m.Location,
                    reqQty: m.ReqQty,
                    pendingQty: m.BalanceQty,
                    stockQty: m.StockQty,
                    issueQty: qty,
                    rate: m.Rate,
                    amount: parseFloat((qty * m.Rate).toFixed(2)),
                    remarks: `Issued against pending IRN ${m.IrnNo || requisitionNo}`
                };
            });
        });

        if (selectedItems.length > 0) {
            setActiveItem4x4(selectedItems[0]);
            if (selectedItems[0].IrnNo) {
                setRequisitionNo(selectedItems[0].IrnNo);
            }
        }

        setAutoFillToast(`Loaded ${selectedItems.length} pending IRN item(s) with stock details into Item Issue!`);
        setTimeout(() => setAutoFillToast(""), 4500);
        setActiveModal(null);
    };

    // Line items change handler
    const handleLineChange = (id, field, value) => {
        setLines(prev => prev.map(row => {
            if (row.id !== id) return row;
            const updated = { ...row, [field]: value };

            if (field === "item") {
                const found = catalogItems.find(it =>
                    it.ItemName.toLowerCase() === String(value).toLowerCase() ||
                    it.ItemCode.toLowerCase() === String(value).toLowerCase()
                );
                if (found) {
                    updated.item = found.ItemName;
                    updated.itemCode = found.ItemCode;
                    updated.ioNo = found.IrnNo || updated.ioNo || requisitionNo;
                    updated.group = found.GroupName || updated.group;
                    updated.colour = found.Variant || found.Color || updated.colour;
                    updated.typeSize = found.Size || found.SizeRange || updated.typeSize;
                    updated.uom = found.UOM || updated.uom;
                    updated.location = found.Location || updated.location;
                    updated.reqQty = found.ReqQty || 0;
                    updated.pendingQty = found.BalanceQty || 0;
                    updated.stockQty = found.StockQty || 0;
                    updated.issueQty = found.BalanceQty > 0 ? found.BalanceQty : (updated.issueQty || 1);
                    updated.rate = found.Rate || updated.rate;
                    if (updated.issueQty && updated.rate) {
                        updated.amount = parseFloat((parseFloat(updated.issueQty) * parseFloat(updated.rate)).toFixed(2));
                    }
                    setActiveItem4x4(found);
                }
            }

            if (field === "issueQty" || field === "rate") {
                const qty = field === "issueQty" ? parseFloat(value) || 0 : parseFloat(row.issueQty) || 0;
                const rate = field === "rate" ? parseFloat(value) || 0 : parseFloat(row.rate) || 0;
                updated.amount = parseFloat((qty * rate).toFixed(2));
            }

            return updated;
        }));
    };

    const handleAddLine = () => {
        const nextId = lines.length > 0 ? Math.max(...lines.map(l => l.id)) + 1 : 1;
        setLines(prev => [
            ...prev,
            {
                id: nextId,
                selected: false,
                issueType: "Lot Issue",
                ioNo: requisitionNo || "",
                group: "",
                item: "",
                description: "",
                colour: "",
                typeSize: "",
                uom: "PCS",
                location: "",
                reqQty: 0,
                pendingQty: 0,
                stockQty: 0,
                issueQty: "",
                rate: "",
                amount: 0,
                remarks: ""
            }
        ]);
    };

    const handleDeleteLine = (id) => {
        if (lines.length <= 1) {
            setLines([{
                id: 1,
                selected: false,
                issueType: "Lot Issue",
                ioNo: requisitionNo || "",
                group: "",
                item: "",
                description: "",
                colour: "",
                typeSize: "",
                uom: "PCS",
                location: "",
                reqQty: 0,
                pendingQty: 0,
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

    const handleSelectAll = (checked) => {
        setLines(prev => prev.map(r => ({ ...r, selected: checked })));
    };

    // Display button action
    const handleDisplay = () => {
        setActiveModal("requisitionItems");
    };

    // Save Item Issue & dynamically update Pending IRN Balance & Stock
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

        // Dynamically update Pending IRN IssuedQty, BalanceQty (Pending) and StockQty
        setCatalogItems(prevCatalog => prevCatalog.map(cat => {
            const issuedLine = validLines.find(
                l => (l.itemCode && l.itemCode === cat.ItemCode) ||
                     (l.item && l.item.toLowerCase() === cat.ItemName.toLowerCase())
            );
            if (!issuedLine) return cat;
            const qtyIssuedNow = parseFloat(issuedLine.issueQty) || 0;
            const newIssued = Number(cat.IssuedQty || 0) + qtyIssuedNow;
            const newBalance = Math.max(0, Number(cat.ReqQty || 0) - newIssued);
            const newStock = Math.max(0, Number(cat.StockQty || 0) - qtyIssuedNow);
            const updatedCat = {
                ...cat,
                IssuedQty: newIssued,
                BalanceQty: newBalance,
                StockQty: newStock
            };
            if (activeItem4x4 && activeItem4x4.ItemCode === cat.ItemCode) {
                setActiveItem4x4(updatedCat);
            }
            return updatedCat;
        }));

        // Also update the current lines' pendingQty & stockQty to reflect post-issue state
        setLines(prevLines => prevLines.map(l => {
            const qtyIssuedNow = parseFloat(l.issueQty) || 0;
            return {
                ...l,
                pendingQty: Math.max(0, (Number(l.pendingQty) || 0) - qtyIssuedNow),
                stockQty: Math.max(0, (Number(l.stockQty) || 0) - qtyIssuedNow)
            };
        }));

        setSavedIssues(prev => [newRecord, ...prev]);
        setSuccessMessage(`Item Issue ${fullIssueNo} saved against IRN ${requisitionNo || "Direct"}! Pending IRN & Stock balances updated.`);
        setIssueSerial(prev => String(parseInt(prev, 10) + 1));
        setTimeout(() => setSuccessMessage(""), 5000);
    };

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
                reqQty: 0,
                pendingQty: 0,
                stockQty: 0,
                issueQty: "",
                rate: "",
                amount: 0,
                remarks: ""
            }
        ]);
        setShowActionMenu(false);
    };

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

    // Helper to render Stock Status Pill for any item
    const renderStockBadge = (stockQty, pendingQty, uom = "") => {
        const s = Number(stockQty) || 0;
        const p = Number(pendingQty) || 0;
        if (s <= 0) {
            return (
                <span className="tpcs-stock-pill out-stock" title="Out of Stock in Warehouse">
                    <FaExclamationTriangle style={{ fontSize: "10px" }} />
                    <span>0 {uom} (Out of Stock)</span>
                </span>
            );
        }
        if (p > 0 && s < p) {
            return (
                <span className="tpcs-stock-pill low-stock" title="Stock is less than Pending IRN Qty">
                    <FaBoxes style={{ fontSize: "10px" }} />
                    <span>{s} {uom} (Partial Stock)</span>
                </span>
            );
        }
        return (
            <span className="tpcs-stock-pill in-stock" title="Sufficient Stock Available to Issue">
                <FaCheckCircle style={{ fontSize: "10px" }} />
                <span>{s} {uom} (In Stock)</span>
            </span>
        );
    };

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
               MODE: FORM VIEW (ITEM ISSUE WITH PENDING IRN, STOCK & 4x4 QR)
            =========================================================== */}
            {viewMode === "form" && (
                <div>
                    {/* Header: Title + Option Buttons */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                            <h1 className="tpcs-ii-title" style={{ margin: 0 }}>Item Issue</h1>
                            <span style={{
                                background: "#fef3c7",
                                color: "#b45309",
                                border: "1px solid #fcd34d",
                                padding: "2px 9px",
                                borderRadius: "12px",
                                fontSize: "11px",
                                fontWeight: 700,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px"
                            }}>
                                <FaClipboardList /> Pending IRNs: {totalPendingIrnsCount} ({totalPendingItemsCount} Items Pending)
                            </span>
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

                        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                            {/* Option Button: Toggle Pending IRN & Stock Panel */}
                            <button
                                type="button"
                                className="tpcs-ii-btn-view"
                                onClick={() => setShowPendingIrnPanel(prev => !prev)}
                                title="Toggle Pending IRN to Issue & Item Stock Panel"
                                style={{
                                    backgroundColor: showPendingIrnPanel ? "#0f172a" : "#f1f5f9",
                                    color: showPendingIrnPanel ? "#ffffff" : "#334155",
                                    borderColor: showPendingIrnPanel ? "#0f172a" : "#cbd5e1"
                                }}
                            >
                                <FaClipboardList />
                                <span>Pending IRN & Stock: {showPendingIrnPanel ? "ON" : "OFF"}</span>
                            </button>

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

                            {/* Option Button: Requisition Items (Exact Screenshot 2) */}
                            <button
                                type="button"
                                className="tpcs-ii-btn-save"
                                onClick={() => setActiveModal("requisitionItems")}
                                title="Requisition Items - Select items you want to issue with Mark option"
                                style={{ backgroundColor: "#1976d2" }}
                            >
                                <FaSearch />
                                <span>Requisition Items</span>
                            </button>

                            {/* Option Button: Print Picking Slip (Exact Screenshot 1) */}
                            <button
                                type="button"
                                className="tpcs-ii-btn-view"
                                onClick={() => setActiveModal("pickingSlip")}
                                title="Print Picking Slip with Top QR & Down Location"
                            >
                                <FaPrint />
                                <span>Picking Slip</span>
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

                        {/* ROW 2 - COL 4: Requisition No (Pending IRN Selector) */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">
                                Requisition No (Pending IRN)
                            </label>
                            <div className="tpcs-ii-input-group">
                                <input
                                    type="text"
                                    className="tpcs-ii-input"
                                    placeholder="Select Pending IRN No"
                                    value={requisitionNo}
                                    onChange={(e) => setRequisitionNo(e.target.value)}
                                    list="pending-irns-datalist"
                                    style={{ fontWeight: 700, color: "#1976d2" }}
                                />
                                <datalist id="pending-irns-datalist">
                                    {pendingIrnSummaries.map(irn => (
                                        <option key={irn.irnNo} value={irn.irnNo}>
                                            {irn.department} | Pending Qty: {irn.totalPendingQty} ({irn.status})
                                        </option>
                                    ))}
                                </datalist>
                                <button
                                    type="button"
                                    className="tpcs-ii-addon-btn"
                                    title="View Requisition Items"
                                    onClick={() => setActiveModal("requisitionItems")}
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
                                    title="View Items for Jobcard"
                                    onClick={() => setActiveModal("requisitionItems")}
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
                                    onClick={() => setActiveModal("requisitionItems")}
                                >
                                    <FaListUl />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Display Button Row (Screenshot 2) */}
                    <div className="tpcs-ii-display-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <button
                                type="button"
                                className="tpcs-ii-btn-display"
                                onClick={handleDisplay}
                                title="Open Requisition Items Modal"
                            >
                                Display
                            </button>
                            <span style={{ fontSize: "12px", color: "#475569", fontWeight: 600 }}>
                                Active IRN: <strong style={{ color: "#1976d2" }}>{requisitionNo || "All Pending IRNs"}</strong>
                            </span>
                        </div>

                        <div style={{ display: "flex", gap: "8px" }}>
                            <button
                                type="button"
                                className="tpcs-ii-btn-action"
                                style={{ fontSize: "11.5px", padding: "5px 10px" }}
                                onClick={() => setActiveModal("requisitionItems")}
                            >
                                <FaSearch /> <span>Requisition Items</span>
                            </button>
                            <button
                                type="button"
                                className="tpcs-ii-btn-action"
                                style={{ fontSize: "11.5px", padding: "5px 10px" }}
                                onClick={() => setActiveModal("pickingSlip")}
                            >
                                <FaPrint /> <span>Picking Slip</span>
                            </button>
                        </div>
                    </div>

                    {/* ==========================================================
                       PENDING IRN TO ISSUE & WHAT IS PENDING + ITEM STOCK PANEL
                    =========================================================== */}
                    {showPendingIrnPanel && (
                        <div className="tpcs-pirn-section">
                            <div className="tpcs-pirn-header">
                                <div className="tpcs-pirn-header-left">
                                    <h3 className="tpcs-pirn-title">
                                        <FaClipboardList />
                                        <span>Pending IRN to Issue — Pending Items & Live Stock Status</span>
                                    </h3>
                                    <span className="tpcs-pirn-kpi-pill amber">
                                        Pending IRNs: {totalPendingIrnsCount}
                                    </span>
                                    <span className="tpcs-pirn-kpi-pill">
                                        Pending Items: {totalPendingItemsCount} ({totalPendingUnits} Units to Issue)
                                    </span>
                                    <span className="tpcs-pirn-kpi-pill green">
                                        In-Stock & Ready: {inStockReadyItemsCount} Items
                                    </span>
                                </div>

                                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                    <button
                                        type="button"
                                        onClick={() => setActiveModal("requisitionItems")}
                                        style={{
                                            background: "#ffffff",
                                            color: "#0f172a",
                                            border: "none",
                                            borderRadius: "3px",
                                            padding: "4px 10px",
                                            fontSize: "11px",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "5px"
                                        }}
                                    >
                                        <FaSearch /> <span>Open Full Requisition Popup</span>
                                    </button>
                                </div>
                            </div>

                            <div className="tpcs-pirn-body">
                                {/* 1. Horizontal Cards of Pending IRNs to Issue */}
                                <div className="tpcs-pirn-cards-row">
                                    {/* Card 0: All Pending IRNs */}
                                    <div
                                        className={`tpcs-pirn-card ${selectedIrnFilter === "ALL" ? "active" : ""}`}
                                        onClick={() => setSelectedIrnFilter("ALL")}
                                    >
                                        <div className="tpcs-pirn-card-top">
                                            <span className="tpcs-pirn-no">ALL PENDING IRNs</span>
                                            <span className="tpcs-pirn-status-badge pending">
                                                {totalPendingIrnsCount} Active IRNs
                                            </span>
                                        </div>
                                        <div className="tpcs-pirn-meta">
                                            <span>All Departments</span>
                                            <span>Plot No. 9B & Stores</span>
                                        </div>
                                        <div className="tpcs-pirn-metrics-grid">
                                            <div>
                                                <span className="tpcs-pirn-metric-lbl">Total Req</span>
                                                <span className="tpcs-pirn-metric-val">
                                                    {catalogItems.reduce((s, i) => s + Number(i.ReqQty || 0), 0)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="tpcs-pirn-metric-lbl">Issued</span>
                                                <span className="tpcs-pirn-metric-val issued-val">
                                                    {catalogItems.reduce((s, i) => s + Number(i.IssuedQty || 0), 0)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="tpcs-pirn-metric-lbl">Pending</span>
                                                <span className="tpcs-pirn-metric-val pending-val">
                                                    {totalPendingUnits}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="tpcs-pirn-card-footer">
                                            <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: 600 }}>
                                                {catalogItems.length} Total Requisition Lines
                                            </span>
                                            <button
                                                type="button"
                                                className="tpcs-pirn-load-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedIrnFilter("ALL");
                                                }}
                                            >
                                                <span>View All</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Individual Pending IRN Cards */}
                                    {pendingIrnSummaries.map(irn => (
                                        <div
                                            key={irn.irnNo}
                                            className={`tpcs-pirn-card ${selectedIrnFilter === irn.irnNo ? "active" : ""}`}
                                            onClick={() => handleSelectPendingIrn(irn, false)}
                                        >
                                            <div className="tpcs-pirn-card-top">
                                                <span className="tpcs-pirn-no">{irn.irnNo}</span>
                                                <span className={`tpcs-pirn-status-badge ${
                                                    irn.status === "Completed" ? "completed" : irn.status === "Partial Issue" ? "partial" : "pending"
                                                }`}>
                                                    {irn.status}
                                                </span>
                                            </div>
                                            <div className="tpcs-pirn-meta">
                                                <span><strong>Dept:</strong> {irn.department}</span>
                                                <span>{irn.date}</span>
                                            </div>
                                            <div className="tpcs-pirn-metrics-grid">
                                                <div>
                                                    <span className="tpcs-pirn-metric-lbl">Req Qty</span>
                                                    <span className="tpcs-pirn-metric-val">{irn.totalReqQty}</span>
                                                </div>
                                                <div>
                                                    <span className="tpcs-pirn-metric-lbl">Issued</span>
                                                    <span className="tpcs-pirn-metric-val issued-val">{irn.totalIssuedQty}</span>
                                                </div>
                                                <div>
                                                    <span className="tpcs-pirn-metric-lbl">Pending</span>
                                                    <span className="tpcs-pirn-metric-val pending-val">{irn.totalPendingQty}</span>
                                                </div>
                                            </div>
                                            <div className="tpcs-pirn-card-footer">
                                                <span style={{ fontSize: "10.5px", color: "#475569", fontWeight: 600 }}>
                                                    {irn.pendingItemsCount} of {irn.totalItems} items pending
                                                </span>
                                                <button
                                                    type="button"
                                                    className="tpcs-pirn-load-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectPendingIrn(irn, true);
                                                    }}
                                                    title={`Load pending items from ${irn.irnNo} into Item Issue table`}
                                                >
                                                    <span>Issue IRN</span> <FaArrowRight style={{ fontSize: "9px" }} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 2. Filter & Search Toolbar for Pending Items & Stock */}
                                <div className="tpcs-pirn-toolbar">
                                    <div className="tpcs-pirn-filter-pills">
                                        <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#0f172a", marginRight: "4px" }}>
                                            What is Pending & Stock Filter:
                                        </span>
                                        <button
                                            type="button"
                                            className={`tpcs-pirn-pill-btn ${stockStatusFilter === "ALL" ? "active" : ""}`}
                                            onClick={() => setStockStatusFilter("ALL")}
                                        >
                                            All Items ({catalogItems.length})
                                        </button>
                                        <button
                                            type="button"
                                            className={`tpcs-pirn-pill-btn ${stockStatusFilter === "IN_STOCK" ? "active" : ""}`}
                                            onClick={() => setStockStatusFilter("IN_STOCK")}
                                        >
                                            In Stock & Ready ({catalogItems.filter(i => i.StockQty >= i.BalanceQty && i.StockQty > 0).length})
                                        </button>
                                        <button
                                            type="button"
                                            className={`tpcs-pirn-pill-btn ${stockStatusFilter === "LOW_STOCK" ? "active" : ""}`}
                                            onClick={() => setStockStatusFilter("LOW_STOCK")}
                                        >
                                            Partial / Low Stock ({catalogItems.filter(i => i.StockQty > 0 && i.StockQty < i.BalanceQty).length})
                                        </button>
                                        <button
                                            type="button"
                                            className={`tpcs-pirn-pill-btn ${stockStatusFilter === "OUT_STOCK" ? "active" : ""}`}
                                            onClick={() => setStockStatusFilter("OUT_STOCK")}
                                        >
                                            Out of Stock ({catalogItems.filter(i => i.StockQty <= 0).length})
                                        </button>
                                    </div>

                                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                                        <input
                                            type="text"
                                            placeholder="Search Pending IRN, Material, Colour, Bin..."
                                            value={pendingSearchQuery}
                                            onChange={(e) => setPendingSearchQuery(e.target.value)}
                                            style={{
                                                height: "28px",
                                                width: "240px",
                                                border: "1px solid #cbd5e1",
                                                borderRadius: "3px",
                                                padding: "2px 8px",
                                                fontSize: "11.5px",
                                                outline: "none"
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="tpcs-req-btn-save"
                                            style={{ padding: "4px 12px", fontSize: "11.5px" }}
                                            onClick={handleSaveReqItems}
                                            title="Load all checked pending items into the Item Issue table below"
                                        >
                                            + Load Checked Items ({tickedItemCodes.length}) to Issue
                                        </button>
                                    </div>
                                </div>

                                {/* 3. Table Displaying Pending IRN, What is Pending, and Current Stock of Each Item */}
                                <div className="tpcs-pirn-table-wrap">
                                    <table className="tpcs-pirn-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "34px", textAlign: "center" }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            displayedPendingItems.length > 0 &&
                                                            displayedPendingItems.every(m => tickedItemCodes.includes(m.ItemCode))
                                                        }
                                                        onChange={() => {
                                                            const allCodes = displayedPendingItems.map(m => m.ItemCode);
                                                            const allSelected = allCodes.every(c => tickedItemCodes.includes(c));
                                                            if (allSelected) {
                                                                setTickedItemCodes(prev => prev.filter(c => !allCodes.includes(c)));
                                                            } else {
                                                                setTickedItemCodes(prev => Array.from(new Set([...prev, ...allCodes])));
                                                            }
                                                        }}
                                                        title="Tick all visible pending items"
                                                    />
                                                </th>
                                                <th>Pending IRN No</th>
                                                <th>Dept & Date</th>
                                                <th>Pending Item Name & Code</th>
                                                <th>Variant / Colour</th>
                                                <th>Size</th>
                                                <th>Store & Bin Location</th>
                                                <th style={{ textAlign: "right" }}>IRN Req Qty</th>
                                                <th style={{ textAlign: "right" }}>Already Issued</th>
                                                <th style={{ textAlign: "right", background: "#0f172a" }}>What is Pending (Bal To Issue)</th>
                                                <th style={{ textAlign: "right", background: "#0f172a" }}>Current Stock of Item</th>
                                                <th style={{ textAlign: "center", width: "110px" }}>Quick Issue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedPendingItems.map(m => {
                                                const isTicked = tickedItemCodes.includes(m.ItemCode);
                                                return (
                                                    <tr
                                                        key={m.ItemCode}
                                                        style={{ backgroundColor: isTicked ? "#f0fdf4" : undefined }}
                                                        onClick={() => setActiveItem4x4(m)}
                                                    >
                                                        <td style={{ textAlign: "center" }} onClick={e => e.stopPropagation()}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isTicked}
                                                                onChange={() => handleToggleReqTick(m.ItemCode)}
                                                                style={{ cursor: "pointer" }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <span style={{
                                                                fontFamily: "monospace",
                                                                fontWeight: 800,
                                                                color: "#1976d2",
                                                                background: "#eff6ff",
                                                                padding: "2px 6px",
                                                                borderRadius: "3px",
                                                                border: "1px solid #bfdbfe"
                                                            }}>
                                                                {m.IrnNo}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div style={{ fontWeight: 600, color: "#334155" }}>{m.Department}</div>
                                                            <div style={{ fontSize: "10px", color: "#64748b" }}>{m.IrnDate}</div>
                                                        </td>
                                                        <td>
                                                            <div style={{ fontWeight: 700, color: "#0f172a" }}>{m.ItemName}</div>
                                                            <div style={{ fontSize: "10.5px", color: "#64748b", fontFamily: "monospace" }}>
                                                                Code: {m.ItemCode} | Group: {m.GroupName}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span style={{ fontWeight: 600 }}>{m.Variant !== "N/A" ? m.Variant : m.Color}</span>
                                                        </td>
                                                        <td>{m.Size}</td>
                                                        <td>
                                                            <div style={{ fontWeight: 700, color: "#1976d2", fontFamily: "monospace" }}>
                                                                {m.Location}
                                                            </div>
                                                            <div style={{ fontSize: "10px", color: "#64748b" }}>{m.Warehouse}</div>
                                                        </td>
                                                        <td style={{ textAlign: "right", fontWeight: 700 }}>
                                                            {m.ReqQty} {m.UOM}
                                                        </td>
                                                        <td style={{ textAlign: "right", color: "#16a34a", fontWeight: 600 }}>
                                                            {m.IssuedQty} {m.UOM}
                                                        </td>
                                                        <td style={{ textAlign: "right" }}>
                                                            <span className={`tpcs-pending-pill ${m.BalanceQty <= 0 ? "cleared" : ""}`}>
                                                                {m.BalanceQty > 0 ? `${m.BalanceQty} ${m.UOM} Pending` : `0 ${m.UOM} (Issued)`}
                                                            </span>
                                                        </td>
                                                        <td style={{ textAlign: "right" }}>
                                                            {renderStockBadge(m.StockQty, m.BalanceQty, m.UOM)}
                                                        </td>
                                                        <td style={{ textAlign: "center" }} onClick={e => e.stopPropagation()}>
                                                            <button
                                                                type="button"
                                                                className="tpcs-pirn-load-btn"
                                                                onClick={() => handleIssueSinglePendingItem(m)}
                                                                title={`Add ${m.ItemName} to Item Issue Table`}
                                                            >
                                                                <FaPlus style={{ fontSize: "9px" }} /> <span>Issue Item</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {displayedPendingItems.length === 0 && (
                                                <tr>
                                                    <td colSpan={12} style={{ textAlign: "center", padding: "18px", color: "#64748b" }}>
                                                        No pending IRN items match the current filter.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

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
                                    <span className="tpcs-ii-4x4-header-pill">{activeItem4x4?.Warehouse || "PLOT NO. 9B"}</span>
                                </div>

                                {/* TOP SECTION: QR CODE & BARCODE */}
                                <div className="tpcs-ii-4x4-top">
                                    <div className="tpcs-ii-4x4-top-title">
                                        <span>Top: QR Code</span>
                                        <span style={{ fontSize: "10px", color: "#1976d2", fontFamily: "monospace", fontWeight: 700 }}>
                                            {activeItem4x4?.IrnNo || requisitionNo}
                                        </span>
                                    </div>

                                    {/* QR Code Container with SCAN TO VERIFY (Matching Reference Screenshot 1) */}
                                    <div className="tpcs-ii-qr-box">
                                        {scanLaserActive && <div className="tpcs-ii-qr-laser-line" />}
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: generateQRCodeSVG(activeItem4x4?.ItemCode || "CRD-1001", { size: 125 })
                                            }}
                                        />
                                        <span className="tpcs-ps-verify-text">SCAN TO VERIFY</span>
                                    </div>

                                    {/* Barcode representation */}
                                    <div className="tpcs-ii-barcode-box">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: generateBarcodeSVG(activeItem4x4?.Barcode || activeItem4x4?.ItemCode || "BAR-CRD-1001", { width: 220, height: 40, showText: true })
                                            }}
                                        />
                                    </div>

                                    {/* Quick Scan Input with Auto Fill */}
                                    <div className="tpcs-ii-4x4-scan-input-group">
                                        <input
                                            type="text"
                                            className="tpcs-ii-4x4-scan-input"
                                            placeholder="Scan QR/Barcode or IRN..."
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
                                            Quick Item Scan:
                                        </span>
                                        {catalogItems.slice(0, 5).map(m => (
                                            <button
                                                key={m.ItemCode}
                                                type="button"
                                                className="tpcs-ii-preset-chip"
                                                onClick={() => handleScanAutoFill(m.ItemCode)}
                                                title={`Scan ${m.ItemName} (Pending: ${m.BalanceQty}, Stock: ${m.StockQty})`}
                                            >
                                                {m.ItemName.split(" ")[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* DOWN SECTION: LOCATION, PENDING IRN & STOCK DETAILS */}
                                <div className="tpcs-ii-4x4-down">
                                    <div className="tpcs-ii-4x4-down-title">
                                        <span>Down: Location & Pending Stock</span>
                                        <FaMapMarkerAlt style={{ color: "#ef4444" }} />
                                    </div>

                                    <div className="tpcs-ii-location-box">
                                        <div className="tpcs-ii-loc-row">
                                            <span className="tpcs-ii-loc-label">Pending IRN:</span>
                                            <span className="tpcs-ii-loc-val" style={{ color: "#1976d2", fontFamily: "monospace" }}>
                                                {activeItem4x4?.IrnNo || requisitionNo}
                                            </span>
                                        </div>
                                        <div className="tpcs-ii-loc-row">
                                            <span className="tpcs-ii-loc-label">Item Name:</span>
                                            <span className="tpcs-ii-loc-val">{activeItem4x4?.ItemName}</span>
                                        </div>
                                        <div className="tpcs-ii-loc-row">
                                            <span className="tpcs-ii-loc-label">Warehouse:</span>
                                            <span className="tpcs-ii-loc-val">{activeItem4x4?.Warehouse || stores}</span>
                                        </div>
                                        <div className="tpcs-ii-loc-row">
                                            <span className="tpcs-ii-loc-label">Bin Location:</span>
                                            <span className="tpcs-ii-loc-val" style={{ color: "#1976d2", fontWeight: 800 }}>
                                                {activeItem4x4?.Location || "BIN-D-01-02"} ({activeItem4x4?.Rack})
                                            </span>
                                        </div>
                                        <div className="tpcs-ii-loc-row">
                                            <span className="tpcs-ii-loc-label">IRN Req / Issued:</span>
                                            <span className="tpcs-ii-loc-val">
                                                {activeItem4x4?.ReqQty} / {activeItem4x4?.IssuedQty} {activeItem4x4?.UOM}
                                            </span>
                                        </div>
                                        <div className="tpcs-ii-loc-row">
                                            <span className="tpcs-ii-loc-label">What is Pending:</span>
                                            <span className="tpcs-ii-loc-val" style={{ color: "#b45309", fontSize: "12px" }}>
                                                {activeItem4x4?.BalanceQty} {activeItem4x4?.UOM} Pending
                                            </span>
                                        </div>
                                        <div className="tpcs-ii-loc-row">
                                            <span className="tpcs-ii-loc-label">Stock of Item:</span>
                                            <span className="tpcs-ii-loc-val" style={{ color: activeItem4x4?.StockQty > 0 ? "#16a34a" : "#dc2626", fontSize: "12px" }}>
                                                {activeItem4x4?.StockQty} {activeItem4x4?.UOM} ({activeItem4x4?.StockQty > 0 ? "In Stock" : "Out of Stock"})
                                            </span>
                                        </div>
                                    </div>

                                    <div className="tpcs-ii-4x4-actions">
                                        <button
                                            type="button"
                                            className="tpcs-ii-4x4-btn-action primary"
                                            onClick={() => setActiveModal("requisitionItems")}
                                        >
                                            <FaSearch /> Select Items
                                        </button>
                                        <button
                                            type="button"
                                            className="tpcs-ii-4x4-btn-action"
                                            onClick={() => setActiveModal("pickingSlip")}
                                        >
                                            <FaPrint /> Picking Slip
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ------------------------------------------------------
                           RIGHT SIDE: LINE ITEMS TABLE WITH PENDING & STOCK COLS
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
                                            <th style={{ width: "105px" }}>Issue Type</th>
                                            <th style={{ width: "160px" }}>Pending IRN / IO No.</th>
                                            <th style={{ width: "110px" }}>Group</th>
                                            <th style={{ width: "190px" }}>Item <span className="tpcs-ii-req">*</span></th>
                                            <th style={{ width: "150px" }}>Description</th>
                                            <th style={{ width: "110px" }}>Colour</th>
                                            <th style={{ width: "90px" }}>Type & Size</th>
                                            <th style={{ width: "65px" }}>UOM</th>
                                            <th style={{ width: "105px" }}>Location</th>
                                            <th style={{ width: "80px", textAlign: "right" }}>Req Qty</th>
                                            <th style={{ width: "105px", textAlign: "right", background: "#b45309", color: "#ffffff" }}>Pending Qty</th>
                                            <th style={{ width: "115px", textAlign: "right", background: "#065f46", color: "#ffffff" }}>Item Stock Qty</th>
                                            <th style={{ width: "95px", textAlign: "right" }}>Issue Qty <span className="tpcs-ii-req">*</span></th>
                                            <th style={{ width: "80px", textAlign: "right" }}>Rate</th>
                                            <th style={{ width: "95px", textAlign: "right" }}>Amount</th>
                                            <th style={{ width: "120px" }}>Remarks</th>
                                            <th style={{ width: "42px", textAlign: "center" }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lines.map((row) => {
                                            const stockNum = Number(row.stockQty) || 0;
                                            const pendingNum = Number(row.pendingQty) || 0;
                                            return (
                                                <tr
                                                    key={row.id}
                                                    onClick={() => {
                                                        const found = catalogItems.find(
                                                            c => c.ItemCode === row.itemCode || c.ItemName === row.item
                                                        );
                                                        if (found) setActiveItem4x4(found);
                                                    }}
                                                >
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
                                                                placeholder="Pending IRN No"
                                                                value={row.ioNo}
                                                                onChange={(e) => handleLineChange(row.id, "ioNo", e.target.value)}
                                                                style={{ fontFamily: "monospace", fontWeight: 700, color: "#1976d2", fontSize: "11px" }}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="tpcs-ii-addon-btn"
                                                                style={{ height: "27px", padding: "0 6px" }}
                                                                onClick={() => setActiveModal("requisitionItems")}
                                                                title="Select from Pending IRN Items"
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
                                                            style={{ fontWeight: 700 }}
                                                        />
                                                        <datalist id={`items-datalist-${row.id}`}>
                                                            {catalogItems.map(it => (
                                                                <option key={it.ItemCode} value={it.ItemName}>
                                                                    IRN: {it.IrnNo} | Pending: {it.BalanceQty} {it.UOM} | Stock: {it.StockQty} {it.UOM}
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
                                                            placeholder="Location"
                                                            value={row.location || ""}
                                                            onChange={(e) => handleLineChange(row.id, "location", e.target.value)}
                                                            style={{ fontFamily: "monospace", fontSize: "11px", color: "#1976d2", fontWeight: 600 }}
                                                        />
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <input
                                                            type="text"
                                                            className="tpcs-ii-tbl-input"
                                                            value={row.reqQty ?? 0}
                                                            readOnly
                                                            style={{ background: "#f8fafc", textAlign: "right", fontWeight: 600 }}
                                                        />
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <div style={{
                                                            background: pendingNum > 0 ? "#fffbeb" : "#f1f5f9",
                                                            border: `1px solid ${pendingNum > 0 ? "#fcd34d" : "#cbd5e1"}`,
                                                            color: pendingNum > 0 ? "#b45309" : "#64748b",
                                                            borderRadius: "3px",
                                                            padding: "3px 6px",
                                                            fontWeight: 800,
                                                            fontSize: "11.5px",
                                                            textAlign: "right"
                                                        }}>
                                                            {pendingNum} {row.uom}
                                                        </div>
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <div style={{
                                                            background: stockNum <= 0 ? "#fee2e2" : (stockNum < pendingNum ? "#fef3c7" : "#dcfce7"),
                                                            border: `1px solid ${stockNum <= 0 ? "#fca5a5" : (stockNum < pendingNum ? "#fcd34d" : "#86efac")}`,
                                                            color: stockNum <= 0 ? "#991b1b" : (stockNum < pendingNum ? "#92400e" : "#166534"),
                                                            borderRadius: "3px",
                                                            padding: "3px 6px",
                                                            fontWeight: 800,
                                                            fontSize: "11.5px",
                                                            textAlign: "right"
                                                        }}>
                                                            {stockNum} {row.uom}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="tpcs-ii-tbl-input"
                                                            placeholder="0.00"
                                                            value={row.issueQty}
                                                            onChange={(e) => handleLineChange(row.id, "issueQty", e.target.value)}
                                                            style={{ textAlign: "right", fontWeight: 700, borderColor: "#1976d2" }}
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
                                            );
                                        })}
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
                                    onClick={() => setActiveModal("requisitionItems")}
                                >
                                    <FaSearch /> <span>Requisition Items (Tick to Select)</span>
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
                                                setActiveModal("requisitionItems");
                                            }}
                                        >
                                            <FaSearch /> <span>Requisition Items</span>
                                        </div>
                                        <div
                                            className="tpcs-ii-menu-item"
                                            onClick={() => {
                                                setShowActionMenu(false);
                                                setActiveModal("pickingSlip");
                                            }}
                                        >
                                            <FaPrint /> <span>Print Picking Slip (Screenshot Format)</span>
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
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Requisition / IRN No</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Updated By</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Updated On</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Remark</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Date</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Supplier</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Issued By</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Stores</th>
                                    <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>Memo for internal use</th>
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
                                        <td style={{ padding: "6px 10px", fontWeight: 700, fontFamily: "monospace", borderRight: "1px solid #f1f5f9" }}>{item.requisitionNo || "-"}</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>{item.issuedBy || "Admin"}</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>{item.date}</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>{item.remark || "-"}</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>{item.date}</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>{item.associate || "-"}</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>{item.issuedBy}</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>{item.stores}</td>
                                        <td style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>{item.internalMemo || "-"}</td>
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
               MODAL: REQUISITION ITEMS (EXACT REPLICA OF USER REFERENCE SCREENSHOT 2)
            =========================================================== */}
            {activeModal === "requisitionItems" && (
                <div className="tpcs-ii-modal-backdrop" onClick={() => setActiveModal(null)}>
                    <div className="tpcs-req-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="tpcs-req-modal-header">
                            <h3 className="tpcs-req-modal-title">Requisition Items (Pending IRN & Stock Available)</h3>
                            <button className="tpcs-req-modal-close" onClick={() => setActiveModal(null)}>×</button>
                        </div>

                        <div className="tpcs-req-modal-body">
                            {/* Blue instruction line + Pending IRN Selector Pills */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                                <div className="tpcs-req-instruction" style={{ margin: 0 }}>
                                    Tick check box to select the items you want to issue
                                </div>

                                <div style={{ display: "flex", gap: "5px", alignItems: "center", flexWrap: "wrap" }}>
                                    <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#334155" }}>Pending IRN:</span>
                                    <button
                                        type="button"
                                        className={`tpcs-pirn-pill-btn ${modalIrnFilter === "ALL" ? "active" : ""}`}
                                        onClick={() => setModalIrnFilter("ALL")}
                                    >
                                        All IRNs
                                    </button>
                                    {pendingIrnSummaries.map(irn => (
                                        <button
                                            key={irn.irnNo}
                                            type="button"
                                            className={`tpcs-pirn-pill-btn ${modalIrnFilter === irn.irnNo ? "active" : ""}`}
                                            onClick={() => setModalIrnFilter(irn.irnNo)}
                                        >
                                            {irn.irnNo} (Bal: {irn.totalPendingQty})
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sub bar: Rows: N and Reset button */}
                            <div className="tpcs-req-subbar">
                                <div>Rows: {filteredReqMaterials.length}</div>
                                <button
                                    type="button"
                                    className="tpcs-req-btn-reset"
                                    onClick={handleResetReqFilters}
                                >
                                    Reset
                                </button>
                            </div>

                            {/* Table matching Screenshot 2 */}
                            <div style={{ overflowX: "auto" }}>
                                <table className="tpcs-req-table">
                                    <thead>
                                        {/* Row 1: Filters above each column */}
                                        <tr className="tpcs-req-filter-row">
                                            <td style={{ textAlign: "center", width: "40px" }}></td>
                                            <td style={{ width: "170px" }}>
                                                <input
                                                    type="text"
                                                    className="tpcs-req-filter-input"
                                                    value={reqFilterItem}
                                                    onChange={e => setReqFilterItem(e.target.value)}
                                                    placeholder="Filter Item / IRN..."
                                                />
                                            </td>
                                            <td style={{ width: "110px" }}>
                                                <input
                                                    type="text"
                                                    className="tpcs-req-filter-input"
                                                    value={reqFilterVariant}
                                                    onChange={e => setReqFilterVariant(e.target.value)}
                                                    placeholder=""
                                                />
                                            </td>
                                            <td style={{ width: "100px" }}>
                                                <input
                                                    type="text"
                                                    className="tpcs-req-filter-input"
                                                    value={reqFilterSizeRange}
                                                    onChange={e => setReqFilterSizeRange(e.target.value)}
                                                    placeholder=""
                                                />
                                            </td>
                                            <td style={{ width: "70px" }}>
                                                <input
                                                    type="text"
                                                    className="tpcs-req-filter-input"
                                                    value={reqFilterSize}
                                                    onChange={e => setReqFilterSize(e.target.value)}
                                                    placeholder=""
                                                />
                                            </td>
                                            <td style={{ width: "80px" }}>
                                                <input
                                                    type="text"
                                                    className="tpcs-req-filter-input"
                                                    value={reqFilterReqQty}
                                                    onChange={e => setReqFilterReqQty(e.target.value)}
                                                    placeholder=""
                                                />
                                            </td>
                                            <td style={{ width: "110px" }}>
                                                <input
                                                    type="text"
                                                    className="tpcs-req-filter-input"
                                                    value={reqFilterStock}
                                                    onChange={e => setReqFilterStock(e.target.value)}
                                                    placeholder=""
                                                />
                                            </td>
                                            <td style={{ width: "100px" }}>
                                                <input
                                                    type="text"
                                                    className="tpcs-req-filter-input"
                                                    value={reqFilterAlreadyIssued}
                                                    onChange={e => setReqFilterAlreadyIssued(e.target.value)}
                                                    placeholder=""
                                                />
                                            </td>
                                            <td style={{ width: "95px" }}>
                                                <input
                                                    type="text"
                                                    className="tpcs-req-filter-input"
                                                    value={reqFilterBalToIssue}
                                                    onChange={e => setReqFilterBalToIssue(e.target.value)}
                                                    placeholder=""
                                                />
                                            </td>
                                            <td style={{ width: "110px" }}>
                                                <input
                                                    type="text"
                                                    className="tpcs-req-filter-input"
                                                    value={reqFilterIssueQty}
                                                    onChange={e => setReqFilterIssueQty(e.target.value)}
                                                    placeholder=""
                                                />
                                            </td>
                                        </tr>

                                        {/* Row 2: Headers */}
                                        <tr>
                                            <th style={{ width: "40px", textAlign: "center" }}>
                                                <input
                                                    type="checkbox"
                                                    checked={tickedItemCodes.length === filteredReqMaterials.length && filteredReqMaterials.length > 0}
                                                    onChange={handleSelectAllReq}
                                                    title="Select All"
                                                />
                                            </th>
                                            <th>Item ( & Pending IRN )</th>
                                            <th>Variant</th>
                                            <th>Size Range</th>
                                            <th>Size</th>
                                            <th style={{ textAlign: "right" }}>Req Qty</th>
                                            <th style={{ textAlign: "right" }}>Stock Available</th>
                                            <th style={{ textAlign: "right" }}>Already Issued</th>
                                            <th style={{ textAlign: "right" }}>Bal To Issue</th>
                                            <th style={{ textAlign: "right" }}>Issue Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredReqMaterials.map((m) => {
                                            const isTicked = tickedItemCodes.includes(m.ItemCode);
                                            const issueQtyVal = rowIssueQtys[m.ItemCode] ?? (m.BalanceQty > 0 ? m.BalanceQty : m.ReqQty || "");

                                            return (
                                                <tr
                                                    key={m.ItemCode}
                                                    style={{ backgroundColor: isTicked ? "#f0fdf4" : "#ffffff" }}
                                                >
                                                    <td style={{ textAlign: "center" }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isTicked}
                                                            onChange={() => handleToggleReqTick(m.ItemCode)}
                                                            style={{ cursor: "pointer", width: "15px", height: "15px" }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div style={{ fontWeight: 700 }}>{m.ItemName}</div>
                                                        <div style={{ fontSize: "10px", color: "#1976d2", fontFamily: "monospace", fontWeight: 700 }}>
                                                            {m.IrnNo}
                                                        </div>
                                                    </td>
                                                    <td>{m.Variant}</td>
                                                    <td>{m.SizeRange}</td>
                                                    <td>{m.Size}</td>
                                                    <td style={{ textAlign: "right", fontWeight: 600 }}>{m.ReqQty || "-"}</td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <span
                                                            className="tpcs-req-stock-box"
                                                            style={{
                                                                background: m.StockQty > 0 ? "#dcfce7" : "#fee2e2",
                                                                color: m.StockQty > 0 ? "#166534" : "#991b1b",
                                                                borderColor: m.StockQty > 0 ? "#86efac" : "#fca5a5"
                                                            }}
                                                        >
                                                            {m.StockQty}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: "right", color: "#64748b" }}>{m.IssuedQty}</td>
                                                    <td style={{ textAlign: "right", fontWeight: 800, color: "#b45309" }}>
                                                        {m.BalanceQty}
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <input
                                                            type="number"
                                                            className="tpcs-req-issue-input"
                                                            placeholder="Issue Qty"
                                                            value={issueQtyVal}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setRowIssueQtys(prev => ({ ...prev, [m.ItemCode]: val }));
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {filteredReqMaterials.length === 0 && (
                                            <tr>
                                                <td colSpan={10} style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                                                    No requisition items match the filters. Click Reset to clear filters.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modal Footer with Green [ Save ] Button matching Screenshot 2 */}
                        <div className="tpcs-req-modal-footer">
                            <button
                                type="button"
                                className="tpcs-req-btn-save"
                                onClick={handleSaveReqItems}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================================================
               MODAL: PICKING SLIP PRINT PREVIEW (EXACT USER REFERENCE SCREENSHOT 1)
            =========================================================== */}
            {activeModal === "pickingSlip" && (
                <div className="tpcs-ii-modal-backdrop" onClick={() => setActiveModal(null)}>
                    <div className="tpcs-ii-modal-content" style={{ width: "720px", maxHeight: "90vh" }} onClick={e => e.stopPropagation()}>
                        <div className="tpcs-ii-modal-header" style={{ background: "#1976d2" }}>
                            <h3 className="tpcs-ii-modal-title">Picking Slip Print Preview (Screenshot 1 Format)</h3>
                            <button className="tpcs-ii-modal-close" onClick={() => setActiveModal(null)}>×</button>
                        </div>

                        <div className="tpcs-req-modal-body" style={{ background: "#ffffff", padding: "16px 24px" }}>
                            {/* Blue Print Button matching Screenshot 1 */}
                            <div className="tpcs-ps-topbar">
                                <button
                                    type="button"
                                    className="tpcs-ps-btn-print"
                                    onClick={() => window.print()}
                                >
                                    <FaPrint /> Print
                                </button>
                            </div>

                            {/* Picking Slips Container */}
                            <div className="tpcs-ps-container">
                                {catalogItems.slice(1, 4).map((m, idx, arr) => (
                                    <React.Fragment key={m.ItemCode}>
                                        <div className="tpcs-ps-slip-box">
                                            {/* Header */}
                                            <div className="tpcs-ps-header">
                                                <span>{m.Warehouse || "PLOT NO. 9B"}</span>
                                                <span>PICKING SLIP</span>
                                            </div>

                                            {/* Subheader */}
                                            <div className="tpcs-ps-subheader">
                                                <span>IRN No : {m.IrnNo || requisitionNo}</span>
                                                <span>Date : {issueDate}</span>
                                            </div>

                                            {/* Body */}
                                            <div className="tpcs-ps-body">
                                                {/* Left QR Code with SCAN TO VERIFY */}
                                                <div className="tpcs-ps-left-qr">
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: generateQRCodeSVG(m.ItemCode, { size: 90 })
                                                        }}
                                                    />
                                                    <div className="tpcs-ps-verify-text">SCAN TO VERIFY</div>
                                                </div>

                                                {/* Right Item Details */}
                                                <div className="tpcs-ps-right-details">
                                                    <div className="tpcs-ps-detail-row">
                                                        <div className="tpcs-ps-row-label">ITEM</div>
                                                        <div className="tpcs-ps-row-val">{m.ItemName}</div>
                                                    </div>
                                                    <div className="tpcs-ps-detail-row">
                                                        <div className="tpcs-ps-row-label">VARIANT</div>
                                                        <div className="tpcs-ps-row-val">{m.Variant || "N/A"}</div>
                                                    </div>
                                                    <div className="tpcs-ps-detail-row">
                                                        <div className="tpcs-ps-row-label">SIZE RNG</div>
                                                        <div className="tpcs-ps-row-val">{m.SizeRange || "N/A"}</div>
                                                    </div>
                                                    <div className="tpcs-ps-detail-row">
                                                        <div className="tpcs-ps-row-label">QTY</div>
                                                        <div className="tpcs-ps-row-val" style={{ fontSize: "14px", fontWeight: 800 }}>
                                                            {m.BalanceQty || m.ReqQty || 6} (Stock: {m.StockQty})
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="tpcs-ps-footer">
                                                <span>SLIP ID : {m.SlipId || "000000000000225"}</span>
                                                <span>{idx + 1} / {arr.length}</span>
                                            </div>
                                        </div>

                                        {/* Cut here divider matching screenshot */}
                                        {idx < arr.length - 1 && (
                                            <div className="tpcs-ps-cut-divider">
                                                - - - - - - cut here - - - - - -
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        <div className="tpcs-ii-modal-footer">
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
                                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800 }}>TPCS FASHION ERP</h2>
                                <h3 style={{ margin: "4px 0", fontSize: "16px", color: "#1976d2" }}>ITEM ISSUE VOUCHER</h3>
                                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Plot No. 9B | FY 01-Apr-2026 - 31-Mar-2027</p>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px", marginBottom: "16px" }}>
                                <div><strong>Issue No:</strong> {activeRecord ? activeRecord.issueNo : `${issuePrefix}${issueSerial}`}</div>
                                <div><strong>Date:</strong> {activeRecord ? activeRecord.date : issueDate}</div>
                                <div><strong>Pending IRN No:</strong> {activeRecord ? activeRecord.requisitionNo : requisitionNo || "-"}</div>
                                <div><strong>Stores:</strong> {activeRecord ? activeRecord.stores : stores}</div>
                                <div><strong>Associate/Supplier:</strong> {activeRecord ? activeRecord.associate : associate || "-"}</div>
                                <div><strong>Department:</strong> {activeRecord ? activeRecord.department : department || "-"}</div>
                            </div>

                            <table className="tpcs-ii-table" style={{ width: "100%", marginBottom: "20px" }}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>IRN No</th>
                                        <th>Item Name</th>
                                        <th>Variant / Colour</th>
                                        <th>Location</th>
                                        <th>UOM</th>
                                        <th style={{ textAlign: "right" }}>Pending Qty</th>
                                        <th style={{ textAlign: "right" }}>Stock Qty</th>
                                        <th style={{ textAlign: "right" }}>Issued Qty</th>
                                        <th style={{ textAlign: "right" }}>Rate</th>
                                        <th style={{ textAlign: "right" }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(activeRecord ? activeRecord.items : lines).map((r, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{r.ioNo || requisitionNo || "-"}</td>
                                            <td>{r.item || r.ItemName}</td>
                                            <td>{r.colour || r.Variant || r.Color || "-"}</td>
                                            <td>{r.location || "BIN-A-01-01"}</td>
                                            <td>{r.uom || r.UOM}</td>
                                            <td style={{ textAlign: "right" }}>{r.pendingQty ?? "-"}</td>
                                            <td style={{ textAlign: "right" }}>{r.stockQty ?? "-"}</td>
                                            <td style={{ textAlign: "right", fontWeight: 700 }}>{r.issueQty || r.Quantity}</td>
                                            <td style={{ textAlign: "right" }}>{r.rate || r.Rate || 0}</td>
                                            <td style={{ textAlign: "right" }}>{r.amount || r.Amount || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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

        </div>
    );
}
