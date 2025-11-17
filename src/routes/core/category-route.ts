import express from 'express';
import CategoryController from '@/controllers/core/category-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.get('/', CategoryController.getAllCategories);
router.get('/byId', CategoryController.getCategoryById);
router.post('/', CategoryController.createCategory);
router.put('/', CategoryController.updateCategory);
router.delete('/', CategoryController.deleteCategory);

export default wrapRoutes(router);
