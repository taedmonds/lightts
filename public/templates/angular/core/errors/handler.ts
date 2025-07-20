import { HttpError } from '.';
import { InternalServerError } from './server-error.error';

export class ErrorHandler {
    constructor(error: any, message?: string) {
        if (error instanceof HttpError) {
            throw new HttpError(error.statusCode, error.message, error?.details);
        } else {
            throw new InternalServerError(error, message);
        }
    }
}
