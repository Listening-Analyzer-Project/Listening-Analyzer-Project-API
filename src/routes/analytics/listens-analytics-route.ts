import express from 'express';
import ListensAnalyticsController from '@/controllers/analytics/listens-analytics-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { getListensAnalyticsSchema } from '@/validators/analytics/listens-analytics-validator';

const router = express.Router();

router.get('/', validateRequest(getListensAnalyticsSchema), ListensAnalyticsController.getListensAnalytics);

export default wrapRoutes(router);