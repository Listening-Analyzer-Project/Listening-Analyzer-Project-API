import express from 'express';
import deleteUser from '@/controllers/other/delete-user-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.delete('/', deleteUser.deleteUser);

export default wrapRoutes(router);