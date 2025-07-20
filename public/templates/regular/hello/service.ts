import { MessageResponse } from '@/core/responses/message';
import { Request, Response } from 'express';

export default {
    hello: async (req: Request, res: Response) => {
        new MessageResponse(res, { message: 'Hello LightTs!' });
    }
};
