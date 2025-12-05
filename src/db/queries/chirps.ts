import { db } from "../index.js";
import { chirps, SafeUser, users } from "../schema.js";
import { ForbiddenError } from "../../errors.js";
import { config } from "../../config.js";
import { asc, desc, eq, and } from "drizzle-orm";

export async function createChirp(body: string, user_id: string) {
  const [result] = await db
    .insert(chirps)
    .values({body, user_id})
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getAllChirps(sort="asc") {
  const orderBy = sort === "desc" ? desc(chirps.createdAt) : asc(chirps.createdAt);
  const result = await db
    .select()
    .from(chirps)
    .orderBy(orderBy);
  return result;
}

export async function getChirpsByAuthor(authorId: string, sort="asc") {
  const orderBy = sort === "desc" ? desc(chirps.createdAt) : asc(chirps.createdAt);
  const result = await db
    .select()
    .from(chirps)
    .where(eq(chirps.user_id, authorId))
    .orderBy(orderBy);
  return result;
}

export async function getChirp(id:string) {
  const result = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, id));
  return result[0]; 
}

export async function deleteChirp(id:string, userID: string){ 
  const [result] = await db
    .delete(chirps)
    .where(and(eq(chirps.user_id, userID), eq(chirps.id, id)))
    .returning();
  return result; 
}




