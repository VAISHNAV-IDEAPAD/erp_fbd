import React from "react";
import MMModuleView from "../../../components/common/MMModuleView";

export default function MaterialPlanning() {
    return (
        <MMModuleView
            title="Material Requirement Planning (MRP)"
            moduleName="MaterialPlanning"
            columns={[
                { key: "DocNo", label: "Plan #" },
                { key: "DocDate", label: "Plan Date" },
                { key: "Department", label: "Target Style / BOM" },
                { key: "ItemName", label: "Required Material" },
                { key: "Quantity", label: "Net Demand" },
                { key: "Status", label: "Plan Status" }
            ]}
            initialSampleData={[
                { id: 1, DocNo: "MRP-2026-10", DocDate: "2026-10-05", Department: "Slim Fit Shirt (ST-01)", ItemName: "Oxford Cotton 100%", Quantity: 3200, Status: "Approved" },
                { id: 2, DocNo: "MRP-2026-11", DocDate: "2026-10-05", Department: "Chino Pants (ST-02)", ItemName: "Cotton Twill Khaki", Quantity: 2100, Status: "In Progress" }
            ]}
        />
    );
}
