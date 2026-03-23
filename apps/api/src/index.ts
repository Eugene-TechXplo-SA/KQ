import 'dotenv/config';
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import authRoutes from "./routes/auth";
import ledgerRoutes from "./routes/ledger";
import protectedRoutes from "./routes/protected";
import rewardsRoutes from "./routes/rewards";
import usersRoutes from "./routes/users";
import withdrawalsRoutes from "./routes/withdrawals";
import { errorHandler } from "./middleware/errorHandler";

const app = new Hono();

app.onError(errorHandler);

app.get("/health", (c) => c.json({ status: "ok" }));
app.route("/auth", authRoutes);
app.route("/users", usersRoutes);
app.route("/ledger", ledgerRoutes);
app.route("/rewards", rewardsRoutes);
app.route("/withdrawals", withdrawalsRoutes);
app.route("/protected", protectedRoutes);

const port = Number(process.env.API_PORT || 8787);

console.log(`🚀 API server starting on port ${port}...`);
serve({ fetch: app.fetch, port });
console.log(`✓ API server ready at http://localhost:${port}`);

export default app;
