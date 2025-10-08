import { queryAll, queryOne, runQuery } from '@/utils';
import { ICountry } from '@/type';

const Country = {
  getAll: () => queryAll<ICountry>('SELECT * FROM country'),

  getById: (id: number) => queryOne<ICountry>('SELECT * FROM country WHERE id = ?', [id]),

  create: (country: ICountry) => {
    const info = runQuery('INSERT INTO country (name) VALUES (?)', [country.name]);
    return { id: info.lastInsertRowid, ...country };
  },

  update: (id: number, country: ICountry) => {
    const info = runQuery('UPDATE country SET name = ? WHERE id = ?', [country.name, id]);
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = runQuery('DELETE FROM country WHERE id = ?', [id]);
    return { changes: info.changes };
  },
};

export default Country;