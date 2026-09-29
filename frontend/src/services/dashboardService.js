import axios from "axios";

// ======================================================
// AXIOS INSTANCE
// ======================================================
const API = axios.create({
    baseURL: "/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================
API.interceptors.response.use(
    (response) => response,
    (error) => {

        console.error("API ERROR:", error);

        if (!error.response) {
            console.error("Backend server is unavailable.");
        }

        return Promise.reject(error);

    }
);

// ======================================================
// DASHBOARD
// ======================================================
export const getDashboard = () =>
    API.get("/dashboard");

// ======================================================
// LOW STOCK
// ======================================================
export const getLowStock = () =>
    API.get("/stocksummary");

// ======================================================
// PENDING PURCHASE ORDER
// ======================================================
export const getPendingPO = () =>
    API.get("/pendingpo");

// ======================================================
// PRODUCTION STATUS
// ======================================================
export const getProductionStatus = () =>
    API.get("/dashboard/production");

// ======================================================
// RECENT ACTIVITY
// ======================================================
export const getRecentActivity = async () => ({
    data: []
});

export default API;