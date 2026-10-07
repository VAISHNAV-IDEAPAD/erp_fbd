import { useEffect, useState } from "react";
import * as dashboardService from "../services/dashboardService";

export default function useDashboard() {

    const [dashboard, setDashboard] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {

        try {

            const res = await dashboardService.getDashboard();
            const data = res?.data?.data || res?.data || {};
            setDashboard(typeof data === "object" && data !== null ? data : {});
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load dashboard"
            );
            setDashboard({});

        } finally {

            setLoading(false);

        }

    }

    return {
        dashboard,
        loading,
        error
    };

}