// Comprehensive registry of all screens/modules in TPCS Fashion ERP
// Used by the ScreenSearchBar and Workspace Quick Launchers

export const ERP_SCREENS = [
  // ==========================================
  // PM - PRODUCTION MANAGEMENT
  // ==========================================
  {
    id: "pm-subcontract-grn",
    title: "Subcontract GRN",
    module: "PM",
    category: "Subcontract",
    path: "/pm/subcontract-grn",
    keywords: ["subcontract", "grn", "goods receipt", "receipt note", "vendor", "production", "pm"],
    popular: true
  },
  {
    id: "pm-subcontract-order-dc",
    title: "Subcontract Order/DC",
    module: "PM",
    category: "Subcontract",
    path: "/pm/subcontract-order-dc",
    keywords: ["subcontract", "order", "dc", "delivery challan", "production", "pm"],
    popular: true
  },
  {
    id: "pm-subcontract-mat-conversion-dc",
    title: "Subcontract Material Conversion DC",
    module: "PM",
    category: "Subcontract",
    path: "/pm/subcontract-material-conversion-dc",
    keywords: ["subcontract", "conversion dc", "material conversion", "dc", "delivery challan"],
    popular: true
  },
  {
    id: "pm-conversion-grn",
    title: "Conversion GRN",
    module: "PM",
    category: "Subcontract",
    path: "/pm/conversion-grn",
    keywords: ["conversion grn", "subcontract conversion", "grn", "material conversion"],
    popular: true
  },
  {
    id: "pm-subcontract-order-approval",
    title: "Subcontract Order Approval",
    module: "PM",
    category: "Subcontract",
    path: "/pm/subcontract-order-approval",
    keywords: ["subcontract", "order approval", "approval", "verify"]
  },
  {
    id: "pm-subcontract-conversion-approval",
    title: "Subcontract Conversion Approval",
    module: "PM",
    category: "Subcontract",
    path: "/pm/subcontract-conversion-approval",
    keywords: ["subcontract", "conversion approval", "approval"]
  },
  {
    id: "pm-subcontract-po",
    title: "Subcontract PO",
    module: "PM",
    category: "Subcontract",
    path: "/pm/subcontract-po",
    keywords: ["subcontract", "po", "purchase order"]
  },
  {
    id: "pm-subcontract-po-approval",
    title: "Subcontract PO Approval",
    module: "PM",
    category: "Subcontract",
    path: "/pm/subcontract-po-approval",
    keywords: ["subcontract", "po approval", "purchase order approval"]
  },
  {
    id: "pm-cutting-slip",
    title: "Cutting Slip",
    module: "PM",
    category: "Production",
    path: "/pm/cutting-slip",
    keywords: ["cutting slip", "cut", "fabric", "slip", "production"]
  },
  {
    id: "pm-cutting-slip-printing",
    title: "Cutting Slip Printing",
    module: "PM",
    category: "Production",
    path: "/pm/cutting-slip-printing",
    keywords: ["cutting slip printing", "print cut slip"]
  },
  {
    id: "pm-delivery-note",
    title: "Delivery Note",
    module: "PM",
    category: "Production",
    path: "/pm/delivery-note",
    keywords: ["delivery note", "dispatch", "delivery"]
  },
  {
    id: "pm-finished-goods-transfer-note",
    title: "Finished Goods Transfer Note",
    module: "PM",
    category: "Production",
    path: "/pm/finished-goods-transfer-note",
    keywords: ["finished goods transfer note", "fg transfer", "transfer note"]
  },
  {
    id: "pm-man-hours",
    title: "Man Hours",
    module: "PM",
    category: "Production",
    path: "/pm/man-hours",
    keywords: ["man hours", "labor", "hours", "efficiency"]
  },
  {
    id: "pm-daily-production-target",
    title: "Daily Production Target",
    module: "PM",
    category: "Production Tracking",
    path: "/pm/daily-production-target",
    keywords: ["daily production target", "target", "production plan", "kpi"]
  },
  {
    id: "pm-line-output-with-size",
    title: "Line Output With Size",
    module: "PM",
    category: "Production Tracking",
    path: "/pm/line-output-with-size",
    keywords: ["line output with size", "size output", "stitching output"]
  },
  {
    id: "pm-display-board",
    title: "Display Board",
    module: "PM",
    category: "Production Tracking",
    path: "/pm/display-board",
    keywords: ["display board", "live production", "shop floor"]
  },
  {
    id: "pm-line-balancing-report",
    title: "Line Balancing Report",
    module: "PM",
    category: "Production Reports",
    path: "/pm/line-balancing-report",
    keywords: ["line balancing report", "efficiency", "bottleneck"]
  },
  {
    id: "pm-hourly-production-report-v2",
    title: "Hourly Production Report V2",
    module: "PM",
    category: "Production Reports",
    path: "/pm/hourly-production-report-v2",
    keywords: ["hourly production report", "hourly output", "report v2"]
  },
  {
    id: "pm-line-output-by-style",
    title: "Line Output By Style",
    module: "PM",
    category: "Production WIP",
    path: "/pm/line-output-by-style",
    keywords: ["line output by style", "style output", "wip style"]
  },
  {
    id: "pm-component-cutting-plan",
    title: "Component Cutting Plan",
    module: "PM",
    category: "Component",
    path: "/pm/component-cutting-plan",
    keywords: ["component cutting plan", "component", "cutting plan"]
  },
  {
    id: "pm-link-rfid-components",
    title: "Link RFID for Components",
    module: "PM",
    category: "Component",
    path: "/pm/link-rfid-components",
    keywords: ["link rfid for components", "rfid", "tag"]
  },
  {
    id: "pm-treatment-output-tracking",
    title: "Treatment Output Tracking",
    module: "PM",
    category: "Component",
    path: "/pm/treatment-output-tracking",
    keywords: ["treatment output tracking", "treatment", "wash", "dyeing"]
  },
  {
    id: "pm-supermarket-to-treatment",
    title: "Supermarket to Treatment",
    module: "PM",
    category: "Component",
    path: "/pm/supermarket-to-treatment",
    keywords: ["supermarket to treatment", "supermarket"]
  },
  {
    id: "pm-supermarket-inward",
    title: "Supermarket Inward",
    module: "PM",
    category: "Component",
    path: "/pm/supermarket-inward",
    keywords: ["supermarket inward", "inward"]
  },
  {
    id: "pm-supermarket-to-stitching",
    title: "Supermarket to Stitching",
    module: "PM",
    category: "Component",
    path: "/pm/supermarket-to-stitching",
    keywords: ["supermarket to stitching", "stitching"]
  },
  {
    id: "pm-treatment-sub-process-output",
    title: "Treatment Sub Process Output",
    module: "PM",
    category: "Component",
    path: "/pm/treatment-sub-process-output",
    keywords: ["treatment sub process output", "subprocess"]
  },
  {
    id: "pm-rfid-details",
    title: "RFID Details",
    module: "PM",
    category: "Component",
    path: "/pm/rfid-details",
    keywords: ["rfid details", "rfid scan"]
  },
  {
    id: "pm-component-checklist",
    title: "Component Checklist",
    module: "PM",
    category: "Component",
    path: "/pm/component-checklist",
    keywords: ["component checklist", "checklist"]
  },
  {
    id: "pm-cutting-sticker-component-checklist",
    title: "Cutting sticker for component checklist",
    module: "PM",
    category: "Component",
    path: "/pm/cutting-sticker-component-checklist",
    keywords: ["cutting sticker for component checklist", "sticker", "bundle"]
  },
  {
    id: "pm-production-orders",
    title: "Production Orders",
    module: "PM",
    category: "Production",
    path: "/production-orders",
    keywords: ["production orders", "work orders", "jobs"]
  },
  {
    id: "pm-bom",
    title: "Bill of Materials (BOM)",
    module: "PM",
    category: "Production",
    path: "/bom",
    keywords: ["bom", "bill of materials", "recipe", "spec sheet"]
  },
  {
    id: "pm-production-dashboard",
    title: "Production Dashboard",
    module: "PM",
    category: "Dashboard",
    path: "/production-dashboard",
    keywords: ["production dashboard", "pm kpi"]
  },

  // ==========================================
  // MM - MATERIAL MANAGEMENT & PURCHASE
  // ==========================================
  {
    id: "mm-indent",
    title: "Indent",
    module: "MM",
    category: "Purchase",
    path: "/indents",
    keywords: ["indent", "material indent", "indent creation", "purchase indent"],
    popular: true
  },
  {
    id: "mm-indent-approval",
    title: "Indent Approval",
    module: "MM",
    category: "Inventory",
    path: "/indent-approval",
    keywords: ["indent approval", "approve indent", "approval", "verify indent"],
    popular: true
  },
  {
    id: "mm-item-receipt-grn",
    title: "Item Receipt (GRN)",
    module: "MM",
    category: "Inventory",
    path: "/grn",
    keywords: ["grn", "item receipt", "goods receipt note", "inward", "receipt"],
    popular: true
  },
  {
    id: "mm-stock-indent",
    title: "Stock Indent",
    module: "MM",
    category: "Inventory",
    path: "/stock-indent",
    keywords: ["stock indent", "store indent", "inventory indent"]
  },
  {
    id: "mm-gate-entry",
    title: "Gate Entry",
    module: "MM",
    category: "Inventory",
    path: "/gate-entry",
    keywords: ["gate entry", "security inward", "vehicle entry"]
  },
  {
    id: "mm-item-issue",
    title: "Item Issue",
    module: "MM",
    category: "Inventory",
    path: "/stock-issues",
    keywords: ["item issue", "stock issue", "store issue", "material issue"]
  },
  {
    id: "mm-floor-return",
    title: "Floor Return",
    module: "MM",
    category: "Inventory",
    path: "/floor-return",
    keywords: ["floor return", "shopfloor return", "material return"]
  },
  {
    id: "mm-store-transfer",
    title: "Store Transfer",
    module: "MM",
    category: "Inventory",
    path: "/stock-transfer",
    keywords: ["store transfer", "warehouse transfer", "stock transfer"]
  },
  {
    id: "mm-gate-pass-delivery",
    title: "Gate Pass Delivery",
    module: "MM",
    category: "Inventory",
    path: "/gate-pass-delivery",
    keywords: ["gate pass delivery", "outward gate pass", "dc pass"]
  },
  {
    id: "mm-item-requisition",
    title: "Item Requisition",
    module: "MM",
    category: "Inventory",
    path: "/item-requisition",
    keywords: ["item requisition", "requisition note", "indent slip"]
  },
  {
    id: "mm-gate-pass-grn",
    title: "Gate Pass GRN",
    module: "MM",
    category: "Inventory",
    path: "/gate-pass-grn",
    keywords: ["gate pass grn", "gate grn"]
  },
  {
    id: "mm-stock-transfer-dc",
    title: "Stock Transfer DC",
    module: "MM",
    category: "Inventory",
    path: "/stock-transfer-dc",
    keywords: ["stock transfer dc", "dc", "transfer challan"]
  },
  {
    id: "mm-stock-transfer-grn",
    title: "Stock Transfer GRN",
    module: "MM",
    category: "Inventory",
    path: "/stock-transfer-grn",
    keywords: ["stock transfer grn", "inward transfer"]
  },
  {
    id: "mm-grn-handover",
    title: "GRN HandOver",
    module: "MM",
    category: "Inventory",
    path: "/grn-handover",
    keywords: ["grn handover", "handover", "store receipt handover"]
  },
  {
    id: "mm-incoming-material-inspection",
    title: "Incoming Material Inspection",
    module: "MM",
    category: "Quality Control",
    path: "/incoming-material-inspection",
    keywords: ["incoming material inspection", "qc", "fabric inspection", "inspection"]
  },
  {
    id: "mm-final-inspection",
    title: "Final Inspection",
    module: "MM",
    category: "Quality Control",
    path: "/final-inspection",
    keywords: ["final inspection", "qa", "audit"]
  },
  {
    id: "mm-rejection-return",
    title: "Rejection Return",
    module: "MM",
    category: "Quality Control",
    path: "/rejection-return",
    keywords: ["rejection return", "defective return", "supplier return"]
  },
  {
    id: "mm-material-planning",
    title: "Material Planning",
    module: "MM",
    category: "MRP",
    path: "/material-planning",
    keywords: ["material planning", "mrp", "planning", "requirement"]
  },
  {
    id: "mm-stock-conversion",
    title: "Stock Conversion",
    module: "MM",
    category: "MRP",
    path: "/stock-conversion",
    keywords: ["stock conversion", "unit conversion", "process conversion"]
  },
  {
    id: "mm-purchase-orders",
    title: "Purchase Order",
    module: "MM",
    category: "Purchase",
    path: "/purchase-orders",
    keywords: ["purchase order", "po", "orders", "supplier po"],
    popular: true
  },
  {
    id: "mm-purchase-requisition",
    title: "Purchase Requisition",
    module: "MM",
    category: "Purchase",
    path: "/purchase-requisition",
    keywords: ["purchase requisition", "requisition"]
  },
  {
    id: "mm-pending-po",
    title: "Pending PO",
    module: "MM",
    category: "Purchase",
    path: "/pending-po",
    keywords: ["pending po", "open purchase orders", "outstanding po"]
  },
  {
    id: "mm-requirement-to-po",
    title: "Requirement to PO",
    module: "MM",
    category: "Purchase",
    path: "/requirement-to-po",
    keywords: ["requirement to po", "auto po", "indents to po"]
  },
  {
    id: "mm-purchase-return",
    title: "Purchase Return",
    module: "MM",
    category: "Purchase",
    path: "/purchase-return",
    keywords: ["purchase return", "debit note", "return to supplier"]
  },
  {
    id: "mm-supplier-ledger",
    title: "Supplier Ledger",
    module: "MM",
    category: "Purchase",
    path: "/supplier-ledger",
    keywords: ["supplier ledger", "vendor ledger", "payable statement"]
  },

  // ==========================================
  // SM - SALES & STYLE MANAGEMENT
  // ==========================================
  {
    id: "sm-sales-orders",
    title: "Sales Orders",
    module: "SM",
    category: "Sales",
    path: "/sales-orders",
    keywords: ["sales orders", "buyer orders", "so", "customer orders"],
    popular: true
  },
  {
    id: "sm-sales-invoices",
    title: "Sales Invoice",
    module: "SM",
    category: "Sales",
    path: "/sales-invoices",
    keywords: ["sales invoice", "billing", "customer invoice", "tax invoice"],
    popular: true
  },
  {
    id: "sm-proforma-invoice",
    title: "Proforma Invoice",
    module: "SM",
    category: "Sales",
    path: "/sm/proforma-invoice",
    keywords: ["proforma invoice", "pi", "quotation"]
  },
  {
    id: "sm-internal-order",
    title: "Internal Order",
    module: "SM",
    category: "Sales",
    path: "/internal-orders",
    keywords: ["internal order", "io", "master internal order"]
  },
  {
    id: "sm-io-rmr-recalculate",
    title: "IO RMR Recalculate",
    module: "SM",
    category: "Sales",
    path: "/sm/io-rmr-recalculate",
    keywords: ["io rmr recalculate", "rmr", "raw material requirement"]
  },
  {
    id: "sm-sales-order-pdf",
    title: "Sales Order From PDF",
    module: "SM",
    category: "Sales",
    path: "/sm/sales-order-from-pdf",
    keywords: ["sales order from pdf", "pdf import", "auto parse po"]
  },
  {
    id: "sm-projection-order",
    title: "Projection Order",
    module: "SM",
    category: "Sales",
    path: "/sm/projection-order",
    keywords: ["projection order", "forecast", "buyer projection"]
  },
  {
    id: "sm-sample-ftn",
    title: "Sample FTN",
    module: "SM",
    category: "Samples",
    path: "/sm/sample-ftn",
    keywords: ["sample ftn", "fabric test note", "sampling"]
  },
  {
    id: "sm-task-delay-analysis",
    title: "Task Delay Analysis Report",
    module: "SM",
    category: "T AND A",
    path: "/sm/task-delay-analysis",
    keywords: ["task delay analysis", "tna", "time and action", "delay"]
  },
  {
    id: "sm-style-master",
    title: "Style Master",
    module: "SM",
    category: "Style Management",
    path: "/style-master",
    keywords: ["style master", "tech pack", "style creation", "garment style"],
    popular: true
  },
  {
    id: "sm-tech-sheets",
    title: "Tech Sheet",
    module: "SM",
    category: "Style Management",
    path: "/tech-sheets",
    keywords: ["tech sheet", "specification", "measurement sheet"]
  },
  {
    id: "sm-customers",
    title: "Customers Master",
    module: "SM",
    category: "Sales",
    path: "/customers",
    keywords: ["customers", "clients", "buyers", "customer master"]
  },
  {
    id: "sm-customer-outstanding",
    title: "Customer Outstanding",
    module: "SM",
    category: "Sales",
    path: "/customer-outstanding",
    keywords: ["customer outstanding", "aging", "receivables", "credit"]
  },
  {
    id: "sm-customer-payments",
    title: "Customer Payments",
    module: "SM",
    category: "Sales",
    path: "/customer-payments",
    keywords: ["customer payments", "receipts", "payment collection"]
  },
  {
    id: "sm-dispatch",
    title: "Dispatch",
    module: "SM",
    category: "Sales",
    path: "/dispatch",
    keywords: ["dispatch", "shipping", "packing list"]
  },

  // ==========================================
  // EXPORTS MODULE
  // ==========================================
  {
    id: "exports-commercial-invoice",
    title: "Commercial Invoice",
    module: "EXPORTS",
    category: "Transaction",
    path: "/commercial-invoice",
    keywords: ["commercial invoice", "export invoice", "customs", "shipping bill"],
    popular: true
  },

  // ==========================================
  // FM - FINANCE MODULE
  // ==========================================
  {
    id: "fm-debit-note-advice",
    title: "Debit Note Advice",
    module: "FM",
    category: "Finance",
    path: "/fm/debit-note-advice",
    keywords: ["debit note advice", "finance", "debit note", "fm"]
  },
  {
    id: "fm-proforma-invoice",
    title: "Proforma Invoice (Finance)",
    module: "FM",
    category: "Exports",
    path: "/fm/proforma-invoice",
    keywords: ["proforma invoice finance", "fm exports"]
  },

  // ==========================================
  // ADMIN & MASTERS
  // ==========================================
  {
    id: "admin-company-master",
    title: "Company Master",
    module: "ADMIN",
    category: "Master",
    path: "/company-master",
    keywords: ["company master", "organisation", "branches", "profile"],
    popular: true
  },
  {
    id: "admin-item-master",
    title: "Item Master",
    module: "ADMIN",
    category: "Master",
    path: "/master/items",
    keywords: ["item master", "materials", "raw materials", "fabric", "trim"],
    popular: true
  },
  {
    id: "admin-colour-master",
    title: "Colour Master",
    module: "ADMIN",
    category: "Master",
    path: "/master/colours",
    keywords: ["colour master", "color", "pantone", "shades"]
  },
  {
    id: "admin-supplier-master",
    title: "Supplier Master",
    module: "ADMIN",
    category: "Master",
    path: "/master/suppliers",
    keywords: ["supplier master", "vendors", "suppliers", "procurement"],
    popular: true
  },
  {
    id: "admin-buyer-master",
    title: "Buyer Master",
    module: "ADMIN",
    category: "Master",
    path: "/buyers",
    keywords: ["buyer master", "brands", "buyers", "importers"]
  },
  {
    id: "admin-employee-master",
    title: "Employee Master",
    module: "ADMIN",
    category: "Master",
    path: "/employees",
    keywords: ["employee master", "staff", "operators", "workers"]
  },
  {
    id: "admin-department-master",
    title: "Department Master",
    module: "ADMIN",
    category: "Master",
    path: "/departments",
    keywords: ["department master", "cost center", "sections"]
  },
  {
    id: "admin-warehouse-master",
    title: "Warehouse Master (Godown)",
    module: "ADMIN",
    category: "Master",
    path: "/warehouses",
    keywords: ["warehouse master", "godown master", "bins", "storage"]
  },
  {
    id: "admin-auto-emails",
    title: "Configure e-Mail IDs to send Auto e-Mails",
    module: "ADMIN",
    category: "System",
    path: "/admin/auto-emails",
    keywords: ["configure email", "auto emails", "smtp", "notifications", "alerts", "email master"],
    popular: true
  },
  {
    id: "admin-users",
    title: "User Management",
    module: "ADMIN",
    category: "System",
    path: "/users",
    keywords: ["users", "accounts", "login", "credentials"]
  },
  {
    id: "admin-roles",
    title: "Roles & Permissions",
    module: "ADMIN",
    category: "System",
    path: "/roles-permissions",
    keywords: ["roles", "permissions", "access control", "security"]
  },
  {
    id: "admin-audit-log",
    title: "Audit Log",
    module: "ADMIN",
    category: "System",
    path: "/audit-log",
    keywords: ["audit log", "activity log", "history", "tracking"]
  },
  {
    id: "admin-backup",
    title: "Backup & Restore",
    module: "ADMIN",
    category: "System",
    path: "/backup",
    keywords: ["backup", "database backup", "restore", "sql dump"]
  },
  {
    id: "admin-settings",
    title: "System Settings",
    module: "ADMIN",
    category: "System",
    path: "/settings",
    keywords: ["settings", "configuration", "preferences"]
  },

  // ==========================================
  // REPORTS MODULE
  // ==========================================
  {
    id: "reports-stock-ledger",
    title: "Stock Ledger",
    module: "REPORTS",
    category: "Inventory Reports",
    path: "/stock-ledger",
    keywords: ["stock ledger", "item ledger", "bin card", "inventory history"],
    popular: true
  },
  {
    id: "reports-stock-summary",
    title: "Stock Summary",
    module: "REPORTS",
    category: "Inventory Reports",
    path: "/stock-summary",
    keywords: ["stock summary", "inventory balance", "on hand stock"]
  },
  {
    id: "reports-low-stock",
    title: "Low Stock Alert Report",
    module: "REPORTS",
    category: "Inventory Reports",
    path: "/low-stock",
    keywords: ["low stock", "reorder level", "safety stock alert"]
  },
  {
    id: "reports-finished-goods",
    title: "Finished Goods Stock",
    module: "REPORTS",
    category: "Inventory Reports",
    path: "/finished-goods-stock",
    keywords: ["finished goods stock", "fg inventory", "warehouse stock"]
  },
  {
    id: "reports-purchase",
    title: "Purchase Register / Report",
    module: "REPORTS",
    category: "Purchase Reports",
    path: "/purchase-report",
    keywords: ["purchase report", "purchase register", "procurement summary"]
  },
  {
    id: "reports-production-costing",
    title: "Production Costing Report",
    module: "REPORTS",
    category: "Production Reports",
    path: "/production-costing",
    keywords: ["production costing", "order cost", "variance report"]
  },
  {
    id: "reports-wip",
    title: "Work In Progress (WIP) Report",
    module: "REPORTS",
    category: "Production Reports",
    path: "/wip-report",
    keywords: ["wip report", "work in progress", "floor stock"]
  },
  {
    id: "reports-sales",
    title: "Sales Report",
    module: "REPORTS",
    category: "Sales Reports",
    path: "/sales-report",
    keywords: ["sales report", "turnover", "customer sales analysis"]
  },
  {
    id: "reports-finance",
    title: "Finance & Accounts Reports",
    module: "REPORTS",
    category: "Finance Reports",
    path: "/finance-reports",
    keywords: ["finance reports", "accounting", "ledger summary"]
  }
];

// Helper to filter screens by search string
export function searchScreens(query) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();

  return ERP_SCREENS.filter((screen) => {
    if (screen.title.toLowerCase().includes(q)) return true;
    if (screen.module.toLowerCase().includes(q)) return true;
    if (screen.category.toLowerCase().includes(q)) return true;
    if (screen.path.toLowerCase().includes(q)) return true;
    if (screen.keywords && screen.keywords.some((kw) => kw.toLowerCase().includes(q))) return true;
    return false;
  });
}

// Helper to get popular/featured screens
export function getPopularScreens() {
  return ERP_SCREENS.filter((s) => s.popular);
}
