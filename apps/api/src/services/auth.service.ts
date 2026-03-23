import { randomInt } from "node:crypto";
import type { PoolClient } from "pg";
import { withTransaction } from "../db/transaction";
import {
  createOpaqueToken,
  hashOpaqueToken,
  hashPassword,
  isStrongPassword,
  isSupportedNetwork,
  isValidEmail,
  isValidWalletAddress,
  normalizeEmail,
  normalizeNetwork,
  verifyPassword,
} from "../utils/security";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import type { AdminRole, KycStatus, PrincipalContext } from "../types/auth";
import { writeAuditLog } from "./audit.service";

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  status: "ACTIVE" | "BANNED" | "WITHDRAW_REQUESTED" | "DEACTIVATED";
  kyc_status: KycStatus;
  token_version: number;
}

interface AdminRow {
  id: string;
  email: string;
  password_hash: string;
  role: AdminRole;
  status: "ACTIVE" | "DISABLED";
  token_version: number;
}

interface RefreshTokenRow {
  id: string;
}

interface WalletConnectionRow {
  id: string;
  wallet_address: string | null;
  network: string | null;
  status: "DISCONNECTED" | "CONNECTING" | "CONNECTED" | "FAILED";
}

function validationError(message: string): Error {
  const error = new Error(message);
  (error as Error & { status?: number }).status = 422;
  return error;
}

function authError(message: string, status = 401): Error {
  const error = new Error(message);
  (error as Error & { status?: number }).status = status;
  return error;
}

