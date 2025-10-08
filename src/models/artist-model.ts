import db from '../database';
import { IArtist } from '../type/bdd-type';

const Artist = {
  getAll: () => {
    const stmt = db.prepare('SELECT * FROM artist');
    return stmt.all(); // renvoie directement un tableau
  },

  getById: (id: number) => {
    const stmt = db.prepare('SELECT * FROM artist WHERE id = ?');
    return stmt.get(id); // renvoie directement un objet ou undefined
  },

  create: (artist: IArtist) => {
    const stmt = db.prepare('INSERT INTO artist (name) VALUES (?)');
    const result = stmt.run(artist.name);
    return { id: result.lastInsertRowid, ...artist };
  },

  update: (id: number, artist: IArtist) => {
    const stmt = db.prepare('UPDATE artist SET name = ? WHERE id = ?');
    stmt.run(artist.name, id);
    return { id, ...artist };
  },

  delete: (id: number) => {
    const stmt = db.prepare('DELETE FROM artist WHERE id = ?');
    stmt.run(id);
    return { id };
  },
};

export default Artist;
