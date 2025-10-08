import { queryAll, queryOne, runQuery } from '../../utils/db-helpers';
import { ICategory } from '../../type/bdd-type';

const Category = {
  getAll: () => queryAll<ICategory>('SELECT * FROM category'),

  getById: (id: number) => queryOne<ICategory>('SELECT * FROM category WHERE id = ?', [id]),

  create: (category: ICategory) => {
    const info = runQuery('INSERT INTO category (name) VALUES (?)', [category.name]);
    return { id: info.lastInsertRowid, ...category };
  },

  update: (id: number, category: ICategory) => {
    const info = runQuery('UPDATE category SET name = ? WHERE id = ?', [category.name, id]);
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = runQuery('DELETE FROM category WHERE id = ?', [id]);
    return { changes: info.changes };
  },
};

export default Category;