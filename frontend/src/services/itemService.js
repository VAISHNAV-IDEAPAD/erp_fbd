import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// ===========================================
// GET ALL ITEMS
// ===========================================
export const getItems = () => API.get("/items");

// ===========================================
// GET ITEM BY ID
// ===========================================
export const getItemById = (id) =>
    API.get(`/items/${id}`);

// ===========================================
// CREATE ITEM
// ===========================================
export const createItem = (data) =>
    API.post("/items", data);

// ===========================================
// UPDATE ITEM
// ===========================================
export const updateItem = (id, data) =>
    API.put(`/items/${id}`, data);

// ===========================================
// DELETE ITEM
// ===========================================
export const deleteItem = (id) =>
    API.delete(`/items/${id}`);