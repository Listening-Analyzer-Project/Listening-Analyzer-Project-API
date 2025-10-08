import { queryAll, queryOne, runQuery } from '@/utils';
import { IGeographicalRegion } from '@/type';

const GeographicalRegion = {
    getAll: () => queryAll<IGeographicalRegion>('SELECT * FROM geographical_region'),

    getById: (id: number) => queryOne<IGeographicalRegion>('SELECT * FROM geographical_region WHERE id = ?', [id]),

    create: (region: IGeographicalRegion) => {
        const info = runQuery(
            'INSERT INTO geographical_region (name) VALUES (?)',
            [region.name]
        );
        return { id: info.lastInsertRowid };
    },

    update: (id: number, region: IGeographicalRegion) => {
        const info = runQuery(
            'UPDATE geographical_region SET name = ? WHERE id = ?',
            [region.name, id]
        );
        return { changes: info.changes };
    },

    delete: (id: number) => {
        const info = runQuery('DELETE FROM geographical_region WHERE id = ?', [id]);
        return { changes: info.changes };
    },
};

export default GeographicalRegion;