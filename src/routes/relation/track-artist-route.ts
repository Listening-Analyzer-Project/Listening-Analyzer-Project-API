import express from 'express';
import TrackArtistController from '@/controllers/relation/track-artist-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { createTrackArtistSchema, deleteTrackArtistSchema, getByArtistIdSchema, getByTrackIdSchema, updateTrackArtistSchema } from '@/validators/relation/track-artist-validator';

const router = express.Router();

router.get('/', TrackArtistController.getAllTrackArtists);
router.get('/byTrack', validateRequest(getByTrackIdSchema), TrackArtistController.getByTrackId);
router.get('/byArtist', validateRequest(getByArtistIdSchema), TrackArtistController.getByArtistId);
router.post('/', validateRequest(createTrackArtistSchema), TrackArtistController.createTrackArtist);
router.put('/', validateRequest(updateTrackArtistSchema), TrackArtistController.updateTrackArtist);
router.delete('/', validateRequest(deleteTrackArtistSchema), TrackArtistController.deleteTrackArtist);

export default wrapRoutes(router);
