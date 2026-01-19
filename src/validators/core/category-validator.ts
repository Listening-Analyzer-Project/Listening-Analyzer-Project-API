import { z } from 'zod';

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
    }),
});

export const updateCategorySchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive(),
    }),
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
    }),
});

export const getDeleteCategorySchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive(),
    }),
});
