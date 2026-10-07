const db = require("../config/database");

// Helper to generate style code if not provided
const generateStyleNo = (category) => {
    const prefix = (category || "STY").substring(0, 3).toUpperCase();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${rand}`;
};

// =========================================================================
// 1. GET ALL STYLES (with optional search, filter, pagination)
// =========================================================================
exports.getAllStyles = (req, res) => {
    const {
        search,
        product_category,
        product_type,
        status,
        customer_id,
        page,
        limit
    } = req.query;

    let conditions = [];
    let params = [];

    if (search) {
        conditions.push(`(
            s.style_no LIKE ? OR 
            s.style_name LIKE ? OR 
            s.brand LIKE ? OR 
            s.season LIKE ? OR 
            s.short_description LIKE ?
        )`);
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (product_category) {
        conditions.push("s.product_category = ?");
        params.push(product_category);
    }

    if (product_type) {
        conditions.push("s.product_type = ?");
        params.push(product_type);
    }

    if (status) {
        conditions.push("s.status = ?");
        params.push(status);
    }

    if (customer_id) {
        conditions.push("s.customer_id = ?");
        params.push(customer_id);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Count query if paginated
    if (page && limit) {
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const countSql = `SELECT COUNT(*) as total FROM style_master s ${whereClause}`;

        db.get(countSql, params, (err, countRow) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            const dataSql = `
                SELECT 
                    s.*,
                    s.style_id AS StyleID,
                    s.style_no AS StyleCode,
                    s.style_name AS StyleName,
                    s.product_type AS ProductType,
                    s.season AS Season,
                    s.remarks AS Remarks,
                    c.CustomerName,
                    c.CustomerCode,
                    (SELECT COUNT(*) FROM style_colors WHERE style_id = s.style_id) AS color_count,
                    (SELECT COUNT(*) FROM style_sizes WHERE style_id = s.style_id) AS size_count,
                    (SELECT COUNT(*) FROM tech_sheets WHERE style_id = s.style_id) AS tech_sheet_count
                FROM style_master s
                LEFT JOIN Customers c ON s.customer_id = c.CustomerID
                ${whereClause}
                ORDER BY s.style_id DESC
                LIMIT ? OFFSET ?
            `;

            db.all(dataSql, [...params, parseInt(limit), offset], (err, rows) => {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({
                    success: true,
                    data: rows,
                    pagination: {
                        total: countRow ? countRow.total : 0,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        totalPages: Math.ceil((countRow ? countRow.total : 0) / parseInt(limit))
                    }
                });
            });
        });
    } else {
        const sql = `
            SELECT 
                s.*,
                s.style_id AS StyleID,
                s.style_no AS StyleCode,
                s.style_name AS StyleName,
                s.product_type AS ProductType,
                s.season AS Season,
                s.remarks AS Remarks,
                c.CustomerName,
                c.CustomerCode,
                (SELECT COUNT(*) FROM style_colors WHERE style_id = s.style_id) AS color_count,
                (SELECT COUNT(*) FROM style_sizes WHERE style_id = s.style_id) AS size_count,
                (SELECT COUNT(*) FROM tech_sheets WHERE style_id = s.style_id) AS tech_sheet_count
            FROM style_master s
            LEFT JOIN Customers c ON s.customer_id = c.CustomerID
            ${whereClause}
            ORDER BY s.style_id DESC
        `;

        db.all(sql, params, (err, rows) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json(rows);
        });
    }
};

// =========================================================================
// 2. GET STYLE BY ID (with colors, sizes, documents, and tech sheets)
// =========================================================================
exports.getStyleById = (req, res) => {
    const styleId = req.params.id;

    const sql = `
        SELECT 
            s.*,
            s.style_id AS StyleID,
            s.style_no AS StyleCode,
            s.style_name AS StyleName,
            s.product_type AS ProductType,
            s.season AS Season,
            s.remarks AS Remarks,
            c.CustomerName,
            c.CustomerCode,
            c.Email AS CustomerEmail,
            c.Phone AS CustomerPhone
        FROM style_master s
        LEFT JOIN Customers c ON s.customer_id = c.CustomerID
        WHERE s.style_id = ? OR s.style_no = ?
    `;

    db.get(sql, [styleId, styleId], (err, style) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!style) return res.status(404).json({ success: false, message: "Style not found" });

        const actualStyleId = style.style_id;

        // Fetch colors
        db.all("SELECT * FROM style_colors WHERE style_id = ? ORDER BY style_color_id ASC", [actualStyleId], (err, colors) => {
            if (err) colors = [];

            // Fetch sizes
            db.all("SELECT * FROM style_sizes WHERE style_id = ? ORDER BY style_size_id ASC", [actualStyleId], (err, sizes) => {
                if (err) sizes = [];

                // Fetch documents
                db.all("SELECT * FROM style_documents WHERE style_id = ? ORDER BY document_id DESC", [actualStyleId], (err, documents) => {
                    if (err) documents = [];

                    // Fetch associated tech sheets
                    db.all("SELECT tech_sheet_id, tech_sheet_no, revision, version, status, effective_date, prepared_by, approved_by FROM tech_sheets WHERE style_id = ? ORDER BY tech_sheet_id DESC", [actualStyleId], (err, techSheets) => {
                        if (err) techSheets = [];

                        res.json({
                            success: true,
                            ...style,
                            colors: colors || [],
                            sizes: sizes || [],
                            documents: documents || [],
                            tech_sheets: techSheets || []
                        });
                    });
                });
            });
        });
    });
};

// =========================================================================
// 3. CREATE STYLE
// =========================================================================
exports.createStyle = (req, res) => {
    const {
        style_no,
        style_name,
        short_description,
        product_category = "Bags",
        product_type = "Tote Bag",
        sub_category,
        brand,
        collection,
        season,
        gender,
        customer_id,
        status = "Draft",
        revision = "01",
        bag_type,
        usage,
        target_market,
        material_group,
        construction_type,
        packaging_type,
        country_of_origin = "India",
        hsn_code,
        uom = "PCS",
        moq = 1,
        lead_time,
        remarks,
        created_by = "Admin",
        colors = [],
        sizes = [],
        documents = [],
        StyleCode,
        StyleName,
        ProductType,
        BuyerID,
        Season,
        Remarks
    } = req.body;

    const finalStyleNo = style_no || StyleCode || generateStyleNo(product_category);
    const finalStyleName = style_name || StyleName || "Untitled Style";
    const finalProductType = product_type || ProductType || "Finished Product";
    const finalCustomerId = customer_id || BuyerID || null;
    const finalSeason = season || Season || null;
    const finalRemarks = remarks || Remarks || null;

    const insertSql = `
        INSERT INTO style_master (
            style_no, style_name, short_description, product_category, product_type,
            sub_category, brand, collection, season, gender, customer_id,
            status, revision, bag_type, usage, target_market, material_group,
            construction_type, packaging_type, country_of_origin, hsn_code,
            uom, moq, lead_time, remarks, created_by, updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        finalStyleNo,
        finalStyleName,
        short_description || null,
        product_category,
        finalProductType,
        sub_category || null,
        brand || null,
        collection || null,
        finalSeason,
        gender || null,
        finalCustomerId,
        status,
        revision,
        bag_type || null,
        usage || null,
        target_market || null,
        material_group || null,
        construction_type || null,
        packaging_type || null,
        country_of_origin,
        hsn_code || null,
        uom,
        parseFloat(moq) || 1,
        lead_time || null,
        finalRemarks,
        created_by,
        created_by
    ];

    db.run(insertSql, params, function (err) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message.includes("UNIQUE constraint failed")
                    ? `Style Number "${finalStyleNo}" already exists.`
                    : err.message
            });
        }

        const newStyleId = this.lastID;

        // Insert colors if any
        if (Array.isArray(colors) && colors.length > 0) {
            const colorStmt = db.prepare(`
                INSERT INTO style_colors (style_id, color_code, color_name, pantone, color_family, material_color, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
            colors.forEach(c => {
                if (c && c.color_name) {
                    colorStmt.run(newStyleId, c.color_code || null, c.color_name, c.pantone || null, c.color_family || null, c.material_color || null, c.status || 'Active');
                }
            });
            colorStmt.finalize();
        }

        // Insert sizes if any
        if (Array.isArray(sizes) && sizes.length > 0) {
            const sizeStmt = db.prepare(`
                INSERT INTO style_sizes (style_id, size_code, size_name, length, width, height, gusset, handle_drop, strap_length, strap_width, weight, uom)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            sizes.forEach(s => {
                if (s && s.size_name) {
                    sizeStmt.run(
                        newStyleId,
                        s.size_code || null,
                        s.size_name,
                        parseFloat(s.length) || null,
                        parseFloat(s.width) || null,
                        parseFloat(s.height) || null,
                        parseFloat(s.gusset) || null,
                        parseFloat(s.handle_drop) || null,
                        parseFloat(s.strap_length) || null,
                        parseFloat(s.strap_width) || null,
                        parseFloat(s.weight) || null,
                        s.uom || 'cm'
                    );
                }
            });
            sizeStmt.finalize();
        }

        // Insert documents if any
        if (Array.isArray(documents) && documents.length > 0) {
            const docStmt = db.prepare(`
                INSERT INTO style_documents (style_id, document_type, document_name, file_url, file_size)
                VALUES (?, ?, ?, ?, ?)
            `);
            documents.forEach(d => {
                if (d && d.document_name) {
                    docStmt.run(newStyleId, d.document_type || 'Sketch', d.document_name, d.file_url || null, d.file_size || null);
                }
            });
            docStmt.finalize();
        }

        res.status(201).json({
            success: true,
            message: "Style Created Successfully",
            style_id: newStyleId,
            StyleID: newStyleId,
            style_no: finalStyleNo,
            StyleCode: finalStyleNo
        });
    });
};

