import { useState } from "react";

export default function useIndentLookup() {

    const [showItemLookup, setShowItemLookup] = useState(false);

    const [showDepartmentLookup, setShowDepartmentLookup] = useState(false);

    const [showEmployeeLookup, setShowEmployeeLookup] = useState(false);

    const [selectedRow, setSelectedRow] = useState(null);

    // ===========================
    // ITEM LOOKUP
    // ===========================

    function openItemLookup(rowIndex) {

        setSelectedRow(rowIndex);

        setShowItemLookup(true);

    }

    function closeItemLookup() {

        setSelectedRow(null);

        setShowItemLookup(false);

    }

    // ===========================
    // DEPARTMENT LOOKUP
    // ===========================

    function openDepartmentLookup() {

        setShowDepartmentLookup(true);

    }

    function closeDepartmentLookup() {

        setShowDepartmentLookup(false);

    }

    // ===========================
    // EMPLOYEE LOOKUP
    // ===========================

    function openEmployeeLookup() {

        setShowEmployeeLookup(true);

    }

    function closeEmployeeLookup() {

        setShowEmployeeLookup(false);

    }

    // ===========================
    // CLOSE ALL
    // ===========================

    function closeAllLookups() {

        setSelectedRow(null);

        setShowItemLookup(false);

        setShowDepartmentLookup(false);

        setShowEmployeeLookup(false);

    }

    return {

        selectedRow,

        setSelectedRow,

        showItemLookup,

        setShowItemLookup,

        showDepartmentLookup,

        setShowDepartmentLookup,

        showEmployeeLookup,

        setShowEmployeeLookup,

        openItemLookup,

        closeItemLookup,

        openDepartmentLookup,

        closeDepartmentLookup,

        openEmployeeLookup,

        closeEmployeeLookup,

        closeAllLookups

    };

}