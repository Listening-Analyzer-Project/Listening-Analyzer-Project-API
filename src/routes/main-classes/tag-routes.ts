import express from 'express';
import TagController from '../../controllers/main-classes/tag-controller';

const router = express.Router();

router.get('/', TagController.getAllTags);
router.get('/byId', TagController.getTagById);
router.post('/', TagController.createTag);
router.put('/', TagController.updateTag);
router.delete('/', TagController.deleteTag);

export default router;
