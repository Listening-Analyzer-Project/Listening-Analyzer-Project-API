import express from 'express';
import ListenController from '@/controllers/core/listen-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest, checkSynchroStatus } from '@/middleware';
import { createListenSchema, updateListenSchema, getDeleteListenSchema } from '@/validators/core/listen-validator';

const router = express.Router();

router.get('/', ListenController.getAllListens);
router.get('/byId', validateRequest(getDeleteListenSchema), ListenController.getListenById);
router.post('/', validateRequest(createListenSchema), ListenController.createListen);
router.put('/', validateRequest(updateListenSchema), checkSynchroStatus('user_from_body'), ListenController.updateListen);
router.delete('/', validateRequest(getDeleteListenSchema), checkSynchroStatus('listen_from_query'), ListenController.deleteListen);

export default wrapRoutes(router);
