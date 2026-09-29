import axios from "axios";

const API = "http://localhost:3000/api";

// ==========================
// Dashboard
// ==========================

export const getPurchaseDashboard = () =>
    axios.get(`${API}/dashboard/purchase`);

// ==========================
// Purchase Orders
// ==========================

export const getPurchaseOrders = () =>
    axios.get(`${API}/purchaseorders`);

export const savePurchaseOrder = (data) =>
    axios.post(`${API}/purchaseorders`, data);

export const updatePurchaseOrder = (id, data) =>
    axios.put(`${API}/purchaseorders/${id}`, data);

export const deletePurchaseOrder = (id) =>
    axios.delete(`${API}/purchaseorders/${id}`);

// ==========================
// Pending PO
// ==========================

export const getPendingPO = () =>
    axios.get(`${API}/pendingpo`);

// ==========================
// Purchase Requisition
// ==========================

export const getPurchaseRequisition = () =>
    axios.get(`${API}/purchaserequisition`);

// ==========================
// GRN
// ==========================

export const getGRN = () =>
    axios.get(`${API}/grn`);

// ==========================
// Reports
// ==========================

export const getPurchaseRegister = () =>
    axios.get(`${API}/purchaseregister`);

export const getSupplierLedger = () =>
    axios.get(`${API}/supplierledger`);

// ==========================
// Masters
// ==========================

export const getItems = () =>
    axios.get(`${API}/items`);

export const getSuppliers = () =>
    axios.get(`${API}/suppliers`);

// ==========================
// Indents
// ==========================

export const getIndents = () => axios.get(`${API}/indents`);
export const getIndent = (id) => axios.get(`${API}/indents/${id}`);
export const createIndent = (data) => axios.post(`${API}/indents`, data);
export const updateIndent = (id, data) => axios.put(`${API}/indents/${id}`, data);
export const updateIndentStatus = (id, status) => axios.patch(`${API}/indents/${id}/status`, { status });
