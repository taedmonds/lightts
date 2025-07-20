import { mkdirSync } from 'fs';
import { join } from 'path';
import { CORE_DIR } from '../../config';
import { copyTemplateFile, copyTemplateFolder, getFileName } from '../../utils';
import { addCorsTemplate } from './features/cors';

export const generateCoreFiles = (data: PromptConfig) => {
    const path = join(CORE_DIR);
    mkdirSync(path, { recursive: true });

    // copy index file
    copyTemplateFile({
        filename: 'logger.ts',
        targetFolder: 'core',
        destination: join(path, getFileName('logger', 'core', data.fileStyle, 'ts'))
    });

    // copy errors
    copyTemplateFolder({
        folder: 'errors',
        targetFolder: 'core',
        fileStyle: data.fileStyle,
        destination: join(path, 'errors'),
        searchFileStyleFolder: false,
        renameOnAngular: true
    });
    copyTemplateFile({
        filename: 'handler.ts',
        targetFolder: 'core/errors',
        fileStyle: data.fileStyle,
        destination: join(path, 'errors', getFileName('handler', 'error', data.fileStyle, 'ts'))
    });

    // copy responses
    copyTemplateFolder({
        folder: 'responses',
        targetFolder: 'core',
        fileStyle: data.fileStyle,
        destination: join(path, 'responses'),
        searchFileStyleFolder: false,
        renameOnAngular: true
    });

    // copy cors
    if (data.features.includes('cors')) {
        addCorsTemplate({ fileStyle: data.fileStyle });
    }
};
