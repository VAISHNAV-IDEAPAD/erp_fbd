import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// ===========================================
// GET ALL EMPLOYEES
// ===========================================
export const getEmployees = () => API.get("/employees");

// ===========================================
// GET EMPLOYEE BY ID
// ===========================================
export const getEmployeeById = (id) =>
    API.get(`/employees/${id}`);

// ===========================================
// CREATE EMPLOYEE
// ===========================================
export const createEmployee = (data) =>
    API.post("/employees", data);

// ===========================================
// UPDATE EMPLOYEE
// ===========================================
export const updateEmployee = (id, data) =>
    API.put(`/employees/${id}`, data);

// ===========================================
// DELETE EMPLOYEE
// ===========================================
export const deleteEmployee = (id) =>
    API.delete(`/employees/${id}`);