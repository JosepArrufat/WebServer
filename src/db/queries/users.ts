import { db } from "../index.js";
import { SafeUser, User, users } from "../schema.js";
import { eq } from "drizzle-orm";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../../errors.js";
import { config } from "../../config.js";
import { checkPasswordHash } from "../../auth.js";

export async function createUser(user: { email: string; hashedPassword: string }): Promise<SafeUser> {
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
export async function findUser(email: string): Promise<User | null> {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  if(!result) throw new NotFoundError();
  return result;
};

export async function findSafeUser(email: string): Promise<SafeUser | null> {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  if (!result) return null;
  const { hashedPassword: _, is_chirpy_red, ...safeUser } = result;
  return { ...safeUser, isChirpyRed: is_chirpy_red ?? false };
};

export async function updateUser(email: string, hashedPassword: string, userID: string): Promise<SafeUser> {
  const [result] = await db
    .update(users)
    .set({hashedPassword, email})
    .where(eq(users.id, userID))
    .returning();
  const { hashedPassword: _, is_chirpy_red, ...safeUser } = result;
  return { ...safeUser, isChirpyRed: is_chirpy_red ?? false };
}

export async function upgradeUser(id:string): Promise<SafeUser> {
  const [upgradedUser] = await db
    .update(users)
    .set({is_chirpy_red: true})
    .where(eq(users.id, id))
    .returning();
  const { hashedPassword: _, is_chirpy_red, ...safeUser } = upgradedUser;
  return { ...safeUser, isChirpyRed: is_chirpy_red ?? false };
}
