const db = require("../config/database");

function cleanNum(val) {
    if (val === undefined || val === null || val === "" || val === "." || val === "N/A" || val === "-") return 0;
    const cleaned = String(val).replace(/,/g, "").trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
}

function toISODate(d) {
    if (!d) return "";
    const trimmed = String(d).trim();
    const m = /^(\d{2})[-/](\d{2})[-/](\d{4})$/.exec(trimmed);
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    return "";
}

function buildWhereClause(query) {
    const conditions = [];
    const params = [];

    const {
        fromDate,
        toDate,
        reqFromDate,
        reqToDate,
        group,
        customer,
        buyerPo,
        product,
        prodColor,
        ioNo,
        item,
        color,
        itemCategory,
        statusFilter,
        search
    } = query;

    if (fromDate && String(fromDate).trim()) {
        conditions.push("(IODateISO >= ? OR IODateISO = '')");
        params.push(String(fromDate).trim());
    }
    if (toDate && String(toDate).trim()) {
        conditions.push("(IODateISO <= ? OR IODateISO = '')");
        params.push(String(toDate).trim());
    }
    if (reqFromDate && String(reqFromDate).trim()) {
        conditions.push("(RequiredDateISO >= ? OR RequiredDateISO = '')");
        params.push(String(reqFromDate).trim());
    }
    if (reqToDate && String(reqToDate).trim()) {
        conditions.push("(RequiredDateISO <= ? OR RequiredDateISO = '')");
        params.push(String(reqToDate).trim());
    }
    if (group && String(group).trim()) {
        conditions.push("LOWER(ItemGroup) LIKE LOWER(?)");
        params.push(`%${String(group).trim()}%`);
    }
    if (customer && String(customer).trim()) {
        conditions.push("LOWER(Customer) LIKE LOWER(?)");
        params.push(`%${String(customer).trim()}%`);
    }
    if (buyerPo && String(buyerPo).trim()) {
        conditions.push("LOWER(BuyerPO) LIKE LOWER(?)");
        params.push(`%${String(buyerPo).trim()}%`);
    }
    if (product && String(product).trim()) {
        conditions.push("LOWER(Product) LIKE LOWER(?)");
        params.push(`%${String(product).trim()}%`);
    }
    if (prodColor && String(prodColor).trim()) {
        conditions.push("LOWER(ProdColor) LIKE LOWER(?)");
        params.push(`%${String(prodColor).trim()}%`);
    }
    if (ioNo && String(ioNo).trim()) {
        conditions.push("LOWER(IONo) LIKE LOWER(?)");
        params.push(`%${String(ioNo).trim()}%`);
    }
    if (item && String(item).trim()) {
        conditions.push("LOWER(Item) LIKE LOWER(?)");
        params.push(`%${String(item).trim()}%`);
    }
    if (color && String(color).trim()) {
        conditions.push("LOWER(Color) LIKE LOWER(?)");
        params.push(`%${String(color).trim()}%`);
    }
    if (itemCategory && String(itemCategory).trim() && String(itemCategory).trim().toLowerCase() !== "all") {
        conditions.push("LOWER(ItemCategory) LIKE LOWER(?)");
        params.push(`%${String(itemCategory).trim()}%`);
    }

    if (statusFilter) {
        switch (statusFilter) {
            case "PendingIndent":
                conditions.push("BalanceToIndent > 0");
                break;
            case "PendingPO":
                conditions.push("BalanceToPO > 0");
                break;
            case "PendingGRN":
                conditions.push("BalanceToGRN > 0");
                break;
            case "PendingISS":
                conditions.push("BalanceToISS > 0");
                break;
            case "ExcessPO":
                conditions.push("ExcessPO > 0");
                break;
            default:
                break;
        }
    }

    if (search && String(search).trim()) {
        const q = `%${String(search).trim()}%`;
        conditions.push(
            "(LOWER(ItemGroup) LIKE LOWER(?) OR LOWER(Customer) LIKE LOWER(?) OR LOWER(BuyerPO) LIKE LOWER(?) OR LOWER(Product) LIKE LOWER(?) OR LOWER(IONo) LIKE LOWER(?) OR LOWER(Item) LIKE LOWER(?) OR LOWER(Color) LIKE LOWER(?) OR LOWER(ItemCategory) LIKE LOWER(?))"
        );
        params.push(q, q, q, q, q, q, q, q);
    }

    const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    return { whereSql, params };
}

