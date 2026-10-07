const db = require("../config/database");

db.serialize(() => {
    // ======================================================
    // 1. STYLE MASTER TABLE
    // ======================================================
    db.run(`
    CREATE TABLE IF NOT EXISTS style_master (
        style_id INTEGER PRIMARY KEY AUTOINCREMENT,
        style_no TEXT UNIQUE NOT NULL,
        style_name TEXT NOT NULL,
        short_description TEXT,
        product_category TEXT NOT NULL,
        product_type TEXT NOT NULL,
        sub_category TEXT,
        brand TEXT,
        collection TEXT,
        season TEXT,
        gender TEXT,
        customer_id INTEGER,
        status TEXT DEFAULT 'Draft',
        revision TEXT DEFAULT '01',
        bag_type TEXT,
        usage TEXT,
        target_market TEXT,
        material_group TEXT,
        construction_type TEXT,
        packaging_type TEXT,
        country_of_origin TEXT DEFAULT 'India',
        hsn_code TEXT,
        uom TEXT DEFAULT 'PCS',
        moq REAL DEFAULT 1,
        lead_time TEXT,
        remarks TEXT,
        created_by TEXT DEFAULT 'Admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_by TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(customer_id) REFERENCES Customers(CustomerID)
    )
    `, err => {
        if (err) console.error("❌ style_master error:", err.message);
        else console.log("✓ style_master Ready");
    });

    // ======================================================
    // 2. STYLE COLORS TABLE
    // ======================================================
    db.run(`
    CREATE TABLE IF NOT EXISTS style_colors (
        style_color_id INTEGER PRIMARY KEY AUTOINCREMENT,
        style_id INTEGER NOT NULL,
        color_code TEXT,
        color_name TEXT NOT NULL,
        pantone TEXT,
        color_family TEXT,
        material_color TEXT,
        status TEXT DEFAULT 'Active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(style_id) REFERENCES style_master(style_id) ON DELETE CASCADE
    )
    `, err => {
        if (err) console.error("❌ style_colors error:", err.message);
        else console.log("✓ style_colors Ready");
    });

    // ======================================================
    // 3. STYLE SIZES / DIMENSIONS TABLE
    // ======================================================
    db.run(`
    CREATE TABLE IF NOT EXISTS style_sizes (
        style_size_id INTEGER PRIMARY KEY AUTOINCREMENT,
        style_id INTEGER NOT NULL,
        size_code TEXT,
        size_name TEXT NOT NULL,
        length REAL,
        width REAL,
        height REAL,
        gusset REAL,
        handle_drop REAL,
        strap_length REAL,
        strap_width REAL,
        weight REAL,
        uom TEXT DEFAULT 'cm',
        FOREIGN KEY(style_id) REFERENCES style_master(style_id) ON DELETE CASCADE
    )
    `, err => {
        if (err) console.error("❌ style_sizes error:", err.message);
        else console.log("✓ style_sizes Ready");
    });

    // ======================================================
    // 4. STYLE DOCUMENTS / ATTACHMENTS TABLE
    // ======================================================
    db.run(`
    CREATE TABLE IF NOT EXISTS style_documents (
        document_id INTEGER PRIMARY KEY AUTOINCREMENT,
        style_id INTEGER NOT NULL,
        document_type TEXT,
        document_name TEXT,
        file_url TEXT,
        file_size TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(style_id) REFERENCES style_master(style_id) ON DELETE CASCADE
    )
    `, err => {
        if (err) console.error("❌ style_documents error:", err.message);
        else console.log("✓ style_documents Ready");
    });

    // ======================================================
    // 5. TECH SHEETS TABLE
    // ======================================================
    db.run(`
    CREATE TABLE IF NOT EXISTS tech_sheets (
        tech_sheet_id INTEGER PRIMARY KEY AUTOINCREMENT,
        style_id INTEGER NOT NULL,
        tech_sheet_no TEXT UNIQUE NOT NULL,
        revision TEXT DEFAULT '01',
        version TEXT DEFAULT '1.0',
        status TEXT DEFAULT 'Draft',
        sample_no TEXT,
        effective_date TEXT,
        prepared_by TEXT,
        prepared_date TEXT,
        submitted_by TEXT,
        submitted_date TEXT,
        approved_by TEXT,
        approved_date TEXT,
        rejection_reason TEXT,
        approval_remarks TEXT,
        remarks TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(style_id) REFERENCES style_master(style_id) ON DELETE CASCADE
    )
    `, err => {
        if (err) console.error("❌ tech_sheets error:", err.message);
        else console.log("✓ tech_sheets Ready");
    });

    // ======================================================
    // 6. TECH SHEET DIMENSIONS TABLE
    // ======================================================
    db.run(`
    CREATE TABLE IF NOT EXISTS tech_sheet_dimensions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tech_sheet_id INTEGER NOT NULL,
        dimension_type TEXT,
        specification TEXT,
        value REAL,
        tolerance_minus REAL,
        tolerance_plus REAL,
        uom TEXT DEFAULT 'cm',
        remarks TEXT,
        FOREIGN KEY(tech_sheet_id) REFERENCES tech_sheets(tech_sheet_id) ON DELETE CASCADE
    )
    `, err => {
        if (err) console.error("❌ tech_sheet_dimensions error:", err.message);
        else console.log("✓ tech_sheet_dimensions Ready");
    });

    // ======================================================
    // 7. TECH SHEET MATERIALS TABLE (LINKS WITH ITEM MASTER)
    // ======================================================
    db.run(`
    CREATE TABLE IF NOT EXISTS tech_sheet_materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tech_sheet_id INTEGER NOT NULL,
        line_no INTEGER,
        item_id INTEGER,
        material_code TEXT,
        material_name TEXT NOT NULL,
        material_type TEXT,
        specification TEXT,
        color TEXT,
        thickness TEXT,
        width TEXT,
        consumption REAL NOT NULL DEFAULT 0,
        uom TEXT,
        wastage_percent REAL DEFAULT 0,
        remarks TEXT,
        FOREIGN KEY(tech_sheet_id) REFERENCES tech_sheets(tech_sheet_id) ON DELETE CASCADE,
        FOREIGN KEY(item_id) REFERENCES Items(ItemID)
    )
    `, err => {
        if (err) console.error("❌ tech_sheet_materials error:", err.message);
        else console.log("✓ tech_sheet_materials Ready");
    });

    // ======================================================
    // 8. TECH SHEET COMPONENTS TABLE (LINKS WITH ITEM MASTER)
    // ======================================================
    db.run(`
    CREATE TABLE IF NOT EXISTS tech_sheet_components (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tech_sheet_id INTEGER NOT NULL,
        line_no INTEGER,
        item_id INTEGER,
        item_code TEXT,
        component_name TEXT NOT NULL,
        component_type TEXT,
        specification TEXT,
        color TEXT,
        size TEXT,
        qty REAL NOT NULL DEFAULT 1,
        uom TEXT,
        remarks TEXT,
        FOREIGN KEY(tech_sheet_id) REFERENCES tech_sheets(tech_sheet_id) ON DELETE CASCADE,
        FOREIGN KEY(item_id) REFERENCES Items(ItemID)
    )
    `, err => {
        if (err) console.error("❌ tech_sheet_components error:", err.message);
        else console.log("✓ tech_sheet_components Ready");
    });

    // ======================================================
    // 9. TECH SHEET CONSTRUCTION TABLE
    // ======================================================
    db.run(`
    CREATE TABLE IF NOT EXISTS tech_sheet_construction (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tech_sheet_id INTEGER NOT NULL,
        construction_method TEXT,
        stitch_type TEXT,
        stitch_density TEXT,
        spi TEXT,
        thread_type TEXT,
        thread_size TEXT,
        seam_allowance TEXT,
        skiving_requirement TEXT,
        edge_treatment TEXT,
        edge_paint TEXT,
        folding_requirement TEXT,
        adhesive_requirement TEXT,
        reinforcement_requirement TEXT,
        special_notes TEXT,
        FOREIGN KEY(tech_sheet_id) REFERENCES tech_sheets(tech_sheet_id) ON DELETE CASCADE
    )
    `, err => {
        if (err) console.error("❌ tech_sheet_construction error:", err.message);
        else console.log("✓ tech_sheet_construction Ready");
    });

    // ======================================================
    // 10. TECH SHEET COLORS TABLE
    // ======================================================
    db.run(`
    CREATE TABLE IF NOT EXISTS tech_sheet_colors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tech_sheet_id INTEGER NOT NULL,
        color_code TEXT,
        color_name TEXT NOT NULL,
        pantone TEXT,
        main_material_color TEXT,
        lining_color TEXT,
        thread_color TEXT,
        hardware_color TEXT,
        edge_paint_color TEXT,
        FOREIGN KEY(tech_sheet_id) REFERENCES tech_sheets(tech_sheet_id) ON DELETE CASCADE
    )
    `, err => {
        if (err) console.error("❌ tech_sheet_colors error:", err.message);
        else console.log("✓ tech_sheet_colors Ready");
    });

    // ======================================================
    // 11. TECH SHEET OPERATIONS / ROUTING TABLE
    // ======================================================
    db.run(`
    CREATE TABLE IF NOT EXISTS tech_sheet_operations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tech_sheet_id INTEGER NOT NULL,
        sequence INTEGER,
        operation_code TEXT,
        operation_name TEXT NOT NULL,
        work_center TEXT,
        machine TEXT,
        smv REAL DEFAULT 0,
        skill_level TEXT,
        subcontract TEXT DEFAULT 'No',
        remarks TEXT,
        FOREIGN KEY(tech_sheet_id) REFERENCES tech_sheets(tech_sheet_id) ON DELETE CASCADE
    )
    `, err => {
        if (err) console.error("❌ tech_sheet_operations error:", err.message);
        else console.log("✓ tech_sheet_operations Ready");
    });

    // ======================================================
    // 12. TECH SHEET QUALITY SPECIFICATIONS TABLE
    // ======================================================
    db.run(`
    CREATE TABLE IF NOT EXISTS tech_sheet_quality (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tech_sheet_id INTEGER NOT NULL,
        inspection_point TEXT NOT NULL,
        specification TEXT,
        standard TEXT,
        tolerance TEXT,
        inspection_method TEXT,
        critical TEXT DEFAULT 'No',
        remarks TEXT,
        FOREIGN KEY(tech_sheet_id) REFERENCES tech_sheets(tech_sheet_id) ON DELETE CASCADE
    )
    `, err => {
        if (err) console.error("❌ tech_sheet_quality error:", err.message);
        else console.log("✓ tech_sheet_quality Ready");
    });

    // ======================================================
    // 13. TECH SHEET PACKAGING TABLE
    // ======================================================
    db.run(`
    CREATE TABLE IF NOT EXISTS tech_sheet_packaging (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tech_sheet_id INTEGER NOT NULL,
        polybag_type TEXT,
        polybag_size TEXT,
        hangtag TEXT,
        barcode TEXT,
        sticker TEXT,
        dust_bag TEXT,
        box TEXT,
        carton TEXT,
        carton_qty INTEGER,
        packing_instruction TEXT,
        special_packaging_instruction TEXT,
        FOREIGN KEY(tech_sheet_id) REFERENCES tech_sheets(tech_sheet_id) ON DELETE CASCADE
    )
    `, err => {
        if (err) console.error("❌ tech_sheet_packaging error:", err.message);
        else console.log("✓ tech_sheet_packaging Ready");
    });

    // Indexes
    const indexes = [
        "CREATE INDEX IF NOT EXISTS idx_style_master_no ON style_master(style_no)",
        "CREATE INDEX IF NOT EXISTS idx_style_master_cat ON style_master(product_category)",
        "CREATE INDEX IF NOT EXISTS idx_style_colors_style ON style_colors(style_id)",
        "CREATE INDEX IF NOT EXISTS idx_style_sizes_style ON style_sizes(style_id)",
        "CREATE INDEX IF NOT EXISTS idx_tech_sheets_no ON tech_sheets(tech_sheet_no)",
        "CREATE INDEX IF NOT EXISTS idx_tech_sheets_style ON tech_sheets(style_id)",
        "CREATE INDEX IF NOT EXISTS idx_tech_sheet_mat_item ON tech_sheet_materials(item_id)"
    ];
    indexes.forEach(sql => db.run(sql, () => {}));

    console.log("✅ Style Management Tables Loaded");
});
