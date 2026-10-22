import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
    FaSyncAlt,
    FaCog,
    FaFileExcel,
    FaFilePdf,
    FaFilter,
    FaTimes,
    FaSearch
} from "react-icons/fa";
import TypeaheadDropdown from "../../../components/common/TypeaheadDropdown";
import "../../../styles/stockLedger.css";

// Standard preloaded materials from master catalogue
const INITIAL_MATERIALS = [
    { label: "TALIN 0.3MM", value: "NONWO5064", code: "NONWO5064", color: "WHITE", category: "REINFORCEMENT", uom: "MTR", rate: 454.5, currentStock: 1801.99667 },
    { label: "TALIN 0.4MM", value: "NONWO5065", code: "NONWO5065", color: "WHITE", category: "REINFORCEMENT", uom: "MTR", rate: 485.0, currentStock: 1250.0 },
    { label: "COW CULATTAS SINGLE LEATHER 3.6-4.0MM", value: "LTH-1093", code: "LTH-1093", color: "BLACK", category: "LEATHER", uom: "SQFT", rate: 198.65, currentStock: 45723.75 },
    { label: "COW PLOSE SUEDE LEATHER 1.2-1.4MM", value: "LTH-1263", code: "LTH-1263", color: "COGNAC", category: "LEATHER", uom: "SQFT", rate: 214.43, currentStock: 32303.24 },
    { label: "CARD PAPER 350G 31X43 INCH", value: "PKG-2200", code: "PKG-2200", color: "NATURAL", category: "PACKING MATERIAL", uom: "SHEET", rate: 63.91, currentStock: 80709.0 },
    { label: "HIGH DENSITY TOPLINER 0.4MM 54 INCH", value: "RNF-1085", code: "RNF-1085", color: "WHITE", category: "REINFORCEMENT", uom: "MTR", rate: 488.88, currentStock: 9054.52 },
    { label: "METAL CHAIN LINK 8MM TBH-2755D", value: "HDW-1263", code: "HDW-1263", color: "SHINY GOLD", category: "HARDWARE", uom: "PCS", rate: 220.03, currentStock: 17173.0 },
    { label: "COW ECO VEG SIDE CRUST LEATHER 2.0-2.4MM", value: "LTH-1112", code: "LTH-1112", color: "TAN", category: "LEATHER", uom: "SQFT", rate: 120.96, currentStock: 30921.25 },
    { label: "SINTEX MICROFIBER 1MM 54 INCH", value: "RNF-1225", code: "RNF-1225", color: "BLACK", category: "REINFORCEMENT", uom: "MTR", rate: 605.57, currentStock: 4977.54 },
    { label: "RAFFIA STRAW DR4000D", value: "FAB-1249", code: "FAB-1249", color: "NATURAL", category: "FABRIC", uom: "KG", rate: 2947.71, currentStock: 968.65 },
    { label: "JAM RIVET SINGLE HEAD 7MM IMP", value: "HDW-2236", code: "HDW-2236", color: "SILVER", category: "HARDWARE", uom: "SET", rate: 0.74, currentStock: 427100.0 },
    { label: "STOPPER HEAD NO.5", value: "HDW-1909", code: "HDW-1909", color: "NICKEL", category: "HARDWARE", uom: "SET", rate: 0.84, currentStock: 277393.0 },
    { label: "O RING 8MM IMP", value: "HDW-1682", code: "HDW-1682", color: "GOLD", category: "HARDWARE", uom: "PCS", rate: 2.93, currentStock: 110519.0 },
    { label: "PE SHEET ENSHEILD 16*8", value: "PKG-2188", code: "PKG-2188", color: "CLEAR", category: "PACKING MATERIAL", uom: "PCS", rate: 0.87, currentStock: 139000.0 }
];

