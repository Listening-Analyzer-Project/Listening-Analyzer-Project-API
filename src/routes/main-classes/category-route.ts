import express from 'express';
import CategoryController from '../../controllers/main-classes/category-controller';

const router = express.Router();

router.get('/', CategoryController.getAllCategories);
router.get('/byId', CategoryController.getCategoryById);
router.post('/', CategoryController.createCategory);
router.put('/', CategoryController.updateCategory);
router.delete('/', CategoryController.deleteCategory);

export default router;
