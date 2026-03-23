import type { PoolClient } from "pg";
import { supabase } from "../db/supabase";

export interface AuditLogInput {
  client: PoolClient;
  action: string;
  entityType: string;
  entityId: string;
  performedBy: string;
  performerType: "USER" | "ADMIN" | "SYSTEM";
  diffBefore?: unknown;
  diffAfter?: unknown;
  metadata?: unknown;
}

export async function writeAuditLog(input: AuditLogInput): Promise<void> {
  const {
    client,
    action,
    entityType,
    entityId,
    performedBy,
    performerType,
    diffBefore = null,
    diffAfter = null,
    metadata = null,
  } = input;

  await client.query(
    `
      INSERT INTO audit_logs (
        action,
        entity_type,
        entity_id,
        performed_by,
        performer_type,
        diff_before,
        diff_after,
        metadata,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::jsonb, NOW())
    `,
    [
      action,
      entityType,
      entityId,
      performedBy,
      performerType,
      JSON.stringify(diffBefore),
      JSON.stringify(diffAfter),
      JSON.stringify(metadata),
    ],
  );
}

interface AuditEventInput {
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: unknown;
}

export async function logAuditEvent(input: AuditEventInput): Promise<void> {
  const { adminId, action, targetType, targetId, metadata } = input;

  await supabase.from("audit_logs").insert({
    action,
    entity_type: targetType,
    entity_id: targetId,
    performed_by: adminId,
    performer_type: "ADMIN",
    metadata: metadata || null,
  });
}
