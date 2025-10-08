import { queryAll, queryOne, runQuery } from '../../utils/db-helpers';
import { IEvent } from '../../type/bdd-type';

const Event = {
  getAll: () => queryAll<IEvent>('SELECT * FROM event'),

  getById: (id: number) => queryOne<IEvent>('SELECT * FROM event WHERE id = ?', [id]),

  create: (event: IEvent) => {
    const info = runQuery(
      'INSERT INTO event (start_date, end_date, category_id, user_id, description) VALUES (?, ?, ?, ?, ?)',
      [event.start_date, event.end_date, event.category_id, event.user_id, event.description]
    );
    return { id: info.lastInsertRowid };
  },

  update: (id: number, event: IEvent) => {
    const info = runQuery(
      'UPDATE event SET start_date = ?, end_date = ?, category_id = ?, user_id = ?, description = ? WHERE id = ?',
      [event.start_date, event.end_date, event.category_id, event.user_id, event.description, id]
    );
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const info = runQuery('DELETE FROM event WHERE id = ?', [id]);
    return { changes: info.changes };
  },
};

export default Event;