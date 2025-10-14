import { ITrackTag } from '@/type';
import { queryAll, runQuery } from '@/utils';

const TrackTag = {
  getAll: () => queryAll<ITrackTag>('SELECT * FROM track_tag'),

  getByTrackId: (track_id: number) =>
    queryAll<ITrackTag>('SELECT * FROM track_tag WHERE track_id = ?', [track_id]),

  getByTagId: (tag_id: number) =>
    queryAll<ITrackTag>('SELECT * FROM track_tag WHERE tag_id = ?', [tag_id]),

  create: (trackTag: ITrackTag) => {
    const info = runQuery(
      'INSERT INTO track_tag (track_id, tag_id) VALUES (?, ?)',
      [trackTag.track_id, trackTag.tag_id]
    );
    return { changes: info.changes };
  },

  delete: (track_id: number, tag_id: number) => {
    const info = runQuery(
      'DELETE FROM track_tag WHERE track_id = ? AND tag_id = ?',
      [track_id, tag_id]
    );
    return { changes: info.changes };
  },
};

export default TrackTag;
