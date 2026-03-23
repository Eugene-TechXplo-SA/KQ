import type { PoolClient, QueryResultRow } from "pg";
import { Pool } from "pg";
import { getEnv } from "../utils/env";

const pool = new Pool({
  connectionString: getEnv("SUPABASE_DB_URL"),
  ssl:
    process.env.SUPABASE_DB_SSL === "disable"
      ? false
      : { rejectUnauthorized: false },
});

export async function withTransaction<T>(
  operation: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await operation(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function query<T extends QueryResultRow = Record<string, unknown>>(
  sql: string,
  values: unknown[] = [],
): Promise<T[]> {
  const result = await pool.query<T>(sql, values);
  return result.rows;
}
