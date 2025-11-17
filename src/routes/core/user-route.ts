import express from 'express';
import UserController from '@/controllers/core/user-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.get('/', UserController.getAllUsers);
router.get('/byId', UserController.getUserById);
router.post('/', UserController.createUser);
router.put('/', UserController.updateUser);
router.delete('/', UserController.deleteUser);

export default wrapRoutes(router);