exports.getRequirementsToPO = (req, res) => {
    const { whereSql, params } = buildWhereClause(req.query);
    const isAll = req.query.all === "true" || req.query.all === "1";
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = isAll ? 50000 : Math.min(2000, Math.max(10, parseInt(req.query.limit, 10) || 100));
    const offset = isAll ? 0 : (page - 1) * limit;

    const totalsSql = `
        SELECT
            COUNT(*) AS TotalRows,
            COALESCE(SUM(RequiredQty), 0) AS RequiredQty,
            COALESCE(SUM(IndentQty), 0) AS IndentQty,
            COALESCE(SUM(BalanceToIndent), 0) AS BalanceToIndent,
            COALESCE(SUM(ExcessIndent), 0) AS ExcessIndent,
            COALESCE(SUM(POQty), 0) AS POQty,
            COALESCE(SUM(POValue), 0) AS POValue,
            COALESCE(SUM(BalanceToPO), 0) AS BalanceToPO,
            COALESCE(SUM(ExcessPO), 0) AS ExcessPO,
            COALESCE(SUM(GRNQty), 0) AS GRNQty,
            COALESCE(SUM(GRNValue), 0) AS GRNValue,
            COALESCE(SUM(BalanceToGRN), 0) AS BalanceToGRN,
            COALESCE(SUM(ExcessGRN), 0) AS ExcessGRN,
            COALESCE(SUM(ISSQty), 0) AS ISSQty,
            COALESCE(SUM(ISSValue), 0) AS ISSValue,
            COALESCE(SUM(BalanceToISS), 0) AS BalanceToISS,
            COALESCE(SUM(ExcessISS), 0) AS ExcessISS,
            COALESCE(SUM(ExcessISSValue), 0) AS ExcessISSValue
        FROM RequirementToPO
        ${whereSql}
    `;

    db.get(totalsSql, params, (totErr, totalsRow) => {
        if (totErr) {
            return res.status(500).json({
                success: false,
                message: "Error calculating Requirement to PO totals",
                error: totErr.message
            });
        }

        const totalRows = Number(totalsRow?.TotalRows || 0);
        const totalPages = Math.max(1, Math.ceil(totalRows / limit));

        const dataSql = `
            SELECT
                RequirementID,
                ItemGroup,
                Customer,
                BuyerPO,
                Product,
                ProdColor,
                RequiredDate,
                IODate,
                IONo,
                Item,
                UOM,
                Color,
                SizeRange,
                Size,
                RequiredQty,
                IndentQty,
                BalanceToIndent,
                ExcessIndent,
                POQty,
                POValue,
                BalanceToPO,
                ExcessPO,
                GRNQty,
                GRNValue,
                BalanceToGRN,
                ExcessGRN,
                ISSQty,
                ISSValue,
                BalanceToISS,
                ExcessISS,
                ExcessISSValue,
                ItemCategory
            FROM RequirementToPO
            ${whereSql}
            ORDER BY RequirementID ASC
            LIMIT ? OFFSET ?
        `;

        db.all(dataSql, [...params, limit, offset], (dataErr, rows) => {
            if (dataErr) {
                return res.status(500).json({
                    success: false,
                    message: "Error fetching Requirement to PO rows",
                    error: dataErr.message
                });
            }

            res.json({
                success: true,
                data: rows || [],
                pagination: {
                    page,
                    limit,
                    totalRows,
                    totalPages
                },
                totals: {
                    RequiredQty: Number(totalsRow?.RequiredQty || 0),
                    IndentQty: Number(totalsRow?.IndentQty || 0),
                    BalanceToIndent: Number(totalsRow?.BalanceToIndent || 0),
                    ExcessIndent: Number(totalsRow?.ExcessIndent || 0),
                    POQty: Number(totalsRow?.POQty || 0),
                    POValue: Number(totalsRow?.POValue || 0),
                    BalanceToPO: Number(totalsRow?.BalanceToPO || 0),
                    ExcessPO: Number(totalsRow?.ExcessPO || 0),
                    GRNQty: Number(totalsRow?.GRNQty || 0),
                    GRNValue: Number(totalsRow?.GRNValue || 0),
                    BalanceToGRN: Number(totalsRow?.BalanceToGRN || 0),
                    ExcessGRN: Number(totalsRow?.ExcessGRN || 0),
                    ISSQty: Number(totalsRow?.ISSQty || 0),
                    ISSValue: Number(totalsRow?.ISSValue || 0),
                    BalanceToISS: Number(totalsRow?.BalanceToISS || 0),
                    ExcessISS: Number(totalsRow?.ExcessISS || 0),
                    ExcessISSValue: Number(totalsRow?.ExcessISSValue || 0)
                }
            });
        });
    });
};

