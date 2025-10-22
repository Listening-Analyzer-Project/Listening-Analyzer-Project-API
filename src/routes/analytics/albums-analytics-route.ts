import express from 'express';
import AlbumController from '../../controllers/analytics/albums-analytics-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.get('/', AlbumController.getAlbumsAnalytics);

export default wrapRoutes(router);