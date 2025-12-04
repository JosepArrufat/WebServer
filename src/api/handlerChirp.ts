import { Request, Response } from "express";
import { BadRequestError } from "../errors.js";
import { createChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerChirp(req: Request, res: Response){
    type parameters = {
        body: string
    };
    const params: parameters = req.body;
    const token = getBearerToken(req);
    const userID = validateJWT(token, config.secret);
    if(!params || !params.body){
        throw new BadRequestError("Missing required fields: body and userId");
    } else if(params.body.length > 140){
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    else{
        let cleanedBody = params.body
            .replace(/kerfuffle/gi, "****")
            .replace(/sharbert/gi, "****")
            .replace(/fornax/gi, "****");
        
        const chirp = await createChirp(cleanedBody, userID);
        if(!chirp) throw new BadRequestError()
        res.status(201);
        res.json({
            id: chirp.id,
            createdAt: chirp.createdAt,
            updatedAt: chirp.updatedAt,
            body: chirp.body,
            userId: chirp.user_id
        })
    }
}