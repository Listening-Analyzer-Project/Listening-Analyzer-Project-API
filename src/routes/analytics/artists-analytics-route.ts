import express from 'express';
import ArtistAnalyticsController from '@/controllers/analytics/artists-analytics-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.get('/', ArtistAnalyticsController.getArtistsAnalytics);

export default wrapRoutes(router);