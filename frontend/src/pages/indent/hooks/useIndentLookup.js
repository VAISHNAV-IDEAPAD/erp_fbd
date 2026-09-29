import { useState } from "react";

export default function useIndentLookup() {

    const [showItemLookup, setShowItemLookup] = useState(false);

    const [showDepartmentLookup, setShowDepartmentLookup] = useState(false);

    const [showEmployeeLookup, setShowEmployeeLookup] = useState(false);

    function openItemLookup() {

        setShowItemLookup(true);

    }

    function closeItemLookup() {

        setShowItemLookup(false);

    }

    function openDepartmentLookup() {

        setShowDepartmentLookup(true);

    }

    function closeDepartmentLookup() {

        setShowDepartmentLookup(false);

    }

    function openEmployeeLookup() {

        setShowEmployeeLookup(true);

    }

    function closeEmployeeLookup() {

        setShowEmployeeLookup(false);

    }

    function closeAllLookups() {

        setShowItemLookup(false);

        setShowDepartmentLookup(false);

        setShowEmployeeLookup(false);

    }

    return {

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