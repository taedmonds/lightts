import { Request, Response } from 'express';

export class HttpError extends Error {
    public readonly statusCode: number;
    public readonly details?: any;

    constructor(statusCode: number, message: string, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        // Maintain proper stack trace (for environments that support it)
        Error.captureStackTrace(this, this.constructor);
    }

    static middleware(err: Request, req: Request, res: Response) {
        const statusCode = err.statusCode || 500;

        res.status(statusCode).json({
            success: false,
            message: err.statusMessage || 'internal server error'
        });
    }
}
