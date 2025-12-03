import express from 'express';
import globalSuggestionController from '@/controllers/other/search-suggestion-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.get('/', globalSuggestionController.getSuggestions);

export default wrapRoutes(router);