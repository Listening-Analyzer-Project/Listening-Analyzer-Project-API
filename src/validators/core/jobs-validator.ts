import { z } from 'zod';

export const createJobSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
        user_id: z.coerce.number().int().positive(),
        progress: z.coerce.number().int().min(0).max(100),
        phase: z.coerce.number().int().min(0).max(100),
    }),
});

export const updateJobSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive(),
    }),
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
        user_id: z.coerce.number().int().positive(),
        progress: z.coerce.number().int().min(0).max(100),
        phase: z.coerce.number().int().min(0).max(100),
    }),
});

export const getDeleteJobSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive(),
    }),
});
