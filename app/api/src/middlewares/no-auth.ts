import type { Context, Next } from 'hono';

export const noAuthMiddlware = async (c: Context, next: Next) => {
  c.set('noAuth', true);
  await next();
};