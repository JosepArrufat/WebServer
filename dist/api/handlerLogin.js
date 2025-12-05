import { findUser, findSafeUser } from "../db/queries/users.js";
import { BadRequestError, UnauthorizedError } from "../errors.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../auth.js";
import { config } from "../config.js";
import { createRefreshToken } from "../db/queries/refresh_token.js";
export async function handlerLogin(req, res, expireInSeconds = 3600) {
    const { password, email } = req.body;
    const user = await findUser(email);
    if (!user) {
        throw new UnauthorizedError("Incorrect email or password");
    }
    if (!user.hashedPassword) {
        throw new UnauthorizedError("Account not properly configured");
    }
    const isValidPassword = await checkPasswordHash(password, user.hashedPassword);
    if (!isValidPassword) {
        throw new UnauthorizedError("Incorrect email or password");
    }
    const safeUser = await findSafeUser(email);
    if (!safeUser) {
        throw new UnauthorizedError("User not found");
    }
    const token = makeJWT(safeUser.id, expireInSeconds, config.secret);
    const rToken = makeRefreshToken();
    const refreshToken = await createRefreshToken(rToken, safeUser.id);
    if (!refreshToken)
        throw new BadRequestError("Could not generate refresh token");
    return res.status(200).send({ ...safeUser, token, refreshToken: refreshToken.token });
}
