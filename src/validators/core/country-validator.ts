import { z } from 'zod';

export const createCountrySchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
        geographical_region_id: z.number().int(),
    }),
});

export const updateCountrySchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive(),
    }),
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
        geographical_region_id: z.number().int(),
    }),
});

export const getDeleteCountrySchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive(),
    }),
});
