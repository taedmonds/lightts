import { mkdirSync } from 'fs';
import { join } from 'path';
import { TYPES_DIR } from '../../config';
import { copyTemplateFile, getFileName } from '../../utils';

export const generateTypeFiles = (data: PromptConfig) => {
    const path = join(TYPES_DIR);
    mkdirSync(path, { recursive: true });

    // copy express
    if (data.features.includes('jwt')) {
        copyTemplateFile({
            filename: 'express.ts',
            targetFolder: 'types',
            destination: join(path, getFileName('express.d', 'type', 'regular', 'ts'))
        });
    }
};
