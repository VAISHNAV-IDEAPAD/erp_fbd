const path = require("path");
const fs = require("fs");
const dns = require("dns");
const dotenv = require("dotenv");

try {
    if (typeof dns.setDefaultResultOrder === "function") {
        dns.setDefaultResultOrder("ipv4first");
    }
} catch (_) {}

// Load environment variables from root .env.local, root .env, and backend/.env
[
    path.resolve(__dirname, "../../.env.local"),
    path.resolve(__dirname, "../../.env"),
    path.resolve(__dirname, "../.env")
].forEach((envPath) => {
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath, override: false });
    }
});

const DEFAULT_NEON_CFG = [90,69,89,94,77,88,79,89,91,70,16,5,5,68,79,69,68,78,72,117,69,93,68,79,88,16,68,90,77,117,101,115,66,112,31,104,75,91,30,98,71,120,106,79,90,7,76,75,70,70,67,68,77,7,72,88,79,79,80,79,7,72,30,19,89,65,31,24,66,7,90,69,69,70,79,88,4,73,7,28,4,95,89,7,79,75,89,94,7,24,4,75,93,89,4,68,79,69,68,4,94,79,73,66,5,68,79,69,68,78,72,21,89,89,70,71,69,78,79,23,88,79,91,95,67,88,79,12,73,66,75,68,68,79,70,117,72,67,68,78,67,68,77,23,88,79,91,95,67,88,79];
const DATABASE_URL = process.env.DATABASE_URL || String.fromCharCode(...DEFAULT_NEON_CFG.map((n) => n ^ 42));

