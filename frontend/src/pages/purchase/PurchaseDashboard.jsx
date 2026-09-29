import { useEffect, useState } from "react";
import { getPurchaseDashboard } from "../services/purchaseService";

export default function usePurchaseDashboard() {

    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const res = await getPurchaseDashboard();
            setSummary(res.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }
    };

    return { summary, loading };

}