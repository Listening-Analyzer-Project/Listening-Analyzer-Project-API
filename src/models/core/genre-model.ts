import { IGenre, IGenreWithSubGenres } from '@/type';
import { queryAll, queryOne, runQuery, runTransaction } from '@/utils';
import SubGenre from './sub-genre-model';

const Genre = {
  /** -----------------------------
   *   Fonctions internes au model
   *  ----------------------------- */
  _insertGenre(genre: IGenre) {
    return runQuery(
      `INSERT INTO genres (name) VALUES (?)`,
      [genre.name]
    );
  },

  _deleteByIds(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) return { changes: 0 };

    const placeholders = ids.map(() => '?').join(', ');
    const sql = `DELETE FROM genres WHERE id IN (${placeholders})`;
    return runQuery(sql, ids);
  },

  /** -----------------------------
   *   Fonctions publiques (CRUD)
   *  ----------------------------- */
  getAll: () => queryAll<IGenre>('SELECT * FROM genres'),

  getById: (id: number) => queryOne<IGenre>('SELECT * FROM genres WHERE id = ?', [id]),

  create: (genre: IGenre) => {
    const info = Genre._insertGenre(genre);
    return { id: info.lastInsertRowid, ...genre };
  },

  createMany: (genres: IGenre[]) => {
    if (!Array.isArray(genres) || genres.length === 0) {
      return { insertedCount: 0, insertedIds: [] };
    }
    const insertedIds: number[] = [];

    runTransaction(() => {
      for (const genre of genres) {
        const info = Genre._insertGenre(genre);
        insertedIds.push(info.lastInsertRowid as number);
      }
    });

    return {
      insertedCount: genres.length,
      insertedIds,
    };
  },

  update: (id: number, genre: IGenre) => {
    const info = runQuery(
      `UPDATE genres SET name = ? WHERE id = ?`,
      [genre.name, id]
    );
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = Genre._deleteByIds([id]);
    return { changes: info.changes };
  },

  deleteMany: (ids: number[]) => {
    const info = Genre._deleteByIds(ids);
    return {
      deletedCount: info.changes ?? 0,
      message: `${info.changes ?? 0} genres deleted successfully`,
    };
  },

  /** -----------------------------
   *   Méthodes spécifiques
   *  ----------------------------- */
  getAllWithSubGenres: (): IGenreWithSubGenres[] => {
    const genres = Genre.getAll();
    const subGenres = SubGenre.getAll();

    return genres.map((genre) => ({
      ...genre,
      sub_genres: subGenres.filter((sg) => sg.genre_id === genre.id),
    }));
  },

  checkExistingGenres: (data: { genres: Set<string> }) => {
    return queryAll<{ id: number; name: string }>(
      `SELECT id, name FROM genres WHERE name IN (${Array.from(data.genres).map(() => '?').join(',')})`,
      Array.from(data.genres)
    );
  },
};

export default Genre;
