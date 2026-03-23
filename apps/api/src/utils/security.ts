import { createHash, randomBytes, randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EVM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(normalizeEmail(email));
}

export function isStrongPassword(password: string): boolean {
  if (password.length < 8) {
    return false;
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  return hasUpper && hasLower && hasNumber && hasSpecial;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createOpaqueToken(): string {
  return randomBytes(48).toString("hex");
}

export function hashOpaqueToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createTokenId(): string {
  return randomUUID();
}

export function isValidWalletAddress(address: string): boolean {
  return EVM_ADDRESS_REGEX.test(address.trim());
}

export function normalizeNetwork(network: string): string {
  return network.trim().toUpperCase();
}

export function isSupportedNetwork(network: string): boolean {
  return normalizeNetwork(network) === "POLYGON";
}
