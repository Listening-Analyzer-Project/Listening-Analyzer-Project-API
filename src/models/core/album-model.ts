import { queryAll, queryOne, runQuery } from '@/utils';
import { IAlbum } from '@/type';

const Album = {
  getAll: () => queryAll<IAlbum>('SELECT * FROM albums'),

  getById: (id: number) => queryOne<IAlbum>('SELECT * FROM albums WHERE id = ?', [id]),

  create: (album: IAlbum) => {
    const info = runQuery(
      'INSERT INTO albums (title, release_date, image_uri, popularity) VALUES (?, ?, ?, ?)',
      [album.title, album.release_date, album.image_uri, album.popularity]
    );
    return { id: info.lastInsertRowid };
  },

  update: (id: number, album: IAlbum) => {
    const info = runQuery(
      'UPDATE albums SET title = ?, release_date = ?, image_uri = ?, popularity = ? WHERE id = ?',
      [album.title, album.release_date, album.image_uri, album.popularity, id]
    );
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = runQuery('DELETE FROM albums WHERE id = ?', [id]);
    return { changes: info.changes };
  },
};

export default Album;