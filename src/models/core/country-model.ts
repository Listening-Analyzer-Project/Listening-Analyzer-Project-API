import { queryAll, queryOne, runQuery } from '@/utils';
import { ICountry, ICountryWithRegion  } from '@/type';

const Country = {
  // =======================
  // CRUD
  // =======================
  getAll: () => queryAll<ICountry>('SELECT * FROM countries'),
    
  getById: (id: number) => queryOne<ICountry>('SELECT * FROM countries WHERE id = ?', [id]),

  create: (country: ICountry) => {
    const info = runQuery('INSERT INTO countries (name, geographical_region_id) VALUES (?, ?)', [country.name, country.geographical_region_id]);
    return { id: info.lastInsertRowid, ...country };
  },

  update: (id: number, country: ICountry) => {
    const info = runQuery('UPDATE countries SET name = ?, geographical_region_id = ? WHERE id = ?', [country.name, country.geographical_region_id, id]);
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = runQuery('DELETE FROM countries WHERE id = ?', [id]);
    return { changes: info.changes };
  },

  // =======================
  // Additional Methods
  // =======================

  getAllWithRegion: (): ICountryWithRegion[] =>
    queryAll<ICountryWithRegion>(`
      SELECT
        c.id,
        c.name,
        gr.id AS "geographical_region.id",
        gr.name AS "geographical_region.name"
      FROM countries c
      LEFT JOIN geographical_regions gr
        ON c.geographical_region_id = gr.id
      ORDER BY c.name
    `),
};

export default Country;