import { z } from 'zod';

export const createTagSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
    }),
});

export const updateTagSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive('Tag ID invalide'),
    }),
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
    }),
});

export const getDeleteTagSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive('Tag ID invalide'),
    }),
});
