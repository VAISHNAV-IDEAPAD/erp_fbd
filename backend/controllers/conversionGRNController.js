const db = require("../config/database");

// ======================================================
// SEED DATA MATCHING TPCS FASHION CONVERSION GRN
// ======================================================
const SEED_CONVERSION_GRNS = [
    {
        JSTCNo: "JSTC/30/2627/12",
        Subcontractor: "Apex Garment Processors",
        SubcontractOrderNo: "SCO/30/2627/45",
        ConversionDate: "12-10-2026",
        Store: "RAW MATERIAL STORE 30",
        Currency: "INR",
        ExchangeRate: 1.0,
        TotalQty: 240.0,
        RowCount: 1,
        Status: "Approved",
        Remarks: "Enzyme washed canvas fabric receipt",
        CreatedBy: "Admin",
        details: [
            {
                FromItemCode: "FAB-1001",
                FromItemName: "CANVAS CLOTH 278 GSM 10 OZ GREIGE",
                FromColor: "GREIGE",
                FromUOM: "MTR",
                FromQty: 240.0,
                ToItemCode: "FAB-1004",
                ToItemName: "WASHED CANVAS CLOTH 10 OZ",
                ToColor: "VINTAGE WASH",
                ToUOM: "MTR",
                ToQty: 236.5,
                ProcessName: "Enzyme Wash & Softening",
                Remarks: "Shrinkage allowance 1.5%"
            }
        ]
    },
    {
        JSTCNo: "JSTC/30/2627/11",
        Subcontractor: "Quality Leather Works",
        SubcontractOrderNo: "SCO/30/2627/42",
        ConversionDate: "08-10-2026",
        Store: "STORE 30",
        Currency: "INR",
        ExchangeRate: 1.0,
        TotalQty: 150.5,
        RowCount: 1,
        Status: "Pending Approval",
        Remarks: "Edge skiving and splitting batch 4",
        CreatedBy: "9b Fabric",
        details: [
            {
                FromItemCode: "LTH-1263",
                FromItemName: "COW PLOSE SUEDE LEATHER",
                FromColor: "COGNAC",
                FromUOM: "SQFT",
                FromQty: 150.5,
                ToItemCode: "LTH-1263-SKV",
                ToItemName: "SKIVED SUEDE LEATHER STRIPS",
                ToColor: "COGNAC",
                ToUOM: "SQFT",
                ToQty: 148.0,
                ProcessName: "Splitting & Edge Skiving",
                Remarks: "Pre-cut for handles"
            }
        ]
    },
    {
        JSTCNo: "JSTC/30/2627/10",
        Subcontractor: "Vanguard Stitches Ltd",
        SubcontractOrderNo: "SCO/30/2627/39",
        ConversionDate: "04-10-2026",
        Store: "RAW MATERIAL STORE 30",
        Currency: "INR",
        ExchangeRate: 1.0,
        TotalQty: 88.0,
        RowCount: 1,
        Status: "Approved",
        Remarks: "Gusset assembly subcontract conversion",
        CreatedBy: "Admin",
        details: [
            {
                FromItemCode: "CUT-102",
                FromItemName: "FRONT GUSSET PANELS",
                FromColor: "NAVY",
                FromUOM: "PCS",
                FromQty: 88.0,
                ToItemCode: "SFS-108",
                ToItemName: "STITCHED GUSSET PIECES",
                ToColor: "NAVY",
                ToUOM: "PCS",
                ToQty: 88.0,
                ProcessName: "Subcontract Stitching",
                Remarks: "Passed QC inspection"
            }
        ]
    },
    {
        JSTCNo: "JSTC/30/2627/9",
        Subcontractor: "TexCraft Dyeing & Treatment",
        SubcontractOrderNo: "SCO/30/2627/35",
        ConversionDate: "28-09-2026",
        Store: "SEMI FINISH STORE 18",
        Currency: "INR",
        ExchangeRate: 1.0,
        TotalQty: 312.0,
        RowCount: 1,
        Status: "Completed",
        Remarks: "Water-repellent coating treatment",
        CreatedBy: "Admin",
        details: [
            {
                FromItemCode: "FAB-2003",
                FromItemName: "POLY TWILL LINING 150D",
                FromColor: "BLACK",
                FromUOM: "MTR",
                FromQty: 312.0,
                ToItemCode: "FAB-2003-WR",
                ToItemName: "POLY TWILL LINING WR COATED",
                ToColor: "BLACK",
                ToUOM: "MTR",
                ToQty: 310.0,
                ProcessName: "Water Repellent Coating",
                Remarks: "Coating certified Grade 4"
            }
        ]
    },
    {
        JSTCNo: "JSTC/30/2627/8",
        Subcontractor: "Apex Garment Processors",
        SubcontractOrderNo: "SCO/30/2627/31",
        ConversionDate: "22-09-2026",
        Store: "RAW MATERIAL STORE 30",
        Currency: "INR",
        ExchangeRate: 1.0,
        TotalQty: 540.0,
        RowCount: 1,
        Status: "Approved",
        Remarks: "Reactive dye conversion",
        CreatedBy: "Admin",
        details: [
            {
                FromItemCode: "FAB-1001",
                FromItemName: "CANVAS CLOTH 278 GSM 10 OZ GREIGE",
                FromColor: "GREIGE",
                FromUOM: "MTR",
                FromQty: 540.0,
                ToItemCode: "FAB-1002",
                ToItemName: "CANVAS CLOTH 278 GSM 10 OZ DYED",
                ToColor: "OLIVE GREEN",
                ToUOM: "MTR",
                ToQty: 535.0,
                ProcessName: "Dyeing",
                Remarks: "Standard lot conversion"
            }
        ]
    }
];

