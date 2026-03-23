import { Hono } from "hono";
import { z } from "zod";
import { requireAdminRoles, verifyAuth } from "../middleware/auth";
import {
  banUser,
  confirmAccountWithdrawal,
  overrideKyc,
  searchUsers,
  unbanUser,
} from "../services/admin.service";
import type { KycStatus, UserStatus } from "../types/auth";
import type { ApiEnv } from "../types/hono";

const searchQuerySchema = z.object({
  q: z.string().optional(),
  status: z
    .enum(["ACTIVE", "BANNED", "WITHDRAW_REQUESTED", "DEACTIVATED"])
    .optional(),
  kyc_status: z
    .enum(["NONE", "NOT_SUBMITTED", "PENDING", "APPROVED", "REJECTED"])
    .optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
});

const banSchema = z.object({
  reason: z.string().min(1, "BAN reason is required"),
});

const kycOverrideSchema = z.object({
  kycStatus: z.enum([
    "NONE",
    "NOT_SUBMITTED",
    "PENDING",
    "APPROVED",
    "REJECTED",
  ]),
  reason: z.string().optional(),
});

const app = new Hono<ApiEnv>();

app.get(
  "/search",
  verifyAuth,
  requireAdminRoles(["FULL", "VIEWER", "OPERATOR"]),
  async (c) => {
    const parsedQuery = searchQuerySchema.parse(c.req.query());

    const users = await searchUsers({
      q: parsedQuery.q,
      status: parsedQuery.status as UserStatus | undefined,
      kycStatus: parsedQuery.kyc_status as KycStatus | undefined,
      limit: parsedQuery.limit,
      offset: parsedQuery.offset,
    });

    return c.json({ users });
  },
);

app.post(
  "/:userId/ban",
  verifyAuth,
  requireAdminRoles(["FULL", "OPERATOR"]),
  async (c) => {
    const auth = c.get("auth");
    const { userId } = c.req.param();
    const body = banSchema.parse(await c.req.json());

    const result = await banUser(auth, userId, body.reason);
    return c.json({ user: result });
  },
);

app.post(
  "/:userId/unban",
  verifyAuth,
  requireAdminRoles(["FULL", "OPERATOR"]),
  async (c) => {
    const auth = c.get("auth");
    const { userId } = c.req.param();
    const result = await unbanUser(auth, userId);
    return c.json({ user: result });
  },
);

app.post(
  "/:userId/confirm-withdrawal",
  verifyAuth,
  requireAdminRoles(["FULL", "OPERATOR"]),
  async (c) => {
    const auth = c.get("auth");
    const { userId } = c.req.param();
    const result = await confirmAccountWithdrawal(auth, userId);
    return c.json({ user: result });
  },
);

app.post(
  "/:userId/kyc-override",
  verifyAuth,
  requireAdminRoles(["FULL", "APPROVER"]),
  async (c) => {
    const auth = c.get("auth");
    const { userId } = c.req.param();
    const body = kycOverrideSchema.parse(await c.req.json());

    const result = await overrideKyc(auth, userId, body.kycStatus, body.reason);
    return c.json({ user: result });
  },
);

export default app;
