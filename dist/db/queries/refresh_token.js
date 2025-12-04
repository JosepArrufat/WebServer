import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { refresh_tokens, users } from "../schema.js";
export async function createRefreshToken(token, user_id) {
    const expires_at = new Date(Date.now() + (60 * 24 * 60 * 60 * 1000));
    const [result] = await db
        .insert(refresh_tokens)
        .values({
        token,
        user_id,
        expires_at
    })
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function findRefreshToken(rToken) {
    const [result] = await db
        .select()
        .from(refresh_tokens)
        .innerJoin(users, eq(refresh_tokens.user_id, users.id))
        .where(eq(refresh_tokens.token, rToken));
    return result;
}
export async function revokeToken(rToken) {
    const [result] = await db
        .update(refresh_tokens)
        .set({ revoked_at: new Date() })
        .where(eq(refresh_tokens.token, rToken))
        .returning();
    return result;
}
