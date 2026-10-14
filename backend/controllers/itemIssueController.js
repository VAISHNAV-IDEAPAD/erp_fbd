const db = require("../config/database");

// ======================================================
// INITIAL SAMPLE SEED DATA MATCHING TPCS FASHION ERP
// ======================================================
const SEED_ITEM_ISSUES = [
    {
        IssueNo: "IS/AAPL9B/2627/088",
        IssueDate: "13-10-2026",
        UpdatedBy: "Nikhil Singh",
        UpdatedOn: "Oct 13 2026 04:30PM",
        JWNo: "JW-9821",
        ExchangeRate: 1.0,
        Remark: "Batch 104 Cutting",
        SupplierName: "Apex Leather Works",
        IssuedBy: "Ramesh Kumar",
        Stores: "RAW MATERIAL STORE 9B",
        InternalMemo: "Bulk cutting line 1",
        Currency: "INR",
        ExpiryDate: "31-10-2026",
        JCNo: "JC-4512",
        TotalQty: 185.5,
        RowCount: 2,
        Status: "Completed",
        details: [
            { ItemCode: "LTH-1093", ItemName: "COW CULATTAS SINGLE LEATHER", Color: "BLACK", Quantity: 120.5, UOM: "SQFT", Rate: 145.0, Amount: 17472.5, Remarks: "Upper cutting" },
            { ItemCode: "LTH-1112", ItemName: "COW ECO VEG SIDE CRUST LEATHER", Color: "TAN", Quantity: 65.0, UOM: "SQFT", Rate: 160.0, Amount: 10400.0, Remarks: "Counter reinforcement" }
        ]
    },
    {
        IssueNo: "IS/AAPL9B/2627/087",
        IssueDate: "13-10-2026",
        UpdatedBy: "Admin",
        UpdatedOn: "Oct 13 2026 02:15PM",
        JWNo: "JW-9818",
        ExchangeRate: 1.0,
        Remark: "Urgent sampling line",
        SupplierName: "Balaji Trims & Fasteners",
        IssuedBy: "Nikhil Singh",
        Stores: "SEMI FINISH STORE 9B",
        InternalMemo: "Internal sample dev FY26-27",
        Currency: "INR",
        ExpiryDate: "28-10-2026",
        JCNo: "JC-4509",
        TotalQty: 450.0,
        RowCount: 1,
        Status: "Completed",
        details: [
            { ItemCode: "HDW-2236", ItemName: "JAM RIVET SINGLE HEAD 7MM", Color: "ANTIQUE BRASS", Quantity: 450.0, UOM: "SET", Rate: 1.85, Amount: 832.5, Remarks: "Riveting section" }
        ]
    },
    {
        IssueNo: "IS/AAPL9B/2627/086",
        IssueDate: "12-10-2026",
        UpdatedBy: "",
        UpdatedOn: "",
        JWNo: "JW-9805",
        ExchangeRate: 1.0,
        Remark: "Stitching floor issue",
        SupplierName: "Supreme Leathercraft",
        IssuedBy: "Pooja Verma",
        Stores: "SEMI FINISH STORE 18",
        InternalMemo: "Regular order dispatch",
        Currency: "INR",
        ExpiryDate: "",
        JCNo: "JC-4498",
        TotalQty: 320.0,
        RowCount: 2,
        Status: "Completed",
        details: [
            { ItemCode: "SFS-105", ItemName: "Reinforcement Strips 25mm", Color: "WHITE", Quantity: 200.0, UOM: "MTR", Rate: 12.0, Amount: 2400.0, Remarks: "Collar reinforcement" },
            { ItemCode: "SFS-106", ItemName: "Padded Tongue Inserts", Color: "NATURAL", Quantity: 120.0, UOM: "PCS", Rate: 18.5, Amount: 2220.0, Remarks: "Assembly line" }
        ]
    },
    {
        IssueNo: "IS/AAPL9B/2627/085",
        IssueDate: "12-10-2026",
        UpdatedBy: "Nikhil Singh",
        UpdatedOn: "Oct 12 2026 11:45AM",
        JWNo: "",
        ExchangeRate: 1.0,
        Remark: "MT-21980 Lining issue",
        SupplierName: "K-Tex Textiles",
        IssuedBy: "Ramesh Kumar",
        Stores: "RAW MATERIAL STORE 9B",
        InternalMemo: "Export batch lining",
        Currency: "INR",
        ExpiryDate: "15-11-2026",
        JCNo: "JC-4481",
        TotalQty: 600.0,
        RowCount: 1,
        Status: "Completed",
        details: [
            { ItemCode: "RNF-1085", ItemName: "HIGH DENSITY TOPLINER 0.4MM", Color: "BLACK", Quantity: 600.0, UOM: "MTR", Rate: 32.5, Amount: 19500.0, Remarks: "Lining cutting" }
        ]
    },
    {
        IssueNo: "IS/AAPL9B/2627/084",
        IssueDate: "11-10-2026",
        UpdatedBy: "",
        UpdatedOn: "",
        JWNo: "JW-9791",
        ExchangeRate: 1.0,
        Remark: "Assembly batch 19",
        SupplierName: "Shree Ganesh Fabrics",
        IssuedBy: "Suresh Patel",
        Stores: "RAW MATERIAL STORE 9B",
        InternalMemo: "Production run order #4021",
        Currency: "INR",
        ExpiryDate: "",
        JCNo: "JC-4465",
        TotalQty: 85.0,
        RowCount: 1,
        Status: "Completed",
        details: [
            { ItemCode: "NONWO5064", ItemName: "TALIN 0.3MM WHITE", Color: "WHITE", Quantity: 85.0, UOM: "MTR", Rate: 24.0, Amount: 2040.0, Remarks: "Toe puff reinforcement" }
        ]
    },
    {
        IssueNo: "IS/AAPL9B/2627/083",
        IssueDate: "10-10-2026",
        UpdatedBy: "Admin",
        UpdatedOn: "Oct 10 2026 05:00PM",
        JWNo: "JW-9780",
        ExchangeRate: 1.0,
        Remark: "Premium upper dispatch",
        SupplierName: "Prime Leather Tanning",
        IssuedBy: "Nikhil Singh",
        Stores: "RAW MATERIAL STORE 9B",
        InternalMemo: "Sample boots prototype",
        Currency: "INR",
        ExpiryDate: "30-10-2026",
        JCNo: "JC-4450",
        TotalQty: 112.5,
        RowCount: 1,
        Status: "Completed",
        details: [
            { ItemCode: "LTH-1263", ItemName: "COW PLOSE SUEDE LEATHER", Color: "COGNAC", Quantity: 112.5, UOM: "SQFT", Rate: 175.0, Amount: 19687.5, Remarks: "High grade suede issue" }
        ]
    },
    {
        IssueNo: "IS/AAPL9B/2627/082",
        IssueDate: "10-10-2026",
        UpdatedBy: "",
        UpdatedOn: "",
        JWNo: "",
        ExchangeRate: 1.0,
        Remark: "Packing division issue",
        SupplierName: "Vardhman Yarns & Threads",
        IssuedBy: "Pooja Verma",
        Stores: "RAW MATERIAL STORE 9B",
        InternalMemo: "Final box packaging",
        Currency: "INR",
        ExpiryDate: "",
        JCNo: "JC-4432",
        TotalQty: 250.0,
        RowCount: 1,
        Status: "Completed",
        details: [
            { ItemCode: "PKG-2200", ItemName: "CARD PAPER 350G 31X43 INCH", Color: "NATURAL", Quantity: 250.0, UOM: "SHEET", Rate: 8.5, Amount: 2125.0, Remarks: "Shoe box inserts" }
        ]
    }
];

