import React from "react";
import MMModuleView from "../../../components/common/MMModuleView";

export default function ItemRequisitions() {
    return (
        <MMModuleView
            title="Item Requisitions"
            moduleName="ItemRequisitions"
            initialSampleData={[
                { id: 1, DocNo: "REQ-401", DocDate: "2026-10-04", Department: "Sampling Dept", ItemName: "Silk Satin Blend 60s", Quantity: 45, Status: "Approved" },
                { id: 2, DocNo: "REQ-402", DocDate: "2026-10-05", Department: "Packaging", ItemName: "Corrugated Master Cartons", Quantity: 500, Status: "In Progress" }
            ]}
        />
    );
}
