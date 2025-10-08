import express from 'express';
import AlbumController from '../../controllers/core/album-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.get('/', AlbumController.getAllAlbums);
router.get('/byId', AlbumController.getAlbumById);
router.post('/', AlbumController.createAlbum);
router.put('/', AlbumController.updateAlbum);
router.delete('/', AlbumController.deleteAlbum);

export default wrapRoutes(router);