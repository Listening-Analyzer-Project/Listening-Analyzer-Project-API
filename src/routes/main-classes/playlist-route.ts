import express from 'express';
import PlaylistController from '../../controllers/main-classes/playlist-controller';

const router = express.Router();

router.get('/', PlaylistController.getAllPlaylists);
router.get('/byId', PlaylistController.getPlaylistById);
router.post('/', PlaylistController.createPlaylist);
router.put('/', PlaylistController.updatePlaylist);
router.delete('/', PlaylistController.deletePlaylist);

export default router;