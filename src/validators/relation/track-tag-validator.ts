import { z } from 'zod';

export const createTrackTagSchema = z.object({
    body: z.object({
        track_id: z.number().int().positive('Track ID invalide'),
        tag_id: z.number().int().positive('Tag ID invalide'),
    }),
});

export const getByTrackIdSchema = z.object({
    query: z.object({
        track_id: z.coerce.number().int().positive('Track ID invalide'),
    }),
});

export const getByTagIdSchema = z.object({
    query: z.object({
        tag_id: z.coerce.number().int().positive('Tag ID invalide'),
    }),
});

export const deleteTrackTagSchema = z.object({
    query: z.object({
        track_id: z.coerce.number().int().positive('Track ID invalide'),
        tag_id: z.coerce.number().int().positive('Tag ID invalide'),
    }),
});
