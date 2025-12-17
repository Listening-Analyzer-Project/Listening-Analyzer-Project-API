import express from 'express';
import globalSuggestionController from '@/controllers/other/search-suggestion-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { getSearchSuggestionsSchema } from '@/validators/other/search-suggestion-validator';

const router = express.Router();

router.get('/', validateRequest(getSearchSuggestionsSchema), globalSuggestionController.getSuggestions);

export default wrapRoutes(router);