import { createRoute } from '@hono/zod-openapi';
import { db } from '@comparesystem/db';
import { AdminProfileSchema } from '@comparesystem/shared';
import { UserService } from 'services/v1/user.service.js';
const userService = new UserService(db);
// route definition
const getMeRoute = createRoute({
    method: 'get',
    path: '/v1/user-local-stroage',
    tags: ['User Local Storage'],
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
export function registerGetUserLocalStorageRoute(api) {
    return api.openapi(getMeRoute, async (c) => {
        const user = c.get('users');
        const userId = user.id;
        const data = await userService.getMeLocalStorage(userId);
        return c.json(data, 200);
    });
}
