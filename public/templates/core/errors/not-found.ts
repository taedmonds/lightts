import { HttpError } from '.';

export class NotFoundError extends HttpError {
    constructor(message: string = 'not found', details?: any) {
        super(404, message, details);
    }
}
