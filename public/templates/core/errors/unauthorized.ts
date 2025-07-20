import { HttpError } from '.';

export class UnauthorizedError extends HttpError {
    constructor(message: string = 'unauthorized', details?: any) {
        super(401, message, details);
    }
}
