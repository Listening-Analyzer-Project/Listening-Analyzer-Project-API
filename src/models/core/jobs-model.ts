import { queryAll, queryOne, runQuery } from '@/utils';
import { IJob } from '@/type';

const Job = {
    getAll: () => queryAll<IJob>('SELECT * FROM jobs'),
    getById: (id: number) => queryOne<IJob>('SELECT * FROM jobs WHERE id = ?', [id]),
    create: (job: IJob) => {
        const info = runQuery(
            'INSERT INTO jobs (name, user_id, progress, phase) VALUES (?, ?, ?, ?)',
            [job.name, job.user_id, job.progress, job.phase]
        );
        return { id: info.lastInsertRowid };
    },
    update: (id: number, job: IJob) => {
        const info = runQuery(
            'UPDATE jobs SET name = ?, user_id = ?, progress = ?, phase = ? WHERE id = ?',
            [job.name, job.user_id, job.progress, job.phase, id]
        );
        return { changes: info.changes };
    },
    delete: (id: number) => {
        const info = runQuery('DELETE FROM jobs WHERE id = ?', [id]);
        return { changes: info.changes };
    },
};

export default Job;
