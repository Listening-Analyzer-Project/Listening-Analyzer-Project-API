import { IEvent, IEventWithCategory } from '@/type';
import { queryAll, queryOne, runQuery } from '@/utils';

const Event = {

  // =======================
  // CRUD
  // =======================
  getAll: () => queryAll<IEvent>('SELECT * FROM events'),

  getById: (id: number) => queryOne<IEvent>('SELECT * FROM events WHERE id = ?', [id]),

  create: (event: IEvent) => {
    const info = runQuery(
      'INSERT INTO events (title, start_date, end_date, category_id, user_id, description) VALUES (?, ?, ?, ?, ?, ?)',
      [event.title, event.start_date, event.end_date, event.category_id, event.user_id, event.description]
    );
    return { id: info.lastInsertRowid };
  },

  update: (id: number, event: IEvent) => {
    const info = runQuery(
      'UPDATE events SET title = ?, start_date = ?, end_date = ?, category_id = ?, user_id = ?, description = ? WHERE id = ?',
      [event.title, event.start_date, event.end_date, event.category_id, event.user_id, event.description, id]
    );
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = runQuery('DELETE FROM events WHERE id = ?', [id]);
    return { changes: info.changes };
  },

  getAllbyUserId: (userId: number) => queryAll<IEvent>('SELECT * FROM events WHERE user_id = ?', [userId]),

  deleteMany: (ids: number[]) => {
    if (ids.length === 0) return { deletedCount: 0 };
    const placeholders = ids.map(() => '?').join(',');
    const info = runQuery(`DELETE FROM events WHERE id IN (${placeholders})`, ids);
    return { deletedCount: info.changes };
  },

  // =======================
  // Additional Methods
  // =======================

  getAllWithCategory: ({
    user_id,
    category_id,
    limit,
    offset,
  }: {
    user_id?: number[];
    category_id?: number;
    limit?: number;
    offset?: number;
  }): IEventWithCategory[] => {
    let sql = `
      SELECT
        e.id,
        e.title,
        e.start_date,
        e.end_date,
        e.description,
        u.name AS "user_name",
        c.id AS "category_id",
        c.name AS "category_name"
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      LEFT JOIN user u ON e.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (user_id && user_id.length > 0) {
      const placeholders = user_id.map(() => '?').join(',');
      sql += ` AND (e.user_id IN (${placeholders}) OR e.user_id IS NULL)`;
      params.push(...user_id);
    }

    if (category_id !== undefined) {
      sql += ' AND e.category_id = ?';
      params.push(category_id);
    }

    sql += ' ORDER BY e.start_date DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return queryAll<IEventWithCategory>(sql, params);
  },

};

export default Event;