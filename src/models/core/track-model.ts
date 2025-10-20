import { ITrack } from '@/type';
import { queryAll, queryOne, runQuery } from '@/utils';

const Track = {
  getAll: () => queryAll<ITrack>('SELECT * FROM tracks'),

  getById: (id: number) => queryOne<ITrack>('SELECT * FROM tracks WHERE id = ?', [id]),

  create: (track: ITrack) => {
    const info = runQuery(
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
    return { id: info.lastInsertRowid };
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
    const info = runQuery('DELETE FROM tracks WHERE id = ?', [id]);
    return { changes: info.changes };
  },
};

export default Track;