async function findUserByEmail(
  client: PoolClient,
  email: string,
): Promise<UserRow | null> {
  const result = await client.query<UserRow>(
    `
      SELECT id, email, password_hash, status, kyc_status, token_version
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email],
  );

  return result.rows[0] ?? null;
}

async function findAdminByEmail(
  client: PoolClient,
  email: string,
): Promise<AdminRow | null> {
  const result = await client.query<AdminRow>(
    `
      SELECT id, email, password_hash, role, status, token_version
      FROM admin_users
      WHERE email = $1
      LIMIT 1
    `,
    [email],
  );

  return result.rows[0] ?? null;
}

async function saveRefreshToken(
  client: PoolClient,
  principal: PrincipalContext,
  refreshToken: string,
): Promise<void> {
  const hashedRefreshToken = hashOpaqueToken(refreshToken);

  await client.query<RefreshTokenRow>(
    `
      INSERT INTO refresh_tokens (
        principal_id,
        principal_type,
        token_hash,
        expires_at,
        revoked_at,
        created_at
      )
      VALUES ($1, $2, $3, NOW() + INTERVAL '7 days', NULL, NOW())
    `,
    [principal.id, principal.principalType, hashedRefreshToken],
  );
}

function createUserRole(status: UserRow["status"]): AdminRole {
  if (status === "BANNED") {
    return "VIEWER";
  }
  return "FULL";
}

async function issueTokenPair(
  client: PoolClient,
  principal: PrincipalContext,
): Promise<{ accessToken: string; refreshToken: string }> {
  const baseClaims = {
    sub: principal.id,
    principal_type: principal.principalType,
    role: principal.role,
    status: principal.status,
    token_version: principal.tokenVersion,
  } as const;

  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(baseClaims),
    signRefreshToken(baseClaims),
  ]);

  await saveRefreshToken(client, principal, refreshToken);

  return { accessToken, refreshToken };
}

async function findUserById(
  client: PoolClient,
  userId: string,
): Promise<UserRow | null> {
  const result = await client.query<UserRow>(
    `
      SELECT id, email, password_hash, status, kyc_status, token_version
      FROM users
      WHERE id = $1
      LIMIT 1
      FOR UPDATE
    `,
    [userId],
  );

  return result.rows[0] ?? null;
}

async function findAdminById(
  client: PoolClient,
  adminId: string,
): Promise<AdminRow | null> {
  const result = await client.query<AdminRow>(
    `
      SELECT id, email, password_hash, role, status, token_version
      FROM admin_users
      WHERE id = $1
      LIMIT 1
      FOR UPDATE
    `,
    [adminId],
  );

  return result.rows[0] ?? null;
}

async function findWalletConnectionByUserId(
  client: PoolClient,
  userId: string,
): Promise<WalletConnectionRow | null> {
  const result = await client.query<WalletConnectionRow>(
    `
      SELECT id, wallet_address, network, status
      FROM wallet_connections
      WHERE user_id = $1
      LIMIT 1
      FOR UPDATE
    `,
    [userId],
  );

  return result.rows[0] ?? null;
}

async function requireUserPrincipal(
  client: PoolClient,
  principal: PrincipalContext,
): Promise<UserRow> {
  if (principal.principalType !== "USER") {
    throw authError("User principal required", 403);
  }

  const user = await findUserById(client, principal.id);

  if (!user) {
    throw authError("User not found", 404);
  }

  if (user.status === "DEACTIVATED") {
    throw authError("User is deactivated", 403);
  }

  return user;
}

async function computeUserBalanceForAccountClosure(
  client: PoolClient,
  userId: string,
): Promise<number> {
  const balanceSources = [
    {
      sql: `
        SELECT COALESCE(SUM(amount), 0)::text AS balance
        FROM ledger_entries
        WHERE user_id = $1
      `,
    },
    {
      sql: `
        SELECT COALESCE(SUM(amount), 0)::text AS balance
        FROM ledger
        WHERE user_id = $1
      `,
    },
  ];

  for (const source of balanceSources) {
    try {
      const result = await client.query<{ balance: string }>(source.sql, [
        userId,
      ]);
      return Number(result.rows[0]?.balance ?? "0");
    } catch {
      // Try the next known balance source.
    }
  }

  throw authError("Unable to verify user balance", 503);
}

export async function signup(
  emailInput: string,
  password: string,
): Promise<{ id: string; email: string }> {
  const email = normalizeEmail(emailInput);

  if (!isValidEmail(email)) {
    throw validationError("Invalid email format");
  }

  if (!isStrongPassword(password)) {
    throw validationError(
      "Password must include upper/lowercase letters, numbers, symbols, and be at least 8 chars",
    );
  }

  return withTransaction(async (client) => {
    const [existingUser, existingAdmin] = await Promise.all([
      findUserByEmail(client, email),
      findAdminByEmail(client, email),
    ]);

    if (existingUser || existingAdmin) {
      throw authError("Email already exists", 409);
    }

    const passwordHash = await hashPassword(password);

    const insertResult = await client.query<
      Pick<UserRow, "id" | "email" | "status" | "kyc_status" | "token_version">
    >(
      `
        INSERT INTO users (
          email,
          password_hash,
          status,
          kyc_status,
          token_version,
          created_at,
          updated_at
        )
        VALUES ($1, $2, 'ACTIVE', 'NONE', 0, NOW(), NOW())
        RETURNING id, email, status, kyc_status, token_version
      `,
      [email, passwordHash],
    );

    const createdUser = insertResult.rows[0];

    await writeAuditLog({
      client,
      action: "AUTH_SIGNUP",
      entityType: "users",
      entityId: createdUser.id,
      performedBy: createdUser.id,
      performerType: "USER",
      diffAfter: {
        status: createdUser.status,
        kyc_status: createdUser.kyc_status,
        email: createdUser.email,
      },
    });

    return { id: createdUser.id, email: createdUser.email };
  });
}

export async function login(
  emailInput: string,
  password: string,
): Promise<{
  principal: PrincipalContext;
  accessToken: string;
  refreshToken: string;
}> {
  const email = normalizeEmail(emailInput);

  if (!isValidEmail(email)) {
    throw validationError("Invalid email format");
  }

  return withTransaction(async (client) => {
    const [admin, user] = await Promise.all([
      findAdminByEmail(client, email),
      findUserByEmail(client, email),
    ]);

    if (admin && user) {
      throw authError("Duplicated principal email detected", 409);
    }

    if (!admin && !user) {
      throw authError("Invalid credentials", 401);
    }

    if (admin) {
      const valid = await verifyPassword(password, admin.password_hash);
      if (!valid) {
        throw authError("Invalid credentials", 401);
      }

      if (admin.status === "DISABLED") {
        throw authError("Admin is disabled", 403);
      }

      const principal: PrincipalContext = {
        id: admin.id,
        principalType: "ADMIN",
        role: admin.role,
        status: admin.status,
        tokenVersion: admin.token_version,
      };

      const tokens = await issueTokenPair(client, principal);

      await writeAuditLog({
        client,
        action: "AUTH_LOGIN",
        entityType: "admin_users",
        entityId: admin.id,
        performedBy: admin.id,
        performerType: "ADMIN",
        diffAfter: { status: admin.status, role: admin.role },
      });

      return { principal, ...tokens };
    }

    const valid = await verifyPassword(password, user!.password_hash);
    if (!valid) {
      throw authError("Invalid credentials", 401);
    }

    if (user!.status === "DEACTIVATED") {
      throw authError("User is deactivated", 403);
    }

    const principal: PrincipalContext = {
      id: user!.id,
      principalType: "USER",
      role: createUserRole(user!.status),
      status: user!.status,
      tokenVersion: user!.token_version,
      kycStatus: user!.kyc_status,
    };

    const tokens = await issueTokenPair(client, principal);

    await writeAuditLog({
      client,
      action: "AUTH_LOGIN",
      entityType: "users",
      entityId: user!.id,
      performedBy: user!.id,
      performerType: "USER",
      diffAfter: { status: user!.status, kyc_status: user!.kyc_status },
    });

    return { principal, ...tokens };
  });
}

export async function logout(refreshToken: string): Promise<void> {
  const claims = await verifyRefreshToken(refreshToken);
  const hashedToken = hashOpaqueToken(refreshToken);

  await withTransaction(async (client) => {
    const tokenResult = await client.query(
      `
        UPDATE refresh_tokens
        SET revoked_at = NOW()
        WHERE token_hash = $1
          AND principal_id = $2
          AND principal_type = $3
          AND revoked_at IS NULL
          AND expires_at > NOW()
        RETURNING principal_id
      `,
      [hashedToken, claims.sub, claims.principal_type],
    );

    if (tokenResult.rowCount === 0) {
      throw authError("Refresh token is invalid or expired", 401);
    }

    await writeAuditLog({
      client,
      action: "AUTH_LOGOUT",
      entityType: claims.principal_type === "ADMIN" ? "admin_users" : "users",
      entityId: claims.sub,
      performedBy: claims.sub,
      performerType: claims.principal_type,
      metadata: { token_type: "refresh" },
    });
  });
}

export async function refreshSession(refreshToken: string): Promise<{
  principal: PrincipalContext;
  accessToken: string;
  refreshToken: string;
}> {
  const claims = await verifyRefreshToken(refreshToken);
  const hashedToken = hashOpaqueToken(refreshToken);

  return withTransaction(async (client) => {
    const tokenResult = await client.query<{
      id: string;
      principal_id: string;
      principal_type: "USER" | "ADMIN";
    }>(
      `
        SELECT id, principal_id, principal_type
        FROM refresh_tokens
        WHERE token_hash = $1
          AND revoked_at IS NULL
          AND expires_at > NOW()
        LIMIT 1
        FOR UPDATE
      `,
      [hashedToken],
    );

    const tokenRow = tokenResult.rows[0];

    if (!tokenRow) {
      throw authError("Refresh token is invalid or expired", 401);
    }

    if (
      tokenRow.principal_id !== claims.sub ||
      tokenRow.principal_type !== claims.principal_type
    ) {
      throw authError("Refresh token principal mismatch", 401);
    }

    let principal: PrincipalContext;

    if (tokenRow.principal_type === "USER") {
      const user = await findUserById(client, tokenRow.principal_id);

      if (!user) {
        throw authError("User not found", 404);
      }

      if (user.status === "DEACTIVATED") {
        throw authError("User is deactivated", 403);
      }

      if (user.token_version !== claims.token_version) {
        throw authError("Refresh token is no longer valid", 401);
      }

      principal = {
        id: user.id,
        principalType: "USER",
        role: createUserRole(user.status),
        status: user.status,
        tokenVersion: user.token_version,
        kycStatus: user.kyc_status,
      };
    } else {
      const admin = await findAdminById(client, tokenRow.principal_id);

      if (!admin) {
        throw authError("Admin not found", 404);
      }

      if (admin.status === "DISABLED") {
        throw authError("Admin is disabled", 403);
      }

      if (admin.token_version !== claims.token_version) {
        throw authError("Refresh token is no longer valid", 401);
      }

      principal = {
        id: admin.id,
        principalType: "ADMIN",
        role: admin.role,
        status: admin.status,
        tokenVersion: admin.token_version,
      };
    }

    await client.query(
      `
        UPDATE refresh_tokens
        SET revoked_at = NOW()
        WHERE id = $1
      `,
      [tokenRow.id],
    );

    const tokens = await issueTokenPair(client, principal);

    await writeAuditLog({
      client,
      action: "AUTH_REFRESH",
      entityType: principal.principalType === "ADMIN" ? "admin_users" : "users",
      entityId: principal.id,
      performedBy: principal.id,
      performerType: principal.principalType,
      metadata: { token_type: "refresh" },
    });

    return { principal, ...tokens };
  });
}

async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
): Promise<void> {
  // Integrate with actual email provider in production.
  console.info("[password-reset]", { email, resetToken });
}

export async function requestPasswordReset(emailInput: string): Promise<void> {
  const email = normalizeEmail(emailInput);

  if (!isValidEmail(email)) {
    throw validationError("Invalid email format");
  }

  const resetToken = createOpaqueToken();
  const hashedToken = hashOpaqueToken(resetToken);

  await withTransaction(async (client) => {
    const user = await findUserByEmail(client, email);

    if (!user) {
      return;
    }

    await client.query(
      `
        UPDATE password_reset_tokens
        SET used_at = NOW()
        WHERE user_id = $1
          AND used_at IS NULL
          AND expires_at > NOW()
      `,
      [user.id],
    );

    await client.query(
      `
        INSERT INTO password_reset_tokens (
          user_id,
          token_hash,
          expires_at,
          used_at,
          created_at
        )
        VALUES ($1, $2, NOW() + INTERVAL '30 minutes', NULL, NOW())
      `,
      [user.id, hashedToken],
    );

    await writeAuditLog({
      client,
      action: "PASSWORD_RESET_REQUESTED",
      entityType: "users",
      entityId: user.id,
      performedBy: user.id,
      performerType: "USER",
      metadata: { request_entropy: randomInt(100000, 999999) },
    });
  });

  await sendPasswordResetEmail(email, resetToken);
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  if (!isStrongPassword(newPassword)) {
    throw validationError(
      "Password must include upper/lowercase letters, numbers, symbols, and be at least 8 chars",
    );
  }

  const hashedToken = hashOpaqueToken(token);
  const newPasswordHash = await hashPassword(newPassword);

  await withTransaction(async (client) => {
    const tokenResult = await client.query<{
      id: string;
      user_id: string;
      used_at: string | null;
      expires_at: string;
      token_hash: string;
      user_status: UserRow["status"];
      previous_token_version: number;
    }>(
      `
        SELECT
          prt.id,
          prt.user_id,
          prt.used_at,
          prt.expires_at,
          prt.token_hash,
          u.status AS user_status,
          u.token_version AS previous_token_version
        FROM password_reset_tokens prt
        INNER JOIN users u ON u.id = prt.user_id
        WHERE prt.token_hash = $1
        FOR UPDATE
      `,
      [hashedToken],
    );

    const passwordResetToken = tokenResult.rows[0];

    if (!passwordResetToken) {
      throw validationError("Invalid password reset token");
    }

    if (passwordResetToken.used_at) {
      throw validationError("Password reset token already used");
    }

    if (new Date(passwordResetToken.expires_at).getTime() <= Date.now()) {
      throw validationError("Password reset token expired");
    }

    await client.query(
      `
        UPDATE users
        SET password_hash = $1,
            token_version = token_version + 1,
            updated_at = NOW()
        WHERE id = $2
      `,
      [newPasswordHash, passwordResetToken.user_id],
    );

    await client.query(
      `
        UPDATE password_reset_tokens
        SET used_at = NOW()
        WHERE id = $1
      `,
      [passwordResetToken.id],
    );

    await client.query(
      `
        UPDATE refresh_tokens
        SET revoked_at = NOW()
        WHERE principal_id = $1
          AND principal_type = 'USER'
          AND revoked_at IS NULL
      `,
      [passwordResetToken.user_id],
    );

    await writeAuditLog({
      client,
      action: "PASSWORD_RESET_COMPLETED",
      entityType: "users",
      entityId: passwordResetToken.user_id,
      performedBy: passwordResetToken.user_id,
      performerType: "USER",
      diffBefore: {
        token_version: passwordResetToken.previous_token_version,
        status: passwordResetToken.user_status,
      },
      diffAfter: {
        token_version: passwordResetToken.previous_token_version + 1,
        status: passwordResetToken.user_status,
      },
    });
  });
}

export async function changeEmail(
  principal: PrincipalContext,
  newEmailInput: string,
  currentPassword: string,
): Promise<{ id: string; email: string }> {
  const newEmail = normalizeEmail(newEmailInput);

  if (!isValidEmail(newEmail)) {
    throw validationError("Invalid email format");
  }

  if (!currentPassword?.trim()) {
    throw validationError("Current password is required");
  }

  return withTransaction(async (client) => {
    const user = await requireUserPrincipal(client, principal);

    const passwordOk = await verifyPassword(
      currentPassword,
      user.password_hash,
    );
    if (!passwordOk) {
      throw authError("Current password is invalid", 401);
    }

    if (user.email === newEmail) {
      return { id: user.id, email: user.email };
    }

    const [duplicateUser, duplicateAdmin] = await Promise.all([
      findUserByEmail(client, newEmail),
      findAdminByEmail(client, newEmail),
    ]);

    if ((duplicateUser && duplicateUser.id !== user.id) || duplicateAdmin) {
      throw authError("Email already exists", 409);
    }

    await client.query(
      `
        UPDATE users
        SET email = $1,
            updated_at = NOW()
        WHERE id = $2
      `,
      [newEmail, user.id],
    );

    await writeAuditLog({
      client,
      action: "USER_EMAIL_CHANGED",
      entityType: "users",
      entityId: user.id,
      performedBy: user.id,
      performerType: "USER",
      diffBefore: { email: user.email },
      diffAfter: { email: newEmail },
    });

    return { id: user.id, email: newEmail };
  });
}

export async function changePassword(
  principal: PrincipalContext,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  if (!currentPassword?.trim()) {
    throw validationError("Current password is required");
  }

  if (!isStrongPassword(newPassword)) {
    throw validationError(
      "Password must include upper/lowercase letters, numbers, symbols, and be at least 8 chars",
    );
  }

  return withTransaction(async (client) => {
    const user = await requireUserPrincipal(client, principal);

    const passwordOk = await verifyPassword(
      currentPassword,
      user.password_hash,
    );
    if (!passwordOk) {
      throw authError("Current password is invalid", 401);
    }

    const newPasswordHash = await hashPassword(newPassword);

    await client.query(
      `
        UPDATE users
        SET password_hash = $1,
            token_version = token_version + 1,
            updated_at = NOW()
        WHERE id = $2
      `,
      [newPasswordHash, user.id],
    );

    await client.query(
      `
        UPDATE refresh_tokens
        SET revoked_at = NOW()
        WHERE principal_id = $1
          AND principal_type = 'USER'
          AND revoked_at IS NULL
      `,
      [user.id],
    );

    await writeAuditLog({
      client,
      action: "USER_PASSWORD_CHANGED",
      entityType: "users",
      entityId: user.id,
      performedBy: user.id,
      performerType: "USER",
      diffBefore: { token_version: user.token_version },
      diffAfter: { token_version: user.token_version + 1 },
    });
  });
}

export async function requestAccountWithdrawal(
  principal: PrincipalContext,
): Promise<{ id: string; status: UserRow["status"] }> {
  return withTransaction(async (client) => {
    const user = await requireUserPrincipal(client, principal);

    if (user.status === "WITHDRAW_REQUESTED") {
      throw authError("Account withdrawal is already requested", 409);
    }

    const ongoingWithdrawalResult = await client.query<{ id: string }>(
      `
        SELECT id
        FROM withdrawals
        WHERE user_id = $1
          AND status IN ('PENDING', 'APPROVED', 'PROCESSING')
        LIMIT 1
      `,
      [user.id],
    );

    if (ongoingWithdrawalResult.rows[0]) {
      throw validationError(
        "Cannot request account withdrawal while withdrawals are in progress",
      );
    }

    const balance = await computeUserBalanceForAccountClosure(client, user.id);
    if (balance !== 0) {
      throw validationError(
        "Account balance must be zero for withdrawal request",
      );
    }

    await client.query(
      `
        UPDATE users
        SET status = 'WITHDRAW_REQUESTED',
            updated_at = NOW()
        WHERE id = $1
      `,
      [user.id],
    );

    await writeAuditLog({
      client,
      action: "USER_WITHDRAWAL_REQUESTED",
      entityType: "users",
      entityId: user.id,
      performedBy: user.id,
      performerType: "USER",
      diffBefore: { status: user.status },
      diffAfter: { status: "WITHDRAW_REQUESTED" },
    });

    return { id: user.id, status: "WITHDRAW_REQUESTED" };
  });
}

export async function startWalletConnection(
  principal: PrincipalContext,
): Promise<{ status: WalletConnectionRow["status"] }> {
  return withTransaction(async (client) => {
    const user = await requireUserPrincipal(client, principal);
    const existing = await findWalletConnectionByUserId(client, user.id);

    if (existing) {
      await client.query(
        `
          UPDATE wallet_connections
          SET status = 'CONNECTING',
              updated_at = NOW()
          WHERE id = $1
        `,
        [existing.id],
      );
    } else {
      await client.query(
        `
          INSERT INTO wallet_connections (
            user_id,
            wallet_address,
            network,
            status,
            created_at,
            updated_at
          )
          VALUES ($1, NULL, NULL, 'CONNECTING', NOW(), NOW())
        `,
        [user.id],
      );
    }

    await writeAuditLog({
      client,
      action: "WALLET_CONNECTING",
      entityType: "wallet_connections",
      entityId: user.id,
      performedBy: user.id,
      performerType: "USER",
      diffBefore: existing,
      diffAfter: { status: "CONNECTING" },
    });

    return { status: "CONNECTING" };
  });
}

export async function failWalletConnection(
  principal: PrincipalContext,
): Promise<{ status: WalletConnectionRow["status"] }> {
  return withTransaction(async (client) => {
    const user = await requireUserPrincipal(client, principal);
    const existing = await findWalletConnectionByUserId(client, user.id);

    if (!existing) {
      throw authError("Wallet connection not found", 404);
    }

    await client.query(
      `
        UPDATE wallet_connections
        SET status = 'FAILED',
            updated_at = NOW()
        WHERE id = $1
      `,
      [existing.id],
    );

    await writeAuditLog({
      client,
      action: "WALLET_CONNECTION_FAILED",
      entityType: "wallet_connections",
      entityId: user.id,
      performedBy: user.id,
      performerType: "USER",
      diffBefore: existing,
      diffAfter: { status: "FAILED" },
    });

    return { status: "FAILED" };
  });
}

export async function disconnectWallet(
  principal: PrincipalContext,
): Promise<{ status: WalletConnectionRow["status"] }> {
  return withTransaction(async (client) => {
    const user = await requireUserPrincipal(client, principal);
    const existing = await findWalletConnectionByUserId(client, user.id);

    if (!existing) {
      throw authError("Wallet connection not found", 404);
    }

    await client.query(
      `
        UPDATE wallet_connections
        SET status = 'DISCONNECTED',
            updated_at = NOW()
        WHERE id = $1
      `,
      [existing.id],
    );

    await writeAuditLog({
      client,
      action: "WALLET_DISCONNECTED",
      entityType: "wallet_connections",
      entityId: user.id,
      performedBy: user.id,
      performerType: "USER",
      diffBefore: existing,
      diffAfter: { status: "DISCONNECTED" },
    });

    return { status: "DISCONNECTED" };
  });
}

export async function walletConnectCallback(
  principal: PrincipalContext,
  addressInput: string,
  networkInput: string,
): Promise<{ walletAddress: string; network: string }> {
  if (!isValidWalletAddress(addressInput)) {
    throw validationError("Invalid wallet address format");
  }

  if (!isSupportedNetwork(networkInput)) {
    throw validationError("Unsupported wallet network");
  }

  const walletAddress = addressInput.trim();
  const network = normalizeNetwork(networkInput);

  return withTransaction(async (client) => {
    const user = await requireUserPrincipal(client, principal);
    const before = await findWalletConnectionByUserId(client, user.id);

    if (before) {
      await client.query(
        `
          UPDATE wallet_connections
          SET wallet_address = $1,
              network = $2,
              status = 'CONNECTED',
              connected_at = NOW(),
              updated_at = NOW()
          WHERE id = $3
        `,
        [walletAddress, network, before.id],
      );
    } else {
      await client.query(
        `
          INSERT INTO wallet_connections (
            user_id,
            wallet_address,
            network,
            status,
            connected_at,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, 'CONNECTED', NOW(), NOW(), NOW())
        `,
        [user.id, walletAddress, network],
      );
    }

    await writeAuditLog({
      client,
      action: "WALLET_CONNECTED",
      entityType: "wallet_connections",
      entityId: user.id,
      performedBy: user.id,
      performerType: "USER",
      diffBefore: before,
      diffAfter: {
        wallet_address: walletAddress,
        network,
        status: "CONNECTED",
      },
    });

    return { walletAddress, network };
  });
}
