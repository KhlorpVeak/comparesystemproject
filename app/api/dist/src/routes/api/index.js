import { OpenAPIHono } from "@hono/zod-openapi";
import { user_v1 } from "./web/v1/index.js";
import { authMiddleware } from "../../middlewares/auth.js";
export const api = new OpenAPIHono();
api.use("/web/*", authMiddleware);
api.route("/web/", user_v1);
