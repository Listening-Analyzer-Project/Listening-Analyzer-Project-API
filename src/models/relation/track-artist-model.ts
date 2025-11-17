import { ITrackArtist } from '@/type';
import { queryAll, runQuery, runTransaction } from '@/utils';

const TrackArtist = {
  /** -----------------------------
   *   Fonctions internes au model
   *  ----------------------------- */
  _insertTrackArtist(trackArtist: ITrackArtist) {
    return runQuery(
      `INSERT INTO track_artists (track_id, artist_id, is_primary)
       VALUES (?, ?, ?)`,
      [trackArtist.track_id, trackArtist.artist_id, trackArtist.is_primary ?? 0]
    );
  },

  _deleteByPairs(pairs: { track_id: number; artist_id: number }[]) {
    if (!Array.isArray(pairs) || pairs.length === 0) return { changes: 0 };

    let totalChanges = 0;
    runTransaction(() => {
      for (const pair of pairs) {
        const info = runQuery(
          `DELETE FROM track_artists WHERE track_id = ? AND artist_id = ?`,
          [pair.track_id, pair.artist_id]
        );
        totalChanges += info.changes ?? 0;
      }
    });
    return { changes: totalChanges };
  },

  /** -----------------------------
   *  Fonctions publiques
   *  ----------------------------- */
  getAll: () => queryAll<ITrackArtist>('SELECT * FROM track_artists'),

  getByTrackId: (track_id: number) =>
    queryAll<ITrackArtist>('SELECT * FROM track_artists WHERE track_id = ?', [track_id]),

  getByArtistId: (artist_id: number) =>
    queryAll<ITrackArtist>('SELECT * FROM track_artists WHERE artist_id = ?', [artist_id]),

  create: (trackArtist: ITrackArtist) => {
    const info = TrackArtist._insertTrackArtist(trackArtist);
    return { changes: info.changes };
  },

  createMany: (trackArtists: ITrackArtist[]) => {
    if (!Array.isArray(trackArtists) || trackArtists.length === 0) {
      return { insertedCount: 0 };
    }
    runTransaction(() => {
      for (const ta of trackArtists) {
        TrackArtist._insertTrackArtist(ta);
      }
    });

    return { insertedCount: trackArtists.length };
  },

  update: (track_id: number, artist_id: number, trackArtist: ITrackArtist) => {
    const info = runQuery(
      `UPDATE track_artists SET is_primary = ? WHERE track_id = ? AND artist_id = ?`,
      [trackArtist.is_primary ?? 0, track_id, artist_id]
    );
    return { changes: info.changes };
  },

  delete: (track_id: number, artist_id: number) => {
    const info = TrackArtist._deleteByPairs([{ track_id, artist_id }]);
    return { changes: info.changes };
  },

  deleteMany: (pairs: { track_id: number; artist_id: number }[]) => {
    const info = TrackArtist._deleteByPairs(pairs);
    return {
      deletedCount: info.changes ?? 0,
      message: `${info.changes ?? 0} track-artist relations deleted successfully`,
    };
  },

  deleteByTrackIds: (trackIds: number[]) => {
    if (!Array.isArray(trackIds) || trackIds.length === 0) return { changes: 0 };
    const placeholders = trackIds.map(() => '?').join(', ');
    const sql = `DELETE FROM track_artists WHERE track_id IN (${placeholders})`;
    const result = runQuery(sql, trackIds);
    return { changes: result.changes ?? 0 };
  }
};

export default TrackArtist;
