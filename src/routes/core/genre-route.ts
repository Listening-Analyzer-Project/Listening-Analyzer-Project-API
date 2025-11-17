import express from 'express';
import GenreController from '@/controllers/core/genre-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.get('/', GenreController.getAllGenres);
router.get('/byId', GenreController.getGenreById);
router.post('/', GenreController.createGenre);
router.put('/', GenreController.updateGenre);
router.delete('/', GenreController.deleteGenre);

router.get('/withSubGenres', GenreController.getAllGenresWithSubGenres);

export default wrapRoutes(router);
