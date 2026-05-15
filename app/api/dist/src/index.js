import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';
import { requestId } from 'hono/request-id';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { handleError } from './libs/errors/utils.js';
import { routes } from './routes/index.js';
import { cors } from 'hono/cors';
const app = new Hono();
// Middleware
app.use('*', requestId());
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors());
app.onError(handleError);
app.get('/ping', (c) => {
    return c.json({ ping: 'pong', requestId: c.get('requestId') }, 200);
});
app.route('/', routes);
const isDev = process.env.NODE_ENV === 'comaresystem';
if (isDev) {
    showRoutes(app, { verbose: true, colorize: true });
}
export { app };
