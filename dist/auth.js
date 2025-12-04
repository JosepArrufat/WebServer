import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errors.js';
import { randomBytes } from 'crypto';
export async function hashPassword(password) {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
}
export async function checkPasswordHash(password, hash) {
    try {
        if (await argon2.verify(hash, password)) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        throw new Error("Internal Failure");
    }
}
export function makeJWT(userID, expiresIn, secret) {
    const payload = {
        iss: "chirpy",
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn,
    };
    return jwt.sign(payload, secret);
}
export function validateJWT(tokenString, secret) {
    try {
        const validate = jwt.verify(tokenString, secret);
        if (!validate)
            throw new UnauthorizedError();
        const payload = validate;
        return payload.sub || "";
    }
    catch (error) {
        if (error.name === 'TokenExpiredError' || error.message === 'jwt expired') {
            throw new UnauthorizedError("Token has expired");
        }
        throw new UnauthorizedError();
    }
}
export function getBearerToken(req) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new UnauthorizedError("Authorization header missing");
    }
    const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    if (!headerValue.startsWith('Bearer ')) {
        throw new UnauthorizedError("Authorization header must start with 'Bearer '");
    }
    const token = headerValue.substring(7);
    if (!token.trim()) {
        throw new UnauthorizedError("Token missing from Authorization header");
    }
    return token;
}
export function makeRefreshToken() {
    const token = randomBytes(256);
    return token.toString("hex");
}
