import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function MegaMenu({
    activeMenu,
    closeMenu,
    leftOffset = 210,
    onMouseEnter,
    onMouseLeave
}) {
    // =========================================
    // PM MENU (EXACT MATCH FOR V-CONNECT INC. SCREENSHOT)
    // =========================================
    const pmMenu = [
        {
            title: "PRODUCTION",
            items: [
                { label: "Cutting Slip", path: "/pm/cutting-slip" },
                { label: "Cutting Slip Printing", path: "/pm/cutting-slip-printing" },
                { label: "Delivery Note", path: "/pm/delivery-note" },
                { label: "Finished Goods Transfer Note", path: "/pm/finished-goods-transfer-note" },
                { label: "Man Hours", path: "/pm/man-hours" },
                { label: "Daily Production Target", path: "/pm/daily-production-target", sectionBreak: true },
                { label: "Line Output With Size", path: "/pm/line-output-with-size" },
                { label: "Display Board", path: "/pm/display-board" },
                { label: "Line Balancing Report", path: "/pm/line-balancing-report" },
                { label: "Hourly Production Report V2", path: "/pm/hourly-production-report-v2" }
            ]
        },
        {
            title: "PRODUCTION WIP",
            items: [
                { label: "Line Output By Style", path: "/pm/line-output-by-style" }
            ]
        },
        {
            title: "SUBCONTRACT",
            items: [
                { label: "Subcontract Order/DC", path: "/pm/subcontract-order-dc" },
                { label: "Subcontract GRN", path: "/pm/subcontract-grn" },
                { label: "Subcontract Material Conversion DC", path: "/pm/subcontract-material-conversion-dc" },
                { label: "Subcontract Order Approval", path: "/pm/subcontract-order-approval" },
                { label: "Subcontract Conversion Approval", path: "/pm/subcontract-conversion-approval", sectionBreak: true },
                { label: "Subcontract PO", path: "/pm/subcontract-po" },
                { label: "Subcontract PO Approval", path: "/pm/subcontract-po-approval" }
            ]
        },
        {
            title: "COMPONENT",
            items: [
                { label: "Component Cutting Plan", path: "/pm/component-cutting-plan" },
                { label: "Link RFID for Components", path: "/pm/link-rfid-components" },
                { label: "Treatment Output Tracking", path: "/pm/treatment-output-tracking" },
                { label: "Treatment Output Tracking", path: "/pm/treatment-output-tracking-2" },
                { label: "Supermarket to Treatment", path: "/pm/supermarket-to-treatment" },
                { label: "Supermarket Inward", path: "/pm/supermarket-inward", sectionBreak: true },
                { label: "Supermarket to Stitching", path: "/pm/supermarket-to-stitching" },
                { label: "Treatment Sub Process Output", path: "/pm/treatment-sub-process-output" },
                { label: "RFID Details", path: "/pm/rfid-details" },
                { label: "Component Checklist", path: "/pm/component-checklist" }
            ],
            bottomCard: {
                label: "Cutting sticker for component checklist",
                path: "/pm/cutting-sticker-component-checklist"
            }
        }
    ];

    // =========================================
    // MM MENU (MATERIAL MANAGEMENT)
    // =========================================
    const mmMenu = [
        {
            title: "PURCHASE",
            items: [
                { label: "Indent", path: "/indents" },
                { label: "Purchase Requisition", path: "/purchase-requisition" },
                { label: "Purchase Order", path: "/purchase-orders" },
                { label: "Pending PO", path: "/pending-po" },
                { label: "Requirement to PO", path: "/requirement-to-po" },
                { label: "Purchase Return", path: "/purchase-return" }
            ]
        },
        {
            title: "INVENTORY",
            items: [
                { label: "Stock Indent", path: "/stock-indent" },
                { label: "Indent Approval", path: "/indent-approval" },
                { label: "Item Receipt (GRN)", path: "/grn" },
                { label: "Gate Entry", path: "/gate-entry" },
                { label: "Item Issue", path: "/stock-issues" },
                { label: "Floor Return", path: "/floor-return" },
                { label: "Store Transfer", path: "/stock-transfer" },
                { label: "Gate Pass Delivery", path: "/gate-pass-delivery" },
                { label: "Item Requisition", path: "/item-requisition" },
                { label: "Gate Pass GRN", path: "/gate-pass-grn" },
                { label: "Stock Transfer DC", path: "/stock-transfer-dc" },
                { label: "Stock Transfer GRN", path: "/stock-transfer-grn" },
                { label: "GRN HandOver", path: "/grn-handover" }
            ]
        },
        {
            title: "QUALITY CONTROL",
            items: [
                { label: "Incoming Material Inspection", path: "/incoming-material-inspection" },
                { label: "Final Inspection", path: "/final-inspection" },
                { label: "Rejection Return", path: "/rejection-return" }
            ]
        },
        {
            title: "MRP",
            items: [
                { label: "Material Planning", path: "/material-planning" },
                { label: "Requirement to PO", path: "/requirement-to-po" },
                { label: "Stock Conversion", path: "/stock-conversion" },
                { label: "MRP Report", path: "/mrp-report" }
            ]
        }
    ];

    // =========================================
    // SM MENU (STYLE & SALES MANAGEMENT)
    // =========================================
    const smMenu = [
        {
            title: "STYLE MANAGEMENT",
            items: [
                { label: "Style Master", path: "/style-master" },
                { label: "Tech Sheet", path: "/tech-sheets" }
            ]
        },
        {
            title: "SAMPLES",
            items: [
                { label: "Sample FTN", path: "/sm/sample-ftn" }
            ]
        },
        {
            title: "SALES",
            items: [
                { label: "Proforma Invoice", path: "/sm/proforma-invoice" },
                { label: "Sales Order", path: "/sales-orders" },
                { label: "Sales Invoice Cum DC", path: "/sm/sales-invoice-cum-dc" },
                { label: "Internal Order", path: "/internal-orders" },
                { label: "Item Issue", path: "/stock-issues" },
                { label: "Sales Invoice", path: "/sales-invoices" },
                { label: "IO RMR Recalculate", path: "/sm/io-rmr-recalculate" },
                { label: "Projection Order", path: "/sm/projection-order" }
            ]
        },
        {
            title: "T AND A",
            items: [
                { label: "Task Delay Analysis Report", path: "/sm/task-delay-analysis" }
            ]
        }
    ];

    // =========================================
    // ADMIN MENU
    // =========================================
    const adminMenu = [
        {
            title: "MASTER",
            items: [
                { label: "Company Master", path: "/company-master" },
                { label: "Item Master", path: "/master/items" },
                { label: "Colour Master", path: "/master/colours" },
                { label: "Supplier Master", path: "/master/suppliers" },
                { label: "Buyer Master", path: "/buyers" },
                { label: "Customer Master", path: "/customers" },
                { label: "Employee Master", path: "/employees" },
                { label: "Department Master", path: "/departments" },
                { label: "Warehouse Master", path: "/warehouses" }
            ]
        },
        {
            title: "SYSTEM",
            items: [
                { label: "Users", path: "/users" },
                { label: "Roles & Permissions", path: "/roles-permissions" }
            ]
        }
    ];

    // =========================================
    // FM MENU (FINANCE MODULE)
    // =========================================
    const fmMenu = [
        {
            title: "FINANCE",
            items: [
                { label: "Debit Note Advice", path: "/fm/debit-note-advice" }
            ]
        },
        {
            title: "EXPORTS",
            items: [
                { label: "Proforma Invoice", path: "/fm/proforma-invoice" }
            ]
        }
    ];

    // =========================================
    // EXPORTS MENU (EXACT MATCH FOR V-CONNECT INC. SCREENSHOT)
    // =========================================
    const exportsMenu = [
        {
            title: "TRANSACTION",
            items: [
                { label: "Commercial Invoice", path: "/commercial-invoice" }
            ]
        }
    ];

    // =========================================
    // REPORTS MENU
    // =========================================
    const reportsMenu = [
        {
            title: "INVENTORY REPORTS",
            items: [
                { label: "Stock Ledger", path: "/stock-ledger" },
                { label: "Stock Summary", path: "/stock-summary" },
                { label: "Low Stock", path: "/low-stock" },
                { label: "Finished Goods Stock", path: "/finished-goods-stock" }
            ]
        },
        {
            title: "PURCHASE REPORTS",
            items: [
                { label: "Requirement to PO", path: "/requirement-to-po" },
                { label: "Pending PO", path: "/pending-po" },
                { label: "Purchase Report", path: "/purchase-report" },
                { label: "GRN Report", path: "/grn-report" }
            ]
        },
        {
            title: "PRODUCTION REPORTS",
            items: [
                { label: "Production Report", path: "/production-report" },
                { label: "WIP Report", path: "/wip-report" },
                { label: "Production Costing", path: "/production-costing" }
            ]
        },
        {
            title: "SALES REPORTS",
            items: [
                { label: "Sales Report", path: "/sales-report" },
                { label: "Dispatch Report", path: "/dispatch-report" },
                { label: "Customer Outstanding", path: "/customer-outstanding" }
            ]
        }
    ];

    // Select active menu columns
    let columns = [];
    switch (activeMenu) {
        case "SM":
            columns = smMenu;
            break;
        case "MM":
            columns = mmMenu;
            break;
        case "PM":
            columns = pmMenu;
            break;
        case "EXPORTS":
            columns = exportsMenu;
            break;
        case "FM":
            columns = fmMenu;
            break;
        case "ADMIN":
            columns = adminMenu;
            break;
        case "REPORTS":
            columns = reportsMenu;
            break;
        default:
            columns = [];
    }

    const [menuSearch, setMenuSearch] = useState("");

    // Dynamic search filtering
    const filteredColumns = columns.map(col => {
        if (!menuSearch.trim()) return col;
        const matchingItems = (col.items || []).filter(item =>
            item.label.toLowerCase().includes(menuSearch.toLowerCase())
        );
        const matchCard = col.bottomCard && col.bottomCard.label.toLowerCase().includes(menuSearch.toLowerCase());
        return {
            ...col,
            items: matchingItems,
            hasMatchCard: matchCard
        };
    }).filter(col => !menuSearch.trim() || col.items.length > 0 || col.hasMatchCard);

    // Compute left style dynamically based on menu width
    const menuWidth = activeMenu === "EXPORTS" ? 220 : activeMenu === "FM" ? 320 : 870;
    const containerStyle = leftOffset != null
        ? { left: `min(${leftOffset}px, calc(100vw - ${menuWidth + 16}px))` }
        : {};

    return (
        <div
            className={`mega-menu-container mega-menu-${(activeMenu || "").toLowerCase()}`}
            style={containerStyle}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {/* Top Search Bar */}
            <div className="mega-menu-search-wrapper">
                <div className="mega-menu-search-bar">
                    <FaSearch className="mega-menu-search-icon" />
                    <input
                        type="text"
                        placeholder="Search menu..."
                        value={menuSearch}
                        onChange={(e) => setMenuSearch(e.target.value)}
                        className="mega-menu-search-field"
                        autoFocus
                    />
                </div>
            </div>

            {/* Columns Grid matching V-Connect screenshot */}
            <div
                className="mega-menu-inner"
                style={{
                    gridTemplateColumns: filteredColumns.length > 0
                        ? `repeat(${filteredColumns.length}, minmax(0, 1fr))`
                        : "1fr"
                }}
            >
                {filteredColumns.map((column, index) => (
                    <div
                        className="mega-menu-column"
                        key={`${column.title}-${index}`}
                    >
                        {/* COLUMN HEADER WITH BLUE ACCENT */}
                        <div className="mega-menu-title-header">
                            <span className="mega-menu-accent-bar" />
                            <span className="mega-menu-title-text">{column.title}</span>
                        </div>

                        {/* MENU ITEMS AS CARDS */}
                        <div className="mega-menu-items-list">
                            {column.items.map((item, itemIdx) => (
                                <React.Fragment key={`${item.label}-${itemIdx}`}>
                                    {item.sectionBreak && <div className="mega-menu-section-gap" />}
                                    <Link
                                        to={item.path}
                                        className="mega-menu-item-card"
                                        onClick={closeMenu}
                                    >
                                        <span className="mega-menu-chevron">›</span>
                                        <span className="mega-menu-item-text">{item.label}</span>
                                    </Link>
                                </React.Fragment>
                            ))}
                        </div>

                        {/* BOTTOM CARD (Cutting sticker for component checklist) */}
                        {column.bottomCard && (!menuSearch.trim() || column.bottomCard.label.toLowerCase().includes(menuSearch.toLowerCase())) && (
                            <div className="mega-menu-bottom-wrapper">
                                <Link
                                    to={column.bottomCard.path}
                                    className="mega-menu-item-card mega-menu-bottom-card"
                                    onClick={closeMenu}
                                >
                                    <span className="mega-menu-chevron">›</span>
                                    <span className="mega-menu-item-text">{column.bottomCard.label}</span>
                                </Link>
                            </div>
                        )}
                    </div>
                ))}

                {filteredColumns.length === 0 && (
                    <div className="mega-menu-empty">
                        No menu items found matching "{menuSearch}"
                    </div>
                )}
            </div>
        </div>
    );
}