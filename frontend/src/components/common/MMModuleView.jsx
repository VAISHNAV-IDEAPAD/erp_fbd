import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaPlus, FaSyncAlt, FaSearch, FaBoxes } from "react-icons/fa";
import axios from "axios";

export default function MMModuleView({
    title,
    moduleName,
    apiEndpoint,
    columns = [
        { key: "DocNo", label: "Doc #" },
        { key: "DocDate", label: "Date" },
        { key: "Department", label: "Department" },
        { key: "ItemName", label: "Item / Material" },
        { key: "Quantity", label: "Quantity" },
        { key: "Status", label: "Status" }
    ],
    initialSampleData = []
}) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({
        DocNo: "",
        Department: "Manufacturing",
        ItemName: "Fabric / Material",
        Quantity: "100",
        Remarks: "",
        Status: "Pending"
    });

    const loadData = async () => {
        setLoading(true);
        try {
            if (apiEndpoint) {
                const res = await axios.get(apiEndpoint);
                const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                if (data.length > 0) {
                    setRecords(data);
                    setLoading(false);
                    return;
                }
            }
        } catch (e) {
            console.warn(`API ${apiEndpoint} not responding, using local persistence`);
        }

        // Check local storage for persistent user inputs
        const saved = localStorage.getItem(`erp_mm_${moduleName}`);
        if (saved) {
            try {
                setRecords(JSON.parse(saved));
                setLoading(false);
                return;
            } catch (err) {}
        }

        // Fallback default sample data
        setRecords(initialSampleData);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [moduleName]);

    const handleCreate = (e) => {
        e.preventDefault();
        const docNumber = newItem.DocNo || `${moduleName.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`;
        const record = {
            ...newItem,
            id: Date.now(),
            DocNo: docNumber,
            DocDate: new Date().toISOString().split("T")[0]
        };

        const updated = [record, ...records];
        setRecords(updated);
        localStorage.setItem(`erp_mm_${moduleName}`, JSON.stringify(updated));
        setShowModal(false);
        setNewItem({
            DocNo: "",
            Department: "Manufacturing",
            ItemName: "Fabric / Material",
            Quantity: "100",
            Remarks: "",
            Status: "Pending"
        });
    };

    const filtered = records.filter(r =>
        Object.values(r).some(val =>
            String(val || "").toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

        return (
        <div style={{ backgroundColor: "#ffffff", padding: "18px 24px 60px 24px", minHeight: "calc(100vh - 65px)", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            {/* Header: Title */}
            <div style={{ marginBottom: "6px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1976d2", margin: "0 0 10px 0" }}>
                    {title}
                </h2>
            </div>

            {/* Top Filter and New Button matching TPCS Fashion screenshot */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "8px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <label style={{ fontSize: "12px", color: "#334155", fontWeight: 600 }}>Associate / Search</label>
                    <input
                        type="text"
                        placeholder="Search records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "220px",
                            height: "28px",
                            border: "1px solid #cbd5e1",
                            borderRadius: "3px",
                            padding: "2px 8px",
                            fontSize: "12px",
                            outline: "none"
                        }}
                    />
                </div>

                <div>
                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        style={{
                            backgroundColor: "#4caf50",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "3px",
                            padding: "6px 14px",
                            fontSize: "12.5px",
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            cursor: "pointer",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                        }}
                    >
                        <FaPlus style={{ fontSize: "11px" }} />
                        <span>New {title}</span>
                    </button>
                </div>
            </div>

            {/* Secondary Toolbar matching TPCS Fashion screenshot */}
            <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "12px" }}>
                <button
                    type="button"
                    onClick={loadData}
                    title="Reload"
                    style={{
                        width: "28px",
                        height: "28px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "3px",
                        background: "#ffffff",
                        color: "#475569",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "12px"
                    }}
                >
                    <FaSyncAlt className={loading ? "fa-spin" : ""} />
                </button>
                <button
                    type="button"
                    title="View Options"
                    style={{
                        width: "28px",
                        height: "28px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "3px",
                        background: "#ffffff",
                        color: "#475569",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "12px"
                    }}
                >
                    ☰
                </button>
                <button
                    type="button"
                    title="Settings"
                    style={{
                        width: "28px",
                        height: "28px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "3px",
                        background: "#ffffff",
                        color: "#475569",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "12px"
                    }}
                >
                    ⚙
                </button>
                <button
                    type="button"
                    style={{
                        height: "28px",
                        padding: "0 10px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "3px",
                        background: "#ffffff",
                        color: "#334155",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        cursor: "pointer",
                        fontSize: "12px"
                    }}
                >
                    <span>Filter ▾</span>
                </button>
            </div>

            {/* Table matching screenshot */}
            <div style={{ width: "100%", overflowX: "auto", border: "1px solid #cbd5e1", borderRadius: "2px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "900px" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#1976d2", color: "#ffffff", textAlign: "left" }}>
                            <th style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)", width: "70px", textAlign: "center" }}>Action</th>
                            {columns.map(col => (
                                <th key={col.key} style={{ padding: "8px 10px", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.2)" }}>{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((item, idx) => (
                            <tr key={item.id || idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                                <td style={{ textAlign: "center", padding: "6px 8px", borderRight: "1px solid #f1f5f9" }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(true)}
                                        title="View Record"
                                        style={{
                                            background: "#e0f2fe",
                                            border: "1px solid #bae6fd",
                                            color: "#0284c7",
                                            borderRadius: "3px",
                                            padding: "2px 6px",
                                            cursor: "pointer",
                                            fontSize: "11px"
                                        }}
                                    >
                                        👁
                                    </button>
                                </td>
                                {columns.map(col => {
                                    const val = item[col.key];
                                    if (col.key === "Status") {
                                        return (
                                            <td key={col.key} style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9" }}>
                                                <span style={{
                                                    background: val === "Completed" || val === "Approved" ? "#dcfce7" : "#fef3c7",
                                                    color: val === "Completed" || val === "Approved" ? "#15803d" : "#b45309",
                                                    padding: "2px 8px",
                                                    borderRadius: "10px",
                                                    fontSize: "11px",
                                                    fontWeight: 600
                                                }}>
                                                    {val || "Pending"}
                                                </span>
                                            </td>
                                        );
                                    }
                                    return (
                                        <td key={col.key} style={{ padding: "6px 10px", borderRight: "1px solid #f1f5f9", fontWeight: col.key === "DocNo" ? 600 : 400, color: col.key === "DocNo" ? "#1976d2" : "#334155" }}>
                                            {val !== undefined && val !== null ? String(val) : "-"}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}

                        {/* Padding empty gridlines */}
                        {Array.from({ length: Math.max(0, 16 - filtered.length) }).map((_, i) => (
                            <tr key={'empty-' + i} style={{ borderBottom: "1px solid #eef2f6", height: "28px" }}>
                                <td style={{ borderRight: "1px solid #f1f5f9" }}></td>
                                {columns.map(col => (
                                    <td key={col.key} style={{ borderRight: "1px solid #f1f5f9" }}></td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* CREATE MODAL */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>onHide={() => setShowModal(false)} centered>
                <Form onSubmit={handleCreate}>
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title className="fs-6">New {title} Entry</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Document / Reference Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Leave blank for Auto-generated"
                                        value={newItem.DocNo}
                                        onChange={(e) => setNewItem({ ...newItem, DocNo: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Item / Material</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="e.g. Cotton 40s Fabric, Sewing Thread, Zipper"
                                        value={newItem.ItemName}
                                        onChange={(e) => setNewItem({ ...newItem, ItemName: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Quantity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        required
                                        value={newItem.Quantity}
                                        onChange={(e) => setNewItem({ ...newItem, Quantity: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Department</Form.Label>
                                    <Form.Select
                                        value={newItem.Department}
                                        onChange={(e) => setNewItem({ ...newItem, Department: e.target.value })}
                                    >
                                        <option value="Manufacturing">Manufacturing</option>
                                        <option value="Cutting">Cutting</option>
                                        <option value="Sewing">Sewing</option>
                                        <option value="Finishing">Finishing</option>
                                        <option value="Store">Store / Warehouse</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-semibold">Remarks</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Notes, instructions or inspection details..."
                                        value={newItem.Remarks}
                                        onChange={(e) => setNewItem({ ...newItem, Remarks: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="sm" type="submit">
                            Save Record
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
