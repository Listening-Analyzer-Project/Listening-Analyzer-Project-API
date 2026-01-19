import { z } from 'zod';

export const createListenSchema = z.object({
    body: z.object({
        ts: z.string().datetime({ message: 'Format de date invalide (ISO 8601 requis)' }),
        platform: z.string().min(1, 'La plateforme est requise'),
        ms_played: z.number().int().nonnegative(),
        track_id: z.number().int().positive(),
        user_id: z.number().int().positive(),
        reason_end: z.string().optional(),
    }),
});

export const updateListenSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive(),
    }),
    body: z.object({
        ts: z.string().datetime({ message: 'Format de date invalide (ISO 8601 requis)' }),
        platform: z.string().min(1),
        ms_played: z.number().int().nonnegative(),
        track_id: z.number().int().positive(),
        user_id: z.number().int().positive(),
        reason_end: z.string().optional(),
    }),
});

export const getDeleteListenSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive(),
    }),
});
