import { db } from "../index.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";
import { ForbiddenError, NotFoundError } from "../../errors.js";
import { config } from "../../config.js";
export async function createUser(user) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    if (!result) {
        throw new Error("User with this email already exists");
    }
    const { hashedPassword: _, is_chirpy_red, ...safeUser } = result;
    return { ...safeUser, isChirpyRed: is_chirpy_red ?? false };
}
export async function deleteUsers() {
    if (config.api.platform !== "dev") {
        throw new ForbiddenError("This operation is only allowed in development environment");
    }
    const result = await db
        .delete(users);
    return result;
}
export async function findUser(email) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
    if (!result)
        throw new NotFoundError();
    return result;
}
;
export async function findSafeUser(email) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
    if (!result)
        return null;
    const { hashedPassword: _, is_chirpy_red, ...safeUser } = result;
    return { ...safeUser, isChirpyRed: is_chirpy_red ?? false };
}
;
export async function updateUser(email, hashedPassword, userID) {
    const [result] = await db
        .update(users)
        .set({ hashedPassword, email })
        .where(eq(users.id, userID))
        .returning();
    const { hashedPassword: _, is_chirpy_red, ...safeUser } = result;
    return { ...safeUser, isChirpyRed: is_chirpy_red ?? false };
}
export async function upgradeUser(id) {
    const [upgradedUser] = await db
        .update(users)
        .set({ is_chirpy_red: true })
        .where(eq(users.id, id))
        .returning();
    const { hashedPassword: _, is_chirpy_red, ...safeUser } = upgradedUser;
    return { ...safeUser, isChirpyRed: is_chirpy_red ?? false };
}
