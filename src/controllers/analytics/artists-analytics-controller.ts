import { Request, Response } from 'express';
import ArtistAnalytics from '@/models/analytics/artists-analytics-model';

const getArtistsAnalytics = (req: Request, res: Response) => {
    const search = req.query.search?.toString() || '';
    const order_by = req.query.order_by?.toString() || 'valid_listens';
    const order_dir = req.query.order_dir?.toString() || 'desc';
    const limit = parseInt(req.query.limit?.toString() || '50', 10);
    const offset = parseInt(req.query.offset?.toString() || '0', 10);

    const data = ArtistAnalytics.getArtistsAnalytics(search, order_by, order_dir, limit, offset);

    res.json({
      total_count: data.length > 0 ? data[0].total_count : 0,
      data: data.map(({ total_count, ...artistAnalytics }) => artistAnalytics),
    });
};

export default {
    getArtistsAnalytics,
};
