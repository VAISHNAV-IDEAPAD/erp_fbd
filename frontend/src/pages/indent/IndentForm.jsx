import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { 
    FaSave, 
    FaEye, 
    FaCog, 
    FaPlus, 
    FaCalendarAlt, 
    FaListUl, 
    FaPaperclip 
} from "react-icons/fa";
import axios from "axios";
import TypeaheadDropdown from "../../components/common/TypeaheadDropdown";
import "../../styles/indentsList.css";

export default function IndentForm({ onNavigateView }) {
    // -------------------------------------------------------------------------
    // FORM STATE
    // -------------------------------------------------------------------------
    const [materialSource, setMaterialSource] = useState("All");
    const [indentPrefix, setIndentPrefix] = useState("IND/AAPL/9B/26-27/");
    const [indentNumber, setIndentNumber] = useState("1191");
    const [indentDate, setIndentDate] = useState("2026-10-09");
    const [indentType, setIndentType] = useState("For Stock");
    const [department, setDepartment] = useState("Raw Material Store 9B");
    const [branch, setBranch] = useState("Plot No. 9B");
    const [defaultBranch, setDefaultBranch] = useState(false);
    const [remarks, setRemarks] = useState("");
    const [otherReference, setOtherReference] = useState("");
    const [defaultTerms, setDefaultTerms] = useState(false);

    // Selected grid rows for deletion
    const [selectedRows, setSelectedRows] = useState(new Set());

    // Grid line items
    const [gridLines, setGridLines] = useState([
        {
            id: 1,
            ioRef: "",
            ioDesc: "",
            itemId: "",
            itemCode: "",
            itemName: "",
            supplier: "",
            colour: "",
            sizeRange: "",
            qty: ""
        }
    ]);

    // Master lookups
    const [itemsList, setItemsList] = useState([]);
    const [coloursList, setColoursList] = useState([]);
    const [suppliersList, setSuppliersList] = useState([]);
    const [ioList, setIoList] = useState([]);

    const [isSaving, setIsSaving] = useState(false);
    const [alertMsg, setAlertMsg] = useState(null);

    // -------------------------------------------------------------------------
    // LOAD MASTERS
    // -------------------------------------------------------------------------
    useEffect(() => {
        loadMasters();
    }, []);

    const loadMasters = async () => {
        try {
            // Load all items (full catalog for instant autocomplete)
            const iRes = await axios.get("/api/items?limit=6000");
            if (iRes.data && iRes.data.success) {
                setItemsList(iRes.data.data || []);
            }
            // Load colours and sort alphabetically
            const cRes = await axios.get("/api/colours");
            if (cRes.data && cRes.data.success) {
                const rawColours = cRes.data.data || [];
                setColoursList(rawColours.sort((a, b) => (a.ColourName || "").localeCompare(b.ColourName || "")));
            }
            // Load suppliers
            const sRes = await axios.get("/api/suppliers");
            if (sRes.data && sRes.data.success) {
                setSuppliersList(sRes.data.data || []);
            }
            // Load IOs
            const ioRes = await axios.get("/api/internal-orders?limit=100");
            if (ioRes.data && ioRes.data.success) {
                setIoList(ioRes.data.data || []);
            }
        } catch (e) {
            console.error("Failed to load masters:", e);
        }
    };

    // Computed unique sizes from items list + standards
    const sizeOptions = useMemo(() => {
        const set = new Set(["Standard", "20 CM", "58 Inch", "1.2 mm", "MTR", "SQFT", "KG", "PCS", "L", "M", "S", "XL", "XXL"]);
        itemsList.forEach(it => {
            if (it.Size && it.Size.trim()) set.add(it.Size.trim());
        });
        return Array.from(set).sort();
    }, [itemsList]);

    // -------------------------------------------------------------------------
    // GRID LINE HELPERS
    // -------------------------------------------------------------------------
    const handleAddLine = () => {
        const nextId = gridLines.length > 0 ? Math.max(...gridLines.map(l => l.id)) + 1 : 1;
        setGridLines([
            ...gridLines,
            {
                id: nextId,
                ioRef: "",
                ioDesc: "",
                itemId: "",
                itemCode: "",
                itemName: "",
                supplier: "",
                colour: "",
                sizeRange: "",
                qty: ""
            }
        ]);
    };

    const handleDeleteSelectedRows = () => {
        if (selectedRows.size === 0) {
            alert("Please check the box on the row(s) you wish to delete.");
            return;
        }
        setGridLines(gridLines.filter(l => !selectedRows.has(l.id)));
        setSelectedRows(new Set());
    };

    const handleSelectRow = (id) => {
        const next = new Set(selectedRows);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedRows(next);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(new Set(gridLines.map(l => l.id)));
        } else {
            setSelectedRows(new Set());
        }
    };

    const updateLine = (id, field, value) => {
        setGridLines(gridLines.map(l => {
            if (l.id === id) {
                const updated = { ...l, [field]: value };
                // If itemCode changed, auto-populate itemName, color, uom
                if (field === "itemCode") {
                    const found = itemsList.find(i => i.ItemCode === value || i.ItemName === value);
                    if (found) {
                        updated.itemId = found.ItemID;
                        updated.itemCode = found.ItemCode;
                        updated.itemName = found.ItemName;
                        if (found.Color && !updated.colour) updated.colour = found.Color;
                        if (found.Size && !updated.sizeRange) updated.sizeRange = found.Size;
                    }
                }
                // If ioRef changed, auto-populate description
                if (field === "ioRef") {
                    const foundIO = ioList.find(io => io.IONo === value);
                    if (foundIO) {
                        updated.ioDesc = `${foundIO.Customer || ""} - ${foundIO.Season || ""}`;
                    }
                }
                return updated;
            }
            return l;
        }));
    };

    // -------------------------------------------------------------------------
    // SAVE INDENT
    // -------------------------------------------------------------------------
    const handleSave = async () => {
        if (!branch.trim()) {
            alert("Branch is required.");
            return;
        }

        const validLines = gridLines.filter(l => (l.itemCode || l.itemName) && l.qty);
        if (validLines.length === 0) {
            alert("Please fill at least one row with Item and Qty.");
            return;
        }

        try {
            setIsSaving(true);
            setAlertMsg(null);

            const fullIndentNo = `${indentPrefix}${indentNumber}`;

            const payload = {
                IndentNo: fullIndentNo,
                IndentDate: indentDate,
                Department: department,
                RequestedBy: "Admin",
                Priority: "Normal",
                Status: "Open",
                Remarks: remarks,
                OtherReference: otherReference,
                IndentMethod: "Manual",
                IndentType: indentType,
                SupplierName: validLines[0].supplier || "",
                Items: validLines.map(l => ({
                    ItemID: l.itemId || 1,
                    ItemCode: l.itemCode,
                    ItemName: l.itemName || l.itemCode,
                    Qty: parseFloat(l.qty) || 1,
                    UOM: "PCS",
                    Remarks: `Colour: ${l.colour || ""} | Size: ${l.sizeRange || ""} | IO: ${l.ioRef || ""}`
                }))
            };

            const res = await axios.post("/api/indents", payload);
            if (res.data && res.data.success) {
                alert(`Indent ${fullIndentNo} saved successfully!`);
                if (onNavigateView) {
                    onNavigateView();
                } else {
                    window.location.href = "/stock-indent";
                }
            } else {
                setAlertMsg({ type: "danger", text: res.data?.message || "Failed to save indent." });
            }
        } catch (err) {
            console.error("Save Indent Error:", err);
            setAlertMsg({ type: "danger", text: "Error saving indent. Please verify all required fields." });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="ind-erp-page">
            {/* Page Header */}
            <h1 className="ind-erp-title">Indent</h1>

            {/* Alert Message */}
            {alertMsg && (
                <Alert variant={alertMsg.type} className="py-1 px-3 mb-3" style={{ fontSize: "11px" }}>
                    {alertMsg.text}
                </Alert>
            )}

            {/* TOP TWO-COLUMN FORM SECTION matching screenshots */}
            <div className="ind-form-grid">
                {/* ----------------- LEFT COLUMN ----------------- */}
                <div>
                    {/* Material Source */}
                    <div className="ind-form-field mb-2">
                        <label className="ind-form-label">Material Source</label>
                        <select 
                            className="ind-form-select"
                            value={materialSource}
                            onChange={(e) => setMaterialSource(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Import">Import</option>
                            <option value="Domestic">Domestic</option>
                        </select>
                    </div>

                    {/* Indent No. Group (Prefix dropdown + number + gear button) */}
                    <div className="ind-form-field mb-2">
                        <label className="ind-form-label">Indent No.</label>
                        <div className="ind-prefix-group">
                            <select 
                                className="ind-prefix-select"
                                value={indentPrefix}
                                onChange={(e) => setIndentPrefix(e.target.value)}
                            >
                                <option value="Prefix">Prefix</option>
                                <option value="IND/AAPL/9B/26-27/">IND/AAPL/9B/26-27/</option>
                                <option value="test/9b/">test/9b/</option>
                            </select>
                            <input 
                                type="text" 
                                className="ind-prefix-input" 
                                placeholder="Indent No."
                                value={indentNumber}
                                onChange={(e) => setIndentNumber(e.target.value)}
                            />
                            <button 
                                type="button" 
                                className="ind-gear-btn" 
                                title="Prefix Settings"
                                onClick={() => alert("Indent prefix configured to active financial year series.")}
                            >
                                <FaCog />
                            </button>
                        </div>
                    </div>

                    {/* Department */}
                    <div className="ind-form-field mb-2">
                        <label className="ind-form-label">Department</label>
                        <TypeaheadDropdown 
                            placeholder="Type & Select Department"
                            value={department}
                            onChange={(val) => setDepartment(val)}
                            options={[
                                "Raw Material Store 9B",
                                "9b Fabric Store",
                                "Leather Cutting",
                                "Fabric Store",
                                "Trims Store",
                                "Production Planning",
                                "Cutting Department",
                                "Finishing Department"
                            ]}
                            dropdownWidth="100%"
                        />
                    </div>

                    {/* Branch */}
                    <div className="ind-form-field mb-1">
                        <label className="ind-form-label">
                            Branch <span className="ind-req-star">*</span>
                        </label>
                        <TypeaheadDropdown 
                            placeholder="Type and select Branch"
                            value={branch}
                            onChange={(val) => setBranch(val)}
                            options={[
                                "Plot No. 9B",
                                "Plot No. 10A",
                                "Central Warehouse",
                                "Head Office"
                            ]}
                            requiredIndicator={true}
                            dropdownWidth="100%"
                        />
                    </div>

                    {/* Default branch checkbox */}
                    <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: "11px", color: "#333333" }}>
                        <input 
                            type="checkbox" 
                            id="defBranchCheck"
                            checked={defaultBranch}
                            onChange={(e) => setDefaultBranch(e.target.checked)}
                            style={{ accentColor: "#337ab7" }}
                        />
                        <label htmlFor="defBranchCheck" style={{ cursor: "pointer" }}>
                            Make this as my default branch
                        </label>
                    </div>

                    {/* Remarks */}
                    <div className="ind-form-field">
                        <label className="ind-form-label">Remarks</label>
                        <textarea 
                            className="ind-form-textarea"
                            rows={3}
                            placeholder="Enter Remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </div>
                </div>

                {/* ----------------- RIGHT COLUMN ----------------- */}
                <div>
                    {/* Date */}
                    <div className="ind-form-field mb-2">
                        <label className="ind-form-label">
                            Date <span className="ind-req-star">*</span>
                        </label>
                        <div className="position-relative">
                            <input 
                                type="date" 
                                className="ind-form-input pe-4"
                                value={indentDate}
                                onChange={(e) => setIndentDate(e.target.value)}
                            />
                            <FaCalendarAlt 
                                size={12} 
                                className="position-absolute text-muted" 
                                style={{ right: "8px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                            />
                        </div>
                    </div>

                    {/* Indent Type */}
                    <div className="ind-form-field mb-2">
                        <label className="ind-form-label">Indent Type</label>
                        <TypeaheadDropdown 
                            placeholder="Type & Select Indent Type"
                            value={indentType}
                            onChange={(val) => setIndentType(val)}
                            options={[
                                "For Stock",
                                "Excess",
                                "Order Specific",
                                "Project",
                                "Sample"
                            ]}
                            dropdownWidth="100%"
                        />
                    </div>
                </div>
            </div>

            {/* Helper Links & Note matching screenshots */}
            <div>
                <span className="ind-blue-link">Total by Item/Adjust Qty</span>
                <div className="ind-note-text">
                    Note : If you wish to adjust qty to indent, enter it under 'Modified Qty' column and press 'Adjust' button. Finally press save button.
                </div>
                <span className="ind-blue-link">IO Break-up</span>
            </div>

            {/* LINE ITEMS SECTION matching screenshot 4 & 5 */}
            <div className="ind-items-section">
                {/* Delete button on top right of table */}
                <div className="ind-items-topbar">
                    <button 
                        type="button" 
                        className="ind-btn-delete-row"
                        onClick={handleDeleteSelectedRows}
                    >
                        Delete
                    </button>
                </div>

                {/* Table Ribbon (#337ab7 exact match) */}
                <div className="table-responsive">
                    <Table hover size="sm" className="ind-ribbon-table text-nowrap">
                        <thead>
                            <tr>
                                <th style={{ width: "30px" }} className="text-center">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedRows.size > 0 && selectedRows.size === gridLines.length}
                                        onChange={handleSelectAll}
                                        style={{ accentColor: "#ffffff" }}
                                    />
                                </th>
                                <th style={{ minWidth: "220px" }}>IO Ref.</th>
                                <th style={{ minWidth: "240px" }}>
                                    Item <span style={{ color: "#ffcccc" }}>*</span>
                                </th>
                                <th style={{ minWidth: "180px" }}>Supplier</th>
                                <th style={{ minWidth: "150px" }}>
                                    Colour <span style={{ color: "#ffcccc" }}>*</span>
                                </th>
                                <th style={{ minWidth: "140px" }}>
                                    Size Range <span style={{ color: "#ffcccc" }}>*</span>
                                </th>
                                <th style={{ width: "100px" }} className="text-end">Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gridLines.map((line) => (
                                <tr key={line.id}>
                                    {/* Selection Checkbox */}
                                    <td className="text-center">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedRows.has(line.id)}
                                            onChange={() => handleSelectRow(line.id)}
                                            style={{ accentColor: "#337ab7" }}
                                        />
                                    </td>

                                    {/* IO Ref + Desc Box */}
                                    <td>
                                        <div className="d-flex align-items-center gap-1">
                                            <div style={{ width: "120px" }}>
                                                <TypeaheadDropdown
                                                    value={line.ioRef}
                                                    onChange={(val, ioObj) => {
                                                        updateLine(line.id, "ioRef", val);
                                                        if (ioObj) {
                                                            const raw = ioObj.raw || ioObj;
                                                            updateLine(line.id, "ioDesc", `${raw.Customer || ""} - ${raw.Season || ""}`.trim());
                                                        }
                                                    }}
                                                    options={ioList.map(io => ({
                                                        label: io.IONo,
                                                        value: io.IONo,
                                                        subtext: `${io.Customer || ""} ${io.Season || ""}`.trim(),
                                                        raw: io
                                                    }))}
                                                    placeholder="Enter IO Ref."
                                                    dropdownWidth="260px"
                                                    showSubtext={true}
                                                />
                                            </div>
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-light border p-0 px-1" 
                                                style={{ height: "24px" }}
                                                title="Select IO"
                                                onClick={() => {
                                                    if (ioList.length > 0) {
                                                        updateLine(line.id, "ioRef", ioList[0].IONo);
                                                        updateLine(line.id, "ioDesc", `${ioList[0].Customer || ""} - ${ioList[0].Season || ""}`.trim());
                                                    }
                                                }}
                                            >
                                                <FaListUl size={9} />
                                            </button>
                                            <div className="ind-grid-info-box flex-1">
                                                {line.ioDesc || "-"}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Item */}
                                    <td>
                                        <TypeaheadDropdown
                                            value={line.itemName || line.itemCode}
                                            onChange={(val, itemObj) => {
                                                if (itemObj) {
                                                    const code = itemObj.ItemCode || itemObj.code || val;
                                                    const name = itemObj.ItemName || itemObj.label || val;
                                                    const id = itemObj.ItemID || itemObj.value;
                                                    updateLine(line.id, "itemCode", code);
                                                    updateLine(line.id, "itemName", name);
                                                    updateLine(line.id, "itemId", id);
                                                    const raw = itemObj.raw || itemObj;
                                                    if (raw.Color && !line.colour) updateLine(line.id, "colour", raw.Color);
                                                    if (raw.Size && !line.sizeRange) updateLine(line.id, "sizeRange", raw.Size);
                                                } else {
                                                    updateLine(line.id, "itemName", val);
                                                    updateLine(line.id, "itemCode", val);
                                                }
                                            }}
                                            options={itemsList.map(it => ({
                                                label: it.ItemName,
                                                value: it.ItemID,
                                                code: it.ItemCode,
                                                raw: it
                                            }))}
                                            placeholder="Type & Select Item"
                                            requiredIndicator={true}
                                            dropdownWidth="min(550px, max(100%, 380px))"
                                        />
                                    </td>

                                    {/* Supplier */}
                                    <td>
                                        <TypeaheadDropdown
                                            value={line.supplier}
                                            onChange={(val) => updateLine(line.id, "supplier", val)}
                                            options={suppliersList.map(s => s.SupplierName || s.name || s)}
                                            placeholder="Type & Select Supplier"
                                            requiredIndicator={false}
                                            dropdownWidth="min(400px, max(100%, 260px))"
                                        />
                                    </td>

                                    {/* Colour */}
                                    <td>
                                        <TypeaheadDropdown
                                            value={line.colour}
                                            onChange={(val) => updateLine(line.id, "colour", val)}
                                            options={coloursList.map(c => c.ColourName || c.name || c)}
                                            placeholder="Type & Select Colour"
                                            requiredIndicator={true}
                                            dropdownWidth="min(350px, max(100%, 240px))"
                                        />
                                    </td>

                                    {/* Size Range */}
                                    <td>
                                        <TypeaheadDropdown
                                            value={line.sizeRange}
                                            onChange={(val) => updateLine(line.id, "sizeRange", val)}
                                            options={sizeOptions}
                                            placeholder="Type & Select Size Range"
                                            requiredIndicator={true}
                                            dropdownWidth="min(300px, max(100%, 200px))"
                                        />
                                    </td>

                                    {/* Qty */}
                                    <td>
                                        <input 
                                            type="number" 
                                            className="ind-grid-input text-end fw-bold" 
                                            placeholder="Enter Qty"
                                            value={line.qty}
                                            onChange={(e) => updateLine(line.id, "qty", e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                {/* + Add Another Line link */}
                <span 
                    className="ind-blue-link" 
                    onClick={handleAddLine}
                >
                    + Add Another Line
                </span>
            </div>

            {/* BOTTOM SECTION matching screenshot 5 */}
            <div className="mt-3">
                {/* Other Reference */}
                <div className="ind-form-field" style={{ maxWidth: "420px" }}>
                    <label className="ind-form-label">Other Reference</label>
                    <textarea 
                        className="ind-form-textarea"
                        rows={3}
                        placeholder="Enter Other Reference"
                        value={otherReference}
                        onChange={(e) => setOtherReference(e.target.value)}
                    />
                </div>

                {/* + Add files... Button */}
                <div>
                    <label className="ind-btn-add-files mb-0">
                        <FaPlus size={10} /> Add files...
                        <input type="file" multiple style={{ display: "none" }} onChange={(e) => {
                            if (e.target.files.length > 0) {
                                alert(`Attached ${e.target.files.length} document file(s).`);
                            }
                        }} />
                    </label>
                </div>

                {/* Terms & Conditions Header */}
                <div className="mt-3">
                    <span className="ind-blue-link">Terms &amp; Conditions</span>
                    <div className="d-flex align-items-center gap-2 mt-2" style={{ fontSize: "11px", color: "#333333" }}>
                        <input 
                            type="checkbox" 
                            id="defTermsCheck"
                            checked={defaultTerms}
                            onChange={(e) => setDefaultTerms(e.target.checked)}
                            style={{ accentColor: "#337ab7" }}
                        />
                        <label htmlFor="defTermsCheck" style={{ cursor: "pointer" }}>
                            Make this as my default Terms &amp; Conditions
                        </label>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Save & View buttons */}
            <div className="ind-bottom-bar">
                <button 
                    type="button" 
                    className="ind-btn-save"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? <Spinner animation="border" size="sm" /> : <><FaSave size={11} /> Save</>}
                </button>
                <button 
                    type="button" 
                    className="ind-btn-view"
                    onClick={() => {
                        if (onNavigateView) onNavigateView();
                        else window.location.href = "/stock-indent";
                    }}
                >
                    <FaEye size={11} /> View
                </button>
            </div>
        </div>
    );
}