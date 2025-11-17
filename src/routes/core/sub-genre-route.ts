import express from 'express';
import SubGenreController from '@/controllers/core/sub-genre-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.get('/', SubGenreController.getAllSubGenres);
router.get('/byId', SubGenreController.getSubGenreById);
router.post('/', SubGenreController.createSubGenre);
router.put('/', SubGenreController.updateSubGenre);
router.delete('/', SubGenreController.deleteSubGenre);

export default wrapRoutes(router);
