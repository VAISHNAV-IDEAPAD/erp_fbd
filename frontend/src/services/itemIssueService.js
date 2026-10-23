import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export const getItemIssues = async () => {
    const res = await axios.get(`${API_URL}/item-issues`);
    return res.data?.data || res.data || [];
};

export const getItemIssueById = async (id) => {
    const res = await axios.get(`${API_URL}/item-issues/${id}`);
    return res.data?.data || res.data;
};

export const createItemIssue = async (payload) => {
    const res = await axios.post(`${API_URL}/item-issues`, payload);
    return res.data?.data || res.data;
};

export const updateItemIssue = async (id, payload) => {
    const res = await axios.put(`${API_URL}/item-issues/${id}`, payload);
    return res.data?.data || res.data;
};

export const deleteItemIssue = async (id) => {
    const res = await axios.delete(`${API_URL}/item-issues/${id}`);
    return res.data;
};

export default {
    getItemIssues,
    getItemIssueById,
    createItemIssue,
    updateItemIssue,
    deleteItemIssue
};
