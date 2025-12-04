import { db } from "../index.js";
import { chirps } from "../schema.js";
import { asc, eq, and } from "drizzle-orm";
export async function createChirp(body, user_id) {
    const [result] = await db
        .insert(chirps)
        .values({ body, user_id })
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
export async function getChirp(id) {
    const result = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, id));
    return result[0];
}
export async function deleteChirp(id, userID) {
    const [result] = await db
        .delete(chirps)
        .where(and(eq(chirps.user_id, userID), eq(chirps.id, id)))
        .returning();
    return result;
}
