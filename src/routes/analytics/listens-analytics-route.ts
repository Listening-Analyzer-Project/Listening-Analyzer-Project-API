import express from 'express';
import listensAnalyticsController from '@/controllers/analytics/listens-analytics-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.get('/', listensAnalyticsController.getListensAnalytics);

export default wrapRoutes(router);