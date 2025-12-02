import { config } from "../config.js";
import { Request, Response, NextFunction } from "express";

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export const middlewareMetrocsInc:Middleware = (req, res, next) => {
    config.api.fileserverHits += 1;
    next();
}