import { IListen } from '@/type';
import { queryAll, queryOne, runQuery, runTransaction } from '@/utils';

const Listen = {
  /** -----------------------------
   *   Fonctions internes au model
   *  ----------------------------- */
  _insertListen(listen: IListen) {
    return runQuery(
      `INSERT INTO listens (ts, platform, ms_played, track_id, user_id, reason_end)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [listen.ts, listen.platform, listen.ms_played, listen.track_id, listen.user_id, listen.reason_end]
    );
  },

  _deleteByIds(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) return { changes: 0 };

    const placeholders = ids.map(() => '?').join(', ');
    const sql = `DELETE FROM listens WHERE id IN (${placeholders})`;
    return runQuery(sql, ids);
  },

  /** -----------------------------
   *  Fonctions publiques 
   *  ----------------------------- */

  getAll: () => queryAll<IListen>('SELECT * FROM listens'),

  getById: (id: number) => queryOne<IListen>('SELECT * FROM listens WHERE id = ?', [id]),

  create: (listen: IListen) => {
    const info = Listen._insertListen(listen);
    return { id: info.lastInsertRowid };
  },

  createMany: (listens: IListen[]) => {
    if (!Array.isArray(listens) || listens.length === 0) {
      return { insertedCount: 0 };
    }
    runTransaction(() => {
      for (const listen of listens) {
        Listen._insertListen(listen);
      }
    });

    return {
      insertedCount: listens.length,
    };
  },

  update: (id: number, listen: IListen) => {
    const info = runQuery(
      `UPDATE listens
       SET ts = ?, platform = ?, ms_played = ?, track_id = ?, user_id = ?, reason_end = ?
       WHERE id = ?`,
      [listen.ts, listen.platform, listen.ms_played, listen.track_id, listen.user_id, listen.reason_end, id]
    );
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = Listen._deleteByIds([id]);
    return { changes: info.changes };
  },

  deleteMany: (ids: number[]) => {
    const info = Listen._deleteByIds(ids);
    return {
      deletedCount: info.changes ?? 0,
      message: `${info.changes ?? 0} listens deleted successfully`,
    };
  },
};

export default Listen;
