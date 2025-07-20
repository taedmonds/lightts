import { Response } from 'express';
import { HttpResponse } from '.';

export class DataResponse extends HttpResponse {
    constructor(
        res: Response,
        {
            data,
            message = 'data retrieved',
            statusCode = 200,
            meta
        }: {
            data: any;
            message?: string;
            statusCode?: number;
            meta?: any;
        }
    ) {
        super(res, { statusCode, message, data, meta });
    }
}
