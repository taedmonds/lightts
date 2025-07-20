import { HttpError } from '.';

export class InternalServerError extends HttpError {
    constructor(details?: any, message: string = 'internal server error') {
        super(500, message, details);
    }
}
