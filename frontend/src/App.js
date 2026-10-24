import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import SearchBar from "./components/layout/SearchBar";

// =======================================
// DASHBOARD & ROOT
// =======================================
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Suppliers from "./pages/Suppliers";
import Reports from "./pages/Reports";
import Production from "./pages/Production";
import Purchase from "./pages/Purchase";

// =======================================
// PURCHASE MODULE
// =======================================
import Indents from "./pages/indent/Indents";
import PurchaseOrder from "./pages/purchase/PurchaseOrder";
import PurchaseRequisition from "./pages/purchase/PurchaseRequisition";
import PendingPurchaseOrders from "./pages/purchase/PendingPurchaseOrders";
import PurchaseRegister from "./pages/purchase/PurchaseRegister";
import SupplierLedger from "./pages/purchase/SupplierLedger";
import GRN from "./pages/purchase/GRN";

// =======================================
// MM (MATERIAL MANAGEMENT) & INVENTORY
// =======================================
import StockIndents from "./pages/mm/stockIndent/StockIndents";
import IndentApproval from "./pages/mm/indentApproval/IndentApproval";
import PurchaseReturns from "./pages/mm/purchaseReturn/PurchaseReturns";
import RejectionReturns from "./pages/mm/rejectionReturn/RejectionReturns";
import GateEntries from "./pages/mm/gateEntry/GateEntries";
import FloorReturns from "./pages/mm/floorReturn/FloorReturns";
import StoreTransfers from "./pages/mm/storeTransfer/StoreTransfers";
import GatePassDeliveries from "./pages/mm/gatePassDelivery/GatePassDeliveries";
import ItemRequisitions from "./pages/mm/itemRequisition/ItemRequisitions";
import GatePassGRN from "./pages/mm/gatePassGRN/GatePassGRN";
import StockTransferDC from "./pages/mm/stockTransferDC/StockTransferDC";
import StockTransferGRN from "./pages/mm/stockTransferGRN/StockTransferGRN";
import GRNHandOver from "./pages/mm/grnHandOver/GRNHandOver";
import IncomingInspection from "./pages/mm/incomingInspection/IncomingInspection";
import StockConversion from "./pages/mm/stockConversion/StockConversion";
import MaterialPlanning from "./pages/mm/materialPlanning/MaterialPlanning";
import ItemIssue from "./pages/itemissue/ItemIssue";
import { ItemReceipts, ItemReceiptForm, ItemReceiptView } from "./pages/itemReceipt";

// =======================================
// PM (PRODUCTION MANAGEMENT)
// =======================================
import ProductionOrders from "./pages/pm/productionOrders/ProductionOrders";
import BOM from "./pages/pm/bom/BOM";
import MaterialIssue from "./pages/pm/materialIssue/MaterialIssue";
import ProductionReceipt from "./pages/pm/productionReceipt/ProductionReceipt";
import ProductionCosting from "./pages/pm/productionCosting/ProductionCosting";
import FinishedGoods from "./pages/pm/finishedGoods/FinishedGoods";
import WorkInProgress from "./pages/pm/workInProgress/WorkInProgress";
import Styles from "./pages/pm/styles/Styles";
import OperationMaster from "./pages/pm/operationMaster/OperationMaster";
import ProductionDashboard from "./pages/pm/productionDashboard/ProductionDashboard";
import PMModulePage from "./pages/pm/common/PMModulePage";
import SubcontractOrder from "./pages/pm/subcontract/SubcontractOrder";
import SubcontractGRN from "./pages/pm/subcontract/SubcontractGRN";
import SubcontractConversionDC from "./pages/pm/subcontract/SubcontractConversionDC";
import ConversionGRN from "./pages/pm/subcontract/ConversionGRN";

// =======================================
// SM (STYLE MANAGEMENT)
// =======================================
import StyleMaster from "./pages/style-management/StyleMaster";
import TechSheet from "./pages/style-management/TechSheet";

