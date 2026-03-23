import { db } from "../db/client";

export async function getLedgerEntries() {
  return db.ledger;
}
