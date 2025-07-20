import { HttpError } from '.';

export class ForbiddenError extends HttpError {
    constructor(message: string = 'forbidden', details?: any) {
        super(403, message, details);
    }
}
