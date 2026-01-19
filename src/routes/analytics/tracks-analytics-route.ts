import express from 'express';
import TracksAnalyticsController from '@/controllers/analytics/tracks-analytics-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { getTracksAnalyticsSchema } from '@/validators/analytics/tracks-analytics-validator';

const router = express.Router();

router.get('/', validateRequest(getTracksAnalyticsSchema), TracksAnalyticsController.getTracksAnalytics);

export default wrapRoutes(router);