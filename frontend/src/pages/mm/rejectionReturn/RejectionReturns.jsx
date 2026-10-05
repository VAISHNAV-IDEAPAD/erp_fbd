import React from "react";
import MMModuleView from "../../../components/common/MMModuleView";

export default function RejectionReturns() {
    return (
        <MMModuleView
            title="Rejection Returns"
            moduleName="RejectionReturns"
            initialSampleData={[
                { id: 1, DocNo: "REJ-101", DocDate: "2026-10-01", Department: "Quality Control", ItemName: "Damaged Fabric Rolls", Quantity: 80, Status: "Completed" }
            ]}
        />
    );
}
