const db = require("../config/database");

// ======================================================
// INITIAL SAMPLE SEED DATA MATCHING TPCS FASHION ERP
// ======================================================
const SEED_ITEM_REQUISITIONS = [
    {
        ReqNo: "REQ/AAPL9B/2627/045",
        IssueNo: "IS/AAPL9B/2627/088",
        ReqDate: "14-10-2026",
        Associate: "Apex Leather Works",
        Warehouse: "RAW MATERIAL STORE 9B",
        Remark: "Batch 104 Cutting requisition",
        InternalMemo: "Line 1 bulk cutting",
        Department: "Cutting Dept",
        Transporter: "In-House Transfer",
        ReqBy: "Ramesh Kumar",
        EntryOn: "14-10-2026 10:15AM",
        Status: "Approved",
        EntryBy: "Nikhil Singh",
        UpdatedBy: "Admin",
        TotalQty: 185.5,
        RowCount: 2,
        details: [
            { ItemCode: "LTH-1093", ItemName: "COW CULATTAS SINGLE LEATHER", Color: "BLACK", Quantity: 120.5, UOM: "SQFT", RequiredDate: "15-10-2026", Remarks: "Upper cutting" },
            { ItemCode: "LTH-1112", ItemName: "COW ECO VEG SIDE CRUST LEATHER", Color: "TAN", Quantity: 65.0, UOM: "SQFT", RequiredDate: "15-10-2026", Remarks: "Counter reinforcement" }
        ]
    },
    {
        ReqNo: "REQ/AAPL9B/2627/044",
        IssueNo: "IS/AAPL9B/2627/087",
        ReqDate: "13-10-2026",
        Associate: "Balaji Trims & Fasteners",
        Warehouse: "SEMI FINISH STORE 9B",
        Remark: "Urgent sampling line fasteners",
        InternalMemo: "Internal sample dev FY26-27",
        Department: "Sampling Dept",
        Transporter: "Self",
        ReqBy: "Nikhil Singh",
        EntryOn: "13-10-2026 01:45PM",
        Status: "Issued",
        EntryBy: "Admin",
        UpdatedBy: "Admin",
        TotalQty: 450.0,
        RowCount: 1,
        details: [
            { ItemCode: "HDW-2236", ItemName: "JAM RIVET SINGLE HEAD 7MM", Color: "ANTIQUE BRASS", Quantity: 450.0, UOM: "SET", RequiredDate: "14-10-2026", Remarks: "Riveting section" }
        ]
    },
    {
        ReqNo: "REQ/AAPL9B/2627/043",
        IssueNo: "IS/AAPL9B/2627/086",
        ReqDate: "12-10-2026",
        Associate: "Supreme Leathercraft",
        Warehouse: "SEMI FINISH STORE 18",
        Remark: "Stitching floor material request",
        InternalMemo: "Regular order dispatch",
        Department: "Stitching Floor",
        Transporter: "In-House Transfer",
        ReqBy: "Pooja Verma",
        EntryOn: "12-10-2026 11:20AM",
        Status: "Completed",
        EntryBy: "Pooja Verma",
        UpdatedBy: "Nikhil Singh",
        TotalQty: 320.0,
        RowCount: 2,
        details: [
            { ItemCode: "SFS-105", ItemName: "Reinforcement Strips 25mm", Color: "WHITE", Quantity: 200.0, UOM: "MTR", RequiredDate: "13-10-2026", Remarks: "Collar reinforcement" },
            { ItemCode: "SFS-106", ItemName: "Padded Tongue Inserts", Color: "NATURAL", Quantity: 120.0, UOM: "PCS", RequiredDate: "13-10-2026", Remarks: "Assembly line" }
        ]
    },
    {
        ReqNo: "REQ/AAPL9B/2627/042",
        IssueNo: "",
        ReqDate: "12-10-2026",
        Associate: "K-Tex Textiles",
        Warehouse: "RAW MATERIAL STORE 9B",
        Remark: "MT-21980 Lining fabric requirement",
        InternalMemo: "Export batch lining",
        Department: "Cutting Dept",
        Transporter: "Blue Dart Logistics",
        ReqBy: "Ramesh Kumar",
        EntryOn: "12-10-2026 10:10AM",
        Status: "Pending",
        EntryBy: "Ramesh Kumar",
        UpdatedBy: "",
        TotalQty: 600.0,
        RowCount: 1,
        details: [
            { ItemCode: "RNF-1085", ItemName: "HIGH DENSITY TOPLINER 0.4MM", Color: "BLACK", Quantity: 600.0, UOM: "MTR", RequiredDate: "16-10-2026", Remarks: "Lining cutting" }
        ]
    },
    {
        ReqNo: "REQ/AAPL9B/2627/041",
        IssueNo: "",
        ReqDate: "11-10-2026",
        Associate: "Classic Threads & Zips",
        Warehouse: "STORE 30",
        Remark: "Zipper and core spun thread lot",
        InternalMemo: "Sampling accessories dev",
        Department: "Sampling Dept",
        Transporter: "In-House Transfer",
        ReqBy: "Sunil Sharma",
        EntryOn: "11-10-2026 09:30AM",
        Status: "Draft",
        EntryBy: "Sunil Sharma",
        UpdatedBy: "",
        TotalQty: 150.0,
        RowCount: 2,
        details: [
            { ItemCode: "TRM-3012", ItemName: "NYLON ZIPPER #5 OPEN END 65CM", Color: "NAVY", Quantity: 100.0, UOM: "PCS", RequiredDate: "15-10-2026", Remarks: "Outer jacket" },
            { ItemCode: "THD-1020", ItemName: "POLY-CORE SEWING THREAD 40/2", Color: "NAVY", Quantity: 50.0, UOM: "SPOOL", RequiredDate: "15-10-2026", Remarks: "Matching color thread" }
        ]
    }
];

