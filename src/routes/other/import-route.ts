import express from 'express';
import importController from '@/controllers/other/import-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.post('/', importController.importBatch);
router.post('/drop-indexes', importController.dropDBIndexes);
router.post('/create-indexes', importController.createDBIndexes);

export default wrapRoutes(router);