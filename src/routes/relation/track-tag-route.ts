import express from 'express';
import TrackTagController from '../../controllers/relation/track-tag-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.get('/', TrackTagController.getAllTrackTags);
router.get('/byTrackId', TrackTagController.getByTrackId);
router.get('/byTagId', TrackTagController.getByTagId);
router.post('/', TrackTagController.createTrackTag);
router.delete('/', TrackTagController.deleteTrackTag);

export default wrapRoutes(router);
