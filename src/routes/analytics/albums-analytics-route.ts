import express from 'express';
import AlbumsAnalyticsController from '@/controllers/analytics/albums-analytics-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { getAlbumsAnalyticsSchema } from '@/validators/analytics/albums-analytics-validator';

const router = express.Router();

router.get('/', validateRequest(getAlbumsAnalyticsSchema), AlbumsAnalyticsController.getAlbumsAnalytics);

export default wrapRoutes(router);