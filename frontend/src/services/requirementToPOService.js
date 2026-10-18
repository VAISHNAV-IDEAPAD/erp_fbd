import axios from "axios";

const API_BASE = `${process.env.REACT_APP_API_URL || "/api"}/requirements-to-po`;

export const requirementToPOService = {
    getRequirements: async (params = {}) => {
        const res = await axios.get(API_BASE, { params });
        return res.data;
    },

    getFilterOptions: async () => {
        const res = await axios.get(`${API_BASE}/filters`);
        return res.data;
    },

    uploadRequirements: async (payload) => {
        const res = await axios.post(`${API_BASE}/upload`, payload);
        return res.data;
    }
};

export default requirementToPOService;
