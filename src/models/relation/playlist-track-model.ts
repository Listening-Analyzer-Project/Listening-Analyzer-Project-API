import { IPlaylistTrack } from '@/type';
import { queryAll, queryOne, runQuery } from '@/utils';

const PlaylistTrack = {
  getAll: () => queryAll<IPlaylistTrack>('SELECT * FROM playlist_track'),

  getByTrackId: (track_id: number) =>
    queryAll<IPlaylistTrack>('SELECT * FROM playlist_track WHERE track_id = ?', [track_id]),

  getByPlaylistId: (playlist_id: number) =>
    queryAll<IPlaylistTrack>('SELECT * FROM playlist_track WHERE playlist_id = ?', [playlist_id]),

  create: (playlistTrack: IPlaylistTrack) => {
    const info = runQuery(
      'INSERT INTO playlist_track (track_id, playlist_id) VALUES (?, ?)',
      [playlistTrack.track_id, playlistTrack.playlist_id]
    );
    return { changes: info.changes };
  },

  delete: (track_id: number, playlist_id: number) => {
    const info = runQuery(
      'DELETE FROM playlist_track WHERE track_id = ? AND playlist_id = ?',
      [track_id, playlist_id]
    );
    return { changes: info.changes };
  },
};

export default PlaylistTrack;
