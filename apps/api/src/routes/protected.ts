import { Hono } from "hono";
import { verifyAuth } from "../middleware/auth";
import type { ApiEnv } from "../types/hono";

const app = new Hono<ApiEnv>();

app.get("/", verifyAuth, (c) => {
  const auth = c.get("auth");
  return c.json({
    message: "This is protected data",
    auth,
  });
});

export default app;
