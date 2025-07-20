import { confirm } from '@inquirer/prompts';
import { camelCase } from 'change-case';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import { IndentationText, Project, QuoteKind } from 'ts-morph';
import { ROOT_DIR } from '../config';

export const createProject = () => {
    return new Project({
        manipulationSettings: {
            indentationText: IndentationText.FourSpaces,
            quoteKind: QuoteKind.Single
        }
    });
};

export const formatAndSaveProject = (project: Project) => {
    const files = project.getSourceFiles();
    for (const file of files) {
        file.formatText();
    }

    project.saveSync();
};

export const ensureDirectory = (dir: string) => {
    const spinner = ora(`Ensuring directory ${dir}`).start();
    try {
        if (!fileExists(dir)) fs.mkdirSync(dir, { recursive: true });
        spinner.succeed(`Directory ${dir} ensured`);
    } catch (error) {
        spinner.fail(`Failed to ensure directory ${dir}`);
        throw error;
    }
};

export const moduleExists = (moduleName: string): boolean => {
    const modulePath = path.join(`${ROOT_DIR}/modules`, camelCase(moduleName));
    try {
        fs.accessSync(modulePath);
        return true;
    } catch {
        return false;
    }
};

export const fileExists = (filePath: string): boolean => {
    try {
        fs.accessSync(filePath);
        return true;
    } catch {
        return false;
    }
};

export const promptOverwrite = async (moduleName: string, fileType: string): Promise<boolean> => {
    const spinner = ora(`Checking for existing ${fileType}`).start();
    spinner.stop();
    return await confirm({
        message: `A ${fileType} for module "${moduleName}" already exists. Overwrite?`,
        default: false
    });
};
