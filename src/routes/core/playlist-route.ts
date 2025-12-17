import express from 'express';
import PlaylistController from '@/controllers/core/playlist-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { createPlaylistSchema, updatePlaylistSchema, getDeletePlaylistSchema } from '@/validators/core/playlist-validator';

const router = express.Router();

router.get('/', PlaylistController.getAllPlaylists);
router.get('/byId', validateRequest(getDeletePlaylistSchema), PlaylistController.getPlaylistById);
router.post('/', validateRequest(createPlaylistSchema), PlaylistController.createPlaylist);
router.put('/', validateRequest(updatePlaylistSchema), PlaylistController.updatePlaylist);
router.delete('/', validateRequest(getDeletePlaylistSchema), PlaylistController.deletePlaylist);

export default wrapRoutes(router);