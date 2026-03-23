export type PrincipalType = "USER" | "ADMIN";

export type UserStatus =
  | "ACTIVE"
  | "BANNED"
  | "WITHDRAW_REQUESTED"
  | "DEACTIVATED";

export type AdminStatus = "ACTIVE" | "DISABLED";

export type AdminRole = "FULL" | "VIEWER" | "OPERATOR" | "APPROVER";

export type EffectiveRole = AdminRole;

export type KycStatus =
  | "NONE"
  | "NOT_SUBMITTED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface AuthTokenClaims {
  sub: string;
  principal_type: PrincipalType;
  role: EffectiveRole;
  status: UserStatus | AdminStatus;
  token_type: "access" | "refresh";
  token_version: number;
}

export interface PrincipalContext {
  id: string;
  principalType: PrincipalType;
  role: EffectiveRole;
  status: UserStatus | AdminStatus;
  tokenVersion: number;
  kycStatus?: KycStatus;
}
