import express from 'express';
import UserController from '@/controllers/core/user-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { createUserSchema, updateUserSchema, getDeleteUserSchema } from '@/validators/core/user-validator';

const router = express.Router();

router.get('/', UserController.getAllUsers);
router.get('/byId', validateRequest(getDeleteUserSchema), UserController.getUserById);
router.post('/', validateRequest(createUserSchema), UserController.createUser);
router.put('/', validateRequest(updateUserSchema), UserController.updateUser);
router.delete('/', validateRequest(getDeleteUserSchema), UserController.deleteUser);

export default wrapRoutes(router);
