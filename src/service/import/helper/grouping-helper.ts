import type { CanonicalListen, GroupedTrack } from '@/type';

/**
 * Clef pour identifier un track dans un batch.
 * Par défaut : title + (album title si présent)
 * On normalise (trim + lowercase) pour réduire les variations.
 */
const defaultTrackKey = (track: CanonicalListen['track']): string => {
  const title = (track.title ?? '').trim().toLowerCase();
  const albumTitle = (track.album?.title ?? '').trim().toLowerCase();
  return albumTitle ? `${title}||${albumTitle}` : title;
};

/**
 * Regroupe un batch de CanonicalListen par track.
 *
 * @param batch - tableau d'écoutes reçues depuis le front
 * @param keyFn - fonction qui produit la key d'un track (par défaut title + album)
 *
 * @returns Map<key, GroupedTrack>
 */
export const groupByTrack = (
  batch: CanonicalListen[],
): Map<string, GroupedTrack> => {
  const map = new Map<string, GroupedTrack>();

  for (const listen of batch) {
    if (!listen?.track || !listen.track.title) continue;

    const key = defaultTrackKey(listen.track);
    const existing = map.get(key);
    if (existing) {
      existing.listens.push(listen);
    } else {
      map.set(key, {
        track: listen.track,
        listens: [listen],
        key,
      });
    }
  }

  return map;
};

/**
 * Extract keys (liste de clés uniques) depuis le grouping (utile pour construire IN (...) dans la DB).
 */
export const groupedKeys = (groups: Map<string, GroupedTrack>): string[] => {
  return Array.from(groups.keys());
};

/**
 * Option utilitaire : construit un tableau d'objets minimal (title, album) depuis les groupes
 * utile si on veut faire des requêtes plus précises (ex. match title+album).
 */
export const groupedTitleAlbumPairs = (groups: Map<string, GroupedTrack>) =>
  Array.from(groups.values()).map(g => ({
    title: g.track.title,
    albumTitle: g.track.album?.title ?? null,
    key: g.key,
  }));