// Seed on startup if empty
function seedConversionGRNIfEmpty() {
    db.get("SELECT COUNT(*) as count FROM SubcontractConversionGRN", [], (err, row) => {
        if (!err && row && row.count === 0) {
            console.log("🌱 Seeding SubcontractConversionGRN records...");
            SEED_CONVERSION_GRNS.forEach(grn => {
                db.run(
                    `INSERT INTO SubcontractConversionGRN 
                    (JSTCNo, Subcontractor, SubcontractOrderNo, ConversionDate, Store, Currency, ExchangeRate, TotalQty, RowCount, Status, Remarks, CreatedBy)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        grn.JSTCNo,
                        grn.Subcontractor,
                        grn.SubcontractOrderNo,
                        grn.ConversionDate,
                        grn.Store,
                        grn.Currency,
                        grn.ExchangeRate,
                        grn.TotalQty,
                        grn.RowCount,
                        grn.Status,
                        grn.Remarks,
                        grn.CreatedBy
                    ],
                    function(insertErr) {
                        if (!insertErr && grn.details) {
                            const newId = this.lastID;
                            grn.details.forEach(det => {
                                db.run(
                                    `INSERT INTO SubcontractConversionGRNDetails
                                    (GRNID, FromItemCode, FromItemName, FromColor, FromUOM, FromQty, ToItemCode, ToItemName, ToColor, ToUOM, ToQty, ProcessName, Remarks)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                    [
                                        newId,
                                        det.FromItemCode,
                                        det.FromItemName,
                                        det.FromColor,
                                        det.FromUOM,
                                        det.FromQty,
                                        det.ToItemCode,
                                        det.ToItemName,
                                        det.ToColor,
                                        det.ToUOM,
                                        det.ToQty,
                                        det.ProcessName,
                                        det.Remarks
                                    ]
                                );
                            });
                        }
                    }
                );
            });
        }
    });
}

// Call seed check after small delay
setTimeout(seedConversionGRNIfEmpty, 800);

// ======================================================
// CONTROLLER HANDLERS
// ======================================================

// GET all Conversion GRNs with optional search & filter
exports.getAllConversionGRNs = (req, res) => {
    const { search, subcontractor, store, status } = req.query;

    let query = "SELECT * FROM SubcontractConversionGRN WHERE 1=1";
    const params = [];

    if (search && search.trim()) {
        query += " AND (JSTCNo LIKE ? OR Subcontractor LIKE ? OR SubcontractOrderNo LIKE ? OR Remarks LIKE ?)";
        const term = `%${search.trim()}%`;
        params.push(term, term, term, term);
    }

    if (subcontractor && subcontractor !== "All") {
        query += " AND Subcontractor = ?";
        params.push(subcontractor);
    }

    if (store && store !== "All") {
        query += " AND Store = ?";
        params.push(store);
    }

    if (status && status !== "All") {
        query += " AND Status = ?";
        params.push(status);
    }

    query += " ORDER BY GRNID DESC";

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    });
};

