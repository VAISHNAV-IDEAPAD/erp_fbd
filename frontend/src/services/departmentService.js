import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// ===========================================
// GET ALL DEPARTMENTS
// ===========================================
export const getDepartments = () => API.get("/departments");

// ===========================================
// GET DEPARTMENT BY ID
// ===========================================
export const getDepartmentById = (id) =>
    API.get(`/departments/${id}`);

// ===========================================
// CREATE DEPARTMENT
// ===========================================
export const createDepartment = (data) =>
    API.post("/departments", data);

// ===========================================
// UPDATE DEPARTMENT
// ===========================================
export const updateDepartment = (id, data) =>
    API.put(`/departments/${id}`, data);

// ===========================================
// DELETE DEPARTMENT
// ===========================================
export const deleteDepartment = (id) =>
    API.delete(`/departments/${id}`);