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
        loudness, mode, speechiness, tempo, time_signature, valence
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      return { insertedCount: 0 };
    }
    runTransaction(() => {
      for (const track of tracks) {
        Track._insertTrack(track);
      }
    });

    return {
      insertedCount: tracks.length,
    };
  },

  update: (id: number, track: ITrack) => {
    const info = runQuery(
      `UPDATE tracks SET
        title = ?, duration_ms = ?, album_id = ?, explicit = ?, popularity = ?, sub_genre_id = ?,
        acousticness = ?, danceability = ?, energy = ?, instrumentalness = ?, key = ?, liveness = ?,
        loudness = ?, mode = ?, speechiness = ?, tempo = ?, time_signature = ?, valence = ?
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
};

export default Track;
