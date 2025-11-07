import { queryAll, queryOne, runQuery, runTransaction } from '@/utils';
import { IArtist } from '@/type';

const Artist = {
  /** -----------------------------
   *   Fonctions internes au model
   *  ----------------------------- */
  _insertArtist(artist: IArtist) {
    return runQuery(
      `INSERT INTO artists (name, image_uri, popularity, country_id, type, birth)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        artist.name,
        artist.image_uri,
        artist.popularity,
        artist.country_id,
        artist.type,
        artist.birth,
      ]
    );
  },

  _deleteByIds(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) return { changes: 0 };

    const placeholders = ids.map(() => '?').join(', ');
    const sql = `DELETE FROM artists WHERE id IN (${placeholders})`;
    return runQuery(sql, ids);
  },

  /** -----------------------------
   *  Fonctions publiques
   *  ----------------------------- */

  getAll: () => queryAll<IArtist>('SELECT * FROM artists'),

  getById: (id: number) => queryOne<IArtist>('SELECT * FROM artists WHERE id = ?', [id]),

  create: (artist: IArtist) => {
    const info = Artist._insertArtist(artist);
    return { id: info.lastInsertRowid, ...artist };
  },

  createMany: (artists: IArtist[]) => {
    if (!Array.isArray(artists) || artists.length === 0) {
      return { insertedCount: 0, insertedIds: [] };
    }
    const insertedIds: number[] = [];
    
    runTransaction(() => {
      for (const artist of artists) {
        const info = Artist._insertArtist(artist);
        insertedIds.push(info.lastInsertRowid as number);
      }
    });

    return {
      insertedCount: artists.length,
      insertedIds,
    };
  },

  update: (id: number, artist: IArtist) => {
    const info = runQuery(
      `UPDATE artists
       SET name = ?, image_uri = ?, popularity = ?, country_id = ?, type = ?, birth = ?
       WHERE id = ?`,
      [
        artist.name,
        artist.image_uri,
        artist.popularity,
        artist.country_id,
        artist.type,
        artist.birth,
        id,
      ]
    );
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = Artist._deleteByIds([id]);
    return { changes: info.changes };
  },

  deleteMany: (ids: number[]) => {
    const info = Artist._deleteByIds(ids);
    return {
      deletedCount: info.changes ?? 0,
      message: `${info.changes ?? 0} artists deleted successfully`,
    };
  },
};

export default Artist;