import { camelCase, kebabCase } from 'change-case';
import ora from 'ora';
import path from 'path';
import { Project, SourceFile, SyntaxKind, VariableDeclarationKind } from 'ts-morph';
import { MODULES_DIR, ROOT_DIR } from '../../config';
import { getFileName, getImportPath } from '../../utils';
import { ensureDirectory, fileExists, promptOverwrite } from '../../utils/project';

const updateRouter = (project: Project, fileStyle: FileStyle, moduleName: string) => {
    const spinner = ora(`Updating router for ${moduleName}`).start();
    const routerPath = path.join(ROOT_DIR, 'router.ts');
    let routerFile: SourceFile;

    try {
        if (fileExists(routerPath)) {
            routerFile = project.addSourceFileAtPath(routerPath);
        } else {
            routerFile = project.createSourceFile(routerPath);
            routerFile.addImportDeclaration({
                defaultImport: 'express',
                moduleSpecifier: 'express'
            });
            routerFile.addVariableStatement({
                declarationKind: VariableDeclarationKind.Const,
                declarations: [{ name: 'router', initializer: 'express.Router()' }]
            });
            routerFile.addExportAssignment({
                expression: 'router',
                isExportEquals: false
            });
        }

        const moduleKebab = kebabCase(moduleName);
        const moduleController = getImportPath(moduleKebab, './', 'controller', fileStyle, true);
        const importName = `${moduleName}Controller`;
        const importPath = `@/modules/${moduleKebab}/${moduleController}`;

        const existingImport = routerFile.getImportDeclaration(
            (imp) => imp.getModuleSpecifierValue() === importPath
        );

        if (!existingImport) {
            routerFile.addImportDeclaration({
                defaultImport: importName,
                moduleSpecifier: importPath
            });
        }

        const hasUseCall = routerFile.getStatements().some((stmt) => {
            if (stmt.isKind(SyntaxKind.ExpressionStatement)) {
                const expr = stmt.getExpression();
                if (expr.isKind(SyntaxKind.CallExpression)) {
                    const call = expr.asKind(SyntaxKind.CallExpression);
                    if (
                        call?.getExpression().getText() === 'router.use' &&
                        call.getArguments()[0].getText() === `'/${moduleKebab}'`
                    ) {
                        return true;
                    }
                }
            }
            return false;
        });

        if (!hasUseCall) {
            // Find the export assignment to insert before it
            const exportAssignment = routerFile.getExportAssignment(
                (ea) => ea.getExpression().getText() === 'router'
            );

            const routerStatement = `router.use('/${moduleKebab}', ${importName});`;
            if (exportAssignment) {
                routerFile.insertStatements(exportAssignment.getChildIndex(), routerStatement);
            } else {
                routerFile.addStatements(routerStatement);
            }
        }

        routerFile.saveSync();
        spinner.succeed(`Router updated for ${moduleName}`);
    } catch (error) {
        spinner.fail(`Failed to update router for ${moduleName}`);
        throw error;
    }
};

export const generateController = async (
    project: Project,
    props: GenerateCommandProps
): Promise<boolean> => {
    const moduleName = camelCase(props.name);
    const moduleDir = path.join(MODULES_DIR, moduleName);
    const spinner = ora(`Creating controller for ${moduleName}`).start();

    const controllerPath = path.join(
        moduleDir,
        getFileName(kebabCase(props.name), 'controller', props.lightts.fileStyle, 'ts', true)
    );
    const servicePath = path.join(
        moduleDir,
        getFileName(kebabCase(props.name), 'service', props.lightts.fileStyle, 'ts', true)
    );

    try {
        const hasService = fileExists(servicePath);

        if (fileExists(controllerPath)) {
            spinner.stop();
            if (!(await promptOverwrite(moduleName, 'controller'))) {
                spinner.warn(`Skipping controller generation for ${moduleName}`);
                return false;
            }
            spinner.start(`Overwriting controller for ${moduleName}`);
        }

        // make sure the module dir is there
        ensureDirectory(moduleDir);

        // create controller file
        const sourceFile = project.createSourceFile(controllerPath, '', { overwrite: true });

        sourceFile.addImportDeclaration({
            defaultImport: 'express',
            moduleSpecifier: 'express'
        });

        const serviceImportPath = getImportPath(
            kebabCase(props.name),
            './',
            'service',
            props.lightts.fileStyle,
            true
        );
        if (hasService) {
            sourceFile.addImportDeclaration({
                defaultImport: 'services',
                moduleSpecifier: serviceImportPath
            });
        } else {
            sourceFile.addStatements(`// import services from '${serviceImportPath}';`);
        }

        sourceFile.addStatements((writer) => writer.newLine());
        sourceFile.addVariableStatement({
            declarationKind: VariableDeclarationKind.Const,
            declarations: [{ name: 'router', initializer: 'express.Router()' }]
        });

        sourceFile.addStatements((writer) => {
            writer
                .newLine()
                .conditionalWrite(!hasService, '// ')
                .write('router.get(')
                .quote('/')
                .write(', services.hello);')
                .newLine();
        });

        sourceFile.addExportAssignment({
            expression: 'router',
            isExportEquals: false
        });

        // update router file with new module
        updateRouter(project, props.lightts.fileStyle, moduleName);
        if (!hasService) {
            spinner.warn(
                `Controller created for ${moduleName} at ${controllerPath}, but service file is missing. Uncomment service import and route when service is created.`
            );
        } else {
            spinner.succeed(`Controller created for ${moduleName} at ${controllerPath}`);
        }
        return true;
    } catch (error) {
        spinner.fail(`Failed to create controller for ${moduleName}`);
        return false;
    }
};
