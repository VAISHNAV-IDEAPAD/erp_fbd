import React from "react";
import MMModuleView from "../../../components/common/MMModuleView";

export default function PurchaseReturns() {
    return (
        <MMModuleView
            title="Purchase Returns"
            moduleName="PurchaseReturns"
            apiEndpoint="/api/purchase/returns"
            initialSampleData={[
                { id: 1, DocNo: "PRT-501", DocDate: "2026-09-28", Department: "Store", ItemName: "Defective Yarns 30s", Quantity: 50, Status: "Completed" }
            ]}
        />
    );
}
