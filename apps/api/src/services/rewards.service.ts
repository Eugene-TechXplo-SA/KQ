import { db } from "../db/client";

export async function getRewards() {
  return db.rewards;
}
