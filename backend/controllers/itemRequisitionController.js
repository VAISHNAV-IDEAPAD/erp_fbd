const db = require("../config/database");

// ======================================================
// INITIAL SAMPLE SEED DATA MATCHING TPCS FASHION / JENIXCLOUD ERP
// ======================================================
const SEED_ITEM_REQUISITIONS = [
    {
        ReqNo: "IRN/APP/9B/2627/2501",
        ReqType: "Production",
        Shift: "Shift I",
        IssueNo: "",
        ReqDate: "03-11-2026",
        Associate: "Apex Leather Works",
        Supplier: "Apex Leather Works",
        Warehouse: "RAW MATERIAL STORE 9B",
        StoreName: "RAW MATERIAL STORE 9B",
        ReceivedBy: "Nikhil Singh",
        ApprovedBy: "Praveen Sharma",
        IssuedBy: "Ramesh Kumar",
        Department: "BAG SAMPLING",
        Currency: "INR",
        ExchangeRate: 1.00,
        Remark: "Production lot priority sampling hardware and trims",
        InternalMemo: "IRN approved under Work Order IO/9B/2627/35",
        Transporter: "In-House Transfer",
        ReqBy: "Ramesh Kumar",
        EntryOn: "03-11-2026 10:15AM",
        Status: "Pending",
        EntryBy: "Ramesh Kumar",
        UpdatedBy: "Admin",
        TotalQty: 25.0,
        RowCount: 3,
        details: [
            {
                IoNo: "IO/9B/2627/35",
                ItemCode: "HDW-6830",
                ItemName: "BRITTEN HASP 12.4MM HT-6830",
                Variant: "57-14K GOLD",
                SizeRange: "12.4mm",
                Color: "57-14K GOLD",
                Quantity: 15.0,
                UOM: "PCS",
                RequiredDate: "05-11-2026",
                Rate: 45.0,
                Amount: 675.0,
                Remarks: "Flap closure assembly"
            },
            {
                IoNo: "IO/9B/2627/35",
                ItemCode: "CHN-6582",
                ItemName: "METAL CHAIN 9.2MM OVAL LINK 2.5MMGG HT-6582",
                Variant: "57-14K GOLD",
                SizeRange: "138cm",
                Color: "57-14K GOLD",
                Quantity: 6.0,
                UOM: "PCS",
                RequiredDate: "05-11-2026",
                Rate: 125.0,
                Amount: 750.0,
                Remarks: "Shoulder strap hardware"
            },
            {
                IoNo: "IO/9B/2627/35",
                ItemCode: "PLR-3953",
                ItemName: "PULLER METAL NO.3 TBH-3953",
                Variant: "57-14K GOLD",
                SizeRange: "No. 3",
                Color: "57-14K GOLD",
                Quantity: 4.0,
                UOM: "PCS",
                RequiredDate: "05-11-2026",
                Rate: 18.0,
                Amount: 72.0,
                Remarks: "Inner zip slider"
            }
        ]
    },
    {
        ReqNo: "IRN/APP/9B/2627/2500",
        ReqType: "Production",
        Shift: "Shift I",
        IssueNo: "IS/AAPL9B/2627/088",
        ReqDate: "02-11-2026",
        Associate: "Balaji Trims & Fasteners",
        Supplier: "Balaji Trims & Fasteners",
        Warehouse: "RAW MATERIAL STORE 9B",
        StoreName: "RAW MATERIAL STORE 9B",
        ReceivedBy: "Sunil Sharma",
        ApprovedBy: "Praveen Sharma",
        IssuedBy: "Sunil Sharma",
        Department: "Cutting Dept",
        Currency: "INR",
        ExchangeRate: 1.00,
        Remark: "Main batch cutting requisition leather crust",
        InternalMemo: "Fast track cutting line 2",
        Transporter: "Self",
        ReqBy: "Sunil Sharma",
        EntryOn: "02-11-2026 09:30AM",
        Status: "Approved",
        EntryBy: "Sunil Sharma",
        UpdatedBy: "Admin",
        TotalQty: 185.5,
        RowCount: 2,
        details: [
            {
                IoNo: "IO/9B/2627/168",
                ItemCode: "LTH-1093",
                ItemName: "COW CULATTAS SINGLE LEATHER",
                Variant: "REGULAR",
                SizeRange: "Standard",
                Color: "BLACK",
                Quantity: 120.5,
                UOM: "SQFT",
                RequiredDate: "03-11-2026",
                Rate: 165.0,
                Amount: 19882.5,
                Remarks: "Upper panel cutting"
            },
            {
                IoNo: "IO/9B/2627/168",
                ItemCode: "LTH-1112",
                ItemName: "COW ECO VEG SIDE CRUST LEATHER",
                Variant: "NATURAL GRAIN",
                SizeRange: "Standard",
                Color: "TAN",
                Quantity: 65.0,
                UOM: "SQFT",
                RequiredDate: "03-11-2026",
                Rate: 180.0,
                Amount: 11700.0,
                Remarks: "Gusset and counter reinforcement"
            }
        ]
    },
    {
        ReqNo: "IRN/APP/9B/2627/2499",
        ReqType: "Production",
        Shift: "Shift II",
        IssueNo: "IS/AAPL9B/2627/087",
        ReqDate: "01-11-2026",
        Associate: "Supreme Leathercraft",
        Supplier: "Supreme Leathercraft",
        Warehouse: "SEMI FINISH STORE 9B",
        StoreName: "SEMI FINISH STORE 9B",
        ReceivedBy: "Pooja Verma",
        ApprovedBy: "Praveen Sharma",
        IssuedBy: "Pooja Verma",
        Department: "Stitching Floor",
        Currency: "INR",
        ExchangeRate: 1.00,
        Remark: "Stitching section fasteners and eyelets",
        InternalMemo: "Production line shift II allocation",
        Transporter: "In-House Transfer",
        ReqBy: "Pooja Verma",
        EntryOn: "01-11-2026 02:40PM",
        Status: "Issued",
        EntryBy: "Pooja Verma",
        UpdatedBy: "Nikhil Singh",
        TotalQty: 450.0,
        RowCount: 1,
        details: [
            {
                IoNo: "IO/9B/2627/172",
                ItemCode: "HDW-2236",
                ItemName: "JAM RIVET SINGLE HEAD 7MM",
                Variant: "NICKEL FREE",
                SizeRange: "7mm",
                Color: "ANTIQUE BRASS",
                Quantity: 450.0,
                UOM: "SET",
                RequiredDate: "02-11-2026",
                Rate: 2.2,
                Amount: 990.0,
                Remarks: "Corner riveting section"
            }
        ]
    },
    {
        ReqNo: "IRN/APP/9B/2627/2498",
        ReqType: "Sampling",
        Shift: "Shift I",
        IssueNo: "",
        ReqDate: "31-10-2026",
        Associate: "K-Tex Textiles",
        Supplier: "K-Tex Textiles",
        Warehouse: "STORE 30",
        StoreName: "STORE 30",
        ReceivedBy: "Ramesh Kumar",
        ApprovedBy: "Praveen Sharma",
        IssuedBy: "Sunil Sharma",
        Department: "Sampling Dept",
        Currency: "INR",
        ExchangeRate: 1.00,
        Remark: "High density topliner for lining development",
        InternalMemo: "Proto sample test batch",
        Transporter: "In-House Transfer",
        ReqBy: "Ramesh Kumar",
        EntryOn: "31-10-2026 11:15AM",
        Status: "Pending",
        EntryBy: "Ramesh Kumar",
        UpdatedBy: "",
        TotalQty: 600.0,
        RowCount: 1,
        details: [
            {
                IoNo: "IO/9B/2627/180",
                ItemCode: "RNF-1085",
                ItemName: "HIGH DENSITY TOPLINER 0.4MM",
                Variant: "ECO RESIN",
                SizeRange: "0.4mm",
                Color: "BLACK",
                Quantity: 600.0,
                UOM: "MTR",
                RequiredDate: "02-11-2026",
                Rate: 85.0,
                Amount: 51000.0,
                Remarks: "Lining reinforcement"
            }
        ]
    },
    {
        ReqNo: "IRN/APP/9B/2627/2497",
        ReqType: "General",
        Shift: "Shift I",
        IssueNo: "",
        ReqDate: "30-10-2026",
        Associate: "Classic Threads & Zips",
        Supplier: "Classic Threads & Zips",
        Warehouse: "RAW MATERIAL STORE 9B",
        StoreName: "RAW MATERIAL STORE 9B",
        ReceivedBy: "Ramesh Kumar",
        ApprovedBy: "Praveen Sharma",
        IssuedBy: "Sunil Sharma",
        Department: "Finishing Dept",
        Currency: "INR",
        ExchangeRate: 1.00,
        Remark: "Nylon zippers & poly-core sewing threads",
        InternalMemo: "Finishing & edge stitching lot",
        Transporter: "In-House Transfer",
        ReqBy: "Ramesh Kumar",
        EntryOn: "30-10-2026 04:00PM",
        Status: "Pending",
        EntryBy: "Ramesh Kumar",
        UpdatedBy: "",
        TotalQty: 150.0,
        RowCount: 2,
        details: [
            {
                IoNo: "IO/9B/2627/185",
                ItemCode: "TRM-3012",
                ItemName: "NYLON ZIPPER #5 OPEN END 65CM",
                Variant: "WATER REPELLENT",
                SizeRange: "65cm",
                Color: "NAVY",
                Quantity: 100.0,
                UOM: "PCS",
                RequiredDate: "01-11-2026",
                Rate: 24.0,
                Amount: 2400.0,
                Remarks: "Outer jacket closure"
            },
            {
                IoNo: "IO/9B/2627/185",
                ItemCode: "THD-1020",
                ItemName: "POLY-CORE SEWING THREAD 40/2",
                Variant: "BONDED",
                SizeRange: "40/2",
                Color: "NAVY",
                Quantity: 50.0,
                UOM: "SPOOL",
                RequiredDate: "01-11-2026",
                Rate: 35.0,
                Amount: 1750.0,
                Remarks: "Matching color thread"
            }
        ]
    }
];

