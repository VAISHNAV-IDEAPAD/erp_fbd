import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaBoxes,
    FaSearch,
    FaArrowRight,
    FaWarehouse,
    FaClipboardList,
    FaCheckCircle,
    FaQrcode,
    FaFileInvoice,
    FaCogs
} from "react-icons/fa";
import "../../styles/wms.css";

const MM_COLUMNS = [
    {
        title: "PURCHASE",
        icon: <FaFileInvoice style={{ color: "#004fb6" }} />,
        items: [
            { label: "Indent", path: "/indents", desc: "Material & department purchase indent" },
            { label: "Stock Indent", path: "/stock-indent", desc: "Internal store stock indent" },
            { label: "Rejection Return", path: "/rejection-return", desc: "Return rejected material to vendor" },
            { label: "Indent Approval", path: "/indent-approval", desc: "Management approval workflow" },
            { label: "Purchase Order", path: "/purchase-orders", desc: "PO generation and tracking" },
            { label: "Purchase Return", path: "/purchase-return", desc: "Debit note & supplier returns" }
        ]
    },
    {
        title: "INVENTORY",
        icon: <FaBoxes style={{ color: "#004fb6" }} />,
        items: [
            { label: "Scan QR Code", path: "/inventory/scan-qr-code", desc: "Optical QR/Barcode lookup" },
            { label: "Item Receipt (GRN)", path: "/item-receipt", desc: "Inward Goods Receipt Note" },
            { label: "Gate Entry", path: "/gate-entry", desc: "Security vehicle and challan inward" },
            { label: "Item Requisition Note", path: "/item-requisitions", desc: "Floor material request note" },
            { label: "Item Requisition Note Approval", path: "/item-requisition-approval", desc: "Requisition sign-off" },
            { label: "Item Issue", path: "/stock-issues", desc: "Direct stock dispatch to lines" },
            { label: "Floor Return", path: "/floor-return", desc: "Unused production floor return" },
            { label: "Store Transfer", path: "/stock-transfer", desc: "Inter-store warehouse transfer" },
            { label: "Gate Pass Delivery Note", path: "/gate-pass-delivery", desc: "Outward DC and delivery note" },
            { label: "Gate Pass GRN", path: "/gate-pass-grn", desc: "Linked GP inward verification" },
            { label: "Stock Transfer DC", path: "/stock-transfer-dc", desc: "Inter-branch delivery challan" },
            { label: "Stock Transfer GRN", path: "/stock-transfer-grn", desc: "Branch receipt verification" },
            { label: "Stock Adjustment Receipt", path: "/stock-adjustment-receipt", desc: "Audit physical count adjustment" }
        ]
    },
    {
        title: "QC (QUALITY CONTROL)",
        icon: <FaCheckCircle style={{ color: "#004fb6" }} />,
        items: [
            { label: "Incoming Material Inspection", path: "/incoming-material-inspection", desc: "Fabric & leather QA inspection" }
        ]
    },
    {
        title: "WMS (WAREHOUSE MANAGEMENT)",
        icon: <FaWarehouse style={{ color: "#004fb6" }} />,
        items: [
            { label: "Bin Allocation", path: "/wms/bin-allocation", desc: "Put-away stock into designated bins" },
            { label: "Roll OR Serial Num. Generation", path: "/wms/roll-serial-generation", desc: "Roll ID, barcode & hide serials" },
            { label: "WMS Stock Import", path: "/wms/stock-import", desc: "Bulk CSV/Excel bin stock import" },
            { label: "Issue from Bin", path: "/wms/issue-from-bin", desc: "Pick list & bin stock deduction" },
            { label: "Print Binning Slip", path: "/wms/print-binning-slip", desc: "Put-away slips & rack QR stickers" },
            { label: "Bin", path: "/wms/bins", desc: "Bin Master & interactive rack heatmap" }
        ]
    },
    {
        title: "INVENTORY (CONVERSION)",
        icon: <FaCogs style={{ color: "#004fb6" }} />,
        items: [
            { label: "Stock Conversion", path: "/stock-conversion", desc: "Raw material to finished SKU conversion" }
        ]
    },
    {
        title: "MRP (MATERIAL PLANNING)",
        icon: <FaClipboardList style={{ color: "#004fb6" }} />,
        items: [
            { label: "Material Planning", path: "/material-planning", desc: "BOM requirements & shortage analysis" }
        ]
    }
];

export default function MMHub() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredColumns = MM_COLUMNS.map((col) => {
        const matching = col.items.filter((item) =>
            item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            col.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return { ...col, items: matching };
    }).filter((col) => col.items.length > 0);

    return (
        <div style={{ backgroundColor: "#f8fafc", minHeight: "calc(100vh - 65px)", padding: "20px 28px 60px 28px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "14px" }}>
                <div>
                    <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0" }}>
                        Material Management (MM) Modules
                    </h1>
                    <p style={{ margin: 0, fontSize: "12.5px", color: "#64748b" }}>
                        All 27 Material Management, Warehouse, Quality Control & Inventory Modules (Plot No. 9B)
                    </p>
                </div>

                <div style={{ width: "320px", position: "relative" }}>
                    <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input
                        type="text"
                        placeholder="Search all MM modules..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            height: "36px",
                            paddingLeft: "36px",
                            paddingRight: "12px",
                            border: "1px solid #cbd5e1",
                            borderRadius: "18px",
                            fontSize: "13px",
                            outline: "none",
                            backgroundColor: "#ffffff"
                        }}
                    />
                </div>
            </div>

            {/* Grid of Columns matching V-Connect Inc. MegaMenu */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                {filteredColumns.map((col) => (
                    <div
                        key={col.title}
                        style={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                            overflow: "hidden"
                        }}
                    >
                        {/* Section Header */}
                        <div
                            style={{
                                backgroundColor: "#f1f5fb",
                                padding: "10px 14px",
                                borderBottom: "2px solid #004fb6",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px"
                            }}
                        >
                            {col.icon}
                            <h3 style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#004fb6", textTransform: "uppercase", letterSpacing: "0.3px" }}>
                                {col.title} ({col.items.length})
                            </h3>
                        </div>

                        {/* List of items */}
                        <div style={{ padding: "10px" }}>
                            {col.items.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "8px 12px",
                                        borderRadius: "4px",
                                        marginBottom: "4px",
                                        backgroundColor: "#f8fafc",
                                        textDecoration: "none",
                                        color: "#1e293b",
                                        transition: "all 0.15s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "#e0ecfd";
                                        e.currentTarget.style.color = "#004fb6";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "#f8fafc";
                                        e.currentTarget.style.color = "#1e293b";
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: "13px" }}>
                                            <span style={{ color: "#1976d2", marginRight: "6px" }}>›</span>
                                            {item.label}
                                        </div>
                                        <div style={{ fontSize: "11px", color: "#64748b", marginLeft: "14px" }}>
                                            {item.desc}
                                        </div>
                                    </div>
                                    <FaArrowRight style={{ fontSize: "11px", opacity: 0.6 }} />
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
