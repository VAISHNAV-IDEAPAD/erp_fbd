const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const fs = require("fs");

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

const db = new sqlite3.Database(
    dbPath,
    (err) => {
        if (err) {
            console.error("❌ SQLite Connection Error:", err.message);
        } else {
            console.log("✅ SQLite Connected:", dbPath);
        }
    }
);

db.serialize(() => {
    db.run("PRAGMA foreign_keys = ON;");
});

module.exports = db;