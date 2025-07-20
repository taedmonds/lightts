import { BadRequestError } from '@/core/error/bad-request';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const validate = (schema: Joi.ObjectSchema, content: 'body' | 'params' | 'query' = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const data = content == 'body' ? req.body : content == 'params' ? req.params : req.query;
        const valid = schema.validate(data);

        if (valid.error) {
            var error = valid.error.details[0].message.replace(/"/g, '');

            throw new BadRequestError(error);
        }

        return next();
    };
};

export default validate;
