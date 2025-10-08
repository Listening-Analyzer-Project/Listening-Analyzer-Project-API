import express from 'express';
import AlbumController from '../../controllers/main-classes/album-controller';

const router = express.Router();

router.get('/', AlbumController.getAllAlbums);
router.get('/byId', AlbumController.getAlbumById);
router.post('/', AlbumController.createAlbum);
router.put('/', AlbumController.updateAlbum);
router.delete('/', AlbumController.deleteAlbum);

export default router;