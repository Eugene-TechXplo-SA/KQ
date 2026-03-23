import { Hono } from "hono";
import { z } from "zod";
import type { ApiEnv } from "../types/hono";

const app = new Hono<ApiEnv>();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().optional(),
});

app.post("/login", async (c) => {
  const body = loginSchema.parse(await c.req.json());
  return c.json({ message: "Login endpoint - to be implemented" });
});

app.post("/signup", async (c) => {
  const body = signupSchema.parse(await c.req.json());
  return c.json({ message: "Signup endpoint - to be implemented" });
});

app.post("/logout", async (c) => {
  return c.json({ message: "Logout endpoint - to be implemented" });
});

export default app;
