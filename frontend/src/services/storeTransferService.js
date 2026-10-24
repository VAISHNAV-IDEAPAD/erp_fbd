import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export const getStoreTransfers = async () => {
    try {
        const res = await axios.get(`${API_URL}/store-transfers`);
        return res.data?.data || res.data || [];
    } catch (e) {
        // Fallback to local storage
        const saved = localStorage.getItem("erp_store_transfers");
        return saved ? JSON.parse(saved) : [];
    }
};

export const getStoreTransferById = async (id) => {
    try {
        const res = await axios.get(`${API_URL}/store-transfers/${id}`);
        return res.data?.data || res.data;
    } catch (e) {
        const saved = localStorage.getItem("erp_store_transfers");
        const list = saved ? JSON.parse(saved) : [];
        return list.find((item) => String(item.id) === String(id));
    }
};

export const createStoreTransfer = async (payload) => {
    try {
        const res = await axios.post(`${API_URL}/store-transfers`, payload);
        return res.data?.data || res.data;
    } catch (e) {
        const saved = localStorage.getItem("erp_store_transfers");
        const list = saved ? JSON.parse(saved) : [];
        const record = { ...payload, id: Date.now() };
        list.unshift(record);
        localStorage.setItem("erp_store_transfers", JSON.stringify(list));
        return record;
    }
};

export const updateStoreTransfer = async (id, payload) => {
    try {
        const res = await axios.put(`${API_URL}/store-transfers/${id}`, payload);
        return res.data?.data || res.data;
    } catch (e) {
        const saved = localStorage.getItem("erp_store_transfers");
        let list = saved ? JSON.parse(saved) : [];
        list = list.map((item) => (String(item.id) === String(id) ? { ...item, ...payload } : item));
        localStorage.setItem("erp_store_transfers", JSON.stringify(list));
        return { ...payload, id };
    }
};

export const deleteStoreTransfer = async (id) => {
    try {
        const res = await axios.delete(`${API_URL}/store-transfers/${id}`);
        return res.data;
    } catch (e) {
        const saved = localStorage.getItem("erp_store_transfers");
        let list = saved ? JSON.parse(saved) : [];
        list = list.filter((item) => String(item.id) !== String(id));
        localStorage.setItem("erp_store_transfers", JSON.stringify(list));
        return { success: true };
    }
};

export default {
    getStoreTransfers,
    getStoreTransferById,
    createStoreTransfer,
    updateStoreTransfer,
    deleteStoreTransfer
};
