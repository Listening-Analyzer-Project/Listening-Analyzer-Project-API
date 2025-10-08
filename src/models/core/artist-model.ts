import { queryAll, queryOne, runQuery } from '@/utils';
import { IArtist } from '@/type';

const Artist = {
  getAll: () => queryAll<IArtist>('SELECT * FROM artist'),

  getById: (id: number) => queryOne<IArtist>('SELECT * FROM artist WHERE id = ?', [id]),

  create: (artist: IArtist) => {
    const info = runQuery('INSERT INTO artist (name) VALUES (?)', [artist.name]);
    return { id: info.lastInsertRowid, ...artist };
  },

  update: (id: number, artist: IArtist) => {
    const info = runQuery('UPDATE artist SET name = ? WHERE id = ?', [artist.name, id]);
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = runQuery('DELETE FROM artist WHERE id = ?', [id]);
    return { changes: info.changes };
  },
};

export default Artist;