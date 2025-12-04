import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { updateUser } from "../db/queries/users.js";
import { UnauthorizedError } from "../errors.js";
export async function handlerUpdateUsers(req, res) {
    const token = getBearerToken(req);
    const userID = validateJWT(token, config.secret);
    if (!userID)
        throw new UnauthorizedError();
    const params = req.body;
    const hashedPassword = await hashPassword(params.password);
    const updatedUser = await updateUser(params.email, hashedPassword, userID);
    if (!updatedUser)
        throw new UnauthorizedError();
    res.status(200).send(updatedUser);
}
