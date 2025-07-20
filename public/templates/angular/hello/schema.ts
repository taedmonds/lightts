import Joi from 'joi';

export default {
    get: Joi.object().keys({
        id: Joi.number().required()
    })
};
