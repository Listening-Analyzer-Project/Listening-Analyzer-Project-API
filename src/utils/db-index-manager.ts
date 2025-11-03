import { runQuery } from '@/utils';

/**
 * Liste de tous les index utiles pour optimiser les lectures.
 */
const simpleIndexes = [
  { name: 'idx_listens_track_id', table: 'listens', column: 'track_id' },
  { name: 'idx_listens_user_id', table: 'listens', column: 'user_id' },

  { name: 'idx_tracks_album_id', table: 'tracks', column: 'album_id' },
  { name: 'idx_tracks_sub_genre_id', table: 'tracks', column: 'sub_genre_id' },

  { name: 'idx_artists_country_id', table: 'artists', column: 'country_id' },
  { name: 'idx_artists_name', table: 'artists', column: 'name' },

  { name: 'idx_albums_title', table: 'albums', column: 'title' },

  { name: 'idx_sub_genres_genre_id', table: 'sub_genres', column: 'genre_id' },
];

const composedIndexes = [
  { name: 'idx_track_artists_track_artist', table: 'track_artists', column: 'track_id, artist_id' },
  { name: 'idx_track_tag_track_tag', table: 'track_tag', column: 'track_id, tag_id' },
];

const partialIndexes = [
  { name: 'idx_listens_valid_ms', table: 'listens', column: 'track_id', condition: 'ms_played >= 30000' },
  { name: 'idx_listens_invalid_ms', table: 'listens', column: 'track_id', condition: 'ms_played < 30000' },
];

/**
* Supprime tous les index listés.
*/
export const dropIndexes = () => {
  console.log('Dropping all indexes...');
  const indexes = [...simpleIndexes, ...composedIndexes, ...partialIndexes];
  for (const idx of indexes) {
    runQuery(`DROP INDEX IF EXISTS ${idx.name}`);
  }
  console.log('All indexes dropped.');
};

/**
* Recrée tous les index listés.
*/
export const createIndexes = () => {
  console.log('Creating all indexes...');
  const indexes = [...simpleIndexes, ...composedIndexes];
  for (const idx of indexes) {
    runQuery(`CREATE INDEX IF NOT EXISTS ${idx.name} ON ${idx.table}(${idx.column})`);
  }
  for (const idx of partialIndexes) {
    runQuery(`CREATE INDEX IF NOT EXISTS ${idx.name} ON ${idx.table}(${idx.column}) WHERE ${idx.condition}`);
  }
  console.log('All indexes created.');
};