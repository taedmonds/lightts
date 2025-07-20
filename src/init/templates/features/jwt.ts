import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { MIDDLEWARE_DIR } from '../../../config';
import { copyTemplateFile, getFileName } from '../../../utils';

export const addJWTTemplate = (data: AddTemplateProps) => {
    const path = join(MIDDLEWARE_DIR);
    if (!existsSync(path)) mkdirSync(path, { recursive: true });

    // copy auth middleware
    copyTemplateFile({
        filename: 'auth.ts',
        targetFolder: 'middleware',
        destination: join(path, getFileName('auth', 'middleware', data.fileStyle, 'ts'))
    });
};
