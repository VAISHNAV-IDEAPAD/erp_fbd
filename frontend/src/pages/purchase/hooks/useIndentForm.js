import { useState } from "react";

import {
    createIndent,
    updateIndent
} from "../../../services/purchaseService";

const today = () => new Date().toISOString().slice(0, 10);

const blankItem = () => ({

    ItemID: "",

    ItemCode: "",

    ItemName: "",

    UOM: "",

    Qty: 1,

    Remarks: ""

});

const blankForm = () => ({

    IndentDate: today(),

    DepartmentID: "",

    Department: "",

    EmployeeID: "",

    RequestedBy: "",

    RequiredDate: "",

    Remarks: "",

    items: [blankItem()]

});

export default function useIndentForm(load) {

    const [form, setForm] = useState(blankForm());

    const [editingId, setEditingId] = useState(null);

    const [showForm, setShowForm] = useState(false);

    const [saving, setSaving] = useState(false);

    const [notice, setNotice] = useState("");

    function openNew() {

        setEditingId(null);

        setForm(blankForm());

        setShowForm(true);

    }

    function closeForm() {

        setShowForm(false);

    }

    function change(field, value) {

        setForm(current => ({

            ...current,

            [field]: value

        }));

    }

    function setEdit(record) {

        setEditingId(record.IndentID);

        setForm(record);

        setShowForm(true);

    }

    async function submit(event) {

        event.preventDefault();

        try {

            setSaving(true);

            setNotice("");

            if (editingId) {

                await updateIndent(

                    editingId,

                    form

                );

                setNotice(

                    "Indent updated successfully."

                );

            }

            else {

                await createIndent(form);

                setNotice(

                    "Indent saved successfully."

                );

            }

            setShowForm(false);

            if (load)

                await load();

        }

        catch (err) {

            console.error(err);

            setNotice(

                err.response?.data?.message ||

                "Unable to save indent."

            );

        }

        finally {

            setSaving(false);

        }

    }

    return {

        form,

        setForm,

        change,

        editingId,

        setEditingId,

        showForm,

        setShowForm,

        saving,

        notice,

        setNotice,

        openNew,

        closeForm,

        submit,

        setEdit

    };

}