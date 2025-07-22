import { camelCase, kebabCase } from 'change-case';
import ora from 'ora';
import path from 'path';
import { Project } from 'ts-morph';
import { MODULES_DIR } from '../../config';
import { getFileName } from '../../utils';
import { ensureDirectory, fileExists, promptOverwrite } from '../../utils/project';

export const generateSchema = async (
    project: Project,
    props: GenerateCommandProps
): Promise<boolean> => {
    const moduleName = camelCase(props.name);
    const moduleDir = path.join(MODULES_DIR, moduleName);
    const spinner = ora(`Creating schema for ${moduleName}`).start();

    const schemaPath = path.join(
        moduleDir,
        getFileName(kebabCase(props.name), 'schema', props.lightts.fileStyle, 'ts', true)
    );

    try {
        if (fileExists(schemaPath)) {
            spinner.stop();
            if (!(await promptOverwrite(moduleName, 'schema'))) {
                spinner.warn(`Skipping schema generation for ${moduleName}`);
                return false;
            }
            spinner.start(`Overwriting schema for ${moduleName}`);
        }

        ensureDirectory(moduleDir);

        const sourceFile = project.createSourceFile(schemaPath, '', { overwrite: true });

        sourceFile.addImportDeclaration({
            defaultImport: 'Joi',
            moduleSpecifier: 'joi'
        });

        sourceFile.addExportAssignment({
            expression: (writer) => {
                writer
                    .write('{')
                    .newLine()
                    .write('get: Joi.object().keys(')
                    .inlineBlock(() => {
                        writer.write('id: Joi.number().required()');
                    })
                    .write(')')
                    .newLine()
                    .write('}');
            },
            isExportEquals: false
        });

        sourceFile.saveSync();

        spinner.succeed(`Schema created for ${moduleName} at ${schemaPath}`);
        return true;
    } catch (error) {
        spinner.fail(`Failed to create schema for ${moduleName}`);
        return false;
    }
};
