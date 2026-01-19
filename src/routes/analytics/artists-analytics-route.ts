import express from 'express';
import ArtistsAnalyticsController from '@/controllers/analytics/artists-analytics-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { getArtistsAnalyticsSchema } from '@/validators/analytics/artists-analytics-validator';

const router = express.Router();

router.get('/', validateRequest(getArtistsAnalyticsSchema), ArtistsAnalyticsController.getArtistsAnalytics);

export default wrapRoutes(router);