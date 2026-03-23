import type { Context, Next } from "hono";

const seen = new Set<string>();

export const idempotency = async (c: Context, next: Next) => {
  const key = c.req.header("Idempotency-Key");

  if (!key) {
    await next();
    return;
  }

  if (seen.has(key)) {
    return c.json({ error: "Duplicate request" }, 409);
  }

  seen.add(key);
  await next();
};