// Initialize database with seed records if empty
function initializeSeedData() {
    db.get("SELECT COUNT(*) as count FROM ItemRequisitions", (err, row) => {
        if (!err && row && row.count === 0) {
            console.log("Seeding ItemRequisitions table with initial TPCS records...");
            const stmt = db.prepare(`
                INSERT INTO ItemRequisitions (
                    ReqNo, IssueNo, ReqDate, Associate, Warehouse, Remark, InternalMemo,
                    Department, Transporter, ReqBy, EntryOn, Status, EntryBy, UpdatedBy,
                    TotalQty, RowCount
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            const detailStmt = db.prepare(`
                INSERT INTO ItemRequisitionDetails (
                    RequisitionID, ItemCode, ItemName, Color, Quantity, UOM, RequiredDate, Remarks
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

            SEED_ITEM_REQUISITIONS.forEach(req => {
                stmt.run(
                    req.ReqNo,
                    req.IssueNo || "",
                    req.ReqDate,
                    req.Associate || "",
                    req.Warehouse || "",
                    req.Remark || "",
                    req.InternalMemo || "",
                    req.Department || "",
                    req.Transporter || "",
                    req.ReqBy || "",
                    req.EntryOn || "",
                    req.Status || "Pending",
                    req.EntryBy || "Admin",
                    req.UpdatedBy || "",
                    req.TotalQty || 0,
                    req.RowCount || (req.details ? req.details.length : 1),
                    function (err) {
                        if (!err && req.details && req.details.length > 0) {
                            const reqId = this.lastID;
                            req.details.forEach(d => {
                                detailStmt.run(
                                    reqId,
                                    d.ItemCode || "",
                                    d.ItemName || "",
                                    d.Color || "",
                                    d.Quantity || 0,
                                    d.UOM || "PCS",
                                    d.RequiredDate || "",
                                    d.Remarks || ""
                                );
                            });
                        }
                    }
                );
            });

            stmt.finalize();
            detailStmt.finalize();
            console.log("✓ Seeded ItemRequisitions successfully.");
        }
    });
}

// Run after a short delay to ensure tables exist
setTimeout(initializeSeedData, 1000);

// ======================================================
// CONTROLLER HANDLERS
// ======================================================

// GET /api/item-requisitions
exports.getAllItemRequisitions = (req, res) => {
    const { search, associate, status, department, warehouse } = req.query;

    let query = "SELECT * FROM ItemRequisitions WHERE 1=1";
    const params = [];

    if (search && search.trim()) {
        const s = `%${search.trim().toLowerCase()}%`;
        query += " AND (LOWER(Associate) LIKE ? OR LOWER(ReqNo) LIKE ? OR LOWER(IssueNo) LIKE ? OR LOWER(Remark) LIKE ? OR LOWER(Department) LIKE ? OR LOWER(ReqBy) LIKE ?)";
        params.push(s, s, s, s, s, s);
    }

    if (associate && associate !== "All" && associate.trim()) {
        query += " AND LOWER(Associate) LIKE ?";
        params.push(`%${associate.trim().toLowerCase()}%`);
    }

    if (status && status !== "All") {
        query += " AND Status = ?";
        params.push(status);
    }

    if (department && department !== "All") {
        query += " AND Department = ?";
        params.push(department);
    }

    if (warehouse && warehouse !== "All") {
        query += " AND Warehouse = ?";
        params.push(warehouse);
    }

    query += " ORDER BY RequisitionID DESC";

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error("Error fetching ItemRequisitions:", err);
            return res.json({ success: true, data: SEED_ITEM_REQUISITIONS });
        }
        res.json({ success: true, data: rows });
    });
};

// GET /api/item-requisitions/:id
exports.getItemRequisitionById = (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM ItemRequisitions WHERE RequisitionID = ? OR ReqNo = ?", [id, id], (err, header) => {
        if (err || !header) {
            const fallback = SEED_ITEM_REQUISITIONS.find(r => String(r.ReqNo) === String(id));
            if (fallback) return res.json({ success: true, data: fallback });
            return res.status(404).json({ success: false, message: "Requisition not found" });
        }

        db.all("SELECT * FROM ItemRequisitionDetails WHERE RequisitionID = ?", [header.RequisitionID], (err, details) => {
            if (err) {
                return res.json({ success: true, data: { ...header, details: [] } });
            }
            res.json({ success: true, data: { ...header, details } });
        });
    });
};

