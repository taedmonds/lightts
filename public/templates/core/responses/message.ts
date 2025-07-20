import { Response } from 'express';
import { HttpResponse } from '.';

export class MessageResponse extends HttpResponse {
    constructor(
        res: Response,
        {
            message = 'success',
            statusCode = 200,
            meta
        }: {
            message?: string;
            statusCode?: number;
            meta?: any;
        }
    ) {
        super(res, { statusCode, message, data: null, meta });
    }
}
