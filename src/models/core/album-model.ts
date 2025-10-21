import { IAlbum } from '@/type';
import { queryAll, queryOne, runQuery, runTransaction } from '@/utils';

const Album = {
  /** -----------------------------
   *   Fonctions internes au model
   *  ----------------------------- */
  _insertAlbum(album: IAlbum) {
    return runQuery(
      `INSERT INTO albums (title, release_date, image_uri, popularity)
       VALUES (?, ?, ?, ?)`,
      [album.title, album.release_date, album.image_uri, album.popularity]
    );
  },

  _deleteByIds(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) return { changes: 0 };

    const placeholders = ids.map(() => '?').join(', ');
    const sql = `DELETE FROM albums WHERE id IN (${placeholders})`;
    return runQuery(sql, ids);
  },

  /** -----------------------------
   *  Fonctions publiques
   *  ----------------------------- */
  getAll: () => queryAll<IAlbum>('SELECT * FROM albums'),

  getById: (id: number) => queryOne<IAlbum>('SELECT * FROM albums WHERE id = ?', [id]),

  create: (album: IAlbum) => {
    const info = Album._insertAlbum(album);
    return { id: info.lastInsertRowid, ...album };
  },

  createMany: (albums: IAlbum[]) => {
    if (!Array.isArray(albums) || albums.length === 0) {
      return { insertedCount: 0 };
    }

    runTransaction(() => {
      for (const album of albums) {
        Album._insertAlbum(album);
      }
    });

    return {
      insertedCount: albums.length,
    };
  },

  update: (id: number, album: IAlbum) => {
    const info = runQuery(
      `UPDATE albums
       SET title = ?, release_date = ?, image_uri = ?, popularity = ?
       WHERE id = ?`,
      [album.title, album.release_date, album.image_uri, album.popularity, id]
    );
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = Album._deleteByIds([id]);
    return { changes: info.changes };
  },

  deleteMany: (ids: number[]) => {
    const info = Album._deleteByIds(ids);
    return {
      deletedCount: info.changes ?? 0,
      message: `${info.changes ?? 0} albums deleted successfully`,
    };
  },
};

export default Album;