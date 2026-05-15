import z from "zod";

export const LoginMeSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type LoginMeRequest = z.infer<typeof LoginMeSchema>;