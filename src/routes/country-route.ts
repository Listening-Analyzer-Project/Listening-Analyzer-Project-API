import express from 'express';
import CountryController from '../controllers/country-controller';

const router = express.Router();

router.get('/', CountryController.getAllCountries);
router.get('/byId', CountryController.getCountryById);
router.post('/', CountryController.createCountry);
router.put('/', CountryController.updateCountry);
router.delete('/', CountryController.deleteCountry);

export default router;
