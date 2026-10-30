// reportSpecs.js - Per-report column/row definitions for the Reports hub.
//
// IMPORTANT: the rows below are ILLUSTRATIVE SAMPLE DATA. They are not read from the
// database. They reuse the real IO / IRN / item codes from the Item Issue work
// (IO/9B/2627/35, IRN/APP/9B/2627/1575 + 2437) so the reports look consistent, but the
// quantities, rates and statuses are placeholders until each report is wired to an API.
//
// Structure:
//   FAMILIES      -> a reusable table layout (columns + sample rows)
//   REPORT_SPECS  -> report id (r1..r88, see reportsDataGenerator.js) -> family
//                    (+ optional `only` status filter and a custom badge)

const IN = (v) => Number(v).toLocaleString("en-IN", { maximumFractionDigits: 2 });

const IO_S = "IO/9B/2627/35 (Sampling)";
const IO_P = "IO/9B/2627/35 (Production)";
const IRN_S = "IRN/APP/9B/2627/1575";
const IRN_P = "IRN/APP/9B/2627/2437";
const RM = "RAW MATERIAL STORE 9B";
const SF = "SEMI FINISH STORE 9B";

const FAMILIES = {
    // ------------------------------------------------------------------ SM
    orderRegister: {
        cols: ["Order No", "Order Date", "Buyer", "Style Ref", "Order Qty", "Shipped Qty", "Balance Qty", "Delivery Date", "Order Value (₹)", "Status"],
        qty: "Order Qty", val: "Order Value (₹)",
        rows: [
            ["SO/9B/2627/101", "2026-08-12", "Buyer 01 (US)", "BG-2101", 1200, 1200, 0, "2026-10-05", 1860000, "Closed"],
            ["SO/9B/2627/108", "2026-08-28", "Buyer 02 (EU)", "BG-2114", 800, 600, 200, "2026-11-10", 1520000, "Open"],
            ["SO/9B/2627/115", "2026-09-04", "Buyer 03 (UK)", "BG-2127", 2500, 0, 2500, "2026-11-30", 1125000, "Open"],
            ["SO/9B/2627/121", "2026-09-19", "Buyer 01 (US)", "BG-2133", 600, 600, 0, "2026-10-18", 1140000, "Closed"]
        ]
    },
    sampleRegister: {
        cols: ["Sample No", "Date", "Buyer", "Style Ref", "Sample Type", "Qty", "Tech Pack Rev", "Due Date", "Status"],
        qty: "Qty",
        rows: [
            ["SMP/9B/2627/088", "2026-10-08", "Buyer 01 (US)", "BG-2101", "Fit Sample", 2, "v2.1", "2026-10-15", "Approved"],
            ["SMP/9B/2627/094", "2026-10-15", "Buyer 02 (EU)", "BG-2114", "PP Sample", 3, "v3.0", "2026-10-24", "Revised"],
            ["SMP/9B/2627/102", "2026-10-22", "Buyer 04 (AU)", "BG-2140", "Proto Sample", 1, "v1.0", "2026-11-02", "Under Review"]
        ]
    },
    styleMaster: {
        cols: ["Style Ref", "Description", "Buyer", "Season", "Category", "Colours", "BOM Version", "Status"],
        rows: [
            ["BG-2101", "Leather Tote Bag Large", "Buyer 01 (US)", "SS-2027", "Tote", 3, "v4", "Active"],
            ["BG-2114", "Crossbody Chain Bag", "Buyer 02 (EU)", "AW-2027", "Crossbody", 2, "v3", "Active"],
            ["BG-2127", "Mini Pouch Wallet", "Buyer 03 (UK)", "SS-2027", "Small Leather Goods", 4, "v2", "Active"],
            ["BG-2133", "Nylon Backpack", "Buyer 01 (US)", "AW-2027", "Backpack", 2, "v1", "On Hold"]
        ]
    },
    pipeline: {
        cols: ["Style Ref", "Description", "Stage", "Stage Owner", "Days In Stage", "Next Gate", "Status"],
        rows: [
            ["BG-2101", "Leather Tote Bag Large", "Bulk Production", "Production", 12, "Final QC", "On Track"],
            ["BG-2114", "Crossbody Chain Bag", "PP Sample", "Sampling", 9, "Buyer Approval", "Delayed"],
            ["BG-2140", "Laptop Sleeve", "Proto Sample", "Sampling", 4, "Fit Review", "On Track"],
            ["BG-2127", "Mini Pouch Wallet", "Costing", "Merchandising", 6, "Order Confirmation", "On Track"]
        ]
    },
    costing: {
        cols: ["Style Ref", "Description", "Order Qty", "Planned Cost (₹/pc)", "Actual Cost (₹/pc)", "Variance (₹/pc)", "Var %", "Status"],
        qty: "Order Qty",
        rows: [
            ["BG-2101", "Leather Tote Bag Large", 1200, 1550, 1512, -38, "-2.45%", "Favorable"],
            ["BG-2114", "Crossbody Chain Bag", 800, 1900, 1968, 68, "+3.58%", "Over Budget"],
            ["BG-2127", "Mini Pouch Wallet", 2500, 450, 446, -4, "-0.89%", "Favorable"],
            ["BG-2133", "Nylon Backpack", 600, 1900, 1900, 0, "0.00%", "On Target"]
        ]
    },
    salesRegister: {
        cols: ["Invoice No", "Date", "Buyer", "Style Ref", "Qty", "Taxable Value (₹)", "GST (₹)", "Invoice Total (₹)", "Payment Status"],
        qty: "Qty", val: "Invoice Total (₹)", statusCol: "Payment Status",
        rows: [
            ["INV/9B/2627/0412", "2026-10-06", "Buyer 01 (US)", "BG-2101", 1200, 1860000, 93000, 1953000, "Paid"],
            ["INV/9B/2627/0419", "2026-10-14", "Buyer 02 (EU)", "BG-2114", 600, 1140000, 57000, 1197000, "Partial"],
            ["INV/9B/2627/0427", "2026-10-19", "Buyer 01 (US)", "BG-2133", 600, 1140000, 57000, 1197000, "Overdue"],
            ["INV/9B/2627/0433", "2026-10-24", "Buyer 04 (AU)", "BG-2140", 900, 810000, 40500, 850500, "Pending"]
        ]
    },
    dispatchSummary: {
        cols: ["Dispatch No", "Date", "Buyer", "Style Ref", "Cartons", "Qty", "Transporter", "LR No", "Status"],
        qty: "Qty",
        rows: [
            ["DSP/9B/2627/061", "2026-10-06", "Buyer 01 (US)", "BG-2101", 48, 1200, "Blue Dart Logistics", "BD-88121", "Delivered"],
            ["DSP/9B/2627/064", "2026-10-14", "Buyer 02 (EU)", "BG-2114", 24, 600, "ARC Logistics", "ARC-4410", "In Transit"],
            ["DSP/9B/2627/068", "2026-10-24", "Buyer 04 (AU)", "BG-2140", 36, 900, "V-Trans", "VT-7702", "Dispatched"]
        ]
    },
    customerAging: {
        cols: ["Buyer", "Invoice No", "Invoice Date", "Amount (₹)", "0-30 Days (₹)", "31-60 Days (₹)", "61-90 Days (₹)", "90+ Days (₹)", "Status"],
        val: "Amount (₹)",
        rows: [
            ["Buyer 02 (EU)", "INV/9B/2627/0419", "2026-10-14", 1197000, 1197000, 0, 0, 0, "Current"],
            ["Buyer 01 (US)", "INV/9B/2627/0427", "2026-10-19", 1197000, 1197000, 0, 0, 0, "Overdue"],
            ["Buyer 03 (UK)", "INV/9B/2627/0388", "2026-08-30", 640000, 0, 0, 640000, 0, "Overdue"],
            ["Buyer 04 (AU)", "INV/9B/2627/0351", "2026-07-02", 325000, 0, 0, 0, 325000, "Critical"]
        ]
    },
    tna: {
        cols: ["Order", "Buyer", "Milestone", "Planned Date", "Actual Date", "Delay (Days)", "Responsible", "Status"],
        rows: [
            ["SO/9B/2627/101", "Buyer 01 (US)", "Lab / Material Approval", "2026-08-20", "2026-08-20", 0, "Merchandiser", "On Time"],
            ["SO/9B/2627/108", "Buyer 02 (EU)", "PP Sample Submission", "2026-10-12", "2026-10-16", 4, "Sampling Head", "Delayed"],
            ["SO/9B/2627/115", "Buyer 03 (UK)", "Hardware In-House", "2026-10-18", "2026-10-18", 0, "Purchase", "On Time"],
            ["SO/9B/2627/121", "Buyer 01 (US)", "Bulk Cutting Start", "2026-10-22", "2026-10-25", 3, "Cutting", "Delayed"]
        ]
    },

    // ------------------------------------------------------------------ MM: purchase
    poRegister: {
        cols: ["PO No", "PO Date", "Supplier", "Item Code", "Item Description", "Ordered Qty", "UOM", "Rate (₹)", "Amount (₹)", "Delivery Date", "Status"],
        qty: "Ordered Qty", val: "Amount (₹)",
        rows: [
            ["PO/AAPL9B/2627/0042", "2026-10-22", "Apex Leather Works", "CRD-1800", "Leather Cord Black 2mm", 850, "MTR", 14, 11900, "2026-11-05", "Approved"],
            ["PO/AAPL9B/2627/0041", "2026-10-21", "Balaji Trims & Fasteners", "HDW-6830", "Bridge Hasp Gold", 2000, "PCS", 42, 84000, "2026-10-28", "Open"],
            ["PO/AAPL9B/2627/0040", "2026-10-19", "K-Tex Textiles", "THR-TEX70-FW", "Bonded Nylon Thread TEX70 Frost White", 120, "SPOOL", 210, 25200, "2026-11-02", "Completed"],
            ["PO/AAPL9B/2627/0039", "2026-10-18", "Supreme Leathercraft", "LBL-COO01", "TB COO Label", 5000, "PCS", 1.8, 9000, "2026-10-30", "Cancelled"]
        ]
    },
    poAmend: {
        cols: ["PO No", "Amend No", "Amend Date", "Field Changed", "Old Value", "New Value", "Amended By", "Status"],
        rows: [
            ["PO/AAPL9B/2627/0042", 1, "2026-10-23", "Delivery Date", "2026-11-01", "2026-11-05", "Vaishnav V", "Approved"],
            ["PO/AAPL9B/2627/0041", 1, "2026-10-22", "Rate (₹)", "40.00", "42.00", "Admin", "Approved"],
            ["PO/AAPL9B/2627/0041", 2, "2026-10-24", "Ordered Qty", "1800", "2000", "Vaishnav V", "Pending Approval"]
        ]
    },
    reqToPo: {
        cols: ["IRN No", "IO No", "Item Code", "Required Qty", "PO No", "PO Qty", "Balance To Order", "Status"],
        qty: "Required Qty",
        rows: [
            [IRN_S, IO_S, "HDW-6830", 20, "PO/AAPL9B/2627/0041", 2000, 0, "Covered"],
            [IRN_S, IO_S, "CHN-6582", 15, "-", 0, 15, "To Order"],
            [IRN_P, IO_P, "CRD-1800", 850, "PO/AAPL9B/2627/0042", 850, 0, "Covered"],
            [IRN_P, IO_P, "LBL-COO01", 1200, "PO/AAPL9B/2627/0039", 0, 1200, "To Order"]
        ]
    },
    indentPoGrn: {
        cols: ["Indent No", "PO No", "GRN No", "Item Code", "Indent Qty", "PO Qty", "GRN Qty", "Pending Qty", "Status"],
        qty: "Indent Qty",
        rows: [
            ["IND/AAPL/9B/26-27/1192", "PO/AAPL9B/2627/0042", "GRN/9B/2627/114", "CRD-1800", 850, 850, 850, 0, "Completed"],
            ["IND/AAPL/9B/26-27/1195", "PO/AAPL9B/2627/0041", "GRN/9B/2627/118", "HDW-6830", 2000, 2000, 1200, 800, "Partial"],
            ["IND/AAPL/9B/26-27/1198", "PO/AAPL9B/2627/0040", "-", "THR-TEX70-FW", 120, 120, 0, 120, "Pending GRN"],
            ["IND/AAPL/9B/26-27/1201", "-", "-", "CHN-6582", 300, 0, 0, 300, "Pending PO"]
        ]
    },
    supplierAnalysis: {
        cols: ["Supplier", "No. of POs", "Total PO Value (₹)", "Received Value (₹)", "Pending Value (₹)", "Rejection %", "Status"],
        val: "Total PO Value (₹)",
        rows: [
            ["Apex Leather Works", 6, 412000, 380000, 32000, "0.8%", "Preferred"],
            ["Balaji Trims & Fasteners", 9, 268000, 190000, 78000, "1.9%", "Approved"],
            ["K-Tex Textiles", 4, 154000, 154000, 0, "0.0%", "Preferred"],
            ["Supreme Leathercraft", 3, 96000, 40000, 56000, "4.2%", "Watch"]
        ]
    },
    leadTime: {
        cols: ["Supplier", "PO No", "PO Date", "Promised Date", "Received Date", "Delay (Days)", "OTIF %", "Status"],
        rows: [
            ["Apex Leather Works", "PO/AAPL9B/2627/0030", "2026-09-12", "2026-09-26", "2026-09-25", 0, "100%", "On Time"],
            ["Balaji Trims & Fasteners", "PO/AAPL9B/2627/0034", "2026-09-20", "2026-10-02", "2026-10-08", 6, "82%", "Late"],
            ["K-Tex Textiles", "PO/AAPL9B/2627/0037", "2026-10-01", "2026-10-12", "2026-10-12", 0, "100%", "On Time"],
            ["Supreme Leathercraft", "PO/AAPL9B/2627/0036", "2026-10-03", "2026-10-15", "2026-10-24", 9, "64%", "Late"]
        ]
    },
    rateCompare: {
        cols: ["Item Code", "Item Description", "Supplier", "Last Rate (₹)", "Quoted Rate (₹)", "Difference (₹)", "Lowest Supplier", "Status"],
        rows: [
            ["HDW-6830", "Bridge Hasp Gold", "Balaji Trims & Fasteners", 40, 42, 2, "Classic Threads & Zips", "Higher"],
            ["CRD-1800", "Leather Cord Black 2mm", "Apex Leather Works", 14.5, 14, -0.5, "Apex Leather Works", "Lowest"],
            ["THR-TEX70-FW", "Bonded Nylon Thread TEX70 FW", "K-Tex Textiles", 205, 210, 5, "K-Tex Textiles", "Lowest"],
            ["LBL-COO01", "TB COO Label", "Supreme Leathercraft", 1.7, 1.8, 0.1, "Classic Threads & Zips", "Higher"]
        ]
    },
    grnRegister: {
        cols: ["GRN No", "GRN Date", "Supplier", "PO No", "Item Code", "Received Qty", "Accepted Qty", "Rejected Qty", "UOM", "Status"],
        qty: "Received Qty",
        rows: [
            ["GRN/9B/2627/114", "2026-10-24", "Apex Leather Works", "PO/AAPL9B/2627/0042", "CRD-1800", 850, 850, 0, "MTR", "Approved"],
            ["GRN/9B/2627/118", "2026-10-23", "Balaji Trims & Fasteners", "PO/AAPL9B/2627/0041", "HDW-6830", 1200, 1180, 20, "PCS", "Pending"],
            ["GRN/9B/2627/121", "2026-10-20", "K-Tex Textiles", "PO/AAPL9B/2627/0040", "THR-TEX70-FW", 120, 120, 0, "SPOOL", "Completed"],
            ["GRN/9B/2627/125", "2026-10-19", "Supreme Leathercraft", "PO/AAPL9B/2627/0039", "LBL-COO01", 3000, 2850, 150, "PCS", "Approved"]
        ]
    },
    grnInspection: {
        cols: ["GRN No", "Handover Date", "Inspection Date", "Item Code", "Received Qty", "Accepted Qty", "Rejected Qty", "QC By", "Status"],
        qty: "Received Qty",
        rows: [
            ["GRN/9B/2627/114", "2026-10-24", "2026-10-24", "CRD-1800", 850, 850, 0, "QC-01", "Passed"],
            ["GRN/9B/2627/118", "2026-10-23", "2026-10-25", "HDW-6830", 1200, 1180, 20, "QC-02", "Partial Reject"],
            ["GRN/9B/2627/125", "2026-10-19", "2026-10-21", "LBL-COO01", 3000, 2850, 150, "QC-01", "Partial Reject"],
            ["GRN/9B/2627/129", "2026-10-26", "-", "CHN-6582", 200, 0, 0, "-", "Awaiting QC"]
        ]
    },
    purchaseReturn: {
        cols: ["Return No", "Date", "Supplier", "GRN No", "Item Code", "Return Qty", "Rate (₹)", "Debit Note Value (₹)", "Reason", "Status"],
        qty: "Return Qty", val: "Debit Note Value (₹)",
        rows: [
            ["PRN/9B/2627/012", "2026-10-26", "Balaji Trims & Fasteners", "GRN/9B/2627/118", "HDW-6830", 20, 42, 840, "Plating defect", "Approved"],
            ["PRN/9B/2627/013", "2026-10-27", "Supreme Leathercraft", "GRN/9B/2627/125", "LBL-COO01", 150, 1.8, 270, "Print misalignment", "Pending"]
        ]
    },

    // ------------------------------------------------------------------ MM: inventory
    irnVsIssue: {
        cols: ["IRN No", "IO No", "Item Code", "Item Description", "Requested Qty", "Issued Qty", "Pending Qty", "UOM", "Status"],
        qty: "Requested Qty",
        rows: [
            [IRN_S, IO_S, "HDW-6830", "Bridge Hasp Gold", 20, 20, 0, "PCS", "Issued"],
            [IRN_S, IO_S, "CHN-6582", "Chain Gold 8mm", 15, 10, 5, "MTR", "Partial"],
            [IRN_P, IO_P, "LBL-COO01", "TB COO Label", 1200, 0, 1200, "PCS", "Pending"],
            [IRN_P, IO_P, "CRD-1800", "Leather Cord Black 2mm", 850, 400, 450, "MTR", "Partial"]
        ]
    },
    stdc: {
        cols: ["DC No", "DC Date", "From Store", "To Store", "Item Code", "Qty", "UOM", "Vehicle", "Status"],
        qty: "Qty",
        rows: [
            ["STDC/9B/2627/031", "2026-10-20", RM, SF, "CRD-1800", 400, "MTR", "HR-38-AB-2201", "Received"],
            ["STDC/9B/2627/034", "2026-10-24", RM, SF, "HDW-6830", 600, "PCS", "HR-38-AB-2201", "In Transit"],
            ["STDC/9B/2627/036", "2026-10-26", RM, "STORE 30", "THR-TEX70-FW", 40, "SPOOL", "-", "Pending"],
            ["STDC/9B/2627/037", "2026-10-27", SF, "STORE 30", "CHN-6582", 100, "MTR", "HR-55-C-9012", "In Transit"]
        ]
    },
    stgrn: {
        cols: ["GRN No", "GRN Date", "DC No", "From Store", "To Store", "Item Code", "DC Qty", "Received Qty", "Short Qty", "Status"],
        qty: "Received Qty",
        rows: [
            ["STGRN/9B/2627/029", "2026-10-21", "STDC/9B/2627/031", RM, SF, "CRD-1800", 400, 400, 0, "Completed"],
            ["STGRN/9B/2627/033", "2026-10-25", "STDC/9B/2627/034", RM, SF, "HDW-6830", 600, 590, 10, "Short Receipt"]
        ]
    },
    storeTransfer: {
        cols: ["Transfer No", "Date", "From Store", "To Store", "Item Code", "Qty", "UOM", "Issued By", "Status"],
        qty: "Qty",
        rows: [
            ["STR/9B/2627/044", "2026-10-22", RM, SF, "PLR-3953", 40, "PCS", "Store Incharge", "Completed"],
            ["STR/9B/2627/047", "2026-10-25", RM, SF, "STP-03SG", 30, "PCS", "Store Incharge", "Completed"],
            ["STR/9B/2627/049", "2026-10-27", SF, RM, "TAP-210D", 120, "MTR", "Admin", "Pending"]
        ]
    },
    gatePass: {
        cols: ["Gate Pass No", "Date", "Party", "Item Description", "Qty", "Returnable", "Vehicle No", "Status"],
        qty: "Qty",
        rows: [
            ["GP/9B/2627/071", "2026-10-21", "Rainbow Printers & Dyers", "Leather panels for printing", 120, "Yes", "HR-38-AB-2201", "Out"],
            ["GP/9B/2627/074", "2026-10-24", "Classic Threads & Zips", "Zip sample set", 6, "No", "-", "Closed"],
            ["GP/9B/2627/078", "2026-10-26", "Apex Leather Works", "Rejected leather sheets", 15, "Yes", "HR-55-C-9012", "Out"]
        ]
    },
    gatePassGrn: {
        cols: ["Gate Pass GRN", "Date", "Gate Pass No", "Party", "Item Description", "Qty Sent", "Qty Received", "Status"],
        qty: "Qty Received",
        rows: [
            ["GPG/9B/2627/041", "2026-10-25", "GP/9B/2627/071", "Rainbow Printers & Dyers", "Leather panels for printing", 120, 118, "Short Receipt"],
            ["GPG/9B/2627/043", "2026-10-27", "GP/9B/2627/078", "Apex Leather Works", "Rejected leather sheets", 15, 15, "Completed"]
        ]
    },
    gateEntry: {
        cols: ["Gate Entry No", "Date", "In Time", "Supplier", "Invoice No", "Vehicle No", "Boxes", "Received By", "Status"],
        qty: "Boxes",
        rows: [
            ["GE/9B/2627/0201", "2026-10-24", "10:15", "Apex Leather Works", "INV-ALW-892", "HR-38-AB-2201", 14, "Security-01", "Inward Done"],
            ["GE/9B/2627/0204", "2026-10-26", "14:40", "Balaji Trims & Fasteners", "BTF/INV/112", "DL-1C-4410", 22, "Security-02", "Pending GRN"],
            ["GE/9B/2627/0207", "2026-10-27", "09:05", "K-Tex Textiles", "KTEX/26/890", "HR-55-C-9012", 6, "Security-01", "Pending GRN"]
        ]
    },
    itemIssue: {
        cols: ["Issue No", "Issue Date", "IO No", "IRN No", "Item Code", "Issued Qty", "UOM", "Issue To", "Status"],
        qty: "Issued Qty",
        rows: [
            ["IS/SAM/2627/0001", "2026-10-22", IO_S, IRN_S, "HDW-6830", 20, "PCS", "BAG SAMPLING", "Issued"],
            ["IS/SAM/2627/0002", "2026-10-23", IO_S, IRN_S, "CHN-6582", 10, "MTR", "BAG SAMPLING", "Issued"],
            ["IS/CUT/2627/0001", "2026-10-26", IO_P, IRN_P, "CRD-1800", 400, "MTR", "BAG PRODUCTION", "Issued"]
        ]
    },
    floorReturn: {
        cols: ["Return No", "Date", "Department", "Item Code", "Return Qty", "UOM", "Reason", "Status"],
        qty: "Return Qty",
        rows: [
            ["FR/9B/2627/018", "2026-10-25", "BAG SAMPLING", "CHN-6582", 2, "MTR", "Excess issue", "Accepted"],
            ["FR/9B/2627/019", "2026-10-26", "BAG PRODUCTION", "CRD-1800", 35, "MTR", "Cutting leftover", "Pending"]
        ]
    },
    rejection: {
        cols: ["Rejection No", "Date", "Supplier", "Item Code", "Rejected Qty", "UOM", "Reason", "Action", "Status"],
        qty: "Rejected Qty",
        rows: [
            ["REJ/9B/2627/009", "2026-10-25", "Balaji Trims & Fasteners", "HDW-6830", 20, "PCS", "Plating defect", "Return to supplier", "Open"],
            ["REJ/9B/2627/010", "2026-10-21", "Supreme Leathercraft", "LBL-COO01", 150, "PCS", "Print misalignment", "Debit note", "Closed"]
        ]
    },
    wastage: {
        cols: ["Date", "Department", "Item Code", "Scrap Qty", "UOM", "Scrap Type", "Value (₹)", "Status"],
        qty: "Scrap Qty", val: "Value (₹)",
        rows: [
            ["2026-10-24", "BAG PRODUCTION", "CRD-1800", 18, "MTR", "Cutting waste", 252, "Recorded"],
            ["2026-10-25", "BAG SAMPLING", "CHN-6582", 1.5, "MTR", "Trimmings", 177, "Recorded"],
            ["2026-10-26", "BAG PRODUCTION", "TAP-210D", 12, "MTR", "Damaged", 90, "Pending Write-off"]
        ]
    },
    deadStock: {
        cols: ["Item Code", "Item Description", "Last Move Date", "Qty", "Book Value (₹)", "Disposal Type", "Approved By", "Status"],
        qty: "Qty", val: "Book Value (₹)",
        rows: [
            ["RAF-1100", "Raffia Fabric 1100", "2026-02-11", 140, 13440, "Auction", "Plant Head", "Approved"],
            ["TAP-210D", "Nylon Tape 210D", "2026-03-04", 320, 2400, "Scrap Sale", "-", "Proposed"]
        ]
    },
    stockConversion: {
        cols: ["Conversion No", "Date", "From Item", "To Item", "Input Qty", "Output Qty", "Loss %", "Status"],
        rows: [
            ["SC/9B/2627/006", "2026-10-18", "Leather Sheet (Full)", "Leather Cut Panels", 120, 112, "6.7%", "Completed"],
            ["SC/9B/2627/007", "2026-10-24", "Nylon Tape 210D (Roll)", "Nylon Tape 210D (Cut)", 300, 296, "1.3%", "Pending"]
        ]
    },
    stockLedger: {
        cols: ["Date", "Voucher Type", "Voucher No", "Item Code", "Store", "Inward Qty", "Outward Qty", "Balance Qty", "UOM"],
        rows: [
            ["2026-10-22", "Item Receipt", "GRN/9B/2627/114", "CRD-1800", RM, 850, 0, 1250, "MTR"],
            ["2026-10-23", "Item Issue", "IS/SAM/2627/0002", "CHN-6582", RM, 0, 10, 38, "MTR"],
            ["2026-10-24", "Stock Transfer DC", "STDC/9B/2627/034", "HDW-6830", RM, 0, 600, 1420, "PCS"],
            ["2026-10-26", "Item Issue", "IS/CUT/2627/0001", "CRD-1800", RM, 0, 400, 850, "MTR"]
        ]
    },
    stockByLocation: {
        cols: ["Store", "Bin / Rack", "Item Code", "Item Description", "Lot No", "Qty", "UOM", "Last Movement", "Status"],
        qty: "Qty",
        rows: [
            [RM, "BIN-A-01-01", "HDW-6830", "Bridge Hasp Gold", "LOT-8820", 1420, "PCS", "2026-10-24", "Available"],
            [RM, "BIN-A-01-02", "CHN-6582", "Chain Gold 8mm", "LOT-9104", 38, "MTR", "2026-10-23", "Available"],
            [RM, "BIN-B-02-01", "CRD-1800", "Leather Cord Black 2mm", "LOT-3319", 850, "MTR", "2026-10-26", "Available"],
            [SF, "BIN-C-01-04", "LBL-COO01", "TB COO Label", "LOT-4412", 2850, "PCS", "2026-10-21", "Quarantine"]
        ]
    },
    fgStock: {
        cols: ["Style Ref", "Description", "Colour", "Store", "Cartons", "Qty (Pcs)", "Packed Date", "Status"],
        qty: "Qty (Pcs)",
        rows: [
            ["BG-2101", "Leather Tote Bag Large", "Black", "FINISHED GOODS STORE", 48, 1200, "2026-10-05", "Ready To Ship"],
            ["BG-2133", "Nylon Backpack", "Navy", "FINISHED GOODS STORE", 24, 600, "2026-10-17", "Ready To Ship"],
            ["BG-2114", "Crossbody Chain Bag", "Tan", "FINISHED GOODS STORE", 12, 300, "2026-10-26", "Packing"]
        ]
    },
    lowStock: {
        cols: ["Item Code", "Item Description", "Store", "Current Stock", "Reorder Level", "Shortfall", "UOM", "Status"],
        rows: [
            ["CHN-6582", "Chain Gold 8mm", RM, 38, 100, 62, "MTR", "Below Reorder"],
            ["STP-03SG", "Stopper Gold", RM, 120, 100, 0, "PCS", "Sufficient"],
            ["THR-TEX70-FW", "Bonded Nylon Thread TEX70 FW", RM, 18, 40, 22, "SPOOL", "Below Reorder"],
            ["TAP-210D", "Nylon Tape 210D", SF, -12, 50, 62, "MTR", "Negative"]
        ]
    },
    stockAging: {
        cols: ["Item Code", "Item Description", "Qty", "0-30 Days", "31-60 Days", "61-90 Days", "90+ Days", "Value (₹)", "Status"],
        qty: "Qty", val: "Value (₹)",
        rows: [
            ["CRD-1800", "Leather Cord Black 2mm", 850, 850, 0, 0, 0, 11900, "Fast-Moving"],
            ["HDW-6830", "Bridge Hasp Gold", 1420, 600, 520, 300, 0, 59640, "Normal"],
            ["RAF-1100", "Raffia Fabric 1100", 140, 0, 0, 0, 140, 13440, "Non-Moving"],
            ["TAP-210D", "Nylon Tape 210D", 320, 0, 0, 60, 260, 2400, "Slow-Moving"]
        ]
    },
    valuation: {
        cols: ["Item Code", "Item Description", "Store", "Closing Qty", "UOM", "Avg Rate (₹)", "Valuation (₹)", "Status"],
        val: "Valuation (₹)",
        rows: [
            ["HDW-6830", "Bridge Hasp Gold", RM, 1420, "PCS", 42, 59640, "Valued"],
            ["CHN-6582", "Chain Gold 8mm", RM, 38, "MTR", 118, 4484, "Valued"],
            ["CRD-1800", "Leather Cord Black 2mm", RM, 850, "MTR", 14, 11900, "Valued"],
            ["LBL-COO01", "TB COO Label", SF, 2850, "PCS", 1.8, 5130, "Valued"]
        ]
    },
    physical: {
        cols: ["Item Code", "Store", "System Qty", "Physical Qty", "Difference", "UOM", "Verified By", "Status"],
        rows: [
            ["HDW-6830", RM, 1420, 1420, 0, "PCS", "Store Incharge", "Matched"],
            ["CHN-6582", RM, 38, 36, -2, "MTR", "Store Incharge", "Short"],
            ["CRD-1800", RM, 850, 855, 5, "MTR", "Admin", "Excess"]
        ]
    },
    stockAdjust: {
        cols: ["Adj No", "Date", "Item Code", "Store", "System Qty", "Adjusted Qty", "Difference", "Reason", "Approved By", "Status"],
        rows: [
            ["ADJ/9B/2627/004", "2026-10-25", "CHN-6582", RM, 38, 36, -2, "Physical count", "Plant Head", "Approved"],
            ["ADJ/9B/2627/005", "2026-10-26", "CRD-1800", RM, 850, 855, 5, "Physical count", "-", "Pending Approval"]
        ]
    },
    wipDept: {
        cols: ["Department", "Style Ref", "Opening WIP", "Received", "Issued", "Closing WIP", "UOM", "Status"],
        rows: [
            ["Cutting", "BG-2101", 120, 600, 540, 180, "PCS", "Active"],
            ["Stitching", "BG-2101", 300, 540, 480, 360, "PCS", "Active"],
            ["Finishing", "BG-2133", 80, 200, 260, 20, "PCS", "Active"],
            ["Packing", "BG-2114", 0, 300, 300, 0, "PCS", "Cleared"]
        ]
    },
    wipCut: {
        cols: ["Cutting Slip", "Style Ref", "Component", "Cut Qty", "Sent To Stitching", "Balance", "Status"],
        qty: "Cut Qty",
        rows: [
            ["CS/9B/2627/0212", "BG-2101", "Body Panel", 600, 540, 60, "Partial"],
            ["CS/9B/2627/0213", "BG-2101", "Handle Strap", 1200, 1200, 0, "Completed"],
            ["CS/9B/2627/0218", "BG-2114", "Flap", 300, 0, 300, "Pending"]
        ]
    },
    consumption: {
        cols: ["Style Ref", "Item Code", "Item Description", "Standard Qty", "Actual Qty", "Variance", "UOM", "Status"],
        rows: [
            ["BG-2101", "CRD-1800", "Leather Cord Black 2mm", 840, 850, 10, "MTR", "Excess"],
            ["BG-2101", "HDW-6830", "Bridge Hasp Gold", 1200, 1200, 0, "PCS", "On Standard"],
            ["BG-2114", "CHN-6582", "Chain Gold 8mm", 100, 94, -6, "MTR", "Saving"],
            ["BG-2114", "THR-TEX70-FW", "Bonded Nylon Thread TEX70 FW", 10, 12, 2, "SPOOL", "Excess"]
        ]
    },
    mrp: {
        cols: ["IO No", "Item Code", "Item Description", "Gross Requirement", "Stock", "On Order", "Net Requirement", "UOM", "Status"],
        rows: [
            [IO_S, "HDW-6830", "Bridge Hasp Gold", 20, 1420, 0, 0, "PCS", "Covered"],
            [IO_S, "CHN-6582", "Chain Gold 8mm", 15, 38, 0, 0, "MTR", "Covered"],
            [IO_P, "LBL-COO01", "TB COO Label", 1200, 0, 0, 1200, "PCS", "Shortage"],
            [IO_P, "THR-TEX70-FW", "Bonded Nylon Thread TEX70 FW", 12, 18, 120, 0, "SPOOL", "Covered"]
        ]
    },
    bomVariance: {
        cols: ["Style Ref", "Item Code", "BOM Qty", "Planned Qty", "Variance", "UOM", "Status"],
        rows: [
            ["BG-2101", "CRD-1800", 840, 850, 10, "MTR", "Check"],
            ["BG-2101", "HDW-6830", 1200, 1200, 0, "PCS", "Matched"],
            ["BG-2114", "CHN-6582", 100, 94, -6, "MTR", "Check"]
        ]
    },
    allocation: {
        cols: ["IO No", "Item Code", "Required", "Allocated", "Free Stock", "UOM", "Status"],
        rows: [
            [IO_S, "HDW-6830", 20, 20, 1400, "PCS", "Fully Allocated"],
            [IO_S, "CHN-6582", 15, 15, 23, "MTR", "Fully Allocated"],
            [IO_P, "CRD-1800", 850, 850, 0, "MTR", "Fully Allocated"],
            [IO_P, "LBL-COO01", 1200, 0, 0, "PCS", "Not Allocated"]
        ]
    },
    bomAmend: {
        cols: ["Style Ref", "BOM Ver (Old)", "BOM Ver (New)", "Item Code", "Old Qty", "New Qty", "Changed By", "Changed On", "Status"],
        rows: [
            ["BG-2101", "v3", "v4", "CRD-1800", 800, 840, "Product Dev", "2026-10-02", "Approved"],
            ["BG-2114", "v2", "v3", "CHN-6582", 90, 100, "Product Dev", "2026-10-09", "Approved"],
            ["BG-2133", "v0", "v1", "TAP-210D", 0, 140, "Product Dev", "2026-10-20", "Pending Approval"]
        ]
    },

    // ------------------------------------------------------------------ PM
    planCalendar: {
        cols: ["Week", "Line / Section", "Style Ref", "Planned Qty", "Capacity Qty", "Utilisation %", "Status"],
        qty: "Planned Qty",
        rows: [
            ["W44 (26 Oct)", "Line-01", "BG-2101", 600, 650, "92%", "Planned"],
            ["W44 (26 Oct)", "Line-02", "BG-2114", 420, 420, "100%", "Full"],
            ["W45 (02 Nov)", "Line-01", "BG-2133", 500, 650, "77%", "Planned"],
            ["W45 (02 Nov)", "Line-03", "BG-2127", 900, 800, "113%", "Over Capacity"]
        ]
    },
    subcontractDc: {
        cols: ["DC No", "DC Date", "Job Worker", "Style Ref", "Process", "Issued Qty", "Received Qty", "Balance Qty", "Rate (₹)", "Status"],
        qty: "Issued Qty",
        rows: [
            ["SBDC/9B/2627/142", "2026-10-14", "Rainbow Printers & Dyers", "BG-2101", "Foil Print", 1200, 1190, 10, 14.5, "Completed"],
            ["SBDC/9B/2627/149", "2026-10-18", "Apex Embroidery Works", "BG-2114", "Embroidery", 800, 500, 300, 18, "In-Progress"],
            ["SBDC/9B/2627/155", "2026-10-21", "Precision Screen Printers", "BG-2127", "Screen Print", 2500, 1500, 1000, 6, "In-Progress"],
            ["SBDC/9B/2627/160", "2026-10-24", "Creative Edge Painters", "BG-2133", "Edge Painting", 600, 0, 600, 9, "Material Dispatched"]
        ]
    },
    dcVsGrn: {
        cols: ["DC No", "Job Worker", "Process", "DC Qty", "GRN No", "GRN Qty", "Short / Excess", "Status"],
        qty: "DC Qty",
        rows: [
            ["SBDC/9B/2627/142", "Rainbow Printers & Dyers", "Foil Print", 1200, "SBGRN/9B/2627/088", 1190, -10, "Short"],
            ["SBDC/9B/2627/149", "Apex Embroidery Works", "Embroidery", 800, "SBGRN/9B/2627/093", 500, -300, "Open"],
            ["SBDC/9B/2627/155", "Precision Screen Printers", "Screen Print", 2500, "SBGRN/9B/2627/097", 1500, -1000, "Open"]
        ]
    },
    conversionDc: {
        cols: ["Conv DC No", "Date", "Job Worker", "Input Item", "Input Qty", "Output Item", "Output Qty", "Loss %", "Status"],
        qty: "Input Qty",
        rows: [
            ["SMC/9B/2627/011", "2026-10-15", "Rainbow Printers & Dyers", "Leather Sheet (Raw)", 300, "Printed Leather Sheet", 288, "4.0%", "Completed"],
            ["SMC/9B/2627/014", "2026-10-22", "Creative Edge Painters", "Strap Blanks", 1200, "Painted Straps", 1150, "4.2%", "In-Progress"]
        ]
    },
    subcontractGrn: {
        cols: ["GRN No", "GRN Date", "DC No", "Job Worker", "Style Ref", "Received Qty", "Rejected Qty", "Status"],
        qty: "Received Qty",
        rows: [
            ["SBGRN/9B/2627/088", "2026-10-20", "SBDC/9B/2627/142", "Rainbow Printers & Dyers", "BG-2101", 1190, 6, "Approved"],
            ["SBGRN/9B/2627/093", "2026-10-25", "SBDC/9B/2627/149", "Apex Embroidery Works", "BG-2114", 500, 0, "Pending"],
            ["SBGRN/9B/2627/097", "2026-10-26", "SBDC/9B/2627/155", "Precision Screen Printers", "BG-2127", 1500, 12, "Approved"]
        ]
    },
    jobWorkBill: {
        cols: ["Bill No", "Bill Date", "Job Worker", "DC No", "Billed Qty", "GRN Qty", "Rate (₹)", "Billed Amt (₹)", "Verified Amt (₹)", "Status"],
        qty: "Billed Qty", val: "Billed Amt (₹)",
        rows: [
            ["RPD/26-27/311", "2026-10-22", "Rainbow Printers & Dyers", "SBDC/9B/2627/142", 1200, 1190, 14.5, 17400, 17255, "Short Verified"],
            ["AEW/26-27/087", "2026-10-26", "Apex Embroidery Works", "SBDC/9B/2627/149", 500, 500, 18, 9000, 9000, "Verified"]
        ]
    },
    cuttingLog: {
        cols: ["Slip No", "Date", "Style Ref", "IO No", "Material", "Cut Qty", "Cutter", "Status"],
        qty: "Cut Qty",
        rows: [
            ["CS/9B/2627/0212", "2026-10-22", "BG-2101", IO_P, "Leather Cord / Panels", 600, "Cutter-01", "Completed"],
            ["CS/9B/2627/0213", "2026-10-23", "BG-2101", IO_P, "Handle Strap", 1200, "Cutter-02", "Completed"],
            ["CS/9B/2627/0218", "2026-10-26", "BG-2114", IO_S, "Flap Panel", 300, "Cutter-01", "In Progress"]
        ]
    },
    lineOutputSize: {
        cols: ["Line", "Date", "Style Ref", "Colour", "Small", "Medium", "Large", "Total", "Status"],
        qty: "Total",
        rows: [
            ["Line-01", "2026-10-26", "BG-2101", "Black", 60, 380, 240, 680, "Target Achieved"],
            ["Line-02", "2026-10-26", "BG-2114", "Tan", 120, 200, 75, 395, "Behind"],
            ["Line-03", "2026-10-26", "BG-2133", "Navy", 90, 250, 172, 512, "Target Achieved"]
        ]
    },
    dailyTarget: {
        cols: ["Date", "Line", "Style Ref", "Target", "Achieved", "Variance", "Achievement %", "Status"],
        qty: "Achieved",
        rows: [
            ["2026-10-26", "Line-01", "BG-2101", 650, 680, 30, "104.6%", "Achieved"],
            ["2026-10-26", "Line-02", "BG-2114", 420, 395, -25, "94.0%", "Behind"],
            ["2026-10-26", "Line-03", "BG-2133", 500, 512, 12, "102.4%", "Achieved"]
        ]
    },
    lineBalancing: {
        cols: ["Line", "Style Ref", "Operation", "SMV (min)", "Operators", "Target / Hr", "Actual / Hr", "Efficiency %", "Status"],
        rows: [
            ["Line-01", "BG-2101", "Body Stitching", 6.2, 12, 116, 121, "104%", "Balanced"],
            ["Line-02", "BG-2114", "Chain Attach", 7.8, 10, 77, 70, "91%", "Bottleneck"],
            ["Line-03", "BG-2133", "Zip Setting", 5.4, 11, 122, 124, "102%", "Balanced"]
        ]
    },
    hourlyOutput: {
        cols: ["Line", "Style Ref", "08-09", "09-10", "10-11", "11-12", "12-01", "Total", "Status"],
        qty: "Total",
        rows: [
            ["Line-01", "BG-2101", 58, 62, 65, 64, 60, 309, "On Pace"],
            ["Line-02", "BG-2114", 40, 38, 36, 41, 35, 190, "Behind"],
            ["Line-03", "BG-2133", 46, 50, 49, 52, 51, 248, "On Pace"]
        ]
    },
    manHours: {
        cols: ["Date", "Line", "Operators", "Hours Worked", "Overtime Hrs", "Output Qty", "Output / Man-Hr", "Status"],
        qty: "Output Qty",
        rows: [
            ["2026-10-26", "Line-01", 12, 96, 12, 680, 7.08, "Normal"],
            ["2026-10-26", "Line-02", 10, 80, 20, 395, 4.94, "High OT"],
            ["2026-10-26", "Line-03", 11, 88, 0, 512, 5.82, "Normal"]
        ]
    },
    kpiOverview: {
        cols: ["KPI", "Today", "Month To Date", "Target", "Variance", "Status"],
        rows: [
            ["Production Output (Pcs)", 1587, 31240, 34000, "-2,760", "Behind"],
            ["Orders Shipped", 1, 7, 8, "-1", "Behind"],
            ["Pending IRN (Items)", 6, "-", 0, "+6", "Action"],
            ["Overall Line Efficiency", "99%", "97%", "100%", "-3%", "Watch"]
        ]
    }
};