// POST /api/item-requisitions
exports.createItemRequisition = (req, res) => {
    const data = req.body;
    const reqNo = data.ReqNo || `REQ/AAPL9B/2627/${Date.now().toString().slice(-4)}`;
    const items = Array.isArray(data.details || data.items) ? (data.details || data.items) : [];
    const totalQty = items.reduce((sum, it) => sum + Number(it.Quantity || 0), 0);
    const rowCount = Math.max(items.length, 1);

    const query = `
        INSERT INTO ItemRequisitions (
            ReqNo, IssueNo, ReqDate, Associate, Warehouse, Remark, InternalMemo,
            Department, Transporter, ReqBy, EntryOn, Status, EntryBy, UpdatedBy,
            TotalQty, RowCount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        reqNo,
        data.IssueNo || "",
        data.ReqDate || new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        data.Associate || data.SupplierName || "",
        data.Warehouse || data.Stores || "RAW MATERIAL STORE 9B",
        data.Remark || "",
        data.InternalMemo || "",
        data.Department || "Sampling Dept",
        data.Transporter || "In-House Transfer",
        data.ReqBy || "Admin",
        data.EntryOn || new Date().toLocaleString(),
        data.Status || "Pending",
        data.EntryBy || "Admin",
        data.UpdatedBy || "",
        totalQty,
        rowCount
    ];

    db.run(query, params, function (err) {
        if (err) {
            console.error("Error creating ItemRequisition:", err);
            return res.status(500).json({ success: false, error: err.message });
        }

        const requisitionId = this.lastID;
        if (items.length > 0) {
            const detailStmt = db.prepare(`
                INSERT INTO ItemRequisitionDetails (
                    RequisitionID, ItemCode, ItemName, Color, Quantity, UOM, RequiredDate, Remarks
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

            items.forEach(d => {
                detailStmt.run(
                    requisitionId,
                    d.ItemCode || "",
                    d.ItemName || "",
                    d.Color || "",
                    Number(d.Quantity) || 0,
                    d.UOM || "PCS",
                    d.RequiredDate || "",
                    d.Remarks || ""
                );
            });
            detailStmt.finalize();
        }

        res.status(201).json({
            success: true,
            message: "Item Requisition Note created successfully",
            data: { RequisitionID: requisitionId, ReqNo: reqNo, ...data, TotalQty: totalQty, RowCount: rowCount }
        });
    });
};

// PUT /api/item-requisitions/:id
exports.updateItemRequisition = (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const items = Array.isArray(data.details || data.items) ? (data.details || data.items) : [];
    const totalQty = items.reduce((sum, it) => sum + Number(it.Quantity || 0), 0);
    const rowCount = Math.max(items.length, 1);

    const query = `
        UPDATE ItemRequisitions SET
            IssueNo = ?, ReqDate = ?, Associate = ?, Warehouse = ?, Remark = ?,
            InternalMemo = ?, Department = ?, Transporter = ?, ReqBy = ?, Status = ?,
            UpdatedBy = ?, TotalQty = ?, RowCount = ?
        WHERE RequisitionID = ?
    `;

    const params = [
        data.IssueNo || "",
        data.ReqDate,
        data.Associate,
        data.Warehouse,
        data.Remark,
        data.InternalMemo,
        data.Department,
        data.Transporter,
        data.ReqBy,
        data.Status || "Pending",
        data.UpdatedBy || "Admin",
        totalQty,
        rowCount,
        id
    ];

    db.run(query, params, function (err) {
        if (err) {
            console.error("Error updating ItemRequisition:", err);
            return res.status(500).json({ success: false, error: err.message });
        }

        if (items.length > 0) {
            db.run("DELETE FROM ItemRequisitionDetails WHERE RequisitionID = ?", [id], () => {
                const detailStmt = db.prepare(`
                    INSERT INTO ItemRequisitionDetails (
                        RequisitionID, ItemCode, ItemName, Color, Quantity, UOM, RequiredDate, Remarks
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `);

                items.forEach(d => {
                    detailStmt.run(
                        id,
                        d.ItemCode || "",
                        d.ItemName || "",
                        d.Color || "",
                        Number(d.Quantity) || 0,
                        d.UOM || "PCS",
                        d.RequiredDate || "",
                        d.Remarks || ""
                    );
                });
                detailStmt.finalize();
            });
        }

        res.json({ success: true, message: "Item Requisition updated successfully" });
    });
};

// DELETE /api/item-requisitions/:id
exports.deleteItemRequisition = (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM ItemRequisitions WHERE RequisitionID = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        db.run("DELETE FROM ItemRequisitionDetails WHERE RequisitionID = ?", [id]);
        res.json({ success: true, message: "Item Requisition deleted successfully" });
    });
};