exports.getFilterOptions = (req, res) => {
    const queries = {
        groups: "SELECT DISTINCT ItemGroup AS val FROM RequirementToPO WHERE ItemGroup IS NOT NULL AND ItemGroup != '' ORDER BY ItemGroup ASC",
        customers: "SELECT DISTINCT Customer AS val FROM RequirementToPO WHERE Customer IS NOT NULL AND Customer != '' ORDER BY Customer ASC",
        categories: "SELECT DISTINCT ItemCategory AS val FROM RequirementToPO WHERE ItemCategory IS NOT NULL AND ItemCategory != '' ORDER BY ItemCategory ASC",
        ioNos: "SELECT DISTINCT IONo AS val FROM RequirementToPO WHERE IONo IS NOT NULL AND IONo != '' ORDER BY IONo ASC LIMIT 1000",
        buyerPOs: "SELECT DISTINCT BuyerPO AS val FROM RequirementToPO WHERE BuyerPO IS NOT NULL AND BuyerPO != '' ORDER BY BuyerPO ASC LIMIT 1000",
        items: "SELECT DISTINCT Item AS val FROM RequirementToPO WHERE Item IS NOT NULL AND Item != '' ORDER BY Item ASC LIMIT 1000",
        colors: "SELECT DISTINCT Color AS val FROM RequirementToPO WHERE Color IS NOT NULL AND Color != '' ORDER BY Color ASC LIMIT 1000",
        products: "SELECT DISTINCT Product AS val FROM RequirementToPO WHERE Product IS NOT NULL AND Product != '' ORDER BY Product ASC LIMIT 1000"
    };

    const runQuery = (sql) =>
        new Promise((resolve) => {
            db.all(sql, [], (err, rows) => {
                if (err || !rows) return resolve([]);
                resolve(rows.map((r) => r.val || r.VAL).filter(Boolean));
            });
        });

    Promise.all([
        runQuery(queries.groups),
        runQuery(queries.customers),
        runQuery(queries.categories),
        runQuery(queries.ioNos),
        runQuery(queries.buyerPOs),
        runQuery(queries.items),
        runQuery(queries.colors),
        runQuery(queries.products)
    ])
        .then(([groups, customers, categories, ioNos, buyerPOs, items, colors, products]) => {
            res.json({
                success: true,
                data: {
                    groups,
                    customers,
                    categories,
                    ioNos,
                    buyerPOs,
                    items,
                    colors,
                    products
                }
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: "Error loading filter options",
                error: err.message
            });
        });
};

