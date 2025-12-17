import { z } from 'zod';

export const createEventSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Le titre est requis'),
        start_date: z.string().min(1, 'La date de début est requise'),
        end_date: z.string().min(1, 'La date de fin est requise'),
        category_id: z.number().int(),
        user_id: z.number().int(),
        description: z.string().optional(),
    }),
});

export const updateEventSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive(),
    }),
    body: z.object({
        title: z.string().min(1, 'Le titre est requis'),
        start_date: z.string(),
        end_date: z.string(),
        category_id: z.number().int(),
        user_id: z.number().int(),
        description: z.string().optional(),
    }),
});

export const getEventWithCategorySchema = z.object({
    query: z.object({
        user_id: z.coerce.number().int().positive(),
        category_id: z.coerce.number().int().positive().optional(),
        limit: z.coerce.number().int().positive().optional(),
        offset: z.coerce.number().int().positive().optional(),
    }),
});

export const getDeleteEventSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive(),
    }),
});