// =======================================
// SM (SALES MANAGEMENT)
// =======================================
import Customers from "./pages/sm/customers/Customers";
import SalesOrders from "./pages/sm/salesOrders/SalesOrders";
import SalesInvoices from "./pages/sm/salesInvoices/SalesInvoices";
import Dispatch from "./pages/sm/dispatch/Dispatch";
import CustomerOutstanding from "./pages/sm/customerOutstanding/CustomerOutstanding";
import CustomerPayments from "./pages/sm/customerPayments/CustomerPayments";
import SalesReports from "./pages/sm/salesReports/SalesReports";
import SalesDashboard from "./pages/sm/salesDashboard/SalesDashboard";
import InternalOrder from "./pages/sm/internalOrder/InternalOrder";
import InternalOrderMaster from "./pages/sm/internalOrder/InternalOrderMaster";
import TaskDelayAnalysis from "./pages/sm/tna/TaskDelayAnalysis";
import IoRmrRecalculate from "./pages/sm/rmr/IoRmrRecalculate";
import SalesOrderPdfImport from "./pages/sm/salesOrderPdf/SalesOrderPdfImport";
import ProjectionOrders from "./pages/sm/projection/ProjectionOrders";

// =======================================
// ADMIN & MASTER MODULES
// =======================================
import CompanyMasters from "./pages/admin/companyMaster/CompanyMasters";
import CompanyMasterForm from "./pages/admin/companyMaster/CompanyMasterForm";
import CompanyMasterView from "./pages/admin/companyMaster/CompanyMasterView";
import { ItemMasters, ItemMasterForm, ItemMasterView } from "./pages/master/itemMaster";
import { ColourMasters, ColourMasterForm, ColourMasterView } from "./pages/master/colourMaster";
import { SupplierMasters, SupplierMasterForm, SupplierMasterView } from "./pages/master/supplierMaster";
import Buyers from "./pages/Buyers";
import Employees from "./pages/admin/employees/Employees";
import Departments from "./pages/admin/departments/Departments";
import GodownMasters from "./pages/admin/godownMaster/GodownMasters";
import Users from "./pages/admin/users/Users";
import Roles from "./pages/admin/roles/Roles";
import AuditLog from "./pages/admin/auditLog/AuditLog";
import Backup from "./pages/admin/backup/Backup";
import Settings from "./pages/admin/settings/Settings";
import Profile from "./pages/admin/profile/Profile";
import ConfigureAutoEmails from "./pages/admin/autoEmails/ConfigureAutoEmails";

// =======================================
// REPORTS MODULES
// =======================================
import StockLedger from "./pages/reports/stockLedger/StockLedger";
import InventoryReports from "./pages/reports/inventoryReports/InventoryReports";
import MaterialConsumption from "./pages/reports/materialConsumption/MaterialConsumption";
import FinanceReports from "./pages/reports/financeReports/FinanceReports";
import RequirementToPO from "./pages/reports/requirementToPO/RequirementToPO";
import CommercialInvoice from "./pages/exports/CommercialInvoice";
import FMModulePage from "./pages/fm/FMModulePage";

