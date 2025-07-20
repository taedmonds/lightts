import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { CORE_DIR } from '../../../config';
import { copyTemplateFile, getFileName } from '../../../utils';

export const addCorsTemplate = (data: AddTemplateProps) => {
    const path = join(CORE_DIR);
    if (!existsSync(path)) mkdirSync(path, { recursive: true });

    // copy cors file
    copyTemplateFile({
        filename: 'cors.ts',
        targetFolder: 'core',
        destination: join(path, getFileName('cors', 'core', data.fileStyle, 'ts'))
    });
};
