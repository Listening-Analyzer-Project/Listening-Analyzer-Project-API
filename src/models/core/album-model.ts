import { queryAll, queryOne, runQuery } from '@/utils';
import { IAlbum } from '@/type';

const Album = {
  getAll: () => queryAll<IAlbum>('SELECT * FROM album'),

  getById: (id: number) => queryOne<IAlbum>('SELECT * FROM album WHERE id = ?', [id]),

  create: (album: IAlbum) => {
    const info = runQuery(
      'INSERT INTO album (title, release_date, image_uri, popularity) VALUES (?, ?, ?, ?)',
      [album.title, album.release_date, album.image_uri, album.popularity]
    );
    return { id: info.lastInsertRowid };
  },

  update: (id: number, album: IAlbum) => {
    const info = runQuery(
      'UPDATE album SET title = ?, release_date = ?, image_uri = ?, popularity = ? WHERE id = ?',
      [album.title, album.release_date, album.image_uri, album.popularity, id]
    );
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = runQuery('DELETE FROM album WHERE id = ?', [id]);
    return { changes: info.changes };
  },
};

export default Album;