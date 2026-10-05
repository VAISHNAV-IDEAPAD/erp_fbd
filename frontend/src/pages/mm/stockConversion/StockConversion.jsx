import React from "react";
import MMModuleView from "../../../components/common/MMModuleView";

export default function StockConversion() {
    return (
        <MMModuleView
            title="Stock Conversion (UOM / State)"
            moduleName="StockConversion"
            columns={[
                { key: "DocNo", label: "Conversion #" },
                { key: "DocDate", label: "Date" },
                { key: "Department", label: "From (UOM/Item)" },
                { key: "ItemName", label: "To (UOM/Item)" },
                { key: "Quantity", label: "Converted Qty" },
                { key: "Status", label: "Status" }
            ]}
            initialSampleData={[
                { id: 1, DocNo: "CNV-01", DocDate: "2026-10-03", Department: "Greige Fabric (Mtrs)", ItemName: "Dyed Fabric (Mtrs)", Quantity: 1000, Status: "Completed" }
            ]}
        />
    );
}
