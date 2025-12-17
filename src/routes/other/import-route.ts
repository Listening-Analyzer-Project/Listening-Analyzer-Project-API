import express from 'express';
import importController from '@/controllers/other/import-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { importBatchSchema } from '@/validators/other/import-validator';

const router = express.Router();

router.post('/', validateRequest(importBatchSchema), importController.importBatch);
router.post('/drop-indexes', importController.dropDBIndexes);
router.post('/create-indexes', importController.createDBIndexes);

export default wrapRoutes(router);