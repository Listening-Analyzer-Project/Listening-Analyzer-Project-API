import db from '../database';
import { IEvent } from '../type/bdd-type';

const Event = {
  getAll: () => {
    const stmt = db.prepare('SELECT * FROM event');
    return stmt.all(); // renvoie directement un tableau
  },

  getById: (id: number) => {
    const stmt = db.prepare('SELECT * FROM event WHERE id = ?');
    return stmt.get(id); // renvoie directement un objet ou undefined
  },

  create: (event: IEvent) => {
    const stmt = db.prepare('INSERT INTO event (start_date, end_date, category_id, user_id, description) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(event.start_date, event.end_date, event.category_id, event.user_id, event.description); // renvoie info.lastInsertRowid
    return { id: result.lastInsertRowid };
  },

  update: (id: number, event: IEvent) => {
    const stmt = db.prepare('UPDATE event SET start_date = ?, end_date = ?, category_id = ?, user_id = ?, description = ? WHERE id = ?');
    const info = stmt.run(event.start_date, event.end_date, event.category_id, event.user_id, event.description, id);
    return { changes: info.changes };
  },

  delete: (id: number) => {
    const stmt = db.prepare('DELETE FROM event WHERE id = ?');
    const info = stmt.run(id);
    return { changes: info.changes };
  },
};

export default Event;
