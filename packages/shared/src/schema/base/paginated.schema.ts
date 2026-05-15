import { z } from '@hono/zod-openapi';

export const PaginatedSchema = <T extends z.ZodType>(schema: T) => z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  data: z.array(schema),
  hasNext: z.boolean(),
});
