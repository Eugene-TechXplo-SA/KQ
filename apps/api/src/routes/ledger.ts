import { Hono } from "hono";
import { getLedgerEntries } from "../services/ledger.service";

const app = new Hono();

app.get("/", async (c) => {
  const entries = await getLedgerEntries();
  return c.json({ entries });
});

export default app;
