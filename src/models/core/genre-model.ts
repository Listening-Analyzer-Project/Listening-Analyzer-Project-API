import { IGenre } from '@/type';
import { queryAll, queryOne, runQuery } from '@/utils';

const Genre = {
  getAll: () => queryAll<IGenre>('SELECT * FROM genres'),

  getById: (id: number) => queryOne<IGenre>('SELECT * FROM genres WHERE id = ?', [id]),

  create: (genre: IGenre) => {
    const info = runQuery(
      'INSERT INTO genres (name) VALUES (?)',
      [genre.name]
    );
    return { id: info.lastInsertRowid };
  },

  update: (id: number, genre: IGenre) => {
    const info = runQuery(
      'UPDATE genres SET name = ? WHERE id = ?',
      [genre.name, id]
    );
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = runQuery('DELETE FROM genres WHERE id = ?', [id]);
    return { changes: info.changes };
  },
};

export default Genre;
