import { Request, Response } from 'express';
import TrackAnalytics from '@/models/analytics/tracks-analytics-model';

const getTracksAnalytics = (req: Request, res: Response) => {
  const search = req.query.search?.toString() || '';
  const order_by = req.query.order_by?.toString() || 'valid_listens';
  const order_dir = req.query.order_dir?.toString() || 'desc';
  const limit = parseInt(req.query.limit?.toString() || '50', 10);
  const offset = parseInt(req.query.offset?.toString() || '0', 10);

  const userIdsParam = req.query.user_ids?.toString();
  const userIds = userIdsParam ? userIdsParam.split(',').map(id => id.trim()).filter(id => id) : undefined;

  const data = TrackAnalytics.getTracksAnalytics(userIds, search, order_by, order_dir, limit, offset);

  res.json({
    total_count: data.length > 0 ? data[0].total_count : 0,
    data: data.map(({ total_count, ...trackAnalytics }) => trackAnalytics),
  });
};

export default {
  getTracksAnalytics,
};
