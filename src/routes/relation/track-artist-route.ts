import express from 'express';
import TrackArtistController from '@/controllers/relation/track-artist-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.get('/', TrackArtistController.getAllTrackArtists);
router.get('/byTrackId', TrackArtistController.getByTrackId);
router.get('/byArtistId', TrackArtistController.getByArtistId);
router.post('/', TrackArtistController.createTrackArtist);
router.put('/', TrackArtistController.updateTrackArtist);
router.delete('/', TrackArtistController.deleteTrackArtist);

export default wrapRoutes(router);
