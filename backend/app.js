const express = require("express");
const cors = require("cors");

const app = express();

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================================
// DATABASE TABLES
// ======================================================

require("./database/userTables");
require("./database/purchaseTables");
require("./database/inventoryTables");
require("./database/productionTables");
require("./database/salesTables");
require("./database/indentTables");
require("./database/approvalTables");
require("./database/employees");
require("./database/masterTables");

// ======================================================
// ROUTES
// ======================================================

app.use("/api/employees", require("./routes/employees"));

app.use("/api/departments", require("./routes/departments"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/items", require("./routes/items"));
app.use("/api/suppliers", require("./routes/suppliers"));
app.use("/api/buyers", require("./routes/buyers"));
app.use("/api/indents", require("./routes/indents"));
app.use("/api/colours", require("./routes/colours"));
app.use("/api/warehouses", require("./routes/warehouses"));

// ======================================================
// COMPANY MASTER
// ======================================================

app.use("/api/companies", require("./routes/companies"));

// ======================================================
// OTHER ROUTES - ADD AS MODULES ARE BUILT
// ======================================================

// Existing ERP modules are deliberately registered here rather than duplicated.
// This keeps the individual route/controller implementations isolated while
// making every completed workflow available to the React application.
app.use("/api/styles", require("./routes/styles"));
app.use("/api/customers", require("./routes/customers"));
app.use("/api/purchaserequisition", require("./routes/purchaseRequisitions"));
app.use("/api/purchaseorders", require("./routes/purchaseOrders"));
app.use("/api/pr-conversion", require("./routes/prConversion"));
app.use("/api/grn", require("./routes/grn"));
app.use("/api/stock-issues", require("./routes/stockIssues"));
app.use("/api/stockissues", require("./routes/stockIssues"));
app.use("/api/stock-adjustments", require("./routes/stockAdjustments"));
app.use("/api/stock-ledger", require("./routes/stockLedger"));
app.use("/api/stock-summary", require("./routes/stockSummary"));
app.use("/api/stocksummary", require("./routes/stockSummary"));
app.use("/api/boms", require("./routes/boms"));
app.use("/api/production-orders", require("./routes/productionOrders"));
app.use("/api/material-issues", require("./routes/materialIssues"));
app.use("/api/production-receipts", require("./routes/productionReceipts"));
app.use("/api/production-costing", require("./routes/productionCosting"));
app.use("/api/production-variance", require("./routes/productionVariance"));
app.use("/api/sales-orders", require("./routes/salesOrders"));
app.use("/api/dispatches", require("./routes/dispatches"));
app.use("/api/sales-invoices", require("./routes/salesInvoices"));
app.use("/api/customer-payments", require("./routes/customerPayments"));
app.use("/api/customer-outstanding", require("./routes/customerOutstanding"));
app.use("/api/approvals", require("./routes/approvals"));
app.use("/api/purchase", require("./routes/purchase"));
app.use("/api/users", require("./routes/users"));
app.use("/api/roles", require("./routes/users"));
app.use("/api/pendingpo", require("./routes/pendingpo"));
app.use("/api/pending-po", require("./routes/pendingpo"));
app.use("/api/purchaseregister", require("./routes/purchaseRegister"));
app.use("/api/supplierledger", require("./routes/purchase"));
app.use("/api/dispatch", require("./routes/dispatches"));
app.use("/api/purchase-orders", require("./routes/purchaseOrders"));
app.use("/api/purchase-requisition", require("./routes/purchaseRequisitions"));

// Dashboards and report data sources.
app.use("/api/dashboard/purchase", require("./routes/purchaseDashboard"));
app.use("/api/dashboard/inventory", require("./routes/inventoryDashboard"));
app.use("/api/dashboard/production", require("./routes/productionDashboard"));
app.use("/api/dashboard/sales", require("./routes/salesDashboard"));
app.use("/api/dashboard/finance", require("./routes/financeDashboard"));
app.use("/api/dashboard/mis", require("./routes/misDashboard"));
app.use("/api/reports/purchase-register", require("./routes/purchaseRegister"));
app.use("/api/reports/sales-register", require("./routes/salesRegister"));
app.use("/api/reports/material-consumption", require("./routes/materialConsumption"));
app.use("/api/reports/wip", require("./routes/wipReport"));
app.use("/api/reports/finished-goods-stock", require("./routes/finishedGoodsStock"));
app.use("/api/reports/finished-goods-ageing", require("./routes/finishedGoodsAgeing"));
app.use("/api/reports/pending-po", require("./routes/pendingpo"));
app.use("/api/reports/pending-dispatch", require("./routes/pendingDispatch"));

// ======================================================
// HEALTH CHECK
// ======================================================

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "ERP Backend Running"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        status: "Running"
    });
});

app.get("/health", (req, res) => {
    res.json({
        success: true,
        status: "Running"
    });
});

// ======================================================
// FRONTEND STATIC ASSETS & SPA ROUTING
// ======================================================

const path = require("path");
const fs = require("fs");

const candidates = [
    path.resolve(__dirname, "../frontend/build"),
    path.resolve(__dirname, "frontend/build"),
    path.resolve(process.cwd(), "frontend/build")
];

const buildDir = candidates.find(dir => fs.existsSync(dir));

if (buildDir) {
    app.use(express.static(buildDir));

    // Fallback for SPA routing in Express 5
    app.use((req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") {
            return next();
        }
        if (req.path.startsWith("/api")) {
            return next();
        }
        const indexPath = path.join(buildDir, "index.html");
        if (fs.existsSync(indexPath)) {
            return res.sendFile(indexPath);
        }
        next();
    });
}

// ======================================================
// 404
// ======================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
        path: req.originalUrl
    });
});

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {

    console.error("GLOBAL ERROR:", err);

    res.status(500).json({
        success: false,
        message: err.message
    });

});

// ======================================================
// STARTUP LOG
// ======================================================

console.log("Loading dashboard...");
console.log("✓ dashboard loaded");

module.exports = app;
