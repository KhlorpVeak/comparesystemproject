import { createRoute, z } from '@hono/zod-openapi';
import { db } from '@comparesystem/db';
import { AdminProfileSchema } from '@comparesystem/shared';
import { UserService } from '../../../../services/v1/user.service.js';

const userService = new UserService(db);

// route definition
const getMeRoute = createRoute({
  method: 'get',
  path: '/v1/me',
  tags: ['Profile'],
  security: [
    {
      Bearer: [],
    },
  ],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: AdminProfileSchema,
        },
      },
      description: 'Get current user profile successfully',
    },
  },
});

// function return
export function registerGetMeRoute(api: any) {
  return api.openapi(getMeRoute, async (c: any) => {
    const user = c.get('users');
    const userId = user.id;
    const userProfile = await userService.getMe(userId);
    return c.json(userProfile, 200);
  });
}
