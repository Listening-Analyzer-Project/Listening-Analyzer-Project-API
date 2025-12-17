import express from 'express';
import PlaylistTrackController from '@/controllers/relation/playlist-track-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { createPlaylistTrackSchema, deletePlaylistTrackSchema, getByPlaylistIdSchema, getByTrackIdSchema } from '@/validators/relation/playlist-track-validator';

const router = express.Router();

router.get('/', PlaylistTrackController.getAllPlaylistTracks);
router.get('/byTrack', validateRequest(getByTrackIdSchema), PlaylistTrackController.getByTrackId);
router.get('/byPlaylist', validateRequest(getByPlaylistIdSchema), PlaylistTrackController.getByPlaylistId);
router.post('/', validateRequest(createPlaylistTrackSchema), PlaylistTrackController.createPlaylistTrack);
router.delete('/', validateRequest(deletePlaylistTrackSchema), PlaylistTrackController.deletePlaylistTrack);

export default wrapRoutes(router);
