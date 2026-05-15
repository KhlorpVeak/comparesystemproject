import z from "zod";

export const UserSessionEntitySchema = z.object({
    userId: z.number().optional(),
    token: z.string().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    expired_at: z.date().optional(),
});

export type UserSessionEntity = z.infer<typeof UserSessionEntitySchema>;