import { z } from 'zod';

export const createTrackArtistSchema = z.object({
    body: z.object({
        track_id: z.number().int().positive('Track ID invalide'),
        artist_id: z.number().int().positive('Artist ID invalide'),
        is_primary: z.number().int().min(0).max(1),
    }),
});

export const updateTrackArtistSchema = z.object({
    query: z.object({
        track_id: z.coerce.number().int().positive('Track ID invalide'),
        artist_id: z.coerce.number().int().positive('Artist ID invalide'),
    }),
    body: z.object({
        is_primary: z.number().int().min(0).max(1),
    }),
});

export const getByTrackIdSchema = z.object({
    query: z.object({
        track_id: z.coerce.number().int().positive('Track ID invalide'),
    }),
});

export const getByArtistIdSchema = z.object({
    query: z.object({
        artist_id: z.coerce.number().int().positive('Artist ID invalide'),
    }),
});

export const deleteTrackArtistSchema = z.object({
    query: z.object({
        track_id: z.coerce.number().int().positive('Track ID invalide'),
        artist_id: z.coerce.number().int().positive('Artist ID invalide'),
    }),
});
