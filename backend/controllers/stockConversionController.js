const db = require("../config/database");

// ======================================================
// SEED DATA MATCHING SCREENSHOT EXACTLY
// ======================================================
const SEED_STOCK_CONVERSIONS = [
    {
        ConversionNo: "SC/30/2627/8",
        ConversionDate: "31-08-2026",
        FromStore: "RAW MATERIAL STORE 30",
        ToStore: "RAW MATERIAL STORE 30",
        Currency: "INR",
        ExchangeRate: 1.0,
        Message: "",
        InternalMemo: "",
        IssuedBy: "9b Fabric",
        ReceivedBy: "9b Fabric",
        SupplierName: "",
        TotalQty: 1.5,
        DisplayQty: "1.5",
        RowCount: 1,
        details: [
            {
                FromItemCode: "FAB-1001",
                FromItemName: "CANVAS CLOTH 278 GSM 10 OZ GREIGE",
                FromColor: "GREIGE",
                FromUOM: "MTR",
                FromQty: 1.5,
                ToItemCode: "FAB-1002",
                ToItemName: "CANVAS CLOTH 278 GSM 10 OZ DYED",
                ToColor: "NAVY",
                ToUOM: "MTR",
                ToQty: 1.5,
                Remarks: "Greige to piece dyed fabric conversion"
            }
        ]
    },
    {
        ConversionNo: "SC/30/2627/7",
        ConversionDate: "01-08-2026",
        FromStore: "STORE_30",
        ToStore: "RAW MATERIAL STORE 30",
        Currency: "INR",
        ExchangeRate: 1.0,
        Message: "",
        InternalMemo: "",
        IssuedBy: "9b Fabric",
        ReceivedBy: "",
        SupplierName: "",
        TotalQty: 122.46,
        DisplayQty: "122.46",
        RowCount: 1,
        details: [
            {
                FromItemCode: "YRN-2004",
                FromItemName: "COTTON YARN 40S COMBED",
                FromColor: "RAW",
                FromUOM: "KGS",
                FromQty: 122.46,
                ToItemCode: "YRN-2005",
                ToItemName: "COTTON YARN 40S COMBED DYED",
                ToColor: "BLACK",
                ToUOM: "KGS",
                ToQty: 122.46,
                Remarks: "Lot dyeing store reallocation"
            }
        ]
    },
    {
        ConversionNo: "SC/30/2627/6",
        ConversionDate: "31-07-2026",
        FromStore: "RAW MATERIAL STORE 30",
        ToStore: "RAW MATERIAL STORE 30",
        Currency: "INR",
        ExchangeRate: 1.0,
        Message: "",
        InternalMemo: "",
        IssuedBy: "9b Fabric",
        ReceivedBy: "9b Fabric",
        SupplierName: "",
        TotalQty: 5.0,
        DisplayQty: "5.0",
        RowCount: 1,
        details: [
            {
                FromItemCode: "LTH-1093",
                FromItemName: "COW CULATTAS SINGLE LEATHER",
                FromColor: "BLACK",
                FromUOM: "SQFT",
                FromQty: 5.0,
                ToItemCode: "LTH-1093-EMB",
                ToItemName: "COW CULATTAS EMBOSSED LEATHER",
                ToColor: "BLACK CROC",
                ToUOM: "SQFT",
                ToQty: 5.0,
                Remarks: "Embossing process conversion"
            }
        ]
    },
    {
        ConversionNo: "SC/30/2627/5",
        ConversionDate: "31-07-2026",
        FromStore: "RAW MATERIAL STORE 30",
        ToStore: "RAW MATERIAL STORE 30",
        Currency: "INR",
        ExchangeRate: 1.0,
        Message: "",
        InternalMemo: "",
        IssuedBy: "9b Fabric",
        ReceivedBy: "9b Fabric",
        SupplierName: "",
        TotalQty: 3.0,
        DisplayQty: "3.0",
        RowCount: 1,
        details: [
            {
                FromItemCode: "RNF-1085",
                FromItemName: "HIGH DENSITY TOPLINER 0.4MM",
                FromColor: "WHITE",
                FromUOM: "MTR",
                FromQty: 3.0,
                ToItemCode: "RNF-1085-LAM",
                ToItemName: "TOPLINER 0.4MM PRE-LAMINATED",
                ToColor: "WHITE",
                ToUOM: "MTR",
                ToQty: 3.0,
                Remarks: "Pre-lamination coating"
            }
        ]
    },
    {
        ConversionNo: "SC/30/2627/4",
        ConversionDate: "30-06-2026",
        FromStore: "RAW MATERIAL STORE 30",
        ToStore: "RAW MATERIAL STORE 30",
        Currency: "INR",
        ExchangeRate: 1.0,
        Message: "",
        InternalMemo: "",
        IssuedBy: "9b Fabric",
        ReceivedBy: "9b Fabric",
        SupplierName: "",
        TotalQty: 4.0,
        DisplayQty: "4.0",
        RowCount: 1,
        details: [
            {
                FromItemCode: "PKG-2200",
                FromItemName: "CARD PAPER 350G 31X43 INCH",
                FromColor: "NATURAL",
                FromUOM: "SHEET",
                FromQty: 4.0,
                ToItemCode: "PKG-2201",
                ToItemName: "SLIT PATTERN SHEETS 350G",
                ToColor: "NATURAL",
                ToUOM: "PCS",
                ToQty: 4.0,
                Remarks: "Pattern conversion"
            }
        ]
    },
    {
        ConversionNo: "SC/30/2627/3",
        ConversionDate: "30-05-2026",
        FromStore: "RAW MATERIAL STORE 30",
        ToStore: "STORE 30",
        Currency: "INR",
        ExchangeRate: 1.0,
        Message: "",
        InternalMemo: "",
        IssuedBy: "9b Fabric",
        ReceivedBy: "",
        SupplierName: "",
        TotalQty: 21.0,
        DisplayQty: "21.0",
        RowCount: 1,
        details: [
            {
                FromItemCode: "NONWO5064",
                FromItemName: "TALIN 0.3MM WHITE ROLL",
                FromColor: "WHITE",
                FromUOM: "ROLL",
                FromQty: 21.0,
                ToItemCode: "NONWO5065",
                ToItemName: "TALIN 0.3MM PRE-CUT BANDS",
                ToColor: "WHITE",
                ToUOM: "MTR",
                ToQty: 21.0,
                Remarks: "Banding conversion"
            }
        ]
    },
    {
        ConversionNo: "SC/30/2627/2",
        ConversionDate: "10-05-2026",
        FromStore: "RAW MATERIAL STORE 30",
        ToStore: "RAW MATERIAL STORE 30",
        Currency: "INR",
        ExchangeRate: 1.0,
        Message: "",
        InternalMemo: "",
        IssuedBy: "9b Fabric",
        ReceivedBy: "",
        SupplierName: "",
        TotalQty: 4.0,
        DisplayQty: "4.0",
        RowCount: 1,
        details: [
            {
                FromItemCode: "FAB-1008",
                FromItemName: "TWILL COTTON WEAVE 190 GSM",
                FromColor: "BEIGE",
                FromUOM: "MTR",
                FromQty: 4.0,
                ToItemCode: "FAB-1009",
                ToItemName: "TWILL COTTON WATERPROOF FINISH",
                ToColor: "BEIGE",
                ToUOM: "MTR",
                ToQty: 4.0,
                Remarks: "Water-repellent finish treatment"
            }
        ]
    },
    {
        ConversionNo: "SC/30/2627/1",
        ConversionDate: "01-04-2026",
        FromStore: "RAW MATERIAL STORE 30",
        ToStore: "RAW MATERIAL STORE 30",
        Currency: "INR",
        ExchangeRate: 1.0,
        Message: "",
        InternalMemo: "",
        IssuedBy: "9b Fabric",
        ReceivedBy: "",
        SupplierName: "",
        TotalQty: 0.00000001,
        DisplayQty: "1.0E-8",
        RowCount: 1,
        details: [
            {
                FromItemCode: "TRM-9001",
                FromItemName: "TEST THREAD REEL SPECIMEN",
                FromColor: "WHITE",
                FromUOM: "CONE",
                FromQty: 0.00000001,
                ToItemCode: "TRM-9002",
                ToItemName: "TEST THREAD REEL LAB QUALIFIED",
                ToColor: "WHITE",
                ToUOM: "CONE",
                ToQty: 0.00000001,
                Remarks: "Micro specimen calibration"
            }
        ]
    }
];

