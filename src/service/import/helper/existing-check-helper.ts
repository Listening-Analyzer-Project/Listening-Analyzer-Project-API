import { queryAll } from '@/utils';

/**
 * Résultat générique de check existence
 */
export type ExistsMap = Record<string, number>; // normalizedKey -> id

/**
 * Normalise une chaîne pour lookup (trim + lowercase)
 */
const normalize = (s?: string | null) => (s ?? '').trim().toLowerCase();

/**
 * Fonction générique : recherche les enregistrements existants dans une table
 * pour une colonne donnée (utilise IN (...)). Retourne mapping normalizedValue -> id.
 *
 * ATTENTION : ne construit pas de SQL si values est vide.
 */
export const checkExistsByColumn = (params: {
  table: string;
  column: string;
  values: string[]; // valeurs brutes
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
 * Requête spécialisée pour tracks en tentant de matcher sur title + album.title
 *
 * - groups: tableau d'objets { title, albumTitle, key } (cf groupedTitleAlbumPairs)
 *
 * Comportement :
 * 1) Si au moins un group a albumTitle -> on fait une requête JOIN tracks <> albums pour matcher (title + album.title) en bulk.
 * 2) On récupère ensuite (si nécessaire) les titres simples restants et on fait un second SELECT WHERE title IN (...) pour récupérer d'autres tracks qui n'ont pas d'album renseigné.
 *
 * Retour :
 * {
 *   byKey: Record<groupKey, trackId | undefined>,
 *   existingTrackRows: Array<{ id, title, albumTitle }>
 * }
 *
 * Important : on normalise les titres/albums (lowercase) pour le matching côté JS.
 */
export const findExistingTracks = (groups: Array<{ title: string; albumTitle: string | null; key: string }>) => {
  const byKey: Record<string, number | undefined> = {};
  if (!groups || groups.length === 0) return { byKey, existingRows: [] as Array<{ id: number; title: string; albumTitle: string | null }> };

  // Séparer groupes avec albumTitle et sans albumTitle
  const withAlbum = groups.filter(g => g.albumTitle && g.albumTitle.trim() !== '');
  const withoutAlbum = groups.filter(g => !g.albumTitle || g.albumTitle.trim() === '');

  const existingRows: Array<{ id: number; title: string; albumTitle: string | null }> = [];

  // 1) MATCH title + album.title via JOIN
  if (withAlbum.length > 0) {
    // construire placeholders
    const titlePlaceholders = withAlbum.map(() => '?').join(',');
    const albumPlaceholders = withAlbum.map(() => '?').join(',');

    // Requête : joint tracks -> albums et filtre sur (tracks.title IN (...)) AND (albums.title IN (...))
    // Note : cette requête peut renvoyer correspondances croisées si plusieurs titres/album combinés existent (rare),
    // on post-filterera côté JS en normalisant title+album pair.
    const sql = `
      SELECT t.id as id, t.title as title, a.title as albumTitle
      FROM tracks t
      JOIN albums a ON a.id = t.album_id
      WHERE t.title IN (${titlePlaceholders})
        AND a.title IN (${albumPlaceholders})
    `;
    const rows = queryAll<{ id: number; title: string; albumTitle: string }>(
      sql,
      // concaténation : on fournit two lists; on envoie d'abord les titles, puis les album titles
      [...withAlbum.map(g => g.title), ...withAlbum.map(g => g.albumTitle as string)]
    );

    for (const r of rows) {
      existingRows.push({ id: r.id, title: r.title, albumTitle: r.albumTitle });
    }

    // map rows -> keys
    const lookup = new Map<string, number>();
    for (const r of existingRows) {
      const key = `${normalize(r.title)}||${normalize(r.albumTitle ?? '')}`;
      lookup.set(key, r.id);
    }
    for (const g of withAlbum) {
      const k = `${normalize(g.title)}||${normalize(g.albumTitle ?? '')}`;
      byKey[g.key] = lookup.get(k);
    }
  }

  // 2) MATCH remaining by title only
  const remaining = withoutAlbum.concat(
    groups.filter(g => g.albumTitle && g.albumTitle.trim() !== '' && byKey[g.key] === undefined).map(g => g)
  );
  const remainingTitles = Array.from(new Set(remaining.map(g => g.title)));
  if (remainingTitles.length > 0) {
    const placeholders = remainingTitles.map(() => '?').join(',');
    const sql = `SELECT id, title FROM tracks WHERE title IN (${placeholders})`;
    const rows = queryAll<{ id: number; title: string }>(sql, remainingTitles);

    // add to existingRows (albumTitle null here)
    for (const r of rows) {
      existingRows.push({ id: r.id, title: r.title, albumTitle: null });
    }

    // build lookup title -> id (lowercased)
    const titleLookup = new Map<string, number>();
    for (const r of rows) {
      titleLookup.set(normalize(r.title), r.id);
    }

    for (const g of remaining) {
      const id = titleLookup.get(normalize(g.title));
      byKey[g.key] = id;
    }
  }

  return { byKey, existingRows };
};
