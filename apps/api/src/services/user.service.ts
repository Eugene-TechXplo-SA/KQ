import { db } from "../db/client";

export async function getUsers() {
  return db.users;
}
