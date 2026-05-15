import z from "zod";

export const UserEntitySchema = z.object({
    email: z.string().email(),
    password: z.string(),
    created_at: z.date(),
    updated_at: z.date(),
    login_type: z.string(),
});