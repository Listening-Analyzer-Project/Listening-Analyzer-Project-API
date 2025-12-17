import { z } from 'zod';

export const getSearchSuggestionsSchema = z.object({
    query: z.object({
        search: z.string().min(2, 'La recherche doit contenir au moins 2 caractères'),
        view_type: z.string(),
        limit: z.coerce.number().int().nonnegative().optional(),
        user_ids: z.string().regex(/^(\d+,)*\d+$/, 'Format invalide (liste d\'ID séparés par des virgules)').optional(),
    }),
});
