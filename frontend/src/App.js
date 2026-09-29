import Header from "./components/layout/Header";
import SearchBar from "./components/layout/SearchBar";
import Dashboard from "./pages/Dashboard";
import Indents from "./pages/indent/Indents";

import { BrowserRouter, Route, Routes } from "react-router-dom";

// =======================================
// MM MODULE
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

// =======================================
// ITEM ISSUE
// =======================================
import ItemIssue from "./pages/itemissue/ItemIssue";

// =======================================
// GRN / ITEM RECEIPT MODULE
// =======================================
import {
    ItemReceipts,
    ItemReceiptForm,
    ItemReceiptView,
} from "./pages/itemReceipt";

// =======================================
// MASTER - ITEM MASTER
// =======================================
import {
    ItemMasters,
    ItemMasterForm,
    ItemMasterView,
} from "./pages/master/itemMaster";

// =======================================
// MASTER - COLOUR MASTER
// =======================================
import {
    ColourMasters,
    ColourMasterForm,
    ColourMasterView,
} from "./pages/master/colourMaster";

// =======================================
// MASTER - SUPPLIER MASTER
// =======================================
import {
    SupplierMasters,
    SupplierMasterForm,
    SupplierMasterView,
} from "./pages/master/supplierMaster";

// =======================================
// ADMIN - COMPANY MASTER
// =======================================
import CompanyMasters from "./pages/admin/companyMaster/CompanyMasters";
import CompanyMasterForm from "./pages/admin/companyMaster/CompanyMasterForm";
import CompanyMasterView from "./pages/admin/companyMaster/CompanyMasterView";


function App() {

    return (
        <BrowserRouter>

            {/* =======================================
                HEADER
            ======================================= */}

            <Header />

            {/* =======================================
                SEARCH BAR
            ======================================= */}

            <SearchBar />

            {/* =======================================
                ROUTES
            ======================================= */}

            <Routes>

                {/* =====================================
                    DASHBOARD
                ===================================== */}

                <Route
                    path="/"
                    element={<Dashboard />}
                />


                {/* =====================================
                    OLD INDENT PAGE
                ===================================== */}

                <Route
                    path="/indents"
                    element={<Indents />}
                />


                {/* =====================================
                    MM - MATERIAL MANAGEMENT
                ===================================== */}

                <Route
                    path="/stock-indent"
                    element={<StockIndents />}
                />

                <Route
                    path="/indent-approval"
                    element={<IndentApproval />}
                />

                <Route
                    path="/purchase-return"
                    element={<PurchaseReturns />}
                />

                <Route
                    path="/rejection-return"
                    element={<RejectionReturns />}
                />

                <Route
                    path="/gate-entry"
                    element={<GateEntries />}
                />


                {/* =====================================
                    ITEM ISSUE
                ===================================== */}

                <Route
                    path="/item-issue"
                    element={<ItemIssue />}
                />

                <Route
                    path="/stock-issues"
                    element={<ItemIssue />}
                />


                <Route
                    path="/floor-return"
                    element={<FloorReturns />}
                />

                <Route
                    path="/store-transfer"
                    element={<StoreTransfers />}
                />

                <Route
                    path="/gate-pass-delivery"
                    element={<GatePassDeliveries />}
                />

                <Route
                    path="/item-requisition"
                    element={<ItemRequisitions />}
                />

                <Route
                    path="/gate-pass-grn"
                    element={<GatePassGRN />}
                />

                <Route
                    path="/stock-transfer-dc"
                    element={<StockTransferDC />}
                />

                <Route
                    path="/stock-transfer-grn"
                    element={<StockTransferGRN />}
                />

                <Route
                    path="/grn-handover"
                    element={<GRNHandOver />}
                />

                <Route
                    path="/incoming-inspection"
                    element={<IncomingInspection />}
                />

                <Route
                    path="/stock-conversion"
                    element={<StockConversion />}
                />

                <Route
                    path="/material-planning"
                    element={<MaterialPlanning />}
                />


                {/* =====================================
                    GRN / ITEM RECEIPT
                ===================================== */}

                <Route
                    path="/grn"
                    element={<ItemReceipts />}
                />

                <Route
                    path="/grn/new"
                    element={<ItemReceiptForm />}
                />

                <Route
                    path="/grn/view/:id"
                    element={<ItemReceiptView />}
                />

                <Route
                    path="/grn/edit/:id"
                    element={<ItemReceiptForm />}
                />


                {/* =====================================
                    ITEM RECEIPT - BACKWARD COMPATIBILITY
                ===================================== */}

                <Route
                    path="/item-receipt"
                    element={<ItemReceipts />}
                />

                <Route
                    path="/item-receipt/new"
                    element={<ItemReceiptForm />}
                />

                <Route
                    path="/item-receipt/view/:id"
                    element={<ItemReceiptView />}
                />

                <Route
                    path="/item-receipt/edit/:id"
                    element={<ItemReceiptForm />}
                />


                {/* =====================================
                    ADMIN - COMPANY MASTER
                ===================================== */}

                <Route
                    path="/company-master"
                    element={<CompanyMasters />}
                />

                <Route
                    path="/admin/company-master"
                    element={<CompanyMasters />}
                />

                <Route
                    path="/admin/company-master/new"
                    element={<CompanyMasterForm />}
                />

                <Route
                    path="/admin/company-master/view/:id"
                    element={<CompanyMasterView />}
                />

                <Route
                    path="/admin/company-master/edit/:id"
                    element={<CompanyMasterForm />}
                />


                {/* =====================================
                    MASTER - ITEM MASTER
                ===================================== */}

                <Route
                    path="/master/items"
                    element={<ItemMasters />}
                />

                <Route
                    path="/master/items/new"
                    element={<ItemMasterForm />}
                />

                <Route
                    path="/master/items/view/:id"
                    element={<ItemMasterView />}
                />

                <Route
                    path="/master/items/edit/:id"
                    element={<ItemMasterForm />}
                />


                {/* =====================================
                    MASTER - COLOUR MASTER
                ===================================== */}

                <Route
                    path="/master/colours"
                    element={<ColourMasters />}
                />

                <Route
                    path="/master/colours/new"
                    element={<ColourMasterForm />}
                />

                <Route
                    path="/master/colours/view/:id"
                    element={<ColourMasterView />}
                />

                <Route
                    path="/master/colours/edit/:id"
                    element={<ColourMasterForm />}
                />


                {/* =====================================
                    MASTER - SUPPLIER MASTER
                ===================================== */}

                <Route
                    path="/master/suppliers"
                    element={<SupplierMasters />}
                />

                <Route
                    path="/master/suppliers/new"
                    element={<SupplierMasterForm />}
                />

                <Route
                    path="/master/suppliers/view/:id"
                    element={<SupplierMasterView />}
                />

                <Route
                    path="/master/suppliers/edit/:id"
                    element={<SupplierMasterForm />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;