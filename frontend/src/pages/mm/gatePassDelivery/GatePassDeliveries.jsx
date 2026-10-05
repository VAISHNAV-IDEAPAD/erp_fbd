import React from "react";
import MMModuleView from "../../../components/common/MMModuleView";

export default function GatePassDeliveries() {
    return (
        <MMModuleView
            title="Gate Pass Deliveries (Outward)"
            moduleName="GatePassDeliveries"
            columns={[
                { key: "DocNo", label: "Gate Pass #" },
                { key: "DocDate", label: "Date" },
                { key: "Department", label: "Carrier / Vehicle" },
                { key: "ItemName", label: "Consignee / Destination" },
                { key: "Quantity", label: "Cartons / Qty" },
                { key: "Status", label: "Status" }
            ]}
            initialSampleData={[
                { id: 1, DocNo: "GPO-701", DocDate: "2026-10-04", Department: "TATA 407 (HR-55-A-1122)", ItemName: "Global Exports Ltd (Port Warehouse)", Quantity: 120, Status: "Completed" }
            ]}
        />
    );
}
