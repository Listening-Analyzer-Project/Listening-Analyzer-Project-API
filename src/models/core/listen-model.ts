import { IListen } from '@/type';
import { queryAll, queryOne, runQuery } from '@/utils';

const Listen = {
  getAll: () => queryAll<IListen>('SELECT * FROM listen'),

  getById: (id: number) => queryOne<IListen>('SELECT * FROM listen WHERE id = ?', [id]),

  create: (listen: IListen) => {
    const info = runQuery(
      'INSERT INTO listen (ts, platform, ms_played, track_id, user_id, reason_end) VALUES (?, ?, ?, ?, ?, ?)',
      [listen.ts, listen.platform, listen.ms_played, listen.track_id, listen.user_id, listen.reason_end]
    );
    return { id: info.lastInsertRowid };
  },

  update: (id: number, listen: IListen) => {
    const info = runQuery(
      'UPDATE listen SET ts = ?, platform = ?, ms_played = ?, track_id = ?, user_id = ?, reason_end = ? WHERE id = ?',
      [listen.ts, listen.platform, listen.ms_played, listen.track_id, listen.user_id, listen.reason_end, id]
    );
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = runQuery('DELETE FROM listen WHERE id = ?', [id]);
    return { changes: info.changes };
  },
};

export default Listen;
