import { mkdirSync } from 'fs';
import { join } from 'path';
import { MIDDLEWARE_DIR } from '../../config';
import { addJWTTemplate } from './features/jwt';
import { addValidationTemplate } from './features/validation';

export const generateMiddlewareFiles = (data: PromptConfig) => {
    const path = join(MIDDLEWARE_DIR);
    mkdirSync(path, { recursive: true });

    // copy auth middleware
    if (data.features.includes('jwt')) {
        addJWTTemplate(data);
    }

    // copy validator middleware
    if (data.features.includes('validation')) {
        addValidationTemplate(data);
    }
};
