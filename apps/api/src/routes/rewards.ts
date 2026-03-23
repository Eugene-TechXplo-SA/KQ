import { Hono } from "hono";
import { getRewards } from "../services/rewards.service";

const app = new Hono();

app.get("/", async (c) => {
  const rewards = await getRewards();
  return c.json({ rewards });
});

export default app;