// Initialize database with seed records if empty or outdated
function initializeSeedData() {
    db.get("SELECT COUNT(*) as count FROM ItemRequisitions", (err, row) => {
        if (!err && row && row.count === 0) {
            console.log("Seeding ItemRequisitions database with TPCS Fashion sample data...");
            const insertReq = db.prepare(`
                INSERT INTO ItemRequisitions (
                    ReqNo, ReqType, Shift, IssueNo, ReqDate, Associate, Supplier,
                    Warehouse, StoreName, ReceivedBy, ApprovedBy, IssuedBy,
                    Department, Currency, ExchangeRate, Remark, InternalMemo,
                    Transporter, ReqBy, EntryOn, Status, EntryBy, UpdatedBy,
                    TotalQty, RowCount
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            const insertDetail = db.prepare(`
                INSERT INTO ItemRequisitionDetails (
                    RequisitionID, IoNo, ItemCode, ItemName, Variant, SizeRange,
                    Color, Quantity, UOM, RequiredDate, Rate, Amount, Remarks
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            SEED_ITEM_REQUISITIONS.forEach((req) => {
                insertReq.run(
                    req.ReqNo,
                    req.ReqType,
                    req.Shift,
                    req.IssueNo,
                    req.ReqDate,
                    req.Associate,
                    req.Supplier,
                    req.Warehouse,
                    req.StoreName,
                    req.ReceivedBy,
                    req.ApprovedBy,
                    req.IssuedBy,
                    req.Department,
                    req.Currency,
                    req.ExchangeRate,
                    req.Remark,
                    req.InternalMemo,
                    req.Transporter,
                    req.ReqBy,
                    req.EntryOn,
                    req.Status,
                    req.EntryBy,
                    req.UpdatedBy,
                    req.TotalQty,
                    req.RowCount,
                    function (err2) {
                        if (!err2 && this.lastID) {
                            const newId = this.lastID;
                            req.details.forEach((det) => {
                                insertDetail.run(
                                    newId,
                                    det.IoNo || "",
                                    det.ItemCode,
                                    det.ItemName,
                                    det.Variant || "",
                                    det.SizeRange || "",
                                    det.Color,
                                    det.Quantity,
                                    det.UOM,
                                    det.RequiredDate,
                                    det.Rate || 0,
                                    det.Amount || 0,
                                    det.Remarks
                                );
                            });
                        }
                    }
                );
            });

            insertReq.finalize();
            insertDetail.finalize();
        }
    });
}

// Run seed verification
setTimeout(initializeSeedData, 800);

// GET /api/item-requisitions
exports.getAllItemRequisitions = (req, res) => {
    const { search, associate, supplier, status, department, warehouse, shift } = req.query;

    let query = `
        SELECT 
            r.*,
            COALESCE(r.Supplier, r.Associate) as SupplierName,
            COALESCE(r.StoreName, r.Warehouse) as ActiveStoreName
        FROM ItemRequisitions r
        WHERE 1=1
    `;
    const params = [];

    if (search || supplier || associate) {
        const s = search || supplier || associate;
        query += " AND (r.Associate LIKE ? OR r.Supplier LIKE ? OR r.ReqNo LIKE ? OR r.Remark LIKE ? OR r.Department LIKE ?)";
        params.push(`%${s}%`, `%${s}%`, `%${s}%`, `%${s}%`, `%${s}%`);
    }

    if (status && status !== "All") {
        query += " AND r.Status = ?";
        params.push(status);
    }

    if (department && department !== "All") {
        query += " AND r.Department = ?";
        params.push(department);
    }

    if (warehouse && warehouse !== "All") {
        query += " AND (r.Warehouse = ? OR r.StoreName = ?)";
        params.push(warehouse, warehouse);
    }

    if (shift && shift !== "All") {
        query += " AND r.Shift = ?";
        params.push(shift);
    }

    query += " ORDER BY r.RequisitionID DESC";

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error("Error fetching ItemRequisitions:", err);
            return res.status(500).json({ success: false, error: err.message, data: SEED_ITEM_REQUISITIONS });
        }

        if (!rows || rows.length === 0) {
            return res.json({ success: true, count: SEED_ITEM_REQUISITIONS.length, data: SEED_ITEM_REQUISITIONS });
        }

        // Fetch detail rows for each requisition
        db.all("SELECT * FROM ItemRequisitionDetails", [], (errDetails, detailRows) => {
            const detailsMap = {};
            if (!errDetails && detailRows) {
                detailRows.forEach((d) => {
                    if (!detailsMap[d.RequisitionID]) {
                        detailsMap[d.RequisitionID] = [];
                    }
                    detailsMap[d.RequisitionID].push(d);
                });
            }

            const combined = rows.map((r) => ({
                ...r,
                Supplier: r.Supplier || r.Associate,
                StoreName: r.StoreName || r.Warehouse || "RAW MATERIAL STORE 9B",
                Shift: r.Shift || "Shift I",
                ReqType: r.ReqType || "Production",
                Currency: r.Currency || "INR",
                ExchangeRate: r.ExchangeRate || 1.00,
                IssuedBy: r.IssuedBy || "-",
                details: detailsMap[r.RequisitionID] || []
            }));

            res.json({ success: true, count: combined.length, data: combined });
        });
    });
};

