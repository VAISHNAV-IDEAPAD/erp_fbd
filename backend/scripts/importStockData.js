const fs = require('fs');
const path = require('path');
const readline = require('readline');
const db = require('../config/database');

const csvPath = 'C:/Users/Tilak/.gemini/antigravity/brain/dfce476b-ef4e-4006-8cb0-a6ddbed3176d/.user_uploaded/media_1791564939291_7e918223.csv';

function parseCSVLine(text) {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === '"') {
            inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
            result.push(cur.trim());
            cur = '';
        } else {
            cur += ch;
        }
    }
    result.push(cur.trim());
    return result;
}

function cleanNumber(val) {
    if (!val || val === '.' || val === 'N/A' || val === '-') return 0;
    const cleaned = String(val).replace(/,/g, '').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
}

function getCategoryPrefix(cat) {
    const c = (cat || '').toUpperCase();
    if (c.includes('FABRIC') || c.includes('CANVAS') || c.includes('SATIN') || c.includes('TWILL') || c.includes('LINEN')) return 'FAB';
    if (c.includes('LEATHER')) return 'LTH';
    if (c.includes('HARDWARE') || c.includes('BUCKLE') || c.includes('RING') || c.includes('STUD') || c.includes('RIVET') || c.includes('HOOK')) return 'HDW';
    if (c.includes('THREAD')) return 'THD';
    if (c.includes('ZIPPER')) return 'ZIP';
    if (c.includes('PACKING') || c.includes('BOX') || c.includes('CORRUGATED') || c.includes('POLY BAG')) return 'PKG';
    if (c.includes('LABEL') || c.includes('HANGTAG') || c.includes('TAG')) return 'LBL';
    if (c.includes('REINFORCE') || c.includes('NONWOVEN') || c.includes('SINTEX') || c.includes('TAPE') || c.includes('FOAM') || c.includes('FELT')) return 'RNF';
    if (c.includes('WEBBING')) return 'WEB';
    if (c.includes('CHEMICAL') || c.includes('ADHESIVE')) return 'CHM';
    if (c.includes('CONSUMABLE')) return 'CON';
    if (c.includes('DIE')) return 'DIE';
    if (c.includes('COMPUTER')) return 'IT';
    if (c.includes('ELECTRICAL')) return 'ELC';
    return 'ITM';
}

