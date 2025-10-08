import { queryAll, queryOne, runQuery } from '../../utils/db-helpers';
import { IPlaylist } from '../../type/bdd-type';

const Playlist = {
  getAll: () => queryAll<IPlaylist>('SELECT * FROM playlist'),

  getById: (id: number) => queryOne<IPlaylist>('SELECT * FROM playlist WHERE id = ?', [id]),

  create: (data: IPlaylist) => {
    const info = runQuery(
      'INSERT INTO playlist (name, user_id) VALUES (?, ?)',
      [data.name, data.user_id]
    );
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
    const info = runQuery('DELETE FROM playlist WHERE id = ?', [id]);
    return { changes: info.changes };
  },
};

export default Playlist;
