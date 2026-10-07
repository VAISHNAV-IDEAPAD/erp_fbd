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

// =======================================
// REPORTS MODULES
// =======================================
import StockLedger from "./pages/reports/stockLedger/StockLedger";
import InventoryReports from "./pages/reports/inventoryReports/InventoryReports";
import MaterialConsumption from "./pages/reports/materialConsumption/MaterialConsumption";
import FinanceReports from "./pages/reports/financeReports/FinanceReports";

function App() {
    return (
        <BrowserRouter>
            <Header />
            <SearchBar />

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
                <Route path="/indent-approval" element={<IndentApproval />} />
                <Route path="/gate-entry" element={<GateEntries />} />
                <Route path="/item-issue" element={<ItemIssue />} />
                <Route path="/stock-issues" element={<ItemIssue />} />
                <Route path="/floor-return" element={<FloorReturns />} />
                <Route path="/store-transfer" element={<StoreTransfers />} />
                <Route path="/stock-transfer" element={<StoreTransfers />} />
                <Route path="/gate-pass-delivery" element={<GatePassDeliveries />} />
                <Route path="/item-requisition" element={<ItemRequisitions />} />
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

                {/* SM (STYLE MANAGEMENT) */}
                <Route path="/style-master" element={<StyleMaster />} />
                <Route path="/style-master/:id" element={<StyleMaster />} />
                <Route path="/tech-sheets" element={<TechSheet />} />
                <Route path="/tech-sheets/:id" element={<TechSheet />} />
                <Route path="/tech-sheet" element={<TechSheet />} />

                {/* SM (SALES MANAGEMENT) */}
                <Route path="/customers" element={<Customers />} />
                <Route path="/sales-orders" element={<SalesOrders />} />
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

                {/* REPORTS */}
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