import { queryAll, queryOne, runQuery } from '@/utils';
import { basicJobPhase, IJob } from '@/type';

const Job = {
    getAll: () => queryAll<IJob>('SELECT * FROM jobs'),
    getById: (id: number) => queryOne<IJob>('SELECT * FROM jobs WHERE id = ?', [id]),

    /**
     * Get the next job to process (FIFO)
     */
    getNextJob: () => queryOne<IJob>(
        `SELECT * FROM jobs 
         WHERE phase IN (${basicJobPhase.NOT_STARTED}, ${basicJobPhase.IN_PROGRESS}) 
         ORDER BY id ASC LIMIT 1`
    ),

    updateCheckpoint: (jobId: number, lastId: number, progress: number) => {
        runQuery(`UPDATE jobs SET last_processed_id = ?, progress = ? WHERE id = ?`, [lastId, progress, jobId]);
    },

    create: (job: IJob) => {
        const info = runQuery(
            'INSERT INTO jobs (name, user_id, progress, phase, type, last_processed_id) VALUES (?, ?, ?, ?, ?, ?)',
            [job.name, job.user_id, job.progress || 0, job.phase || 0, job.type, job.last_processed_id]
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
