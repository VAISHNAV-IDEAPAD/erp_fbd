import axios from "axios";

const API_BASE = "/api/material-planning";

export const materialPlanningService = {
    // Fetch IO list, item groups, items, colours, sizes
    getMasters: async () => {
        const res = await axios.get(`${API_BASE}/masters`);
        return res.data;
    },

    // Calculate MRP based on selected criteria
    calculateMRP: async (payload) => {
        const res = await axios.post(`${API_BASE}/calculate`, payload);
        return res.data;
    },

    // Prepare and create real indents in system
    prepareIndent: async (payload) => {
        const res = await axios.post(`${API_BASE}/prepare-indent`, payload);
        return res.data;
    }
};

export default materialPlanningService;
