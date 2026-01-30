import Database from "better-sqlite3";
import "dotenv/config";
import fs from "fs";

const db = new Database("db/listening.db");

// Charger le schéma
const schema = fs.readFileSync("./scripts/converted_schema.sql", "utf8");
db.exec("PRAGMA foreign_keys = ON;");
db.exec(schema);

const analyticsView = fs.readFileSync("./scripts/analytics_view.sql", "utf8");
db.exec(analyticsView);

const initialProdData = fs.readFileSync("./scripts/seed_prod_data.sql", "utf8");
db.exec(initialProdData);

if (process.env.STATUS === "dev") {
  const initialDevData = fs.readFileSync("./scripts/seed_dev_data.sql", "utf8");
  db.exec(initialDevData);
}

console.log("✅ Base SQLite initialisée !");
