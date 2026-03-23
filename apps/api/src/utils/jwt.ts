import { jwtVerify, SignJWT } from "jose";
import { getEnv } from "./env";
import type { AuthTokenClaims } from "../types/auth";

const JWT_SECRET = getEnv("JWT_SECRET");
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";

type SignClaims = Omit<AuthTokenClaims, "token_type">;

async function signToken(
  claims: SignClaims,
  tokenType: "access" | "refresh",
  expiresIn: string,
): Promise<string> {
  return new SignJWT({ ...claims, token_type: tokenType })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encodedSecret);
}

export async function signAccessToken(claims: SignClaims): Promise<string> {
  return signToken(claims, "access", ACCESS_TOKEN_TTL);
}

export async function signRefreshToken(claims: SignClaims): Promise<string> {
  return signToken(claims, "refresh", REFRESH_TOKEN_TTL);
}

async function verifyToken(token: string): Promise<AuthTokenClaims> {
  const { payload } = await jwtVerify(token, encodedSecret);

  if (typeof payload.sub !== "string") {
    throw new Error("Invalid subject claim");
  }

  return payload as unknown as AuthTokenClaims;
}

export async function verifyAccessToken(
  token: string,
): Promise<AuthTokenClaims> {
  const claims = await verifyToken(token);

  if (claims.token_type !== "access") {
    throw new Error("Invalid token type");
  }

  return claims;
}

export async function verifyRefreshToken(
  token: string,
): Promise<AuthTokenClaims> {
  const claims = await verifyToken(token);

  if (claims.token_type !== "refresh") {
    throw new Error("Invalid token type");
  }

  return claims;
}

export const authTokenTtl = {
  access: ACCESS_TOKEN_TTL,
  refresh: REFRESH_TOKEN_TTL,
};
