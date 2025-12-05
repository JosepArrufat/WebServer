import {Response, Request} from "express";
import { upgradeUser } from "../db/queries/users.js";
import { NotFoundError, UnauthorizedError } from "../errors.js";
import { getApiKey } from "../auth.js";
import { config } from "../config.js";

export async function handlerWebhooks(req: Request, res: Response){
    type parameters = {
        event: string,
        data: {
            userId: string,
        }
    }
    const apiKey = getApiKey(req);
    console.log(`API KEY: ${apiKey}`)
    
    // Validate the API key against the expected polkaKey
    if(apiKey !== config.api.polkaKey) {
        throw new UnauthorizedError("Invalid API key");
    }
    
    const {event, data}: parameters = req.body;
    if(event != "user.upgraded") return res.status(204).end();
    const upgradedUser = await upgradeUser(data.userId)
    if(!upgradedUser) throw new NotFoundError();
    return res.status(204).send();
}