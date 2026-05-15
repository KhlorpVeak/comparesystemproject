import { createRoute } from '@hono/zod-openapi';
import { db } from '@comparesystem/db';
import { ProfileService } from 'services/v1/profile.service.js';
import { RegisterProfileSchema } from '@comparesystem/shared';

const profileService = new ProfileService(db);

const registerRoute = createRoute({
    method: 'post',
    path: '/v1/auth/register',
    tags: ['Auth'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: RegisterProfileSchema,
                },
            },
        },
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: RegisterProfileSchema
                },
            },
            description: 'User registered successfully',
        },
    },
});

export function registerAuthCreateRoute(api: any) {
    api.openapi(registerRoute, async (c: any) => {
        const query = c.req.valid('json');
        const userProfile = await profileService.register(query);
        return c.json(userProfile, 200);
    });
}
