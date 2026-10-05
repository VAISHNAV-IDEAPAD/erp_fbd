import React from "react";
import MMModuleView from "../../../components/common/MMModuleView";

export default function StockTransferGRN() {
    return (
        <MMModuleView
            title="Stock Transfer Inward (GRN)"
            moduleName="StockTransferGRN"
            initialSampleData={[
                { id: 1, DocNo: "STG-102", DocDate: "2026-10-05", Department: "Unit 2 Store", ItemName: "Dyed Yarns Lot #40", Quantity: 300, Status: "Completed" }
            ]}
        />
    );
}
