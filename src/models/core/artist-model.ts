import { queryAll, queryOne, runQuery } from '@/utils';
import { IArtist } from '@/type';

const Artist = {
  getAll: () => queryAll<IArtist>('SELECT * FROM artists'),

  getById: (id: number) => queryOne<IArtist>('SELECT * FROM artists WHERE id = ?', [id]),

  create: (artist: IArtist) => {
    const info = runQuery('INSERT INTO artists (name, image_uri, popularity, country_id, type, birth) VALUES (?, ?, ?, ?, ?, ?)', [artist.name, artist.image_uri, artist.popularity, artist.country_id, artist.type, artist.birth]);
    return { id: info.lastInsertRowid, ...artist };
  },

  update: (id: number, artist: IArtist) => {
    const info = runQuery('UPDATE artists SET name = ?, image_uri = ?, popularity = ?, country_id = ?, type = ?, birth = ? WHERE id = ?', [artist.name, artist.image_uri, artist.popularity, artist.country_id, artist.type, artist.birth, id]);
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = runQuery('DELETE FROM artists WHERE id = ?', [id]);
    return { changes: info.changes };
  },
};

export default Artist;