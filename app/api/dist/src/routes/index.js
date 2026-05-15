import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { api } from './api/index.js';
import { logger } from 'hono/logger';
export const routes = new OpenAPIHono();
// Global Middlewares
routes.use('*', logger());
// Check health
routes.get('/health', (c) => c.json({ status: 'ok', time: new Date() }));
routes.doc('/api/doc', {
    openapi: '3.0.0',
    info: {
        title: 'CompareSystem API',
        version: '1.0.0',
        description: 'CompareSystem API',
    },
});
routes.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
});
routes.get('/api/swagger', swaggerUI({ url: '/api/doc' }));
routes.route('/api', api);
