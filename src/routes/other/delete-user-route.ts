import express from 'express';
import deleteUser from '@/controllers/other/delete-user-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest, checkSynchroStatus } from '@/middleware';
import { deleteUserSchema } from '@/validators/other/delete-user-validator';

const router = express.Router();

router.delete('/', validateRequest(deleteUserSchema), checkSynchroStatus('user_from_query'), deleteUser.deleteUser);

export default wrapRoutes(router);