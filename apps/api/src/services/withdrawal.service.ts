import type { PrincipalContext } from "../types/auth";
import { query, withTransaction } from "../db/transaction";
import { writeAuditLog } from "./audit.service";

function serviceError(message: string, status = 400): Error {
  const error = new Error(message);
  (error as Error & { status?: number }).status = status;
  return error;
}

export async function getWithdrawals(auth: PrincipalContext) {
  if (auth.principalType === "ADMIN") {
    return query(
      `
        SELECT id, user_id, amount, asset_code, status, created_at, updated_at
        FROM withdrawals
        ORDER BY created_at DESC
        LIMIT 200
      `,
    );
  }

  return query(
    `
      SELECT id, user_id, amount, asset_code, status, created_at, updated_at
      FROM withdrawals
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 200
    `,
    [auth.id],
  );
}

export async function createWithdrawalRequest(
  auth: PrincipalContext,
  input: { amount: number; assetCode: string },
) {
  if (auth.principalType !== "USER") {
    throw serviceError("Only users can request withdrawals", 403);
  }

  return withTransaction(async (client) => {
    const userResult = await client.query<{
      id: string;
      kyc_status: string;
      status: string;
    }>(
      `
        SELECT id, kyc_status, status
        FROM users
        WHERE id = $1
        FOR UPDATE
      `,
      [auth.id],
    );

    const user = userResult.rows[0];

    if (!user) {
      throw serviceError("User not found", 404);
    }

    if (user.status === "BANNED") {
      throw serviceError("BANNED users cannot request withdrawals", 403);
    }

    if (user.status === "DEACTIVATED") {
      throw serviceError("DEACTIVATED users cannot request withdrawals", 403);
    }

    // KYC gate: withdrawals are blocked until approved.
    if (user.kyc_status !== "APPROVED") {
      throw serviceError("KYC must be APPROVED to request withdrawals", 403);
    }

    const insertResult = await client.query<{
      id: string;
      user_id: string;
      amount: string;
      asset_code: string;
      status: string;
      created_at: string;
    }>(
      `
        INSERT INTO withdrawals (
          user_id,
          amount,
          asset_code,
          status,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, 'PENDING', NOW(), NOW())
        RETURNING id, user_id, amount, asset_code, status, created_at
      `,
      [auth.id, input.amount, input.assetCode],
    );

    const created = insertResult.rows[0];

    await writeAuditLog({
      client,
      action: "WITHDRAWAL_REQUESTED",
      entityType: "withdrawals",
      entityId: created.id,
      performedBy: auth.id,
      performerType: "USER",
      diffAfter: {
        status: created.status,
        amount: created.amount,
        asset_code: created.asset_code,
      },
    });

    return created;
  });
}
