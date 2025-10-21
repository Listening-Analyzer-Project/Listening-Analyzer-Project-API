import { IGenre, IGenreWithSubGenres } from '@/type';
import { queryAll, queryOne, runQuery } from '@/utils';
import SubGenre from './sub-genre-model';

const Genre = {

  // =======================
  // CRUD
  // =======================
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

  // =======================
  // Autres méthodes spécifiques
  // =======================

   getAllWithSubGenres: (): IGenreWithSubGenres[] => {
    const genres = Genre.getAll();
    const subGenres = SubGenre.getAll();

    return genres.map((genre) => ({
      ...genre,
      sub_genres: subGenres.filter((sg) => sg.genre_id === genre.id),
    }));
  },
};

export default Genre;
