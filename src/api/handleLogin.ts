import { Request, Response } from "express";
import { findUser } from "../db/queries/users.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors.js";
import { checkPasswordHash } from "../auth.js";
import { SafeUser } from "../db/schema.js";

export async function handlerLogin(req: Request, res: Response){
    type parameters = {
        password: string;
        email: string;
    };
    const {password, email}: parameters = req.body;
    const user = await findUser(email);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    const isPasswordValid = await checkPasswordHash(password, user.hashedPassword);
    if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid credentials");
    }
    const { hashedPassword: _, ...safeUser } = user;
    res.status(200);
    res.set({
        "Content-Type": "application/json",
    });
    res.json(safeUser);
}