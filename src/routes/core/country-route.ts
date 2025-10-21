import express from 'express';
import CountryController from '../../controllers/core/country-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.get('/', CountryController.getAllCountries);
router.get('/byId', CountryController.getCountryById);
router.post('/', CountryController.createCountry);
router.put('/', CountryController.updateCountry);
router.delete('/', CountryController.deleteCountry);

router.get('/withRegion', CountryController.getAllCountriesWithRegion);
router.get('/withRegionAndStats', CountryController.getCountriesWithRegionAndStats);

export default wrapRoutes(router);
