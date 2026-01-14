import { queryAll, queryOne, runQuery } from '@/utils';
import { IJob } from '@/type';

const Job = {
    getAll: () => queryAll<IJob>('SELECT * FROM jobs'),
    getById: (id: number) => queryOne<IJob>('SELECT * FROM jobs WHERE id = ?', [id]),
    create: (job: IJob) => {
        const info = runQuery(
            'INSERT INTO jobs (name, user_id, progress, phase, type) VALUES (?, ?, ?, ?, ?)',
            [job.name, job.user_id, job.progress, job.phase, job.type]
        );
        return { id: info.lastInsertRowid };
    },
    update: (id: number, job: IJob) => {
        const info = runQuery(
            'UPDATE jobs SET name = ?, user_id = ?, progress = ?, phase = ?, type = ? WHERE id = ?',
            [job.name, job.user_id, job.progress, job.phase, job.type, id]
        );
        return { changes: info.changes };
    },
    delete: (id: number) => {
        const info = runQuery('DELETE FROM jobs WHERE id = ?', [id]);
        return { changes: info.changes };
    },
};

export default Job;