function seedInitialDataIfEmpty() {
    db.get("SELECT COUNT(*) as count FROM StockConversions", [], (err, row) => {
        if (!err && row && row.count === 0) {
            console.log("🌱 Seeding initial Stock Conversion data from screenshot...");
            SEED_STOCK_CONVERSIONS.forEach(item => {
                db.run(`
                    INSERT INTO StockConversions (
                        ConversionNo, ConversionDate, FromStore, ToStore, Currency,
                        ExchangeRate, Message, InternalMemo, IssuedBy, ReceivedBy,
                        SupplierName, TotalQty, DisplayQty, RowCount, Status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    item.ConversionNo,
                    item.ConversionDate,
                    item.FromStore,
                    item.ToStore,
                    item.Currency || "INR",
                    item.ExchangeRate || 1.0,
                    item.Message || "",
                    item.InternalMemo || "",
                    item.IssuedBy || "",
                    item.ReceivedBy || "",
                    item.SupplierName || "",
                    item.TotalQty || 0,
                    item.DisplayQty || String(item.TotalQty || 0),
                    item.RowCount || 1,
                    "Completed"
                ], function(insertErr) {
                    if (!insertErr) {
                        const newId = this.lastID;
                        if (item.details && item.details.length > 0) {
                            item.details.forEach(d => {
                                db.run(`
                                    INSERT INTO StockConversionDetails (
                                        ConversionID, FromItemCode, FromItemName, FromColor,
                                        FromUOM, FromQty, ToItemCode, ToItemName, ToColor,
                                        ToUOM, ToQty, Remarks
                                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                                `, [
                                    newId,
                                    d.FromItemCode || "",
                                    d.FromItemName || "",
                                    d.FromColor || "",
                                    d.FromUOM || "PCS",
                                    d.FromQty || 0,
                                    d.ToItemCode || "",
                                    d.ToItemName || "",
                                    d.ToColor || "",
                                    d.ToUOM || "PCS",
                                    d.ToQty || 0,
                                    d.Remarks || ""
                                ]);
                            });
                        }
                    }
                });
            });
        }
    });
}

// Run seed check
setTimeout(seedInitialDataIfEmpty, 500);

// ======================================================
// CONTROLLER HANDLERS
// ======================================================

// GET ALL
exports.getAllStockConversions = (req, res) => {
    const { supplier, fromStore, toStore, search, fromDate, toDate } = req.query;

    let query = "SELECT * FROM StockConversions WHERE 1=1";
    const params = [];

    if (supplier) {
        query += " AND SupplierName LIKE ?";
        params.push(`%${supplier}%`);
    }

    if (fromStore && fromStore !== "All") {
        query += " AND FromStore = ?";
        params.push(fromStore);
    }

    if (toStore && toStore !== "All") {
        query += " AND ToStore = ?";
        params.push(toStore);
    }

    if (search) {
        query += " AND (ConversionNo LIKE ? OR SupplierName LIKE ? OR FromStore LIKE ? OR ToStore LIKE ? OR IssuedBy LIKE ? OR ReceivedBy LIKE ?)";
        const term = `%${search}%`;
        params.push(term, term, term, term, term, term);
    }

    query += " ORDER BY ConversionID DESC";

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error("Error fetching stock conversions:", err.message);
            return res.status(500).json({ success: false, error: err.message, data: [] });
        }

        if (!rows || rows.length === 0) {
            return res.json({ success: true, count: 0, data: [] });
        }

        // Fetch details for all conversions
        const ids = rows.map(r => r.ConversionID);
        const placeholders = ids.map(() => "?").join(",");

        db.all(
            `SELECT * FROM StockConversionDetails WHERE ConversionID IN (${placeholders})`,
            ids,
            (detailErr, detailRows) => {
                if (detailErr) {
                    console.error("Error fetching conversion details:", detailErr.message);
                    return res.json({ success: true, count: rows.length, data: rows.map(r => ({ ...r, details: [] })) });
                }

                const detailsByParent = {};
                (detailRows || []).forEach(d => {
                    if (!detailsByParent[d.ConversionID]) detailsByParent[d.ConversionID] = [];
                    detailsByParent[d.ConversionID].push(d);
                });

                const result = rows.map(r => ({
                    ...r,
                    details: detailsByParent[r.ConversionID] || []
                }));

                res.json({ success: true, count: result.length, data: result });
            }
        );
    });
};

// GET BY ID
exports.getStockConversionById = (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM StockConversions WHERE ConversionID = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        if (!row) {
            return res.status(404).json({ success: false, message: "Stock conversion not found" });
        }

        db.all("SELECT * FROM StockConversionDetails WHERE ConversionID = ?", [id], (detailErr, details) => {
            if (detailErr) {
                return res.status(500).json({ success: false, error: detailErr.message });
            }

            res.json({
                success: true,
                data: {
                    ...row,
                    details: details || []
                }
            });
        });
    });
};

// CREATE
exports.createStockConversion = (req, res) => {
    const {
        ConversionNo,
        ConversionDate,
        FromStore,
        ToStore,
        Currency = "INR",
        ExchangeRate = 1.0,
        Message = "",
        InternalMemo = "",
        IssuedBy = "",
        ReceivedBy = "",
        SupplierID,
        SupplierName = "",
        TotalQty,
        DisplayQty,
        details = []
    } = req.body;

    const rowCount = details.length > 0 ? details.length : 1;
    const computedQty = TotalQty !== undefined ? Number(TotalQty) : details.reduce((sum, d) => sum + Number(d.ToQty || d.FromQty || 0), 0);
    const displayQuantity = DisplayQty || (computedQty < 0.0001 && computedQty > 0 ? "1.0E-8" : String(computedQty));

    const query = `
        INSERT INTO StockConversions (
            ConversionNo, ConversionDate, FromStore, ToStore, Currency,
            ExchangeRate, Message, InternalMemo, IssuedBy, ReceivedBy,
            SupplierID, SupplierName, TotalQty, DisplayQty, RowCount, Status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Completed')
    `;

    db.run(query, [
        ConversionNo,
        ConversionDate || new Date().toISOString().split("T")[0],
        FromStore || "RAW MATERIAL STORE 30",
        ToStore || "RAW MATERIAL STORE 30",
        Currency,
        ExchangeRate,
        Message,
        InternalMemo,
        IssuedBy,
        ReceivedBy,
        SupplierID || null,
        SupplierName,
        computedQty,
        displayQuantity,
        rowCount
    ], function(err) {
        if (err) {
            console.error("Error creating stock conversion:", err.message);
            return res.status(500).json({ success: false, error: err.message });
        }

        const newId = this.lastID;

        if (Array.isArray(details) && details.length > 0) {
            const detailStmt = db.prepare(`
                INSERT INTO StockConversionDetails (
                    ConversionID, FromItemCode, FromItemName, FromColor,
                    FromUOM, FromQty, ToItemCode, ToItemName, ToColor,
                    ToUOM, ToQty, Remarks
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            details.forEach(d => {
                detailStmt.run([
                    newId,
                    d.FromItemCode || "",
                    d.FromItemName || "",
                    d.FromColor || "",
                    d.FromUOM || "PCS",
                    Number(d.FromQty) || 0,
                    d.ToItemCode || "",
                    d.ToItemName || "",
                    d.ToColor || "",
                    d.ToUOM || "PCS",
                    Number(d.ToQty) || 0,
                    d.Remarks || ""
                ]);
            });

            detailStmt.finalize();
        }

        res.status(201).json({
            success: true,
            message: "Stock conversion created successfully",
            data: {
                ConversionID: newId,
                ConversionNo,
                ConversionDate,
                FromStore,
                ToStore,
                TotalQty: computedQty,
                DisplayQty: displayQuantity,
                RowCount: rowCount
            }
        });
    });
};

// UPDATE
exports.updateStockConversion = (req, res) => {
    const { id } = req.params;
    const {
        ConversionDate,
        FromStore,
        ToStore,
        Currency,
        ExchangeRate,
        Message,
        InternalMemo,
        IssuedBy,
        ReceivedBy,
        SupplierName,
        TotalQty,
        DisplayQty,
        details
    } = req.body;

    const rowCount = Array.isArray(details) ? details.length : 1;
    const computedQty = TotalQty !== undefined ? Number(TotalQty) : (Array.isArray(details) ? details.reduce((sum, d) => sum + Number(d.ToQty || 0), 0) : 0);
    const displayQuantity = DisplayQty || (computedQty < 0.0001 && computedQty > 0 ? "1.0E-8" : String(computedQty));

    const query = `
        UPDATE StockConversions SET
            ConversionDate = COALESCE(?, ConversionDate),
            FromStore = COALESCE(?, FromStore),
            ToStore = COALESCE(?, ToStore),
            Currency = COALESCE(?, Currency),
            ExchangeRate = COALESCE(?, ExchangeRate),
            Message = COALESCE(?, Message),
            InternalMemo = COALESCE(?, InternalMemo),
            IssuedBy = COALESCE(?, IssuedBy),
            ReceivedBy = COALESCE(?, ReceivedBy),
            SupplierName = COALESCE(?, SupplierName),
            TotalQty = ?,
            DisplayQty = ?,
            RowCount = ?
        WHERE ConversionID = ?
    `;

    db.run(query, [
        ConversionDate,
        FromStore,
        ToStore,
        Currency,
        ExchangeRate,
        Message,
        InternalMemo,
        IssuedBy,
        ReceivedBy,
        SupplierName,
        computedQty,
        displayQuantity,
        rowCount,
        id
    ], function(err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }

        if (Array.isArray(details)) {
            db.run("DELETE FROM StockConversionDetails WHERE ConversionID = ?", [id], (delErr) => {
                if (!delErr) {
                    const detailStmt = db.prepare(`
                        INSERT INTO StockConversionDetails (
                            ConversionID, FromItemCode, FromItemName, FromColor,
                            FromUOM, FromQty, ToItemCode, ToItemName, ToColor,
                            ToUOM, ToQty, Remarks
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `);

                    details.forEach(d => {
                        detailStmt.run([
                            id,
                            d.FromItemCode || "",
                            d.FromItemName || "",
                            d.FromColor || "",
                            d.FromUOM || "PCS",
                            Number(d.FromQty) || 0,
                            d.ToItemCode || "",
                            d.ToItemName || "",
                            d.ToColor || "",
                            d.ToUOM || "PCS",
                            Number(d.ToQty) || 0,
                            d.Remarks || ""
                        ]);
                    });

                    detailStmt.finalize();
                }
            });
        }

        res.json({ success: true, message: "Stock conversion updated successfully" });
    });
};

// DELETE
exports.deleteStockConversion = (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM StockConversionDetails WHERE ConversionID = ?", [id], (detailErr) => {
        db.run("DELETE FROM StockConversions WHERE ConversionID = ?", [id], function(err) {
            if (err) {
                return res.status(500).json({ success: false, error: err.message });
            }
            res.json({ success: true, message: "Stock conversion deleted successfully" });
        });
    });
};
