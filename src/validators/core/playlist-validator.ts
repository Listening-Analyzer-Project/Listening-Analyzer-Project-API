import { z } from 'zod';

export const createPlaylistSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
        user_id: z.number().int().positive('User ID invalide'),
    }),
});

export const updatePlaylistSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive('Playlist ID invalide'),
    }),
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
        user_id: z.number().int().positive('User ID invalide'),
    }),
});

export const getDeletePlaylistSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive('Playlist ID invalide'),
    }),
});
