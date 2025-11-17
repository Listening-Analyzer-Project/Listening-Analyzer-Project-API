import express from 'express';
import AlbumAnalyticsController from '@/controllers/analytics/albums-analytics-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.get('/', AlbumAnalyticsController.getAlbumsAnalytics);

export default wrapRoutes(router);