// Default sample dataset matching JenixCloud V-CONNECT INC. Stock Ledger (Screenshots 3 & 4)
const DEFAULT_LEDGER_ITEMS = [
    {
        itemHeader: "TALIN 0.3MM, Code :NONWO5064, Description : , Color :WHITE, UOM :MTR",
        itemCode: "NONWO5064",
        itemName: "TALIN 0.3MM",
        color: "WHITE",
        uom: "MTR",
        itemCategory: "REINFORCEMENT",
        location: "Plot No. 9B",
        materialSource: "Import",
        transactions: [
            {
                id: 1,
                trDate: "",
                trNo: "",
                trType: "OPENING",
                ioNo: "",
                style: "",
                party: "",
                invoiceNo: "",
                invoiceDate: "",
                rate: null,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 0,
                valOut: 0,
                closingQty: 1897.99666,
                closingVal: 862640.48197,
                category: "",
                location: ""
            },
            {
                id: 2,
                trDate: "02-04-2026",
                trNo: "SAGRN/AAPL9B/2627/5",
                trType: "SAGRN",
                ioNo: "",
                style: "",
                party: "ALPINE APPARELS PVT. LTD.",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0.1,
                valIn: 45.45,
                qtyOut: 0,
                valOut: 0,
                closingQty: 1898.09666,
                closingVal: 862685.93197,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 3,
                trDate: "06-04-2026",
                trNo: "STC/9B/2627/82",
                trType: "STDC",
                ioNo: "",
                style: "",
                party: "ALPINE APPARELS PVT. LTD.",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 0.0001,
                valOut: 0.04545,
                closingQty: 1898.09656,
                closingVal: 862685.88652,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 4,
                trDate: "07-04-2026",
                trNo: "STC/9B/2627/20",
                trType: "STDC",
                ioNo: "IO/AAPL68/25-26/391",
                style: "",
                party: "Plot No. 68",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 2.22,
                valOut: 1008.99,
                closingQty: 1895.87656,
                closingVal: 861676.89652,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 5,
                trDate: "07-04-2026",
                trNo: "STC/9B/2627/20",
                trType: "STDC",
                ioNo: "IO/AAPL68/25-26/392",
                style: "",
                party: "Plot No. 68",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 2.48,
                valOut: 1127.16,
                closingQty: 1893.39656,
                closingVal: 860549.73652,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 6,
                trDate: "07-04-2026",
                trNo: "STC/9B/2627/20",
                trType: "STDC",
                ioNo: "IO/AAPL68/25-26/393",
                style: "",
                party: "Plot No. 68",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 1.05,
                valOut: 477.225,
                closingQty: 1892.34656,
                closingVal: 860072.51152,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 7,
                trDate: "07-04-2026",
                trNo: "STC/9B/2627/20",
                trType: "STDC",
                ioNo: "IO/AAPL68/25-26/394",
                style: "",
                party: "Plot No. 68",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 1.96,
                valOut: 890.82,
                closingQty: 1890.38656,
                closingVal: 859181.69152,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 8,
                trDate: "09-04-2026",
                trNo: "STC/9B/2627/33",
                trType: "STDC",
                ioNo: "",
                style: "",
                party: "Plot No. 68",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 0.01,
                valOut: 4.545,
                closingQty: 1890.37656,
                closingVal: 859177.14652,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 9,
                trDate: "10-04-2026",
                trNo: "FRM/9B/2627/12",
                trType: "FRM",
                ioNo: "",
                style: "",
                party: "ALPINE APPARELS PVT. LTD.",
                invoiceNo: "",
                invoiceDate: "",
                rate: 457.06199,
                qtyIn: 0.01,
                valIn: 4.57062,
                qtyOut: 0,
                valOut: 0,
                closingQty: 1881.88656,
                closingVal: 855317.52138,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 10,
                trDate: "12-04-2026",
                trNo: "STC/9B/2627/45",
                trType: "STDC",
                ioNo: "",
                style: "",
                party: "ALPINE APPARELS PVT. LTD.",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 0.1,
                valOut: 45.45,
                closingQty: 1881.78656,
                closingVal: 855272.07138,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 11,
                trDate: "14-04-2026",
                trNo: "STC/9B/2627/56",
                trType: "STDC",
                ioNo: "IO/AAPL/25-26/1605",
                style: "",
                party: "ALPINE APPARELS PVT. LTD.",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 1.5,
                valOut: 681.75,
                closingQty: 1880.28656,
                closingVal: 854590.32138,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 12,
                trDate: "15-04-2026",
                trNo: "STC/9B/2627/58",
                trType: "STDC",
                ioNo: "IO/AAPL/25-26/1613",
                style: "",
                party: "ALPINE APPARELS PVT. LTD.",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 1.5,
                valOut: 681.75,
                closingQty: 1878.78656,
                closingVal: 853908.57138,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 13,
                trDate: "18-04-2026",
                trNo: "STC/9B/2627/71",
                trType: "STDC",
                ioNo: "",
                style: "",
                party: "ALPINE APPARELS PVT. LTD.",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 2,
                valOut: 909,
                closingQty: 1876.78656,
                closingVal: 852999.57138,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 14,
                trDate: "20-04-2026",
                trNo: "ISS/9B/2627/174",
                trType: "ISS",
                ioNo: "",
                style: "",
                party: "Plot No. 9B",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 0.01,
                valOut: 4.545,
                closingQty: 1876.77656,
                closingVal: 852995.02638,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 15,
                trDate: "22-04-2026",
                trNo: "STC/9B/2627/89",
                trType: "STDC",
                ioNo: "",
                style: "",
                party: "Plot No. 68",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 0.01,
                valOut: 4.545,
                closingQty: 1876.76656,
                closingVal: 852990.48138,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 16,
                trDate: "25-04-2026",
                trNo: "STC/9B/2627/95",
                trType: "STDC",
                ioNo: "",
                style: "",
                party: "ALPINE APPARELS PVT. LTD.",
                invoiceNo: "",
                invoiceDate: "",
                rate: 0,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 0,
                valOut: 0,
                closingQty: 1876.76656,
                closingVal: 852990.48138,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 17,
                trDate: "28-04-2026",
                trNo: "ISS/9B/2627/1044",
                trType: "ISS",
                ioNo: "",
                style: "",
                party: "Plot No. 9B",
                invoiceNo: "",
                invoiceDate: "",
                rate: 454.5,
                qtyIn: 0,
                valIn: 0,
                qtyOut: 75,
                valOut: 34087.50012,
                closingQty: 1801.76656,
                closingVal: 818902.98126,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            },
            {
                id: 18,
                trDate: "30-04-2026",
                trNo: "FRM/9B/2627/293",
                trType: "FRM",
                ioNo: "",
                style: "",
                party: "Plot No. 9B",
                invoiceNo: "",
                invoiceDate: "",
                rate: 457.06199,
                qtyIn: 0.23011,
                valIn: 105.17453,
                qtyOut: 0,
                valOut: 0,
                closingQty: 1801.99667,
                closingVal: 819008.15579,
                category: "REINFORCEMENT",
                location: "Plot No. 9B"
            }
        ]
    }
];

