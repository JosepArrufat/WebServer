import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "../errors.js";
import { hashPassword } from "../auth.js";
export async function handlerUsers(req, res) {
    const params = req.body;
    if (!params || !params.email || !params.password) {
        throw new BadRequestError("Email and password are required");
    }
    const hashedPassword = await hashPassword(params.password);
    const newUser = await createUser({ email: params.email, hashedPassword });
    res.status(201).json({
        "id": newUser.id,
        "createdAt": newUser.createdAt,
        "updatedAt": newUser.updatedAt,
        "email": newUser.email,
        "isChirpyRed": newUser.isChirpyRed,
    });
}
