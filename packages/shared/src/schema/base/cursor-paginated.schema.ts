import { z } from '@hono/zod-openapi';

export const CursorPaginatedSchema = <T extends z.ZodType>(schema: T) => z.object({
  nextCursor: z.number().nullable(),
  limit: z.number(),
  data: z.array(schema),
}).openapi('CursorPaginated');