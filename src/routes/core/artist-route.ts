import express from 'express';
import ArtistController from '@/controllers/core/artist-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { createArtistSchema, updateArtistSchema, getDeleteArtistSchema } from '@/validators/core/artist-validator';

const router = express.Router();

router.get('/', ArtistController.getAllArtists);
router.get('/byId', validateRequest(getDeleteArtistSchema), ArtistController.getArtistById);
router.post('/', validateRequest(createArtistSchema), ArtistController.createArtist);
router.put('/', validateRequest(updateArtistSchema), ArtistController.updateArtist);
router.delete('/', validateRequest(getDeleteArtistSchema), ArtistController.deleteArtist);

export default wrapRoutes(router);