// id -> { family, only?: [status...], badge? }
// `only` keeps rows whose status (default column "Status") matches one of the values.
export const REPORT_SPECS = {
    // General
    r1: { family: "orderRegister", only: ["closed"] },
    r2: { family: "irnVsIssue" },
    r3: { family: "bomAmend" },
    r4: { family: "stdc" },
    r5: { family: "planCalendar" },
    r6: { family: "subcontractDc" },
    r7: { family: "sampleRegister" },
    r8: { family: "pipeline" },
    r9: { family: "pipeline", badge: "Pipeline V2 (sample data)" },
    r10: { family: "poRegister" },
    r11: { family: "styleMaster" },
    r12: { family: "stdc", only: ["pending", "in transit"] },
    r13: { family: "indentPoGrn" },
    r14: { family: "dcVsGrn" },
    r15: { family: "conversionDc" },
    // Costing
    r16: { family: "costing" },
    r17: { family: "costing", badge: "Style costing summary (sample data)" },
    // Purchase
    r18: { family: "reqToPo" },
    r19: { family: "poRegister", only: ["open", "approved"] },
    r20: { family: "poRegister" },
    r21: { family: "supplierAnalysis" },
    r22: { family: "grnInspection" },
    r23: { family: "purchaseReturn" },
    r24: { family: "rateCompare" },
    r25: { family: "poAmend" },
    r26: { family: "indentPoGrn" },
    r27: { family: "leadTime" },
    r28: { family: "poRegister", only: ["completed", "cancelled"] },
    r29: { family: "poRegister" },
    // Production
    r30: { family: "cuttingLog" },
    r31: { family: "lineOutputSize" },
    r32: { family: "dailyTarget" },
    r33: { family: "lineBalancing" },
    r34: { family: "hourlyOutput" },
    r35: { family: "tna" },
    r36: { family: "kpiOverview" },
    r37: { family: "manHours" },
    // Sample / Sales
    r38: { family: "sampleRegister" },
    r39: { family: "salesRegister" },
    r40: { family: "dispatchSummary" },
    r41: { family: "orderRegister" },
    r42: { family: "customerAging" },
    r43: { family: "orderRegister" },
    r44: { family: "salesRegister" },
    // Inventory
    r45: { family: "stockLedger" },
    r46: { family: "stockByLocation" },
    r47: { family: "fgStock" },
    r48: { family: "lowStock" },
    r49: { family: "grnRegister" },
    r50: { family: "itemIssue" },
    r51: { family: "floorReturn" },
    r52: { family: "rejection" },
    r53: { family: "stockConversion" },
    r54: { family: "stdc" },
    r55: { family: "stgrn" },
    r56: { family: "storeTransfer" },
    r57: { family: "gatePass" },
    r58: { family: "gatePassGrn" },
    r59: { family: "gateEntry" },
    r60: { family: "stockByLocation" },
    r61: { family: "valuation" },
    r62: { family: "stockLedger" },
    r63: { family: "stockAging", only: ["non-moving", "slow-moving"] },
    r64: { family: "physical" },
    r65: { family: "wipDept" },
    r66: { family: "wipCut" },
    r67: { family: "consumption" },
    r68: { family: "consumption", only: ["excess"] },
    r69: { family: "wastage" },
    r70: { family: "stockAging" },
    r71: { family: "deadStock" },
    r72: { family: "stdc", only: ["in transit"] },
    r73: { family: "stockAdjust" },
    r74: { family: "lowStock", only: ["negative"] },
    r75: { family: "stockLedger" },
    // Subcontract
    r76: { family: "subcontractDc" },
    r77: { family: "conversionDc" },
    r78: { family: "subcontractGrn" },
    r79: { family: "subcontractDc", only: ["in-progress", "material dispatched"] },
    // Material planning
    r80: { family: "mrp" },
    r81: { family: "bomVariance" },
    r82: { family: "allocation" },
    r83: { family: "mrp", only: ["shortage"] },
    r84: { family: "consumption" },
    // Inventory.Reports / Subcontract
    r85: { family: "stockByLocation" },
    r86: { family: "valuation" },
    r87: { family: "grnInspection" },
    r88: { family: "jobWorkBill" }
};

