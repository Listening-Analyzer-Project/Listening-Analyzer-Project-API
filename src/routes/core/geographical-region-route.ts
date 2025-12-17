import express from 'express';
import GeographicalRegionController from '@/controllers/core/geographical-region-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { createGeographicalRegionSchema, updateGeographicalRegionSchema, getDeleteGeographicalRegionSchema } from '@/validators/core/geographical-region-validator';

const router = express.Router();

router.get('/', GeographicalRegionController.getAllRegions);
router.get('/byId', validateRequest(getDeleteGeographicalRegionSchema), GeographicalRegionController.getRegionById);
router.post('/', validateRequest(createGeographicalRegionSchema), GeographicalRegionController.createRegion);
router.put('/', validateRequest(updateGeographicalRegionSchema), GeographicalRegionController.updateRegion);
router.delete('/', validateRequest(getDeleteGeographicalRegionSchema), GeographicalRegionController.deleteRegion);

export default wrapRoutes(router);
