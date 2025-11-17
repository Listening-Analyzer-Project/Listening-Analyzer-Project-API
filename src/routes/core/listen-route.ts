import express from 'express';
import ListenController from '@/controllers/core/listen-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.get('/', ListenController.getAllListens);
router.get('/byId', ListenController.getListenById);
router.post('/', ListenController.createListen);
router.put('/', ListenController.updateListen);
router.delete('/', ListenController.deleteListen);

export default wrapRoutes(router);
