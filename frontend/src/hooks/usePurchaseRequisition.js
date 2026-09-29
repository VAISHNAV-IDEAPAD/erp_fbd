import { useEffect, useState } from "react";
import { getPurchaseRequisition } from "../services/purchaseService";

export default function usePurchaseRequisition() {

    const [requisitions, setRequisitions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadPR();

    }, []);

    const loadPR = async () => {

        try {

            const res = await getPurchaseRequisition();
            setRequisitions(res.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    return { requisitions, loading };

}