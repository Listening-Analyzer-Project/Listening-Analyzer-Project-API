import { ISubGenre } from '@/type';
import { queryAll, queryOne, runQuery, runTransaction } from '@/utils';

const SubGenre = {
  /** -----------------------------
   *   Fonctions internes au model
   *  ----------------------------- */
  _insert(subGenre: ISubGenre) {
    return runQuery(
      `INSERT INTO sub_genres (name, genre_id) VALUES (?, ?)`,
      [subGenre.name, subGenre.genre_id]
    );
  },

  _deleteByIds(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) return { changes: 0 };

    const placeholders = ids.map(() => '?').join(', ');
    const sql = `DELETE FROM sub_genres WHERE id IN (${placeholders})`;
    return runQuery(sql, ids);
  },

  /** -----------------------------
   *  Fonctions publiques
   *  ----------------------------- */
  getAll: () => queryAll<ISubGenre>('SELECT * FROM sub_genres'),

  getById: (id: number) => queryOne<ISubGenre>('SELECT * FROM sub_genres WHERE id = ?', [id]),

  create: (subGenre: ISubGenre) => {
    const info = SubGenre._insert(subGenre);
    return { id: info.lastInsertRowid };
  },

  createMany: (subGenres: ISubGenre[]) => {
    if (!Array.isArray(subGenres) || subGenres.length === 0) {
      return { insertedCount: 0 };
    }

    runTransaction(() => {
      for (const sg of subGenres) {
        SubGenre._insert(sg);
      }
    });

    return { insertedCount: subGenres.length };
  },

  update: (id: number, subGenre: ISubGenre) => {
    const info = runQuery(
      `UPDATE sub_genres SET name = ?, genre_id = ? WHERE id = ?`,
      [subGenre.name, subGenre.genre_id, id]
    );
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = SubGenre._deleteByIds([id]);
    return { changes: info.changes };
  },

  deleteMany: (ids: number[]) => {
    const info = SubGenre._deleteByIds(ids);
    return {
      deletedCount: info.changes ?? 0,
      message: `${info.changes ?? 0} sub-genres deleted successfully`,
    };
  },
};

export default SubGenre;
