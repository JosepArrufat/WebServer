// Base HTTP Error class
export class HttpError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
// 400 Bad Request
export class BadRequestError extends HttpError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}
// 401 Unauthorized
export class UnauthorizedError extends HttpError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}
// 403 Forbidden
export class ForbiddenError extends HttpError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}
// 404 Not Found
export class NotFoundError extends HttpError {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}
