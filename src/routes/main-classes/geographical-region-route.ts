import express from 'express';
import GeographicalRegionController from '../../controllers/main-classes/geographical-region-controller';
import { wrapRoutes } from '../../utils/wrapRoutes';

const router = express.Router();

router.get('/', GeographicalRegionController.getAllRegions);
router.get('/byId', GeographicalRegionController.getRegionById);
router.post('/', GeographicalRegionController.createRegion);
router.put('/', GeographicalRegionController.updateRegion);
router.delete('/', GeographicalRegionController.deleteRegion);

export default wrapRoutes(router);
