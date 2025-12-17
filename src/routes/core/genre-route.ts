import express from 'express';
import GenreController from '@/controllers/core/genre-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { createGenreSchema, updateGenreSchema, getDeleteGenreSchema } from '@/validators/core/genre-validator';

const router = express.Router();

router.get('/', GenreController.getAllGenres);
router.get('/byId', validateRequest(getDeleteGenreSchema), GenreController.getGenreById);
router.post('/', validateRequest(createGenreSchema), GenreController.createGenre);
router.put('/', validateRequest(updateGenreSchema), GenreController.updateGenre);
router.delete('/', validateRequest(getDeleteGenreSchema), GenreController.deleteGenre);

router.get('/withSubGenres', GenreController.getAllGenresWithSubGenres);

export default wrapRoutes(router);
