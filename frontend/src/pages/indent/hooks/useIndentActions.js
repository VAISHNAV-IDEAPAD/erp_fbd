import { useState } from "react";

import {
    createIndent,
    updateIndent,
    getIndentById
} from "../../../services/indentService";

export default function useIndentActions() {

    const [loading, setLoading] = useState(false);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    async function loadIndent(
        indentId,
        setHeader,
        setRows
    ) {

        if (!indentId)
            return;

        try {

            setLoading(true);

            setError("");

            const res = await getIndentById(indentId);

            // TODO
            // setHeader(...)
            // setRows(...)

        }

        catch (err) {

            console.error(err);

            setError("Failed to load indent.");

        }

        finally {

            setLoading(false);

        }

    }

    async function saveIndent({

        indentId,

        header,

        rows,

        validate,

        onSaved

    }) {

        try {

            setSaving(true);

            setError("");

            setSuccess("");

            const result = validate(header, rows);

            if (!result.valid) {

                setError(result.message);

                return;

            }

            const payload = {

                // TODO

            };

            if (indentId) {

                await updateIndent(indentId, payload);

                setSuccess("Indent updated successfully.");

            }

            else {

                await createIndent(payload);

                setSuccess("Indent created successfully.");

            }

            if (onSaved)
                onSaved();

        }

        catch (err) {

            console.error(err);

            setError(

                err.response?.data?.message ||

                "Failed to save indent."

            );

        }

        finally {

            setSaving(false);

        }

    }

    function resetForm(
        resetHeader,
        resetRows
    ) {

        resetHeader();

        resetRows();

        setError("");

        setSuccess("");

    }

    function printIndent(indentId) {

        if (!indentId)
            return;

        window.print();

    }

    return {

        loading,

        saving,

        error,

        success,

        setLoading,

        setSaving,

        setError,

        setSuccess,

        loadIndent,

        saveIndent,

        resetForm,

        printIndent

    };

}