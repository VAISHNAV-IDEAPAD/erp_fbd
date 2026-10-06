const db = require("../config/database");

db.serialize(() => {
    // ======================================================
    // INTERNAL ORDERS (MASTER / HEADER)
    // ======================================================
    db.run(`
    CREATE TABLE IF NOT EXISTS InternalOrders (
        IOID INTEGER PRIMARY KEY AUTOINCREMENT,
        IONo TEXT UNIQUE NOT NULL,
        VersionNo INTEGER DEFAULT 0,
        IODate TEXT NOT NULL,
        Customer TEXT NOT NULL,
        CustomerID INTEGER,
        CustomerOrderNo TEXT,
        CustomerPlanNo TEXT,
        Season TEXT DEFAULT 'MFO-M2-2027',
        SoNo TEXT,
        TotalQty REAL DEFAULT 0,
        NoOfRows INTEGER DEFAULT 1,
        MaterialSource TEXT DEFAULT 'Import',
        InternalMemo TEXT,
        OrderMessage TEXT,
        Status TEXT DEFAULT 'Open',
        ClosedDate TEXT,
        ClosedBy TEXT,
        EnteredBy TEXT DEFAULT 'Admin',
        DeliveryDate TEXT,
        DeliveryLocation TEXT DEFAULT 'Plot No. 9B Warehouse',
        Currency TEXT DEFAULT 'USD',
        PaymentTerms TEXT DEFAULT '60 Days LC',
        ShipmentMode TEXT DEFAULT 'Sea',
        PriceTerm TEXT DEFAULT 'FOB',
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    `, function (err) {
        if (err) {
            console.error("❌ InternalOrders table error:", err.message);
        } else {
            console.log("✓ InternalOrders table ready");
        }
    });

    // ======================================================
    // INTERNAL ORDER DETAILS (LINE ITEMS / STYLES)
    // ======================================================
    db.run(`
    CREATE TABLE IF NOT EXISTS InternalOrderDetails (
        DetailID INTEGER PRIMARY KEY AUTOINCREMENT,
        IOID INTEGER NOT NULL,
        IONo TEXT NOT NULL,
        StyleNo TEXT NOT NULL,
        Description TEXT,
        Colour TEXT,
        SizeBreakdown TEXT,
        Qty REAL DEFAULT 0,
        Rate REAL DEFAULT 0,
        Amount REAL DEFAULT 0,
        ExFactoryDate TEXT,
        Remarks TEXT,
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (IOID) REFERENCES InternalOrders(IOID) ON DELETE CASCADE
    );
    `, function (err) {
        if (err) {
            console.error("❌ InternalOrderDetails table error:", err.message);
        } else {
            console.log("✓ InternalOrderDetails table ready");
            seedInternalOrders();
        }
    });
});

