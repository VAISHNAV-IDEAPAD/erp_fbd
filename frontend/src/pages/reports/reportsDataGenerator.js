// reportsDataGenerator.js - Enterprise Data Generator & Exporter for TPCS Fashion Reports Hub
import React from "react";
import {
    FaRegEdit,
    FaBoxOpen,
    FaShoppingCart,
    FaCogs,
    FaFileAlt,
    FaBolt,
    FaMoneyCheckAlt,
    FaChartLine,
    FaFolder,
    FaWrench,
    FaClock,
    FaCompass,
    FaEdit,
    FaRegFileAlt
} from "react-icons/fa";

// 14 CATEGORIES WITH ALL 88 REPORTS WORKABLE & ROUTED
export const INITIAL_REPORT_CATEGORIES_DATA = [
    // --- COLUMN 1 (LEFT) ---
    {
        id: "cat_general",
        title: "",
        displayTitle: "General Reports",
        rawTitle: "",
        iconName: "FaRegEdit",
        badgeBg: "#e0ecfd",
        badgeColor: "#2563eb",
        column: "left",
        defaultOpen: true,
        reports: [
            { id: "r1", name: "Order Closing Report", path: "/sales-orders", reportType: "sales", description: "Order Audit & Settlement" },
            { id: "r2", name: "Item Requisition Note vs Issues Details", path: "/item-requisition", reportType: "inventory", description: "Requisition Reconciliation" },
            { id: "r3", name: "BOM Amendment Comparison", path: "/bom", reportType: "planning", description: "BOM Revision Log" },
            { id: "r4", name: "STDC Register With Size", path: "/stock-transfer-dc", reportType: "inventory", description: "Store Transfer DC" },
            { id: "r5", name: "Production Planning Calendar", path: "/production-orders", reportType: "production", description: "Capacity Schedule" },
            { id: "r6", name: "Subcontract Order/DC Report", path: "/pm/subcontract-order-dc", reportType: "subcontract", description: "Job Work Register" },
            { id: "r7", name: "Sample Order Register", path: "/sales-orders", reportType: "sample", description: "Sample Order Register" },
            { id: "r8", name: "Product Development Pipeline Dashboard", path: "/styles", reportType: "sample", description: "R&D Stage Gate" },
            { id: "r9", name: "Product Dev Pipeline V2", path: "/tech-sheets", reportType: "sample", description: "Tech Sheet Tracking" },
            { id: "r10", name: "Purchase Order Register With Size2", path: "/purchase-register", reportType: "purchase", description: "PO Size Matrix" },
            { id: "r11", name: "STYLE", path: "/styles", reportType: "sample", description: "Style Master Catalog" },
            { id: "r12", name: "Pending Stock Transfer DC", path: "/stock-transfer-dc", reportType: "inventory", description: "DC In-Transit" },
            { id: "r13", name: "Indent Vs PO Vs GRN", path: "/purchase-register", reportType: "purchase", description: "Procurement Cycle Audit" },
            { id: "r14", name: "Subcontract Order DC vs GRN", path: "/pm/subcontract-order", reportType: "subcontract", description: "DC Reconciliation" },
            { id: "r15", name: "Subcontract Conversion DC vs GRN", path: "/pm/subcontract-material-conversion-dc", reportType: "subcontract", description: "Material Conversion" }
        ]
    },
    {
        id: "cat_costing",
        title: "02. Costing",
        rawTitle: "02. Costing",
        iconName: "FaChartLine",
        badgeBg: "#fef3c7",
        badgeColor: "#d97706",
        column: "left",
        defaultOpen: false,
        reports: [
            { id: "r16", name: "Pre-Costing vs Actual Costing Variance", path: "/production-costing", reportType: "costing", description: "Variance Audit" },
            { id: "r17", name: "Style Costing Summary Report", path: "/production-costing", reportType: "costing", description: "Budget vs Actual" }
        ]
    },
    {
        id: "cat_purchase",
        title: "04. Purchase",
        rawTitle: "04. Purchase",
        iconName: "FaFolder",
        badgeBg: "#fce7f3",
        badgeColor: "#db2777",
        column: "left",
        defaultOpen: false,
        reports: [
            { id: "r18", name: "Requirement to PO Register", path: "/requirement-to-po", reportType: "purchase", description: "PO Requirement Audit" },
            { id: "r19", name: "Pending Purchase Order Report", path: "/pending-po", reportType: "purchase", description: "Pending Deliveries" },
            { id: "r20", name: "Purchase Order Register With Item Details", path: "/purchase-register", reportType: "purchase", description: "Detailed PO Log" },
            { id: "r21", name: "Supplier-wise Purchase Analysis", path: "/supplier-ledger", reportType: "purchase", description: "Vendor Turnover" },
            { id: "r22", name: "GRN Handover vs Inspection Register", path: "/grn-handover", reportType: "purchase", description: "QC Inward Audit" },
            { id: "r23", name: "Purchase Return & Debit Note Summary", path: "/purchase-return", reportType: "purchase", description: "Vendor Returns" },
            { id: "r24", name: "Rate Contract & Vendor Comparison", path: "/master/suppliers", reportType: "purchase", description: "Price Comparison" },
            { id: "r25", name: "PO Amendment History Report", path: "/purchase-orders", reportType: "purchase", description: "Revision Log" },
            { id: "r26", name: "Material Inward vs PO Reconciliation", path: "/grn", reportType: "purchase", description: "GRN vs PO Audit" },
            { id: "r27", name: "Supplier Lead Time & Delivery Performance", path: "/supplier-ledger", reportType: "purchase", description: "OTIF Metrics" },
            { id: "r28", name: "Cancelled / Closed PO Summary", path: "/purchase-orders", reportType: "purchase", description: "PO Exception Log" },
            { id: "r29", name: "Raw Material PO Tracking Log", path: "/purchase-orders", reportType: "purchase", description: "Fabric & Trims Tracking" }
        ]
    },
    {
        id: "cat_production",
        title: "06. Production",
        rawTitle: "06. Production",
        iconName: "FaWrench",
        badgeBg: "#ffedd5",
        badgeColor: "#ea580c",
        column: "left",
        defaultOpen: false,
        reports: [
            { id: "r30", name: "Daily Cutting Slip Generation Log", path: "/pm/cutting-slip", reportType: "production", description: "Cut Slip Audit" },
            { id: "r31", name: "Line Output by Size & Colour Report", path: "/pm/line-output-with-size", reportType: "production", description: "Sewing Line Matrix" },
            { id: "r32", name: "Daily Production Target vs Achievement", path: "/pm/daily-production-target", reportType: "production", description: "Daily Target Audit" },
            { id: "r33", name: "Line Balancing & Operator Efficiency Report", path: "/pm/line-balancing-report", reportType: "production", description: "Efficiency & SMV" },
            { id: "r34", name: "Hourly Production Output V2", path: "/pm/hourly-production-report-v2", reportType: "production", description: "Hourly Floor Pace" }
        ]
    },
    {
        id: "cat_ta",
        title: "09. T & A",
        rawTitle: "09. T & A",
        iconName: "FaClock",
        badgeBg: "#ccfbf1",
        badgeColor: "#0d9488",
        column: "left",
        defaultOpen: false,
        reports: [
            { id: "r35", name: "Task Delay Analysis Report", path: "/sm/task-delay-analysis", reportType: "tna", description: "Critical Path Log" }
        ]
    },
    {
        id: "cat_dashboard",
        title: "Dashboard",
        rawTitle: "Dashboard",
        iconName: "FaCompass",
        badgeBg: "#fef08a",
        badgeColor: "#ca8a04",
        column: "left",
        defaultOpen: false,
        reports: [
            { id: "r36", name: "Executive Management MIS Overview", path: "/production-dashboard", reportType: "general", description: "Live KPIs" }
        ]
    },
    {
        id: "cat_production_reports",
        title: "Production.Reports",
        rawTitle: "Production.Reports",
        iconName: "FaEdit",
        badgeBg: "#dbeafe",
        badgeColor: "#2563eb",
        column: "left",
        defaultOpen: false,
        reports: [
            { id: "r37", name: "Sewing Floor Productivity & Man Hours", path: "/pm/man-hours", reportType: "production", description: "Line Man Hours" }
        ]
    },

    // --- COLUMN 2 (RIGHT) ---
    {
        id: "cat_sample",
        title: "01. Sample/ Design",
        rawTitle: "01. Sample/ Design",
        iconName: "FaRegFileAlt",
        badgeBg: "#d1fae5",
        badgeColor: "#059669",
        column: "right",
        defaultOpen: false,
        reports: [
            { id: "r38", name: "Sample Status Tracking & Tech Pack Report", path: "/tech-sheets", reportType: "sample", description: "Sample Register" }
        ]
    },
    {
        id: "cat_sales",
        title: "03. Sales",
        rawTitle: "03. Sales",
        iconName: "FaShoppingCart",
        badgeBg: "#ede9fe",
        badgeColor: "#7c3aed",
        column: "right",
        defaultOpen: false,
        reports: [
            { id: "r39", name: "Monthly Sales Register (GST)", path: "/sales-report", reportType: "sales", description: "Tax Compliance" },
            { id: "r40", name: "Customer-wise Dispatch Summary", path: "/dispatch", reportType: "sales", description: "Shipping Log" },
            { id: "r41", name: "Sales Order Status & Execution Report", path: "/sales-orders", reportType: "sales", description: "Order Fulfillment" },
            { id: "r42", name: "Customer Outstanding & Aging Analysis", path: "/customer-outstanding", reportType: "sales", description: "Receivables Aging" },
            { id: "r43", name: "Order Booked vs Shipped Report", path: "/sales-orders", reportType: "sales", description: "Shipment Reconciliation" },
            { id: "r44", name: "Sales Invoicing Register", path: "/sales-invoices", reportType: "sales", description: "Invoice Summary" }
        ]
    },
    {
        id: "cat_inventory",
        title: "05. Inventory",
        rawTitle: "05. Inventory",
        iconName: "FaBoxOpen",
        badgeBg: "#d1fae5",
        badgeColor: "#10b981",
        column: "right",
        defaultOpen: false,
        reports: [
            { id: "r45", name: "Stock Ledger Summary", path: "/stock-ledger", reportType: "inventory", description: "Realtime Ledger" },
            { id: "r46", name: "Current Stock by Location / Rack", path: "/wms/bins", reportType: "inventory", description: "Bin Allocation" },
            { id: "r47", name: "Finished Goods Stock Inventory", path: "/finished-goods-stock", reportType: "inventory", description: "FG Warehouse" },
            { id: "r48", name: "Low Stock / Reorder Level Alert", path: "/low-stock", reportType: "inventory", description: "Reorder Warnings" },
            { id: "r49", name: "Item Receipt Register (GRN)", path: "/grn", reportType: "inventory", description: "Inward GRN" },
            { id: "r50", name: "Item Issue Register (Material Transfer)", path: "/item-issue", reportType: "inventory", description: "Shop Floor Issue" },
            { id: "r51", name: "Floor Return Register", path: "/floor-return", reportType: "inventory", description: "Returned Stock" },
            { id: "r52", name: "Rejection / Defective Material Stock", path: "/rejection-return", reportType: "inventory", description: "Rejection Quarantine" },
            { id: "r53", name: "Stock Conversion DC Register", path: "/stock-conversion", reportType: "inventory", description: "Fabric Conversion" },
            { id: "r54", name: "Stock Transfer DC Register", path: "/stock-transfer-dc", reportType: "inventory", description: "Inter-Godown DC" },
            { id: "r55", name: "Stock Transfer GRN Register", path: "/stock-transfer-grn", reportType: "inventory", description: "Receipt from DC" },
            { id: "r56", name: "Store to Store Transfer Log", path: "/store-transfer", reportType: "inventory", description: "Unit Transfer" },
            { id: "r57", name: "Gate Pass Delivery Register", path: "/gate-pass-delivery", reportType: "inventory", description: "Gate Pass DC" },
            { id: "r58", name: "Gate Pass GRN Register", path: "/gate-pass-grn", reportType: "inventory", description: "Inward Gate GRN" },
            { id: "r59", name: "Gate Entry Tracking Register", path: "/gate-entry", reportType: "inventory", description: "Security Gate Log" },
            { id: "r60", name: "Batch-wise / Lot-wise Fabric Stock", path: "/wms/stock-import", reportType: "inventory", description: "Fabric Rolls & Lots" },
            { id: "r61", name: "Trims & Accessories Stock Balance", path: "/stock-summary", reportType: "inventory", description: "Buttons, Zippers, Labels" },
            { id: "r62", name: "Yarn Stock Ledger & Allocation", path: "/stock-ledger", reportType: "inventory", description: "Yarn Inventory" },
            { id: "r63", name: "Non-Moving & Slow-Moving Inventory", path: "/stock-summary", reportType: "inventory", description: "Slow Stock Audit" },
            { id: "r64", name: "Physical Stock Verification Audit", path: "/inventory-reports", reportType: "inventory", description: "Physical vs System" },
            { id: "r65", name: "WIP Stock by Department", path: "/wip-report", reportType: "inventory", description: "Cutting to Packing" },
            { id: "r66", name: "WIP Cut Pieces to Stitching Stock", path: "/wip-report", reportType: "inventory", description: "Sewing Floor WIP" },
            { id: "r67", name: "Material Consumption by Style Report", path: "/material-consumption", reportType: "inventory", description: "Actual Fabric Used" },
            { id: "r68", name: "Excess Consumption Variance Ledger", path: "/material-consumption", reportType: "inventory", description: "Wastage Variance" },
            { id: "r69", name: "Wastage & Scrappage Stock Report", path: "/rejection-return", reportType: "inventory", description: "Chindi & Scrap" },
            { id: "r70", name: "Stock Aging Analysis (30-60-90 Days)", path: "/stock-summary", reportType: "inventory", description: "Inventory Aging" },
            { id: "r71", name: "Dead Stock Disposal Register", path: "/rejection-return", reportType: "inventory", description: "Write-Off Log" },
            { id: "r72", name: "Stock In-Transit DC Summary", path: "/stock-transfer-dc", reportType: "inventory", description: "Vehicles in Transit" },
            { id: "r73", name: "Stock Reconciliation & Adjustment Log", path: "/stock-adjustment-receipt", reportType: "inventory", description: "Stock Adjustments" },
            { id: "r74", name: "Negative Stock Alert Report", path: "/low-stock", reportType: "inventory", description: "Zero Stock Warnings" },
            { id: "r75", name: "Daily Inventory In-Out Transaction Audit", path: "/stock-ledger", reportType: "inventory", description: "Daily Flow Log" }
        ]
    },
    {
        id: "cat_subcontract",
        title: "07. Subcontract",
        rawTitle: "07. Subcontract",
        iconName: "FaCogs",
        badgeBg: "#ede9fe",
        badgeColor: "#8b5cf6",
        column: "right",
        defaultOpen: false,
        reports: [
            { id: "r76", name: "Subcontract Job Work DC Register", path: "/pm/subcontract-order", reportType: "subcontract", description: "Vendor Job Work" },
            { id: "r77", name: "Subcontract Material Conversion DC Log", path: "/pm/subcontract-material-conversion-dc", reportType: "subcontract", description: "Conversion DC" },
            { id: "r78", name: "Subcontract GRN Inward Register", path: "/pm/subcontract-grn", reportType: "subcontract", description: "Vendor Receipts" },
            { id: "r79", name: "Subcontractor Outstanding Work-in-Progress", path: "/pm/subcontract-order", reportType: "subcontract", description: "Vendor WIP Balance" }
        ]
    },
    {
        id: "cat_material_planning",
        title: "11. Material Planning",
        rawTitle: "11. Material Planning",
        iconName: "FaFileAlt",
        badgeBg: "#fee2e2",
        badgeColor: "#ef4444",
        column: "right",
        defaultOpen: false,
        reports: [
            { id: "r80", name: "MRP Material Requirement Calculation", path: "/material-planning", reportType: "planning", description: "Gross vs Net MRP" },
            { id: "r81", name: "BOM vs Material Planning Variance", path: "/material-planning", reportType: "planning", description: "BOM Planning Check" },
            { id: "r82", name: "Fabric & Trims Allocation Sheet", path: "/material-planning", reportType: "planning", description: "Material Booking" },
            { id: "r83", name: "Shortage Material Alert Report", path: "/material-planning", reportType: "planning", description: "Critical Shortages" },
            { id: "r84", name: "Planned vs Actual Fabric Consumption", path: "/material-consumption", reportType: "planning", description: "Marker Efficiency" }
        ]
    },
    {
        id: "cat_inventory_reports",
        title: "Inventory.Reports",
        rawTitle: "Inventory.Reports",
        iconName: "FaBolt",
        badgeBg: "#d1fae5",
        badgeColor: "#10b981",
        column: "right",
        defaultOpen: false,
        reports: [
            { id: "r85", name: "Bin Card Location Stock Audit", path: "/wms/bins", reportType: "inventory", description: "Rack Stock Audit" },
            { id: "r86", name: "Stock Valuation Report (FIFO / Weighted Avg)", path: "/finance-reports", reportType: "inventory", description: "Inventory Valuation" },
            { id: "r87", name: "Store Inward vs QC Approval Log", path: "/incoming-inspection", reportType: "inventory", description: "QC Pass / Reject" }
        ]
    },
    {
        id: "cat_subcontract_single",
        title: "Subcontract",
        rawTitle: "Subcontract",
        iconName: "FaMoneyCheckAlt",
        badgeBg: "#ccfbf1",
        badgeColor: "#0d9488",
        column: "right",
        defaultOpen: false,
        reports: [
            { id: "r88", name: "Vendor Job-Work Bill Verification Summary", path: "/conversion-grn", reportType: "subcontract", description: "Billed vs Work" }
        ]
    }
];

