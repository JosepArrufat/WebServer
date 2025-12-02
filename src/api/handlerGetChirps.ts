import { Request, Response } from "express";
import { getAllChirps } from "../db/queries/chirps.js";

export async function handlerGetChirps(req: Request, res: Response) {
    const chirps = await getAllChirps();
    
    // Transform to include all fields with proper naming
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