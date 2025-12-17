import express from 'express';
import TagController from '@/controllers/core/tag-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { createTagSchema, updateTagSchema, getDeleteTagSchema } from '@/validators/core/tag-validator';

const router = express.Router();

router.get('/', TagController.getAllTags);
router.get('/byId', validateRequest(getDeleteTagSchema), TagController.getTagById);
router.post('/', validateRequest(createTagSchema), TagController.createTag);
router.put('/', validateRequest(updateTagSchema), TagController.updateTag);
router.delete('/', validateRequest(getDeleteTagSchema), TagController.deleteTag);

export default wrapRoutes(router);