// =========================================================================
// 4. UPDATE STYLE
// =========================================================================
exports.updateStyle = (req, res) => {
    const styleId = req.params.id;
    const {
        style_no,
        style_name,
        short_description,
        product_category,
        product_type,
        sub_category,
        brand,
        collection,
        season,
        gender,
        customer_id,
        status,
        revision,
        bag_type,
        usage,
        target_market,
        material_group,
        construction_type,
        packaging_type,
        country_of_origin,
        hsn_code,
        uom,
        moq,
        lead_time,
        remarks,
        updated_by = "Admin",
        colors,
        sizes,
        documents
    } = req.body;

    const updateSql = `
        UPDATE style_master SET
            style_no = COALESCE(?, style_no),
            style_name = COALESCE(?, style_name),
            short_description = ?,
            product_category = COALESCE(?, product_category),
            product_type = COALESCE(?, product_type),
            sub_category = ?,
            brand = ?,
            collection = ?,
            season = ?,
            gender = ?,
            customer_id = ?,
            status = COALESCE(?, status),
            revision = COALESCE(?, revision),
            bag_type = ?,
            usage = ?,
            target_market = ?,
            material_group = ?,
            construction_type = ?,
            packaging_type = ?,
            country_of_origin = COALESCE(?, country_of_origin),
            hsn_code = ?,
            uom = COALESCE(?, uom),
            moq = COALESCE(?, moq),
            lead_time = ?,
            remarks = ?,
            updated_by = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE style_id = ?
    `;

    const params = [
        style_no || null,
        style_name || null,
        short_description || null,
        product_category || null,
        product_type || null,
        sub_category || null,
        brand || null,
        collection || null,
        season || null,
        gender || null,
        customer_id || null,
        status || null,
        revision || null,
        bag_type || null,
        usage || null,
        target_market || null,
        material_group || null,
        construction_type || null,
        packaging_type || null,
        country_of_origin || null,
        hsn_code || null,
        uom || null,
        moq ? parseFloat(moq) : null,
        lead_time || null,
        remarks || null,
        updated_by,
        styleId
    ];

    db.run(updateSql, params, function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (this.changes === 0) return res.status(404).json({ success: false, message: "Style not found" });

        // Update child tables if arrays provided
        if (Array.isArray(colors)) {
            db.run("DELETE FROM style_colors WHERE style_id = ?", [styleId], () => {
                const colorStmt = db.prepare(`
                    INSERT INTO style_colors (style_id, color_code, color_name, pantone, color_family, material_color, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `);
                colors.forEach(c => {
                    if (c && c.color_name) {
                        colorStmt.run(styleId, c.color_code || null, c.color_name, c.pantone || null, c.color_family || null, c.material_color || null, c.status || 'Active');
                    }
                });
                colorStmt.finalize();
            });
        }

        if (Array.isArray(sizes)) {
            db.run("DELETE FROM style_sizes WHERE style_id = ?", [styleId], () => {
                const sizeStmt = db.prepare(`
                    INSERT INTO style_sizes (style_id, size_code, size_name, length, width, height, gusset, handle_drop, strap_length, strap_width, weight, uom)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);
                sizes.forEach(s => {
                    if (s && s.size_name) {
                        sizeStmt.run(
                            styleId,
                            s.size_code || null,
                            s.size_name,
                            parseFloat(s.length) || null,
                            parseFloat(s.width) || null,
                            parseFloat(s.height) || null,
                            parseFloat(s.gusset) || null,
                            parseFloat(s.handle_drop) || null,
                            parseFloat(s.strap_length) || null,
                            parseFloat(s.strap_width) || null,
                            parseFloat(s.weight) || null,
                            s.uom || 'cm'
                        );
                    }
                });
                sizeStmt.finalize();
            });
        }

        if (Array.isArray(documents)) {
            db.run("DELETE FROM style_documents WHERE style_id = ?", [styleId], () => {
                const docStmt = db.prepare(`
                    INSERT INTO style_documents (style_id, document_type, document_name, file_url, file_size)
                    VALUES (?, ?, ?, ?, ?)
                `);
                documents.forEach(d => {
                    if (d && d.document_name) {
                        docStmt.run(styleId, d.document_type || 'Sketch', d.document_name, d.file_url || null, d.file_size || null);
                    }
                });
                docStmt.finalize();
            });
        }

        res.json({
            success: true,
            message: "Style Updated Successfully",
            style_id: styleId
        });
    });
};

// =========================================================================
// 5. DELETE STYLE
// =========================================================================
exports.deleteStyle = (req, res) => {
    const styleId = req.params.id;

    // Check if there are approved tech sheets
    db.get("SELECT COUNT(*) as approved_count FROM tech_sheets WHERE style_id = ? AND status = 'Approved'", [styleId], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (row && row.approved_count > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete style with Approved Tech Sheets. Archive or change status instead."
            });
        }

        db.run("DELETE FROM style_master WHERE style_id = ?", [styleId], function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            if (this.changes === 0) return res.status(404).json({ success: false, message: "Style not found" });

            res.json({
                success: true,
                message: "Style and associated details deleted successfully"
            });
        });
    });
};

// =========================================================================
// 6. DUPLICATE STYLE
// =========================================================================
exports.duplicateStyle = (req, res) => {
    const originalStyleId = req.params.id;

    db.get("SELECT * FROM style_master WHERE style_id = ?", [originalStyleId], (err, orig) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!orig) return res.status(404).json({ success: false, message: "Source style not found" });

        const newStyleNo = `${orig.style_no}-COPY-${Math.floor(100 + Math.random() * 900)}`;
        const newStyleName = `${orig.style_name} (Copy)`;

        const insertSql = `
            INSERT INTO style_master (
                style_no, style_name, short_description, product_category, product_type,
                sub_category, brand, collection, season, gender, customer_id,
                status, revision, bag_type, usage, target_market, material_group,
                construction_type, packaging_type, country_of_origin, hsn_code,
                uom, moq, lead_time, remarks, created_by, updated_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            newStyleNo,
            newStyleName,
            orig.short_description,
            orig.product_category,
            orig.product_type,
            orig.sub_category,
            orig.brand,
            orig.collection,
            orig.season,
            orig.gender,
            orig.customer_id,
            "Draft",
            "01",
            orig.bag_type,
            orig.usage,
            orig.target_market,
            orig.material_group,
            orig.construction_type,
            orig.packaging_type,
            orig.country_of_origin,
            orig.hsn_code,
            orig.uom,
            orig.moq,
            orig.lead_time,
            `Duplicated from ${orig.style_no}`,
            "Admin",
            "Admin"
        ];

        db.run(insertSql, params, function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });

            const newStyleId = this.lastID;

            // Copy colors
            db.all("SELECT * FROM style_colors WHERE style_id = ?", [originalStyleId], (err, colors) => {
                if (!err && colors && colors.length > 0) {
                    const colorStmt = db.prepare(`
                        INSERT INTO style_colors (style_id, color_code, color_name, pantone, color_family, material_color, status)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `);
                    colors.forEach(c => colorStmt.run(newStyleId, c.color_code, c.color_name, c.pantone, c.color_family, c.material_color, c.status));
                    colorStmt.finalize();
                }

                // Copy sizes
                db.all("SELECT * FROM style_sizes WHERE style_id = ?", [originalStyleId], (err, sizes) => {
                    if (!err && sizes && sizes.length > 0) {
                        const sizeStmt = db.prepare(`
                            INSERT INTO style_sizes (style_id, size_code, size_name, length, width, height, gusset, handle_drop, strap_length, strap_width, weight, uom)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `);
                        sizes.forEach(s => sizeStmt.run(newStyleId, s.size_code, s.size_name, s.length, s.width, s.height, s.gusset, s.handle_drop, s.strap_length, s.strap_width, s.weight, s.uom));
                        sizeStmt.finalize();
                    }

                    res.status(201).json({
                        success: true,
                        message: `Style duplicated successfully as ${newStyleNo}`,
                        style_id: newStyleId,
                        style_no: newStyleNo
                    });
                });
            });
        });
    });
};

