import { useEffect } from "react";

import useIndentHeader from "./hooks/useIndentHeader";
import useIndentRows from "./hooks/useIndentRows";
import useIndentLookup from "./hooks/useIndentLookup";
import useIndentValidation from "./hooks/useIndentValidation";
import useIndentActions from "./hooks/useIndentActions";

export default function useIndent(indentId) {

    // Header
    const {

        header,

        setHeader,

        handleHeaderChange,

        selectDepartment,

        selectEmployee,

        resetHeader

    } = useIndentHeader();

    // Rows
    const {

        rows,

        setRows,

        addRow,

        updateRow,

        deleteRow,

        openItemLookup,

        selectItem,

        totalQty,

        resetRows

    } = useIndentRows();

    // Lookup
    const {

        showItemLookup,

        setShowItemLookup,

        showDepartmentLookup,

        setShowDepartmentLookup,

        showEmployeeLookup,

        setShowEmployeeLookup

    } = useIndentLookup();

    // Validation
    const {

        validate

    } = useIndentValidation();

    // Actions
    const {

        loading,

        saving,

        error,

        success,

        loadIndent,

        saveIndent,

        resetForm,

        printIndent

    } = useIndentActions();

    useEffect(() => {

        if (indentId) {

            loadIndent(

                indentId,

                setHeader,

                setRows

            );

        }

    }, [

        indentId,

        loadIndent,

        setHeader,

        setRows

    ]);

    return {

        loading,

        saving,

        error,

        success,

        header,

        rows,

        totalQty,

        showItemLookup,

        showDepartmentLookup,

        showEmployeeLookup,

        handleHeaderChange,

        updateRow,

        addRow,

        deleteRow,

        openItemLookup,

        selectItem,

        selectDepartment,

        selectEmployee,

        saveIndent: (onSaved) =>

            saveIndent({

                indentId,

                header,

                rows,

                validate,

                onSaved

            }),

        resetForm: () =>

            resetForm(

                resetHeader,

                resetRows

            ),

        printIndent: () =>

            printIndent(indentId),

        setShowItemLookup,

        setShowDepartmentLookup,

        setShowEmployeeLookup

    };

}