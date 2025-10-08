import express from 'express';
import UserController from '../../controllers/main-classes/user-controller';
import { wrapRoutes } from '../../utils/wrapRoutes';

const router = express.Router();

router.get('/', UserController.getAllUsers);
router.get('/byId', UserController.getUserById);
router.post('/', UserController.createUser);
router.put('/', UserController.updateUser);
router.delete('/', UserController.deleteUser);

export default wrapRoutes(router);
