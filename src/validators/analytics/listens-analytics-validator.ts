import { z } from 'zod';

export const getListensAnalyticsSchema = z.object({
    query: z.object({
        limit: z.coerce.number().int().nonnegative().optional(),
        offset: z.coerce.number().int().nonnegative().optional(),
        order_by: z.string().optional(),
        order_dir: z.enum(['asc', 'desc']).optional(),
        search: z.string().optional(),
        user_ids: z.string().regex(/^(\d+,)*\d+$/, 'Format invalide (liste d\'ID séparés par des virgules)').optional(),
        is_valid: z.enum(['true', 'false']).optional(),
        platform: z.string().optional(),
        track_id: z.coerce.number().int().positive().optional(),
    }),
});
