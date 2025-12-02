import { HttpError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from "../errors.js";
export const middlewareError = (err, req, res, next) => {
    console.error('Error caught by middleware:', err.message);
    if (err instanceof BadRequestError) {
        res.status(400).json({
            "error": err.message
        });
    }
    else if (err instanceof UnauthorizedError) {
        res.status(401).json({
            "error": err.message
        });
    }
    else if (err instanceof ForbiddenError) {
        res.status(403).json({
            "error": err.message
        });
    }
    else if (err instanceof NotFoundError) {
        res.status(404).json({
            "error": err.message
        });
    }
    else if (err instanceof HttpError) {
        res.status(err.statusCode).json({
            "error": err.message
        });
    }
    else {
        res.status(500).json({
            "error": "Something went wrong on our end"
        });
    }
};
