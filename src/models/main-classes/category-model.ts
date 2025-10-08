import db from '../../database';
import { ICategory } from '../../type/bdd-type';

const Category = {
  getAll: () => {
    const stmt = db.prepare('SELECT * FROM category');
    return stmt.all(); // renvoie directement un tableau
  },

  getById: (id: number) => {
    const stmt = db.prepare('SELECT * FROM category WHERE id = ?');
    return stmt.get(id); // renvoie directement un objet ou undefined
  },

  create: (category: ICategory) => {
    const stmt = db.prepare('INSERT INTO category (name) VALUES (?)');
    const result = stmt.run(category.name);
    return { id: result.lastInsertRowid, ...category };
  },

  update: (id: number, category: ICategory) => {
    const stmt = db.prepare('UPDATE category SET name = ? WHERE id = ?');
    stmt.run(category.name, id);
    return { id, ...category };
  },

  delete: (id: number) => {
    const stmt = db.prepare('DELETE FROM category WHERE id = ?');
    stmt.run(id);
    return { id };
  },
};

export default Category;
