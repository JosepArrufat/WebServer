import {Request, Response} from "express";
import { getBearerToken, validateJWT } from "../auth.js";
import { deleteChirp, getChirp } from "../db/queries/chirps.js";
import {config} from "../config.js";
import { ForbiddenError, NotFoundError } from "../errors.js";

export async function handlerDeleteChirp(req: Request, res: Response){
    const token = getBearerToken(req);
    const {chirpID} = req.params;
    const userID = validateJWT(token, config.secret);
    const chirp = await getChirp(chirpID);
    if(!chirp) throw new NotFoundError("Chirp not found");
    if(chirp.user_id != userID) throw new ForbiddenError("Cannot delete another user's chirp");
    const deleted = await deleteChirp(chirpID, userID);
    if(!deleted) throw new NotFoundError("Failed to delete chirp");
    res.status(204).end();
}