// ======================================================
// SEED INITIAL DATA IF TABLE IS EMPTY
// ======================================================
function seedInitialDataIfEmpty() {
    db.get("SELECT COUNT(*) AS count FROM ItemIssues", [], (err, row) => {
        if (!err && row && row.count === 0) {
            console.log("🌱 Seeding ItemIssues with TPCS Fashion ERP records...");
            db.serialize(() => {
                db.run("BEGIN TRANSACTION");
                const insertII = db.prepare(`
                    INSERT INTO ItemIssues (
                        IssueNo, IssueDate, UpdatedBy, UpdatedOn, JWNo, JCNo,
                        SupplierName, IssuedBy, Stores, Remark, InternalMemo,
                        Currency, ExchangeRate, ExpiryDate, TotalQty, RowCount, Status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                const insertDetail = db.prepare(`
                    INSERT INTO ItemIssueDetails (
                        IssueID, ItemCode, ItemName, Color, Quantity, UOM, Rate, Amount, Remarks
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                SEED_ITEM_ISSUES.forEach(item => {
                    insertII.run(
                        item.IssueNo,
                        item.IssueDate,
                        item.UpdatedBy,
                        item.UpdatedOn,
                        item.JWNo,
                        item.JCNo,
                        item.SupplierName,
                        item.IssuedBy,
                        item.Stores,
                        item.Remark,
                        item.InternalMemo,
                        item.Currency,
                        item.ExchangeRate,
                        item.ExpiryDate,
                        item.TotalQty,
                        item.RowCount,
                        "Completed",
                        function (e) {
                            if (!e && this.lastID && item.details) {
                                item.details.forEach(d => {
                                    insertDetail.run(
                                        this.lastID,
                                        d.ItemCode,
                                        d.ItemName,
                                        d.Color || "",
                                        d.Quantity,
                                        d.UOM,
                                        d.Rate || 0,
                                        d.Amount || (d.Quantity * (d.Rate || 0)),
                                        d.Remarks || ""
                                    );
                                });
                            }
                        }
                    );
                });

                db.run("COMMIT", () => {
                    insertII.finalize();
                    insertDetail.finalize();
                    console.log("✓ ItemIssues seeded successfully");
                });
            });
        }
    });
}

setTimeout(seedInitialDataIfEmpty, 600);

// ======================================================
// CONTROLLER HANDLERS
// ======================================================

// GET /api/item-issues or /api/stock-issues
exports.getAllItemIssues = (req, res) => {
    const { store, search, jwNo, jcNo } = req.query;
    let sql = "SELECT * FROM ItemIssues WHERE 1=1";
    const params = [];

    if (store && store !== "All") {
        sql += " AND Stores = ?";
        params.push(store);
    }

    if (jwNo) {
        sql += " AND JWNo LIKE ?";
        params.push(`%${jwNo}%`);
    }

    if (jcNo) {
        sql += " AND JCNo LIKE ?";
        params.push(`%${jcNo}%`);
    }

    if (search) {
        sql += " AND (IssueNo LIKE ? OR SupplierName LIKE ? OR Remark LIKE ? OR InternalMemo LIKE ? OR IssuedBy LIKE ?)";
        const term = `%${search}%`;
        params.push(term, term, term, term, term);
    }

    sql += " ORDER BY IssueID DESC";

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message, data: SEED_ITEM_ISSUES });
        }
        res.json({
            success: true,
            count: rows.length,
            data: rows.length > 0 ? rows : SEED_ITEM_ISSUES
        });
    });
};

