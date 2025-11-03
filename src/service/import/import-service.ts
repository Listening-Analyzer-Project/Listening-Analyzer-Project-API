import { runTransaction, dropIndexes, createIndexes } from '@/utils';
import { groupByTrack, groupedTitleAlbumPairs } from './helper/grouping-helper';
import { findExistingTracks, checkExistsByColumn } from './helper/existing-check-helper';

import GenreModel from './../../models/core/genre-model';
import SubGenreModel from './../../models/core/sub-genre-model';
import AlbumModel from './../../models/core/album-model';
import ArtistModel from './../../models/core/artist-model';
import TagModel from './../../models/core/tag-model';
import TrackModel from './../../models/core/track-model';
import TrackArtistModel from './../../models/relation/track-artist-model';
import TrackTagModel from './../../models/relation/track-tag-model';
import ListenModel from './../../models/core/listen-model';

import type {
  CanonicalListen,
  GroupedTrack,
  IGenre,
  ISubGenre,
  IAlbum,
  IArtist,
  ITag,
  ITrack,
  ITrackArtist,
  ITrackTag,
  IListen,
} from '@/type';

/**
 * Utility : chunk an array into parts of size n
 */
const chunkArray = <T>(arr: T[], size = 500): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const normalize = (s?: string | null) => (s ?? '').trim().toLowerCase();

/**
 * Service principal d'import
 */
