import { z } from 'zod';

export const createSubGenreSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
        genre_id: z.number().int().positive('Genre ID invalide'),
    }),
});

export const updateSubGenreSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive('SubGenre ID invalide'),
    }),
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
        genre_id: z.number().int().positive('Genre ID invalide'),
    }),
});

export const getDeleteSubGenreSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive('SubGenre ID invalide'),
    }),
});
