import express from 'express';
import CategoryController from '@/controllers/core/category-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { createCategorySchema, updateCategorySchema, getDeleteCategorySchema } from '@/validators/core/category-validator';

const router = express.Router();

router.get('/', CategoryController.getAllCategories);
router.get('/byId', validateRequest(getDeleteCategorySchema), CategoryController.getCategoryById);
router.post('/', validateRequest(createCategorySchema), CategoryController.createCategory);
router.put('/', validateRequest(updateCategorySchema), CategoryController.updateCategory);
router.delete('/', validateRequest(getDeleteCategorySchema), CategoryController.deleteCategory);

export default wrapRoutes(router);
