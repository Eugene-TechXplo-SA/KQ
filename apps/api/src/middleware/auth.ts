import type { Context, MiddlewareHandler, Next } from "hono";
import type { ApiEnv } from "../types/hono";
import type { AdminRole, PrincipalContext } from "../types/auth";
import { verifyAccessToken } from "../utils/jwt";

function authError(message: string, status = 401): Error {
  const error = new Error(message);
  (error as Error & { status?: number }).status = status;
  return error;
}

export const verifyAuth: MiddlewareHandler<ApiEnv> = async (
  c: Context<ApiEnv>,
  next: Next,
) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw authError("Unauthorized", 401);
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const claims = await verifyAccessToken(token);

  const authContext: PrincipalContext = {
    id: claims.sub,
    principalType: claims.principal_type,
    role: claims.role,
    status: claims.status,
    tokenVersion: claims.token_version,
  };

  c.set("auth", authContext);
  await next();
};

export const requireUser = (): MiddlewareHandler<ApiEnv> => {
  return async (c, next) => {
    const auth = c.get("auth");

    if (auth.principalType !== "USER") {
      throw authError("User principal required", 403);
    }

    if (auth.status === "DEACTIVATED") {
      throw authError("User is deactivated", 403);
    }

    await next();
  };
};

// BANNED users are allowed to read but blocked from write operations.
export const requireUserWriteAccess = (): MiddlewareHandler<ApiEnv> => {
  return async (c, next) => {
    const auth = c.get("auth");

    if (auth.principalType !== "USER") {
      throw authError("User principal required", 403);
    }

    if (auth.status === "BANNED") {
      throw authError("BANNED users are read-only", 403);
    }

    if (auth.status === "DEACTIVATED") {
      throw authError("User is deactivated", 403);
    }

    await next();
  };
};

export const requireAdminRoles = (
  roles: AdminRole[],
): MiddlewareHandler<ApiEnv> => {
  return async (c, next) => {
    const auth = c.get("auth");

    if (auth.principalType !== "ADMIN") {
      throw authError("Admin principal required", 403);
    }

    if (auth.status === "DISABLED") {
      throw authError("Admin is disabled", 403);
    }

    if (!roles.includes(auth.role)) {
      throw authError("Admin role is not allowed", 403);
    }

    await next();
  };
};
