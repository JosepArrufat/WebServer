import { db } from "../index.js";
import { chirps, NewUser, users } from "../schema.js";
import { ForbiddenError } from "../../errors.js";
import { config } from "../../config.js";
import { asc, eq } from "drizzle-orm";

export async function createChirp(body: string, user_id: string) {
  const [result] = await db
    .insert(chirps)
    .values({body, user_id})
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getAllChirps() {
  const result = await db
    .select()
    .from(chirps)
    .orderBy(asc(chirps.createdAt));
  return result;
}

export async function getChirp(id:string) {
  const result = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, id));
  return result[0]; // Return first result or undefined
}


