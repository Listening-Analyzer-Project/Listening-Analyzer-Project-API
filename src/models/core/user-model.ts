import { IUser } from '@/type';
import { queryAll, queryOne, runQuery } from '@/utils';

const User = {
  getAll: () => queryAll<IUser>('SELECT * FROM user'),

  getById: (id: number) => queryOne<IUser>('SELECT * FROM user WHERE id = ?', [id]),

  create: (user: IUser) => {
    const info = runQuery(
      'INSERT INTO user (name, type, isadmin, syncro_status) VALUES (?, ?, ?, ?)',
      [user.name, user.type, user.isadmin, user.syncro_status]
    );
    return { id: info.lastInsertRowid };
  },

  update: (id: number, user: IUser) => {
    const info = runQuery(
      'UPDATE user SET name = ?, type = ?, isadmin = ?, syncro_status = ? WHERE id = ?',
      [user.name, user.type, user.isadmin, user.syncro_status, id]
    );
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = runQuery('DELETE FROM user WHERE id = ?', [id]);
    return { changes: info.changes };
  },
};

export default User;
