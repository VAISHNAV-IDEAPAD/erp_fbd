require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const sqlite3 = require("sqlite3").verbose();
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const dbPath = path.resolve(__dirname, "../erp.db");
const sqliteDb = new sqlite3.Database(dbPath);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    keepAlive: true
});
pool.on("error", (err) => {
    console.warn("Pool background error (auto-recovering):", err.message);
});

function sqliteAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        sqliteDb.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function mapSqliteTypeToPg(sqliteType, isPk) {
    if (isPk) return "SERIAL PRIMARY KEY";
    const t = (sqliteType || "TEXT").toUpperCase();
    if (t.includes("INT")) return "INTEGER";
    if (t.includes("REAL") || t.includes("FLOA") || t.includes("DOUB") || t.includes("NUM") || t.includes("DEC")) {
        return "DOUBLE PRECISION";
    }
    return "TEXT";
}

function mapDefaultValue(dflt, pgType) {
    if (dflt === null || dflt === undefined) return "";
    const s = String(dflt).trim();
    if (!s) return "";
    if (/^CURRENT_TIMESTAMP$/i.test(s)) {
        return " DEFAULT CURRENT_TIMESTAMP::TEXT";
    }
    if (pgType === "INTEGER" || pgType === "DOUBLE PRECISION") {
        const unquoted = s.replace(/^['"]|['"]$/g, "");
        if (!isNaN(Number(unquoted))) {
            return ` DEFAULT ${Number(unquoted)}`;
        }
        return "";
    }
    return ` DEFAULT ${s}`;
}

async function run() {
    console.log("Connecting to Neon Postgres...");

    try {
        // 1. Create SQLite compatibility helper functions in Postgres
        await pool.query(`
            CREATE OR REPLACE FUNCTION round(double precision, integer)
            RETURNS double precision AS $$
                SELECT ROUND($1::numeric, $2)::double precision;
            $$ LANGUAGE SQL IMMUTABLE;
        `);

        await pool.query(`
            CREATE OR REPLACE FUNCTION julianday(t text)
            RETURNS double precision AS $$
            DECLARE
                ts timestamp with time zone;
            BEGIN
                IF t IS NULL OR TRIM(t) = '' THEN
                    RETURN NULL;
                END IF;
                IF LOWER(TRIM(t)) = 'now' THEN
                    RETURN (EXTRACT(EPOCH FROM NOW()) / 86400.0) + 2440587.5;
                END IF;
                ts := t::timestamp with time zone;
                RETURN (EXTRACT(EPOCH FROM ts) / 86400.0) + 2440587.5;
            EXCEPTION WHEN OTHERS THEN
                RETURN (EXTRACT(EPOCH FROM NOW()) / 86400.0) + 2440587.5;
            END;
            $$ LANGUAGE plpgsql STABLE;
        `);
        console.log("✓ Created Postgres helper functions (round, julianday)");

        // 2. Load all tables and indexes from SQLite
        const tables = await sqliteAll(
            "SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
        );
        const indexes = await sqliteAll(
            "SELECT name, tbl_name, sql FROM sqlite_master WHERE type='index' AND sql IS NOT NULL ORDER BY name"
        );

        const globalColMap = {};
        const tableColMap = {};
        const pkMap = {};
        const colTypesByLowName = {};

        console.log(`Found ${tables.length} tables in SQLite. Creating schema and migrating data...`);

        // First batch-create all tables in one multi-statement query for speed
        const createStatements = [];
        const tableMetaList = [];

        for (const t of tables) {
            const tableName = t.name;
            const lowTable = tableName.toLowerCase();
            const cols = await sqliteAll(`PRAGMA table_info("${tableName}")`);
            tableColMap[lowTable] = {};

            const singleUniqueCols = new Set();
            const tableUniqueClauses = [];
            if (t.sql) {
                for (const c of cols) {
                    const re = new RegExp(`\\b${c.name}\\b[^,\\n)]*\\bUNIQUE\\b`, "i");
                    if (re.test(t.sql)) {
                        singleUniqueCols.add(c.name.toLowerCase());
                    }
                }
                const multiMatches = t.sql.matchAll(/UNIQUE\s*\(([^)]+)\)/gi);
                for (const m of multiMatches) {
                    tableUniqueClauses.push(`UNIQUE (${m[1]})`);
                }
            }

            const colDefs = [];
            let pkCol = null;

            for (const c of cols) {
                const lowCol = c.name.toLowerCase();
                tableColMap[lowTable][lowCol] = c.name;
                if (!globalColMap[lowCol] || /^[A-Z]/.test(c.name)) {
                    globalColMap[lowCol] = c.name;
                }

                const isPk = c.pk === 1;
                if (isPk) {
                    pkCol = c.name;
                    pkMap[lowTable] = c.name;
                }

                const pgType = mapSqliteTypeToPg(c.type, isPk);
                if (!colTypesByLowName[lowCol]) colTypesByLowName[lowCol] = new Set();
                colTypesByLowName[lowCol].add(isPk ? "INTEGER" : pgType);

                if (isPk) {
                    colDefs.push(`${c.name} SERIAL PRIMARY KEY`);
                } else {
                    const uniqueStr = singleUniqueCols.has(lowCol) ? " UNIQUE" : "";
                    const defaultStr = mapDefaultValue(c.dflt_value, pgType);
                    colDefs.push(`${c.name} ${pgType}${uniqueStr}${defaultStr}`);
                }
            }

            for (const uq of tableUniqueClauses) {
                colDefs.push(uq);
            }

            createStatements.push(`CREATE TABLE IF NOT EXISTS ${tableName} (\n  ${colDefs.join(",\n  ")}\n);`);
            tableMetaList.push({ tableName, lowTable, cols, pkCol });
        }

        await pool.query(createStatements.join("\n"));
        console.log(`✓ Created/verified all ${tables.length} tables`);

        // Migrate rows for non-empty tables
        for (const { tableName, lowTable, cols, pkCol } of tableMetaList) {
            const rows = await sqliteAll(`SELECT * FROM "${tableName}"`);
            if (rows.length > 0) {
                const existingRes = await pool.query(`SELECT COUNT(*)::int AS cnt FROM ${tableName}`);
                if (existingRes.rows[0].cnt < rows.length) {
                    const colNames = cols.map(c => c.name);
                    const batchSize = 200;
                    for (let i = 0; i < rows.length; i += batchSize) {
                        const chunk = rows.slice(i, i + batchSize);
                        const values = [];
                        const valueGroups = [];
                        let paramIdx = 1;
                        for (const row of chunk) {
                            const group = [];
                            for (const col of cols) {
                                let val = row[col.name];
                                const pgType = mapSqliteTypeToPg(col.type, col.pk === 1);
                                if (val === "" && (pgType === "INTEGER" || pgType === "DOUBLE PRECISION" || pgType === "SERIAL PRIMARY KEY")) {
                                    val = null;
                                }
                                values.push(val);
                                group.push(`$${paramIdx++}`);
                            }
                            valueGroups.push(`(${group.join(", ")})`);
                        }
                        const insSql = `INSERT INTO ${tableName} (${colNames.join(", ")}) VALUES ${valueGroups.join(", ")} ON CONFLICT DO NOTHING`;
                        await pool.query(insSql, values);
                    }
                }

                // Sync SERIAL sequence
                if (pkCol) {
                    await pool.query(`
                        SELECT setval(
                            pg_get_serial_sequence('${lowTable}', '${pkCol.toLowerCase()}'),
                            COALESCE((SELECT MAX(${pkCol}) FROM ${tableName}), 1),
                            (SELECT MAX(${pkCol}) IS NOT NULL FROM ${tableName})
                        )
                    `);
                }
                console.log(`  ✓ ${tableName}: ${rows.length} rows synced`);
            }
        }

        // 3. Create indexes in a single batch
        const indexStatements = indexes.map(idx =>
            idx.sql.replace(/CREATE\s+INDEX\s+(?!IF\s+NOT\s+EXISTS)/i, "CREATE INDEX IF NOT EXISTS ") + ";"
        );
        if (indexStatements.length > 0) {
            await pool.query(indexStatements.join("\n"));
        }
        console.log(`✓ Synced ${indexes.length} indexes`);

        // 4. Scan all backend files for AS aliases to include in globalColMap
        function walk(dir) {
            let res = [];
            for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
                if (f.name === "node_modules" || f.name === ".git") continue;
                const p = path.join(dir, f.name);
                if (f.isDirectory()) res.push(...walk(p));
                else if (f.name.endsWith(".js")) res.push(p);
            }
            return res;
        }
        for (const f of walk(path.resolve(__dirname, ".."))) {
            const content = fs.readFileSync(f, "utf8");
            const asMatches = content.matchAll(/\bAS\s+["`']?([A-Za-z_][A-Za-z0-9_]*)["`']?/gi);
            for (const m of asMatches) {
                const alias = m[1];
                if (/^(INTEGER|REAL|TEXT|NUMERIC|VARCHAR|DECIMAL|FLOAT|INT|DATE|TIMESTAMP|DATETIME)$/i.test(alias)) continue;
                const low = alias.toLowerCase();
                if (!globalColMap[low]) {
                    globalColMap[low] = alias;
                }
            }
        }

        const numericCols = [];
        for (const [lowCol, typeSet] of Object.entries(colTypesByLowName)) {
            if (!typeSet.has("TEXT")) {
                numericCols.push(lowCol);
            }
        }

        // Write pgSchemaMeta.js
        const metaPath = path.resolve(__dirname, "../config/pgSchemaMeta.js");
        const metaContent = `// Auto-generated PostgreSQL schema metadata for case restoration and type safety\nmodule.exports = ${JSON.stringify(
            {
                globalColMap,
                tableColMap,
                pkMap,
                numericCols
            },
            null,
            2
        )};\n`;
        fs.writeFileSync(metaPath, metaContent, "utf8");
        console.log("✓ Generated backend/config/pgSchemaMeta.js");
        console.log("🎉 Neon PostgreSQL migration completed successfully!");
    } finally {
        await pool.end();
        sqliteDb.close();
    }
}

run().catch(err => {
    console.error("Migration error:", err);
    process.exit(1);
});
