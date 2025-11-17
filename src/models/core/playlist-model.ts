import { queryAll, queryOne, runQuery, runTransaction } from '@/utils';
import { IPlaylist } from '@/type';
import { create } from 'domain';

const Playlist = {
  /** -----------------------------
   *   Fonctions internes au model
   *  ----------------------------- */
  _insertPlaylist(playlist: IPlaylist) {
    return runQuery(
      `INSERT INTO playlist (name, user_id)
       VALUES (?, ?)`,
      [playlist.name, playlist.user_id]
    );
  },

  _deleteByIds(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) return { changes: 0 };

    const placeholders = ids.map(() => '?').join(', ');
    const sql = `DELETE FROM playlist WHERE id IN (${placeholders})`;
    return runQuery(sql, ids);
  },

  /** -----------------------------
   *  Fonctions publiques
   *  ----------------------------- */

  getAll: () => queryAll<IPlaylist>('SELECT * FROM playlist'),

  getById: (id: number) => queryOne<IPlaylist>('SELECT * FROM playlist WHERE id = ?', [id]),

  create: (data: IPlaylist) => {
    const info = Playlist._insertPlaylist(data);
    return { id: info.lastInsertRowid, ...data };
  },

  update: (id: number, data: Partial<IPlaylist>) => {
    const info = runQuery(
      'UPDATE playlist SET name = ?, user_id = ? WHERE id = ?',
      [data.name, data.user_id, id]
    );
    return { changes: info.changes };
  },
  delete: (id: number) => {
    const info = Playlist._deleteByIds([id]);
    return { changes: info.changes };
  },

 deleteMany: (ids: number[]) => {
    const info = Playlist._deleteByIds(ids);
    return { changes: info.changes };
  },

  getAllbyUserId: (userId: number) => {
    return queryAll<IPlaylist>('SELECT * FROM playlist WHERE user_id = ?', [userId]);
  }
};

export default Playlist;
