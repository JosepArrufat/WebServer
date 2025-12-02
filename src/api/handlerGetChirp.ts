import { Request, Response } from "express";
import { getAllChirps, getChirp } from "../db/queries/chirps.js";
import { NotFoundError } from "../errors.js";

export async function handlerGetChirp(req: Request, res: Response) {
    const {chirpID} = req.params;
    const chirp = await getChirp(chirpID);
    if(!chirp) throw new NotFoundError();
    res.status(200).json({
        id: chirp.id,
        createdAt: chirp.createdAt,
        updatedAt: chirp.updatedAt,
        body: chirp.body,
        userId: chirp.user_id
    });
}