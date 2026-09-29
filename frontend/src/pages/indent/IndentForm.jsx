import { Card, Alert, Spinner } from "react-bootstrap";

import IndentHeader from "../../components/indent/IndentHeader";
import IndentDetails from "./IndentDetails";
import IndentGrid from "../../components/indent/IndentGrid";
import IndentFooter from "./IndentFooter";
import useIndent from "./useIndent";

import ItemLookup from "../../components/indent/ItemLookup";
import DepartmentLookup from "../../components/indent/DepartmentLookup";
import EmployeeLookup from "../../components/indent/EmployeeLookup";

export default function IndentForm({

    indentId = null,

    onSaved,

    onCancel

}) {

    const {

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

        saveIndent,
        resetForm,
        printIndent,

        setShowItemLookup,
        setShowDepartmentLookup,
        setShowEmployeeLookup

    } = useIndent(indentId);

    if (loading) {

        return (

            <div className="text-center p-5">

                <Spinner animation="border" />

            </div>

        );

    }

    return (

        <Card className="shadow-sm">

            <Card.Body>

                {error && (

                    <Alert variant="danger">

                        {error}

                    </Alert>

                )}

                {success && (

                    <Alert variant="success">

                        {success}

                    </Alert>

                )}
                                <IndentHeader

                    header={header}

                    handleHeaderChange={handleHeaderChange}

                />

                <IndentDetails

                    header={header}

                    handleHeaderChange={handleHeaderChange}

                    setShowDepartmentLookup={setShowDepartmentLookup}

                    setShowEmployeeLookup={setShowEmployeeLookup}

                />

                <hr />

                <IndentGrid

                    rows={rows}

                    updateRow={updateRow}

                    addRow={addRow}

                    deleteRow={deleteRow}

                    openItemLookup={openItemLookup}

                />

                <IndentFooter

                    rows={rows}

                    totalQty={totalQty}

                    saving={saving}

                    indentId={indentId}

                    saveIndent={() => saveIndent(onSaved)}

                    resetForm={resetForm}

                    printIndent={printIndent}

                    onCancel={onCancel}

                />

            </Card.Body>
                        <ItemLookup
                show={showItemLookup}
                onHide={() => setShowItemLookup(false)}
                onSelect={selectItem}
            />

            <DepartmentLookup
                show={showDepartmentLookup}
                onHide={() => setShowDepartmentLookup(false)}
                onSelect={selectDepartment}
            />

            <EmployeeLookup
                show={showEmployeeLookup}
                onHide={() => setShowEmployeeLookup(false)}
                onSelect={selectEmployee}
            />

        </Card>

    );

}