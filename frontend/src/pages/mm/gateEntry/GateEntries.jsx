import React from "react";
import MMModuleView from "../../../components/common/MMModuleView";

export default function GateEntries() {
    return (
        <MMModuleView
            title="Gate Entry (Security Inward)"
            moduleName="GateEntries"
            columns={[
                { key: "DocNo", label: "Gate Pass #" },
                { key: "DocDate", label: "Date & Time" },
                { key: "Department", label: "Vehicle No" },
                { key: "ItemName", label: "Material / Supplier" },
                { key: "Quantity", label: "Challan Qty" },
                { key: "Status", label: "Status" }
            ]}
            initialSampleData={[
                { id: 1, DocNo: "GP-901", DocDate: "2026-10-05 09:30", Department: "HR-38-AB-1234", ItemName: "Raw Cotton - Vardhman Mills", Quantity: 240, Status: "Approved" },
                { id: 2, DocNo: "GP-902", DocDate: "2026-10-05 14:15", Department: "DL-1C-XY-9876", ItemName: "Labels & Tags - BrandPak", Quantity: 10000, Status: "Approved" }
            ]}
        />
    );
}
