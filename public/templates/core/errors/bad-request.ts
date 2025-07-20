import { HttpError } from '.';

export class BadRequestError extends HttpError {
    constructor(message: string = 'bad request', details?: any) {
        super(400, message, details);
    }
}
