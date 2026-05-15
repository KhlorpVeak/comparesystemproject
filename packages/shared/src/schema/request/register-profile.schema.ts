import z from "zod";

export const RegisterProfileSchema = z.object({
    last_name: z.string(),
    first_name: z.string(),
    email: z.string().email(),
    password: z.string(),
});

export type RegisterProfileRequest = z.infer<typeof RegisterProfileSchema>;