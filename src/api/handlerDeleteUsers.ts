import { Request, Response } from "express";
import { ForbiddenError } from "../errors.js";
import { deleteUsers } from "../db/queries/users.js";
import { config } from "../config.js";

export async function handlerDeleteUsers(req: Request, res: Response) {
    // Security check: only allow in development environment
    if (config.api.platform !== "dev") {
        throw new ForbiddenError("This endpoint is only available in development environment");
    }

    // Delete all users
    await deleteUsers();

    res.status(200).json({
        message: "All users have been deleted"
    });
}