// GET /api/item-issues/:id
exports.getItemIssueById = (req, res) => {
    const id = req.params.id;

    db.get("SELECT * FROM ItemIssues WHERE IssueID = ? OR IssueNo = ?", [id, id], (err, record) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (!record) {
            const fallback = SEED_ITEM_ISSUES.find(it => String(it.IssueNo) === String(id));
            if (fallback) return res.json({ success: true, data: fallback });
            return res.status(404).json({ success: false, message: "Item issue not found" });
        }

        db.all("SELECT * FROM ItemIssueDetails WHERE IssueID = ?", [record.IssueID], (err2, details) => {
            if (err2) return res.status(500).json({ success: false, error: err2.message });
            res.json({
                success: true,
                data: {
                    ...record,
                    details: details || []
                }
            });
        });
    });
};

// POST /api/item-issues
exports.createItemIssue = (req, res) => {
    const {
        IssueNo,
        IssueDate,
        UpdatedBy,
        JWNo,
        JCNo,
        SupplierID,
        SupplierName,
        IssuedBy,
        Stores,
        Remark,
        InternalMemo,
        Currency,
        ExchangeRate,
        ExpiryDate,
        TotalQty,
        RowCount,
        details = []
    } = req.body;

    const issueNoFinal = IssueNo || `IS/AAPL9B/2627/${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const updatedOn = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) +
        " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const sql = `
        INSERT INTO ItemIssues (
            IssueNo, IssueDate, UpdatedBy, UpdatedOn, JWNo, JCNo,
            SupplierID, SupplierName, IssuedBy, Stores, Remark, InternalMemo,
            Currency, ExchangeRate, ExpiryDate, TotalQty, RowCount, Status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            issueNoFinal,
            IssueDate || new Date().toISOString().split("T")[0],
            UpdatedBy || "Nikhil Singh",
            updatedOn,
            JWNo || "",
            JCNo || "",
            SupplierID || null,
            SupplierName || "",
            IssuedBy || "Nikhil Singh",
            Stores || "RAW MATERIAL STORE 9B",
            Remark || "",
            InternalMemo || "",
            Currency || "INR",
            Number(ExchangeRate) || 1.0,
            ExpiryDate || "",
            Number(TotalQty) || 0,
            Number(RowCount) || details.length || 1,
            "Completed"
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ success: false, error: err.message });
            }

            const issueId = this.lastID;

            if (Array.isArray(details) && details.length > 0) {
                const insertDetail = db.prepare(`
                    INSERT INTO ItemIssueDetails (
                        IssueID, ItemCode, ItemName, Color, Quantity, UOM, Rate, Amount, Remarks
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                details.forEach(d => {
                    const qty = Number(d.Quantity) || 0;
                    const rate = Number(d.Rate) || 0;
                    insertDetail.run(
                        issueId,
                        d.ItemCode || "",
                        d.ItemName || "",
                        d.Color || "",
                        qty,
                        d.UOM || "PCS",
                        rate,
                        qty * rate,
                        d.Remarks || ""
                    );
                });

                insertDetail.finalize();
            }

            res.status(201).json({
                success: true,
                message: "Item Issue created successfully",
                IssueID: issueId,
                IssueNo: issueNoFinal
            });
        }
    );
};

// PUT /api/item-issues/:id
exports.updateItemIssue = (req, res) => {
    const id = req.params.id;
    const {
        IssueDate,
        UpdatedBy,
        JWNo,
        JCNo,
        SupplierID,
        SupplierName,
        IssuedBy,
        Stores,
        Remark,
        InternalMemo,
        Currency,
        ExchangeRate,
        ExpiryDate,
        TotalQty,
        RowCount,
        details
    } = req.body;

    const now = new Date();
    const updatedOn = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) +
        " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const sql = `
        UPDATE ItemIssues SET
            IssueDate = COALESCE(?, IssueDate),
            UpdatedBy = ?,
            UpdatedOn = ?,
            JWNo = COALESCE(?, JWNo),
            JCNo = COALESCE(?, JCNo),
            SupplierID = COALESCE(?, SupplierID),
            SupplierName = COALESCE(?, SupplierName),
            IssuedBy = COALESCE(?, IssuedBy),
            Stores = COALESCE(?, Stores),
            Remark = COALESCE(?, Remark),
            InternalMemo = COALESCE(?, InternalMemo),
            Currency = COALESCE(?, Currency),
            ExchangeRate = COALESCE(?, ExchangeRate),
            ExpiryDate = COALESCE(?, ExpiryDate),
            TotalQty = COALESCE(?, TotalQty),
            RowCount = COALESCE(?, RowCount)
        WHERE IssueID = ? OR IssueNo = ?
    `;

    db.run(
        sql,
        [
            IssueDate,
            UpdatedBy || "Nikhil Singh",
            updatedOn,
            JWNo,
            JCNo,
            SupplierID,
            SupplierName,
            IssuedBy,
            Stores,
            Remark,
            InternalMemo,
            Currency,
            ExchangeRate,
            ExpiryDate,
            TotalQty,
            RowCount,
            id,
            id
        ],
        function (err) {
            if (err) return res.status(500).json({ success: false, error: err.message });

            if (Array.isArray(details)) {
                db.run("DELETE FROM ItemIssueDetails WHERE IssueID = ?", [id], () => {
                    const insertDetail = db.prepare(`
                        INSERT INTO ItemIssueDetails (
                            IssueID, ItemCode, ItemName, Color, Quantity, UOM, Rate, Amount, Remarks
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `);

                    details.forEach(d => {
                        const qty = Number(d.Quantity) || 0;
                        const rate = Number(d.Rate) || 0;
                        insertDetail.run(
                            id,
                            d.ItemCode || "",
                            d.ItemName || "",
                            d.Color || "",
                            qty,
                            d.UOM || "PCS",
                            rate,
                            qty * rate,
                            d.Remarks || ""
                        );
                    });

                    insertDetail.finalize();
                });
            }

            res.json({ success: true, message: "Item Issue updated successfully" });
        }
    );
};

// DELETE /api/item-issues/:id
exports.deleteItemIssue = (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM ItemIssues WHERE IssueID = ? OR IssueNo = ?", [id, id], function (err) {
        if (err) return res.status(500).json({ success: false, error: err.message });
        db.run("DELETE FROM ItemIssueDetails WHERE IssueID = ?", [id]);
        res.json({ success: true, message: "Item Issue deleted successfully" });
    });
};

module.exports = exports;
