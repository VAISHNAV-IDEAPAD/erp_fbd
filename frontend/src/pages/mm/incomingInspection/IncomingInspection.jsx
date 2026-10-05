import React from "react";
import MMModuleView from "../../../components/common/MMModuleView";

export default function IncomingInspection() {
    return (
        <MMModuleView
            title="Incoming Quality Inspection (QC)"
            moduleName="IncomingInspection"
            columns={[
                { key: "DocNo", label: "QC Inspection #" },
                { key: "DocDate", label: "Date" },
                { key: "Department", label: "Inspector" },
                { key: "ItemName", label: "Material / Batch" },
                { key: "Quantity", label: "Inspected Qty" },
                { key: "Status", label: "QC Result" }
            ]}
            initialSampleData={[
                { id: 1, DocNo: "QC-2026-90", DocDate: "2026-10-04", Department: "Quality Lab A", ItemName: "Combed Cotton 100%", Quantity: 1500, Status: "Approved" },
                { id: 2, DocNo: "QC-2026-91", DocDate: "2026-10-05", Department: "Quality Lab B", ItemName: "Lycra Spandex 5%", Quantity: 200, Status: "Approved" }
            ]}
        />
    );
}
