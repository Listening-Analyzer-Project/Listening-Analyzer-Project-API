import { ITrack } from '@/type';
import { queryAll, queryOne, runQuery, runTransaction } from '@/utils';

const Track = {
  /** -----------------------------
   *   Fonctions internes au model
   *  ----------------------------- */
  _insertTrack(track: ITrack) {
    return runQuery(
      `INSERT INTO tracks (
        title, duration_ms, album_id, explicit, popularity, sub_genre_id,
        acousticness, danceability, energy, instrumentalness, key, liveness,
        loudness, mode, speechiness, tempo, time_signature, valence, is_edited
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        track.title,
        track.duration_ms,
        track.album_id,
        track.explicit,
        track.popularity,
        track.sub_genre_id,
        track.acousticness,
        track.danceability,
        track.energy,
        track.instrumentalness,
        track.key,
        track.liveness,
        track.loudness,
        track.mode,
        track.speechiness,
        track.tempo,
        track.time_signature,
        track.valence,
        track.is_edited,
      ]
    );
  },

  _deleteByIds(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) return { changes: 0 };

    const placeholders = ids.map(() => '?').join(', ');
    const sql = `DELETE FROM tracks WHERE id IN (${placeholders})`;
    return runQuery(sql, ids);
  },

  /** -----------------------------
   *  Fonctions publiques
   *  ----------------------------- */

  getAll: () => queryAll<ITrack>('SELECT * FROM tracks'),

  getById: (id: number) => queryOne<ITrack>('SELECT * FROM tracks WHERE id = ?', [id]),

  create: (track: ITrack) => {
    const info = Track._insertTrack(track);
    return { id: info.lastInsertRowid, ...track };
  },

  createMany: (tracks: ITrack[]) => {
    if (!Array.isArray(tracks) || tracks.length === 0) {
      return { insertedCount: 0, insertedIds: [] };
    }
    const insertedIds: number[] = [];
    runTransaction(() => {
      for (const track of tracks) {
        const info = Track._insertTrack(track);
        insertedIds.push(info.lastInsertRowid as number);
      }
    });

    return {
      insertedCount: tracks.length,
      insertedIds,
    };
  },

  update: (id: number, track: ITrack) => {
    const info = runQuery(
      `UPDATE tracks SET
        title = ?, duration_ms = ?, album_id = ?, explicit = ?, popularity = ?, sub_genre_id = ?,
        acousticness = ?, danceability = ?, energy = ?, instrumentalness = ?, key = ?, liveness = ?,
        loudness = ?, mode = ?, speechiness = ?, tempo = ?, time_signature = ?, valence = ?, is_edited = ?
      WHERE id = ?`,
      [
        track.title,
        track.duration_ms,
        track.album_id,
        track.explicit,
        track.popularity,
        track.sub_genre_id,
        track.acousticness,
        track.danceability,
        track.energy,
        track.instrumentalness,
        track.key,
        track.liveness,
        track.loudness,
        track.mode,
        track.speechiness,
        track.tempo,
        track.time_signature,
        track.valence,
        track.is_edited,
        id,
      ]
    );
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = Track._deleteByIds([id]);
    return { changes: info.changes };
  },

  deleteMany: (ids: number[]) => {
    const info = Track._deleteByIds(ids);
    return {
      deletedCount: info.changes ?? 0,
      message: `${info.changes ?? 0} tracks deleted successfully`,
    };
  },

  findTracksByTitleAndAlbum: (pairs: Array<{ title: string; albumTitle: string }>) => {
    if (!pairs || pairs.length === 0) return [] as Array<{ id: number; title: string; albumTitle: string }>;

    const titlePlaceholders = pairs.map(() => '?').join(',');
    const albumPlaceholders = pairs.map(() => '?').join(',');

    const sql = `
      SELECT t.id as id, t.title as title, a.title as albumTitle
      FROM tracks t
      JOIN albums a ON a.id = t.album_id
      WHERE t.title IN (${titlePlaceholders})
        AND a.title IN (${albumPlaceholders})
    `;

    const params: string[] = [...pairs.map(p => p.title), ...pairs.map(p => p.albumTitle)];
    const rows = queryAll<{ id: number; title: string; albumTitle: string }>(sql, params);

    return rows.map(r => ({ id: r.id, title: r.title, albumTitle: r.albumTitle }));
  },

  findTracksByTitles: (titles: string[]) => {
    if (!titles || titles.length === 0) return [] as Array<{ id: number; title: string }>;

    const placeholders = titles.map(() => '?').join(',');
    const sql = `SELECT id, title FROM tracks WHERE title IN (${placeholders})`;
    const rows = queryAll<{ id: number; title: string }>(sql, titles);
    return rows.map(r => ({ id: r.id, title: r.title }));
  },

  findUnusedTracks: () => {
    const sql = `
      SELECT t.id
      FROM tracks t
      WHERE t.is_edited = 0
      AND t.id NOT IN (
        SELECT DISTINCT track_id
        FROM analytics_listens
        WHERE track_id IS NOT NULL
      )
    `;
    return queryAll<{ id: number }>(sql);
  },
};

export default Track;
