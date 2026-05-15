import { createRoute, z } from '@hono/zod-openapi';
import { db } from '@comparesystem/db';
import { ProfileService } from 'services/v1/profile.service.js';
import { LoginMeSchema } from '@comparesystem/shared';

const profileService = new ProfileService(db);

const loginRoute = createRoute({
  method: 'post',
  path: '/v1/auth/login',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoginMeSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: LoginMeSchema
        },
      },
      description: 'Login successful',
    },
  },
});

export function registerAuthLoginRoute(api: any) {
  api.openapi(loginRoute, async (c: any) => {
    const query = c.req.valid('json');
    const userProfile = await profileService.loginMe(query);
    return c.json(userProfile, 200);
  });
}
