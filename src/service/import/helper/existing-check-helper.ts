import { queryAll } from '@/utils';
import { findTracksByTitleAndAlbum, findTracksByTitles } from './../../../models/core/track-model';

const normalize = (s?: string | null) =>
  (s ?? '')
    .trim()
    .replace(/\u2019/g, "'")
    .replace(/\u2018/g, "'")
    .replace(/\s+/g, ' ')
    .toLowerCase();

type ExistsMap = Record<string, number>;

export const checkExistsByColumn = (params: {
  table: string;
  column: string;
  values: string[];
}): ExistsMap => {
  const { table, column, values } = params;
  const result: ExistsMap = {};
  if (!values || values.length === 0) return result;

  const placeholders = values.map(() => '?').join(',');
  const sql = `SELECT id, ${column} as value FROM ${table} WHERE ${column} IN (${placeholders})`;
  const rows = queryAll<{ id: number; value: string }>(sql, values);
  for (const r of rows) {
    result[normalize(r.value)] = r.id;
  }
  return result;
};

/**
 * findExistingTracks :
 * Input: groups: Array<{ title: string; albumTitle: string | null; key: string }>
 * Output: { byKey: Record<key, trackId|undefined>, existingRows: Array<{id, title, albumTitle|null}> }
 */
export const findExistingTracks = (groups: Array<{ title: string; albumTitle: string | null; key: string }>) => {
  const byKey: Record<string, number | undefined> = {};
  const existingRows: Array<{ id: number; title: string; albumTitle: string | null }> = [];

  if (!groups || groups.length === 0) return { byKey, existingRows };

  const withAlbum = groups.filter(g => g.albumTitle && g.albumTitle.trim() !== '');
  const withoutAlbum = groups.filter(g => !g.albumTitle || g.albumTitle.trim() === '');

  // Strict match title + album via Track model
  if (withAlbum.length > 0) {
    const pairs = withAlbum.map(g => ({ title: g.title, albumTitle: g.albumTitle as string }));
    const rows = findTracksByTitleAndAlbum(pairs);
    const lookup = new Map<string, number>();
    for (const r of rows) {
      const k = `${normalize(r.title)}||${normalize(r.albumTitle)}`;
      lookup.set(k, r.id);
      existingRows.push({ id: r.id, title: r.title, albumTitle: r.albumTitle });
    }

    for (const g of withAlbum) {
      const k = `${normalize(g.title)}||${normalize(g.albumTitle ?? '')}`;
      byKey[g.key] = lookup.get(k);
    }
  }

  // title-only match but ONLY for groups that had NO albumTitle
  if (withoutAlbum.length > 0) {
    const uniqueTitles = Array.from(new Set(withoutAlbum.map(g => g.title)));
    if (uniqueTitles.length > 0) {
      const rows = findTracksByTitles(uniqueTitles);
      const titleLookup = new Map<string, number>();
      for (const r of rows) {
        titleLookup.set(normalize(r.title), r.id);
        existingRows.push({ id: r.id, title: r.title, albumTitle: null });
      }
      for (const g of withoutAlbum) {
        const id = titleLookup.get(normalize(g.title));
        byKey[g.key] = id;
      }
    }
  }

  return { byKey, existingRows };
};
