import db from '../../database';
import { ICountry } from '../../type/bdd-type';

const Country = {
  getAll: () => {
    const stmt = db.prepare('SELECT * FROM country');
    return stmt.all(); // renvoie directement un tableau
  },

  getById: (id: number) => {
    const stmt = db.prepare('SELECT * FROM country WHERE id = ?');
    return stmt.get(id); // renvoie directement un objet ou undefined
  },

  create: (country: ICountry) => {
    const stmt = db.prepare('INSERT INTO country (name) VALUES (?)');
    const result = stmt.run(country.name);
    return { id: result.lastInsertRowid, ...country };
  },

  update: (id: number, country: ICountry) => {
    const stmt = db.prepare('UPDATE country SET name = ? WHERE id = ?');
    stmt.run(country.name, id);
    return { id, ...country };
  },

  delete: (id: number) => {
    const stmt = db.prepare('DELETE FROM country WHERE id = ?');
    stmt.run(id);
    return { id };
  },
};

export default Country;