export const importService = {
  async importCanonicalListens(batch: CanonicalListen[], userId: number): Promise<any> {
    if (!Array.isArray(batch) || batch.length === 0) {
      return {
        totalListens: 0,
        existingTrackGroups: 0,
        newTrackGroups: 0,
        insertedGenres: 0,
        insertedSubGenres: 0,
        insertedAlbums: 0,
        insertedArtists: 0,
        insertedTags: 0,
        insertedTracks: 0,
        insertedTrackArtists: 0,
        insertedTrackTags: 0,
        insertedListens: 0,
      };
    }
   
    dropIndexes();
 
    // 1) Grouper par track (clé configurable)
    const groupsMap = groupByTrack(batch);

    // 2) Construire pairs (title, albumTitle, key) pour checker existence
    const pairs = groupedTitleAlbumPairs(groupsMap);

    // 3) Trouver tracks existants en base (title+album puis title)
    const pairChunks = chunkArray(pairs, 500);
    const byKeyAccum: Record<string, number | undefined> = {};
    const existingRowsAccum: Array<{ id: number; title: string; albumTitle: string | null }> = [];

    for (const chunk of pairChunks) {
      const { byKey, existingRows } = findExistingTracks(chunk);
      Object.assign(byKeyAccum, byKey);
      existingRowsAccum.push(...existingRows);
    }

    // 4) Séparer groupes existants / nouveaux
    const existingGroups: Array<{ key: string; group: GroupedTrack; trackId: number }> = [];
    const newGroups: Array<{ key: string; group: GroupedTrack }> = [];

    for (const [key, grouped] of groupsMap.entries()) {
      const id = byKeyAccum[key];
      if (id !== undefined && id !== null) {
        existingGroups.push({ key, group: grouped, trackId: id });
      } else {
        newGroups.push({ key, group: grouped });
      }
    }

    let insertedGenres = 0;
    let insertedSubGenres = 0;
    let insertedAlbums = 0;
    let insertedArtists = 0;
    let insertedTags = 0;
    let insertedTracks = 0;
    let insertedTrackArtists = 0;
    let insertedTrackTags = 0;
    let insertedListens = 0;

    // 5) Préparer inserts pour les groups existants (seulement listens)
    const listensToInsert_existing: IListen[] = [];
    for (const eg of existingGroups) {
      for (const listen of eg.group.listens) {
        listensToInsert_existing.push({
          ts: listen.ts,
          platform: listen.platform,
          ms_played: listen.ms_played,
          track_id: eg.trackId,
          user_id: userId,
          reason_end: listen.reason_end ?? null,
        } as IListen);
      }
    }

    // 6) Pour les nouveaux groupes, collecter entités uniques à insérer
    const genresSet = new Set<string>();
    const subGenreToGenre = new Map<string, string>(); // subgenre -> genre
    const albumsMap = new Map<string, IAlbum>();
    const artistsMap = new Map<string, IArtist>();
    const tagsSet = new Set<string>();
    const newTrackEntries: Array<{ key: string; group: GroupedTrack }> = [];

    for (const ng of newGroups) {
      const { group, key } = ng;
      const t = group.track;

      // genres / sub_genres
      if (t.genre) genresSet.add(t.genre);
      if (t.sub_genre) {
        subGenreToGenre.set(t.sub_genre, t.genre ?? '');
      }

      // albums
      if (t.album?.title) {
        const title = t.album.title.trim();
        if (!albumsMap.has(title)) {
          albumsMap.set(title, {
            title,
            release_date: t.album.release_date ?? null,
            image_uri: t.album.image_uri ?? null,
            popularity: t.album.popularity ?? null,
          } as IAlbum);
        }
      }

      // artists
      for (const a of t.artists || []) {
        const name = a.name.trim();
        if (!artistsMap.has(name)) {
          artistsMap.set(name, {
            name,
            image_uri: a.image_uri ?? null,
            popularity: a.popularity ?? null,
            type: (a.type as any) ?? null,
            birth: a.birth ?? null,
          } as IArtist);
        }
      }

      // tags
      for (const tg of t.tags || []) tagsSet.add(tg);

      newTrackEntries.push({ key, group });
    }

    // We'll use checkExistsByColumn (which returns normalizedValue -> id) and create missing via model.createMany
    await runTransaction(() => {
      // ----- 6.1 GENRES -----
      const genreNames = Array.from(genresSet);
      let genresMap: Record<string, number> = {};
      if (genreNames.length > 0) {
        for (const chunk of chunkArray(genreNames, 500)) {
          const existing = checkExistsByColumn({ table: 'genres', column: 'name', values: chunk });
          Object.assign(genresMap, existing);
        }
        const missingGenres = genreNames.filter(n => genresMap[normalize(n)] === undefined).map(n => ({ name: n } as IGenre));
        if (missingGenres.length > 0) {
          GenreModel.createMany(missingGenres);
          insertedGenres += missingGenres.length;
        }
        for (const chunk of chunkArray(genreNames, 500)) {
          const m = checkExistsByColumn({ table: 'genres', column: 'name', values: chunk });
          Object.assign(genresMap, m);
        }
      }

      // ----- 6.2 SUBGENRES -----
      const subNames = Array.from(subGenreToGenre.keys());
      let subGenresMap: Record<string, number> = {};
      if (subNames.length > 0) {
        for (const chunk of chunkArray(subNames, 500)) {
          const existing = checkExistsByColumn({ table: 'sub_genres', column: 'name', values: chunk });
          Object.assign(subGenresMap, existing);
        }
        const missingSubs: ISubGenre[] = [];
        for (const subName of subNames) {
          if (subGenresMap[normalize(subName)] !== undefined) continue;
          const parentGenreName = subGenreToGenre.get(subName) ?? '';
          const genreId = genresMap[normalize(parentGenreName)];
          missingSubs.push({ name: subName, genre_id: genreId ?? null } as ISubGenre);
        }
        if (missingSubs.length > 0) {
          SubGenreModel.createMany(missingSubs);
          insertedSubGenres += missingSubs.length;
        }
        for (const chunk of chunkArray(subNames, 500)) {
          const m = checkExistsByColumn({ table: 'sub_genres', column: 'name', values: chunk });
          Object.assign(subGenresMap, m);
        }
      }

      // ----- 6.3 ALBUMS -----
      const albumTitles = Array.from(albumsMap.keys());
      let albumsIdMap: Record<string, number> = {};
      if (albumTitles.length > 0) {
        for (const chunk of chunkArray(albumTitles, 500)) {
          const existing = checkExistsByColumn({ table: 'albums', column: 'title', values: chunk });
          Object.assign(albumsIdMap, existing);
        }
        const missingAlbums = albumTitles
          .filter(t => albumsIdMap[normalize(t)] === undefined)
          .map(t => albumsMap.get(t) as IAlbum);
        if (missingAlbums.length > 0) {
          AlbumModel.createMany(missingAlbums);
          insertedAlbums += missingAlbums.length;
        }
        for (const chunk of chunkArray(albumTitles, 500)) {
          const m = checkExistsByColumn({ table: 'albums', column: 'title', values: chunk });
          Object.assign(albumsIdMap, m);
        }
      }

      // ----- 6.4 ARTISTS -----
      const artistNames = Array.from(artistsMap.keys());
      let artistsIdMap: Record<string, number> = {};
      if (artistNames.length > 0) {
        for (const chunk of chunkArray(artistNames, 500)) {
          const existing = checkExistsByColumn({ table: 'artists', column: 'name', values: chunk });
          Object.assign(artistsIdMap, existing);
        }
        const missingArtists = artistNames
          .filter(n => artistsIdMap[normalize(n)] === undefined)
          .map(n => artistsMap.get(n) as IArtist);
        if (missingArtists.length > 0) {
          ArtistModel.createMany(missingArtists);
          insertedArtists += missingArtists.length;
        }
        for (const chunk of chunkArray(artistNames, 500)) {
          const m = checkExistsByColumn({ table: 'artists', column: 'name', values: chunk });
          Object.assign(artistsIdMap, m);
        }
      }

      // ----- 6.5 TAGS -----
      const tagNames = Array.from(tagsSet);
      let tagsIdMap: Record<string, number> = {};
      if (tagNames.length > 0) {
        for (const chunk of chunkArray(tagNames, 500)) {
          const existing = checkExistsByColumn({ table: 'tag', column: 'name', values: chunk });
          Object.assign(tagsIdMap, existing);
        }
        const missingTags = tagNames.filter(t => tagsIdMap[normalize(t)] === undefined).map(t => ({ name: t } as ITag));
        if (missingTags.length > 0) {
          TagModel.createMany(missingTags);
          insertedTags += missingTags.length;
        }
        for (const chunk of chunkArray(tagNames, 500)) {
          const m = checkExistsByColumn({ table: 'tag', column: 'name', values: chunk });
          Object.assign(tagsIdMap, m);
        }
      }

      // ----- 6.6 TRACKS (création) -----
      const tracksToCreate: ITrack[] = newTrackEntries.map(n => {
        const t = n.group.track;
        const albumTitle = t.album?.title ? t.album.title.trim() : null;
        const subName = t.sub_genre ?? null;

        const albumId = albumTitle ? albumsIdMap[normalize(albumTitle)] ?? null : null;
        const subGenreId = subName ? subGenresMap[normalize(subName)] ?? null : null;

        return {
          title: t.title,
          duration_ms: t.duration_ms ?? null,
          album_id: albumId,
          explicit: t.explicit ? 1 : 0,
          sub_genre_id: subGenreId,
          acousticness: t.acousticness ?? null,
          danceability: t.danceability ?? null,
          energy: t.energy ?? null,
          instrumentalness: t.instrumentalness ?? null,
          key: t.key ?? null,
          liveness: t.liveness ?? null,
          loudness: t.loudness ?? null,
          mode: t.mode ?? null,
          speechiness: t.speechiness ?? null,
          tempo: t.tempo ?? null,
          time_signature: t.time_signature ?? null,
          valence: t.valence ?? null,
          is_edited: t.is_edited ? 1 : 0,
        } as ITrack;
      });

      if (tracksToCreate.length > 0) {
        TrackModel.createMany(tracksToCreate);
        insertedTracks += tracksToCreate.length;
      }

      // ----- 6.7 Résoudre les nouveaux track ids (après insert) -----
      const newPairs = newTrackEntries.map(n => {
        const title = n.group.track.title;
        const albumTitle = n.group.track.album?.title ?? null;
        return { title, albumTitle, key: n.key };
      });

      const newByKey: Record<string, number | undefined> = {};
      for (const chunk of chunkArray(newPairs, 500)) {
        const { byKey } = findExistingTracks(chunk);
        Object.assign(newByKey, byKey);
      }

      // ----- 6.8 Relations: track_artists & track_tags -----
      const trackArtistsToCreate: ITrackArtist[] = [];
      const trackTagsToCreate: ITrackTag[] = [];

      for (const n of newTrackEntries) {
        const trackId = newByKey[n.key];
        if (!trackId) continue;

        for (const a of n.group.track.artists || []) {
          const artId = artistsIdMap[normalize(a.name)];
          if (artId) trackArtistsToCreate.push({ track_id: trackId, artist_id: artId, is_primary: 0 } as ITrackArtist);
        }

        for (const tg of n.group.track.tags || []) {
          const tagId = tagsIdMap[normalize(tg)];
          if (tagId) trackTagsToCreate.push({ track_id: trackId, tag_id: tagId } as ITrackTag);
        }
      }

      if (trackArtistsToCreate.length > 0) {
        TrackArtistModel.createMany(trackArtistsToCreate);
        insertedTrackArtists += trackArtistsToCreate.length;
      }
      if (trackTagsToCreate.length > 0) {
        TrackTagModel.createMany(trackTagsToCreate);
        insertedTrackTags += trackTagsToCreate.length;
      }

      // ----- 6.9 Listens for new tracks -----
      const listensToInsert_new: IListen[] = [];
      for (const n of newTrackEntries) {
        const trackId = newByKey[n.key];
        if (!trackId) continue;
        for (const listen of n.group.listens) {
          listensToInsert_new.push({
            ts: listen.ts,
            platform: listen.platform,
            ms_played: listen.ms_played,
            reason_end: listen.reason_end ?? null,
            track_id: trackId,
            user_id: userId,
          } as IListen);
        }
      }

      // ----- 6.10 Insert all listens (existing + new) -----
      const totalListensToInsert = [
        ...listensToInsert_existing,
        ...(Array.isArray((global as any).__listens_new_chunk) ? [] : []), // noop placeholder
      ];

      // Insert existing listens first
      if (listensToInsert_existing.length > 0) {
        ListenModel.createMany(listensToInsert_existing);
        insertedListens += listensToInsert_existing.length;
      }

      // Insert new listens
      if (listensToInsert_new.length > 0) {
        ListenModel.createMany(listensToInsert_new);
        insertedListens += listensToInsert_new.length;
      }
    });

    createIndexes();

    const result = {
      totalListens: batch.length,
      existingTrackGroups: existingGroups.length,
      newTrackGroups: newGroups.length,
      insertedGenres,
      insertedSubGenres,
      insertedAlbums,
      insertedArtists,
      insertedTags,
      insertedTracks,
      insertedTrackArtists,
      insertedTrackTags,
      insertedListens,
    };

    return result;
  },
};