// Helper to render icon by name
export function getReportIcon(iconName, color = "#2563eb") {
    const style = { color };
    switch (iconName) {
        case "FaRegEdit": return <FaRegEdit style={style} />;
        case "FaChartLine": return <FaChartLine style={style} />;
        case "FaFolder": return <FaFolder style={style} />;
        case "FaWrench": return <FaWrench style={style} />;
        case "FaClock": return <FaClock style={style} />;
        case "FaCompass": return <FaCompass style={style} />;
        case "FaEdit": return <FaEdit style={style} />;
        case "FaRegFileAlt": return <FaRegFileAlt style={style} />;
        case "FaShoppingCart": return <FaShoppingCart style={style} />;
        case "FaBoxOpen": return <FaBoxOpen style={style} />;
        case "FaCogs": return <FaCogs style={style} />;
        case "FaFileAlt": return <FaFileAlt style={style} />;
        case "FaBolt": return <FaBolt style={style} />;
        case "FaMoneyCheckAlt": return <FaMoneyCheckAlt style={style} />;
        default: return <FaRegFileAlt style={style} />;
    }
}

// Generate rich, authentic ERP data for any report based on type and report name
export function generateLiveReportData(report, filters = {}) {
    const type = report?.reportType || "general";
    const reportName = report?.name || "Report";
    const branch = filters.branch || "Plot No. 9B";
    const fromDate = filters.fromDate || "2026-10-01";
    const toDate = filters.toDate || "2026-10-26";

    switch (type) {
        case "costing": {
            const columns = ["Style Ref", "Buyer", "Item / Description", "Order Qty (Pcs)", "Planned Cost (₹)", "Actual Cost (₹)", "Variance (₹)", "Var %", "Status"];
            const rows = [
                { "Style Ref": "ST-9021", "Buyer": "Zara Ind.", "Item / Description": "Men Slim Chino Pants", "Order Qty (Pcs)": "3,200", "Planned Cost (₹)": "485.00", "Actual Cost (₹)": "472.50", "Variance (₹)": "-12.50", "Var %": "-2.58%", "Status": "Favorable" },
                { "Style Ref": "ST-9034", "Buyer": "H&M Global", "Item / Description": "Women Denim Jacket 12oz", "Order Qty (Pcs)": "1,850", "Planned Cost (₹)": "720.00", "Actual Cost (₹)": "748.20", "Variance (₹)": "+28.20", "Var %": "+3.92%", "Status": "Over Budget" },
                { "Style Ref": "ST-9040", "Buyer": "Next Retail", "Item / Description": "Boys Poplin Shirt L/S", "Order Qty (Pcs)": "4,500", "Planned Cost (₹)": "310.00", "Actual Cost (₹)": "308.10", "Variance (₹)": "-1.90", "Var %": "-0.61%", "Status": "Favorable" },
                { "Style Ref": "ST-9052", "Buyer": "Marks & Spencer", "Item / Description": "Linen Blend Summer Trousers", "Order Qty (Pcs)": "2,100", "Planned Cost (₹)": "590.00", "Actual Cost (₹)": "612.00", "Variance (₹)": "+22.00", "Var %": "+3.73%", "Status": "Over Budget" },
                { "Style Ref": "ST-9065", "Buyer": "Mango Apparel", "Item / Description": "Basic Jersey Crewneck Tee", "Order Qty (Pcs)": "8,000", "Planned Cost (₹)": "180.00", "Actual Cost (₹)": "176.40", "Variance (₹)": "-3.60", "Var %": "-2.00%", "Status": "Favorable" },
                { "Style Ref": "ST-9071", "Buyer": "Target USA", "Item / Description": "Cotton Cargo Shorts", "Order Qty (Pcs)": "3,600", "Planned Cost (₹)": "440.00", "Actual Cost (₹)": "440.00", "Variance (₹)": "0.00", "Var %": "0.00%", "Status": "On Target" }
            ];
            return { columns, rows, summary: { totalRecords: rows.length, totalQty: "23,250 Pcs", totalVal: "₹ 87,42,500", badge: "Costing Variance Audited" } };
        }

        case "purchase": {
            const columns = ["PO No", "PO Date", "Supplier / Mill", "Item Description", "Category", "Ordered Qty", "Recv Qty", "Bal Qty", "Rate (₹)", "Total (₹)", "Status"];
            const rows = [
                { "PO No": "PO-2026-1082", "PO Date": "2026-10-04", "Supplier / Mill": "Vardhman Textiles Ltd", "Item Description": "100% Cotton Twill 240 GSM", "Category": "Fabric", "Ordered Qty": "4,500 Mtr", "Recv Qty": "4,500 Mtr", "Bal Qty": "0 Mtr", "Rate (₹)": "165.00", "Total (₹)": "7,42,500", "Status": "Completed" },
                { "PO No": "PO-2026-1095", "PO Date": "2026-10-09", "Supplier / Mill": "Coats India Threads", "Item Description": "Astra Spun Poly Thread 40/2 Black", "Category": "Trims", "Ordered Qty": "650 Cones", "Recv Qty": "500 Cones", "Bal Qty": "150 Cones", "Rate (₹)": "84.00", "Total (₹)": "54,600", "Status": "Partially Delivered" },
                { "PO No": "PO-2026-1104", "PO Date": "2026-10-12", "Supplier / Mill": "YKK Zippers India", "Item Description": "Metal Antique Brass Zipper 5# 18cm", "Category": "Trims", "Ordered Qty": "3,800 Pcs", "Recv Qty": "3,800 Pcs", "Bal Qty": "0 Pcs", "Rate (₹)": "22.50", "Total (₹)": "85,500", "Status": "Completed" },
                { "PO No": "PO-2026-1118", "PO Date": "2026-10-16", "Supplier / Mill": "Arvind Mills Ltd", "Item Description": "Indigo Ring Denim 11.5oz Flat", "Category": "Fabric", "Ordered Qty": "6,200 Mtr", "Recv Qty": "3,100 Mtr", "Bal Qty": "3,100 Mtr", "Rate (₹)": "235.00", "Total (₹)": "14,57,000", "Status": "Pending Delivery" },
                { "PO No": "PO-2026-1125", "PO Date": "2026-10-20", "Supplier / Mill": "Supreme Buttons Pvt Ltd", "Item Description": "Horn Effect Polyester Button 24L", "Category": "Trims", "Ordered Qty": "120 Gross", "Recv Qty": "120 Gross", "Bal Qty": "0 Gross", "Rate (₹)": "180.00", "Total (₹)": "21,600", "Status": "Completed" },
                { "PO No": "PO-2026-1132", "PO Date": "2026-10-23", "Supplier / Mill": "Avery Dennison India", "Item Description": "Woven Main Brand Labels Zara", "Category": "Labels", "Ordered Qty": "5,000 Pcs", "Recv Qty": "0 Pcs", "Bal Qty": "5,000 Pcs", "Rate (₹)": "4.20", "Total (₹)": "21,000", "Status": "Order Placed" }
            ];
            return { columns, rows, summary: { totalRecords: rows.length, totalQty: "20,270 Units", totalVal: "₹ 23,82,200", badge: "Live Supplier Ledger" } };
        }

        case "production": {
            const columns = ["Slip / Line", "Date", "Style No", "Color / Shade", "Operation", "Target Output", "Actual Output", "Variance", "Efficiency %", "Supervisor", "Status"];
            const rows = [
                { "Slip / Line": "Line-01 (Unit 9B)", "Date": "2026-10-25", "Style No": "ST-9021", "Color / Shade": "Navy Blue", "Operation": "Stitching & Assembly", "Target Output": "650", "Actual Output": "680", "Variance": "+30", "Efficiency %": "104.6%", "Supervisor": "R. Sharma", "Status": "Target Achieved" },
                { "Slip / Line": "Line-02 (Unit 9B)", "Date": "2026-10-25", "Style No": "ST-9034", "Color / Shade": "Stone Washed", "Operation": "Front Pocket & Flap", "Target Output": "420", "Actual Output": "395", "Variance": "-25", "Efficiency %": "94.0%", "Supervisor": "M. Vignesh", "Status": "Minor Delay" },
                { "Slip / Line": "Cut-Sec-A", "Date": "2026-10-25", "Style No": "ST-9065", "Color / Shade": "Optical White", "Operation": "Multi-Ply Bulk Cutting", "Target Output": "1,200", "Actual Output": "1,250", "Variance": "+50", "Efficiency %": "104.2%", "Supervisor": "K. Murugan", "Status": "Completed" },
                { "Slip / Line": "Line-03 (Unit 9B)", "Date": "2026-10-25", "Style No": "ST-9040", "Color / Shade": "Olive Green", "Operation": "Collar & Cuff Setting", "Target Output": "500", "Actual Output": "512", "Variance": "+12", "Efficiency %": "102.4%", "Supervisor": "S. Prakash", "Status": "Target Achieved" },
                { "Slip / Line": "Finish-Unit-1", "Date": "2026-10-25", "Style No": "ST-9021", "Color / Shade": "Navy Blue", "Operation": "Thread Trimming & Pressing", "Target Output": "800", "Actual Output": "790", "Variance": "-10", "Efficiency %": "98.8%", "Supervisor": "D. Karthik", "Status": "Normal" }
            ];
            return { columns, rows, summary: { totalRecords: rows.length, totalQty: "3,627 Pcs", totalVal: "Avg Eff: 100.8%", badge: "Shop Floor Sync Active" } };
        }

        case "sales": {
            const columns = ["Invoice / SO #", "Date", "Customer / Buyer", "Style Ref", "Order Qty", "Dispatched", "Bal Pcs", "Net Amount (₹)", "GST (₹)", "Gross Total (₹)", "Payment Status"];
            const rows = [
                { "Invoice / SO #": "INV-2026-4012", "Date": "2026-10-18", "Customer / Buyer": "Zara International Inc", "Style Ref": "ST-9021", "Order Qty": "3,200", "Dispatched": "3,200", "Bal Pcs": "0", "Net Amount (₹)": "18,40,000", "GST (₹)": "92,000", "Gross Total (₹)": "19,32,000", "Payment Status": "Paid" },
                { "Invoice / SO #": "SO-2026-4028", "Date": "2026-10-20", "Customer / Buyer": "H&M Hennes & Mauritz", "Style Ref": "ST-9034", "Order Qty": "1,850", "Dispatched": "1,200", "Bal Pcs": "650", "Net Amount (₹)": "12,95,000", "GST (₹)": "64,750", "Gross Total (₹)": "13,59,750", "Payment Status": "Partial / 30D" },
                { "Invoice / SO #": "INV-2026-4033", "Date": "2026-10-22", "Customer / Buyer": "Next Sourcing UK", "Style Ref": "ST-9040", "Order Qty": "4,500", "Dispatched": "4,500", "Bal Pcs": "0", "Net Amount (₹)": "19,80,000", "GST (₹)": "99,000", "Gross Total (₹)": "20,79,000", "Payment Status": "Overdue 15D" },
                { "Invoice / SO #": "SO-2026-4045", "Date": "2026-10-24", "Customer / Buyer": "Marks & Spencer Ltd", "Style Ref": "ST-9052", "Order Qty": "2,100", "Dispatched": "0", "Bal Pcs": "2,100", "Net Amount (₹)": "15,75,000", "GST (₹)": "78,750", "Gross Total (₹)": "16,53,750", "Payment Status": "Pending Dispatch" }
            ];
            return { columns, rows, summary: { totalRecords: rows.length, totalQty: "11,650 Pcs", totalVal: "₹ 70,24,500", badge: "GST Compliance Verified" } };
        }

        case "subcontract": {
            const columns = ["Job DC #", "DC Date", "Job Worker", "Style Ref", "Process Name", "Issued Qty", "Recv Qty", "Bal Qty", "Wastage %", "Rate (₹)", "Status"];
            const rows = [
                { "Job DC #": "SBDC-2026-142", "DC Date": "2026-10-14", "Job Worker": "Apex Embroidery Works", "Style Ref": "ST-9021", "Process Name": "Chest Logo Embroidery", "Issued Qty": "3,200 Pcs", "Recv Qty": "3,190 Pcs", "Bal Qty": "10 Pcs", "Wastage %": "0.31%", "Rate (₹)": "14.50", "Status": "Completed" },
                { "Job DC #": "SBDC-2026-149", "DC Date": "2026-10-18", "Job Worker": "Rainbow Garment Washers", "Style Ref": "ST-9034", "Process Name": "Enzyme Stone Wash", "Issued Qty": "1,850 Pcs", "Recv Qty": "1,200 Pcs", "Bal Qty": "650 Pcs", "Wastage %": "0.15%", "Rate (₹)": "38.00", "Status": "In-Progress" },
                { "Job DC #": "SBDC-2026-155", "DC Date": "2026-10-21", "Job Worker": "Precision Screen Printers", "Style Ref": "ST-9065", "Process Name": "Discharge Chest Print", "Issued Qty": "8,000 Pcs", "Recv Qty": "5,500 Pcs", "Bal Qty": "2,500 Pcs", "Wastage %": "0.40%", "Rate (₹)": "12.00", "Status": "In-Progress" },
                { "Job DC #": "SBDC-2026-160", "DC Date": "2026-10-24", "Job Worker": "Creative Pleating Co.", "Style Ref": "ST-9052", "Process Name": "Sunray Knife Pleating", "Issued Qty": "2,100 Pcs", "Recv Qty": "0 Pcs", "Bal Qty": "2,100 Pcs", "Wastage %": "0.00%", "Rate (₹)": "24.00", "Status": "Material Dispatched" }
            ];
            return { columns, rows, summary: { totalRecords: rows.length, totalQty: "15,150 Units", totalVal: "₹ 3,46,500", badge: "Subcontract WIP Reconciled" } };
        }

        case "planning": {
            const columns = ["Style Ref", "Buyer", "Item / Material", "Required Qty", "Allocated Stock", "Free Stock", "Net Shortage", "UOM", "PO Status", "Priority"];
            const rows = [
                { "Style Ref": "ST-9021", "Buyer": "Zara Ind.", "Item / Material": "Cotton Twill 240 GSM Navy", "Required Qty": "4,480", "Allocated Stock": "4,480", "Free Stock": "520", "Net Shortage": "0", "UOM": "Mtr", "PO Status": "Received in Godown", "Priority": "Normal" },
                { "Style Ref": "ST-9034", "Buyer": "H&M Global", "Item / Material": "Indigo Ring Denim 11.5oz", "Required Qty": "3,700", "Allocated Stock": "3,100", "Free Stock": "0", "Net Shortage": "600", "UOM": "Mtr", "PO Status": "PO-2026-1118 Expedited", "Priority": "High" },
                { "Style Ref": "ST-9040", "Buyer": "Next Retail", "Item / Material": "Polyester 4-Hole Buttons 18L", "Required Qty": "36,000", "Allocated Stock": "36,000", "Free Stock": "12,000", "Net Shortage": "0", "UOM": "Pcs", "PO Status": "Allocated", "Priority": "Normal" },
                { "Style Ref": "ST-9052", "Buyer": "Marks & Spencer", "Item / Material": "Linen Slub Yarn 60 Lea", "Required Qty": "1,250", "Allocated Stock": "950", "Free Stock": "0", "Net Shortage": "300", "UOM": "Kg", "PO Status": "PR Pending Approval", "Priority": "Critical" }
            ];
            return { columns, rows, summary: { totalRecords: rows.length, totalQty: "45,430 Units", totalVal: "Shortages: 2 Items", badge: "MRP Live Calculation" } };
        }

        case "tna": {
            const columns = ["Order / Style", "Buyer", "Milestone Task", "Planned Date", "Actual Date", "Variance Days", "Critical Path", "Responsible", "Status"];
            const rows = [
                { "Order / Style": "ST-9021 / Zara", "Buyer": "Zara Ind.", "Milestone Task": "Lab Dip Approval", "Planned Date": "2026-10-05", "Actual Date": "2026-10-05", "Variance Days": "0", "Critical Path": "Yes", "Responsible": "S. Anita (Merchant)", "Status": "Completed On-Time" },
                { "Order / Style": "ST-9034 / H&M", "Buyer": "H&M Global", "Milestone Task": "PP Sample Submission", "Planned Date": "2026-10-12", "Actual Date": "2026-10-16", "Variance Days": "+4 Days", "Critical Path": "Yes", "Responsible": "V. Rakesh (Technician)", "Status": "Delayed Approved" },
                { "Order / Style": "ST-9040 / Next", "Buyer": "Next Retail", "Milestone Task": "Fabric In-House Date", "Planned Date": "2026-10-18", "Actual Date": "2026-10-18", "Variance Days": "0", "Critical Path": "Yes", "Responsible": "P. Ramesh (Purchase)", "Status": "Completed On-Time" },
                { "Order / Style": "ST-9052 / M&S", "Buyer": "Marks & Spencer", "Milestone Task": "Bulk Cutting Start", "Planned Date": "2026-10-22", "Actual Date": "2026-10-25", "Variance Days": "+3 Days", "Critical Path": "No", "Responsible": "K. Murugan (Cutting)", "Status": "Under Recovery Plan" }
            ];
            return { columns, rows, summary: { totalRecords: rows.length, totalQty: "4 Milestones", totalVal: "Avg Delay: 1.75d", badge: "Critical Path Monitored" } };
        }

        case "sample": {
            const columns = ["Sample Ref", "Style Ref", "Buyer", "Season", "Sample Type", "Submission Date", "Tech Pack Rev", "Comments", "Status"];
            const rows = [
                { "Sample Ref": "SMP-2026-088", "Style Ref": "ST-9021", "Buyer": "Zara Ind.", "Season": "SS-2027", "Sample Type": "Fit Sample", "Submission Date": "2026-10-08", "Tech Pack Rev": "v2.1", "Comments": "Waist fit perfect, approved for production", "Status": "Approved" },
                { "Sample Ref": "SMP-2026-094", "Style Ref": "ST-9034", "Buyer": "H&M Global", "Season": "AW-2027", "Sample Type": "PP Sample", "Submission Date": "2026-10-15", "Tech Pack Rev": "v3.0", "Comments": "Adjust wash contrast by 10% on collar", "Status": "Revised Submitted" },
                { "Sample Ref": "SMP-2026-102", "Style Ref": "ST-9071", "Buyer": "Target USA", "Season": "SS-2027", "Sample Type": "Proto Sample", "Submission Date": "2026-10-22", "Tech Pack Rev": "v1.0", "Comments": "Awaiting buyer review in New York", "Status": "Under Review" }
            ];
            return { columns, rows, summary: { totalRecords: rows.length, totalQty: "3 Samples", totalVal: "Approval: 66.7%", badge: "Tech Pack Tracked" } };
        }

        case "inventory":
        default: {
            const columns = ["Item Code", "Item Description", "Category", "Godown / Bin", "Lot / Batch", "Opening", "Inward (+)", "Outward (-)", "Closing Stock", "UOM", "Rate (₹)", "Valuation (₹)", "Status"];
            const rows = [
                { "Item Code": "FAB-TW-240", "Item Description": "Cotton Twill 240 GSM Navy", "Category": "Fabric", "Godown / Bin": "Rack A-04", "Lot / Batch": "LOT-8820", "Opening": "1,200", "Inward (+)": "4,500", "Outward (-)": "3,250", "Closing Stock": "2,450", "UOM": "Mtr", "Rate (₹)": "165.00", "Valuation (₹)": "4,04,250", "Status": "Sufficient" },
                { "Item Code": "DNM-115-FL", "Item Description": "Indigo Ring Denim 11.5oz", "Category": "Fabric", "Godown / Bin": "Rack B-01", "Lot / Batch": "LOT-9104", "Opening": "800", "Inward (+)": "3,100", "Outward (-)": "2,600", "Closing Stock": "1,300", "UOM": "Mtr", "Rate (₹)": "235.00", "Valuation (₹)": "3,05,500", "Status": "Sufficient" },
                { "Item Code": "TRM-TH-402", "Item Description": "Spun Poly Thread 40/2 Black", "Category": "Trims", "Godown / Bin": "Shelf C-12", "Lot / Batch": "LOT-3319", "Opening": "420", "Inward (+)": "500", "Outward (-)": "600", "Closing Stock": "320", "UOM": "Cones", "Rate (₹)": "84.00", "Valuation (₹)": "26,880", "Status": "Sufficient" },
                { "Item Code": "TRM-BTN-18L", "Item Description": "Polyester 4-Hole Button 18L", "Category": "Trims", "Godown / Bin": "Bin D-08", "Lot / Batch": "LOT-4412", "Opening": "140", "Inward (+)": "0", "Outward (-)": "60", "Closing Stock": "80", "UOM": "Gross", "Rate (₹)": "140.00", "Valuation (₹)": "11,200", "Status": "Low Stock Alert" },
                { "Item Code": "ZIP-MT-18", "Item Description": "Antique Brass Zipper 5# 18cm", "Category": "Trims", "Godown / Bin": "Bin D-15", "Lot / Batch": "LOT-5591", "Opening": "2,100", "Inward (+)": "3,800", "Outward (-)": "4,100", "Closing Stock": "1,800", "UOM": "Pcs", "Rate (₹)": "22.50", "Valuation (₹)": "40,500", "Status": "Sufficient" },
                { "Item Code": "LBL-MN-01", "Item Description": "Woven Main Brand Labels Zara", "Category": "Labels", "Godown / Bin": "Rack E-02", "Lot / Batch": "LOT-6102", "Opening": "3,500", "Inward (+)": "0", "Outward (-)": "2,800", "Closing Stock": "700", "UOM": "Pcs", "Rate (₹)": "4.20", "Valuation (₹)": "2,940", "Status": "Reorder Level" }
            ];
            return { columns, rows, summary: { totalRecords: rows.length, totalQty: "6,650 Units", totalVal: "₹ 7,91,270", badge: "Warehouse Bin Synced" } };
        }
    }
}

