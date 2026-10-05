import React from "react";
import MMModuleView from "../../../components/common/MMModuleView";

export default function StoreTransfers() {
    return (
        <MMModuleView
            title="Store Transfers"
            moduleName="StoreTransfers"
            columns={[
                { key: "DocNo", label: "Transfer #" },
                { key: "DocDate", label: "Date" },
                { key: "Department", label: "Source Godown" },
                { key: "ItemName", label: "Destination Godown" },
                { key: "Quantity", label: "Transferred Qty" },
                { key: "Status", label: "Status" }
            ]}
            initialSampleData={[
                { id: 1, DocNo: "TR-881", DocDate: "2026-10-03", Department: "Central Warehouse", ItemName: "Sewing Floor Store", Quantity: 400, Status: "Approved" }
            ]}
        />
    );
}