// Seed orders 168 to 212
function seedInternalOrders() {
    db.get("SELECT COUNT(*) AS count FROM InternalOrders", [], (err, row) => {
        if (err) return console.error("Error checking InternalOrders count:", err.message);
        if (row && row.count >= 45) {
            console.log("✓ InternalOrders already seeded (" + row.count + " records)");
            return;
        }

        console.log("🌱 Seeding InternalOrders 168 to 212...");

        const customers = [
            "TORY BURCH LLC",
            "TORY BURCH LLC",
            "TORY BURCH LLC",
            "ZARA GLOBAL SOURCING",
            "H&M RETAIL GROUP",
            "RALPH LAUREN CORP",
            "MICHAEL KORS",
            "PVH CORP",
            "COACH NEW YORK"
        ];

        const seasons = ["MFO-M2-2027", "AW-2026", "SS-2027", "FALL-2026", "SPRING-2027"];
        const styles = [
            { code: "TB-DRS-901", desc: "Silk Georgette Printed Maxi Dress", col: "Ivory Floral", rate: 48.50 },
            { code: "TB-BLS-842", desc: "Crepe de Chine Ruffled Blouse", col: "French Navy", rate: 36.00 },
            { code: "TB-SKT-715", desc: "Pleated Midi Linen Blend Skirt", col: "Sand Beige", rate: 32.50 },
            { code: "ZR-JKT-554", desc: "Oversized Tailored Blazer", col: "Charcoal Melange", rate: 54.00 },
            { code: "HM-TR-320",  desc: "High Waist Tapered Chino", col: "Olive Green", rate: 24.00 },
            { code: "RL-POLO-10", desc: "Pima Cotton Slim Fit Polo", col: "Heritage White", rate: 29.50 },
            { code: "MK-TOP-404", desc: "Metallic Knit Sleeveless Top", col: "Champagne Gold", rate: 38.00 }
        ];

        // Specific quantities matching the screenshot for 212 down to 208
        const knownOrders = {
            212: { qty: 1097.0, po: "5500074188,99,200,201", so: "SO/9B/2627/148", cust: "TORY BURCH LLC", season: "MFO-M2-2027", rows: 1 },
            211: { qty: 1067.0, po: "5500074187,96,97,98",   so: "SO/9B/2627/147", cust: "TORY BURCH LLC", season: "MFO-M2-2027", rows: 1 },
            210: { qty: 310.0,  po: "5500073543",            so: "SO/9B/2627/146", cust: "TORY BURCH LLC", season: "MFO-M2-2027", rows: 1 },
            209: { qty: 847.0,  po: "5500073522,31",         so: "SO/9B/2627/145", cust: "TORY BURCH LLC", season: "MFO-M2-2027", rows: 1 },
            208: { qty: 1170.0, po: "5500073520,25,26,27",   so: "SO/9B/2627/144", cust: "TORY BURCH LLC", season: "MFO-M2-2027", rows: 1 },
        };

        db.serialize(() => {
            for (let num = 212; num >= 168; num--) {
                const ioNo = "IO/9B/2627/" + num;
                const known = knownOrders[num];
                const cust = known ? known.cust : customers[(212 - num) % customers.length];
                const qty = known ? known.qty : Math.round((250 + ((num * 47) % 1350)) * 10) / 10;
                const soNum = known ? known.so : "SO/9B/2627/" + (148 - (212 - num));
                const custPo = known ? known.po : "55000" + (73500 - (212 - num) * 15) + "," + ((num % 90) + 10);
                const season = known ? known.season : seasons[(212 - num) % seasons.length];
                const rows = known ? known.rows : (((num % 3) === 0) ? 2 : 1);
                const isClosed = (num < 178 && num % 2 === 0);
                const status = isClosed ? "Closed" : "Open";
                const closedDate = isClosed ? "20-09-2026" : null;
                const closedBy = isClosed ? "Manager J. Rao" : null;
                const ioDate = num >= 208 ? "28-09-2026" : (num >= 195 ? "25-09-2026" : (num >= 180 ? "20-09-2026" : "15-09-2026"));
                const deliveryDate = "15-11-2026";
                const materialSource = num % 7 === 0 ? "Domestic" : "Import";

                const insertHeaderSql = `
                    INSERT OR IGNORE INTO InternalOrders (
                        IONo, VersionNo, IODate, Customer, CustomerID, CustomerOrderNo, CustomerPlanNo,
                        Season, SoNo, TotalQty, NoOfRows, MaterialSource, InternalMemo, OrderMessage,
                        Status, ClosedDate, ClosedBy, EnteredBy, DeliveryDate, DeliveryLocation,
                        Currency, PaymentTerms, ShipmentMode, PriceTerm
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                db.run(insertHeaderSql, [
                    ioNo, 0, ioDate, cust, (num % 8) + 1, custPo, "CP-2026-" + num,
                    season, soNum, qty, rows, materialSource, "Priority production allotment for " + season,
                    "Shipment inspection required prior to packaging", status, closedDate, closedBy,
                    "S. Sharma", deliveryDate, "Plot No. 9B Warehouse", "USD", "60 Days LC", "Sea", "FOB"
                ], function (err) {
                    if (err) {
                        console.error("Error inserting " + ioNo + ":", err.message);
                    } else if (this.lastID) {
                        const style = styles[(212 - num) % styles.length];
                        const rate = style.rate;
                        const insertDetailSql = `
                            INSERT INTO InternalOrderDetails (
                                IOID, IONo, StyleNo, Description, Colour, SizeBreakdown, Qty, Rate, Amount, ExFactoryDate, Remarks
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `;
                        db.run(insertDetailSql, [
                            this.lastID, ioNo, style.code, style.desc, style.col,
                            "XS:100, S:250, M:350, L:250, XL:147", qty, rate,
                            Math.round(qty * rate * 100) / 100, "10-11-2026", "Strict export quality tolerance"
                        ]);
                    }
                });
            }
        });
    });
}

module.exports = db;
