import { OpenAPIHono } from '@hono/zod-openapi';
import { registerGetMeRoute } from "./me.v1.js";
import { registerAuthLoginRoute } from "./auth/login.v1.post.js";
import { registerAuthCreateRoute } from "./auth/create.post.js";
export const user_v1 = new OpenAPIHono();
registerAuthCreateRoute(user_v1);
registerAuthLoginRoute(user_v1);
registerGetMeRoute(user_v1);
