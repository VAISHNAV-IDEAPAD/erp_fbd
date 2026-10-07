const db = require("../config/database");

// Helper to generate tech sheet number
const generateTechSheetNo = (styleNo, rev = "01") => {
    return `TS-${styleNo}-${rev}`;
};

// =========================================================================
// 1. GET ALL TECH SHEETS (with filters)
// =========================================================================
exports.getAllTechSheets = (req, res) => {
    const { style_id, status, search } = req.query;

    let conditions = [];
    let params = [];

    if (style_id) {
        conditions.push("ts.style_id = ?");
        params.push(style_id);
    }

    if (status) {
        conditions.push("ts.status = ?");
        params.push(status);
    }

    if (search) {
        conditions.push("(ts.tech_sheet_no LIKE ? OR s.style_no LIKE ? OR s.style_name LIKE ?)");
        const term = `%${search}%`;
        params.push(term, term, term);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const sql = `
        SELECT 
            ts.*,
            s.style_no,
            s.style_name,
            s.product_category,
            s.product_type,
            s.season,
            s.brand,
            s.customer_id,
            c.CustomerName,
            c.CustomerCode,
            (SELECT COUNT(*) FROM tech_sheet_materials WHERE tech_sheet_id = ts.tech_sheet_id) AS material_count,
            (SELECT COUNT(*) FROM tech_sheet_operations WHERE tech_sheet_id = ts.tech_sheet_id) AS operation_count
        FROM tech_sheets ts
        JOIN style_master s ON ts.style_id = s.style_id
        LEFT JOIN Customers c ON s.customer_id = c.CustomerID
        ${whereClause}
        ORDER BY ts.tech_sheet_id DESC
    `;

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({
            success: true,
            data: rows
        });
    });
};

