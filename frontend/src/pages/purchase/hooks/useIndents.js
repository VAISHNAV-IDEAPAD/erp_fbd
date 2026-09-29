import { useCallback, useEffect, useMemo, useState } from "react";

import {
    getIndent,
    getIndents
} from "../../../services/purchaseService";

export default function useIndents() {

    const [indents, setIndents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [notice, setNotice] = useState("");

    const [detail, setDetail] = useState(null);

    const load = useCallback(async () => {

        try {

            setLoading(true);

            const res = await getIndents();

            setIndents(

                Array.isArray(res.data.data)

                    ? res.data.data

                    : []

            );

        }

        catch (err) {

            console.error(err);

            setNotice("Unable to load indents.");

            setIndents([]);

        }

        finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        load();

    }, [load]);

    const filtered = useMemo(() => {

        return indents.filter(indent => {

            const text = `
                ${indent.IndentNo || ""}
                ${indent.Department || ""}
                ${indent.RequestedBy || ""}
                ${indent.Status || ""}
            `.toLowerCase();

            return text.includes(

                search.toLowerCase()

            );

        });

    }, [

        indents,

        search

    ]);

    async function openView(id) {

        try {

            const res = await getIndent(id);

            setDetail(res.data);

        }

        catch (err) {

            console.error(err);

            setNotice("Unable to open indent.");

        }

    }

    return {

        indents,

        filtered,

        loading,

        search,

        setSearch,

        notice,

        setNotice,

        detail,

        setDetail,

        load,

        openView

    };

}