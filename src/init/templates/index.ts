import { existsSync, mkdirSync } from 'fs';
import ora from 'ora';
import { ROOT_DIR } from '../../config';
import { createProject, formatAndSaveProject } from '../../utils/project';
import { generateConfigFile } from './config';
import { generateCoreFiles } from './core';
import { generateDatabaseFiles } from './database';
import { generateEnvFile } from './env';
import { generateMiddlewareFiles } from './middleware';
import { generateModuleFiles } from './modules';
import { generateIndexFile } from './root';
import { generateRoutesFile } from './routes';
import { generateTypeFiles } from './types';

export const generateTemplate = (data: PromptConfig) => {
    const project = createProject();

    const spinner = ora('Scaffolding LightTs project...').start();

    try {
        // create src folder
        if (!existsSync(ROOT_DIR)) {
            mkdirSync(ROOT_DIR);
            spinner.text = `Created root folder: ${ROOT_DIR}`;
        }

        // Step-by-step spinners
        spinner.text = 'Generating index file...';
        generateIndexFile(project, data);

        spinner.text = 'Generating config file...';
        generateConfigFile(project, data);

        spinner.text = 'Generating .env file...';
        generateEnvFile(project, data);

        spinner.text = 'Generating routes file...';
        generateRoutesFile(project, data);

        spinner.text = 'Generating middleware files...';
        generateMiddlewareFiles(data);

        spinner.text = 'Generating core files...';
        generateCoreFiles(data);

        spinner.text = 'Generating type files...';
        generateTypeFiles(data);

        spinner.text = 'Generating module files...';
        generateModuleFiles(data);

        if (data.features.includes('database')) {
            spinner.text = 'Generating database setup...';
            generateDatabaseFiles(project, data);
        }

        spinner.text = 'Formatting and saving files...';
        formatAndSaveProject(project);

        spinner.succeed('LightTs project scaffolded!');
    } catch (err) {
        spinner.fail('Failed to scaffold LightTs project.');
        console.error(err);
    }
};
