import express from 'express';
import SubGenreController from '@/controllers/core/sub-genre-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { createSubGenreSchema, updateSubGenreSchema, getDeleteSubGenreSchema } from '@/validators/core/sub-genre-validator';

const router = express.Router();

router.get('/', SubGenreController.getAllSubGenres);
router.get('/byId', validateRequest(getDeleteSubGenreSchema), SubGenreController.getSubGenreById);
router.post('/', validateRequest(createSubGenreSchema), SubGenreController.createSubGenre);
router.put('/', validateRequest(updateSubGenreSchema), SubGenreController.updateSubGenre);
router.delete('/', validateRequest(getDeleteSubGenreSchema), SubGenreController.deleteSubGenre);

export default wrapRoutes(router);
