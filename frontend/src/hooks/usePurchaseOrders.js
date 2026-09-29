import { useEffect, useState } from "react";
import { getPurchaseOrders } from "../services/purchaseService";

export default function usePurchaseOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadOrders();

    }, []);

    const loadOrders = async () => {

        try {

            const res = await getPurchaseOrders();
            setOrders(res.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    return { orders, loading };

}