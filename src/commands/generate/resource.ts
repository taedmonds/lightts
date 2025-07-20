import { camelCase } from 'change-case';
import ora from 'ora';
import path from 'path';
import { Project } from 'ts-morph';
import { MODULES_DIR } from '../../config';
import { ensureDirectory, moduleExists } from '../../utils/project';
import { generateController } from './controller';
import { generateSchema } from './schema';
import { generateService } from './service';

export const generateResource = async (project: Project, props: GenerateCommandProps) => {
    const moduleName = camelCase(props.name);
    const moduleDir = path.join(MODULES_DIR, moduleName);
    const spinner = ora(`Generating resources for ${moduleName}`).start();

    try {
        if (moduleExists(moduleName)) {
            spinner.text = `Module ${moduleName} already exists. Checking for missing components...`;
        }

        ensureDirectory(moduleDir);

        let resourceGenerated = false;
        resourceGenerated = await generateController(project, props);
        resourceGenerated = await generateService(project, props);
        if (props.lightts.features.includes('validation'))
            resourceGenerated = await generateSchema(project, props);

        if (resourceGenerated) {
            spinner.succeed(`Resources generated for ${moduleName}`);
        } else {
            spinner.warn(`No new resources were generated for ${moduleName}`);
        }
    } catch (error) {
        spinner.fail(`Failed to generate resources for ${moduleName}`);
        throw error;
    }
};
