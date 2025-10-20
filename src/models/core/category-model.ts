import { queryAll, queryOne, runQuery } from '@/utils';
import { ICategory } from '@/type';

const Category = {
  getAll: () => queryAll<ICategory>('SELECT * FROM categories'),

  getById: (id: number) => queryOne<ICategory>('SELECT * FROM categories WHERE id = ?', [id]),

  create: (category: ICategory) => {
    const info = runQuery('INSERT INTO categories (name) VALUES (?)', [category.name]);
    return { id: info.lastInsertRowid, ...category };
  },

  update: (id: number, category: ICategory) => {
    const info = runQuery('UPDATE categories SET name = ? WHERE id = ?', [category.name, id]);
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = runQuery('DELETE FROM categories WHERE id = ?', [id]);
    return { changes: info.changes };
  },
};

export default Category;