import { ISubGenre } from '@/type';
import { queryAll, queryOne, runQuery } from '@/utils';

const SubGenre = {
  getAll: () => queryAll<ISubGenre>('SELECT * FROM sub_genres'),

  getById: (id: number) => queryOne<ISubGenre>('SELECT * FROM sub_genres WHERE id = ?', [id]),

  create: (subGenre: ISubGenre) => {
    const info = runQuery(
      'INSERT INTO sub_genres (name, genre_id) VALUES (?, ?)',
      [subGenre.name, subGenre.genre_id]
    );
    return { id: info.lastInsertRowid };
  },

  update: (id: number, subGenre: ISubGenre) => {
    const info = runQuery(
      'UPDATE sub_genres SET name = ?, genre_id = ? WHERE id = ?',
      [subGenre.name, subGenre.genre_id, id]
    );
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = runQuery('DELETE FROM sub_genres WHERE id = ?', [id]);
    return { changes: info.changes };
  },
};

export default SubGenre;
