import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError, NotFoundError } from "../errors.js";

export async function handlerUsers(req: Request, res: Response){
    type parameters = {
        email: string;
    };
    const params: parameters = req.body;
    if(!params){
        throw new BadRequestError()
    }
    const newUser = await createUser(params);
    if(!newUser){
        throw new NotFoundError();
    }
    res.status(201);
    res.set({
        "Content-Type":"text/plain; charset=utf-8",
    });
    res.send({
        "id": newUser.id,
        "createdAt": newUser.createdAt,
        "updatedAt": newUser.updatedAt,
        "email": newUser.email,
    });
}