import express from 'express';
import tracksAnalyticsController from '@/controllers/analytics/tracks-analytics-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.get('/', tracksAnalyticsController.getTracksAnalytics);

export default wrapRoutes(router);