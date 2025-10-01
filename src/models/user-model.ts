import db from '../database';
import { IUser } from '../type/bdd-type';

const User = {
  getAll: () => {
    const stmt = db.prepare('SELECT * FROM user');
    return stmt.all(); // renvoie directement un tableau
  },

  getById: (id : number) => {
    const stmt = db.prepare('SELECT * FROM user WHERE id = ?');
    return stmt.get(id); // renvoie directement un objet ou undefined
  },

  create: (user: IUser) => {
    const stmt = db.prepare('INSERT INTO user (name, type, isadmin) VALUES (?, ?, ?)');
    const info = stmt.run(user.name, user.type, user.isadmin); // renvoie info.lastInsertRowid
    return { id: info.lastInsertRowid };
  },

  update: (id: number, user: IUser) => {
    const stmt = db.prepare('UPDATE user SET name = ?, type = ?, isadmin = ? WHERE id = ?');
    const info = stmt.run(user.name, user.type, user.isadmin, id);
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const stmt = db.prepare('DELETE FROM user WHERE id = ?');
    const info = stmt.run(id);
    return { changes: info.changes };
  },
};

export default User;
