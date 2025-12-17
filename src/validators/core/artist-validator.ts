import { z } from 'zod';

export const createArtistSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
        image_uri: z.string().optional(),
        popularity: z.number().int().optional(),
        country_id: z.number().int().optional(),
        type: z.number().int().optional(),
        birth: z.string().optional(),
    }),
});

export const updateArtistSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive(),
    }),
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
        image_uri: z.string().optional(),
        popularity: z.number().int().optional(),
        country_id: z.number().int().optional(),
        type: z.number().int().optional(),
        birth: z.string().optional(),
    }),
});

export const getDeleteArtistSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive(),
    }),
});
