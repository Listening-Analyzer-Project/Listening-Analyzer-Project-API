import { queryAll, queryOne, runQuery } from '@/utils';
import { IEvent } from '@/type';

const Event = {
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
};

export default Event;