async function runImport() {
    console.log(`Starting stock data import from: ${csvPath}`);
    if (!fs.existsSync(csvPath)) {
        console.error("CSV file does not exist at:", csvPath);
        process.exit(1);
    }

    const fileStream = fs.createReadStream(csvPath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let isHeaderFound = false;
    const rawItems = [];
    const colorsMap = new Map(); // normalized -> original name

    for await (const line of rl) {
        if (!line.trim()) continue;

        if (!isHeaderFound) {
            if (line.includes('Store Name,Location,Item Category')) {
                isHeaderFound = true;
            }
            continue;
        }

        const cols = parseCSVLine(line);
        if (cols.length < 8) continue;

        const storeName = cols[0];
        const location = cols[1];
        const itemCategory = cols[2];
        const group = cols[3];
        const name = cols[4];
        let variant = cols[5];
        const uom = cols[6] || 'PCS';
        const sizeRange = cols[7];

        if (!name || name === 'Name') continue;

        // Clean variant / color
        if (variant === 'N/A' || variant === '.' || variant === '-' || !variant) {
            variant = '';
        } else {
            variant = variant.trim();
            const normColor = variant.toLowerCase();
            if (!colorsMap.has(normColor)) {
                colorsMap.set(normColor, variant);
            }
        }

        const openQty = cleanNumber(cols[8]);
        const openVal = cleanNumber(cols[9]);
        const purchaseQty = cleanNumber(cols[10]);
        const purchaseVal = cleanNumber(cols[11]);
        const inQty = cleanNumber(cols[18]);
        const inVal = cleanNumber(cols[19]);
        const closeQty = cleanNumber(cols[22]);
        const closeVal = cleanNumber(cols[23]);

        // Calculate unit rate
        let rate = 0;
        if (closeQty > 0 && closeVal > 0) {
            rate = Math.round((closeVal / closeQty) * 100) / 100;
        } else if (purchaseQty > 0 && purchaseVal > 0) {
            rate = Math.round((purchaseVal / purchaseQty) * 100) / 100;
        } else if (inQty > 0 && inVal > 0) {
            rate = Math.round((inVal / inQty) * 100) / 100;
        } else if (openQty > 0 && openVal > 0) {
            rate = Math.round((openVal / openQty) * 100) / 100;
        }

        rawItems.push({
            name,
            category: itemCategory,
            group,
            variant,
            uom,
            size: (sizeRange && sizeRange !== 'N/A') ? sizeRange : '',
            rate,
            openQty,
            closeQty
        });
    }

    console.log(`Parsed ${rawItems.length} line items from CSV.`);
    console.log(`Discovered ${colorsMap.size} distinct colours/variants.`);

    // =========================================================================
    // STEP 1: IMPORT COLOURS
    // =========================================================================
    const existingColors = await new Promise((resolve) => {
        db.all("SELECT ColourName FROM Colours", (err, rows) => {
            resolve(new Set((rows || []).map(r => r.ColourName.toLowerCase())));
        });
    });

    let maxColorId = await new Promise((resolve) => {
        db.get("SELECT MAX(ColourID) as maxId FROM Colours", (err, row) => {
            resolve(row ? (row.maxId || 0) : 0);
        });
    });

    let newColorsCount = 0;
    await new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("BEGIN TRANSACTION");
            const stmt = db.prepare("INSERT OR IGNORE INTO Colours (ColourCode, ColourName, Description, Status) VALUES (?, ?, ?, 'Active')");

            for (const [normColor, originalColor] of colorsMap.entries()) {
                if (!existingColors.has(normColor)) {
                    maxColorId++;
                    const code = `COL-${String(maxColorId).padStart(4, '0')}`;
                    stmt.run([code, originalColor, `Alpine Store Master: ${originalColor}`]);
                    existingColors.add(normColor);
                    newColorsCount++;
                }
            }

            stmt.finalize();
            db.run("COMMIT", (commitErr) => {
                if (commitErr) reject(commitErr);
                else resolve();
            });
        });
    });

    console.log(`✓ Inserted ${newColorsCount} new unique colours into Colours master.`);

    // =========================================================================
    // STEP 2: IMPORT ITEMS
    // =========================================================================
    const existingItemKeys = await new Promise((resolve) => {
        db.all("SELECT ItemName, Color, Size FROM Items", (err, rows) => {
            resolve(new Set((rows || []).map(r => `${(r.ItemName || '').toLowerCase()}|${(r.Color || '').toLowerCase()}|${(r.Size || '').toLowerCase()}`)));
        });
    });

    const categoryCounters = new Map();
    // Initialize counters
    const itemRows = await new Promise((resolve) => {
        db.all("SELECT ItemCode FROM Items", (err, rows) => resolve(rows || []));
    });
    for (const row of itemRows) {
        if (row.ItemCode && row.ItemCode.includes('-')) {
            const [p, n] = row.ItemCode.split('-');
            const num = parseInt(n, 10);
            if (!isNaN(num)) {
                categoryCounters.set(p, Math.max(categoryCounters.get(p) || 1000, num));
            }
        }
    }

    let newItemsCount = 0;
    let skippedDuplicates = 0;

    await new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("BEGIN TRANSACTION");
            const stmt = db.prepare(`
                INSERT INTO Items (
                    ItemCode, ItemName, ItemType, Category, SubCategory,
                    MaterialType, UOM, Color, Size, Rate,
                    OpeningStock, CurrentStock, MinStock, MaxStock, ReorderLevel, Status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 10, 1000, 20, 'Active')
            `);

            for (const item of rawItems) {
                const itemKey = `${item.name.toLowerCase()}|${item.variant.toLowerCase()}|${item.size.toLowerCase()}`;
                if (existingItemKeys.has(itemKey)) {
                    skippedDuplicates++;
                    continue;
                }

                const prefix = getCategoryPrefix(item.category);
                const nextSeq = (categoryCounters.get(prefix) || 1000) + 1;
                categoryCounters.set(prefix, nextSeq);
                const itemCode = `${prefix}-${nextSeq}`;

                stmt.run([
                    itemCode,
                    item.name,
                    item.category || 'Raw Material',
                    item.category,
                    item.group,
                    'Raw Material',
                    item.uom,
                    item.variant,
                    item.size,
                    item.rate,
                    item.openQty,
                    item.closeQty
                ]);

                existingItemKeys.add(itemKey);
                newItemsCount++;
            }

            stmt.finalize();
            db.run("COMMIT", (commitErr) => {
                if (commitErr) reject(commitErr);
                else resolve();
            });
        });
    });

    console.log(`✓ Inserted ${newItemsCount} new items into Items master.`);
    console.log(`Skipped ${skippedDuplicates} duplicate item records.`);

    // Quick summary
    db.get("SELECT COUNT(*) as totalItems FROM Items", (err, iRow) => {
        db.get("SELECT COUNT(*) as totalColors FROM Colours", (err2, cRow) => {
            console.log("==================================================");
            console.log(`Total Items in Item Master now: ${iRow ? iRow.totalItems : 'N/A'}`);
            console.log(`Total Colours in Colour Master now: ${cRow ? cRow.totalColors : 'N/A'}`);
            console.log("==================================================");
            process.exit(0);
        });
    });
}

runImport().catch(err => {
    console.error("Fatal error during stock data import:", err);
    process.exit(1);
});