// GET single Conversion GRN by ID with details
exports.getConversionGRNById = (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM SubcontractConversionGRN WHERE GRNID = ?", [id], (err, header) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!header) return res.status(404).json({ error: "Conversion GRN not found" });

        db.all("SELECT * FROM SubcontractConversionGRNDetails WHERE GRNID = ?", [id], (detErr, details) => {
            if (detErr) return res.status(500).json({ error: detErr.message });
            res.json({
                success: true,
                data: {
                    ...header,
                    details: details || []
                }
            });
        });
    });
};

// CREATE new Conversion GRN
exports.createConversionGRN = (req, res) => {
    const {
        JSTCNo,
        Subcontractor,
        SubcontractOrderNo,
        ConversionDate,
        Store,
        Currency = "INR",
        ExchangeRate = 1.0,
        TotalQty = 0,
        RowCount = 1,
        Status = "Approved",
        Remarks = "",
        CreatedBy = "Admin",
        details = []
    } = req.body;

    if (!Subcontractor || !Store) {
        return res.status(400).json({ error: "Subcontractor and Store are required" });
    }

    const finalNo = JSTCNo || `JSTC/30/2627/${Math.floor(100 + Math.random() * 900)}`;

    db.run(
        `INSERT INTO SubcontractConversionGRN 
        (JSTCNo, Subcontractor, SubcontractOrderNo, ConversionDate, Store, Currency, ExchangeRate, TotalQty, RowCount, Status, Remarks, CreatedBy)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            finalNo,
            Subcontractor,
            SubcontractOrderNo || "",
            ConversionDate || new Date().toISOString().split("T")[0],
            Store,
            Currency,
            ExchangeRate,
            TotalQty,
            details.length || RowCount || 1,
            Status,
            Remarks,
            CreatedBy
        ],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });

            const newId = this.lastID;
            if (details && details.length > 0) {
                details.forEach(det => {
                    db.run(
                        `INSERT INTO SubcontractConversionGRNDetails
                        (GRNID, FromItemCode, FromItemName, FromColor, FromUOM, FromQty, ToItemCode, ToItemName, ToColor, ToUOM, ToQty, ProcessName, Remarks)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            newId,
                            det.FromItemCode || "",
                            det.FromItemName || "",
                            det.FromColor || "",
                            det.FromUOM || "",
                            det.FromQty || 0,
                            det.ToItemCode || "",
                            det.ToItemName || "",
                            det.ToColor || "",
                            det.ToUOM || "",
                            det.ToQty || 0,
                            det.ProcessName || "",
                            det.Remarks || ""
                        ]
                    );
                });
            }

            res.status(201).json({
                success: true,
                message: "Conversion GRN created successfully",
                data: {
                    GRNID: newId,
                    JSTCNo: finalNo
                }
            });
        }
    );
};

// UPDATE Conversion GRN
exports.updateConversionGRN = (req, res) => {
    const { id } = req.params;
    const {
        Subcontractor,
        SubcontractOrderNo,
        ConversionDate,
        Store,
        Status,
        Remarks,
        TotalQty
    } = req.body;

    db.run(
        `UPDATE SubcontractConversionGRN 
        SET Subcontractor = COALESCE(?, Subcontractor),
            SubcontractOrderNo = COALESCE(?, SubcontractOrderNo),
            ConversionDate = COALESCE(?, ConversionDate),
            Store = COALESCE(?, Store),
            Status = COALESCE(?, Status),
            Remarks = COALESCE(?, Remarks),
            TotalQty = COALESCE(?, TotalQty)
        WHERE GRNID = ?`,
        [Subcontractor, SubcontractOrderNo, ConversionDate, Store, Status, Remarks, TotalQty, id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "Record not found" });

            res.json({ success: true, message: "Conversion GRN updated" });
        }
    );
};

// DELETE Conversion GRN
exports.deleteConversionGRN = (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM SubcontractConversionGRN WHERE GRNID = ?", [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Record not found" });
        res.json({ success: true, message: "Conversion GRN deleted" });
    });
};
