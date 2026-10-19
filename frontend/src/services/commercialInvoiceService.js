import axios from "axios";

const API_BASE = `${process.env.REACT_APP_API_URL || "/api"}/commercial-invoices`;

export const commercialInvoiceService = {
    getAll: async (params = {}) => {
        const res = await axios.get(API_BASE, { params });
        return res.data;
    },

    getById: async (id) => {
        const res = await axios.get(`${API_BASE}/${id}`);
        return res.data;
    },

    create: async (payload) => {
        const res = await axios.post(API_BASE, payload);
        return res.data;
    },

    update: async (id, payload) => {
        const res = await axios.put(`${API_BASE}/${id}`, payload);
        return res.data;
    },

    remove: async (id) => {
        const res = await axios.delete(`${API_BASE}/${id}`);
        return res.data;
    }
};

export default commercialInvoiceService;
