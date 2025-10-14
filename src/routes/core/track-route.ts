import express from 'express';
import TrackController from '../../controllers/core/track-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.get('/', TrackController.getAllTracks);
router.get('/byId', TrackController.getTrackById);
router.post('/', TrackController.createTrack);
router.put('/', TrackController.updateTrack);
router.delete('/', TrackController.deleteTrack);

export default wrapRoutes(router);
