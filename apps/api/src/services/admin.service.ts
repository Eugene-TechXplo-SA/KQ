import { supabase } from "../db/supabase";
import { logAuditEvent } from "./audit.service";
import type { PrincipalContext, KycStatus, UserStatus } from "../types/auth";

interface SearchUsersParams {
  q?: string;
  status?: UserStatus;
  kycStatus?: KycStatus;
  limit?: number;
  offset?: number;
}

export async function searchUsers(params: SearchUsersParams) {
  let query = supabase.from("users").select("*");

  if (params.q) {
    query = query.or(
      `email.ilike.%${params.q}%,display_name.ilike.%${params.q}%,id.eq.${params.q}`
    );
  }

  if (params.status) {
    query = query.eq("status", params.status);
  }

  if (params.kycStatus) {
    query = query.eq("kyc_status", params.kycStatus);
  }

  query = query
    .order("created_at", { ascending: false })
    .range(params.offset || 0, (params.offset || 0) + (params.limit || 20) - 1);

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function banUser(
  auth: PrincipalContext,
  userId: string,
  reason: string
) {
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!user) throw new Error("User not found");

  const { data, error } = await supabase
    .from("users")
    .update({ status: "BANNED" })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  await logAuditEvent({
    adminId: auth.id,
    action: "BAN_USER",
    targetType: "USER",
    targetId: userId,
    metadata: { reason },
  });

  return data;
}

export async function unbanUser(auth: PrincipalContext, userId: string) {
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!user) throw new Error("User not found");

  const { data, error } = await supabase
    .from("users")
    .update({ status: "ACTIVE" })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  await logAuditEvent({
    adminId: auth.id,
    action: "UNBAN_USER",
    targetType: "USER",
    targetId: userId,
  });

  return data;
}

export async function confirmAccountWithdrawal(
  auth: PrincipalContext,
  userId: string
) {
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!user) throw new Error("User not found");

  if (user.status !== "WITHDRAW_REQUESTED") {
    throw new Error("User has not requested withdrawal");
  }

  const { data, error } = await supabase
    .from("users")
    .update({ status: "DEACTIVATED" })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  await logAuditEvent({
    adminId: auth.id,
    action: "CONFIRM_WITHDRAWAL",
    targetType: "USER",
    targetId: userId,
  });

  return data;
}

export async function overrideKyc(
  auth: PrincipalContext,
  userId: string,
  kycStatus: KycStatus,
  reason?: string
) {
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!user) throw new Error("User not found");

  const { data, error } = await supabase
    .from("users")
    .update({ kyc_status: kycStatus })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  await logAuditEvent({
    adminId: auth.id,
    action: "OVERRIDE_KYC",
    targetType: "USER",
    targetId: userId,
    metadata: { kycStatus, reason },
  });

  return data;
}

export async function approveWithdrawal(
  auth: PrincipalContext,
  withdrawalId: string
) {
  const { data: withdrawal, error: fetchError } = await supabase
    .from("withdrawals")
    .select("*")
    .eq("id", withdrawalId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!withdrawal) throw new Error("Withdrawal not found");

  const { data, error } = await supabase
    .from("withdrawals")
    .update({ status: "APPROVED", approved_at: new Date().toISOString() })
    .eq("id", withdrawalId)
    .select()
    .single();

  if (error) throw error;

  await logAuditEvent({
    adminId: auth.id,
    action: "APPROVE_WITHDRAWAL",
    targetType: "WITHDRAWAL",
    targetId: withdrawalId,
  });

  return data;
}
