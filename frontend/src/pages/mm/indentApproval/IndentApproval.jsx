import React from "react";
import MMModuleView from "../../../components/common/MMModuleView";

export default function IndentApproval() {
    return (
        <MMModuleView
            title="Indent Approval Workflow"
            moduleName="IndentApproval"
            apiEndpoint="/api/approvals"
            initialSampleData={[
                { id: 1, DocNo: "APR-201", DocDate: "2026-10-02", Department: "Production", ItemName: "Buttons 18L Polyester", Quantity: 5000, Status: "Approved" },
                { id: 2, DocNo: "APR-202", DocDate: "2026-10-04", Department: "Finishing", ItemName: "Poly Bags 12x18", Quantity: 2000, Status: "Pending" }
            ]}
        />
    );
}
