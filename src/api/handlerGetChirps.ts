import { Request, Response } from "express";
import { getAllChirps, getChirpsByAuthor } from "../db/queries/chirps.js";

export async function handlerGetChirps(req: Request, res: Response) {
    const { authorId, sort } = req.query;
    const chirps = authorId 
        ? await getChirpsByAuthor(authorId as string, sort as string)
        : await getAllChirps(sort as string);
    const formattedChirps = chirps.map(chirp => ({
        id: chirp.id,
        createdAt: chirp.createdAt,
        updatedAt: chirp.updatedAt,
        body: chirp.body,
        userId: chirp.user_id
    }));
    
    res.status(200);
    res.json(formattedChirps);
}