// =========================================================================
// 7. GET STYLE MASTER METADATA / OPTIONS (Categories, Bag types, etc.)
// =========================================================================
exports.getStyleOptions = (req, res) => {
    const categories = [
        "Bags",
        "Leather Goods",
        "Belts",
        "Wallets",
        "Card Holders",
        "Apparels",
        "Accessories"
    ];

    const bagTypes = [
        "Tote Bag",
        "Crossbody Bag",
        "Shoulder Bag",
        "Backpack",
        "Clutch / Pouch",
        "Duffle / Travel Bag",
        "Messenger Bag",
        "Hobo Bag",
        "Satchel",
        "Belt Bag / Fanny Pack",
        "Briefcase / Work Bag",
        "Bucket Bag"
    ];

    const statuses = ["Draft", "In Review", "Approved", "Active", "Archived", "Cancelled"];
    const seasons = ["SS25", "FW25", "SS26", "FW26", "Core / Evergreen"];
    const genders = ["Unisex", "Women", "Men", "Kids"];
    const uoms = ["PCS", "SET", "PAIR"];

    // Also get customers from database
    db.all("SELECT CustomerID, CustomerCode, CustomerName FROM Customers ORDER BY CustomerName ASC", [], (err, customers) => {
        res.json({
            success: true,
            categories,
            bagTypes,
            statuses,
            seasons,
            genders,
            uoms,
            customers: customers || []
        });
    });
};
