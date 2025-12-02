import { Request, Response } from "express";
import { config } from "../config.js";
import { deleteUsers } from "../db/queries/users.js";

export async function handlerReset(req: Request, res: Response){
    config.api.fileserverHits = 0;
    await deleteUsers();
    res.status(200);
    res.set({
        "Content-Type":"text/plain; charset=utf-8",
    });
    res.send("Database has been reset");
}