// GET /api/item-requisitions/:id
exports.getItemRequisitionById = (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM ItemRequisitions WHERE RequisitionID = ?", [id], (err, reqRow) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        if (!reqRow) {
            return res.status(404).json({ success: false, message: "Item Requisition not found" });
        }

        db.all("SELECT * FROM ItemRequisitionDetails WHERE RequisitionID = ?", [id], (err2, details) => {
            if (err2) {
                return res.status(500).json({ success: false, error: err2.message });
            }
            res.json({
                success: true,
                data: {
                    ...reqRow,
                    Supplier: reqRow.Supplier || reqRow.Associate,
                    StoreName: reqRow.StoreName || reqRow.Warehouse,
                    details: details || []
                }
            });
        });
    });
};

// POST /api/item-requisitions
exports.createItemRequisition = (req, res) => {
    const data = req.body;
    const items = Array.isArray(data.details || data.items) ? (data.details || data.items) : [];
    const totalQty = items.reduce((sum, it) => sum + Number(it.Quantity || 0), 0);
    const rowCount = Math.max(items.length, 1);

    const reqNo = data.ReqNo || `IRN/APP/9B/2627/${Math.floor(2500 + Math.random() * 500)}`;

    const query = `
        INSERT INTO ItemRequisitions (
            ReqNo, ReqType, Shift, IssueNo, ReqDate, Associate, Supplier,
            Warehouse, StoreName, ReceivedBy, ApprovedBy, IssuedBy,
            Department, Currency, ExchangeRate, Remark, InternalMemo,
            Transporter, ReqBy, EntryOn, Status, EntryBy, UpdatedBy,
            TotalQty, RowCount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        reqNo,
        data.ReqType || "Production",
        data.Shift || "Shift I",
        data.IssueNo || "",
        data.ReqDate || data.Date || new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        data.Associate || data.Supplier || "",
        data.Supplier || data.Associate || "",
        data.Warehouse || data.StoreName || data.Stores || "RAW MATERIAL STORE 9B",
        data.StoreName || data.Warehouse || data.Stores || "RAW MATERIAL STORE 9B",
        data.ReceivedBy || "",
        data.ApprovedBy || "",
        data.IssuedBy || "-",
        data.Department || "BAG SAMPLING",
        data.Currency || "INR",
        Number(data.ExchangeRate) || 1.00,
        data.Remark || "",
        data.InternalMemo || "",
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

        const requisitionId = this.lastID || Math.floor(Math.random() * 10000);
        if (items.length > 0) {
            const detailStmt = db.prepare(`
                INSERT INTO ItemRequisitionDetails (
                    RequisitionID, IoNo, ItemCode, ItemName, Variant, SizeRange,
                    Color, Quantity, UOM, RequiredDate, Rate, Amount, Remarks
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            items.forEach((d) => {
                detailStmt.run(
                    requisitionId,
                    d.IoNo || "",
                    d.ItemCode || "",
                    d.ItemName || "",
                    d.Variant || "",
                    d.SizeRange || "",
                    d.Color || "",
                    Number(d.Quantity) || 0,
                    d.UOM || "PCS",
                    d.RequiredDate || data.ReqDate || "",
                    Number(d.Rate) || 0,
                    Number(d.Amount) || ((Number(d.Quantity) || 0) * (Number(d.Rate) || 0)),
                    d.Remarks || ""
                );
            });
            detailStmt.finalize();
        }

        res.status(201).json({
            success: true,
            message: "Item Requisition Note created successfully",
            data: {
                RequisitionID: requisitionId,
                ReqNo: reqNo,
                ...data,
                Supplier: data.Supplier || data.Associate,
                StoreName: data.StoreName || data.Stores || "RAW MATERIAL STORE 9B",
                TotalQty: totalQty,
                RowCount: rowCount
            }
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
            ReqType = ?, Shift = ?, IssueNo = ?, ReqDate = ?, Associate = ?,
            Supplier = ?, Warehouse = ?, StoreName = ?, ReceivedBy = ?, ApprovedBy = ?,
            IssuedBy = ?, Department = ?, Currency = ?, ExchangeRate = ?,
            Remark = ?, InternalMemo = ?, Transporter = ?, ReqBy = ?, Status = ?,
            UpdatedBy = ?, TotalQty = ?, RowCount = ?
        WHERE RequisitionID = ?
    `;

    const params = [
        data.ReqType || "Production",
        data.Shift || "Shift I",
        data.IssueNo || "",
        data.ReqDate || data.Date,
        data.Associate || data.Supplier,
        data.Supplier || data.Associate,
        data.Warehouse || data.StoreName || data.Stores,
        data.StoreName || data.Warehouse || data.Stores,
        data.ReceivedBy || "",
        data.ApprovedBy || "",
        data.IssuedBy || "-",
        data.Department,
        data.Currency || "INR",
        Number(data.ExchangeRate) || 1.00,
        data.Remark,
        data.InternalMemo,
        data.Transporter || "In-House Transfer",
        data.ReqBy || "Admin",
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
                        RequisitionID, IoNo, ItemCode, ItemName, Variant, SizeRange,
                        Color, Quantity, UOM, RequiredDate, Rate, Amount, Remarks
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                items.forEach((d) => {
                    detailStmt.run(
                        id,
                        d.IoNo || "",
                        d.ItemCode || "",
                        d.ItemName || "",
                        d.Variant || "",
                        d.SizeRange || "",
                        d.Color || "",
                        Number(d.Quantity) || 0,
                        d.UOM || "PCS",
                        d.RequiredDate || "",
                        Number(d.Rate) || 0,
                        Number(d.Amount) || ((Number(d.Quantity) || 0) * (Number(d.Rate) || 0)),
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
