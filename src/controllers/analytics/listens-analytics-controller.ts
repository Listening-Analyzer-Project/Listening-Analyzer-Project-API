import { Request, Response } from 'express';
import ListensAnalytics from '@/models/analytics/listens-analytics-model';

const getListensAnalytics = (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit?.toString() || '10000', 10);
  const offset = parseInt(req.query.offset?.toString() || '0', 10);
  const isValidParam = req.query.is_valid?.toString().trim();
  const order_by = req.query.order_by?.toString() || 'listen_timestamp';
  const order_dir = req.query.order_dir?.toString() || 'desc';

  const userIdsParam = req.query.user_ids?.toString();
  const userIds = userIdsParam ? userIdsParam.split(',').map(id => id.trim()).filter(id => id) : undefined;

  const filters = {
    user_ids: userIds,
    track_id: req.query.track_id?.toString(),
    is_valid: isValidParam === 'true' ? true : isValidParam === 'false' ? false : undefined,
    platform: req.query.platform?.toString(),
    search: req.query.search?.toString()
  };

  const data = ListensAnalytics.getListens(filters, order_by, order_dir, limit, offset);

  res.json({
    total_count: data.length > 0 ? data[0].total_count : 0,
    data: data.map(({ total_count, ...listenAnalytics }) => listenAnalytics),
  });
};

export default {
  getListensAnalytics,
};
