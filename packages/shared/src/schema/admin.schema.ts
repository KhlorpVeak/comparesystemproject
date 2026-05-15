import { z } from 'zod';

// Zod schema for the admin/user profile response shape.
// Used by OpenAPI route definitions to validate and document the response.
export const AdminProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['SUPERADMIN', 'ADMIN', 'USER']),
});

export type AdminProfile = z.infer<typeof AdminProfileSchema>;
