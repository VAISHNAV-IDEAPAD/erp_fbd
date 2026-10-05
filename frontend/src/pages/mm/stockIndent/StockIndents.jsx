import React from "react";
import MMModuleView from "../../../components/common/MMModuleView";

export default function StockIndents() {
    return (
        <MMModuleView
            title="Stock Indents"
            moduleName="StockIndents"
            apiEndpoint="/api/indents"
            initialSampleData={[
                { id: 1, DocNo: "IND-1001", DocDate: "2026-10-01", Department: "Cutting", ItemName: "Cotton Twill 220 GSM", Quantity: 500, Status: "Approved" },
                { id: 2, DocNo: "IND-1002", DocDate: "2026-10-03", Department: "Sewing", ItemName: "Nylon Thread 40/2", Quantity: 120, Status: "Pending" }
            ]}
        />
    );
}
