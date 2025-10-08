import db from '../database';

/**
 * Exécute une requête SELECT qui renvoie plusieurs lignes
 */
export const queryAll = <T>(sql: string, params: any[] = []): T[] => {
  const stmt = db.prepare(sql);
  return stmt.all(...params) as T[];
};

/**
 * Exécute une requête SELECT qui renvoie une seule ligne
 */
export const queryOne = <T>(sql: string, params: any[] = []): T | undefined => {
  const stmt = db.prepare(sql);
  return stmt.get(...params) as T | undefined;
};

/**
 * Exécute une requête d’écriture (INSERT, UPDATE, DELETE)
 */
export const runQuery = (sql: string, params: any[] = []) => {
  const stmt = db.prepare(sql);
  return stmt.run(...params);
};