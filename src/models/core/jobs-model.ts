import { queryAll, queryOne, runQuery } from '@/utils';
import { IJob } from '@/type';

const Job = {
    getAll: () => queryAll<IJob>('SELECT * FROM jobs'),
    getById: (id: number) => queryOne<IJob>('SELECT * FROM jobs WHERE id = ?', [id]),

    /**
     * Get the next job to process (FIFO)
     */
    getNextJob: () => queryOne<IJob>('SELECT * FROM jobs ORDER BY id ASC LIMIT 1'),

    create: (job: IJob) => {
        const info = runQuery(
            'INSERT INTO jobs (name, user_id, progress, phase, type) VALUES (?, ?, ?, ?, ?)',
            [job.name, job.user_id, job.progress || 0, job.phase || 0, job.type]
        );
        return { id: info.lastInsertRowid };
    },
    update: (id: number, job: Partial<IJob>) => {
        // Build dynamic update to allow partial updates (like just progress or phase)
        const fields = Object.keys(job).filter(k => k !== 'id');
        if (fields.length === 0) return { changes: 0 };

        const setClause = fields.map(f => `${f} = ?`).join(', ');
        const values = fields.map(f => (job as any)[f]);

        const info = runQuery(
            `UPDATE jobs SET ${setClause} WHERE id = ?`,
            [...values, id]
        );
        return { changes: info.changes };
    },
    delete: (id: number) => {
        const info = runQuery('DELETE FROM jobs WHERE id = ?', [id]);
        return { changes: info.changes };
    },
};

export default Job;
