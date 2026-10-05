import React from "react";
import MMModuleView from "../../../components/common/MMModuleView";

export default function GatePassGRN() {
    return (
        <MMModuleView
            title="Gate Pass GRN Linkage"
            moduleName="GatePassGRN"
            columns={[
                { key: "DocNo", label: "Gate Pass Ref" },
                { key: "DocDate", label: "Inward Date" },
                { key: "Department", label: "Vendor" },
                { key: "ItemName", label: "Linked GRN #" },
                { key: "Quantity", label: "Verified Qty" },
                { key: "Status", label: "Verification" }
            ]}
            initialSampleData={[
                { id: 1, DocNo: "GP-901", DocDate: "2026-10-05", Department: "Vardhman Mills", ItemName: "GRN-2026-081", Quantity: 240, Status: "Completed" }
            ]}
        />
    );
}
