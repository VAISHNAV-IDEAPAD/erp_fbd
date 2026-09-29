import { useEffect, useState } from "react";
import {
    getIndents,
    getIndentById,
    createIndent,
    updateIndent,
    deleteIndent,
} from "../services/indentService";

export default function useIndent() {

    const [indents, setIndents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ==========================================
    // Load All Indents
    // ==========================================
    const loadIndents = async () => {
        try {
            setLoading(true);
            const res = await getIndents();
            setIndents(res.data.data || []);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to load indents.");
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // Get Single Indent
    // ==========================================
    const loadIndent = async (id) => {
        try {
            const res = await getIndentById(id);
            return res.data.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    // ==========================================
    // Create
    // ==========================================
    const addIndent = async (indent) => {
        try {
            await createIndent(indent);
            await loadIndents();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    // ==========================================
    // Update
    // ==========================================
    const editIndent = async (id, indent) => {
        try {
            await updateIndent(id, indent);
            await loadIndents();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    // ==========================================
    // Delete
    // ==========================================
    const removeIndent = async (id) => {
        try {
            await deleteIndent(id);
            await loadIndents();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    useEffect(() => {
        loadIndents();
    }, []);

    return {
        indents,
        loading,
        error,

        loadIndents,
        loadIndent,

        addIndent,
        editIndent,
        removeIndent,
    };
}