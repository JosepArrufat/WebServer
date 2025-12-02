import { db } from "../index.js";
import { users } from "../schema.js";
import { ForbiddenError } from "../../errors.js";
import { config } from "../../config.js";
export async function createUser(user) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function deleteUsers() {
    if (config.api.platform !== "dev") {
        throw new ForbiddenError("This operation is only allowed in development environment");
    }
    const result = await db
        .delete(users);
    return result;
}
