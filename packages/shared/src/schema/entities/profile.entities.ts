import z from "zod";

export const ProfileEntitySchema = z.object({
    userId: z.number().optional(),
    last_name: z.string().optional(),
    first_name: z.string().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});

export type ProfileEntity = z.infer<typeof ProfileEntitySchema>;