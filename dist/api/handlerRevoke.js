import { getBearerToken } from "../auth.js";
import { revokeToken } from "../db/queries/refresh_token.js";
import { BadRequestError } from "../errors.js";
export async function handlerRevoke(req, res) {
    const token = getBearerToken(req);
    const revokedToken = await revokeToken(token);
    if (!revokedToken)
        throw new BadRequestError();
    res.status(204).send();
}
