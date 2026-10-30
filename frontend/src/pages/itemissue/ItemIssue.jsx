import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    FaArrowRight,
    FaExternalLinkAlt
} from "react-icons/fa";
import { generateQRCodeSVG, generateBarcodeSVG } from "../../utils/qrBarcodeUtil";
import { RACK_QR_BIN_CATALOG } from "../mm/wms/PrintBinningSlip";
import "../../styles/itemIssue.css";

const API_URL = process.env.REACT_APP_API_URL || "/api";

// Master Catalog incorporating User Reference Excel items with Item-Wise Pending IRN Numbers & IO Mappings
const DEFAULT_MATERIAL_CATALOG = [
    // -------------------------------------------------------------
    // IO/9B/2627/35 (SAMPLING) -> IRN/APP/9B/2627/1575 (BAG SAMPLING, 04-09-2026)
    // -------------------------------------------------------------
    {
        ItemCode: "HDW-6830",
        ItemName: "BRITTEN HASP 12.4MM HT-6830",
        IrnNo: "IRN/APP/9B/2627/1575",
        IoNo: "IO/9B/2627/35",
        IoStage: "Sampling",
        JobcardNo: "IO/9B/2627/35 (Sampling)",
        IrnDate: "04-09-2026",
        Department: "BAG SAMPLING",
        Associate: "Plot No. 9B",
        RequestedBy: "Ramesh Kumar",
        GroupName: "BRIDGE",
        Variant: "57-14K GOLD",
        Color: "57-14K GOLD",
        ColorCode: "57-14K",
        SizeRange: "12.4mm",
        Size: "12.4mm",
        UOM: "PCS",
        StockQty: 25,
        ReqQty: 4.0,
        IssuedQty: 0.0,
        BalanceQty: 4.0,
        Rate: 45.0,
        Location: "BIN-C-01-01",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack C1",
        Shelf: "Level 1",
        Zone: "Zone C - Hardware",
        Barcode: "BAR-HDW-6830",
        SlipId: "000000000000224"
    },
    {
        ItemCode: "CHN-6582",
        ItemName: "METAL CHAIN 9.2MM OVAL LINK CHAIN 2.5MMGG 138CM HT-6582",
        IrnNo: "IRN/APP/9B/2627/1575",
        IoNo: "IO/9B/2627/35",
        IoStage: "Sampling",
        JobcardNo: "IO/9B/2627/35 (Sampling)",
        IrnDate: "04-09-2026",
        Department: "BAG SAMPLING",
        Associate: "Plot No. 9B",
        RequestedBy: "Ramesh Kumar",
        GroupName: "CHAIN",
        Variant: "57-14K GOLD",
        Color: "57-14K GOLD",
        ColorCode: "57-14K",
        SizeRange: "138cm",
        Size: "138cm",
        UOM: "PCS",
        StockQty: 10,
        ReqQty: 2.0,
        IssuedQty: 0.0,
        BalanceQty: 2.0,
        Rate: 125.0,
        Location: "BIN-C-01-02",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack C1",
        Shelf: "Level 2",
        Zone: "Zone C - Hardware",
        Barcode: "BAR-CHN-6582",
        SlipId: "000000000000225"
    },
    {
        ItemCode: "PLR-3953",
        ItemName: "PULLER METAL NO.3 TBH-3953",
        IrnNo: "IRN/APP/9B/2627/1575",
        IoNo: "IO/9B/2627/35",
        IoStage: "Sampling",
        JobcardNo: "IO/9B/2627/35 (Sampling)",
        IrnDate: "04-09-2026",
        Department: "BAG SAMPLING",
        Associate: "Plot No. 9B",
        RequestedBy: "Ramesh Kumar",
        GroupName: "PULLER",
        Variant: "57-14K GOLD",
        Color: "57-14K GOLD",
        ColorCode: "57-14K",
        SizeRange: "No. 3",
        Size: "No. 3",
        UOM: "PCS",
        StockQty: 30,
        ReqQty: 2.0,
        IssuedQty: 0.0,
        BalanceQty: 2.0,
        Rate: 18.0,
        Location: "BIN-C-01-03",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack C1",
        Shelf: "Level 3",
        Zone: "Zone C - Hardware",
        Barcode: "BAR-PLR-3953",
        SlipId: "000000000000226"
    },
    {
        ItemCode: "STP-03SG",
        ItemName: "YKK BOTTOM STOPPER NO.3 03 SG BAH1 JMA",
        IrnNo: "IRN/APP/9B/2627/1575",
        IoNo: "IO/9B/2627/35",
        IoStage: "Sampling",
        JobcardNo: "IO/9B/2627/35 (Sampling)",
        IrnDate: "04-09-2026",
        Department: "BAG SAMPLING",
        Associate: "Plot No. 9B",
        RequestedBy: "Ramesh Kumar",
        GroupName: "STOPPER",
        Variant: "#57-14K GOLD -C722",
        Color: "#57-14K GOLD -C722",
        ColorCode: "C722",
        SizeRange: "No. 3",
        Size: "No. 3",
        UOM: "PCS",
        StockQty: 100,
        ReqQty: 4.0,
        IssuedQty: 2.0,
        BalanceQty: 2.0,
        Rate: 15.0,
        Location: "BIN-C-01-04",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack C1",
        Shelf: "Level 4",
        Zone: "Zone C - Hardware",
        Barcode: "BAR-STP-03SG",
        SlipId: "000000000000227"
    },

    // -------------------------------------------------------------
    // IO/9B/2627/35 (PRODUCTION) -> IRN/APP/9B/2627/2437 (BAG PRODUCTION, 30-10-2026)
    // -------------------------------------------------------------
    {
        ItemCode: "LBL-COO01",
        ItemName: "TB COO LABEL 1.8X1.9CM TB24-BSN-COO01",
        IrnNo: "IRN/APP/9B/2627/2437",
        IoNo: "IO/9B/2627/35",
        IoStage: "Production",
        JobcardNo: "IO/9B/2627/35 (Production)",
        IrnDate: "30-10-2026",
        Department: "BAG PRODUCTION",
        Associate: "Plot No. 9B",
        RequestedBy: "Sunil Sharma",
        GroupName: "COO LABEL",
        Variant: "N/A",
        Color: "NATURAL",
        ColorCode: "N/A",
        SizeRange: "1.8X1.9CM",
        Size: "1.8X1.9CM",
        UOM: "PCS",
        StockQty: 2500,
        ReqQty: 1785.0,
        IssuedQty: 0.0,
        BalanceQty: 1785.0,
        Rate: 3.5,
        Location: "BIN-D-01-01",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack D1",
        Shelf: "Level 1",
        Zone: "Zone D - Labels",
        Barcode: "BAR-LBL-COO01",
        SlipId: "000000000000228"
    },
    {
        ItemCode: "CRD-1800",
        ItemName: "ROUND LEATHER CORD 1.8MM IMP",
        IrnNo: "IRN/APP/9B/2627/2437",
        IoNo: "IO/9B/2627/35",
        IoStage: "Production",
        JobcardNo: "IO/9B/2627/35 (Production)",
        IrnDate: "30-10-2026",
        Department: "BAG PRODUCTION",
        Associate: "Plot No. 9B",
        RequestedBy: "Sunil Sharma",
        GroupName: "CORD",
        Variant: "CAFFEINE",
        Color: "CAFFEINE",
        ColorCode: "CAF-01",
        SizeRange: "1.8mm",
        Size: "1.8mm",
        UOM: "MTR",
        StockQty: 8000,
        ReqQty: 7497.0,
        IssuedQty: 0.0,
        BalanceQty: 7497.0,
        Rate: 18.0,
        Location: "BIN-B-01-01",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack B1",
        Shelf: "Level 1",
        Zone: "Zone B - Cord & Threads",
        Barcode: "BAR-CRD-1800",
        SlipId: "000000000000229"
    },
    {
        ItemCode: "THR-TEX70-FW",
        ItemName: "TH-NY-TEX-70 T-40/3000",
        IrnNo: "IRN/APP/9B/2627/2437",
        IoNo: "IO/9B/2627/35",
        IoStage: "Production",
        JobcardNo: "IO/9B/2627/35 (Production)",
        IrnDate: "30-10-2026",
        Department: "BAG PRODUCTION",
        Associate: "Plot No. 9B",
        RequestedBy: "Sunil Sharma",
        GroupName: "A&E NYLON BOND THREADS",
        Variant: "FW0323",
        Color: "FW0323",
        ColorCode: "FW0323",
        SizeRange: "3000 MTR",
        Size: "T-40/3000",
        UOM: "CONE",
        StockQty: 15,
        ReqQty: 10.0,
        IssuedQty: 6.0,
        BalanceQty: 4.0,
        Rate: 165.0,
        Location: "BIN-B-01-02",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack B1",
        Shelf: "Level 2",
        Zone: "Zone B - Cord & Threads",
        Barcode: "BAR-THR-TEX70",
        SlipId: "000000000000230"
    },

    // -------------------------------------------------------------
    // IO/9B/2627/35 (PRODUCTION) -> IRN/APP/9B/2627/2292 (BAG PRODUCTION, 22-10-2026)
    // -------------------------------------------------------------
    {
        ItemCode: "TAP-210D",
        ItemName: "NY6 210D OXFORD PU 58 INCH YS-NY210D",
        IrnNo: "IRN/APP/9B/2627/2292",
        IoNo: "IO/9B/2627/35",
        IoStage: "Production",
        JobcardNo: "IO/9B/2627/35 (Production)",
        IrnDate: "22-10-2026",
        Department: "BAG PRODUCTION",
        Associate: "Plot No. 9B",
        RequestedBy: "Sunil Sharma",
        GroupName: "Tapes",
        Variant: "WHITE",
        Color: "WHITE",
        ColorCode: "WHT",
        SizeRange: "58 INCH",
        Size: "58 INCH",
        UOM: "MTR",
        StockQty: 50,
        ReqQty: 23.205,
        IssuedQty: 0.0,
        BalanceQty: 23.205,
        Rate: 85.0,
        Location: "BIN-B-02-01",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack B2",
        Shelf: "Level 1",
        Zone: "Zone B - Fabric & Lining",
        Barcode: "BAR-TAP-210D",
        SlipId: "000000000000231"
    },

    // -------------------------------------------------------------
    // IO/9B/2627/35 (PRODUCTION) -> IRN/APP/9B/2627/2299 (BAG PRODUCTION, 22-10-2026)
    // -------------------------------------------------------------
    {
        ItemCode: "RAF-1100",
        ItemName: "THIN RAFFIA DR1100D.R",
        IrnNo: "IRN/APP/9B/2627/2299",
        IoNo: "IO/9B/2627/35",
        IoStage: "Production",
        JobcardNo: "IO/9B/2627/35 (Production)",
        IrnDate: "22-10-2026",
        Department: "BAG PRODUCTION",
        Associate: "Plot No. 9B",
        RequestedBy: "Sunil Sharma",
        GroupName: "Raffia",
        Variant: "NATURAL",
        Color: "NATURAL",
        ColorCode: "NAT",
        SizeRange: "Standard",
        Size: "Standard",
        UOM: "KG",
        StockQty: 15,
        ReqQty: 5.36,
        IssuedQty: 0.0,
        BalanceQty: 5.36,
        Rate: 420.0,
        Location: "BIN-B-02-02",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack B2",
        Shelf: "Level 2",
        Zone: "Zone B - Fabric & Lining",
        Barcode: "BAR-RAF-1100",
        SlipId: "000000000000232"
    },

    // -------------------------------------------------------------
    // IO/9B/2627/35 (PRODUCTION) -> IRN/APP/9B/2627/2241 (BAG PRODUCTION, 19-10-2026)
    // -------------------------------------------------------------
    {
        ItemCode: "TAP-210D-2",
        ItemName: "NY6 210D OXFORD PU 58 INCH YS-NY210D",
        IrnNo: "IRN/APP/9B/2627/2241",
        IoNo: "IO/9B/2627/35",
        IoStage: "Production",
        JobcardNo: "IO/9B/2627/35 (Production)",
        IrnDate: "19-10-2026",
        Department: "BAG PRODUCTION",
        Associate: "Plot No. 9B",
        RequestedBy: "Sunil Sharma",
        GroupName: "Tapes",
        Variant: "BLACK",
        Color: "BLACK",
        ColorCode: "BLK",
        SizeRange: "58 INCH",
        Size: "58 INCH",
        UOM: "MTR",
        StockQty: 20,
        ReqQty: 0.205,
        IssuedQty: 0.0,
        BalanceQty: 0.205,
        Rate: 85.0,
        Location: "BIN-B-02-03",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack B2",
        Shelf: "Level 3",
        Zone: "Zone B - Fabric & Lining",
        Barcode: "BAR-TAP-210D2",
        SlipId: "000000000000233"
    },

    // -------------------------------------------------------------
    // IO/9B/2627/105 (PRODUCTION) -> IRN/APP/9B/2627/2028 (BAG PRODUCTION, 05-10-2026)
    // -------------------------------------------------------------
    {
        ItemCode: "BDS-10MM",
        ItemName: "STONE (PCS) 10MM",
        IrnNo: "IRN/APP/9B/2627/2028",
        IoNo: "IO/9B/2627/105",
        IoStage: "Production",
        JobcardNo: "IO/9B/2627/105 (Production)",
        IrnDate: "05-10-2026",
        Department: "BAG PRODUCTION",
        Associate: "Plot No. 9B",
        RequestedBy: "Pooja Verma",
        GroupName: "Beads & Stones",
        Variant: "10MM",
        Color: "CLEAR",
        ColorCode: "CLR-10",
        SizeRange: "10MM",
        Size: "10MM",
        UOM: "PCS",
        StockQty: 10000,
        ReqQty: 6835.0,
        IssuedQty: 0.0,
        BalanceQty: 6835.0,
        Rate: 1.25,
        Location: "BIN-C-02-01",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack C2",
        Shelf: "Level 1",
        Zone: "Zone C - Hardware & Stones",
        Barcode: "BAR-BDS-10MM",
        SlipId: "000000000000234"
    },
    {
        ItemCode: "BDS-5MM",
        ItemName: "STONE (PCS) 5MM",
        IrnNo: "IRN/APP/9B/2627/2028",
        IoNo: "IO/9B/2627/105",
        IoStage: "Production",
        JobcardNo: "IO/9B/2627/105 (Production)",
        IrnDate: "05-10-2026",
        Department: "BAG PRODUCTION",
        Associate: "Plot No. 9B",
        RequestedBy: "Pooja Verma",
        GroupName: "Beads & Stones",
        Variant: "5MM",
        Color: "CLEAR",
        ColorCode: "CLR-5",
        SizeRange: "5MM",
        Size: "5MM",
        UOM: "PCS",
        StockQty: 60000,
        ReqQty: 48695.0,
        IssuedQty: 0.0,
        BalanceQty: 48695.0,
        Rate: 0.75,
        Location: "BIN-C-02-02",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack C2",
        Shelf: "Level 2",
        Zone: "Zone C - Hardware & Stones",
        Barcode: "BAR-BDS-5MM",
        SlipId: "000000000000235"
    },

    // -------------------------------------------------------------
    // IO/9B/2627/60 (PRODUCTION) -> IRN/APP/9B/2627/2402 (BAG PRODUCTION, 27-10-2026)
    // -------------------------------------------------------------
    {
        ItemCode: "PPR-7550",
        ItemName: "PAPER CORD 1MM ROUND FSC",
        IrnNo: "IRN/APP/9B/2627/2402",
        IoNo: "IO/9B/2627/60",
        IoStage: "Production",
        JobcardNo: "IO/9B/2627/60 (Production)",
        IrnDate: "27-10-2026",
        Department: "BAG PRODUCTION",
        Associate: "Plot No. 9B",
        RequestedBy: "Ramesh Kumar",
        GroupName: "Paper & Stationery",
        Variant: "PAPER",
        Color: "NATURAL",
        ColorCode: "NAT",
        SizeRange: "1MM",
        Size: "1MM",
        UOM: "MTR",
        StockQty: 3500,
        ReqQty: 2280.0,
        IssuedQty: 0.0,
        BalanceQty: 2280.0,
        Rate: 4.5,
        Location: "BIN-B-02-04",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack B2",
        Shelf: "Level 4",
        Zone: "Zone B - Cord & Threads",
        Barcode: "BAR-PPR-7550",
        SlipId: "000000000000236"
    },

    // -------------------------------------------------------------
    // IO/9B/2627/20 (SAMPLING) -> IRN/APP/9B/2627/1549 (BAG SAMPLING, 02-09-2026)
    // -------------------------------------------------------------
    {
        ItemCode: "RUN-ZN5",
        ItemName: "ZNS RUNNER NO.5",
        IrnNo: "IRN/APP/9B/2627/1549",
        IoNo: "IO/9B/2627/20",
        IoStage: "Sampling",
        JobcardNo: "IO/9B/2627/20 (Sampling)",
        IrnDate: "02-09-2026",
        Department: "BAG SAMPLING",
        Associate: "Plot No. 9B",
        RequestedBy: "Ramesh Kumar",
        GroupName: "Trims & Zippers",
        Variant: "SHINY NICKEL",
        Color: "SHINY NICKEL",
        ColorCode: "SN-05",
        SizeRange: "NO.5",
        Size: "NO.5",
        UOM: "PCS",
        StockQty: 50,
        ReqQty: 10.0,
        IssuedQty: 0.0,
        BalanceQty: 10.0,
        Rate: 22.0,
        Location: "BIN-C-02-03",
        Warehouse: "RAW MATERIAL STORE 9B",
        Rack: "Rack C2",
        Shelf: "Level 3",
        Zone: "Zone C - Hardware",
        Barcode: "BAR-RUN-ZN5",
        SlipId: "000000000000237"
    }
];

