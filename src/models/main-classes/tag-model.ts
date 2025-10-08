import { queryAll, queryOne, runQuery } from '../../utils/db-helpers';
import { ITag } from '../../type/bdd-type';

const Tag = {
    getAll: () => queryAll<ITag>('SELECT * FROM tag'),

    getById: (id: number) => queryOne<ITag>('SELECT * FROM tag WHERE id = ?', [id]),

    create: (tag: ITag) => {
        const info = runQuery(
            'INSERT INTO tag (name) VALUES (?)',
            [tag.name]
        );
        return { id: info.lastInsertRowid, ...tag };
    },

    update: (id: number, tag: ITag) => {
        const info = runQuery(
            'UPDATE tag SET name = ? WHERE id = ?',
            [tag.name, id]
        );
        return { id, ...tag };
    },

    delete: (id: number) => {
        const info = runQuery('DELETE FROM tag WHERE id = ?', [id]);
        return { id };
    },
};

export default Tag;