import { queryAll, queryOne, runQuery } from '@/utils';
import { ICountry, ICountryWithRegion, ICountryWithRegionAndStats } from '@/type';

const Country = {
  // =======================
  // CRUD
  // =======================
  getAll: () => queryAll<ICountry>('SELECT * FROM countries'),

  getById: (id: number) => queryOne<ICountry>('SELECT * FROM countries WHERE id = ?', [id]),

  create: (country: ICountry) => {
    const info = runQuery(
      'INSERT INTO countries (name, geographical_region_id) VALUES (?, ?)',
      [country.name, country.geographical_region_id]
    );
    return { id: info.lastInsertRowid, ...country };
  },

  update: (id: number, country: ICountry) => {
    const info = runQuery(
      'UPDATE countries SET name = ?, geographical_region_id = ? WHERE id = ?',
      [country.name, country.geographical_region_id, id]
    );
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = runQuery('DELETE FROM countries WHERE id = ?', [id]);
    return { changes: info.changes };
  },

  // =======================
  // Additional Methods
  // =======================
  getAllWithRegion: (): ICountryWithRegion[] => {
    return queryAll<ICountryWithRegion>(`
      SELECT DISTINCT
        country_id AS id,
        country_name AS name,
        region_id AS "geographical_region.id",
        region_name AS "geographical_region.name"
      FROM analytics_listens
      WHERE country_id IS NOT NULL
      ORDER BY country_name
    `);
  },

  getWithRegionAndStats: (): ICountryWithRegionAndStats[] => {
    return queryAll<ICountryWithRegionAndStats>(`
      SELECT
        country_id AS id,
        country_name AS name,
        region_name AS geographical_region_name,
        COUNT(DISTINCT primary_artist_id) AS total_artists,
        COUNT(listen_id) AS total_listens
      FROM analytics_listens
      WHERE country_id IS NOT NULL
      GROUP BY country_id, country_name, region_name
      ORDER BY total_listens DESC, country_name ASC
    `);
  },
};

export default Country;