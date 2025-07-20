import { HttpError } from '.';

export class ConflictError extends HttpError {
    constructor(message: string = 'conflict', details?: any) {
        super(409, message, details);
    }
}
