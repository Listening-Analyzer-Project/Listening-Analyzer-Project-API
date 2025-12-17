import { z } from 'zod';

export const createPlaylistTrackSchema = z.object({
    body: z.object({
        track_id: z.number().int().positive('Track ID invalide'),
        playlist_id: z.number().int().positive('Playlist ID invalide'),
    }),
});

export const getByTrackIdSchema = z.object({
    query: z.object({
        track_id: z.coerce.number().int().positive('Track ID invalide'),
    }),
});

export const getByPlaylistIdSchema = z.object({
    query: z.object({
        playlist_id: z.coerce.number().int().positive('Playlist ID invalide'),
    }),
});

export const deletePlaylistTrackSchema = z.object({
    query: z.object({
        track_id: z.coerce.number().int().positive('Track ID invalide'),
        playlist_id: z.coerce.number().int().positive('Playlist ID invalide'),
    }),
});
