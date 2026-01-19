import express from 'express';
import AlbumController from '@/controllers/core/album-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { createAlbumSchema, updateAlbumSchema, getDeleteAlbumSchema } from '@/validators/core/album-validator';

const router = express.Router();

router.get('/', AlbumController.getAllAlbums);
router.get('/byId', validateRequest(getDeleteAlbumSchema), AlbumController.getAlbumById);
router.post('/', validateRequest(createAlbumSchema), AlbumController.createAlbum);
router.put('/', validateRequest(updateAlbumSchema), AlbumController.updateAlbum);
router.delete('/', validateRequest(getDeleteAlbumSchema), AlbumController.deleteAlbum);

export default wrapRoutes(router);