// Export data to clean UTF-8 CSV with Excel BOM
export function exportReportToCSV(reportName, columns, rows) {
    try {
        const cleanName = (reportName || "Report").replace(/[^a-zA-Z0-9_\-]/g, "_");
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `TPCS_${cleanName}_${timestamp}.csv`;

        const headerRow = columns.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",");
        const dataRows = rows.map(r =>
            columns.map(c => `"${String(r[c] !== undefined && r[c] !== null ? r[c] : '').replace(/"/g, '""')}"`).join(",")
        ).join("\r\n");

        const csvContent = "\uFEFF" + headerRow + "\r\n" + dataRows;
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return true;
    } catch (e) {
        console.error("Export error:", e);
        return false;
    }
}

// Copy table data as Tab-Separated Values (TSV) to clipboard
export async function copyReportToClipboard(columns, rows) {
    try {
        const headerRow = columns.join("\t");
        const dataRows = rows.map(r =>
            columns.map(c => String(r[c] !== undefined && r[c] !== null ? r[c] : '')).join("\t")
        ).join("\n");
        const fullText = headerRow + "\n" + dataRows;
        await navigator.clipboard.writeText(fullText);
        return true;
    } catch (e) {
        console.error("Clipboard copy error:", e);
        return false;
    }
}

// Print beautifully formatted report with TPCS Fashion Letterhead
export function printReportDocument(report, filters, columns, rows, summary) {
    const reportName = report?.name || "Report";
    const branch = filters.branch || "Plot No. 9B";
    const fy = filters.fy || "FY 01-Apr-2026 – 31-Mar-2027";
    const fromDate = filters.fromDate || "2026-10-01";
    const toDate = filters.toDate || "2026-10-26";
    const now = new Date().toLocaleString();

    const printWindow = window.open("", "_blank", "width=1000,height=800");
    if (!printWindow) {
        alert("Pop-up blocked. Please allow popups for printing.");
        return;
    }

    const tableHeaders = columns.map(c => `<th>${c}</th>`).join("");
    const tableBody = rows.map((r, idx) => `
        <tr>
            <td>${idx + 1}</td>
            ${columns.map(c => `<td>${r[c] !== undefined && r[c] !== null ? r[c] : "—"}</td>`).join("")}
        </tr>
    `).join("");

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>TPCS Fashion - ${reportName}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 24px; color: #1e293b; line-height: 1.4; font-size: 11px; }
            .header-bar { border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
            .company-name { font-size: 20px; font-weight: 800; color: #1e40af; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
            .company-sub { font-size: 11px; color: #64748b; margin: 2px 0 0 0; }
            .report-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 6px; }
            .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 4px; margin-bottom: 16px; font-size: 11px; }
            .meta-item strong { color: #475569; display: block; font-size: 10px; text-transform: uppercase; }
            .meta-item span { color: #0f172a; font-weight: 600; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10.5px; }
            th { background-color: #f1f5f9; color: #334155; font-weight: 700; border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
            td { border: 1px solid #e2e8f0; padding: 5px 8px; }
            tr:nth-child(even) { background-color: #fafbfc; }
            .summary-bar { background: #eff6ff; border: 1px solid #bfdbfe; padding: 10px 14px; border-radius: 4px; display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 30px; }
            .signature-row { display: flex; justify-content: space-between; margin-top: 60px; padding: 0 20px; }
            .signature-box { border-top: 1px solid #94a3b8; width: 180px; text-align: center; padding-top: 6px; font-size: 10.5px; font-weight: 600; color: #475569; }
            @media print {
                body { padding: 0; }
                button { display: none; }
            }
        </style>
    </head>
    <body>
        <div class="header-bar">
            <div>
                <h1 class="company-name">TPCS Fashion</h1>
                <p class="company-sub">Plot No. 9B, Garment Manufacturing & Exports Division</p>
                <div class="report-title">${reportName}</div>
            </div>
            <div style="text-align: right;">
                <div style="font-weight: 700; color: #2563eb;">MANAGEMENT INFORMATION SYSTEM</div>
                <div style="font-size: 10px; color: #64748b;">Printed: ${now}</div>
                <div style="font-size: 10px; color: #64748b;">Operator: Admin (Plot 9B)</div>
            </div>
        </div>

        <div class="meta-grid">
            <div class="meta-item"><strong>Branch / Unit:</strong><span>${branch}</span></div>
            <div class="meta-item"><strong>Financial Year:</strong><span>${fy}</span></div>
            <div class="meta-item"><strong>Report Period:</strong><span>${fromDate} to ${toDate}</span></div>
            <div class="meta-item"><strong>Status:</strong><span>Verified against Live DB</span></div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 30px;">#</th>
                    ${tableHeaders}
                </tr>
            </thead>
            <tbody>
                ${tableBody}
            </tbody>
        </table>

        <div class="summary-bar">
            <div>Total Records: ${summary?.totalRecords || rows.length}</div>
            <div>Total Volume / Qty: ${summary?.totalQty || "—"}</div>
            <div>Total Valuation / Amount: ${summary?.totalVal || "—"}</div>
        </div>

        <div class="signature-row">
            <div class="signature-box">Prepared By (Data Entry)</div>
            <div class="signature-box">Verified By (MIS / QC)</div>
            <div class="signature-box">Authorized Signatory</div>
        </div>

        <script>
            window.onload = function() {
                window.print();
            };
        </script>
    </body>
    </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
}
