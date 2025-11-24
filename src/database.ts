import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, './../listening.db');

// Avec better-sqlite3, on instancie directement la DB
const db = new Database(dbPath);

export default db;
