import { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight, FaSearch } from "react-icons/fa";

export default function MegaMenu({
    activeMenu,
    closeMenu
}) {

    // =========================================
    // MM MENU
    // =========================================

    const mmMenu = [

        {
            title: "PURCHASE",

            items: [
                {
                    label: "Indent",
                    path: "/indents"
                },
                {
                    label: "Purchase Requisition",
                    path: "/purchase-requisition"
                },
                {
                    label: "Purchase Order",
                    path: "/purchase-orders"
                },
                {
                    label: "Pending PO",
                    path: "/pending-po"
                },
                {
                    label: "GRN",
                    path: "/grn"
                },
                {
                    label: "Purchase Return",
                    path: "/purchase-return"
                }
            ]
        },

        {
            title: "INVENTORY",

            items: [
                {
                    label: "Stock Indent",
                    path: "/stock-indent"
                },
                {
                    label: "Indent Approval",
                    path: "/indent-approval"
                },
                {
                    label: "Item Receipt (GRN)",
                    path: "/grn"
                },
                {
                    label: "Gate Entry",
                    path: "/gate-entry"
                },
                {
                    label: "Item Issue",
                    path: "/stock-issues"
                },
                {
                    label: "Floor Return",
                    path: "/floor-return"
                },
                {
                    label: "Store Transfer",
                    path: "/stock-transfer"
                },
                {
                    label: "Gate Pass Delivery",
                    path: "/gate-pass-delivery"
                },
                {
                    label: "Item Requisition",
                    path: "/item-requisition"
                },
                {
                    label: "Gate Pass GRN",
                    path: "/gate-pass-grn"
                },
                {
                    label: "Stock Transfer DC",
                    path: "/stock-transfer-dc"
                },
                {
                    label: "Stock Transfer GRN",
                    path: "/stock-transfer-grn"
                },
                {
                    label: "GRN HandOver",
                    path: "/grn-handover"
                }
            ]
        },

        {
            title: "QUALITY CONTROL",

            items: [
                {
                    label: "Incoming Material Inspection",
                    path: "/incoming-material-inspection"
                },
                {
                    label: "Final Inspection",
                    path: "/final-inspection"
                },
                {
                    label: "Rejection Return",
                    path: "/rejection-return"
                }
            ]
        },

        {
            title: "MRP",

            items: [
                {
                    label: "Material Planning",
                    path: "/material-planning"
                },
                {
                    label: "Stock Conversion",
                    path: "/stock-conversion"
                },
                {
                    label: "MRP Report",
                    path: "/mrp-report"
                }
            ]
        }

    ];


    // =========================================
    // SM MENU (SALES MANAGEMENT)
    // =========================================

    const smMenu = [
        {
            title: "STYLE MANAGEMENT",

            items: [
                {
                    label: "Style Master",
                    path: "/style-master"
                },
                {
                    label: "Tech Sheet",
                    path: "/tech-sheets"
                }
            ]
        },

        {
            title: "SAMPLES",

            items: [
                {
                    label: "Sample FTN",
                    path: "/sm/sample-ftn"
                }
            ]
        },
        {
            title: "SALES",
            items: [
                {
                    label: "Proforma Invoice",
                    path: "/sm/proforma-invoice"
                },
                {
                    label: "Sales Order",
                    path: "/sales-orders"
                },
                {
                    label: "Sales Invoice Cum DC",
                    path: "/sm/sales-invoice-cum-dc"
                },
                {
                    label: "Internal Order",
                    path: "/internal-orders"
                },
                {
                    label: "Item Issue",
                    path: "/stock-issues"
                },
                {
                    label: "Sales Invoice",
                    path: "/sales-invoices"
                },
                {
                    label: "IO RMR Recalculate",
                    path: "/sm/io-rmr-recalculate"
                },
                {
                    label: "Projection Order",
                    path: "/sm/projection-order"
                }
            ]
        },
        {
            title: "T AND A",
            items: [
                {
                    label: "Task Delay Analysis Report",
                    path: "/sm/task-delay-analysis"
                }
            ]
        }
    ];


    // =========================================
    // PM MENU
    // =========================================

    const pmMenu = [

        {
            title: "PRODUCTION",

            items: [
                {
                    label: "Production Order",
                    path: "/production-orders"
                },
                {
                    label: "Material Issue",
                    path: "/material-issues"
                },
                {
                    label: "Production Receipt",
                    path: "/production-receipts"
                },
                {
                    label: "Production Operations",
                    path: "/production-operations"
                }
            ]
        },

        {
            title: "BOM",

            items: [
                {
                    label: "BOM",
                    path: "/bom"
                },
                {
                    label: "BOM Details",
                    path: "/bom-details"
                },
                {
                    label: "Material Consumption",
                    path: "/material-consumption"
                }
            ]
        },

        {
            title: "COSTING",

            items: [
                {
                    label: "Production Costing",
                    path: "/production-costing"
                }
            ]
        }

    ];


    // =========================================
    // ADMIN MENU
    // =========================================

    const adminMenu = [

        // ---------------------------------------
        // MASTER
        // ---------------------------------------

        {
            title: "MASTER",

            items: [
                {
                    label: "Company Master",
                    path: "/company-master"
                },
                {
                    label: "Item Master",
                    path: "/master/items"
                },
                {
                    label: "Colour Master",
                    path: "/master/colours"
                },
                {
                    label: "Supplier Master",
                    path: "/master/suppliers"
                },
                {
                    label: "Buyer Master",
                    path: "/buyers"
                },
                {
                    label: "Customer Master",
                    path: "/customers"
                },
                {
                    label: "Employee Master",
                    path: "/employees"
                },
                {
                    label: "Department Master",
                    path: "/departments"
                },
                {
                    label: "Style Master",
                    path: "/styles"
                },
                {
                    label: "Warehouse Master",
                    path: "/warehouses"
                }
            ]
        },


        // ---------------------------------------
        // SYSTEM
        // ---------------------------------------

        {
            title: "SYSTEM",

            items: [
                {
                    label: "Users",
                    path: "/users"
                },
                {
                    label: "Roles & Permissions",
                    path: "/roles-permissions"
                }
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
                {
                    label: "Stock Ledger",
                    path: "/stock-ledger"
                },
                {
                    label: "Stock Summary",
                    path: "/stock-summary"
                },
                {
                    label: "Low Stock",
                    path: "/low-stock"
                },
                {
                    label: "Finished Goods Stock",
                    path: "/finished-goods-stock"
                }
            ]
        },

        {
            title: "PURCHASE REPORTS",

            items: [
                {
                    label: "Pending PO",
                    path: "/pending-po"
                },
                {
                    label: "Purchase Report",
                    path: "/purchase-report"
                },
                {
                    label: "GRN Report",
                    path: "/grn-report"
                }
            ]
        },

        {
            title: "PRODUCTION REPORTS",

            items: [
                {
                    label: "Production Report",
                    path: "/production-report"
                },
                {
                    label: "WIP Report",
                    path: "/wip-report"
                },
                {
                    label: "Production Costing",
                    path: "/production-costing"
                }
            ]
        },

        {
            title: "SALES REPORTS",

            items: [
                {
                    label: "Sales Report",
                    path: "/sales-report"
                },
                {
                    label: "Dispatch Report",
                    path: "/dispatch-report"
                },
                {
                    label: "Customer Outstanding",
                    path: "/customer-outstanding"
                }
            ]
        }

    ];


    // =========================================
    // SELECT MENU
    // =========================================

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

    const filteredColumns = columns.map(col => {
        if (!menuSearch.trim()) return col;
        const matchingItems = col.items.filter(item =>
            item.label.toLowerCase().includes(menuSearch.toLowerCase())
        );
        return {
            ...col,
            items: matchingItems
        };
    }).filter(col => !menuSearch.trim() || col.items.length > 0);

    // =========================================
    // RENDER
    // =========================================

    return (
        <div className="mega-menu-container">
            <div style={{ padding: "8px 0 12px 0", maxWidth: "380px" }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #b9cbe3",
                    borderRadius: "18px",
                    padding: "5px 12px",
                    background: "#ffffff"
                }}>
                    <FaSearch style={{ color: "#6c7d93", fontSize: "12px", marginRight: "8px" }} />
                    <input
                        type="text"
                        placeholder="Search menu..."
                        value={menuSearch}
                        onChange={(e) => setMenuSearch(e.target.value)}
                        style={{
                            border: "none",
                            background: "transparent",
                            outline: "none",
                            width: "100%",
                            fontSize: "13px",
                            color: "#222"
                        }}
                    />
                </div>
            </div>

            <div
                className="mega-menu-inner"
                style={{
                    gridTemplateColumns: filteredColumns.length === 3 
                        ? "repeat(3, minmax(0, 1fr))" 
                        : (filteredColumns.length > 0 ? `repeat(${filteredColumns.length}, minmax(0, 1fr))` : "repeat(3, minmax(0, 1fr))")
                }}
            >
                {filteredColumns.map((column, index) => (
                    <div
                        className="mega-menu-column"
                        key={`${column.title}-${index}`}
                    >
                        {/* COLUMN TITLE */}
                        <div className="mega-menu-title">
                            {column.title}
                        </div>

                        {/* MENU ITEMS */}
                        {column.items.map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                className="mega-menu-item"
                                onClick={closeMenu}
                            >
                                <FaChevronRight
                                    className="mega-menu-arrow"
                                />
                                <span>
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                ))}

                {filteredColumns.length === 0 && (
                    <div style={{ padding: "20px", color: "#666", gridColumn: "1 / -1" }}>
                        No menu items found matching "{menuSearch}"
                    </div>
                )}
            </div>
        </div>
    );
}