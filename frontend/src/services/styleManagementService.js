import axios from "axios";

const API = process.env.REACT_APP_API_URL || "/api";

// ==========================================
// STYLE MASTER APIS
// ==========================================

export const getStyles = (params = {}) =>
    axios.get(`${API}/styles`, { params });

export const getStyleById = (id) =>
    axios.get(`${API}/styles/${id}`);

export const createStyle = (data) =>
    axios.post(`${API}/styles`, data);

export const updateStyle = (id, data) =>
    axios.put(`${API}/styles/${id}`, data);

export const deleteStyle = (id) =>
    axios.delete(`${API}/styles/${id}`);

export const duplicateStyle = (id) =>
    axios.post(`${API}/styles/${id}/duplicate`);

export const getStyleOptions = () =>
    axios.get(`${API}/styles/options`);

// ==========================================
// TECH SHEET APIS
// ==========================================

export const getTechSheets = (params = {}) =>
    axios.get(`${API}/tech-sheets`, { params });

export const getTechSheetById = (id) =>
    axios.get(`${API}/tech-sheets/${id}`);

export const createTechSheet = (data) =>
    axios.post(`${API}/tech-sheets`, data);

export const updateTechSheet = (id, data) =>
    axios.put(`${API}/tech-sheets/${id}`, data);

export const deleteTechSheet = (id) =>
    axios.delete(`${API}/tech-sheets/${id}`);

// Approval Workflow
export const submitTechSheet = (id, data = {}) =>
    axios.post(`${API}/tech-sheets/${id}/submit`, data);

export const approveTechSheet = (id, data = {}) =>
    axios.post(`${API}/tech-sheets/${id}/approve`, data);

export const rejectTechSheet = (id, data = {}) =>
    axios.post(`${API}/tech-sheets/${id}/reject`, data);

export const createRevision = (id) =>
    axios.post(`${API}/tech-sheets/${id}/revision`);

// Master Data Lookups
export const getItems = () =>
    axios.get(`${API}/items`);

export const getCustomers = () =>
    axios.get(`${API}/customers`);
