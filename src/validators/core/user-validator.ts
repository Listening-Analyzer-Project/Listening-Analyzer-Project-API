import { z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
        type: z.number().int(),
        isadmin: z.number().int().min(0).max(1),
        syncro_status: z.number().int().min(0).max(6),
    }),
});

export const updateUserSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive('ID invalide'),
    }),
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
        type: z.number().int(),
        isadmin: z.number().int().min(0).max(1),
        syncro_status: z.number().int().min(0).max(6),
    }),
});

export const getDeleteUserSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive('ID invalide'),
    }),
});