// Build { columns, rows, summary } for a report id, or null if it has no spec.
export function buildReportFromSpec(reportId) {
    const spec = REPORT_SPECS[reportId];
    if (!spec) return null;
    const fam = FAMILIES[spec.family];
    if (!fam) return null;

    const cols = fam.cols;
    const statusIdx = cols.indexOf(fam.statusCol || "Status");

    let raw = fam.rows;
    if (spec.only && statusIdx >= 0) {
        const wanted = spec.only.map((s) => s.toLowerCase());
        raw = raw.filter((r) => wanted.includes(String(r[statusIdx]).toLowerCase()));
    }

    const sumCol = (name) => {
        const i = cols.indexOf(name);
        return i < 0 ? null : raw.reduce((acc, r) => acc + (Number(r[i]) || 0), 0);
    };

    const rows = raw.map((r) => {
        const obj = {};
        cols.forEach((c, i) => {
            obj[c] = typeof r[i] === "number" ? IN(r[i]) : r[i];
        });
        return obj;
    });

    const qtySum = fam.qty ? sumCol(fam.qty) : null;
    const valSum = fam.val ? sumCol(fam.val) : null;

    return {
        columns: cols,
        rows,
        summary: {
            totalRecords: rows.length,
            totalQty: qtySum !== null ? IN(qtySum) : "—",
            totalVal: valSum !== null ? `₹ ${IN(valSum)}` : `${rows.length} entries`,
            badge: spec.badge || "Sample data (not linked to DB)"
        }
    };
}
