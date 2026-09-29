import { useEffect, useState } from "react";
import {
    getItems,
    getSuppliers
} from "../services/purchaseService";

export default function usePurchaseMasters() {

    const [items, setItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadMasters();

    }, []);

    async function loadMasters() {

        try {

            const [itemRes, supplierRes] = await Promise.all([
                getItems(),
                getSuppliers()
            ]);

            setItems(itemRes.data);
            setSuppliers(supplierRes.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    }

    return {

        items,
        suppliers,
        loading

    };

}