// Master Internal Order (IO) Mappings from Excel with Sampling & Production distinctions
const KNOWN_IO_MAPPINGS = [
    {
        ioNo: "IO/9B/2627/35 (Sampling)",
        rawIoNo: "IO/9B/2627/35",
        stage: "Sampling",
        irnNo: "IRN/APP/9B/2627/1575",
        department: "BAG SAMPLING",
        warehouse: "RAW MATERIAL STORE 9B",
        associate: "Plot No. 9B",
        requestedBy: "Ramesh Kumar",
        label: "IO/9B/2627/35 (Sampling) → IRN/APP/9B/2627/1575 (BAG SAMPLING • 4 Items)"
    },
    {
        ioNo: "IO/9B/2627/35 (Production)",
        rawIoNo: "IO/9B/2627/35",
        stage: "Production",
        irnNo: "IRN/APP/9B/2627/2437",
        department: "BAG PRODUCTION",
        warehouse: "RAW MATERIAL STORE 9B",
        associate: "Plot No. 9B",
        requestedBy: "Sunil Sharma",
        label: "IO/9B/2627/35 (Production) → IRN/APP/9B/2627/2437 (BAG PRODUCTION • Labels, Cord, Thread)"
    },
    {
        ioNo: "IO/9B/2627/105 (Production)",
        rawIoNo: "IO/9B/2627/105",
        stage: "Production",
        irnNo: "IRN/APP/9B/2627/2028",
        department: "BAG PRODUCTION",
        warehouse: "RAW MATERIAL STORE 9B",
        associate: "Plot No. 9B",
        requestedBy: "Pooja Verma",
        label: "IO/9B/2627/105 (Production) → IRN/APP/9B/2627/2028 (BAG PRODUCTION • Stones & Beads)"
    },
    {
        ioNo: "IO/9B/2627/60 (Production)",
        rawIoNo: "IO/9B/2627/60",
        stage: "Production",
        irnNo: "IRN/APP/9B/2627/2402",
        department: "BAG PRODUCTION",
        warehouse: "RAW MATERIAL STORE 9B",
        associate: "Plot No. 9B",
        requestedBy: "Ramesh Kumar",
        label: "IO/9B/2627/60 (Production) → IRN/APP/9B/2627/2402 (BAG PRODUCTION • Paper Cord)"
    },
    {
        ioNo: "IO/9B/2627/20 (Sampling)",
        rawIoNo: "IO/9B/2627/20",
        stage: "Sampling",
        irnNo: "IRN/APP/9B/2627/1549",
        department: "BAG SAMPLING",
        warehouse: "RAW MATERIAL STORE 9B",
        associate: "Plot No. 9B",
        requestedBy: "Ramesh Kumar",
        label: "IO/9B/2627/20 (Sampling) → IRN/APP/9B/2627/1549 (BAG SAMPLING • ZNS Runner)"
    }
];

const DEFAULT_WAREHOUSES = [
    "RAW MATERIAL STORE 9B",
    "PLOT NO. 9B",
    "SEMI FINISH STORE 9B",
    "LEATHER WAREHOUSE PLOT 9B",
    "ACCESSORIES GODOWN 18",
    "MAIN FINISHED GOODS STORE"
];

const DEFAULT_SUPPLIERS = [
    "Plot No. 9B",
    "Balaji Trims & Fasteners",
    "Apex Leather Works",
    "Supreme Leathercraft",
    "K-Tex Textiles",
    "Prime Leather Tanning",
    "Vardhman Yarns & Threads",
    "Shree Ganesh Fabrics"
];

const DEFAULT_DEPARTMENTS = [
    "BAG PRODUCTION",
    "BAG SAMPLING",
    "Production",
    "Sampling",
    "Sample Development",
    "Cutting",
    "Stitching",
    "Assembly",
    "Finishing",
    "Packaging"
];

const INITIAL_SAVED_ISSUES = [
    {
        id: 1,
        issueNo: "ISSP/AAPL9B/2627/2098",
        date: "30-10-2026",
        issueTo: "Production",
        associate: "Plot No. 9B",
        department: "BAG PRODUCTION",
        stores: "RAW MATERIAL STORE 9B",
        issuedBy: "Sunil Sharma",
        receivedBy: "Ramesh Kumar",
        requisitionNo: "IRN/APP/9B/2627/2437",
        jobcardNo: "IO/9B/2627/35 (Production)",
        cuttingPlanNo: "CP-2627-044",
        remark: "IO 35 Production run issue",
        internalMemo: "Bulk bag production line",
        totalQty: 9286.0,
        totalAmount: 141850.5,
        status: "Completed",
        items: [
            { id: 1, issueType: "Lot Issue", ioNo: "IRN/APP/9B/2627/2437", group: "COO LABEL", item: "TB COO LABEL 1.8X1.9CM TB24-BSN-COO01", description: "TB COO Label", colour: "NATURAL", typeSize: "1.8X1.9CM", uom: "PCS", location: "BIN-D-01-01", reqQty: 1785.0, pendingQty: 1785.0, stockQty: 2500, issueQty: 1785.0, rate: 3.5, amount: 6247.5, remarks: "IO/9B/2627/35 (Production)" },
            { id: 2, issueType: "Lot Issue", ioNo: "IRN/APP/9B/2627/2437", group: "CORD", item: "ROUND LEATHER CORD 1.8MM IMP", description: "Leather Cord", colour: "CAFFEINE", typeSize: "1.8mm", uom: "MTR", location: "BIN-B-01-01", reqQty: 7497.0, pendingQty: 7497.0, stockQty: 8000, issueQty: 7497.0, rate: 18.0, amount: 134946.0, remarks: "IO/9B/2627/35 (Production)" }
        ]
    },
    {
        id: 2,
        issueNo: "ISSS/AAPL9B/2627/1427",
        date: "04-09-2026",
        issueTo: "Sampling",
        associate: "Plot No. 9B",
        department: "BAG SAMPLING",
        stores: "RAW MATERIAL STORE 9B",
        issuedBy: "Ramesh Kumar",
        receivedBy: "Sunil Sharma",
        requisitionNo: "IRN/APP/9B/2627/1575",
        jobcardNo: "IO/9B/2627/35 (Sampling)",
        cuttingPlanNo: "CP-2627-043",
        remark: "IO 35 Sampling hardware issue",
        internalMemo: "Bag sampling section",
        totalQty: 10.0,
        totalAmount: 496.0,
        status: "Completed",
        items: [
            { id: 1, issueType: "Lot Issue", ioNo: "IRN/APP/9B/2627/1575", group: "BRIDGE", item: "BRITTEN HASP 12.4MM HT-6830", description: "Bridge Hasp Gold", colour: "57-14K GOLD", typeSize: "12.4mm", uom: "PCS", location: "BIN-C-01-01", reqQty: 4.0, pendingQty: 4.0, stockQty: 25, issueQty: 4.0, rate: 45.0, amount: 180.0, remarks: "IO/9B/2627/35 (Sampling)" },
            { id: 2, issueType: "Lot Issue", ioNo: "IRN/APP/9B/2627/1575", group: "CHAIN", item: "METAL CHAIN 9.2MM OVAL LINK CHAIN 2.5MMGG 138CM HT-6582", description: "Metal chain gold", colour: "57-14K GOLD", typeSize: "138cm", uom: "PCS", location: "BIN-C-01-02", reqQty: 2.0, pendingQty: 2.0, stockQty: 10, issueQty: 2.0, rate: 125.0, amount: 250.0, remarks: "IO/9B/2627/35 (Sampling)" }
        ]
    }
];

const INITIAL_STAGE_SERIES_CONFIG = {
    "Production": { prefix: "ISSP/AAPL9B/2627/", nextSerial: 1, defaultDept: "BAG PRODUCTION" },
    "Sampling": { prefix: "ISSS/AAPL9B/2627/", nextSerial: 1, defaultDept: "BAG SAMPLING" },
    "Sample Development": { prefix: "ISSDV/AAPL9B/2627/", nextSerial: 1, defaultDept: "Sample Development" },
    "General": { prefix: "ISSG/AAPL9B/2627/", nextSerial: 1, defaultDept: "General" },
    "Jobwork": { prefix: "ISSJ/AAPL9B/2627/", nextSerial: 1, defaultDept: "Jobwork" },
    "Department": { prefix: "ISSD/AAPL9B/2627/", nextSerial: 1, defaultDept: "Packaging" },
    "Cutting": { prefix: "ISSC/AAPL9B/2627/", nextSerial: 1, defaultDept: "Cutting" },
    "Stitching": { prefix: "ISST/AAPL9B/2627/", nextSerial: 1, defaultDept: "Stitching" },
    "Finishing": { prefix: "ISSF/AAPL9B/2627/", nextSerial: 1, defaultDept: "Finishing" },
    "Packaging": { prefix: "ISPK/AAPL9B/2627/", nextSerial: 1, defaultDept: "Packaging" },
    "R&D / Prototyping": { prefix: "ISRD/AAPL9B/2627/", nextSerial: 1, defaultDept: "R&D" },
    "Maintenance": { prefix: "ISMT/AAPL9B/2627/", nextSerial: 1, defaultDept: "Maintenance" }
};

const INITIAL_EMPTY_LINE = {
    id: 1,
    selected: false,
    issueType: "",
    ioNo: "",
    group: "",
    item: "",
    itemCode: "",
    description: "",
    colour: "",
    typeSize: "",
    uom: "",
    location: "",
    reqQty: "",
    pendingQty: "",
    stockQty: "",
    issueQty: "",
    rate: "",
    amount: "",
    remarks: ""
};

