import db from '../database';
import { ITag } from '../type/bdd-type';

const Tag = {
    getAll: () => {
        const stmt = db.prepare('SELECT * FROM tag');
        return stmt.all(); // renvoie directement un tableau
    },

    getById: (id: number) => {
        const stmt = db.prepare('SELECT * FROM tag WHERE id = ?');
        return stmt.get(id); // renvoie directement un objet ou undefined
    },

    create: (tag: ITag) => {
        const stmt = db.prepare('INSERT INTO tag (name) VALUES (?)');
        const result = stmt.run(tag.name);
        return { id: result.lastInsertRowid, ...tag };
    },

    update: (id: number, tag: ITag) => {
        const stmt = db.prepare('UPDATE tag SET name = ? WHERE id = ?');
        stmt.run(tag.name, id);
        return { id, ...tag };
    },

    delete: (id: number) => {
        const stmt = db.prepare('DELETE FROM tag WHERE id = ?');
        stmt.run(id);
        return { id };
    },
};

export default Tag;
