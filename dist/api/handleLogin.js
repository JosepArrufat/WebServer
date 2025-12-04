import { findUser } from "../db/queries/users.js";
import { NotFoundError, UnauthorizedError } from "../errors.js";
import { checkPasswordHash } from "../auth.js";
export async function handlerLogin(req, res) {
    const { password, email } = req.body;
    const user = await findUser(email);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    const isPasswordValid = await checkPasswordHash(password, user.hashedPassword);
    if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid credentials");
    }
    const { hashedPassword: _, ...safeUser } = user;
    res.status(200);
    res.set({
        "Content-Type": "application/json",
    });
    res.json(safeUser);
}
