import { Request, Response } from 'express';
import ListensAnalytics from '@/models/analytics/listens-analytics-model';

const getListensAnalytics = (req: Request, res: Response) => {
    const page = parseInt(req.query.page?.toString() || '1', 10);
    const limit = parseInt(req.query.limit?.toString() || '10000', 10);
    const offset = (page - 1) * limit;

    const filters = {
      track_id: req.query.track_id?.toString(),
      is_valid: req.query.is_valid !== undefined ? req.query.is_valid?.toString() === 'true' : undefined,
      platform: req.query.platform?.toString(),
      start_date: req.query.start_date?.toString(),
      end_date: req.query.end_date?.toString(),
      search: req.query.search?.toString()
    };

    const order_by = req.query.order_by?.toString() || 'ts';
    const order_dir = req.query.order_dir?.toString() || 'desc';

    const data = ListensAnalytics.getListens(filters, order_by, order_dir, limit, offset);

    res.json({
      total_count: data.length > 0 ? data[0].total_count : 0,
      data: data.map(({ total_count, ...listenAnalytics }) => listenAnalytics),
    });
};

export default {
  getListensAnalytics
};
