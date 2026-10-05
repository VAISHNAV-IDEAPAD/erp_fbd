import React from "react";
import MMModuleView from "../../../components/common/MMModuleView";

export default function FloorReturns() {
    return (
        <MMModuleView
            title="Floor Returns"
            moduleName="FloorReturns"
            initialSampleData={[
                { id: 1, DocNo: "FLR-301", DocDate: "2026-10-02", Department: "Sewing Line 2", ItemName: "Surplus Zippers #5", Quantity: 150, Status: "Completed" }
            ]}
        />
    );
}
