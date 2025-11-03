import { queryAll, queryOne, runQuery, runTransaction } from '@/utils';
import { ITag } from '@/type';

const Tag = {
  /** -----------------------------
   *   Fonctions internes au model
   *  ----------------------------- */
  _insertTag(tag: ITag) {
    return runQuery(
      `INSERT INTO tag (name) VALUES (?)`,
      [tag.name]
    );
  },

  _deleteByIds(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) return { changes: 0 };

    const placeholders = ids.map(() => '?').join(', ');
    const sql = `DELETE FROM tag WHERE id IN (${placeholders})`;
    return runQuery(sql, ids);
  },

  /** -----------------------------
   *   Fonctions publiques (CRUD)
   *  ----------------------------- */
  getAll: () => queryAll<ITag>('SELECT * FROM tag'),

  getById: (id: number) => queryOne<ITag>('SELECT * FROM tag WHERE id = ?', [id]),

  create: (tag: ITag) => {
    const info = Tag._insertTag(tag);
    return { id: info.lastInsertRowid, ...tag };
  },

  createMany: (tags: ITag[]) => {
    if (!Array.isArray(tags) || tags.length === 0) {
      return { insertedCount: 0 };
    }

    runTransaction(() => {
      for (const tag of tags) {
        Tag._insertTag(tag);
      }
    });

    return {
      insertedCount: tags.length,
    };
  },

  update: (id: number, tag: ITag) => {
    const info = runQuery(
      `UPDATE tag SET name = ? WHERE id = ?`,
      [tag.name, id]
    );
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = Tag._deleteByIds([id]);
    return { changes: info.changes };
  },

  deleteMany: (ids: number[]) => {
    const info = Tag._deleteByIds(ids);
    return {
      deletedCount: info.changes ?? 0,
      message: `${info.changes ?? 0} tags deleted successfully`,
    };
  },
};

export default Tag;
