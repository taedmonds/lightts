import { camelCase, kebabCase } from 'change-case';
import ora from 'ora';
import path from 'path';
import { Project } from 'ts-morph';
import { MODULES_DIR } from '../../config';
import { getFileName, getImportPath } from '../../utils';
import { ensureDirectory, fileExists, promptOverwrite } from '../../utils/project';

export const generateService = async (
    project: Project,
    props: GenerateCommandProps
): Promise<boolean> => {
    const moduleName = camelCase(props.name);
    const moduleDir = path.join(MODULES_DIR, moduleName);
    const spinner = ora(`Creating service for ${moduleName}`).start();

    const servicePath = path.join(
        moduleDir,
        getFileName(kebabCase(props.name), 'service', props.lightts.fileStyle, 'ts', true)
    );

    try {
        if (fileExists(servicePath)) {
            spinner.stop();
            if (!(await promptOverwrite(moduleName, 'service'))) {
                spinner.warn(`Skipping service generation for ${moduleName}`);
                return false;
            }
            spinner.start(`Overwriting service for ${moduleName}`);
        }

        ensureDirectory(moduleDir);

        const sourceFile = project.createSourceFile(servicePath, '', { overwrite: true });

        sourceFile.addImportDeclarations([
            {
                namedImports: ['MessageResponse'],
                moduleSpecifier: getImportPath(
                    'message',
                    '@/core/responses',
                    'response',
                    props.lightts.fileStyle
                )
            },
            {
                namedImports: ['Request', 'Response'],
                moduleSpecifier: 'express'
            }
        ]);

        sourceFile.addExportAssignment({
            expression: (writer) => {
                writer
                    .write('{')
                    .newLine()
                    .write('hello: async (req: Request, res: Response) => ')
                    .inlineBlock(() => {
                        writer
                            .write('new MessageResponse(res, ')
                            .inlineBlock(() => {
                                writer.write('message: ').quote('Hello LightTs!').write('');
                            })
                            .write(');');
                    })
                    .newLine()
                    .write('}');
            },
            isExportEquals: false
        });

        sourceFile.saveSync();

        spinner.succeed(`Service created for ${moduleName} at ${servicePath}`);
        return true;
    } catch (error) {
        spinner.fail(`Failed to create service for ${moduleName}`);
        return false;
    }
};
