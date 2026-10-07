/**
 * Tech Sheet Full Export Utilities (Excel & PDF)
 * Exports the complete Technical Specification Sheet (all 9 sections):
 * 1. Dimensions & Tolerances
 * 2. Materials BOM (Item Master linked)
 * 3. Hardware & Components (Item Master linked)
 * 4. Engineering & Construction
 * 5. Color Combinations (Colorways)
 * 6. Operations Routing & SMV Breakdown
 * 7. Quality Specifications & AQL Standards
 * 8. Packaging & Boxing Specs
 * 9. Factory Approvals & Sign-off
 */

// =========================================================================
// 1. EXPORT FULL TECH SHEET TO EXCEL (.xls)
// =========================================================================
export function exportTechSheetToExcel(data) {
  if (!data || !data.sheet) {
    alert("No Tech Sheet data available to export.");
    return;
  }

  const {
    sheet,
    dimensions = [],
    materials = [],
    components = [],
    construction = {},
    colors = [],
    operations = [],
    quality = [],
    packaging = {}
  } = data;

  const totalSMV = operations.reduce((sum, o) => sum + (parseFloat(o.smv) || 0), 0);
  const totalMaterialReq = materials.reduce((sum, m) => {
    const cons = parseFloat(m.consumption) || 0;
    const waste = parseFloat(m.wastage_percent) || 0;
    return sum + cons * (1 + waste / 100);
  }, 0);

  const constr = Array.isArray(construction) ? (construction[0] || {}) : (construction || {});
  const pack = Array.isArray(packaging) ? (packaging[0] || {}) : (packaging || {});

  let html = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!--[if gte mso 9]>
    <xml>
      <x:ExcelWorkbook>
        <x:ExcelWorksheets>
          <x:ExcelWorksheet>
            <x:Name>${(sheet.tech_sheet_no || "TechSheet").replace(/[/\\?*\[\]:]/g, "_")}</x:Name>
            <x:WorksheetOptions>
              <x:DisplayGridlines/>
            </x:WorksheetOptions>
          </x:ExcelWorksheet>
        </x:ExcelWorksheets>
      </x:ExcelWorkbook>
    </xml>
    <![endif]-->
    <style>
      body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
      .header-title { background-color: #1e3a8a; color: #ffffff; font-size: 16pt; font-weight: bold; text-align: center; height: 35px; vertical-align: middle; }
      .header-sub { background-color: #2563eb; color: #ffffff; font-size: 10pt; font-weight: bold; text-align: center; height: 24px; vertical-align: middle; }
      .section-banner { background-color: #0f172a; color: #ffffff; font-size: 11pt; font-weight: bold; padding: 6px; height: 26px; }
      .meta-lbl { background-color: #f1f5f9; color: #475569; font-weight: bold; border: 1px solid #cbd5e1; padding: 5px; width: 18%; }
      .meta-val { background-color: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; padding: 5px; width: 32%; }
      .tbl-th { background-color: #e2e8f0; color: #1e293b; font-weight: bold; border: 1px solid #94a3b8; text-align: center; padding: 6px; }
      .tbl-td { border: 1px solid #cbd5e1; padding: 5px; vertical-align: middle; }
      .tbl-td-c { border: 1px solid #cbd5e1; padding: 5px; text-align: center; vertical-align: middle; }
      .tbl-td-r { border: 1px solid #cbd5e1; padding: 5px; text-align: right; vertical-align: middle; }
      .total-row { background-color: #fef08a; font-weight: bold; border: 1px solid #94a3b8; }
      .sign-box { border: 1px solid #94a3b8; background-color: #f8fafc; text-align: center; padding: 12px; }
    </style>
  </head>
  <body>

    <!-- DOCUMENT HEADER -->
    <table>
      <tr>
        <td colspan="10" class="header-title">GLOBAL LEATHER & APPAREL ERP</td>
      </tr>
      <tr>
        <td colspan="10" class="header-sub">FACTORY TECHNICAL SPECIFICATION SHEET (TECH PACK)</td>
      </tr>
      <tr><td colspan="10" style="height: 10px;"></td></tr>
    </table>

    <!-- METADATA & STYLE OVERVIEW -->
    <table>
      <tr>
        <td colspan="10" class="section-banner">DOCUMENT & STYLE SPECIFICATION OVERVIEW</td>
      </tr>
      <tr>
        <td class="meta-lbl">Tech Sheet No:</td>
        <td class="meta-val" style="font-weight: bold; color: #1e3a8a;">${sheet.tech_sheet_no}</td>
        <td class="meta-lbl">Revision / Version:</td>
        <td class="meta-val">Rev ${sheet.revision || "01"} / v${sheet.version || "1.0"}</td>
        <td class="meta-lbl">Status:</td>
        <td colspan="5" class="meta-val" style="font-weight: bold;">${sheet.status || "Draft"}</td>
      </tr>
      <tr>
        <td class="meta-lbl">Style Number:</td>
        <td class="meta-val" style="font-weight: bold;">${sheet.style_no}</td>
        <td class="meta-lbl">Style Name:</td>
        <td class="meta-val">${sheet.style_name}</td>
        <td class="meta-lbl">Effective Date:</td>
        <td colspan="5" class="meta-val">${sheet.effective_date || "—"}</td>
      </tr>
      <tr>
        <td class="meta-lbl">Customer / Buyer:</td>
        <td class="meta-val">${sheet.CustomerName || "—"} (${sheet.CustomerCode || "—"})</td>
        <td class="meta-lbl">Brand / Collection:</td>
        <td class="meta-val">${sheet.brand || "—"} / ${sheet.collection || "—"}</td>
        <td class="meta-lbl">Sample Ref No:</td>
        <td colspan="5" class="meta-val">${sheet.sample_no || "—"}</td>
      </tr>
      <tr>
        <td class="meta-lbl">Category / Bag Type:</td>
        <td class="meta-val">${sheet.product_category} • ${sheet.bag_type || sheet.product_type || "—"}</td>
        <td class="meta-lbl">Season / Gender:</td>
        <td class="meta-val">${sheet.season || "Core"} • ${sheet.gender || "Unisex"}</td>
        <td class="meta-lbl">Origin / Target:</td>
        <td colspan="5" class="meta-val">${sheet.country_of_origin || "India"} • ${sheet.target_market || "Global"}</td>
      </tr>
      <tr><td colspan="10" style="height: 10px;"></td></tr>
    </table>

    <!-- SECTION 1: FINISHED PRODUCT DIMENSIONS -->
    <table>
      <tr>
        <td colspan="7" class="section-banner">1. FINISHED PRODUCT DIMENSIONS & MEASUREMENT TOLERANCES</td>
      </tr>
      <tr>
        <th class="tbl-th" style="width: 25%;">Point of Measure (POM)</th>
        <th class="tbl-th" style="width: 30%;">Specification Description</th>
        <th class="tbl-th" style="width: 10%;">Nominal Value</th>
        <th class="tbl-th" style="width: 8%;">Tol (-)</th>
        <th class="tbl-th" style="width: 8%;">Tol (+)</th>
        <th class="tbl-th" style="width: 7%;">Unit</th>
        <th class="tbl-th" style="width: 12%;">Measurement Method / Notes</th>
      </tr>`;

  if (dimensions.length === 0) {
    html += `<tr><td colspan="7" class="tbl-td-c" style="color: #64748b;">No dimension records defined.</td></tr>`;
  } else {
    dimensions.forEach((d) => {
      html += `
      <tr>
        <td class="tbl-td" style="font-weight: bold;">${d.dimension_type || ""}</td>
        <td class="tbl-td">${d.specification || "—"}</td>
        <td class="tbl-td-c" style="font-weight: bold;">${d.value ?? ""}</td>
        <td class="tbl-td-c" style="color: #64748b;">-${d.tolerance_minus ?? 0}</td>
        <td class="tbl-td-c" style="color: #64748b;">+${d.tolerance_plus ?? 0}</td>
        <td class="tbl-td-c">${d.uom || "cm"}</td>
        <td class="tbl-td">${d.remarks || "—"}</td>
      </tr>`;
    });
  }

  html += `<tr><td colspan="7" style="height: 10px;"></td></tr></table>`;

  // SECTION 2: MATERIALS BOM
  html += `
    <table>
      <tr>
        <td colspan="10" class="section-banner">2. BILL OF MATERIALS (BOM) - RAW MATERIALS (LINKED TO ITEM MASTER)</td>
      </tr>
      <tr>
        <th class="tbl-th" style="width: 4%;">#</th>
        <th class="tbl-th" style="width: 10%;">Item Code</th>
        <th class="tbl-th" style="width: 24%;">Material Name & Specification</th>
        <th class="tbl-th" style="width: 12%;">Placement / Type</th>
        <th class="tbl-th" style="width: 12%;">Color / Finish</th>
        <th class="tbl-th" style="width: 10%;">Thickness / Width</th>
        <th class="tbl-th" style="width: 9%;">Unit Cons.</th>
        <th class="tbl-th" style="width: 6%;">UOM</th>
        <th class="tbl-th" style="width: 6%;">Waste %</th>
        <th class="tbl-th" style="width: 7%;">Total Req.</th>
      </tr>`;

  if (materials.length === 0) {
    html += `<tr><td colspan="10" class="tbl-td-c" style="color: #64748b;">No raw materials defined.</td></tr>`;
  } else {
    materials.forEach((m, idx) => {
      const cons = parseFloat(m.consumption) || 0;
      const waste = parseFloat(m.wastage_percent) || 0;
      const tot = (cons * (1 + waste / 100)).toFixed(2);
      html += `
      <tr>
        <td class="tbl-td-c">${idx + 1}</td>
        <td class="tbl-td-c" style="font-family: monospace;">${m.ItemCode || m.material_code || "—"}</td>
        <td class="tbl-td" style="font-weight: bold;">${m.material_name || "—"}</td>
        <td class="tbl-td">${m.material_type || "—"}</td>
        <td class="tbl-td">${m.color || "—"}</td>
        <td class="tbl-td">${m.thickness || m.width || "—"}</td>
        <td class="tbl-td-r">${cons.toFixed(2)}</td>
        <td class="tbl-td-c">${m.uom || "MTR"}</td>
        <td class="tbl-td-c">${waste}%</td>
        <td class="tbl-td-r" style="font-weight: bold;">${tot}</td>
      </tr>`;
    });
  }

  html += `<tr><td colspan="10" style="height: 10px;"></td></tr></table>`;

  // SECTION 3: COMPONENTS & HARDWARE
  html += `
    <table>
      <tr>
        <td colspan="8" class="section-banner">3. HARDWARE, FASTENERS & COMPONENTS (LINKED TO ITEM MASTER)</td>
      </tr>
      <tr>
        <th class="tbl-th" style="width: 4%;">#</th>
        <th class="tbl-th" style="width: 12%;">Item Code</th>
        <th class="tbl-th" style="width: 24%;">Component Name</th>
        <th class="tbl-th" style="width: 14%;">Type / Classification</th>
        <th class="tbl-th" style="width: 14%;">Color / Plating Finish</th>
        <th class="tbl-th" style="width: 12%;">Size / Dimension</th>
        <th class="tbl-th" style="width: 8%;">Qty / Unit</th>
        <th class="tbl-th" style="width: 6%;">UOM</th>
      </tr>`;

  if (components.length === 0) {
    html += `<tr><td colspan="8" class="tbl-td-c" style="color: #64748b;">No components defined.</td></tr>`;
  } else {
    components.forEach((c, idx) => {
      html += `
      <tr>
        <td class="tbl-td-c">${idx + 1}</td>
        <td class="tbl-td-c" style="font-family: monospace;">${c.ItemCode || c.item_code || "—"}</td>
        <td class="tbl-td" style="font-weight: bold;">${c.component_name || "—"}</td>
        <td class="tbl-td">${c.component_type || "—"}</td>
        <td class="tbl-td">${c.color || "—"}</td>
        <td class="tbl-td">${c.size || c.specification || "—"}</td>
        <td class="tbl-td-c" style="font-weight: bold;">${c.qty ?? 1}</td>
        <td class="tbl-td-c">${c.uom || "PCS"}</td>
      </tr>`;
    });
  }

  html += `<tr><td colspan="8" style="height: 10px;"></td></tr></table>`;

  // SECTION 4: ENGINEERING SPECIFICATIONS & STITCHING
  html += `
    <table>
      <tr>
        <td colspan="4" class="section-banner">4. ENGINEERING SPECIFICATIONS & STITCHING CONSTRUCTION</td>
      </tr>
      <tr>
        <td class="meta-lbl">Construction Method:</td>
        <td class="meta-val" style="font-weight: bold;">${constr.construction_method || "—"}</td>
        <td class="meta-lbl">Stitch Type & Density:</td>
        <td class="meta-val">${constr.stitch_type || "—"} (${constr.spi || "7-8 SPI"})</td>
      </tr>
      <tr>
        <td class="meta-lbl">Thread Type & Size:</td>
        <td class="meta-val">${constr.thread_type || "—"} (${constr.thread_size || "Tex 70"})</td>
        <td class="meta-lbl">Seam Allowance:</td>
        <td class="meta-val">${constr.seam_allowance || "8 mm"}</td>
      </tr>
      <tr>
        <td class="meta-lbl">Edge Treatment & Paint:</td>
        <td class="meta-val">${constr.edge_treatment || "—"} (${constr.edge_paint || "—"})</td>
        <td class="meta-lbl">Skiving Requirements:</td>
        <td class="meta-val">${constr.skiving_requirement || "—"}</td>
      </tr>
      <tr>
        <td class="meta-lbl">Folding & Adhesive:</td>
        <td class="meta-val">${constr.folding_requirement || "—"} • ${constr.adhesive_requirement || "—"}</td>
        <td class="meta-lbl">Reinforcement Placement:</td>
        <td class="meta-val">${constr.reinforcement_requirement || "—"}</td>
      </tr>
      <tr>
        <td class="meta-lbl">Special Notes:</td>
        <td colspan="3" class="meta-val">${constr.special_notes || "Clean symmetrical construction. Follow approved Golden Sample standard."}</td>
      </tr>
      <tr><td colspan="4" style="height: 10px;"></td></tr>
    </table>`;

  // SECTION 5: COLOR COMBINATIONS
  html += `
    <table>
      <tr>
        <td colspan="7" class="section-banner">5. COLOR COMBINATIONS (COLORWAYS)</td>
      </tr>
      <tr>
        <th class="tbl-th" style="width: 18%;">Colorway Name</th>
        <th class="tbl-th" style="width: 14%;">Pantone TCX</th>
        <th class="tbl-th" style="width: 16%;">Main Leather / Fabric</th>
        <th class="tbl-th" style="width: 14%;">Lining Color</th>
        <th class="tbl-th" style="width: 12%;">Thread Color</th>
        <th class="tbl-th" style="width: 13%;">Hardware Plating</th>
        <th class="tbl-th" style="width: 13%;">Edge Paint Shade</th>
      </tr>`;

  if (colors.length === 0) {
    html += `<tr><td colspan="7" class="tbl-td-c" style="color: #64748b;">No color combinations defined.</td></tr>`;
  } else {
    colors.forEach((col) => {
      html += `
      <tr>
        <td class="tbl-td" style="font-weight: bold;">${col.color_name || "—"}</td>
        <td class="tbl-td-c">${col.pantone || "—"}</td>
        <td class="tbl-td">${col.main_material_color || "—"}</td>
        <td class="tbl-td">${col.lining_color || "—"}</td>
        <td class="tbl-td">${col.thread_color || "—"}</td>
        <td class="tbl-td">${col.hardware_color || "—"}</td>
        <td class="tbl-td">${col.edge_paint_color || "—"}</td>
      </tr>`;
    });
  }

  html += `<tr><td colspan="7" style="height: 10px;"></td></tr></table>`;

  // SECTION 6: OPERATIONS ROUTING & SMV
  html += `
    <table>
      <tr>
        <td colspan="8" class="section-banner">6. MANUFACTURING OPERATIONS ROUTING & STANDARD MINUTE VALUE (SMV)</td>
      </tr>
      <tr>
        <th class="tbl-th" style="width: 4%;">Seq</th>
        <th class="tbl-th" style="width: 10%;">Op Code</th>
        <th class="tbl-th" style="width: 26%;">Operation Description</th>
        <th class="tbl-th" style="width: 16%;">Work Center / Dept</th>
        <th class="tbl-th" style="width: 16%;">Machine Required</th>
        <th class="tbl-th" style="width: 10%;">SMV (Mins)</th>
        <th class="tbl-th" style="width: 10%;">Skill Level</th>
        <th class="tbl-th" style="width: 8%;">Subcontract</th>
      </tr>`;

  if (operations.length === 0) {
    html += `<tr><td colspan="8" class="tbl-td-c" style="color: #64748b;">No operation routing defined.</td></tr>`;
  } else {
    operations.forEach((op, idx) => {
      html += `
      <tr>
        <td class="tbl-td-c">${op.sequence || idx + 1}</td>
        <td class="tbl-td-c" style="font-family: monospace;">${op.operation_code || "—"}</td>
        <td class="tbl-td" style="font-weight: bold;">${op.operation_name || "—"}</td>
        <td class="tbl-td">${op.work_center || "—"}</td>
        <td class="tbl-td">${op.machine || "—"}</td>
        <td class="tbl-td-r" style="font-weight: bold;">${parseFloat(op.smv || 0).toFixed(2)}</td>
        <td class="tbl-td-c">${op.skill_level || "—"}</td>
        <td class="tbl-td-c">${op.subcontract || "No"}</td>
      </tr>`;
    });
    html += `
    <tr class="total-row">
      <td colspan="5" class="tbl-td-r" style="font-weight: bold; font-size: 11pt;">TOTAL STANDARD MINUTES VALUE (SMV):</td>
      <td class="tbl-td-r" style="font-weight: bold; font-size: 11pt;">${totalSMV.toFixed(2)} mins</td>
      <td colspan="2" class="tbl-td-c" style="font-size: 9pt; color: #475569;">Target standard output per unit</td>
    </tr>`;
  }

  html += `<tr><td colspan="8" style="height: 10px;"></td></tr></table>`;

  // SECTION 7: QUALITY CONTROL & AQL STANDARDS
  html += `
    <table>
      <tr>
        <td colspan="6" class="section-banner">7. QUALITY ACCEPTANCE CRITERIA & AQL STANDARDS</td>
      </tr>
      <tr>
        <th class="tbl-th" style="width: 22%;">Inspection Point</th>
        <th class="tbl-th" style="width: 28%;">Specification & Parameter</th>
        <th class="tbl-th" style="width: 14%;">Testing Standard</th>
        <th class="tbl-th" style="width: 12%;">Allowable Tol.</th>
        <th class="tbl-th" style="width: 14%;">Inspection Method</th>
        <th class="tbl-th" style="width: 10%;">Critical Defect</th>
      </tr>`;

  if (quality.length === 0) {
    html += `<tr><td colspan="6" class="tbl-td-c" style="color: #64748b;">No quality criteria defined.</td></tr>`;
  } else {
    quality.forEach((q) => {
      html += `
      <tr>
        <td class="tbl-td" style="font-weight: bold;">${q.inspection_point || "—"}</td>
        <td class="tbl-td">${q.specification || "—"}</td>
        <td class="tbl-td-c">${q.standard || "AQL 1.5"}</td>
        <td class="tbl-td-c">${q.tolerance || "—"}</td>
        <td class="tbl-td">${q.inspection_method || "Visual"}</td>
        <td class="tbl-td-c" style="font-weight: bold; color: ${q.critical === "Yes" ? "#dc2626" : "#475569"};">${q.critical || "No"}</td>
      </tr>`;
    });
  }

  html += `<tr><td colspan="6" style="height: 10px;"></td></tr></table>`;

  // SECTION 8: PACKAGING SPECIFICATIONS
  html += `
    <table>
      <tr>
        <td colspan="4" class="section-banner">8. PACKAGING, CARTONING & STUFFING SPECIFICATIONS</td>
      </tr>
      <tr>
        <td class="meta-lbl">Polybag Specifications:</td>
        <td class="meta-val">${pack.polybag_size || "—"} (${pack.polybag_type || "LDPE"})</td>
        <td class="meta-lbl">Dust Bag Specification:</td>
        <td class="meta-val">${pack.dust_bag || "—"}</td>
      </tr>
      <tr>
        <td class="meta-lbl">Hangtag & Attachment:</td>
        <td class="meta-val">${pack.hangtag || "—"}</td>
        <td class="meta-lbl">Barcode & Care Label:</td>
        <td class="meta-val">${pack.barcode || "—"} • ${pack.sticker || "—"}</td>
      </tr>
      <tr>
        <td class="meta-lbl">Inner / Gift Box:</td>
        <td class="meta-val">${pack.box || "None"}</td>
        <td class="meta-lbl">Master Export Carton:</td>
        <td class="meta-val">${pack.carton || "—"} (${pack.carton_qty || 1} pcs/carton)</td>
      </tr>
      <tr>
        <td class="meta-lbl">Stuffing & Shape Instructions:</td>
        <td colspan="3" class="meta-val">${pack.packing_instruction || "Stuff with acid-free tissue to preserve 3D silhouette. Include silica gel."}</td>
      </tr>
      <tr>
        <td class="meta-lbl">Special Storage Notes:</td>
        <td colspan="3" class="meta-val">${pack.special_packaging_instruction || "Store in low humidity warehouse < 60%."}</td>
      </tr>
      <tr><td colspan="4" style="height: 15px;"></td></tr>
    </table>`;

  // SECTION 9: FACTORY SIGN-OFF BOX
  html += `
    <table>
      <tr>
        <td colspan="4" class="section-banner">9. FACTORY SIGN-OFF & ENGINEERING APPROVALS</td>
      </tr>
      <tr>
        <td class="sign-box" style="width: 25%;">
          <div style="color: #64748b; font-size: 9pt; margin-bottom: 25px;">PREPARED BY (TECH DESIGN)</div>
          <div style="font-weight: bold; border-top: 1px solid #94a3b8; padding-top: 4px;">${sheet.prepared_by || "Admin"}</div>
          <div style="font-size: 8pt; color: #64748b;">${sheet.prepared_date || "—"}</div>
        </td>
        <td class="sign-box" style="width: 25%;">
          <div style="color: #64748b; font-size: 9pt; margin-bottom: 25px;">CHECKED BY (MERCHANDISER)</div>
          <div style="font-weight: bold; border-top: 1px solid #94a3b8; padding-top: 4px;">${sheet.submitted_by || "Merchandiser"}</div>
          <div style="font-size: 8pt; color: #64748b;">${sheet.submitted_date || "—"}</div>
        </td>
        <td class="sign-box" style="width: 25%;">
          <div style="color: #64748b; font-size: 9pt; margin-bottom: 25px;">APPROVED BY (QA DIRECTOR)</div>
          <div style="font-weight: bold; border-top: 1px solid #94a3b8; padding-top: 4px;">${sheet.approved_by || "QA Technical Director"}</div>
          <div style="font-size: 8pt; color: #64748b;">${sheet.approved_date || "—"}</div>
        </td>
        <td class="sign-box" style="width: 25%;">
          <div style="color: #64748b; font-size: 9pt; margin-bottom: 25px;">FACTORY MANAGER SIGN-OFF</div>
          <div style="font-weight: bold; border-top: 1px solid #94a3b8; padding-top: 4px;">Production Head</div>
          <div style="font-size: 8pt; color: #64748b;">Bulk Production Standard</div>
        </td>
      </tr>
    </table>

  </body>
  </html>`;

  // Trigger download
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const fileName = `TechSheet_${sheet.tech_sheet_no}_${sheet.style_no}_Rev${sheet.revision || "01"}.xls`;

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// =========================================================================
// 2. EXPORT FULL TECH SHEET TO PDF (Clean isolated print window without clipping)
// =========================================================================
export function exportTechSheetToPdf(data) {
  if (!data || !data.sheet) {
    alert("No Tech Sheet data available to export.");
    return;
  }

  const {
    sheet,
    dimensions = [],
    materials = [],
    components = [],
    construction = {},
    colors = [],
    operations = [],
    quality = [],
    packaging = {}
  } = data;

  const totalSMV = operations.reduce((sum, o) => sum + (parseFloat(o.smv) || 0), 0);
  const constr = Array.isArray(construction) ? (construction[0] || {}) : (construction || {});
  const pack = Array.isArray(packaging) ? (packaging[0] || {}) : (packaging || {});

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Popup blocked! Please allow popups for this site to generate the PDF.");
    return;
  }

  const printHtml = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${sheet.tech_sheet_no} - ${sheet.style_no} Technical Specification Sheet</title>
    <style>
      @page {
        size: A4 portrait;
        margin: 10mm 12mm;
      }
      * {
        box-sizing: border-box;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        color: #111827;
        background: #ffffff;
        margin: 0;
        padding: 0;
        font-size: 9pt;
        line-height: 1.35;
      }
      .header-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #111827;
        padding-bottom: 8px;
        margin-bottom: 12px;
      }
      .company-title {
        font-size: 15pt;
        font-weight: 800;
        letter-spacing: -0.5px;
        margin: 0;
      }
      .doc-subtitle {
        font-size: 8pt;
        text-transform: uppercase;
        color: #4b5563;
        font-weight: 600;
        letter-spacing: 0.5px;
      }
      .sheet-number {
        font-size: 13pt;
        font-weight: bold;
        color: #1e3a8a;
        font-family: monospace;
      }
      .badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 8pt;
        font-weight: bold;
        text-transform: uppercase;
        border: 1px solid #111;
      }
      .badge-approved { background: #dcfce7; color: #166534; border-color: #166534; }
      .badge-draft { background: #f3f4f6; color: #374151; border-color: #6b7280; }
      .badge-pending { background: #fef9c3; color: #854d0e; border-color: #ca8a04; }

      .section-header {
        background-color: #1f2937 !important;
        color: #ffffff !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        font-size: 8.5pt;
        font-weight: 700;
        padding: 4px 6px;
        margin-top: 10px;
        margin-bottom: 4px;
        border-radius: 2px;
      }

      .meta-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        padding: 8px;
        border-radius: 4px;
        margin-bottom: 10px;
      }
      .meta-item {
        font-size: 8pt;
      }
      .meta-item span {
        color: #6b7280;
        display: block;
        font-size: 7.5pt;
      }
      .meta-item strong {
        color: #111827;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 8px;
        page-break-inside: auto;
      }
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      thead {
        display: table-header-group;
      }
      th {
        background-color: #f3f4f6 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        color: #111827;
        border: 1px solid #9ca3af;
        padding: 4px 5px;
        font-size: 7.5pt;
        font-weight: 700;
        text-align: left;
      }
      td {
        border: 1px solid #d1d5db;
        padding: 3px 5px;
        font-size: 8pt;
        vertical-align: middle;
      }
      .text-center { text-align: center; }
      .text-right { text-align: right; }
      .font-mono { font-family: monospace; }
      .font-bold { font-weight: bold; }
      .total-row {
        background-color: #fef08a !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        font-weight: bold;
      }

      .sign-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        border: 1px solid #9ca3af;
        background: #f9fafb;
        padding: 10px;
        margin-top: 12px;
        text-align: center;
        page-break-inside: avoid;
      }
      .sign-box-role {
        font-size: 7.5pt;
        color: #6b7280;
        margin-bottom: 24px;
        text-transform: uppercase;
      }
      .sign-box-name {
        font-weight: bold;
        font-size: 8pt;
        border-top: 1px solid #9ca3af;
        padding-top: 3px;
      }
      .sign-box-date {
        font-size: 7pt;
        color: #6b7280;
      }

      @media print {
        body { margin: 0; padding: 0; }
        .no-print { display: none !important; }
      }
    </style>
  </head>
  <body>

    <!-- ACTION BAR (VISIBLE BEFORE PRINT) -->
    <div class="no-print" style="background: #1e3a8a; color: white; padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-radius: 4px;">
      <div>
        <strong>${sheet.tech_sheet_no}</strong> - Ready for PDF Export / Printing
      </div>
      <div>
        <button onclick="window.print()" style="background: #16a34a; color: white; border: none; padding: 6px 14px; font-weight: bold; border-radius: 4px; cursor: pointer; margin-right: 8px;">
          🖨️ Print / Save as PDF
        </button>
        <button onclick="window.close()" style="background: #ef4444; color: white; border: none; padding: 6px 14px; font-weight: bold; border-radius: 4px; cursor: pointer;">
          ✕ Close
        </button>
      </div>
    </div>

    <!-- DOCUMENT HEADER -->
    <div class="header-wrap">
      <div>
        <h1 class="company-title">GLOBAL LEATHER & APPAREL ERP</h1>
        <div class="doc-subtitle">Factory Technical Specification Sheet (Tech Pack)</div>
      </div>
      <div style="text-align: right;">
        <div class="sheet-number">${sheet.tech_sheet_no}</div>
        <div style="font-size: 7.5pt; color: #4b5563;">
          Rev: <strong>${sheet.revision || "01"}</strong> | Version: <strong>${sheet.version || "1.0"}</strong>
        </div>
        <div style="margin-top: 3px;">
          <span class="badge ${sheet.status === "Approved" ? "badge-approved" : sheet.status === "Pending Approval" ? "badge-pending" : "badge-draft"}">
            ${sheet.status || "Draft"}
          </span>
        </div>
      </div>
    </div>

    <!-- STYLE OVERVIEW -->
    <div class="meta-grid">
      <div class="meta-item">
        <span>Style Number</span>
        <strong class="font-mono">${sheet.style_no}</strong>
      </div>
      <div class="meta-item">
        <span>Style Name</span>
        <strong>${sheet.style_name}</strong>
      </div>
      <div class="meta-item">
        <span>Customer / Buyer</span>
        <strong>${sheet.CustomerName || "—"} (${sheet.CustomerCode || "—"})</strong>
      </div>
      <div class="meta-item">
        <span>Effective Date</span>
        <strong>${sheet.effective_date || "—"}</strong>
      </div>
      <div class="meta-item">
        <span>Category / Bag Type</span>
        <strong>${sheet.product_category} • ${sheet.bag_type || sheet.product_type || "—"}</strong>
      </div>
      <div class="meta-item">
        <span>Season / Gender</span>
        <strong>${sheet.season || "Core"} • ${sheet.gender || "Unisex"}</strong>
      </div>
      <div class="meta-item">
        <span>Brand / Collection</span>
        <strong>${sheet.brand || "—"} / ${sheet.collection || "—"}</strong>
      </div>
      <div class="meta-item">
        <span>Sample Reference No</span>
        <strong class="font-mono">${sheet.sample_no || "—"}</strong>
      </div>
    </div>

    <!-- 1. DIMENSIONS -->
    <div class="section-header">1. FINISHED PRODUCT DIMENSIONS & MEASUREMENT TOLERANCES</div>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Measurement Point</th>
          <th style="width: 32%;">Specification Description</th>
          <th class="text-center" style="width: 10%;">Nominal Value</th>
          <th class="text-center" style="width: 8%;">Tol (-)</th>
          <th class="text-center" style="width: 8%;">Tol (+)</th>
          <th class="text-center" style="width: 7%;">Unit</th>
          <th style="width: 10%;">Method / Notes</th>
        </tr>
      </thead>
      <tbody>
        ${dimensions.length === 0 ? '<tr><td colspan="7" class="text-center">No dimensions defined</td></tr>' : dimensions.map(d => `
          <tr>
            <td class="font-bold">${d.dimension_type}</td>
            <td>${d.specification || "—"}</td>
            <td class="text-center font-bold">${d.value ?? ""}</td>
            <td class="text-center" style="color: #6b7280;">-${d.tolerance_minus ?? 0}</td>
            <td class="text-center" style="color: #6b7280;">+${d.tolerance_plus ?? 0}</td>
            <td class="text-center">${d.uom || "cm"}</td>
            <td>${d.remarks || "—"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <!-- 2. MATERIALS BOM -->
    <div class="section-header">2. BILL OF MATERIALS (BOM) - RAW MATERIALS (LINKED TO ITEM MASTER)</div>
    <table>
      <thead>
        <tr>
          <th class="text-center" style="width: 4%;">#</th>
          <th style="width: 11%;">Item Code</th>
          <th style="width: 25%;">Material Name & Description</th>
          <th style="width: 12%;">Placement / Type</th>
          <th style="width: 12%;">Color / Spec</th>
          <th style="width: 11%;">Thickness / Width</th>
          <th class="text-right" style="width: 8%;">Unit Cons.</th>
          <th class="text-center" style="width: 5%;">UOM</th>
          <th class="text-center" style="width: 5%;">Waste %</th>
          <th class="text-right" style="width: 7%;">Total Req.</th>
        </tr>
      </thead>
      <tbody>
        ${materials.length === 0 ? '<tr><td colspan="10" class="text-center">No materials defined</td></tr>' : materials.map((m, idx) => {
          const cons = parseFloat(m.consumption) || 0;
          const waste = parseFloat(m.wastage_percent) || 0;
          const tot = (cons * (1 + waste / 100)).toFixed(2);
          return `
          <tr>
            <td class="text-center">${idx + 1}</td>
            <td class="font-mono">${m.ItemCode || m.material_code || "—"}</td>
            <td class="font-bold">${m.material_name}</td>
            <td>${m.material_type || "—"}</td>
            <td>${m.color || "—"}</td>
            <td>${m.thickness || m.width || "—"}</td>
            <td class="text-right">${cons.toFixed(2)}</td>
            <td class="text-center">${m.uom || "MTR"}</td>
            <td class="text-center">${waste}%</td>
            <td class="text-right font-bold">${tot}</td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>

    <!-- 3. HARDWARE & COMPONENTS -->
    <div class="section-header">3. HARDWARE, FASTENERS & COMPONENTS (LINKED TO ITEM MASTER)</div>
    <table>
      <thead>
        <tr>
          <th class="text-center" style="width: 4%;">#</th>
          <th style="width: 12%;">Item Code</th>
          <th style="width: 25%;">Component Name</th>
          <th style="width: 13%;">Type</th>
          <th style="width: 14%;">Color / Plating Finish</th>
          <th style="width: 14%;">Size / Specification</th>
          <th class="text-center" style="width: 9%;">Qty / Unit</th>
          <th class="text-center" style="width: 9%;">UOM</th>
        </tr>
      </thead>
      <tbody>
        ${components.length === 0 ? '<tr><td colspan="8" class="text-center">No components defined</td></tr>' : components.map((c, idx) => `
          <tr>
            <td class="text-center">${idx + 1}</td>
            <td class="font-mono">${c.ItemCode || c.item_code || "—"}</td>
            <td class="font-bold">${c.component_name}</td>
            <td>${c.component_type || "—"}</td>
            <td>${c.color || "—"}</td>
            <td>${c.size || c.specification || "—"}</td>
            <td class="text-center font-bold">${c.qty ?? 1}</td>
            <td class="text-center">${c.uom || "PCS"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <!-- 4. ENGINEERING & STITCHING -->
    <div class="section-header">4. ENGINEERING SPECIFICATIONS & STITCHING CONSTRUCTION</div>
    <div style="border: 1px solid #d1d5db; padding: 6px; background: #f9fafb; margin-bottom: 8px; font-size: 8pt;">
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
        <div><span style="color: #6b7280;">Construction Method:</span> <strong>${constr.construction_method || "—"}</strong></div>
        <div><span style="color: #6b7280;">Stitch Type & Density:</span> <strong>${constr.stitch_type || "—"} (${constr.spi || "7-8 SPI"})</strong></div>
        <div><span style="color: #6b7280;">Thread Type & Size:</span> <strong>${constr.thread_type || "—"} (${constr.thread_size || "Tex 70"})</strong></div>
        <div><span style="color: #6b7280;">Seam Allowance:</span> <strong>${constr.seam_allowance || "8 mm"}</strong></div>
        <div><span style="color: #6b7280;">Edge Paint & Finish:</span> <strong>${constr.edge_treatment || "—"} (${constr.edge_paint || "—"})</strong></div>
        <div><span style="color: #6b7280;">Skiving Requirements:</span> <strong>${constr.skiving_requirement || "—"}</strong></div>
        <div style="grid-column: span 3;"><span style="color: #6b7280;">Reinforcement Placement:</span> <strong>${constr.reinforcement_requirement || "—"}</strong></div>
        <div style="grid-column: span 3;"><span style="color: #6b7280;">Special Construction Notes:</span> ${constr.special_notes || "Follow Golden Sample reference."}</div>
      </div>
    </div>

    <!-- 5. COLOR COMBINATIONS -->
    <div class="section-header">5. COLOR COMBINATIONS (COLORWAYS)</div>
    <table>
      <thead>
        <tr>
          <th>Colorway Name</th>
          <th>Pantone TCX</th>
          <th>Main Leather / Material</th>
          <th>Lining Color</th>
          <th>Thread Color</th>
          <th>Hardware Plating</th>
          <th>Edge Paint Shade</th>
        </tr>
      </thead>
      <tbody>
        ${colors.length === 0 ? '<tr><td colspan="7" class="text-center">No colors defined</td></tr>' : colors.map(col => `
          <tr>
            <td class="font-bold">${col.color_name}</td>
            <td>${col.pantone || "—"}</td>
            <td>${col.main_material_color || "—"}</td>
            <td>${col.lining_color || "—"}</td>
            <td>${col.thread_color || "—"}</td>
            <td>${col.hardware_color || "—"}</td>
            <td>${col.edge_paint_color || "—"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <!-- 6. OPERATIONS ROUTING & SMV -->
    <div class="section-header">6. MANUFACTURING OPERATIONS ROUTING & SMV BREAKDOWN</div>
    <table>
      <thead>
        <tr>
          <th class="text-center" style="width: 4%;">Seq</th>
          <th style="width: 10%;">Op Code</th>
          <th style="width: 28%;">Operation Name</th>
          <th style="width: 18%;">Work Center / Dept</th>
          <th style="width: 18%;">Machine Required</th>
          <th class="text-right" style="width: 11%;">SMV (Mins)</th>
          <th class="text-center" style="width: 11%;">Skill Level</th>
        </tr>
      </thead>
      <tbody>
        ${operations.length === 0 ? '<tr><td colspan="7" class="text-center">No operations defined</td></tr>' : operations.map((op, idx) => `
          <tr>
            <td class="text-center">${op.sequence || idx + 1}</td>
            <td class="font-mono">${op.operation_code || "—"}</td>
            <td class="font-bold">${op.operation_name}</td>
            <td>${op.work_center || "—"}</td>
            <td>${op.machine || "—"}</td>
            <td class="text-right font-bold">${parseFloat(op.smv || 0).toFixed(2)}</td>
            <td class="text-center">${op.skill_level || "—"}</td>
          </tr>
        `).join("")}
        ${operations.length > 0 ? `
          <tr class="total-row">
            <td colspan="5" class="text-right font-bold">TOTAL STANDARD MINUTES (SMV):</td>
            <td class="text-right font-bold">${totalSMV.toFixed(2)} mins</td>
            <td class="text-center" style="font-size: 7pt; color: #4b5563;">Per Unit</td>
          </tr>
        ` : ''}
      </tbody>
    </table>

    <!-- 7. QUALITY STANDARDS -->
    <div class="section-header">7. QUALITY ACCEPTANCE CRITERIA & AQL STANDARDS</div>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Inspection Point</th>
          <th style="width: 30%;">Specification Description</th>
          <th style="width: 15%;">Standard</th>
          <th style="width: 10%;">Tolerance</th>
          <th style="width: 12%;">Inspection Method</th>
          <th class="text-center" style="width: 8%;">Critical</th>
        </tr>
      </thead>
      <tbody>
        ${quality.length === 0 ? '<tr><td colspan="6" class="text-center">No quality standards defined</td></tr>' : quality.map(q => `
          <tr>
            <td class="font-bold">${q.inspection_point}</td>
            <td>${q.specification || "—"}</td>
            <td>${q.standard || "AQL 1.5"}</td>
            <td>${q.tolerance || "—"}</td>
            <td>${q.inspection_method || "Visual"}</td>
            <td class="text-center ${q.critical === "Yes" ? "font-bold" : ""}" style="color: ${q.critical === "Yes" ? "#dc2626" : "inherit"};">${q.critical || "No"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <!-- 8. PACKAGING -->
    <div class="section-header">8. PACKAGING, CARTONING & STUFFING SPECIFICATIONS</div>
    <div style="border: 1px solid #d1d5db; padding: 6px; background: #f9fafb; font-size: 8pt; margin-bottom: 8px;">
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
        <div><span style="color: #6b7280;">Polybag:</span> <strong>${pack.polybag_size || "—"} (${pack.polybag_type || "LDPE"})</strong></div>
        <div><span style="color: #6b7280;">Dust Bag:</span> <strong>${pack.dust_bag || "—"}</strong></div>
        <div><span style="color: #6b7280;">Master Carton:</span> <strong>${pack.carton || "—"} (${pack.carton_qty || 1} pcs)</strong></div>
        <div><span style="color: #6b7280;">Hangtag & Attachment:</span> <strong>${pack.hangtag || "—"}</strong></div>
        <div style="grid-column: span 2;"><span style="color: #6b7280;">Barcode & Labeling:</span> <strong>${pack.barcode || "—"} • ${pack.sticker || "—"}</strong></div>
        <div style="grid-column: span 3;"><span style="color: #6b7280;">Stuffing & Shape Notes:</span> ${pack.packing_instruction || "Maintain shape."}</div>
      </div>
    </div>

    <!-- 9. SIGN-OFF BOX -->
    <div class="sign-grid">
      <div>
        <div class="sign-box-role">PREPARED BY (TECH DESIGN)</div>
        <div class="sign-box-name">${sheet.prepared_by || "Admin"}</div>
        <div class="sign-box-date">${sheet.prepared_date || "—"}</div>
      </div>
      <div>
        <div class="sign-box-role">CHECKED BY (MERCHANDISER)</div>
        <div class="sign-box-name">${sheet.submitted_by || "Merchandiser"}</div>
        <div class="sign-box-date">${sheet.submitted_date || "—"}</div>
      </div>
      <div>
        <div class="sign-box-role">APPROVED BY (QA DIRECTOR)</div>
        <div class="sign-box-name">${sheet.approved_by || "QA Technical Director"}</div>
        <div class="sign-box-date">${sheet.approved_date || "—"}</div>
      </div>
      <div>
        <div class="sign-box-role">FACTORY MANAGER SIGN-OFF</div>
        <div class="sign-box-name">Production Head</div>
        <div class="sign-box-date">Approved Production Standard</div>
      </div>
    </div>

  </body>
  </html>`;

  printWindow.document.open();
  printWindow.document.write(printHtml);
  printWindow.document.close();

  // Give resources time to load then trigger print
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 400);
}
