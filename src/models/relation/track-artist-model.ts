import { ITrackArtist } from '@/type';
import { queryAll, runQuery } from '@/utils';

const TrackArtist = {
  getAll: () => queryAll<ITrackArtist>('SELECT * FROM track_artist'),

  getByTrackId: (track_id: number) =>
    queryAll<ITrackArtist>('SELECT * FROM track_artist WHERE track_id = ?', [track_id]),

  getByArtistId: (artist_id: number) =>
    queryAll<ITrackArtist>('SELECT * FROM track_artist WHERE artist_id = ?', [artist_id]),

  create: (trackArtist: ITrackArtist) => {
    const info = runQuery(
      'INSERT INTO track_artist (track_id, artist_id, is_primary) VALUES (?, ?, ?)',
      [trackArtist.track_id, trackArtist.artist_id, trackArtist.is_primary ?? 0]
    );
    return { changes: info.changes };
  },

  update: (track_id: number, artist_id: number, trackArtist: ITrackArtist) => {
    const info = runQuery(
      'UPDATE track_artist SET is_primary = ? WHERE track_id = ? AND artist_id = ?',
      [trackArtist.is_primary ?? 0, track_id, artist_id]
    );
    return { changes: info.changes };
  },

  delete: (track_id: number, artist_id: number) => {
    const info = runQuery(
      'DELETE FROM track_artist WHERE track_id = ? AND artist_id = ?',
      [track_id, artist_id]
    );
    return { changes: info.changes };
  },
};

export default TrackArtist;
