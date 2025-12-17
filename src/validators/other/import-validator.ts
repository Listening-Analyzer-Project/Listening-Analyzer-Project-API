import { z } from 'zod';

const artistSchema = z.object({
    name: z.string(),
    image_uri: z.string().optional(),
    popularity: z.number().optional(),
    type: z.string().optional(),
    birth: z.string().optional(),
});

const albumSchema = z.object({
    title: z.string(),
    release_date: z.string().optional(),
    image_uri: z.string().optional(),
    popularity: z.number().optional(),
});

const trackSchema = z.object({
    title: z.string(),
    duration_ms: z.number().int().nonnegative().optional(),
    album: albumSchema,
    artists: z.array(artistSchema),
    tags: z.array(z.string()).optional(),
    genre: z.string().optional(),
    sub_genre: z.string().optional(),
    explicit: z.boolean().optional(),
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
    is_edited: z.boolean().optional(),
});

const canonicalListenSchema = z.object({
    ts: z.string().datetime({ message: 'Format de date invalide (ISO 8601 requis)' }),
    platform: z.string(),
    ms_played: z.number(),
    reason_end: z.string().optional(),
    track: trackSchema,
});

export const importBatchSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive('ID manquant ou invalide'),
    }),
    body: z.array(canonicalListenSchema).nonempty('Aucune donnée à importer'),
});
