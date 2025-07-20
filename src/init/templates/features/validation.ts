import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { MIDDLEWARE_DIR } from '../../../config';
import { copyTemplateFile, getFileName } from '../../../utils';

export const addValidationTemplate = (data: AddTemplateProps) => {
    const path = join(MIDDLEWARE_DIR);
    if (!existsSync(path)) mkdirSync(path, { recursive: true });

    // copy joi validation middleware
    copyTemplateFile({
        filename: 'validator.ts',
        targetFolder: 'middleware',
        fileStyle: data.fileStyle,
        destination: join(path, getFileName('validator', 'middleware', data.fileStyle, 'ts'))
    });
};
