import React from "react";
import MMModuleView from "../../../components/common/MMModuleView";

export default function GRNHandOver() {
    return (
        <MMModuleView
            title="GRN HandOver to Production"
            moduleName="GRNHandOver"
            columns={[
                { key: "DocNo", label: "HandOver Ref" },
                { key: "DocDate", label: "HandOver Date" },
                { key: "Department", label: "Handed Over By" },
                { key: "ItemName", label: "Material / Batch" },
                { key: "Quantity", label: "Accepted Qty" },
                { key: "Status", label: "Handover Status" }
            ]}
            initialSampleData={[
                { id: 1, DocNo: "HND-101", DocDate: "2026-10-05", Department: "Store Incharge", ItemName: "Pure Linen Greige Fabric", Quantity: 750, Status: "Completed" }
            ]}
        />
    );
}
