import { Request, Response } from 'express';
import AlbumAnalytics from '@/models/analytics/albums-analytics-model';

const getAlbumsAnalytics = (req: Request, res: Response) => {
    const search = req.query.search?.toString() || '';
    const order_by = req.query.order_by?.toString() || 'valid_listens';
    const order_dir = req.query.order_dir?.toString() || 'desc';
    const limit = parseInt(req.query.limit?.toString() || '50', 10);
    const offset = parseInt(req.query.offset?.toString() || '0', 10);


    const results = AlbumAnalytics.getAlbumsAnalytics(search, order_by, order_dir, limit, offset);

    res.json({
        total_count: results.length > 0 ? results[0].total_count : 0,
        data: results.map(({ total_count, ...albumAnalytics }) => albumAnalytics),
    });
};

export default {
    getAlbumsAnalytics,
};
