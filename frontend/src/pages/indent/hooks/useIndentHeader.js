import { useState } from "react";

const today = () => new Date().toISOString().substring(0, 10);

const initialHeader = {

    IndentNo: "",

    IndentDate: today(),

    DepartmentID: "",

    Department: "",

    EmployeeID: "",

    RequestedBy: "",

    RequiredDate: today(),

    Remarks: "",

    Status: "Pending"

};

export default function useIndentHeader() {

    const [header, setHeader] = useState(initialHeader);

    function handleHeaderChange(e) {

        const { name, value } = e.target;

        setHeader(prev => ({

            ...prev,

            [name]: value

        }));

    }

    function selectDepartment(department) {

        setHeader(prev => ({

            ...prev,

            DepartmentID: department.DepartmentID,

            Department: department.DepartmentName

        }));

    }

    function selectEmployee(employee) {

        setHeader(prev => ({

            ...prev,

            EmployeeID: employee.EmployeeID,

            RequestedBy: employee.EmployeeName

        }));

    }

    function resetHeader() {

        setHeader(initialHeader);

    }

    return {

        header,

        setHeader,

        handleHeaderChange,

        selectDepartment,

        selectEmployee,

        resetHeader

    };

}