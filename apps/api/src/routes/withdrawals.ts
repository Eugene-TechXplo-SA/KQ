import { Hono } from "hono";
import { z } from "zod";
import {
  requireAdminRoles,
  requireUserWriteAccess,
  verifyAuth,
} from "../middleware/auth";
import { approveWithdrawal } from "../services/admin.service";
import {
  createWithdrawalRequest,
  getWithdrawals,
} from "../services/withdrawal.service";
import type { ApiEnv } from "../types/hono";

const createWithdrawalSchema = z.object({
  amount: z.coerce.number().positive(),
  assetCode: z.string().min(1),
});

const app = new Hono<ApiEnv>();

app.get("/", verifyAuth, async (c) => {
  const auth = c.get("auth");
  const withdrawals = await getWithdrawals(auth);
  return c.json({ withdrawals });
});

app.post("/request", verifyAuth, requireUserWriteAccess(), async (c) => {
  const auth = c.get("auth");
  const body = createWithdrawalSchema.parse(await c.req.json());

  // KYC gate: non-approved users must never create withdrawal requests.
  const created = await createWithdrawalRequest(auth, {
    amount: body.amount,
    assetCode: body.assetCode,
  });

  return c.json({ withdrawal: created }, 201);
});

app.post(
  "/:withdrawalId/approve",
  verifyAuth,
  requireAdminRoles(["FULL", "APPROVER"]),
  async (c) => {
    const auth = c.get("auth");
    const { withdrawalId } = c.req.param();
    const result = await approveWithdrawal(auth, withdrawalId);
    return c.json({ withdrawal: result });
  },
);

export default app;