// =========================================================================
// 2. GET TECH SHEET BY ID (Full 10-tab details)
// =========================================================================
exports.getTechSheetById = (req, res) => {
    const techSheetId = req.params.id;

    const headerSql = `
        SELECT 
            ts.*,
            s.style_no,
            s.style_name,
            s.product_category,
            s.product_type,
            s.bag_type,
            s.season,
            s.gender,
            s.brand,
            s.customer_id,
            s.short_description,
            s.remarks as style_remarks,
            c.CustomerName,
            c.CustomerCode,
            c.ContactPerson,
            c.Email as CustomerEmail
        FROM tech_sheets ts
        JOIN style_master s ON ts.style_id = s.style_id
        LEFT JOIN Customers c ON s.customer_id = c.CustomerID
        WHERE ts.tech_sheet_id = ?
    `;

    db.get(headerSql, [techSheetId], (err, sheet) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!sheet) return res.status(404).json({ success: false, message: "Tech Sheet not found" });

        // Tab 2: Dimensions
        db.all("SELECT * FROM tech_sheet_dimensions WHERE tech_sheet_id = ? ORDER BY id ASC", [techSheetId], (err, dimensions) => {
            // Tab 3: Materials (Linked with Item Master)
            const matSql = `
                SELECT 
                    m.*,
                    i.ItemCode,
                    i.ItemName,
                    i.Category as ItemCategory,
                    i.UOM as MasterUOM,
                    i.Rate as CostPrice,
                    i.CurrentStock
                FROM tech_sheet_materials m
                LEFT JOIN Items i ON m.item_id = i.ItemID
                WHERE m.tech_sheet_id = ?
                ORDER BY m.line_no ASC, m.id ASC
            `;
            db.all(matSql, [techSheetId], (err, materials) => {
                if (err) { console.error("matSql err:", err); materials = []; }
                // Tab 4: Components (Linked with Item Master)
                const compSql = `
                    SELECT 
                        c.*,
                        i.ItemCode,
                        i.ItemName,
                        i.Category as ItemCategory,
                        i.UOM as MasterUOM,
                        i.Rate as CostPrice
                    FROM tech_sheet_components c
                    LEFT JOIN Items i ON c.item_id = i.ItemID
                    WHERE c.tech_sheet_id = ?
                    ORDER BY c.line_no ASC, c.id ASC
                `;
                db.all(compSql, [techSheetId], (err, components) => {
                    if (err) { console.error("compSql err:", err); components = []; }
                    // Tab 5: Construction
                    db.all("SELECT * FROM tech_sheet_construction WHERE tech_sheet_id = ? ORDER BY id ASC", [techSheetId], (err, construction) => {
                        // Tab 6: Colors
                        db.all("SELECT * FROM tech_sheet_colors WHERE tech_sheet_id = ? ORDER BY id ASC", [techSheetId], (err, colors) => {
                            // Tab 7: Operations / Routing
                            db.all("SELECT * FROM tech_sheet_operations WHERE tech_sheet_id = ? ORDER BY sequence ASC, id ASC", [techSheetId], (err, operations) => {
                                // Tab 8: Quality Specifications
                                db.all("SELECT * FROM tech_sheet_quality WHERE tech_sheet_id = ? ORDER BY id ASC", [techSheetId], (err, quality) => {
                                    // Tab 9: Packaging
                                    db.all("SELECT * FROM tech_sheet_packaging WHERE tech_sheet_id = ? ORDER BY id ASC", [techSheetId], (err, packaging) => {
                                        // Tab 10: Style sizes and documents for reference
                                        db.all("SELECT * FROM style_sizes WHERE style_id = ?", [sheet.style_id], (err, styleSizes) => {
                                            db.all("SELECT * FROM style_documents WHERE style_id = ?", [sheet.style_id], (err, styleDocs) => {
                                                res.json({
                                                    success: true,
                                                    sheet,
                                                    dimensions: dimensions || [],
                                                    materials: materials || [],
                                                    components: components || [],
                                                    construction: (construction && construction.length > 0) ? construction[0] : (construction || {}),
                                                    construction_list: construction || [],
                                                    colors: colors || [],
                                                    operations: operations || [],
                                                    quality: quality || [],
                                                    packaging: (packaging && packaging.length > 0) ? packaging[0] : (packaging || {}),
                                                    packaging_list: packaging || [],
                                                    style_sizes: styleSizes || [],
                                                    style_documents: styleDocs || []
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

// =========================================================================
// 3. CREATE TECH SHEET
// =========================================================================
exports.createTechSheet = (req, res) => {
    const {
        style_id,
        tech_sheet_no,
        revision = "01",
        version = "1.0",
        status = "Draft",
        sample_no,
        effective_date = new Date().toISOString().slice(0, 10),
        prepared_by = "Admin",
        remarks,
        dimensions = [],
        materials = [],
        components = [],
        construction = {},
        colors = [],
        operations = [],
        quality = [],
        packaging = {}
    } = req.body;

    if (!style_id) {
        return res.status(400).json({ success: false, message: "Style ID is required" });
    }

    // Lookup style_no to format tech_sheet_no if not provided
    db.get("SELECT style_no FROM style_master WHERE style_id = ?", [style_id], (err, style) => {
        if (err || !style) return res.status(400).json({ success: false, message: "Invalid Style ID" });

        const finalNo = tech_sheet_no || generateTechSheetNo(style.style_no, revision);

        const insertSql = `
            INSERT INTO tech_sheets (
                style_id, tech_sheet_no, revision, version, status, sample_no,
                effective_date, prepared_by, prepared_date, remarks
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
        `;

        db.run(insertSql, [style_id, finalNo, revision, version, status, sample_no, effective_date, prepared_by, remarks], function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message.includes("UNIQUE constraint failed")
                        ? `Tech Sheet number "${finalNo}" already exists.`
                        : err.message
                });
            }

            const techSheetId = this.lastID;

            // Helper to insert all child collections
            saveChildCollections(techSheetId, {
                dimensions,
                materials,
                components,
                construction,
                colors,
                operations,
                quality,
                packaging
            }, (saveErr) => {
                if (saveErr) console.error("Error saving child collections:", saveErr);

                res.status(201).json({
                    success: true,
                    message: "Tech Sheet Created Successfully",
                    tech_sheet_id: techSheetId,
                    tech_sheet_no: finalNo
                });
            });
        });
    });
};

// =========================================================================
// 4. UPDATE TECH SHEET
// =========================================================================
exports.updateTechSheet = (req, res) => {
    const techSheetId = req.params.id;

    // Check status first - lock if Approved
    db.get("SELECT status FROM tech_sheets WHERE tech_sheet_id = ?", [techSheetId], (err, existing) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!existing) return res.status(404).json({ success: false, message: "Tech Sheet not found" });

        if (existing.status === "Approved") {
            return res.status(403).json({
                success: false,
                message: "Approved Tech Sheets are locked and cannot be edited. Please create a new revision."
            });
        }

        const {
            sample_no,
            effective_date,
            remarks,
            dimensions,
            materials,
            components,
            construction,
            colors,
            operations,
            quality,
            packaging
        } = req.body;

        const updateSql = `
            UPDATE tech_sheets SET
                sample_no = COALESCE(?, sample_no),
                effective_date = COALESCE(?, effective_date),
                remarks = COALESCE(?, remarks),
                updated_at = CURRENT_TIMESTAMP
            WHERE tech_sheet_id = ?
        `;

        db.run(updateSql, [sample_no, effective_date, remarks, techSheetId], function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });

            // Clear old children and re-insert
            clearAndReinsertChildren(techSheetId, {
                dimensions,
                materials,
                components,
                construction,
                colors,
                operations,
                quality,
                packaging
            }, () => {
                res.json({
                    success: true,
                    message: "Tech Sheet Updated Successfully",
                    tech_sheet_id: techSheetId
                });
            });
        });
    });
};

// =========================================================================
// 5. DELETE TECH SHEET
// =========================================================================
exports.deleteTechSheet = (req, res) => {
    const techSheetId = req.params.id;

    db.get("SELECT status FROM tech_sheets WHERE tech_sheet_id = ?", [techSheetId], (err, sheet) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!sheet) return res.status(404).json({ success: false, message: "Tech Sheet not found" });

        if (sheet.status === "Approved") {
            return res.status(403).json({
                success: false,
                message: "Approved Tech Sheets cannot be deleted for audit integrity."
            });
        }

        db.run("DELETE FROM tech_sheets WHERE tech_sheet_id = ?", [techSheetId], function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({
                success: true,
                message: "Tech Sheet deleted successfully"
            });
        });
    });
};

// =========================================================================
// 6. APPROVAL LIFECYCLE: SUBMIT
// =========================================================================
exports.submitTechSheet = (req, res) => {
    const techSheetId = req.params.id;
    const { submitted_by = "Admin" } = req.body;

    db.run(`
        UPDATE tech_sheets SET
            status = 'Pending Approval',
            submitted_by = ?,
            submitted_date = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE tech_sheet_id = ? AND status = 'Draft'
    `, [submitted_by, techSheetId], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (this.changes === 0) {
            return res.status(400).json({
                success: false,
                message: "Tech Sheet cannot be submitted. Only Draft sheets can be submitted."
            });
        }

        res.json({
            success: true,
            message: "Tech Sheet submitted for approval",
            status: "Pending Approval"
        });
    });
};

// =========================================================================
// 7. APPROVAL LIFECYCLE: APPROVE (Locks sheet)
// =========================================================================
exports.approveTechSheet = (req, res) => {
    const techSheetId = req.params.id;
    const { approved_by = "QA Manager", approval_remarks } = req.body;

    db.run(`
        UPDATE tech_sheets SET
            status = 'Approved',
            approved_by = ?,
            approved_date = CURRENT_TIMESTAMP,
            approval_remarks = ?,
            rejection_reason = NULL,
            updated_at = CURRENT_TIMESTAMP
        WHERE tech_sheet_id = ?
    `, [approved_by, approval_remarks || null, techSheetId], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (this.changes === 0) return res.status(404).json({ success: false, message: "Tech Sheet not found" });

        res.json({
            success: true,
            message: "Tech Sheet Approved and Locked Successfully",
            status: "Approved"
        });
    });
};

// =========================================================================
// 8. APPROVAL LIFECYCLE: REJECT
// =========================================================================
exports.rejectTechSheet = (req, res) => {
    const techSheetId = req.params.id;
    const { rejection_reason = "Requirements not met", rejected_by = "QA Manager" } = req.body;

    db.run(`
        UPDATE tech_sheets SET
            status = 'Rejected',
            rejection_reason = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE tech_sheet_id = ?
    `, [rejection_reason, techSheetId], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (this.changes === 0) return res.status(404).json({ success: false, message: "Tech Sheet not found" });

        res.json({
            success: true,
            message: "Tech Sheet has been rejected",
            status: "Rejected"
        });
    });
};

// =========================================================================
// 9. AUTOMATIC REVISION CLONING (e.g. 01 -> 02, Status: Draft)
// =========================================================================
exports.createRevision = (req, res) => {
    const originalId = req.params.id;

    db.get("SELECT ts.*, s.style_no FROM tech_sheets ts JOIN style_master s ON ts.style_id = s.style_id WHERE ts.tech_sheet_id = ?", [originalId], (err, orig) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!orig) return res.status(404).json({ success: false, message: "Source Tech Sheet not found" });

        // Find the highest revision number across all tech sheets for this style
        db.get("SELECT MAX(CAST(revision AS INTEGER)) as max_rev FROM tech_sheets WHERE style_id = ?", [orig.style_id], (err, maxRow) => {
            const currentMax = (maxRow && maxRow.max_rev) ? maxRow.max_rev : (parseInt(orig.revision, 10) || 1);
            const nextRevNum = currentMax + 1;
            const nextRev = String(nextRevNum).padStart(2, "0");
            const nextVersion = `${nextRevNum}.0`;
            const newNo = `TS-${orig.style_no}-${nextRev}`;

            const insertSql = `
                INSERT INTO tech_sheets (
                    style_id, tech_sheet_no, revision, version, status, sample_no,
                    effective_date, prepared_by, prepared_date, remarks
                ) VALUES (?, ?, ?, ?, 'Draft', ?, CURRENT_TIMESTAMP, 'Admin', CURRENT_TIMESTAMP, ?)
            `;

            db.run(insertSql, [orig.style_id, newNo, nextRev, nextVersion, orig.sample_no, `Revision of ${orig.tech_sheet_no}`], function (err) {
                if (err) return res.status(500).json({ success: false, message: err.message });

                const newTechSheetId = this.lastID;

                // Deep clone all child collections from original
                cloneChildren(originalId, newTechSheetId, () => {
                    res.status(201).json({
                        success: true,
                        message: `Revision ${nextRev} created successfully`,
                        tech_sheet_id: newTechSheetId,
                        tech_sheet_no: newNo,
                        revision: nextRev,
                        status: "Draft"
                    });
                });
            });
        });
    });
};

// =========================================================================
// HELPER: SAVE CHILD COLLECTIONS
// =========================================================================
function saveChildCollections(techSheetId, data, callback) {
    db.serialize(() => {
        // 1. Dimensions
        if (Array.isArray(data.dimensions) && data.dimensions.length > 0) {
            const dimStmt = db.prepare(`
                INSERT INTO tech_sheet_dimensions (tech_sheet_id, dimension_type, specification, value, tolerance_minus, tolerance_plus, uom, remarks)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
            data.dimensions.forEach(d => {
                if (d.dimension_type || d.specification) {
                    dimStmt.run(techSheetId, d.dimension_type, d.specification, parseFloat(d.value) || 0, parseFloat(d.tolerance_minus) || 0, parseFloat(d.tolerance_plus) || 0, d.uom || 'cm', d.remarks || null);
                }
            });
            dimStmt.finalize();
        }

        // 2. Materials
        if (Array.isArray(data.materials) && data.materials.length > 0) {
            const matStmt = db.prepare(`
                INSERT INTO tech_sheet_materials (tech_sheet_id, line_no, item_id, material_code, material_name, material_type, specification, color, thickness, width, consumption, uom, wastage_percent, remarks)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            data.materials.forEach((m, idx) => {
                if (m.material_name || m.item_id) {
                    matStmt.run(
                        techSheetId,
                        m.line_no || idx + 1,
                        m.item_id || null,
                        m.material_code || null,
                        m.material_name || 'Material',
                        m.material_type || null,
                        m.specification || null,
                        m.color || null,
                        m.thickness || null,
                        m.width || null,
                        parseFloat(m.consumption) || 0,
                        m.uom || 'MTR',
                        parseFloat(m.wastage_percent) || 0,
                        m.remarks || null
                    );
                }
            });
            matStmt.finalize();
        }

        // 3. Components
        if (Array.isArray(data.components) && data.components.length > 0) {
            const compStmt = db.prepare(`
                INSERT INTO tech_sheet_components (tech_sheet_id, line_no, item_id, item_code, component_name, component_type, specification, color, size, qty, uom, remarks)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            data.components.forEach((c, idx) => {
                if (c.component_name || c.item_id) {
                    compStmt.run(
                        techSheetId,
                        c.line_no || idx + 1,
                        c.item_id || null,
                        c.item_code || null,
                        c.component_name || 'Component',
                        c.component_type || null,
                        c.specification || null,
                        c.color || null,
                        c.size || null,
                        parseFloat(c.qty) || 1,
                        c.uom || 'PCS',
                        c.remarks || null
                    );
                }
            });
            compStmt.finalize();
        }

        // 4. Construction
        if (data.construction) {
            const c = Array.isArray(data.construction) ? data.construction[0] : data.construction;
            if (c && Object.keys(c).length > 0) {
                db.run(`
                    INSERT INTO tech_sheet_construction (
                        tech_sheet_id, construction_method, stitch_type, stitch_density, spi,
                        thread_type, thread_size, seam_allowance, skiving_requirement, edge_treatment,
                        edge_paint, folding_requirement, adhesive_requirement, reinforcement_requirement, special_notes
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    techSheetId, c.construction_method || null, c.stitch_type || null, c.stitch_density || null,
                    c.spi || null, c.thread_type || null, c.thread_size || null, c.seam_allowance || null,
                    c.skiving_requirement || null, c.edge_treatment || null, c.edge_paint || null,
                    c.folding_requirement || null, c.adhesive_requirement || null, c.reinforcement_requirement || null,
                    c.special_notes || null
                ]);
            }
        }

        // 5. Colors
        if (Array.isArray(data.colors) && data.colors.length > 0) {
            const colStmt = db.prepare(`
                INSERT INTO tech_sheet_colors (tech_sheet_id, color_code, color_name, pantone, main_material_color, lining_color, thread_color, hardware_color, edge_paint_color)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            data.colors.forEach(col => {
                if (col.color_name) {
                    colStmt.run(techSheetId, col.color_code || null, col.color_name, col.pantone || null, col.main_material_color || null, col.lining_color || null, col.thread_color || null, col.hardware_color || null, col.edge_paint_color || null);
                }
            });
            colStmt.finalize();
        }

        // 6. Operations
        if (Array.isArray(data.operations) && data.operations.length > 0) {
            const opStmt = db.prepare(`
                INSERT INTO tech_sheet_operations (tech_sheet_id, sequence, operation_code, operation_name, work_center, machine, smv, skill_level, subcontract, remarks)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            data.operations.forEach((op, idx) => {
                if (op.operation_name) {
                    opStmt.run(
                        techSheetId,
                        op.sequence || idx + 1,
                        op.operation_code || null,
                        op.operation_name,
                        op.work_center || null,
                        op.machine || null,
                        parseFloat(op.smv) || 0,
                        op.skill_level || 'Semi-Skilled',
                        op.subcontract || 'No',
                        op.remarks || null
                    );
                }
            });
            opStmt.finalize();
        }

        // 7. Quality
        if (Array.isArray(data.quality) && data.quality.length > 0) {
            const qStmt = db.prepare(`
                INSERT INTO tech_sheet_quality (tech_sheet_id, inspection_point, specification, standard, tolerance, inspection_method, critical, remarks)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
            data.quality.forEach(q => {
                if (q.inspection_point) {
                    qStmt.run(
                        techSheetId,
                        q.inspection_point,
                        q.specification || null,
                        q.standard || null,
                        q.tolerance || null,
                        q.inspection_method || 'Visual',
                        q.critical || 'No',
                        q.remarks || null
                    );
                }
            });
            qStmt.finalize();
        }

        // 8. Packaging
        if (data.packaging) {
            const p = Array.isArray(data.packaging) ? data.packaging[0] : data.packaging;
            if (p && Object.keys(p).length > 0) {
                db.run(`
                    INSERT INTO tech_sheet_packaging (
                        tech_sheet_id, polybag_type, polybag_size, hangtag, barcode,
                        sticker, dust_bag, box, carton, carton_qty, packing_instruction, special_packaging_instruction
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    techSheetId, p.polybag_type || null, p.polybag_size || null, p.hangtag || null,
                    p.barcode || null, p.sticker || null, p.dust_bag || null, p.box || null,
                    p.carton || null, parseInt(p.carton_qty) || 1, p.packing_instruction || null,
                    p.special_packaging_instruction || null
                ]);
            }
        }

        if (callback) callback(null);
    });
}

function clearAndReinsertChildren(techSheetId, data, callback) {
    db.serialize(() => {
        if (data.dimensions) db.run("DELETE FROM tech_sheet_dimensions WHERE tech_sheet_id = ?", [techSheetId]);
        if (data.materials) db.run("DELETE FROM tech_sheet_materials WHERE tech_sheet_id = ?", [techSheetId]);
        if (data.components) db.run("DELETE FROM tech_sheet_components WHERE tech_sheet_id = ?", [techSheetId]);
        if (data.construction) db.run("DELETE FROM tech_sheet_construction WHERE tech_sheet_id = ?", [techSheetId]);
        if (data.colors) db.run("DELETE FROM tech_sheet_colors WHERE tech_sheet_id = ?", [techSheetId]);
        if (data.operations) db.run("DELETE FROM tech_sheet_operations WHERE tech_sheet_id = ?", [techSheetId]);
        if (data.quality) db.run("DELETE FROM tech_sheet_quality WHERE tech_sheet_id = ?", [techSheetId]);
        if (data.packaging) db.run("DELETE FROM tech_sheet_packaging WHERE tech_sheet_id = ?", [techSheetId]);

        saveChildCollections(techSheetId, data, callback);
    });
}

function cloneChildren(oldId, newId, callback) {
    db.serialize(() => {
        // Clone dimensions
        db.run(`
            INSERT INTO tech_sheet_dimensions (tech_sheet_id, dimension_type, specification, value, tolerance_minus, tolerance_plus, uom, remarks)
            SELECT ?, dimension_type, specification, value, tolerance_minus, tolerance_plus, uom, remarks
            FROM tech_sheet_dimensions WHERE tech_sheet_id = ?
        `, [newId, oldId]);

        // Clone materials
        db.run(`
            INSERT INTO tech_sheet_materials (tech_sheet_id, line_no, item_id, material_code, material_name, material_type, specification, color, thickness, width, consumption, uom, wastage_percent, remarks)
            SELECT ?, line_no, item_id, material_code, material_name, material_type, specification, color, thickness, width, consumption, uom, wastage_percent, remarks
            FROM tech_sheet_materials WHERE tech_sheet_id = ?
        `, [newId, oldId]);

        // Clone components
        db.run(`
            INSERT INTO tech_sheet_components (tech_sheet_id, line_no, item_id, item_code, component_name, component_type, specification, color, size, qty, uom, remarks)
            SELECT ?, line_no, item_id, item_code, component_name, component_type, specification, color, size, qty, uom, remarks
            FROM tech_sheet_components WHERE tech_sheet_id = ?
        `, [newId, oldId]);

        // Clone construction
        db.run(`
            INSERT INTO tech_sheet_construction (tech_sheet_id, construction_method, stitch_type, stitch_density, spi, thread_type, thread_size, seam_allowance, skiving_requirement, edge_treatment, edge_paint, folding_requirement, adhesive_requirement, reinforcement_requirement, special_notes)
            SELECT ?, construction_method, stitch_type, stitch_density, spi, thread_type, thread_size, seam_allowance, skiving_requirement, edge_treatment, edge_paint, folding_requirement, adhesive_requirement, reinforcement_requirement, special_notes
            FROM tech_sheet_construction WHERE tech_sheet_id = ?
        `, [newId, oldId]);

        // Clone colors
        db.run(`
            INSERT INTO tech_sheet_colors (tech_sheet_id, color_code, color_name, pantone, main_material_color, lining_color, thread_color, hardware_color, edge_paint_color)
            SELECT ?, color_code, color_name, pantone, main_material_color, lining_color, thread_color, hardware_color, edge_paint_color
            FROM tech_sheet_colors WHERE tech_sheet_id = ?
        `, [newId, oldId]);

        // Clone operations
        db.run(`
            INSERT INTO tech_sheet_operations (tech_sheet_id, sequence, operation_code, operation_name, work_center, machine, smv, skill_level, subcontract, remarks)
            SELECT ?, sequence, operation_code, operation_name, work_center, machine, smv, skill_level, subcontract, remarks
            FROM tech_sheet_operations WHERE tech_sheet_id = ?
        `, [newId, oldId]);

        // Clone quality
        db.run(`
            INSERT INTO tech_sheet_quality (tech_sheet_id, inspection_point, specification, standard, tolerance, inspection_method, critical, remarks)
            SELECT ?, inspection_point, specification, standard, tolerance, inspection_method, critical, remarks
            FROM tech_sheet_quality WHERE tech_sheet_id = ?
        `, [newId, oldId]);

        // Clone packaging
        db.run(`
            INSERT INTO tech_sheet_packaging (tech_sheet_id, polybag_type, polybag_size, hangtag, barcode, sticker, dust_bag, box, carton, carton_qty, packing_instruction, special_packaging_instruction)
            SELECT ?, polybag_type, polybag_size, hangtag, barcode, sticker, dust_bag, box, carton, carton_qty, packing_instruction, special_packaging_instruction
            FROM tech_sheet_packaging WHERE tech_sheet_id = ?
        `, [newId, oldId]);

        if (callback) callback(null);
    });
}
