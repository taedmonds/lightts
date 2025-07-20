import { mkdirSync } from 'fs';
import { join } from 'path';
import { MODULES_DIR } from '../../config';
import { copyTemplateFile, getFileName } from '../../utils';

export const generateModuleFiles = (data: PromptConfig) => {
    const path = join(MODULES_DIR, 'hello');
    mkdirSync(path, { recursive: true });

    // copy controller file
    copyTemplateFile({
        filename: 'controller.ts',
        targetFolder: 'hello',
        fileStyle: data.fileStyle,
        destination: join(path, getFileName('hello', 'controller', data.fileStyle, 'ts', true))
    });

    // copy service file
    copyTemplateFile({
        filename: 'service.ts',
        targetFolder: 'hello',
        fileStyle: data.fileStyle,
        destination: join(path, getFileName('hello', 'service', data.fileStyle, 'ts', true))
    });

    // copy schema file
    if (data.features.includes('validation'))
        copyTemplateFile({
            filename: 'schema.ts',
            targetFolder: 'hello',
            fileStyle: data.fileStyle,
            destination: join(path, getFileName('hello', 'schema', data.fileStyle, 'ts', true))
        });
};