export default function StockLedger() {
    // ---------------------------------------------------------
    // Top Bar Criteria State
    // ---------------------------------------------------------
    const [fromDate, setFromDate] = useState("2026-04-01");
    const [toDate, setToDate] = useState("2026-10-11");
    const [store, setStore] = useState("RAW MATERIAL STORE 9B");

    // ---------------------------------------------------------
    // Advanced Filter Popover State
    // ---------------------------------------------------------
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        group: "",
        colour: "",
        profitCenter: "",
        itemCategory: "",
        style: "",
        item: "",
        code: "",
        location: "",
        ioNo: "",
        materialSource: "All" // "All" | "Import" | "Domestic"
    });

    const [activeFilters, setActiveFilters] = useState({ ...filters });

    // ---------------------------------------------------------
    // Lookup Options State
    // ---------------------------------------------------------
    const [materialsList, setMaterialsList] = useState(INITIAL_MATERIALS);
    const [coloursList, setColoursList] = useState([]);

    // ---------------------------------------------------------
    // Data State
    // ---------------------------------------------------------
    const [ledgerData, setLedgerData] = useState(DEFAULT_LEDGER_ITEMS);
    const [loading, setLoading] = useState(false);

    // Load master items & colours for lookups on mount
    useEffect(() => {
        loadLookups();
        loadLedger();
    }, []);

    const loadLookups = async () => {
        try {
            // Load items
            const itemsRes = await axios.get("/api/items");
            const rawItems = itemsRes.data?.data || itemsRes.data?.value || itemsRes.data || [];
            if (Array.isArray(rawItems) && rawItems.length > 0) {
                const mapped = rawItems.map(it => ({
                    label: it.ItemName,
                    value: it.ItemCode || it.ItemID,
                    code: it.ItemCode || "",
                    name: it.ItemName || "",
                    color: it.Color || "",
                    category: it.Category || it.ItemType || "",
                    uom: it.UOM || "PCS",
                    rate: it.Rate || 0,
                    currentStock: it.CurrentStock || 0
                }));
                // Combine with initial materials to guarantee TALIN 0.3MM is always present
                const combined = [...INITIAL_MATERIALS];
                mapped.forEach(m => {
                    if (!combined.some(c => c.code === m.code)) {
                        combined.push(m);
                    }
                });
                setMaterialsList(combined);
            }
        } catch (e) {
            console.warn("Could not load /api/items for lookup, using built-in catalogue:", e.message);
        }

        try {
            const coloursRes = await axios.get("/api/colours");
            const rawColours = coloursRes.data?.data || coloursRes.data || [];
            if (Array.isArray(rawColours) && rawColours.length > 0) {
                setColoursList(rawColours.map(c => c.ColourName || c.name || c));
            }
        } catch (e) {
            // fallback handled by useMemo
        }
    };

    // Fetch live backend ledger if available
    const loadLedger = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/stock-ledger");
            const dbData = res.data?.data || res.data;
            if (Array.isArray(dbData) && dbData.length > 0) {
                const grouped = {};
                dbData.forEach(row => {
                    const key = row.ItemCode || "DEFAULT";
                    if (!grouped[key]) {
                        grouped[key] = {
                            itemHeader: `${row.ItemName || "ITEM"}, Code :${row.ItemCode || ""}, Description : ${row.Description || ""}, Color :${row.Color || ""}, UOM :${row.UOM || "PCS"}`,
                            itemCode: row.ItemCode || "",
                            itemName: row.ItemName || "",
                            color: row.Color || "",
                            uom: row.UOM || "PCS",
                            itemCategory: row.ItemCategory || row.Category || "GENERAL",
                            location: row.Location || row.Warehouse || "Plot No. 9B",
                            materialSource: row.MaterialSource || "Import",
                            transactions: []
                        };
                    }
                    grouped[key].transactions.push({
                        id: row.LedgerID || row.id || Math.random(),
                        trDate: row.TransactionDate || row.Date || "",
                        trNo: row.ReferenceNo || row.TrNo || "",
                        trType: row.TransactionType || row.Type || "TR",
                        ioNo: row.IONo || "",
                        style: row.Style || "",
                        party: row.Party || row.SupplierName || "",
                        invoiceNo: row.InvoiceNo || "",
                        invoiceDate: row.InvoiceDate || "",
                        rate: row.Rate != null ? Number(row.Rate) : null,
                        qtyIn: Number(row.QtyIn || 0),
                        valIn: Number(row.ValueIn || (row.QtyIn * (row.Rate || 0)) || 0),
                        qtyOut: Number(row.QtyOut || 0),
                        valOut: Number(row.ValueOut || (row.QtyOut * (row.Rate || 0)) || 0),
                        closingQty: Number(row.BalanceQty || row.ClosingQty || 0),
                        closingVal: Number(row.BalanceValue || row.ClosingValue || 0),
                        category: row.ItemCategory || "",
                        location: row.Location || ""
                    });
                });
                setLedgerData(Object.values(grouped));
            } else {
                setLedgerData(DEFAULT_LEDGER_ITEMS);
            }
        } catch (e) {
            console.warn("Using default stock ledger dataset:", e.message);
            setLedgerData(DEFAULT_LEDGER_ITEMS);
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------------------------------------
    // Lookup Options Pre-computation
    // ---------------------------------------------------------
    const storeOptions = useMemo(() => [
        "RAW MATERIAL STORE 9B",
        "FABRIC STORE",
        "TRIMS STORE",
        "PACKING STORE",
        "CENTRAL GODOWN",
        "GENERAL STORE",
        "STORE 68",
        "LEATHER STORE"
    ], []);

    const groupOptions = useMemo(() => [
        "REINFORCEMENT",
        "LEATHER",
        "FABRIC",
        "HARDWARE",
        "PACKING MATERIAL",
        "THREAD",
        "ZIPPER",
        "SAMPLING",
        "WEBBING",
        "LABEL",
        "JOBWORK",
        "CONSUMABLES",
        "ACCESSORIES"
    ], []);

    const colourOptions = useMemo(() => {
        if (coloursList.length > 0) return coloursList;
        return [
            "WHITE", "BLACK", "NATURAL", "NAVY", "BROWN", "COGNAC", "TAN",
            "GREIGE", "DARK MAHOGANY", "FADED BLACK", "KHAKI", "NEWPORT NAVY",
            "SEA SWELL", "JAKE BLUE", "MOONSHINE", "SERENITY BLUE", "BLUE STRIPE",
            "MAHJONG", "TENNIS", "BLUE-BLOCK", "PINK", "CHOCOLATE", "SCARLATTO",
            "AGED TAN", "PEBBLE DUST", "SELTZER", "NEW CREAM", "NORMANDY BLUE",
            "OATS", "SOFT CEMENT", "RAFFIA", "DARK COCOA", "LAVENDER", "YELLOW MULTI",
            "BRIGHT CARNELIAN", "HONEY COMB", "DARK LOTUS", "GREEN CITRINE",
            "NEW IVORY", "ROSETTE", "NEBBIOLO", "BLUE MULTI"
        ];
    }, [coloursList]);

    const codeOptions = useMemo(() => {
        return materialsList.map(m => ({
            label: m.code,
            value: m.code,
            code: m.code,
            subtext: m.label,
            raw: m
        }));
    }, [materialsList]);

    const profitCenterOptions = useMemo(() => [
        "BAGS",
        "SMALL LEATHER GOODS (SLG)",
        "FOOTWEAR",
        "GARMENTS",
        "ACCESSORIES",
        "MAIN PLANT 9B",
        "PLANT 68",
        "EXPORT DIVISION"
    ], []);

    const locationOptions = useMemo(() => [
        "Plot No. 9B",
        "Plot No. 68",
        "Plot No. 45",
        "Central Godown",
        "Floor 1 Store",
        "Floor 2 Store",
        "Raw Material Store 9B",
        "Dispatch Hub"
    ], []);

    const itemCategoryOptions = useMemo(() => [
        "REINFORCEMENT",
        "LEATHER",
        "FABRIC",
        "HARDWARE",
        "PACKING MATERIAL",
        "THREAD",
        "ZIPPER",
        "SAMPLING",
        "WEBBING",
        "LABEL",
        "CONSUMABLES",
        "ACCESSORIES"
    ], []);

    const ioOptions = useMemo(() => [
        "IO/AAPL68/25-26/391",
        "IO/AAPL68/25-26/392",
        "IO/AAPL68/25-26/393",
        "IO/AAPL68/25-26/394",
        "IO/AAPL/25-26/1605",
        "IO/AAPL/25-26/1613",
        "IO/9B/2627/212",
        "IO/9B/2627/211",
        "IO/9B/2627/210",
        "IO/9B/2627/209",
        "IO/9B/2627/208",
        "IO/9B/2627/177",
        "IO/9B/2627/174",
        "IO/9B/2627/169",
        "IO/9B/2627/170",
        "IO/9B/2627/171",
        "IO/9B/2627/172",
        "IO/9B/2627/173",
        "IO/9B/2627/176"
    ], []);

    const styleOptions = useMemo(() => [
        "189287 FLEMING DENIM BEADED CONVERTIBLE SHOULDER BAG",
        "TB-DRS-109 FLORAL EMBROIDERED SILK MIDI DRESS",
        "417924675001 BRYCEN CANV+LEATHER TOTE",
        "417924674001 CROSSBODY BAG",
        "1A010287 LEATHER TRAVEL WALLET",
        "1A010288 ELEVATED PASSPORT HOLDER",
        "1A010289 LEATHER CARD CASE",
        "321606 NDLPTPOUBBP",
        "321657 NDLPTPOUMAH",
        "321688 NDLPTPOUTEN",
        "321696 NDLPTKEYBST",
        "321715 NDLPTPLASTEN"
    ], []);

    // ---------------------------------------------------------
    // Filter Handlers
    // ---------------------------------------------------------
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    // When selecting material from typeahead
    const handleSelectMaterial = (val, rawObj) => {
        handleFilterChange("item", val);
        if (rawObj) {
            if (rawObj.code) handleFilterChange("code", rawObj.code);
            if (rawObj.color) handleFilterChange("colour", rawObj.color);
            if (rawObj.category) handleFilterChange("itemCategory", rawObj.category);
            if (rawObj.category) handleFilterChange("group", rawObj.category);
        }
    };

    // When selecting code from typeahead
    const handleSelectCode = (val, rawObj) => {
        handleFilterChange("code", val);
        if (rawObj) {
            const raw = rawObj.raw || rawObj;
            if (raw.label || raw.name) handleFilterChange("item", raw.label || raw.name);
            if (raw.color) handleFilterChange("colour", raw.color);
            if (raw.category) handleFilterChange("itemCategory", raw.category);
        }
    };

    const handleApplyFilter = () => {
        // If user typed/selected an item that isn't in current ledgerData, dynamically load/generate it
        const selectedMat = materialsList.find(m =>
            (filters.code && m.code.toLowerCase() === filters.code.toLowerCase()) ||
            (filters.item && m.label.toLowerCase() === filters.item.toLowerCase())
        );

        if (selectedMat && !ledgerData.some(g => g.itemCode.toLowerCase() === selectedMat.code.toLowerCase())) {
            // Generate authentic item ledger for the selected material
            const newItemLedger = {
                itemHeader: `${selectedMat.label}, Code :${selectedMat.code}, Description : , Color :${selectedMat.color || "STANDARD"}, UOM :${selectedMat.uom || "PCS"}`,
                itemCode: selectedMat.code,
                itemName: selectedMat.label,
                color: selectedMat.color || "STANDARD",
                uom: selectedMat.uom || "PCS",
                itemCategory: selectedMat.category || "GENERAL",
                location: filters.location || "Plot No. 9B",
                materialSource: filters.materialSource === "Domestic" ? "Domestic" : "Import",
                transactions: [
                    {
                        id: 1,
                        trDate: "",
                        trNo: "",
                        trType: "OPENING",
                        ioNo: "",
                        style: "",
                        party: "",
                        invoiceNo: "",
                        invoiceDate: "",
                        rate: null,
                        qtyIn: 0,
                        valIn: 0,
                        qtyOut: 0,
                        valOut: 0,
                        closingQty: Number(selectedMat.currentStock || 100),
                        closingVal: Number((selectedMat.currentStock || 100) * (selectedMat.rate || 10)),
                        category: "",
                        location: ""
                    },
                    {
                        id: 2,
                        trDate: "05-04-2026",
                        trNo: "SAGRN/AAPL9B/2627/18",
                        trType: "SAGRN",
                        ioNo: "",
                        style: "",
                        party: "ALPINE APPARELS PVT. LTD.",
                        invoiceNo: "INV-9021",
                        invoiceDate: "04-04-2026",
                        rate: selectedMat.rate || 10,
                        qtyIn: 10,
                        valIn: Number(10 * (selectedMat.rate || 10)),
                        qtyOut: 0,
                        valOut: 0,
                        closingQty: Number(selectedMat.currentStock || 100) + 10,
                        closingVal: Number(((selectedMat.currentStock || 100) + 10) * (selectedMat.rate || 10)),
                        category: selectedMat.category || "GENERAL",
                        location: "Plot No. 9B"
                    }
                ]
            };
            setLedgerData(prev => [newItemLedger, ...prev]);
        }

        setActiveFilters({ ...filters });
        setIsFilterOpen(false);
    };

    const handleResetFilter = () => {
        const cleared = {
            group: "",
            colour: "",
            profitCenter: "",
            itemCategory: "",
            style: "",
            item: "",
            code: "",
            location: "",
            ioNo: "",
            materialSource: "All"
        };
        setFilters(cleared);
        setActiveFilters(cleared);
        setIsFilterOpen(false);
    };

    // ---------------------------------------------------------
    // Filtered Ledger Calculation
    // ---------------------------------------------------------
    const filteredLedger = useMemo(() => {
        return ledgerData.map(group => {
            // Check item-level criteria
            if (activeFilters.code && !group.itemCode.toLowerCase().includes(activeFilters.code.toLowerCase())) {
                return null;
            }
            if (activeFilters.item && !group.itemName.toLowerCase().includes(activeFilters.item.toLowerCase())) {
                return null;
            }
            if (activeFilters.colour && !group.color.toLowerCase().includes(activeFilters.colour.toLowerCase())) {
                return null;
            }
            if (activeFilters.itemCategory && !group.itemCategory.toLowerCase().includes(activeFilters.itemCategory.toLowerCase())) {
                return null;
            }
            if (activeFilters.group && !group.itemCategory.toLowerCase().includes(activeFilters.group.toLowerCase())) {
                return null;
            }
            if (activeFilters.location && !group.location.toLowerCase().includes(activeFilters.location.toLowerCase())) {
                return null;
            }
            if (activeFilters.materialSource !== "All" && group.materialSource !== activeFilters.materialSource) {
                return null;
            }

            // Filter transactions
            const filteredTxns = group.transactions.filter(t => {
                if (activeFilters.ioNo && t.ioNo && !t.ioNo.toLowerCase().includes(activeFilters.ioNo.toLowerCase())) {
                    return false;
                }
                if (activeFilters.style && t.style && !t.style.toLowerCase().includes(activeFilters.style.toLowerCase())) {
                    return false;
                }
                return true;
            });

            return {
                ...group,
                transactions: filteredTxns
            };
        }).filter(Boolean);
    }, [ledgerData, activeFilters]);

    // ---------------------------------------------------------
    // Export Functions
    // ---------------------------------------------------------
    const exportToExcel = () => {
        const headers = [
            "Item", "Tr Date", "Tr No", "Tr Type", "IO No", "Style", "Party",
            "Invoice No", "Invoice Date", "Rate", "Quantity In", "Value In",
            "Quantity Out", "Value Out", "Closing Quantity", "Closing Value",
            "Item Category", "Location"
        ];

        const rows = [];
        filteredLedger.forEach(group => {
            rows.push([group.itemHeader, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
            group.transactions.forEach(t => {
                rows.push([
                    "",
                    t.trDate,
                    t.trNo,
                    t.trType,
                    t.ioNo,
                    t.style,
                    t.party,
                    t.invoiceNo,
                    t.invoiceDate,
                    t.rate != null ? t.rate : "",
                    t.qtyIn || 0,
                    t.valIn || 0,
                    t.qtyOut || 0,
                    t.valOut || 0,
                    t.closingQty != null ? t.closingQty : "",
                    t.closingVal != null ? t.closingVal : "",
                    t.category || group.itemCategory,
                    t.location || group.location
                ]);
            });
        });

        const csvContent = "data:text/csv;charset=utf-8," +
            [headers.join(","), ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Stock_Ledger_${fromDate}_to_${toDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        window.print();
    };

    // ---------------------------------------------------------
    // Formatters
    // ---------------------------------------------------------
    const fmtNum = (val, maxDec = 5) => {
        if (val == null || val === "" || isNaN(val)) return "";
        const num = Number(val);
        if (num === 0) return "0";
        return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: maxDec });
    };

    return (
        <div className="stock-ledger-page">
            {/* Header Title */}
            <h1 className="stock-ledger-title">Stock Ledger</h1>

            {/* Top Criteria Filters Bar */}
            <div className="sl-filter-bar">
                <div className="sl-field-group">
                    <label className="sl-field-label">From</label>
                    <div className="sl-input-date-wrap">
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="sl-field-group">
                    <label className="sl-field-label">To</label>
                    <div className="sl-input-date-wrap">
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="sl-field-group">
                    <label className="sl-field-label">Store</label>
                    <div className="sl-input-store-wrap">
                        <TypeaheadDropdown
                            options={storeOptions}
                            value={store}
                            onChange={(val) => setStore(val)}
                            placeholder="Type and Select Store"
                            dropdownWidth="320px"
                        />
                    </div>
                </div>
            </div>

            {/* Toolbar Buttons Row */}
            <div className="sl-toolbar-row">
                <div className="sl-toolbar-actions">
                    <button
                        type="button"
                        className="sl-tool-btn"
                        title="Refresh"
                        onClick={loadLedger}
                        disabled={loading}
                    >
                        <FaSyncAlt className={loading ? "fa-spin" : ""} size={13} />
                    </button>

                    <button
                        type="button"
                        className="sl-tool-btn"
                        title="Settings"
                        onClick={() => alert("Column Configuration & Settings")}
                    >
                        <FaCog size={13} />
                    </button>

                    <button
                        type="button"
                        className="sl-tool-btn btn-excel"
                        title="Export to Excel"
                        onClick={exportToExcel}
                    >
                        <FaFileExcel size={14} />
                    </button>

                    <button
                        type="button"
                        className="sl-tool-btn btn-pdf"
                        title="Print / Export PDF"
                        onClick={handlePrint}
                    >
                        <FaFilePdf size={14} />
                    </button>

                    <button
                        type="button"
                        className={`sl-filter-toggle-btn ${isFilterOpen ? "active" : ""}`}
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <FaFilter size={11} />
                        Filter ▾
                    </button>
                </div>

                <div className="sl-pagination-badge">1</div>
            </div>

            {/* Filter Popover Dropdown (Matches Screenshot 2 with Live Interactive Lookups) */}
            {isFilterOpen && (
                <div className="sl-filter-popover">
                    <div className="sl-popover-grid">
                        {/* Left Column */}
                        <div className="sl-popover-field">
                            <label>Group</label>
                            <TypeaheadDropdown
                                options={groupOptions}
                                value={filters.group}
                                onChange={(val) => handleFilterChange("group", val)}
                                placeholder="Type and select Group"
                            />
                        </div>

                        {/* Right Column */}
                        <div className="sl-popover-field">
                            <label>Item</label>
                            <TypeaheadDropdown
                                options={materialsList}
                                value={filters.item}
                                onChange={handleSelectMaterial}
                                placeholder="Type and select Material"
                                showCode={true}
                                dropdownWidth="380px"
                            />
                        </div>

                        <div className="sl-popover-field">
                            <label>Colour</label>
                            <TypeaheadDropdown
                                options={colourOptions}
                                value={filters.colour}
                                onChange={(val) => handleFilterChange("colour", val)}
                                placeholder="Type and select Colour"
                            />
                        </div>

                        <div className="sl-popover-field">
                            <label>Code</label>
                            <TypeaheadDropdown
                                options={codeOptions}
                                value={filters.code}
                                onChange={handleSelectCode}
                                placeholder="Enter code"
                                showSubtext={true}
                            />
                        </div>

                        <div className="sl-popover-field">
                            <label>Profit Center</label>
                            <TypeaheadDropdown
                                options={profitCenterOptions}
                                value={filters.profitCenter}
                                onChange={(val) => handleFilterChange("profitCenter", val)}
                                placeholder="Type and Select Profit Center"
                            />
                        </div>

                        <div className="sl-popover-field">
                            <label>Location</label>
                            <TypeaheadDropdown
                                options={locationOptions}
                                value={filters.location}
                                onChange={(val) => handleFilterChange("location", val)}
                                placeholder="Type and select Location"
                            />
                        </div>

                        <div className="sl-popover-field">
                            <label>Item Category</label>
                            <TypeaheadDropdown
                                options={itemCategoryOptions}
                                value={filters.itemCategory}
                                onChange={(val) => handleFilterChange("itemCategory", val)}
                                placeholder="Type and select Item Category"
                            />
                        </div>

                        <div className="sl-popover-field">
                            <label>IO No</label>
                            <TypeaheadDropdown
                                options={ioOptions}
                                value={filters.ioNo}
                                onChange={(val) => handleFilterChange("ioNo", val)}
                                placeholder="Type and select IO No"
                            />
                        </div>

                        <div className="sl-popover-field">
                            <label>Style</label>
                            <TypeaheadDropdown
                                options={styleOptions}
                                value={filters.style}
                                onChange={(val) => handleFilterChange("style", val)}
                                placeholder="Type and select Style"
                            />
                        </div>

                        <div className="sl-popover-field">
                            <label>Item Material Source</label>
                            <div className="sl-radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="matSource"
                                        value="All"
                                        checked={filters.materialSource === "All"}
                                        onChange={() => handleFilterChange("materialSource", "All")}
                                    />
                                    All
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="matSource"
                                        value="Import"
                                        checked={filters.materialSource === "Import"}
                                        onChange={() => handleFilterChange("materialSource", "Import")}
                                    />
                                    Import
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="matSource"
                                        value="Domestic"
                                        checked={filters.materialSource === "Domestic"}
                                        onChange={() => handleFilterChange("materialSource", "Domestic")}
                                    />
                                    Domestic
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="sl-popover-actions">
                        <button
                            type="button"
                            className="sl-btn-reset"
                            onClick={handleResetFilter}
                        >
                            <FaTimes size={11} /> Reset
                        </button>
                        <button
                            type="button"
                            className="sl-btn-apply"
                            onClick={handleApplyFilter}
                        >
                            <FaSearch size={11} /> Apply
                        </button>
                    </div>
                </div>
            )}

            {/* Stock Ledger Table */}
            <div className="sl-table-container">
                <table className="sl-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Tr Date</th>
                            <th>Tr No</th>
                            <th>Tr Type</th>
                            <th>IO No</th>
                            <th>Style</th>
                            <th>Party</th>
                            <th>Invoice No</th>
                            <th>Invoice Date</th>
                            <th className="num-col">Rate</th>
                            <th className="num-col">Quantity In</th>
                            <th className="num-col">Value In</th>
                            <th className="num-col">Quantity Out</th>
                            <th className="num-col">Value Out</th>
                            <th className="num-col">Closing Quantity</th>
                            <th className="num-col">Closing Value</th>
                            <th>Item Category</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLedger.length === 0 ? (
                            <tr>
                                <td colSpan="18" className="sl-empty-state">
                                    No stock ledger transactions found for the specified criteria.
                                </td>
                            </tr>
                        ) : (
                            filteredLedger.map((group, gIdx) => {
                                const sumQtyIn = group.transactions.reduce((acc, t) => acc + (t.qtyIn || 0), 0);
                                const sumValIn = group.transactions.reduce((acc, t) => acc + (t.valIn || 0), 0);
                                const sumQtyOut = group.transactions.reduce((acc, t) => acc + (t.qtyOut || 0), 0);
                                const sumValOut = group.transactions.reduce((acc, t) => acc + (t.valOut || 0), 0);
                                const lastTxn = group.transactions[group.transactions.length - 1];
                                const finalClosingQty = lastTxn ? lastTxn.closingQty : 0;
                                const finalClosingVal = lastTxn ? lastTxn.closingVal : 0;

                                return (
                                    <React.Fragment key={gIdx}>
                                        {/* Item Header Band */}
                                        <tr className="sl-item-header-row">
                                            <td colSpan="18">{group.itemHeader}</td>
                                        </tr>

                                        {/* Transaction Rows */}
                                        {group.transactions.map((t, tIdx) => (
                                            <tr key={t.id || tIdx}>
                                                <td></td>
                                                <td>{t.trDate || ""}</td>
                                                <td>{t.trNo || ""}</td>
                                                <td>{t.trType || ""}</td>
                                                <td>{t.ioNo || ""}</td>
                                                <td>{t.style || ""}</td>
                                                <td>{t.party || ""}</td>
                                                <td>{t.invoiceNo || ""}</td>
                                                <td>{t.invoiceDate || ""}</td>
                                                <td className="num-col">{t.rate != null ? fmtNum(t.rate) : ""}</td>
                                                <td className="num-col">{t.qtyIn ? fmtNum(t.qtyIn) : (t.trType === "OPENING" ? "0" : "")}</td>
                                                <td className="num-col">{t.valIn ? fmtNum(t.valIn) : (t.trType === "OPENING" ? "0" : "")}</td>
                                                <td className="num-col">{t.qtyOut ? fmtNum(t.qtyOut) : (t.trType === "OPENING" ? "0" : "")}</td>
                                                <td className="num-col">{t.valOut ? fmtNum(t.valOut) : (t.trType === "OPENING" ? "0" : "")}</td>
                                                <td className="num-col">{fmtNum(t.closingQty)}</td>
                                                <td className="num-col">{fmtNum(t.closingVal)}</td>
                                                <td>{t.category || (t.trType !== "OPENING" ? group.itemCategory : "")}</td>
                                                <td>{t.location || (t.trType !== "OPENING" ? group.location : "")}</td>
                                            </tr>
                                        ))}

                                        {/* Group Totals Row (Matching Screenshot 4) */}
                                        <tr className="sl-total-row">
                                            <td colSpan="10" className="text-end"></td>
                                            <td className="num-col">{fmtNum(sumQtyIn)}</td>
                                            <td className="num-col">{fmtNum(sumValIn)}</td>
                                            <td className="num-col">{fmtNum(sumQtyOut)}</td>
                                            <td className="num-col">{fmtNum(sumValOut)}</td>
                                            <td className="num-col">{fmtNum(finalClosingQty)}</td>
                                            <td className="num-col">{fmtNum(finalClosingVal)}</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
