import { findRefreshToken } from "../db/queries/refresh_token.js";
import { getBearerToken, makeJWT } from "../auth.js";
import { Request, Response } from "express";
import {config} from "../config.js";
import { UnauthorizedError } from "../errors.js";

export async function handlerRefresh(req: Request, res: Response){
    const token = getBearerToken(req);
    const query = await findRefreshToken(token);
    if(!query || !query.refresh_tokens 
        || query.refresh_tokens.revoked_at
        || query.refresh_tokens.expires_at < new Date()){
        throw new UnauthorizedError("Invalid or expired refresh token");
    }
    const jwt = makeJWT(query.users.id, 3600, config.secret)
    res.status(200).send({
        token: jwt
    })
}