import { z } from 'zod';

export const createGenreSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
    }),
});

export const updateGenreSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive(),
    }),
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
    }),
});

export const getDeleteGenreSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive(),
    }),
});
