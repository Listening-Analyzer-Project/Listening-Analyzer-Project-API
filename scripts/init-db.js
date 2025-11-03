import Database from "better-sqlite3";
import fs from "fs";

const db = new Database("listening.db");

// Charger le schéma
const schema = fs.readFileSync("./scripts/converted_schema.sql", "utf8");
db.exec("PRAGMA foreign_keys = ON;");
db.exec(schema);

const analyticsView = fs.readFileSync("./scripts/analytics_view.sql", "utf8");
db.exec(analyticsView);

const initialData = fs.readFileSync("./scripts/seed_dev_data.sql", "utf8");
db.exec(initialData);

console.log("✅ Base SQLite initialisée !");