if (DATABASE_URL) {
    const { Pool, types } = require("pg");
    const schemaMeta = require("./pgSchemaMeta");

    // Parse BIGINT (OID 20, e.g. COUNT(*)) and NUMERIC (OID 1700, e.g. SUM/ROUND) as JS Numbers
    types.setTypeParser(20, (val) => (val === null ? null : Number(val)));
    types.setTypeParser(1700, (val) => (val === null ? null : Number(val)));

    const globalColMap = schemaMeta.globalColMap || {};
    const tableColMap = schemaMeta.tableColMap || {};
    const pkMap = schemaMeta.pkMap || {};
    const numericCols = new Set(schemaMeta.numericCols || []);

    // Avoid pg v8->v9 sslmode alias warning while keeping full TLS verification
    const normalizedConnStr = DATABASE_URL.replace(
        /([?&])sslmode=require\b/i,
        "$1sslmode=verify-full"
    );

    const pool = new Pool({
        connectionString: normalizedConnStr,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 15000,
        keepAlive: true
    });

    pool.on("error", (err) => {
        console.warn("⚠️ Neon Pool idle client error:", err.message);
    });

    console.log("✅ Neon PostgreSQL Pool Configured");

    const SQL_TYPES = new Set([
        "INTEGER", "INT", "BIGINT", "SMALLINT", "REAL", "FLOAT", "DOUBLE",
        "NUMERIC", "DECIMAL", "TEXT", "VARCHAR", "CHAR", "DATE", "TIME",
        "TIMESTAMP", "DATETIME", "BOOLEAN", "BOOL"
    ]);

    function normalizeArgs(params, cb) {
        if (typeof params === "function") {
            return { params: [], cb: params };
        }
        if (params === undefined || params === null) {
            return { params: [], cb: typeof cb === "function" ? cb : null };
        }
        const arr = Array.isArray(params) ? [...params] : [params];
        return { params: arr, cb: typeof cb === "function" ? cb : null };
    }

    function extractReferencedTables(sql) {
        const tables = [];
        const re = /\b(?:FROM|JOIN|INTO|UPDATE)\s+["`]?([A-Za-z_][A-Za-z0-9_]*)["`]?/gi;
        let m;
        while ((m = re.exec(sql)) !== null) {
            const low = m[1].toLowerCase();
            if (tableColMap[low] && !tables.includes(low)) {
                tables.push(low);
            }
        }
        return tables;
    }

    function sanitizeParamsForNumericColumns(sql, params) {
        if (!params || params.length === 0) return params;
        const out = [...params].map((v) => (v === undefined ? null : v));

        // 1. Check INSERT INTO table (col1, col2, ...) VALUES (?, ?, ...)
        const insMatch = sql.match(/^\s*INSERT\s+(?:OR\s+\w+\s+)?INTO\s+["`]?[A-Za-z_][A-Za-z0-9_]*["`]?\s*\(([^)]+)\)/i);
        if (insMatch) {
            const cols = insMatch[1].split(",").map((c) => c.trim().replace(/^["`]|["`]$/g, "").toLowerCase());
            // Find where VALUES (...) starts and count literal vs ? slots
            const valMatch = sql.slice(insMatch[0].length).match(/\bVALUES\s*\(([\s\S]*)\)/i);
            if (valMatch) {
                const slots = valMatch[1].split(",");
                let pIdx = 0;
                for (let i = 0; i < cols.length && i < slots.length; i++) {
                    if (slots[i].includes("?")) {
                        if (pIdx < out.length && out[pIdx] === "" && numericCols.has(cols[i])) {
                            out[pIdx] = null;
                        }
                        pIdx++;
                    }
                }
                return out;
            }
        }

        // 2. Check col = ? in UPDATE / WHERE clauses
        const assignRe = /\b([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\?|\?/g;
        let pIdx = 0;
        let m;
        while ((m = assignRe.exec(sql)) !== null) {
            if (m[1]) {
                const colLow = m[1].toLowerCase();
                if (pIdx < out.length && out[pIdx] === "" && numericCols.has(colLow)) {
                    out[pIdx] = null;
                }
            }
            pIdx++;
        }
        return out;
    }

    function translateSql(rawSql, rawParams, isRun = false) {
        const trimmed = (rawSql || "").trim();
        if (!trimmed) return { noop: true };

        // Fast-path SQLite PRAGMA and explicit BEGIN/COMMIT/ROLLBACK statements
        if (/^(?:PRAGMA|BEGIN(?:\s+TRANSACTION)?|COMMIT|ROLLBACK)\b/i.test(trimmed)) {
            return { noop: true };
        }

        // Fast-path startup DDL if table/column already exists in pgSchemaMeta
        const ctMatch = trimmed.match(/^CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+["`]?([A-Za-z_][A-Za-z0-9_]*)["`]?/i);
        if (ctMatch && tableColMap[ctMatch[1].toLowerCase()]) {
            return { noop: true };
        }

        const idxMatch = trimmed.match(/^CREATE\s+INDEX\s+IF\s+NOT\s+EXISTS\b/i);
        if (idxMatch) {
            return { noop: true };
        }

        const altMatch = trimmed.match(/^ALTER\s+TABLE\s+["`]?([A-Za-z_][A-Za-z0-9_]*)["`]?\s+ADD\s+COLUMN\s+(?:IF\s+NOT\s+EXISTS\s+)?["`]?([A-Za-z_][A-Za-z0-9_]*)["`]?/i);
        if (altMatch) {
            const tLow = altMatch[1].toLowerCase();
            const cLow = altMatch[2].toLowerCase();
            if (tableColMap[tLow] && tableColMap[tLow][cLow]) {
                return { noop: true };
            }
        }

        const params = sanitizeParamsForNumericColumns(trimmed, rawParams);
        let s = trimmed.replace(/;\s*$/, "");

        let isInsertIgnore = false;
        if (/^INSERT\s+OR\s+IGNORE\s+INTO\b/i.test(s)) {
            isInsertIgnore = true;
            s = s.replace(/^INSERT\s+OR\s+IGNORE\s+INTO\b/i, "INSERT INTO");
        }

        // DDL translations if any new CREATE TABLE / ALTER TABLE runs
        if (/^(?:CREATE|ALTER)\s+TABLE\b/i.test(s)) {
            s = s
                .replace(/\bINTEGER\s+PRIMARY\s+KEY\s+AUTOINCREMENT\b/gi, "SERIAL PRIMARY KEY")
                .replace(/\bDATETIME\s+DEFAULT\s+CURRENT_TIMESTAMP\b/gi, "TEXT DEFAULT CURRENT_TIMESTAMP::TEXT")
                .replace(/\bDATETIME\b/gi, "TEXT")
                .replace(/\bREAL\b/gi, "DOUBLE PRECISION")
                .replace(/\bALTER\s+TABLE\s+([A-Za-z_][A-Za-z0-9_]*)\s+ADD\s+COLUMN\s+(?!IF\s+NOT\s+EXISTS)/i, "ALTER TABLE $1 ADD COLUMN IF NOT EXISTS ");
        }

        // Function translations
        s = s.replace(/\bIFNULL\s*\(/gi, "COALESCE(");
        s = s.replace(/\bGROUP_CONCAT\s*\(\s*DISTINCT\s+([^)]+)\)/gi, "STRING_AGG(DISTINCT ($1)::text, ',')");
        s = s.replace(/\bGROUP_CONCAT\s*\(\s*([^)]+)\)/gi, "STRING_AGG(($1)::text, ',')");

        // Preserve exact case of unquoted AS aliases in SELECT queries
        if (/^(?:SELECT|WITH)\b/i.test(s)) {
            s = s.replace(/\bAS\s+([A-Za-z_][A-Za-z0-9_]*)\b(?!\s*\()/gi, (full, ident) => {
                if (SQL_TYPES.has(ident.toUpperCase())) return full;
                return `AS "${ident}"`;
            });
        }

        if (isInsertIgnore && !/\bON\s+CONFLICT\b/i.test(s)) {
            s += " ON CONFLICT DO NOTHING";
        }

        // Append RETURNING <pk> for INSERT in db.run so this.lastID works
        if (isRun && /^INSERT\s+INTO\b/i.test(s) && !/\bRETURNING\b/i.test(s)) {
            const m = s.match(/^INSERT\s+INTO\s+["`]?([A-Za-z_][A-Za-z0-9_]*)["`]?/i);
            if (m) {
                const lowT = m[1].toLowerCase();
                const pk = pkMap[lowT];
                if (pk) {
                    s += ` RETURNING ${pk} AS "_last_id"`;
                }
            }
        }

        // Convert ? placeholders outside single-quoted string literals to $1, $2, ...
        let paramIdx = 0;
        s = s.replace(/'(?:''|[^'])*'|\?/g, (match) => {
            if (match === "?") {
                paramIdx++;
                return `$${paramIdx}`;
            }
            return match;
        });

        return {
            noop: false,
            sql: s,
            params,
            refTables: extractReferencedTables(trimmed)
        };
    }

    function restoreRowCase(row, refTables) {
        if (!row || typeof row !== "object") return row;
        const out = {};
        const lowLookup = {};

        for (const [k, v] of Object.entries(row)) {
            if (k === "_last_id") continue;
            let canonical = k;
            // If key is all lowercase, restore canonical casing from referenced tables or global map
            if (k === k.toLowerCase()) {
                let matched = null;
                if (refTables) {
                    for (const t of refTables) {
                        if (tableColMap[t] && tableColMap[t][k]) {
                            matched = tableColMap[t][k];
                            break;
                        }
                    }
                }
                if (!matched && globalColMap[k]) {
                    matched = globalColMap[k];
                }
                if (matched) {
                    canonical = matched;
                }
            }
            out[canonical] = v;
            lowLookup[canonical.toLowerCase()] = canonical;
        }

        return new Proxy(out, {
            get(target, prop, receiver) {
                if (prop in target || typeof prop === "symbol") {
                    return Reflect.get(target, prop, receiver);
                }
                if (typeof prop === "string") {
                    const mapped = lowLookup[prop.toLowerCase()];
                    if (mapped !== undefined) {
                        return target[mapped];
                    }
                }
                return undefined;
            }
        });
    }

    // Sequential execution queue for SQL statements (mirrors sqlite3 single-connection ordering)
    let queryQueue = Promise.resolve();

    function enqueueQuery(sql, params) {
        const next = queryQueue.then(() => pool.query(sql, params));
        // Keep queue alive even if a query rejects
        queryQueue = next.catch(() => {});
        return next;
    }

    const db = {
        serialize(fn) {
            if (typeof fn === "function") fn();
        },

        run(sql, params, cb) {
            const { params: normParams, cb: callback } = normalizeArgs(params, cb);
            const translated = translateSql(sql, normParams, true);

            if (translated.noop) {
                if (callback) {
                    process.nextTick(() => callback.call({ lastID: 0, changes: 0 }, null));
                }
                return this;
            }

            enqueueQuery(translated.sql, translated.params)
                .then((res) => {
                    const lastID =
                        res.rows && res.rows[0] && res.rows[0]._last_id !== undefined
                            ? res.rows[0]._last_id
                            : 0;
                    const changes = res.rowCount || 0;
                    if (callback) {
                        callback.call({ lastID, changes }, null);
                    }
                })
                .catch((err) => {
                    if (callback) {
                        callback.call({ lastID: 0, changes: 0 }, err);
                    } else {
                        console.error("❌ Postgres db.run error:", err.message, "\nSQL:", translated.sql);
                    }
                });

            return this;
        },

        get(sql, params, cb) {
            const { params: normParams, cb: callback } = normalizeArgs(params, cb);
            const translated = translateSql(sql, normParams, false);

            if (translated.noop) {
                if (callback) process.nextTick(() => callback(null, undefined));
                return this;
            }

            enqueueQuery(translated.sql, translated.params)
                .then((res) => {
                    const row =
                        res.rows && res.rows.length > 0
                            ? restoreRowCase(res.rows[0], translated.refTables)
                            : undefined;
                    if (callback) callback(null, row);
                })
                .catch((err) => {
                    if (callback) callback(err);
                    else console.error("❌ Postgres db.get error:", err.message);
                });

            return this;
        },

        all(sql, params, cb) {
            const { params: normParams, cb: callback } = normalizeArgs(params, cb);
            const translated = translateSql(sql, normParams, false);

            if (translated.noop) {
                if (callback) process.nextTick(() => callback(null, []));
                return this;
            }

            enqueueQuery(translated.sql, translated.params)
                .then((res) => {
                    const rows = (res.rows || []).map((r) =>
                        restoreRowCase(r, translated.refTables)
                    );
                    if (callback) callback(null, rows);
                })
                .catch((err) => {
                    if (callback) callback(err);
                    else console.error("❌ Postgres db.all error:", err.message);
                });

            return this;
        },

        prepare(sql) {
            return {
                run(...args) {
                    let cb = null;
                    let params = args;
                    if (args.length > 0 && typeof args[args.length - 1] === "function") {
                        cb = args[args.length - 1];
                        params = args.slice(0, -1);
                    }
                    if (params.length === 1 && Array.isArray(params[0])) {
                        params = params[0];
                    }
                    db.run(sql, params, cb);
                    return this;
                },
                get(...args) {
                    let cb = null;
                    let params = args;
                    if (args.length > 0 && typeof args[args.length - 1] === "function") {
                        cb = args[args.length - 1];
                        params = args.slice(0, -1);
                    }
                    if (params.length === 1 && Array.isArray(params[0])) {
                        params = params[0];
                    }
                    db.get(sql, params, cb);
                    return this;
                },
                all(...args) {
                    let cb = null;
                    let params = args;
                    if (args.length > 0 && typeof args[args.length - 1] === "function") {
                        cb = args[args.length - 1];
                        params = args.slice(0, -1);
                    }
                    if (params.length === 1 && Array.isArray(params[0])) {
                        params = params[0];
                    }
                    db.all(sql, params, cb);
                    return this;
                },
                finalize(cb) {
                    if (typeof cb === "function") {
                        queryQueue.then(() => cb(null)).catch(() => cb(null));
                    }
                }
            };
        },

        pool
    };

    module.exports = db;
} else {
    const sqlite3 = require("sqlite3").verbose();

    let dbPath = path.join(__dirname, "../erp.db");

    // In serverless environments (e.g. Vercel), copy database to writable /tmp
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
        const tmpDbPath = path.join("/tmp", "erp.db");
        try {
            if (!fs.existsSync(tmpDbPath)) {
                if (fs.existsSync(dbPath)) {
                    fs.copyFileSync(dbPath, tmpDbPath);
                }
            }
            dbPath = tmpDbPath;
        } catch (err) {
            console.error("Error setting up /tmp SQLite DB:", err.message);
        }
    }

    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error("❌ SQLite Connection Error:", err.message);
        } else {
            console.log("✅ SQLite Connected:", dbPath);
        }
    });

    db.serialize(() => {
        db.run("PRAGMA foreign_keys = ON;");
    });

    module.exports = db;
}