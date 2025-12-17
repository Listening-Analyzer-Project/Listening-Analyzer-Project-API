import { z } from 'zod';

export const deleteUserSchema = z.object({
    query: z.object({
        id: z.coerce.number().int().positive('ID manquant ou invalide'),
    }),
    body: z.object({
        deleteUser: z.boolean().optional(),
    }),
});
