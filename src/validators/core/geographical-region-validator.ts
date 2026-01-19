import { z } from 'zod';

export const createGeographicalRegionSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
    }),
});

export const updateGeographicalRegionSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive(),
    }),
    body: z.object({
        name: z.string().min(1, 'Le nom est requis'),
    }),
});

export const getDeleteGeographicalRegionSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive(),
    }),
});
