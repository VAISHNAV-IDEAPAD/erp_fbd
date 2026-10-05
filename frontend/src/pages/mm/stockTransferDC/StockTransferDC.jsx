import React from "react";
import MMModuleView from "../../../components/common/MMModuleView";

export default function StockTransferDC() {
    return (
        <MMModuleView
            title="Stock Transfer Delivery Challan (DC)"
            moduleName="StockTransferDC"
            columns={[
                { key: "DocNo", label: "DC #" },
                { key: "DocDate", label: "DC Date" },
                { key: "Department", label: "Dispatch Branch" },
                { key: "ItemName", label: "Receiving Unit" },
                { key: "Quantity", label: "Packages" },
                { key: "Status", label: "Status" }
            ]}
            initialSampleData={[
                { id: 1, DocNo: "DC-2026-01", DocDate: "2026-10-04", Department: "Plant 1 (Faridabad)", ItemName: "Unit 2 (Manesar)", Quantity: 60, Status: "Approved" }
            ]}
        />
    );
}