exports.uploadRequirementsToPO = async (req, res) => {
    try {
        const { rows, mode = "append", clearFirst = false } = req.body || {};
        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid rows provided for upload."
            });
        }

        const colNames = [
            "ItemGroup", "Customer", "BuyerPO", "Product", "ProdColor",
            "RequiredDate", "RequiredDateISO", "IODate", "IODateISO", "IONo",
            "Item", "UOM", "Color", "SizeRange", "Size",
            "RequiredQty", "IndentQty", "BalanceToIndent", "ExcessIndent",
            "POQty", "POValue", "BalanceToPO", "ExcessPO",
            "GRNQty", "GRNValue", "BalanceToGRN", "ExcessGRN",
            "ISSQty", "ISSValue", "BalanceToISS", "ExcessISS", "ExcessISSValue",
            "ItemCategory"
        ];

        const normalizedRows = rows
            .map((r) => {
                if (Array.isArray(r)) {
                    if (r[0] === "Grand Total" || (!r[1] && !r[7] && !r[8])) return null;
                    return [
                        String(r[0] || "").trim(),
                        String(r[1] || "").trim(),
                        String(r[2] || "").trim(),
                        String(r[3] || "").trim(),
                        String(r[4] || "").trim(),
                        String(r[5] || "").trim(),
                        toISODate(r[5]),
                        String(r[6] || "").trim(),
                        toISODate(r[6]),
                        String(r[7] || "").trim(),
                        String(r[8] || "").trim(),
                        String(r[9] || "").trim(),
                        String(r[10] || "").trim(),
                        String(r[11] || "").trim(),
                        String(r[12] || "").trim(),
                        cleanNum(r[13]),
                        cleanNum(r[14]),
                        cleanNum(r[15]),
                        cleanNum(r[16]),
                        cleanNum(r[17]),
                        cleanNum(r[18]),
                        cleanNum(r[19]),
                        cleanNum(r[20]),
                        cleanNum(r[21]),
                        cleanNum(r[22]),
                        cleanNum(r[23]),
                        cleanNum(r[24]),
                        cleanNum(r[25]),
                        cleanNum(r[26]),
                        cleanNum(r[27]),
                        cleanNum(r[28]),
                        cleanNum(r[29]),
                        String(r[30] || "").trim()
                    ];
                } else if (r && typeof r === "object") {
                    const grp = r.ItemGroup ?? r.Group ?? r["Group"] ?? "";
                    const cust = r.Customer ?? r["Customer"] ?? "";
                    const ioNo = r.IONo ?? r["IO No"] ?? "";
                    const item = r.Item ?? r["Item"] ?? "";
                    if (grp === "Grand Total" || (!cust && !ioNo && !item)) return null;
                    const reqDate = String(r.RequiredDate ?? r["Required Date"] ?? "").trim();
                    const ioDate = String(r.IODate ?? r["IO Date"] ?? "").trim();
                    return [
                        String(grp).trim(),
                        String(cust).trim(),
                        String(r.BuyerPO ?? r["Buyer Po"] ?? r["Buyer PO"] ?? "").trim(),
                        String(r.Product ?? r["Product"] ?? "").trim(),
                        String(r.ProdColor ?? r["Prod Color"] ?? "").trim(),
                        reqDate,
                        toISODate(reqDate),
                        ioDate,
                        toISODate(ioDate),
                        String(ioNo).trim(),
                        String(item).trim(),
                        String(r.UOM ?? r.Uom ?? r["Uom"] ?? "").trim(),
                        String(r.Color ?? r["Color"] ?? "").trim(),
                        String(r.SizeRange ?? r["Size Range"] ?? "").trim(),
                        String(r.Size ?? r["Size"] ?? "").trim(),
                        cleanNum(r.RequiredQty ?? r["Required Qty"]),
                        cleanNum(r.IndentQty ?? r["Indent Qty"]),
                        cleanNum(r.BalanceToIndent ?? r["Balance to Indent"]),
                        cleanNum(r.ExcessIndent ?? r["Excess Indent"]),
                        cleanNum(r.POQty ?? r["PO Qty"]),
                        cleanNum(r.POValue ?? r["PO Value"]),
                        cleanNum(r.BalanceToPO ?? r["Balance to PO"]),
                        cleanNum(r.ExcessPO ?? r["Excess PO"]),
                        cleanNum(r.GRNQty ?? r["GRN Qty"]),
                        cleanNum(r.GRNValue ?? r["GRN Value"]),
                        cleanNum(r.BalanceToGRN ?? r["Balance to GRN"]),
                        cleanNum(r.ExcessGRN ?? r["Excess GRN"]),
                        cleanNum(r.ISSQty ?? r["ISS Qty"]),
                        cleanNum(r.ISSValue ?? r["ISS Value"]),
                        cleanNum(r.BalanceToISS ?? r["Balance to ISS"]),
                        cleanNum(r.ExcessISS ?? r["Excess ISS"]),
                        cleanNum(r.ExcessISSValue ?? r["Excess ISS Value"]),
                        String(r.ItemCategory ?? r["Item Category"] ?? "").trim()
                    ];
                }
                return null;
            })
            .filter(Boolean);

        if (normalizedRows.length === 0) {
            return res.json({
                success: true,
                inserted: 0,
                message: "No data rows in batch."
            });
        }

        if (db.pool) {
            if (clearFirst || mode === "replace") {
                await db.pool.query("TRUNCATE TABLE RequirementToPO RESTART IDENTITY;");
            }
            const batchSize = 400;
            for (let i = 0; i < normalizedRows.length; i += batchSize) {
                const chunk = normalizedRows.slice(i, i + batchSize);
                const values = [];
                const valueGroups = [];
                let paramIdx = 1;
                for (const row of chunk) {
                    const grp = [];
                    for (let c = 0; c < row.length; c++) {
                        values.push(row[c]);
                        grp.push(`$${paramIdx++}`);
                    }
                    valueGroups.push(`(${grp.join(", ")})`);
                }
                const sql = `INSERT INTO RequirementToPO (${colNames.join(", ")}) VALUES ${valueGroups.join(", ")}`;
                await db.pool.query(sql, values);
            }
        } else {
            await new Promise((resolve, reject) => {
                db.serialize(() => {
                    if (clearFirst || mode === "replace") {
                        db.run("DELETE FROM RequirementToPO");
                    }
                    db.run("BEGIN TRANSACTION");
                    const placeholders = colNames.map(() => "?").join(", ");
                    const stmt = db.prepare(`INSERT INTO RequirementToPO (${colNames.join(", ")}) VALUES (${placeholders})`);
                    for (const row of normalizedRows) {
                        stmt.run(row);
                    }
                    stmt.finalize();
                    db.run("COMMIT", (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            });
        }

        res.json({
            success: true,
            inserted: normalizedRows.length,
            message: `Successfully uploaded ${normalizedRows.length} rows.`
        });
    } catch (err) {
        console.error("Upload Requirements to PO error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to upload Requirements to PO data",
            error: err.message
        });
    }
};
