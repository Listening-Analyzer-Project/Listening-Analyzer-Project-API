import { IGenre } from '@/type';
import { queryAll, queryOne, runQuery } from '@/utils';

const Genre = {
  getAll: () => queryAll<IGenre>('SELECT * FROM genre'),

  getById: (id: number) => queryOne<IGenre>('SELECT * FROM genre WHERE id = ?', [id]),

  create: (genre: IGenre) => {
    const info = runQuery(
      'INSERT INTO genre (name) VALUES (?)',
      [genre.name]
    );
    return { id: info.lastInsertRowid };
  },

  update: (id: number, genre: IGenre) => {
    const info = runQuery(
      'UPDATE genre SET name = ? WHERE id = ?',
      [genre.name, id]
    );
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = runQuery('DELETE FROM genre WHERE id = ?', [id]);
    return { changes: info.changes };
  },
};

export default Genre;
