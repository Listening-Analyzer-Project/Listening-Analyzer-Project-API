import { queryAll, queryOne, runQuery } from '@/utils';
import { ICountry } from '@/type';

const Country = {
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
};

export default Country;