import db from '../database';
import { IAlbum } from '../type/bdd-type';

const Album = {
  getAll: () => {
    const stmt = db.prepare('SELECT * FROM album');
    return stmt.all(); // renvoie directement un tableau
  },

  getById: (id: number) => {
    const stmt = db.prepare('SELECT * FROM album WHERE id = ?');
    return stmt.get(id); // renvoie directement un objet ou undefined
  },

  create: (album: IAlbum) => {
    const stmt = db.prepare('INSERT INTO album (title, release_date, image_uri, popularity) VALUES (?, ?, ?, ?)');
    const info = stmt.run(album.title, album.release_date, album.image_uri, album.popularity);
    return { id: info.lastInsertRowid };
  },

  update: (id: number, album: IAlbum) => {
    const stmt = db.prepare('UPDATE album SET title = ?, release_date = ?, image_uri = ?, popularity = ? WHERE id = ?');
    stmt.run(album.title, album.release_date, album.image_uri, album.popularity, id);
  },

  delete: (id: number) => {
    const stmt = db.prepare('DELETE FROM album WHERE id = ?');
    const info = stmt.run(id);
    return { changes: info.changes };
  },
};

export default Album;