import Database from "better-sqlite3";
import fs from "fs";

const db = new Database("listening.db");

// Charger le schéma
const schema = fs.readFileSync("converted_schema.sql", "utf8");
db.exec("PRAGMA foreign_keys = ON;");
db.exec(schema);

console.log("✅ Base SQLite initialisée !");
