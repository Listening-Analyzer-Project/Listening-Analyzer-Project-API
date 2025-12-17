import { z } from 'zod';

export const createTrackSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Le titre est requis'),
        duration_ms: z.number().int().positive().optional(),
        album_id: z.number().int().positive('Album ID invalide'),
        explicit: z.number().int().min(0).max(1).optional(),
        popularity: z.number().int().optional(),
        sub_genre_id: z.number().int().positive().optional(),
        acousticness: z.number().optional(),
        danceability: z.number().optional(),
        energy: z.number().optional(),
        instrumentalness: z.number().optional(),
        key: z.number().optional(),
        liveness: z.number().optional(),
        loudness: z.number().optional(),
        mode: z.number().optional(),
        speechiness: z.number().optional(),
        tempo: z.number().optional(),
        time_signature: z.number().optional(),
        valence: z.number().optional(),
        is_edited: z.number().int().min(0).max(1),
    }),
});

export const updateTrackSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive('Track ID invalide'),
    }),
    body: z.object({
        title: z.string().min(1, 'Le titre est requis'),
        duration_ms: z.number().int().positive().optional(),
        album_id: z.number().int().positive('Album ID invalide'),
        explicit: z.number().int().min(0).max(1).optional(),
        popularity: z.number().int().optional(),
        sub_genre_id: z.number().int().positive().optional(),
        acousticness: z.number().optional(),
        danceability: z.number().optional(),
        energy: z.number().optional(),
        instrumentalness: z.number().optional(),
        key: z.number().optional(),
        liveness: z.number().optional(),
        loudness: z.number().optional(),
        mode: z.number().optional(),
        speechiness: z.number().optional(),
        tempo: z.number().optional(),
        time_signature: z.number().optional(),
        valence: z.number().optional(),
        is_edited: z.number().int().min(0).max(1),
    }),
});

export const getDeleteTrackSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive('Track ID invalide'),
    }),
});