function App() {
    return (
        <BrowserRouter>
            <Header />

            <Routes>
                {/* CORE DASHBOARDS */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/production" element={<Production />} />
                <Route path="/purchase" element={<Purchase />} />
                <Route path="/reports" element={<Reports />} />

                {/* PURCHASE MODULE */}
                <Route path="/indents" element={<Indents />} />
                <Route path="/indents/new" element={<Indents mode="form" />} />
                <Route path="/purchase-requisition" element={<PurchaseRequisition />} />
                <Route path="/purchase-orders" element={<PurchaseOrder />} />
                <Route path="/purchase/orders" element={<PurchaseOrder />} />
                <Route path="/pending-po" element={<PendingPurchaseOrders />} />
                <Route path="/purchase-return" element={<PurchaseReturns />} />
                <Route path="/purchase-register" element={<PurchaseRegister />} />
                <Route path="/supplier-ledger" element={<SupplierLedger />} />
                <Route path="/purchase-dashboard" element={<Purchase />} />

                {/* MM & INVENTORY */}
                <Route path="/stock-indent" element={<StockIndents />} />
                <Route path="/stock-indent/new" element={<StockIndents mode="form" />} />
                <Route path="/indent-approval" element={<IndentApproval />} />
                <Route path="/gate-entry" element={<GateEntries />} />
                <Route path="/item-issue" element={<ItemIssue />} />
                <Route path="/stock-issues" element={<ItemIssue />} />
                <Route path="/floor-return" element={<FloorReturns />} />
                <Route path="/store-transfer" element={<StoreTransfers />} />
                <Route path="/store-transfer/new" element={<StoreTransfers initialMode="form" />} />
                <Route path="/stock-transfer" element={<StoreTransfers />} />
                <Route path="/stock-transfer/new" element={<StoreTransfers initialMode="form" />} />
                <Route path="/gate-pass-delivery" element={<GatePassDeliveries />} />
                <Route path="/item-requisition" element={<ItemRequisitions />} />
                <Route path="/item-requisitions" element={<ItemRequisitions />} />
                <Route path="/mm/item-requisition" element={<ItemRequisitions />} />
                <Route path="/mm/item-requisitions" element={<ItemRequisitions />} />
                <Route path="/gate-pass-grn" element={<GatePassGRN />} />
                <Route path="/stock-transfer-dc" element={<StockTransferDC />} />
                <Route path="/stock-transfer-grn" element={<StockTransferGRN />} />
                <Route path="/grn-handover" element={<GRNHandOver />} />
                <Route path="/incoming-inspection" element={<IncomingInspection />} />
                <Route path="/incoming-material-inspection" element={<IncomingInspection />} />
                <Route path="/final-inspection" element={<IncomingInspection />} />
                <Route path="/rejection-return" element={<RejectionReturns />} />
                <Route path="/material-planning" element={<MaterialPlanning />} />
                <Route path="/stock-conversion" element={<StockConversion />} />
                <Route path="/mrp-report" element={<MaterialPlanning />} />

                {/* GRN / ITEM RECEIPT */}
                <Route path="/grn" element={<ItemReceipts />} />
                <Route path="/grn/new" element={<ItemReceiptForm />} />
                <Route path="/grn/view/:id" element={<ItemReceiptView />} />
                <Route path="/grn/edit/:id" element={<ItemReceiptForm />} />
                <Route path="/item-receipt" element={<ItemReceipts />} />
                <Route path="/item-receipt/new" element={<ItemReceiptForm />} />
                <Route path="/item-receipt/view/:id" element={<ItemReceiptView />} />
                <Route path="/item-receipt/edit/:id" element={<ItemReceiptForm />} />

                {/* PM (PRODUCTION MANAGEMENT) */}
                <Route path="/production-orders" element={<ProductionOrders />} />
                <Route path="/material-issues" element={<MaterialIssue />} />
                <Route path="/production-receipts" element={<ProductionReceipt />} />
                <Route path="/production-operations" element={<OperationMaster />} />
                <Route path="/bom" element={<BOM />} />
                <Route path="/bom-details" element={<BOM />} />
                <Route path="/material-consumption" element={<MaterialConsumption />} />
                <Route path="/production-costing" element={<ProductionCosting />} />
                <Route path="/finished-goods-stock" element={<FinishedGoods />} />
                <Route path="/finished-goods" element={<FinishedGoods />} />
                <Route path="/wip-report" element={<WorkInProgress />} />
                <Route path="/wip" element={<WorkInProgress />} />
                <Route path="/styles" element={<Styles />} />
                <Route path="/production-dashboard" element={<ProductionDashboard />} />

                {/* SUBCONTRACT MODULES */}
                <Route path="/pm/subcontract-order-dc" element={<SubcontractOrder />} />
                <Route path="/pm/subcontract-order-dc/new" element={<SubcontractOrder initialMode="form" />} />
                <Route path="/pm/subcontract-order" element={<SubcontractOrder />} />
                <Route path="/pm/subcontract-order/new" element={<SubcontractOrder initialMode="form" />} />
                <Route path="/subcontract-order" element={<SubcontractOrder />} />
                <Route path="/subcontract-order/new" element={<SubcontractOrder initialMode="form" />} />
                <Route path="/pm/subcontract-grn" element={<SubcontractGRN />} />
                <Route path="/pm/subcontract-grn/new" element={<SubcontractGRN initialMode="form" />} />
                <Route path="/subcontract-grn" element={<SubcontractGRN />} />
                <Route path="/pm/subcontract-material-conversion-dc" element={<SubcontractConversionDC />} />
                <Route path="/pm/subcontract-material-conversion-dc/new" element={<SubcontractConversionDC initialMode="form" />} />
                <Route path="/pm/conversion-dc" element={<SubcontractConversionDC />} />
                <Route path="/pm/conversion-dc/new" element={<SubcontractConversionDC initialMode="form" />} />
                <Route path="/subcontract-material-conversion-dc" element={<SubcontractConversionDC />} />
                <Route path="/conversion-dc" element={<SubcontractConversionDC />} />
                <Route path="/pm/conversion-grn" element={<ConversionGRN />} />
                <Route path="/pm/conversion-grn/new" element={<ConversionGRN initialMode="form" />} />
                <Route path="/conversion-grn" element={<ConversionGRN />} />
                <Route path="/conversion-grn/new" element={<ConversionGRN initialMode="form" />} />
                <Route path="/pm/subcontract-order-approval" element={<PMModulePage title="Subcontract Order Approval" category="Subcontract" />} />
                <Route path="/pm/subcontract-conversion-approval" element={<PMModulePage title="Subcontract Conversion Approval" category="Subcontract" />} />
                <Route path="/pm/subcontract-po" element={<PMModulePage title="Subcontract PO" category="Subcontract" />} />
                <Route path="/pm/subcontract-po-approval" element={<PMModulePage title="Subcontract PO Approval" category="Subcontract" />} />

                {/* PRODUCTION MODULE ITEMS */}
                <Route path="/pm/cutting-slip" element={<PMModulePage title="Cutting Slip" category="Production" />} />
                <Route path="/pm/cutting-slip-printing" element={<PMModulePage title="Cutting Slip Printing" category="Production" />} />
                <Route path="/pm/delivery-note" element={<PMModulePage title="Delivery Note" category="Production" />} />
                <Route path="/pm/finished-goods-transfer-note" element={<PMModulePage title="Finished Goods Transfer Note" category="Production" />} />
                <Route path="/pm/man-hours" element={<PMModulePage title="Man Hours" category="Production" />} />
                <Route path="/pm/daily-production-target" element={<PMModulePage title="Daily Production Target" category="Production Tracking" />} />
                <Route path="/pm/line-output-with-size" element={<PMModulePage title="Line Output With Size" category="Production Tracking" />} />
                <Route path="/pm/display-board" element={<PMModulePage title="Display Board" category="Production Tracking" />} />
                <Route path="/pm/line-balancing-report" element={<PMModulePage title="Line Balancing Report" category="Production Reports" />} />
                <Route path="/pm/hourly-production-report-v2" element={<PMModulePage title="Hourly Production Report V2" category="Production Reports" />} />
                <Route path="/pm/line-output-by-style" element={<PMModulePage title="Line Output By Style" category="Production WIP" />} />

                {/* COMPONENT MODULE ITEMS */}
                <Route path="/pm/component-cutting-plan" element={<PMModulePage title="Component Cutting Plan" category="Component" />} />
                <Route path="/pm/link-rfid-components" element={<PMModulePage title="Link RFID for Components" category="Component" />} />
                <Route path="/pm/treatment-output-tracking" element={<PMModulePage title="Treatment Output Tracking" category="Component" />} />
                <Route path="/pm/treatment-output-tracking-2" element={<PMModulePage title="Treatment Output Tracking" category="Component" />} />
                <Route path="/pm/supermarket-to-treatment" element={<PMModulePage title="Supermarket to Treatment" category="Component" />} />
                <Route path="/pm/supermarket-inward" element={<PMModulePage title="Supermarket Inward" category="Component" />} />
                <Route path="/pm/supermarket-to-stitching" element={<PMModulePage title="Supermarket to Stitching" category="Component" />} />
                <Route path="/pm/treatment-sub-process-output" element={<PMModulePage title="Treatment Sub Process Output" category="Component" />} />
                <Route path="/pm/rfid-details" element={<PMModulePage title="RFID Details" category="Component" />} />
                <Route path="/pm/component-checklist" element={<PMModulePage title="Component Checklist" category="Component" />} />
                <Route path="/pm/cutting-sticker-component-checklist" element={<PMModulePage title="Cutting Sticker for Component Checklist" category="Component" />} />

                {/* SM (STYLE MANAGEMENT) */}
                <Route path="/style-master" element={<StyleMaster />} />
                <Route path="/style-master/:id" element={<StyleMaster />} />
                <Route path="/tech-sheets" element={<TechSheet />} />
                <Route path="/tech-sheets/:id" element={<TechSheet />} />
                <Route path="/tech-sheet" element={<TechSheet />} />

                {/* SM (SALES MANAGEMENT) */}
                <Route path="/customers" element={<Customers />} />
                <Route path="/sales-orders" element={<SalesOrders />} />
                <Route path="/sales-order" element={<SalesOrders />} />
                <Route path="/sm/sales-order" element={<SalesOrders />} />
                <Route path="/sm/sales-orders" element={<SalesOrders />} />
                <Route path="/sales-invoices" element={<SalesInvoices />} />
                <Route path="/dispatch" element={<Dispatch />} />
                <Route path="/customer-outstanding" element={<CustomerOutstanding />} />
                <Route path="/customer-payments" element={<CustomerPayments />} />
                <Route path="/sales-report" element={<SalesReports />} />
                <Route path="/sales-dashboard" element={<SalesDashboard />} />
                <Route path="/internal-orders" element={<InternalOrder />} />
                <Route path="/sm/internal-order" element={<InternalOrder />} />
                <Route path="/sm/internal-orders" element={<InternalOrder />} />
                <Route path="/internal-order-master" element={<InternalOrderMaster />} />
                <Route path="/internal-order-master/:id" element={<InternalOrderMaster />} />
                <Route path="/internal-orders/:id" element={<InternalOrderMaster />} />
                <Route path="/internal-orders/new" element={<InternalOrderMaster />} />

                {/* T&A (TASK DELAY ANALYSIS REPORT) */}
                <Route path="/sm/task-delay-analysis" element={<TaskDelayAnalysis />} />
                <Route path="/task-delay-analysis" element={<TaskDelayAnalysis />} />
                <Route path="/tna-report" element={<TaskDelayAnalysis />} />
                <Route path="/tna" element={<TaskDelayAnalysis />} />

                {/* IO RMR RECALCULATE */}
                <Route path="/sm/io-rmr-recalculate" element={<IoRmrRecalculate />} />
                <Route path="/io-rmr-recalculate" element={<IoRmrRecalculate />} />
                <Route path="/rmr-recalculate" element={<IoRmrRecalculate />} />
                <Route path="/rmr" element={<IoRmrRecalculate />} />

                {/* SALES ORDER FROM PDF */}
                <Route path="/sm/sales-order-from-pdf" element={<SalesOrderPdfImport />} />
                <Route path="/sales-order-from-pdf" element={<SalesOrderPdfImport />} />
                <Route path="/sales-order-pdf" element={<SalesOrderPdfImport />} />
                <Route path="/sales-orders/pdf-import" element={<SalesOrderPdfImport />} />

                {/* PROJECTION ORDER */}
                <Route path="/sm/projection-order" element={<ProjectionOrders />} />
                <Route path="/sm/projection-orders" element={<ProjectionOrders />} />
                <Route path="/projection-order" element={<ProjectionOrders />} />
                <Route path="/projection-orders" element={<ProjectionOrders />} />

                {/* EXPORTS */}
                <Route path="/commercial-invoice" element={<CommercialInvoice />} />
                <Route path="/commercial-invoices" element={<CommercialInvoice />} />
                <Route path="/exports/commercial-invoice" element={<CommercialInvoice />} />
                <Route path="/commercial-invoice/new" element={<CommercialInvoice initialMode="form" />} />

                {/* FM (FINANCE MODULE) */}
                <Route path="/fm/debit-note-advice" element={<FMModulePage title="Debit Note Advice" moduleCategory="FINANCE" />} />
                <Route path="/fm/proforma-invoice" element={<FMModulePage title="Proforma Invoice" moduleCategory="EXPORTS" />} />
                <Route path="/debit-note-advice" element={<FMModulePage title="Debit Note Advice" moduleCategory="FINANCE" />} />
                <Route path="/proforma-invoice" element={<FMModulePage title="Proforma Invoice" moduleCategory="EXPORTS" />} />
                <Route path="/sm/proforma-invoice" element={<FMModulePage title="Proforma Invoice" moduleCategory="EXPORTS" />} />

                {/* ADMIN & MASTERS */}
                <Route path="/company-master" element={<CompanyMasters />} />
                <Route path="/admin/company-master" element={<CompanyMasters />} />
                <Route path="/admin/company-master/new" element={<CompanyMasterForm />} />
                <Route path="/admin/company-master/view/:id" element={<CompanyMasterView />} />
                <Route path="/admin/company-master/edit/:id" element={<CompanyMasterForm />} />

                <Route path="/master/items" element={<ItemMasters />} />
                <Route path="/items" element={<ItemMasters />} />
                <Route path="/master/items/new" element={<ItemMasterForm />} />
                <Route path="/master/items/view/:id" element={<ItemMasterView />} />
                <Route path="/master/items/edit/:id" element={<ItemMasterForm />} />

                <Route path="/master/colours" element={<ColourMasters />} />
                <Route path="/colours" element={<ColourMasters />} />
                <Route path="/master/colours/new" element={<ColourMasterForm />} />
                <Route path="/master/colours/view/:id" element={<ColourMasterView />} />
                <Route path="/master/colours/edit/:id" element={<ColourMasterForm />} />

                <Route path="/master/suppliers" element={<SupplierMasters />} />
                <Route path="/master/suppliers/new" element={<SupplierMasterForm />} />
                <Route path="/master/suppliers/view/:id" element={<SupplierMasterView />} />
                <Route path="/master/suppliers/edit/:id" element={<SupplierMasterForm />} />

                <Route path="/buyers" element={<Buyers />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/admin/employees" element={<Employees />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/admin/departments" element={<Departments />} />
                <Route path="/warehouses" element={<GodownMasters />} />
                <Route path="/godown-master" element={<GodownMasters />} />
                <Route path="/admin/godown-master" element={<GodownMasters />} />
                <Route path="/users" element={<Users />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/roles-permissions" element={<Roles />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/admin/roles" element={<Roles />} />
                <Route path="/audit-log" element={<AuditLog />} />
                <Route path="/admin/audit-log" element={<AuditLog />} />
                <Route path="/backup" element={<Backup />} />
                <Route path="/admin/backup" element={<Backup />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin/profile" element={<Profile />} />

                {/* AUTO EMAILS CONFIGURATION */}
                <Route path="/admin/auto-emails" element={<ConfigureAutoEmails />} />
                <Route path="/admin/auto-emails/new" element={<ConfigureAutoEmails initialMode="form" />} />
                <Route path="/admin/configure-emails" element={<ConfigureAutoEmails />} />
                <Route path="/admin/configure-emails/new" element={<ConfigureAutoEmails initialMode="form" />} />
                <Route path="/configure-emails" element={<ConfigureAutoEmails />} />
                <Route path="/configure-emails/new" element={<ConfigureAutoEmails initialMode="form" />} />
                <Route path="/admin/configure-email-ids" element={<ConfigureAutoEmails />} />
                <Route path="/admin/configure-email-ids/new" element={<ConfigureAutoEmails initialMode="form" />} />

                {/* REPORTS */}
                <Route path="/requirement-to-po" element={<RequirementToPO />} />
                <Route path="/requirements-to-po" element={<RequirementToPO />} />
                <Route path="/reports/requirement-to-po" element={<RequirementToPO />} />
                <Route path="/reports/requirements-to-po" element={<RequirementToPO />} />
                <Route path="/mm/requirement-to-po" element={<RequirementToPO />} />
                <Route path="/purchase/requirement-to-po" element={<RequirementToPO />} />
                <Route path="/stock-ledger" element={<StockLedger />} />
                <Route path="/stock-summary" element={<InventoryReports />} />
                <Route path="/low-stock" element={<InventoryReports />} />
                <Route path="/inventory-reports" element={<InventoryReports />} />
                <Route path="/grn-report" element={<ItemReceipts />} />
                <Route path="/purchase-report" element={<PurchaseRegister />} />
                <Route path="/production-report" element={<ProductionCosting />} />
                <Route path="/dispatch-report" element={<Dispatch />} />
                <Route path="/finance-reports" element={<FinanceReports />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;