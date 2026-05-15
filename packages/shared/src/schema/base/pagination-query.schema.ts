import { z } from "@hono/zod-openapi";

export const PaginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val: string) => Number(val)),
  limit: z
    .string()
    .optional()
    .default("25")
    .transform((val: string) => Number(val)),
  orderBy: z.string().optional(),
  sortDirection: z.string().optional(),
  query: z.string().optional(),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
