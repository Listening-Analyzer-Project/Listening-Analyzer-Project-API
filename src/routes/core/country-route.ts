import express from 'express';
import CountryController from '@/controllers/core/country-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { createCountrySchema, updateCountrySchema, getDeleteCountrySchema } from '@/validators/core/country-validator';

const router = express.Router();

router.get('/', CountryController.getAllCountries);
router.get('/byId', validateRequest(getDeleteCountrySchema), CountryController.getCountryById);
router.post('/', validateRequest(createCountrySchema), CountryController.createCountry);
router.put('/', validateRequest(updateCountrySchema), CountryController.updateCountry);
router.delete('/', validateRequest(getDeleteCountrySchema), CountryController.deleteCountry);

router.get('/withRegion', CountryController.getAllCountriesWithRegion);
router.get('/withRegionAndStats', CountryController.getCountriesWithRegionAndStats);

export default wrapRoutes(router);
