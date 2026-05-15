import { createRoute, z } from '@hono/zod-openapi';
const registerRoute = createRoute({
    method: 'post',
    path: '/v1/auth/register',
    tags: ['Auth'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: z.object({
                        name: z.string(),
                        email: z.string().email(),
                        password: z.string(),
                    }),
                },
            },
        },
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.boolean(),
                        message: z.string(),
                    }),
                },
            },
            description: 'User registered successfully',
        },
    },
});
const loginRoute = createRoute({
    method: 'post',
    path: '/v1/auth/login',
    tags: ['Auth'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: z.object({
                        email: z.string().email(),
                        password: z.string(),
                    }),
                },
            },
        },
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.boolean(),
                        token: z.string(),
                    }),
                },
            },
            description: 'Login successful',
        },
        401: {
            description: 'Invalid credentials',
        },
    },
});
export function registerAuthRoute(api) {
    api.openapi(registerRoute, async (c) => {
        const body = await c.req.json();
        // For now, just simulated
        return c.json({ success: true, message: 'User registered' }, 201);
    });
    api.openapi(loginRoute, async (c) => {
        const body = await c.req.json();
        // For now, just simulated
        if (body.email === 'admin@example.com' && body.password === 'password') {
            return c.json({ success: true, token: 'fake-jwt-token' }, 200);
        }
        return c.json({ success: false, message: 'Invalid credentials' }, 401);
    });
}
