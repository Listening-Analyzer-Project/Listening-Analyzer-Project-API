import express from 'express';
import importController from '@/controllers/other/import-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.post('/', importController.importBatch);

export default wrapRoutes(router);