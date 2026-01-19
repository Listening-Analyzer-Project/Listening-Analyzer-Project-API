import express from 'express';
import TrackController from '@/controllers/core/track-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { createTrackSchema, updateTrackSchema, getDeleteTrackSchema } from '@/validators/core/track-validator';

const router = express.Router();

router.get('/', TrackController.getAllTracks);
router.get('/byId', validateRequest(getDeleteTrackSchema), TrackController.getTrackById);
router.post('/', validateRequest(createTrackSchema), TrackController.createTrack);
router.put('/', validateRequest(updateTrackSchema), TrackController.updateTrack);
router.delete('/', validateRequest(getDeleteTrackSchema), TrackController.deleteTrack);

export default wrapRoutes(router);