export default function ItemIssue({ initialMode = "form" }) {
    const location = useLocation();
    const navigate = useNavigate();

    // View mode: 'form' or 'list'
    const [viewMode, setViewMode] = useState(initialMode);

    // Stateful catalog so pending IRN quantities & stock update dynamically when issues are saved or fetched from API
    const [catalogItems, setCatalogItems] = useState(DEFAULT_MATERIAL_CATALOG);
    const [rackQrBins, setRackQrBins] = useState(RACK_QR_BIN_CATALOG);
    const [activeRackBin, setActiveRackBin] = useState(RACK_QR_BIN_CATALOG[0]);

    // Pending IRN & Stock Display Panel State (starts closed for a clean blank form)
    const [showPendingIrnPanel, setShowPendingIrnPanel] = useState(false);
    const [selectedIrnFilter, setSelectedIrnFilter] = useState("ALL");
    const [pendingSearchQuery, setPendingSearchQuery] = useState("");
    const [stockStatusFilter, setStockStatusFilter] = useState("ALL"); // ALL | IN_STOCK | LOW_STOCK | OUT_STOCK

    // Stage-wise Prefix & Serial Counter Map (Every stage starts from No. 1)
    const [stageSeriesMap, setStageSeriesMap] = useState(INITIAL_STAGE_SERIES_CONFIG);

    // Form Header State: ONLY IssueNo (prefix + serial from 1) is populated initially; all other fields start blank
    const [issueTo, setIssueTo] = useState("Production");
    const [issuePrefix, setIssuePrefix] = useState("ISSP/AAPL9B/2627/");
    const [issueSerial, setIssueSerial] = useState("1");

    // Switch stage (Production, Sampling, Sample Development, Cutting, Stitching, etc.) -> auto-set prefix & serial from No. 1
    const handleStageChange = (newStage) => {
        setIssueTo(newStage);
        const cfg = stageSeriesMap[newStage];
        if (cfg) {
            setIssuePrefix(cfg.prefix);
            setIssueSerial(String(cfg.nextSerial));
        }

        // Seamless auto-switch between IO 35 Sampling and Production if IO 35 is in use
        if (jobcardNo.includes("2627/35") || requisitionNo === "IRN/APP/9B/2627/1575" || requisitionNo === "IRN/APP/9B/2627/2437") {
            if (newStage === "Sampling") {
                setJobcardNo("IO/9B/2627/35 (Sampling)");
                setRequisitionNo("IRN/APP/9B/2627/1575");
                setSelectedIrnFilter("IRN/APP/9B/2627/1575");
                setModalIrnFilter("IRN/APP/9B/2627/1575");
                setDepartment("BAG SAMPLING");
                setStores("RAW MATERIAL STORE 9B");
                setAssociate("Plot No. 9B");
                setReceivedBy("Ramesh Kumar");
            } else if (newStage === "Production") {
                setJobcardNo("IO/9B/2627/35 (Production)");
                setRequisitionNo("IRN/APP/9B/2627/2437");
                setSelectedIrnFilter("IRN/APP/9B/2627/2437");
                setModalIrnFilter("IRN/APP/9B/2627/2437");
                setDepartment("BAG PRODUCTION");
                setStores("RAW MATERIAL STORE 9B");
                setAssociate("Plot No. 9B");
                setReceivedBy("Sunil Sharma");
            }
        }
    };

    // Switch prefix directly -> sync stage & load its serial counter starting from No. 1
    const handlePrefixChange = (newPrefix) => {
        setIssuePrefix(newPrefix);
        const matchedEntry = Object.entries(stageSeriesMap).find(([, cfg]) => cfg.prefix === newPrefix);
        if (matchedEntry) {
            const [matchedStage, cfg] = matchedEntry;
            setIssueTo(matchedStage);
            setIssueSerial(String(cfg.nextSerial));
        } else {
            setIssueSerial("1");
        }
    };

    const [issueDate, setIssueDate] = useState("");
    const [associate, setAssociate] = useState("");
    const [receivedBy, setReceivedBy] = useState("");
    const [department, setDepartment] = useState("");
    const [stores, setStores] = useState("");
    const [issuedBy, setIssuedBy] = useState("");
    const [requisitionNo, setRequisitionNo] = useState("");
    const [jobcardNo, setJobcardNo] = useState("");
    const [cuttingPlanNo, setCuttingPlanNo] = useState("");

    // =========================================================================
    // 4x4 QR CODE & LOCATION MODULE STATE (LEFT MIDDLE SIDE)
    // =========================================================================
    const [show4x4Panel, setShow4x4Panel] = useState(false);
    const [activeItem4x4, setActiveItem4x4] = useState(DEFAULT_MATERIAL_CATALOG[0]);
    const [scanInput, setScanInput] = useState("");
    const [scanLaserActive, setScanLaserActive] = useState(false);
    const [autoFillToast, setAutoFillToast] = useState("");

    // =========================================================================
    // REQUISITION ITEMS MODAL STATE (EXACT USER REFERENCE SCREENSHOT 2)
    // =========================================================================
    const [reqFilterIoNo, setReqFilterIoNo] = useState("");
    const [reqFilterIrnNo, setReqFilterIrnNo] = useState("");
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

    const [tickedItemCodes, setTickedItemCodes] = useState([]);
    const [rowIssueQtys, setRowIssueQtys] = useState({});

    // Item-Wise Pending IRN Lookup Dropdown State for Header "Requisition No (Pending IRN)"
    const [showIrnLookupDropdown, setShowIrnLookupDropdown] = useState(false);
    const irnDropdownRef = useRef(null);

    // Cutting Slip / Jobcard / IO No Lookup Dropdown State
    const [showIoLookupDropdown, setShowIoLookupDropdown] = useState(false);
    const ioDropdownRef = useRef(null);

    // Table Lines State: starts with a single blank row
    const [lines, setLines] = useState([{ ...INITIAL_EMPTY_LINE }]);

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

    // Close action dropdown, Item-Wise IRN lookup dropdown, and IO lookup dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (actionBtnRef.current && !actionBtnRef.current.contains(e.target)) {
                setShowActionMenu(false);
            }
            if (irnDropdownRef.current && !irnDropdownRef.current.contains(e.target)) {
                setShowIrnLookupDropdown(false);
            }
            if (ioDropdownRef.current && !ioDropdownRef.current.contains(e.target)) {
                setShowIoLookupDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // =========================================================================
    // COMPUTED ITEM-WISE PENDING IRN SUMMARIES & PENDING ITEMS WITH LIVE STOCK
    // =========================================================================
    const pendingIrnSummaries = React.useMemo(() => {
        const map = new Map();
        catalogItems.forEach(item => {
            const irn = item.IrnNo || "IRN/APP/9B/2627/1575";
            if (!map.has(irn)) {
                map.set(irn, {
                    irnNo: irn,
                    ioNo: item.IoNo || "IO/9B/2627/35",
                    ioStage: item.IoStage || (item.Department?.includes("SAMPLING") ? "Sampling" : "Production"),
                    jobcardNo: item.JobcardNo || (item.IoNo ? `${item.IoNo} (${item.IoStage || 'Production'})` : "IO/9B/2627/35"),
                    itemCode: item.ItemCode,
                    itemName: item.ItemName,
                    groupName: item.GroupName,
                    variant: item.Variant || item.Color,
                    uom: item.UOM,
                    location: item.Location,
                    stockQty: Number(item.StockQty || 0),
                    date: item.IrnDate || "04-09-2026",
                    department: item.Department || "BAG PRODUCTION",
                    associate: item.Associate || "Plot No. 9B",
                    requestedBy: item.RequestedBy || "Sunil Sharma",
                    warehouse: item.Warehouse || "RAW MATERIAL STORE 9B",
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

    // Filtered items for the header Item-Wise IRN Lookup Dropdown
    const filteredHeaderIrnItems = React.useMemo(() => {
        const q = requisitionNo.trim().toLowerCase();
        // If requisitionNo exactly matches one item's IrnNo, still show all items in the dropdown so user can switch easily
        const exactMatch = catalogItems.some(it => it.IrnNo && it.IrnNo.toLowerCase() === q);
        if (!q || exactMatch) return catalogItems;
        return catalogItems.filter(it =>
            (it.IrnNo && it.IrnNo.toLowerCase().includes(q)) ||
            it.ItemName.toLowerCase().includes(q) ||
            it.ItemCode.toLowerCase().includes(q) ||
            (it.Department && it.Department.toLowerCase().includes(q)) ||
            (it.Location && it.Location.toLowerCase().includes(q)) ||
            (it.JobcardNo && it.JobcardNo.toLowerCase().includes(q)) ||
            (it.IoNo && it.IoNo.toLowerCase().includes(q))
        );
    }, [catalogItems, requisitionNo]);

    // Filtered items for the header Cutting Slip / Jobcard / IO No Lookup Dropdown
    const filteredHeaderIoItems = React.useMemo(() => {
        const q = jobcardNo.trim().toLowerCase();
        if (!q) return KNOWN_IO_MAPPINGS;
        return KNOWN_IO_MAPPINGS.filter(io =>
            io.ioNo.toLowerCase().includes(q) ||
            io.rawIoNo.toLowerCase().includes(q) ||
            io.stage.toLowerCase().includes(q) ||
            io.irnNo.toLowerCase().includes(q) ||
            io.department.toLowerCase().includes(q)
        );
    }, [jobcardNo]);

    // Filtered items for the live "What is Pending & Stock of That Item" table
    const displayedPendingItems = React.useMemo(() => {
        return catalogItems.filter(item => {
            const matchIrn = selectedIrnFilter === "ALL" || item.IrnNo === selectedIrnFilter;
            const q = pendingSearchQuery.trim().toLowerCase();
            const matchQuery = !q ||
                item.ItemName.toLowerCase().includes(q) ||
                item.ItemCode.toLowerCase().includes(q) ||
                (item.IrnNo && item.IrnNo.toLowerCase().includes(q)) ||
                (item.JobcardNo && item.JobcardNo.toLowerCase().includes(q)) ||
                (item.IoNo && item.IoNo.toLowerCase().includes(q)) ||
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
    // SELECT AN INTERNAL ORDER (IO NO) AND LINK ITS APPROPRIATE IRN FROM EXCEL
    // =========================================================================
    const handleSelectIo = (ioMapping, autoLoadToTable = false) => {
        setJobcardNo(ioMapping.ioNo);
        if (ioMapping.stage) {
            handleStageChange(ioMapping.stage);
        }
        if (ioMapping.irnNo) {
            setRequisitionNo(ioMapping.irnNo);
            setSelectedIrnFilter(ioMapping.irnNo);
            setModalIrnFilter(ioMapping.irnNo);
        }
        if (ioMapping.department) setDepartment(ioMapping.department);
        if (ioMapping.warehouse) setStores(ioMapping.warehouse);
        if (ioMapping.associate) setAssociate(ioMapping.associate);
        if (ioMapping.requestedBy) setReceivedBy(ioMapping.requestedBy);
        setShowIoLookupDropdown(false);

        // Find items belonging to this IO / IRN
        const itemsForIo = catalogItems.filter(it =>
            (ioMapping.irnNo && it.IrnNo === ioMapping.irnNo) ||
            (it.JobcardNo && it.JobcardNo === ioMapping.ioNo) ||
            (it.IoNo === ioMapping.rawIoNo && it.IoStage === ioMapping.stage)
        );

        if (itemsForIo.length > 0) {
            setActiveItem4x4(itemsForIo[0]);
            setTickedItemCodes(itemsForIo.map(m => m.ItemCode));
            const newQtys = { ...rowIssueQtys };
            itemsForIo.forEach(m => {
                newQtys[m.ItemCode] = m.BalanceQty > 0 ? m.BalanceQty : m.ReqQty;
            });
            setRowIssueQtys(newQtys);

            if (autoLoadToTable) {
                const loadedLines = itemsForIo.map((m, idx) => {
                    const qty = m.BalanceQty > 0 ? m.BalanceQty : (m.ReqQty || 1);
                    return {
                        id: idx + 1,
                        selected: false,
                        issueType: "Lot Issue",
                        ioNo: m.IrnNo,
                        group: m.GroupName,
                        item: m.ItemName,
                        itemCode: m.ItemCode,
                        description: `${m.ItemName} [${m.Variant}] - IO: ${ioMapping.ioNo}`,
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
                        remarks: `IO: ${ioMapping.ioNo} | IRN: ${m.IrnNo} (Stock: ${m.StockQty} ${m.UOM})`
                    };
                });
                setLines(loadedLines);
                setAutoFillToast(`Linked ${ioMapping.ioNo} → IRN: ${ioMapping.irnNo} (${loadedLines.length} item(s) loaded)!`);
                setTimeout(() => setAutoFillToast(""), 4500);
            } else {
                setAutoFillToast(`Selected ${ioMapping.ioNo} → Linked to ${ioMapping.irnNo} (${ioMapping.department})`);
                setTimeout(() => setAutoFillToast(""), 3500);
            }
        }
    };

    // =========================================================================
    // SELECT A PENDING IRN OR LOAD ITS PENDING ITEMS INTO ISSUE FORM
    // =========================================================================
    const handleSelectPendingIrn = (irnSummary, autoLoadToTable = false) => {
        setSelectedIrnFilter(irnSummary.irnNo);
        setModalIrnFilter(irnSummary.irnNo);
        setRequisitionNo(irnSummary.irnNo);
        setDepartment(irnSummary.department);
        setStores(irnSummary.warehouse);
        setAssociate(irnSummary.associate);
        setReceivedBy(irnSummary.requestedBy);

        // Auto link IO and Stage
        if (irnSummary.jobcardNo) {
            setJobcardNo(irnSummary.jobcardNo);
        } else if (irnSummary.ioNo) {
            setJobcardNo(`${irnSummary.ioNo} (${irnSummary.ioStage || 'Production'})`);
        }
        if (irnSummary.ioStage) {
            handleStageChange(irnSummary.ioStage);
        }
        setShowIrnLookupDropdown(false);

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
                    description: `${m.ItemName} [${m.Variant}] - IRN: ${m.IrnNo} • IO: ${irnSummary.jobcardNo || irnSummary.ioNo}`,
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
                    remarks: `Pending IRN ${m.IrnNo} | IO: ${irnSummary.jobcardNo || irnSummary.ioNo} (Stock: ${m.StockQty} ${m.UOM})`
                };
            });
            setLines(loadedLines);
            setAutoFillToast(`Loaded ${loadedLines.length} item(s) for ${irnSummary.jobcardNo || irnSummary.ioNo} [IRN: ${irnSummary.irnNo}] into Item Issue!`);
            setTimeout(() => setAutoFillToast(""), 4500);
        }
    };

    // Issue a single pending item directly from the Pending IRN table or Header Item-Wise IRN Dropdown
    const handleIssueSinglePendingItem = (m) => {
        setActiveItem4x4(m);
        setRequisitionNo(m.IrnNo || requisitionNo);
        if (m.Department) setDepartment(m.Department);
        if (m.Warehouse) setStores(m.Warehouse);
        if (m.Associate) setAssociate(m.Associate);
        if (m.RequestedBy) setReceivedBy(m.RequestedBy);
        if (m.JobcardNo) {
            setJobcardNo(m.JobcardNo);
        } else if (m.IoNo) {
            setJobcardNo(`${m.IoNo} (${m.IoStage || 'Production'})`);
        }
        if (m.IoStage) {
            handleStageChange(m.IoStage);
        }
        setShowIrnLookupDropdown(false);
        setShowIoLookupDropdown(false);

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
                description: `${m.ItemName} [${m.Variant}] - IO: ${m.JobcardNo || m.IoNo} • Loc: ${m.Location}`,
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
                remarks: `Item-Wise IRN ${m.IrnNo} | IO: ${m.JobcardNo || m.IoNo} | Bal: ${m.BalanceQty} | Stock: ${m.StockQty}`
            };

            if (existingIdx !== -1) {
                const copy = [...existingNonEmpty];
                copy[existingIdx] = newLineObj;
                return copy;
            }
            return [...existingNonEmpty, newLineObj];
        });

        setAutoFillToast(`Selected Item-Wise IRN ${m.IrnNo}: ${m.ItemName} [IO: ${m.JobcardNo || m.IoNo}]!`);
        setTimeout(() => setAutoFillToast(""), 4000);
    };

    // =========================================================================
    // LOCATION-WISE & RACK QR-CODE-WISE ITEM ISSUE HANDLER
    // =========================================================================
    const handleIssueFromRackBin = (binObj, autoAddLine = true) => {
        if (!binObj) return;
        setActiveRackBin(binObj);
        setScanLaserActive(true);
        setTimeout(() => setScanLaserActive(false), 750);

        const matchedCat = catalogItems.find(
            c => c.ItemCode === binObj.ItemCode || c.Location === binObj.BinCode
        );

        const unifiedItem = matchedCat
            ? {
                ...matchedCat,
                Location: binObj.BinCode,
                Rack: `${binObj.Rack} / ${binObj.Level}`,
                Warehouse: binObj.Warehouse,
                StockQty: binObj.ItemWiseStockQty
            }
            : {
                ItemCode: binObj.ItemCode,
                ItemName: binObj.ItemName,
                IrnNo: binObj.PendingIrnNo,
                IrnDate: binObj.IrnDate,
                Department: binObj.Department,
                GroupName: binObj.Category,
                Variant: binObj.Variant,
                Color: binObj.Color,
                SizeRange: "Standard",
                Size: "Std",
                UOM: binObj.UOM,
                StockQty: binObj.ItemWiseStockQty,
                ReqQty: binObj.IrnWiseReqQty,
                IssuedQty: binObj.IrnIssuedQty,
                BalanceQty: binObj.IrnPendingQty,
                Rate: binObj.Rate,
                Location: binObj.BinCode,
                Warehouse: binObj.Warehouse,
                Rack: `${binObj.Rack} / ${binObj.Level}`,
                Barcode: binObj.Barcode
            };

        setActiveItem4x4(unifiedItem);
        if (binObj.PendingIrnNo) {
            setRequisitionNo(binObj.PendingIrnNo);
        }
        if (binObj.Department) setDepartment(binObj.Department);
        if (binObj.Warehouse) setStores(binObj.Warehouse);

        if (autoAddLine) {
            const qtyToIssue = binObj.IrnPendingQty > 0 ? binObj.IrnPendingQty : 1;
            setLines(prev => {
                const existingNonEmpty = prev.filter(r => r.item && r.item.trim() !== "");
                const existingIdx = existingNonEmpty.findIndex(
                    r => r.location === binObj.BinCode && r.itemCode === binObj.ItemCode
                );
                const newRow = {
                    id: existingIdx !== -1
                        ? existingNonEmpty[existingIdx].id
                        : (existingNonEmpty.length > 0 ? Math.max(...existingNonEmpty.map(l => l.id)) + 1 : 1),
                    selected: false,
                    issueType: "Lot Issue",
                    ioNo: binObj.PendingIrnNo || requisitionNo,
                    group: binObj.Category,
                    item: binObj.ItemName,
                    itemCode: binObj.ItemCode,
                    description: `${binObj.ItemName} [Rack QR: ${binObj.BinCode} | ${binObj.Zone} • ${binObj.Rack} • ${binObj.Level}]`,
                    colour: binObj.Variant || binObj.Color,
                    typeSize: "Std",
                    uom: binObj.UOM,
                    location: binObj.BinCode,
                    reqQty: binObj.IrnWiseReqQty,
                    pendingQty: binObj.IrnPendingQty,
                    stockQty: binObj.ItemWiseStockQty,
                    issueQty: qtyToIssue,
                    rate: binObj.Rate,
                    amount: parseFloat((qtyToIssue * binObj.Rate).toFixed(2)),
                    remarks: `Rack QR Issue [${binObj.BinCode}] | Item Stock: ${binObj.ItemWiseStockQty} ${binObj.UOM} | IRN Req: ${binObj.IrnWiseReqQty} ${binObj.UOM}`
                };

                if (existingIdx !== -1) {
                    const copy = [...existingNonEmpty];
                    copy[existingIdx] = newRow;
                    return copy;
                }
                return [...existingNonEmpty, newRow];
            });

            setAutoFillToast(
                `Rack QR Linked [${binObj.BinCode}]: ${binObj.ItemName} | Item Stock: ${binObj.ItemWiseStockQty} ${binObj.UOM} | IRN (${binObj.PendingIrnNo}) Req: ${binObj.IrnWiseReqQty} ${binObj.UOM}, Pending: ${binObj.IrnPendingQty} ${binObj.UOM}`
            );
            setTimeout(() => setAutoFillToast(""), 5000);
        }
    };

    // Handle direct incoming navigation from /wms/print-binning-slip (Rack QR Stickers)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const binParam = params.get("bin") || location.state?.rackBin?.BinCode;
        if (binParam) {
            const matchedBin = rackQrBins.find(b => b.BinCode.toLowerCase() === binParam.toLowerCase());
            if (matchedBin) {
                setViewMode("form");
                setShow4x4Panel(true);
                setShowPendingIrnPanel(true);
                handleIssueFromRackBin(matchedBin, true);
            }
        }
    }, [location.search, location.state]);

    // =========================================================================
    // AUTO FILL LOGIC ON SCAN / CODE ENTRY (SUPPORTS RACK QR & ITEM QR)
    // =========================================================================
    const handleScanAutoFill = (inputCode) => {
        const rawQuery = (inputCode || scanInput).trim();
        if (!rawQuery) return;

        // Extract BinCode if scanned from Rack QR payload format: RACKQR|BIN-A-01-01|ITEM:LTH-1001|...
        let query = rawQuery;
        if (rawQuery.toUpperCase().startsWith("RACKQR|")) {
            const parts = rawQuery.split("|");
            if (parts[1]) query = parts[1].trim();
        }

        // First check if scanned code matches a Rack QR Sticker Bin (BIN-A-01-01, etc.)
        const matchedRackBin = rackQrBins.find(
            b =>
                b.BinCode.toLowerCase() === query.toLowerCase() ||
                b.Barcode.toLowerCase() === query.toLowerCase()
        );
        if (matchedRackBin) {
            handleIssueFromRackBin(matchedRackBin, true);
            setScanInput("");
            return;
        }

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
            const binMatch = rackQrBins.find(b => b.BinCode === matched.Location || b.ItemCode === matched.ItemCode);
            if (binMatch) setActiveRackBin(binMatch);
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

            setAutoFillToast(`Auto-filled: ${matched.ItemName} [IRN: ${matched.IrnNo}] (Pending: ${matched.BalanceQty} ${matched.UOM}, Stock: ${matched.StockQty} ${matched.UOM})`);
            setTimeout(() => setAutoFillToast(""), 4500);
            setScanInput("");
        } else {
            alert(`No Rack QR Bin, material, or IRN found matching '${query}'.`);
        }
    };

    // =========================================================================
    // REQUISITION ITEMS MODAL FILTERING & TICK SELECTION (SCREENSHOT 2)
    // =========================================================================
    const filteredReqMaterials = catalogItems.filter(m => {
        const matchIrn = modalIrnFilter === "ALL" || m.IrnNo === modalIrnFilter;
        const matchIoCol = !reqFilterIoNo || (m.JobcardNo && m.JobcardNo.toLowerCase().includes(reqFilterIoNo.toLowerCase())) || (m.IoNo && m.IoNo.toLowerCase().includes(reqFilterIoNo.toLowerCase()));
        const matchIrnCol = !reqFilterIrnNo || (m.IrnNo && m.IrnNo.toLowerCase().includes(reqFilterIrnNo.toLowerCase()));
        const matchItem = !reqFilterItem || m.ItemName.toLowerCase().includes(reqFilterItem.toLowerCase()) || m.ItemCode.toLowerCase().includes(reqFilterItem.toLowerCase()) || (m.IrnNo && m.IrnNo.toLowerCase().includes(reqFilterItem.toLowerCase()));
        const matchVariant = !reqFilterVariant || m.Variant.toLowerCase().includes(reqFilterVariant.toLowerCase());
        const matchSizeRange = !reqFilterSizeRange || m.SizeRange.toLowerCase().includes(reqFilterSizeRange.toLowerCase());
        const matchSize = !reqFilterSize || String(m.Size).toLowerCase().includes(reqFilterSize.toLowerCase());
        const matchReq = !reqFilterReqQty || String(m.ReqQty).includes(reqFilterReqQty);
        const matchStock = !reqFilterStock || String(m.StockQty).includes(reqFilterStock);
        const matchAlready = !reqFilterAlreadyIssued || String(m.IssuedQty).includes(reqFilterAlreadyIssued);
        const matchBal = !reqFilterBalToIssue || String(m.BalanceQty).includes(reqFilterBalToIssue);
        return matchIrn && matchIoCol && matchIrnCol && matchItem && matchVariant && matchSizeRange && matchSize && matchReq && matchStock && matchAlready && matchBal;
    });

    const handleResetReqFilters = () => {
        setReqFilterIoNo("");
        setReqFilterIrnNo("");
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
                    description: `${m.ItemName} [${m.Variant}] - IO: ${m.JobcardNo || m.IoNo} • Loc: ${m.Location}`,
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
                    remarks: `Issued against Item-Wise IRN ${m.IrnNo || requisitionNo} [${m.JobcardNo || m.IoNo}]`
                };
            });
        });

        if (selectedItems.length > 0) {
            setActiveItem4x4(selectedItems[0]);
            if (selectedItems[0].IrnNo) {
                setRequisitionNo(selectedItems[0].IrnNo);
            }
            if (selectedItems[0].JobcardNo) {
                setJobcardNo(selectedItems[0].JobcardNo);
            }
            if (selectedItems[0].IoStage) {
                handleStageChange(selectedItems[0].IoStage);
            }
            if (selectedItems[0].Department) {
                setDepartment(selectedItems[0].Department);
            }
            if (selectedItems[0].Warehouse) {
                setStores(selectedItems[0].Warehouse);
            }
            if (selectedItems[0].Associate) {
                setAssociate(selectedItems[0].Associate);
            }
            if (selectedItems[0].RequestedBy) {
                setReceivedBy(selectedItems[0].RequestedBy);
            }
        }

        setAutoFillToast(`Loaded ${selectedItems.length} item-wise IRN item(s) for ${selectedItems[0]?.JobcardNo || "IO"} into Item Issue!`);
        setTimeout(() => setAutoFillToast(""), 4500);
        setActiveModal(null);
    };

    // Line items change handler (supports both Item selection AND Item-Wise IRN / IO No selection)
    const handleLineChange = (id, field, value) => {
        setLines(prev => prev.map(row => {
            if (row.id !== id) return row;
            const updated = { ...row, [field]: value };

            if (field === "ioNo") {
                const valStr = String(value).trim().toLowerCase();
                const foundByIrn = catalogItems.find(it =>
                    (it.IrnNo && it.IrnNo.toLowerCase() === valStr) ||
                    (it.JobcardNo && it.JobcardNo.toLowerCase().includes(valStr)) ||
                    (it.IoNo && it.IoNo.toLowerCase() === valStr)
                );
                if (foundByIrn) {
                    updated.issueType = updated.issueType || "Lot Issue";
                    updated.ioNo = foundByIrn.IrnNo;
                    updated.item = foundByIrn.ItemName;
                    updated.itemCode = foundByIrn.ItemCode;
                    updated.group = foundByIrn.GroupName || updated.group;
                    updated.description = `${foundByIrn.ItemName} [${foundByIrn.Variant}] - IRN: ${foundByIrn.IrnNo} • IO: ${foundByIrn.JobcardNo || foundByIrn.IoNo}`;
                    updated.colour = foundByIrn.Variant || foundByIrn.Color || updated.colour;
                    updated.typeSize = foundByIrn.Size || foundByIrn.SizeRange || updated.typeSize;
                    updated.uom = foundByIrn.UOM || updated.uom || "PCS";
                    updated.location = foundByIrn.Location || updated.location;
                    updated.reqQty = foundByIrn.ReqQty || 0;
                    updated.pendingQty = foundByIrn.BalanceQty || 0;
                    updated.stockQty = foundByIrn.StockQty || 0;
                    updated.issueQty = foundByIrn.BalanceQty > 0 ? foundByIrn.BalanceQty : (updated.issueQty || 1);
                    updated.rate = foundByIrn.Rate || updated.rate;
                    if (updated.issueQty && updated.rate) {
                        updated.amount = parseFloat((parseFloat(updated.issueQty) * parseFloat(updated.rate)).toFixed(2));
                    }
                    updated.remarks = `Item-Wise IRN ${foundByIrn.IrnNo} | IO: ${foundByIrn.JobcardNo || foundByIrn.IoNo} (Stock: ${foundByIrn.StockQty} ${foundByIrn.UOM})`;
                    setActiveItem4x4(foundByIrn);
                    setRequisitionNo(foundByIrn.IrnNo);
                    if (foundByIrn.JobcardNo) setJobcardNo(foundByIrn.JobcardNo);
                    if (foundByIrn.IoStage) handleStageChange(foundByIrn.IoStage);
                    if (foundByIrn.Department) setDepartment(foundByIrn.Department);
                    if (foundByIrn.Warehouse) setStores(foundByIrn.Warehouse);
                }
            }

            if (field === "item") {
                const found = catalogItems.find(it =>
                    it.ItemName.toLowerCase() === String(value).toLowerCase() ||
                    it.ItemCode.toLowerCase() === String(value).toLowerCase()
                );
                if (found) {
                    updated.issueType = updated.issueType || "Lot Issue";
                    updated.item = found.ItemName;
                    updated.itemCode = found.ItemCode;
                    updated.ioNo = found.IrnNo || updated.ioNo || requisitionNo;
                    updated.group = found.GroupName || updated.group;
                    updated.description = `${found.ItemName} [${found.Variant}] - IRN: ${found.IrnNo} • IO: ${found.JobcardNo || found.IoNo}`;
                    updated.colour = found.Variant || found.Color || updated.colour;
                    updated.typeSize = found.Size || found.SizeRange || updated.typeSize;
                    updated.uom = found.UOM || updated.uom || "PCS";
                    updated.location = found.Location || updated.location;
                    updated.reqQty = found.ReqQty || 0;
                    updated.pendingQty = found.BalanceQty || 0;
                    updated.stockQty = found.StockQty || 0;
                    updated.issueQty = found.BalanceQty > 0 ? found.BalanceQty : (updated.issueQty || 1);
                    updated.rate = found.Rate || updated.rate;
                    if (updated.issueQty && updated.rate) {
                        updated.amount = parseFloat((parseFloat(updated.issueQty) * parseFloat(updated.rate)).toFixed(2));
                    }
                    updated.remarks = `Item-Wise IRN ${found.IrnNo} | IO: ${found.JobcardNo || found.IoNo} (Stock: ${found.StockQty} ${found.UOM})`;
                    setActiveItem4x4(found);
                    if (found.IrnNo) setRequisitionNo(found.IrnNo);
                    if (found.JobcardNo) setJobcardNo(found.JobcardNo);
                    if (found.IoStage) handleStageChange(found.IoStage);
                    if (found.Department) setDepartment(found.Department);
                    if (found.Warehouse) setStores(found.Warehouse);
                }
            }

            if (field === "issueQty" || field === "rate") {
                const qty = field === "issueQty" ? parseFloat(value) || 0 : parseFloat(row.issueQty) || 0;
                const rate = field === "rate" ? parseFloat(value) || 0 : parseFloat(row.rate) || 0;
                updated.amount = (qty && rate) ? parseFloat((qty * rate).toFixed(2)) : "";
            }

            return updated;
        }));
    };

    const handleAddLine = () => {
        const nextId = lines.length > 0 ? Math.max(...lines.map(l => l.id)) + 1 : 1;
        setLines(prev => [
            ...prev,
            {
                ...INITIAL_EMPTY_LINE,
                id: nextId,
                ioNo: requisitionNo || ""
            }
        ]);
    };

    const handleDeleteLine = (id) => {
        if (lines.length <= 1) {
            setLines([{
                ...INITIAL_EMPTY_LINE,
                id: 1
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
        if (requisitionNo) {
            setModalIrnFilter(requisitionNo);
        } else if (jobcardNo) {
            const matchedIo = KNOWN_IO_MAPPINGS.find(m =>
                jobcardNo.toLowerCase().includes(m.rawIoNo.toLowerCase()) ||
                jobcardNo.toLowerCase().includes(m.ioNo.toLowerCase())
            );
            if (matchedIo) {
                setModalIrnFilter(matchedIo.irnNo);
            }
        }
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

        // Dynamically update Rack QR Bin Catalog stock & IRN pending quantities
        setRackQrBins(prevBins => prevBins.map(bin => {
            const issuedLine = validLines.find(
                l => (l.location && l.location === bin.BinCode) ||
                     (l.itemCode && l.itemCode === bin.ItemCode) ||
                     (l.item && l.item.toLowerCase() === bin.ItemName.toLowerCase())
            );
            if (!issuedLine) return bin;
            const qtyIssuedNow = parseFloat(issuedLine.issueQty) || 0;
            const newIssued = Number(bin.IrnIssuedQty || 0) + qtyIssuedNow;
            const newPending = Math.max(0, Number(bin.IrnWiseReqQty || 0) - newIssued);
            const newStock = Math.max(0, Number(bin.ItemWiseStockQty || 0) - qtyIssuedNow);
            return {
                ...bin,
                IrnIssuedQty: newIssued,
                IrnPendingQty: newPending,
                ItemWiseStockQty: newStock
            };
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
        setSuccessMessage(`Item Issue ${fullIssueNo} (${issueTo}) saved against IRN ${requisitionNo || "Direct"}! Window closed and Register updated.`);

        // Increment the serial number specifically for the active stage & prefix
        const nextNum = (parseInt(issueSerial, 10) || 1) + 1;
        setIssueSerial(String(nextNum));
        setStageSeriesMap(prev => ({
            ...prev,
            [issueTo]: {
                ...(prev[issueTo] || { prefix: issuePrefix, defaultDept: department }),
                prefix: issuePrefix,
                nextSerial: nextNum
            }
        }));

        // Automatically close open panels/modals and close the Item Issue form window back to Register
        setActiveModal(null);
        setShowActionMenu(false);
        setShow4x4Panel(false);
        setShowPendingIrnPanel(false);
        setViewMode("list");
        window.scrollTo({ top: 0, behavior: "smooth" });

        setTimeout(() => setSuccessMessage(""), 5000);
    };

    const handleResetForm = () => {
        setIssueDate("");
        setAssociate("");
        setReceivedBy("");
        setDepartment("");
        setStores("");
        setIssuedBy("");
        setRequisitionNo("");
        setJobcardNo("");
        setCuttingPlanNo("");
        setRemark("");
        setInternalMemo("");
        setTickedItemCodes([]);
        setRowIssueQtys({});
        setLines([{ ...INITIAL_EMPTY_LINE }]);
        setShowActionMenu(false);
        setShowIoLookupDropdown(false);
        setShowIrnLookupDropdown(false);
        setSelectedIrnFilter("ALL");
        setModalIrnFilter("ALL");
        setPendingSearchQuery("");
        setStockStatusFilter("ALL");
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

                            {/* Option Button: Direct Rack QR Stickers (Location-Wise & QR-Code-Wise Item Issue) */}
                            <button
                                type="button"
                                className="tpcs-ii-btn-save"
                                onClick={() => setActiveModal("rackQrStickers")}
                                title="Rack QR Stickers — Location-Wise & QR-Code-Wise Direct Item Issue"
                                style={{ backgroundColor: "#047857" }}
                            >
                                <FaQrcode />
                                <span>Rack QR Stickers (Location Issue)</span>
                            </button>

                            <button
                                type="button"
                                className="tpcs-ii-btn-view"
                                onClick={() => navigate("/wms/print-binning-slip?format=rack-labels")}
                                title="Open Print Binning Slip & Rack QR Stickers Page"
                                style={{ borderColor: "#047857", color: "#047857", fontWeight: 700 }}
                            >
                                <FaExternalLinkAlt />
                                <span>Print Rack QR Page</span>
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

                            {/* Close Item Issue Window */}
                            <button
                                type="button"
                                className="tpcs-ii-btn-view"
                                onClick={() => {
                                    setActiveModal(null);
                                    setShow4x4Panel(false);
                                    setShowPendingIrnPanel(false);
                                    setViewMode("list");
                                }}
                                title="Close Item Issue Window"
                                style={{
                                    backgroundColor: "#ef4444",
                                    color: "#ffffff",
                                    borderColor: "#dc2626",
                                    fontWeight: 700
                                }}
                            >
                                <FaTimes /> <span>Close</span>
                            </button>
                        </div>
                    </div>

                    {/* Issue To Stage Row (Auto-switches Prefix & Serial from No. 1 per Stage) */}
                    <div className="tpcs-ii-issue-to-row">
                        <label className="tpcs-ii-label">Issue To</label>
                        <select
                            className="tpcs-ii-select"
                            value={issueTo}
                            onChange={(e) => handleStageChange(e.target.value)}
                        >
                            {Object.keys(stageSeriesMap).map(stageName => (
                                <option key={stageName} value={stageName}>
                                    {stageName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 4-Columns Header Form Grid */}
                    <div className="tpcs-ii-grid">
                        {/* COLUMN 1: IssueNo */}
                        <div className="tpcs-ii-field-group">
                            <label className="tpcs-ii-label">
                                IssueNo <span style={{ fontSize: "10px", color: "#1976d2", fontWeight: 700 }}>({issueTo} Series from No. 1)</span>
                            </label>
                            <div className="tpcs-ii-issueno-group">
                                <select
                                    className="tpcs-ii-issueno-prefix"
                                    value={issuePrefix}
                                    onChange={(e) => handlePrefixChange(e.target.value)}
                                >
                                    {Object.entries(stageSeriesMap).map(([stageName, cfg]) => (
                                        <option key={stageName} value={cfg.prefix}>
                                            {cfg.prefix} ({stageName})
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    className="tpcs-ii-issueno-num"
                                    value={issueSerial}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setIssueSerial(val);
                                        const numVal = parseInt(val, 10);
                                        if (!isNaN(numVal) && numVal >= 1) {
                                            setStageSeriesMap(prev => ({
                                                ...prev,
                                                [issueTo]: {
                                                    ...(prev[issueTo] || { prefix: issuePrefix }),
                                                    nextSerial: numVal
                                                }
                                            }));
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="tpcs-ii-addon-btn btn-gear"
                                    title="Configure Stage-Wise Prefixes & Reset Serial Numbers to 1"
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
                                    placeholder="Select Date (DD-MM-YYYY)"
                                    value={issueDate}
                                    onChange={(e) => setIssueDate(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="tpcs-ii-addon-btn"
                                    title="Select Date"
                                    onClick={() => {
                                        const now = new Date();
                                        const defaultDate = issueDate || `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
                                        const d = prompt("Enter Date (DD-MM-YYYY):", defaultDate);
                                        if (d !== null) setIssueDate(d);
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

                        {/* ROW 2 - COL 4: Requisition No (Item-Wise Pending IRN Selector) */}
                        <div className="tpcs-ii-field-group" ref={irnDropdownRef} style={{ position: "relative" }}>
                            <label className="tpcs-ii-label">
                                Requisition No (Item-Wise Pending IRN)
                            </label>
                            <div className="tpcs-ii-input-group">
                                <input
                                    type="text"
                                    className="tpcs-ii-input"
                                    placeholder="Select Item-Wise Pending IRN No"
                                    value={requisitionNo}
                                    onFocus={() => setShowIrnLookupDropdown(true)}
                                    onClick={() => setShowIrnLookupDropdown(true)}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setRequisitionNo(val);
                                        setShowIrnLookupDropdown(true);
                                        const matchedItem = catalogItems.find(
                                            it => it.IrnNo && it.IrnNo.toLowerCase() === val.trim().toLowerCase()
                                        );
                                        if (matchedItem) {
                                            handleIssueSinglePendingItem(matchedItem);
                                        }
                                    }}
                                    list="pending-irns-datalist"
                                    style={{ fontWeight: 700, color: "#1976d2" }}
                                />
                                <datalist id="pending-irns-datalist">
                                    {catalogItems.map(it => (
                                        <option key={it.IrnNo} value={it.IrnNo}>
                                            {it.ItemName} ({it.ItemCode}) | Pending: {it.BalanceQty} {it.UOM} | Stock: {it.StockQty} {it.UOM}
                                        </option>
                                    ))}
                                </datalist>
                                <button
                                    type="button"
                                    className="tpcs-ii-addon-btn"
                                    title="Toggle Item-Wise Pending IRN Numbers List"
                                    onClick={() => setShowIrnLookupDropdown(prev => !prev)}
                                >
                                    <FaListUl />
                                </button>
                            </div>

                            {/* Interactive Item-Wise IRN Numbers Dropdown Panel */}
                            {showIrnLookupDropdown && (
                                <div style={{
                                    position: "absolute",
                                    top: "100%",
                                    right: 0,
                                    width: "560px",
                                    maxWidth: "92vw",
                                    maxHeight: "340px",
                                    overflowY: "auto",
                                    backgroundColor: "#ffffff",
                                    border: "1.5px solid #1976d2",
                                    borderRadius: "6px",
                                    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.18)",
                                    zIndex: 1200,
                                    marginTop: "4px"
                                }}>
                                    <div style={{
                                        background: "#0f172a",
                                        color: "#ffffff",
                                        padding: "7px 12px",
                                        fontSize: "11.5px",
                                        fontWeight: 700,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 2
                                    }}>
                                        <span>Item-Wise Pending IRN Numbers ({filteredHeaderIrnItems.length} Items)</span>
                                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowIrnLookupDropdown(false);
                                                    setActiveModal("requisitionItems");
                                                }}
                                                style={{
                                                    background: "#2563eb",
                                                    color: "#ffffff",
                                                    border: "none",
                                                    borderRadius: "3px",
                                                    padding: "2px 8px",
                                                    fontSize: "10.5px",
                                                    fontWeight: 700,
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Multi-Select Modal
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowIrnLookupDropdown(false)}
                                                style={{
                                                    background: "transparent",
                                                    color: "#cbd5e1",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    </div>

                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                                        <thead>
                                            <tr style={{ background: "#f1f5f9", color: "#334155", borderBottom: "1px solid #cbd5e1", textAlign: "left" }}>
                                                <th style={{ padding: "5px 8px" }}>Item-Wise IRN No</th>
                                                <th style={{ padding: "5px 8px" }}>Item Name &amp; Code</th>
                                                <th style={{ padding: "5px 8px" }}>Dept / Bin</th>
                                                <th style={{ padding: "5px 8px", textAlign: "right" }}>Pending</th>
                                                <th style={{ padding: "5px 8px", textAlign: "right" }}>Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredHeaderIrnItems.map(it => {
                                                const isActive = requisitionNo === it.IrnNo;
                                                return (
                                                    <tr
                                                        key={it.IrnNo}
                                                        onClick={() => handleIssueSinglePendingItem(it)}
                                                        style={{
                                                            borderBottom: "1px solid #e2e8f0",
                                                            cursor: "pointer",
                                                            backgroundColor: isActive ? "#eff6ff" : "#ffffff"
                                                        }}
                                                    >
                                                        <td style={{ padding: "6px 8px", fontWeight: 800, color: "#1976d2", fontFamily: "monospace", whiteSpace: "nowrap" }}>
                                                            {it.IrnNo}
                                                        </td>
                                                        <td style={{ padding: "6px 8px" }}>
                                                            <div style={{ fontWeight: 700, color: "#0f172a" }}>{it.ItemName}</div>
                                                            <div style={{ fontSize: "10px", color: "#64748b", fontFamily: "monospace" }}>
                                                                {it.ItemCode} • {it.Variant !== "N/A" ? it.Variant : it.Color}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: "6px 8px", fontSize: "10.5px", color: "#475569" }}>
                                                            <div style={{ fontWeight: 600 }}>{it.Department}</div>
                                                            <div style={{ fontFamily: "monospace", color: "#047857", fontWeight: 700 }}>{it.Location}</div>
                                                        </td>
                                                        <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: 800, color: "#b45309", whiteSpace: "nowrap" }}>
                                                            {it.BalanceQty} {it.UOM}
                                                        </td>
                                                        <td style={{ padding: "6px 8px", textAlign: "right", whiteSpace: "nowrap" }}>
                                                            <span style={{
                                                                display: "inline-block",
                                                                padding: "1px 6px",
                                                                borderRadius: "8px",
                                                                fontWeight: 800,
                                                                fontSize: "10px",
                                                                background: it.StockQty > 0 ? "#dcfce7" : "#fee2e2",
                                                                color: it.StockQty > 0 ? "#166534" : "#991b1b"
                                                            }}>
                                                                {it.StockQty} {it.UOM}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* ROW 3 - COL 1: Cutting Slip / Jobcard / IO No */}
                        <div className="tpcs-ii-field-group" ref={ioDropdownRef} style={{ position: "relative" }}>
                            <label className="tpcs-ii-label">
                                Cutting Slip / Jobcard / IO No
                            </label>
                            <div className="tpcs-ii-input-group">
                                <input
                                    type="text"
                                    className="tpcs-ii-input"
                                    placeholder="Select IO No (e.g. IO/9B/2627/35)"
                                    value={jobcardNo}
                                    onFocus={() => setShowIoLookupDropdown(true)}
                                    onClick={() => setShowIoLookupDropdown(true)}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setJobcardNo(val);
                                        setShowIoLookupDropdown(true);
                                        const matchedIo = KNOWN_IO_MAPPINGS.find(
                                            io => io.ioNo.toLowerCase() === val.trim().toLowerCase() ||
                                                  io.rawIoNo.toLowerCase() === val.trim().toLowerCase()
                                        );
                                        if (matchedIo) {
                                            handleSelectIo(matchedIo, false);
                                        }
                                    }}
                                    list="known-ios-datalist"
                                    style={{ fontWeight: 700, color: "#0f172a" }}
                                />
                                <datalist id="known-ios-datalist">
                                    {KNOWN_IO_MAPPINGS.map(io => (
                                        <option key={io.ioNo} value={io.ioNo}>
                                            {io.label}
                                        </option>
                                    ))}
                                </datalist>
                                <button
                                    type="button"
                                    className="tpcs-ii-addon-btn"
                                    title="Toggle Internal Orders (IO) List"
                                    onClick={() => setShowIoLookupDropdown(prev => !prev)}
                                >
                                    <FaListUl />
                                </button>
                            </div>

                            {/* Interactive IO Selection Dropdown Panel */}
                            {showIoLookupDropdown && (
                                <div style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    width: "600px",
                                    maxWidth: "92vw",
                                    maxHeight: "340px",
                                    overflowY: "auto",
                                    backgroundColor: "#ffffff",
                                    border: "1.5px solid #0f172a",
                                    borderRadius: "6px",
                                    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.2)",
                                    zIndex: 1200,
                                    marginTop: "4px"
                                }}>
                                    <div style={{
                                        background: "#0f172a",
                                        color: "#ffffff",
                                        padding: "7px 12px",
                                        fontSize: "11.5px",
                                        fontWeight: 700,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 2
                                    }}>
                                        <span>Internal Orders (IO) &amp; Linked Pending IRNs ({filteredHeaderIoItems.length})</span>
                                        <button
                                            type="button"
                                            onClick={() => setShowIoLookupDropdown(false)}
                                            style={{
                                                background: "transparent",
                                                color: "#cbd5e1",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "12px"
                                            }}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>

                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                                        <thead>
                                            <tr style={{ background: "#f1f5f9", color: "#334155", borderBottom: "1px solid #cbd5e1", textAlign: "left" }}>
                                                <th style={{ padding: "6px 8px" }}>IO Number &amp; Stage</th>
                                                <th style={{ padding: "6px 8px" }}>Linked Pending IRN</th>
                                                <th style={{ padding: "6px 8px" }}>Department</th>
                                                <th style={{ padding: "6px 8px", textAlign: "center" }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredHeaderIoItems.map(io => {
                                                const isActive = jobcardNo === io.ioNo || jobcardNo === io.rawIoNo;
                                                const isSampling = io.stage === "Sampling";
                                                return (
                                                    <tr
                                                        key={io.ioNo}
                                                        onClick={() => handleSelectIo(io, false)}
                                                        style={{
                                                            borderBottom: "1px solid #e2e8f0",
                                                            cursor: "pointer",
                                                            backgroundColor: isActive ? "#eff6ff" : "#ffffff"
                                                        }}
                                                    >
                                                        <td style={{ padding: "6px 8px", fontWeight: 800 }}>
                                                            <div style={{ color: isSampling ? "#b45309" : "#1e40af", fontFamily: "monospace", fontSize: "11.5px" }}>
                                                                {io.ioNo}
                                                            </div>
                                                            <span style={{
                                                                display: "inline-block",
                                                                padding: "1px 6px",
                                                                borderRadius: "6px",
                                                                fontSize: "9.5px",
                                                                fontWeight: 700,
                                                                marginTop: "2px",
                                                                background: isSampling ? "#fef3c7" : "#dbeafe",
                                                                color: isSampling ? "#92400e" : "#1e40af"
                                                            }}>
                                                                {io.stage} Stage
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "6px 8px" }}>
                                                            <div style={{ fontWeight: 800, color: "#1976d2", fontFamily: "monospace" }}>
                                                                {io.irnNo}
                                                            </div>
                                                            <div style={{ fontSize: "10px", color: "#64748b" }}>
                                                                {io.warehouse}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: "6px 8px", fontSize: "11px", fontWeight: 600, color: "#334155" }}>
                                                            <div>{io.department}</div>
                                                            <div style={{ fontSize: "10px", color: "#64748b" }}>Req By: {io.requestedBy}</div>
                                                        </td>
                                                        <td style={{ padding: "6px 8px", textAlign: "center" }} onClick={e => e.stopPropagation()}>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSelectIo(io, true)}
                                                                style={{
                                                                    background: isSampling ? "#d97706" : "#2563eb",
                                                                    color: "#ffffff",
                                                                    border: "none",
                                                                    borderRadius: "3px",
                                                                    padding: "3px 8px",
                                                                    fontSize: "10px",
                                                                    fontWeight: 700,
                                                                    cursor: "pointer"
                                                                }}
                                                                title={`Load items for ${io.ioNo}`}
                                                            >
                                                                Load Items
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
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
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                            <button
                                type="button"
                                className="tpcs-ii-btn-display"
                                onClick={handleDisplay}
                                title="Open Requisition Items Modal"
                            >
                                Display
                            </button>
                            <span style={{ fontSize: "12px", color: "#475569", fontWeight: 600 }}>
                                Active Item-Wise IRN:{" "}
                                <strong style={{ color: "#1976d2", fontFamily: "monospace" }}>
                                    {requisitionNo || "-"}
                                </strong>
                                {requisitionNo && (() => {
                                    const matched = catalogItems.find(it => it.IrnNo === requisitionNo);
                                    return matched ? (
                                        <span style={{ marginLeft: "6px", color: "#047857", fontWeight: 700 }}>
                                            ({matched.ItemName} [{matched.ItemCode}] • Pending: {matched.BalanceQty} {matched.UOM} • Stock: {matched.StockQty} {matched.UOM})
                                        </span>
                                    ) : null;
                                })()}
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
                       ITEM REQUISITION NOTE APPROVAL (EXACT USER SCREENSHOT)
                       WITH ITEM-WISE IRN NUMBERS, PENDING ITEMS & CURRENT STOCK
                    =========================================================== */}
                    {showPendingIrnPanel && (
                        <div style={{
                            background: "#ffffff",
                            border: "1px solid #dddddd",
                            borderRadius: "3px",
                            padding: "14px 16px",
                            marginBottom: "16px",
                            fontFamily: '"Segoe UI", Tahoma, Arial, Helvetica, sans-serif'
                        }}>
                            {/* Title matching Screenshot + Close button */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                    <h2 style={{
                                        color: "#2073a9",
                                        fontSize: "19px",
                                        fontWeight: 500,
                                        margin: 0
                                    }}>
                                        Item Requisition Note Approval (Item-Wise IRN Numbers)
                                    </h2>
                                    <span style={{
                                        background: "#eff6ff",
                                        color: "#1d4ed8",
                                        border: "1px solid #bfdbfe",
                                        borderRadius: "12px",
                                        padding: "2px 10px",
                                        fontSize: "11px",
                                        fontWeight: 700
                                    }}>
                                        {pendingIrnSummaries.length} Item-Wise IRNs
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPendingIrnPanel(false)}
                                    title="Close Pending IRN & Stock Panel"
                                    style={{
                                        background: "#f1f5f9",
                                        border: "1px solid #cbd5e1",
                                        color: "#475569",
                                        borderRadius: "4px",
                                        padding: "3px 9px",
                                        fontSize: "11.5px",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px"
                                    }}
                                >
                                    <FaTimes /> Close Panel
                                </button>
                            </div>

                            {/* Top Filter Row: Authorization Stage & Group/Model */}
                            <div style={{ display: "flex", alignItems: "flex-end", gap: "24px", marginBottom: "12px", flexWrap: "wrap" }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#333333", marginBottom: "3px" }}>
                                        Authorization Stage
                                    </label>
                                    <select
                                        value={stockStatusFilter}
                                        onChange={(e) => setStockStatusFilter(e.target.value)}
                                        style={{
                                            width: "145px",
                                            height: "28px",
                                            fontSize: "11.5px",
                                            padding: "2px 8px",
                                            border: "1px solid #cccccc",
                                            borderRadius: "2px",
                                            color: "#333333",
                                            backgroundColor: "#ffffff",
                                            outline: "none"
                                        }}
                                    >
                                        <option value="ALL">PENDING</option>
                                        <option value="IN_STOCK">APPROVED</option>
                                        <option value="LOW_STOCK">PARTIAL STOCK</option>
                                        <option value="OUT_STOCK">OUT OF STOCK</option>
                                    </select>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#333333", marginBottom: "3px" }}>
                                        Group/Model / Item-Wise IRN
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Filter by Item, Group or IRN No..."
                                        value={pendingSearchQuery}
                                        onChange={(e) => setPendingSearchQuery(e.target.value)}
                                        list="irn-group-model-list"
                                        style={{
                                            width: "245px",
                                            height: "28px",
                                            fontSize: "11.5px",
                                            padding: "2px 8px",
                                            border: "1px solid #cccccc",
                                            borderRadius: "2px",
                                            color: "#333333",
                                            backgroundColor: "#ffffff",
                                            outline: "none"
                                        }}
                                    />
                                    <datalist id="irn-group-model-list">
                                        {catalogItems.map(it => (
                                            <option key={it.IrnNo} value={it.IrnNo}>{it.ItemName} ({it.GroupName})</option>
                                        ))}
                                    </datalist>
                                </div>
                            </div>

                            {/* Legend: Pending (Red) & Approved (Green) */}
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", fontWeight: 600, color: "#333333", marginBottom: "8px" }}>
                                <span style={{ display: "inline-block", width: "14px", height: "14px", backgroundColor: "#f26b5b" }} />
                                <span>Pending</span>
                                <span style={{ display: "inline-block", width: "14px", height: "14px", backgroundColor: "#5cb85c", marginLeft: "4px" }} />
                                <span>Approved</span>
                            </div>

                            {/* Toolbar + Pagination Row matching Screenshot */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedIrnFilter("ALL");
                                            setPendingSearchQuery("");
                                            setStockStatusFilter("ALL");
                                        }}
                                        title="Refresh"
                                        style={{
                                            width: "26px",
                                            height: "25px",
                                            border: "1px solid #cccccc",
                                            borderRadius: "2px",
                                            background: "#ffffff",
                                            color: "#2073a9",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            fontSize: "11px"
                                        }}
                                    >
                                        <FaRedo />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedIrnFilter("ALL")}
                                        title="Show All Requisition Rows"
                                        style={{
                                            width: "26px",
                                            height: "25px",
                                            border: "1px solid #cccccc",
                                            borderRadius: "2px",
                                            background: "#ffffff",
                                            color: "#2073a9",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            fontSize: "11px"
                                        }}
                                    >
                                        <FaListUl />
                                    </button>

                                    <div style={{ display: "inline-flex" }}>
                                        <button
                                            type="button"
                                            onClick={() => setActiveModal("requisitionItems")}
                                            style={{
                                                height: "25px",
                                                padding: "0 8px",
                                                border: "1px solid #cccccc",
                                                borderTopRightRadius: 0,
                                                borderBottomRightRadius: 0,
                                                borderRadius: "2px",
                                                background: "#ffffff",
                                                color: "#2073a9",
                                                fontSize: "11px",
                                                fontWeight: 600,
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <FaSearch style={{ fontSize: "9px" }} /> Filter
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveModal("requisitionItems")}
                                            style={{
                                                height: "25px",
                                                padding: "0 6px",
                                                border: "1px solid #cccccc",
                                                borderLeft: "none",
                                                background: "#ffffff",
                                                color: "#2073a9",
                                                fontSize: "10px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <FaCaretDown />
                                        </button>
                                    </div>
                                </div>

                                {/* Pagination [1] [2] [3] [4] [5] [>] [>>] matching Screenshot */}
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    {[1, 2, 3, 4, 5].map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            style={{
                                                width: "26px",
                                                height: "25px",
                                                border: "1px solid #dddddd",
                                                borderRight: "none",
                                                backgroundColor: p === 1 ? "#2073a9" : "#ffffff",
                                                color: p === 1 ? "#ffffff" : "#2073a9",
                                                fontSize: "11px",
                                                fontWeight: p === 1 ? 700 : 500,
                                                cursor: "pointer"
                                            }}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        style={{
                                            width: "26px",
                                            height: "25px",
                                            border: "1px solid #dddddd",
                                            borderRight: "none",
                                            backgroundColor: "#ffffff",
                                            color: "#2073a9",
                                            fontSize: "11px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        &gt;
                                    </button>
                                    <button
                                        type="button"
                                        style={{
                                            width: "28px",
                                            height: "25px",
                                            border: "1px solid #dddddd",
                                            backgroundColor: "#ffffff",
                                            color: "#2073a9",
                                            fontSize: "11px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        &gt;&gt;
                                    </button>
                                </div>
                            </div>

                            {/* Blue Header Table: Action | IO No | Item-Wise IRN No (Req. No) | Item Name & Code | Rack Bin QR | Qty | Stock Qty | Approval Status */}
                            <div style={{ width: "100%", overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px" }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#2073a9", color: "#ffffff" }}>
                                            <th style={{ width: "115px", padding: "6px 8px", border: "1px solid #1b608f", textAlign: "center", fontWeight: 600 }}>
                                                Action
                                            </th>
                                            <th style={{ width: "175px", padding: "6px 10px", border: "1px solid #1b608f", textAlign: "center", fontWeight: 600 }}>
                                                Internal Order (IO No)
                                            </th>
                                            <th style={{ padding: "6px 10px", border: "1px solid #1b608f", textAlign: "center", fontWeight: 600 }}>
                                                Item-Wise IRN No (Req. No)
                                            </th>
                                            <th style={{ padding: "6px 10px", border: "1px solid #1b608f", textAlign: "left", fontWeight: 600 }}>
                                                Item Name &amp; Code
                                            </th>
                                            <th style={{ width: "125px", padding: "6px 10px", border: "1px solid #1b608f", textAlign: "center", fontWeight: 600 }}>
                                                Rack Bin QR
                                            </th>
                                            <th style={{ width: "175px", padding: "6px 10px", border: "1px solid #1b608f", textAlign: "center", fontWeight: 600 }}>
                                                IRN Qty (Pending)
                                            </th>
                                            <th style={{ width: "135px", padding: "6px 10px", border: "1px solid #1b608f", textAlign: "center", fontWeight: 600 }}>
                                                Item Stock Qty
                                            </th>
                                            <th style={{ width: "160px", padding: "6px 10px", border: "1px solid #1b608f", textAlign: "center", fontWeight: 600 }}>
                                                Approval Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingIrnSummaries.map(irn => {
                                            const isSelectedIrn = selectedIrnFilter === irn.irnNo;
                                            const isPendingStatus = irn.totalPendingQty > 0;
                                            const isSampling = irn.ioStage === "Sampling";
                                            return (
                                                <React.Fragment key={irn.irnNo}>
                                                    <tr
                                                        style={{
                                                            backgroundColor: isSelectedIrn ? "#e8f1fa" : "#ffffff",
                                                            cursor: "pointer"
                                                        }}
                                                        onClick={() => {
                                                            if (selectedIrnFilter === irn.irnNo) {
                                                                setSelectedIrnFilter("ALL");
                                                            } else {
                                                                handleSelectPendingIrn(irn, false);
                                                            }
                                                        }}
                                                    >
                                                        <td
                                                            style={{ padding: "5px 8px", border: "1px solid #dddddd", textAlign: "center" }}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <div style={{ display: "inline-flex", gap: "5px", alignItems: "center" }}>
                                                                <button
                                                                    type="button"
                                                                    className="tpcs-pirn-load-btn"
                                                                    onClick={() => handleSelectPendingIrn(irn, true)}
                                                                    title={`Load ${irn.itemName} (${irn.irnNo}) into Item Issue`}
                                                                    style={{
                                                                        background: isSampling ? "#d97706" : "#2073a9"
                                                                    }}
                                                                >
                                                                    <span>Issue IRN</span> <FaArrowRight style={{ fontSize: "9px" }} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: "5px 10px", border: "1px solid #dddddd", textAlign: "center" }}>
                                                            <div style={{
                                                                fontWeight: 800,
                                                                fontFamily: "monospace",
                                                                color: isSampling ? "#b45309" : "#1e40af",
                                                                fontSize: "11.5px"
                                                            }}>
                                                                {irn.jobcardNo || irn.ioNo}
                                                            </div>
                                                            <span style={{
                                                                display: "inline-block",
                                                                marginTop: "2px",
                                                                padding: "1px 6px",
                                                                borderRadius: "8px",
                                                                fontSize: "9.5px",
                                                                fontWeight: 700,
                                                                background: isSampling ? "#fef3c7" : "#dbeafe",
                                                                color: isSampling ? "#92400e" : "#1e40af",
                                                                border: `1px solid ${isSampling ? "#fcd34d" : "#bfdbfe"}`
                                                            }}>
                                                                {irn.ioStage} Stage
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "5px 10px", border: "1px solid #dddddd", textAlign: "center", fontWeight: 800, color: "#2073a9", fontFamily: "monospace" }}>
                                                            {irn.irnNo}
                                                            <div style={{ fontSize: "10px", color: "#64748b", fontWeight: 500, fontFamily: "inherit" }}>
                                                                {irn.department} • {irn.date}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: "5px 10px", border: "1px solid #dddddd", textAlign: "left" }}>
                                                            <div style={{ fontWeight: 700, color: "#0f172a" }}>
                                                                {irn.itemName}
                                                            </div>
                                                            <div style={{ fontSize: "10px", color: "#475569", fontFamily: "monospace", fontWeight: 600 }}>
                                                                {irn.itemCode} | {irn.groupName} ({irn.variant})
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: "5px 10px", border: "1px solid #dddddd", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: "#047857" }}>
                                                            {irn.location}
                                                        </td>
                                                        <td style={{ padding: "5px 10px", border: "1px solid #dddddd", textAlign: "center", fontWeight: 700 }}>
                                                            {irn.totalReqQty} {irn.uom}
                                                            <span style={{ marginLeft: "6px", color: "#b45309", fontSize: "10.5px" }}>
                                                                (Bal: {irn.totalPendingQty} {irn.uom})
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "5px 10px", border: "1px solid #dddddd", textAlign: "center", fontWeight: 800 }}>
                                                            <span style={{
                                                                display: "inline-block",
                                                                padding: "2px 8px",
                                                                borderRadius: "10px",
                                                                fontSize: "11px",
                                                                background: irn.stockQty > 0 ? "#dcfce7" : "#fee2e2",
                                                                color: irn.stockQty > 0 ? "#166534" : "#991b1b"
                                                            }}>
                                                                {irn.stockQty} {irn.uom}
                                                            </span>
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding: "5px 10px",
                                                                border: "1px solid #dddddd",
                                                                textAlign: "center",
                                                                fontWeight: 700,
                                                                color: "#ffffff",
                                                                backgroundColor: isPendingStatus ? "#f26b5b" : "#5cb85c"
                                                            }}
                                                        >
                                                            {isPendingStatus ? "Pending" : "Approved"}
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Sub-section: 1) RACK QR STICKERS (LOCATION-WISE QR ISSUE) + 2) ITEM-WISE STOCK QTY APART FROM IRN-WISE ITEM REQUIRED QTY */}
                            <div style={{ marginTop: "14px", borderTop: "2px solid #e2e8f0", paddingTop: "12px" }}>

                                {/* RACK QR STICKERS STRIP (CLICK ANY BIN QR TO DIRECTLY ISSUE BY LOCATION & QR CODE) */}
                                <div style={{
                                    background: "#f8fafc",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "6px",
                                    padding: "10px 12px",
                                    marginBottom: "14px"
                                }}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "8px",
                                        flexWrap: "wrap",
                                        gap: "8px"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <FaQrcode style={{ color: "#1976d2", fontSize: "15px" }} />
                                            <span style={{ fontSize: "12.5px", fontWeight: 800, color: "#0f172a" }}>
                                                Direct Link: Rack QR Stickers (Location-Wise &amp; QR-Code-Wise Item Issue)
                                            </span>
                                            <span style={{
                                                background: "#dcfce7",
                                                color: "#166534",
                                                padding: "2px 8px",
                                                borderRadius: "12px",
                                                fontSize: "10.5px",
                                                fontWeight: 700
                                            }}>
                                                Active Bin QR: {activeRackBin?.BinCode || activeItem4x4?.Location}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button
                                                type="button"
                                                onClick={() => setActiveModal("rackQrStickers")}
                                                style={{
                                                    background: "#047857",
                                                    color: "#ffffff",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    padding: "4px 10px",
                                                    fontSize: "11px",
                                                    fontWeight: 700,
                                                    cursor: "pointer",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "5px"
                                                }}
                                            >
                                                <FaQrcode /> View All 9 Rack QR Stickers (4x4)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => navigate("/wms/print-binning-slip?format=rack-labels")}
                                                style={{
                                                    background: "#1976d2",
                                                    color: "#ffffff",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    padding: "4px 10px",
                                                    fontSize: "11px",
                                                    fontWeight: 700,
                                                    cursor: "pointer",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "5px"
                                                }}
                                            >
                                                <FaExternalLinkAlt /> Open Rack QR Stickers Module
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))",
                                        gap: "8px"
                                    }}>
                                        {rackQrBins.map(bin => {
                                            const isSelectedBin = activeRackBin?.BinCode === bin.BinCode || activeItem4x4?.Location === bin.BinCode;
                                            return (
                                                <div
                                                    key={bin.BinCode}
                                                    onClick={() => handleIssueFromRackBin(bin, true)}
                                                    style={{
                                                        background: isSelectedBin ? "#eff6ff" : "#ffffff",
                                                        border: isSelectedBin ? "2px solid #1976d2" : "1px solid #cbd5e1",
                                                        borderRadius: "6px",
                                                        padding: "7px 9px",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "8px",
                                                        boxShadow: isSelectedBin ? "0 2px 6px rgba(25,118,210,0.15)" : "none"
                                                    }}
                                                    title={`Click to Issue ${bin.ItemName} directly from Rack QR ${bin.BinCode}`}
                                                >
                                                    <div
                                                        style={{ flexShrink: 0, background: "#fff", padding: "2px", border: "1px solid #e2e8f0", borderRadius: "4px" }}
                                                        dangerouslySetInnerHTML={{
                                                            __html: generateQRCodeSVG(`RACKQR|${bin.BinCode}|${bin.ItemCode}`, { size: 42 })
                                                        }}
                                                    />
                                                    <div style={{ minWidth: 0, flex: 1 }}>
                                                        <div style={{ fontSize: "11.5px", fontWeight: 800, color: "#0f172a", fontFamily: "monospace" }}>
                                                            {bin.BinCode}
                                                        </div>
                                                        <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                            {bin.ItemName}
                                                        </div>
                                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginTop: "2px" }}>
                                                            <span style={{ color: bin.ItemWiseStockQty > 0 ? "#166534" : "#dc2626", fontWeight: 800 }}>
                                                                Stock: {bin.ItemWiseStockQty} {bin.UOM}
                                                            </span>
                                                            <span style={{ color: "#1d4ed8", fontWeight: 800 }}>
                                                                IRN Req: {bin.IrnWiseReqQty}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* TWO SEPARATE TABLES: 1) ITEM-WISE STOCK QTY (LOCATION / RACK QR WISE) APART FROM 2) IRN-WISE ITEM REQUIRED QTY */}
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))",
                                    gap: "14px",
                                    alignItems: "start"
                                }}>
                                    {/* LEFT TABLE: ITEM-WISE STOCK QTY (LOCATION / RACK QR STICKER WISE — APART FROM IRN REQUIRED QTY) */}
                                    <div style={{
                                        border: "1.5px solid #16a34a",
                                        borderRadius: "6px",
                                        background: "#ffffff",
                                        overflow: "hidden"
                                    }}>
                                        <div style={{
                                            background: "#15803d",
                                            color: "#ffffff",
                                            padding: "7px 12px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}>
                                            <span style={{ fontSize: "12px", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px" }}>
                                                <FaBoxes /> 1. ITEM-WISE STOCK QTY (Rack Bin QR &amp; Location-Wise Stock)
                                            </span>
                                            <span style={{ fontSize: "10.5px", background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: "10px", fontWeight: 700 }}>
                                                Apart from IRN Required Qty
                                            </span>
                                        </div>
                                        <div className="tpcs-pirn-table-wrap" style={{ maxHeight: "260px" }}>
                                            <table className="tpcs-pirn-table">
                                                <thead>
                                                    <tr>
                                                        <th style={{ backgroundColor: "#166534" }}>Rack Bin QR</th>
                                                        <th style={{ backgroundColor: "#166534" }}>Zone / Rack / Level</th>
                                                        <th style={{ backgroundColor: "#166534" }}>Item Name &amp; Code</th>
                                                        <th style={{ textAlign: "right", backgroundColor: "#14532d" }}>Item-Wise Stock Qty</th>
                                                        <th style={{ textAlign: "center", backgroundColor: "#166534" }}>QR Issue</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rackQrBins.map(bin => {
                                                        const isSelected = activeRackBin?.BinCode === bin.BinCode;
                                                        return (
                                                            <tr
                                                                key={bin.BinCode}
                                                                style={{ backgroundColor: isSelected ? "#f0fdf4" : undefined, cursor: "pointer" }}
                                                                onClick={() => handleIssueFromRackBin(bin, false)}
                                                            >
                                                                <td style={{ fontWeight: 800, color: "#15803d", fontFamily: "monospace" }}>
                                                                    <FaQrcode style={{ marginRight: "4px", verticalAlign: "middle" }} />
                                                                    {bin.BinCode}
                                                                </td>
                                                                <td style={{ fontSize: "11px", color: "#334155", fontWeight: 600 }}>
                                                                    {bin.Zone} • {bin.Rack} ({bin.Level})
                                                                </td>
                                                                <td>
                                                                    <div style={{ fontWeight: 700, color: "#0f172a" }}>{bin.ItemName}</div>
                                                                    <div style={{ fontSize: "10px", color: "#64748b", fontFamily: "monospace" }}>
                                                                        {bin.ItemCode} | {bin.Variant}
                                                                    </div>
                                                                </td>
                                                                <td style={{ textAlign: "right" }}>
                                                                    <span style={{
                                                                        display: "inline-block",
                                                                        padding: "2px 8px",
                                                                        borderRadius: "10px",
                                                                        fontWeight: 800,
                                                                        fontSize: "11.5px",
                                                                        background: bin.ItemWiseStockQty > 0 ? "#dcfce7" : "#fee2e2",
                                                                        color: bin.ItemWiseStockQty > 0 ? "#166534" : "#991b1b",
                                                                        border: bin.ItemWiseStockQty > 0 ? "1px solid #86efac" : "1px solid #fca5a5"
                                                                    }}>
                                                                        {bin.ItemWiseStockQty} {bin.UOM}
                                                                    </span>
                                                                </td>
                                                                <td style={{ textAlign: "center" }} onClick={e => e.stopPropagation()}>
                                                                    <button
                                                                        type="button"
                                                                        className="tpcs-pirn-load-btn"
                                                                        style={{ background: "#15803d" }}
                                                                        onClick={() => handleIssueFromRackBin(bin, true)}
                                                                        title={`Issue ${bin.ItemName} from Rack QR ${bin.BinCode}`}
                                                                    >
                                                                        <FaQrcode style={{ fontSize: "9px" }} /> <span>QR Issue</span>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* RIGHT TABLE: IRN-WISE ITEM REQUIRED QTY & PENDING TO ISSUE (APART FROM ITEM-WISE STOCK QTY) */}
                                    <div style={{
                                        border: "1.5px solid #2073a9",
                                        borderRadius: "6px",
                                        background: "#ffffff",
                                        overflow: "hidden"
                                    }}>
                                        <div style={{
                                            background: "#2073a9",
                                            color: "#ffffff",
                                            padding: "7px 12px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                            gap: "6px"
                                        }}>
                                            <span style={{ fontSize: "12px", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px" }}>
                                                <FaClipboardList /> 2. IRN-WISE ITEM REQUIRED QTY &amp; PENDING ({selectedIrnFilter === "ALL" ? "All Pending IRNs" : selectedIrnFilter})
                                            </span>
                                            <button
                                                type="button"
                                                onClick={handleSaveReqItems}
                                                style={{
                                                    background: "#f59e0b",
                                                    color: "#ffffff",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    padding: "2px 10px",
                                                    fontSize: "10.5px",
                                                    fontWeight: 800,
                                                    cursor: "pointer"
                                                }}
                                            >
                                                + Load Checked ({tickedItemCodes.length})
                                            </button>
                                        </div>
                                        <div className="tpcs-pirn-table-wrap" style={{ maxHeight: "260px" }}>
                                            <table className="tpcs-pirn-table">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: "32px", textAlign: "center", backgroundColor: "#2073a9" }}>
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
                                                            />
                                                        </th>
                                                        <th style={{ backgroundColor: "#2073a9" }}>Pending IRN No</th>
                                                        <th style={{ backgroundColor: "#2073a9" }}>Item Name &amp; Rack Bin</th>
                                                        <th style={{ textAlign: "right", backgroundColor: "#1e40af" }}>IRN-Wise Req Qty</th>
                                                        <th style={{ textAlign: "right", backgroundColor: "#2073a9" }}>Issued</th>
                                                        <th style={{ textAlign: "right", backgroundColor: "#b45309" }}>IRN Pending Qty</th>
                                                        <th style={{ textAlign: "center", backgroundColor: "#2073a9" }}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {displayedPendingItems.map(m => {
                                                        const isTicked = tickedItemCodes.includes(m.ItemCode);
                                                        return (
                                                            <tr
                                                                key={m.ItemCode}
                                                                style={{ backgroundColor: isTicked ? "#eff6ff" : undefined, cursor: "pointer" }}
                                                                onClick={() => {
                                                                    setActiveItem4x4(m);
                                                                    const binMatch = rackQrBins.find(b => b.BinCode === m.Location || b.ItemCode === m.ItemCode);
                                                                    if (binMatch) setActiveRackBin(binMatch);
                                                                }}
                                                            >
                                                                <td style={{ textAlign: "center" }} onClick={e => e.stopPropagation()}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isTicked}
                                                                        onChange={() => handleToggleReqTick(m.ItemCode)}
                                                                        style={{ cursor: "pointer" }}
                                                                    />
                                                                </td>
                                                                <td style={{ fontWeight: 800, color: "#2073a9", fontFamily: "monospace", fontSize: "11px" }}>
                                                                    {m.IrnNo}
                                                                </td>
                                                                <td>
                                                                    <div style={{ fontWeight: 700, color: "#0f172a" }}>{m.ItemName}</div>
                                                                    <div style={{ fontSize: "10px", color: "#047857", fontFamily: "monospace", fontWeight: 700 }}>
                                                                        Rack QR: {m.Location} ({m.ItemCode})
                                                                    </div>
                                                                </td>
                                                                <td style={{ textAlign: "right", fontWeight: 800, color: "#1e40af", fontSize: "12px" }}>
                                                                    {m.ReqQty} {m.UOM}
                                                                </td>
                                                                <td style={{ textAlign: "right", color: "#16a34a", fontWeight: 700 }}>
                                                                    {m.IssuedQty} {m.UOM}
                                                                </td>
                                                                <td style={{ textAlign: "right" }}>
                                                                    <span className={`tpcs-pending-pill ${m.BalanceQty <= 0 ? "cleared" : ""}`}>
                                                                        {m.BalanceQty > 0 ? `${m.BalanceQty} ${m.UOM}` : `0 ${m.UOM}`}
                                                                    </span>
                                                                </td>
                                                                <td style={{ textAlign: "center" }} onClick={e => e.stopPropagation()}>
                                                                    <button
                                                                        type="button"
                                                                        className="tpcs-pirn-load-btn"
                                                                        onClick={() => handleIssueSinglePendingItem(m)}
                                                                    >
                                                                        <FaPlus style={{ fontSize: "9px" }} /> <span>Issue</span>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
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
                                {/* Header badge with Close (X) button */}
                                <div className="tpcs-ii-4x4-header">
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <FaQrcode />
                                        <span>4x4 Rack QR &amp; Location</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <span className="tpcs-ii-4x4-header-pill">{activeItem4x4?.Location || activeRackBin?.BinCode || "BIN-A-01-01"}</span>
                                        <button
                                            type="button"
                                            onClick={() => setShow4x4Panel(false)}
                                            title="Close 4x4 QR & Location Window"
                                            style={{
                                                background: "rgba(255,255,255,0.2)",
                                                border: "none",
                                                color: "#ffffff",
                                                borderRadius: "4px",
                                                width: "22px",
                                                height: "22px",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                fontSize: "12px"
                                            }}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                </div>

                                {/* TOP SECTION: QR CODE & BARCODE */}
                                <div className="tpcs-ii-4x4-top">
                                    <div className="tpcs-ii-4x4-top-title">
                                        <span>Top: Rack Bin &amp; Item QR</span>
                                        <span style={{ fontSize: "10px", color: "#1976d2", fontFamily: "monospace", fontWeight: 700 }}>
                                            {activeItem4x4?.IrnNo || requisitionNo}
                                        </span>
                                    </div>

                                    {/* QR Code Container with SCAN TO VERIFY (Matching Reference Screenshot 1) */}
                                    <div className="tpcs-ii-qr-box">
                                        {scanLaserActive && <div className="tpcs-ii-qr-laser-line" />}
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: generateQRCodeSVG(
                                                    `RACKQR|${activeItem4x4?.Location || "BIN-A-01-01"}|ITEM:${activeItem4x4?.ItemCode || "CRD-1001"}|IRN:${activeItem4x4?.IrnNo || requisitionNo}`,
                                                    { size: 122 }
                                                )
                                            }}
                                        />
                                        <span className="tpcs-ps-verify-text">
                                            RACK QR: {activeItem4x4?.Location || "BIN-A-01-01"}
                                        </span>
                                    </div>

                                    {/* Barcode representation */}
                                    <div className="tpcs-ii-barcode-box">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: generateBarcodeSVG(activeItem4x4?.Barcode || activeItem4x4?.Location || "BIN-A-01-01", { width: 220, height: 38, showText: true })
                                            }}
                                        />
                                    </div>

                                    {/* Quick Scan Input with Auto Fill */}
                                    <div className="tpcs-ii-4x4-scan-input-group">
                                        <input
                                            type="text"
                                            className="tpcs-ii-4x4-scan-input"
                                            placeholder="Scan Rack QR (BIN-A-01-01) or Item..."
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
                                            title="Auto-fill line item from Rack QR Sticker / Barcode"
                                        >
                                            <FaBolt /> <span>Auto Fill</span>
                                        </button>
                                    </div>

                                    {/* Quick Scan Presets: Rack Bin QR Stickers */}
                                    <div className="tpcs-ii-4x4-presets">
                                        <span style={{ fontSize: "10px", color: "#047857", fontWeight: 700, width: "100%", marginBottom: "2px" }}>
                                            Rack QR Stickers (1-Click Issue):
                                        </span>
                                        {rackQrBins.slice(0, 6).map(bin => (
                                            <button
                                                key={bin.BinCode}
                                                type="button"
                                                className="tpcs-ii-preset-chip"
                                                style={{
                                                    borderColor: activeRackBin?.BinCode === bin.BinCode ? "#15803d" : undefined,
                                                    backgroundColor: activeRackBin?.BinCode === bin.BinCode ? "#dcfce7" : undefined,
                                                    color: activeRackBin?.BinCode === bin.BinCode ? "#166534" : undefined,
                                                    fontWeight: 700
                                                }}
                                                onClick={() => handleIssueFromRackBin(bin, true)}
                                                title={`${bin.BinCode}: ${bin.ItemName} | Item Stock: ${bin.ItemWiseStockQty} ${bin.UOM} | IRN Req: ${bin.IrnWiseReqQty} ${bin.UOM}`}
                                            >
                                                {bin.BinCode}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* DOWN SECTION: LOCATION, ITEM-WISE STOCK QTY APART FROM IRN-WISE REQUIRED QTY */}
                                <div className="tpcs-ii-4x4-down">
                                    <div className="tpcs-ii-4x4-down-title">
                                        <span>Down: Location &amp; Split Stock/IRN</span>
                                        <FaMapMarkerAlt style={{ color: "#ef4444" }} />
                                    </div>

                                    <div className="tpcs-ii-location-box">
                                        <div className="tpcs-ii-loc-row">
                                            <span className="tpcs-ii-loc-label">Rack Bin QR:</span>
                                            <span className="tpcs-ii-loc-val" style={{ color: "#047857", fontWeight: 800, fontFamily: "monospace" }}>
                                                {activeItem4x4?.Location || "BIN-D-01-02"} ({activeItem4x4?.Rack})
                                            </span>
                                        </div>
                                        <div className="tpcs-ii-loc-row">
                                            <span className="tpcs-ii-loc-label">Warehouse:</span>
                                            <span className="tpcs-ii-loc-val">{activeItem4x4?.Warehouse || stores}</span>
                                        </div>
                                        <div className="tpcs-ii-loc-row">
                                            <span className="tpcs-ii-loc-label">Item Name:</span>
                                            <span className="tpcs-ii-loc-val">{activeItem4x4?.ItemName}</span>
                                        </div>
                                        <div className="tpcs-ii-loc-row">
                                            <span className="tpcs-ii-loc-label">Pending IRN:</span>
                                            <span className="tpcs-ii-loc-val" style={{ color: "#1976d2", fontFamily: "monospace" }}>
                                                {activeItem4x4?.IrnNo || requisitionNo}
                                            </span>
                                        </div>

                                        {/* SEPARATED SIDE-BY-SIDE BOXES: ITEM-WISE STOCK QTY APART FROM IRN-WISE REQUIRED QTY */}
                                        <div style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: "6px",
                                            marginTop: "6px"
                                        }}>
                                            <div style={{
                                                background: activeItem4x4?.StockQty > 0 ? "#f0fdf4" : "#fef2f2",
                                                border: activeItem4x4?.StockQty > 0 ? "1px solid #86efac" : "1px solid #fecaca",
                                                borderRadius: "4px",
                                                padding: "5px 6px"
                                            }}>
                                                <div style={{ fontSize: "9.5px", fontWeight: 800, color: activeItem4x4?.StockQty > 0 ? "#166534" : "#991b1b" }}>
                                                    ITEM-WISE STOCK
                                                </div>
                                                <div style={{ fontSize: "12.5px", fontWeight: 900, color: activeItem4x4?.StockQty > 0 ? "#15803d" : "#dc2626" }}>
                                                    {activeItem4x4?.StockQty} {activeItem4x4?.UOM}
                                                </div>
                                                <div style={{ fontSize: "9px", color: "#475569" }}>
                                                    Bin: {activeItem4x4?.Location}
                                                </div>
                                            </div>

                                            <div style={{
                                                background: "#eff6ff",
                                                border: "1px solid #bfdbfe",
                                                borderRadius: "4px",
                                                padding: "5px 6px"
                                            }}>
                                                <div style={{ fontSize: "9.5px", fontWeight: 800, color: "#1e40af" }}>
                                                    IRN-WISE REQ QTY
                                                </div>
                                                <div style={{ fontSize: "12.5px", fontWeight: 900, color: "#1d4ed8" }}>
                                                    {activeItem4x4?.ReqQty} {activeItem4x4?.UOM}
                                                </div>
                                                <div style={{ fontSize: "9px", color: "#b45309", fontWeight: 800 }}>
                                                    Pending: {activeItem4x4?.BalanceQty} {activeItem4x4?.UOM}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tpcs-ii-4x4-actions">
                                        <button
                                            type="button"
                                            className="tpcs-ii-4x4-btn-action primary"
                                            style={{ backgroundColor: "#047857", borderColor: "#047857" }}
                                            onClick={() => setActiveModal("rackQrStickers")}
                                        >
                                            <FaQrcode /> Rack QR Stickers
                                        </button>
                                        <button
                                            type="button"
                                            className="tpcs-ii-4x4-btn-action"
                                            onClick={() => setActiveModal("pickingSlip")}
                                        >
                                            <FaPrint /> Picking Slip
                                        </button>
                                        <button
                                            type="button"
                                            className="tpcs-ii-4x4-btn-action"
                                            style={{ color: "#dc2626", borderColor: "#fca5a5", backgroundColor: "#fef2f2" }}
                                            onClick={() => setShow4x4Panel(false)}
                                            title="Close 4x4 QR & Location Window"
                                        >
                                            <FaTimes /> Close
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
                                            <th style={{ width: "175px" }}>Item-Wise IRN No.</th>
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
                                            const hasItem = Boolean(row.item && row.item.trim() !== "");
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
                                                            <option value="">Select</option>
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
                                                                placeholder="Select Item-Wise IRN No"
                                                                value={row.ioNo}
                                                                onChange={(e) => handleLineChange(row.id, "ioNo", e.target.value)}
                                                                list={`item-irns-datalist-${row.id}`}
                                                                style={{ fontFamily: "monospace", fontWeight: 700, color: "#1976d2", fontSize: "11px" }}
                                                            />
                                                            <datalist id={`item-irns-datalist-${row.id}`}>
                                                                {catalogItems.map(it => (
                                                                    <option key={it.IrnNo} value={it.IrnNo}>
                                                                        {it.ItemName} ({it.ItemCode}) | Pending: {it.BalanceQty} {it.UOM} | Stock: {it.StockQty} {it.UOM}
                                                                    </option>
                                                                ))}
                                                            </datalist>
                                                            <button
                                                                type="button"
                                                                className="tpcs-ii-addon-btn"
                                                                style={{ height: "27px", padding: "0 6px" }}
                                                                onClick={() => setActiveModal("requisitionItems")}
                                                                title="Select from Item-Wise Pending IRN Items"
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
                                                                    Item-Wise IRN: {it.IrnNo} | Pending: {it.BalanceQty} {it.UOM} | Stock: {it.StockQty} {it.UOM}
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
                                                            <option value="">Select</option>
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
                                                            value={hasItem || row.reqQty !== "" ? row.reqQty : ""}
                                                            readOnly
                                                            style={{ background: "#f8fafc", textAlign: "right", fontWeight: 600 }}
                                                        />
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        {hasItem || row.pendingQty !== "" ? (
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
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                className="tpcs-ii-tbl-input"
                                                                value=""
                                                                readOnly
                                                                style={{ background: "#f8fafc", textAlign: "right" }}
                                                            />
                                                        )}
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        {hasItem || row.stockQty !== "" ? (
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
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                className="tpcs-ii-tbl-input"
                                                                value=""
                                                                readOnly
                                                                style={{ background: "#f8fafc", textAlign: "right" }}
                                                            />
                                                        )}
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="tpcs-ii-tbl-input"
                                                            placeholder=""
                                                            value={row.issueQty}
                                                            onChange={(e) => handleLineChange(row.id, "issueQty", e.target.value)}
                                                            style={{ textAlign: "right", fontWeight: 700, borderColor: "#1976d2" }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="tpcs-ii-tbl-input"
                                                            placeholder=""
                                                            value={row.rate}
                                                            onChange={(e) => handleLineChange(row.id, "rate", e.target.value)}
                                                            style={{ textAlign: "right" }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="tpcs-ii-tbl-input"
                                                            value={row.amount ? Number(row.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : ""}
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

                                {/* Close Button (closes Item Issue window and returns to Register) */}
                                <button
                                    type="button"
                                    className="tpcs-ii-btn-view"
                                    onClick={() => {
                                        setActiveModal(null);
                                        setShowActionMenu(false);
                                        setShow4x4Panel(false);
                                        setShowPendingIrnPanel(false);
                                        setViewMode("list");
                                    }}
                                    style={{
                                        backgroundColor: "#ef4444",
                                        color: "#ffffff",
                                        borderColor: "#dc2626",
                                        fontWeight: 700
                                    }}
                                    title="Close Item Issue Window"
                                >
                                    <FaTimes /> <span>Close</span>
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
                                onClick={() => {
                                    handleResetForm();
                                    setViewMode("form");
                                }}
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
                            <h3 className="tpcs-req-modal-title">Requisition Items (Item-Wise Pending IRN & Stock Available)</h3>
                            <button className="tpcs-req-modal-close" onClick={() => setActiveModal(null)}>×</button>
                        </div>

                        <div className="tpcs-req-modal-body">
                            {/* Blue instruction line + Pending IRN Selector Pills */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                                <div className="tpcs-req-instruction" style={{ margin: 0 }}>
                                    Tick check box to select the item-wise IRN items you want to issue
                                </div>

                                <div style={{ display: "flex", gap: "5px", alignItems: "center", flexWrap: "wrap" }}>
                                    <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#334155" }}>IO &amp; Pending IRN Filters:</span>
                                    <button
                                        type="button"
                                        className={`tpcs-pirn-pill-btn ${modalIrnFilter === "ALL" ? "active" : ""}`}
                                        onClick={() => setModalIrnFilter("ALL")}
                                    >
                                        All Items ({catalogItems.length})
                                    </button>
                                    {pendingIrnSummaries.map(irn => {
                                        const isSampling = irn.ioStage === "Sampling";
                                        return (
                                            <button
                                                key={irn.irnNo}
                                                type="button"
                                                className={`tpcs-pirn-pill-btn ${modalIrnFilter === irn.irnNo ? "active" : ""}`}
                                                onClick={() => setModalIrnFilter(irn.irnNo)}
                                                title={`${irn.itemName} (${irn.itemCode}) • Bin: ${irn.location}`}
                                                style={{
                                                    borderColor: isSampling ? "#d97706" : "#2563eb",
                                                    color: isSampling ? "#92400e" : "#1e40af",
                                                    fontWeight: modalIrnFilter === irn.irnNo ? 800 : 600
                                                }}
                                            >
                                                {irn.jobcardNo || irn.ioNo}: {irn.irnNo} ({irn.items.length} Itm)
                                            </button>
                                        );
                                    })}
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

                            {/* Table matching Screenshot 2 + IO No and Item-Wise IRN No column */}
                            <div style={{ overflowX: "auto" }}>
                                <table className="tpcs-req-table">
                                    <thead>
                                        {/* Row 1: Filters above each column */}
                                        <tr className="tpcs-req-filter-row">
                                            <td style={{ textAlign: "center", width: "40px" }}></td>
                                            <td style={{ width: "165px" }}>
                                                <input
                                                    type="text"
                                                    className="tpcs-req-filter-input"
                                                    value={reqFilterIoNo}
                                                    onChange={e => setReqFilterIoNo(e.target.value)}
                                                    placeholder="Filter IO No..."
                                                />
                                            </td>
                                            <td style={{ width: "160px" }}>
                                                <input
                                                    type="text"
                                                    className="tpcs-req-filter-input"
                                                    value={reqFilterIrnNo}
                                                    onChange={e => setReqFilterIrnNo(e.target.value)}
                                                    placeholder="Filter Item IRN No..."
                                                />
                                            </td>
                                            <td style={{ width: "180px" }}>
                                                <input
                                                    type="text"
                                                    className="tpcs-req-filter-input"
                                                    value={reqFilterItem}
                                                    onChange={e => setReqFilterItem(e.target.value)}
                                                    placeholder="Filter Item Name / Code..."
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
                                            <th>IO No. &amp; Stage</th>
                                            <th>Item-Wise IRN No</th>
                                            <th>Item Name &amp; Code</th>
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
                                            const isSampling = m.IoStage === "Sampling";

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
                                                        <span
                                                            style={{
                                                                display: "inline-block",
                                                                background: isSampling ? "#fef3c7" : "#dbeafe",
                                                                color: isSampling ? "#92400e" : "#1e40af",
                                                                border: `1px solid ${isSampling ? "#fcd34d" : "#93c5fd"}`,
                                                                borderRadius: "4px",
                                                                padding: "2px 6px",
                                                                fontSize: "11px",
                                                                fontFamily: "monospace",
                                                                fontWeight: 800
                                                            }}
                                                        >
                                                            {m.JobcardNo || m.IoNo}
                                                        </span>
                                                        <div style={{ fontSize: "9.5px", color: "#64748b", marginTop: "2px", fontWeight: 600 }}>
                                                            {m.IoStage || "Production"} Stage
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span
                                                            style={{
                                                                display: "inline-block",
                                                                background: "#e0f2fe",
                                                                color: "#0369a1",
                                                                border: "1px solid #7dd3fc",
                                                                borderRadius: "4px",
                                                                padding: "2px 6px",
                                                                fontSize: "11px",
                                                                fontFamily: "monospace",
                                                                fontWeight: 800
                                                            }}
                                                        >
                                                            {m.IrnNo}
                                                        </span>
                                                        <div style={{ fontSize: "9.5px", color: "#64748b", marginTop: "2px", fontWeight: 600 }}>
                                                            {m.Department} • {m.Location}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{m.ItemName}</div>
                                                        <div style={{ fontSize: "10px", color: "#475569", fontFamily: "monospace", fontWeight: 600 }}>
                                                            {m.ItemCode} • {m.GroupName}
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
                                                <td colSpan={12} style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
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

            {/* Sequence Settings Modal (Stage-Wise Prefixes & Serial Numbers Starting from No. 1) */}
            {activeModal === "settings" && (
                <div className="tpcs-ii-modal-backdrop" onClick={() => setActiveModal(null)}>
                    <div className="tpcs-ii-modal-content" style={{ width: "680px", maxWidth: "95vw" }} onClick={e => e.stopPropagation()}>
                        <div className="tpcs-ii-modal-header">
                            <h3 className="tpcs-ii-modal-title">Stage-Wise Item Issue Prefixes &amp; Numbering (From No. 1)</h3>
                            <button className="tpcs-ii-modal-close" onClick={() => setActiveModal(null)}><FaTimes /></button>
                        </div>
                        <div className="tpcs-ii-modal-body">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                <span style={{ fontSize: "12px", color: "#475569", fontWeight: 600 }}>
                                    Each stage maintains its own independent prefix and serial number starting from <strong>1</strong>.
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStageSeriesMap(INITIAL_STAGE_SERIES_CONFIG);
                                        const activeCfg = INITIAL_STAGE_SERIES_CONFIG[issueTo] || INITIAL_STAGE_SERIES_CONFIG["Production"];
                                        setIssuePrefix(activeCfg.prefix);
                                        setIssueSerial(String(activeCfg.nextSerial));
                                    }}
                                    style={{
                                        background: "#f1f5f9",
                                        border: "1px solid #cbd5e1",
                                        borderRadius: "4px",
                                        padding: "4px 10px",
                                        fontSize: "11px",
                                        fontWeight: 700,
                                        color: "#1976d2",
                                        cursor: "pointer"
                                    }}
                                >
                                    <FaRedo style={{ marginRight: "4px", fontSize: "10px" }} /> Reset All Stages to No. 1
                                </button>
                            </div>

                            <table className="tpcs-ii-table" style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th>Stage (Issue To)</th>
                                        <th>Series Prefix</th>
                                        <th style={{ width: "110px", textAlign: "center" }}>Next Serial No.</th>
                                        <th style={{ width: "170px" }}>Preview IssueNo</th>
                                        <th style={{ width: "80px", textAlign: "center" }}>Select</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(stageSeriesMap).map(([stageName, cfg]) => (
                                        <tr key={stageName} style={{ backgroundColor: issueTo === stageName ? "#eff6ff" : undefined }}>
                                            <td style={{ fontWeight: 700, color: "#0f172a" }}>{stageName}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="tpcs-ii-tbl-input"
                                                    value={cfg.prefix}
                                                    onChange={(e) => {
                                                        const newPref = e.target.value;
                                                        setStageSeriesMap(prev => ({
                                                            ...prev,
                                                            [stageName]: { ...prev[stageName], prefix: newPref }
                                                        }));
                                                        if (issueTo === stageName) setIssuePrefix(newPref);
                                                    }}
                                                    style={{ fontFamily: "monospace", fontWeight: 700 }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="tpcs-ii-tbl-input"
                                                    value={cfg.nextSerial}
                                                    onChange={(e) => {
                                                        const newSer = Math.max(1, parseInt(e.target.value, 10) || 1);
                                                        setStageSeriesMap(prev => ({
                                                            ...prev,
                                                            [stageName]: { ...prev[stageName], nextSerial: newSer }
                                                        }));
                                                        if (issueTo === stageName) setIssueSerial(String(newSer));
                                                    }}
                                                    style={{ textAlign: "center", fontWeight: 800, color: "#1976d2" }}
                                                />
                                            </td>
                                            <td style={{ fontFamily: "monospace", fontWeight: 700, color: "#047857" }}>
                                                {cfg.prefix}{cfg.nextSerial}
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handleStageChange(stageName);
                                                        setActiveModal(null);
                                                    }}
                                                    style={{
                                                        background: issueTo === stageName ? "#1976d2" : "#e2e8f0",
                                                        color: issueTo === stageName ? "#ffffff" : "#1e293b",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        padding: "3px 8px",
                                                        fontSize: "11px",
                                                        fontWeight: 700,
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    {issueTo === stageName ? "Active" : "Use"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="tpcs-ii-modal-footer">
                            <button type="button" className="tpcs-ii-btn-save" onClick={() => setActiveModal(null)}>Save Settings</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rack QR Stickers (Location-Wise & QR-Code-Wise Item Issue) Modal */}
            {activeModal === "rackQrStickers" && (
                <div className="tpcs-ii-modal-backdrop" onClick={() => setActiveModal(null)}>
                    <div
                        className="tpcs-ii-modal-content"
                        style={{ width: "980px", maxWidth: "96vw", maxHeight: "90vh", overflowY: "auto" }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="tpcs-ii-modal-header" style={{ background: "#0f172a", color: "#ffffff" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <FaQrcode style={{ fontSize: "18px", color: "#38bdf8" }} />
                                <h3 className="tpcs-ii-modal-title" style={{ color: "#ffffff", margin: 0 }}>
                                    Rack QR Stickers — Location-Wise &amp; QR-Code-Wise Direct Item Issue
                                </h3>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <button
                                    type="button"
                                    onClick={() => navigate("/wms/print-binning-slip?format=rack-labels")}
                                    style={{
                                        background: "#2563eb",
                                        color: "#ffffff",
                                        border: "none",
                                        borderRadius: "4px",
                                        padding: "5px 12px",
                                        fontSize: "11.5px",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "5px"
                                    }}
                                >
                                    <FaExternalLinkAlt /> Open Full Rack QR Print Page
                                </button>
                                <button className="tpcs-ii-modal-close" style={{ color: "#ffffff" }} onClick={() => setActiveModal(null)}>
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        <div className="tpcs-ii-modal-body" style={{ padding: "18px", background: "#f8fafc" }}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
                                gap: "14px"
                            }}>
                                {rackQrBins.map(bin => {
                                    const isSelected = activeRackBin?.BinCode === bin.BinCode;
                                    return (
                                        <div
                                            key={bin.BinCode}
                                            style={{
                                                background: "#ffffff",
                                                border: isSelected ? "2px solid #047857" : "2px solid #0f172a",
                                                borderRadius: "8px",
                                                padding: "12px",
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "8px",
                                                boxShadow: "0 2px 6px rgba(15,23,42,0.06)"
                                            }}
                                        >
                                            <div style={{
                                                background: "#0f172a",
                                                color: "#ffffff",
                                                padding: "4px 10px",
                                                borderRadius: "4px",
                                                fontSize: "10.5px",
                                                fontWeight: 800,
                                                display: "flex",
                                                justifyContent: "space-between"
                                            }}>
                                                <span>TPCS WMS • {bin.Warehouse}</span>
                                                <span style={{ color: "#fbbf24" }}>{bin.PendingIrnNo}</span>
                                            </div>

                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <div
                                                    style={{
                                                        padding: "4px",
                                                        border: "1px solid #cbd5e1",
                                                        borderRadius: "6px",
                                                        background: "#ffffff"
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: generateQRCodeSVG(`RACKQR|${bin.BinCode}|ITEM:${bin.ItemCode}|IRN:${bin.PendingIrnNo}`, { size: 78 })
                                                    }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: "17px", fontWeight: 900, color: "#0f172a", fontFamily: "monospace" }}>
                                                        {bin.BinCode}
                                                    </div>
                                                    <div style={{ fontSize: "11px", color: "#475569", fontWeight: 700 }}>
                                                        {bin.Zone} • {bin.Rack} • {bin.Level}
                                                    </div>
                                                    <div style={{ fontSize: "12px", fontWeight: 800, color: "#1e293b", marginTop: "3px" }}>
                                                        {bin.ItemName} ({bin.ItemCode})
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Separate Boxes: Item-Wise Stock Qty APART FROM IRN-Wise Required Qty */}
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                                <div style={{
                                                    background: bin.ItemWiseStockQty > 0 ? "#f0fdf4" : "#fef2f2",
                                                    border: bin.ItemWiseStockQty > 0 ? "1px solid #86efac" : "1px solid #fecaca",
                                                    borderRadius: "6px",
                                                    padding: "6px 8px"
                                                }}>
                                                    <div style={{ fontSize: "9.5px", fontWeight: 800, color: bin.ItemWiseStockQty > 0 ? "#166534" : "#991b1b" }}>
                                                        ITEM-WISE STOCK QTY
                                                    </div>
                                                    <div style={{ fontSize: "13px", fontWeight: 900, color: bin.ItemWiseStockQty > 0 ? "#15803d" : "#dc2626" }}>
                                                        {bin.ItemWiseStockQty} {bin.UOM}
                                                    </div>
                                                </div>

                                                <div style={{
                                                    background: "#eff6ff",
                                                    border: "1px solid #bfdbfe",
                                                    borderRadius: "6px",
                                                    padding: "6px 8px"
                                                }}>
                                                    <div style={{ fontSize: "9.5px", fontWeight: 800, color: "#1e40af" }}>
                                                        IRN-WISE REQ QTY
                                                    </div>
                                                    <div style={{ fontSize: "13px", fontWeight: 900, color: "#1d4ed8" }}>
                                                        {bin.IrnWiseReqQty} {bin.UOM}
                                                    </div>
                                                    <div style={{ fontSize: "9.5px", fontWeight: 800, color: "#b45309" }}>
                                                        Pending: {bin.IrnPendingQty} {bin.UOM}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleIssueFromRackBin(bin, true);
                                                    setActiveModal(null);
                                                }}
                                                style={{
                                                    width: "100%",
                                                    background: "#047857",
                                                    color: "#ffffff",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    padding: "7px 10px",
                                                    fontSize: "11.5px",
                                                    fontWeight: 800,
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "6px"
                                                }}
                                            >
                                                <FaQrcode /> Issue from Rack QR ({bin.BinCode}) <FaArrowRight style={{ fontSize: "10px" }} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="tpcs-ii-modal-footer">
                            <button type="button" className="tpcs-ii-btn-view" onClick={() => setActiveModal(null)}>
                                Close
                            </button>
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
