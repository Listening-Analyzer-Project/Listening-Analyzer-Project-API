import { z } from 'zod';

export const createAlbumSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Le titre est requis'),
        release_date: z.string().optional(),
        image_uri: z.string().optional(),
        popularity: z.number().int().optional(),
    }),
});

export const updateAlbumSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive(),
    }),
    body: z.object({
        title: z.string().min(1, 'Le titre est requis'),
        release_date: z.string().optional(),
        image_uri: z.string().optional(),
        popularity: z.number().int().optional(),
    }),
});

export const getDeleteAlbumSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive(),
    }),
});
