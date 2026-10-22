import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaTimes,
    FaMagic,
    FaLock,
    FaUpload,
    FaInfoCircle,
    FaRegFilePdf,
    FaCheckCircle,
    FaSpinner,
    FaFileInvoiceDollar
} from "react-icons/fa";
import "../../../styles/salesOrderPdfImport.css";

export default function SalesOrderPdfImport() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [extracting, setExtracting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [extractedOrder, setExtractedOrder] = useState(null);

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile && droppedFile.type === "application/pdf") {
            setFile(droppedFile);
            setExtractedOrder(null);
        } else {
            alert("Please upload a PDF file.");
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setExtractedOrder(null);
        }
    };

    // AI Extraction trigger
    const handleExtract = () => {
        if (!file) {
            alert("Please select or drop a customer Sales Order PDF first.");
            return;
        }

        setExtracting(true);
        setCurrentStep(2);

        setTimeout(() => {
            setCurrentStep(3);
            setTimeout(() => {
                setCurrentStep(4);
                setExtracting(false);
                setExtractedOrder({
                    customerName: "Zara Retail Apparel (Inditex Group)",
                    customerPo: "PO-ZRA-2026-9021",
                    orderDate: "20-10-2026",
                    deliveryDate: "15-11-2026",
                    currency: "USD",
                    season: "SS27",
                    totalQty: "5,000 PCS",
                    totalValue: "$ 48,500.00",
                    items: [
                        { line: 1, style: "M-CAS-SHIRT-01", description: "Men's Oxford Cotton Casual Shirt", colour: "Navy Blue", sizeBreakdown: "S: 500, M: 1500, L: 2000, XL: 1000", qty: "5,000 PCS", unitPrice: "$ 9.70", total: "$ 48,500.00", matched: true }
                    ]
                });
            }, 800);
        }, 900);
    };

    return (
        <div className="so-pdf-page">
            {/* Top Navigation Bar: Breadcrumb + Close Button */}
            <div className="so-pdf-top-bar">
                <div className="so-pdf-breadcrumb">
                    <FaRegFilePdf style={{ color: "#3b82f6", fontSize: "15px" }} />
                    <Link to="/sales-orders" className="so-pdf-crumb-parent">Sales Order</Link>
                    <span className="so-pdf-crumb-sep">—</span>
                    <span className="so-pdf-crumb-current">PDF Import</span>
                </div>

                <button
                    type="button"
                    className="so-pdf-btn-close"
                    onClick={() => navigate("/sales-orders")}
                >
                    <FaTimes style={{ fontSize: "11px" }} />
                    <span>Close</span>
                </button>
            </div>

            {/* Hero AI Sales Order Extraction Banner */}
            <div className="so-pdf-hero">
                <div className="so-pdf-hero-left">
                    <div className="so-pdf-hero-icon-box">
                        <FaMagic />
                    </div>
                    <div>
                        <div className="so-pdf-hero-title-row">
                            <h2 className="so-pdf-hero-title">AI Sales Order Extraction</h2>
                            <span className="so-pdf-beta-badge">BETA</span>
                        </div>
                        <p className="so-pdf-hero-sub">
                            Upload your customer's Sales Order PDF. Our AI will read, extract, and map the order details against your masters — ready to create a new Sales Order.
                        </p>
                    </div>
                </div>

                {/* Steps Horizontal Row */}
                <div className="so-pdf-steps-row">
                    <span className={`so-pdf-step-pill ${currentStep === 1 ? "so-pdf-step-active" : "so-pdf-step-inactive"}`}>
                        1 Upload PDF
                    </span>
                    <span className={`so-pdf-step-pill ${currentStep === 2 ? "so-pdf-step-active" : "so-pdf-step-inactive"}`}>
                        2 AI Extracts Fields
                    </span>
                    <span className={`so-pdf-step-pill ${currentStep === 3 ? "so-pdf-step-active" : "so-pdf-step-inactive"}`}>
                        3 Match Masters
                    </span>
                    <span className={`so-pdf-step-pill ${currentStep === 4 ? "so-pdf-step-active" : "so-pdf-step-inactive"}`}>
                        4 Review &amp; Save
                    </span>
                </div>
            </div>

            {/* Permission Warning Box */}
            <div className="so-pdf-permission-alert">
                <FaLock style={{ flexShrink: 0 }} />
                <span>
                    You can look at this screen, but you don't have permission to create Sales Orders from PDF. Ask your administrator for the <strong>Sales Order From PDF</strong> entry right.
                </span>
            </div>

            {/* Main 2-Column Content */}
            <div className="so-pdf-main-grid">
                {/* Left Card: Upload Dropzone */}
                <div className="so-pdf-upload-card">
                    <div className="so-pdf-card-header">
                        <span className="so-pdf-card-title">
                            <FaUpload style={{ color: "#3b82f6" }} />
                            <span>Upload Customer Sales Order PDF</span>
                        </span>
                        <span className="so-pdf-badge-format">PDF format only</span>
                    </div>

                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="application/pdf"
                        style={{ display: "none" }}
                        onChange={handleFileSelect}
                    />

                    {/* Dropzone */}
                    <div
                        className={`so-pdf-dropzone ${isDragging ? "drag-active" : ""}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="so-pdf-drop-icon-wrap">
                            <FaRegFilePdf />
                        </div>
                        <div className="so-pdf-drop-text">
                            {file ? file.name : (
                                <>Drop PDF here or <span className="so-pdf-link-browse">click to browse</span></>
                            )}
                        </div>
                        <div className="so-pdf-drop-sub">
                            {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB • Ready for AI extraction` : "Sales orders from any customer, in any layout"}
                        </div>
                        <div>
                            <span className="so-pdf-size-pill">
                                <FaLock style={{ fontSize: "10px" }} />
                                <span>PDF files only — max 20MB</span>
                            </span>
                        </div>
                    </div>

                    {/* Extract Order With AI Button */}
                    <button
                        type="button"
                        className={`so-pdf-btn-extract ${file ? "active-btn" : ""}`}
                        onClick={handleExtract}
                        disabled={extracting}
                    >
                        {extracting ? (
                            <>
                                <FaSpinner className="fa-spin" />
                                <span>
                                    {currentStep === 2 && "Reading PDF layout & extracting fields..."}
                                    {currentStep === 3 && "Auto-matching customer & style masters..."}
                                    {currentStep === 4 && "Finalizing extracted Sales Order..."}
                                </span>
                            </>
                        ) : (
                            <>
                                <FaMagic />
                                <span>EXTRACT ORDER WITH AI</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Right Card: How It Works Guide */}
                <div className="so-pdf-guide-card">
                    <div className="so-pdf-card-header">
                        <span className="so-pdf-card-title">
                            <FaInfoCircle style={{ color: "#3b82f6" }} />
                            <span>HOW IT WORKS</span>
                        </span>
                    </div>

                    <div className="so-pdf-steps-list">
                        <div className="so-pdf-step-item">
                            <div className="so-pdf-num-circle so-pdf-num-1">1</div>
                            <div>
                                <div className="so-pdf-step-title">Upload PDF</div>
                                <div className="so-pdf-step-desc">Select the customer's sales order PDF.</div>
                            </div>
                        </div>

                        <div className="so-pdf-step-item">
                            <div className="so-pdf-num-circle so-pdf-num-2">2</div>
                            <div>
                                <div className="so-pdf-step-title">AI Reads &amp; Extracts</div>
                                <div className="so-pdf-step-desc">The AI works out the document's layout and reads the header, every order line and each delivery split.</div>
                            </div>
                        </div>

                        <div className="so-pdf-step-item">
                            <div className="so-pdf-num-circle so-pdf-num-3">3</div>
                            <div>
                                <div className="so-pdf-step-title">Auto-Match Masters</div>
                                <div className="so-pdf-step-desc">Customer, items, colours, sizes, currency and season are matched to your masters. Nothing is created automatically.</div>
                            </div>
                        </div>

                        <div className="so-pdf-step-item">
                            <div className="so-pdf-num-circle so-pdf-num-4">4</div>
                            <div>
                                <div className="so-pdf-step-title">Review &amp; Save</div>
                                <div className="so-pdf-step-desc">Check the matched values, adjust deliveries if needed, then create a normal Sales Order in one click.</div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Imports */}
                    <div className="so-pdf-recent-section">
                        <div className="so-pdf-recent-title">RECENT IMPORTS</div>
                        <div className="so-pdf-recent-empty">No recent PDF extractions in this session.</div>
                    </div>
                </div>
            </div>

            {/* Extracted Sales Order Preview (Shown upon AI Extraction) */}
            {extractedOrder && (
                <div className="so-pdf-extracted-card">
                    <div className="so-pdf-extracted-header">
                        <div>
                            <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>AI Extraction Result</span>
                            <h4 style={{ margin: "2px 0 0 0", fontWeight: 700, color: "#1e293b" }}>
                                Extracted Sales Order: {extractedOrder.customerPo}
                            </h4>
                        </div>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <span className="so-pdf-matched-pill">
                                <FaCheckCircle /> All Masters Matched (100%)
                            </span>
                            <button
                                type="button"
                                style={{ padding: "6px 14px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "4px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                                onClick={() => {
                                    alert("Sales Order created successfully from PDF!");
                                    navigate("/sales-orders");
                                }}
                            >
                                Create Sales Order
                            </button>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "16px", background: "#f8fafc", padding: "12px", borderRadius: "6px", fontSize: "12px" }}>
                        <div><strong>Customer:</strong><br />{extractedOrder.customerName}</div>
                        <div><strong>Customer PO #:</strong><br />{extractedOrder.customerPo}</div>
                        <div><strong>Delivery Date:</strong><br />{extractedOrder.deliveryDate}</div>
                        <div><strong>Total Value:</strong><br /><span style={{ color: "#059669", fontWeight: 700 }}>{extractedOrder.totalValue}</span> ({extractedOrder.totalQty})</div>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                        <thead>
                            <tr style={{ background: "#337ab7", color: "#ffffff", textAlign: "left" }}>
                                <th style={{ padding: "7px 10px" }}>Line #</th>
                                <th style={{ padding: "7px 10px" }}>Style</th>
                                <th style={{ padding: "7px 10px" }}>Description</th>
                                <th style={{ padding: "7px 10px" }}>Colour</th>
                                <th style={{ padding: "7px 10px" }}>Sizes Breakdown</th>
                                <th style={{ padding: "7px 10px", textAlign: "right" }}>Quantity</th>
                                <th style={{ padding: "7px 10px", textAlign: "right" }}>Price</th>
                                <th style={{ padding: "7px 10px", textAlign: "right" }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {extractedOrder.items.map((item, idx) => (
                                <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                                    <td style={{ padding: "8px 10px", fontWeight: 600 }}>{item.line}</td>
                                    <td style={{ padding: "8px 10px", color: "#2563eb", fontWeight: 600 }}>{item.style}</td>
                                    <td style={{ padding: "8px 10px" }}>{item.description}</td>
                                    <td style={{ padding: "8px 10px" }}>{item.colour}</td>
                                    <td style={{ padding: "8px 10px", color: "#475569" }}>{item.sizeBreakdown}</td>
                                    <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 600 }}>{item.qty}</td>
                                    <td style={{ padding: "8px 10px", textAlign: "right" }}>{item.unitPrice}</td>
                                    <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 600, color: "#059669" }}>{item.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
