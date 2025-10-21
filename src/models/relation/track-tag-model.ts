import { ITrackTag } from '@/type';
import { queryAll, runQuery, runTransaction } from '@/utils';

const TrackTag = {
  /** -----------------------------
   *   Fonctions internes au model
   *  ----------------------------- */
  _insertTrackTag(trackTag: ITrackTag) {
    return runQuery(
      `INSERT INTO track_tag (track_id, tag_id) VALUES (?, ?)`,
      [trackTag.track_id, trackTag.tag_id]
    );
  },

  _deleteByPairs(pairs: { track_id: number; tag_id: number }[]) {
    if (!Array.isArray(pairs) || pairs.length === 0) return { changes: 0 };

    let totalChanges = 0;
    runTransaction(() => {
      for (const pair of pairs) {
        const info = runQuery(
          `DELETE FROM track_tag WHERE track_id = ? AND tag_id = ?`,
          [pair.track_id, pair.tag_id]
        );
        totalChanges += info.changes ?? 0;
      }
    });
    return { changes: totalChanges };
  },

  /** -----------------------------
   *  Fonctions publiques
   *  ----------------------------- */
  getAll: () => queryAll<ITrackTag>('SELECT * FROM track_tag'),

  getByTrackId: (track_id: number) =>
    queryAll<ITrackTag>('SELECT * FROM track_tag WHERE track_id = ?', [track_id]),

  getByTagId: (tag_id: number) =>
    queryAll<ITrackTag>('SELECT * FROM track_tag WHERE tag_id = ?', [tag_id]),

  create: (trackTag: ITrackTag) => {
    const info = TrackTag._insertTrackTag(trackTag);
    return { changes: info.changes };
  },

  createMany: (trackTags: ITrackTag[]) => {
    if (!Array.isArray(trackTags) || trackTags.length === 0) {
      return { insertedCount: 0 };
    }
    runTransaction(() => {
      for (const tt of trackTags) {
        TrackTag._insertTrackTag(tt);
      }
    });

    return { insertedCount: trackTags.length };
  },

  delete: (track_id: number, tag_id: number) => {
    const info = TrackTag._deleteByPairs([{ track_id, tag_id }]);
    return { changes: info.changes };
  },

  deleteMany: (pairs: { track_id: number; tag_id: number }[]) => {
    const info = TrackTag._deleteByPairs(pairs);
    return {
      deletedCount: info.changes ?? 0,
      message: `${info.changes ?? 0} track-tag relations deleted successfully`,
    };
  },
};

export default TrackTag;
