import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// =====================================
// GET ALL INDENTS
// =====================================

export const getIndents = () =>
    API.get("/indents");

// =====================================
// GET SINGLE INDENT
// =====================================

export const getIndentById = (id) =>
    API.get(`/indents/${id}`);

// =====================================
// CREATE INDENT
// =====================================

export const createIndent = (data) =>
    API.post("/indents", data);

// =====================================
// UPDATE INDENT
// =====================================

export const updateIndent = (id, data) =>
    API.put(`/indents/${id}`, data);

// =====================================
// DELETE INDENT
// =====================================

export const deleteIndent = (id) =>
    API.delete(`/indents/${id}`);

// =====================================
// SEARCH INDENTS
// =====================================

export const searchIndents = (params) =>
    API.get("/indents/search", { params });

// =====================================
// APPROVAL
// =====================================

export const approveIndent = (id) =>
    API.put(`/indents/${id}/approve`);

export const rejectIndent = (id, remarks = "") =>
    API.put(`/indents/${id}/reject`, {
        remarks
    });

// =====================================
// PRINT
// =====================================

export const printIndent = (id) =>
    API.get(`/indents/${id}/print`, {
        responseType: "blob"
    });

// =====================================
// DASHBOARD
// =====================================

export const getIndentDashboard = () =>
    API.get("/indents/dashboard");

// =====================================
// PENDING APPROVAL
// =====================================

export const getPendingIndents = () =>
    API.get("/indents/pending");

// =====================================
// APPROVED
// =====================================

export const getApprovedIndents = () =>
    API.get("/indents/approved");

// =====================================
// REJECTED
// =====================================

export const getRejectedIndents = () =>
    API.get("/indents/rejected");