import express from 'express';
import PlaylistTrackController from '@/controllers/relation/playlist-track-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.get('/', PlaylistTrackController.getAllPlaylistTracks);
router.get('/byTrackId', PlaylistTrackController.getByTrackId);
router.get('/byPlaylistId', PlaylistTrackController.getByPlaylistId);
router.post('/', PlaylistTrackController.createPlaylistTrack);
router.delete('/', PlaylistTrackController.deletePlaylistTrack);

export default wrapRoutes(router);
