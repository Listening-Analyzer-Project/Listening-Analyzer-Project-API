import db from '../database';
import { IPlaylist } from '../type/bdd-type';

const Playlist = {
  getAll: () => {
    const stmt = db.prepare('SELECT * FROM playlist');
    return stmt.all(); // renvoie directement un tableau
  },
  getById: (id: number) => {
    const stmt = db.prepare('SELECT * FROM playlist WHERE id = ?');
    return stmt.get(id);
  },
  create: (data: IPlaylist) => {
    const stmt = db.prepare('INSERT INTO playlist (name, user_id) VALUES (?, ?)');
    return stmt.run(data.name, data.user_id);
  },
  update: (id: number, data: Partial<IPlaylist>) => {
    const stmt = db.prepare('UPDATE playlist SET name = ?, user_id = ? WHERE id = ?');
    return stmt.run(data.name, data.user_id, id);
  },
  delete: (id: number) => {
    const stmt = db.prepare('DELETE FROM playlist WHERE id = ?');
    return stmt.run(id);
  },
};

export default Playlist;
