import 'dotenv/config';
import { serve } from '@hono/node-server';
import { app } from './index.js';
const port = process.env.PORT ? parseInt(process.env.PORT) : 5001;
serve({
    fetch: app.fetch,
    port,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
export { app };
